# Archive

Root-level docs moved here 2026-08-10 (Claude B, Phase 0 cleanup — see project
fix plan). These are point-in-time artifacts, not living status docs. Current
status lives in `PROJECT_STATUS.md` (root) and `.ai/WORKSTATE.yaml`.

- `PLATFORM_AUDIT_20260603.md`, `SEARCH_AUDIT_20260603.md`,
  `USER_JOURNEY_REPORT_20260603.md`, `DEPLOYMENT_REVIEW_20260603.md`,
  `LEARNING_ENGINE_PLAN_20260603.md` — one-time audits/plans from 2026-06-03,
  superseded by ongoing WORKSTATE.yaml tracking.
- `FIXES_APPLIED_early_milestone.md`, `IMPLEMENTATION_SUMMARY_early_milestone.md`
  — early-project "production ready" milestone docs, undated internally,
  content long superseded.
- `RENDER_DEPLOY_superseded_by_DEPLOYMENT_md.md` — fully redundant with the
  "Render.com" section already in root `DEPLOYMENT.md`.
- `CHECKPOINT_20260804_orphaned_reverse_translation_pointer.md` — **flag for
  whoever resumes reverse translation (currently on hold):** this checkpoint
  describes a local rebase of `src/reverseTranslationEngine.js`,
  `src/pages/ReverseTranslator.jsx`, `src/reverseTranslationData.json`, and
  `docs/DOMAIN_KNOWLEDGE_CLAUDE_C.md`, awaiting Claude A/B sign-off before
  push. As of 2026-08-10, none of those files exist anywhere in git history
  (`git log --all` on each path is empty) — the work was never merged and
  appears lost, not just unpushed. This conflicts with the migration-doc
  framing of reverse translation as "zero code shipped" (implying nothing was
  ever written, vs. written-then-lost). Worth a direct question to whoever
  ran that session before reverse translation resumes, rather than assuming
  either framing.

`docs/BUG_*.md` and `docs/FIX_*.md` were **not** triaged in this pass —
open/closed status wasn't reliably determinable by automated inspection, and
guessing would repeat the exact bulk-auto-fix mistake NV-071 already
prohibits. That triage is listed as a Phase 0 follow-up for Claude A/B, done
per-doc.
