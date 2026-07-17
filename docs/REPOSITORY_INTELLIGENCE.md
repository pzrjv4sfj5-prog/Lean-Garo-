# Repository Intelligence — Design Notes (BACKLOG-006, first increment)
_Written 2026-07-09 by Claude B. Companion to `repository-intelligence.js`
(repo root) — read that file's header comments for the mechanics; this
doc is the "why," per the Phase 2 brief's requirement to document design
decisions and explain how they support the long-term vision._

## Why this exists (not just "a validation script")

Three separate raka bugs and one lexical-contamination bug
(RC-CANDIDATE-006, "search") were each found by a human or Claude
happening to look — no automated process caught any of them before they
shipped. `ARCHITECTURE.md`'s BACKLOG-006 already named this pattern.
This is the first piece of infrastructure that makes the repository
**check itself**, per the Phase 2 mission's framing: engineering
investments should make future capabilities easier, not just solve
today's instance of a problem.

The reusability test this was designed against: **when a new lexical
table gets added** (the next likely candidate per `ARCHITECTURE.md` §12
is finishing morphology-data externalization), does this tool extend by
adding one line to a config, or does it need to be rewritten? As built,
adding a table to Check B's strict comparison is one line
(`strictTables[name] = loadJSON(path)`); adding it to Check A requires
nothing (it already iterates a file list). That was a deliberate
design constraint, not an accident.

## Why Check A doesn't fail the build

The first real run surfaced 18 candidates. Manually reviewing them (see
`docs/PENDING_REGRESSION_CASES.md` RC-CANDIDATE-009) showed several are
almost certainly **not** RULE-001 violations at all — they're the
"lexical split" trap `CLAUDE_A_FINAL_HANDOUT.md` names as the single most
expensive recurring mistake in this project's history: two different
*words* that happen to share letters, mistaken for one word with
inconsistent grammar. `ring·` (raka) legitimately exists for the noun
"ring/bell"'s possessive even though the no-raka verb "ring" (drink) is
correctly raka-free — a naive substring check can't tell these apart.
`wa·a` (bamboo) and `wa` (rain, no-raka, confirmed) are plausibly
unrelated words entirely.

