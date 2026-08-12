# Claude A Session Migration Document — 2026-08-12 (checkpoint close)

## Project identity
Lean-Garo — Garo language dictionary + English-to-Garo translation engine.
Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Claude A role: linguistic
authority only (grammar/morphology/dictionary quality/native validation
review). Never touches engine code (Claude B) or OCR ingestion (Claude D).

## Current commit/state
- HEAD at close of this session: `332623a05b919fa65e7ff6a412a643c11af71b17`
- Confirmed matches `origin/main` exactly (`git fetch` + compare).
- `git status`: clean, nothing local-only, nothing uncommitted.
- 203/203 unit tests passing.
- `repository-intelligence.js`: 0 new violations, all six checks (A-F) pass.
- `prepare-data.js` build clean: 8149 unique compiled entries (rebuild is
  deterministic — re-running it after this session's merge produced zero
  diff, confirming compiled_dict.json is in sync with its sources).

## What's done this session
1. **Apple root closed for good.** Native confirmed via Project Owner
   relay ("apple=apple confimed"): `apple` = `Apple` (English loanword),
   consistent with the pre-existing 2026-08-01 VERIFIED/HIGH entry
   (NV-049) and the `te·spu` native-word variant already correctly
   recorded as a non-competing alternate (not a live conflict). Removes
   "apple" from the standing open-items list in the prior migration doc.
2. **Apple counting 1-20 generated**, closing the fabricated/SUPERSEDED
   `sa se·sa`-style placeholders. Formula: `Apple` + `rong` classifier
   (roundish objects, no raka dot — directly evidenced by Thangseng's own
   typed example `apple rongsa`, NV-048/049, the strongest possible
   evidence tier) + the standard 1-20 suffix table. All 20 entries added
   to `master_dictionary.json` as VERIFIED/HIGH, following the exact
   structural precedent set by the `bite rong[suffix]` fruit rebuild
   from the 2026-08-11 session.
3. **New cross-table conflict allowlisted.** `garo_dictionary.json`
   still carries the old fabricated apple-counting values (untouched,
   per the same precedent as tree/fruit/pen — `master_dictionary.json`
   is canonical and `pickPrimary()` resolves in its favor via confidence
   tagging). Added the 20 `"<number> apple"` keys to
   `src/data/known_dictionary_conflicts.json` (appended, not
   re-sorted — preserved existing file ordering to keep the diff minimal).
4. **Concurrent-push collision handled per standing protocol.** Push was
   rejected (origin had advanced 2 commits: Claude B's location-noun-
   dropped engine-bug fix + can/need/want-to-eat modal phrases, and a
   buy-rice=merong override). Followed commit → fetch → merge → push:
   - Merge auto-resolved cleanly on `master_dictionary.json`,
     `src/data/category_index.json`, `src/grammarEngine.js`,
     `src/sentenceBuilder.js`.
   - Only `src/compiled_dict.json` (a generated artifact) conflicted —
     resolved by rebuilding via `prepare-data.js` from the merged
     sources rather than hand-merging generated JSON, then re-verified
     203/203 tests and a clean repository-intelligence run before
     committing the merge.
   - Pushed successfully; HEAD confirmed matching `origin/main`.

## Bugs caught this session
None. Mechanical, single-item, evidence-first task — no anomalies found.

## Open items — unchanged from 2026-08-11 doc, still not touched
- **Person/student/teacher's wider root conflict** (111 candidates,
  Claude B's `docs/COUNTING_PHRASE_AUDIT_20260810.md`) — still open,
  needs its own scoped session.
- **Coin** (`gong` classifier): root still untagged.
- General sweep for other English-loanword placeholders in
  `master_dictionary.json` / `garo_dictionary.json` — still not
  systematically searched.

## Standing rules reaffirmed this session
- Evidence-first methodology: apple root/classifier were resolved on the
  strongest available evidence tier (direct native-typed example,
  `apple rongsa`), not analogy or inference — no guessing occurred.
- `master_dictionary.json` is canonical; `garo_dictionary.json` legacy
  counting placeholders are left untouched and allowlisted in
  `known_dictionary_conflicts.json` unless the fix is a repo-wide root
  replacement (book/kitab precedent) rather than new counting entries.
- Generated artifacts (`compiled_dict.json`,
  `compiled_dict_alternates.json`, `category_index.json`) are rebuilt
  via `prepare-data.js`, never hand-merged, when they conflict during a
  push collision.
- Concurrent-push collision protocol (commit → fetch → merge → push)
  held again this session, third time in a row across recent sessions.
- One task per session: apple was the sole task; other open items were
  found pre-existing (not new) and are listed above, not acted on.

## Exact next step
No committed next task. Natural continuations, in rough priority order:
1. Native-confirmation round for coin's root — small, single-question
   ask suitable for the next Thangseng relay batch.
2. Person/student/teacher's 111-candidate root conflict — larger, needs
   its own scoped session per the resume-protocol rule (size queued
   work against context budget before starting).
3. General sweep for remaining English-loanword placeholders in
   `master_dictionary.json` / `garo_dictionary.json` — not yet
   systematically searched, only found via items the Project Owner
   named directly (kitab, pen, apple).
