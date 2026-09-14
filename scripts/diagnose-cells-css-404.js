// Diagnose missing CellsPage CSS chunk 404s on Vercel.
//
// Checks whether CellsPage.css exists, whether the git history shows a broken
// build (missing file while modules still import it), and whether the Vercel
// URL referenced in the console error is reachable.
//
// Usage: node scripts/diagnose-cells-css-404.js [brokenHash]
//   brokenHash — optional hash from the 404 URL (e.g. tR18qlJv) to check the
//                exact asset on the live site.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const cssPath = path.join(repoRoot, 'frontend/src/pages/CellsPage.css');
const brokenHash = process.argv[2];
const brokenFile = brokenHash
  ? `frontend/dist/assets/CellsPage-${brokenHash}.css`
  : null;

function run(cmd, args) {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', cwd: repoRoot }).trim();
  } catch {
    return null;
  }
}

console.log('=== CellsPage CSS 404 diagnostics ===\n');

// 1. File present in working tree?
console.log(
  `[1] ${path.relative(repoRoot, cssPath)} exists: ${existsSync(cssPath)}`,
);

// 2. Commits touching CellsPage.css
const log = run('git', [
  'log',
  '--oneline',
  '-10',
  '--follow',
  '--',
  'frontend/src/pages/CellsPage.css',
]);
console.log(`\n[2] Last commits touching CellsPage.css:`);
console.log(log ?? '  (git unavailable or no history)');

// 3. Is the file present in the currently checked-out commit (HEAD)?
const headHas = run(
  'git',
  ['cat-file', '-e', 'HEAD:frontend/src/pages/CellsPage.css'],
);
console.log(
  `\n[3] CellsPage.css present in HEAD: ${headHas !== null ? 'yes' : 'NO — check git status, file may be deleted locally'}`,
);

// 4. Any importers that would have created the chunk?
const importers = run('git', [
  'grep',
  '-l',
  "CellsPage.css'",
  'HEAD',
  '--',
  'frontend/src',
]);
console.log(`\n[4] HEAD files importing CellsPage.css (these chunks bundle it):`);
console.log(
  importers
    ? importers
        .split('\n')
        .map((l) => `  ${l}`)
    : '  none found',
);

// 5. Optional: probe the exact 404 asset on the live deployment.
if (brokenHash) {
  const url = `https://satarapolytechnicsatara-5mm8.vercel.app/assets/CellsPage-${brokenHash}.css`;
  console.log(`\n[5] Probing ${url}`);
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(
      `    status ${res.status} — ${res.ok ? 'still served (CDN cache?)' : 'confirmed gone from current deployment'}`,
    );
  } catch (e) {
    console.log(`    network probe failed: ${e.message}`);
  }
} else {
  console.log(
    `\n[5] Skipped live probe — pass the broken hash: node scripts/diagnose-cells-css-404.js tR18qlJv`,
  );
}

console.log(
  `\nConclusion: a 404 for a hashed asset after a redeploy is expected — old\n` +
    `tabs request old hashes that the new deployment no longer contains. The\n` +
    `lazyWithRetry guard added in App.jsx reloads such tabs once to pick up the\n` +
    `new index.html with current hashes.`,
);
