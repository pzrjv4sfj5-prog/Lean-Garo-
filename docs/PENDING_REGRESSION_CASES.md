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

### [Superseded by RC-CANDIDATE-011 below] Linguistic feedback: RC-002's `·o` fix may be scoped wider than confirmed

Originally logged here as `RC-CANDIDATE-010`, in parallel with Claude
A's independently-created `RC-CANDIDATE-010` below (both sides used the
same next-available number in concurrent sessions — the Stress Test
section was pushed while this was being written). Retiring this entry
in favor of Claude A's **`RC-CANDIDATE-011`**, which found the identical
underlying gap via direct 237-sentence stress-testing (far stronger
evidence than the two cases — `bed`, `table` — this note was based on)
and traced it as likely sharing a root cause with `RC-CANDIDATE-010`'s
NP-subject gate below. **This is the collaboration protocol working as
intended**: raised as a scope-check question from the engineering side;
independently confirmed and sharpened from the stress-testing side, same
day, before either side saw the other's note. See `RC-CANDIDATE-011` for
the live entry.

## Stress Test — 2026-07-12, Claude A (237 generated sentences, live engine)

Per Project Owner directive: stop reading documents, stress-test the
translator directly, cluster failures to root causes. Method: generated
237 English sentences programmatically across grammar categories
(tense/aspect/negation paradigm × 10 verbs, predicate adjectives × 6
persons, locatives, possession, modals, imperatives, questions,
classifiers, if-clauses, loanwords, posture verbs), ran each through the
live `translate()` engine, clustered by method/confidence/pattern. Test
script not retained (avoid one-off-script clutter, per the repo audit's
own finding) — regenerable from the category list above if needed.

**What's strong (no action needed):** the tense/aspect/negation paradigm
for pronoun-subject sentences is the best-performing category by a wide
margin — present/past/future/negative/continuous/future-negative across
10 verbs almost all correct, matching confirmed roots. Malformed English
input ("eated," "buyed") still translates sensibly — real robustness.
Classifier system mostly solid for direct "number noun" phrasing.

### RC-CANDIDATE-010 — NP-subject sentences never reach grammar-assembly
**Severity: Highest — most systemic finding of this pass.**
`"the book is on the table"` → `"Ki·tap te·bil"` (two bare nouns, no
verb, no locative marker at all) — same failure across all 6 locations
tested. **Root cause:** confirmed via prior full engine read —
`analyzeGrammar` only fires when the sentence starts with a recognized
pronoun (`PRONOUN_MAP` lookup). `"the book"`/`"the dog"` etc. never
reach grammar-assembly at all, regardless of how well-formed the rest of
the sentence is — they fall straight to the much weaker `sov-assembly`
fallback. This isn't a locative-specific bug — it's a subject-detection
gate affecting *any* sentence with a non-pronoun subject. Likely the
single highest-value engineering fix available: extending subject
detection to recognized common nouns (not just pronouns) would fix an
entire sentence class, not one construction.
**Not asking for implementation** — flagging severity and root cause per
the handoff protocol.

**Validated (2026-07-12, Claude A, Priority 1 per Project Owner
directive):** Isolated the 6 true NP-subject sentences — **all 6, no
exceptions, `method: "sov-assembly"`**, never `grammar-assembly`. Clean
categorical split: 231/237 pronoun-subject sentences reach
`grammar-assembly`+; all 6/237 NP-subject sentences don't. Estimated
impact: 6/237 in this fixed corpus, but the split is by subject-type,
not lexical, so real-world impact is larger than this sample suggests.
**Negative test cases for Claude B (should NOT change after a fix):**
all 231 pronoun-subject sentences, especially already-correct ones
(`"i eat rice"`, `"i am waiting at the market"`); imperatives
(`"eat!"`, `"go!"` — no subject at all, confirm no misfire);
inverted-order questions (`"can i eat"`, `"did you go to the market"`
— confirm not misdetected as NP-subject).

