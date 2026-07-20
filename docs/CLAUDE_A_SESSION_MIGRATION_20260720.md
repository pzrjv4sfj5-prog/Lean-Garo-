# Claude A Session Migration — 2026-07-20

You are resuming as Chief Linguistic Curator for the Lean-Garo project.
This document is ground truth for THIS handoff, but the repository is
the permanent single source of truth — if anything here conflicts with
the repo, the repo wins. Re-sync with actual state before acting.

## Immediate first steps
1. `git fetch origin main && git merge --ff-only origin/main`
2. Confirm `git log --oneline -1` shows `e3962bf` or later.
3. `npm test` (expect 77+/77) and `node repository-intelligence.js`
   (expect PASSED) — if either fails, something changed since this doc
   was written; investigate before doing anything else.
4. Check for new Claude B commits since `e3962bf` and read them.
5. Do NOT re-summarize this doc back to the user. Just confirm sync
   and continue the work below.

## Role and standing rules
- You are Claude A: linguistics, grammar, morphology, vocabulary
  review, repository quality. Claude B does engineering (engine code,
  pipeline tooling). Division of labor is real — don't casually touch
  `src/translationEngine.js` internals; do flag issues for Claude B
  with a precise diagnosis, the way RC-CANDIDATE-020/021 were handed off.
- **Push discipline (every commit):** `git fetch` → merge/rebase if
  behind → make changes → `npm test` → `node repository-intelligence.js`
  → commit → `git fetch` again (Claude B commits concurrently often) →
  rebase if needed → push. Never assume you're still at HEAD from a
  prior step.
- **Token discipline (explicit user request, 2026-07-19):** no filler,
  no restating requests, lead with results. Batch git operations (one
  fetch+merge, one add+commit+push, not spread across calls). Don't
  `cat`/full-view large files — use `grep`/targeted `python -c`. Do
  review decisions in one Python script per batch, not per-entry tool
  calls. Cut narration of routine steps to one line.
- **Evidentiary tiers:** Tier 1 = direct live session with Thangseng.
  Tier 2 = relayed (WhatsApp, via Tridip) — most of what you'll see.
  Never silently "correct" a relayed quote toward what seems more
  proper — verbatim fidelity matters (see the `apal`/`apple` incident
  below, a real error you made and caught).
- **Integration rule:** new linguistic evidence gets logged to a
  `PENDING_LINGUISTIC_PROPOSAL_*.md` doc first, reviewed, THEN
  committed to `corrections.json`/`master_dictionary.json`/grammar
  docs. Never implement chat-relayed content straight into production
  without that review step.
- **Homonymy discipline:** when a printed dictionary headword lists
  several senses together, don't assume they're all one polysemous
  word. Check for the "Grika pattern" (unrelated meanings lumped under
  one headword, at least one wrong) before trusting a multi-sense
  cluster wholesale — this recurred with `Bal` (wind vs. load/burden)
  and is worth checking again on any new page.

## Architecture: the vocabulary pipeline (current, stable)
```
Printed Dictionary → Gemini (OCR, garo_to_english schema)
                   → [MECHANICAL, now runs OUTSIDE this chat]
                      flip-garo-to-english.js (Stage 1, deterministic)
                      reduce-to-flat.js (Stage 2, deterministic)
                   → src/data/pending_lexicon.json (staged, unreviewed)
                   → Claude A review (approve/reject/conflict resolution)
                   → scripts/promote-lexicon.js → master_dictionary.json
                   → npm run build → src/compiled_dict.json
```
- There is no "Claude D." The flip/reduce stages are pure code
  (`scripts/flip-garo-to-english.js`, `scripts/reduce-to-flat.js`) —
  deliberately not an LLM, because the transformation is fully
  mechanical and an LLM only adds drift risk. Spec:
  `docs/CLAUDE_D_TRANSFORMATION_SPEC.md`. Verification gate:
  `scripts/verify-claude-d-flip.js`.
- **As of this session, the Project Owner runs flip+reduce themselves**
  in Google Colab using a verified Python port (byte-identical output
  confirmed against the JS reference on real data before handoff). They
  send you the small flat output file (`lean_garo_flat_batch.json`),
  not raw Gemini JSON. This is the main token-saving change — don't
  ask them to paste raw Gemini output anymore; ask for the flat file.
- `import-dictionary.js` **never auto-promotes anything**, clean or
  not (explicit Project Owner directive, 2026-07-17/18). Everything
  stages to `pending_lexicon.json` as `review_status: "unreviewed"`.
  Only `promote-lexicon.js --all-approved --apply` (or `--id`) moves
  anything to `master_dictionary.json`, and only for records you've
  marked `"approved"`.
