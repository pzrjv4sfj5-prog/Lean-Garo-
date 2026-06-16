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
git remote set-url origin https://[GITHUB_PAT]@github.com/pzrjv4sfj5-prog/Lean-Garo-.git
git pull origin main
```

---

## FILE OWNERSHIP — CRITICAL

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
garo_dictionary.json        ← KEY FILE THIS SESSION
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

## CURRENT STATE

```
Last commit: [see git log -1 --oneline after pull]
Build: ✅ PASS
Dictionary: 7,330 entries (master_dictionary.json)
compiled_dict: 5,665 keys
Corrections: 115 entries
```

---

## WHAT CLAUDE A DID LAST SESSION (7f2c34e)

Good work — you added 31 corrections:
- ✅ Past tense: `i ate rice`, `i ran`, `i slept`, `i drank water`
- ✅ Negation: `i am not eating`, `i did not eat`, `i will not go`, `do not go`
- ✅ Genitive: `my dog`, `my name`, `my mother`, `your name`, `her name`
- ✅ Locative: `at home`, `in the market`, `at school`
- ✅ Sleep: `sleep=tusina`, `i want to sleep`, `i slept`, `i am sleeping`
- ✅ Progressive: `i am going`, `i am sleeping`
- ✅ Apostrophe normalization added

---

## CURRENT TEST BASELINE (run to verify before starting)

```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = [
  '2 dogs','3 people','5 birds',
  "let's go to market","dog bit me",
  'this is not good','i do not understand',
  'go to sleep','i want to sleep','sleep',
  'i am eating','my dog','at home',
];
for (const t of tests) {
  const r = await translate(t);
  console.log(`"${t}" -> "${r.garo}" [${r.method}]`);
}
EOF
```

Expected issues you will see:
- `"3 people"` → `"gittam"` [morphology] ❌ REGRESSION
- `"i am eating"` → `"Anga chaoenga"` ❌ wrong root (`chao` instead of `cha·`)

---

## PRIORITY TASKS THIS SESSION

### TASK 1 — URGENT: Clean `garo_dictionary.json` contamination

**Root cause found by Claude B:**
`prepare-data.js` merges THREE files:
```js
const dict1 = normalizeFile('garo_dictionary.json');   // ← CONTAMINATED
const dict2 = normalizeFile('garo_dictionary (2).json');
const dict3 = normalizeFile('master_dictionary.json'); // clean ✅
const merged = { ...dict1, ...dict2, ...dict3 };
```

`garo_dictionary.json` has 109 contamination entries — grammar notes,
suffix tables, documentation — embedded as dictionary entries.
They survive into `compiled_dict.json` because `master_dictionary.json`
doesn't always override them.

**Fix — run this script:**
```js
// save as clean_garo_dict.js in repo root, then: node clean_garo_dict.js
const fs = require('fs');
const dict = JSON.parse(fs.readFileSync('garo_dictionary.json'));
const BAD_KEYS = [
  'note','notes','suffix','rakka_note',
  'state suffix (was/were)','location suffix',
  'recipient suffix','plural marker','with (suffix)'
];
const cleaned = dict.filter(e => {
  const eng = (e.english || e.English || '').trim().toLowerCase();
  return !BAD_KEYS.includes(eng);
});
console.log(`Removed ${dict.length - cleaned.length} bad entries`);
fs.writeFileSync('garo_dictionary.json', JSON.stringify(cleaned, null, 2));
```
Then: `npm run build`

**Verify clean:**
```bash
node -e "
const c = require('./src/compiled_dict.json');
const bad = ['note','notes','suffix','plural marker',
  'state suffix (was/were)','location suffix',
  'recipient suffix','with (suffix)'].filter(k => c[k]);
console.log('Bad remaining:', bad.length, bad);
"
```
Expected: `Bad remaining: 0 []`

---

### TASK 2 — Fix `3 people` regression

**Current:** `"3 people"` → `"gittam"` [morphology] ❌
**Expected:** `"3 people"` → `"sak-gitam mande"` [classifier] ✅

This was working before your last commit. Something in the classifier/number
chain broke. Check `src/garo_classifier.js` and `src/number_engine.js`.

Likely cause: `garo_dictionary.json` may have a `"people"` or `"person"` entry
that the morphology step is hitting before the classifier step.

**Quick diagnosis:**
```bash
node -e "
const c = require('./src/compiled_dict.json');
console.log('people:', c['people']);
console.log('person:', c['person']);
console.log('3 people:', c['3 people']);
console.log('mande:', c['mande']);
"
```

---

### TASK 3 — Fix `i am eating` → wrong root `chao`

**Current:** `"i am eating"` → `"Anga chaoenga"` [exact-phrase] ❌
**Expected:** `"Anga cha·enga"` (progressive of `cha·` = eat)

The `chao` root is coming from a `garo_dictionary.json` entry.
Check:
```bash
node -e "
const d = JSON.parse(require('fs').readFileSync('garo_dictionary.json'));
const e = d.filter(x => x.english && x.english.toLowerCase().includes('eat'));
e.forEach(x => console.log(JSON.stringify(x)));
"
```
Find the entry with `chao` and either fix it or add a correction:
```json
"i am eating": "Anga cha·enga"
```

---

### TASK 4 — Apostrophe normalization (if not already in engine)

Check if input normalization is in `translationEngine.js`.
If not, add before the corrections lookup:
```js
const normalized = lower
  .replace(/\blets\b/g, "let's")
  .replace(/\bdont\b/g, "don't")
  .replace(/\bdoesnt\b/g, "doesn't")
  .replace(/\bdidnt\b/g, "didn't")
  .replace(/\bcant\b/g, "can't")
  .replace(/\bim\b/g, "i'm");
