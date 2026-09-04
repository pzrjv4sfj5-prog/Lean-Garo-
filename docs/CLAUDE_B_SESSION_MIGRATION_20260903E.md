# Claude B Session Migration — 2026-09-03E (relay batch drafted, session close)

## Verified state
- HEAD `10beeed`, clean tree, synced with `origin/main`.
- Gate independently re-run this session: `prepare-data.js` (8213
  entries), `test-dictionary.js` (8213/8213, 9/9 corrections),
  `repository-intelligence.js` (0 new violations),
  `resync-stale-overrides.mjs` (0 candidates), `node --test` (**314/314
  pass**). Zero runtime errors anywhere in the pipeline.

## What's actually done vs. what's still open
**All engineering-fixable items are closed.** NV-119 (modal "can") and
NV-120 (polar-question "did SUBJ have lunch") from Claude A's
2026-09-03 handoff were fixed last session — see
`docs/CLAUDE_B_SESSION_MIGRATION_20260903D.md` for full detail. Nothing
in the current codebase is a known, unaddressed code defect.

**3 items remain open — all genuinely blocked on native evidence, not
engineering work:**
1. RULE-038 tension (NV-109) — bare `sak·sa`/`sak·gni`/`sak·gittam` vs.
   RULE-038's "noun always stated" claim.
2. "Only X" third-person scope — NV-112 only ever attested subject "I".
3. RULE-048 (formerly mislabeled "RULE-047" — see NV-113/NV-121 in
   `docs/THANGSENG_NATIVE_VALIDATION.md` and Claude A's correction at
   `docs/CLAUDE_A_SESSION_MIGRATION_20260903D.md` for the numbering
   fix) — attested for `mai`-family words, `badita`, `sawa`, `maiko`,
   `bachi`, `badiako`. `bano` (stationary "where") remains untested.

Claude A explicitly declined to force-close any of these without a real
answer (2026-09-03C session), even under a direct "close all"
instruction — same evidence-first discipline this project applies
throughout. Do not close these without an actual Thangseng answer,
regardless of future instruction wording.

## This session's work
Drafted `docs/THANGSENG_RELAY_QUESTION_20260903.md` — originally 3
questions, narrowed to 3 (item 3 partly answered same-day by Claude A's
NV-121/RULE-048 before this batch went out — see that file's own
"Status" note). Worded for a non-linguist native speaker (no IPA/
grammatical jargon, mirrors the phrasing style of prior successful relay
batches). **Sent to Thangseng by the Project Owner directly in chat, not
via a repo commit** — the relay doc exists as the internal record of
what was asked and why, not as the transmission mechanism itself.

Also fixed a numbering collision I introduced last session: NV-113's
commit labeled its finding "RULE-047" in `docs/GARO_GRAMMAR_REFERENCE.md`
without checking the canonical rule registry
(`docs/GRAMMAR_RULE_CATALOGUE.md`), which already had an unrelated
RULE-047 (comitative `-ming`). Claude A caught and fixed the
`THANGSENG_NATIVE_VALIDATION.md`/catalogue side of this while writing
RULE-048; `GARO_GRAMMAR_REFERENCE.md`'s copy was still stale — relabeled
to RULE-048 and cross-referenced to the canonical entry. Lesson for next
session: **always grep `docs/GRAMMAR_RULE_CATALOGUE.md` for a rule
number before assigning a new one**, even in a secondary/informal notes
file — numbers need to be unique project-wide, not just within one file.

Docs-only, no code/data touched this session.

## Next session resume
1. **Check chat/relay for an answer first.** If Thangseng has answered
   any of the 3 questions above, that's the priority — process it the
   same way NV-112/113/114/117/118 etc. were processed: read the literal
   answer, don't infer beyond it, update
   `docs/THANGSENG_NATIVE_VALIDATION.md` with a new NV-1XX entry (check
   the highest existing NV number first — Claude A and Claude B both
   append to the same sequence, collide-check before numbering, as
   happened once this week already), then decide whether it unlocks a
   code change or is documentation-only.
2. **If no answer yet:** resync per standing procedure, re-run the full
   gate (don't trust this doc's claims), then check with the Project
   Owner for next priority. No other engineering item is currently
   queued — this is a genuine "waiting on evidence" state, not a
   backlog.
3. Do not touch `tryOnlyIdentityConstruction`'s third-person scope,
   RULE-038, or RULE-048's `bano` gap without a direct citation for
   that specific item.

## Repository status at close
- `git status`: clean, all committed and pushed.
- No local-only commits.
- This migration doc is the complete record for this session.
