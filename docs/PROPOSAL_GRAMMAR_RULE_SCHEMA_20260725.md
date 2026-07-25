# Proposal: Machine-Readable Grammar Rule Schema + Corpus/Test Linkage
_Claude A, 2026-07-25. Retrofitted 2026-07-25 to the standard migration
template (`docs/templates/MIGRATION_PROPOSAL_TEMPLATE.md`). Content and
migration plan proposed here; implementation and tooling decisions
belong to Claude B._

Two related proposals, sequenced by priority. Both use the full
template since they're independently completable and independently
revertible.

---

# Part 1 (higher priority): Link VALIDATION_CORPUS.md to the test suite

## Why
`docs/VALIDATION_CORPUS.md` and `tests/unit/translationEngine.test.js`
are two separate regression sources that don't talk to each other. A
grammar rule change can silently break a corpus row with nothing
catching it — this is an active risk, not a hypothetical one, and it's
about to matter more: Claude B's `grammarEngine.js` extraction
(modularization Phase 5, the highest-risk remaining phase) touches
exactly the function this corpus is meant to guard.

## Current State
Verified directly, 2026-07-25: `docs/VALIDATION_CORPUS.md` exists, is
structured (`English | Garo | Grammar Rules | Morphology | Status |
Confidence | Source`), and is tagged to rule IDs. It is **not** wired
into `npm test`. The 38 real regression tests in
`tests/unit/translationEngine.test.js` are hand-written separately,
with informal `RULE-XXX` comments on a few of them.

## Target State
A rule-catalogue change and a corpus row are structurally linked, such
that drift between them either can't happen or gets caught
automatically — not relies on someone remembering to check.

## Migration Strategy
1. Give each `VALIDATION_CORPUS.md` row a stable ID (`VC-001`,
   `VC-002`, ...).
2. Either (a) generate test cases from the table at test-run time, or
   (b) add a lint-style check that fails if a `RULE-XXX` catalogue
   entry changes without its corresponding corpus row being
   re-verified. Claude B's call which mechanism.
3. Land this ahead of modularization Phase 5 if timing allows (Claude
   B's sequencing suggestion, 2026-07-25) — not required, but the
   coverage is most valuable exactly when Phase 5 happens.

## Ownership
Content (which rows exist, what they claim): Claude A. Mechanism
(how the table gets consumed by `npm test`): Claude B. Validation
(does the new check actually catch a real drift case, tested
deliberately): Claude B, with a test case Claude A can supply.
Approval: Project Owner.

## Backward Compatibility
`VALIDATION_CORPUS.md` and the existing 38 hand-written tests both
keep working unchanged during the transition — this adds a link, it
doesn't remove either source. The hand-written tests can be migrated
into the corpus table later, separately, once the linkage itself is
proven.

## Completion Criteria
Every `VALIDATION_CORPUS.md` row has a stable ID. A deliberately
introduced rule/corpus mismatch (test case) is caught by `npm test`
failing, not silently passing.

## Verification
Don't take "wired in" on trust — deliberately break one corpus row
(edit expected output to something wrong) and confirm `npm test`
actually fails on it, then revert. That's the real proof, not the
presence of new code.

## Rollback Plan
The linkage mechanism can be reverted independently of both
`VALIDATION_CORPUS.md` and the existing test file — neither is
modified in a way that depends on the other existing.

---

# Part 2: Machine-readable grammar rule schema

## Why
`docs/GRAMMAR_RULE_CATALOGUE.md` is prose. Structuring it would make
tooling, automated cross-checking, and future maintenance easier
without changing what the rules say.

## Current State
Surveyed all 40 rules directly, 2026-07-25 (not assumed from memory).
Every rule uses exactly the same 8 field labels — `Description`,
`Examples`, `Counterexamples`, `Dependencies`, `Native Notes`,
`Validation Status`, `Confidence`, `Launch Priority` — zero label
drift. But 12 of 40 rules (30%) pack multiple independently-verified
sub-claims into one `Validation Status`/`Confidence`/`Launch Priority`
field. Example, RULE-031: "Verified (bare copula, all 4 persons);
Disconfirmed (predicate nominal); Needs Native Validation
(predicate-adjective use)" — three distinct findings in one sentence.

## Target State
A structured, per-rule record that preserves this compound-claim
nuance rather than collapsing it — see schema below — while
`GRAMMAR_RULE_CATALOGUE.md` stays the authoritative, human-readable
source.

### Proposed schema (per rule)
```yaml
id: RULE-031
description: "..."
dependencies:
  - id: RULE-004
    note: "optional context"
claims:                # length 1 for ~70% of rules; length >1 for the 12 compound ones
  - scope: "bare copula, all 4 persons"
    status: verified   # enum: verified | disconfirmed | needs_native_validation | partially_validated
    confidence: high    # enum: high | medium | low | n/a
  - scope: "predicate nominal"
    status: disconfirmed
    confidence: n/a
examples:
  - english: "..."
    garo: "..."
counterexamples: []
launch_priority:
  - scope: "structure"
    tier: P0
native_notes: "..."    # prose, exact wording preserved - do not paraphrase this field away
last_updated: "2026-07-25"
updated_by: "Claude A"
```
`scope` is free text, not an enum — where a rule splits into
sub-claims differs every time, and forcing a controlled vocabulary
here would reintroduce the same information loss this schema exists
to avoid.

## Migration Strategy
1. **Mechanical pass** (Claude B or scripted, low risk): parse all 40
   rules' 8 known fields into the schema, `claims` defaulting to a
   single entry. Faithful structural mirror, no interpretation needed
   — labels are already consistent.
2. **Manual split pass** (Claude A, the 12 compound rules only):
   proper `claims[]` entries for the rules that need it — this needs
   the same judgment that wrote the original compound sentence.
3. Roll out gradually, small batches, not one large migration commit.

## Ownership
Schema design and the 12-rule manual split: Claude A (linguistic
judgment about what constitutes a distinct claim). Parsing tooling,
file format, and build integration: Claude B. Approval: Project Owner.

## Backward Compatibility
`docs/GRAMMAR_RULE_CATALOGUE.md` remains authoritative throughout — the
structured file is generated from it or kept in sync with it (Claude
B's call which direction), never a silent replacement. Two sources of
truth is worse than one prose doc, so this must not create a second
place rule content can drift out of sync.

## Completion Criteria
All 40 rules represented in the structured schema, each traceable back
to its source paragraph in `GRAMMAR_RULE_CATALOGUE.md`. The 12 compound
rules have multi-entry `claims[]`, not a flattened single status.

## Verification
Spot-check a sample of structured entries against the live catalogue
text side-by-side (not just against the migration script's own
output) — particularly the 12 compound rules, since that's where
information loss would actually happen if the split were done
carelessly.

## Rollback Plan
The structured file is additive — reverting means deleting it and
continuing to use `GRAMMAR_RULE_CATALOGUE.md` directly, as today.
Since it's generated from/synced with the prose doc rather than
replacing it, no data exists solely in the structured form.

---

## What this doc is not
Not a request to change the engine, not a request to touch
`master_dictionary.json` or dictionary content, not urgent. Flagged in
`SESSION_BOOTSTRAP.md`'s joint work package for Claude B to pick up on
their own timeline.
