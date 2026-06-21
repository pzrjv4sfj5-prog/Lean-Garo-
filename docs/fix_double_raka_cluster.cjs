// Run: node docs/fix_double_raka_cluster.cjs
// Collapses double/multiple raka (··) to single raka (·) in master_dictionary.json.
// Evidence this is corruption, not intentional doubling — see
// docs/DOUBLE_RAKA_RESOLUTION.md for full methodology.
const fs = require('fs');

const path = 'master_dictionary.json';
const m = JSON.parse(fs.readFileSync(path, 'utf8'));

let fixed = 0;
const changes = [];
m.forEach(e => {
  if (e.garo && e.garo.includes('··')) {
    const before = e.garo;
    e.garo = e.garo.replace(/··+/g, '·'); // collapse any run of 2+ raka to exactly 1
    fixed++;
    changes.push({ english: e.english, before, after: e.garo });
  }
});

fs.writeFileSync(path, JSON.stringify(m, null, 2));

// Write a log of every change for traceability
fs.writeFileSync('docs/double_raka_fix_log.json', JSON.stringify(changes, null, 2));

console.log(`Collapsed double-raka in ${fixed} entries.`);
console.log(`Change log written to docs/double_raka_fix_log.json`);
console.log(`Now run: npm run build`);
