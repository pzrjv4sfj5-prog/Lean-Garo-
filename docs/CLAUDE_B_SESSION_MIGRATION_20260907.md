# Claude B Session Migration — 2026-09-07

## Project identity
Lean-Garo-: Garo-language translation/dictionary engine. Multiple agents
(Claude A, B, C) work concurrently against the same `origin/main`;
standing rule: `git pull`/`git fetch` before every push, rebase (not
merge) on conflicts, regenerate compiled artifacts from merged source
rather than hand-merging generated JSON, never overwrite what's already
on `origin/main`.

## Resync at session start
Cloned fresh (PAT provided live by Project Owner this session, used only
for clone/push, not embedded in any file). Started from `7afc92b`.

## Task this session
Project Owner handed a 9-item engineering handoff
(`docs/HANDOFF_CLAUDE_B_20260906.md`, cross-checked against
`docs/CLAUDE_C_REAUDIT_20260906B.md`) with an explicit priority order,
plus a live bug found afterward around the "very hot today" correction.

## What's done

### Handoff items (priority order given)
1. **`leaf`/`leaves` collision (item 1, HIGH)** — added `-y->-ies` and
   `-f/-fe->-ves` pluralization attempts ahead of the generic `-s` strip
   in `sentenceBuilder.js`'s `assembleSentenceSOV`. Also closed the
   same-family `babies`/`cities` (previously hard `[UNKNOWN]`) and
   `knives` (previously a fuzzy-match accident). Test:
   `tests/unit/plural_morphology_ies_ves.test.js`.
2. **`answer` compiled-level POS tie (item 8)** — `pickPrimary` in
   `prepare-data.js` now prefers, among tied VERIFIED/HIGH candidates,
   whichever matches its own verified `to <key>` infinitive sibling's
   value (the same "to X" bare-verb convention already used elsewhere in
   this codebase). Removed the now-redundant `corrections.json` override
   for `answer`. Test: `tests/unit/answer_pos_tie.test.js`.
3. **`"where is the cat?"` -> `"mang"` bug (item 6)** — root-caused: 36
   unverified, uncited literal phrase-table rows (every
   what/where/when/why/how/who/which/how-many/how-much x
   cat/dog/bird/fish combination) used the generic classifier placeholder
   `mang` instead of the real species noun, intercepting input before it
   ever reached the working `sov-assembly` composition path that animals
   without such a row (cow, goat) already use correctly. Marked all 36
   rows `superseded` (no citation existed to correct them against). Test:
   `tests/unit/question_animal_placeholder.test.js`.
4. **Question-type marking generalization (item 2, HIGH, partial)** —
   `analyzeGrammar`'s aux-inversion recognition (added 2026-08-04 for
   `is/are/was/were`) never covered `did/will/does/do/has/have`, so any
   other aux-inverted polar question fell through to `sov-assembly` with
   no question-marking at all. Widened the same recognition to those six,
   gated on a terminal `?` (to avoid re-capturing an unrelated
   declarative-mood test fixture that happens to start with "did"). Test:
   `tests/unit/polar_question_aux_inversion.test.js`. **Not done**:
   wh-question composition (`"what did he eat?"`) — still blocked on
   Claude A's full paradigm, as the handoff itself noted.
5. **Confidence-schema gap (item 4)** — dictionary-lookup methods
   (phrase-map/exact-phrase/exact-word/stopword-stripped) reported a
   fixed per-method confidence regardless of source verification status
   (`dog`, source row explicitly `unverified`, shipped 0.99). Exported
   `src/data/unverified_words.json` (reusing `pickPrimaryNoVerifiedCandidate`,
   already computed by `prepare-data.js`) and capped these four methods'
   confidence to 0.75 when the resolved key has zero verified evidence.
   Test: `tests/unit/confidence_schema_cap.test.js`.
6. **Elephant cross-layer divergence (item 5) and ball's fuzzy
   false-positive** — explicitly informational/low-priority per the
   handoff; not touched. Elephant's case actually involves a linguistic
   tie-break (NV-089's native-preferred variant vs. pickPrimary's
   case-collision "neutral" tagging) that's Claude A's call, not mine to
   guess at.

