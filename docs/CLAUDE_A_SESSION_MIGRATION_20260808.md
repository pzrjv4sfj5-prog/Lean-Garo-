# Claude A Session Migration — 2026-08-08

## Project identity
Lean-Garo: Garo language dictionary + English-to-Garo translation engine.
Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Claude A = linguistic
authority (grammar/morphology/dictionary quality/native validation
review) only — never touches engine code (Claude B) or OCR ingestion
(Claude D). Project Owner (T) relays native-speaker confirmations from
Thangseng via Tridip/WhatsApp.

## Current commit/state
- HEAD `1aad3fe`, confirmed == `origin/main`, `git status` clean, zero
  divergence.
- 8061/8061 dictionary entries valid, 196/196 unit tests passing,
  `repository-intelligence.js` 0 new violations across all checks (A–F).
- Nothing local, nothing uncommitted, nothing pending push.

## What's done this session
- **NV-067**: `mouth` = `Ku·sik` promoted VERIFIED/HIGH (`Kusik`
  no-raka duplicate SUPERSEDED); `smiled` reconfirmed unchanged.
- **NV-068**: corrected a wrong `dambe`/`bi·sa` framing already relayed
  to Claude B (2026-08-07) — that framing implied `bi·sa` alone meant
  "young one." Corrected to two distinct morphemes: `dambe` = "young",
  `bi·sa` = "offspring." (This turn also added `young goat` = `Do·bok
  dambe`, which NV-069 later retracted — see below.)
- **NV-069** (Project Owner correction round, same session): final
  closure of the whole cluster.
  - **Deleted outright** (not SUPERSEDED — explicit PO instruction,
    confirmed wrong/nonexistent): `young` = `pi·sa`; `young goat` =
    `Do·bok dambe` (Claude A's own NV-068 error, retracted).
  - **New/reconfirmed VERIFIED/HIGH**: `young` = `dambe` (universal);
    `children` = `Bi·sarang` (plural, old bare `children=Bi·sa`
    SUPERSEDED — singular/plural distinction, not a wrong-word case);
    `calf` = `matchu bi·sa` (new; `ba·sur`/`ma·su gen·da` SUPERSEDED);
    `puppy` = `achak bi·sa` (tagged final, value unchanged); `book` =
    `Ki·tap` (**RECONFIRMED**, reverses the 2026-08-01 corpus-audit
    call that had promoted `boi`; `boi` now SUPERSEDED); new sentence
    `the book is on the table` = `Ki·tap tebilo ong·a`.
  - **Unchanged, already correct**: `child`/`offspring` = `bi·sa`,
    `goat` = `Do·bok`, `table` = `te·bil`, `kid` = `Do·bok bi·sa`
    (English gloss on the phrase-form entry corrected from "Kid (young
    goat)" to "Kid (goat child)" — value unchanged).
  - Propagated to `phrase_maps.js` (`book`), `final_entries.json`
    (orphaned/non-pipeline, synced anyway for full-repo consistency per
    standing instruction), `known_dictionary_conflicts.json` (+
    `children`, genuine new multi-value key).
  - Full duplicate sweep of the entire bi·sa/dambe/young/calf/book/
    table cluster (23+ rows) across every source file: zero exact-key
    duplicates found or remaining.
  - PL-0002014 approved + promoted; zero pending-lexicon entries remain
    for this cluster.
  - Fixed 1 stale test (`RC-CANDIDATE-010` in
    `tests/unit/translationEngine.test.js`) that hardcoded the old
    `boi`/`te·bil·o` grammar-assembly output for "the book is on the
    table" — it now correctly resolves via exact-phrase with the
    native-confirmed sentence value. This is a genuine improvement, not
    a regression; the test's other assertion (grammar-assembly path via
    "the market is far") is untouched and still passes.
