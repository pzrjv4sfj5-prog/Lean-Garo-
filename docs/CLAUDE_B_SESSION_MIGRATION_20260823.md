# Claude B Session Migration — 2026-08-23

## Project identity
Lean-Garo- (language-translator) — English↔Garo dictionary/translation app.
Repo: pzrjv4sfj5-prog/Lean-Garo-

## Current commit/state
- HEAD: `5c5b633367e2f1ea52201017eb60539b5461802e`
  ("Session migration doc (2026-08-22C): confidence schema steps 1-2 closed out")
- Branch: main, in sync with origin, working tree clean.
- No commits made this session — verification-only.

## What's done vs held (and why)
**Done (confirmed this session, re-verified against current HEAD, no drift):**
- Confidence schema steps 1–2 (writer support, CI enum, auto-migration) — shipped, merged.
- Idempotency bug in migrate-confidence-schema.js — fixed (14adbd1).
- Full non-vite build gate re-run clean:
  - `prepare-data.js` → exit 0, 8159 entries compiled (advisory-only output, no errors)
  - `test-dictionary.js` → 8159/8159 valid, 9/9 grammatical corrections, JSON compliant
  - `repository-intelligence.js` checks A–G → 0 new violations, 9848 rows
  - `node --test tests/unit/*.test.js` → 220/220 pass
- `vite build` not run (vite not installed in this sandbox) — same gap as prior session, not a regression.

**Held (not this session's work, unchanged):**
- Confidence schema step 3: ~336-row triage — assigned to Claude A, not started.
- Confidence schema step 4: pickPrimary cutover — sequenced after step 3.
- AI-001 governance row — intentionally left OPEN pending above.

## Open issues (root cause where known)
- 15 pickPrimary verified-ties (docs/PICKPRIMARY_VERIFIED_TIES.md) — tied VERIFIED/HIGH candidates, needs Claude A disambiguation. Root cause: multiple equally-confident source entries, no tiebreak rule yet.
- 190 SUPERSEDED-only held keys (docs/SUPERSEDED_ONLY_KEYS.md) — not shipped, all source candidates superseded.
- 11 raka-locality candidates (repository-intelligence CHECK A) — report-only, lexical-split risk, not asserted as bugs.
- All other repository-intelligence flags (B: 7, C: 1565, E: 111, F: 144) are known/allowlisted, 0 new — stable baseline, not regressions.

## Standing rules established
- `pickPrimary` falls back to last-write-wins among tied VERIFIED/HIGH candidates only (excludes weaker candidates) when ties can't be auto-resolved.
- Claude A owns lexical/disambiguation decisions; Claude B/C own schema, tooling, and cross-table integrity.
- repository-intelligence.js is the gate: only NEW violations fail the check; known/allowlisted counts are expected baseline noise.
- Per user preference: don't re-verify things already confirmed with no changes since — this session re-ran the full gate once to reconfirm zero drift from 20260822C, not because anything was suspected changed.

## Exact next step
Either:
(a) Claude A triages the ~336 unresolved confidence-schema rows (step 3), or
(b) Claude C audits steps 1–2 for closure-readiness independent of step 3.
No step 4 (pickPrimary cutover) until step 3 is closed.

---
Start a new conversation and paste this document in to resume.
