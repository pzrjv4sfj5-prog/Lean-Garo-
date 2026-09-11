# Claude B Session Migration — 2026-09-11 (session close, zero-runtime)

## Project identity
Lean-Garo: English→Garo translation engine (`src/translationEngine.js`,
`src/garo_classifier.js`, `src/grammarEngine.js`, `src/number_engine.js`,
dictionary-driven via `master_dictionary.json` → `src/compiled_dict.json`).
Claude B's role: consume Master Dictionary / Owner-approved contract data,
implement runtime lookup + composition + tests. Never invent or adjudicate
Garo vocabulary or surface forms — that's Claude A / Project Owner.

## Current state
- HEAD == origin/main == `796e427`, clean tree, fully pushed.
- Full gate, run fresh at this HEAD before writing this doc:
  - `repository-intelligence.js`: 0 new violations (all 8 checks; 67
    known/allowlisted mismatches, 9 report-only raka-locality candidates,
    unchanged).
  - `scripts/resync-stale-overrides.mjs`: 0 resync candidates.
  - `scripts/runtime-error-sweep.mjs`: 0 errors across 14,972
    `translate()` calls.
  - `node --test tests/unit/*.test.js`: **379/379 pass**.
  - `master_dictionary.json`: 10,180 rows. `compiled_dict.json`: 8,363
    entries.
- No code or data changed in the writing of this doc (zero-runtime close,
  per Owner instruction).

## What shipped this session (5 commits, all on `main`, all tested+pushed)
1. `cf06844` — bare-digit tens words (30–90) were missing from
   `NUMBER_WORDS`; "forty one students" etc. silently fell to the wrong
   fallback method. Fixed for the word-form case.
2. `acd9816` — mapped mountain/village/banana/banana-bunch/car classifiers
   (`dot`/`dam`/`ge`/`akka`/`bol`) per the Owner's pushed contract file +
   live chat confirmation for each.
