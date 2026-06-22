// Run: node docs/fix_verb_roots.cjs
// Fixes 4 verb root mismatches found by native speaker review (2026-06-22):
// eat/drink/sleep had imperative/purpose forms overriding the correct roots
// see had wrong capitalisation (nik·a -> Nika per native speaker)

const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const fixes = {
  "eat": "Cha·a",
  "drink": "Ringa",
  "sleep": "Tusia",
  "see": "Nika"
};

let updated = 0;
Object.entries(fixes).forEach(([k, v]) => {
  const old = c[k];
  c[k] = v;
  console.log('FIX:', k, ':', JSON.stringify(old || '(none)'), '->', JSON.stringify(v));
  updated++;
});

fs.writeFileSync('src/data/corrections.json', JSON.stringify(c, null, 2));
console.log('Updated:', updated);
console.log('New total corrections:', Object.keys(c).length);
