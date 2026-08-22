# Claude B Session Migration — 2026-08-21 (final)

## Repository state at close — independently verified
- HEAD == `69ab106d611c2dbfd16fa443fb6c8dad7fe385df`
- `origin/main` HEAD == same, confirmed via **GitHub API**
  (`api.github.com/repos/pzrjv4sfj5-prog/Lean-Garo-/commits/main`), not
  local git alone — see "Lesson" section below for why that distinction
  matters.
- `git fetch origin` + `git log origin/main..HEAD` (empty) +
  `git log HEAD..origin/main` (empty) — zero divergence, both directions,
  re-checked fresh immediately before writing this doc (not reused from
  earlier in the session).
- Working tree clean.
- `docs/CLAUDE_B_SESSION_MIGRATION_20260821.md` (this file) confirmed live
  at `raw.githubusercontent.com` before being superseded by this rewrite.
- Live server smoke test (not just build): `node server.js`, root → 200,
  `/api/translate` → 404 (correctly removed, not silently wrong).
- Gate green: 8132/8132 dictionary entries, 218/218 unit tests,
  14,532/14,532 runtime-sweep calls (0 errors), 0 lint errors, 0 new
  repository-intelligence violations, 0 resync candidates, clean
  `vite build`.

## What this session actually did (chronological, all confirmed sound
## by Claude C's independent audit — see "Handoff for next session" below)

### 1. Fixed: `WORKSTATE.yaml` `head`-pointer off-by-one
Prior session's commit `8162fdc` claimed to fix a stale `head` value but
set it to its own grandparent instead of its own parent. Corrected. This
recurred **three more times within this session alone** — every time a
commit touching `WORKSTATE.yaml` got rebased, its `head` value went stale
again, because `head` must equal that commit's *actual* parent at time of
push, and rebasing changes parents. Fixed correctly all three times by
checking `git log -1 HEAD^` against the file's stated value before each
push, never by assumption. **This is the single most likely thing to trip
up the next session** — see "Recommendation" below.

### 2. Fixed: orphaned dead API in `server.js`
Found live: `/api/translate` returned `Anga Skul` for "I am going to
school" — the exact bug already fixed in the real engine
(`src/translationEngine.js`) this session. Root cause: `server.js`
contained a second, fully separate hand-rolled translation engine, never
synced with any VERIFIED dictionary content or engine fix from any A/B
session. Repo-internal grep confirmed nothing in this repo calls it.
Owner directed deletion over wiring it up. Removed ~190 lines; `server.js`
now only serves `dist/` static + SPA catch-all. Verified via live `curl`
against a running server, not just build success.

**Open caveat, not fully resolved:** `git log -- server.js` shows this
code had real production history (a Gemini-fallback fix as recent as
2026-07-02, survived a 2026-07-06 Owner-authored "dead-code cleanup" pass
untouched). Repo-internal absence of callers doesn't rule out an external
consumer outside this repo's visibility. Flagged to Owner; not yet
confirmed either way. Fully reversible via `8162fdc:server.js` if needed.

