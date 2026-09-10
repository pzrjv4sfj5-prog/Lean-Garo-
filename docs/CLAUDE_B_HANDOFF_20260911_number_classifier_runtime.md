# Handoff to Claude B — number/classifier runtime generation bugs

Source: full linguistic re-audit, 2026-09-11 (Claude A, Project Owner
directive). Full audit report is in this session's chat transcript,
not re-copied here in full — this doc is the actionable engineering
subset only. **Linguistic contract (Sections B/C of that audit) is
VERIFIED clean — the data is correct.** The bugs below are entirely
in generation/composition code, confirmed via live `translate()` calls
against unseen combinations (numbers/nouns not pre-seeded as literal
dictionary rows).

Claude A did not touch any of the files below — audit + data-layer
fixes only, per standing role boundary.

## Bug 1 — `king` missing from `RAKA_CLASSIFIERS`
`src/garo_classifier.js:90`: `RAKA_CLASSIFIERS = new Set(['mang', 'ge', 'gong', 'te'])`.
`king` is missing, despite the dictionary-established, citation-backed
form `ki·tap king·sa` ("one book") using the dot. Result: unseen counts
for `king`-classified nouns (e.g. "7 books") compile without the dot
(`kingsni` instead of `king·sni`).
**Fix:** add `'king'` to the set.

## Bug 2 — 20–99 composition (`getClassifierSuffix`, `garo_classifier.js:100-102`)
For n in 20-99, the code takes the two-word number-table form (e.g.
`"Sotbri Sa"`, capitalized per its citation form) and does
`.replace(/ /g, '·')` — blind space→dot substitution, no case
normalization. Combined with `buildClassifierPhrase`'s
`${classifier}${suffix}` fuse-with-no-separator for non-`RAKA_CLASSIFIERS`
members, this produces e.g. `"41 students"` → `sakSotbri·sa` — wrong
capitalization mid-word, spurious dot, no space. This does **not**
match the Owner-approved human-40+ surface form
(`saksotbri sa` — lowercase, plain space, no internal dot; see
`data/garo_number_classifier_engine_machine_ready.json`
`surface_policy.human_40_plus` and its `worked_examples`).
**Fix:** lowercase the tens-portion before composing, and stop
replacing the internal space with a dot — the approved surface keeps
a plain space there, it does not fuse to a dot.
**Also applies to non-human classifiers** — the contract's *default*
surface rule is `NOUN + SPACE + CLASSIFIER + SPACE + NUMBER`
(fully separate tokens), so `"41 dogs"`/`"41 cars"` should very
likely not be dot-fused at all — only the explicitly-approved
human-sak-40+ exception gets the special fused-but-space-separated
form. Worth confirming the intended default surface with the Owner
before implementing, since the contract doesn't give a worked example
for a non-human tens+unit case.

## Bug 3 — exact-hundred composition (`buildLargeClassifierPhrase`, `garo_classifier.js:120-141`)
When `remHundred === 0` (i.e. an exact multiple of 100), the code
pops the hundreds-word and appends `${classifier}sa` (classifier +
**one**) as a placeholder tail. Result: `"100 students"` →
`"chattro ritcha saksa"` (reads as "student hundred person-one", not
100) and `"one hundred dogs"` → `"achak mang·sa"` (hundred silently
dropped entirely, reads as "one dog"). This is a real semantic bug,
not just a formatting one — it silently ships a wrong count.
**Fix:** an exact-hundred count needs to attach the classifier to the
hundred-multiplier itself, not substitute a count of 1.

## Bug 4 — `parseCountingPhrase` doesn't handle "hundred"/"thousand" words
Only handles the two-word `[tens][unit]` compound (e.g. "forty one").
No handling for multiplier words at all, so `"one hundred dogs"`
parses as `count=1`, silently dropping "hundred" before it ever
reaches Bug 3's broken composer.
**Fix:** extend the word-number parser to recognize
hundred/thousand multipliers per
`data/garo_number_system_machine_ready.json`'s composition rules.

## Bug 5 — unseeded nouns fall through the classifier engine entirely
Nouns without a literal pre-seeded count row (e.g. "mango", not
pre-generated 1-20 like "apple" was) don't route through the
classifier composer at all — they fall to a different code path
(`sov-assembly`, confidence 0.75) which ignores the `rong` classifier
and produces wrong word order: `"seven mangoes"` → `"Sni te·ga·chu"`
(bare number+noun, no classifier, number-first).
**Fix:** any noun resolvable via Master Dictionary lookup + the
classifier-map should route through `countNoun`/`buildClassifierPhrase`
regardless of whether that literal count was pre-seeded as a
dictionary row.

## Verification data (live `translate()` calls, this session)
| Input | Actual output | Bug |
|---|---|---|
| 41 students | `chattro sakSotbri·sa` | 2 |
| 55 students | `chattro sakSotbonga·bonga` | 2 |
| 67 students | `chattro sakSotdok·sni` | 2 |
| 100 students | `chattro ritcha saksa` | 3 |
| one hundred dogs | `achak mang·sa` | 3, 4 |
| seven mangoes | `Sni te·ga·chu` | 5 |
| 7 books / 19 books | `ki·tap kingsni` / `ki·tap kingChi·sku` | 1 |
| 41 cars | `gari bolSotbri·sa` | 1(no), 2 |

Everything at/below ~20 for the classifiers the system was originally
built against (mang, sak for 1-19) works correctly — this is purely a
generalization gap above that range and for the exact-hundred case.