```

---

### TASK 5 — Past tense ALGORITHMIC

You've added specific corrections — great. But implement algorithmically
so ANY verb works without a specific correction entry.

**Rule (Burling GOLD):** past tense = verb root + `-aha`

```js
// Add to IRREGULAR_VERBS or new PAST_TO_ROOT map:
const PAST_TO_ROOT = {
  'ate': 'cha·', 'went': 're·ang', 'ran': 'kat',
  'came': 'reba', 'saw': 'nik·', 'gave': 'on·',
  'said': 'agan·', 'drank': 'ring·', 'bit': 'chika',
  'slept': 'tusi', 'bought': 'brea', 'fell': 'ga·ak',
};
// Then: if word in PAST_TO_ROOT → garoRoot + 'aha'
```

---

### TASK 6 — Progressive ALGORITHMIC

```js
// If English word ends in -ing (gerund):
// strip -ing → lookup root → root + 'enga'
// e.g. "eating" → "eat" → cha· → "cha·enga"

// Handle common -ing forms explicitly:
const PROGRESSIVE_MAP = {
  'eating': 'cha·enga', 'going': 're·angenga',
  'running': 'katenga', 'sleeping': 'tusienga',
  'coming': 'rebaenga', 'seeing': 'nik·enga',
  'speaking': 'agan·enga', 'giving': 'on·enga',
  'buying': 'brea-enga',
};
```

---

### TASK 7 — Raka (·) vs Hyphen (-) audit

**Rule:** `·` (U+00B7) = glottal stop, part of the word.
`-` = suffix connector, structural only.

Check IRREGULAR_VERBS in `translationEngine.js` for entries using `-`
where `·` should be. Example patterns to look for:
```
cha-a  → should be cha·a
re-anga → should be re·anga
nik-a  → should be nik·a
on-a   → should be on·a
```

Hyphen IS correct in: `mang-gni`, `sak-gitam`, `ang-ni`, `nok-o`
(classifier-number, pronoun-case, noun-locative separators)

---

## ⚠️ TASK 2 UPDATE — ROOT CAUSE FOUND (Claude B verified)

The `3 people` bug is **NOT** a dictionary issue — it's a **code bug** in
`src/garo_classifier.js`, line 90:

```js
const singular = englishNoun.replace(/s$/, '');
```

This blindly strips trailing `s` from ANY noun. For `"people"` this produces
`"peopl"` (broken) instead of `"person"`. The lookup then fails to find `"peopl"`
in the dictionary and falls through to a bad fallback.

**Fix — add an irregular plural exceptions map before the regex strip:**
```js
const IRREGULAR_PLURALS = {
  'people': 'person',
  'children': 'child',
  'men': 'man',
  'women': 'woman',
  'mice': 'mouse',
  'feet': 'foot',
  'teeth': 'tooth',
};

