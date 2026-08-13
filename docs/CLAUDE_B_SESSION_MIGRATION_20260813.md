# Claude B Session Migration — 2026-08-13 (cont'd)

## Project identity
Lean-Garo-: Garo↔English translation app. Claude B's remit is Check F (runtime-cascade
source agreement: `corrections.json`/`phrase_maps.js` vs `compiled_dict.json`), engineering
files only. `master_dictionary.json` / linguistic decisions belong to Claude A — flag,
don't edit. Full per-item process is documented in `docs/CHECK_F_GAP_REPORT_20260813.md`.

## Current state
- HEAD: `d0a28b5`, `origin/main` — in sync, clean tree.
- Full build gate green: 203/203 tests, 0 lint errors, 0 new Check F violations.
- Claude A is actively pushing concurrently (rebase before every push; re-run full
  build gate after every rebase, not just before — `compiled_dict.json` shifts under you).

## Check F gap count
- Started this session at 305 allowlisted mismatches (17 already resolved prior session).
- Now at 291 (304 fresh baseline minus 13 fixed this session).
- 286 keys remain, all classified NO_VERIFIED_ENTRY — no mechanical shortcut left;
  each needs real investigation (grep tests/docs, check master_dictionary raw entries,
  classify, escalate to Claude A only if genuinely undecided).

## What's done this session (commits 381bc29..d0a28b5)
1. apple: stale corrections.json value (apal) fixed to match already-VERIFIED
   Apple (master_dictionary + compiled_dict were already correct).
2. 12 more stale corrections.json/phrase_maps.js entries fixed to match VERIFIED
   master_dictionary forms: the 8 "i want to X" phrases (ska -> sikenga suffix),
   orange, monkey (both files), chameleon.
3. beautiful: closed as not-a-bug. Sila is confirmed by 4 grammar docs; compiled_dict's
   Ka·danga traces to a case-duplicate key (Beautiful vs beautiful) in
   master_dictionary.json — flagged for Claude A, not fixed (out of file scope).

## What's held and why
- 286 NO_VERIFIED_ENTRY keys — genuinely need per-item work, no bulk shortcut
  exists. Don't attempt another mechanical pass; the two tried already (naive grep-for-
  evidence, VERIFIED-string matching) both had false-positive traps (see root cause below).
  Real investigation per key is the only reliable path.
- Case-folding gap in master_dictionary (Beautiful vs beautiful as separate
  english keys) — flagged in the ledger under beautiful, not investigated further,
  not Claude B's file to fix. Worth checking if this pattern recurs across other keys
  when Claude A has bandwidth.

## Root cause of process failures this session (both caught before push)
1. First evidence pass: grep -rlF key tests/*.md docs/*.md treated any substring
   hit as "evidence" — massively overcounted (200+ false positives on common words).
   Abandoned in favor of...
2. VERIFIED-match triage: 'VERIFIED' in notes.upper() is a substring bug — matches
   UNVERIFIED and matches "SUPERSEDED ... has VERIFIED" notes that describe a
   different entry's status, not the current row's. Produced a false "94 keys closed"
   result that was never committed (caught locally, discarded via git checkout).
   Fixed to notes.strip().startswith('VERIFIED') — correct count is 13 real fixes,
   not 94. Standing rule for future passes: any "VERIFIED" text match must be
   startswith, never a substring check, and must be verified with git status/git diff
   before committing, not just before pushing.
3. Even the corrected VERIFIED-match triage isn't sufficient alone — cooked matched by
   English-key string but was actually a different homonym/POS (verb past-tense vs.
   adjective ripe/cooked sense). Caught only because the build gate's regression test
   (translationEngine.test.js:184, "he cooked") failed. Standing rule: always run
   the full build gate (not just repository-intelligence.js) after any corrections.json/
   phrase_maps.js edit, before committing — the regression tests catch sense/POS
   collisions that string-matching can't.

## Standing rules (carried forward + new)
- One key at a time; evidence before conclusions.
- Update ledger before moving to the next key.
- Regenerate scripts/analyze-check-f-gaps.mjs output fresh each session/after each
  git pull — don't trust cached output, compiled_dict.json shifts as Claude A pushes.
- Fix directly if it's an engineering file (corrections.json, phrase_maps.js) and the
  correct value is already unambiguous (VERIFIED match, confirmed by full build gate).
  Flag to Claude A if it's master_dictionary.json or a genuine unresolved linguistic
  question with no existing evidence either way.
- Full build gate (tests + repository-intelligence.js + eslint) after every file edit,
  before every commit, and again after every rebase — not optional.
- Any text-matching heuristic (grep, substring check) must be spot-checked against 3-5
  real examples before being trusted at scale, and must use exact/anchored matching
  (startswith, word-boundary grep) not loose substring matching.

## Exact next step
Regenerate the gap dataset fresh (node scripts/analyze-check-f-gaps.mjs), take the
next key from the NO_VERIFIED_ENTRY set (286 remain, no priority order established,
alphabetical is fine), and run the full per-item process: grep tests/unit/*.test.js
and docs/*.md for real evidence (word-boundary, not substring), check the raw
master_dictionary.json entries and their notes in full, classify, update the ledger,
then fix (if engineering file + unambiguous) or flag to Claude A (if not). Commit and
push one key at a time, rebasing before each push.
