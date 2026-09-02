# Claude B Session Migration — 2026-09-02D (session close)

## ⚠️ Correction to incoming instructions
This session was instructed to record Finding 1 as "investigation complete;
structural fix NOT yet implemented" and to tell the next Claude B to
**implement** the fix. **That is stale.** Resync against actual repo state
(commit `20833a7`, already pushed, prior to this session) shows Finding 1
was already implemented, tested, and pushed in the immediately preceding
session. This doc records the TRUE current state below, not the instruction
text, per standing resync discipline (never assume nothing changed).

## Scope this session
Documentation/migration only. Resynced against `origin/main` (one new
Claude A commit had landed — data-only, fast-forwarded cleanly, see below).
No engine code or linguistic data modified this session.

## Resync finding
`origin/main` had advanced one commit beyond this session's start point:
`5298e68` (Claude A) — NV-108/109/110/111 closed (can word order, counting
classifiers, adjective order, purpose -na), 6 net new dictionary rows,
gate reconfirmed green by Claude A (8209/8209, 9/9, 284/284→290/290 n/a at
their check, 0 new violations). Relay doc: 4 items closed, 2 remain open
(question-word+ending co-occurrence; "only-X" sign-off, resent with a
confusion acknowledgment — still no answer for Finding 2). **No engine
code touched** by that commit. Fast-forwarded cleanly (no rebase needed,
no local unpushed work existed).

## Finding 1 — STATUS: CLOSED (implemented, tested, pushed)
- **Bug:** `translate("did not go")` → `"re·ja"`, expected `"Re·angja"`.
- **Root cause (confirmed, see `docs/CLAUDE_B_TRACE_FINDING1_20260902.md`):**
  the intended fix path (`grammarEngine.js:395-422`) is unreachable for
  subjectless sentences — `analyzeGrammar`'s subject/verb-finding block is
  gated on `PRONOUN_MAP[firstWord] || npSubjectGaro`, both false for "did
  not go". Translation instead falls through to `assembleSentenceSOV`
  (`sentenceBuilder.js`), a second, independent verb-resolution path that
  had no knowledge of the `conjugation_roots.json` go/`Re·ang-`
  stem-decoupling table `getConjugationRoot()` provides.
- **Fix implemented (commit `20833a7`):** route the elected verb
  (`pairs[lastVerbIdx]`) through the existing `getConjugationRoot()` in
  `sentenceBuilder.js` before tense/negation suffixing — one import + one
  line, no new table, no `go`-specific branch. No-op for every verb
  without a `conjugation_roots.json` entry.
- **Verification (already done, see `docs/CLAUDE_B_SESSION_MIGRATION_20260902C.md`):**
  `translate("did not go")` → `"Re·angja"` ✓. 6 new regression tests added
  (290/290 total, was 284). Build green. 24-sentence live tense/negation
  matrix run, no unintended regressions. Diff confirmed scoped to
  `src/sentenceBuilder.js` + tests only — zero `src/data/*.json` changes.
- **One documented, unfixed side-effect (not a regression, out of scope):**
  `"used to go"` via `assembleSentenceSOV` was already missing its `chim`
  suffix before this fix (separate, pre-existing gap — this fallback has
  no `chim`-tense handling at all) and still is after; no test covers it.
  Worth a dedicated future session if `chim` constructions matter for
  book-translation coverage.
- **Nothing further required on Finding 1** unless new evidence surfaces a
  contradiction.

## Finding 2 — STATUS: OPEN, still blocked on native sign-off
- `"i am the only student"` → currently `"Anga chattro·ko mangmang"`
  (method `grammar-assembly`, confidence 0.82) — subject-slot "I am the
  only X" copular form, did not route through `tryOnlyIdentityConstruction`
  at all. No native-backed expected form on record.
- `"the only fruit i eat is mango"` → currently `"Angade te·ga·chu
  Bitekosan Cha·aia"` (method `only-identity-construction`, confidence
  0.85) — same construction family as the one verified "language" case,
  but not itself individually verified against native data.
- **Status update this session:** Claude A resent the "only-X" relay
  question to Thangseng (`docs/THANGSENG_RELAY_QUESTION_20260901B.md`,
  per commit `5298e68`) "with a confusion acknowledgment" — still
  **no answer received**. Still blocked.
- **Next action:** do not modify `tryOnlyIdentityConstruction` or add a
  subject-slot rule until Claude A reports a native answer.

## Other open items (carried forward, unchanged)
- `assembleSentenceSOV` has no `chim`-tense handling at all (surfaced as
  a side-effect above, not previously tracked as its own item) — flagged,
  not scoped, not urgent.
- Relay doc's other open item (question-word + ending co-occurrence) is
  Claude A's lane, not tracked in detail here — see
  `docs/THANGSENG_RELAY_QUESTION_20260901B.md` for specifics.

## Closed items (preserved, for reference — do not reopen without new evidence)
- Finding 1 (this doc, above) — CLOSED.
- NV-105 (Sak = human/people classifier) — closed by Claude A, prior session.
- NV-106 (ama lexical meaning, pure modal) — closed by Claude A, prior session.
- NV-107 (Mejal/me·ja·o/Mejao semantic scope) — closed by Claude A, this
  session's fast-forward (`30957e5`). Does not reopen NV-104.
- NV-108/109/110/111 (can word order, counting classifiers, adjective
  order, purpose -na) — closed by Claude A, this session's fast-forward
  (`5298e68`). Note: counting-classifier finding flagged a RULE-038
  tension but was **not shipped** (broke a regression test, reverted by
  Claude A) — worth checking `docs/THANGSENG_NATIVE_VALIDATION.md` if that
  resurfaces.

## Governance-model check
No mechanism or governance code changed this session (docs/migration
only). AI-001 subclass (b) status unchanged.

## Verification scope this session
- [x] Resynced against actual `origin/main` before writing anything
      (found and fast-forwarded one new Claude A commit, data-only).
- [x] Gate reconfirmed clean at fast-forwarded HEAD: 290/290 tests.
- [x] No engine code or linguistic data modified this session.
- [x] Corrected the incoming instruction's stale claim about Finding 1's
      status rather than propagating it.

## Next session resume — explicit, unambiguous
**Finding 1 is CLOSED. Do NOT re-implement it.** There is no pending
structural fix for Finding 1 — it shipped in commit `20833a7`
(`docs/CLAUDE_B_SESSION_MIGRATION_20260902C.md` has full verification
detail). The next Claude B session should:
1. `git fetch origin`; verify HEAD matches this doc's commit; re-run gate
   (don't skip — always resync against actual state, not this doc's own
   claims, per standing procedure).
2. Check whether Finding 2's relay question has an answer yet
   (`docs/THANGSENG_RELAY_QUESTION_20260901B.md`). If yes, implement
   accordingly with native sign-off in hand. If no, Finding 2 remains
   blocked — do not guess.
3. If Finding 2 is still blocked and no other priority item is open, this
   is a natural point to ask the Project Owner for the next priority
   (e.g. broader subjectless-sentence coverage, the `chim`-handling gap
   noted above, or a fresh audit pass).
