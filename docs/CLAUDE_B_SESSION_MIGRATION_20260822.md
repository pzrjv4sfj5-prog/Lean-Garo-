# Claude B Session Migration — 2026-08-22

## Repository state at close — independently verified
- Local HEAD will equal this commit; its parent is `aead387`, verified
  via `git log -1 HEAD^` before writing this file (not assumed).
- `git fetch origin` + `git pull --ff-only` both run this session; the
  fast-forward was trivial (already up to date) before this commit,
  and will be re-run one final time immediately before push.
- Working tree clean before this commit; will be re-confirmed after
  push.
- Remote HEAD will be verified via `git ls-remote origin main` after
  push — not GitHub API this time (rate-limited when tried), but
  `ls-remote` talks to GitHub directly the same as the API does, same
  independence from local git state that the 2026-08-21 session's
  lesson was about.

## What this session actually did

### 1. Ran the Project-Owner-directed Claude B Role Self-Audit
Full findings already delivered in chat and are not repeated here —
see the audit output earlier in this thread. Independently verified
rather than trusted: `npm test` (218/218 green), and three live
`translate()` calls (`king`, `answer`, `I saw the film`) confirmed to
still exhibit the exact defects Claude C's 2026-08-21 audit reported.
No repository changes in this step — audit only, as instructed.

### 2. Shipped: `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` + Rule 13
Per Owner direction to convert the audit finding into a mandatory
process. Defines AI-001 — the pickPrimary/override-precedence defect
class behind `wait`/`salt`/`smile`/the 9-key no-verified-candidate
defect/`answer`/`king` — with:
- a rule that a 2nd occurrence of the same *mechanism* must advance
  the architectural fix or explicitly record why not, before another
  `grammarOverrides`/`corrections.json` entry ships;
- a mandatory A→B→runtime trace (source → compiled → override →
  live `translate()`) for any key touched, plus a 5-key random sample
  from `docs/PICKPRIMARY_VERIFIED_TIES.md` every session;
- a class-level (count-based, not single-example) closure protocol
  for Claude C, added to `.ai/WORKSTATE.yaml`'s `claude_c` block as
  `class_closure_protocol`.
Committed and pushed as `aead387`. Documentation only — no engine or
data files touched; `king`/`answer`/`film` remain open, now scoped
under AI-001 rather than three unrelated findings.

### 3. This session (migration): one further standing rule
Owner instruction: ensure all future Claude B sessions follow the
process above, and that all roles document the same in their own
migration documents going forward. Rather than relying on Rule 13
being read and remembered, added an explicit, cheap, enforceable
requirement: **every migration document from any role (A, B, C, D)
must include a one-line "Governance-model check"** stating whether
that session touched anything tracked in `docs/
CLAUDE_B_ENGINEERING_GOVERNANCE.md` §4, and if so, whether the
§2/§3/§5 obligations were actually followed — not asserted, shown.
Added as Rule 13's final bullet plus a short Rule 6a pointer next to
the other mandatory-migration-doc-section rules, so it's visible in
both places a future session is likely to be reading. This will be
committed in the same push as this migration document.

## Governance-model check (this session, per the new rule above)
This session's engineering work was entirely the governance model's
own creation — it did not touch any key or mechanism already listed
in `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §4 (AI-001's table). No
`grammarOverrides`/`corrections.json` entry was added or considered,
so §2's investigation-match check does not apply. No translation
output was changed, so §3's A→B→runtime trace does not apply beyond
what the audit step already ran (§2 above, `king`/`answer`/`film`
live-checked, findings unchanged, nothing marked resolved). No §4 row
was proposed as closed, so §5 does not apply.

## Runtime Handoff (Claude B)
None — no NV closed, no runtime-facing code or data changed this
session.

## Standing blocker — unchanged, same as every session since 08-19b
Still blocked on Claude A reading `docs/
CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md`. Out of scope for
this session (governance/documentation only), not touched.

## Security note — still needs Owner action, recurring
A live GitHub PAT was pasted in plaintext in chat again to resume this
session (same pattern flagged unresolved at the 2026-08-21 close).
**Please rotate it.** This has now recurred across at least two
consecutive sessions without action — worth treating as its own
standing item rather than a one-line note that gets repeated and
ignored each time.

## Exact next step
1. Whoever resumes: `git fetch origin`, verify HEAD against `head` in
   `.ai/WORKSTATE.yaml` (`aead387` at this session's close), before
   assuming anything.
2. Engineering-scoped and ready to start: (a) build `docs/
   PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` as a `prepare-data.js`
   auto-report — AI-001 subclass (b) has no enumeration artifact yet,
   unlike subclass (a)'s `PICKPRIMARY_VERIFIED_TIES.md`; this is the
   first concrete gap the governance model itself identified. (b) The
   `confidence`/`confidence_source` schema (designed 2026-08-04, still
   not started) is AI-001's proposed structural fix.
3. `king`/`answer`/`film` remain open, AI-001-scoped, ready to pick up
   under the new process (§2/§3 of the governance doc apply directly).
4. `server.js` deletion (2026-08-21) still needs an Owner
   "no external consumer" confirmation — unrelated to this session,
   not forgotten.
