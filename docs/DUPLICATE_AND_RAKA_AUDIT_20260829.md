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

## Retention-policy classification (Project Owner request, addendum)

**No rows deleted or changed.** Classified the 1,016 SUPERSEDED rows inside
the 848 "legit" groups into the 6 categories requested, via automated
pattern matching (byte/normalized value comparison + note-text patterns)
followed by manual sampling to correct heuristic overlap (e.g. "redundant"
appearing in bulk-numeral audit notes initially miscounted them as
plain duplicates — caught and reassigned by reading samples). Numbers
below reflect the corrected pass; exact boundaries are estimates, not
a row-by-row certified count — this is a representative classification,
not exhaustive per-row adjudication.

**Runtime relevance, checked first:** none of these 1,016 rows affects
compiled output regardless of the retention decision. Every one sits in
a group that already has exactly one non-variant VERIFIED/HIGH primary
(that's the group definition), and `pickPrimary` already excludes
SUPERSEDED-tagged candidates from compilation. This is a documentation-
size/data-hygiene question, not a runtime-correctness one.

| category | count | what it is |
|---|---|---|
| 1. Genuine obsolete duplicate, no informational value | ~55 (7 byte-exact + 48 "differs only in capitalization/spelling" per NV-080's own explicit "duplicate row" notes) | e.g. `love`→`Ka·saa` superseded, `ka·sa·a` verified — same word, case only |
| 2. Earlier native-considered form, useful provenance | ~277 | NV-080 pattern: "not selected; native-confirmed form for X is Y" — a *different* word Thangseng was offered and explicitly rejected, e.g. `bow`→`Sko·ka·mama` rejected in favor of `bam·a`. Documents what NOT to re-propose. |
| 3. Different POS/sense/context, must be retained | ~5 confirmed, likely more not keyword-caught | e.g. 4 `call` variants, note: "may still be valid for a distinct sense" |
| 4. Spelling/orthography variant | ~119 (66 raka-dot/hyphen-only, 53 substring/compound-form) | e.g. `bamboo`→`Wa·a` superseded, `wa·` verified — raka placement only |
| 5. Historical correction, audit evidence should remain | ~470 (167 generic 2026-08-01 corpus-dedup audit + ~300 bulk classifier/counted-noun numeral-suffix fixes, e.g. RC-CANDIDATE-037-class bugs) | Documents real systemic bugs and their fixes — losing these loses the bug-fix trail |
| 6. Incorrectly marked SUPERSEDED | **0 found** | No case found where a demoted row looked like it should still be VERIFIED. (Inverse pattern exists instead — see below.) |

**Inverse finding, worth flagging separately from the 6 categories:** a
handful of rows (e.g. `king`→"Books, paper, leaves, flat", the
`three dog`/`four dogs` legacy copy-paste corruptions) were
**incorrectly VERIFIED/HIGH** at some earlier point — misimported
classifier metadata or copy-paste errors, not real translations — and
were *correctly* superseded later. These have essentially zero
linguistic value (they're data-entry errors, not alternate word forms)
but their SUPERSEDED record still documents that the error existed and
was caught, which is exactly the audit trail category 5 protects.

## Recommendation (not acted on — Owner decision)

If a deletion policy is wanted at all, categories 1 and 4 (~174 rows,
~17% of the 1,016) are the safest candidates — zero remaining
information not already present in the VERIFIED sibling. Categories 2
and 5 (~747 rows, ~74%) are exactly the kind of provenance the
project's citation discipline was built to protect and should stay
retained-and-tagged regardless of what's decided for 1/4. Category 3
must stay. No changes made pending your decision.

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
