// Run: node docs/add_connectives.cjs
// Adds core Garo connective words (and/but/or/if/so) to corrections.json.
// NOTE: these words are currently also in STOP_WORDS in translationEngine.js
// (line 58-59), which means they get stripped BEFORE lookup runs in multi-word
// sentences. Standalone lookups ('translate: and') will work immediately.
// For connectives to appear inside translated sentences, Claude A needs to
// remove them from STOP_WORDS or add special handling. This script is the
// data layer fix only.

const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "and": "Aro",
  "but": "Indiba",
  "or": "ba",
  "if": "Ode",
  "so": "Uni gimin",
  "and then": "Aro",
  "but then": "Indiba",
  "or not": "ba ong·ja"
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
