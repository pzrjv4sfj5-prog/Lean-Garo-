# Claude B Session Migration — 2026-09-25

## Project identity
Lean Garo — English↔Garo translation engine. Repo:
`pzrjv4sfj5-prog/Lean-Garo-`, branch `main`. Claude B's lane is
engineering/runtime. Dictionary/linguistic-content calls are Claude A's
lane — see `.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json` and
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`.

## Current commit / state
*(Note: this section describes state early in the session, before
Addenda 1–4. See "Final state summary" near the end of this doc for
the actual close state and final HEAD.)*
- HEAD at close: **1fa5ca4** (T's direct commit "Restore ma·su as
  canonical cow translation") — this doc's own commit lands on top.
- Working tree clean at close.
- Dictionary: 8902/8902 valid entries. Grammatical corrections: 9/9.
  Unit tests: **460/461** — 1 failure, confirmed pre-existing (see
  below, same root cause as flagged in the prior session's migration
  doc, `docs/CLAUDE_B_SESSION_MIGRATION_20260924B.md`). Runtime-error
  sweep: 0 errors across 15866 `translate()` calls.

## What's done this session
Resumed from `docs/CLAUDE_B_SESSION_MIGRATION_20260924B.md`. That doc's
pinned HEAD was `d399ecf`; `git fetch` showed 2 commits of drift on
`origin/main` since then: `ddae32d` (my own prior session-close, already
accounted for in the migration doc) and `1fa5ca4`, a direct commit by
"T" (not a Claude agent) titled "Restore ma·su as canonical cow
translation".

**Investigated the "cow" regression the prior doc flagged as urgent,
inherited, unresolved** (`where is the cow?` → `Bano [UNKNOWN]
[UNKNOWN]` after `ma·su` was removed dictionary-wide by concurrent
commits, no replacement supplied):

- `1fa5ca4` only edited `garo_dictionary.json` (restored `"cow":
  "ma·su"` there), **not** `master_dictionary.json`, which
  `prepare-data.js` treats as the declared canonical source. On its own
  this looked insufficient to fix the runtime.
- Checked `master_dictionary.json`'s own "cow" row: it holds only
  `"Matchu"`, marked `confidence: "superseded"` with a note from a prior
  Claude A audit (2026-08-01) explicitly saying the VERIFIED/HIGH form
  is `ma·su` and that `Matchu` is "not authoritative for compile." The
  master-side VERIFIED/HIGH `ma·su` row itself was among the rows the
  concurrent dedup commits (`3985059` etc.) deleted from
  `master_dictionary.json`, leaving only the superseded `Matchu` row
  there.
- Because `pickPrimary` in `prepare-data.js` excludes SUPERSEDED
  candidates from master and falls through to other sources when master
  has no live candidate, `garo_dictionary.json`'s restored `ma·su` (from
  `1fa5ca4`) is what actually gets picked up — confirmed by regenerating
  the compiled files fresh (`node prepare-data.js`) and inspecting the
  output directly: `compiled_dict.json['cow'] === 'ma·su'`.
- Regenerated `src/compiled_dict.json` (and the pipeline's
  `docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`,
  `docs/SUPERSEDED_ONLY_KEYS.md`, `src/data/unverified_words.json`
  byproducts) from the current merged sources. This is a pure
  regeneration from existing data — no `master_dictionary.json` or
  `garo_dictionary.json` content edited this session.
- **Verified live** after regeneration:
  - `where is the cow?` → `Bano ma·su`
  - `the cow is big` → `ma·su dal·a`
  - `i saw a cow` → `Anga ma·su·ko Nikaha`
  - `cow` (exact) → `ma·su`
  - `two cows` → `ma·su manggni`
- `tests/unit/question_animal_placeholder.test.js`'s "cow/goat question
  composition is unaffected" regression guard, which expects exactly
  `Bano ma·su`, now passes (was failing at prior session's close).

**Flagged, not touched — dictionary content, Claude A's lane:**
`master_dictionary.json`'s "cow" row is still only the superseded
`Matchu` entry; there is no live VERIFIED/HIGH `ma·su` row in the
canonical source itself. The runtime is currently correct only because
`garo_dictionary.json` (a legacy/secondary source) happens to supply
`ma·su` as a fallback candidate. This is fragile: if `garo_dictionary.json`
is ever deduped or cleaned again without awareness of this dependency,
"cow" breaks a second time with no warning, since `repository-
intelligence.js` has no check for "master's only candidate for a key is
SUPERSEDED and a live value is being sourced entirely from a secondary
file." Recommend Claude A either promote a `ma·su`/VERIFIED/HIGH row
back into `master_dictionary.json` directly (restoring what `3985059`
removed), or explicitly document this fallback dependency somewhere
checked by repository-intelligence.js.

Did not check the other words swept up in the same "remove duplicate
forms" pass beyond `cow`/`ma·su`, since the Project Owner's report named
cow specifically and the prior migration doc's inherited-regression list
only named cow as a live functionality loss. If other animal/vocabulary
entries were similarly affected, that would need a targeted audit (which
words, which forms) — did not attempt to guess which without a citation.

## Open issues (carried forward, unchanged in substance)
- Leading-time-word subject-detection gap (`tomorrow he will go to the
  market`) — content question, not engineering, per prior docs.
- AI-003: multi-word `VERB_LEMMAS` matcher gap — not fixed.
- Claude D's to-prefix canonicalization — still Owner-blocked.
- `VERB_LEMMAS` common-verb coverage gap — not attempted.
- S6.2 pronoun `·ko` adjudication (`us`) — pending Thangseng relay.
- `-de`/`-ara` marker distinction — still uncharacterized.
- `corrections.json` "has three children" bare-subject divergence
  (flagged 2026-09-24B, still Claude A's lane, unresolved).
- **Repository-intelligence.js Check D, PL-0001453** ("Hope" casing
  mismatch between `master_dictionary.json` and `pending_lexicon.json`'s
  promoted record) — same failure as flagged 2026-09-24B, re-confirmed
  still present and still a dictionary-content bookkeeping call, not an
  engineering one. This is the sole unit-test failure at this session's
  close (`repository-intelligence.js exits 0 against current lexical
  data (BACKLOG-006)`).
- **New this session**: `master_dictionary.json`'s "cow" entry is
  superseded-only with no live replacement — see above. Runtime is
  currently correct via `garo_dictionary.json` fallback only.

## Standing rules established / reused this session
- (Reused, not new) `pickPrimary` excludes SUPERSEDED candidates from
  `master_dictionary.json` and falls through to other source files when
  master has no live (non-superseded) candidate for a key — this is
  existing `prepare-data.js` behavior, not something changed this
  session, but worth naming explicitly since it's what made the cow fix
  land without a `master_dictionary.json` edit.
- Full gate before every push: `prepare-data.js` → `test-dictionary.js`
  → `repository-intelligence.js` → `node --test tests/unit/*.test.js`
  → `scripts/runtime-error-sweep.mjs`.
- PAT provided fresh in chat this session, used only to set the git
  remote URL for clone/push, never written to any tracked file.

## Addendum — Project Owner overrode "cow" decision mid-session
After the above was written and pushed, two more direct commits by "T"
landed on `origin/main` (`351c73a` "Restore Matchu as canonical cow
form", plus a batch of "Canonicalize ma·su to Matchu repository-wide"
commits including test-file edits) reversing the `ma·su` conclusion.
Regenerating from that state dropped "cow" from the compiled dictionary
entirely (both remaining candidates matched the already-superseded
value and were filtered out) — flagged directly to the Project Owner in
chat rather than silently pushing a broken build.

**Project Owner confirmed directly in chat: `Matchu` is correct**, to
replace `ma·su` and its compounds repository-wide. Per
`.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json` this is authoritative
without a separate proof gate.

Engineering-side follow-through (data edits here are a direct
transcription of the Project Owner's own repo commits plus the
compounds those commits missed — not an independent linguistic call):
- `master_dictionary.json` "cow" row: promoted from
  `confidence: "superseded"` to `confidence: "verified_high"`, note
  updated to record the 2026-09-25 Project Owner confirmation
  superseding the prior 2026-08-01 audit note (which had favored
  `ma·su`).
- Two compounds the repository-wide commits missed (`garo_dictionary.json`
  and the test files were already updated by "T"; these two live only
  in `master_dictionary.json`): `"cattle": "ma·su mat·ti"` →
  `"Matchu mat·ti"`; `"cow dung"` / `"dung": "ma·su·ke·em·a"` (2 rows)
  → `"Matchu·ke·em·a"`.
- Regenerated `compiled_dict.json` fresh. `"cow"` is no longer in the
  SUPERSEDED-only held list (52, back down from the 53 the broken
  intermediate state produced).
- Full gate re-run clean at this final state: 8902/8902 dictionary,
  9/9 grammatical corrections, 460/461 unit tests (the one failure is
  the pre-existing PL-0001453 "Hope" issue, unchanged, Claude A's
  lane), runtime-error-sweep.mjs 15866/15866 calls 0 errors.
- Verified live: `where is the cow?` → `Bano Matchu`; `cow` → `Matchu`;
  `cattle` → `Matchu mat·ti`; `the cow is big` → `Matchu dal·a`.
- Did **not** touch historical/archival files (`backups/`,
  `docs/migration_logs/`, `audit/segregation/MASTER_SEGREGATION.json`,
  past migration docs other than this one) — those are point-in-time
  records of what was true when written, not live data, and rewriting
  them would falsify the historical record rather than reflect it.

## Addendum 2 — merge with concurrent Claude A session
Push was rejected a second time: a concurrent Claude A session (also
committing as "T", `c7a43f4` etc., timestamped ~13h before the Project
Owner's direct "Matchu is correct" confirmation in this chat) had
independently restored `ma·su` in `master_dictionary.json`'s "Cow" row
and in `src/data/phrase_maps.js`, plus made unrelated fixes (PL-0001453
bookkeeping, new vocab batch, an owner-confirmed "slowly" correction).
Merged cleanly except two conflicts (`.ai/WORKSTATE.yaml` log line,
`compiled_dict.json` — resolved by keeping both log entries and
regenerating, respectively). Re-applied the Project Owner's live
confirmation on top: marked the "Cow"/`ma·su` row `superseded` again
(preserving Claude A's restoration note in the citation trail rather
than deleting it) and fixed `phrase_maps.js`'s hardcoded `'cow':
'ma·su'` to `'Matchu'` — `repository-intelligence.js` Check F caught
this second one directly (compiled_dict vs. phrase_maps mismatch).

Check F also surfaced 6 further NEW mismatches from Claude A's session
(`slowly`, `shade`, `anus`, `litchi`, `profit`, `ankle` — corrections.json
values not reflected in compiled_dict.json) that are **not** cow-related
and not touched here: out of scope for this session and Claude A's own
lane to reconcile.

Gate after the merge: 8916/8916 dictionary (entry count rose with
Claude A's new vocab), 460/461 unit tests (same sole pre-existing
failure), runtime-error-sweep.mjs 0 errors across 15888 calls.
`repository-intelligence.js` still fails on the 6 unrelated new
mismatches above (not on anything cow-related).

## Addendum 3 — sentence-builder check + one more idiom, session close
Checked the 5 new words from Claude A's "Maiba/Mahari/Maisa/Mainaba/
Maikasesa" batch through the sentence builder (Project Owner asked for
this explicitly). All 5 resolve correctly as exact-phrase lookups,
standalone or embedded. Two composition gaps found and **left open**
(grammar-assembly layer issue, not data — flagged, not fixed, given the
size/risk of touching that code without more investigation time):
- `"several"` (Maiba Maiba) is silently dropped when composed into a
  full sentence: `"i have several books"` → `Angao ki·tap donga` (no
  quantifier at all).
- `"for some reason or other"` (Mainaba) breaks when embedded:
  `"he came for some reason or other"` → `Ua [UNKNOWN]·ko re·ba·aha`.
- Both work fine as exact standalone phrases (`"several"` →
  `Maiba Maiba`, `"for some reason or other"` → `Mainaba`).

Also added one native-speaker-confirmed idiom the Project Owner gave
directly in chat: `"the pork meat has a lot of fat"` does not compose
literally (bare composition produced `[UNKNOWN]` x4 before this fix).
Added to `src/data/corrections.json` as an exact-phrase override:
`"the pork meat has a lot of fat": "Wak be·en mit·am bang·a"`
(normalized to the repo's `·` glottal-stop convention per the Project
Owner's own confirmation that `be'en` = `be·en`). The Project Owner
gave a second acceptable form (`Wak be'enan mitim rarasa`) which was
**not** captured anywhere — only one value fits `corrections.json`'s
flat key→value shape, and the Project Owner did not confirm normalized
spelling for `rarasa` (no existing dictionary citation for it) or
resolve which of the two is primary. Flagged as an open item below
rather than guessing.

Gate at this point: 8916/8916 dictionary, 9/9 grammatical corrections,
460/461 unit tests (same sole pre-existing PL-0001453 "Hope" failure,
Claude A's lane, unchanged all session), runtime-error-sweep.mjs
15888/15888 calls, 0 errors. Working tree clean, no drift from origin
at close (`git fetch` confirmed).

## Addendum 4 — deployment check + final full-governance close
Project Owner asked why the Render deployment ("Live:
https://lean-garo.onrender.com" per README) showed as closed.
Diagnosed by reproducing the exact CI/Render build command locally:
`npm ci && npm run build` (which chains `prepare-data.js →
test-dictionary.js → repository-intelligence.js →
resync-stale-overrides.mjs → 461 unit tests → vite build`, all `&&`-
chained, so any single failure kills the whole build). At the time of
this session's earlier addenda, `repository-intelligence.js` was
failing (the PL-0001453 "Hope" issue plus 6 Check-F mismatches from
Claude A's concurrent session) — a plausible cause for a blocked
auto-deploy, since Render deploys are gated on the build succeeding.
Attempted a direct Render MCP check per the Project Owner's request;
the connector's OAuth completion failed (`invalid_client: unknown or
inactive client` — a platform-side connector-setup issue, not
something fixable from this session). Project Owner then confirmed
directly that the deployment is in fact working now.

Final full-governance close, after merging two more rounds of Claude A
drift (fast-forwards only, no conflicts: `fd87e76` bringing in Claude
A's cow-resolution WORKSTATE/migration cleanup and a new Mahajon
vocabulary entry, then `07ec71e` bringing in Claude A's own
"verification only, no runtime errors" addendum) — full gate re-run
clean at final HEAD:
- `node prepare-data.js`: no diff (already current).
- `node test-dictionary.js`: 8917/8917 valid, 9/9 grammatical
  corrections.
- `node repository-intelligence.js`: **PASSED, 0 new violations** —
  the PL-0001453 "Hope" issue and all 6 Check-F mismatches from earlier
  in this session are gone (Claude A resolved them independently; not
  touched by this session).
- `node --test tests/unit/*.test.js`: **461/461 passing** — the one
  standing failure carried across this entire session's prior addenda
  is now clear.
- `node scripts/runtime-error-sweep.mjs`: 15889/15889 calls, 0 errors.
- `npm ci && npm run build`: full production build succeeds end to end
  (vite build included), `dist/` output matches what's already
  committed — nothing to regenerate.

Working tree clean, no drift from `origin/main` at close.

## Final state summary (this session, all addenda)
- **Final HEAD: `07ec71e`** — this doc's own commit lands on top.
- **Final gate: 461/461 unit tests, 8917/8917 dictionary entries,
  repository-intelligence.js PASSED clean, runtime-error-sweep.mjs
  15889/15889 calls 0 errors, full `npm run build` (incl. `vite build`)
  succeeds end to end.**
- "cow" → `Matchu`: settled, Project-Owner-confirmed, survived two
  rounds of concurrent-session merges, stable.
- Idiom `"the pork meat has a lot of fat"` → `Wak be·en mit·am bang·a`:
  added, Project-Owner-confirmed. Second form the Project Owner gave
  (`Wak be'enan mitim rarasa`) still not captured anywhere — unresolved
  normalization, flagged again below.
- Sentence-builder gaps found in the new Maiba/Mahari/Maisa/Mainaba/
  Maikasesa batch: `"several"` dropped when composed; `"for some reason
  or other"` → `[UNKNOWN]` when embedded. **Still open, not fixed.**
- All previously-flagged dictionary-content issues (PL-0001453, the 6
  Check-F mismatches) are now resolved — by Claude A, independently of
  this session.
- Deployment confirmed working by the Project Owner directly; root
  cause of the earlier closure was most likely the now-resolved build-
  blocking `repository-intelligence.js` failures, though this wasn't
  independently confirmed against Render's own logs (connector auth
  failed).

## Exact next step
1. Fix the two sentence-builder composition gaps ("several" dropped;
   "for some reason or other" → `[UNKNOWN]` when embedded) —
   engineering, Claude B's lane, still the top open item.
2. Resolve/store the second pork-fat form, or confirm the first is the
   only one to keep.
3. If Render's connector auth (`invalid_client`) is still broken on
   resume, that's worth a fresh attempt or an Anthropic support report
   — not a repo-side fix.

On resume: treat this doc as ground truth, resync against actual
`origin/main` (`git fetch` + compare, do not assume zero drift —
Claude A has pushed independently multiple times this session), re-run
the full gate fresh, then pick up item 1 above unless the Project Owner
directs otherwise.
