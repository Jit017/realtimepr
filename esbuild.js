import { build } from 'esbuild';
import pkg from './package.json' assert { type: 'json' };
import fs from 'fs';

const { dependencies } = pkg;

await build({
  entryPoints: ['src/cli.ts'],
  bundle: true,
  outfile: 'dist/cli.js',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  external: ['commander', 'chalk', 'openai']
}).then(() => {
  // Prepend shebang manually
  const shebang = '#!/usr/bin/env node\n';
  const orig = fs.readFileSync('dist/cli.js');
  fs.writeFileSync('dist/cli.js', shebang + orig);
  fs.chmodSync('dist/cli.js', 0o755);
  console.log('Build complete.');
}).catch((e) => {
  console.error(e);
  process.exit(1);
}); 