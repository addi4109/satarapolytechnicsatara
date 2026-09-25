/* Overlap probe: measures .cell-card bounding boxes on /cells and reports
   any pairwise intersections. Usage: node scripts/cells-overlap-probe.mjs [url] */
const PORT = 9222;
const URL_TO_TEST = process.argv[2] || 'http://localhost:5173/cells';

async function getJson(path) {
  const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

async function main() {
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
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL_TO_TEST });
  await new Promise((r) => setTimeout(r, Number(process.argv[3]) * 1000 || 15000));

  const report = await evaluate(`(() => {
    const cards = [...document.querySelectorAll('.cell-card')];
    const rects = cards.map((c) => {
      const b = c.getBoundingClientRect();
      const cs = getComputedStyle(c);
      return { x: b.x, y: b.y, w: b.width, h: b.height, pos: cs.position, transform: cs.transform, height: cs.height };
    });
    const overlaps = [];
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i], b = rects[j];
        const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
        const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
        if (ix > 2 && iy > 2) overlaps.push({ i, j, ix, iy });
      }
    }
    return {
      url: location.href,
      cardCount: cards.length,
      docOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      sample: rects.slice(0, 3),
      overlaps,
      bodySnippet: document.body.innerText.slice(0, 120),
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