- **Synced with Claude B three times mid-session**, all clean merges,
  rebuilt and re-verified after each:
  1. `9b5d61b` — Claude B's critical SUPERSEDED-precedence fix (the
     `pickPrimary()` bug from the prior session's handoff). Verified
     live: `pineapple` now correctly compiles to `a·na·ros`.
  2. Claude B's Item 2 ship (`normalizeGaro()`/near-duplicate
     detection).
  3. Claude B's duplicate-`buy`-key lint fix in `phrase_maps.js`.
- Updated `.ai/WORKSTATE.yaml` (`claude_a.latest_9`, full NV-067/068/069
  summary) and `.ai/SESSION_BOOTSTRAP.md` (new do-not-repeat entry:
  don't trust PO-relayed generalized pattern examples, or Claude A's
  own extrapolations from a verbatim transcript, without cross-checking
  already-VERIFIED corpus entries first — case study is this session's
  own `young goat` and the relayed `achak bi·sa=calf` example, both
  ungrounded).

## Held / not done, and why
Nothing from this session's explicit task list was held — everything
requested was closed, verified, and pushed.

## Open issues, with root cause where known
- **`compiled_dict.json['smile']` still ships the unconfirmed variant**
  `ka·ding·sim·ik·a` instead of VERIFIED/HIGH `Ka·dingsmita`. Root
  cause (flagged NV-067, confirmed still unfixed as of this session's
  final merge): `prepare-data.js`'s `pickPrimary()` master-preference
  branch ignores `isVariant` entirely, so a lone variant-tagged master
  entry (english key `"Smile"`) wins outright over the correct
  bare-infinitive alias from `"To smile"`. Same failure shape as the
  SUPERSEDED-precedence bug (`9b5d61b`) but for `isVariant`, not
  `isSuperseded`. Not fixed by Claude B's Item 2 session. Engine logic
  — Claude B's territory, not re-actioned by Claude A this session.
- Flagged, not acted on (evidence-first — no direct native confirmation
  for these specific words): existing `pi·sa`-adjacent confusion is
  now resolved (deleted), but no new animal-compound vocabulary beyond
  what was explicitly confirmed (`achak bi·sa`, `matchu bi·sa`,
  `do·bok bi·sa`) was added speculatively.

## Standing rules established or reinforced this session
- Deletion (not just SUPERSEDED-tagging) is warranted when the Project
  Owner gives an explicit, repeated instruction to delete a confirmed-
  wrong entry — overrides the default citation-discipline convention
  for that specific case, on explicit PO authority only.
- PO-relayed generalized pattern examples (as opposed to verbatim
  quoted native transcript) need corpus cross-checking before being
  trusted — see the new `SESSION_BOOTSTRAP.md` do-not-repeat entry.
- Claude A's own extrapolations from a verbatim transcript into new
  vocabulary need the same scrutiny as relayed examples — the
  `young goat` entry (added, then retracted this same session) is the
  case study.

## Exact next step
No task in progress. Repo is at a clean, fully-synced checkpoint
(`1aad3fe`). Next session should open with the standard bootstrap
sequence (`git fetch`, confirm HEAD == `origin/main`, read
`.ai/WORKSTATE.yaml` + `.ai/SESSION_BOOTSTRAP.md` +
`docs/THANGSENG_NATIVE_VALIDATION.md`) and then either pick up the
`smile`-variant engine-bug follow-up with Claude B, or take the next
Project-Owner-directed task.

## Repository status at close
- HEAD: `1aad3fe`
- `origin/main`: `1aad3fe` — exact match
- `git status`: clean
- `.ai/WORKSTATE.yaml`: updated (`claude_a.latest_9`)
- `.ai/SESSION_BOOTSTRAP.md`: updated (do-not-repeat entry)
- This migration document: complete
- No local commits ahead of origin
- No uncommitted changes
- Native-validation status: NV-067/068/069 fully closed, documented in
  `docs/THANGSENG_NATIVE_VALIDATION.md`; zero pending-lexicon items for
  this session's scope
- Blocker status: none for Claude A; one open engine-bug handoff to
  Claude B (`smile` variant-precedence, NV-067), not blocking
