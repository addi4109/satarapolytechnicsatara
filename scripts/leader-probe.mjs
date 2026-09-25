/* Measure the "Our Leadership" card geometry: is the photo centered in its box? */
const PORT = 9222;
const URL_TO_TEST = process.argv[2] || 'http://localhost:5173/about/college';

async function getJson(path) {
  const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

async function main() {
  const targets = await getJson('/json/list');
  const page = targets.find((t) => t.type === 'page');
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
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400));
    return r.result.value;
  };

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: URL_TO_TEST });
  await new Promise((r) => setTimeout(r, Number(process.argv[3]) * 1000 || 15000));

  const debug = await evaluate(`({
    url: location.href,
    title: document.title,
    rootChildren: document.getElementById('root')?.children.length ?? -1,
    sidebarCount: document.querySelectorAll('.sidebar-link').length,
    anyLeadership: !!document.querySelector('.leadership-grid'),
    bodySnippet: document.body.innerText.slice(0, 200),
  })`);
  console.log('DEBUG:', JSON.stringify(debug, null, 2));

  const report = await evaluate(`(async () => {
    // switch to the Institute tab where Our Leadership lives
    const btns = [...document.querySelectorAll('.sidebar-link')];
    const labels = btns.map((b) => b.textContent.trim());
    const inst = btns[1] ?? null; // second link = "Institute"
    if (inst) { inst.click(); }
    // wait up to 15s for the leadership grid to appear (backend may be cold)
    for (let i = 0; i < 30 && !document.querySelector('.leadership-grid'); i++) {
      await new Promise((r) => setTimeout(r, 500));
    }
    window.__labels = labels;

    const out = { found: false, labels: window.__labels ?? [] };
    const grid = document.querySelector('.leadership-grid');
    if (!grid) return out;
    out.found = true;
    out.cards = [];
    for (const card of document.querySelectorAll('.leader-card')) {
      const name = card.querySelector('.leader-card-name')?.textContent ?? '';
      const wrap = card.querySelector('.leader-card-img-wrap');
      const img = card.querySelector('.leader-card-img');
      const ph = card.querySelector('.leader-card-img-placeholder');
      const box = (img ?? ph)?.getBoundingClientRect();
      const w = wrap?.getBoundingClientRect();
      const cs = img ? getComputedStyle(img) : null;
      const wrapCs = wrap ? getComputedStyle(wrap) : null;
      const natural = img ? { nw: img.naturalWidth, nh: img.naturalHeight, loaded: img.complete } : null;
      out.cards.push({
        name,
        wrapRect: w ? { x: Math.round(w.x), width: Math.round(w.width) } : null,
        imgRect: box ? { x: Math.round(box.x), width: Math.round(box.width), height: Math.round(box.height) } : null,
        leftGap: w && box ? Math.round(box.x - w.x) : null,
        rightGap: w && box ? Math.round(w.x + w.width - (box.x + box.width)) : null,
        imgStyles: cs ? { objectFit: cs.objectFit, objectPosition: cs.objectPosition, maxWidth: cs.maxWidth, display: cs.display } : null,
        wrapStyles: wrapCs ? { justifyContent: wrapCs.justifyContent, alignItems: wrapCs.alignItems, display: wrapCs.display, padding: wrapCs.padding } : null,
        natural,
      });
    }
    return out;
  })()`);

  console.log(JSON.stringify(report, null, 2));
  ws.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE ERROR:', e.message);
  process.exit(1);
});
