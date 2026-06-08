const fs = require('fs');
const NEW_ENTRIES = JSON.parse(fs.readFileSync('doc7_entries.json', 'utf8'));
const master = JSON.parse(fs.readFileSync('master_dictionary.json'));
const seen = new Set(master.map(e => (e.english||'').toLowerCase().trim() + '|' + (e.garo||'').toLowerCase().trim()));

let added = 0;
for (const entry of NEW_ENTRIES) {
  const key = (entry.english||'').toLowerCase().trim() + '|' + (entry.garo||'').toLowerCase().trim();
  if (!seen.has(key)) { master.push(entry); seen.add(key); added++; }
}

console.log('Added:', added, '| Total:', master.length);
const cats = {};
master.forEach(e => cats[e.category] = (cats[e.category]||0)+1);
Object.entries(cats).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(k.padEnd(16),v));

fs.writeFileSync('master_dictionary.json', JSON.stringify(master, null, 2));

const compiled = {};
for (const e of master) {
  const key = (e.english||'').toLowerCase().trim();
  if (!key || !e.garo) continue;
  if (!compiled[key]) compiled[key] = [];
  compiled[key].push({ garo: e.garo, pos: e.pos||null, category: e.category||'uncategorized', classifier: e.classifier||null });
}
fs.writeFileSync('src/compiled_dict.json', JSON.stringify(compiled));
console.log('compiled_dict keys:', Object.keys(compiled).length);
