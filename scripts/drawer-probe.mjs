/* Drawer open/close probe: taps the hamburger at mobile width and reports
   the drawer position. Usage: node scripts/drawer-probe.mjs [url] [width] */
const PORT = 9222;

async function getJson(path) {
  const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

async function main() {
  const url = process.argv[2] || 'http://localhost:5173/';
  const width = Number(process.argv[3] || 390);

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
  await new Promise((r) => setTimeout(r, 12000));

  // Close the enquiry popup if present, then open the drawer.
  await evaluate(`(() => {
    const closeBtn = document.querySelector('.enquiry-close');
    if (closeBtn) closeBtn.click();
    return !!closeBtn;
  })()`);
  await new Promise((r) => setTimeout(r, 600));

  await evaluate(`(() => {
    const burger = document.querySelector('.hamburger');
    if (burger) burger.click();
    return !!burger;
  })()`);
  await new Promise((r) => setTimeout(r, 800));

  const open = await evaluate(`(() => {
    const list = document.querySelector('.nav-list');
    const cs = list ? getComputedStyle(list) : null;
    const b = list ? list.getBoundingClientRect() : null;
    return {
      hasMobileOpen: list ? list.classList.contains('mobile-open') : false,
      transform: cs ? cs.transform : null,
      visibility: cs ? cs.visibility : null,
      rect: b ? { left: Math.round(b.left), right: Math.round(b.right), top: Math.round(b.top), h: Math.round(b.height) } : null,
      vw: document.documentElement.clientWidth,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      firstLinkVisible: (() => {
        const a = document.querySelector('.nav-list .nav-link');
        if (!a) return false;
        const r = a.getBoundingClientRect();
        return r.left >= 0 && r.right <= document.documentElement.clientWidth + 1;
      })(),
    };
  })()`);

  console.log(JSON.stringify(open, null, 2));
  ws.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE ERROR:', e.message);
  process.exit(1);
});