3. `e40f17e` — bare **digit** numbers ("41" alone) were never routed to
   the number engine at all, fell through to fuzzy-matching the
   dictionary's "1" key → returned just "sa". Fixed via a new digit-only
   branch calling `number_engine.js` directly. Also mapped `road`→`dil`
   (Owner directive, overriding the contract file's `roa`) and the `sak`
   (human) 20–99 surface form ("Chattro saksotbri sa") for n<100.
4. `9627230` — the `sak` 20–99 fix from commit 3 only lived in the <100
   code path; `buildLargeClassifierPhrase`'s 100+ remainder branch still
   shipped the old form (`141 students` was still wrong). Refactored both
   call sites onto one shared `classifierTail()` helper.
5. `e7c54cf` — `kg`/`litre`/`plate` measurement-unit recognition (this was
   a genuine silent-drop bug, not just a missing mapping: `3 kg rice` had
   been confidently shipping `mi ge·gittam`, discarding "kg" without a
   trace). Also water/egg→`rong`, and `se`(tools) mapped defensively
   (dictionary gap, no noun yet).

One concurrent conflict handled mid-session: Claude A was editing
`src/garo_classifier.js` at the same time (commit 5). Real rebase
conflict, not a fast-forward — resolved by keeping both sides' content in
full (nothing dropped from either), reverified with the full 379-test
suite plus live spot-checks of every fix from both sessions together
before pushing.

## Held / explicitly NOT touched this session, and why
- **`docs/CLAUDE_B_HANDOFF_20260911_number_classifier_runtime.md`
  (Claude A, this session)** — a full linguistic re-audit found the
  contract *data* is clean, but flagged 5 runtime generation bugs. Spot-
  verified all 5 live before writing this doc (byte-for-byte match to
  the handoff's claims); see Open Items below. **Not started** —
  explicit Owner instruction this turn: keep pending for next session.
- **`vegetables` singular/plural dictionary-key mismatch** — found live
  while testing the kg-unit fix (`5 kg vegetables` fails). Root cause
  identified (see Open Items), confirmed pre-existing and unrelated to
  the kg fix itself (`5 vegetables` alone fails identically). Not fixed —
  out of scope for what was asked at the time, not picked back up since.
- **kg/litre/plate/se raka behavior** — no native-confirmed example
  exists anywhere in the repo for any of these four (unlike mountain/
  village/car/banana, which all had explicit Owner-confirmed examples).
  Defaulted to no-raka (majority pattern among existing classifiers),
  clearly flagged in code comments as unverified, not presented as
  settled. Needs native/Owner confirmation, not an engineering guess.
- **Mountain noun spelling** — previously flagged as a possible stale-
  override bug (`corrections.json` ships `a'bri`, `compiled_dict.json`'s
  independently-verified value is `ha·bri`). **CLOSED** — Owner directive
  this session confirmed `a'bri` as correct. No code change needed;
  current shipped value already matches. Not an open item anymore.

## Open items for next session (root cause known where noted)
1. **Claude A's 5-bug handoff — the actionable priority.** Full detail in
   `docs/CLAUDE_B_HANDOFF_20260911_number_classifier_runtime.md`, all
   independently re-verified live at this session's HEAD:
   - Bug 1: `king` missing from `RAKA_CLASSIFIERS` — "7 books" → `kingsni`
     (no dot), should have one per the cited `ki·tap king·sa` form.
   - Bug 2: **partially fixed** — the `sak`-specific 20–99 fix (this
     session) does not generalize to other classifiers. "41 cars" is
     still `gari bolSotbri·sa` (wrong capitalization, spurious dot, no
     space) — same shape the `sak` fix solved, just not applied
     elsewhere yet. Handoff doc recommends confirming the intended
     *default* surface rule with the Owner first (contract only gives a
     worked example for the human/`sak` case, not a general one) before
     generalizing — don't guess a default from one confirmed exception.
   - Bug 3: exact-hundred composition is a **real semantic bug**, not
     just formatting — "100 students" → `chattro ritcha saksa` reads as
     student-hundred-one, not 100; "one hundred dogs" → `achak mang·sa`
     silently drops "hundred" entirely, reads as "one dog".
   - Bug 4: `parseCountingPhrase` has no hundred/thousand word handling
     at all (only digit input and the two-word tens-compound are
     recognized) — root cause of Bug 3 never being reached correctly for
     word-form hundreds.
   - Bug 5: nouns without a pre-seeded literal count row bypass the
     classifier engine entirely, falling to the weaker `sov-assembly`
     path (0.75 confidence, wrong word order, ignores the noun's real
     classifier) — "seven mangoes" → `Sni te·ga·chu`. This is the
     deepest one: it means the classifier system currently only works
     reliably for nouns someone has already tested, not generally.
2. **`vegetables` dictionary-key mismatch.** `compiled_dict.json` only
   has the plural key `vegetables`; `parseCountingPhrase`'s generic
   singularizer (`.replace(/s$/, '')`) produces `vegetable`, which isn't
   a key, so any counted phrase for it fails (`5 vegetables` alone fails
   the same way, confirmed independent of the kg-unit feature). Likely a
   small, generalizable fix (try both singular and plural forms during
   lookup) but not investigated further this session.
3. **`tool`/`tools`** — genuine dictionary gap, no Garo noun exists yet.
   Classifier mapping (`se`) is in place defensively; needs a Master
   Dictionary entry before it can resolve. Not Claude B's lane to invent.
4. **kg/litre/plate/se raka confirmation** — needs a native-confirmed
   example for each before their current no-raka default can be treated
   as settled rather than a guess.

## Standing rules this session operated under (unchanged, reconfirmed)
- Claude B never invents or adjudicates Garo vocabulary/surface forms —
  flag conflicts and unverified assumptions explicitly in code comments
  and in chat, don't silently pick a side.
- Repo writes only on explicit Owner authorization (all commits this
  session were directly requested/confirmed in chat).
- Always re-sync (`git fetch` + inspect, not just pull) before writing OR
  pushing — caught real concurrent drift twice this session, once
  requiring an actual conflict resolution, not just a fast-forward.
- Full regression suite (`node --test tests/unit/*.test.js`) run before
  every commit and again after every rebase against the merged state,
  never just before the local commit.
- One task at a time / small batches — each of the 5 commits this session
  was scoped to a single, independently-testable fix.

## Exact next step
Start with **Claude A's handoff doc** (open item 1 above) — it's the
single largest, most load-bearing gap (Bug 5 especially: the classifier
engine doesn't yet generalize past pre-tested nouns, which undermines
confidence in every other classifier fix shipped so far). Read
`docs/CLAUDE_B_HANDOFF_20260911_number_classifier_runtime.md` in full
first. For Bug 2's generalization, get the Owner's confirmation on the
default (non-`sak`) surface rule before implementing — the handoff doc
explicitly flags this as needing a decision, not a guess. Do not
auto-resume item 2 (vegetables) or item 3 (tool) without checking if the
Owner has a different priority first.

**Resume instructions:** paste this document into a new conversation.
Re-sync against actual `origin/main` first (do not trust this doc's
claimed HEAD blindly) — inspect any commits since `796e427`, run the full
gate before starting new work, and don't re-litigate anything closed
above (mountain noun) unless new evidence appears.
