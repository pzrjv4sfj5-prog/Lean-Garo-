# Claude B Migration Document — 2026-08-09

## 1. Session Summary

Resumed as Claude B from a user-pasted copy of the `2026-08-08` migration
doc (checkpoint `4ee8f14`). Re-synced against actual repo state before
acting per standing resume protocol — `git fetch` found origin had since
advanced to `1aad3fe` (Claude A's NV-067/068/069 session: closed the
`smile`-variant engine-bug handoff as a flag for Claude B, plus a full
young/`bi·sa`/children/calf/book/table linguistic-correction cluster).
Pulled clean, re-verified 196/196 before starting any new work.

Closed all 4 P1 engineering items carried in the `2026-08-08` migration
doc's backlog, plus one new systemic issue (counting-phrase classifier
corruption across all categories) surfaced while fixing item 3, per an
explicit Project Owner instruction mid-session with confirmed reference
examples (`two dogs`=`achak mang·gni`, `three dogs`=`achak mang·gittam`,
`four dogs`=`achak mang·bri`).

## 2. Repository State

- **HEAD:** `0ddd84a`
- **origin/main:** to be pushed this session (was `4ee8f14` at session
  start, `1aad3fe` after re-sync)
- **Clean tree:** confirmed (`git status --short` empty as of this doc)
- **PAT:** session-supplied, used inline in the clone/push URL only,
  never written to `.git/config` or anywhere on disk

## 3. Engineering Work Completed

### Fix 1 — `compiled_dict.json['smile']` ships the wrong variant (NV-067 handoff)
Root cause: `master_dictionary.json`'s sole surviving `Smile` row is
tagged `variant/VERIFIED/HIGH`, but its notes explicitly flag its status
*relative to* the actually-confirmed word (`Ka·dingsmita`, under the
separate `To smile` key) as unconfirmed. `pickPrimary()`'s
master-preference branch can't distinguish that free-text caveat from a
genuinely-confirmed variant row of identical tag shape — `table`'s
master row carries the exact same bare `variant/VERIFIED/HIGH` tag but
*is* the confirmed value. A first attempt at a generic `isVariant`-aware
fix to `pickPrimary` regressed the table/buy/door SUPERSEDED-precedence
tests and was reverted before shipping (confirmed via `git diff`
byte-identical revert). Landed instead on a narrow, in-pattern
`grammarOverrides` entry — `'smile': 'Ka·dingsmita'` — the same
mechanism already used for the `right (direction)/(matching)/(correct)`
3-way split. `compiled_dict.json` diff confirmed exactly one key
changed. Commit `c071f73`.

