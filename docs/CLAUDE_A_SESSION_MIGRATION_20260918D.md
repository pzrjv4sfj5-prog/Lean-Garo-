# Claude A Session Migration — 2026-09-18D

## Project identity
Lean-Garo — Garo language dictionary and English-to-Garo translation
engine. Repo: github.com/pzrjv4sfj5-prog/Lean-Garo-. Project Owner: T.

## Current state
- HEAD `fc32cc0` == `origin/main`. Working tree clean.
- Full gate green: 8562/8562 dictionary entries, 9/9 grammatical
  corrections, 441/441 unit tests, 0 new repository-intelligence
  violations (all 7 checks), 0 resync-stale-overrides candidates.
- Runtime smoke-checked directly (not just the gate scripts):
  `compiled_dict.json` loads (8562 keys), `compiled_dict_alternates.json`
  loads (1398 keys). `friend` -> `Ripeng`, no alternates. No runtime
  errors.

## Done this session (chronological)
1. Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260918B.md`, resynced
   clean (3 Claude B/D commits beyond that doc's close, none in Claude
   A's lane).
2. Processed Claude D's OCT_Garo_PRODUCTION_MASTER_ALIGNED_WORD_BY_WORD_AUDIT_v5.xlsx
   handoff (pages 13, 20, 21, 108): staged 192/192 entries clean to
   `src/data/pending_lexicon.json` (PL-0002015..PL-0002206), 0 conflicts
   with production. Nothing promoted. Full detail in
   `docs/CLAUDE_A_SESSION_20260918C.md`. Rebased once onto a concurrent
   Claude B commit (jol 20-99 compound, no overlap).
3. Owner correction (chat, 2026-09-18): "Friend=Ripeng, delete any
   alternate word." Trimmed `master_dictionary.json`'s `Ripsak / Ripeng`
   combo to `Ripeng` (kept verified_high); superseded `ba·ju`, `bi·sa`
   (both previously verified_high) and `Baju` (unverified), each citing
   the correction. Also trimmed 2 legacy `garo_dictionary.json` rows
   (no confidence field, so a stale combo string was still leaking into
   `compiled_dict_alternates.json`) and `src/data/phrase_maps.js`'s
   `friend` override, which Check F (runtime-cascade agreement) caught
   and required to match. Rebased once onto Claude B's session-close
   commit (`e561782`, migration doc only, no overlap).

## What's held and why
Nothing held this session — both tasks (OCR staging, friend correction)
ran to completion and are pushed.

## Open issues (unchanged from 20260918B/C, not touched this session)
- `docs/THANGSENG_RELAY_QUESTION_20260916.md` — 7-pattern wh-question
  suffix survey, sent, no reply yet.
- 44-key interrogative-form family in `docs/SUPERSEDED_ONLY_KEYS.md` —
  Claude D territory.
- Trailing-punctuation lookup bug — Claude B territory.
- `derived` confidence tag missing from `repository-intelligence.js`
  schema — Claude B territory.
- **Dedup-deviation flag from the Claude D OCT handoff** (94
  excluded-by-string-match rows, stricter-than-precedent dedup) — real
  linguistic judgment call, deliberately not resolved. One concrete
  lead: "cross" was dropped as a duplicate even though sibling gloss
  "wade" (same polysemous `Bata` row) was kept. Full original list was
  in the Claude D handoff chat message, not persisted to disk as a
  separate file. See `docs/CLAUDE_A_SESSION_20260918C.md` for detail.
- PL-0002015..PL-0002206 (this session's 192 staged entries) still sit
  `unreviewed` in `pending_lexicon.json`, not yet promoted.

## Standing rules (unchanged, reconfirmed working this session)
- Citation discipline: never hard-delete a dictionary row on a
  correction — flip confidence to `superseded` with a note citing the
  source. (Applied this session to ba·ju/bi·sa/Baju.)
- `master_dictionary.json` is canonical for confidence/supersession
  calls; `garo_dictionary.json` is legacy/raw and normally untouched,
  but this session needed a rare direct edit there too because it has
  no confidence field and was independently leaking a stale alternate
  into the compiled output — Check F caught the resulting cascade
  mismatch and required the `phrase_maps.js` override fixed to match.
  Precedent: hand-maintained override tables (`phrase_maps.js`,
  `corrections.json`) must be checked and updated in lockstep with any
  `master_dictionary.json` correction that changes a previously-cited
  word — don't assume editing master alone is sufficient.
- Full gate on every close: `prepare-data.js` -> `test-dictionary.js`
  -> `repository-intelligence.js` -> `node --test tests/unit/*.test.js`,
  plus a direct `require()` smoke check of the compiled outputs.
- Fetch + rebase (not merge) before every push; re-run the full gate
  after any rebase before pushing.

## Next Claude A — exact next step
No queued task. Candidates, in order the Owner is likely to raise them:
1. Review/promote PL-0002015..PL-0002206 via
   `scripts/promote-lexicon.js` per `docs/PENDING_LEXICON_WORKFLOW.md`.
2. Resolve the dedup-deviation flag (94 rows) above.
3. Any of the standing open items list.
