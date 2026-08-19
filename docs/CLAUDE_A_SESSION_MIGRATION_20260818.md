# Claude A Session Migration — 2026-08-18

## Project identity
Lean-Garo — English-to-Garo dictionary/translation engine.
Repo: https://github.com/pzrjv4sfj5-prog/Lean-Garo-
Role: Claude A = linguistic authority only (dictionary data, grammar,
native validation). Never touches engine code (Claude B's lane:
phrase_maps.js, translationEngine.js, prepare-data.js internals) or OCR
ingestion (Claude D).

## Current repo state
- HEAD = `b09c336`, pushed, `origin/main` matches, working tree clean.
- Gate: 8127 compiled entries · `test-dictionary.js` 8127/8127 ·
  `npm test` 218/218 · `repository-intelligence.js` 0 new violations ·
  `runtime-error-sweep.mjs` 14523/14523, 0 errors · 16 pre-existing
  `pickPrimary` verified-ties (none introduced this session).

## What happened this session
Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260817B.md` — zero drift,
HEAD matched exactly.

1. **Closed relay item 133b ("Bao").** Project Owner re-supplied the
   NV-054 native quote verbatim in chat. Investigation found RULE-044.yaml
   already carried the corrected linguistic understanding (Bao = object-
   placement only, not general "where?") since 2026-08-03, but
   `master_dictionary.json`'s `"where?"` -> `Bao` row had never been
   re-synced and was still compiling as the generic "where?" answer.
   Re-keyed that row's english field to `"where (object placement)"`,
   citing the existing NV-054 (no new NV number — same evidence, applied
   to the schema). Logged in `docs/THANGSENG_NATIVE_VALIDATION.md`.
   Pushed `b09c336`.

2. **Declined a "close everything" instruction.** Project Owner asked to
   close all remaining open items and eliminate duplicates. No new native
   evidence was supplied for any of the 13 still-open items (134's Bao
   sub-item was the only one with new evidence, see above) — held them
   open per evidence-first methodology, explicitly stating this rather
   than silently ignoring the instruction.

3. **Investigated "baba/Aa.i still showing up."** Confirmed not a bug:
   `compiled_dict.json` already resolves `father`->`ba·ba`,
   `mother`->`Aa.i` correctly (verified directly). The old competing
   rows (`Pa/Apa`, `a·pa`, `pa·a`, `Ma/Ama`, `a·ma`, `ma·gip·a`,
   `na·gi·pa`) are all already tagged `SUPERSEDED` with NV-080 citations
   — retained per this project's standing citation-discipline policy
   (never delete, always tag), not deleted. They're only visible if
   reading raw `master_dictionary.json` directly; the live app never
   surfaces them. Flagged that physically deleting superseded rows would
   be a real policy change, not something to do silently.

## Deliberately held OPEN — evidence-first, no native answer to force (13, was 14)
| Item | Reason |
|---|---|
| 82 Brave / 84 Hope | Both `Ka·donga` — duplicate-encoding conflict |
| 94 Agree | Held at Claude B's request |
| 138/139/140 Let's sit/play/work | Relay doc's own text contradicts the RULE 2 table |
| 26 Last | No native entry for the ordinal/final sense |
| 96 Bear (verb sense) | No native entry for carry/endure; animal sense (`Matmak`) confirmed |
| 133 Where-relative (jeon/jeo) | Both confirmed valid, no main/short-form ranking |
| 44 Gong (instrument) | Classifier sense confirmed; instrument sense still unconfirmed |
| small/wet → `Chon·a` | Same form recorded for both meanings, flagged as-is |

133b ("Bao") is now CLOSED — see above. Removed from this table.

## Standing rules (unchanged, reaffirmed this session)
Rules 7–10, 9a as previously established. Evidence-first: resolve only
with clear evidence (corpus-internal contradiction, prior verified rule,
or direct native confirmation); flag and leave unresolved otherwise —
never guess, even under an explicit "close everything" instruction. One
task per session; other issues found mid-task go in "Next Recommended
Tasks" only. Nothing left local-only; everything committed and pushed
before close. Superseded rows are retained with citation, never deleted,
without an explicit Project Owner policy change.

## Handoff to Claude B (not touched myself — engine lane)
1. 34 `phrase_maps.js` values are stale against the 2026-08-17 dictionary
   changes. Logged with citation as `phrase_maps:<key>` in
   `src/data/known_cross_source_conflicts.json`. Still pending, untouched
   this session.
2. `bear` key polysemy (animal noun vs. carry/endure verb, one schema
   slot) — unchanged, still flagged.

## Exact next step
Either:
(a) Send the 13 open items above back through Thangseng/Tridip for a
    follow-up native-validation round, or
(b) Hand the `phrase_maps.js` sync list to Claude B.
No other pending work from this session.

## Repository status at close (verified)
- HEAD `b09c336` = `origin/main`, working tree clean.
- `.ai/WORKSTATE.yaml` `claude_a.next_action` updated to this session's
  close; `next_action_prior` preserves the 2026-08-17b entry;
  `migration_doc` pointer updated to this file.
- `.ai/SESSION_BOOTSTRAP.md` — not modified. Per its own standing rule
  (2026-08-10, "current-rules-only, not a log"), session narratives never
  get appended there; no new standing rule was established this session,
  so no edit was needed.
- `docs/THANGSENG_NATIVE_VALIDATION.md` has the 133b closure note
  appended (cites existing NV-054, no new NV number).
- No local commits ahead of `origin/main`, no uncommitted changes.
- No open blockers beyond the 13 items in the table above, all already
  logged with reasons in `docs/THANGSENG_NATIVE_VALIDATION.md` /
  `docs/CLAUDE_A_SESSION_MIGRATION_20260817B.md`.
