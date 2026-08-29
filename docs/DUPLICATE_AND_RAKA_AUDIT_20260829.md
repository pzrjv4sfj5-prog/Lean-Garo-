# Duplicate-Key Backlog — Regenerated Census (2026-08-29)

Supersedes `docs/DUPLICATE_AND_RAKA_AUDIT_SUMMARY.md` (2026-06-20, Claude B)
for the duplicate-key report specifically — that report's raw counts
(1,055 groups) predate ~2 months of NV closures and are no longer
representative. The double-raka cluster (833 entries) in that doc is
untouched by this pass, still open, not re-audited here.

## Method

Grouped `master_dictionary.json`'s 9,947 rows by case/whitespace-
normalized `english` key. 1,619 groups have 2+ rows (3,972 rows
involved). Classified each group:

- **Exact zero-info duplicates** (identical english+garo+confidence+
  classifier+category): **0**. Confirms sessions 3/4's sweeps already
  cleared this category; nothing left of this shape.
- **Legitimate VERIFIED-primary + SUPERSEDED/unverified siblings**
  (exactly one non-variant-tagged VERIFIED/HIGH garo value in the
  group): **848 groups**. This is the citation-discipline pattern
  working as designed — no action needed, not re-litigated.
- **Groups with 2+ distinct non-variant-tagged VERIFIED/HIGH primaries**
  (genuine competing-value candidates): **9 groups** — see below,
  individually resolved or flagged.
- **Other** (no single non-variant VERIFIED/HIGH primary — e.g. all
  candidates unverified, or superseded+unverified only): **715 groups**.

## The 9 competing-primary candidates — individually checked

8 of 9 are **already resolved**, correctly documented, not action
items — my grouping heuristic flagged them only because it doesn't
parse sense/POS distinctions from notes text:

| key | primaries | resolution on file |
|---|---|---|
| hope | ka·donga / ka·dongani | POS split (verb/noun), NV-082 |
| answer | Aganchaka / Aganchakani | POS split (verb/noun), NV-077 |
| demand | Dabia / Dabiani | POS split (verb/noun), Thangseng 2026-07-23 |
| last | bon·kamgipa / ja·mangipa | distinct senses (ordinal/"the last one"), NV-082 |
| outside | A·pal / a'palo | general sense vs. locative construction, NV-089 |
| hoe | git·chi / ko·dal | explicitly both valid, native said "not a single winner", NV-080 |
| where | Bano / Bachi | distinct senses (stationary/movement), RULE-044 |
| where (relative pronoun) | jeon / jeo | confirmed free variants, NV-054 |

**1 genuinely open, not previously tracked as a question:**
**"to support"** — `al·du·na` (VERIFIED/HIGH/doc7) vs. `Chaka`
(VERIFIED/HIGH, NV-063). NV-063's own note states explicitly:
"coexists with 'al·du·na' — both accepted, **not reconciled as
synonyms vs. distinct senses**." Unlike the 8 above, no sense/POS
split was ever supplied. Added to the relay queue below.

## The 715 "other" groups

602 of 715 are simple 2-candidate-both-unverified pairs — no VERIFIED
anchor at all in the group. This is unvalidated legacy vocabulary
awaiting native review, not a defect — matches the same
characterization every prior audit of this backlog has reached
(2026-08-01, 2026-08-06 gap audits). Not corpus-resolvable, not
guessed at. Genuine multi-session backlog, prioritization (by
frequency/register class) not attempted this session.

44 groups are superseded+unverified only, where the SUPERSEDED row's
own note text asserts the sibling key "has VERIFIED/HIGH form(s)" —
but the sibling is now tagged plain `unverified`, not `verified_high`.
Spot-checked 10 of 44 (late, each, other, again, root, type, past, go
down, butt, mat) — in every case the sibling's own notes are
explicitly `UNVERIFIED/HIGH` or `/MEDIUM`, not a mislabeled-but-really-
verified row. This means the original 2026-08-01 SUPERSEDED note's
claim is now **stale** (the cited VERIFIED/HIGH form was evidently
downgraded or never actually promoted after that note was written) —
a citation-accuracy gap, not a runtime defect: no verified value ships
from these groups either way. Flagged, not corrected this session —
correcting 44 historical notes to remove a now-false claim is
low-priority hygiene, doesn't change any shipped value, and 34 more
groups in "other" share adjacent tag-combo shapes (ocr_flagged,
rejected, etc.) that would need the same per-row check first.

Remaining ~29 other-bucket groups (mixed missing/ocr_flagged/rejected/
open tags) not individually triaged this session.

## Action taken this session

- Added "to support" (al·du·na vs. Chaka — synonym or distinct sense?)
  to the queued Thangseng relay questions.
- No dictionary values changed — this session was audit/triage only,
  consistent with the low actionable yield the census itself found
  (8 of 9 candidate conflicts were already correctly resolved; the
  715-group "other" bucket is backlog, not bugs).

## Not attempted, still open

- Double-raka cluster (833 entries, June 2026 audit) — untouched,
  not re-verified against current data this session.
- 602 pure-unverified duplicate pairs — genuine multi-session native-
  relay backlog.
- 44 stale-SUPERSEDED-citation notes — low-priority hygiene, zero
  runtime impact, not fixed.
- 29 remaining unclassified "other" groups.
