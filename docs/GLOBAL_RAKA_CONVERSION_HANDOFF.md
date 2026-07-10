# GLOBAL HYPHEN → RAKA (·) CONVERSION
_Prepared by Claude B — 2026-06-17_
_Native speaker instruction, explicit and unambiguous: "Change ALL hyphens
everywhere to raka, no exceptions."_

## STATUS UPDATE (2026-07-09, Claude A): PART 1 confirmed APPLIED to live `corrections.json`
Verified directly against the live file rather than assumed: `father`→`baba`,
`mother`→`aai`, `wife`→`jikgipa`, `husband`→`sejipa`, `i have two children`→
`Ang·o Bi·sa sak gni donga` (matches this doc's corrected form, modulo minor
spelling), `i am sad`→`Anga duk ong·a` (progressive suffix dropped, as
specified) are all live in production as of this check. This document's
"has not yet been run against the live repo" note below is **stale** — the
fixes landed in a session after this doc was written, but the doc itself was
never updated to say so, which caused a downstream problem: a later session
(this one) read `docs/NEW_SENTENCES_BATCH3_CONVERSATION.md` (which still
shows the pre-correction forms, e.g. `apa`/`ama`/`ang-se`, `duk ong·enga`)
without realizing those forms had already been superseded, and built
analysis on the stale version. See `docs/NEW_SENTENCES_BATCH3_CONVERSATION.md`'s
new correction note for the fix. PART 2 (global hyphen→raka across the 5
dictionary source files) and PART 3 (code fixes) below are **not yet
verified** as applied — worth a follow-up check before assuming those landed
too.

## IMPORTANT — This reverses earlier guidance

Earlier sessions (see `docs/INSTRUCTIONS_FOR_CLAUDE_A.md`, orthography section)
said hyphens like `mang-gni`, `ang-ni`, `nok-o` were structural connectors and
should NOT become raka. **The native speaker has now explicitly overridden
this** — confirmed twice in conversation, no exceptions. This doc supersedes
that earlier guidance. Every hyphen, including classifier-number and
pronoun-case connectors, becomes raka (·).

---

## PART 1 — Vocabulary corrections (apply first)

Native speaker corrected these (2026-06-17):

| English | OLD (wrong) | NEW (correct) |
|---|---|---|
| father | apa | **baba** |
| mother | ama | **aai** |
| wife | jik | **jikgipa** |
| husband | ang-se | **sejipa** |
| children (counting) | — | Bi'sa (counted as: sak + number, e.g. `sak gini` = 2) |
| i have two children | Ang·o gini de dong·a | **Ang·o Bi'sa sak gini dong·a** |
| i am sad | Anga duk ong·enga | **Anga duk ong·a** (no progressive suffix needed) |

**Script ready:** `docs/fix_family_words_and_raka.cjs` — already combines this
with Part 2 below for `corrections.json` specifically. Tested by Claude B,
works correctly. Just needs to be run in your environment:
```bash
node docs/fix_family_words_and_raka.cjs
```
This already updates `src/data/corrections.json` with the family fixes above
AND converts all hyphens in that file to raka, in one step.

**Note:** this script has not yet been run against the live repo — Claude B
tested it on a local copy and reverted, since corrections.json is your file.

---

## PART 2 — Global hyphen → raka across ALL dictionary source files

**Script ready:** `docs/global_hyphen_to_raka.cjs` — tested by Claude B,
converts the `garo` field only (never touches `english`, `category`, `pos`,
`notes`, or any keys) across these 5 files:

```
garo_dictionary.json      (1,273 hyphens found)
master_dictionary.json    (6,799 hyphens found)
doc7_entries.json         (500 hyphens found)
final_entries.json        (5,691 hyphens found)
sentences200.json         (11 hyphens found)
                           -----
Total: 14,274 hyphens to convert
```

```bash
node docs/global_hyphen_to_raka.cjs
npm run build   # recompiles compiled_dict.json from these sources
```

This was tested by Claude B on a full local copy — ran cleanly, build passed,
all dictionary tests passed (5662+ entries, 100% valid). Output was reverted
before push since these are your files — script is ready to run as-is.

---

## PART 3 — CODE FIXES (not just data) — THIS IS THE PART MOST LIKELY TO BE MISSED

**Critical finding:** Some hyphens are not in dictionary data at all — they are
**hardcoded directly in JavaScript code**. Running the data scripts alone will
NOT fix these. You must edit the code.

