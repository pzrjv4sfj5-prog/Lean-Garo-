# Claude B Session Migration — 2026-09-08

## Project identity
Lean-Garo: English→Garo translation engine (`translate()` in
`src/translationEngine.js`, cascading through phrase/dictionary lookup,
stopword-stripping, grammar-assembly, sov-assembly fallback).

## Resumed from
`docs/CLAUDE_B_SESSION_MIGRATION_20260907C.md`. Resync on arrival found
6 commits landed since that doc's recorded tip (`2dc1756`) — all
inspected: Claude A's axe idx-3130 garo-field pollution fix, an
angry-cluster relay-queue note, and two session-close migration-doc
commits (Claude A's and Claude B's own 907C doc). No conflicts, no
divergence. Full gate re-run clean before any new work (see prior
turn's verification), per standing rule: do not re-verify Bug A/Bug B,
already closed in 907C.

Read `docs/lean_garo_thangseng_reconciliation_v2_machine_ready.json`
(Project Owner / Thangseng directives) before any reconciliation work,
per explicit instruction at session start.

## What's done this session

### 1. "an elephant" corrections.json fix — DONE, tested, pushed
`corrections.json`'s `"an elephant"` key held `"mangsa buring·o"`,
overriding the otherwise-correct `"elephant"` → `mongma` resolution.
The reconciliation package's `specific_cleanup.elephant` explicitly
lists `buring·o` under `delete_wrong_live_values`. Changed to
`"mongma"`, matching both the bare `"elephant"` key and the
reconciliation's `an_elephant: mongma` confirmation. Standalone
`corrections.json` entry with no `master_dictionary.json` row of its
own — no case-collision or tied-candidate risk. Added
`tests/unit/an_elephant_correction.test.js` (3 tests). Commit
`643fa62`.

### 2. "boy"/"girl" reconciliation keys — investigated, deliberately NOT touched
The reconciliation's `key_confirmations` (`boy: "Me·a"`,
`girl: "Me·chik"`) do not exactly match either live `pickPrimary`-tied
candidate:
- lowercase `"boy"` → `"me·a bi·sa"`, VERIFIED/HIGH, with a **direct
  Thangseng quote citation** (NV-130, WhatsApp relay via Tridip:
  *"me.a bi.sa = boy, me.chik bi.sa = girl"*)
- capitalized `"Boy"` → `"ko·ka"`, VERIFIED/HIGH, **no citation**

`pickPrimary` lowercases before matching, so these two unrelated rows
collide into a false tie — the same case-collision shape as the
"answer"/"Answer" trap already documented in `WORKSTATE.yaml`
(`claude_b_resync_sweep.latest_report`). Overwriting the cited
`"me·a bi·sa"` with the reconciliation's shorter, uncited `"Me·a"`
would mean discarding a directly-quoted native source on my own
linguistic judgment call — outside Claude B's engineering-verification
scope. **Left untouched, flagged for Claude A / Project Owner**: is
`"Me·a"` shorthand for the cited `"me·a bi·sa"`, or a distinct
intended value? Same question applies to girl.

### 3. Open item 3 (very-hot generalization) — CLOSED, per Project Owner confirmation in chat
Project Owner confirmed directly in this session's chat: `hot = Ding·a`
is correct, and the existing `tryVeryHotConstruction` mechanism (added
20260907, narrowly scoped to the one attested sentence pattern) is
sufficient — no further generalization required before closing. Live
verification this session, no code changes needed:
- `"it is very hot"` → `namen Ding·a` (very-hot-construction, 0.85)
- `"it's very hot"` → `namen Ding·a` (very-hot-construction, 0.85)
- `"it is very hot today"` → `Da·alo namen Ding·a` (very-hot-construction, 0.85)

Per the project's `.ai/PROJECT_OWNER_AUTHORITY.md` convention, a
directive given directly in chat is authoritative and needs no
separate transcript before being acted on. Closed as resolved rather
than "blocked pending evidence" — the block itself is lifted by this
confirmation, not by new generalization work. **Still narrowly scoped**
to the attested construction shape (subject + optional time-word +
"very" + adjective); has not been generalized to other adjectives
(cold/tall/etc.) or other constructions, and nothing in this session's
evidence claims it should be. If broader generalization is wanted
later, that's new scope, not a reopening of this item.

### 4. Open item 5 (`ball` fuzzy false-positive) — CLOSED, per Project Owner confirmation in chat
Project Owner confirmed `ball = robol` directly in chat. Live
verification this session, no code changes needed:
- `"ball"` → `robol` (exact-phrase, 0.98)

No fuzzy-match false-positive observed at current `translate()`
behavior. Closed as resolved.

