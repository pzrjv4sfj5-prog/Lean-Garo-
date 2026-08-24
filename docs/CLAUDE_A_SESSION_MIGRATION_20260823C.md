# Claude A Session Migration — 2026-08-23C

## Project identity
Lean-Garo: Garo language dictionary + English→Garo translation engine.
Repo: github.com/pzrjv4sfj5-prog/Lean-Garo-. Claude A role: linguistic
authority (grammar, dictionary quality, native-validation review). Never
touches engine code (Claude B) or OCR ingestion (Claude D).

## Resume
Resumed via pasted docs/CLAUDE_A_SESSION_MIGRATION_20260823B.md. Re-synced:
repo was 5 commits ahead of that doc (fetch/HEAD verified clean, 226/226
tests). Found NV-094's own commit (7e3799d) had not updated
WORKSTATE.yaml/SESSION_BOOTSTRAP.md — fixed as part of this session's
close, below.

## Task this session: NV-095 — Thangseng final native-data reconciliation
Project Owner delivered "CLAUDE A — FINAL NATIVE DATA RECONCILIATION": 74
single-word entries + 10 fixed phrases, explicitly framed as Thangseng's
FINAL/authoritative answers, with an instruction to reconcile the repo to
ONE canonical value per English key (removing stale duplicates) unless a
genuine grammatical distinction requires more than one.

## What was done
1. Read master_dictionary.json, corrections.json, phrase_maps.js,
   garo_dictionary.json, irregular_verbs.json, prepare-data.js
   (grammarOverrides) for all 74 keys.
2. **31 new verified_high master_dictionary.json entries added** for keys
   with no existing matching value (cooked, cooking, dance, darkness,
   dead, dried, eaten, help, how, knowledge, live, living, nipple, no,
   plant, playing, pray, quick, roam, sit, smelly, song, stay, tasteless,
   teach, tell, very, walking, why, yes, you, well, happy).
3. **35 old master_dictionary.json rows marked SUPERSEDED** (not deleted —
   citation discipline) where they directly conflicted with the new final
   value. Notably resolves two long-standing open questions flagged in
   prior sessions: "yes" (Oe/Am/Hoe three-way → Am) and "sit" (aonga vs
   a·song·a, NV-080 → aonga; "sitting"=asongenga unaffected, different
   stem).
4. **1 entry promoted** (goat/Do·bok — was reconfirmed but had no
   `confidence` field set).
5. **1 data-hygiene fix** (doctor — stray literal "Doctor / " prefix
   removed from the garo field; value unchanged).
6. **Explicitly preserved as genuine grammatical/sense distinctions, NOT
   superseded**: dead(body)=Manggisi (separate existing key, untouched);
   cooked=min·a (NV-050, ripe/done-state sense — added a grammarOverride
   so Song·aha wins the resulting pickPrimary tie for bare "cooked",
   without erasing min·a); you=Nang (different, unconfirmed case-role,
   already flagged not superseded); how=Maikai and why=Maini·gimin (fuller
   register forms, left untouched, allowlisted as coexisting).
7. **Propagated to runtime layers** wherever they held a stale/wrong
   value for these keys: corrections.json (13 fixes), phrase_maps.js (8
   fixes), garo_dictionary.json (13 rows across 6 keys), irregular_verbs.json
   (1 fix: eaten), prepare-data.js grammarOverrides (quick/hurry split
   into distinct forms; cooked tie-break added).
8. **Caught and reverted my own mistake**: initially changed
   corrections.json's bare "wait" to the dual "Damo/Sengbo" form, which
   broke RULE-036 suffixation (`Anga Damogen`). Reverted to "Damo" — see
   test regression below.
9. Rebuilt via `node prepare-data.js`. Ran `node repository-intelligence.js`:
   found 18 new (expected) self-consistency conflicts between old
   SUPERSEDED/differing rows and the new values — allowlisted all 18 in
   known_dictionary_conflicts.json with the NV-095 citation already
   present in master_dictionary.json's notes. Exits 0.
