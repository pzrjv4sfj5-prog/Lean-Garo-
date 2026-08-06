# Claude A Session Migration — 2026-08-06 (B)

## Project identity
Lean-Garo: Garo language dictionary + English→Garo translation engine.
Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Claude A = linguistic authority
(grammar, morphology, dictionary quality, native validation review). Never
touch engine code (Claude B) or OCR ingestion (Claude D). Evidence-first
methodology on all linguistic calls; standing rules and PAT policy as in
`.ai/SESSION_BOOTSTRAP.md`.

## Current state
- Checkpoint: `961e51c`
- `origin/main`: `961e51c` (match confirmed via `git fetch`)
- Working tree: clean
- `test-dictionary.js`: 8055/8055
- `repository-intelligence.js`: 0 new violations, all checks (Check C, D, E, F)

## Done this session
1. Resumed from prior migration doc (checkpoint `22d3b26`/`04093da`), resynced clean.
2. Closed the 3 remaining Check C build-gate items via Project Owner-relayed native reconfirmation: `adultery` = `Til'eka`; `mature` = `dal·gimin`/`brigimin`; `jeon`/`jeo` confirmed free variants. Superseded losing variants, allowlisted 3 keys. Commit `c6a9f26`.
3. Ran a historical-resolution audit (Project Owner request, before opening any new NVs). Findings:
   - adultery/mature recurrences = correct evidence-first behavior (native never rejected the losing variant, held open by design) — not bugs.
   - jeon/jeo recurrence = a real bug: VERIFIED/HIGH since NV-054 (2026-08-03), never allowlisted across 3 sessions — missing-propagation gap, now fixed.
4. NV-064 final closure batch (Project Owner-relayed native final words, treated as authoritative per Project Owner instruction):
   - `chiko`: reclassified "at the river" → "the water" (distinct word from `chibimao`, not a real conflict — resolves NV-051 flag)
   - `jeo`: clarified as short form of `jeon`
   - `Gro daka` = "to owe something": promoted "to be in debt." entry to VERIFIED/HIGH (unrelated "commit adultery" sense of `Gro daka` untouched, stays superseded since 2026-08-01)
   - `al·a·i·na`: REJECTED, native doesn't recognize it
   - `dil·ding bal·jak`: REJECTED for both "mature" and "adolescent", native doesn't recognize it
   - All entries retained, not deleted, per citation discipline. `known_dictionary_conflicts.json` +1 (`the water`).
   - Commit `d307603`.
5. Merged Claude B's dedup-pipeline scope reply (`ff44795`), resolved `SESSION_BOOTSTRAP.md` conflict by placing my NV-064 entry above Claude B's reply and dropping the now-superseded duplicate entry. Commit `961e51c`, pushed clean.

## Held / not done, and why
- **Claude B's raka-normalization ruleset question** (from their dedup-pipeline scope reply) is unanswered. They need a call on: (a) which characters/patterns count as raka for `normalizeGaro()` (`·`, `'`, both, positional?), (b) whether dash/hyphen variants are always cosmetic, (c) case-folding safety re: tonal/proper-noun exceptions. This needs its own evidence-first pass, not a rushed answer — held for a dedicated session/task.
- **"adolescent"**: `dil·ding bal·jak` REJECTED, no replacement candidate on record. Needs a fresh native ask if the Project Owner wants this key resolved.
- **Claude B's dedup-pipeline Item 1** (promotion-time re-check in `promote-lexicon.js`, ~30–45 min, no linguistic judgment) is unblocked and can proceed independently of the raka ruleset — Claude B flagged they're ready to build it now.

## Open issues (root cause known)
None outstanding beyond the two items above — no other open Check C/D/E/F items as of this checkpoint.

## Standing rules reinforced this session
- Historical-audit-before-new-NVs discipline: before reopening or re-asking any linguistic item, check prior migration docs / completed NVs / `THANGSENG_NATIVE_VALIDATION.md` / transcripts first, and classify recurrence root cause (stale allowlist, stale pending lexicon, stale compiled artifact, missing propagation, repository-intelligence config, merge regression, or — as with adultery/mature — not a bug at all, just an honest open item) before treating anything as new work.
- "Native final word" instruction from Project Owner (this session): when Project Owner explicitly relays the native's word as final, treat it as closing without a further reconfirmation round — still logged evidence-first, but not re-flagged for a repeat ask.

## Repository status at close
- HEAD: `961e51c`
- `origin/main`: `961e51c` — match confirmed
- `git status`: clean, nothing to commit
- `.ai/WORKSTATE.yaml`: updated (this session, `claude_a.latest_2`)
- `SESSION_BOOTSTRAP.md`: updated (this session, "Current joint work package")
- This migration doc: complete
- No local commits ahead of origin, no uncommitted changes
- Native-validation status: NV-064 closed; no blockers outstanding except the two "held" items above (neither blocks deploy or tests)
