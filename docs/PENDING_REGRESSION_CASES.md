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
**Implemented:** commit series 2026-07-12. Root cause confirmed exactly
as diagnosed — `analyzeGrammar`'s entire grammar-assembly block was
gated on `PRONOUN_MAP[firstWord]`. Fix: added NP-subject detection
scoped to `[article] + [noun] + [copula/end-of-sentence/stopword]`
(a coherence check, not a per-word patch — see `translationEngine.js`'s
"Parser-boundary review" comment for the full reasoning, including why a
`findVerbForm`-based coherence check was tried and rejected — it proved
unreliable since `findVerbForm` isn't actually verb-specific without POS
data).

**Confirmed working:** all 5 of the originally reported patterns (`"the
book is on the table"`, `"the teacher is in the market"`, `"the market
is far"`, `"the table is big"`, and `"the dog is under the table"` via
the pre-existing `corrections.json` exact match) now reach
`grammar-assembly` with correct subject + verb/locative structure.

**Explicitly and intentionally out of scope (documented boundary, not a
silent gap):** demonstrative-led (`"this dog..."`), quantifier-led
(`"two teachers..."`), possessive-headed (`"my dog..."` as sentence
subject), coordinated (`"the dog and the cat..."`), and any
adjective/multi-word-modified subject (`"a big dog..."`) — these fail
the coherence check and safely fall back to the pre-existing
`sov-assembly` path rather than risk mislabeling. Real architectural
limitation: no POS data exists anywhere in this repository to
distinguish a modifier from a head noun (verified directly —
`master_dictionary.json`'s `pos` field is null on every entry). Building
real NP-boundary detection needs that data first; not attempted here.

Regression tests: `tests/unit/translationEngine.test.js` — one
confirming the fix, one confirming the boundary (adjective case safely
falls back rather than mislabeling).

### RC-CANDIDATE-011 — Locative `·o` marking is per-noun, not generative
**Resolved — confirmed disappeared, benchmark rerun 2026-07-12.** Per
Priority 2 of the RC-010 handoff ("do not implement immediately, rerun
the benchmark after RC-010, only implement if it's a separate issue"):
reran all originally-reported sentences (`"i am lying in the
bed/market/school/house/table/room"`, `"i am waiting at the
bed/table/market/school/house"`). All now produce correct `·o` marking.
**Not a separate issue — same root cause as RC-010.** Specifically: the
RC-010 fix included a generalized guard in the verb-search loop (a word
immediately after `in`/`on`/`at`, even across an intervening article, is
never the main verb — see `translationEngine.js`). That guard applies
inside the shared pronoun/NP-subject block, so it fixed locative marking
for *both* subject types simultaneously, even though RC-011 was
originally reported only for pronoun subjects. No separate
implementation needed. One new minor observation surfaced during the
rerun, unrelated to this fix: `"market"` resolves to two dictionary
alternates joined by `"/"` (`"bajal / anti·o"`) rather than one clean
value — a pre-existing dictionary-data quirk, not a grammar bug, noted
below rather than fixed.

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

---
- Nothing in the Pending section above has been fixed — only logged.
- Severity/priority labels are Claude B's engineering assessment only —
  not a substitute for Claude A's linguistic triage or Thangseng's
  validation of expected outputs.