10. Ran full test suite: found 7 failures, all pre-existing stale test
    fixtures asserting values that were exactly the bugs this
    reconciliation fixed (quick/Tarkbo!→hurry's value, wash/Su·srong·a,
    eaten/cha·manaha) plus the wait/RULE-036 regression I introduced and
    reverted. Updated the 4 legitimate stale fixtures with citations;
    fixed my own wait mistake rather than updating a test around it.
    **226/226 passing.**
11. Live-verified via `node -e "import('./src/translationEngine.js')..."`
    for 15 of the reconciled keys — all correct (no, yes, help, stop,
    quick, hurry, log, must, sit, song, you, teach, wash, dead, cooked).
12. Wrote docs/CLAUDE_B_RUNTIME_HANDOFF_20260823C.md (full per-entry
    table). No runtime propagation work remains for Claude B on this
    batch — Claude A did it directly since it was mechanical
    (JSON/JS value substitution), consistent with prior sessions'
    practice for this class of fix.

## Final report
- Entries processed: 74 (word list) + 10 (fixed phrases, mostly already
  correct — see below).
- Old/conflicting values found: 38 distinct old rows/layer-values.
- Superseded (master_dictionary.json): 35.
- Intentionally left unchanged (genuine distinction or insufficient
  evidence to override): dead(body)/Manggisi, cooked/min·a, you/Nang,
  how/Maikai, why/Maini·gimin, wait (already correct, reconfirmed only),
  pray's declarative variants (bi·am·a/bi·ap·a — different mood, not
  contradicted), quick's declarative root (ta·rak·a — different mood).
- Runtime propagation: complete (see handoff doc); no work remains for
  Claude B unless their own audit finds a layer this session missed.
- Fixed phrases: all 10 already matched (phrase_maps.js), except the
  "Sorry → Kema" (interjection, short form) vs existing "sorry" → "Kema
  bi·a" (full form, matches master) — **left unresolved on purpose**:
  the document gives both, plausibly a genuine interjection-vs-statement
  distinction, and I don't have enough evidence to force one over the
  other. Flagging for next relay if the Project Owner wants it
  disambiguated.
- "only" — explicitly deferred by Thangseng per the document; untouched.

## Standing rules (unchanged, reconfirmed this session)
Same as prior migration docs — evidence-first, citation discipline
(SUPERSEDED not deleted), NV-numbering, `.ai/CLAUDE_D_HANDOUT.md` sole
Claude D channel, PAT single-session-only, Rule 8 (fix stale
phrase_maps.js directly), Rule 10 (mandatory resume sequence).

## Runtime Handoff
See docs/CLAUDE_B_RUNTIME_HANDOFF_20260823C.md — full per-entry table,
old value / where found / superseded-or-not. No action required from
Claude B on this batch.

## Open items for next relay (unrelated carryover, unresolved this session)
- "Sorry" interjection (Kema) vs "sorry" full form (Kema bi·a) —
  disambiguate which layer each belongs to.
- 138-item relay batch still held (from prior sessions, unrelated to
  NV-095).
- pickPrimary verified-ties pre-existing this session (hope, leg, last,
  early, answer, fever, hoe, empty, where, horn, agree, brave, greedy,
  demand, where(relative)) — out of scope for NV-095, untouched.

## Repository status at close
- HEAD (this commit's parent, per WORKSTATE convention): to be recorded
  in WORKSTATE.yaml as the commit immediately before this session's
  close commit.
- `git status`: clean before commit.
- `git fetch` + origin/main comparison: to be verified before push.
- 226/226 unit tests passing.
- `node repository-intelligence.js`: exits 0, 0 new violations.
- master_dictionary.json: 9910 rows (was 9877 — +31 new, +2 well/happy
  = 33 net new rows; 35 marked superseded in place, no row-count change
  from that).
- compiled_dict.json: 8183 entries.
- WORKSTATE.yaml / SESSION_BOOTSTRAP.md: updated in this session's
  close commit.
- No local uncommitted changes after close commit.
- Native-validation/blocker status: none blocking; "Sorry" interjection
  ambiguity flagged above, non-blocking.
