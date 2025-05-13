const { build } = require('esbuild');
const pkg = require('./package.json');
const { dependencies } = pkg;
const fs = require('fs');

build({
  entryPoints: ['src/cli.ts'],
  bundle: true,
  platform: 'node',
  target: ['node20'],
  format: 'cjs',
  outfile: 'dist/cli.js',
  external: dependencies ? Object.keys(dependencies) : [],
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