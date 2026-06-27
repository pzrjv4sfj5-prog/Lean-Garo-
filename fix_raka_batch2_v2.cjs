// Standalone script: fix three raka errors in corrections.json for the "ni"/"kat" root families.
// Path is resolved relative to the GIT REPO ROOT (found via git rev-parse), not __dirname,
// so this script works regardless of which folder it's placed in.
//
// Fixes:
//   run -> Kata        (no raka; native speaker confirmed "I run" = Anga kata)
//   to see -> nika      (no raka; inferred from root-consistency with see/saw/show me/to stare, user-confirmed)
//   look -> Nibo        (no raka; user-confirmed via real sentence "kasapai board ko nibo")
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let repoRoot;
try {
  repoRoot = execSync('git rev-parse --show-toplevel', { cwd: __dirname }).toString().trim();
} catch (e) {
  console.error('SAFETY ABORT: could not determine git repo root. Run this from inside the repo.');
  process.exit(1);
}

const p = path.join(repoRoot, 'src', 'data', 'corrections.json');
if (!fs.existsSync(p)) {
  console.error(`SAFETY ABORT: expected file not found at ${p}`);
  process.exit(1);
}

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
console.log(`Applied ${appliedCount} fixes to ${p}. Entry count unchanged: ${afterCount}`);

const verify = fs.readFileSync(p, 'utf8');
for (const fix of fixes) {
  const ok = verify.includes(fix.after);
  console.log(`  ${fix.label}: ${ok ? 'OK -> ' + fix.after : 'FAILED TO VERIFY'}`);
}