export function parseCountingPhrase(input) {
  if (!input) return null;
  const lower = input.toLowerCase().trim();
  const words = lower.split(/\s+/);
  if (words.length < 2) return null;
  const count = parseCount(words[0]);
  if (!count) return null;
  const englishNoun = words.slice(1).join(' ');
  const singular = IRREGULAR_PLURALS[englishNoun] || englishNoun.replace(/s$/, '');
  return { count, englishNoun: singular, originalNoun: englishNoun };
}
```

**Also note:** `compiled_dict["person"]` currently returns `"man-de"` (hyphen).
Should likely be `mande` per raka rules — verify and fix if this is a typo,
not an intentional hyphen.

**Verify after fix:**
```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const r = await translate('3 people');
console.log(r.garo, r.method);
// Expected: "sak-gitam mande" [classifier]
EOF
```

---



```
docs/GARO_GRAMMAR_REFERENCE.md    — Complete grammar, 456 lines
docs/GARO_GRAMMAR_VALIDATED.md    — 13 sources cross-compared, trust levels
docs/INSTRUCTIONS_FOR_CLAUDE_A.md — Previous detailed instructions
docs/pending_corrections.md       — Pending items list
```

**Key validated grammar (Burling GOLD):**
```
Present:    verb root + -a        (cha·a = eats)
Past:       verb root + -aha      (cha·aha = ate)
Perfect:    verb root + -jok      (cha·jok = has eaten)
Prog:       verb root + -eng-a    (cha·enga = is eating)
Future:     verb root + -gen      (cha·gen = will eat)
Negative:   -ja- infix            (cha·ja = does not eat)
Imperative: verb root + -bo       (cha·bo = Eat!)
Neg imp:    verb root + -na-be    (cha·na-be = Don't eat!)
```

---

## ⚠️ NEW BUG — Word Order Inconsistency in Past-Tense Questions

**Found by native speaker correction (2026-06-16):**

`"did you eat food"` currently produces `"Na·a Cha·a Mi"` — **WRONG**.
Verb placed before Object, breaking SOV order.

**Correct (native speaker verified):** `"Na·a Mi Cha·a"` (Subject → Object → Verb)

**The engine is internally INCONSISTENT** — compare:
```
"i eat rice"          -> "Anga mi-ko cha·-a"      [grammar-assembly]  ✅ correct SOV
"have you eaten food"  -> "Na·a Mi cha·manaha"     [sov-assembly]      ✅ correct SOV
"did you eat food"     -> "Na·a Cha·a Mi"          [sov-assembly]      ❌ WRONG — verb before object
```

Both "have you eaten" and "did you eat" go through `sov-assembly`, but only
the perfect-tense ("have you eaten") path orders correctly. The simple-past
question path ("did you eat") has a bug — likely the question-detection logic
("did" + verb) reorders the Object and Verb tokens incorrectly, or treats
"did you eat" as a fixed two-word verb phrase and appends the object after
instead of before.

**Required fix:** ALL declarative AND question sentences must follow
Subject → Object → Verb. Order does not change for questions in Garo —
only a question particle/suffix (`-ma`) is added, the noun-verb order stays SOV.

```
Pattern to enforce everywhere in src/translationEngine.js (sov-assembly + grammar-assembly):
  Subject (no marker) + Object (-ko if needed) + Verb (+ -ma if question)

Examples:
  "did you eat food?"      -> "Na·a mi-ko cha·aha ma?"   (Subject + Object + Verb-past-question)
  "have you eaten food?"   -> "Na·a mi-ko cha·jok ma?"   (Subject + Object + Verb-perfect-question)
  "do you eat rice?"       -> "Na·a mi-ko cha·a ma?"     (Subject + Object + Verb-present-question)
```

> Native speaker also confirmed: `"Naa Mi cha.aha ma?"` = "Have you eaten food?"
> Note this uses `cha.aha` (simple past) + `ma` (question) for "have you eaten" —
> slightly different from the `cha·manaha`/`cha·jok` perfect forms documented
> earlier. May indicate simple past + question particle is the more natural
> spoken form vs the formal perfect aspect. Worth checking with native speaker
> which is more commonly used in casual speech.

**Action for Claude A:**
1. Find the question-detection code path for "did [subject] [verb] [object]" in `sov-assembly`
2. Ensure Object is placed BEFORE Verb, not after, regardless of tense/question status
3. Add `-ma` as question suffix on the verb (not as a separate trailing word)
4. Test all four combinations: statement/question × simple-past/perfect

**Add to corrections.json as immediate patch while algorithmic fix is pending:**
```json
"did you eat food": "Na·a mi-ko cha·aha ma",
"have you eaten food": "Na·a mi-ko cha·aha ma",
"did you eat": "Na·a cha·aha ma",
"do you eat rice": "Na·a mi-ko cha·a ma"
```

---

## FULL VERIFICATION TEST — RUN AFTER EVERY CHANGE

```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = [
  // Classifiers
  '2 dogs','3 people','5 birds','4 cats','one ant',
  // Core corrections
  "let's go to market","lets go to market",
  'dog bit me','this is not good','i do not understand',
  // Sleep
  'go to sleep','i want to sleep','sleep','i slept',
  // Progressive
  'i am eating','i am going','i am sleeping',
  // Past
  'i ate rice','i ran','i drank water',
  // Negation
  'i am not eating','i did not eat','do not go',
  // Genitive + Locative
  'my dog','my name','at home','in the market',
  // Phrase map
  'hello','thank you','good morning','i love you',
];
for (const t of tests) {
  const r = await translate(t);
  console.log(`"${t}" -> "${r.garo}" [${r.method}]`);
}
EOF
npm run build 2>&1 | tail -3
```

**Key expected outputs after fixes:**
```
"3 people"    -> "sak-gitam mande" [classifier]  ← fix TASK 2
"i am eating" -> "Anga cha·enga"   [correction]  ← fix TASK 3
"note"        -> "[UNKNOWN]"        [passthrough] ← fix TASK 1
"suffix"      -> "[UNKNOWN]"        [passthrough] ← fix TASK 1
```

---

## COMMIT CONVENTION
```bash
git add src/data/corrections.json src/translationEngine.js garo_dictionary.json
# (only your files — never touch src/pages/, src/components/, src/App.jsx)
git commit --no-gpg-sign -m "fix(Claude A): description"
git push origin main
```

---

_Prepared by Claude B — Platform Side_
_Grammar research: docs/GARO_GRAMMAR_VALIDATED.md_