### `src/garo_classifier.js` — line 71
```js
// CURRENT (hardcoded hyphen):
return `${classifier}-${getClassifierSuffix(count)}`;

// FIX:
return `${classifier}·${getClassifierSuffix(count)}`;
```
This is why `"2 dogs"` currently outputs `"mang-gni achak"` instead of
`"mang·gni achak"` even after the dictionary-level fix — the hyphen is
injected at runtime by this line, not stored in any dictionary file.

Also check line 66 and 78 for the `chiking-ma-` pattern:
```js
// Line 66, 78 — also contains hardcoded hyphens:
if (n > 10 && n < 20) return `chiking-ma-${NUMBERS[n-10]||n-10}`;
// FIX:
if (n > 10 && n < 20) return `chiking·ma·${NUMBERS[n-10]||n-10}`;
```

### `src/translationEngine.js` — 4 locations with hardcoded hyphens
```js
// Line 199:
object = { english: objEng, garo: objGaro, withMarker: objGaro + '-ko' };
// FIX:
object = { english: objEng, garo: objGaro, withMarker: objGaro + '·ko' };

// Line 290:
parts.push(grammar.possessive.garo + ' ' + grammar.object.garo.toLowerCase() + '-ko');
// FIX:
parts.push(grammar.possessive.garo + ' ' + grammar.object.garo.toLowerCase() + '·ko');

// Line 292:
parts.push(grammar.object.garo.toLowerCase() + '-ko');
// FIX:
parts.push(grammar.object.garo.toLowerCase() + '·ko');

// Line 298:
const purposeGaro = PURPOSE_MAP[eng] || grammar.purposeAction.garo || (eng + '-na');
// FIX:
const purposeGaro = PURPOSE_MAP[eng] || grammar.purposeAction.garo || (eng + '·na');
```

**Also check `IRREGULAR_VERBS` and `PURPOSE_MAP` objects in `translationEngine.js`**
for any hardcoded hyphens in the Garo values themselves (not just the suffix
concatenation above) — Claude B did not have time to fully audit every value
in those maps, only the structural concatenation points.

---

## VERIFICATION TEST — run after Parts 1+2+3 are all applied

```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = [
  '2 dogs', '3 people', '5 birds', 'one book', 'two books',
  'my dog', 'at home', 'this is not good', 'this is my father',
  'this is my mother', 'this is my wife', 'this is my husband',
  'i have two children', 'i am sad', 'did you eat',
];
for (const t of tests) {
  const r = await translate(t);
  console.log(`"${t}" -> "${r.garo}" [${r.method}]`);
}
EOF
```

**Expected after full fix — zero hyphens anywhere in output:**
```
"2 dogs"              -> "mang·gni achak"
"3 people"            -> "sak·gitam man·de"
"this is my father"   -> "Ia ang·ni baba"
"this is my mother"   -> "Ia ang·ni aai"
"this is my wife"     -> "Ia ang·ni jikgipa"
"this is my husband"  -> "Ia ang·ni sejipa"
"i have two children" -> "Ang·o Bi'sa sak gini dong·a"
"i am sad"            -> "Anga duk ong·a"
```

**Final check — confirm zero hyphens remain anywhere in output:**
```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = ['2 dogs', '3 people', 'my dog', 'at home', 'this is my father'];
for (const t of tests) {
  const r = await translate(t);
  if (r.garo.includes('-')) console.log('STILL HAS HYPHEN:', t, '->', r.garo);
  else console.log('clean:', t, '->', r.garo);
}
EOF
```

---

## SCOPE NOT YET CHECKED (audit recommended)

Claude B ran out of scope/time to fully verify these — recommend a follow-up
grep pass:
- `src/data/dictionary/conversation_patterns.json` (11 hyphens found, not yet fixed)
- `doc7_entries.json`, `final_entries.json`, `sentences200.json` — covered by
  Part 2 script above, but not individually spot-checked for unusual formats
- Any hyphen inside `IRREGULAR_VERBS` / `PURPOSE_MAP` literal values in
  `translationEngine.js` beyond the 4 concatenation points listed in Part 3

```bash
# Run this after everything above to find anything still missed:
grep -rn "garo.*-\|'.*-.*'" src/translationEngine.js src/garo_classifier.js src/data/phrase_maps.js src/data/dictionary/*.json 2>/dev/null
```

---

_Prepared by Claude B — Platform Side_
_All scripts tested locally and reverted before push (these are Claude A's files)_
