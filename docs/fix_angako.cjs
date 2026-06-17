// Run: node docs/fix_angako.cjs
// Replaces all instances of "anga·ko" / "Anga·ko" with "Angko" in corrections.json
const fs = require('fs');
const raw = fs.readFileSync('src/data/corrections.json', 'utf8');

const before = (raw.match(/anga·ko/gi) || []).length;

const fixed = raw
  .replace(/Anga·ko/g, 'Angko')
  .replace(/anga·ko/g, 'Angko');

fs.writeFileSync('src/data/corrections.json', fixed);

const after = (fixed.match(/anga·ko/gi) || []).length;
console.log(`Replaced ${before} occurrence(s) of "anga·ko" with "Angko".`);
console.log(`Remaining occurrences: ${after}`);
