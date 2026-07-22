# Claude D Ingestion Contract — Design Specification

Status: DRAFT for Claude B to implement. No repository files modified in
producing this document. Written by Claude A, 2026-07-22.

## 0. Where the actual gap is

`scripts/import-dictionary.js` already does correct, deterministic
duplicate/conflict detection *after* Claude D hands off a batch file:
exact-duplicate skip, `within-batch` conflict, `existing-conflict`
against production, all staged to `pending_lexicon.json` with
`review_status: "unreviewed"`. That machinery is sound and this spec
does not change it.

The actual gap is upstream: Claude D currently transcribes an OCR page
in isolation, with no read access to what's already in
`master_dictionary.json` or `pending_lexicon.json`, and no fixed output
schema. Three incompatible schemas have already reached Claude A this
project's life (canonical `garo_to_english`, flat legacy, Claude D's own
`data/claude_d/` format — this is the open `RC-CANDIDATE-024`). The
result: wasted transcription effort on already-known entries, and
extra normalization work on Claude A/B's side per batch.

This spec fixes both: one output schema, and a pre-flight read-only
check against the repo before Claude D commits effort to transcribing
a page.

## 1. Required output schema

Claude D must always emit the canonical `garo_to_english` shape that
`import-dictionary.js` already consumes — never the flat legacy shape,
never a bespoke `data/claude_d/` shape:

```json
{
  "english": "string, required, lowercase",
  "garo": "string, required",
  "category": "string, optional",
  "pos": "string, optional",
  "classifier": "string, optional",
  "notes": "string, optional",
  "source": "string, required — published dictionary name",
  "source_page": "string, required",
  "ocr_version": "string, required"
}
```

One JSON array per page or logical batch, ready to feed directly to
`import-dictionary.js` with no intermediate normalization step. If a
page arrives in a legacy scan format, Claude D converts on the way out,
not Claude A on the way in.

Two non-headword row types must be pulled out and never mixed into
this array:
- Mid-string `.—POS. gloss` markers (e.g. `"to trust.—n. Hope"`) —
  split into two entries before emission.
- `entry_type: "example"` rows (worked examples illustrating an affix)
  — logged separately to a `_examples` sibling array, not submitted as
  headwords. `import-dictionary.js` already errors on unrecognized
  `entry_type` for headwords, by design; Claude D should never trigger
  that by including them in the main array.

## 2. Pre-flight repository checks (before transcribing)

Before Claude D spends effort transcribing a page, it performs
read-only checks:

1. **Page-level**: does `source_page` already appear in
   `master_dictionary.json` or `pending_lexicon.json` provenance
   fields? If yes, halt and report — don't re-transcribe a page
   already processed, even partially.
2. **Entry-level, post-OCR, pre-submission**: for each transcribed
   `english` value, normalize (`lowercase, trim`) and check membership
   in the production `english` set and the pending `english` set.
   This is the same `normalize()` function `import-dictionary.js`
   already uses — Claude D should call it, not reimplement it, so the
   two stay in lockstep by construction rather than by convention.

This second check does not replace `import-dictionary.js`'s conflict
detection — it's a cheaper earlier filter so Claude D can flag likely
overlap in its own output *before* the batch even reaches the import
step, saving Claude A a pass over entries that were always going to be
skipped anyway.

## 3. Classification Claude D performs

Deterministic, string-comparison only — no interpretation:

- **New entry**: normalized `english` not present in production or
  pending.
- **Exact duplicate**: normalized `english` present, and normalized
  `garo` string-equal (after stripping `-`, `·`, spaces, lowercasing —
  same normalization already used for the raka/case-only duplicate
  check in the batch-review workflow) to the existing value.
- **Possible conflict**: normalized `english` present, but `garo`
  string differs. Claude D does **not** decide if this is a genuine
  synonym or an error — it just flags it and moves on.
- **Requires manual review**: anything Claude D cannot classify with
  the above three rules — malformed OCR, the `.—POS.` marker pattern,
  `entry_type: "example"` rows, unclear headword boundaries, mixed
  schema fragments.

## 4. Decisions that belong to Claude D (deterministic only)

- Schema normalization (flat legacy → canonical).
- String-equality duplicate detection (post-normalization).
- Page/entry overlap pre-flight checks against the repo.
- Splitting `.—POS.` compound rows.
- Pulling out `entry_type: "example"` rows.
- Structural validation (required fields present, well-formed JSON).

Claude D must never: pick a winner between conflicting `garo` forms,
judge whether a semicolon-joined cluster is genuine synonymy vs.
disguised homonymy, infer grammar, or resolve register/dialect
questions. All of that stays with Claude A, same as
`import-dictionary.js`'s existing charter.

## 5. Decisions that belong exclusively to Claude A

- Synonym vs. homonymy calls on any flagged conflict.
- Whether a `possible conflict` entry gets promoted, rejected, or
  needs native validation before either.
- Anything touching the `known_dictionary_conflicts.json` allowlist.
- Native validation questions (NV-xxx) arising from ambiguous entries.
- Final `review_status` disposition in `pending_lexicon.json`.

## 6. How Claude D presents conflicts to Claude A

One manifest file per batch, alongside the entry array, not interleaved
with it:

```json
{
  "source_page": "116",
  "new_count": 41,
  "exact_duplicate_count": 3,
  "possible_conflict_count": 2,
  "manual_review_count": 1,
  "possible_conflicts": [
    { "english": "trust", "incoming_garo": "bebe ra·a",
      "existing_garo": "Ka-donga", "existing_source": "page 3" }
  ],
  "manual_review_items": [
    { "raw_ocr_text": "...", "reason": "entry_type: example, not a headword" }
  ]
}
```

This lets Claude A open one small table instead of diffing a full
entry array against production by hand — same spirit as the existing
`docs/IMPORT_REPORTS/` output from `import-dictionary.js`, just one
step earlier in the pipeline.

## 7. Integration with the existing Pending Lexicon workflow

No change to the workflow's shape, only to what arrives at its front
door:

```
OCR page → Claude D (schema-normalize, pre-flight dedupe, classify)
  → clean entry array + conflict manifest
  → scripts/import-dictionary.js (unchanged — still does its own
     independent exact-duplicate/within-batch/existing-conflict pass,
     which now mostly confirms what Claude D already flagged)
  → pending_lexicon.json (review_status: unreviewed)
  → Claude A review (unchanged 7-step batch workflow)
  → scripts/promote-lexicon.js --all-approved --apply
  → master_dictionary.json
```

`import-dictionary.js` keeps running its own checks unconditionally —
Claude D's pre-flight is an optimization, not a trust boundary. If
Claude D's manifest and `import-dictionary.js`'s own classification
ever disagree, that disagreement itself is worth flagging to Claude B,
since it would mean the two `normalize()` implementations have drifted.

## Open item for Claude B

Recommend `import-dictionary.js` grow a `--verify-claude-d-manifest`
flag that diffs its own classification against Claude D's manifest and
reports drift, rather than silently trusting either side. Not required
for this contract to work, but closes the loop.
