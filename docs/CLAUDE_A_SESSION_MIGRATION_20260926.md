# Claude A Session Migration — 2026-09-26

THIS IS THE AUTHORITATIVE MIGRATION DOC as of 2026-09-26. Read this first on resume, before `.ai/WORKSTATE.yaml`.

## Resume

Resumed as "Claude A" via a pasted pointer to `docs/CLAUDE_A_SESSION_MIGRATION_20260925.md` plus a fresh PAT-cloned repo, per standing rule (only ever use a PAT pasted live by the Project Owner in the current session).

Rule 10 mandatory resume sequence performed: `git fetch origin`, HEAD comparison, WORKSTATE.yaml/SESSION_BOOTSTRAP.md read before any work. Resync found HEAD `07ec71e` == `origin/main` on arrival, clean tree — no drift since the prior close (that HEAD reflects only the prior session's own WORKSTATE-head-pointer addendum commits).

## Verification scope

Every fix below was live-verified via `translate()` post-build, not just inspected in `compiled_dict.json`. Full gate (prepare-data.js / test-dictionary.js / repository-intelligence.js / unit tests / runtime-error-sweep.mjs) was re-run after each rebase, not assumed clean from a pre-rebase run.

## Work done (all Project Owner directives, chat, 2026-09-26, no transcript, per `.ai/PROJECT_OWNER_AUTHORITY.md`)

### 1. Sentence-builder verification for "cow" (carried in from prior session's close)

Before new work, verified the 2026-09-25 cow=Matchu fix and 5 other recent overrides (slowly, shade, litchi, profit, ankle, anus, plus Mahajon) actually compose correctly through every sentence-builder path (phrase-map, exact-phrase, sov-assembly questions, grammar-assembly counted/possessive sentences, classifier composition) — not just exact-phrase lookup. All confirmed correct, matching sibling animals' (dog/cat) classifier-composition pattern exactly. No fix needed, no commit made for this part.

### 2. buffalo = Matma (overrides mo·si)

Same shape as the 2026-09-25 cow=Matchu fix. `master_dictionary.json`:
- bare `buffalo`→`Matma` row: `superseded`→`verified_high`
- `Buffalo`→`mo·si` row: `verified_high`→`superseded` (retained, not deleted)

`src/data/phrase_maps.js`: `buffalo` override `mo·si`→`Matma` (Rule 8 — fix stale phrase_maps.js values directly, never allowlist).

`water buffalo` (a separate, unrequested key) deliberately left untouched.

Live-verified: `buffalo`/`Buffalo`/`two buffalo`/`i have a buffalo`/`where is the buffalo?` all resolve `Matma` across every composition path.

### 3. beef = Matchu be·en

Pre-existing `unverified` row already held the correct value (`matchu be·en`) — promoted to `verified_high`, citation-only, no value change.

### 4. New: a bull = Matchu Bipa

No prior entry existed for "bull" in any form. New `verified_high` row, `n.`.

### 5. New: to finish/complete/to end = Matchota

New `verified_high` row, `v.`. Deliberately added as a **coexisting** citation, not merged into or overriding the already-VERIFIED `finish`→`bon·a` (NV-140) — a different, distinct citation for an overlapping sense, per evidence-first discipline (don't force-merge distinct citations without evidence they're the same word).

### 6. mosquito net = Mosori (overrides mo·sa·ri)

`master_dictionary.json`:
- `mosquito net`→`mo·sa·ri` row: `unverified`→`superseded` (retained, not deleted)
- new `mosquito net`→`Mosori` row: `verified_high`

This created a new Check C (dictionary self-consistency) conflict — expected and correct per repository-intelligence.js's own instructions for a confirmed intentional divergence: allowlisted `mosquito net` in `src/data/known_dictionary_conflicts.json` citing this session. Gate re-verified clean after allowlisting (0 new Check C violations).

No `phrase_maps.js`/`corrections.json` override existed for this key — nothing else to sync.

Live-verified: `mosquito net`/`Mosquito net`/`i have a mosquito net` all resolve `Mosori`.

## Runtime bug found, NOT fixed (Claude B territory)

While live-verifying mosquito net in a `where is the X?` question, found `sov-assembly` fails on multi-word nouns generally: it composes the noun phrase word-by-word instead of trying the full phrase against the dictionary first.

```
"where is the mosquito net?" -> "Bano Ganggua jal"   (wrong: Ganggua = "mosquito", not "mosquito net")
```

Before flagging this as a regression from this session's own edit, checked whether it's pre-existing — confirmed it reproduces identically on multi-word nouns that were already in the dictionary before this session and untouched by it:

```
"where is the cow dung?"       -> "Bano Matchu Matchu·ke·em·a"
"where is the little boy?"     -> "Bano kom me·a bi·sa"
"where is the water buffalo?"  -> "Bano Chi Matma"
```

Confirmed **pre-existing, not caused by this session's dictionary edits**. Not fixed here — engine code, Claude B's lane. Flagged in the close commit and here for the next Claude B session.

## Claude D evidence-package review (concurrent, reviewed not actioned)

A concurrent commit (`02c08a5`, Claude D) landed a forensic evidence-package handoff (`docs/CLAUDE_D_EVIDENCE_HANDOFF_PO_DIRECTIVES_20260926.md`) naming 7 PO-directive contested forms: three fish, orange, papaya, watermelon, mango, sweet potato, and cow. No entries deleted/modified — forensic-only, disposition handed to Claude A/B.

Live-checked all 7 keys: all already correctly disposed from prior sessions, no action needed.

```
"three fish"    -> "na·tok manggittam"
"orange"        -> "Narang"
"papaya"        -> "Modupol"
"watermelon"    -> "tor·mus"
"mango"         -> "te·gatchu"
"sweet potato"  -> "ta·mil·ang"
"cow"           -> "Matchu"
```

One minor note, not investigated further: the handoff cites mango's PO-directive canonical form as `te·ga·chu` (two raka dots), but the live value is `te·gatchu` (one dot). Both plausibly refer to the same word; flagging as a possible minor follow-up rather than acting on an unclear discrepancy.

## Concurrent drift handled

Two rounds of concurrent commits arrived before push, both rebased clean with zero file overlap on hand-written source:

1. **Claude D**, `02c08a5` — evidence-package handoff (docs + audit CSV only, no dictionary edits).
2. **Claude B**, `362499e` — "she has/we have" plural-object word-order fix (`grammarEngine.js`/`garo_classifier.js`, engine-layer, zero overlap with this session's dictionary work).

Both rebases auto-merged cleanly; the only conflict either time was the generated `src/compiled_dict.json`, resolved by rebuilding fresh via `prepare-data.js` rather than hand-merging, then re-running the full gate — never trusted a pre-rebase artifact.

## Gate at close

- `test-dictionary.js`: 8920/8920 dictionary entries valid, 9/9 grammatical corrections
- `repository-intelligence.js`: 0 new violations across all 8 checks (Check C's 1 new intentional conflict allowlisted, not counted as a violation)
- `node --test tests/unit/*.test.js`: 469/469 (a 466/469 run mid-session before the Check C allowlist fix resolved itself once the allowlist was added — no code regression, purely the expected Check-C-triggered gate state)
- `scripts/runtime-error-sweep.mjs`: 15893/15893 `translate()` calls, 0 errors

## Repository status at close

Session commit sequence: `7ab69da` (buffalo/beef/bull/Matchota) → `362499e`/`02c08a5` (concurrent Claude B/D, rebased onto) → `bf648f8` (mosquito net = Mosori, current HEAD before this doc's own commit).

Verified each line directly against the repo, not asserted from memory, immediately before this close commit:

- HEAD immediately before this commit: `bf648f8` — will be superseded by this doc's own commit hash, which cannot be known while it's being created (per the project's own `head_convention` in WORKSTATE.yaml)
- `origin/main` match: verified via `git fetch` + hash comparison before every push this session, all clean
- `git status`: clean, no uncommitted changes before this commit
- `WORKSTATE.yaml`: updated this session (new `next_action`, old renamed to `next_action_prior_20260925`, `migration_doc` pointer updated, old renamed to `migration_doc_prior_20260924C`)
- `SESSION_BOOTSTRAP.md`: updated this session (top pointer block)
- Migration doc: this file, complete
- No local/unpushed commits pending beyond this doc's own close commit
- Native-validation status: no open Thangseng relay items touched this session; no new blockers
