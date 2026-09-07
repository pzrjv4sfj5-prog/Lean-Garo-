# Claude B Session Migration — 2026-09-07 (C)

## Project identity
Lean-Garo: English→Garo translation engine (`translate()` in
`src/translationEngine.js`, cascading through phrase/dictionary lookup,
stopword-stripping, grammar-assembly, sov-assembly fallback).

## Current commit / state
- `origin/main` tip: **`2dc1756`** — "Bug B fix: \"it's\"/\"it is\" no
  longer drops the subject before an ing-verb". Pushed and confirmed on
  origin this session.
- Session opened at `origin/main` = `00e6e92` (prior migration doc,
  `docs/CLAUDE_B_SESSION_MIGRATION_20260907B.md`).
- While this session was in progress, **3 more commits landed on
  origin** before push: `14931ed` (raka cleanup, 13 rows), `25b54ff`
  (SUPERSEDED-tagged an 8-row metadata-debris cluster — dictionary
  entry count dropped 8257→8249, confirmed expected, not a defect),
  `0053d5c` (a session-close migration doc + WORKSTATE pointer from
  whichever session made the two commits above). This session's Bug B
  commit was rebased (not merged) onto that tip before push. Full gate
  was re-run and confirmed clean against the merged state before push
  (see below).
- Working tree is clean. Nothing local, nothing uncommitted, nothing
  unpushed.

## What's done vs. held, and why

### Done this session
**Open item 2, Bug B (sov-assembly/stopword-strip contraction subject
detection) — FIXED, tested, pushed. Carried forward from the prior
migration doc as the main open item; now closed.**

