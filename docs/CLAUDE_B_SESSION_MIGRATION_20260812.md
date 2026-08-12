# Claude B Session Migration Document — 2026-08-12 (checkpoint close)

## Project identity
Lean-Garo — Garo language dictionary + English-to-Garo translation engine.
Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Claude B role: translation
engine code (grammarEngine.js, sentenceBuilder.js, translationEngine.js,
normalizationEngine.js) + runtime-cascade files (corrections.json,
final_entries.json) that must stay in sync with master_dictionary.json.
Never the sole authority on root/morphology calls — those need native
confirmation via the Project Owner, same as Claude A's dictionary work.

## Current commit/state
- HEAD at close of this session: `1d17cdc` (confirmed matches
  `origin/main` exactly via `git fetch` + compare).
- `git status`: clean, nothing local-only, nothing uncommitted.
- 203/203 unit tests passing.
- `repository-intelligence.js`: 0 new violations. 305 known/allowlisted
  mismatches (down from 308 at session start — three stale
  corrections.json tree entries fixed this session resolved three of
  them).
- `prepare-data.js` build clean: 8149 unique compiled entries.

## What's done this session
1. **`BUG_location_noun_dropped` actually fixed.** Of the four open
   bugs + two "fixed" docs in `docs/BUG_*`/`docs/FIX_*`, live-testing
   found five were already resolved in code with stale doc status —
   only this one was still genuinely broken. Added a dedicated
   location/destination slot in `grammarEngine.js` (`locationWords`,
   separate from the single `objectWords` slot two nouns were
   previously colliding in) and wired it into `sentenceBuilder.js`
   with the documented `+chi` directional/locative suffix. `"i went to
   the market to buy rice"` no longer silently drops "market".
2. **Modal eat phrases added**, direct Project Owner input: `can eat` /
   `need to eat` / `want to eat` → `cha·na man·a` / `cha·na nanga` /
   `cha·na ska·`. Scoped to just "eat" — not generalized into a reusable
   modal-construction rule (one confirmed verb isn't a confirmed
   formula, same discipline as the classifier work).
3. **`buy rice` = uncooked rice (`merong`) override.** The
   cooked/uncooked distinction (`rice (uncooked)`=`Merong`,
   `rice (cooked)`=`Mi`) already existed in the corpus but wasn't
   reachable from the plain `"rice"` object lookup, so "buy rice" was
   resolving to the wrong (cooked) reading. Added a narrowly-scoped
   override in `grammarEngine.js`: fires only when
   `purposeAction.english === 'buy'` and the object is exactly "rice".
   Does not touch "rice" in any other context.
