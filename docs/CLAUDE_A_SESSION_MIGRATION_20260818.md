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
   **Correction (2026-08-19 QA audit):** this verdict was wrong — it
   checked `compiled_dict.json` only, not the runtime cascade.
   `phrase_maps.js` overrode ahead of it with stale pre-NV-080 values, so
   `translate()` was actually still serving `father`->old form,
   `mother`->old form. Fixed in `76156c2`; live-reverified this session
   (see below). Going forward: "is X correct" checks must call
   `translate()`, not read `compiled_dict.json` directly.

## Deliberately held OPEN — evidence-first, no native answer to force
| Item | Reason |
|---|---|
| 82 Brave | Thangseng explicitly deferred (NV-082): wants a different word than `ka·donga`/`ka·dongani`, not confirming either — pending further native input |
| 94 Agree | No answer given; Tridip's question wasn't addressed by Thangseng (NV-082) — stays open |
| 96 Bear (verb sense) | No native entry for carry/endure; animal sense (`Matmak`) confirmed |
| 44 Gong (instrument) | Classifier sense confirmed; instrument sense still unconfirmed |

133b ("Bao") is now CLOSED — see above. Removed from this table.

## Closures — 2026-08-19, NV-082 (Thangseng relay via Tridip, WhatsApp)
- **26 Last — CLOSED.** `bon·kamgipa` (final, e.g. "last page") and
  `ja·mangipa` ("the last one/person") — two ordinal-final forms,
  explicitly distinguished by Thangseng from `Mija` ("Mija in Garo
  simply implies past in time"). Confirms NV-081's finding rather than
  contradicting it.
- **84 Hope — CLOSED.** `ka·dongani` (noun) / `ka·donga` (verb) — POS
  split, mirrors NV-077's "answer" pattern exactly. Existing loose
  `Hope`→`ka·donga` entry POS-clarified as the verb, not deleted.
- **82 Brave — reclassified, stays OPEN.** No longer bundled with Hope
  as a duplicate-encoding conflict (that framing is resolved — they're
  different words entirely, not a shared-form collision). Thangseng
  wants a different word than the current `ka·donga`/`ka·dongani`
  candidates for brave/bravery specifically — open pending that.
- **94 Agree — stays OPEN.** Asked, not answered.

## Closures — 2026-08-19, RULE 2 doc + NV-081
- **138 Let's sit — CLOSED.** `Hai Asongna` (suffix -na). Owner-supplied
  RULE 2 table matches existing repo pattern (`corrections.json`,
  `VALIDATION_CORPUS.md`, `GRAMMAR_RULE_CATALOGUE.md`,
  `GRAMMAR_CONFIDENCE_MATRIX.md` all already use -na, e.g. `Hai cha·na`).
  Supersedes stale `Hai asongha` from `GRAMMAR_FLAGS_20260625.md`.
- **139 Let's play — CLOSED.** `Hai kalana` (suffix -na). Same basis.
  Supersedes stale `Hai kalaha`.
- **140 Let's work — CLOSED.** `Hai Kam kana`. Root confirmed as
  `Kam ka` (not `Dak-a`) — verified no collision: `Dak·a` (noun "work",
  NV-080) and `Kam ka·a` (verb "to work", independently CONFIRMED under
  RULE-041, Thangseng relay 2026-07-22) are separate POS entries in
  different schema slots. RULE 2's "let's work" is a verb-root HAI form,
  correctly maps to `Kam ka·a`/RULE-041, not the noun entry. No
  overwrite.
- **Mija/antio duplicate-encoding — CLOSED, narrowly.** NV-081 (new,
  logged this session — see `THANGSENG_NATIVE_VALIDATION.md`) confirms
  `Mija` = temporal-recency modifier, co-occurring with `antio` in
  `Mija antio` ("last week"), based on two genuine relayed sentences.
  Full "free noun `Anti` vs. bound-locative `antio`" grammar rule and
  the wider tense-paradigm table (next week/month, tomorrow) were
  **not** part of the native data — that was Gemini/Owner analysis
  layered on top — and are held as an open hypothesis, not applied.
  `Sop·ta` is untouched: no native evidence addresses it, and deletion
  was explicitly refused regardless of source per this project's
  retain-and-tag policy.
- **26 Last — stays OPEN**, per NV-081's own finding: `Mija` is
  recency-only and explicitly does not cover the ordinal/final sense
  this item tracks.

## Additional closures — 2026-08-19 QA audit propagation-gap corrections
- **133 (jeon/jeo main-vs-short-form) — CLOSED.** Already answered by
  NV-064 (2026-08-06): "jeo = short form of jeon." Was re-flagged open in
  error; no new native round needed. See
  `docs/THANGSENG_NATIVE_VALIDATION.md`, "Open-items list correction"
  section.
- **small/wet → `Chon·a` duplicate — CLOSED.** Already resolved distinctly
  within NV-080 itself: small=`Chon·a`, wet=`so·si·a`, no shared form at
  the data layer. Was re-flagged open in error. The runtime symptom that
  made it look open (`phrase_maps.js` masking with a stale SUPERSEDED
  value) was an engineering bug, fixed by QA audit `76156c2` — not a
  linguistic finding. See same section as above.

11 items now remain genuinely open (verified individually against
`THANGSENG_NATIVE_VALIDATION.md`, no prior evidence for any — QA audit
confirmed this, no action needed).

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
