// Run: node docs/fix_nama_collision.cjs
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "good": "Nama",
  "it is good": "Nama ong·a",
  "this is good": "Ia nama"
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
