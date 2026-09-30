# Claude B — Session Migration (2026-09-29, full governance)

## Project identity

Lean Garo — an English→Garo translation engine (dictionary + grammar
composition), built and maintained across parallel Claude A/B/C/D sessions
plus direct Project Owner and native-speaker (Thangseng) input. Claude A's
lane is content (dictionary entries, grammar rules, citations). Claude B's
lane is engineering (matching/composition/performance code, tests, gate
tooling). Full role split: `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` and
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`.

## Current state (verified this session, not assumed)

Resumed via a pasted pointer to `docs/CLAUDE_B_SESSION_MIGRATION_20260927B.md`
+ a fresh PAT-cloned repo. That doc's pinned HEAD (`47ddeb9`) was one commit
stale — `3ea6fcb`, the doc's own add-commit — confirmed by diff before
continuing, not assumed clean. Gate at arrival: 8886/8886 dictionary, 9/9
corrections, 0 RI violations, 476/476 unit tests, 15897/15897 sweep calls.

At this doc's close: HEAD `45e822a` (pre-this-doc's-own-commit), verified `== origin/main`,
clean tree. Gate: see final section below.

## What's done this session

1. **`ong·a`/`donga` possession supersession — Owner one-time-exception,
   then convergent merge.** Person reported Claude A was out of tokens and
   directed applying `docs/CLAUDE_B_HANDOFF_20260927_donga_onga_precedence.md`'s
   disposition directly, as a one-time exception to the normal content-lane
   split. Superseded the 36 `<pronoun> ong·a <noun>` possession entries
   (confidence: superseded, notes citing RULE-G7 donga vs RULE-005 ong·a
   copula; `ong·a` copula entries like "it is good" left untouched).
   Commit `855db97`. On push, found Claude A had independently reached the
   *identical* disposition in parallel (`d455686`) — Claude A was not
   actually out of tokens. Resolved by merging honestly rather than
   force-pushing: kept Claude A's version verbatim (their lane; my edit was
   only ever a stand-in for their reported absence), rebuilt all derived
   artifacts fresh rather than trusting either side's compiled output,
   re-ran the full gate post-merge. Both commits are in history, nothing
   silently discarded. Merge commit `2bed05d`.

2. **AI-003 fixed** (logged-not-fixed since 2026-09-23B, per
   `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`). Root cause: `VERB_LEMMAS`
   (`lookupEngine.js`) is built as a single-token set, so every multi-word
   `to X Y...` dictionary headword (609/955, 64%, at last count) was
   invisible to all three consumers, which only ever compared one token at
   a time. Repro: `"it crumbled down"` → `"Ua ka·ma·ko"` — `crumbled`
   matched nothing and was silently dropped; `down` independently matched
   an unrelated `corrections.json` entry (`down`→`Ka·ma`) and shipped
   confidently in its place, with no `[UNKNOWN]` trace of the failure.
   Cutoff decided *before* coding, matching the design already recommended
   in the governance doc: exactly-2-word lemmas only (165 entries — the
   genuine particle-verb shape); 3+ word entries excluded (mostly OCR-gloss
   sentences, not real phrasal verbs — matching them risked coincidental
   n-gram false positives). `be X` lemmas (be able, be angry...) excluded
   as a head word after a semantic diff caught a live regression (below) —
   they're copula+predicate, not particle verbs, and `be` is skipped as an
   auxiliary by every consumer already.
   - `lookupEngine.js`: `MULTI_WORD_VERB_LEMMAS` (Map, lemma → Garo) built
     from `compiledDictRaw`'s `to X Y` keys; `matchMultiWordVerbLemma(w1,
     w2)` checks `w1`'s `-d/-ed/-ing/-ing+e/-s/-es` inflection variants
     against the map.
   - `grammarEngine.js`: wired into the main verb-search loop (finds the
     bigram before falling back to single-token resolution; records which
     index the particle consumed so the object-extraction loop doesn't
     re-use it as a separate object), the NP-subject-coherence check, and
     the going-to-infinitive check.
   - `sentenceBuilder.js`'s SOV-fallback path deliberately **not** touched
     — it already bails honestly to `[UNKNOWN]` rather than shipping a
     wrong guess, which is lower-risk than extending a large, densely-
     commented fallback function blind in one session.
   - Verified with a 486-sentence before/after diff (first 1500-char-plus
     `corrections.json` entries capped at ~486, plus targeted extra cases),
     not just the one repro sentence: 7 outputs changed, all improvements
     (e.g. `"he lays eggs"` → `"Ua Bitchi·chi·a"`, was `[UNKNOWN]`-laced).
     One regression — `"he is going to be surprised"` losing its
     `re·angenga` continuous marker because `be` was matching as a lemma
     head — caught by that diff and fixed pre-commit (excluded `be` as
     head), not shipped and then patched.
   - Tests: `tests/unit/ai003_multiword_verb_lemma.test.js` (+4): map shape
     (all keys exactly 2 words), inflection-variant matching, the exact
     repro sentence, and the NP-subject case.
   - Commit `51ca8d6`. Governance doc's AI-003 row updated to FIXED with
     full detail.

3. **Performance bug found and fixed** — not Owner-directed; person asked
   for a scan of "what's improved" plus a performance/bug check.
   `fuzzyMatch()` (`normalizationEngine.js`) ran an *unbounded* O(n·m)
   Levenshtein comparison against every 6+ character dictionary key for
   any out-of-vocabulary word longer than 5 characters, with no early
   exit and a fresh 2D DP table allocated per key. Live-measured, not
   estimated: a 30-character OOV token took 7.4 seconds; an 11-character
   OOV phrase took 226ms. This is not a rare edge case — it's the default
   behavior for any moderately long unknown word (typos, proper nouns,
   slang, other-language input), which a translation tool sees constantly.
   - `utils.js`: `levenshteinBounded(a, b, max)` — two rolling rows
     instead of a full 2D allocation, plus early exit the moment a row's
     minimum value already exceeds `max`. Contract: returns the exact
     distance when `<= max`, otherwise any value `> max` (callers must
     only compare against the threshold, never rely on the exact value
     above it).
   - `normalizationEngine.js`: added a length-difference pre-filter before
     calling the bounded DP (edit distance can never be smaller than
     `|len(a)-len(b)|`, so keys whose length already differs by more than
     the threshold are skipped without running the DP at all).
   - Proved equivalence rather than only inferring it from the math: ran
     both the old unbounded function and the new bounded one against 240
     mutated/random/real-dictionary-key inputs (160 of which produced a
     fuzzy hit) — 0 output differences, byte-identical accept/reject and
     distance on every case.
   - Result: 30-char OOV token 7388ms → 1.8ms; 11-char OOV phrase 226ms →
     3ms. Old unbounded `levenshtein()` kept in `utils.js` — confirmed no
     other caller — for API/test compatibility only.
   - Tests: `tests/unit/perf_fuzzy_match.test.js` (+4): exact-distance
     correctness at/under threshold, over-threshold behavior, a fast-path
     timing assertion on `fuzzyMatch()` directly, and one end-to-end
     `translate()` timing assertion.
   - Commit `cda2422`.

4. **Two push collisions, both handled the same way**: `git fetch`, rebase
   (not merge, since these were clean linear continuations, not the
   parallel-edit case in item 1), rebuild all derived artifacts fresh
   (`prepare-data.js`), re-run the *full* 5-step gate at the rebased HEAD,
   then push. First: Claude A's session-close (`cda9c17`) landed between
   the AI-003 commit and its push. Second: 5 Claude A commits (RULE-038
   wording fixes, roadmap Phase 0, rule-conformance audit tooling — all
   docs-only, ending `6bf3856`) landed between the perf-fix commit and its
   push. Zero `src/` overlap either time; both rebases were clean
   fast-forwards of my own commit on top.

5. **This close**: updated `.ai/WORKSTATE.yaml` (`claude_b.next_action`,
   prior entry demoted to `next_action_prior_20260927B`) and
   `.ai/SESSION_BOOTSTRAP.md`'s "read this first" pointer block (prior
   content demoted to a new `---PRIOR (2026-09-27C)---` section, history
   preserved, nothing deleted) to point at this doc.

## Open issues (root cause noted where known)

1–3. **Three questions still relayed to Thangseng, still unanswered**,
   unchanged from the prior migration doc: (1) quantity-word-order
   exception, (2) how general the `-rang` plural marker is, (3)
   adjective/adverb position. No new Owner or native input arrived on
   these this session. Content-lane, not touched.

4. **`sentenceBuilder.js`'s SOV-fallback path has no multi-word-verb
   support.** Lower priority now than when first logged (2026-09-23B),
   since the higher-traffic `grammarEngine.js` structured-assembly path
   is now fixed for the same sentence family via AI-003. The fallback
   still behaves safely (bails to `[UNKNOWN]` rather than a wrong guess)
   when it hits an unsupported multi-word verb, so this is a coverage gap,
   not a correctness bug. Root cause: same single-token architecture as
   AI-003, not yet extended to this function. Claude B territory.

5. **AI-003's own tense-suffixing limitation, restated not new**:
   multi-word verbs get the same bare-Garo-form tense handling that
   single-word verbs without a conjugation-table entry already had (no
   special-casing added or needed — confirmed this is pre-existing
   architecture, not a new gap introduced by this fix). If a Garo verb
   form needs a different suffix under future/negative tense than what
   `applyTense`/`applyNegation` currently produce, that's a pre-existing
   linguistic gap across *all* verbs, not specific to multi-word ones.

6. **Issue #6 (punctuation/routing divergence)** from the prior migration
   doc appears already resolved — spot-checked live this session (the
   exact repro pair from that doc now produces identical output with and
   without the trailing period) — but no migration doc records it as
   formally closed, so it's noted here rather than silently assumed fixed
   forever. Not re-investigated further; low priority given it's already
   converged.

## Standing rules this session followed (not re-litigated)

- Content-lane changes require Claude A, an Owner directive, or (this
  session, item 1) an explicit one-time exception — never assumed by
  Claude B on its own reading of evidence.
- Every code change gates on: `prepare-data.js` → `test-dictionary.js` →
  `repository-intelligence.js` → `node --test tests/unit/*.test.js` →
  `scripts/runtime-error-sweep.mjs`, before commit and again after any
  rebase.
- Superseded dictionary entries are retained with a citation-bearing
  `notes` field, never deleted.
- Push collisions: fetch, resync (don't assume nothing changed), rebuild
  derived artifacts fresh rather than trust either side's, re-gate, then
  push. Merge (not rebase) only when both sides independently edited the
  same content and neither should simply be discarded (item 1); rebase
  when one side is a clean linear continuation (item 4).
- A code fix is verified by a before/after diff over a real sample, not
  just the one reported repro sentence, before being trusted as
  regression-free.

## Exact next step

No single mandated next step — the three Thangseng questions remain the
main external blocker on further content work. For engineering, in rough
priority order if picked up again: (a) extend
`sentenceBuilder.js`'s SOV-fallback to the same 2-word verb-lemma matching
AI-003 added elsewhere (item 4 above), or (b) investigate whether AI-003's
≤2-word cutoff should be revisited for a ≤3-word band now that ≤2 is
proven safe in production (would need a fresh false-positive risk review
first, not just widening the number). Neither is blocked on anything.

## Gate confirmation (this session, final state, HEAD `45e822a` (pre-this-doc's-own-commit))

- `prepare-data.js`: 8886 unique entries compiled successfully.
- `test-dictionary.js`: 8886/8886 valid entries, JSON compliance OK.
- `repository-intelligence.js`: PASSED, 0 new violations (8 checks).
- `node --test tests/unit/*.test.js`: 484/484 passing, 0 failing, 0 todo
  (476 carried forward + 4 AI-003 + 4 perf-fix).
- `scripts/runtime-error-sweep.mjs`: 15825/15825 `translate()` calls,
  0 errors.
- Working tree clean, HEAD verified `== origin/main` after push.
