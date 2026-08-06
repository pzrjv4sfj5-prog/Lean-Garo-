# CLAUDE A — MIGRATION DOCUMENT
_Prepared 2026-08-06, repo HEAD `22d3b26`, verified against `origin/main` via fresh `git fetch`, zero divergence, working tree clean, test-dictionary.js passing (8055/8055)._

Resumed this session from prior Claude A migration document (checkpoint `60ca461`, pasted in chat).

## Who I am
Claude A — linguistic authority (grammar, morphology, dictionary quality, native validation review) for **Lean-Garo**. Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Never touch engine code (Claude B) or OCR ingestion (Claude D).

## Current Repository State (at checkpoint)
- **HEAD:** `22d3b26`, matches `origin/main` exactly, working tree clean.
- **Tests:** `test-dictionary.js` — 8055/8055 valid, 9/9 grammatical corrections verified, JSON compliance clean. (Count moved 8048→8055 this session from Claude B's own commits, not mine — see Cross-role updates below.)

## Completed work this session (Claude A only)
No dictionary/linguistic edits this session. The work was a **pipeline review + coordination handoff**, not a native-validation or NV-closure session:

1. **Reviewed the OCR→master dedup pipeline** end-to-end (`scripts/import-dictionary.js`, `scripts/claude-d-preflight.js`, `scripts/promote-lexicon.js`) at Project Owner's request, following up on repeat native-validation asks for words that may already be in the dictionary under a slightly different spelling.
2. **Diagnosis delivered to Project Owner** (in-chat, not a repo doc): import-time dedup against master is real and working (exact-match on normalized english + trimmed garo). Two gaps identified:
   - `promote-lexicon.js` never re-checks against current master immediately before writing — a pending entry approved after master has moved could still slip in as a duplicate.
   - Garo comparison is exact-trim-only, no raka/case/dash normalization — this is the mechanism behind the `DUPLICATE_AND_RAKA_AUDIT_SUMMARY.md` findings (1,000+ duplicate-key groups) and likely why the same words keep resurfacing to Thangseng under different spellings.
3. **Wrote a proposal + handoff to Claude B**, committed to `.ai/SESSION_BOOTSTRAP.md` under "Current joint work package" (top entry, dated 2026-08-06): asked Claude B to scope/estimate (a) a promotion-time re-check against master, (b) a normalized secondary garo key used as a review flag (never an auto-skip — raka differences can be linguistically real). Offered to own the normalization ruleset myself (linguistic call) once Claude B scopes the engineering side.
4. **Mid-session collision with Claude B, resolved.** Claude B pushed a session-close update (`6c14e21`) to the same `SESSION_BOOTSTRAP.md` section while I was writing. Fetched, merged; real conflict (both inserted directly after the header) resolved by ordering — my entry (newest, 08-06) on top, Claude B's 08-05 entries below, nothing dropped. Commit `5a17755` (mine) → merge `22d3b26` (pushed, no further collision).

## Explicitly NOT completed / not touched this session
- No native-validation work, no NV closures, no dictionary edits.
- Everything on the "Genuinely remaining discrepancies" list below — untouched, carried forward unchanged.
- Claude B's 3 remaining Check C build-gate items (`adultery`, `mature`, `jeon`/`jeo`) — still open, still Claude A's call, not addressed this session.

## Genuinely remaining discrepancies / open items (linguistic scope only)
Carried forward unchanged from prior migration doc: `apa` (address-register vs. citation-form question), `Bal` (flower/air/big-basket), we/us object-case, negative+continuous ordering generalization, 51 placeholder entries, `ska` vs. `skenga` in the "want to X" frame, `chiko` vs. `chibimao`, `al·a·i·na` (to hang, unreconfirmed), `Gro daka` (to commit adultery, unreconfirmed), three-way "angry" cluster (partially reconciled), `mina`/`minaha` (single attestation, non-urgent), `Boka`/"demand unduly" polysemy (PL-0001540, still open; hedged `dabia` candidate logged, not promoted).

**Build-gate items (Claude B's 2026-08-05 handoff, narrowed by Claude B's own 2026-08-05 follow-up to 3 remaining, all Claude A's call):**
1. **`adultery`** — `Til'eka` (VERIFIED/HIGH, NV-062) vs `Jua ba tileka` (UNVERIFIED/MEDIUM) — native neither confirmed nor rejected the older entry against the new one. Supersede, or genuine variant?
2. **`mature`** — `dal·gimin`/`brigimin` reconfirmed VERIFIED/HIGH; `dil·ding bal·jak` (UNVERIFIED/HIGH) neither reselected nor rejected. Still live, or supersede?
3. **`where (relative pronoun)`** — `jeon`/`jeo`, no native answer yet.

Render deploy stays blocked until these 3 are resolved (fixed/superseded at source, or allowlisted in `known_dictionary_conflicts.json` with citation). Check F is fully clean (Claude B resolved it 2026-08-05).

## Cross-role updates (already merged)
Claude B's session (`f2aa166`, `6c14e21`) landed while this session was open: synced `corrections.json` to NV-060 market spellings, fixed the "who gave you this" punctuation call, allowlisted 3 of 6 Check C conflicts (`can`, `the market is nearby`, `where did you come from?`) citing my own prior "confirmed as free variants" notes — nothing inferred on Claude B's part. This raised the valid-entry count from 8048→8055. Pulled clean via the merge above; no action needed from me beyond the merge itself. Full detail: `.ai/WORKSTATE.yaml` `claude_b` section, or Claude B's own commits.

## Runtime Handoff
None. No NV closed this session, no dictionary/corrections changes made.

## New open item for next session
**Claude B has not yet replied to the 2026-08-06 dedup pipeline handoff** (see `.ai/SESSION_BOOTSTRAP.md` top entry). Next session should check whether Claude B has scoped/estimated the promotion-time re-check and normalized-key proposal before doing anything else on this thread. If Claude B has replied, read their reply first — don't re-propose.

## Repository status at close
_All items below verified against the live repo via `git fetch`/`status`/`log` immediately before writing this, not asserted from memory._
- **HEAD:** `22d3b26`
- **origin/main:** `22d3b26` (verified via fresh `git fetch`)
- **git status:** clean (`nothing to commit, working tree clean`)
- **WORKSTATE.yaml:** not touched this session (no linguistic work to log); Claude B's own session-close sync already current
- **SESSION_BOOTSTRAP.md:** updated (dedup handoff added, merge conflict with Claude B's concurrent update resolved)
- **Migration document:** complete (this file)
- **No local commits** (HEAD matches origin/main exactly)
- **No uncommitted changes**
- **Native-validation/blocker status:** unchanged from Claude B's 2026-08-05 narrowing — 3 Check C items open (adultery, mature, jeon/jeo), all mine to resolve via native validation, none touched this session
- **Safe to resume from repository only**

## Standing notes for next session
- One live collision with Claude B this session (their session-close push landing mid-write), resolved cleanly — same pattern as the prior session's collision. `git fetch` and check `origin/main` before every push, not just at session start; Claude B continues to work overlapping windows.
- This was a coordination/process session, not a linguistic session — no new native-validation evidence gathered. Don't treat it as if NV work happened.
- The 3 open Check C items are unchanged and still block Render deploy — worth prioritizing next session if no reply from Claude B yet on the dedup proposal.

## PAT note
A PAT was pasted live by the Project Owner this session, used for clone/push. Standing policy is rotate-after-use; rotate before next use unless told otherwise.

## Trigger
On **"Let's work"** or similar: run the standard resync (git fetch, compare HEAD to `22d3b26`, `git status`, re-run `test-dictionary.js`) before picking anything up. Read this file's "New open item for next session" section first. Don't re-introduce yourself, don't re-explain this document.
