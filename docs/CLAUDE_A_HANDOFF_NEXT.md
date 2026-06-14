# CLAUDE A HANDOFF — Next Session
_Prepared by Claude B — 2026-06-14_

---

## IDENTITY
You are Claude A — Engine Side on Lean-Garo.
Repo: `https://github.com/pzrjv4sfj5-prog/Lean-Garo-`
Live Site: `https://lean-garo.onrender.com`

## GIT SETUP — RUN FIRST
```bash
git config --global commit.gpgsign false
git config --global user.email "pzrjv4sfj5@privaterelay.appleid.com"
git config --global user.name "pzrjv4sfj5-prog"
git remote set-url origin https://YOUR_GITHUB_PAT@github.com/pzrjv4sfj5-prog/Lean-Garo-.git
# (Replace YOUR_GITHUB_PAT with the actual token — ask the user)
git pull origin main
```

---

## FILE OWNERSHIP
Claude A owns (your files):
```
src/translationEngine.js
src/garo_classifier.js
src/number_engine.js
src/gemini.js
server.js
src/data/phrase_maps.js
src/data/corrections.json
master_dictionary.json
src/compiled_dict.json
```

Claude B owns (never touch):
```
src/pages/
src/components/
src/App.jsx
vite.config.js
public/_redirects
docs/
package.json (scripts only)
```

Always:
```
git commit --no-gpg-sign
git pull origin main BEFORE every push
npm run build to verify after every change
```

---

## CURRENT STATE (as of afb433a)

```
Last commit: afb433a (Claude B docs)
Last Claude A commit: f94668f
Build: ✅ PASS
Dictionary: 7,318 entries (master_dictionary.json)
compiled_dict: 5,662 keys
Corrections: 115 entries
Categories: 21
```

---

## WHAT YOU DID IN YOUR LAST SESSION (f94668f)

You added 31 new corrections covering:

**Past tense (corrections-based):**
- `i ate rice` → `Anga mi cha·aha` ✅
- `i ate` → `Anga cha·aha` ✅
- `i drank water` → `Anga chi ringaha` ✅
- `i slept` → `Anga tusieaha` ✅
- `i ran` → `Anga kataha` ✅

**Negation (corrections-based):**
- `i am not eating` → `Anga cha·ja` ✅
- `i did not eat` → `Anga cha·ja-aha` ✅
- `i will not go` → `Anga re·ang-ja-gen` ✅
- `do not go` → `Re·angna-be` ✅

**Genitive/possessive (corrections-based):**
- `my dog` → `ang-ni achak` ✅
- `my name` → `ang-ni ming` ✅
- `my mother` → `ang-ni ama` ✅
- `your name` → `nang-ni ming` ✅
- `her name` / `his name` → `ua-ni ming` ✅

**Locative (corrections-based):**
- `at home` → `nok-o` ✅
- `in the market` → `bajal-o` ✅
- `at school` → `skul-o` ✅
- `in meghalaya` → `Meghalaya-o` ✅

**Sleep fix:**
- `i want to sleep` → `Anga tusina sikenga` ✅ (fixed from `tusia·na` → `tusina`)
- `sleep` (standalone) → `Tusibo` ⚠️ SEE NOTE BELOW

---

## ONE ISSUE TO FIX IMMEDIATELY

### `sleep` standalone → wrong output
**Current:** `"sleep"` → `"Tusibo"` [correction]
**Problem:** `Tusibo` = imperative ("Sleep!" — command to someone).
As a standalone noun/infinitive, `sleep` should = `tusina`.

**Fix in `src/data/corrections.json`:**
```json
"sleep": "tusina"
```
(Change `Tusibo` → `tusina` for the `"sleep"` key only.)

**Why:**
| Form | Garo | Use |
|---|---|---|
| `go to sleep` / `sleep!` | `Tusibo` | Imperative — telling someone to sleep ✅ keep |
| `sleep` (noun/infinitive) | `tusina` | Infinitive form |
| `i want to sleep` | `Anga tusina sikenga` | Already correct ✅ |
| `i slept` | `Anga tusieaha` | Past tense ✅ |

