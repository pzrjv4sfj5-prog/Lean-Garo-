const fs = require('fs');
const files = ['garo_dictionary.json', 'master_dictionary.json'];
const CONTAMINATION_PATTERN = /^(i|you|he\/she|we|they|you \(singular\)|you \(plural\))\s+(go|come|eat|drink|see|hear|speak|write|read|sleep)(\s+\((present|past|future)\))?$/;
const SAFETY_KEYWORDS = ['VERIFIED', 'HIGH', 'MANUAL', 'NATIVE', 'CORRECTED'];
function entryContainsSafetyKeyword(entry) {
  const haystack = JSON.stringify(entry).toUpperCase();
  return SAFETY_KEYWORDS.filter(kw => haystack.includes(kw));
}
function csvEscape(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
let allCandidates = [], allFlagged = [], totalEntriesAllFiles = 0;
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  totalEntriesAllFiles += data.length;
  data.forEach((entry, idx) => {
    const eng = (entry.english || '').toLowerCase().trim();
    if (!CONTAMINATION_PATTERN.test(eng)) return;
    const safetyHits = entryContainsSafetyKeyword(entry);
    const record = { sourceFile: file, originalIndex: idx, english: entry.english, garo: entry.garo, category: entry.category || '', notes: entry.notes || '', confidence: safetyHits.length > 0 ? 'FLAGGED' : 'high', reason_for_removal: safetyHits.length > 0 ? `SAFETY FLAG: ${safetyHits.join(', ')}` : 'English+fake-suffix placeholder' };
    if (safetyHits.length > 0) allFlagged.push(record); else allCandidates.push(record);
  });
}
const allRows = [...allCandidates, ...allFlagged];
const header = 'english,garo,category,confidence,reason_for_removal\n';
const csvLines = allRows.map(r => [r.english, r.garo, r.category, r.confidence, r.reason_for_removal].map(csvEscape).join(',')).join('\n');
fs.writeFileSync('docs/conjugation_contamination_report.csv', header + csvLines + '\n');
console.log('total_entries:', totalEntriesAllFiles, '| candidates:', allCandidates.length, '| flagged:', allFlagged.length);
console.log('percentage:', ((allCandidates.length / totalEntriesAllFiles) * 100).toFixed(2) + '%');
allCandidates.slice(0, 50).forEach((r, i) => console.log(`${i+1}. "${r.english}" -> "${r.garo}"`));
