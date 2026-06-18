// Run: node docs/fix_family_words_and_raka.cjs
const fs = require('fs');
const raw = fs.readFileSync('src/data/corrections.json', 'utf8');
const c = JSON.parse(raw);

// PART 1 — Vocabulary corrections (native speaker verified, 2026-06-17)
const directFixes = {
  "my father": "ang·ni baba",
  "my mother": "ang·ni aai",
  "this is my father": "Ia ang·ni baba",
  "this is my mother": "Ia ang·ni aai",
  "this is my wife": "Ia ang·ni jikgipa",
  "this is my husband": "Ia ang·ni sejipa",
  "i have two children": "Ang·o Bi'sa sak gini dong·a",
  "i am sad": "Anga duk ong·a",
};

let directApplied = 0;
Object.entries(directFixes).forEach(([k, v]) => {
  c[k] = v;
  directApplied++;
});

// PART 2 — Global hyphen -> raka (·) conversion across ALL corrections values
// User explicit instruction (2026-06-17): change ALL hyphens to raka, no exceptions.
let hyphenCount = 0;
Object.keys(c).forEach(key => {
  const val = c[key];
  if (typeof val === 'string' && val.includes('-')) {
    hyphenCount += (val.match(/-/g) || []).length;
    c[key] = val.replace(/-/g, '·');
  }
});

fs.writeFileSync('src/data/corrections.json', JSON.stringify(c, null, 2));

console.log('Direct vocabulary fixes applied:', directApplied);
console.log('Total hyphen characters replaced with raka (·):', hyphenCount);
console.log('New total corrections:', Object.keys(c).length);
