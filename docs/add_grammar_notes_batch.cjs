const fs = require('fs');
const correctionsPath = 'src/data/corrections.json';
const c = JSON.parse(fs.readFileSync(correctionsPath, 'utf8'));
const cBefore = Object.keys(c).length;
c['did you have lunch'] = 'Na·a mi cha·jok ma?';
c['not tasty'] = 'Touja';
c['apple'] = 'Apple';
c['he has eaten'] = 'Ua cha·jok';
c['they have eaten'] = 'Uamang cha·jok';
c['you have eaten'] = 'Na·a cha·jok';
const cAfter = Object.keys(c).length;
console.log(`corrections.json: ${cBefore} -> ${cAfter} (+${cAfter - cBefore})`);
fs.writeFileSync(correctionsPath, JSON.stringify(c, null, 2));

const dictPath = 'master_dictionary.json';
const m = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
if (!Array.isArray(m) || m.length < 7000) {
  console.error(`SAFETY ABORT: ${Array.isArray(m) ? m.length : 'non-array'} entries, expected >= 7000.`);
  process.exit(1);
}
const mBefore = m.length;
m.push({
  english: 'apple',
  garo: 'te·spu',
  category: 'food',
  notes: 'variant/VERIFIED/HIGH — Grammar_Notes_(1).odt, 2026-06-24: the real Garo word for apple, rarely used (most speakers use the English loanword "Apple", kept as live default per user). Recorded as alternate.'
});
const mAfter = m.length;
if (mAfter !== mBefore + 1) {
  console.error(`SAFETY ABORT: expected ${mBefore + 1}, got ${mAfter}.`);
  process.exit(1);
}
fs.writeFileSync(dictPath, JSON.stringify(m, null, 2));
console.log(`master_dictionary.json: ${mBefore} -> ${mAfter} (+1)`);
