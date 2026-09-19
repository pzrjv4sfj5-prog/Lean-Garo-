# Claude B Session Migration — 2026-09-20

## §1 — Project identity
Lean Garo: English↔Garo translation platform. Node/Vite/React frontend,
Express `server.js` serving `dist/`. Dictionary lives in
`master_dictionary.json` (source of truth, 8813 entries) → compiled by
`prepare-data.js` into `src/compiled_dict.json` (runtime-consumed).
Translation logic: `src/grammarEngine.js` (parsing/analysis) →
`src/sentenceBuilder.js` (assembly) → `src/translationEngine.js`
(orchestration/cascade), with `src/data/corrections.json` as an
exact-match override layer checked before grammar-assembly.

Multiple Claude sessions (A, B, C, D...) work this repo over time,
each with a distinct role. Claude B's role this session was confirmed
explicitly by the Project Owner as: **highly engineering** — ensure
the pipeline functions correctly, find and fix bugs, audit the repo.
Not a linguistic-content role: Garo-form decisions (which of two
attested words is "correct") are Claude A/Owner's call, not Claude
B's, and this session held that line even when it cost a completed
fix (see §4).

## §2 — Current state
- **HEAD**: `6eea3aa9ae72360a91f9298121e9de2c8fb70ce4`, pushed to
  `origin/main`, confirmed synced (no fetch drift at time of writing).
- **Working tree**: clean, nothing staged or pending.
- **Gate** (all 5 steps, re-run and verified immediately before this
  doc): `node prepare-data.js` exit 0 (8813/8813 valid) →
  `node test-dictionary.js` exit 0 (8813/8813 valid, 9/9 grammatical
  corrections) → `node repository-intelligence.js` exit 0 (6
  known/allowlisted issues, **0 new violations**, 0 pending-lexicon
  problems, 0 confidence-schema problems) →
  `node scripts/resync-stale-overrides.mjs` exit 0 (0 resync
  candidates) → `node --test tests/unit/*.test.js` exit 0
  (**441/441 pass**).
- **Full build**: `npm run build` exit 0 (all of the above plus
  `vite build` — 62 modules, dist output clean, only a non-blocking
  chunk-size advisory).
- **Lint**: `eslint . --ext js,jsx --max-warnings 0` — **9
  pre-existing errors** (`no-unused-vars`), all in `prepare-data.js`
  and `src/research/*.js`, none in files touched this or last
  session, not part of the `build`/`test` scripts. Not introduced
  this session; flagged, not fixed (out of scope for tonight, no
  functional impact — build/tests both pass regardless).
- **Runtime smoke test**: `node server.js` boots clean on port 3001,
  serves `GET /` → HTTP 200, no console errors.

## §3 — Done this session
1. **`corrections.json`**: added `"i will marry her": "Anga uko
   kimgen"` — Thangseng-confirmed correction of the live bug where
   `translate()` silently dropped the object ("Anga kim·gen").
   Verified live via `translate()`, method=correction, confidence=1.
   Commit `35e7fcd`.
2. **`sentenceBuilder.js`**: fixed a double accusative-marker bug.
   `"i will help me"` was producing `"Anga angko·ko dakchakgen"` —
   "Angko" (VERIFIED/HIGH as the complete object form of anga/"me",
   two independent citations on record) was getting a redundant
   second `·ko` appended, because the marker-application code was
   unconditional for every resolved object. Fix is scoped to the
   exact case with citation evidence (`garo === 'Angko'` skips the
   marker); `him`/`us`/`them` (`Bichi`/`Chingna`/`Uamangna`) are
   byte-for-byte unchanged — verified directly, not just by the test
   suite. Commit `6eea3aa`.
3. Re-verified the full 5-step gate from scratch at the start of this
   session (not trusted from the prior doc) before any edits, per the
   resume protocol — caught nothing new, established a clean
   baseline.
4. Full `npm run build` + lint + server smoke test, beyond the
   standing 5-step gate, per this session's explicit "no runtime
   errors" instruction.

## §4 — Held / found-not-fixed, with root cause
1. **`"her"`/`"it"` as sentence-final object pronouns silently
   vanish.** Systemic — confirmed across arbitrary transitive verbs,
   not just "marry" (e.g. `"i will help her"` → `"Anga dakchakgen"`,
   object gone, confidence unchanged at 0.82, no `[UNKNOWN]` trace).
   Root cause: `grammarEngine.js`'s object-extraction loop
   unconditionally skips any word matching `POSSESSIVES` or
   `STOP_WORDS`, with no disambiguation between "her" the possessive
   determiner ("her book") vs. the object pronoun ("marry her"), or
   "it" the demonstrative vs. the object pronoun ("help it").
   - Attempted a scoped fix (sentence-final position + verb already
     resolved, gating out all the existing correct skip cases). All
     441 tests still passed. But live-verification exposed a second,
     independent pre-existing bug: `phrase_maps.js` has bare entries
     `'his': 'Uni'` and `'her': 'Uni'` mapping the lookup key to the
     **possessive** sense with no accusative counterpart — so the fix
     produced a confidently *wrong* translation
     (`"Anga Uni uni·ko dakchakgen"`) instead of the honest
     `[UNKNOWN]` intended. **Reverted cleanly** (`git diff` empty,
     re-confirmed) rather than ship a regression that looks like a
     real translation. Not currently touched on disk.
   - Separately found while investigating: `master_dictionary.json`
     already contains a full, unused "Bi-" pronoun case paradigm —
     `"to him"` → `Bichi`, `"him or her (accusative case)"` → `Biko`,
     `"to him or her"` → `Bina`, `"with him or her"` → `Bimung`,
     `"his or her (possessive case)"` → `Bini` (around line 77389).
     None of these entries carry a `confidence` field (an older,
     pre-confidence-tagging import batch) and none are wired into any
     runtime code path. `Biko` is a plausible general accusative
     candidate for "her"/"him" — but it uses a completely different
     pronoun root than Thangseng's direct citation `uko` (an Ua+ko
     contraction) for the one marry sentence already in
     `corrections.json`. **Two real candidate forms, disagreeing in
     root, neither generalized. This needs Claude A/Owner
     adjudication** — same category of decision as the recent
     he/Ua-Bia synonym resolution, not an engineering call.
