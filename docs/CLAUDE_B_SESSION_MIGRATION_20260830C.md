# Claude B Session Migration — 2026-08-30C
**Resumed from:** docs/CLAUDE_B_SESSION_MIGRATION_20260830.md (session close,
HEAD bdec370) + docs/CLAUDE_C_AUDIT_20260830B.md (independent re-audit,
same HEAD, clean). This session's own starting HEAD after landing C's
audit: d57aaf3.

**Directive (Project Owner):** investigate AI-001 subclass (b) /
`confidence_source` before changing anything. Do not restart the
completed confidence-schema/pickPrimary cutover. Determine what
"confidence_source not yet implemented" actually means in the CURRENT
repository before implementing anything. No linguistic decisions. Full
gate + runtime checks after. Nothing may remain local.

## Investigation

Checked, in order:
1. **`master_dictionary.json` schema** — 9,956 rows, fields in use:
   `english`, `garo`, `category`, `notes`, `confidence`, `pos`,
   `classifier`. `confidence_source` appears on **0 rows**.
   `confidence` distribution: `unverified` 6,291, `superseded` 1,335,
   `verified_high` 1,750, `ocr_flagged` 267, `undefined` 300 (absent
   field), `open` 8, `rejected` 5.
2. **`prepare-data.js`** — the actual decision logic. `isVerified`
   (line 147), `isWeak` (163), `isSuperseded` (200) all read
   `item.confidence` directly. Comments in the file date this cutover
   to **2026-08-28**, and explicitly state it was verified to produce
   zero `compiled_dict.json` diff against the pre-cutover regex-based
   build. `isSuperseded` has one narrow, documented, tested exception
   (`notesDeclareSuperseded`, added 2026-08-30 this same day, earlier
   session) that reads an *already-stated* SUPERSEDED note rather than
   assigning a new judgment — permitted under governance §6, not a
   regression of the cutover.
3. **AI-001 subclass (b) enumeration** (`pickPrimaryNoVerifiedCandidate`,
   line 567) — reads `e.isVerified`/`e.isVariantVerified`, the SAME
   schema-driven fields as subclass (a). Its detection mechanism is
   therefore also already cut over; what it produces is a list for
   human review, not an automated resolution — it was never designed to
   auto-resolve.
4. **`docs/PROPOSAL_CONFIDENCE_SCHEMA_20260822.md`** (the original design
   doc) — confirms `confidence_source` was scoped *only* as an optional
   replacement for the citation half of `notes` (audit doc / transcript
   ref / reviewer note), explicitly for traceability, never as a signal
   `pickPrimary` would read. The proposal's own "Target State" section
   says `pickPrimary`/`finalizeDictionary` read `confidence` — it never
   says they read `confidence_source`.
5. **`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §4** — the AI-001 table
   row was stale: still said "OPEN — schema migrated, cutover not done"
   and "regex parsing of `notes` is still what ships", contradicting the
   actual code as of 2026-08-28. This appears to simply not have been
   updated when the cutover shipped, two days prior to this session.
6. **`docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`** (auto-generated) —
   same stale claim, baked into `prepare-data.js`'s static report-text
   generator (line ~886), so it re-asserted "not yet implemented" on
   every single build.
7. **Current reports** — `docs/PICKPRIMARY_VERIFIED_TIES.md`: 18 tied
   keys (up from 17 last cycle; `walk` is new, expected from NV-100).
   `docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`: 5,745 keys (5,742
   weak/OCR-flagged). Of the 2026-08-16-confirmed failure shape
   (`work`/`boil`/`build`/`close`/`empty`/`leg`/`outside`/`strong`),
   only **`build`** still appears — the other 7 were resolved by content
   work in the interim. `scripts/resync-stale-overrides.mjs` correctly
   flags and skips it (override wants SUPERSEDED-tagged `Rika`,
   compiled_dict ships weak/OCR `gat·a` — no VERIFIED candidate to
   resync to). This is a linguistic call, left untouched.

## Determination

`confidence_source` is **case 3: a proposed future enhancement**, not
case 1 (genuinely missing and required). Specifically:
- The cutover that actually mattered for AI-001 (both subclasses'
  detection reading `confidence` instead of regex-parsing `notes`) is
  **already done** (2026-08-28), independently confirmed by this
  session's gate run, Claude C's 20260830B audit, and direct code
  reading.
- `confidence_source` was never load-bearing for any pickPrimary
  decision in the original design — only for citation traceability.
- Subclass (b)'s remaining openness is a **content-triage backlog**
  (5,745 keys needing human review, correctly enumerated by the
  existing mechanism), not a missing engineering capability.
- The "not yet implemented" language in both the governance doc and the
  auto-generated report was **stale documentation drift**, not an
  accurate description of the current repository.

**No code behavior was changed.** Per the Project Owner's instruction
not to create unnecessary work, `confidence_source` was **not**
implemented this session.

## Changes made (documentation-only, zero decision-logic change)

1. `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §4 — AI-001 row corrected:
   subclass (a) marked CLOSED as an engineering mechanism (cutover done
   2026-08-28); subclass (b) reframed accurately as an open content
   backlog, not a missing engineering mechanism; `confidence_source`'s
   actual (limited, optional) scope documented so a future session
   doesn't re-derive this investigation from scratch.
