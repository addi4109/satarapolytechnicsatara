/* Layout probe: loads the site, captures page console errors, and reports
   whether React rendered, using Chrome DevTools Protocol over Node's built-in
   WebSocket. Usage: node nav-probe.mjs <url> [width] */
const PORT = 9222;
const URL_TO_TEST = process.argv[2] || 'http://localhost:5173/';
const WIDTH = Number(process.argv[3] || 1280);

// --- find chrome debugging port via --remote-debugging-port=9222 -----------
async function getJson(path) {
  const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

async function main() {
  const targets = await getJson('/json/list');
  const page = targets.find((t) => t.type === 'page');
  if (!page) throw new Error('no page target');
  const wsUrl = page.webSocketDebuggerUrl;
  if (!wsUrl) throw new Error('no ws url');

  // Node >=22 ships a global WebSocket implementation (undici).
  const WebSocket = globalThis.WebSocket;
  if (!WebSocket) throw new Error('global WebSocket not available');

  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const consoleLogs = [];

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
      consoleLogs.push(`[${msg.params.type}] ${text}`);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails;
      consoleLogs.push(`[EXCEPTION] ${d.exception?.description ?? d.text}`);
    }
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  });

  await new Promise((r) => (ws.on('open', r)));

  await send('Page.enable');
  await send('Runtime.enable');

  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return r.result.value;
  };

  await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL_TO_TEST });
  await new Promise((r) => setTimeout(r, 6000));

  const state = await evaluate(`(() => ({
    rootChildren: document.getElementById('root')?.children.length ?? -1,
    rootBytes: document.getElementById('root')?.innerHTML.length ?? 0,
    hasHeader: !!document.querySelector('.site-header'),
    hasFooter: !!document.querySelector('.site-footer'),
    docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    headerH: document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0,
    headerVar: getComputedStyle(document.documentElement).getPropertyValue('--sp-header-h').trim(),
  }))()`);

  console.log(`URL: ${URL_TO_TEST} @ ${WIDTH}px`);
  console.log(JSON.stringify(state, null, 2));
  console.log('--- page console (errors/warnings) ---');
  const interesting = consoleLogs.filter((l) => !/^\[(log|info|debug)\]/.test(l));
  console.log(interesting.length ? interesting.slice(0, 20).join('\n') : '(clean)');

  ws.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE ERROR:', e.message);
  process.exit(1);
});
