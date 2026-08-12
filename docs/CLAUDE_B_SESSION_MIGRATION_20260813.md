# Claude B Session Migration — 2026-08-13

## Repository state at session close

- Checkpoint (to be confirmed after push): see `.ai/WORKSTATE.yaml` claude_b
  block for the committed hash.
- `HEAD == origin/main` confirmed, clean working tree, before and after
  every commit this session.
- Full build gate green: `prepare-data.js` → `test-dictionary.js` →
  `repository-intelligence.js` (0 new violations) → 203/203 unit tests →
  `eslint` (0 errors) → `vite build`.

## Resumed via

User-pasted `docs/CLAUDE_B_SESSION_MIGRATION_20260812.md`, checkpoint
`f67a16b`. Re-synced against actual repo state before acting per standing
resume protocol — found origin had advanced multiple times over the course
of this session (Claude A: counting-QA session, hundreds/thousands
classifier fix, `ba`/RULE-023 confirmation, currency-classifier fix, final
WORKSTATE checklist). Each advance was pulled clean (fast-forward or
rebase, zero conflicts) and the full build gate re-verified before
continuing.

## Work this session, in order

### 1. Dead-code removal (`e4cb0ce`)
Deleted `src/gemini.js` (confirmed zero imports anywhere — only stray
comments referencing "Gemini"). Removed the unused `@google/generative-ai`
dependency. Verified an external audit's companion claim — that
`compiled_dict_alternates.json`/`getAlternates()` is also dead — is
**false**; it's live in `translationEngine.js`. Left untouched.

### 2. The "wait" near-miss (investigated, reverted, documented — no code shipped)
Traced `"wait"` as a Check-F shadowing-bug candidate (`grammarOverrides`
intends `'Damo/Sengbo'`, `corrections.json`'s `'Damo'` wins at runtime and
shadows it completely). Project Owner confirmed `'Damo/Sengbo'` as
correct based on my report; editing `corrections.json` to match broke 2
regression tests (`tests/unit/translationEngine.test.js` ~lines 132/154).
That surfaced **RC-CANDIDATE-015** (2026-07-25): `'Damo / Sengbo'` was
itself a literal unresolved OCR placeholder, already investigated and
superseded by native-confirmed values (`'Damo'` bare imperative, RULE-036;
`'senga'` declarative root, via grammar-assembly). `corrections.json` was
already correct. Reverted both edits (`corrections.json`,
`known_cross_source_conflicts.json`) immediately, confirmed 203/203 +
clean tree, pushed nothing for this half.

**Standing lesson, now written into process (see gap ledger below): a
runtime data mismatch alone is never bug evidence. Always check
`tests/unit/*.test.js`, `docs/*.md`, and the raw source dictionaries for
prior history on that exact key before proposing a fix.**

### 3. Check F gap ledger — methodology, tooling, and first resolutions (`<this commit>`)
Project Owner directive: don't hand a static 300+ item backlog to Claude A
wholesale — resolve every engineering-only item directly, escalate only
genuine linguistic decisions.