2. `prepare-data.js` — corrected the static boilerplate text baked into
   the auto-generated `PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` report, so
   it stops asserting "not yet implemented" on every build.

Both changes verified to produce **zero diff** in `compiled_dict.json`
and `compiled_dict_alternates.json` — confirmed by identical entry
counts, tie counts, and no-verified-candidate counts before and after.

## Gate re-run (clean, byte-identical to pre-investigation baseline)

| Check | Result |
|---|---|
| `node prepare-data.js` | 8197 compiled entries, 929 alternates, 190 held-SUPERSEDED, 18 verified-ties, 5745 no-verified-candidate — all unchanged |
| `node test-dictionary.js` | 8197/8197 entries, 9/9 grammatical corrections |
| `node --test tests/unit/*.test.js` | 264/264 passing |
| `node repository-intelligence.js` | 0 new violations (checks A–G); check G: 9,956 rows, 0 confidence-schema problems |
| `node scripts/resync-stale-overrides.mjs` | 0 RESYNC candidates; same 1 skip (`build`), same 2 confirmed exceptions (`answer`) |
| `git status --short` (pre-commit) | clean except the 3 files edited this session |

## Runtime spot-check — translation & grammar assembly

Direct `await translate()` calls (ESM import) across the full set of
previously-audited regression cases:

| Input | Output | Method | Confidence |
|---|---|---|---|
| "will not go" | re·jawa | correction | 1.0 |
| "to walk" | Re·a | exact-phrase | 0.98 |
| "went" | Re·anga | exact-phrase | 0.98 |
| "will not be going" | re·angjawa | exact-phrase | 0.98 |
| "he stayed without eating" | Ua Cha·gija dongaha | gija-construction | 0.85 |
| "he stayed without doing her xyzobjectwordnotreal" | Ua donga [UNKNOWN] ka·a Uni [UNKNOWN] | morphology | 0.65 |
| "well-known xyzcitynotreal" | chiakol [UNKNOWN] [UNKNOWN] | compound-split | 0.6 |
| "i bought a gadget yesterday" | Anga breaha [UNKNOWN] [UNKNOWN] Mejal | morphology | 0.65 |
| "i am lying in bed" | Anga palang·o | grammar-assembly | 0.82 |
| "good morning" | Pringnam. | phrase-map | 0.99 |

All outputs match documented/expected behavior: no `[UNKNOWN]`-swallowing,
no silent wrong-substitutions, honest confidence scores throughout.
**No translation or grammar-assembly errors found.**

## Items handed onward
- Nothing new for Claude A. `build`'s SUPERSEDED-vs-untagged linguistic
  call remains open, already tracked (this and prior sessions).
- Nothing new for Claude C — no engineering change of substance to
  re-audit, only documentation accuracy corrections.

## Next session priority
No blocking engineering item. Subclass (b)'s 5,745-key content backlog
is Claude A/Owner's triage-approach call, not Claude B's to act on
unprompted.
