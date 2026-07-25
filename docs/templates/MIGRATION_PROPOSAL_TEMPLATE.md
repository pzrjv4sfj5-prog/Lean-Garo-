# Migration Proposal Template
_Adopted 2026-07-25, Project Owner directive. Use this structure for
every significant architectural, workflow, schema, or documentation
change — not for routine dictionary/grammar content edits, which have
their own review flow._

Copy this file, rename it `PROPOSAL_<TOPIC>_<DATE>.md`, fill in each
section. Leave a section explicitly marked "N/A — <why>" rather than
deleting it; an omitted section is easy to miss, a marked one isn't.

---

## Why
What problem is being solved? What happens if this is never done —
is it a real, active risk, or a nice-to-have?

## Current State
What is the current source of truth? Verify this directly against the
repository, not from memory or a prior doc's description of it.

## Target State
What is the desired end state, concretely enough that "are we done
yet" has an unambiguous answer?

## Migration Strategy
How do we move incrementally without losing information? Prefer a
sequence of small, independently-revertible steps over one large
change. Note which steps are mechanical (safe to automate/delegate)
versus which need judgment (and whose).

## Ownership
Who owns: the content, the implementation, the validation, and the
final approval? These are frequently four different people/roles on
this project — name each explicitly rather than assuming "whoever
does it."

## Backward Compatibility
What continues to work, unchanged, during the transition? What is the
old source of truth, and does it stay authoritative until the new one
is confirmed complete, or do both exist in parallel for a period?

## Completion Criteria
How do we know the migration is complete? Concrete and checkable —
"all 40 rules migrated, old format removed" not "mostly done."

## Verification
How is completion independently confirmed, not just asserted? Name
the actual check (re-run tests, diff output, direct repo inspection) —
a commit message or status note claiming success is not verification
by itself. (Added 2026-07-25 per Project Owner: a claimed-fixed status
this session turned out to need an independent recheck before being
trustworthy — even when the claim was, in the end, correct.)

## Rollback Plan
How do we safely revert if an issue is discovered — during the
migration, and after it's marked complete?

---

## Applying this template

`docs/PROPOSAL_GRAMMAR_RULE_SCHEMA_20260725.md` has been retrofitted
to this structure as the first real example — see that file.
