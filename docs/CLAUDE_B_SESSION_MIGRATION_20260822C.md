# Claude B Session Migration — 2026-08-22C

## Project identity
Lean Garo — English↔Garo dictionary/translation engine.
Repo: `pzrjv4sfj5-prog/Lean-Garo-`. Role: Claude B (engineering), per
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`. Content authority is
Claude A; class-closure verification is Claude C — this session
respected that boundary throughout, see "Held" below.

## Current commit/state
`14adbd1`, pushed, `origin/main` in sync. Working tree clean. Full
build gate green: `npm run build`'s non-vite steps (`vite` isn't
installed in this sandbox) all pass — 220/220 unit tests,
`repository-intelligence.js` 0 new violations across all 7 checks
(A–G), `master_dictionary.json`: 9,848 rows.

## Done this session
1. **`docs/PROPOSAL_CONFIDENCE_SCHEMA_20260822.md`** — AI-001's
   structural fix, template-compliant proposal. Contains a dated
   erratum after mid-implementation discovery (see below) — original
   text left unedited per this project's citation discipline.
2. **`docs/CLAUDE_B_TRIAGE_PICKPRIMARY_NO_VERIFIED_CANDIDATE_20260822.md`**
   — triaged all 5,909 subclass-(b) keys. Named 9-key shape already
   resolved (except `build`, a tied-weak case). Found two
   `prepare-data.js` classifier gaps (REJECTED and OPEN-prefixed notes
   both wrongly classified non-weak) rather than isolated bad picks.
3. **Confidence schema, steps 1–2 implemented and merged:**
   - `scripts/promote-lexicon.js`: `confidence`/`confidence_source`
     now pass through as optional fields (same pattern as
     `pos`/`classifier`/`notes`).
   - `repository-intelligence.js` Check G: validates any `confidence`
     value against the closed enum. Zero violations on 9,848 rows.
   - `scripts/migrate-confidence-schema.js`: classifies rows from
     `notes`, precedence-ordered, mirrors `prepare-data.js`'s own
     regex. Pre-existing `confidence` values (discovered mid-session,
     see below) treated as authoritative, not re-derived.
   - Result: 9,512/9,848 rows now carry a `confidence` value (1,277
     superseded / 6,351 unverified / 1,603 verified_high / 268
     ocr_flagged / 8 open / 5 rejected). 336 left deliberately
     unresolved.
4. **Mid-session correction, not buried:** the proposal's "no row
   has `confidence`" claim was wrong. Build gate caught 442 (later
   556, post-merge) rows already carrying an ad hoc `confidence` value
   from an undocumented 2026-08-17/08-20 import, including a state
   (`open`) the 4-value proposal never accounted for. Added `open`/
   `rejected` to a 6-value enum, filed a dated erratum, updated the
   AI-001 governance table row.
5. **Concurrent-edit merge handled correctly:** origin moved (Claude
   A: NV-089/090/091, +57 rows) between two pushes. Took their content
   as base, re-ran the migration on top rather than force-pushing or
   discarding either side — verified all 556 legacy values mapped
   cleanly before applying.
6. **Idempotency bug found and fixed before it could ship:**
   re-running the migration script as a sanity check (not blindly
   trusted as "should be a no-op") showed it wasn't — `verified_high`
   dropped 1603→1601 on a second run. `LEGACY_ALIASES` only recognized
   the *old* ad hoc casings, not the canonical values themselves, so a
   second run silently re-derived (and lost) 2 rows' authoritatively-set
   confidence. Fixed, re-verified as a true no-op, committed
   (`14adbd1`) before any further use.

## Held — and why
- **Step 3 (336-row manual triage):** explicitly Claude A's content
  call per the proposal's own Ownership section, which the Project
  Owner signed off on this session. Not attempted, not guessed at —
  fabricating these would be worse than leaving them open. Row list
  is derivable by filtering `master_dictionary.json` for rows with a
  `notes` field but no `confidence` field.
- **Step 4 (`pickPrimary` cutover to read `confidence`):** sequenced
  after step 3 in the proposal itself — cutting over now would mean
  the 336 unresolved rows silently behave as `isWeak`-by-absence,
  reintroducing exactly the ambiguity this migration exists to
  remove. Not started.
- **AI-001 governance row:** updated to reflect steps 1–2 done, but
  intentionally left `OPEN` (not `CLOSED`) — per
  `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §5, only Claude C's
  count-based closure verification can move it to `CLOSED`, not
  self-certified here.

## Open issues, root cause known
- **335→336-ish rows, ambiguous free-text notes:** no single pattern,
  needs per-row Claude A review. Not itemized in this doc; derivable
  fresh from the data (see above) since Claude A's own concurrent work
  changes the exact set run to run.
- **`hot`'s translation ('jroa' shipped, notes say `ding·a` is the
  actual confirmed word for heat/temperature):** flagged in the
  triage doc, not corrected — content call.
- **5 REJECTED-prefixed rows, 8 OPEN-prefixed rows:** now correctly
  classified in the new schema, but `prepare-data.js` itself still
  doesn't read `confidence` (step 4 not done) — these rows behave
  exactly as before in the shipped `compiled_dict.json` until cutover.

## Standing rules established/reconfirmed this session
- Ownership boundaries (content = Claude A, implementation = Claude
  B, closure verification = Claude C) hold even under direct
  Project-Owner instruction to "complete all tasks" — sign-off
  authorizes starting the mechanical steps, not absorbing another
  role's judgment calls.
- A dry run is verification, not a formality — two real bugs (the
  legacy-value-loss risk on initial migration, the idempotency bug on
  re-run) were both caught by actually running and reading the dry-run
  output, not by assuming the script was correct because it compiled.
- Corrections to already-pushed docs get a dated erratum, not a
  silent rewrite — matches this project's existing citation
  discipline for `master_dictionary.json` itself.

## Exact next step
Either: (a) Claude A triages the ~336 unresolved rows (filter
`master_dictionary.json` for `notes` present, `confidence` absent),
or (b) if that's deferred, Claude C can still audit steps 1–2 for
class-closure-readiness independent of step 3 finishing, per §5's
"regenerate the auto-enumerated artifacts fresh" instruction — that
audit doesn't require step 3 to be done first, just documented as
still-open.
