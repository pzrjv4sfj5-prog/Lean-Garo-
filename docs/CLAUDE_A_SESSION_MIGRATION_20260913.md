# Claude A Session Migration — 2026-09-13

## Resync on arrival
Cloned fresh (new PAT pasted live, session-scoped only, never embedded
in any file). `git fetch` + HEAD verification: origin/main was at
`3d23c41`, one commit ahead of the 20260912 Claude A close (`4fc4fa9`)
— that extra commit was Claude D's informational report on 6 more
`garo_dictionary.json`-suppression-risk records, no action required.
Repo confirmed clean, gate green, no drift beyond that one doc-only
commit.

## Work this session (small-batch mode, each item pushed individually
per the multi-Claude push-collision protocol — commit → fetch →
compare HEAD → rebase → rebuild → re-test → push)

### 1. New sentence: "i have three fish"
Added `Ango na·tok mang·gittam donga` (later corrected, see #2/#3) as
VERIFIED/HIGH, composed entirely from already-verified components
(Ango possessive-existential + na·tok mang·gittam "three fish" +
donga existential), same class as the standing "my X" composition
precedent — no new native evidence needed. Pushed at HEAD `e09d352`.

### 2. Raka fix: `mang·gittam` → `manggittam` (scoped)
Project Owner directive: `mang·gittam` has no raka dot. Fixed 9
`master_dictionary.json` rows + `garo_dictionary.json` + 2 test files.
Pushed at HEAD `0dcec21`.

### 3. Raka fix broadened: `mang` classifier never takes a dot
Project Owner directive generalized #2: the `mang` classifier takes no
raka dot before ANY number suffix (reverses the prior standing
RULE-038/NV-124 position that `mang` behaves like `sak`/`gong`/`king`).
Fixed 119 `master_dictionary.json` rows + 109 in `garo_dictionary.json`
+ 3 in `final_entries.json` + 1 in `corrections.json`, scoped strictly
to the `<noun> mang·<suffix>` classifier-composition pattern — the 24
unrelated words containing the substring `mang·` (`mang·rak·a`=healthy/
strong, `mang·kal·a`=annoy, etc.) and the bare classifier headword
(`animals`=`mang·`) were left untouched. 3 test files updated for
compiled-data-sourced assertions only.
**Not fixed (engine code, Claude B territory):**
`src/garo_classifier.js`'s `RAKA_CLASSIFIERS` set still contains
`'mang'`, so the runtime classifier-composition fallback (used when a
noun has no exact `compiled_dict.json` entry, e.g. `translate("six
dogs")`) still inserts the dot. Two test files
(`rong_classifier.test.js`, and the `six dogs` assertion in
`translationEngine.test.js`) were deliberately left asserting the OLD
(dotted) value since they test current actual engine behavior.
Handoff: `docs/CLAUDE_B_HANDOFF_20260913_mang_raka_removal.md`.
Pushed at HEAD `22b3e6d`.

### 4. Diagnosed (not fixed) — object-final "?" breaks interrogative composition
Reported: `"did you eat rice?"` → `Na·a Mi Cha·a` (no `?`, no
interrogative suffix, `sov-assembly` fallback, 0.75 confidence) instead
of a proper interrogative, while `"did you eat?"` (no object) works.
**Root cause traced to `src/grammarEngine.js` line 584**: the object-
word push uses the raw token, unlike every other extraction point in
that file which strips punctuation first. When the object is
sentence-final, it keeps the trailing `?` (`"rice?"`), the dictionary
lookup fails → `object.garo = '[UNKNOWN]'` →
`sentenceBuilder.js`'s `if (result.includes('[UNKNOWN]')) return null`
bails the whole grammar-assembly step → falls through to
`assembleSentenceSOV`, which has no question-marking logic at all.
Confirmed the same bug reproduces for `"did you eat water?"`.
`"did you drink water?"` only avoids it because that exact phrase is a
`corrections.json` hardcode that short-circuits before this code runs.
This is pure engine code (Claude A does not touch it) — full trace and
suggested fix in
`docs/CLAUDE_B_HANDOFF_20260913_object_question_UNKNOWN.md`.
**Open native-evidence question for the Project Owner** (not
resolved): once fixed, should `"did you eat rice?"` use `-hama` (per
the existing citation `"did you eat food"` → `Na·a Mi Cha·ahama?`) or
`-gama` (the Owner's proposed form, no citation found for `eat`+object
using `-gama`)? Left open, not guessed.
Pushed (diagnosis-only, no data/code fixed) at HEAD `d1cefdb`.

### 5. Confirmed existing: "when did you eat?"
Owner supplied `Na·a basako cha·aha?` — already on file verbatim in
`corrections.json`, already live, already correct. No change made.
Useful data point: confirms wh-questions take plain past `-ha`, not
the yes/no interrogative `-hama`/`-gama` (the question word itself
carries the question force).

### 6. Spelling fix: `basaku` → `basako` ("when")
Project Owner directive: `Basako` (already VERIFIED/HIGH as the base
"when" entry) is correct; `basaku` was a spelling error appearing in 2
places. Full repo audit found 10 total occurrences; scoped the fix to
live data + one active reference doc, left 6 historical
transcripts/dated-briefs untouched to preserve the evidence chain
(rewriting a transcript of what was actually recorded would falsify
it):
- **Fixed:** `src/data/corrections.json` ("when did you come", "when
  will you come"), `docs/THANGSENG_RULES_LOOKUP.md` (active
  pre-change reference table).
- **Left as-is (historical):** `docs/CLAUDE_B_RESYNC_SWEEP_20260819_data.json`,
  `docs/NOTE_FOR_CLAUDE_A_20260625.md`,
  `docs/THANGSENG_RELAY_TABLE_20260821B.md`,
  `docs/THANGSENG_RELAY_BATCH_20260820.md`,
  `docs/THANGSENG_NATIVE_VALIDATION.md`,
  `docs/IMPROVEMENT_BRIEF_CLAUDE_A.md`, `docs/GARO_GRAMMAR_REFERENCE.md`
  (self-marked SUPERSEDED).
Pushed at HEAD `86d83ad`.

## Gate status throughout
Green at every push: 8547/8547 dictionary entries, 9/9 grammatical
corrections, 0 new repository-intelligence violations, 395/395 unit
tests. Zero runtime errors confirmed live for every changed/composed
sentence at each step.

## Runtime Handoff to Claude B (mandatory section)
Two open items, both fully diagnosed, neither touched by Claude A:
1. `docs/CLAUDE_B_HANDOFF_20260913_mang_raka_removal.md` — remove
   `'mang'` from `RAKA_CLASSIFIERS` in `src/garo_classifier.js`;
   update `rong_classifier.test.js` and the `six dogs` assertion in
   `translationEngine.test.js` to match once fixed.
2. `docs/CLAUDE_B_HANDOFF_20260913_object_question_UNKNOWN.md` — strip
   trailing punctuation before the object-word push at
   `grammarEngine.js` line 584 (and/or before the lookups at ~635/~712)
   so sentence-final objects in questions stop resolving to
   `[UNKNOWN]` and falling through to the non-interrogative
   `sov-assembly` fallback.

## Still open / not yet started
- The 68 real `verified_high` ties (P0) + the `apple`/`te·spu` tie —
  Project Owner named `audit/segregation/CLAUDE_A_EVIDENCE_PACKAGE_REFRESH.md`
  as the source list (landed mid-session via Claude D, including the
  apple addendum) — not yet opened/adjudicated, next task pending
  Owner's go-ahead.
- The `-hama` vs `-gama` interrogative-suffix question from item #4
  above, still unresolved.

## Repository status at close (verified, not asserted)
- HEAD: `86d83ad`
- origin/main: `86d83ad` — **match confirmed**
- `git status`: clean
- WORKSTATE.yaml: updated this close (claude_a.next_action pointer)
- SESSION_BOOTSTRAP.md: no rule changes this session, not touched
- Migration doc: this file, complete
- No local commits ahead of origin, no uncommitted changes
- Native-validation status: no NV items opened or closed this session;
  two engine bugs handed off to Claude B; one interrogative-suffix
  question left open for the Project Owner
