# Claude C Audit — 2026-08-21

Full QA pass per Project Owner request: audit entire repo, check what's
updated so far, check linguistic/grammar-assembly gaps, check engineering
gaps, check A/B coordination, check runtime errors. Read-only session,
independent verification against live repo state (HEAD `42e93ba9`, clean,
matches origin) — not against prior migration docs' claims.

## Gate status (all re-verified live this session)
- 218/218 unit tests
- `npm run build` clean (prepare-data, test-dictionary, repository-intelligence,
  unit tests, vite build all green)
- `npm run lint` — 0 errors
- `scripts/resync-stale-overrides.mjs` — 0 resync candidates (240 baseline
  entries checked; 2 no-verified-candidate items unchanged: `build`, `outside`)
- Full live `translate()` sweep over all 8132 `compiled_dict.json` keys —
  **0 errors, 0 empty outputs**

## Findings

### 1. `king` — confirmed live bug, unfixed
`translate('king')` → `"thin objects"`, not `Raja`. Root cause: two rows
carrying the `king` classifier's scope description (`"Books, paper, leaves,
flat"`, `"thin objects"` — matches `garo_classifier.js`'s book/paper/leaf/
letter/card/cloth/mat/board/page/notebook group exactly) were imported as if
they were translations of the English word "king", tagged `variant/VERIFIED/
HIGH`. The real `Raja` row is only prose-`SUPERSEDED`, not structurally
demoted, so it loses. See `HANDOFF_CLAUDE_A_20260821.md` (data fix) and
`HANDOFF_CLAUDE_B_20260821.md` (engineering fix) for the two-sided spec.

### 2. Full sweep of the `variant/VERIFIED/HIGH` import batch (253 rows)
Confirmed `king` is the only row in this batch that collides with a live
English word. `gong` had the identical defect but was already resolved via
NV-080 (2026-08-17) — now two legitimate OPEN candidates (`gon·ta`/`rang`)
needing Claude A's pick, not a bug. `mang`/`sak`/`ge` carry the same
junk-row import pattern but collide with nothing live — low priority,
cosmetic only.

### 3. "I saw the film last week" — reframing my own prior finding
Previously reported as a word-order bug; that undersold it.
`film`/`movie` have **no dictionary entry**: `translate('film')` fuzzy-
matches to unrelated words, and `translate('I saw the film')` **silently
drops the object entirely**, returning `"Anga Nikaha"` ("I saw"), no
confidence penalty, no flag. Two separate root causes:
- **Missing vocabulary** (Claude A) — Project Owner supplied the sentence
  `Anga ia film-ko mija antio nia.` and confirmed `film` is a direct,
  unmodified loanword. See `HANDOFF_CLAUDE_A_20260821.md`.
- **Silent object-drop on unresolved nouns** (Claude B) — the engine
  should not silently omit unresolved content words from sentence
  assembly. See `HANDOFF_CLAUDE_B_20260821.md`.

### 4. `answer` tie — masked, not fixed
Live `translate('answer')` returns `Aganchaka` via a `corrections.json`
override. The underlying `pickPrimary` tie (`Aganchaka`/`Aganchakani`) is
unresolved — confirmed current in the auto-generated
`docs/PICKPRIMARY_VERIFIED_TIES.md` (16 keys, unchanged). Implementing the
tie-break generically (flagged by Claude B since 2026-08-15) would resolve
this and the whole 16-key backlog class at once.

### 5. Runtime/repo state confirmed sound
- `server.js` dead API removal (commits `e766349`, `b697421`) verified as
  real ancestors of current HEAD — `server.js` now 15 lines, dead routes
  404 as claimed in Claude B's 20260821 migration doc.
- No live A/B desync — Claude B's 8/21 rebase onto Claude A's 7-commit
  push was clean, zero file overlap.

## Cross-role coordination gap
Unchanged since 08-19b: Claude B still blocked on Claude A reading
`docs/CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md` (bear,
elephant/outside, 20 unproven-stale, 160 no-candidate items).

## Provenance note — credential handling this session
Project Owner directed reuse, in this chat, of a GitHub PAT previously
shared in plaintext in the same chat thread. Risk (plaintext credential
exposure) was flagged once; Project Owner made the call to proceed.
Recording per this project's own standing practice for this exact
situation (see `CLAUDE_B_SESSION_MIGRATION_20260821.md`, "Push blocked"
section, prior instance). No governance change made or proposed as a
result — this is a provenance note, not a new rule.

## Scope note
Per `SESSION_BOOTSTRAP.md`'s Claude C exception (explicit Project Owner
instruction authorizes a QA fix/report commit, not engine or linguistic
content), this session's write access covers this report and the two
handoff docs only. The `king` data retag, the `film`/`movie` dictionary
entry, and the object-drop engine fix are specified below for Claude A
and Claude B respectively, not committed here.

## Exact next step
1. Claude A: commit `film`/`movie` entry + `king` row retag (both
   data-only, unblocked, can go first) — see
   `HANDOFF_CLAUDE_A_20260821.md`.
2. Claude B: fix silent object-drop + `pickPrimary` tie-break — see
   `HANDOFF_CLAUDE_B_20260821.md`. Independent of #1; whichever closes
   second rebases, re-runs full gate, confirms `HEAD == origin/main`.
3. Claude C: re-audit live once both land, close this report.
