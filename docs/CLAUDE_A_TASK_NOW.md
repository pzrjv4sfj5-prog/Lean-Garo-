# CLAUDE A — IMMEDIATE TASK
_Allocated by Claude B — 2026-06-17_

## Context
The user has been running scripts/fixes locally in their own workspace
(not yet committed/pushed to origin). You need to pick up from there,
verify, commit, and push. Origin/main is currently at `7124381` and does
NOT yet have these changes.

## What the user already ran locally (uncommitted)
```bash
node docs/fix_family_words_and_raka.cjs      # ran successfully
node docs/global_hyphen_to_raka.cjs           # ran successfully
```
Result: `corrections.json` updated (294 entries, family vocab fixed,
hyphens→raka), 5 dictionary files updated (14,274 hyphens→raka total),
`compiled_dict.json` rebuilt.

Then user manually fixed code in `src/garo_classifier.js`:
```bash
sed -i "s/\${classifier}-\${getClassifierSuffix(count)}/\${classifier}·\${getClassifierSuffix(count)}/" src/garo_classifier.js
sed -i 's/chiking-ma-/chiking·ma·/g' src/garo_classifier.js
```
Verified: `"2 dogs"` → `"mang·gni achak"`, `"3 people"` → `"sak·gitam man·de"`,
`"5 birds"` → `"mang·bonga do·o"` — all clean, no hyphens, build passes.

## YOUR TASKS

### Task 1 — Check `src/translationEngine.js` for the same hardcoded hyphen issue
```bash
grep -n "'-ko'\|'-na'" src/translationEngine.js
```
If this shows lines around 199, 290, 292, 298 with `'-ko'` or `'-na'` as
literal string concatenation, fix them to `'·ko'` and `'·na'`:
```bash
sed -i "s/'-ko'/'·ko'/g; s/'-na'/'·na'/g" src/translationEngine.js
```
**Caution:** check the sed result with `grep -n "'·ko'\|'·na'"` afterward to
confirm it applied correctly and didn't accidentally touch something else
(e.g. a hyphen inside an unrelated string). Review the diff before trusting it.

### Task 2 — Audit IRREGULAR_VERBS / PURPOSE_MAP for remaining hyphens
```bash
grep -n "IRREGULAR_VERBS\s*=" src/translationEngine.js
grep -n "PURPOSE_MAP\s*=" src/translationEngine.js
```
Then manually inspect those object literals for any Garo values still
containing `-` that should be `·`. This was not fully audited by Claude B —
flag anything found and fix it.

### Task 3 — Check the one remaining untouched file
```bash
grep -c "\-" src/data/dictionary/conversation_patterns.json
```
If it shows hyphens in `garo` field values, fix manually or write a small
script following the same pattern as `docs/global_hyphen_to_raka.cjs`.

### Task 4 — Full verification test
```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = [
  '2 dogs', '3 people', '5 birds', 'one book', 'two books',
  'my dog', 'at home', 'this is not good', 'this is my father',
  'this is my mother', 'this is my wife', 'this is my husband',
  'i have two children', 'i am sad', 'did you eat', 'are you sleeping',
  "let's go to market", 'dog bit me',
];
for (const t of tests) {
  const r = await translate(t);
  const warn = r.garo.includes('-') ? ' ⚠️ HYPHEN FOUND' : '';
  console.log(`"${t}" -> "${r.garo}" [${r.method}]${warn}`);
}
EOF
```
Goal: zero `⚠️ HYPHEN FOUND` warnings.

### Task 5 — Build, commit, push
```bash
npm run build 2>&1 | tail -5
git add src/data/corrections.json garo_dictionary.json master_dictionary.json \
  doc7_entries.json final_entries.json sentences200.json src/compiled_dict.json \
  src/garo_classifier.js src/translationEngine.js src/data/category_index.json
git pull origin main --no-rebase --no-edit
git push origin main
```

## Reference docs (already in repo)
- `docs/GLOBAL_RAKA_CONVERSION_HANDOFF.md` — full technical detail, exact
  line numbers, rationale for the override of earlier hyphen guidance
- `docs/CLAUDE_A_BRIEF_SESSION_RECAP.md` — full session history

## Do not touch (Claude B files)
`src/pages/`, `src/components/`, `src/App.jsx`, `vite.config.js`, `docs/`
(you may read docs/, just don't edit them this session)

---
_Claude B — Platform Side_
