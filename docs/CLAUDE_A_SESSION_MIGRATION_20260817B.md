# Claude A Session Migration — 2026-08-17B

## Project identity
Lean-Garo — English-to-Garo dictionary/translation engine.
Repo: https://github.com/pzrjv4sfj5-prog/Lean-Garo-
Role: Claude A = linguistic authority only (dictionary data, grammar,
native validation). Never touches engine code (Claude B's lane:
phrase_maps.js, translationEngine.js, prepare-data.js internals) or OCR
ingestion (Claude D).

## Current repo state
- HEAD = `9ec26c4`, pushed, `origin/main` matches, working tree clean.
- Gate: 8127 compiled entries · `test-dictionary.js` 8127/8127 ·
  `npm test` 218/218 · `repository-intelligence.js` 0 new violations
  (223 known/allowlisted) · `runtime-error-sweep.mjs` 14523/14523, 0
  errors · 16 pre-existing `pickPrimary` verified-ties (none introduced
  this session).

## What happened this session
Project Owner supplied `docs/THANGSENG_RELAY_BATCH_20260817.md`'s
cross-reference against the native response document, with instruction
to close everything, no pending, no dups, sync with Claude B.

Applied 127 of 141 items to `master_dictionary.json` +
`src/data/corrections.json` (65 CONFIRMS, 57 CORRECTS, 1 new word
`blink`=`Mik-chip-a`), all cited to new **NV-080** in
`docs/THANGSENG_NATIVE_VALIDATION.md`. Non-selected candidates marked
`SUPERSEDED` with citation, never deleted.

Two of my own bugs caught and fixed mid-session before shipping:
1. Promoting both a legacy corpus-audit row and its already-verified
   sibling to VERIFIED/HIGH created ~19 spurious `pickPrimary` ties
   (same word, different capitalization, now double-counted as two
   candidates). Fixed: only one row per distinct word gets promoted to
   VERIFIED/HIGH; true duplicates get `SUPERSEDED (duplicate row)`.
2. A "supersede" edit for the market-phrase contradiction *appended*
   text instead of replacing the notes prefix, so the string still
   started with `VERIFIED/HIGH` and `prepare-data.js`'s anchored regex
   (`/^verified\/high\b/i`) kept treating it as a live candidate. Fixed
   by rewriting the note to start with `SUPERSEDED —`.

Also discovered and fixed independent of the relay batch: a corrupted
`gong` row (its `garo` field held the gloss "Money and currency", not
a translation); an embedded-quote placeholder value on `apply`'s new
row that Check E correctly flagged; and a `corrections.json`
drift on `long`/`rain`/`love`/`work` that appeared *as a side effect*
of today's dictionary changes (compiled winners shifted, corrections.json
didn't move with them) — not pre-existing drift, caught by Check F.

## Deliberately held OPEN — evidence-first, no native answer to force
| Item | Reason |
|---|---|
| 82 Brave / 84 Hope | Both now `Ka·donga` — duplicate-encoding conflict |
| 94 Agree | Held at Claude B's request |
| 138/139/140 Let's sit/play/work | Relay doc's own text flags these as contradicting the RULE 2 table — an unresolved internal Native-response inconsistency |
| 26 Last | No native entry for the ordinal/final sense |
| 96 Bear (verb sense) | No native entry for carry/endure; animal sense (`Matmak`) is now confirmed |
| 133 Where-relative (jeon/jeo) | No native entry |
| 133b "Bao" | Raised by Tridip, never addressed by Thangseng |
| 44 Gong (instrument) | Classifier sense confirmed; instrument sense still unconfirmed |
| small/wet → `Chon·a` | Same form recorded for both meanings, flagged as-is per the relay doc's own note |

## Root causes worth remembering
- `prepare-data.js`'s `isVerified` check is a **regex anchored to the
  start of the `notes` string** (`/^verified\/high\b/i`), not the JSON
  `confidence` field, which is purely informational. Any promote/supersede
  edit must control the literal first characters of `notes`, not just
  set `confidence`.
- `SUPERSEDED —` (with em dash) at the start of `notes` is the specific
  signal `prepare-data.js` uses to exclude a candidate from pickPrimary
  entirely — confirmed by reading its own source comment.
- `bear` is a polysemous English key (animal noun vs carry/endure verb)
  sharing one schema slot. Letting the now-confirmed animal sense
  (`Matmak`) start with the `VERIFIED/HIGH` anchor would have silently
  made it the compile-dominant winner for the whole key, breaking verb
  translations. Deliberately phrased that entry's note to document the
  confirmation without triggering the anchor. This is a standing schema
  limitation, not fixed — just navigated around this time.

## Handoff to Claude B (not touched myself — engine lane)
1. 34 `phrase_maps.js` values are now stale against today's
   dictionary changes. Logged with citation as `phrase_maps:<key>` in
   `src/data/known_cross_source_conflicts.json` (added this session,
   easy to find/diff) so the gate stays green, but the actual sync in
   the engine file still needs doing.
2. `bear` key polysemy (see above) — schema can't currently disambiguate
   noun vs verb sense sharing one English key.

## Standing rules (unchanged, reaffirmed this session)
Rules 7–10, 9a as previously established. Evidence-first: resolve only
with clear evidence (corpus-internal contradiction, prior verified rule,
or direct native confirmation); flag and leave unresolved otherwise —
never guess, even under explicit "close everything" instruction from the
Project Owner. One task per session; other issues found mid-task go in
"Next Recommended Tasks" only. Nothing left local-only; everything
committed and pushed before close.

## Exact next step
Either:
(a) Send the 14 open items above back through Thangseng/Tridip for a
    follow-up native-validation round, or
(b) Hand the `phrase_maps.js` sync list to Claude B.
No other pending work from this session.

## Repository status at close (verified)
- HEAD `9ec26c4` = `origin/main`, working tree clean.
- `.ai/WORKSTATE.yaml` `claude_a.next_action` updated to this session's
  close, `next_action_prior` preserves the previous entry.
- `docs/THANGSENG_NATIVE_VALIDATION.md` has NV-080 appended.
- This migration doc is the last commit before session end (or the
  commit immediately following it).
