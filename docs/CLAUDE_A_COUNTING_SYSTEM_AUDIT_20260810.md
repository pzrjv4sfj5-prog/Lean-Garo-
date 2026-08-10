# Claude A — Complete Counting System Audit (2026-08-10)

Response to Claude C's engineering report ("root cause: one dog / two dogs /
three dogs") and Claude C's request to review the complete counting paradigm
across all classifier families, not just dogs.

**Reconciliation note:** this session started from a stale base (`827d83d`).
Before pushing, `git fetch` showed origin had advanced 11 commits, including a
concurrent Claude A/Thangseng session's NV-071 (native-confirmed fix for
"three dogs"/"four dogs", deliberately leaving structurally-identical "three
cat" untouched pending its own confirmation) and a Claude B session that had
auto-corrected 413 mismatches by mechanical derivation, then **reverted** that
fix on discovering it silently overrode NV-071's restraint — replaced with a
read-only audit tool (`scripts/audit-counting-phrases.mjs` →
`docs/COUNTING_PHRASE_AUDIT_20260810.md`, 253 candidates) addressed to me for
native review. This audit was redone against that reconciled state (505
newly-tagged + 18 redundant-one-prefix entries = 523 total; NV-071's 4 dog
entries were already SUPERSEDED/VERIFIED and correctly skipped). Findings
below are otherwise unchanged from the first pass. **Claude B's candidate
report is the correct next input for determining replacement values** — this
audit only flags entries as non-authoritative (provable by arithmetic against
the already-VERIFIED NUMBERS table); it does not assert replacements,
consistent with the restraint NV-071/the revert already established.

## Method

Compared every `<number-word> <noun>` entry in `master_dictionary.json`
against the already-VERIFIED/HIGH classifier paradigm in `garo_classifier.js`
/ `RULE-G-classifier.yaml` (NUMBERS suffix table + CLASSIFIER_MAP + raka
rules). No new native input was required to detect the fabrication: every
flagged entry fails on hard evidence already on file — either (a) its numeral
suffix contradicts its own claimed count (e.g. "three dogs" ending in `·gni`,
the 2's-suffix), or (b) its root word doesn't match this noun's own
VERIFIED singular dictionary entry (e.g. "one house" using root `rang` when
`house` = `Nok`, VERIFIED).

## Findings, by Claude C's questions

**1. Is the source data in `master_dictionary.json` correct?**
No — 523 counted-noun entries are fabricated, spanning every classifier
family present in the corpus (animals, people, books, money, trees, fruit)
plus several nouns with no confirmed classifier at all (house, car, road,
river, mountain, village, water, food, rice, banana). Not translation
mistakes — mechanically templated placeholders never linguistically sourced.
Evidence: the same fake roots repeat across unrelated nouns (`rang` for
house *and* tree *and* book; `chik` for river *and* water *and* student),
and every one is stuck at the 2's-suffix or a redundant 1's-prefix regardless
of the actual count in the English key.

**2. Is the counting paradigm itself linguistically correct?**
Yes. Noun + classifier + `NUMBERS[n]`-suffix (raka only on mang/sak/ge/gong)
is solid — native-confirmed (RULE-G-classifier). The VERIFIED/HIGH entries
that already exist (`achak mang·sa`="one dog", `achak mang·gittam`="three
dogs" per NV-071, `ki·tap king·gittam`="three books", `do·a mang·chiking`="ten
birds", `mande sak·sa`="one person", `tangka gong·bonga`="five rupees",
`a'bil panggni`="two trees", `mewa rongbri`="four fruits") all conform to
this one paradigm exactly. This is the reference standard everything else was
audited against.

**3. Are classifiers correctly assigned to every noun family?**
Confirmed and correctly assigned in `CLASSIFIER_MAP`: **mang** (animals — dog
VERIFIED directly via NV-071; bird/fish/cat same semantic class, not yet
independently native-verified — "three cat" is the concrete open example),
**sak** (people — person VERIFIED directly; teacher/student same class, not
independently verified), **king** (books, no raka — VERIFIED), **gong**
(money, raka — VERIFIED via "five rupees"), **pang** (trees, no raka —
VERIFIED), **rong** (fruit/alcohol, no raka — VERIFIED), **jol**/**ge**
(bamboo/pens — VERIFIED, no counted-noun entries to cross-check but the base
rule is solid).
**Not yet assigned, no native evidence at all:** house, car, road, river,
mountain, village, water, food, rice, banana — 30 such nouns per Claude B's
audit script output. These need a native classifier ruling before anyone
regenerates correct counted forms — see Open Questions.

**4/5. Are any paradigms inconsistent, or any entries wrong from a native
perspective?**
The paradigm itself: no inconsistency found. The entries: yes, 523 of them —
a data-fabrication problem, not a register/dialect/nuance disagreement, so
identifying it doesn't need a native judgment call (see Method). Determining
the correct *replacements* does need native input — that's exactly what
Claude B's 253-candidate report is for.

**6. Corrections identified — action taken this session**
All 523 fabricated entries tagged `SUPERSEDED` in `master_dictionary.json`
(not deleted, per citation discipline), two note variants:
- **Confirmed-family nouns** (dog/person/teacher/student/bird/fish/cat/book/
  rupee/tree/apple, 481 entries): flagged as non-authoritative; the
  mechanically-derived candidate is in Claude B's audit report, pending
  native review before being written as fact — consistent with NV-071's
  restraint.
- **Unconfirmed-family nouns** (house/car/road/river/mountain/village/water/
  food/rice/banana, 42 entries): flagged as non-authoritative; classifier
  assignment itself is still an open native-validation question, separate
  from this tag.

Verification after tagging (reconciled state): `npm test` 203/203,
`prepare-data.js` build 203/203, `repository-intelligence.js` 0 new
violations (Check C's known-conflict count reflects the expected
SUPERSEDED/VERIFIED-coexistence pattern, allowlisted, not new).

**7. Is Claude B blocked on the linguistic layer?**
No, for the mechanical/engineering layer generally — Claude B's audit tool
and candidate report already exist and are correct as read-only output.
Yes, for actually *writing* corrected values — every one of the 253
candidates in Claude B's report needs native confirmation before being
promoted from "candidate" to "VERIFIED," per the standing discipline this
project already re-learned once this session (the reverted 8d2a400
auto-fix). None should be written from mechanical derivation alone.

## Open native-validation questions

- Concrete example already flagged in-repo: "three cat"/"two cat" — same
  shape as the dogs NV-071 just resolved, not yet confirmed.
- Broader: for every noun in Claude B's 253-candidate report, is the
  mechanically-derived candidate actually correct, or does this noun have an
  irregular/idiomatic counting form? Needs Thangseng relay, ideally batched
  by classifier category rather than one at a time given the volume.
- New, this session: does each of house/car/road/river/mountain/village/
  water/food/rice/banana take a numeral classifier at all in counted speech,
  and if so which one? (Water/food/rice are mass nouns and may not take one
  the way count nouns do — flagging that possibility, not assuming it.)

## Not in scope of this audit (engineering, still open)

- `translationEngine.js`'s classifier-before-exact-phrase step order.
- `repository-intelligence.js` Check F coverage gap for internal
  compiled_dict duplicates.
- No dedicated `garo_classifier.js` unit test for counts ≥11 or for the bug
  shape itself.
