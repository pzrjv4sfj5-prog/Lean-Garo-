// Run: node docs/add_native_batch5.cjs
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "white hair": "Kni gipok",
  "saliva": "Ku·chi",
  "saliva is sticky": "Ku·chi Sitapenga",
  "what do you want to buy": "Na·a maiko ra·gen?",
  "what do you want": "Na·a maiko nanga?"
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
