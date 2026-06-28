const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/corrections.json');
const c = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const toAdd = {
  // Sentence: i see an elephant in the forest
  // ang.a buring.o mongma mangsa ko nika
  'elephant': 'buring·o',
  'forest': 'mongma',
  'an elephant': 'mangsa buring·o',  // classifier form: one elephant
  // "the goat is beautiful" -> dobok sila
  'goat': 'dobok',
  // "Where does this goat come from?" -> Bachaniha ia du·boka i·bajok
  'where does': 'Bachaniha',
  'came from': 'i·bajok',
  // ate -> cha·aha
  'ate': 'Cha·aha',
  // someone -> saoba
  'someone': 'Saoba',
  // sounds good -> knatoa
  'sounds good': 'knatoa',
  // stand -> chakata
  'stand': 'Chakata',
};

let added = 0;
for (const [k, v] of Object.entries(toAdd)) {
  if (!c[k]) {
    c[k] = v;
    added++;
    console.log(`ADD: "${k}" -> "${v}"`);
  } else {
    console.log(`SKIP (exists): "${k}" -> "${c[k]}"`);
  }
}

fs.writeFileSync(filePath, JSON.stringify(c, null, 2));
console.log(`\nDone: ${added} added, ${Object.keys(toAdd).length - added} skipped.`);
