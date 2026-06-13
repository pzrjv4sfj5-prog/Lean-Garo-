const fs = require('fs');

// Fix 1 — add missing entries to corrections.json
const corrections = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newCorrections = {
  'anatomy': 'sep-ak-ni gimin',
  'explained': 'talate on·aha',
  'explain': 'talate on·a',
  'welcome': 'Rimchaksoa',
  'no need to thank me you are welcome': 'Mamingba ong·ja, angko mittelna nangjawa',
  'no need to thank me': 'Mamingba ong·ja',
  'the doctor explained the anatomy': 'Daktar sepak-ni gimin talate on·aha',
  'people say it is good is it good': 'Manderang aganna nama ine, namama?',
  'people say it is good': 'Manderang aganna nama ine',
};

let added = 0;
for (const [k, v] of Object.entries(newCorrections)) {
  if (!corrections[k]) { corrections[k] = v; added++; }
}

fs.writeFileSync('src/data/corrections.json', JSON.stringify(corrections, null, 2));
console.log('Corrections added:', added, '| Total:', Object.keys(corrections).length);

// Fix 2 — add to master_dictionary
const master = JSON.parse(fs.readFileSync('master_dictionary.json'));
const seen = new Set(master.map(e => (e.english||'').toLowerCase().trim() + '|' + (e.garo||'').toLowerCase().trim()));

const newEntries = [
  { english: 'no need to thank me you are welcome', garo: 'Mamingba ong·ja, angko mittelna nangjawa', category: 'phrases' },
  { english: 'the doctor explained the anatomy', garo: 'Daktar sepak-ni gimin talate on·aha', category: 'health' },
  { english: 'people say it is good is it good', garo: 'Manderang aganna nama ine, namama?', category: 'phrases' },
  { english: 'anatomy', garo: 'sep-ak-ni gimin', category: 'health' },
  { english: 'explain', garo: 'talate on·a', category: 'verbs' },
  { english: 'explained', garo: 'talate on·aha', category: 'verbs' },
  { english: 'welcome', garo: 'Rimchaksoa', category: 'phrases' },
];

let dictAdded = 0;
for (const e of newEntries) {
  const key = e.english.toLowerCase() + '|' + e.garo.toLowerCase();
  if (!seen.has(key)) { master.push({...e, pos: null, classifier: null, notes: 'fix/verified'}); seen.add(key); dictAdded++; }
}

fs.writeFileSync('master_dictionary.json', JSON.stringify(master, null, 2));
console.log('Dictionary added:', dictAdded, '| Total:', master.length);

// Rebuild compiled_dict
const compiled = {};
for (const e of master) {
  const key = (e.english||'').toLowerCase().trim();
  if (!key || !e.garo) continue;
  if (!compiled[key]) compiled[key] = [];
  compiled[key].push({ garo: e.garo, pos: e.pos||null, category: e.category||'uncategorized', classifier: e.classifier||null });
}
fs.writeFileSync('src/compiled_dict.json', JSON.stringify(compiled));
console.log('compiled_dict keys:', Object.keys(compiled).length);
