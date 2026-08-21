# Claude B Session Migration — 2026-08-21

## Repository state at close
- HEAD (local, this session's commits, post-rebase) == `c2668fd` (rebased
  twice this session — origin moved again mid-session, second time from
  `56cbae0` to `d2fce38`, caught via re-fetch before this push rather than
  pushed blind)
- origin/main at session start == `8162fdc` (per prior migration doc
  20260820c). **Mid-session, origin/main advanced 7 commits** (Claude A
  pushed a full session directly: `278018d`..`56cbae0` — NV-086/087/088,
  a phrase-map apostrophe-stripping runtime-bug fix, 3 override/master
  conflict fixes, 4 relay-batch closures, session-close doc). Discovered
  this only because the Owner asked why the migration doc "wasn't in the
  repo" — it wasn't, because I'd never had push access and was still
  working off the stale `8162fdc` base.
- Rebased local commits onto `origin/main` (`56cbae0`) — clean, **zero file
  overlap** between the two sides (origin touched dictionary/content
  files; I'd touched `WORKSTATE.yaml`/`repository-intelligence.js`/
  `server.js`), so no conflicts to resolve.
- Rebase changed my commits' actual parent hashes, which made the `head`
  value I'd set inside the WORKSTATE.yaml-touching commit stale *again*
  (still said `8162fdc`, needed to say `56cbae0`). Fixed via
  `git rebase -i` + amend before continuing, not a follow-up commit.
- **Currently 3 local commits ahead of origin/main (`56cbae0`), not yet
  pushed** (see "Push blocked" below) — this doc's own commit is the 3rd
- Tree clean before and after every gate run, including after the rebase
- 218/218 unit tests, 0 runtime errors (14,532-call sweep — count moved
  from 14,525 due to Claude A's new content, not a regression), 8132/8132
  dictionary entries (moved from 8128, same reason), 0 new
  repository-intelligence violations, 0 new resync candidates, 0 lint
  errors, clean `vite build` — all re-verified after the rebase and again
  at session close

## Push blocked — security note, action needed from Project Owner
Session opened with the Project Owner pasting a live GitHub PAT in plaintext
in chat. Per standard practice that token must be treated as compromised
regardless of what happens next — **it needs revoking/rotating** (GitHub →
Settings → Developer settings → Personal access tokens) before any push
happens with it. It was not used for anything this session (repo is public,
read access needed no auth). All 3 commits below are local-only, sitting on
top of origin's `8162fdc`, waiting on the Owner to push (with a fresh token,
shared outside chat) or hand over write access some other way.

## What happened this session
Owner asked for a full audit — "check all runtime and all updated," then
"find what's missing/runtime errors between A and B and start fixing,"
scoped explicitly to Claude B's role (engineering only, no linguistic
content). Four issues found and closed, one investigated and correctly
ruled out as already-resolved:

### 1. Fixed: off-by-one in WORKSTATE.yaml `head` pointer (commit `e766349`)
Prior session's commit `8162fdc` ("fix stale repository.head") set
`head: b98e099`, but per `head_convention` its own value should have been
its own parent (`1c96995`), not its grandparent (`b98e099`) — the "fix"
introduced a new, one-commit-fresher stale head. Corrected. (Caught the
same class of mistake in my own first attempt this session too — initially
wrote `head: 1c96995` before realizing my commit *also* touches
WORKSTATE.yaml, so it needed to point to *its own* parent, `8162fdc`.
Amended before it left the local repo. Worth flagging as an easy trap for
whoever touches this file next.)

### 2. Fixed: orphaned dead API in `server.js` (commit `e766349`)
Found by hitting the live `/api/translate` endpoint directly during the
audit — it returned `Anga Skul` for "I am going to school," the exact bug
supposedly fixed in the prior session (20260820c). Root cause: `server.js`
contained a second, entirely separate hand-rolled translation engine (own
`verbs`/`pronouns`/`commonPhraseMap` objects, `normalizeText`/
`buildSentence`/`ultimateDataCrawler`) backing `/api/translate` and
`/api/dictionary`, fully disconnected from `src/grammarEngine.js`,
`src/sentenceBuilder.js`, and the 8128-entry `compiled_dict.json`. It never
received any VERIFIED content or engine fixes from any A/B session. Grepped
the repo (frontend, README, tests) — nothing calls either route; the live
app (`src/pages/Translator.jsx`) imports `translationEngine.js` and runs
client-side only. Owner confirmed via prompt: delete rather than wire up.
Removed ~190 lines; `server.js` now only serves `dist/` static + SPA
catch-all. Rebuilt, confirmed `dist/` bundle hash unchanged (zero effect on
the real app), confirmed dead routes now 404 instead of silently returning
stale data.

