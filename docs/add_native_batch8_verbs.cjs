const fs = require('fs');
const correctionsPath = 'src/data/corrections.json';
const c = JSON.parse(fs.readFileSync(correctionsPath, 'utf8'));
const before = Object.keys(c).length;
const additions = {
  'to climb': 'maldoa', 'climb': 'maldoa', 'to climb (alternate)': 'gadoa',
  'to roam': 'rorama', 'roam': 'rorama', 'to roam (alternate)': 'roama',
  'to pluck': 'aka', 'to lock': 'teka', 'to shoot': 'goa', 'to throw': 'goata',
  'to stare': 'nitata', 'to smell': 'gingsika', 'to spread': 'barama',
  'to show': 'mesoka', 'to turn': 'badala', 'to pour': 'rua', 'axe': 'rua',
};
let added = 0, skipped = 0;
for (const [key, value] of Object.entries(additions)) {
  if (c[key] !== undefined) { console.log(`SKIP: "${key}"`); skipped++; continue; }
  c[key] = value;
  added++;
}
fs.writeFileSync(correctionsPath, JSON.stringify(c, null, 2));
const after = Object.keys(c).length;
console.log(`Before: ${before} | Added: ${added} | Skipped: ${skipped} | After: ${after}`);