### Fix 2 — `getCategories()`/`getByCategory()` dormancy
Root cause: `getAllVocabulary()` built every entry from
`compiled_dict.json`, whose values are plain Garo strings with no
category field at all — every entry fell through to the
`'uncategorized'` default. Real per-word category data existed the
whole time in `category_index.json` (built separately by
`prepare-data.js` from `master_dictionary.json`'s own `category` field)
and was already being consulted as a fallback by the default-export
wrapper's `getAllCategories()`/`getCategoryVocabulary()` — but never by
these two raw named exports themselves. Fixed by having
`getAllVocabulary()` fall back to `CATEGORY_INDEX[english]` — pure
wiring gap, no new data added or guessed. Now returns 25 real
categories instead of just `['uncategorized']`. Added 3 regression
tests. Commit `bb98c97`.

### Fix 3 — `"she has three children"` drops the number/classifier
Root cause: `grammarEngine.js`'s object-extraction loop
(`analyzeGrammar`) went straight from a failed full-phrase lookup
(`"three children"`) to a bare `lastWord` lookup (`"children"` →
`"Bi·sarang"`), discarding any leading number word entirely — even
though `garo_classifier.js`'s `countNoun()`/`parseCountingPhrase()`
already correctly handle exactly this pattern on their own. The two
systems (`translationEngine.js`'s own step 1.6 classifier-counting
check, and `grammarEngine.js`'s object loop) were simply never wired
together for the in-sentence-object case. Fixed by trying
`parseCountingPhrase()` + `countNoun()` first in the object loop, but
**only** when no existing full-phrase lookup already succeeds — so it
can never silently override an existing dictionary/phrase-map entry.
This surfaced Fix 5 below while testing. Added 3 regression tests.
Commit `2fcfca4`.

### Fix 4 — Build gate silently skipped 3 of 6 unit test files
`npm run build` hardcoded exactly 3 test files
(`translationEngine.test.js`, `claude-d-preflight.test.js`,
`item2-normalization.test.js`) to `node --test`, while `npm test`
already used the glob `tests/unit/*.test.js`. Three files added since —
`number_engine.test.js`, `rc037_bird_classifier.test.js`,
`rong_classifier.test.js` (33 tests) — were never added to the
hardcoded build-gate list, so a regression in any of them could ship
through `npm run build` undetected. Verified all 3 previously-excluded
files passed standalone *before* making the change (so the fix
wouldn't newly block the build on a pre-existing failure), then
switched the build script to the same glob `npm test` already uses.
Commit `535d4b4`.

### Fix 5 — NEW, systemic `"<number> <noun>"` classifier-phrase corruption, all categories
Not in the original backlog — surfaced while fixing item 3 and
confirmed in-session by the Project Owner with explicit reference
values: `two dogs`=`achak mang·gni`, `three dogs`=`achak mang·gittam`,
`four dogs`=`achak mang·bri`. Audited all 884 `"<number> <noun>"`
entries across `master_dictionary.json` + `garo_dictionary.json`
against `garo_classifier.js`'s own already-native-speaker-confirmed
classifier-composition system (see that file's header — mang/sak/king/
gong/jol/ge/rong/pang/dot, each independently confirmed) and found 413
mismatches spanning **every** classifier category, not just animals —
`sak` (person/teacher/student), `king` (book), `gong` (coin/money),
`rong` (fruit), `pang` (tree). Root cause: these are hand-authored
literal phrases (OCR imports, early manual entries), stored and merged
the same as any other headword, completely independent of the
classifier engine that could derive them correctly.
`RC-CANDIDATE-037` (2026-08-07 session) had only fixed the **noun**
substitution for a subset (dog/cat), never re-verified the classifier
**suffix** against the actual count — `"three dogs"` was still silently
wrong (`mang·gni`, the suffix for TWO) even after that fix, just with
the right noun.

Rather than hand-patch ~400 individual records (a one-time fix that
wouldn't prevent tomorrow's OCR import from reintroducing the same
class of error), added a **build-time self-correction pass** to
`prepare-data.js`: every `"<number> <noun>"` `compiled_dict.json` entry
is now re-derived fresh from the noun's own canonical (post-merge)
dictionary entry + its classifier category + the count, at every
build — overwriting whatever stale literal value the source data had.
Deliberately conservative to add zero new guessed linguistic data:
only fires when (a) the noun has an **explicit** `CLASSIFIER_MAP` entry
(never the `ge` catch-all as a blind guess for an unmapped noun) and
(b) the bare singular noun already has its own finalized dictionary
entry (so every phrase uses the exact same noun spelling any other
lookup of that noun would return — this also fixed a related
inconsistency where `"two birds"` used a different bird-word spelling
than a bare `"bird"` lookup would). Never invents new keys, only
corrects existing ones. **215 entries corrected** on this build.

Updated 2 tests whose hardcoded expectations were themselves stale
(`rc037_bird_classifier.test.js` had `"three dogs"`→`"achak mang·gni"`
hardcoded, i.e. was asserting the pre-fix bug value; also updated its
`"two birds"`/`"two cat"` expectations to the now-consistent canonical
noun spellings). Added 1 new regression test spanning multiple
classifier categories. Commit `8d2a400`.

### Workstate doc sync
Commit `0ddd84a`: updated `.ai/WORKSTATE.yaml` (`claude_b.current_task`
full summary, `claude_b_prior` rotation, `repository.head`/
`last_updated`/`test_status`) and `.ai/SESSION_BOOTSTRAP.md` (new
"Current joint work package" entry + 2 new "Do not repeat" entries).
Verified the spliced YAML parses correctly and that every section
outside `claude_b`/`claude_b_prior`/`repository.head`/
`repository.last_updated*`/`repository.test_status` is byte-identical
to before this edit.

## 4. Runtime Verification

- **Unit tests:** `npm test` (all 6 files in `tests/unit/`) —
  **203/203 passing** (up from 196 at session start: +3 children-
  classifier regression tests, +1 counting-phrase-engine regression
  test, +1 net after updating 2 stale RC-CANDIDATE-037 expectations
  that were themselves asserting bug values).
- **Build gate (`npm run build`):** `prepare-data.js` →
  `test-dictionary.js` → `repository-intelligence.js` → full unit
  suite (now genuinely all 6 files, closing Fix 4) → `vite build`.
  **All stages pass.**
- **`prepare-data.js`:** 8061/8061 unique entries compiled (unchanged
  count — Fixes 1/5 corrected existing values, added/removed zero
  keys). 215 counting-phrase corrections logged this build (Fix 5),
  788 bare-infinitive aliases (unchanged from prior sessions).
- **`eslint` (`npm run lint`):** clean, 0 errors, 0 warnings
  (`--max-warnings 0`), checked after every fix individually, not just
  at the end.
- **No `master_dictionary.json`/`garo_dictionary.json`/
  `corrections.json` edits this session** — all 5 fixes are pure
  engineering (`grammarOverrides` entry, `CATEGORY_INDEX` fallback,
  classifier-engine wiring, build-script glob, build-time
  self-correction pass), none of them hand-editing linguistic source
  data directly. This was a deliberate scope boundary, not an
  oversight — Fix 5 in particular could have been "fixed" faster by
  directly editing ~400 JSON rows, but that would have been a
  one-time patch of a self-inflicted engineering gap, not the right
  place to draw the Claude A/Claude B line.

## 5. Commits Created (this session, `4ee8f14..HEAD`)

| Commit | Summary |
|---|---|
| `c071f73` | Fix `compiled_dict.json['smile']` shipping unconfirmed variant (NV-067 follow-up) |
| `bb98c97` | Fix `getCategories()`/`getByCategory()` always returning only `'uncategorized'` (P1 #2) |
| `2fcfca4` | Fix `'she has three children'` silently dropping number/classifier (P1 #3) |
| `535d4b4` | Fix build gate silently skipping 3 of 6 unit test files (P1 #4) |
| `8d2a400` | Systemically fix stale/wrong `'<number> <noun>'` classifier phrases, all categories |
| `0ddd84a` | Sync `.ai/WORKSTATE.yaml` + `.ai/SESSION_BOOTSTRAP.md` after P1 backlog closure session |

(Note: origin also advanced `4ee8f14..1aad3fe` — 6 commits — before this
session's own work started, all Claude A's NV-067/068/069 cluster. This
session's work is layered on top of that, not instead of it; see
`git log` for the full combined history.)

## 6. Outstanding Engineering Backlog

Everything from the `2026-08-08` migration doc's P1 list is now closed.
Carrying forward P2/P3 unchanged (none touched this session — all
require Claude A's linguistic judgment, not re-actioned without native
input):

### P2 — Engineering improvements (linguistic judgment required)
1. **`phrase_maps.js` — 112 more stale-vs-SUPERSEDED entries**, same
   shape as the already-fixed book/table/buy/door, but most have
   multiple ambiguous alternatives requiring real linguistic judgment.
   Untouched.
2. **RC-CANDIDATE-038 review** — 101 `corrections.json`/
   `phrase_maps.js` vs `compiled_dict.json` disagreements, allowlisted
   pending a dedicated Claude A review pass. Untouched this session.
3. **`do·omok` (goat, alternate form)** — flagged `SUPERSEDED`, noted
   as possibly still a valid register/dialect variant. Claude A's
   call. Untouched.

### P3 — Technical debt / dormant code / future architecture
4. **Item 2's own scope boundary** (near-duplicate detection is
   import/promotion-time only against `master_dictionary.json`, not
   `corrections.json`/`phrase_maps.js`) — flagged for awareness in the
   prior migration doc, not actioned, still not actioned.
5. **Item 1** (`promote-lexicon.js` promotion-time re-check) — built
   and verified in a prior session, still holding, no new issues found.

### New this session, not yet actioned
6. **This session's Fix 5 counting-phrase self-correction only fires
   for nouns with an explicit `CLASSIFIER_MAP` entry.** 452 of the 884
   audited `"<number> <noun>"` entries had no classifier mapping at
   all and were left untouched (not silently guessed at with the `ge`
   fallback). Worth a future pass to see whether any of those 452
   nouns should be added to `CLASSIFIER_MAP` — that's a linguistic
   call (which classifier category a given noun belongs to), not
   something to infer mechanically.

## 7. Runtime Handoff

This session touched: `prepare-data.js` (grammarOverrides entry +
counting-phrase self-correction pass), `src/translationEngine.js`
(`getAllVocabulary()` category fallback), `src/grammarEngine.js`
(object-loop classifier wiring), `package.json` (build script glob),
`tests/unit/translationEngine.test.js` (+7 new tests, 1 updated),
`tests/unit/rc037_bird_classifier.test.js` (2 stale expectations
corrected), `src/compiled_dict.json` + `src/compiled_dict_alternates.json`
(regenerated, 216 total key-value changes: 1 from Fix 1, 215 from Fix
5), and the two `.ai/` workstate docs. No
`master_dictionary.json`/`garo_dictionary.json`/`corrections.json`
edits.

## 8. Exact Resume Protocol

1. Start a new conversation, paste this document in.
2. `git fetch origin`; confirm `HEAD == origin/main`.
3. Re-sync with actual repo state before doing anything — don't assume
   nothing changed since this doc was written.
4. Pick from the backlog above: the `phrase_maps.js` 112-entry review
   or `RC-CANDIDATE-038`'s 101-key review (both P2, need Claude A's
   linguistic judgment throughout — not something Claude B should
   resolve solo), the `do·omok` register-variant question (Claude A's
   call), or item 6 above (auditing the 452 unmapped-classifier nouns —
   also linguistic judgment, Claude B can surface the candidate list
   mechanically but shouldn't assign classifier categories unilaterally).

## Repository status at close

- HEAD: `0ddd84a` (before this doc's own commit)
- `origin/main`: to be pushed this session
- `git status`: clean (confirmed after this doc is committed and pushed)
- `.ai/WORKSTATE.yaml`: updated (`claude_b` current session summary,
  `repository.head` = `8d2a400`)
- `.ai/SESSION_BOOTSTRAP.md`: updated (new joint-work-package entry +
  2 new do-not-repeat entries)
- This migration document: complete
- 203/203 unit tests passing, `npm run build` clean end-to-end, lint
  clean
- Blocker status: none. All P1 items closed. P2/P3 remain, all
  requiring Claude A's linguistic judgment.