**A second process failure, caught before it propagated further:** the
first version of the gap-analysis script used a `normalize()` that
stripped trailing punctuation, causing silent key collisions (`"eat"`
absorbed `"eat!"`'s `compiled_dict.json` value in the join). This produced
a materially wrong dataset — the `CHECK_F_GAP_REPORT_20260813.md` already
pushed earlier this session was built from it. Caught by directly
spot-checking `src/compiled_dict.json` for the `"eat"` key and finding it
didn't match the report. Rebuilt the tool
(`scripts/analyze-check-f-gaps.mjs`) to replicate
`repository-intelligence.js`'s exact `normalize()`/`joinKey()` logic —
verified byte-identical match counts (305) against a live
`repository-intelligence.js` run. **`compiled_dict.json` also changed
underneath this analysis 3 separate times this session as Claude A pushed
concurrent commits — the tool was re-run fresh against `origin/main` each
time rather than trusting stale output.**

**Resolved with real evidence (5 keys + 1 twelve-item batch, 17 of 305):**
- `eat` — not a gap at all; was purely the tooling bug above.
- `wait` — stale artifact, escalated (see above; `grammarOverrides['wait']`
  in `prepare-data.js` is the one-line fix, needs Claude A sign-off since
  it's native-confirmed-rule territory).
- `dance` — stale artifact, escalated. `corrections.json`'s `Chroka`
  (general dance) is directly native-confirmed (`VERB_INVENTORY.md`,
  Thangseng, 2026-07-14 — `Grika` is explicitly a *different*, narrower
  ceremonial-dance term). `master_dictionary.json`'s 4 `"dance"`
  candidates are all still `UNVERIFIED` and none is even `Chroka` — the
  confirmed value was simply never added to the source file. Flagged to
  Claude A (their file, not touched here); citation already exists, no
  new investigation needed on their end.
- `no` — not a bug. Three-way historical disagreement, but
  `corrections.json` winning was explicitly tested and confirmed correct
  in `RUNTIME_ENGINEERING_AUDIT_20260803.md`. No action needed.
- 12 punctuation-only items — intentional/cosmetic, no functional
  difference, no action needed. Full list in the gap ledger.

**Full detail, methodology, and the continuation checklist:**
`docs/CHECK_F_GAP_REPORT_20260813.md`. **288 of 305 items are not yet
investigated** — this is genuinely multi-session work; the doc lays out
the exact per-item process (grep tests/docs → check raw source dicts →
classify: stale artifact / not-a-bug / intentional exception / genuine
linguistic decision) so continuation doesn't restart from zero.

**New reusable tool:** `scripts/analyze-check-f-gaps.mjs` — regenerates
the full classified dataset fresh against current `compiled_dict.json` in
one command. Keep its `normalize()`/`joinKey()` byte-identical to
`repository-intelligence.js`'s if that file ever changes.

## Verification (this session, final)

- `git fetch` + rebase clean at every sync point, zero conflicts.
- `HEAD == origin/main`, clean working tree, confirmed immediately before
  this doc was written.
- Full `npm run build`: `prepare-data.js` → `test-dictionary.js` →
  `repository-intelligence.js` (0 new violations, 305 known/allowlisted
  — unchanged) → 203/203 unit tests → `vite build`, all green.
- `npm run lint`: 0 errors.
- No `master_dictionary.json`/`garo_dictionary.json`/`corrections.json`
  edits shipped this session (the one attempted `corrections.json` edit
  was reverted before commit).

## Explicitly NOT touched this session (handed to Claude A)

1. `grammarOverrides['wait']` deletion (`prepare-data.js` ~line 350) —
   one-line, needs sign-off per RC-CANDIDATE-015 history.
2. `master_dictionary.json`'s `"dance"` entries — add `VERIFIED` `Chroka`,
   citation already exists (`VERB_INVENTORY.md`).
3. The remaining 288 Check F gap ledger items.
4. Everything already carried from prior sessions and not re-actioned:
   the 410/523-item classifier-suffix native-review backlog (Claude A's
   own 2026-08-10/08-12 sessions), person/student/teacher root conflict,
   the 10-noun classifier-applicability question.

## Next session — where to start

1. `git fetch`, verify `HEAD == origin/main`, clean tree, before anything
   else.
2. Read `docs/CHECK_F_GAP_REPORT_20260813.md` in full — it's the actual
   task queue, not just a report.
3. `node scripts/analyze-check-f-gaps.mjs` — regenerate fresh, don't trust
   any cached output including this session's.
4. Work the "with test/doc evidence" items first (fastest to resolve
   correctly); the "no evidence found" ~191 need raw source-dictionary
   archaeology per item.
5. One key at a time. Evidence before conclusions. Update the ledger's
   resolved table before moving to the next key — that's what makes this
   resumable instead of restarting the same investigation every session.
