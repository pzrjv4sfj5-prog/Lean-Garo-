# Claude B Session Migration — 2026-09-12

## Role of Claude B in this repo (read this first)
Lean-Garo is an English→Garo translation engine. Two linguistic/engineering
roles work on it, deliberately separated:

- **Claude A** — linguistic authority. Master Dictionary correctness,
  category/classifier adjudication, native-speaker liaison (Thangseng
  relay), deciding what a Garo word or surface form actually *is*.
- **Claude B (this role)** — runtime engineer. Consumes whatever Claude A
  / the Project Owner has approved (`master_dictionary.json` →
  `src/compiled_dict.json`, plus any Owner-pushed "machine-ready" contract
  files) and implements it: parsing (`src/grammarEngine.js`), lookup
  routing and number/classifier composition (`src/translationEngine.js`,
  `src/garo_classifier.js`, `src/number_engine.js`), and the test suite
  (`tests/unit/*.test.js`).

**What Claude B does NOT do:** invent a Garo word, guess a spelling, or
decide a surface-form rule (raka-dot placement, fused-vs-spaced, which
classifier a noun takes) without either an explicit Owner-confirmed
example or an existing dictionary/contract citation. When evidence is
missing or conflicting, the discipline is to flag it in code comments and
in chat and default conservatively (documented as unverified) — not to
silently pick an answer. Several open items below are exactly this kind
of flag, left for Claude A / the Owner to resolve.

**Operational rules Claude B follows every session:**
- Every repo *write* (commit) requires explicit Owner authorization in
  chat first — a described bug + "fix it" counts; silent assumption does
  not.
- Every *push* uses a GitHub PAT the Owner provides fresh in-chat each
  session (not persisted anywhere in this repo or environment) — per the
  Owner's own stated practice. Each pasted PAT is flagged once for
  rotation, since anything typed in chat is retained in conversation
  logs; this is the Owner's operational choice to make, not something
  Claude B can enforce further.
- Always `git fetch` + actually inspect what changed before writing OR
  pushing — never assume the locally-remembered HEAD is still current.
  Concurrent commits from Claude A (or direct Owner pushes) have landed
  mid-session multiple times; real rebase conflicts have happened at
  least once and were resolved keeping both sides' content, never by
  force-overwriting.
- Full gate (`node --test tests/unit/*.test.js`, `node
  repository-intelligence.js`, `node scripts/resync-stale-overrides.mjs`,
  `node scripts/runtime-error-sweep.mjs`) run before every commit and
  again after every merge/rebase against the actually-merged state.
- Small, single-purpose commits over one large batch, so any later
  problem is easy to bisect to a specific change.

## Current state
- HEAD == origin/main == `3ba97c3` **before** this session's own commit
  (see below for what this session adds on top).
- Full gate re-run fresh at `3ba97c3` before writing this doc:
  - `node --test tests/unit/*.test.js`: **1 failure found** —
    `tests/unit/rong_classifier.test.js:43` still asserted the pre-fix
    `'ki·tap kinggittam'` (no raka), stale against the same-day direct
    Owner/Claude-A-resolved fix (commit `3ba97c3`, `king` added to
    `RAKA_CLASSIFIERS`). Fixed as a one-line test-oracle update (matches
    already-shipped code, not a new decision) — see this session's commit.
    379/379 after the fix.
  - `repository-intelligence.js`: 0 new violations.
  - `resync-stale-overrides.mjs`: 0 candidates.
  - `master_dictionary.json`: 10,178 rows (down from 10,180 — Claude A's
    concurrent session deleted 2 unverified/unprovenanced entries,
    `gnisan` and `Kolgrik·sa`, per Owner directive).

## What happened since the last Claude B close (`841eb06`)
All of this was **Claude A's / the Owner's work, not Claude B's** —
reviewed and verified here, not redone:
1. `b5c4c7d` — drafted (not yet sent) a Thangseng relay question covering
   10 verified-tie words + a fever/suffer possible-homograph flag.
2. `b420b86` — deleted `gnisan` ("two", unverified, unresolved relay
   context) and `Kolgrik·sa` ("twenty-one", unverified, zero provenance)
   from `master_dictionary.json`/`final_entries.json`/`garo_dictionary.json`,
   per Owner directive. **Side effect, live-verified by Claude A:**
   hyphenated `"twenty-one"` had been silently resolving to the now-
   deleted wrong value at 0.75 confidence; now correctly falls through to
   the same value spaced `"twenty one"` gives, via compound-split at 0.6.
