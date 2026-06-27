// Standalone script: fix two raka errors in corrections.json for the "ni" (see/look) root family.
// User directly confirmed via real sentence "kasapai board ko nibo" (look at the notice board)
// that "look" has no raka. Root-consistency check against "see"/"saw"/"show me"/"to stare"
// (all no-raka) flagged "to see" as the same likely error; user confirmed fixing both.
//
// run -> Kata fix is bundled in the same script run for this batch (was staged but not yet
// committed in a prior session step).
const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'src', 'data', 'corrections.json');
const raw = fs.readFileSync(p, 'utf8');
const raka = String.fromCodePoint(0xb7);

const fixes = [
  { before: `"run": "Kat${raka}a",`, after: `"run": "Kata",`, label: 'run' },
  { before: `"to see": "nik${raka}a",`, after: `"to see": "nika",`, label: 'to see' },
  { before: `"look": "Ni${raka}bo",`, after: `"look": "Nibo",`, label: 'look' },
];

const beforeCount = Object.keys(JSON.parse(raw)).length;
let updated = raw;
let appliedCount = 0;

for (const fix of fixes) {
  if (!updated.includes(fix.before)) {
    console.error(`SAFETY ABORT on "${fix.label}": expected string not found, no changes written.`);
    const match = updated.match(new RegExp(`"${fix.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}":\\s*"[^"]*"`));
    console.error('Current line:', match ? match[0] : '(key not found at all)');
    process.exit(1);
  }
  updated = updated.replace(fix.before, fix.after);
  appliedCount++;
}

const afterCount = Object.keys(JSON.parse(updated)).length;
if (beforeCount !== afterCount) {
  console.error(`SAFETY ABORT: entry count changed (${beforeCount} -> ${afterCount}), should be identical for value-only edits.`);
  process.exit(1);
}

fs.writeFileSync(p, updated, 'utf8');
console.log(`Applied ${appliedCount} fixes. Entry count unchanged: ${afterCount}`);

const verify = fs.readFileSync(p, 'utf8');
for (const fix of fixes) {
  const ok = verify.includes(fix.after);
  console.log(`  ${fix.label}: ${ok ? 'OK -> ' + fix.after : 'FAILED TO VERIFY'}`);
}
