// Run: node docs/add_native_batch7.cjs
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "are you home": "Nokoma?",
  "are you home?": "Nokoma?",
  "i will go home now": "Anga da·o nokchi re·anggen",
  "i will go home": "Anga nokchi re·anggen",
  "home": "Nok"
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
