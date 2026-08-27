# Claude B Session Migration — 2026-08-27

## Project identity
Lean Garo — English↔Garo translation engine + dictionary compile pipeline.
Full background: `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`.

## Current state
- HEAD = origin/main, `4c56572` — rebased cleanly onto Claude A's
  `1a4f940` migration-close batch (4 commits pushed in the interim,
  between my first fetch and my pre-push fetch: real content changes to
  `master_dictionary.json` / `compiled_dict.json` / `corrections.json` /
  `PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` / etc — disjoint from this
  doc-only commit, zero merge conflicts).
- Working tree clean, zero uncommitted diff.
- Full gate green, **re-verified after the rebase**, against A's updated
  content, not just the pre-rebase snapshot: `test-dictionary.js`
  8185/8185 valid entries (8/9 hardcoded grammatical-correction checks —
  pre-existing stale `quick` expectation, not touched this session);
  `repository-intelligence.js` PASSED, 0 new violations (Check E: 110
  known/0 new; Check F: 85 known/0 new — down from 94 pre-rebase, A's
  batch resolved some of the known cases; Check G: 9924 rows, 0
  confidence-schema problems); `node --test tests/unit/*.test.js`:
  **247/247 passing**. Live `translate()` re-run on all 5 sample keys
  (§6) plus `book` post-rebase — all match, no runtime errors.

## This session: net zero code diff of my own
No dictionary/engine content was changed by me. I audited AI-001, built
one thing mid-session, found it duplicated existing tooling, and reverted
it cleanly (`git checkout -- prepare-data.js`, rebuilt, confirmed
byte-identical `compiled_dict.json`) — see "Self-correction" below. The
only substantive content change on `main` this session is Claude A's own
batch, folded in cleanly by the rebase.
See "Self-correction" below — documented per governance rather than hidden.

## Task scope (as given)
Audit and advance the **engineering** side of AI-001 (pickPrimary precedence).
Explicitly out of scope: any linguistic/lexical/POS/sense decision, and the
AI-fallback provider/wiring (blocked on Project Owner per prior sessions).

## 1. What AI-001 currently does
`pickPrimary` (prepare-data.js) resolves each dictionary key's candidates via
regex parsing of the free-text `notes` field only:
- `isVerified` = notes matches `/^verified\/high\b/i`
- `isWeak` = notes empty, or contains "unverified"/"ocr-flagged"
- `isVariant` / register tagging via a separate regex
Precedence: verified-neutral (unique → ship; tie → last-write-wins among
ties, logged to `docs/PICKPRIMARY_VERIFIED_TIES.md`) → verified-variant
(same shape) → master-sourced last-write-wins (no verified signal at all →
logged to `docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`) → global
last-write-wins fallback.

