import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
const outfile = new URL('../tests/.studio-regression.mjs', import.meta.url).pathname;
try {
  await build({ entryPoints: ['tests/studio-regression.ts'], bundle: true, platform: 'node', format: 'esm', external: ['react', 'react-dom/server', 'esbuild'], outfile });
  await import(outfile);
} finally {
  await rm(outfile, { force: true });
}
