// Run: node docs/global_hyphen_to_raka.cjs
// Converts ALL hyphens (-) to raka (·) in the "garo" field of every dictionary
// source file, per explicit native-speaker instruction (2026-06-17): no exceptions.
// Only touches the "garo" value — never "english", "category", "pos", "notes", or keys.
const fs = require('fs');

const FILES = [
  'garo_dictionary.json',
  'master_dictionary.json',
  'doc7_entries.json',
  'final_entries.json',
  'sentences200.json',
];

let grandTotalReplaced = 0;
let grandTotalEntries = 0;

FILES.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`SKIP (not found): ${file}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let fileReplaced = 0;

  if (Array.isArray(data)) {
    data.forEach(entry => {
      if (entry && typeof entry.garo === 'string' && entry.garo.includes('-')) {
        fileReplaced += (entry.garo.match(/-/g) || []).length;
        entry.garo = entry.garo.replace(/-/g, '·');
      }
    });
  } else if (typeof data === 'object') {
    // key-value style (english -> garo)
    Object.keys(data).forEach(k => {
      if (typeof data[k] === 'string' && data[k].includes('-')) {
        fileReplaced += (data[k].match(/-/g) || []).length;
        data[k] = data[k].replace(/-/g, '·');
      }
    });
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`${file}: replaced ${fileReplaced} hyphen(s)`);
  grandTotalReplaced += fileReplaced;
  grandTotalEntries += Array.isArray(data) ? data.length : Object.keys(data).length;
});

console.log('---');
console.log('Grand total hyphens replaced:', grandTotalReplaced);
console.log('Now run: npm run build   (this recompiles compiled_dict.json from these sources)');
