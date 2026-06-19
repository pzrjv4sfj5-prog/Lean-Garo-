const fs = require('fs');
const path = require('path');
const files = ['garo_dictionary.json', 'master_dictionary.json'];
const CONTAMINATION_PATTERN = /^(i|you|he\/she|we|they|you \(singular\)|you \(plural\))\s+(go|come|eat|drink|see|hear|speak|write|read|sleep)(\s+\((present|past|future)\))?$/;
const logDir = 'docs/migration_logs';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
let grandTotal = 0;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const removed = [], kept = [];
  data.forEach((entry, idx) => {
    const eng = (entry.english || '').toLowerCase().trim();
    if (CONTAMINATION_PATTERN.test(eng)) removed.push({ originalIndex: idx, entry });
    else kept.push(entry);
  });
  const logPath = path.join(logDir, `removed_conjugation_contamination_${file.replace('.json','')}_${timestamp}.json`);
  fs.writeFileSync(logPath, JSON.stringify({ sourceFile: file, removedCount: removed.length, originalTotalEntries: data.length, newTotalEntries: kept.length, removedEntries: removed }, null, 2));
  fs.writeFileSync(file, JSON.stringify(kept, null, 2));
  console.log(`${file}: removed ${removed.length} (${data.length} -> ${kept.length})`);
  grandTotal += removed.length;
}
console.log('Grand total removed:', grandTotal);
