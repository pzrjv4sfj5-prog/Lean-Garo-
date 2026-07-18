# Pending Lexicon Workflow

_Repository infrastructure documentation. Bootstrapable — a new
contributor (human or Claude) should be able to run the full lifecycle
from this doc alone. Built 2026-07-17/18 (Claude B, Pending Lexicon
sprint). No linguistic decisions are made anywhere in this pipeline —
see "Role boundaries" below._

## Pipeline

```
Published Dictionary
        ↓
scripts/import-dictionary.js       (engineering: structure, provenance, conflict detection)
        ↓
Pending Lexicon (src/data/pending_lexicon.json)
        ↓
Claude A Review                    (linguistic: approve / reject / discuss)
        ↓
Verified Lexicon (review_status: "approved")
        ↓
scripts/promote-lexicon.js         (engineering: copy fields, preserve history)
        ↓
master_dictionary.json → npm run build → compiled_dict.json
```

## Role boundaries (why this shape)

Per the repository's standing integration rule: linguistic content
sourced from outside the codebase (chat, a published dictionary, a
native speaker) is never implemented directly by engineering. This
pipeline is that rule made into infrastructure rather than a manual
step someone has to remember:
- **Import** makes zero linguistic decisions. It validates structure,
  detects conflicts (within-batch and against existing production
  data), assigns provenance, and stages everything as `unreviewed`. It
  never decides which of two conflicting translations is correct.
- **Review** is Claude A's step. It happens by editing
  `src/data/pending_lexicon.json` directly — no special tool is needed
  to review, only to promote (see below). Claude A sets `review_status`
  to `approved`, `rejected`, or `needs-discussion`, and can fill in
  `review_notes`/`reviewed_by`/`reviewed_date`.
- **Promotion** is engineering's step again, but it cannot make a
  linguistic call either — it refuses to promote anything not already
  marked `approved`. It is a copy-and-stamp operation, not a review
  interface.

## Step 1 — Import

```
node scripts/import-dictionary.js <input.json> [--apply]
    [--source "Name of published dictionary"]
    [--source-page "142"] [--ocr-version "v1"]
```

Input: a JSON array of entries, each `{english, garo}` required, plus
optional `category`, `pos`, `classifier`, `notes`, and optional
per-entry provenance overrides `source`, `source_page`, `ocr_version`
(these win over the batch-level `--source`/`--source-page`/
`--ocr-version` flags when present — useful when one OCR batch spans
multiple source pages).

- **Default (no `--apply`)**: dry run. Validates and classifies, writes
  a human-readable report to `docs/IMPORT_REPORTS/`, changes nothing on
  disk. Always do this first on a new batch.
- **`--apply`**: every non-malformed entry is appended to
  `src/data/pending_lexicon.json` as a new record. Malformed entries
  (missing `english`/`garo`, unknown fields) are rejected outright —
  that's a structural problem, not a lexicon question, so they never
  reach the pending store at all. Exact duplicates of what's already in
  `master_dictionary.json` are skipped (nothing to review). Everything
  else — clean, new entries included — lands in Pending Lexicon as
  `unreviewed`. **Nothing is ever promoted automatically by this tool,
  regardless of how clean the entry is.**

## Step 2 — Pending Lexicon schema

Each record in `src/data/pending_lexicon.json`:

| Field | Type | Notes |
|---|---|---|
| `id` | string | `PL-0000001` format, sequential, engineering-assigned, never reused |
| `english` | string | required |
| `garo` | string | required |
| `category` / `pos` / `classifier` / `notes` | string \| null | same shape as `master_dictionary.json` |
| `provenance.source` | string \| null | published dictionary name, chat log, etc. |
| `provenance.source_page` | string \| null | if applicable |
| `provenance.import_batch` | string | auto-assigned, groups entries from one import run |
| `provenance.import_date` | ISO string | auto-assigned |
| `provenance.ocr_version` | string \| null | if the source was OCR'd, which pass |
| `review_status` | enum | `unreviewed` \| `approved` \| `rejected` \| `needs-discussion` — Claude A sets this |
| `review_notes` / `reviewed_by` / `reviewed_date` | string \| null | Claude A fills these in |
| `conflict.type` | enum \| null | `null` \| `within-batch` \| `existing-conflict` — engineering-detected, informational |
| `conflict.details` | array \| null | the other value(s) in conflict |
| `promotion_status` | enum | `pending` \| `promoted` \| `rejected` \| `duplicate-skip` — engineering-managed |
| `promoted_date` | ISO string \| null | set by the promotion tool |

