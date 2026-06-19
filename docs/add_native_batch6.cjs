// Run: node docs/add_native_batch6.cjs
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "where have you reached": "Banona sokaha?",
  "where have you been": "Banona sokaha?",
  "reach": "soka·a",
  "reached": "sokaha"
};

let added = 0, skipped = [];
Object.entries(newEntries).forEach(([k, v]) => {
  if (c[k]) { skipped.push(k); return; }
  c[k] = v;
  added++;
});

fs.writeFileSync('src/data/corrections.json', JSON.stringify(c, null, 2));
console.log('Added:', added, '| Skipped:', skipped.length);
if (skipped.length) console.log('Skipped:', skipped);
console.log('New total corrections:', Object.keys(c).length);
