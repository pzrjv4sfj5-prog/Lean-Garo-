# Claude B Session Migration — 2026-08-20 (close)

## Project identity
Lean-Garo (`pzrjv4sfj5-prog/Lean-Garo-`), English↔Garo translation engine.

## Current state
`HEAD == origin/main == 429f1e9`, clean tree. All gates green as of this
commit: 8127/8127 dictionary entries, 218/218 unit tests, 0 lint errors,
`repository-intelligence.js` 0 new violations, resync gate (new, see
below) exits 0.

## Completed this session (engineering work only, per role boundary)
1. **CI resync gate** (`717b3b2`) — closed the one open backlog item from
   `docs/CLAUDE_B_SESSION_MIGRATION_20260819b.md`: a permanent CI check
   for stale `corrections.json`/`phrase_maps.js` overrides instead of
   running the sweep ad hoc.
   - `scripts/resync-stale-overrides.mjs` now exits nonzero in
     report-only mode when it finds a mechanical resync candidate
     (override matches a SUPERSEDED master row while a VERIFIED
     candidate sits unused in `compiled_dict.json`). `--apply` runs are
     unaffected (still exit 0; their job is to fix the drift).
   - Added `src/data/resync_confirmed_exceptions.json` — a
     machine-readable record of heuristic matches already investigated
     and confirmed *not* stale, so the gate doesn't perma-fail on a
     known false positive. Currently holds one entry pair
     (`corrections:answer`, `phrase_maps:answer`) citing the verb/noun
     POS-split trap the 08-19b session caught. **This file only encodes
     decisions already made in a prior session's migration doc — no new
     linguistic judgment was made this session.** Any future flagged
     key not already in this file will still fail CI, which is the
     intended behavior — it forces investigation rather than silent
     resync or silent drift.
   - Wired into `.github/workflows/ci.yml` as its own step
     (`npm run check:resync`), separate from `npm run build` and lint,
     so a resync failure is visible on its own line in Actions output.
   - Verified the gate against current repo state before and after
     rebase: 0 unresolved candidates (matches the 08-19b pass-2 finding
     that zero *new* candidates exist), 2 correctly-excluded known
     exceptions, 2 informational skips (`build`, `outside` — no
     VERIFIED master candidate for `phrase_maps`, not resync-eligible
     regardless of the exception list).
2. **Rebase onto Claude A's concurrent work** (`429f1e9`) — pulled and
   rebased cleanly onto `af1a075` (Claude A: NV-082 close, items 26/84
   closed, 82/94 reclassified) mid-session. No conflicts, no file
   overlap with this session's changes. Full gate re-run after rebase
   (see Current state above) rather than assumed clean.

## Held, not fixed — with why
Nothing new held this session — the CI gate was the full scope of what
was actionable in my lane.

## Cross-role updates (already merged)
- Pulled Claude A's `354a7f8` (NV-082, items 26/84, 82/94 reclassify)
  and `af1a075` (Claude A migration doc 2026-08-19 close) mid-session.
  No file overlap with this session's work; see Claude A's own
  migration doc for content. Rebased cleanly, gates re-verified after.

## Runtime Handoff
The CI gate change is pure tooling (build-time script + workflow file);
nothing in the translation engine's runtime lookup path changed. No
`translate()`-level verification applicable — confirmed instead via
direct script execution (see Completed section) and the full local
build/test/lint/repository-intelligence gate, twice (pre- and
post-rebase).

## Governance
None this session.

## Standing rules (unchanged, reconfirmed this session)
Never guess a linguistic value without citation/native input; always
fetch+rebase before and after work, re-verify HEAD both sides; full gate
re-run, not assumed, before every commit; case-insensitive key matching
is not safe to trust blindly — this session's `resync_confirmed_exceptions.json`
is the concrete, permanent fix for that specific recurring trap
(`answer`) rather than re-discovering it by hand every sweep.

## Exact next step — Claude A is still the blocker
**Same as `docs/CLAUDE_B_SESSION_MIGRATION_20260819b.md`'s next step —
unchanged, not yet acted on.** Claude A's two commits pulled this
session (NV-082, items 26/84, 82/94) don't touch the 08-19 resync
handoff. Claude A needs to read
`docs/CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md` and decide:
- 1 case/sense-risk item (`bear`)
- 2 tied-candidate items (`elephant`, `outside`)
- 20 unproven-stale items
- 160 no-candidate items (recommended for folding into the next
  Thangseng relay batch)

No engineering task is actionable in this repo until then. The CI gate
added this session will automatically catch any *new* mechanical drift
going forward, but it does not and cannot make these linguistic calls.
