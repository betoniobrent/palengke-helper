const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { transformSync } = require('esbuild');
// Publish only explicitly allowed website files, never repository or backend files.
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
execFileSync(process.execPath, [require.resolve('tailwindcss/lib/cli.js'), '--config', path.join(root, 'tailwind.config.cjs'), '--output', path.join(root, 'tailwind.css'), '--minify'], { cwd: root, stdio: 'inherit' });
const files = fs.readFileSync(path.join(root, '.assetsignore'), 'utf8')
  .split(/\r?\n/).filter(line => line.startsWith('!/') && !line.endsWith('/'))
  .map(line => line.slice(2));
for (const file of files) {
  if (file.includes('..') || path.isAbsolute(file)) throw new Error('Invalid asset path');
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (file.endsWith('.js')) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    // Preserve top-level names used by inline handlers and subsequent scripts.
    fs.writeFileSync(destination, transformSync(source, { minify: true, target: 'es2020', legalComments: 'inline' }).code);
  } else {
    fs.copyFileSync(path.join(root, file), destination);
  }
}
console.log(`Prepared ${files.length} website files in dist`);
