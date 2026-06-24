const fs = require('fs');
const dictPath = 'master_dictionary.json';
const m = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
if (!Array.isArray(m) || m.length < 7000) {
  console.error(`SAFETY ABORT: ${Array.isArray(m) ? m.length : 'non-array'} entries, expected >= 7000.`);
  process.exit(1);
}
const beforeLength = m.length;
console.log('Entries before:', beforeLength);
m.push({ english: 'see', garo: 'nia', category: 'verbs', notes: 'variant/VERIFIED/HIGH — native speaker (Thangseng), WhatsApp 2026-05-10, confirms nia as valid alternate to Nika/nik·a' });
m.push({ english: 'to see', garo: 'nia', category: 'verbs', notes: 'variant/VERIFIED/HIGH — native speaker (Thangseng), WhatsApp 2026-05-10, confirms nia as valid alternate to nik·a' });
const afterLength = m.length;
if (afterLength !== beforeLength + 2) {
  console.error(`SAFETY ABORT: expected ${beforeLength + 2}, got ${afterLength}.`);
  process.exit(1);
}
fs.writeFileSync(dictPath, JSON.stringify(m, null, 2));
console.log('Entries after:', afterLength, '- written successfully.');