4. **Tree root reversed: `Bol`, not `a'bil`.** Direct Project Owner
   input confirmed `"two trees"` = `"Bol panggni"` and clarified that
   `a'bil` names a *specific* tree species, not the generic word for
   "tree" — the opposite of what the 2026-08-01 corpus audit assumed
   and what Claude A's 2026-08-11 counting-formula generalization
   (`b263902`) was built on. Root swapped across:
   - The two root-priority entries in `master_dictionary.json` (`Bol`
     was SUPERSEDED, `a'bil` was VERIFIED/HIGH — reversed; `a'bil` now
     annotated as naming a specific species, not generic "tree").
   - All 20 of Claude A's 1-20 counting entries (root swapped, formula
     unchanged — `pang` classifier's no-raka behavior is a property of
     the classifier, independent of root, so that part of A's
     2026-08-11 analysis still holds).
   - **Four stale `src/data/corrections.json` entries** (`tree`,
     `a tree`, `two trees`, `three trees`) that were using a bare
     `pang` with *no root at all* — an even older fabrication than
     `a'bil`, and the one actually driving live output, since
     corrections.json is checked before grammar-assembly. This is why
     the live-tested output was still wrong even after the
     master_dictionary.json fix — caught by testing actual translator
     output, not just the data file.
   - Checked `final_entries.json` for the same class of runtime-cascade
     gap (this session's own bird-fix precedent) — clean, no tree
     entries there.
5. **Buy purposive form fixed.** `PURPOSE_MAP['buy']` was hardcoded
   `"brea·na"` — wrong root spelling (`brea` vs confirmed `bre·a`) and
   wrong purposive formation (naive root+na concatenation rather than
   the irregular drop-final-vowel form). Corrected to `"bre·na"`,
   direct Project Owner input.
6. **`"re'na re'anga"` confirmed not a real construction.** Was
   flagged rather than guessed at in the prior session turn (never
   entered the corpus); Project Owner has now confirmed directly it's
   simply incorrect. Nothing to revert — noting for the record only.
7. **Concurrent-push collision handled per standing protocol**, twice
   this session (against Claude A's book/tree/person push, then again
   against A's apple-root-close push). Both times: `src/compiled_dict.json`
   (and once `compiled_dict_alternates.json`) conflicted as generated
   artifacts — resolved by rebuilding via `prepare-data.js` from merged
   sources rather than hand-merging, then re-verified 203/203 tests and
   a clean repository-intelligence run before each push.

## Bugs caught this session
- **Self-inflicted, caught before commit:** a blanket Python string
  replace during the tree-root edit corrupted one clause of a note's
  historical reference (turned a mention of the *old* wrong value into
  the *corrected* value, making the sentence assert the opposite of
  what it meant). Caught by rereading the note text after the edit,
  fixed with a second targeted replace before anything was committed.
- **Found, not caused:** the four bare-`pang` corrections.json entries
  above — a fabrication that predates both this session and Claude A's
  a'bil-based counting work, only surfaced by testing live translator
  output against the dictionary fix rather than trusting the data-layer
  fix alone.

## Open items
- **`buy` root**: `"did you buy"` in corrections.json still resolves
  through the SUPERSEDED `Brea` form (`"Na·a Breaaha ma?"`), not the
  VERIFIED `bre·a`/`bre·na` forms fixed this session. Not touched —
  out of scope for what was asked, flagging for a future pass.
- Unchanged from Claude A's 2026-08-12 doc: person/student/teacher's
  111-candidate root conflict, coin's untagged root, and the general
  sweep for other English-loanword placeholders.

## Standing rules reaffirmed this session
- Live-test translator output, don't just trust that a data-layer fix
  is sufficient — the tree bug only fully surfaced by running
  `translate("two trees")` after the master_dictionary.json fix and
  finding it still wrong, tracing it to a second, older bug in
  corrections.json.
- Generated artifacts are rebuilt via `prepare-data.js`, never
  hand-merged, on push-collision conflicts.
- Root/morphology corrections require direct native confirmation
  (Project Owner input or relay) — engine-side (Claude B) never makes
  a root call unilaterally, only implements once confirmed.
- When a follow-up answer doesn't match any option offered, don't
  guess at what was meant — leave the prior safe default in place and
  ask again (`bre·a` for "buy" kept as default pending a real answer
  on the `re'na re'anga` question, until it arrived directly).
- Concurrent-push collision protocol (commit → fetch → rebase → push)
  held twice this session.

## Exact next step
Per Project Owner instruction at session close: next phase is the
milestone doc and Claude B's own audit gaps (referenced but not yet
scoped in this session — no existing `docs/AUDIT_*` or
`docs/MILESTONE_2026-08-12.md` file created yet). Natural starting
points based on what's visible in the repo:
1. `docs/BUG_*`/`docs/FIX_*` doc-status hygiene — five of six files in
   that set were found stale this session (already-fixed code, doc
   still says open, or vice versa). Worth a dedicated pass to
   reconcile all of them, not just the one that mattered this session.
2. The `buy`/`Brea` corrections.json gap noted above.
3. Whatever the Project Owner scopes as "your own audit gaps" —
   needs clarification on what that refers to before starting.