2. **`him`/`us`/`them` as objects** (`Bichi`/`Chingna`/`Uamangna`)
   also receive an unconditional `·ko` suffix in `sentenceBuilder.js`
   (same code as the fixed `angko` case). Left untouched deliberately:
   no citation on record establishing whether these dative-looking
   stems should also skip the marker, or whether the suffixed form is
   itself the correct/attested one. Flagging, not fixing.
3. **PAT reuse without rotation.** The token pasted this session
   (`pat_11CDWG5UI0ID...`, missing the `github_` prefix, reconstructed
   to push) shares its full body with the token pasted last session
   and the one before that (traced back to `20260909`/`20260910`
   migration docs, already flagged there as compromised/unrotated).
   Same token, third reuse, still not rotated. Used only for
   `git push` via `remote set-url`, never persisted — remote URL
   scrubbed back to plain `https://github.com/...` immediately after
   push, confirmed via `git remote -v` and a grep for `github_pat_`/
   `pat_` across the working tree and `.git/config` (only matches are
   the literal placeholder strings in prior migration docs, not the
   real token). **Recommend rotating this token before it's pasted a
   fourth time.**

## §5 — Standing rules established (carried forward, still in force)
- Claude B's role is engineering-only: fix bugs in code/pipeline
  logic; never unilaterally decide which of two attested Garo forms
  is correct — that's Claude A/Owner's call, flag and hold instead.
- A "found-not-fixed" item gets the same rigor as a fix: live-repro,
  root cause identified, exact code location, citation status of any
  candidate — not just "seems off."
- If a scoped fix, once live-verified, produces a worse failure mode
  than what it replaced (e.g. confidently wrong vs. honestly
  incomplete), revert cleanly rather than ship it, even if it passes
  the existing automated test suite. The suite doesn't cover
  everything (see §4.1 — zero tests exercised `"i will help me"`
  before this session).
- PATs are session-scoped only: set via `remote set-url` for the
  push, then the remote is immediately reset to the plain HTTPS URL,
  confirmed clean before the session reports done. Never committed,
  never left in `.git/config` past the push.
- Resume protocol: re-verify the gate from scratch against actual
  `origin/main` HEAD before trusting a prior migration doc's reported
  state — this session did, and found 3 commits of drift (Claude A's
  unrelated P24/P25 close) beyond what the prior doc showed.

## §6 — Exact next step
Two independent, well-scoped threads, either can be picked up first:

1. **Content adjudication needed** (§4.1): decide between `Biko`
   (existing unused Bi-paradigm, un-confidence-tagged) and `uko`
   (Ua-root, Thangseng-cited for one sentence) as the general
   accusative form for "her"/"it" objects, and get "it" a citation at
   all (currently zero candidates in the dictionary for "it" as
   object). Once decided, the `grammarEngine.js` object-loop fix
   drafted and reverted this session can be reinstated using whichever
   form is confirmed, re-verified against phrase_maps.js interaction
   before shipping.
2. **Engineering-only, no content decision required**: audit whether
   `him`/`us`/`them`'s `·ko` suffixing (§4.2) is itself a bug, by
   searching for any existing native-confirmed sentence containing
   one of `"Bichi·ko"`, `"Chingna·ko"`, `"Uamangna·ko"` as attested
   correct output (vs. this session's `angko` case, where the
   citation explicitly said the *unsuffixed* form was correct). If no
   citation either way exists for these three, this stays held.
3. Pre-existing (never reached this session): the recurring
   `pos`-as-array pipeline bug and the 4 sentence-building gaps
   (`estrange`+object, `skin`+"animal", `"wall"` as subject/object,
   `"crumbled down"` past-tense-with-adverbial) noted in the prior
   migration doc, still open.

---
Start a new conversation and paste this document in. On resume: fetch
`origin/main`, confirm HEAD matches `6eea3aa` (or note what's changed
since), re-run the 5-step gate before touching anything, then
continue — don't re-litigate §5's standing rules or re-relitigate the
`Biko`/`uko`/reverted-fix history in §4.1 without new evidence.
