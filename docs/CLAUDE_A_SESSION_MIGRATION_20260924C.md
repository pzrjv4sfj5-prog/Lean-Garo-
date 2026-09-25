# Claude A Session Migration — 2026-09-24C

## Resume point

Resumed as Claude A from a Project Owner-named
`docs/CLAUDE_A_SESSION_MIGRATION_20260924.md`, HEAD `46aa62f`.

Per Rule 10, ran the mandatory resume sequence: `git fetch origin`,
compared HEAD to `origin/main`, reviewed `git log 46aa62f..origin/main`,
read `.ai/WORKSTATE.yaml` and `.ai/SESSION_BOOTSTRAP.md` before any work.

Resync found the repo had moved **21 commits** past the named doc's
HEAD:
- A same-day "duplicate-census" cleanup pass (all committed as `T`):
  hope dedup (3 commits), `child` normalization (2 commits), `ma·su`
  removal (6 commits), plus the census/audit docs themselves.
- Claude B's own session close
  (`docs/CLAUDE_B_SESSION_MIGRATION_20260924B.md`, HEAD `ddae32d`),
  which had already found and **documented** — but explicitly not
  fixed, flagging both to Claude A — the same two issues this
  session closes.
- One further same-day Project Owner commit, `ab7efa5`
  ("Canonicalize ma·su to Matchu in translation tests"), landed
  during this session's second rebase.

## What was found on arrival

Ran the full gate (`npm run build` = `prepare-data.js` →
`test-dictionary.js` → `repository-intelligence.js` →
`scripts/resync-stale-overrides.mjs` → unit tests → `vite build`).

