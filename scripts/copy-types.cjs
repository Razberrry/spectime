const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'src', 'types');
const targetDir = path.join(root, 'dist', 'types');

fs.mkdirSync(targetDir, { recursive: true });

const files = ['css-modules.d.ts', 'entry.d.ts'];
files.forEach((file) => {
  fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
});
