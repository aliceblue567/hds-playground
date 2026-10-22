import { build } from 'esbuild';
import { readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
const outfile = new URL('../tests/.flow-regression.mjs', import.meta.url).pathname;
try {
  await build({ entryPoints: ['tests/flow-regression.ts'], bundle: true, platform: 'node', format: 'esm', external: ['react', 'react-dom/server'], outfile,
    plugins: [{ name: 'vite-assets', setup(b) {
      b.onResolve({ filter: /\?(raw|url)$/ }, args => ({ path: resolve(args.resolveDir, args.path.split('?')[0]), namespace: args.path.endsWith('?raw') ? 'raw' : 'asset' }));
      b.onLoad({ filter: /.*/, namespace: 'raw' }, async args => ({ contents: await readFile(args.path, 'utf8'), loader: 'text' }));
      b.onLoad({ filter: /.*/, namespace: 'asset' }, args => ({ contents: args.path, loader: 'text' }));
    } }] });
  await import(outfile);
} finally { await rm(outfile, { force: true }); }
