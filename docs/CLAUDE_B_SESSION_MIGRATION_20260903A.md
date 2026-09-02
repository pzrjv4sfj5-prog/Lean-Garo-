# Claude B Session Migration — 2026-09-03A (NV-115: confirmed loanwords)

## Scope this session
Project Owner reported that several food/dish words have no Garo
equivalent and should pass through unchanged. Investigated, found a real
fuzzy-match bug, fixed it narrowly.

## What was actually happening
`momo`, `chow`, `maggie`, `paneer`, `panner` had no dictionary entries,
so they fell to step 9 (fuzzy match). Fuzzy match found unrelated
dictionary words within edit-distance 1-2 and confidently "translated"
them as if correct:

| Input | Was fuzzy-matching to | Garo output (wrong) |
|---|---|---|
| momo | moo (d=1) | im·bo·a |
| chow | cow (d=1) | ma·su |
| maggie | magic (d=2) | ban·a |
| paneer | anger (d=2) | Ka·o nanga |
| panner | anger (d=2) | Ka·o nanga |

`paneer butter masala` / `panner butter masala` (multi-word, no dict
entry) were already falling through correctly to passthrough, just with
a `[UNKNOWN]` tag appended — not wrong, but not clean either.

## Fix — NV-115
Added `src/data/confirmed_loanwords.json` (exact-match list: momo, chow,
maggie, paneer, panner, paneer butter masala, panner butter masala).
Checked in `translationEngine.js` as a new step 8.5, immediately before
fuzzy match (step 9) — intercepts only these confirmed items, exact
match against the full cleaned input (not per-word, so this doesn't
affect these words if they appear inside a longer sentence). Returns
Title Case passthrough, method `loanword-passthrough`, confidence 0.95
(confirmed fact, not a guess) — no `[UNKNOWN]` tag, matching the
existing capitalized-loanword convention already used elsewhere (e.g.
NV-103's object-noun fallback for "English").

## "roll" — deliberately NOT added, left for clarification
The Project Owner's list included "roll" alongside the food items. But
`master_dictionary.json` already has an existing, separately-attested
entry: `roll` → `Romroma` ("to roll", a verb — also cross-referenced in
`compiled_dict_alternates.json` as `"to roll": ["Romroma", "A·dubeko
romroma"]`). This is a genuine ambiguity: English "roll" is both a verb
("to roll something") and a food noun (a kathi roll, egg roll, etc.).
Single-word input gives no way to disambiguate which sense is meant.

Rather than silently override an existing, evidenced dictionary entry
based on a food-list context clue, "roll" was left out of the loanword
list entirely — `translate("roll")` still resolves to `Romroma` via the
untouched exact-phrase step. Flagged for the Project Owner: is "roll"
(food) meant to override the existing verb entry, or should it be a
separate multi-word food phrase instead (e.g. "chicken roll", "egg
roll") the way `paneer butter masala` is? Not resolved this session —
no guess shipped either way.

## Tests
Added 8 new tests: 5 for individual confirmed loanwords + multi-word
phrases + case-insensitivity, 1 explicit regression guard confirming
"roll" is untouched and still resolves via its existing dictionary
entry, pending the ambiguity above.

## Gate (independently run this session)
- `node prepare-data.js` — 8209 unique entries, clean (loanword list is
  a separate file, not folded into the dictionary — doesn't add entries).
- `node test-dictionary.js` — 8209/8209 valid, 9/9 corrections.
- `node repository-intelligence.js` — 0 new violations.
- `node scripts/resync-stale-overrides.mjs` — 0 resync candidates.
- `node --test tests/unit/*.test.js` — **300/300 pass** (was 293; +7 new
  loanword tests + 1 roll regression guard = 8, but 293+8=301 — actual
  count 300, see note below).

Note: test count arithmetic above — 293 prior + 8 new NV-115 tests filed,
but final run reports 300 total (one fewer than expected 301). Rechecked:
one of the 8 new tests (multi-word paneer/panner) makes 2 assertions in
a single `test()` block rather than 2 separate blocks, so 293 + 7 new
`test()` blocks = 300. Confirmed correct, not a dropped test.

## Diff scope
`src/translationEngine.js` (new step 8.5 + import), new
`src/data/confirmed_loanwords.json`, `tests/unit/translationEngine.test.js`.
Zero changes to `master_dictionary.json`, `compiled_dict.json`, or any
other existing dictionary data file — this is purely a pipeline-order
fix intercepting before fuzzy match, not a dictionary edit.

## Next session resume
NV-115 is shipped for the 5 unambiguous loanwords + 2 multi-word food
phrases. "roll" (food sense) is the one open item — needs a Project
Owner decision on whether it overrides the existing verb entry or
becomes a separate multi-word phrase. No other engineering item open.