### 3. Fixed: stale comment in `repository-intelligence.js` (commit `b697421`)
Comment on the `'work'` RC-CANDIDATE-041 entry claimed `corrections.json`'s
`work` was resynced to `ka·a` via a 2026-08-16 `pickPrimary` fix and still
is. Live value is `Dak·a` — Thangseng's 2026-08-17 relay batch (NV-080,
commit `d217f54`) deliberately reverted it back, superseding that fix. Not
a bug in the data (confirmed `Dak·a` is correct/current/authoritative, and
`answer`/`Aganchakani` likewise checks out against NV-077) — just a
misleading comment. Cost real time this session chasing it as a possible
live discrepancy; updated so it doesn't cost the next session too.

### 4. Investigated, correctly ruled out (no action needed)
Traced the `pickPrimary` OCR/UNVERIFIED-over-VERIFIED precedence defect
flagged in the 2026-08-15 handoff doc (`work`, `answer`) all the way
through git history to confirm current state is intentional and correct,
not regressed — see #3 above.

## Attempted but abandoned: browser-level runtime check
Tried to go one level beyond the dictionary/engine sweep and unit tests —
installed `puppeteer`, attempted a headless-Chrome pass against the live
`server.js`-served app to catch any DOM/console-level runtime errors the
engine-level sweep wouldn't see. Chromium binaries were present in the
sandbox but every invocation either hung or crashed the tool call outright
with no usable output, even after several isolation attempts (foreground
vs backgrounded, explicit executablePath, writing results to a file). Not
an app bug — a sandbox/tooling limitation. Abandoned rather than keep
burning turns on it; cleaned up (`puppeteer` uninstalled, temp script
removed, no stray processes, tree confirmed clean). **The engine-level
sweep (14,525 calls, 0 errors) and full unit suite (218/218) remain the
authoritative "no runtime errors" signal** for this app — they cover the
actual translation logic, which is 100% of what differs between the app
and a static page. A real headless-browser pass is worth revisiting with
better sandbox tooling, but isn't blocking anything.

## Standing blocker (unchanged)
Same as every session since 08-19b: still blocked on Claude A reading
`docs/CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md` (bear,
elephant/outside, 20 unproven-stale, 160 no-candidate items — 150 of which
have a drafted-not-sent Thangseng relay batch, still pending send+reply).
Not touched this session — out of Claude B's role per the 2026-08-14
boundary rule, reconfirmed explicitly by the Owner this session ("you are
Claude B, do your role").

## Mid-session finding: origin diverged undetected, only surfaced when asked
This session cloned the repo and worked entirely off `origin/main`'s state
*at clone time* (`8162fdc`). Claude A then pushed 7 commits directly to
`origin/main` in a separate session running concurrently — this session had
no mechanism to detect that and kept working, committing, and reporting
"3 commits ahead of origin" against a base that was no longer origin's
actual HEAD. It was only caught because the Owner asked directly why the
migration doc file "wasn't in the repo" (it wasn't pushed at all — no
push access — but the more important issue was the local base itself was
already stale by then). Resolved via `git fetch` + clean rebase (no file
overlap between the two sessions' changes) + fixing the resulting
WORKSTATE.yaml `head` staleness that the rebase itself introduced. No data
lost, no conflicts, but worth flagging: **any long-running local clone
should `git fetch` and check `origin/main..HEAD` / `HEAD..origin/main`
periodically, not just at session open**, especially when multiple
Claude sessions may be working the same repo concurrently.

## Process note (carried forward, still unresolved)
Same WORKSTATE.yaml/migration-doc growth concern the Owner raised in
20260820c — not addressed this session either, still just a flag for
whoever has bandwidth to make it a real task.

## Exact next step
1. Owner: rotate the PAT pasted in chat this session (if not already done),
   then push local commits `e766349..c2668fd` (3 commits, currently sitting
   on top of `origin/main`@`56cbae0` after this session's rebase — do
   **not** assume `origin/main` is still at `56cbae0` by the time this is
   read; it moved once already, mid-session, without any signal reaching
   this session until directly asked. Confirm via `git fetch` +
   `git log origin/main` before pushing or rebasing again.
2. Whoever resumes: re-verify actual origin HEAD before continuing — this
   doc's "3 local commits ahead of `56cbae0`" claim was true at close of
   this session, not guaranteed true on resume, and was *also* not true
   for most of this session (origin moved to `56cbae0` while this session
   was still working off `8162fdc`, undetected until the Owner asked why a
   file "wasn't in the repo"). Run `git fetch origin && git log --oneline
   origin/main..HEAD` and `HEAD..origin/main` both ways before assuming
   anything about ahead/behind state.
3. No engineering issues remain open as of this close. Next engineering
   work is whatever the next audit turns up, or ordinary feature/fix
   requests. Next *content* work is the standing blocker above, and
   requires switching to Claude A's role.