**Check D (repository-intelligence.js) FAILED**: `src/data/
pending_lexicon.json` entry `PL-0001453` (english `"Hope"`, garo
`"Ka·donga"`, pos `n.`) still had `promotion_status: promoted`, but
no matching row existed in `master_dictionary.json` — the promoted
row had been hard-deleted by the duplicate-census pass's `Remove
superseded duplicate hope row` commit (`f0a186a`).

Tracing the "hope" history: PL-0001453 was promoted 2026-07-22, then
correctly marked `SUPERSEDED` on 2026-08-16 by a prior Claude A
full-corpus dedup audit (note: *"redundant OCR import, same value as
already-VERIFIED 'Hope'->'ka·donga' entry... part of the 3-way
a·sa/ka·donga/mik·sok·a variant set"*). On 2026-09-24 the same-day
duplicate-census pass deleted this row outright (along with the two
other "Hope" variant rows, `a·sa` and `mik·sok·a`), rather than
leaving it SUPERSEDED-but-retained per the usual citation-discipline
norm. The deletion itself is a legitimate content simplification
(consolidating "hope" down to the NV-082-sourced `ka·donga`
(v.)/`ka·dongani` (n.) pair) — but it left `pending_lexicon.json`'s
bookkeeping stale, pointing `promoted` at a row that no longer
exists.

## Fix 1 — pending_lexicon.json bookkeeping (Check D)

`repository-intelligence.js`'s Check D validates `promoted` entries
against a fixed enum of `promotion_status` values (`pending`,
`promoted`, `rejected`, `duplicate-skip`) and requires that a
`promoted` entry's (english, garo) pair still exist in
`master_dictionary.json`. Since the underlying content decision (the
row's removal) was already made and is out of scope for this fix,
the correct action was a status change, not a data restoration.

Changed `PL-0001453.promotion_status` from `promoted` to
`duplicate-skip` (the closest existing status for "this entry
duplicates content that now lives elsewhere and was consolidated
away"), and appended to `review_notes` the full chain of custody:
promoted 2026-07-22 → SUPERSEDED 2026-08-16 (Claude A dedup audit) →
hard-deleted 2026-09-24 (commit `f0a186a`, duplicate-census cleanup).
No new linguistic evidence involved — this is a provenance-trail
correction, not a content decision.

## Fix 2 — 'cow'/ma·su live regression (not a gate check, found while verifying)

While live-verifying the gate, `translate('cow')` returned a
passthrough failure (`'cow [UNKNOWN]'`) and `translate('where is the
cow?')` returned `'Bano daka [UNKNOWN] [UNKNOWN]'` — both previously
correct.

Root cause: `docs/DUPLICATE_CENSUS_20260924.md` correctly flagged
"cow" as having two `master_dictionary.json` rows — `cow`→`Matchu`
(SUPERSEDED) and `Cow`→`ma·su` (VERIFIED/HIGH). The census's own note
on the `Matchu` row explicitly names `ma·su` as the correct VERIFIED
form (*"legacy unannotated import, same english key 'cow' has
VERIFIED/HIGH form(s) ['ma·su']"*). Whoever executed the cleanup
(commit `3985059`, "Remove ma·su from dictionary runtime data")
deleted the **wrong** row of the pair — the VERIFIED/HIGH `ma·su`
row — and left only the SUPERSEDED `Matchu` row, which
`prepare-data.js` correctly excludes from compilation. A parallel
commit (`9f34e12`, "Remove ma·su from phrase map") removed the same
value from `src/data/phrase_maps.js`'s runtime-override layer,
compounding the break at both the data and override layers.

Fixed by restoring both:
- `master_dictionary.json`: re-added the `Cow`→`ma·su`
  `verified_high` row, citing the surviving `Matchu` row's own note
  as the evidence (not asserting new evidence).
- `src/data/phrase_maps.js`: re-added `'cow': 'ma·su'`, per Rule 8
  ("fix stale phrase_maps.js values directly, never allowlist").

This is a data-integrity restoration, not a linguistic content
decision — the value being restored is the same value the corpus
already cited as correct.

## A related but unresolved flag — worth Project Owner clarification

During the session's second rebase, a further same-day commit
(`ab7efa5`, "Canonicalize ma·su to Matchu in translation tests")
landed on `origin/main`. Inspected: it only reworded a test
docstring in `tests/unit/translationEngine.test.js` (the NV-115
"chow"-loanword-passthrough test's description string changed from
`"...fuzzy-matches to \"cow\" (ma·su)"` to `"...(Matchu)"`) — no
assertion, no data, no compiled output changed by that commit.

Flagged, not acted on: the commit's **title** reads as an intent to
make `Matchu` canonical for "cow" going forward, which would directly
contradict this session's restoration of `ma·su` as the VERIFIED/HIGH
value (a restoration grounded in the corpus's own existing citation
trail, not a new judgment call). Per governance ("Project Owner
authority and native evidence are separate provenance categories"),
a real canonical-value change from `ma·su` to `Matchu` would need its
own explicit directive and citation, not an inferred docstring edit.
The next session (or the Project Owner directly) should clarify
intent here before "cow" is touched again.

## Verification

Gate run in full after both fixes and after each rebase:

- `prepare-data.js`: 8902 entries compiled clean.
- `test-dictionary.js`: 8902/8902 valid.
- `repository-intelligence.js`: **PASSED** — 0 new cross-table
  violations, 0 new dictionary self-consistency conflicts, **0
  Pending Lexicon structural problems** (Check D now clean), 0 new
  unresolved-placeholder entries, 0 new runtime-cascade source
  mismatches, 0 confidence-schema problems, 0 new modifier+noun
  placeholder collisions.
- `scripts/resync-stale-overrides.mjs`: 0 candidates.
- Unit tests: 461/461 (458 baseline + 3 that arrived via rebase from
  concurrent work, not authored this session).
- `vite build`: clean.
- `scripts/runtime-error-sweep.mjs`: 15866/15866 `translate()`
  calls, 0 errors.
- Live-verified via `translationEngine.js` directly (not just
  `compiled_dict.json` inspection): `translate('cow')` →
  `{garo: 'ma·su', method: 'phrase-map', confidence: 0.99}`;
  `translate('where is the cow?')` → `{garo: 'Bano ma·su', method:
  'sov-assembly', confidence: 0.75}`.

## Duplicate-representation check (Rule 8)

Searched for every representation of the "cow" and "hope" fixes:
`master_dictionary.json` (fixed), `src/data/phrase_maps.js` (fixed,
cow only — hope was never in phrase_maps.js), `corrections.json` (no
entry for either key), `src/compiled_dict.json` /
`src/compiled_dict_alternates.json` (regenerated fresh by
`prepare-data.js`, confirmed correct post-build),
`src/data/category_index.json` (regenerated, no manual edit needed),
`docs/SUPERSEDED_ONLY_KEYS.md` (regenerated — "cow" correctly
dropped from the superseded-only list now that a verified value
exists again). PASS — no stale duplicate representation left behind.

## Runtime Handoff to Claude B

None. This session made zero engine-code changes; both fixes were
data-layer (`master_dictionary.json`, `src/data/phrase_maps.js`,
`src/data/pending_lexicon.json`) and regenerated-artifact-layer only.

## Not done this session

No Priority-A audit items from
`docs/CLAUDE_A_MACHINE_READY_AUDIT_20260924.md` were picked up — the
arriving gate failure and the live "cow" regression took priority,
per one-task-per-session discipline. **Next Claude A session should
start with that audit's Priority A queue.**

The `ab7efa5` "Matchu canonicalization" question above is also
unresolved and should be raised with the Project Owner before any
further "cow" edits.

## Repository status at close

- HEAD: `de7e081`
- `origin/main` HEAD: `de7e081` — **matches**, verified via
  `git fetch origin` immediately before writing this doc.
- `git status --short`: clean (no local commits, no uncommitted
  changes).
- `WORKSTATE.yaml`: updated (`repository.head` → `de7e081`,
  `claude_a.next_action` and `claude_a.migration_doc` updated to
  this session, prior values preserved under `_prior_20260924C`
  suffixes). Verified parses clean via `python3 -c "import yaml;
  yaml.safe_load(...)"`.
- `SESSION_BOOTSTRAP.md`: updated — new `## 2026-09-24C` entry
  appended after the 2026-09-24 entry it resumed from.
- This migration doc: complete.
- Native-validation status: unchanged this session (no NV items
  worked; both fixes were bookkeeping/data-integrity restorations,
  not new linguistic questions).
- Blocker status: none outstanding from this session. The `ab7efa5`
  intent question (above) is a flag, not a blocker.
