# Claude A Counting-System QA Report — 2026-08-12

**Referral:** Claude C's repository-wide QA audit of the numbering/counting
subsystem flagged possible corruption in a generated counted-noun batch,
suspected engineering-side rather than linguistic. Task: review the complete
counting paradigm (not just reported examples) and confirm.

**Note:** No Claude C audit document exists in the repo (`docs/`, `.ai/`) as
of session start — this report is Claude A's independent full-corpus review,
done to the same evidence-first bar, since the referral's own document
wasn't available to reconcile against.

## 1-3. Paradigm and classifier-family review

Reviewed every live (non-SUPERSEDED) counted-noun entry in
`master_dictionary.json` (~317 entries after filtering false positives like
"one who announces"). Every classifier family that has a complete 1-20
build-out is linguistically correct and internally consistent:

| Classifier | Category | Raka | Confirmed for |
|---|---|---|---|
| `mang` | animals/birds | yes | dog, cat, bird, fish |
| `king` | flat objects/books | yes | book |
| `sak` | people | yes | person |
| `gong` | money/currency | yes | rupees |
| `pang` | trees | **no** | tree |
| `rong` | round objects | **no** | apple, fruit(s) |
| `ge` | tool/elongated objects | yes | pen(s) |

All follow `NOUN + CLASSIFIER + NUMBER_SUFFIX` (suffixes 1-10:
sa/gni/gittam/bri/bonga/dok/sni/chet/sku/chiking; teens:
`CLASSIFIER·Chi·[suffix]`; 20 = `Kolgrik`) with zero exceptions found.
**Conclusion: the classifier engine and the underlying formula are
linguistically sound.** This is not where the reported corruption lives.

## 4-5. What's actually wrong + native corrections required

Found 13 orphaned entries, all keyed to "two X", that predate the
evidence-first discipline and were **missed by the 2026-08-10 523-entry
SUPERSEDED sweep** — missed specifically because they're orphans (no
duplicate-with-a-fix to compare against, unlike e.g. "two dogs" which had a
fixed sibling entry to flag the fabricated one against).

Resolved via pure corpus-internal contradiction (no native input needed,
no replacement asserted — same evidentiary bar as the original 523):

- `two apple`→`se·gni`, `two persons`→`mande·gni` — directly contradict
  already-VERIFIED entries for the same keys.
- `two cars`/`two house(s)` both → `rang·gni` — one root can't mean both.
- `two river(s)`/`two student(s)`/`two water(s)` all → `chik·gni` — same
  root reused across three unrelated nouns.
- `two food`/`two rice` both → `chak·gni`.

All 13 tagged SUPERSEDED in place this session (not deleted), citations
inline in `master_dictionary.json`.

**Explicitly NOT touched** (would require guessing, not contradiction):
mountain (`nok·gni`), village (`rim·gni`), road (`lam·gni`), banana
(`sobo·gni`), car (`mot·gni`, the non-reused singular-key variant) — these
only violate the classifier formula, but whether they even take a numeral
classifier at all is an existing open native question (already logged in
prior sessions), not something I can resolve by contradiction alone.

**Do counted-noun phrases need their own dictionary entries at all, or
should they be classifier-generated?** Given this exact failure mode —
orphaned fabricated entries silently outliving their sweep — the dictionary
storing full 1-20 tables per noun is the recurring source of drift. A
generation-time (classifier-engine) approach would make this whole bug
class structurally impossible. That's an engineering/architecture call,
not a linguistic one — flagging for Claude B, not deciding here.

## 6. Handoff

Source linguistic data is correct. **No native correction is required for
the counting system itself.** Claude B should treat the residual as a pure
completeness/generation gap: confirm the compile pipeline doesn't have a
`pickPrimary()`-class bug still surfacing these newly-tagged entries at
runtime (same precedence-check pattern as the 2026-08-06 SUPERSEDED-
precedence bug), and decide whether to pursue generation-time classifier
application per the note above.

## Still open, unchanged, sized for future sessions

- Person/student/teacher 111-candidate root conflict (needs its own
  scoped session — largest remaining chunk).
- The "10 nouns" open question: house/car/road/river/mountain/village/
  water/food/rice/banana — whether each takes a numeral classifier at
  all; water/food/rice specifically flagged as possible mass nouns.
- Coin's root: existing `tangka gong·sa`/`tangka gong·bonga` entries are
  structurally sound (matches rupees' confirmed classifier) but
  unannotated — likely just needs a VERIFIED tag, not new native input.
- Anna-coin subunit (`suk·ki`/`a·dul·i`/`rep·a`, tagged UNVERIFIED/HIGH) —
  a legacy currency-subunit system, doesn't fit the classifier paradigm
  at all; separate question, not part of this audit's scope.

## Verification

- `prepare-data.js`: 8149 unique compiled entries (unchanged from prior
  checkpoint — values-only edit, no keys added/removed).
- `test-dictionary.js`: 8149/8149 valid.
- `repository-intelligence.js`: 0 new violations, all checks pass.
- `node --test tests/unit/*.test.js`: 203/203 passing.
