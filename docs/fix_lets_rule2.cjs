// Run: node docs/fix_lets_rule2.cjs
// Fixes 'let's [verb]' constructions per Rule 2 (native speaker, 2026-06-22):
// Hai = collective action marker, NOT 'let'.
// Pattern: Hai + [verb root] + ha
// Overwrites any existing wrong entries.

const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const corrections = {
  "let's eat": "Hai cha·ha",
  "let's eat food": "Hai mi cha·ha",
  "let's go": "Hai re·naha",
  "let's sleep": "Hai tusina",
  "let's drink": "Hai ringaha",
  "let's sit": "Hai asongha",
  "let's play": "Hai kalaha",
  "let's work": "Hai dakha",
  "let's go to market": "Hai bajal re·naha",
  "let us eat": "Hai cha·ha",
  "let us go": "Hai re·naha",
  "let us sleep": "Hai tusina",
  "let us work": "Hai dakha"
};

let added = 0, updated = 0;
Object.entries(corrections).forEach(([k, v]) => {
  if (c[k] && c[k] !== v) {
    console.log('UPDATE:', JSON.stringify(k), ':', JSON.stringify(c[k]), '->', JSON.stringify(v));
    c[k] = v;
    updated++;
  } else if (!c[k]) {
    c[k] = v;
    added++;
  }
});

fs.writeFileSync('src/data/corrections.json', JSON.stringify(c, null, 2));
console.log('Added:', added, '| Updated (wrong->correct):', updated);
console.log('New total corrections:', Object.keys(c).length);
