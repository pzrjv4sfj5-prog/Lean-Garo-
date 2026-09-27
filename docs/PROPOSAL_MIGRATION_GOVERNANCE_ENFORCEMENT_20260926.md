# Proposal: Mechanical Enforcement of Migration Document Requirements
_Claude D, 2026-09-26. Uses `docs/templates/MIGRATION_PROPOSAL_TEMPLATE.md`.
Content and migration plan proposed here; implementation and tooling
decisions belong to Claude B. This proposal does not touch any
dictionary, grammar, or runtime content._

## Why
`.ai/SESSION_BOOTSTRAP.md` (lines ~511 onward) states mandatory rules
for every migration document across all roles — most relevantly, Rule
6 (mandatory "Runtime Handoff" section) and Rule 6a (mandatory
"Governance-model check" note). These are currently honor-system:
nothing checks that a closing session actually included them.

This is an active gap, not a hypothetical one. A spot-check of the
four most recent Claude B session-migration documents —
`CLAUDE_B_SESSION_MIGRATION_20260923B.md`, `...20260923C.md`,
`...20260924B.md`, `...20260925.md` — found **zero** occurrences of
"Runtime Handoff" or "Governance-model check" in any of them, despite
`...20260925.md` alone being a 311-line close with four addenda
(a Project Owner override, a concurrent-session merge, a
sentence-builder check, a deployment check) — ample content for both
sections to have applied. By contrast, the five most recent Claude A
session-migration documents checked in an initial pass all carry a
Runtime Handoff section (worded "Runtime Handoff to Claude B" rather
than the literal template heading, which is itself a minor drift worth
closing — see Target State).

A second check, after three more session-closes landed mid-drafting of
this proposal (`docs/CLAUDE_B_SESSION_MIGRATION_20260926.md`,
`docs/CLAUDE_A_SESSION_MIGRATION_20260926.md`,
`docs/CLAUDE_A_SESSION_MIGRATION_20260926B.md`), found the gap is not
confined to Claude B: `CLAUDE_A_SESSION_MIGRATION_20260926.md` (a full
session close) also has zero occurrences of either required term,
while `...20260926B.md` has one. This suggests the gap is starting to
spread past the role it was first observed in, which raises the
urgency of a mechanical check over a documentation reminder — the
existing written rule is not self-enforcing even for the role that
otherwise complies with it most consistently.

If this continues unaddressed, a future session inherits exactly the
failure Rule 6 was written to prevent: an "NV CLOSED" or "fix
complete" claim in a migration doc, with no visible record of whether
the runtime layer (`compiled_dict.json`, `phrase_maps.js`,
`corrections.json`) was actually checked against it.

## Current State
Verified directly, 2026-09-26, against repo HEAD `02c08a5`:
- `.ai/SESSION_BOOTSTRAP.md` Rules 1–10 (~line 511–650) state the
  requirements; no automated check exists anywhere in the repo for
  any of them.
- `npm run build` (the existing gate — 461/461 unit tests at time of
  writing) does not inspect `docs/*SESSION_MIGRATION*.md` at all.
- Compliance is currently self-reported per session, checked (if at
  all) only by whichever human or Claude session happens to read the
  prior doc.

## Target State
1. A session cannot report a closing gate as green while the newest
   migration document in `docs/` is missing:
   - a section whose heading matches `Runtime Handoff` (allowing the
     documented variant "Runtime Handoff to Claude B"/"Runtime
     Handoff to Claude A", but not silent omission), containing
     either at least one entry or the literal line
     `Runtime Handoff: None.`;
   - a line containing "Governance-model check" (Rule 6a);
   - a "Completed work" or equivalent section that does not contain
     content outside the authoring role's lane (Rule 5) — this one
     is necessarily heuristic (e.g. flag if a Claude B doc's
     completed-work section contains strings like "VERIFIED/HIGH",
     "NV-1", "superseded" that suggest linguistic content bleeding
     in), and should warn rather than hard-fail, given false-positive
     risk.
2. `SESSION_BOOTSTRAP.md` Rule 6/6a wording is tightened to specify
   one exact accepted heading pattern per role, closing the ambiguity
   that let "Runtime Handoff to Claude B" pass as a variant in the
   first place — not because that variant is wrong, but because an
   automated check needs a defined pattern to match against.

## Migration Strategy
1. **Mechanical, no judgment required:** add
   `scripts/check-migration-doc.js`, run as part of `npm run build`
   (or a dedicated `npm run check-migration`), that:
   - identifies the newest file matching
     `docs/CLAUDE_[ABD]_SESSION_MIGRATION_*.md` (by git log date, not
     filesystem mtime, since a rebase can change mtime without
     changing authorship date);
   - greps it for the required headings/lines above;
   - exits non-zero with a clear message naming exactly what's
     missing if any required piece is absent.
2. **Needs Claude B's judgment:** deciding whether the check is a hard
   gate failure (blocks `npm run build` from reporting green) or a
   separate warning-only script — this proposal recommends hard gate
   for Rule 6/6a (objective, checkable), warning-only for the Rule 5
   lane-check (heuristic, higher false-positive risk).
3. **Needs Project Owner sign-off:** the `SESSION_BOOTSTRAP.md`
   wording tightening (exact heading strings) is a governance-document
   change, not a code change — per Rule 9 (Migration Policy) this kind
   of rework needs explicit authorization, not just Claude B
   implementing it unilaterally.
4. Sequence: (3) first (defines the exact strings), then (1)+(2)
   built against the now-fixed strings, so the check script isn't
   written against a moving target.

## Ownership
- **Content of this proposal:** Claude D (this document).
- **Implementation** (`scripts/check-migration-doc.js`, wiring into
  `npm run build`): Claude B.
- **Governance wording change** (`SESSION_BOOTSTRAP.md` Rule 6/6a exact
  heading strings): requires Project Owner authorization per Rule 9;
  drafting the specific wording is reasonable for either Claude A or
  Claude B to propose, but neither may commit it unilaterally.
- **Validation that the check actually catches a missing section:**
  whoever implements it, via the negative-case test in Verification
  below.
- **Final approval:** Project Owner.

## Backward Compatibility
Existing migration documents are not retroactively modified or
penalized — the check applies only going forward, to the newest doc
at gate-run time. Nothing about `WORKSTATE.yaml` or the resume
sequence (Rule 10) changes.

## Completion Criteria
- `scripts/check-migration-doc.js` exists, is wired into the build
  gate, and a deliberately non-compliant test fixture (a migration doc
  missing "Runtime Handoff") causes it to fail with a specific,
  actionable error message.
- `SESSION_BOOTSTRAP.md` Rule 6/6a specifies one exact heading string
  per role, with Project Owner sign-off recorded the same way other
  directives in this file are recorded (dated, attributed).
- The next Claude A and Claude B migration documents produced after
  this lands both pass the check without modification to this
  proposal's scope.

## Verification
- Re-run the four Claude B docs identified above (as historical
  fixtures, not live gate input) against the new script and confirm it
  correctly flags all four as non-compliant under the old rule text —
  this is the negative-control check that the script actually detects
  the gap this proposal exists to close.
- Confirm `npm run build` fails on a synthetic migration doc missing
  the required section, and passes once it's added.

## Rollback Plan
The check script is additive and isolated (`scripts/` + one line in
the `npm run build` chain) — reverting is a single commit removing
that wiring, with no effect on dictionary, engine, or compiled-output
files. The `SESSION_BOOTSTRAP.md` wording change, if made, should be
committed separately from the script so it can be reverted
independently if the exact heading strings need revision after
real-world use.