### Live bug: "it's/it is very hot (today)"
Investigated first (trace-only, no fix, per explicit instruction pending
Claude A's pattern confirmation) —
`docs/CLAUDE_B_TRACE_INTENSIFIER_ADJECTIVE_20260907.md`. Found TWO
unrelated root causes, not one shared bug:
- Bug A (`grammar-assembly`): the verb-finding loop has no restriction
  against electing a non-verb dictionary word as the finite verb — the
  intensifier "very" has its own real dictionary entry, so `findVerbForm`
  succeeds on it before the loop ever reaches the real predicate
  adjective "hot". Same `findVerbForm`-succeeds-on-any-word gap already
  flagged in a comment a few lines earlier in the same file, never
  applied to this call site.
- Bug B (`sov-assembly`): `"it's"` never resolves to the subject pronoun
  at all (`PRONOUN_MAP` has `"it"` but not `"its"`, and the apostrophe
  gets stripped before the lookup), rerouting the whole sentence to the
  weaker `sov-assembly` fallback, which has no time-adverbial-fronting
  logic.

Once the Project Owner confirmed the native-evidence pattern (already
sitting in `docs/CLAUDE_C_SESSION_MIGRATION_20260906D.md`'s unsent draft:
`"it's very hot today"` = `"Da·alo namen Ding·a"`, time-word +
intensifier + adjective), implemented `tryVeryHotConstruction` in
`grammarEngine.js` — a narrowly-scoped exact construction (same pattern
as the existing `tryPolarQuestionLunchConstruction`/
`tryModalCanConstruction`), **not** a general intensifier-placement rule,
per the citation's own caveat ("don't assume it generalizes on one
example"). Covers the attested sentence plus the directly-implied
no-time-word variant (same adjunct omitted, not a new pattern). Test:
`tests/unit/very_hot_construction.test.js`, including a regression guard
confirming a different adjective ("cold") is NOT swept into the
construction. **Bugs A and B themselves remain unfixed** — they're pure
engineering issues independent of the word-order question, but were not
in scope of what was asked this session; noted as open findings.

### Also fixed while in the area
5 pre-existing test failures inherited from two other sessions'
concurrent native-data work landing mid-session (NV-144's `small [noun]`
word-order flip, NV-145's `leaves`/`leave` resolution) — per Claude A's
explicit handoff in `docs/CLAUDE_A_SESSION_MIGRATION_20260906F.md`
("data is correct, tests are stale"), updated the stale assertions in
`tests/unit/adjective_animal_mang_placeholder.test.js` and
`tests/unit/plural_morphology_ies_ves.test.js` rather than reverting data.

## Concurrent-session handling
`origin/main` moved twice during this session from other agents'
concurrent work:
- Mid-session: session `20260906E` (NV-137–141) landed. Rebased my
  first 5 commits on top; resolved `compiled_dict.json` /
  `PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` conflicts by regenerating via
  `prepare-data.js` from merged source rather than hand-merging JSON;
  re-verified full gate + spot-checked all 5 fixes against the merged
  dataset before pushing.
- Later: session `20260906F` (NV-142–147, including the leaves/leave and
  small-noun changes handled above) landed and was pulled fast-forward
  before starting the "very hot" fix — no conflict that time since I
  fetched before editing.

## Gate results (final, this session's close)
- `node prepare-data.js`: 8257 unique entries, regenerating from
  committed `master_dictionary.json` produces **zero diff** against
  already-committed compiled artifacts (build is reproducible, no
  drift).
- `node test-dictionary.js`: 8257/8257 valid, 9/9 grammatical
  corrections.
- `node repository-intelligence.js`: 0 new violations across all checks.
- `node scripts/resync-stale-overrides.mjs`: 0 new candidates (1
  pre-existing, unrelated `build`/`Rika` skip).
- `node scripts/runtime-error-sweep.mjs`: **14,755 `translate()` calls,
  0 errors** — full compiled_dict key sweep, plural/counted-noun sample,
  structural edge cases, type-safety inputs, full API surface
  (`getAllVocabulary`/`getCategories`/`getByCategory`/`getAlternates`).
- `node --test tests/unit/*.test.js`: **345/345** (was 341 at the
  previous close on `origin/main`; +4 net this session: +6 handoff-item
  tests, +4 very-hot-construction tests, -0 net since 5 stale assertions
  were updated not added/removed as new tests, +1 trace-doc commit added
  no tests).
- `node server.js`: fails locally with `ERR_MODULE_NOT_FOUND: express`
  — confirmed this is only because `node_modules/` was never installed
  in this fresh clone (gitignored, as expected), not a code defect.

## Push and resync
7 commits this session, all pushed, `HEAD` == `origin/main` == `762a20f`
confirmed clean (`git status --short` empty) before this doc was
written.

## Repository status at close
- [x] HEAD hash: verified == `origin/main` == `762a20f`
- [x] `git status` clean, no untracked files
- [x] No local-only commits — pushed and verified
- [x] No uncommitted changes
- [x] This migration doc itself is being committed and pushed as part of
      session close (flagged by Project Owner as missing before this
      commit — no prior local-only migration doc existed for this
      session; it simply hadn't been written yet)

## Exact next step (for next Claude B, or Claude A if noted)
1. **Bug A / Bug B** (`docs/CLAUDE_B_TRACE_INTENSIFIER_ADJECTIVE_20260907.md`)
   are pure engineering fixes, independent of any further native
   evidence, not yet implemented: (a) the verb-finding loop needs the
   same closed-class/POS-safety restriction already applied to
   NP-subject coherence, extended to reject intensifiers as verb
   candidates; (b) `"it's"`/`"he's"`/`"she's"`/etc. contractions need
   expansion or PRONOUN_MAP awareness before subject matching, careful
   to not collide with the possessive `'s`.
2. Item 3 in the "very hot" writeup — whether the time-word +
   intensifier + adjective ordering generalizes beyond this one sentence
   — is explicitly still open per Project Owner instruction ("confirm
   with Thangseng... don't assume it generalizes on one example").
3. Elephant's NV-089 native-preferred-variant vs. pickPrimary
   case-collision tie (flagged, not fixed, item 5 in the original
   handoff) — Claude A's call.
4. `ball`'s fuzzy false-positive (also flagged low-priority in the
   handoff) — not investigated this session.
