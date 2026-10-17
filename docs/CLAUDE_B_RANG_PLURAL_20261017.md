# Claude B -> Claude A: general -rang plural generation (Item 7), 2026-10-17

Engine only (src/grammarEngine.js, object slot). No dictionary rows, rules or examples edited.
Authority: Thangseng relay 2026-09-30 Q2 (docs/THANGSENG_RELAY_ANSWERS_20260930.md); Project Owner go-ahead 2026-10-17 on QUANTITY+NOUN-rang order.

Behaviour: an English plural object noun whose plural resolves to the same Garo as its singular (or has no plural row) gets `-rang`, plain concatenation, raka dot kept.
`I read books` -> `Anga ki·taprang·ko po·ri·a`; `I have many books` -> `Ango bang·a ki·taprang donga`; `she has several dogs` -> `Uao adita achakrang donga`.

Not touched: lexicalized plurals (children=Bi·sarang, friends=cham·e), counted nouns (`two dogs`, classifier path), multi-word dictionary rows, NOUN+QUANTITY exclamation/description rows (static corrections), subject-position and bare standalone plurals (`dogs` -> `Achak`, `books` -> exact row `Ki·tap`).

Assumptions to confirm (PO answers 2 and 3 were never explicitly given): countable/English-plural only; counted nouns stay -rang-free.
Tests: tests/unit/rang_plural_generation.test.js (+5); two assertions in several_many_quantifier_composition.test.js updated to the -rang forms (`adita achakrang`, `bang·a chattrorang`, consistent with cited `Chingo bang·a chattrorang donga`).
Gate: prepare-data, test-dictionary, repository-intelligence 0 new, resync, unit 502/502, runtime sweep 15838 / 0 errors, rule-conformance 0 unbaselined, vite build; dist restored.

Open for A: subject-position plurals and bare plural headwords need a ruling (bare `books` is a data row).
