# CLAUDE A BRIEF — Full Session Recap
_Prepared by Claude B — 2026-06-17_
_Covers everything since the last full handoff_

---

## IDENTITY & SETUP
You are Claude A — Engine Side on Lean-Garo.
Repo: `https://github.com/pzrjv4sfj5-prog/Lean-Garo-`
Live Site: `https://lean-garo.onrender.com`

```bash
git config --global commit.gpgsign false
git config --global user.email "pzrjv4sfj5@privaterelay.appleid.com"
git config --global user.name "pzrjv4sfj5-prog"
git pull origin main
```

File ownership unchanged — you own `src/translationEngine.js`,
`src/garo_classifier.js`, `src/number_engine.js`, `src/gemini.js`,
`server.js`, `src/data/phrase_maps.js`, `src/data/corrections.json`,
`master_dictionary.json`, `src/compiled_dict.json`, `garo_dictionary.json`.
Claude B owns `src/pages/`, `src/components/`, `src/App.jsx`, `vite.config.js`,
`docs/`.

---

## CURRENT STATE
```
Last commit: fd1a5e5
Build: ✅ PASS
Corrections: 294 entries
```

---

## WHAT HAS BEEN DONE (chronological, since last brief)

### 1. Contamination cleanup ✅ DONE
109 meta/documentation entries (grammar notes embedded as dictionary
entries, e.g. `"note"` returning grammar advice as if it were a translation)
were found in `garo_dictionary.json` and removed. Verified clean — `"note"`,
`"suffix"` etc. no longer leak documentation text to users.

### 2. `3 people` classifier bug ✅ FIXED
Root cause was a code bug in `src/garo_classifier.js` — line 90 blindly
stripped trailing `s` from any noun (`englishNoun.replace(/s$/, '')`), which
broke "people" → "peopl" (garbage). Fixed with an irregular plurals map.
Verified working: `"3 people"` → `"sak-gitam man·de"` (classifier).

### 3. `i am eating` wrong root ✅ FIXED
Was returning `"Anga chaoenga"` (wrong root `chao`). Now correctly
`"Anga cha·enga"`.

### 4. Algorithmic past tense + progressive ✅ DONE
Added `PAST_TO_ROOT` style mapping and `-enga` progressive suffix detection
so common verbs work without needing individual correction entries.