### RC-CANDIDATE-011 — Retracted and replaced (2026-07-12, Claude A)
**My original hypothesis below is wrong — retracted, not just
refined.** Re-examined with method-level precision: `"waiting at the
[location]"` — 6/6 correct, `·o` present every time, all 6 nouns.
`"lying in the [location]"` — same `grammar-assembly` method for all 6,
but only `"bed"` gets `·o`. Identical method, identical noun list —
**the variable is the preposition, not the noun.** `"at"` generalized
correctly; `"in"` did not. Checked whether `"bed"`'s success is a
stored phrase (would explain a one-off exception) — confirmed not: no
`corrections.json`/`phrase_maps.js`/`master_dictionary.json` entry
matches this sentence or "lying"(reclining). `master_dictionary.json`
does have `"lying"` entries (`Ua tolenga`) but they're the **wrong
sense** — lying=untruth, not lying=reclining — a real homonym trap,
separate from this bug. No verb renders in any of the 6 `"lying in X"`
outputs (matches `NV-007`'s already-known `tue` gap) — but that only
explains the missing *verb* uniformly; it doesn't explain why 1 of 6
nouns still gets `·o`. **Two independent issues compound here, not
one:** (a) `tue` absent entirely (unchanged, `NV-007`), (b) a genuine
`"in"`-specific locative-marking gap, independent of both RC-010 (same
method throughout) and (a) (affects noun-marking, not the verb-slot).
**Evidence-only ask:** are `"at"` and `"in"` handled by the same code
path or two separate ones? If separate, that likely explains the split
directly — no fix suggested, this is a diagnostic question.

_Original hypothesis, retained for record, now superseded by the above:_
**Severity: High.** `"i am lying in the bed"` → correct `·o`. `"i am
lying in the market/school/house/table/room"` → **no** `·o` at all, bare
noun, for every other location tested. Same pattern for `"waiting at the
X"` (bed/table correct, others inconsistent). **Root cause:** the
`RC-CANDIDATE-002` locative fix appears to apply only to nouns with a
pre-existing stored locative form, not generatively to arbitrary nouns +
`in`/`at`/`on`. Worse than the original bug in one sense — it's now
*inconsistent* rather than *uniformly* wrong, which is harder to detect
downstream. Related to RC-010 above — likely the same subject-detection
gate, or a second, narrower gap in the `·o`-routing fix itself.

### RC-CANDIDATE-012 — Raka rendered as apostrophe (`'`) instead of `·` in live adjective output
**Severity: Medium, but a new and concrete finding.** `"you are
sad"`/`"he is sad"`/`"we are sad"`/`"they are sad"` all produce `"Duk
ong'a"` — apostrophe, not raka. Confirmed correct elsewhere (`"i am
sad"` → `Anga duk ong·a`, verified earlier this session). **Root cause:**
almost certainly a source-string typo in the adjective/predicate mapping
table used for non-first-person grammar-assembly — same character-
substitution error class as the hyphen-instead-of-raka bug already fixed
in `VerbsGrammar.jsx`/`phrase_maps.js`, but this instance is live in the
engine's own output, not just a static UI page. Straightforward fix once
located (find `ong'a`, replace with `ong·a` in whatever table
non-first-person grammar-assembly reads from).

### RC-CANDIDATE-013 — Predicate-adjective copula insertion is inconsistent per-adjective
**Severity: Medium — direct evidence for why RULE-031 matters in
practice.** `"happy"`: non-first-person forms drop `ong·a` entirely
(`"Na·a kusi"`, not `"Na·a kusi ong·a"`) while first-person keeps it
(`"Anga kusi ong·a"`, previously verified). `"sad"`: keeps it (raka bug
aside, RC-012). `"tired"`: self-inflects, no copula at all (`nenga`),
consistent with the confirmed pattern. **Root cause:** the engine
appears to have ad-hoc, per-adjective, per-person copula behavior with
no single governing rule — a direct, concrete illustration of why
`RULE-031`/`NV-002` being unresolved has real output consequences, not
just a documentation gap. Not asking for a fix (that needs native
validation first) — flagging so the *inconsistency itself* is visible
rather than each instance looking like an unrelated one-off.

**Evidence expansion (2026-07-12, Claude A, Priority 4):** confirmed
systematic, not lexical-per-instance, across the full 36-sentence
predicate-adjective set (6 persons × 6 adjectives). Four distinct
behaviors, each consistent across all persons it applies to: (1) drops
`ong·a` for non-first-person only — `happy` uniquely; (2) keeps `ong·a`
regardless of person — `sad`; (3) self-inflects, no copula, regardless
of person — `tired`; (4) bare adjective, no suffix at all, regardless of
person — `beautiful`/`good`/`bad`. **Person is the variable for `happy`
specifically, not adjective identity generally** — this wasn't visible
from 1st-person-only data. New native question worth adding: "is 'I am
happy' different from 'you are happy'?" — not previously framed this
way.

**Supporting evidence (2026-07-12, Claude A, Priority 5 — outside the
fixed benchmark, ad-hoc check only, benchmark itself not modified):**
tested 4 more adjectives not in the original 237-sentence set. Found a
*different shape* of the same underlying problem — not just
copula-presence varying by person, but full **word selection** varying:
`"sick"` — `"i am sick"` → `"Anga sakamenga"` (`correction`); `"you/he
is sick"` → `"Na·a/Ua sa·a"` (`grammar-assembly`) — these are different
words, not the same root with different copula treatment. `"clever"` —
`"he is clever"` → `"Ua man·de seng·a"` (`correction`, matches the
already-confirmed dictionary entry in full); `"i am/you are clever"` →
`"Anga/Na·a seng·a"` (`grammar-assembly`, missing `man·de` entirely).
Both cases: only one person-form has full exact-match coverage; the
others fall to `grammar-assembly` and lose either the correct root or
part of a compound expression. Same root class as RC-013 (predicate-
adjective handling is unreliable/incomplete outside exact matches), not
a new architectural cause — recorded here, not as a new RC.

### RC-CANDIDATE-014 — Imperatives and possession constructions: memorized-only, no general rule
**Severity: Medium, two related sub-findings.**
- **Imperatives:** `"eat!"`/`"go!"` → correct (`-bo` suffix), both
  hardcoded `exact-phrase` entries. `"drink!"`/`"sleep!"`/`"speak!"`/
  `"work!"` → bare root, **no** `-bo` at all, via `sov-assembly`.
  `"do not sleep"` → `"Ihing Tusia"` (garbled — `"Ihing"` isn't a
  recognized negative-imperative marker). `"do not speak"` → `"Aganja"`
  (present negation `-ja`, not imperative negation `-nabe`, per RULE-029).
  **Root cause:** `-bo`/`-nabe` (RULE-029) aren't implemented as general
  grammar-assembly rules — only present when a specific "V!"/"do not V"
  string is memorized in `corrections.json`.
- **Possession:** three different broken outputs from three different
  fallback paths for structurally similar sentences — `"i have a book"`
  → `"ang ong·a kitab"` (`stopword-stripped`, wrong word order, not SOV,
  lowercase pronoun); `"he has two dogs"` → `"Ua Gni"` (the noun "dogs"
  dropped entirely); `"she has three children"` → `"Ua bi·sa·ko Gittam"`
  (missing the verb `donga` — already flagged in the previous handoff
  cycle, RC-CANDIDATE-006/007 area). No single reliable "have"
  construction currently exists.
- **`"let us X"` gap is broader than previously found:** the prior
  handoff flagged `eat`/`work` as *mismatched* values between `"let us
  X"` and `"let's X"`. Stress-testing found `"let us drink"`/`"let us
  speak"` are **missing from `corrections.json` entirely** (not just
  mismatched), producing badly broken `sov-assembly` output (`"Ringa
  Chingna"`, `"Chingna Agana"` — wrong word order, garbled pronoun).
  `"let's speak"` (contracted) is *also* missing, not just the
  non-contracted form. Coverage gap, not just a drift bug.

**Confirmed still-live, already-tracked (no new finding):** `"i can
eat"`/`"can i eat"` still drop "can" entirely (RC-CANDIDATE-004, blocked
on NV-008 as before). `"i watch tv"` still silently drops "TV"
(RC-CANDIDATE-005). `"i am lying down"` (no location) no longer produces
invalid Garo (RC-CANDIDATE-003's fix confirmed working for that specific
case) but now produces `"Anga ka·ma·ko"` — valid Garo, wrong meaning
(still resolves to the unrelated "down" root with an object marker,
rather than anything posture-related). Improved from broken to wrong,
not fully fixed — worth noting precisely rather than either overclaiming
the fix or missing that something changed.

**Category classification (2026-07-12, Claude A, Priority 5):**
imperatives = missing generalization, not missing grammar (RULE-029 is
correctly documented; `sov-assembly` just never applies it — likely
shared infrastructure with RC-010's weak-fallback problem). `"do not V"`
= missing generalization + wrong-rule selection (`"do not speak"`
produces valid Garo, but `RULE-017`'s statement-negation, not
`RULE-029`'s imperative-negation `-nabe` — both rules exist correctly,
the engine picks the wrong one for imperative input). Possession =
missing correction, not missing grammar (`RULE-G7` is confirmed and
documented; coverage is just one exact-match entry deep).

### RC-CANDIDATE-012 — Evidence (2026-07-12, Claude A, Priority 6)
Every live occurrence found in this corpus: `"you/he/she/we/they are
sad"` → `"Duk ong'a"` (apostrophe) — 5 occurrences, 1 per non-first-
person subject, `sad` only (not found on any other adjective in the
36-sentence predicate-adjective set). First-person `"i am sad"` is
correctly `"Anga duk ong·a"` (raka), verified working in a prior
session cycle — so the bug is specific to non-first-person `sad`.
Same person-conditioning shape as RC-013's `happy` finding — different
symptom, but both point at something less reliable in the
non-first-person predicate-adjective path generally.

---
- Nothing in the Pending section above has been fixed — only logged.
- Severity/priority labels are Claude B's engineering assessment only —
  not a substitute for Claude A's linguistic triage or Thangseng's
  validation of expected outputs.
