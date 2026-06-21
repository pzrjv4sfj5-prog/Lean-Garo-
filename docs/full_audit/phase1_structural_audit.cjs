const fs = require('fs');
const path = require('path');
const FILES = ['master_dictionary.json','garo_dictionary.json','doc7_entries.json','final_entries.json','sentences200.json'];
const CONTAMINATION_PATTERN = /^(i|you|he\/she|we|they|you \(singular\)|you \(plural\))\s+(go|come|eat|drink|see|hear|speak|write|read|sleep)(\s+\((present|past|future)\))?$/i;
function csvEscape(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
function auditFile(filename) {
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const entries = Array.isArray(data) ? data : Object.entries(data).map(([k, v]) => ({ english: k, garo: v }));
  const keyGroups = {};
  entries.forEach((e, i) => {
    if (!e.english) return;
    const key = e.english.toLowerCase().trim();
    if (!keyGroups[key]) keyGroups[key] = [];
    keyGroups[key].push(i);
  });
  const rows = [];
  const summary = { file: filename, totalEntries: entries.length, emptyGaro: 0, contamination: 0, doubleRaka: 0, longGaro: 0, duplicateKeyMembers: 0, duplicateKeyGroups: 0, verificationTagCounts: {} };
  Object.values(keyGroups).forEach(idxs => { if (idxs.length > 1) summary.duplicateKeyGroups++; });
  entries.forEach((e, i) => {
    const flags = [];
    const garo = e.garo;
    const eng = e.english || '';
    if (!garo || (typeof garo === 'string' && garo.trim() === '')) { flags.push('EMPTY_GARO'); summary.emptyGaro++; }
    if (typeof garo === 'string') {
      if (CONTAMINATION_PATTERN.test(eng.trim())) { flags.push('CONTAMINATION_PATTERN'); summary.contamination++; }
      if (garo.includes('··')) { flags.push('DOUBLE_RAKA'); summary.doubleRaka++; }
      if (garo.length > 80) { flags.push('SUSPICIOUSLY_LONG'); summary.longGaro++; }
    }
    const notes = e.notes || '';
    let tag = 'none';
    if (/VERIFIED\/HIGH/i.test(notes)) tag = 'VERIFIED/HIGH';
    else if (/UNVERIFIED\/HIGH/i.test(notes)) tag = 'UNVERIFIED/HIGH';
    else if (/UNVERIFIED/i.test(notes)) tag = 'UNVERIFIED';
    else if (/variant/i.test(notes)) tag = 'variant (other)';
    summary.verificationTagCounts[tag] = (summary.verificationTagCounts[tag] || 0) + 1;
    const key = eng.toLowerCase().trim();
    const isDuplicate = key && keyGroups[key] && keyGroups[key].length > 1;
    if (isDuplicate) { flags.push('DUPLICATE_KEY'); summary.duplicateKeyMembers++; }
    if (flags.length > 0) rows.push({ index: i, english: eng, garo: typeof garo === 'string' ? garo : JSON.stringify(garo), category: e.category || '', notes, verificationTag: tag, flags: flags.join('|') });
  });
  const outPath = path.join('docs/full_audit', `${path.basename(filename, '.json')}_audit.csv`);
  const header = 'index,english,garo,category,notes,verification_tag,flags\n';
  const csvLines = rows.map(r => [r.index, r.english, r.garo, r.category, r.notes, r.verificationTag, r.flags].map(csvEscape).join(',')).join('\n');
  fs.writeFileSync(outPath, header + csvLines + '\n');
  return { summary, flaggedCount: rows.length, outPath };
}
const overallSummary = [];
for (const file of FILES) {
  if (!fs.existsSync(file)) { console.log(`SKIP: ${file} not found`); continue; }
  const result = auditFile(file);
  overallSummary.push(result.summary);
  console.log(`${file}: ${result.summary.totalEntries} total, ${result.flaggedCount} flagged -> ${result.outPath}`);
}
{
  const filename = 'src/data/corrections.json';
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const entries = Object.entries(data).map(([k, v]) => ({ english: k, garo: v }));
  const rows = [];
  let doubleRaka = 0, longGaro = 0;
  entries.forEach((e, i) => {
    const flags = [];
    if (typeof e.garo === 'string') {
      if (e.garo.includes('··')) { flags.push('DOUBLE_RAKA'); doubleRaka++; }
      if (e.garo.length > 100) { flags.push('SUSPICIOUSLY_LONG'); longGaro++; }
    }
    if (flags.length) rows.push({ index: i, english: e.english, garo: e.garo, flags: flags.join('|') });
  });
  const outPath = 'docs/full_audit/corrections_audit.csv';
  fs.writeFileSync(outPath, 'index,english,garo,flags\n' + rows.map(r => [r.index, r.english, r.garo, r.flags].map(csvEscape).join(',')).join('\n') + '\n');
  console.log(`${filename}: ${entries.length} total, ${rows.length} flagged -> ${outPath}`);
  overallSummary.push({ file: filename, totalEntries: entries.length, doubleRaka, longGaro, flaggedCount: rows.length });
}
fs.writeFileSync('docs/full_audit/PHASE1_SUMMARY.json', JSON.stringify(overallSummary, null, 2));
console.log('Phase 1 complete.');
