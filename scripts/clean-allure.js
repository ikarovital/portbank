const fs = require('fs');
const path = require('path');

const dirs = ['allure-results', 'allure-report'];
const root = path.resolve(__dirname, '..');

for (const dir of dirs) {
  const full = path.join(root, dir);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true });
    console.log('Removido:', dir);
  }
}
