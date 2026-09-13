# Claude B Handoff — `mang` classifier: remove raka dot (2026-09-13)

## Finding
Project Owner directive (chat, 2026-09-13): the `mang` classifier
(animals/birds) does not take a raka dot (`·`) before its attached
number suffix. This reverses the prior standing rule
(RULE-038.yaml / NV-124), which stated `mang` takes a dot like
`sak`/`gong`/`king`.

## What Claude A fixed (data layer only)
- `master_dictionary.json`: 119 rows, `<noun> mang·<suffix>` →
  `<noun> mang<suffix>` (e.g. `achak mang·gni` → `achak manggni`).
  Scoped strictly to the classifier-composition pattern — unrelated
  words containing the substring `mang·` (`mang·rak·a`=healthy/strong,
  `mang·kal·a`=annoy, etc., 24 rows) and the bare classifier headword
  (`animals`=`mang·`) were left untouched.
- `garo_dictionary.json` (live pipeline source): same 109 fixes.
- `final_entries.json` (orphaned mirror): same 3 fixes.
- `src/data/corrections.json`: `"i have two dogs"` fixed to
  `Ango achak manggni donga`.
- Test files updated for compiled-data-sourced assertions only:
  `tests/unit/rc037_bird_classifier.test.js`,
  `tests/unit/translationEngine.test.js`,
  `tests/unit/bug5_counting_phrase_es_plurals.test.js`.

## What's still open — engine code, not touched
`src/garo_classifier.js` line 122:
```js
const RAKA_CLASSIFIERS = new Set(['mang', 'ge', 'gong', 'te', 'king']);
```
`mang` needs removing from this set so the runtime classifier-
composition fallback (used for nouns with no exact `compiled_dict.json`
entry) stops inserting a dot. Confirmed live: `translate("six dogs")`
(no dedicated compiled entry) still returns `achak mang·dok` via the
fallback path — this is the one remaining place the dot ships.

Two test files were deliberately **not** touched, since they assert
current (unfixed) engine behavior and would break once you remove
`mang` from `RAKA_CLASSIFIERS`:
- `tests/unit/rong_classifier.test.js` (`countNoun('achak', 1, 'dog')`
  → `'achak mang·sa'`, `countNoun('do·a', 10, 'bird')` →
  `'do·a mang·chiking'`)
- `tests/unit/translationEngine.test.js` line ~1428
  (`six dogs` classifier-fallback test, expects `'achak mang·dok'`)

`tests/unit/prepare-data.test.js` (line 67-74) uses `'achak mang·gni'`
as an arbitrary fixture string for pickPrimary merge-logic testing —
not linguistically load-bearing, no change needed either way, flagged
only for completeness.

## Recommended fix
Remove `'mang'` from `RAKA_CLASSIFIERS`, update the two engine-behavior
test files above to the no-dot forms, rebuild, re-verify `six dogs`
and any other unseeded-noun composition live.
