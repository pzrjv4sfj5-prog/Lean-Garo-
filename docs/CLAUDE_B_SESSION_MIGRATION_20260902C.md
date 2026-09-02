# Claude B Session Migration — 2026-09-02C (Finding 1 implemented)

## Scope this session
Implemented the structural fix for Finding 1, per
`docs/CLAUDE_B_TRACE_FINDING1_20260902.md`'s root-cause trace (previous
session, trace-only, no code changed). Did not redo the investigation.

## Fix
`src/sentenceBuilder.js`, `assembleSentenceSOV`: the elected verb
(`pairs[lastVerbIdx]`) is now routed through the existing
`getConjugationRoot()` (already imported from `morphologyEngine.js`)
before tense/negation suffixing — the same call `grammarEngine.js` already
makes at lines 401 and 422 for the grammar-assembly path. One import line,
one function-call change (`verbs.push(t)` → `verbs.push(getConjugationRoot(lw, t))`).
No new conjugation table, no `go`-specific branch, no linguistic data
touched — `getConjugationRoot` is a documented no-op for every verb without
a `conjugation_roots.json` entry, so this reuses the existing mechanism
exactly rather than adding a second one.

## Verification

- **Fix confirmed:** `translate("did not go")` → `"Re·angja"` (was
  `"re·ja"`), method `sov-assembly`, unchanged confidence 0.75.
- **Unit tests:** 290/290 pass (284 baseline + 6 new). Added to
  `tests/unit/translationEngine.test.js`:
  1. The fix case itself (`did not go` → `Re·angja`).
  2. `will not go` unaffected (resolves via `corrections.json`, never
     reaches `sov-assembly`).
  3. `will not be going` unaffected (resolves via exact-phrase).
  4. Bare `go` unaffected (resolves via phrase-map to the bare `re·a` root
     — confirms the fix doesn't leak the conjugation stem into contexts
     that correctly want the bare form).
  5. `did not eat` byte-identical before/after — confirms `getConjugationRoot`
     is a true no-op for a verb with no table entry (generalization guard,
     not `go`-specific).
  6. `he did not go` byte-identical before/after — confirms the
     grammar-assembly path's own, separate `getConjugationRoot` call
     (already existing, untouched) is unaffected.
- **Build:** `vite build` green, no errors.
- **Live matrix** (24 sentences spanning go/eat/sleep/drink/come across
  present/past/future/negative/chim, subject and subjectless): every case
  matches its pre-fix value except the one bug case, with one documented
  exception below.
- **Diff scope:** `git diff --stat` shows exactly `src/sentenceBuilder.js`
  (+23/-2, all comment + the one-line change) and the test file (+50). No
  file under `src/data/` appears in the diff — confirmed no linguistic
  data changed.
- **Working tree:** `dist/index.html` (build artifact) discarded via
  `git checkout` both times it appeared: not a real change, and not
  committed.

## Side-effect observed (documented, not fixed — out of scope)
`"used to go"` via `sov-assembly` changed from `"re·a"` to `"Re·ang"`.
Both are wrong: this fallback path has never applied a `chim` suffix at
all (a separate, pre-existing gap — `assembleSentenceSOV`'s tense-handling
only branches on `future`/negation, nothing for `chim`). No test locks in
the old value; confirmed via `git grep` before pushing. Not fixed here —
flagging for a future, separately-scoped session rather than expanding
this fix's blast radius.

## Governance-model check
No mechanism/governance code changed. Fix is a pure engineering
correction reusing an already-verified mechanism (`getConjugationRoot`,
already used by `grammarEngine.js`) — not new linguistic content, no
native-data question raised.

## Finding 2 — untouched
`tryOnlyIdentityConstruction` and its two open composition questions
remain exactly as documented in `docs/CLAUDE_B_SESSION_MIGRATION_20260902.md`.
Still blocked on Claude A / native sign-off. Not touched this session.

## Verification scope this session
- [x] Baseline reconfirmed clean before starting (HEAD `bfc3ef6`, no drift,
      `git status --short` empty).
- [x] Full unit suite: 290/290 (284 + 6 new).
- [x] Full build: green.
- [x] Live tense/negation matrix: 24 sentences, no unintended regressions
      (one documented pre-existing-bug side effect, not a regression).
- [x] Diff inspected: scoped to `src/sentenceBuilder.js` + tests, zero
      `src/data/*.json` changes.
- [x] WORKSTATE.yaml updated (this session's entry + preserved prior entry
      under `next_action_prior_20260902C`).
- [x] Working tree clean of unintended changes (build artifact discarded).

## Next session resume
1. `git fetch origin`; verify HEAD == this doc's commit; re-run gate.
2. Finding 1 is closed. Finding 2 still needs Claude A / native input
   before any engineering change.
3. Optional, separately-scoped follow-up (not urgent, not Finding-1/2):
   `assembleSentenceSOV` has no `chim`-tense handling at all — worth a
   dedicated session if `chim` constructions matter for book-translation
   coverage.
