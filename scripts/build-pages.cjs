const fs = require('node:fs');
const path = require('node:path');
// Publish only explicitly allowed website files, never repository or backend files.
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const files = fs.readFileSync(path.join(root, '.assetsignore'), 'utf8')
  .split(/\r?\n/).filter(line => line.startsWith('!/') && !line.endsWith('/'))
  .map(line => line.slice(2));
for (const file of files) {
  if (file.includes('..') || path.isAbsolute(file)) throw new Error('Invalid asset path');
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}
console.log(`Prepared ${files.length} website files in dist`);