Confirmed by fresh rebuild this session (pre-rebase): output was
byte-identical to the then-committed `compiled_dict.json`, 16
verified-ties, 5800 no-verified-candidate — matched both report files
exactly, no drift. **Re-confirmed after rebasing onto Claude A's batch**
(which itself touched `PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` and
`master_dictionary.json` directly, resolving some prior no-verified-
candidate rows): rebuild is still byte-identical to the now-committed
`compiled_dict.json`; tie count unchanged at 16 (A's batch didn't touch
the tie set), no-verified-candidate count now 5792 (down 8, expected and
consistent with A's relay-batch fixes, not a drift or defect).

## 2. What the new schema has actually fixed
**Nothing at runtime yet.** The `confidence`/`confidence_source` schema
(design: `docs/PROPOSAL_CONFIDENCE_SCHEMA_20260822.md`) exists as *data* —
9578 of 9913 `master_dictionary.json` rows carry a `confidence` enum value
(`unverified` 6302, `verified_high` 1672, `superseded` 1323, `ocr_flagged`
268, `open` 8, `rejected` 5) — but **nothing reads it**. Confirmed by direct
grep: zero references to the `confidence` field anywhere in `prepare-data.js`
or `src/`. `confidence_source` is 0/9913 — never populated, despite being
part of the original proposal. Step 4 of the proposal (cutover: pickPrimary
reads `confidence` directly) has not been started.

## 3. What remains broken / incomplete
1. **328 rows have no `confidence` value at all** (335 pre-rebase, 9913
   total rows; 328 post-rebase, 9924 total rows — A's batch added 11 new
   rows and resolved 7 of the prior gap, net change unrelated to any B
   engineering work). Includes `book`, whose notes still begin
   `"RECONFIRMED — direct native correction..."` post-rebase — a real,
   directly-reconfirmed native correction that neither the live `isVerified`
   regex nor `scripts/migrate-confidence-schema.js`'s classification regex
   recognizes. It currently resolves correctly (`translate('book')` →
   `Ki·tap`, confirmed live, both pre- and post-rebase) only because it's
   the sole surviving candidate after SUPERSEDED-filtering — not because
   anything marks it high-confidence. If a second candidate for `book` were
   ever added, this row has *zero* structural protection.
2. **~40+ additional rows** (among the 335) use real verification language
   the regex doesn't recognize: `VERIFIED/native-speaker` (14), `CONFIRMED`
   (9), `fix/verified` (6), `Native-confirmed` (3), etc. These are
   classification gaps in both the live regex and the migration script —
   fixing the migration script alone won't help until the 335 gap is closed
   and pickPrimary is switched to read the field.
3. **Cutover itself (step 4) hasn't started.** pickPrimary still derives
   confidence from notes text every build, ignoring the field that already
   exists for 96.6% of rows.
4. **Two likely false positives inside `PICKPRIMARY_VERIFIED_TIES.md` itself**
   (not a pickPrimary defect — a report-accuracy issue): `hoe`'s own citation
   states the native gave *both* candidates as independently valid ("not a
   single winner, genuine dual-valid pair... not a defect"); `where (relative
   pronoun)` carries the same free-variant/short-form shape. Neither should
   likely be listed as an open disambiguation question needing a decision.

## 4. Blocked on Claude A
- Real disambiguation for the genuine open ties: `demand` (Dabia/verb vs
  Dabiani/noun), `greedy` (3-way), `early` (2-way), `cooked` (tie, though
  `grammarOverrides` already pins the same value — redundant-but-harmless),
  and the rest of the 16-key tie list not covered by the false-positive
  finding above.
- Confirming (or overturning) the two probable false positives: `hoe`,
  `where (relative pronoun)` — I did not touch these, flagging only.
- Any of the 335 unclassified rows that turn out, on reading, to need a
  real lexical judgment rather than just a wider regex.

## 5. Pure B engineering (next action)
1. Widen the confidence-classification regex — **in both** the live
   `isVerified`/`isWeak` logic in `prepare-data.js` **and**
   `scripts/migrate-confidence-schema.js` — to recognize the unrecognized
   prefixes found this session (`RECONFIRMED`, `VERIFIED/native-speaker`,
   `CONFIRMED`, `fix/verified`, `Native-confirmed`, and likely a few more —
   re-run the classification against all 335 rows once widened to see what's
   left).
2. Design and implement the actual cutover: `pickPrimary` reads `confidence`
   directly instead of re-deriving it from `notes` via regex each build.
   Re-validate `PICKPRIMARY_VERIFIED_TIES.md` (16) and
   `PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` (5800) counts post-cutover for any
   drift — a change in either count is expected and fine, an *unexplained*
   change is not.

## 6. Runtime verification results
Live `translate()` calls (not just unit tests), all confirmed matching
`compiled_dict.json`:
| key | compiled_dict.json | live translate() |
|---|---|---|
| early | Pring·seng | Pring·seng (exact-phrase, 0.98) |
| hoe | ko·dal | ko·dal (exact-phrase, 0.98) |
| greedy | mik·ni·a | mik·ni·a (exact-phrase, 0.98) |
| demand | Dabiani | Dabiani (exact-phrase, 0.98) |
| book | Ki·tap | Ki·tap (phrase-map, 0.99) — spot check, see §3.1 |

`where (relative pronoun)` is a disambiguation-label key, not directly
user-typed; not independently re-testable via `translate()` the same way —
noted rather than fabricated.

No `grammarOverrides`/`corrections.json` masking found on any of the 5
mandatory sample keys — each traced compiled value matches its live output
with no intervening override.

## 7. Full test/gate results
- `node prepare-data.js`: byte-identical rebuild, 16 ties / 5800
  no-verified-candidate, matches committed reports exactly.
- `node test-dictionary.js`: 8184/8184 valid entries, JSON compliant, 8/9
  grammatical corrections (pre-existing, unrelated `quick` mismatch).
- `node repository-intelligence.js`: **PASSED**, 0 new violations (Check E
  110 known/0 new, Check F 94 known/0 new, Check G 9913/0 problems).
- `node --test tests/unit/*.test.js`: **247/247 passing**, 0 failures.

## Self-correction (documented, not hidden)
Mid-session I built `findCorrectionsDrift` (new function in `prepare-data.js`
+ a new report `docs/CORRECTIONS_COMPILED_DRIFT.md` + a new test file),
believing I'd found an unflagged structural gap: `corrections.json` (runtime
override, checked first by `lookupEngine.js`) can silently ship a different
value than `compiled_dict.json` — confirmed live, `translate('answer')`
returns `Aganchaka` via `corrections.json`, not `compiled_dict.json`'s
`Aganchakani` (itself one of the 16 open ties). Before shipping I checked
existing tooling and found **this is already Check F in
`repository-intelligence.js`** (added 2026-08-02), which already does this
job better (fails the build on *new* mismatches specifically) — `answer` is
already in `known_cross_source_conflicts.json`'s allowlist. I reverted the
duplicate work cleanly rather than ship redundant tooling: `git checkout --
prepare-data.js`, deleted the new test file and generated report, rebuilt,
confirmed byte-identical to origin. Net effect: zero code diff this session.

## Standing rules (unchanged, restated for continuity)
- Do not make linguistic/lexical/POS/sense choices for open rows — leave for
  Claude A.
- 5-key random sample from `PICKPRIMARY_VERIFIED_TIES.md` is mandatory every
  session that file is non-empty, regardless of session focus (governance §3).
- AI-fallback provider/wiring remains blocked on Project Owner input.
- Check existing tooling (`repository-intelligence.js` checks,
  `known_cross_source_conflicts.json`) before building a new detector —
  this session's self-correction is the concrete cautionary example.

## Exact next step
Start a new conversation and paste this document in. Next action is B-only
engineering (§5 above): widen the confidence-classification regex, then
design/implement the pickPrimary cutover. No Claude A sync blocker exists
for starting §5 item 1; §5 item 2 (cutover) should re-validate tie/no-
verified-candidate counts post-change.
