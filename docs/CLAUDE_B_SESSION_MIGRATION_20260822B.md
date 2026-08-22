# Claude B — Session Migration Document, 2026-08-22b

## Project identity
Lean-Garo: an English → A'chik Garo translation engine (Meghalaya, India).
Node/JS, dictionary + correction-table + grammar-assembly hybrid (no ML
model). Deployed at https://lean-garo.onrender.com.

## Current commit / state
- **HEAD: `ba5a426`**, verified `== origin/main` via `git ls-remote` (not
  just local git state).
- Working tree clean.
- Full build gate green: `npm run build` — 220/220 unit tests (2 new),
  `repository-intelligence.js` PASSED, 0 new violations (7
  known/allowlisted unchanged), 8132 compiled `compiled_dict.json`
  entries (unchanged — this session shipped zero dictionary content
  changes), `vite build` clean. `npm run lint` — 0 errors.

## What this session did
Resumed via `docs/CLAUDE_B_SESSION_MIGRATION_20260822.md` (prior
checkpoint `aead387`). Per resume protocol: fetched, fast-forwarded onto
`1dae44e` (Claude C's self-pushed commit, two new native-citation docs —
see "Cross-role updates" below), reconfirmed clean before starting any
work.

**Built `docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`** — the AI-001
subclass (b) auto-enumeration flagged in
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §1 as the first concrete
engineering action under the new governance model, not yet built as of
the prior session's close. Subclass (a) (verified-tie: 2+ candidates
equally tagged VERIFIED/HIGH) has had an auto-generated enumeration
since 2026-08-16 (`docs/PICKPRIMARY_VERIFIED_TIES.md`); subclass (b)
(no-verified-candidate: a SUPERSEDED/OCR/mistagged row outranks the
actual correct value because nothing structurally enforces the tag)
existed only as narrative findings scattered across dated audit docs —
this closes that specific gap.

Implementation (`prepare-data.js`):
- New module-level `pickPrimaryNoVerifiedCandidate` collector,
  populated inside `finalizeDictionary`'s per-key loop alongside the
  existing `verifiedKeys`/`alternates` bookkeeping.
- Condition: `!verifiedSelection && cleanedEntries.every(e =>
  !e.isVerified && !e.isVariantVerified)` — records any key whose
  **entire candidate set**, not just the value that shipped, carries
  zero VERIFIED signal anywhere.
- Same write/stale-cleanup pattern as the existing
  `PICKPRIMARY_VERIFIED_TIES.md`/`SUPERSEDED_ONLY_KEYS.md` reports:
  auto-regenerated every build, file deleted when the list is empty,
  never hand-edited.
- Exported (`pickPrimaryNoVerifiedCandidate` added to the module's
  `export` statement) for testability, mirroring how `pickPrimary`/
  `finalizeDictionary` are already exported.

Regression tests (`tests/unit/prepare-data.test.js`, 2 new):
1. A synthetic key with zero verified candidates anywhere is recorded
   in the collector, with the correct `candidates`/`chosen` shape
   (including the `isWeak` flag surviving through).
2. A synthetic key with a genuine VERIFIED candidate is **not**
   recorded — confirms the report doesn't over-fire on keys that are
   already correctly resolved.

**Report contents, as generated this run:** 5909 keys. The report's own
header states explicitly this is **not automatically a defect list** —
the large majority are simply vocabulary that hasn't reached native
validation yet, same as most of the corpus. It exists so Claude A/C can
triage the confirmed `work`/`boil`/`build`/`close`/`empty`/`leg`/
`outside`/`strong` failure shape (`docs/CLAUDE_C_AUDIT_20260816.md` §2)
out of a concrete, auto-maintained artifact instead of re-deriving the
candidate set by hand each time it comes up.

**What this does NOT do:** it does not fix AI-001. The proposed
structural fix — a `confidence`/`confidence_source` schema on
`master_dictionary.json` rows, designed 2026-08-04
(`docs/MILESTONE_2026-08-11.md` Phase 1) — is still not started. This
session only closed the "subclass (b) has no enumeration artifact" gap
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §1 named as the next concrete
step; AI-001 itself remains `OPEN` in §4.

## Governance-model check (mandatory per SESSION_BOOTSTRAP.md Rule 13)
This session touched §4/AI-001 by building the missing subclass-(b)
enumeration artifact that §1 flagged as the next concrete step. It did
**not** add or touch any `grammarOverrides`/`corrections.json` entry, so
§2's "check the mechanism against an open §4 row before adding another
override" step doesn't apply — no override was added. §3's
A→B→runtime trace doesn't apply for the same reason: no key's
`translate()` output changed this session (pure reporting/tooling, zero
`master_dictionary.json` edits). §5 (Claude C class-closure
verification) doesn't apply either — this session didn't move AI-001
toward `CLOSED`, it built one of the artifacts a future closure claim
will need to cite counts from.

## Cross-role updates (already merged, not this role's work)
Claude C self-pushed `1dae44e` between the prior session's close and
this session's start (Project Owner-authorized direct push exception,
per `SESSION_BOOTSTRAP.md`'s 2026-08-19 policy). Two new docs:
`docs/THANGSENG_RELAY_TABLE_20260821B.md`,
`docs/CLAUDE_C_TRANSCRIPT_ANALYSIS_20260821B.md` — native (Thangseng)
citations for `king = Raja` and `film = film`, relayed via a
2026-08-21 Tridip/Thangseng WhatsApp transcript. Data-side citations
only, no engineering content. Per Claude C's own note (see
`.ai/WORKSTATE.yaml` `claude_c.self_push_note`), these give Claude A
what's needed to flip the wrongly-SUPERSEDED `Raja` row and supersede
the junk classifier-metadata rows currently winning for `king` at
runtime, but do **not** themselves close AI-001 — the structural
pickPrimary fix is still the durable fix, and a single "king now
returns Raja" instance is explicitly insufficient for class closure
per `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §5. This pull required no
rebase (`1dae44e` fast-forwarded cleanly onto the prior checkpoint) and
no code on this role's side needed to change as a result — reporting
here per Rule 5, not restating Claude C's own findings.

## Runtime Handoff
None. No `master_dictionary.json`/`corrections.json`/`grammarOverrides`
content was touched this session — nothing to trace from source to
runtime.

## Open issues carried forward
1. **AI-001 (still OPEN):** the `confidence`/`confidence_source` schema
   is the actual structural fix and is still not started. Both
   enumeration artifacts (`PICKPRIMARY_VERIFIED_TIES.md`, now also
   `PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`) exist to validate the fix
   against once built, not as a substitute for it.
2. **king/answer/film handoffs** — AI-001-scoped, per Claude C's
   self-push note. `king`/`answer` already appear in
   `PICKPRIMARY_VERIFIED_TIES.md` (subclass a). `film`'s sibling gap
   (`movie`) and the silent-object-drop defect (`translate()` dropping
   an unresolved object noun with no error) are untouched, still
   Claude B's.
3. **Resync-sweep backlog** —
   `docs/CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md`, untouched
   this session.

## Standing rules established this session
None. No new `SESSION_BOOTSTRAP.md` rule was added — this session
executed against the governance model the prior session established,
it didn't extend it.

## Next action for the next session
Start the `confidence`/`confidence_source` schema design (AI-001's
actual structural fix) if engineering bandwidth allows, now that both
subclass enumeration artifacts exist to validate against — or continue
triaging `PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`'s 5909 keys against the
confirmed 9-key failure shape if a schema migration isn't in scope for
that session.
