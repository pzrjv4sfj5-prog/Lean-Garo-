# Claude A Session Migration — 2026-09-06F

## Resume sequence (Rule 10)
Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260906E.md`. `git fetch`
found `origin/main` had moved past that doc's claimed close (`7afc92b`)
to `bd34301` — Claude B engineering work (Handoff B items 2/4/6/8,
rebase + artifact regeneration) landed after the migration doc was
written. Pulled fast-forward, re-ran full gate on the merged state
before starting: `prepare-data.js` 8251 entries, `test-dictionary.js`
8251/8251 + 9/9, `repository-intelligence.js` 0 new violations,
`--test tests/unit/*.test.js` 341/341 — clean baseline confirmed before
any edit this session.

## Work this session
Processed the remainder of the 2026-09-05-evening Thangseng batch
(items 7–14 of the Project Owner's pasted evidence) — items 1–6/11 of
that same batch were already closed as NV-137–NV-141 in session
20260906E; item 7 (tied "finish the difficult work" candidates) was
also already on file. This session's actual new work is items 8–10 and
12–14, which matched (verbatim, in substance) the still-unsent "Draft
prompt for Claude A" in `docs/CLAUDE_C_SESSION_MIGRATION_20260906D.md`.

- **NV-142** — `ball` = `robol`. New vocabulary item, `verified_high`.
- **NV-143** — `pole (post/pillar)` = `krong`, explicitly scoped (not a
  blanket `"pole"` entry). Promoted the existing `"post"` = `krong`
  candidate to `verified_high` as the same corroborated root/sense.
- **NV-144** — `small cat` = `Menggo chona` (noun-then-adjective,
  `verified_high`, the only directly-confirmed row). Generalized the
  `chik`→`chona` swap and word-order flip to the other 14 `small
  [noun]` rows **on Project Owner authority**, confidence left
  `unverified` on all 14 — provenance kept distinct from native
  evidence in every row's note, per `.ai/PROJECT_OWNER_AUTHORITY.md`.
- **NV-145** — `leave`/`leaves` disambiguated: `to leave` (infinitive)
  = `re·anga`, superseding `Re·ongkata`; `leaves` (plural noun) =
  `bijakrang` (new, fixes a real runtime collision); `bol·bi·jak`'s row
  reopened from `superseded` to `verified_high` (alternate) — it was
  wrongly framed as a rejected candidate at NV-080, this citation
  confirms it's a legitimate alternate compound, `bijak` stays primary.
  Flagged, not resolved: `re·anga` now double-duties for "went" (NV-100)
  and "to leave" — added to `src/data/known_dictionary_conflicts.json`
  (Check C) with this NV as citation.
- **NV-146** — sentence "leave me alone" = `angko saksan donbo`.
  Promoted `"me"`=`Angko` to `verified_high`; added `"leave"`=`donbo`
  (imperative); flagged (not resolved) a possible imperative/infinitive
  mood parallel with NV-145's `re·anga`, and a `saksan`/`ak·sa` "alone"
  tension against the existing unverified `ak·sa` row.
- **NV-147** — closes the long-open NV-129 study tension (`Gisik nange
  poraibo` vs. `po·ri·a`): mood distinction, not competing roots.
  Added `"study sincerely"` (imperative) = `Gisik nange poraibo` and
  `"studies sincerely"` (statement) = `Gisik nange poraia`, both
  `verified_high`. Updated the stale open-tension note in
  `docs/GARO_GRAMMAR_REFERENCE.md` §7 to point at the resolution.

Appended `docs/THANGSENG_RELAY_QUESTION_20260906.md` with 3 more open
questions (items 4–6 below the existing 3) rather than opening a new
file, since this is a continuation of the same unsent draft.

**Rule 8 duplicate-representation check:** 1 new self-consistency
conflict (`"to leave"`: `Re·ongkata` vs `re·anga`) added to
`src/data/known_dictionary_conflicts.json` (Check C) with NV-145 as the
citation — confirmed intentional (supersession + open tension), not a
data error.

## Gate at close
- `node prepare-data.js`: 8257 unique entries (+6 net: ball, pole,
  to-leave, leaves, leave-me-alone, leave-imperative, study-sincerely,
  studies-sincerely = 8 new rows, minus 2 rows that were already
  counted as candidates for existing keys before promotion — net
  matches the 6 genuinely new dictionary *keys*)
- `node test-dictionary.js`: 8257/8257 valid, 9/9 grammatical
  corrections
- `node repository-intelligence.js`: 0 new violations (1 flagged
  self-consistency conflict allowlisted per Rule 8 above, then re-run
  clean)
- `node scripts/resync-stale-overrides.mjs`: 0 new candidates (1
  pre-existing `build`/`Rika` skip, unrelated to this session)
- `node --test tests/unit/*.test.js`: **336/341 pass, 5 known/expected
  failures** — see Runtime Handoff below. Not a regression from broken
  logic; a direct, correct consequence of this session's native-evidence
  data changes outrunning test assertions written against the old data.

Live-verified via `translate()` post-rebuild: `ball`→`robol`, `pole
(post/pillar)`→`krong`, `post`→`krong`, `small cat`→`Menggo chona`,
`small dog`→`Achak chona` (Project-Owner-generalized row, unverified,
confidence 0.75 not 0.98 — correctly reflects its lower evidentiary
status), `leaves`→`bijakrang`, `leave`→`donbo`, `to leave`→`re·anga`,
`leave me alone`→`angko saksan donbo`, `study sincerely`→`Gisik nange
poraibo`, `studies sincerely`→`Gisik nange poraia`.

## Runtime Handoff (Claude B)
5 unit-test failures, all a direct/expected consequence of this
session's data changes, **not** engine bugs and **not** fixed here per
role boundary (Claude A doesn't edit test code):

1. `tests/unit/adjective_animal_mang_placeholder.test.js` — 3 failing
   subtests (`adjective+animal:...`, `adjective+noun (non-animal):...`,
   `adjective+animal: "cat"...`). All three loop over all 15 modifiers
   and assert every "[modifier] [noun]" ends with the bare noun root.
   NV-144 flipped word order for `"small"` specifically (noun-then-
   adjective, native-confirmed) while every other modifier keeps
   adjective-then-noun — so `"small dog"` etc. now correctly end in
   `chona`, not the noun root, breaking the loop's blanket assumption.
   Fix: special-case `"small"` in the loop (expect `/chona$/i` instead
   of the noun-root pattern), don't revert the data.
2. `tests/unit/plural_morphology_ies_ves.test.js` — 2 failing subtests
   (`"leaves" resolves to leaf...`, `bare "leave"...`). Both hardcode
   pre-NV-145/146 values (`bi·jak` fallback for "leaves", `Re·ongkata`
   for bare "leave") that this session's direct native citations
   correctly supersede (`bijakrang`, `donbo`). Fix: update the two
   `assert.equal` expected values to `bijakrang` and `donbo`
   respectively — the underlying translate() behavior is now correct.

## Push and resync
Committed. `git fetch` immediately before push showed no further
remote movement (`origin/main` still `bd34301`). Pushed fast-forward.

## Repository status at close
- [x] HEAD hash: verified == `origin/main` (see final push output)
- [x] `git status` clean, no untracked files
- [x] `.ai/WORKSTATE.yaml` updated (this session's work appended)
- [x] `.ai/SESSION_BOOTSTRAP.md` — no standing-rule changes, not touched
- [x] Migration doc complete (this file)
- [x] No local-only commits — pushed and verified
- [x] No uncommitted changes
- [x] Native-validation/blocker status: NV-142–NV-147 logged; 6 open
      relay questions (get/can, two/gnisan, tied finish-sentence,
      re·anga went/leave, donbo/re·anga mood pattern, saksan/ak·sa)
      carried forward, unsent, in
      `docs/THANGSENG_RELAY_QUESTION_20260906.md`
- [x] PAT: used only for this session's clone/push (pasted live by
      Project Owner this session); not embedded in any file; standing
      rotation reminder applies per policy

## Exact next step (for next Claude A)
1. Send `docs/THANGSENG_RELAY_QUESTION_20260906.md` (now 6 items) —
   still not sent.
2. Handoff to Claude B: the 5 test-assertion updates above (data is
   correct, tests are stale).
3. Standing carried-forward items, unchanged: `RULE-038`/`NV-109`
   tension; `NV-127` (only-X third-person); the 2 slash-variant rows;
   `final_entries.json`'s stale `Cat`→`meng·gong` row (cosmetic,
   non-pipeline, low priority); item 9 of Claude C's
   `CLAUDE_C_SESSION_MIGRATION_20260906D.md` draft ("it's very hot
   today" word-order bug, native-sourced but flagged as a live
   `sov-assembly` runtime bug — Claude B territory, not yet picked up).
