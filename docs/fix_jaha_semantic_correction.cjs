// CRITICAL GRAMMAR CORRECTION — 2026-07-04
// Source: docs/GRAMMAR_NOTES_JAHA_MANAHA_20260703.md (Thangseng, native speaker)
// -jaha does NOT mean simple past negation ("did not X").
// -jaha means DISCONTINUATION ("stopped X-ing", "no longer X-ing").
// This supersedes THANGSENG_RULES_LOOKUP.md Rule 17 (2026-07-01), which is
// now WRONG. All corrections.json entries keying "did not X" -> "Xjaha" are
// mislabeled: the Garo form is fine, the English gloss is wrong. Relabel to
// the correct meaning; do NOT invent a replacement suffix for true simple
// past negation — that remains an open Thangseng question.
const fs = require('fs');
const path = '/home/claude/lean-garo/src/data/corrections.json';
const raw = fs.readFileSync(path, 'utf8');
fs.writeFileSync('/tmp/corrections.json.backup_' + Date.now(), raw);
const c = JSON.parse(raw);

const relabels = [
  ['i did not eat', 'i stopped eating'],
  ["he didn't eat", 'he stopped eating'],
  ["she didn't eat", 'she stopped eating'],
  ['i did not drink', 'i stopped drinking'],
  ['i did not run', 'i stopped running'],
  ['i did not work', 'i stopped working'],
  ['i did not sleep', 'i stopped sleeping'],
  ['i did not go', 'i stopped going'],
  ['i did not come', 'i stopped coming'],
  ['she did not do her work', 'she stopped doing her work'],
  ['did not do', 'stopped doing'],
  ['did not eat', 'stopped eating'],
];

const removedAsDuplicate = ['he did not eat']; // same value as "he didn't eat", drop after relabel

const log = [];
for (const [oldKey, newKey] of relabels) {
  if (!(oldKey in c)) { log.push(`SKIP (missing): ${oldKey}`); continue; }
  const val = c[oldKey];
  delete c[oldKey];
  c[newKey] = val;
  log.push(`${oldKey} -> ${newKey} (value unchanged: ${val})`);
}
for (const dupKey of removedAsDuplicate) {
  if (dupKey in c) { log.push(`REMOVED duplicate: ${dupKey} (${c[dupKey]})`); delete c[dupKey]; }
}

fs.writeFileSync(path, JSON.stringify(c, null, 2));
fs.writeFileSync('/tmp/jaha_relabel_log.json', JSON.stringify(log, null, 1));
console.log(log.join('\n'));
console.log('Total corrections.json entries now:', Object.keys(c).length);