A `conflict.type` or a `review_status` of `unreviewed`/`needs-discussion`
is **normal, healthy pending state** — it is never a repository-health
failure (see Check D below).

## Step 3 — Review (Claude A)

Edit `src/data/pending_lexicon.json` directly. For each entry Claude A
is ready to decide on:
- Set `review_status` to `approved`, `rejected`, or `needs-discussion`.
- Fill `reviewed_by` (e.g. `"Claude A"`) and `reviewed_date`.
- Optionally add `review_notes` (e.g. why a conflicting existing value
  was kept over the imported one, or vice versa — if the correct
  resolution is to keep the *existing* value and discard the import,
  set `review_status: "rejected"`; the import never touches production
  either way).
- `promotion_status` stays `pending` until promoted — reviewers don't
  touch this field, `scripts/promote-lexicon.js` does.

## Step 4 — Promotion

```
node scripts/promote-lexicon.js --id PL-0000001 [--id PL-0000002 ...] [--apply]
node scripts/promote-lexicon.js --all-approved [--apply]
```

Dry run by default (omit `--apply` to preview). Only entries with
`review_status: "approved"` **and** `promotion_status: "pending"` are
promoted; anything else is skipped with a reason printed. On `--apply`:
- `{english, garo, category, pos, classifier, notes}` are copied into
  `master_dictionary.json` (provenance/review fields are not
  production-engine concerns and stay in the pending store).
- The pending record is **preserved**, not deleted —
  `promotion_status` flips to `promoted` and `promoted_date` is
  stamped. Every promoted production entry keeps a permanent link back
  to its source/page/import batch/reviewer.
- Run `npm run build` afterward to regenerate `compiled_dict.json` and
  re-run `repository-intelligence.js` — Check C now audits the
  newly-promoted entries for internal dictionary conflicts too, same as
  any hand-written entry.

## Step 5 — Repository health (Check D)

`repository-intelligence.js` Check D runs on every `npm run build` and
audits `src/data/pending_lexicon.json` structurally. It fails the build
on: missing `id`/`english`/`garo`/`provenance`, duplicate IDs, an
invalid `review_status`/`promotion_status` value, a `promotion_status`
of `promoted` without a matching `approved` review (promotion must
always follow approval, never bypass it), a `promoted` record whose
`(english, garo)` pair isn't actually present in
`master_dictionary.json`, or `prepare-data.js` referencing
`pending_lexicon.json` at all (production must never read pending
data). It never fails on an entry simply being `unreviewed` or flagged
with a `conflict` — that's expected state, not a defect.

## Worked example

```
node scripts/import-dictionary.js my_batch.json --source "Bordoloi 1990" --apply
# → 40 entries staged to src/data/pending_lexicon.json, all unreviewed

# Claude A reviews, approves 35, rejects 3, flags 2 needs-discussion
# (edits src/data/pending_lexicon.json directly)

node scripts/promote-lexicon.js --all-approved --apply
# → 35 entries copied into master_dictionary.json, pending records
#   marked promoted, history preserved

npm run build
# → compiled_dict.json regenerated, Check C/D re-verified
```

## What this pipeline deliberately does NOT do

- Does not infer part-of-speech, grammar rules, or register.
- Does not choose between conflicting translations — ever, at any
  stage. A conflict is always surfaced for Claude A, never
  auto-resolved by either the import or promotion tool.
- Does not touch `translationEngine.js` or any translation-behavior
  code. This is dictionary-data infrastructure only.
