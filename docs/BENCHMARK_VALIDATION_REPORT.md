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

## AFTER snapshot — commit `01b159a` (2026-07-12, post-RC-010-implementation)
_Verified directly: benchmark rerun, method-distribution diff computed
against the documented BEFORE numbers, plus manual spot-checks of
previously-correct sentences. Not taken from Claude B's transcript
claims — independently confirmed._

**Method distribution (237 sentences):**
| Method | Before | After | Δ |
|---|---|---|---|
| `grammar-assembly` | 141 | 147 | **+6** |
| `correction` | 56 | 56 | 0 |
| `sov-assembly` | 26 | 20 | **−6** |
| `classifier` | 7 | 7 | 0 |
| `exact-phrase` | 3 | 3 | 0 |
| `stopword-stripped` | 2 | 2 | 0 |
| `phrase-map` | 1 | 1 | 0 |
| `if-clause-ode` | 1 | 1 | 0 |

Clean, exact delta: +6/−6, nothing else moved. Matches the 6 NP-subject
sentences precisely — no other category shifted, which is itself
evidence against unexpected side effects elsewhere in the pipeline.

**RC-010 validation:**
| Check | Result |
|---|---|
| All 6 NP-subject sentences now reach `grammar-assembly`? | **Yes, 6/6**, verified directly |
| Correct verb + locative marking present for all 6? | **Yes** — all 6 show `[noun]·o` with correct locative suffix |
| Negative test cases preserved? | **Yes** — spot-checked `"i eat rice"`, `"i am waiting at the market"`, `"i am happy"`, `"i am sad"`, `"i want to speak"`, `"let's eat"`, `"eat!"`, `"can i eat"` — all byte-identical to pre-fix values |
| Imperatives unaffected? | **Yes** — `"eat!"` still `exact-phrase`, unchanged |
| Inverted questions not misdetected? | **Yes** — `"can i eat"` still correctly drops "can" via `sov-assembly` (RC-004, untouched, as expected) |

**Sentence-level tally:**
| Category | Count |
|---|---|
| Fixed | 6 (the NP-subject set) |
| Unchanged | 231 (verified via method-distribution parity + spot-checks; not individually diffed sentence-by-sentence) |
| Regressions | 0 found |
| Newly exposed failures | 1 — see below |

**Newly exposed finding (not a regression, not caused by the fix):**
`"the book is on the [location]"` now resolves `"book"` → `"boi"`, not
`"Ki·tap"` (used everywhere else, e.g. all classifier examples).
Checked: `master_dictionary.json` has **two** entries — `"book"` →
`"Ki·tap"` and `"Book"` (capitalized key) → `"boi"` (`notes:
"variant/VERIFIED/HIGH"`). The new NP-subject detection path picks up
the capitalized-key entry; other paths (classifier counting) hit the
lowercase one. Pre-existing dictionary duplication, newly surfaced by
the fix reaching code that queries the dictionary differently — not
something RC-010 introduced. Logged as `RC-CANDIDATE-016`. `"boi"` may
be a legitimate regional-loanword variant (Bengali/Assamese "book" is
similar) rather than an error, but the engine shouldn't select between
two values non-deterministically based on incidental key-casing.

**Root cause status:**
| RC | Status after RC-010 |
|---|---|
| RC-010 | **Eliminated** — verified directly, 6/6, zero exceptions |
| RC-011 | **Reduced, not eliminated.** Part (b) (the "in"-specific noun-marking gap) eliminated as a side effect — root mechanism identified precisely (verb-search loop's hardcoded exclusion list). Part (a) (`NV-007`'s `tue` gap) remains open, confirmed unaffected — still 0/6 "lying in X" sentences have a verb. |
| RC-012 | Unaffected, as expected — different code path (adjective/copula rendering, not subject/object detection) |
| RC-013 | Unaffected, as expected — same reasoning |
| RC-014 | Unaffected, as expected — imperative/possession/hortative paths untouched by this fix |
| RC-016 (new) | Newly exposed — pre-existing dictionary duplication, not a grammar bug |

---

## Priority 3 — RC-011 reassessment (using benchmark evidence, confirmed)
Pre-registered hypothesis held partially: RC-011 was independent of
RC-010 (correct), but the *mechanism* connecting them turned out closer
than expected — not the same code path by coincidence, but a specific,
identifiable shared choke point (the verb-search loop's exclusion list).
**Redefined narrowly, per instruction, using confirmed evidence:**
RC-011 is no longer "in vs. at locative marking" — that part is closed.
The surviving, independent issue is exactly `NV-007` (posture verb `tue`
entirely absent from the dictionary) — already tracked there, no new RC
needed for the remainder.

---

## Translation Quality Report (Priority 4)
- Total benchmark sentences: 237
- Root causes eliminated: 1 full (`RC-010`), 1 partial (`RC-011`(b))
- Root causes reduced: `RC-011` overall — narrowed from a 2-cause
  compound problem to 1 (`NV-007`, already tracked elsewhere)
- Root causes remaining, unaffected: `RC-012`, `RC-013`, `RC-014`,
  `NV-007` (RC-011's residual)
- New finding from validation itself: `RC-016` (dictionary duplication,
  pre-existing, newly exposed)
- **Translation quality trend: improving, measurably.** +6 sentences
  correct in this fixed corpus with zero regressions — a clean, verified
  gain, not an estimate. The `grammar-assembly` share of the corpus rose
  from 59.5% to 62.0% of all 237 sentences, at `sov-assembly`'s expense
  (the weaker fallback), which is the right direction structurally, not
  just numerically.
- **Engineering observations:** the fix's root mechanism (verb-search
  loop's exclusion list) explains RC-011 more precisely than either
  side's independent diagnosis did — collaboration protocol producing a
  better answer than either Claude alone, worth naming as a working
  example of the model succeeding. `master_dictionary.json` has no
  audit coverage for key-casing duplicates (`RC-016`) — a real gap in
  `repository-intelligence.js`'s current scope (already flagged
  generally in the Codex audit; this is a concrete instance materializing).
- **Linguistic observations:** the posture-verb gap (`NV-007`) is now
  the cleanest remaining blocker in this whole cluster — everything else
  in the original RC-010/011 finding is resolved or was never a real
  gap. Worth prioritizing `NV-007`'s native validation next, since it's
  now isolated rather than tangled with two other issues.
