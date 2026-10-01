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

## Update 2026-09-30 (Claude A) — superseded by direct native confirmation

**This ruling's "status quo, not productive" conclusion is superseded.**
The exact open relay question this doc itself flagged ("does `-rang`
generalize to other count nouns?") was sent and answered.

Thangseng relay via Project Owner, WhatsApp, 28-29/9/2026, filed
verbatim in `docs/THANGSENG_RELAY_ANSWERS_20260930.md`, processed
2026-09-30. Machine-rule-format question (A/B/C: general rule / only
certain nouns / depends on context), answer **A**, unambiguous: "Yes.
-rang can be added to any countable nouns to make it plural."

### New ruling

**`-rang` is a productive plural marker for countable nouns in
general, not confirmed-only-where-cited.** This reverses the original
ruling's core conclusion, not just adds a data point to it — the
2026-08-25 reasoning (three data points too thin to generalize from)
no longer applies once a direct, general native answer exists; this
is not a case of inferring productivity from an accumulation of
individually-cited examples, which the original ruling correctly
declined to do.

### What this does and doesn't settle

- Settled: `-rang` is not restricted to an unknown closed list or a
  noun-class gate. Any countable noun can in principle take it.
- NOT settled by this answer alone: the exact surface form `-rang`
  takes when suffixed to a given noun (vowel/consonant-final
  adjustments, if any — the three existing confirmed forms,
  `Bi·sarang`/`biterang`/`tangka bisilrang`, all simply append `-rang`
  with no visible alternation, but that's 3 data points, not a
  phonological rule). Generating a `-rang` form for a noun with no
  individual citation is therefore still a prediction, not a citation
  — correct under the new general rule, but engineering should treat
  it as rule-generated content, not dictionary-sourced content, same
  distinction the project draws elsewhere between composed and
  looked-up output.
- The original ruling's engineering-consequence point stands even
  under the new conclusion: implementing general `-rang` generation
  (e.g. at `assembleSentenceSOV`'s pluralization fallback) is new
  scope for Claude B, not something this update does by itself. Filed
  as a Claude B handoff, not implemented here.

### Disposition (supersedes the original "Disposition" section above)

- The three existing `-rang` forms keep shipping via their own
  dictionary rows, unaffected.
- No dictionary-wide `-rang` generation added in this update — that is
  an engine-layer change, left for Claude B, now unblocked by this
  ruling rather than blocked by it.
- `.ai/SESSION_BOOTSTRAP.md`'s 2026-08-25 standing-rule note is
  updated alongside this doc (see that file) to point here rather than
  restate the now-superseded status-quo conclusion.

The original ruling and its reasoning above are kept on the record,
not deleted — it was the correct call on the evidence available on
2026-08-25.