---

## PRIORITY TASKS FOR THIS SESSION

Read `docs/INSTRUCTIONS_FOR_CLAUDE_A.md` for full details.
Summary of what Claude B researched and needs you to implement:

### P1 — Apostrophe normalization at INPUT level
Currently you have duplicate correction entries for `let's/lets` variants.
Fix the root cause — normalize input BEFORE any lookup in `translationEngine.js`:

```js
// Add at top of translate() function, before corrections lookup:
const normalized = lower
  .replace(/\blets\b/g, "let's")
  .replace(/\bdont\b/g, "don't")
  .replace(/\bdoesnt\b/g, "doesn't")
  .replace(/\bdidnt\b/g, "didn't")
  .replace(/\bcant\b/g, "can't")
  .replace(/\bim\b/g, "i'm");
// then use `normalized` instead of `lower` for lookups
```

### P2 — Past tense ALGORITHMIC (not just corrections)
You've added specific past tense corrections but any new verb fails.
Implement algorithmically in `assembleSentenceSOV`:

```js
// Irregular past → root map (expand this):
const PAST_TO_ROOT = {
  'ate':'cha·', 'went':'re·', 'ran':'kat', 'came':'reba',
  'saw':'nik·', 'gave':'ron·', 'said':'agan', 'drank':'ring',
  'bit':'chika', 'slept':'tusi', 'bought':'brea'
};
// If word is in PAST_TO_ROOT: garoRoot + 'aha'
```

### P3 — Progressive ALGORITHMIC
Detect English `-ing` forms → strip to root → apply Garo `-eng-a`:

```js
// If English word ends in -ing:
// strip -ing → lookup root in dict → root + 'enga'
// e.g. "eating" → "eat" → cha· → "cha·enga"
```

### P4 — Raka (·) vs Hyphen (-) audit — IMPORTANT
Claude B found that some entries use `-` (hyphen) where `·` (raka/glottal stop) is needed.

**Rule:**
- `·` = glottal stop, part of the word itself (phonetic)
- `-` = suffix connector (structural)

**Audit needed in:**
1. `src/translationEngine.js` — IRREGULAR_VERBS, PURPOSE_MAP
2. `src/data/corrections.json` — check all entries
3. `master_dictionary.json` — spot check verb roots

**Examples of what to look for and fix:**
```
WRONG → CORRECT
bi-ko → bi·ko        (plant prefix + case, raka on root)
do-o  → do·o         (bird, already fixed in compiled_dict)
cha-a → cha·a        (eat, raka on verb root)
ron-a → ron·a        (give)
nik-a → nik·a        (see)
```

