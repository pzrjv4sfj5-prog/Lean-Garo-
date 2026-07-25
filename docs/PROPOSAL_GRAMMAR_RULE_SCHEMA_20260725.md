# Proposal: Machine-Readable Grammar Rule Schema + Corpus/Test Linkage
_Claude A, 2026-07-25. Content and migration plan proposed here;
implementation and tooling decisions belong to Claude B._

## Priority order (per Project Owner discussion, 2026-07-25)

1. **Link `VALIDATION_CORPUS.md` to the automated test suite** — highest
   value, addresses an active risk, not a future one.
2. **Machine-readable rule schema** — grounded in what's actually in
   `GRAMMAR_RULE_CATALOGUE.md` today, not invented fresh.

Both are proposals only. Nothing in this doc changes engine behavior,
dictionary data, or `PENDING_REGRESSION_CASES.md`.

---

## 1. VALIDATION_CORPUS.md ↔ test suite: the actual gap

Checked directly, 2026-07-25: `docs/VALIDATION_CORPUS.md` already
exists, is already structured (`English | Garo | Grammar Rules |
Morphology | Status | Confidence | Source`), and is already tagged to
rule IDs. It is **not**, however, wired into `npm test` in any way.
The 38 real regression tests in `tests/unit/translationEngine.test.js`
are hand-written separately, with informal `RULE-XXX` comments in a
few of them. The two lists can drift — a rule change could silently
break a corpus row with nothing catching it.

**Proposed direction (concept only, Claude B's call on mechanics):**
give each `VALIDATION_CORPUS.md` row a stable ID
(`VC-001`, `VC-002`, ...), and have the test suite consume the table
directly — either by generating test cases from it at test-run time,
or by a lint-style check that fails if a `RULE-XXX` catalogue entry
changes without a corresponding corpus row being re-verified. Either
approach makes drift structurally harder instead of relying on someone
remembering to check.

---

## 2. Rule schema: what's actually there today

Surveyed all 40 rules in `docs/GRAMMAR_RULE_CATALOGUE.md` directly
(not assumed). Result, better than expected on one axis, and with one
real design problem on another:

**Good news — zero field-label drift.** Every single rule uses exactly
the same 8 fields, no variants, no missing fields:
`Description`, `Examples`, `Counterexamples`, `Dependencies`,
`Native Notes`, `Validation Status`, `Confidence`, `Launch Priority`.
A first-pass mechanical extraction into structured form is
straightforward — no messy normalization pass needed first.

**The real problem — compound claims within a single rule.** 12 of 40
rules (30%) pack multiple, independently-verified sub-claims into one
`Validation Status`/`Confidence`/`Launch Priority` field. Example,
RULE-031:
> Verified (bare copula, all 4 persons); Disconfirmed (predicate
> nominal — see update); Needs Native Validation (predicate-adjective
> use...)

A flat schema with one `status` field per rule would silently lose
this — collapsing three independently-tracked findings into one value
picks a winner that doesn't exist. This is the actual design
constraint, not label inconsistency.

### Proposed schema (per rule)

```yaml
id: RULE-031
description: "..."               # prose, as today
dependencies:
  - id: RULE-004
    note: "shares evidence with the bare-adjective predicative strategy"  # optional
claims:                          # almost always length 1; length >1 for the 12 compound rules
  - scope: "bare copula, all 4 persons"
    status: verified             # enum: verified | disconfirmed | needs_native_validation | partially_validated
    confidence: high             # enum: high | medium | low | n/a
  - scope: "predicate nominal"
    status: disconfirmed
    confidence: n/a
  - scope: "predicate-adjective use (rinok rinok daka)"
    status: needs_native_validation
    confidence: unknown
examples:
  - english: "..."
    garo: "..."
counterexamples: []
launch_priority:
  - scope: "structure"           # only split when the rule itself is compound; most rules: single entry, no scope
    tier: P0
native_notes: "..."              # prose, as today - direct quotes matter here, don't structure away the exact wording
last_updated: "2026-07-25"
updated_by: "Claude A"
```

`scope` is free text, not an enum — the point at which a rule splits
into sub-claims is different every time (register, person, word-order
context, etc.) and forcing it into a controlled vocabulary would
reintroduce the same information loss this schema exists to avoid.

### Migration plan

1. **Mechanical pass (Claude B or scripted, low risk):** parse all 40
   rules' 8 known fields into the schema above with `claims` as a
   single-entry array by default. This is a faithful structural mirror
   of the current doc — no interpretation needed, since the field
   labels are already 100% consistent.
2. **Manual split pass (Claude A, the 12 compound rules only):** for
   the 30% that pack multiple sub-claims into one field, I split each
   into proper `claims[]` entries — this needs the same linguistic
   judgment that wrote the original compound sentence, not a
   parsing script guessing where to break it.
3. **`docs/GRAMMAR_RULE_CATALOGUE.md` stays authoritative and
   human-readable** — the structured file is generated *from* it or
   kept in sync with it (Claude B's call which direction), not a
   replacement. Two sources of truth is worse than one prose doc.
4. Roll out gradually, rule-by-rule or in small batches, not as one
   large migration commit — matches this project's existing
   session-scoped workflow.

---

## What this doc is not

Not a request to change the engine, not a request to touch
`master_dictionary.json` or dictionary content, not urgent. Flagged in
`SESSION_BOOTSTRAP.md`'s joint work package for Claude B to pick up on
their own timeline.
