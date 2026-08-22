# Migration Proposal: `confidence`/`confidence_source` Schema
_Drafted 2026-08-22, Claude B. Structural fix for AI-001
(`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §4), designed 2026-08-04 per
`docs/MILESTONE_2026-08-11.md` Phase 1, not started until now._

## Why
`pickPrimary`/`finalizeDictionary` (`prepare-data.js`) currently infer
confidence entirely from regex over the free-text `notes` field:
`isVerified` requires notes to start with `verified/high`,
`isVariantVerified` requires `variant/verified/high`, `isWeak` fires on
absent notes or substring matches for `unverified`/`ocr-flagged`. This
is a real, active risk, not a nice-to-have — it's the confirmed root
cause of the `work`/`boil`/`build`/`close`/`empty`/`leg`/`outside`/
`strong` failure shape and the `answer`/`king` handoffs (AI-001, both
subclasses now enumerated in `PICKPRIMARY_VERIFIED_TIES.md` and
`PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`). Every anchor/substring rule is
one inconsistently-worded note away from silently mis-tagging a row,
and there is no way to query "what does this dictionary actually know
about this row's confidence" without re-deriving it from prose.

## Current State
Verified directly against `master_dictionary.json` (9,791 rows) and
`prepare-data.js` this session:
- 3,437 rows: no `notes` field at all (`isWeak`).
- 2,967 rows: notes contain `unverified` somewhere (`isWeak`).
- 1,262 rows: notes begin `SUPERSEDED —` (excluded from candidacy
  entirely, filtered before `isVerified`/`isWeak` are even computed).
- 1,245 rows: notes begin `VERIFIED/HIGH` exactly (`isVerified`).
- 350 rows: other free text, not classifiable by the current regexes
  (falls through to untagged/`isWeak`-by-absence-of-match).
- 268 rows: notes contain `ocr-flagged` (`isWeak`).
- 262 rows: notes begin `variant/VERIFIED/HIGH` (`isVariantVerified`).

No row has a structured confidence field. `notes` is the only source,
and it mixes machine-readable tags with human-readable citation prose
in one string.

## Target State
Each `master_dictionary.json` row gains two optional fields:
```json
{
  "confidence": "verified_high" | "unverified" | "ocr_flagged" | "superseded",
  "confidence_source": "<free text — audit doc, transcript ref, or reviewer note>"
}
```
- `confidence` is a closed enum, checked in CI (extend
  `repository-intelligence.js`'s existing violation-scan pattern).
- `confidence_source` replaces the citation half of today's `notes`;
  `notes` remains free text but stops being asked to double as a
  machine signal.
- A row with no `confidence` field is treated identically to today's
  untagged/absent-notes case (`isWeak`) — the schema is additive, not
  a required migration for every row on day one.
- `pickPrimary`/`finalizeDictionary` read `confidence` directly, no
  regex on `notes`, once a row has been migrated.

"Done" is unambiguous: every one of the 9,791 rows has been classified
into exactly one of the four states above (or explicitly left
`confidence`-absent as a deliberate, logged decision — not an
oversight), `prepare-data.js` no longer contains any regex match
against `notes` for confidence purposes, and both `PICKPRIMARY_*.md`
reports are regenerated from the new field with identical counts to
today's regex-derived run (see Verification).

## Migration Strategy
Small, independently-revertible steps, mechanical work separated from
judgment calls:

1. **Schema + writer support (mechanical).** Add the `confidence`/
   `confidence_source` fields to the row shape docs and to whatever
   tooling writes `master_dictionary.json` rows (dictionary-entry
   scripts, if any — needs inventory, not assumed). No behavior change
   yet; `prepare-data.js` still reads `notes`.
2. **Auto-migration pass (mechanical, scriptable, reversible).** A
   one-time script maps the four unambiguous existing patterns onto
   the new field for all 9,791 rows:
   - `notes` starts `SUPERSEDED —` → `confidence: "superseded"`,
     `confidence_source` = rest of the note.
   - `notes` starts `variant/verified/high` or `verified/high`
     (case-insensitive) → `confidence: "verified_high"`.
   - `notes` contains `ocr-flagged` → `confidence: "ocr_flagged"`.
   - Empty notes or notes containing `unverified` → `confidence:
     "unverified"`.
   This covers 3,437 + 2,967 + 1,262 + 1,245 + 268 + 262 = 9,441 of
   9,791 rows (96.4%) with zero judgment calls — it's a direct
   restatement of the regex `prepare-data.js` already runs, just
   materialized into the row instead of computed at build time. Ships
   as its own commit, diffable against the regex output for exact
   parity (see Verification) before anything downstream depends on it.
3. **350-row manual triage (judgment — Claude A/B, content-owner
   call).** The "other/untagged-free-text" rows didn't match any
   existing regex; today they silently fall through to `isWeak`. Each
   needs a human (or Claude, citing the actual note) decision among
   the four enum values — this is exactly the kind of content call
   `docs/BUG_*.md`/`FIX_*.md` triage already holds separate from bulk
   passes, per `docs/MILESTONE_2026-08-11.md`. Not started until step
   2 ships and is verified.
4. **Cutover (mechanical once 1–3 are done).** Change
   `pickPrimary`/`finalizeDictionary` to read `confidence` instead of
   regex-matching `notes`. `notes`'s regex parsing is deleted only
   after every row has a `confidence` value (from step 2 or 3) — no
   row should silently fall back to `isWeak`-by-absence at cutover
   time if it was actually classified by the migration.
5. **New-entry path (mechanical, ongoing).** Whatever process adds new
   dictionary rows going forward writes `confidence` directly; no new
   row should ever rely on step-2-style regex inference.

## Ownership
- **Content** (what each of the 350 ambiguous rows' correct
  `confidence` value actually is): Claude A, as primary dictionary
  content owner — flagged here, not decided here.
- **Implementation** (steps 1, 2, 4, 5): Claude B (this role), per
  AI-001's existing assignment in the governance table.
- **Validation** (step 2's parity check, step 4's regression run):
  Claude B, using the same `npm run build`/unit-test gate as every
  other session.
- **Final approval** (moving AI-001 to `CLOSED`): per
  `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §5, Claude C's
  class-closure verification — not self-certified by the implementing
  role.

## Backward Compatibility
`notes` stays authoritative and untouched through steps 1–3; nothing
downstream reads `confidence` until step 4. Both fields coexist in
parallel for the full migration — this is the "prefer incremental,
revertible" requirement made concrete. Only step 4 changes runtime
behavior, and only after step 2's parity check confirms the new field
reproduces the old regex output exactly.

## Completion Criteria
- All 9,791 rows have an explicit `confidence` value or a logged,
  reviewed decision to leave it absent (not silence-by-omission).
- Zero regex matches against `notes` remain in `prepare-data.js` for
  confidence/verification purposes.
- `PICKPRIMARY_VERIFIED_TIES.md` and
  `PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`, regenerated from the new
  field, list the identical key sets as the last regex-derived run
  (this session's: report generated 2026-08-22, 5,909 keys in the
  no-verified-candidate report).

## Verification
- Step 2: script output diffed programmatically against
  `prepare-data.js`'s current regex classification for all 9,791 rows
  — every row's derived `isVerified`/`isVariantVerified`/`isWeak`/
  superseded-status must match exactly before the commit ships, not
  spot-checked.
- Step 4: full `npm run build` gate (unit tests,
  `repository-intelligence.js`, `vite build`, lint) plus a direct
  before/after diff of both `PICKPRIMARY_*.md` reports' key lists.
  Per the template's standing rule (2026-07-25, Project Owner): a
  status note claiming parity is not verification by itself — the
  diff output goes in the commit/PR for independent recheck.
- Step 3: each of the 350 rows' new `confidence_source` cites the
  actual reasoning, so a future auditor can re-derive the call instead
  of trusting it asserted.

## Rollback Plan
- Steps 1–2: revert the single migration commit; `prepare-data.js`
  still reads `notes` exclusively until step 4, so nothing downstream
  is affected by reverting the new field.
- Step 3: per-row, revert individual `confidence`/`confidence_source`
  edits same as any other content correction — no bulk mechanism
  needed since these are hand-reviewed one at a time.
- Step 4 (post-cutover): if a discrepancy surfaces after
  `pickPrimary` switches to reading `confidence`, the regex-based
  reading is still recoverable from `notes` (never deleted by this
  migration) — revert the cutover commit and `prepare-data.js` returns
  to today's exact behavior while the discrepancy is investigated.
