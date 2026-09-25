/* Mobile overflow probe: loads a URL at mobile width, lists elements wider
   than the viewport. Usage: node scripts/mobile-overflow-probe.mjs <url> [width] [waitSec] */
const PORT = 9222;

async function getJson(path) {
  const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

async function main() {
  const url = process.argv[2] || 'http://localhost:5173/';
  const width = Number(process.argv[3] || 390);
  const waitSec = Number(process.argv[4] || 20);

  const targets = await getJson('/json/list');
  const page = targets.find((t) => t.type === 'page');
  if (!page) throw new Error('no page target');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
  ws.addEventListener('message', (ev) => {
    const raw = typeof ev.data === 'string' ? ev.data : ev.data.toString();
    const msg = JSON.parse(raw);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  });
  await new Promise((r) => (ws.onopen = r));

  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 500));
    return r.result.value;
  };

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, waitSec * 1000));

  const report = await evaluate(`(() => {
    const vw = document.documentElement.clientWidth;
    const wide = [];
    document.querySelectorAll('body *').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.width > vw + 2 || b.right > vw + 2 || b.left < -2) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed') return;
        wide.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && el.className.toString ? el.className.toString() : '').slice(0, 60),
          left: Math.round(b.left), right: Math.round(b.right), w: Math.round(b.width),
          pos: cs.position, disp: cs.display,
        });
      }
    });
    // dedupe: keep first 25
    return {
      url: location.href,
      vw,
      scrollW: document.documentElement.scrollWidth,
      overflowX: document.documentElement.scrollWidth - vw,
      wideCount: wide.length,
      wide: wide.slice(0, 25),
    };
  })()`);

  console.log(JSON.stringify(report, null, 2));
  ws.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE ERROR:', e.message);
  process.exit(1);
});
