const fs = require('fs');
const correctionsPath = 'src/data/corrections.json';
const c = JSON.parse(fs.readFileSync(correctionsPath, 'utf8'));
const before = Object.keys(c).length;
const additions = {
  'why are you come here': 'Na·a maina Ianona re·bara?',
  'why are you back': 'Na·ara mainasa re·bapila?',
  'where do you stay': 'Na·a bano dongenga?',
  "why you're in love with someone else": 'Maina nara sakgipinko kaasaenga.',
  'window': 'Kelki',
  'open the window': 'Kelki oatbo',
  'wingless bird': 'Granggri do·o',
  "won't you come": 'Na·a re·bajawa ma?',
  'wrist': 'jak gito',
};
let added = 0;
for (const [key, value] of Object.entries(additions)) {
  if (c[key] === undefined) added++;
  c[key] = value;
}
fs.writeFileSync(correctionsPath, JSON.stringify(c, null, 2));
const after = Object.keys(c).length;
console.log(`Before: ${before} | Added: ${added} | After: ${after}`);
