# Benchmark Inventory
_References `tests/benchmarks/stress_237.mjs` (fixed, do not modify).
Full results/methodology: `docs/BENCHMARK_VALIDATION_REPORT.md`. This
doc maps categories to what they test — not a sentence list._

| Category | Count | Linguistic phenomenon | RULE(s) | RC(s) | Importance |
|---|---|---|---|---|---|
| Person×verb SVO | 30 | Basic subject-verb-object, 6 persons × 5 verbs | RULE-001, 002, 015 | — | High |
| Tense/aspect/negation paradigm | 70 | Present/past/future/negative/continuous/future-negative × 10 verbs | RULE-002, 015, 017, 023, 027 | — | High (strongest-performing category) |
| Predicate adjectives | 36 | Copula selection across 6 persons × 6 adjectives | RULE-031, RULE-005 | RC-012, RC-013 | High |
| NP-subject locatives | 6 | `"the book is on the X"` — non-pronoun subject | RULE-009, RULE-G2 | RC-010 | Highest (single largest architectural gap) |
| Pronoun-subject locatives | 12 | `"waiting at X"` / `"lying in X"` | RULE-009, RULE-033, RULE-034/035 | RC-011 | High |
| Possession/existential | 6 | `"have"` constructions, various persons/objects | RULE-G7 | RC-014 | Medium |
| Modals (want/need/can) | 24 | `sikeng` construction + ability modal | RULE (sikeng, undocumented as own rule), NV-008 | RC-004 | Medium |
| Hortative/imperative | 24 | `-bo`, `let's/let us X`, `do not V` | RULE-029, RULE-017 | RC-014 | Medium |
| Questions | 8 | Question-word placement, interrogative markers | RULE-003 (word order) | — | Low (not yet clustered — noted as future observation, not an open RC) |
| Classifiers/numbers | 9 | Numeral classifier system | RULE-G-classifier | — | Medium |
| If-clauses / multi-clause | 4 | `RULE-008`, purpose clauses | RULE-008, RULE-032 | RC-006 | Low |
| Loanwords | 4 | English loanword handling | — | RC-005 | Low |
| Posture/stative | 4 | `tue` paradigm, "lying down" | RULE (tue, undocumented — see NV-007) | RC-003 | Medium |

**Total: 237.** Counts sum to 237 (30+70+36+6+12+6+24+24+8+9+4+4+4=237).

## Pending acceptance cases — not in the fixed 237 corpus
`stress_237.mjs` is fixed and not modified for this. These are gaps
found comparing RC-CANDIDATE-017/018/019 against the existing 237
categories — logged as representative sentences to test once each RC
is implemented, not as new expected-output claims (none of these are
linguistically confirmed).

| RC | Representative sentence(s) | Nearest existing category | Gap |
|---|---|---|---|
| RC-017 | `"the book is not on the table"`, `"i am not waiting at the market"` | NP-subject locatives (6) / Pronoun-subject locatives (12) | Corpus has affirmative locative-predicate sentences only — no negated-locative variant exists at all, for either subject type. |
| RC-018 | `"the dog will eat rice"`, `"she will go to the market"` | Person×verb SVO (30) / Tense-aspect-negation paradigm (70) | Future-tense coverage exists only for pronoun subjects (`"i will eat"`); no NP-subject + future combination exists, which is what surfaced the floating `·gen` token. |
| RC-019 | `"the teacher is here"`, `"my father is a teacher"` | Not covered by any category | The word `"teacher"` does not appear anywhere in the 237-sentence corpus. `"my father is a teacher"` already has a native-confirmed `skigipa` answer in `corrections.json` — worth using as the anchor case once Claude A resolves the word-choice question. |

**Coverage gaps this inventory surfaces (not new RCs — noted per Task 5):**
- No category isolates question-word placement specifically, though 8
  question sentences exist — the SOV-violation observed in some question
  outputs (e.g. question word mid-sentence) was seen but never clustered
  into its own RC. Flagging as a future observation only.
- No `RULE` entry exists yet for the `sikeng` ("want to X") construction
  or the `tue` (posture) root as their own catalogue entries — both are
  referenced only via `VERB_INVENTORY.md`/NV items, not promoted. Not
  fixing here — Task 2 says don't add new rules; noting for Task 4/future
  consideration only.
