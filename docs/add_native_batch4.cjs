// Run: node docs/add_native_batch4.cjs
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "girl is beautiful": "Me·chik sila",
  "boy is handsome": "Me·asa sila",
  "big man": "Mande dala",
  "he is very tall": "Ua me·asa namen changroa",
  "tall": "changroa",
  "my child is very active in studies": "Angni bi·sa poraina gisik nanga",
  "my boyfriend's soul is very pure": "Angni mikchagipa de gisik nama",
  "my girlfriend's soul is very pure": "Angni mikchagipa de gisik nama",
  "soul": "Gisik"
};

let added = 0, skipped = [];
Object.entries(newEntries).forEach(([k, v]) => {
  if (c[k]) { skipped.push(k); return; }
  c[k] = v;
  added++;
});

fs.writeFileSync('src/data/corrections.json', JSON.stringify(c, null, 2));
console.log('Added:', added, '| Skipped (already exist):', skipped.length);
if (skipped.length) console.log('Skipped keys:', skipped);
console.log('New total corrections:', Object.keys(c).length);
