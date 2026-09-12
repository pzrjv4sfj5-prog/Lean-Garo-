# Claude D — Session Migration Doc (2026-09-12)

## Role of Claude D in this repo

Forensic segregation and discrepancy audit. Default mandate: observe, classify,
flag — never adjudicate which Garo form is linguistically correct (Claude A's
call), never make engineering/runtime decisions (Claude B's call), never touch
`master_dictionary.json` or any canonical/runtime file on its own initiative.

The one exception, exercised twice this session: a live, in-chat instruction
from the Project Owner overrides the standing "never delete" default *for that
session*, but only when (a) the full candidate list is shown to the Owner
first, (b) the Owner explicitly confirms, and (c) every target row is
exact-matched (idx, english, garo, confidence) immediately before the write,
with the script asserting the match and the resulting record count before
saving anything. Both deletions this session followed that discipline; neither
was Claude D exercising its own linguistic judgment.

## What happened this session

1. **Forensic segregation audit rebuilt from scratch** (`audit/segregation/build_segregation.py`)
   — prior audit tooling had never been pushed to `origin/main` in any earlier
   session (confirmed absent before starting). Ran a full pass across all
   10,180 records as of that point: 7,194 Class A (needs Claude A), 2,754
   Class B (clean), 117 UNRESOLVED, 49 Class D, 41 Class C, 25 Class E.
2. **Two full forensic-analysis passes** (`build_full_forensic.py`,
   `build_refresh.py`) against the Project Owner's 16-section directive and
   its refresh — repo state, generated-counting detection, malformed-key
   detection, duplicate/shared-Garo separation, confidence/provenance
   forensics, English-key and Garo-orthography normalization audits, and a
   P0–P6 priority ranking. Delivered as evidence packages for Claude A
   (`CLAUDE_A_EVIDENCE_PACKAGE.md`, `CLAUDE_A_EVIDENCE_PACKAGE_REFRESH.md`,
   `CLAUDE_A_EVIDENCE_FULL.csv`) — no verdicts, `MULTIPLE CANDIDATES` framing
   throughout.
3. **Classifier ground-truth reference built**
   (`CLASSIFIER_GROUND_TRUTH_REFERENCE.md`) — cross-checked
   `data/garo_number_classifier_engine_machine_ready.json`'s 16-entry
   classifier table against every counted-noun record in the corpus. Result:
   every noun with `verified_high` data matches the documented rule exactly;
   zero contradictions on the trusted side. This is the reference future
   batches should be checked against before any further deletion.
4. **Batch 1 (commit `913ffd1`)**: deleted 12 records — a generic
   classifier+numeral placeholder (`chet mang·gni`, `chi sa mang·gni`,
   `chet se·gni`) reused byte-identical across dog/cat/bird/fish/apple,
   including malformed-plural keys. All `superseded`, Owner-confirmed.
5. **Batch 2 (commit `bec4fae`)**: deleted 200 records — two more families of
   the same pattern. Family 1 (animal: bird/cat/dog/fish, 80 rows,
   `mang·gni`/`mang·sa` tails). Family 2 (misc: river/student/water, 120
   rows, `chik·gni` tails — `chik` confirmed absent from the official
   16-classifier list entirely, i.e. fabricated, not just misapplied). All
   `superseded`, Owner-confirmed, full 200-row list shown to Owner before and
   after.
6. **Handoff docs to Claude A/B** for both batches
   (`docs/CLAUDE_D_HANDOFF_20260912_batch1_deletion.md`,
   `docs/CLAUDE_D_HANDOFF_20260912_batch2_deletion.md`) — what was deleted,
   why, and what's still open for each of them.

## Repository state across this session (moved multiple times — normal, not a problem)

| Point | HEAD | `master_dictionary.json` hash | Records |
|---|---|---|---|
| Session start | `3ba97c3` | `12e87c9a...` | 10,180 |
| Before Batch 1 | `3ba97c3` | `12e87c9a...` | 10,180 |
| After Batch 1 | `913ffd1` | `681d078c...` | 10,166 |
| Concurrent Claude A edit (`5930c24`, unrelated) | `5930c24` | `fd8b8bda...` | 10,164 |
| After Batch 2 | `bec4fae` | `b8d02ad6...` | 9,964 |
| **Current** | `9e0d90e` (Claude B's `-es`-plural fix, unrelated to dictionary content) | `b8d02ad6...` (unchanged by that commit) | **9,964** |

## Cross-session notes (things I noticed that belong to A/B, not acted on)

- **`sak` is still missing from `RAKA_CLASSIFIERS`** (`src/garo_classifier.js` —
  currently `{mang, ge, gong, te, king}`). Flagged independently by both
  Claude A and me; not yet fixed. Higher-impact than the `king` fix already
  shipped, since `sak` covers all human-noun counting.
- `apple` still carries one leftover `superseded` row using classifier `se`
  (Tools — wrong category for fruit), separate from anything in Batch 1/2.
  Possible Batch 3 candidate, not acted on.
- Family 3 (object: book/car/house/tree, ~75 rows) and Family 4 (food/rice,
  ~40 rows) from the original 315-record candidate set remain pending Owner
  confirmation.

## Gate / verification discipline this session

No test suite applies to Claude D's own output (no runtime code touched), but
every write to `master_dictionary.json` was preceded by an assertion script
that verified exact match on every target row and the exact pre/post record
count, aborting rather than deleting anything unconfirmed. Both batches'
diffs were inspected line-by-line before committing (confirmed: only the
intended deletions, one benign bracket-shift line each).

## Next action

None pending from Claude D. Awaiting Project Owner confirmation for Batch 3
(Family 3/4, or the separate `apple`/`se` item) if desired.