Making this a hard gate would have meant either (a) the build breaking on
launch day over mostly-false-positive noise, or (b) reflexively
allowlisting everything just to get green, which defeats the check's
purpose either way. **A detector that requires word-sense knowledge it
doesn't have should report, not assert.** This is the same discipline
`CLAUDE_A_FINAL_HANDOUT.md` asks of Claude A ("classify honestly — Needs
Native Validation means it's plausible and unconfirmed") applied to
tooling: the script's own confidence should reflect what it can actually
verify.

## Why Check B does fail the build

Cross-table value mismatches for the same English key don't have the
same ambiguity problem — if `purpose_map.json` and `corrections.json`
disagree on what Garo word corresponds to `"search"`, that's a fact
about the repository's current state, not a matter of interpretation.
What Claude B can't determine is *which value is right* (that's Claude
A's call) — but *that they disagree* is objectively checkable, so it's
safe to gate on.

The known-issue allowlist exists so this check doesn't immediately
re-break the build the moment it's introduced, over findings that are
already logged and legitimately pending review — not as a way to make
noise disappear. Every entry in `KNOWN_CROSS_TABLE_EXCEPTIONS` has a
corresponding `RC-CANDIDATE-*` entry in `docs/PENDING_REGRESSION_CASES.md`
citing it. Adding to the allowlist without adding the paired regression
case would defeat the whole design — this is a discipline expectation
for whoever touches this file next (either Claude), not an enforced
constraint (nothing currently stops someone from allowlisting silently;
that's a known weak point, see "Not done here" below).

## Why the root-prefix heuristic (Check B2) instead of exact match

`purpose_map.json` is *supposed* to hold a different inflected form than
`corrections.json` for the same key — `"eat"` legitimately being
`Cha·a` (bare/imperative) in one table and `cha·na` (purposive "to eat")
in the other is the table doing its job, not a bug. An exact-match
comparison flagged 24 "violations" on the first attempt, of which all but
2 (`sing`, `dance`) were this exact false-positive pattern. The
root-prefix heuristic (do the two values share at least one leading
character?) is coarse, but it cleanly separated "same root, expected
suffix difference" from "apparently different root chosen entirely" in
every case checked so far. This is a heuristic, not a linguistic rule —
if Claude A ever confirms a legitimate case where the same root produces
completely non-overlapping surface forms (e.g. heavy vowel harmony or a
suppletive form), this heuristic would need revisiting. Documented here
so that's a known limitation, not a silent one.

## What this does NOT do (documented gaps, not silent ones)

- **Doesn't cover `master_dictionary.json`/`garo_dictionary.json`.** These
  are large (7,095 / 5,798 entries), multi-field, and include alternates
  and category metadata that don't map cleanly onto the "one key, one
  value" comparison this tool does. Extending to them is a real
  opportunity (Phase 2 P2: "identify places where knowledge is still
  embedded... document opportunities first") but needs its own design —
  attempting it with the current tool's logic would likely produce mostly
  noise, the same mistake Check A almost made.
- **Doesn't check the reverse raka direction** (a confirmed raka-root
  losing its mark) — see the code comment in `repository-intelligence.js`
  for why that needs root-stripping heuristics this version deliberately
  avoids.
- **Doesn't self-enforce the allowlist-needs-a-paired-RC-case rule** — an
  entry could technically be added to `KNOWN_CROSS_TABLE_EXCEPTIONS`
  without a corresponding `docs/PENDING_REGRESSION_CASES.md` entry, and
  nothing in the tool would catch that. This is a process discipline, not
  a technical guarantee, same as several other repository conventions
  (e.g. "update `.ai/WORKSTATE.yaml` before ending a session").
- **Doesn't yet run in CI as a separate gate** — it's wired into
  `npm run build` (see below), which CI already runs, so it's covered,
  but it doesn't have its own named CI step the way the test suite does.

## What this enables next

With this pattern established, the next tables to fold in (whenever they
exist) cost roughly one line each. If/when morphology data gets
externalized (per `ARCHITECTURE.md`'s open item), this tool's Check B
pattern extends naturally to cross-checking morphology rules against the
lexical tables that use them (e.g. "does every root this rule claims to
apply to actually exist in a lexical table, and vice versa") — a
different, more valuable check than anything possible while morphology
logic is still inline JS. Not started; noting the direction per the
Phase 2 instruction to identify opportunities without redesigning now.

**2026-07-17 update — Check C + bulk import tool.** Built ahead of an
expected bulk absorption of hundreds of published dictionary entries:
- **Check C** (`checkDictionarySelfConsistency`) audits
  `master_dictionary.json` against itself — same english key, 2+
  distinct garo values, gated against a baseline allowlist
  (`src/data/known_dictionary_conflicts.json`, 1053 pre-existing keys).
  Same asymmetric posture as Check A/B: not asserting the 1053 are bugs,
  but any conflict introduced *after* the baseline snapshot fails the
  build immediately instead of waiting for someone to notice by accident
  (how RC-CANDIDATE-012 and RC-CANDIDATE-019 were both found).
- **`scripts/import-dictionary.js`** — dry-run-by-default bulk importer.
  Validates schema, quarantines within-batch conflicts and
  conflicts-with-existing-data into `docs/PENDING_DICTIONARY_IMPORT_CONFLICTS.md`
  for Claude A's review, and only ever auto-appends entries that are
  new, well-formed, and non-conflicting. Never overwrites, never picks a
  winner between conflicting sources — mirrors the standing integration
  rule (linguistic content from an external source is Claude A's
  decision, not something this tool resolves on its own).

## How to extend this safely

1. New lexical JSON table added → add its path to `lexicalFiles` (Check A)
   and, if it's meant to hold identical forms to `corrections.json`, add
   it to `strictTables` (Check B1). If it's meant to hold a systematically
   different inflected form (like `purpose_map.json`), it needs its own
   B2-style heuristic, not a blind add to B1 — check the shape of the
   data first.
2. New violation found → log it in `docs/PENDING_REGRESSION_CASES.md`
   with an `RC-CANDIDATE-*` number **before** adding it to
   `KNOWN_CROSS_TABLE_EXCEPTIONS`, and cite that number in the code
   comment next to the allowlist entry.
3. Claude A resolves a finding (confirms right/wrong value or that it's
   an intentional variant) → whoever implements the fix removes the key
   from `KNOWN_CROSS_TABLE_EXCEPTIONS` (if fixed) or leaves it with an
   updated comment explaining it's a confirmed-intentional variant, not a
   pending question, and updates the `docs/PENDING_REGRESSION_CASES.md`
   entry's status accordingly.
