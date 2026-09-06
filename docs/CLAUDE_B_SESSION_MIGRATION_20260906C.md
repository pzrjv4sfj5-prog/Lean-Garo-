# Claude B Session Migration — 2026-09-06C

## Project identity
Lean-Garo-: Garo-language translation/dictionary engine. Multiple agents
(Claude A, B, C) work concurrently against the same `origin/main`;
standing rule: `git pull` before every push, renumber the not-yet-pushed
side on NV-number collisions, never overwrite what's already on
`origin/main`.

## Resync
HEAD confirmed `15b1024` == `origin/main`, clean tree, before any edit
(session picked up directly after `docs/CLAUDE_B_SESSION_MIGRATION_20260906B.md`'s
own commit in the same conversation — no intervening push from another
agent).

## Task this session
Project Owner relayed new native evidence directly in chat (Thangseng,
via Project Owner — recorded as "Project Owner-confirmed" per
`.ai/PROJECT_OWNER_AUTHORITY.md`'s category 2, not a Project Owner
directive): `dal.a` = "big" in **predicate** position (`Ua nok namen
dal.a` = "that house is very big"); `dal'gipa` = "big" in **attributive**
(before-noun) position (`Dal.gipa nok` = "a big house"). Instructed to
use "big cat"/"big dog" etc. as the reference case and ensure this data
is applied properly across all cases.

## What's done

### 1. Logged the citation (NV-136)
`docs/THANGSENG_NATIVE_VALIDATION.md` — full citation, cross-checked
against existing repo state before treating anything as new: `dal·a`
(predicate) was already `verified_high` since NV-080 (2026-08-17), this
relay reconfirms it and supplies the grammatical condition NV-080 didn't
specify. `dal·gipa` (attributive) was already the `verified_high` root
in the pre-existing `"big red house"` tied-candidate rows — this relay
independently confirms a root the dictionary already had evidence for.

### 2. New finding surfaced while checking scope (not asserted by the citation itself)
Every `"big [noun]"` phrase-table row in `master_dictionary.json` (15
rows: person/dog/cat/bird/fish/teacher/student/house/tree/book/car/
apple/banana/rice/water) used a third, uncited root, `gonga` — no
citation trail anywhere, appears nowhere else in the file. Live
`translate()` on sentences outside this static table (`"a big elephant
is sleeping"`) already independently produced `dal·a` via the working
sov-assembly path — so the phrase-table disagreed with both the new
citation and the engine's own working composition, same defect *shape*
as defect-class-3, different uncited root.

### 3. Fixed the 15 rows
`gonga` -> `dal·gipa` (noun half untouched), matching the cited
attributive condition and the pre-existing `"big red house"` precedent.
Confidence promoted `unverified`/none -> `verified_high` on all 15,
mirroring the NV-135 precedent (promote when the value now matches a
cited canonical root). `"big around"` (`ding·dang`, an idiom, no
`gonga`) was not touched.

### 4. Checked for stale overrides
`src/data/phrase_maps.js` / `src/data/corrections.json`: no `"big
[noun]"` overrides exist in either — nothing to sync.

### 5. Added regression coverage
`tests/unit/big_dalgipa_attributive.test.js` (new file, 2 tests):
all 15 fixed rows start with `dal·gipa` and end with their own noun
root, contain no `gonga`; the pre-existing bare `big` -> `dal·a`
predicate entry (NV-080) is unaffected by this fix (sanity guard against
scope creep).

### 6. Flagged, NOT fixed — new engineering finding
The sov-assembly composition path does not yet distinguish predicate vs.
attributive position for "big": `"a big elephant is sleeping"`
(attributive) and `"that house is very big"` (predicate) **both**
currently resolve through `dal·a` (the predicate form) per this
session's own live check — per NV-136 the attributive sentence should
use `dal·gipa`. This is potentially a **general adjective-position rule**,
not something to infer from one adjective's citation alone — recorded in
NV-136 and here, routed to Claude A/engineering as a new item, not
resolved this session (matches this project's "don't make independent
linguistic/grammar decisions beyond what's cited" discipline).

## Gate results (after this session's fix, before commit)
- `prepare-data.js`: 8280 unique entries (unchanged), clean.
- `test-dictionary.js`: 8280/8280 valid, 9/9 grammatical corrections.
- `repository-intelligence.js`: 0 NEW violations across all 8 checks
  (CHECK H: 0 known, 0 new — this defect wasn't a modifier+noun
  collision shape, so not expected to trip it; CHECK G: 10050 rows,
  0 confidence-schema problems after the 15 promotions).
- `resync-stale-overrides.mjs`: 0 candidates.
- `runtime-error-sweep.mjs`: 0 errors across 14,771 `translate()` calls.
- `node --test tests/unit/*.test.js`: 319/319 (was 317, +2 new).
- `npm run build`: clean.
- Live `translate()` spot-check: `big cat`/`big dog`/`big house`/`big
  student`/`big person` -> `dal·gipa [noun]` (exact-phrase, 0.98);
  bare `big` -> `dal·a` (phrase-map, 0.99) unchanged; `"a big elephant
  is sleeping"` / `"that house is very big"` unchanged (both still
  `dal·a`) — the flagged sov-assembly gap, documented not silently
  patched.

## Remaining open items (unchanged by this session, carried forward)
- Defect-class-2: `coin`/`chair`/`fruits`/`mountain` counted-phrase-vs-
  standalone root reconciliation — not started.
- Item #1: counting-phrase plural failure ("two cats" vs "two cat") —
  not started.
- Item #4/#5: 65-key `verified_high`-vs-`verified_high` schema gap and
  phrase-table/sentence-assembler duplicate composition architecture —
  flagged for a design pass, not started.
- **New (this session):** sov-assembly predicate/attributive adjective
  position rule — "big" confirmed needs it, unknown how many other
  adjectives are affected. Needs Claude A/engineering scoping before any
  fix (could be "big"-specific or a general grammar rule).
- `docs/HANDOFF_CLAUDE_B_20260906.md` (Claude C's engineering handoff, 9
  items) — not triaged this session.

## Exact next step
1. `git pull` (or fresh clone) first regardless; confirm HEAD ==
   `origin/main`, clean tree, before any edit.
2. Next task is the Project Owner's priority call between: Defect-
   class-2, Item #1, the new sov-assembly attributive/predicate finding,
   or triaging `docs/HANDOFF_CLAUDE_B_20260906.md` — not decided here.
3. One task at a time — do not batch any of the above into one commit.

---
**Start a new conversation and paste this document in to resume.**
