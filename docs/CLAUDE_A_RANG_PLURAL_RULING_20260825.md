# Claude A — `-rang` Plural Marking Scope: Ruling (2026-08-25)

Resolves the item handed off in `docs/CLAUDE_B_RANG_PLURAL_AUDIT_20260824.md`
(§8): is `-rang` a productive Garo plural morpheme, and if so, what
governs which nouns take it?

## Ruling

**Status quo, formalized: `-rang` is used only where explicitly
native-confirmed. Not ruled productive for any class, universal or
restricted. Zero engineering change required.**

This is option 3 of the three Claude B's audit laid out in §7 — the
one requiring no new code and no new schema field.

## Why

Only three native-confirmed data points exist: children (animate),
fruits (inanimate/count), coins (inanimate/count). That set already
rules out a strict animate-only rule (2 of 3 are inanimate), but three
points across two categories cannot establish universal productivity
either — every other checked noun (dog, tree, apple, book, student,
person) has zero attested plural form of any kind, which is an
absence of data, not evidence those nouns take no marker.

A "universally productive" or "class-restricted" ruling would mean
generating a guessed `-rang` form for every other noun with no
individual native confirmation — exactly the engineering-invents-
linguistic-content move the evidence-first methodology and the A/B
role split exist to prevent (per `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md`).
Class-restriction specifically would also require inventing a
noun-class signal (animacy field, or reusing `CLASSIFIER_MAP` family
as a proxy) that itself needs native confirmation before it could be
trusted to predict `-rang` eligibility — a second guess stacked on the
first.

Declining to generalize is the correct call under evidence-first
discipline, not an unaddressed gap.

## Disposition

- The three existing `-rang` forms (children, fruits, coins) keep
  shipping via their own dictionary rows — unaffected.
- Every other bare plural noun continues to fall through to the
  unmarked singular at runtime — unaffected, confirmed already correct
  behavior per the audit, not a bug.
- No `assembleSentenceSOV` change, no new schema field. Claude B's
  engineering-consequence analysis (audit §7, third bullet) already
  covers this: "zero engineering change needed... only action item is
  documentation."

## Documentation action (this ruling)

- `.ai/SESSION_BOOTSTRAP.md` — added a standing-rule note that this is
  deliberate, evidence-first policy, not an unaddressed gap, so a
  future session doesn't reopen it as a suspected bug.
- Flagged as an open relay question (not yet sent) for a future
  Thangseng batch: does `-rang` generalize to other count nouns
  (e.g. "dogs", "trees", "books") — more data points needed before any
  productivity ruling could be made, in either direction.

No `master_dictionary.json` / `corrections.json` / `phrase_maps.js`
content changed. No engine code touched.
