# Pending Regression Cases
_Started: 2026-07-08 by Claude B, evidence-collection mode (Claude A unavailable)_
_Status: LIVING DOCUMENT — candidates only. None of these are in the
`REGRESSION_CASES` test suite (currently 51/51 passing, unchanged). Do not
add to the suite until Claude A has reviewed and, where needed, Thangseng
has confirmed the expected Garo output._

## Purpose
Every weakness the Native Sentence Validation Audit exposes gets logged
here as a candidate regression case, with the exact input/actual-output
pair already captured, so Claude A can review and approve/reject without
re-deriving the evidence. **No fixes are implemented from this document.**

## Format
Each candidate includes: input, current (actual) output, expected output
(if known/native-confirmed), suspected root cause, severity, and status.

---

## RC-CANDIDATE-001 — Necessity-modal negation (`nangja`) collapses into desire-negation

- **Input:** `"I don't need to watch TV"`
- **Current output:** `Anga sikengja` (confidence 0.82, grammar-assembly)
- **Expected output:** Unknown — needs a native-confirmed isolated
  translation of this exact clause (Case 1 only confirms the compound
  sentence's `nangja` = "need not"; the clause hasn't been independently
  native-translated in isolation)
- **Suspected root cause:** Grammar — `sikenga`/"want" + negation is the
  only desire/necessity-negation path in the engine; no distinct handling
  for necessity-modal (`nangja`) vs. simple desire-negation
- **Repository components:** `src/translationEngine.js` grammar-assembly;
  `docs/GRAMMAR_RULE_CATALOGUE.md` (no existing rule covers this)
- **Severity:** Medium — produces a plausible-sounding but semantically
  imprecise output rather than a crash/garbage output
- **Status:** Needs Claude A Review, then Needs Thangseng Validation (confirm expected isolated-clause output) before this can become a real test

## RC-CANDIDATE-002 — Locative adjunct "in bed" gets object marker instead of locative

- **Input:** `"I can watch status lying in bed"` (full) / `"in bed"` (isolated)
- **Current output:** `Anga palang·ko ni·rik·a` (full, `·ko` object marker) /
  `Palang` (isolated, via `stopword-stripped` method — `·o` not applied at
  all, "in" discarded as a stopword)
- **Expected output:** `palango` pattern per native sentence — i.e.
  `Palang` + `·o` locative, not `·ko` object marker, and not stopword-
  stripped to bare `Palang`