- **Root cause was broader than the prior doc's investigation found.**
  The prior doc framed this as specific to the "it's"/"he's"/"she's"
  contractions. This session's trace found the actual defect is not
  contraction-specific at all: `"it"`/`"its"` are `STOP_WORDS` members
  (needed for dummy-it constructions like "it is hot"/"it is
  raining"). `translationEngine.js`'s stopword-strip cascade step
  joins all non-stopword words into one string and does a single
  `lookupGaro()` call on it — once `"it"`/`"is"` strip away, `"eating"`
  alone remains, and `"eating"` has its own exact dictionary entry
  (`"cha·enga"`), so this step short-circuits with a confident result
  BEFORE grammar-assembly or sov-assembly ever run. Confirmed live:
  `"it eats"`/`"it runs"` were **never** affected by this — no exact
  entry for `"eats"`/`"runs"` to false-positive against, so those
  already reached grammar-assembly naturally and resolved subject
  correctly via `PRONOUN_MAP`. But `"it is eating"`/`"it is
  running"`/`"it is sleeping"`/`"it's eating"` — any construction where
  the ing-form has its own exact dictionary entry — all lost the
  subject via this exact path, contraction or not.
- **"he's"/"she's" needed no fix at all.** Traced the mechanism the
  prior doc left unidentified: they resolve correctly by accident, via
  sov-assembly's own generic `s$`-strip fallback intended for plural
  nouns (`lookupGaro(lw.replace(/s$/,''))`). `"hes"` strips to `"he"`,
  `"shes"` strips to `"she"`, and both `"he"`/`"she"` have their own
  compiled-dict pronoun entries resolving to `"Ua"` — nothing to do
  with `PRONOUN_MAP` (which has no contraction keys at all: confirmed
  `PRONOUN_MAP['its'|'hes'|'shes']` are all `undefined`). Left
  untouched; no possessive-collision risk exists for these forms
  either (`"he's"`/`"she's"` never mean "belonging to him/her" — that's
  `"his"`/`"her"`, distinct word forms), so there was nothing to fix
  and nothing to protect against.
- Fix, two parts, both in `src/translationEngine.js`:
  1. Expand `"it's"` → `"it is"` on `cleaned`, before
     apostrophe-stripping, so it's distinguishable from true
     possessive `"its"` (never carries an apostrophe in correct input)
     all the way through the pipeline. Possessive `"its"` (e.g. `"its
     color"`) is completely untouched — deliberately **not** solved by
     adding `"its"` to `PRONOUN_MAP`, which would make contraction and
     possessive indistinguishable again downstream and misfire on
     possessives. Confirmed no corrections/phrase-map source keys use
     the literal apostrophe form `"it's"` (grepped clean), so this
     can't shadow an existing exact-match entry; confirmed
     `tryVeryHotConstruction`'s regex already accepts `"it is"` as an
     alternative to `"it's"`, so that construction is unaffected.
  2. The stopword-strip step keeps sentence-initial `"it"` in the
     joined string it looks up (rather than dropping it), defeating
     the false-positive shortcut the same way `"hes eating"`/`"shes
     eating"` already naturally avoid it — `"it eating"` isn't itself
     a known phrase, so `lookupGaro()` fails on it and the cascade
     correctly falls through to grammar-assembly.
- Tests: `tests/unit/it_contraction_subject_detection.test.js` (10 new
  tests) — covers both the contraction and uncontracted forms, both
  pre-existing-correct regression guards (`"it eats"`/`"it runs"`),
  both dummy-it regression guards (`"it is raining"`/`"it is hot"`
  must still drop the subject, unaffected since they're caught earlier
  in the cascade by correction/exact-phrase), a true-possessive
  regression guard (`"its color is red"` must not inject a spurious
  `"Ua"` subject), `"he's"`/`"she's"` regression guards, and an
  ordinary-sentence regression guard.
- Gate: verified clean twice (pre-rebase against `00e6e92`,
  post-rebase against `0053d5c`) — `prepare-data.js` (zero diff vs.
  committed artifacts both times; entry count correctly dropped
  8257→8249 between runs, matching the concurrent SUPERSEDED-tagging
  commit, not a regression), `test-dictionary.js` (8249/8249 post-
  rebase), `repository-intelligence.js` (0 new violations),
  `runtime-error-sweep.mjs` (0 errors / 14743 calls post-rebase),
  `node --test` (360/360, up from 350/350).

### Held — not started / not finished
None carried forward as new open items this session beyond what was
already open before it started (see below) — Bug B (the session's one
assigned task) is fully closed.

**Open item 3 (very-hot generalization)** — untouched, correctly still
blocked, no action taken or needed this session.

**Open item 5 (`ball` fuzzy false-positive)** — untouched, still low
priority, not investigated this session.

## Open issues, with root cause where known
- None newly surfaced this session. `repository-intelligence.js` and
  `runtime-error-sweep.mjs` both clean at 0 on every gate run,
  pre-rebase and post-rebase.
- Carried forward, unchanged: open items 3 and 5 above.

## Standing rules (unchanged, confirmed followed this session)
- `git fetch` before every push — done, caught 3 concurrent commits
  from another session correctly before pushing.
- Rebase, not merge, on conflicts — one rebase this session, clean, no
  conflicts.
- Regenerate `compiled_dict.json`/reports via `node prepare-data.js`
  from merged source rather than hand-merging — done, zero diff
  confirmed both times (pre- and post-rebase).
- One task per commit, don't batch — Bug B is its own single commit
  (`2dc1756`), fix + tests together (not split further, since the
  tests are the verification for the fix itself, not a separate unit
  of work).
- Migration doc written and pushed before ending the session — this
  file.

## Note on this session's credential handling
Two PATs were provided in-chat over the course of this session. The
first was rejected outright by GitHub itself ("Invalid username or
token. Password authentication is not supported for Git operations.")
on the one write operation attempted (a real 401 from GitHub, not a
sandbox/network restriction — confirmed it successfully authenticated
`clone`/`fetch` throughout the session, which is expected regardless
of token validity since `Lean-Garo-` is a public repo and anonymous
reads succeed either way). This is the same failure mode the prior
session's migration doc documented for its own first PAT — worth
noting as a recurring pattern: the first PAT provided in a session has
now failed to push on two consecutive sessions. The second PAT,
provided after the person regenerated it, authenticated correctly for
push and was used for this session's push. Both tokens were used only
inline on the `git push` command itself (`git push
https://<user>:<token>@github.com/...`), never written to any file in
this repo or left in `.git/config` — the remote URL was reset to the
plain (credential-free) form immediately after each push attempt,
including the failed one. **Recommend rotating/revoking both tokens**,
per the general practice of treating any token pasted into a chat as
potentially exposed; this is doubly true here since they were also
pasted directly into this chat's message history.

## Exact next step for the next session
1. `git fetch origin`, confirm `HEAD` at `2dc1756` or later (check for
   anything landed in the meantime).
2. Re-run the gate once at the top (do **not** re-verify Bug A or Bug
   B — both already confirmed fixed and tested, in this doc and the
   prior one).
3. No specific next task was assigned by the Project Owner as of this
   doc. Suggest picking up open item 3 (very-hot generalization —
   still explicitly blocked pending native-speaker evidence, don't
   unblock unilaterally) or open item 5 (`ball` fuzzy false-positive,
   low priority, not yet investigated) if no other direction is given,
   or check `WORKSTATE.yaml`/`PROJECT_STATUS.md` for anything the
   Project Owner queued between sessions.