3. `7b649d9`/`7bf7823`/`8540677`/`c94c43c` — Claude A session
   `20260911B`: delivered the full 1–100 number table + 16-classifier
   breakdown to the Owner (no repo change), found `sak` is *also* missing
   from `RAKA_CLASSIFIERS` (addendum to Bug 1 in the handoff doc below,
   citing existing verified rows `mande sak·sa`/`sak·ki`) — **flagged
   only, `garo_classifier.js` deliberately not touched** pending Claude B.
4. `8a12eca` — Claude A resolved some of the open classifier questions:
   `ge`/`te` raka status confirmed; the tens+units space-vs-dot rule
   already settled; `sak` 40+ generalization explicitly **left open**.
5. `3ba97c3` — direct 1-line fix (by "T", the Owner's own account): `king`
   added to `RAKA_CLASSIFIERS`, closing Bug 1's `king` half. `sak`'s half
   of the same bug is still open (see above).

## This session's own work (Claude B)
- Verified the new PAT has push access.
- Found and fixed the stale test-oracle (`rong_classifier.test.js`) left
  behind by the concurrent `king` fix — 379/379 restored.
- Wrote this migration doc + the role section requested by the Owner.
- **No other runtime work done this turn** — reviewing state and closing
  out, not picking up new fixes, per how this turn was scoped.

## Open items carried forward (unchanged in substance, restated with current evidence)
Full detail in `docs/CLAUDE_B_HANDOFF_20260911_number_classifier_runtime.md`
(now updated by Claude A to cover both `king`+`sak` for Bug 1):

1. **Bug 1, `sak` half** — `sak` missing from `RAKA_CLASSIFIERS`. Evidence
   now exists (`mande sak·sa`, `sak·ki` verified rows; a standing
   `grammarEngine.js` comment citing `bi·sa sak·gittam` as the correct
   manually-corrected form for "three children"). Live-confirmed still
   buggy: `translate("three children")` → `bi·sa sakgittam` (no dot).
   **Note the tension with this session's own earlier `sak` 20-99 fix**
   (`Chattro saksotbri sa`, no dot, Owner-confirmed in chat) — that fix
   was specifically about the tens+units *internal* join for 20-99, not
   whether `sak` itself carries a raka dot against a base number 1-19.
   These may not conflict (different join boundaries) but should be
   checked together, not assumed compatible, before touching either.
2. **Bug 2** — the `sak` 20-99 surface form doesn't generalize to other
   classifiers (`41 cars` still `gari bolSotbri·sa`). Claude A's session
   also surfaced a **second, related open question**: whether
   `bol`/`dot`/`dam`/`roa`/`rong` should have a *space* before the number
   (matching their own contract's confirmed examples, `"Gari bol sa"`,
   `"A·bri dot sa"`) rather than the current bare fusion (`bolsa`,
   `dotsa`) that this session shipped from the Owner's direct chat
   evidence. **Do not resolve unilaterally** — this is exactly the kind
   of three-way tension (contract file vs. chat evidence vs. audit
   finding) that needs an explicit Owner call, not an engineering guess.
3. **Bug 3** — exact-hundred composition is a real semantic bug: "100
   students" reads as count=1; "one hundred dogs" silently drops the
   hundred entirely.
4. **Bug 4** — `parseCountingPhrase` has no hundred/thousand *word*
   handling at all (digit input and two-word tens-compounds only).
5. **Bug 5** — nouns without a pre-seeded count example bypass the
   classifier engine entirely via the weaker `sov-assembly` fallback
   (`"seven mangoes"` → wrong word order, ignores the real classifier).
6. `vegetables` dictionary-key mismatch (plural-only key, generic
   singularizer produces a non-existent `vegetable` key) — pre-existing,
   unrelated to any unit-word feature, not yet fixed.
7. `tool`/`tools` — genuine dictionary gap, no Garo noun exists yet.
8. kg/litre/plate/`se` raka behavior — still unverified, no confirmed
   example anywhere in the repo.

## Standing rules (unchanged, reconfirmed)
See the Role section above — those operational rules are the same ones
this and every prior Claude B session has followed; restated there rather
than duplicated here.

## Exact next step
Same as the prior close: **Bug 5 first** (the classifier engine not
generalizing past pre-tested nouns is the most load-bearing gap — every
other classifier fix's confidence rests on assuming this doesn't affect
it). Before touching Bug 1's `sak` half or Bug 2's space-vs-fusion
question, get the Owner's explicit read on the tension noted above — two
independent audits (this doc's Bug 1 note, Claude A's Bug 2 addendum)
have now flagged real conflicts between the pushed contract file's
examples and this session's direct chat-confirmed examples. That needs a
decision, not an engineering tiebreak.

**Resume instructions:** paste this doc into a new conversation. Re-sync
against actual `origin/main` first — don't trust this doc's claimed HEAD
blindly, inspect anything newer, run the full gate before starting new
work.
