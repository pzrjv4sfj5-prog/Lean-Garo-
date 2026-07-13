# Benchmark Validation Report
_Living document — update in place after each RC implementation lands,
do not create a new dated snapshot file. Benchmark corpus:
`tests/benchmarks/stress_237.mjs` (237 sentences, fixed, do not modify)._

## Methodology
Run `node tests/benchmarks/stress_237.mjs > results.jsonl`, diff against
the prior snapshot's per-sentence `garo`/`method`/`confidence`. A
sentence counts as:
- **Fixed** — was wrong/failing before, correct after.
- **Unchanged** — same output before and after (whether correct or not).
- **Regression** — was correct before, wrong after.
- **Newly exposed failure** — was masked/silent before (e.g. fell into a
  fallback that happened to look plausible), now visibly wrong after a
  change shifts it onto a different code path.
Lesson from building this template: don't use naive substring checks
(e.g. "contains `·o`") to judge correctness automatically — raka
placement is root-dependent, so a correct output for a raka-free root
won't contain `·` at all. Judge each sentence against its actual
confirmed value (`corrections.json`/`GRAMMAR_RULE_CATALOGUE.md`), not a
pattern match.

---

## BEFORE snapshot — commit `039ae17` (2026-07-12, pre-RC-010-implementation)

**Method distribution (237 sentences):**
| Method | Count |
|---|---|
| `grammar-assembly` | 141 |
| `correction` | 56 |
| `sov-assembly` | 26 |
| `classifier` | 7 |
| `exact-phrase` | 3 |
| `stopword-stripped` | 2 |
| `phrase-map` | 1 |
| `if-clause-ode` | 1 |

**Per-RC baseline:**
| RC | Metric | Before value |
|---|---|---|
| RC-010 | NP-subject sentences reaching `grammar-assembly` | 0/6 (all 6 `sov-assembly`) |
| RC-011 | `"waiting at X"` correct (all 6 nouns) | 6/6 correct |
| RC-011 | `"lying in X"` correct (all 6 nouns) | 1/6 correct (`bed` only) |
| RC-012 | Non-first-person `sad` with apostrophe instead of raka | 5/5 occurrences (all non-1st-person) |
| RC-013 | Adjectives dropping `ong·a` for non-1st-person | 1/6 tested (`happy` only, confirmed person-conditioned) |
| RC-014 | `"V!"` imperatives with correct `-bo` | 2/6 tested (`eat`, `go` — both `exact-phrase`) |
| RC-014 | `"let us X"`/`"let's X"` key-pairs matching | 4/6 matching (`go`, `sleep` match; `eat`, `work` mismatch value; `drink`, `speak` missing entirely) |

---

## AFTER snapshot — _pending RC-010 implementation_
_Fill in once Claude B pushes and the identical benchmark is re-run._

**Method distribution (237 sentences):**
| Method | Count | Δ from before |
|---|---|---|
| `grammar-assembly` | — | — |
| `correction` | — | — |
| `sov-assembly` | — | — |
| _(other methods)_ | — | — |

**RC-010 validation:**
| Check | Result |
|---|---|
| All 6 NP-subject sentences now reach `grammar-assembly` (or better)? | — |
| Correct verb + locative marking present for all 6? | — |
| Negative test cases preserved (231 pronoun-subject sentences unchanged where already correct)? | — |
| Imperatives (`"eat!"`, `"go!"`) unaffected (no subject, shouldn't misfire)? | — |
| Inverted questions (`"can i eat"`, `"did you go..."`) not misdetected as NP-subject? | — |

**Sentence-level tally (all 237):**
| Category | Count |
|---|---|
| Fixed | — |
| Unchanged | — |
| Regressions | — |
| Newly exposed failures | — |

**Root cause status:**
| RC | Status after RC-010 |
|---|---|
| RC-010 | — (eliminated / reduced / still open) |
| RC-011 | — (Priority 3: disappeared / reduced / independent — see below) |
| RC-012 | — (expected unaffected — different code path) |
| RC-013 | — (expected unaffected — different code path) |
| RC-014 | — (expected unaffected, except possibly the imperative-fallback-infrastructure overlap noted in RC-014's category classification) |

---

## Priority 3 — RC-011 reassessment (only after RC-010 lands, using benchmark evidence, not assumption)
Pre-registered hypothesis (2026-07-12, before seeing RC-010's
implementation): RC-011 was already established as independent of
RC-010 (same `grammar-assembly` method for both `"at"` and `"in"` cases,
before any RC-010 fix). **Expectation: RC-010 should not change RC-011's
6/6 vs. 1/6 split at all**, since both preposition-handling paths were
already inside `grammar-assembly`, not gated by subject-type. If the
benchmark shows RC-011 *did* change after an RC-010-only fix, that would
be a surprise worth investigating rather than assuming — don't force the
data to match the pre-registered hypothesis.

---

## Translation Quality Report (Priority 4 — fill in after validation)
- Total benchmark sentences: 237
- Root causes eliminated: —
- Root causes reduced (not eliminated): —
- Root causes remaining, unaffected: —
- Translation quality trend: —
- Engineering observations: —
- Linguistic observations: —