**Hyphen IS correct (don't change these):**
```
mang-gni   ✅ (classifier-number)
ang-ni     ✅ (pronoun-suffix)
nok-o      ✅ (noun-locative)
cha·-ja    ✅ (raka on root, then hyphen before suffix)
```

### P5 — Book = Ki·tap (not boi)
The Burling academic example used `boi` as a placeholder word for "book".
Our dictionary correctly has `book = Ki·tap`.

**Check corrections.json and IRREGULAR_VERBS:**
If any entry has `boi` as the Garo for "book", replace with `Ki·tap`.

```bash
# Quick check:
grep -n "boi" src/data/corrections.json src/translationEngine.js
```

### P6 — Sleep corrections (from this session)
Add to `src/data/corrections.json`:
```json
"i am sleeping": "Anga tusienga",
"she is sleeping": "Ua tusienga",
"he is sleeping": "Ua tusienga"
```

---

## GRAMMAR RESOURCES AVAILABLE (read these first)

Claude B compiled two reference docs from 13 academic + native sources:

1. **`docs/GARO_GRAMMAR_REFERENCE.md`** — Complete grammar: all tenses, cases,
   pronouns, classifiers, adverbial affixes, 60+ sentence examples. 456 lines.

2. **`docs/GARO_GRAMMAR_VALIDATED.md`** — Cross-source comparison, each rule
   tagged GOLD/HIGH/MEDIUM/LOW trust. Conflicts clearly flagged. 298 lines.

3. **`docs/INSTRUCTIONS_FOR_CLAUDE_A.md`** — Full implementation guide with
   code examples for all 8 priority tasks.

**Key grammar facts confirmed GOLD (Burling 2003):**
- Past tense: verb root + `-aha`
- Present: verb root + `-a`
- Perfect: verb root + `-jok` (change of state, result persists)
- Progressive: verb root + `-eng-a` (A'chik) / `-ing-a` (Mandi)
- Negation: insert `-ja-` between root and tense (`cha·ja` = does not eat)
- Imperative: verb root + `-bo`
- Negative imperative: verb root + `-na-be`
- Object marker: `-ko` (accusative)
- Possessive: `-ni` (genitive)
- Locative: `-o`
- Dative: `-na` (to/for)

---

## QUICK VERIFICATION TEST — RUN AFTER EVERY CHANGE
```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = [
  // Existing passing
  '2 dogs', '3 people', '5 birds',
  "let's go to market", 'dog bit me',
  'this is not good', 'i do not understand',
  'go to sleep', 'i want to sleep',
  // Past tense
  'i ate rice', 'i ran', 'i slept',
  // Negation
  'i am not eating', 'i did not eat',
  // Genitive
  'my dog', 'my name', 'her name',
  // Locative
  'at home', 'in the market',
  // Sleep fix
  'sleep',
];
for (const t of tests) {
  const r = await translate(t);
  console.log(`"${t}" -> "${r.garo}" [${r.method}]`);
}
EOF
npm run build 2>&1 | tail -3
```

**Expected output for `"sleep"` after fix:** `"sleep" -> "tusina" [correction]`
(Currently wrongly returning `Tusibo`)

---

## COMMIT CONVENTION
```bash
git add src/data/corrections.json src/translationEngine.js  # (only your files)
git commit --no-gpg-sign -m "fix(Claude A): description of what you fixed"
git push origin main
```

---

## URGENT — CONTAMINATION ENTRIES IN master_dictionary.json

Claude B found **9 meta/documentation entries** embedded in `master_dictionary.json`
that are leaking into `compiled_dict.json` and are reachable by the engine.

**These must be REMOVED from master_dictionary.json:**

```json
{ "english": "rakka_note",          "garo": "The rakka (·) is a phonetic marker belonging to the root word. Suffixes are always clean strings." }
{ "english": "note",                "garo": "Never translate English SVO word order directly into Garo" }
{ "english": "notes",               "garo": "Khagen = will do/should do (future)" }
{ "english": "suffix",              "garo": "tai" }
{ "english": "state suffix (was/were)", "garo": "-ara" }
{ "english": "location suffix",     "garo": "noun + chi" }
{ "english": "recipient suffix",    "garo": "person + na" }
{ "english": "plural marker",       "garo": "-chim" }
{ "english": "with (suffix)",       "garo": "ming" }
```

**Impact if left in:**
- `"note"` → returns `"Never translate English SVO word order directly into Garo"` to users
- `"suffix"` → returns `"tai"` (meaningless to users)
- `"rakka_note"` → returns full documentation string to users
- All 9 appear in compiled_dict — engine can serve them to live site

**Fix:**
```js
// In master_dictionary.json — delete all 9 entries above
// Then run: npm run build  (prepare-data.js will recompile compiled_dict)
```

**Note on grammar info in these entries:**
Some contain useful facts (e.g. `-ara` for state suffix, `-chim` for plural).
Move these to `docs/GARO_GRAMMAR_REFERENCE.md` if not already there — don't lose the knowledge,
just remove it from the dictionary where it doesn't belong.

---

_Prepared by Claude B — Platform Side_
_Full grammar research in docs/GARO_GRAMMAR_VALIDATED.md_