### 5. Bundle size investigation — PARTIAL (not a real fix)
Added `manualChunks` vendor split in `vite.config.js` (Claude B's file).
**Important: this did NOT reduce actual bundle size** — total weight is
unchanged (~514KB), just split into two cacheable files. The Vite warning
disappeared only because the warning threshold was raised to 600KB. A real
fix requires lazy-loading `compiled_dict.json` at runtime instead of bundling
it inline — this requires editing `translationEngine.js` (your file) and
has NOT been done yet. Flagging again here so it isn't forgotten.

### 6. Word order bug — "did you eat food" ✅ FIXED
Was producing `"Na·a Cha·a Mi"` (verb before object — wrong, broke SOV).
Native speaker confirmed correct order. Fixed via correction entries
following Subject + Object + Verb + `-ma` (question) pattern.

### 7. SOV Question Sentences — Batch 1 ✅ APPLIED (65 entries)
Algorithmically generated (not individually native-verified) — 25 verbs ×
3 question forms (did you / have you / are you). Script:
`docs/add_sov_questions.cjs`. Applied successfully, all verified working.

### 8. Native Speaker Batch 2 ✅ APPLIED (29 entries)
Direct native speaker sentences — dog bite/chase, body aches (itching,
backbone, throat), water/well, snake bite, "let's eat" variants. Script:
`docs/add_native_batch2.cjs`. Applied, verified working.

### 9. `anga·ko` → `Angko` standardization ✅ APPLIED
User requested global cleanup of this contracted pronoun form. Fixed in
docs (Claude B files) directly; fixed in `corrections.json` via
`docs/fix_angako.cjs` — applied successfully, 3 occurrences corrected.

### 10. Tense distinction confirmed — "dog bit me" vs "dog bite me"
User confirmed this is a genuine tense distinction (not an error):
- `chikaha` (with `-aha` suffix) = past ("bit")
- `chika` (no suffix) = present/habitual ("bites")
This validates the engine's `-aha` past tense rule with a real example.

### 11. Conversational Batch 3 ✅ APPLIED (35 entries)
Greetings, directions, market/shopping, family, health/feelings. Built
mostly from dictionary-verified entries (several tagged
`VERIFIED/HIGH/200sentences` — found in `final_entries.json`/`sentences200.json`).
4 risky guessed entries were dropped rather than shipped unverified
("my stomach hurts", "i need a doctor", "what happened", "how far is it").
Script: `docs/add_conversation_batch3.cjs`. Applied, verified working.

### 12. Native Batch 4 ✅ APPLIED (9 entries)
Appearance/character descriptions: girl is beautiful, boy is handsome,
big man, he is very tall, child active in studies, boyfriend/girlfriend's
soul is pure. Note: `mikchagipa` is gender-neutral (covers both
boyfriend/girlfriend) — this is intentional, not a duplicate-key error.
Script: `docs/add_native_batch4.cjs`. Applied, verified working.

### 13. Family vocabulary corrections — ⚠️ SCRIPTED BUT **NOT YET APPLIED**
Native speaker corrected:
```
father: apa -> baba
mother: ama -> aai
wife: jik -> jikgipa
husband: ang-se -> sejipa
i have two children: "Ang·o gini de dong·a" -> "Ang·o Bi'sa sak gini dong·a"
i am sad: "Anga duk ong·enga" -> "Anga duk ong·a"
```
Script ready and tested: `docs/fix_family_words_and_raka.cjs`
(this script ALSO does item 14 below in the same run)
**ACTION NEEDED: run this script.**

### 14. GLOBAL HYPHEN → RAKA CONVERSION — ⚠️ SCRIPTED BUT **NOT YET APPLIED**
**This reverses earlier guidance.** Previously we said structural hyphens
(`mang-gni`, `ang-ni`) should stay as hyphens. Native speaker has now
explicitly confirmed twice: **ALL hyphens become raka (·), no exceptions.**

Two scripts ready and tested by Claude B (locally, then reverted since these
are your files):
- `docs/fix_family_words_and_raka.cjs` — fixes `corrections.json` (vocab + raka)
- `docs/global_hyphen_to_raka.cjs` — fixes 5 dictionary files:
  `garo_dictionary.json` (1,273 hyphens), `master_dictionary.json` (6,799),
  `doc7_entries.json` (500), `final_entries.json` (5,691),
  `sentences200.json` (11) — **14,274 total hyphens to convert**

**CRITICAL — code-level hyphens also need manual fixing, scripts won't catch these:**

`src/garo_classifier.js` line 71:
```js
// CURRENT: return `${classifier}-${getClassifierSuffix(count)}`;
// FIX:     return `${classifier}·${getClassifierSuffix(count)}`;
```
Also check lines 66 and 78 (`chiking-ma-` pattern, same fix).

`src/translationEngine.js` — 4 locations (lines ~199, 290, 292, 298) where
`'-ko'` and `'-na'` are concatenated as literal strings — change to `'·ko'`
and `'·na'`. Full line-by-line detail in `docs/GLOBAL_RAKA_CONVERSION_HANDOFF.md`.

**Full instructions, all line numbers, and verification tests are in:**
`docs/GLOBAL_RAKA_CONVERSION_HANDOFF.md`

**ACTION NEEDED — run in this order:**
```bash
node docs/fix_family_words_and_raka.cjs
node docs/global_hyphen_to_raka.cjs
# then manually edit garo_classifier.js and translationEngine.js per the doc
npm run build
git add src/data/corrections.json garo_dictionary.json master_dictionary.json \
  doc7_entries.json final_entries.json sentences200.json src/compiled_dict.json \
  src/garo_classifier.js src/translationEngine.js
git commit --no-gpg-sign -m "feat: global hyphen to raka conversion + family vocab fixes (native verified)"
git push origin main
```

---

## VERIFICATION TEST — run after applying items 13 & 14

```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = [
  '2 dogs', '3 people', 'my dog', 'at home', 'this is not good',
  'this is my father', 'this is my mother', 'this is my wife',
  'this is my husband', 'i have two children', 'i am sad', 'did you eat',
];
for (const t of tests) {
  const r = await translate(t);
  const hasHyphen = r.garo.includes('-') ? ' ⚠️ STILL HAS HYPHEN' : '';
  console.log(`"${t}" -> "${r.garo}" [${r.method}]${hasHyphen}`);
}
EOF
```
Goal: zero `⚠️ STILL HAS HYPHEN` warnings in output.

---

## OUTSTANDING / NOT YET DONE

1. **Real bundle size fix** — lazy-load `compiled_dict.json` instead of
   inline bundling (item 5 above). Not started.
2. **Global raka conversion + family vocab** — scripted, tested, NOT applied
   to live repo yet (items 13, 14 above). **This is the priority for this
   session.**
3. **Audit not yet done:** `src/data/dictionary/conversation_patterns.json`
   (11 hyphens, not yet covered by any script), and a full check of
   `IRREGULAR_VERBS`/`PURPOSE_MAP` literal values in `translationEngine.js`
   for any remaining hardcoded hyphens beyond the 4 concatenation points
   already identified.
4. Gemini API key was reported fixed by user but not independently verified
   on the live site (sandbox network restrictions prevent direct testing
   of `lean-garo.onrender.com`).

---

_Prepared by Claude B — Platform Side_
_Detailed technical reference: docs/GLOBAL_RAKA_CONVERSION_HANDOFF.md_
