# Pending Regression Cases
_Started: 2026-07-08 by Claude B. Restructured 2026-07-11 into
Implemented/Pending sections (was growing into an append-only historical
log — reorganized to stay usable as an operational backlog per explicit
instruction)._

## Purpose
Every weakness the Native Sentence Validation Audit (or later evidence)
exposes gets logged here with the exact input/output pair, so fixes can
be reviewed and implemented without re-deriving the evidence.

## Format
- **Implemented**: closed. Cites the commit that fixed it. Full forensic
  detail (why the bug existed, root cause analysis) lives in that
  commit's message, not duplicated here — this doc keeps only what's
  needed to know it's done and where to look if you need more.
- **Pending**: still open. Input, current output, expected output (if
  known), suspected cause, severity, and what's blocking it (Claude A
  review vs. Thangseng validation).

---

## Implemented

### RC-CANDIDATE-002 — Locative "in bed" got object marker instead of locative
**Fixed:** `d0e6c06` (2026-07-10). `translationEngine.js`'s SOV
grammar-assembly now marks a stative-locative adjunct (`in`/`on`/`at` +
noun) with `·o` instead of the default `·ko`. `"I am lying in bed"` →
`Anga palang·o` (matches native-confirmed `palango`). New regression
case added same commit.

### RC-CANDIDATE-003 — Posture verb "lying" produced malformed/invalid Garo
**Partially fixed:** `d0e6c06` (2026-07-10). Both confirmed-invalid
outputs (`"down"` wrongly picked as verb via the unrelated
`corrections.json` `down`=`Ka·ma` entry; `"bed"` wrongly picked as verb
then given a past-tense suffix → invalid `Palangha`) now produce
grammatically valid, if semantically incomplete, output instead of
invalid Garo. **Still open:** the full `tue`/posture-verb paradigm needs
native validation (tracked as NV-007 in
`docs/THANGSENG_NATIVE_VALIDATION.md`) before "lying (in bed)" can be
translated correctly, not just gracefully.

### RC-CANDIDATE-006 — Purpose-clause "search" used pre-Rule-32 stale value
**Fixed:** `d0e6c06` (2026-07-10). `src/data/purpose_map.json`'s
`search` corrected from the retired `am·e·nik·na` to `Sandi·na`.

### RC-CANDIDATE-008 (partial) — irregular-verb table conflicts
**Fixed 5 of 9:** `d0e6c06` (2026-07-10) — `coming`, `slept`, `sleeping`,
`laughing` (truncation typos / missing raka marks, confirmed against
`THANGSENG_RULES_LOOKUP.md`'s raka table and internal corpus
consistency). **Not a bug:** `eaten` — `cha·jok` (perfect) and
`cha·manaha` (completive) are both independently confirmed distinct
aspectual forms (RULE-026); no fix needed, permanently allowlisted in
`repository-intelligence.js`. **Reverted:** `bought` was fixed then
retracted (`df71a83`) — see Pending below, genuinely unresolved.
**Still open:** `heard`, `standing`, `sitting` — see Pending below.

### VerbsGrammar.jsx (5 errors) + dead phrase_maps.js hortatives
**Fixed:** `48aee52` (2026-07-11). Not originally RC-numbered (found via
direct Claude A review of the user-facing grammar page, not the Native
Sentence Validation Audit), but same disposition — flagged with zero
ambiguity, checkable against existing confirmed data, implemented
directly. See commit message for the 5 specific corrections (raka on
`agan`/`nika`, hyphen-as-raka typos, a truncation typo, reversed
classifier-number order, a copy-pasted imperative example) and the 5
dead `phrase_maps.js` entries removed (shadowed by `corrections.json`,
verified unreachable before removal).

---

## Pending

### RC-CANDIDATE-001 — Necessity-modal negation (`nangja`) collapses into desire-negation
- **Input:** `"I don't need to watch TV"` → `Anga sikengja` (collapses
  into the `sikenga`/"want" + negation path)
- **Cause:** Grammar — no distinct necessity-modal negation path exists
- **Status:** Needs Claude A Review, then Thangseng Validation of the
  correct isolated-clause form

