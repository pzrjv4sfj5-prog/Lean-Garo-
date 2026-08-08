# Claude B Migration Document — 2026-08-08

## 1. Session Summary

Resumed as Claude B from the 2026-08-07 migration doc (checkpoint
`27df4fd`). Implemented **Item 2** — `normalizeGaro()` canonical Garo
comparison-key normalization and near-duplicate detection at both
import-time and promotion-time — per the ruleset Claude A relayed
directly in chat (the external `ITEM2_NORMALIZATION_DESIGN.md` from the
prior design-only session was never committed to the repo, per that
session's own explicit Project Owner instruction, so this session
confirmed the one genuinely underspecified piece — parenthetical-OCR-gloss
handling — rather than guessing at it from the `WORKSTATE.yaml`/
`SESSION_BOOTSTRAP.md` design summary alone).

Mid-session, origin advanced with 3 Claude A commits (NV-067, a merge of
this session's own prior fix, NV-068); merged cleanly with zero real
conflicts. During final closeout, `npm install` succeeded for the first
time this entire session thread — **`eslint` and `vite` are both usable
in-sandbox now**, which was never true in any prior migration doc. This
surfaced and let me fix one genuine pre-existing lint error (duplicate
`'buy'` key in `phrase_maps.js`), and confirmed `vite build` completes
successfully end-to-end.

## 2. Repository State

- **HEAD:** `4ee8f14`
- **origin/main:** `4ee8f14`
- **Clean tree:** confirmed (`git status --short` empty)
- **Zero divergence:** confirmed (`git log HEAD..origin/main` and
  `git log origin/main..HEAD` both empty after final fetch)
- **PAT:** session-supplied, used inline in the push URL only for every
  push this session, never written to `.git/config` or anywhere on
  disk — confirmed via `grep github_pat .git/config` (0 hits) after
  every push, including the final one.

## 3. Engineering Work Completed

### Item 2 — `normalizeGaro()` + near-duplicate detection
- Added `normalizeGaro()` to `scripts/import-dictionary.js`, exported
  alongside the existing authoritative `normalize()`. Ruleset (Claude A,
  confirmed in chat this session): remove parenthetical `(...)`
  OCR/pronunciation glosses wholesale (never normalized or compared
  inside them) → strip raka dots (`·`) → strip hyphens (`-`) → collapse
  consecutive whitespace → trim → case-fold → preserve apostrophes (`'`)
  exactly. Apostrophe preservation is load-bearing, not cosmetic —
  `docs/GRAMMAR_RAKA_RULE_CONFIRMED_20260626.md`'s `cha'a` example shows
  the raka itself can surface as an apostrophe.
- Added `buildNormalizedGaroIndex()` / `findNearDuplicates()` — a
  global, english-independent, compare-only index and lookup, kept
  deliberately separate from `buildExistingIndex()`'s authoritative
  exact-match logic. The normalized key is **never** used to overwrite,
  modify, or replace stored Garo text anywhere.
- Wired into `import-dictionary.js` at import-time: every staged
  pending record now carries a `near_duplicate` field (`null`, or
  `{normalized_key, matches: [{english, garo}, ...]}`), independent of
  and additive to `conflict.type`.
- Wired into `promote-lexicon.js` at promotion-time (reuses Item 1's
  fresh-reload point): prints `WARN near_duplicate` but **never blocks,
  skips, or auto-resolves** the promotion.
- Retired `claude-d-preflight.js`'s local `normalizeGaroLoose()` in
  favor of the canonical function; updated both call sites
  (`findRakaVariantMatch`, `findGaroKeyedNearDuplicates`) and the file's
  header comment documenting the original draft-contract deviation.
- Updated `docs/PENDING_LEXICON_WORKFLOW.md`'s schema table (new
  `near_duplicate` field) and Step 4 (promotion-time `WARN` behavior).
- New test file `tests/unit/item2-normalization.test.js` (19 tests):
  full ruleset including the parenthetical-gloss carve-out and
  apostrophe preservation; index/lookup including the
  exact-match-must-not-double-report guard and the cross-english-key
  global-match case; full end-to-end CLI runs of both
  `import-dictionary.js --apply` and `promote-lexicon.js --apply`
  against synthetic sandboxed fixtures, never touching real repo data.
  Registered in `package.json`'s `build` script gate.
- Fixed one stale pre-existing test expectation in
  `tests/unit/claude-d-preflight.test.js` that assumed the retired
  function's incorrect whitespace-*stripping* (rather than *collapsing*)
  behavior — a genuine bug this session surfaced, not a regression
  introduced by the retirement.

### Merge of concurrent origin work
- Merged `origin/main` (`2a27f72`) mid-session — Claude A's NV-067
  (smiled/mouth reconfirmation) and NV-068 (dambe/bi·sa semantic
  correction, resolving `PL-0002014`). Zero real conflicts; the only
  touched files needing regeneration were the two generated
  `compiled_dict.json`/`compiled_dict_alternates.json` artifacts, both
  regenerated via `prepare-data.js` and confirmed byte-identical to
  git's own auto-merge (`git diff --stat` clean after regen).

### Closeout lint fix
- `npm install` succeeded in-sandbox for the first time this session
  thread (prior sessions could never install `eslint`/`vite`). `npm run
  lint` immediately found one real, pre-existing error: a literal
  duplicate `'buy'` object key in `src/data/phrase_maps.js` (lines 171
  and 306), both holding the identical value `'bre·a'` — a leftover
  from the 2026-08-07 SUPERSEDED-precedence session's book/table/buy/door
  fix. Mechanical, not a linguistic call (both sides agreed) — removed
  the redundant second entry. `npm run lint` now passes clean (0
  errors).

## 4. Runtime Verification

- **Unit tests:** `npm test` (all 6 files in `tests/unit/`) — **196/196
  passing.**
- **Build gate (`npm run build`):** `prepare-data.js` →
  `test-dictionary.js` → `repository-intelligence.js` → unit tests
  (184 of the 196 — the build script only wires in
  `translationEngine.test.js`, `claude-d-preflight.test.js`, and
  `item2-normalization.test.js`; `number_engine.test.js`,
  `rc037_bird_classifier.test.js`, `rong_classifier.test.js` are not in
  the build gate — **pre-existing gap, not introduced or touched this
  session**, flagged below as P3) → `vite build`. **All stages pass.**
- **`test-dictionary.js`:** 8060/8060 entries valid, 9/9 grammatical
  corrections verified.
- **`repository-intelligence.js`:** PASSED — 0 new violations across
  Checks A–F (Check C: 1185 known/allowlisted, 0 new; Check D: 2014
  pending entries, 0 structural problems; Check F: 312 known/allowlisted
  mismatches, 0 new).
- **`vite build`:** succeeds — 58 modules transformed, `dist/` output
  produced. **This is the first session in the entire migration-doc
  history where a real `vite build` has been confirmed, not just
  assumed unavailable.** (`dist/index.html`'s incidental build-hash
  churn from the local run was reverted before committing — regenerating
  `dist/` wasn't in this session's scope.)
- **`eslint` (`npm run lint`):** **also available in-sandbox for the
  first time.** Found and fixed 1 real error (duplicate key, see
  above). Clean on re-run (0 errors, 0 warnings, `--max-warnings 0`).

## 5. Commits Created (this session, `27df4fd..4ee8f14`)

| Commit | Summary |
|---|---|
| `b27c524` | Implement Item 2 — `normalizeGaro()` + near-duplicate detection |
| `a6adbde` | Merge `origin/main` (`2a27f72`): Claude A's NV-067/NV-068 |
| `3b11c3e` | Sync workstate docs after merge, flag Claude A's smile handoff |
| `4ee8f14` | Fix duplicate `'buy'` key in `phrase_maps.js` (lint error) |

## 6. Outstanding Engineering Backlog

Nothing below was worked on this session unless explicitly marked
"touched." Carried forward in full from the prior migration doc, plus
new items surfaced this session.

### P1 — Active engineering bugs
1. **`compiled_dict.json['smile']` ships the wrong variant.** Surfaced
   by Claude A's own `a6fda30`: `prepare-data.js`'s `pickPrimary`
   master-preference logic ignores `isVariant`, so the compile output
   uses an unconfirmed variant instead of the VERIFIED/HIGH
   `Ka·dingsmita`. Explicitly addressed to Claude B. **Not fixed this
   session** — flagged, not silently carried.
2. **`getCategories()`/`getByCategory()` — still dormant.** Always
   return `"uncategorized"`. Untouched for multiple sessions running.
3. **`"she has three children"` → number/classifier dropped entirely**
   (`"Ua bi·sa·ko donga"`). Only "two children" has an exact-match
   entry; same failure class as older dropped-classifier issues.
   Untouched.
4. **Build gate does not run all unit test files.** `npm run build`'s
   `node --test` invocation only lists `translationEngine.test.js`,
   `claude-d-preflight.test.js`, `item2-normalization.test.js`.
   `number_engine.test.js`, `rc037_bird_classifier.test.js`, and
   `rong_classifier.test.js` exist and pass under `npm test`, but are
   silently excluded from the actual build/CI gate. **Newly surfaced
   this session** (via the `npm install` that finally worked) — not a
   regression I introduced, but a real gap nobody could previously see
   because `npm run build`'s `vite`-dependent tail never completed
   in-sandbox before now.

### P2 — Engineering improvements
5. **`phrase_maps.js` — 112 more stale-vs-SUPERSEDED entries**, same
   shape as the already-fixed book/table/buy/door, but most have
   multiple ambiguous alternatives requiring real linguistic judgment
   (not mechanical like this session's duplicate-key fix). Untouched.
6. **RC-CANDIDATE-038 review** — 101 `corrections.json`/`phrase_maps.js`
   vs `compiled_dict.json` disagreements, allowlisted pending a
   dedicated Claude A review pass (likely belongs alongside Item 2,
   which is now shipped — Item 2's near-duplicate flagging may help
   triage these going forward, but the 101 keys themselves still need
   individual review). Untouched this session.
7. **`do·omok` (goat, alternate form)** — flagged `SUPERSEDED` per a
   prior session's native reconfirmation of `Do·bok`, noted as possibly
   still a valid register/dialect variant rather than an outright
   error. Claude A's call. Untouched.

### P3 — Technical debt / linguistic dependencies / dormant code / future architecture
8. **Item 2's own scope boundary (dormant follow-on, not a bug):** near-
   duplicate detection is currently import-time and promotion-time only
   against `master_dictionary.json`. It does not scan
   `corrections.json`/`phrase_maps.js` for the same drift pattern that
   produced RC-CANDIDATE-038 and the 112 `phrase_maps.js` entries —
   extending it there would be a natural, but unrequested and unscoped,
   future enhancement. Flagged for awareness, not actioned.
9. **Build-gate test-file gap (P1 #4 above)** also has a technical-debt
   angle: worth deciding deliberately whether `number_engine.test.js`/
   `rc037_bird_classifier.test.js`/`rong_classifier.test.js` should be
   added to the `build` script's `node --test` list, or whether there's
   a reason they were left out — not assumed either way this session.
10. **`eslint`/`vite` sandbox availability** — historically flagged in
    every prior migration doc as "not installed, cannot verify." This
    session confirmed `npm install` now succeeds and both tools work.
    Worth carrying forward as a note (not a bug) so future sessions
    don't reflexively re-flag this as still-unavailable without
    checking first.
11. **Item 1 (`promote-lexicon.js` promotion-time re-check)** — built
    and verified in a prior session, still holding, no new issues found
    this session.

## 7. Runtime Handoff

None beyond what's described above. This session touched:
`scripts/import-dictionary.js`, `scripts/promote-lexicon.js`,
`scripts/claude-d-preflight.js`, `src/data/phrase_maps.js` (1-line
duplicate-key removal), `docs/PENDING_LEXICON_WORKFLOW.md`,
`package.json` (build script test-file list), `tests/unit/item2-
normalization.test.js` (new), `tests/unit/claude-d-preflight.test.js`
(1 stale expectation fixed), and the two `.ai/` workstate docs. No
`master_dictionary.json`/`garo_dictionary.json`/`corrections.json`
edits this session (Item 2 is pure engineering; no linguistic content
changed). `compiled_dict.json`/`compiled_dict_alternates.json` were
regenerated once, during the mid-session merge, and are confirmed
byte-identical to git's own auto-merge result.

## 8. Exact Resume Protocol

1. Start a new conversation, paste this document in.
2. `git fetch origin`; confirm `HEAD == origin/main` (should be
   `4ee8f14` unless something else has landed — if not, run
   `git log <that-hash>..origin/main` to review what changed).
3. Re-sync with actual repo state before doing anything — don't assume
   nothing changed since this doc was written.
4. Pick from the backlog above, in rough priority order: the smile/
   `isVariant` bug (P1, small and contained, not a linguistic call —
   likely the fastest real fix available), the build-gate test-file gap
   (P1, mechanical), or the larger RC-CANDIDATE-038/112-entry
   `phrase_maps.js` reviews (P2, needs Claude A's linguistic judgment
   throughout, not something Claude B should resolve solo).