- **Suspected root cause:** Grammar/Morphology — the engine's preposition
  handling for "in" doesn't consistently route to the `·o` locative
  suffix; behavior differs between isolated ("in bed" → stopword-stripped,
  loses the locative marker entirely) and embedded-in-larger-clause ("...
  in bed" → gets `·ko` object marker instead). Two different wrong paths
  for what should be the same locative construction.
- **Repository components:** `src/translationEngine.js` — stopword list /
  preposition-to-suffix mapping logic in grammar-assembly
- **Severity:** Medium-High — this is a structural/grammatical error, not
  just a missing word; the confirmed correct form (`Palang`+`·o`) already
  exists and works when directly requested via `corrections.json`'s `"in /
  at": "·o"` entry, so this is a routing/selection bug, not a missing
  morpheme
- **Status:** Needs Claude A Review (confirm this is in scope vs. an
  engineering-only fix once diagnosed) — flagging here rather than fixing
  directly per the evidence-first instruction

## RC-CANDIDATE-003 — Posture verb "lying" produces malformed/invalid output

- **Input:** `"I am lying down"` / `"I am lying in bed"`
- **Current output:** `Anga Ka·ma` (misparsed as directional "down",
  reusing the unrelated `down = Ka·ma` correction) / `Anga Palangha`
  (invalid Garo — `Palang`, a noun, treated as a verb root with a
  past-tense-shaped `-ha` suffix appended)
- **Expected output:** Unknown — `tue` is confirmed as the relevant
  morpheme (Case 1) but its exact isolated-clause conjugation/output has
  not been native-confirmed
- **Suspected root cause:** Dictionary + Morphology — no posture-verb
  concept ("lie down") exists in the engine at all; "lying down" is
  string-matched against the unrelated `down`/`Ka·ma` correction, and "lying
  in bed" falls through to a generic verb-suffix-append routine that
  incorrectly targets the noun `Palang`
- **Repository components:** `src/data/corrections.json` (no posture-verb
  entries); `src/translationEngine.js` (verb-root detection incorrectly
  matches a noun in the fallback path)
- **Severity:** **High** — this is the one candidate that produces
  structurally invalid Garo output rather than an incomplete-but-valid one.
  Recommend flagging to Claude A as priority review even though it is not
  launch-blocking (posture verbs aren't in the current V1.0 scope
  otherwise).
- **Status:** Needs Claude A Review, then Needs Thangseng Validation for the correct target form(s)

## RC-CANDIDATE-004 — Ability modal ("can") dropped entirely

- **Input:** `"I can watch"` / `"I can eat"` / `"I can watch status lying in bed"`
- **Current output:** `Anga ni·rik·a` / `Anga Cha·a` / `Anga palang·ko
  ni·rik·a` — in all three, identical to the non-modal form of the same
  sentence (no ability marker present at all)
- **Expected output:** Should include `man·a`/`man·ienga`-family marking
  per Case 1's confirmed `man·ienga` = "can/able" (continuous ability).
  `master_dictionary.json` already has `"can": "man·a"` — exact expected
  output per input still needs native confirmation.
- **Suspected root cause:** Grammar — `man·a` exists in the dictionary
  (confirmed via `master_dictionary.json` lookup) but the grammar-assembly
  path does not appear to invoke it for English "can + verb" constructions
  — looks like a wiring gap (existing lexical resource not connected to the
  relevant grammar rule) rather than a missing word.
- **Repository components:** `src/translationEngine.js` grammar-assembly
  (modal-verb detection/routing); `docs/GRAMMAR_RULE_CATALOGUE.md` (no
  ability-modal rule currently cross-referenced)
- **Severity:** Medium-High — systematic, confirmed across 3 independent
  inputs, not sentence-specific
- **Status:** Needs Claude A Review (confirm whether `man·a` wiring is an
  engineering-only fix or needs a formal rule first), then Needs Thangseng
  Validation for exact expected forms

## RC-CANDIDATE-005 — English loanwords (`TV`, `status`) silently dropped

- **Input:** `"I watch TV"` / `"I am watching TV"` / (status untested in
  isolation yet — only within the Case 1 compound sentence)
- **Current output:** `Anga ni·rik·a` (both TV inputs — word vanishes
  entirely, no error/fallback marker)
- **Expected output:** Should retain `TV` per Case 1's native-confirmed
  loanword usage — likely `Anga TV ni·rik·a` or similar, pending Claude A/
  Thangseng confirmation of exact placement and any required suffixing
- **Suspected root cause:** Dictionary — no pass-through mechanism for
  unrecognized capitalized/loanword tokens; they're silently discarded
  rather than retained or flagged
- **Repository components:** `src/data/corrections.json` /
  `master_dictionary.json` (no entries); `src/translationEngine.js` (no
  loanword pass-through fallback observed — unrecognized tokens are
  dropped, not retained)
- **Severity:** Medium — silent data loss is worse than a visible failure;
  no `[UNKNOWN]` marker appears for `TV` the way one does for full-sentence
  passthrough (Case 1, Step 1), which means this failure mode is currently
  invisible to a user reading the output
- **Status:** Needs Claude A Review (decide on general loanword policy —
  individual entries vs. a systematic pass-through mechanism — since this
  will likely recur for other English loanwords beyond `TV`/`status`)

---

## Summary table

| ID | Weakness | Severity | Status |
|---|---|---|---|
| RC-CANDIDATE-001 | `nangja` necessity-modal collapses into desire-negation | Medium | Needs Claude A Review |
| RC-CANDIDATE-002 | `·ko` vs `·o` selection error on locative "in bed" | Medium-High | Needs Claude A Review |
| RC-CANDIDATE-003 | Posture verb "lying" → malformed/invalid Garo | **High** | Needs Claude A Review |
| RC-CANDIDATE-004 | Ability modal "can" dropped entirely, systematic | Medium-High | Needs Claude A Review |
| RC-CANDIDATE-005 | Loanwords (`TV`) silently dropped, no error marker | Medium | Needs Claude A Review |

## Explicitly out of scope
- No fixes implemented.
- No entries added to the live `REGRESSION_CASES` test suite (still 51/51,
  unchanged).
- Severity/priority labels above are Claude B's engineering assessment
  only — not a substitute for Claude A's linguistic triage or Thangseng's
  validation of expected outputs.