### RC-CANDIDATE-004 — Ability modal ("can") dropped entirely
- **Input:** `"I can watch"` / `"I can eat"` → identical to the
  non-modal form, no `man·a`/`man·ienga` marking at all
- **Cause:** Selection Logic — `master_dictionary.json` has `"can":
  "man·a"` but nothing wires it into modal-verb constructions
- **Status:** **Blocked — do not implement.** Claude A: the `man·a`
  source entry itself is unverified (NV-008). Wiring an unverified form
  into the engine would be worse than the current gap.

### RC-CANDIDATE-005 — English loanwords (`TV`, `status`) silently dropped
- **Input:** `"I watch TV"` → `Anga ni·rik·a` (TV vanishes, no error
  marker — silent data loss, worse than a visible `[UNKNOWN]`)
- **Cause:** Dictionary + Rendering — no pass-through mechanism for
  unrecognized capitalized tokens
- **Status:** Needs Claude A Review — Claude A has recommended a
  systematic loanword passthrough mechanism over per-word entries (in
  principle); not yet designed or implemented

### RC-CANDIDATE-007 — `sing`/`dance` purpose-clause forms use unrelated roots
- **Input:** `"i want to sing"` → `purpose_map.json`'s `bit·na`, vs.
  `corrections.json`'s `ring·a` (now confirmed correct — see NV-010,
  `ring·a`="sing" and `ringa`="drink" are genuinely different roots).
  `"i want to dance"` → `ruru·na` vs. `Chroka`, fully open.
- **Status:** Needs Thangseng Validation. The `sing` candidate fix
  (`bit·na`→`ring·na`) is medium-confidence only per Claude A — not
  swapped silently. `dance` has no evidence either way yet.

### RC-CANDIDATE-008 (remainder) — 4 unresolved irregular-verb/corrections conflicts
| Key | `corrections.json` | `irregular_verbs.json` | Status |
|---|---|---|---|
| `bought` | `breaha` | `brea·aha` | Escalated — `VALIDATION_CORPUS.md` already has `"have you bought"`→`Bre·ajok` (raka, Verified/High from a prior audit pass), directly conflicting with the primary-source no-raka claim. Two credible sources disagree — needs Thangseng, not a repo-evidence call. |
| `heard` | `rangsan chanchiaha` | `knachik·aha` | Escalated — different words entirely, no repo evidence favors either |
| `standing` | `chadatenga` | `chadenga` | Escalated — no primary-source confirmation of either root's raka status; a third form (`Chakata`) also exists elsewhere, may be a 3-way vocabulary question |
| `sitting` | `asongenga` | `asong·enga` | Escalated — same as `standing`, no confirmation found |

All 4 permanently allowlisted in `repository-intelligence.js` pending
Thangseng.