## Gate results (final, this session's close)
- `node prepare-data.js`: 8249 unique entries, zero diff against
  committed compiled artifacts (only `corrections.json` changed this
  session; it's applied at runtime, not baked into `compiled_dict.json`,
  so no compiled-artifact diff is expected).
- `node test-dictionary.js`: 8249/8249 valid, 9/9 grammatical
  corrections.
- `node repository-intelligence.js`: 0 new violations across all 8
  checks.
- `node scripts/resync-stale-overrides.mjs`: 0 new candidates (1
  pre-existing, unrelated `build`/`Rika` skip, unchanged).
- `node --test tests/unit/*.test.js`: **364/364** at final pushed tip
  (360 at prior close, +3 from this session's elephant regression test,
  +1 net from Claude A's concurrent commit landing mid-session — see
  Push and resync below).
- `node scripts/runtime-error-sweep.mjs`: 14,743 `translate()` calls,
  **0 errors**.
- Live spot-checks this session: `axe` (confirmed from prior turn),
  `an elephant`, `elephant`, `ball`, `it is very hot`, `it's very hot`,
  `it is very hot today` — all resolve as expected, no `[UNKNOWN]`.

## Standing rules (confirmed followed this session)
- `git fetch` before every push — done, confirmed no concurrent commits
  before pushing.
- Regenerate `compiled_dict.json`/reports via `node prepare-data.js`
  from merged source rather than hand-merging — done.
- One task per commit — elephant fix is its own single commit
  (`643fa62`), fix + regression test together.
- Migration doc written and pushed before ending the session — this
  file.
- Project Owner directives given directly in chat treated as
  authoritative per `.ai/PROJECT_OWNER_AUTHORITY.md` — applied to
  closing items 3 and 5; provenance labeled as "Project Owner
  directive" in both closure notes above, not mislabeled as a direct
  or reported native quote.

## Open issues, with root cause where known
- **boy/girl case-collision vs. reconciliation shorthand** (new this
  session, see item 2 above) — needs Claude A or Project Owner to
  confirm whether `"Me·a"`/`"Me·chik"` in the reconciliation file are
  shorthand for the cited `"me·a bi·sa"`/`"me·chik bi·sa"`, or distinct
  intended values.
- **Longstanding, unchanged this session**: the 26-key `pickPrimary`
  verified-tie report (`docs/PICKPRIMARY_VERIFIED_TIES.md`, includes
  boy/girl above) still needs native disambiguation.
- **PAT credential handling**: the PAT provided in this session's chat
  authenticated correctly for the one push made. Per standing practice,
  **recommend rotating/revoking it** now that the session is closing —
  it was pasted directly into chat history.

## Push and resync
2 commits this session: `643fa62` (elephant fix) and this doc's own
commit. Before the second push, `git fetch` surfaced a concurrent
Claude A commit (`8220f36`, "Reconciliation v2 cleanup:
elephant/cat/teacher/dog/dead-body/forest") — inspected, no conflict
(it fixed an unrelated `forest`→`mongma` collision in
`corrections.json`; this session's `an elephant` fix was untouched and
already correct in their tree). Rebased cleanly onto it, full gate
re-run at the merged tip (364/364 unit tests — 361 from Claude A's
commit + 3 from this session's elephant test — 0 new
repository-intelligence violations, 0 resync candidates, 0 runtime
errors across 14743 calls, zero `prepare-data.js` diff), then pushed
(`231ba6b`). One more concurrent commit landed immediately after
(`80b2f85`, Claude A's own session-close migration doc, docs-only, no
overlap) — rebased again, gate re-verified clean (zero diff, 364/364
unchanged), pushed. **Final `HEAD` == `origin/main` == `ad1cac0`**,
confirmed clean (`git status --porcelain` empty). Given how fast
origin is moving with concurrent sessions, the next Claude B should
treat `git fetch && git rev-parse origin/main` as ground truth over
this hash the moment any doubt exists — this doc's numbers were
already stale once mid-session.

Worth noting: Claude A's concurrent commit independently flagged the
exact same boy/girl conflict this session found (item 2 above) — NV-130's
detailed quote vs. the reconciliation's bare answer vs. ko·ka/ko·ki —
so that finding is now cross-confirmed from both sessions, not just
this one's read.

## Exact next step for the next session
1. `git fetch origin`, confirm `HEAD` at this doc's committed hash or
   later (check for anything landed in the meantime).
2. Re-run the gate once at the top (do **not** re-verify the elephant
   fix, or items 3/5 — all confirmed closed in this doc).
3. No specific new task assigned by the Project Owner as of this doc.
   Suggest picking up the boy/girl case-collision question above, or
   check `WORKSTATE.yaml`/`docs/PICKPRIMARY_VERIFIED_TIES.md` for
   anything queued between sessions.