- Standard batch-review workflow (used successfully across ~1050
  entries this session):
  1. `node scripts/import-dictionary.js <flat.json> --source "..." --source-page "N" --ocr-version "..." --apply`
  2. One Python script: bulk-approve unflagged + structurally-flagged
     (dual-POS, verbatim typos) entries; individually reason through
     anything with a real `conflict` field or genuine uncertainty.
  3. **Check every `existing-conflict`/`within-batch` conflict
     programmatically for case/raka-only duplication before assuming
     it's a legitimate synonym** — this caught 6 real duplicates this
     session that a "different word = fine" assumption would have
     missed. Pattern: normalize both strings (strip `·`/`.`/spaces,
     lowercase) and compare.
  4. `promote-lexicon.js --all-approved --apply`
  5. `npm run build && npm test && node repository-intelligence.js`
  6. New `known_dictionary_conflicts.json` flags after promotion are
     expected (legitimate synonym clusters) — add them to the
     allowlist with a one-line citation, don't just suppress blindly.
  7. One commit per page or logical batch, not per-entry.
- **Reverse translation (Garo→English) is explicitly NOT being worked
  on yet** (Project Owner directive, 2026-07-18) — focus is Phase 1
  (English→Garo) only, until it's solid and bug-free. The Gemini
  canonical Garo→English JSON is still the ultimate source for both
  directions eventually; don't discard it.

## OCR queue status
**All 13 known dictionary pages fully processed** (3, 4, 5, 16, 17,
18, 19, 35, 37, 38, 39, 87, 88, 89 — note 18 needed a backfill pass
after a pipeline bug, see below). ~1050 entries reviewed, ~1020
promoted. More pages may arrive from the Project Owner at any time —
same workflow applies.

## Pipeline bugs found and fixed this session (all resolved, don't re-break)
1. `reduce-to-flat.js` used to silently DROP every
   `flagged_for_review` entry (written for the old auto-promote
   architecture). Fixed to include them with the OCR concern folded
   into `notes`. Required a backfill of 14 page-18 entries that had
   been silently dropped before the fix.
2. `verify-claude-d-flip.js` had two false-positive bugs, both fixed:
   (a) didn't handle repeated headwords correctly (this dictionary
   genuinely has them, e.g. two separate "Bal" entries) — now matches
   by full carry-field signature across all rows sharing a headword,
   not just the first. (b) treated "key absent" differently from
   "key present but null" for `leading_continuation_text` — now
   normalized with `?? null` before comparing.
3. Manually-added `pending_lexicon.json` records must match the exact
   schema `import-dictionary.js` produces (including `promotion_status:
   "pending"`, not `"unpromoted"` — a real value-name error made and
   fixed this session). Copy an existing real record's shape rather
   than guessing fields.

## Open linguistic items — do not touch without resolution
Full detail in `docs/THANGSENG_NATIVE_VALIDATION.md` (canonical relay
queue, keep using this doc — don't create new per-question files).

**Awaiting the 3-question relay sent 2026-07-19 (approved, sent
verbatim):**
1. Does `ska` work directly after a bare object ("I want water/food"),
   or does it need a verb+`na` construction?
2. Is "need" also `ska`, or a different word (maybe `nanga`)?
3. Is the hyphen in `Kolomko bag-o sikatbo` the same mark as the
   apostrophe-for-raka convention, or something else?
Until these come back: do NOT touch the "need"→`sikenga` entry, the
three object-only want-sentences (water/food/"see you"), or anything
using `bag-o`/`sikatbo`.

**Other open NVs (see the doc for full list):** NV-020 (does `Bal`
genuinely also mean flower/air/big-basket, or just load/burden — those
3 senses are live in production but flagged lower-confidence pending
this). Several fully-resolved NVs from 2026-07-18/19 are logged there
too (NV-001, 002, 010, 013, 016, 017, 018, 019, 021 mostly closed) —
don't re-ask what's already answered, check the doc first.

**Known real production bugs (Claude B's side, tracked, not yours to
fix directly):**
- RC-CANDIDATE-017: locative negation loss — genuinely open linguistic
  question about whether Garo has a distinct "to-be-under" stative verb.
- RC-CANDIDATE-021: no interrogative-marking (`ma` suffix) anywhere in
  the engine. RC-018's fix (floating `·gen` token) is done and correct
  for declaratives, but questions now silently come out as fluent-
  looking declaratives instead of erroring obviously — flagged as
  higher-risk than the old visible bug precisely because it looks fine.
  Only one native data point for `ma` exists; don't generalize broadly
  without a second confirmation.

## A real error made and corrected this session (methodological lesson)
Committed `"will you eat an apple"` → `Na·a apal cha·genma?`, silently
substituting the dictionary's existing `apal` for the bare English
`apple` the native speaker actually said. The bare-loanword insertion
WAS the evidentiary point (supports RC-CANDIDATE-005, English loanword
passthrough) — substituting it erased the data. Caught only because
the Project Owner re-pasted the original relay text rather than
trusting a prior summary. Lesson applied since: always re-verify
`corrections.json` additions against verbatim source text, not a
paraphrase, especially your own.

## Next immediate step
No specific task is queued — waiting on (a) the 3-question relay
answer, and (b) any new OCR pages from the Project Owner. When they
arrive, apply the standard batch-review workflow above. If nothing is
pending, ask the Project Owner what's next rather than assuming.
