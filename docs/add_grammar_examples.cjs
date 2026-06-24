// Run: node docs/add_grammar_examples.cjs
// Adds native-verified sentences from grammar notes session (2026-06-22).
// Covers:
// 1. -ja direct predicate negation (Ua cha·jaha, Ua namja)
// 2. Predicative adjective without -gipa (Gari sila, Ua sila)
// 3. Attributive adjective with -gipa suffix (Silgipa gari, Namgijagipa bi'sa)
// See docs/GRAMMAR_NOTES_20260622.md for full rule explanation.

const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "he didn't eat": "Ua cha·jaha",
  "she didn't eat": "Ua cha·jaha",
  "he did not eat": "Ua cha·jaha",
  "he is bad": "Ua namja",
  "he is not good": "Ua namja",
  "she is not good": "Ua namja",
  "the car is beautiful": "Gari sila",
  "it is beautiful": "Ia sila",
  "she is beautiful": "Ua sila",
  "the beautiful car": "Silgipa gari",
  "he is a bad boy": "Ua namgijagipa bi'sa ong'a",
  "bad boy": "Namgijagipa bi'sa"
};

let added = 0, skipped = [];
Object.entries(newEntries).forEach(([k, v]) => {
  if (c[k]) { skipped.push(k); return; }
  c[k] = v;
  added++;
});

fs.writeFileSync('src/data/corrections.json', JSON.stringify(c, null, 2));
console.log('Added:', added, '| Skipped (already exist):', skipped.length);
if (skipped.length) console.log('Skipped:', skipped);
console.log('New total corrections:', Object.keys(c).length);