### 3. Fixed: stale comment in `repository-intelligence.js`
A comment describing `work`'s expected value was one relay-batch behind
reality (Thangseng's NV-080 had already correctly superseded it). Not a
data bug — a misleading comment that cost real time this session as a
false lead. Corrected.

### 4. Mid-session finding: origin diverged **twice**, undetected until asked
This session cloned at `origin/main`@`8162fdc` and kept working/committing
against that base while two other sessions (Claude A once, Claude C once)
pushed directly to `origin/main` concurrently. Neither was detected until
directly asked why a file "wasn't in the repo." Resolved via `git fetch` +
clean rebase each time (zero file-overlap conflicts both times, by luck of
which files each side touched, not by any guarantee). **This is a real
process gap, not a one-off:** nothing currently alerts a session that
origin has moved. Recommend periodic `git fetch` + divergence check during
any long session, not just at open/close.

## Handoff for next session — from Claude C's 2026-08-21 audit
Claude C ran an independent full QA pass, confirmed all 3 fixes above are
intact and correct at current HEAD, and left new engineering-scoped
findings addressed to Claude B (full detail: `docs/CLAUDE_C_AUDIT_20260821.md`,
`docs/HANDOFF_CLAUDE_B_20260821.md`):

1. **`king` — live bug, root-caused.** `translate('king')` returns garbage,
   not `Raja`. Two misimported classifier-scope-description rows are
   outranking the real SUPERSEDED-only `Raja` row in `pickPrimary`'s
   confidence tiering. Two-sided fix (Claude A on data, Claude B on
   engineering) — see the handoff doc for specifics.
2. **`pickPrimary` confidence-tiering defect — generic, not just `king`.**
   `variant/VERIFIED/HIGH`-tagged rows can beat real translations that are
   only prose-`SUPERSEDED` (status parsed from free-text `notes`, not
   structurally enforced). Same root cause as the `answer` tie backlog
   below. Fixing generically would close `king`-shaped bugs as a class,
   not just this instance.
3. **`answer` tie-break — standing, highest leverage.** Unchanged since
   8/15: `pickPrimary` resolves `Aganchaka`/`Aganchakani` via
   last-write-wins, currently masked by a `corrections.json` override.
   Implementing a generic tie-break closes the entire 16-key
   `docs/PICKPRIMARY_VERIFIED_TIES.md` backlog at once — same fix as #2,
   worth doing together.
4. **New finding, not yet scoped to a fix:** unresolved content nouns
   (e.g. `film`, no dictionary entry) get silently dropped from assembled
   sentences — `translate('I saw the film')` → `"Anga Nikaha"` ("I saw"),
   object gone, no confidence penalty, no flag. Worth a design decision:
   lower confidence, surface a marker, or block assembly instead of
   silent disappearance. Not urgent, but a real gap regardless of which
   noun triggers it.

**None of the above started this session** — Owner was asked whether to
pick these up and hadn't responded by session close. First real decision
for whoever resumes.

## Standing blocker — unchanged, same as every session since 08-19b
Still blocked on Claude A reading
`docs/CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md` (bear,
elephant/outside, 20 unproven-stale, 160 no-candidate items — 150 of which
have a drafted-not-sent Thangseng relay batch). Out of Claude B's role,
not touched this session, reconfirmed explicitly by the Owner
("you are Claude B, do your role").

## Security note, still needs Owner action
A live GitHub PAT was pasted in plaintext in chat twice this session and
was used, under explicit Owner directive, to push. **It still needs
rotating** regardless of the push having succeeded cleanly — a token
that's been in a chat log is compromised the moment it's typed, not just
if misused.

## Recommendation for whoever has engineering bandwidth
The `head`-pointer convention has now broken **four times total** across
sessions (once pre-existing at this session's start, three more within
this session via rebases). Every recurrence was caught and fixed
correctly, but only by manual discipline each time. This is the kind of
thing `scripts/resync-stale-overrides.mjs` already does mechanically for
a different problem class — a small CI check (`head` in `WORKSTATE.yaml`
must equal `HEAD^` at push time) would close this permanently instead of
relying on whoever's paying attention that day.

## Exact next step
1. Whoever resumes: `git fetch origin && git log --oneline origin/main..HEAD`
   and `HEAD..origin/main`, both ways, before assuming anything — this
   doc's "zero divergence" claim was true at close of this session, not
   guaranteed true on resume (origin moved twice already without warning).
2. Decide: pick up Claude C's `king`/`pickPrimary`/silent-drop handoff
   (engineering-scoped, ready to start), or await Owner direction on
   something else.
3. `server.js` deletion still needs an explicit "no external consumer"
   confirmation from the Owner before it's fully closed — not blocking,
   but not forgotten either.