### RC-CANDIDATE-009 — 18 raka-adjacency candidates (report-only)
Surfaced by `repository-intelligence.js` Check A (deliberately
report-only — see `docs/REPOSITORY_INTELLIGENCE.md`). **Partially
resolved:** the `ring·`-related hits (8 of 18) are confirmed **not
bugs** — `ring·a`="sing" is a genuinely different root from the
no-raka verb `ringa`="drink" (NV-010, narrowed 2026-07-10). **Still
open:** `agan·` (3 hits, "did/have/are you speak(ing)") and `tusi·` (1
hit, "I will sleep") look like plausible genuine RULE-001 candidates —
no alternate-word explanation found. `nam·` (2 hits, "loved the
picture") may be an idiom, unconfirmed. `wa·` (4 hits, bamboo) is
likely an unrelated word (bamboo ≠ rain), probably not a violation at
all.
- **Status:** Needs Claude A Review for the remaining `agan·`/`tusi·`/
  `nam·`/`wa·` clusters (10 of the original 18 hits).

### [Superseded by RC-CANDIDATE-011] `·o` fix scope question
Originally a separate `RC-CANDIDATE-010` created independently by
Claude B the same day as Claude A's stress-test `RC-CANDIDATE-010`
(naming collision, concurrent sessions). Retired in favor of
`RC-CANDIDATE-011`, which found the same underlying gap via broader
evidence (12 sentences vs. 2).

## Stress Test — 2026-07-12, Claude A
237 generated sentences, live-tested against `translate()`, now the
persistent benchmark: `tests/benchmarks/stress_237.mjs`. Full method
distribution and category breakdown: `docs/BENCHMARK_VALIDATION_REPORT.md`.
Strong-performing baseline (no action needed): pronoun-subject tense/
aspect/negation paradigm, malformed-input robustness, direct-count
classifiers.

### RC-CANDIDATE-010 — NP-subject sentences never reach grammar-assembly
**Conclusion:** `analyzeGrammar` gates on a recognized pronoun subject.
Non-pronoun subjects (`"the book"`, `"the dog"`) never reach it,
regardless of well-formedness — they fall to weak `sov-assembly`. Not
locative-specific; affects any sentence with a non-pronoun subject.
**Status:** Fix reportedly implemented by Claude B (session ended before
push — not yet on `origin/main` as of 2026-07-12, unverified).
**Benchmark:** the 6 `"the book is on the [location]"` sentences —
confirmed 6/6 `sov-assembly`, zero exceptions.
**Implementation implication:** extending subject detection beyond
pronouns should fix this as a sentence class. Negative test cases: all
231 pronoun-subject sentences (especially already-correct ones),
imperatives (no subject), inverted questions (`"can i eat"`).
**Remaining uncertainty:** none on diagnosis. Verification pending an
actual benchmark rerun against real code.

### RC-CANDIDATE-011 — "In" vs. "at" locative marking (retracted original hypothesis)
**Conclusion:** Not per-noun as originally claimed (retracted). `"at"`
generalizes `·o` correctly across all nouns tested; `"in"` does not.
Same `grammar-assembly` method, same noun list — the variable is the
preposition. Two independent compounding causes: (a) `NV-007`'s `tue`
gap (verb-slot lost, uniform across all "lying in X" cases), (b) a
separate `"in"`-specific locative-marking gap (noun-slot, `"bed"` is the
only exception and is not a stored phrase).
**Status:** Reportedly resolved as a side effect of the RC-010 fix
(Claude B's transcript — the fix's locative-verb-guard applied broadly,
not just to NP-subjects). **Not yet confirmed via benchmark rerun.**
**Benchmark:** the 12 `"waiting at X"`/`"lying in X"` sentences —
before-state: 6/6 correct for `"at"`, 1/6 for `"in"`.
**Implementation implication:** none needed if genuinely resolved. If
not, next diagnostic step is confirming whether `"at"`/`"in"` share a
code path.
**Remaining uncertainty:** whether the reported disappearance is real —
must be confirmed by rerunning the identical benchmark, not assumed from
a transcript.

### RC-CANDIDATE-012 — Raka rendered as apostrophe instead of `·`
**Conclusion:** Non-first-person `"sad"` (you/he/she/we/they) renders
`"Duk ong'a"` — apostrophe, not raka. First-person is correct
(`"Anga duk ong·a"`). Same character-substitution error class as the
hyphen-instead-of-raka bugs already fixed in `VerbsGrammar.jsx`/
`phrase_maps.js`, this time live in engine output.
**Status:** Open, unimplemented.
**Benchmark:** 5 of the 36 predicate-adjective sentences (`"[you/he/
she/we/they] [is/are] sad"`).
**Implementation implication:** locate and fix the apostrophe in
whatever table non-first-person grammar-assembly reads adjective forms
from — low-ambiguity, no linguistic judgment required.
**Remaining uncertainty:** none.

### RC-CANDIDATE-013 — Predicate-adjective copula insertion is inconsistent (RULE-031 in practice)
**Conclusion:** Live, concrete evidence that `RULE-031`/`NV-002` being
unresolved has real output consequences, not just documentation debt.
`"happy"` drops `ong·a` for non-first-person only; `"sad"` keeps it;
`"tired"` self-inflects with no copula; `"beautiful"/"good"/"bad"` take
no suffix at all. Word *selection*, not just copula-presence, also
varies by person for `"sick"`/`"clever"` (evidence outside the fixed
benchmark).
**Status:** Open — correctly not fixable without native validation.
**Benchmark:** the 36-sentence predicate-adjective set (6 persons × 6
adjectives) within `stress_237.mjs`; `sick`/`clever`/`strong`/`tall`
tested ad-hoc, not part of the fixed corpus.
**Implementation implication:** none until `NV-002` resolves. A
provisional bare-adjective default is already recommended (see
`THANGSENG_NATIVE_VALIDATION.md`, "Provisional recommendation" section).
**Remaining uncertainty:** whether "I am happy" vs. "you are happy"
reflects a real grammatical distinction or an engine gap — needs
Thangseng.

### RC-CANDIDATE-014 — Imperatives, negative imperatives, and possession: memorized-only
**Conclusion:** All three constructions have zero general grammar-
assembly rule — only present when a specific string is memorized in
`corrections.json`. `"do not V"` additionally selects the wrong existing
rule (`RULE-017` statement-negation instead of `RULE-029`'s `-nabe`).
`"let us drink"/"speak"` are missing from `corrections.json` entirely —
broader than the `eat`/`work` value-mismatch found in an earlier cycle.
Category classification: imperatives/possession = missing
generalization (rules exist, aren't applied); `"do not V"` = wrong-rule
selection (both rules exist, engine picks the wrong one).
**Status:** Open, unimplemented.
**Benchmark:** ~24 imperative/hortative/possession sentences within
`stress_237.mjs`.
**Implementation implication:** three related but separate
generalization gaps for Claude B — imperative `-bo`, negative-imperative
`-nabe` selection, possession/existential `donga`.
**Remaining uncertainty:** none on diagnosis — this is an engineering
generalization question, not a linguistic one.

**Already tracked elsewhere, reconfirmed live, no new finding:**
`RC-CANDIDATE-004` (ability modal "can," still dropped, blocked on
`NV-008`), `RC-CANDIDATE-005` (loanword "TV," still dropped),
`RC-CANDIDATE-003` (posture-verb fix confirmed working for `"lying
down"` alone — no longer invalid Garo, now valid-but-wrong-meaning,
still resolves to the unrelated "down" root).

### RC-CANDIDATE-015 — `Da·mo`("wait" expression) used for declarative "wait," should be `senga`
**Conclusion:** Native-confirmed (`NV-015`, direct transcript, 2026-07-12).
`"I will wait"` should be `"Anga senggen"` (`senga` root, inflectable).
The engine currently produces `"Anga Damogen"` — `Da·mo` is a fixed
discourse expression, confirmed to take no suffix at all, so this is a
confirmed error, not a vocabulary preference. Cross-checked against
existing repository evidence: `corrections.json` already uses `senga`
correctly for 2 of 7 tested "waiting" sentences (`"i am waiting for
you"`, `"i am waiting at the market"`); the 237-sentence benchmark shows
the other 5 (`"waiting at the [bed/school/house/table/room]"`) all
generating `Damo`-based output via `grammar-assembly`. New root cause,
not a symptom of `RC-010`/`RC-011` — a wrong-lexeme-selection bug, not a
subject-detection or locative-marking one.
**Status:** Open, unimplemented.
**Benchmark:** not yet in `stress_237.mjs` (benchmark not modified per
Validation Mode — add in a future benchmark revision); currently
observable via the 5 affected `"waiting at X"` sentences already in the
corpus, plus `"i will wait"` (not currently in the corpus at all).
**Implementation implication:** route the `grammar-assembly` "waiting"
fallback through `senga`, not `Da·mo`, for declarative input. Reserve
`Da·mo` for genuine imperative "Wait!" — its existing `corrections.json`
entries (`'wait'`, `'you wait'`) are plausibly fine as-is and don't need
changing themselves.
**Remaining uncertainty:** none — this is fully native-confirmed, no
linguistic ambiguity, purely an engineering routing fix.

---
- Nothing in the Pending section above has been fixed — only logged.
- Severity/priority labels are Claude B's engineering assessment only —
  not a substitute for Claude A's linguistic triage or Thangseng's
  validation of expected outputs.
