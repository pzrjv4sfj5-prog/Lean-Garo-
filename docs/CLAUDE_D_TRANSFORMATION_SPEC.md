# Claude D Transformation Spec — Garo→English → English→Garo

Status: implemented. Written 2026-07-17 by Claude A after finding
concrete data loss in the first sample flip (page 89) and a schema
collision with `scripts/import-dictionary.js` (built independently by
Claude B the same day).

**Decision (2026-07-17, Project Owner + Claude A): there is no Claude
D.** Everything this spec describes is a fully-specified mechanical
rule with no judgment calls — that's precisely the wrong kind of task
to hand an LLM (zero benefit from model reasoning, full exposure to
model drift, and the one real sample flip proved the drift risk is not
hypothetical). Stage 1 is implemented as a plain deterministic script,
`scripts/flip-garo-to-english.js`, not a model call. The spec below
still describes the *rules* precisely because the script implements
them literally — read it as the script's specification, not as
instructions for a person or model to follow by hand.

## Why two stages, not one

The instinct is "Gemini → Claude D → repository" in one hop. That's
wrong for this repo specifically: `scripts/import-dictionary.js`
already exists, expects a flat `{english, garo, category?, pos?,
classifier?, notes?}` shape, and *rejects* any entry with an unknown
field as a validation error rather than dropping it silently. Claude
D's richer object (pos_groups, examples, ocr_confidence,
flagged_for_review, cross_references) would fail that importer
outright.

So: two stages, two artifacts, two different risk profiles.

```
Gemini canonical Garo→English JSON  (unchanged, already specified)
        ↓
STAGE 1 — Claude D: lossless flip
        ↓
docs/RAW_IMPORTS/<page>_en_garo_full.json   (rich, archival, permanent)
        ↓
STAGE 2 — mechanical reduction (script, not a new Claude instance)
        ↓
flat {english, garo, category?, pos?, classifier?, notes?} batch
        ↓
scripts/import-dictionary.js   (already exists, already validated)
        ↓
master_dictionary.json / docs/PENDING_DICTIONARY_IMPORT_CONFLICTS.md
```

Stage 1 output is never deleted, even after Stage 2 runs. It's the
only place `ocr_confidence`, `flagged_for_review`, and full
`pos_groups` survive — exactly the fields that caught the
`teacher`/`ti·char` compilation bug and the `A·breng` POS mismatch.
Losing them at the reduction step is fine, because reduction is
mechanical and re-runnable; losing them at the *flip* step is not,
because the flip is the only thing that ever sees the Gemini source.

## Stage 1 — Claude D lossless flip

### Field mapping (canonical Garo→English page object → flipped object)

| Source field (Gemini schema) | Target field | Rule |
|---|---|---|
| `page`, `source_image`, `leading_continuation_text` | same, unchanged | copied verbatim, once per page, not per entry |
| `direction: "garo_to_english"` | `direction: "english_to_garo"` | the only field whose *value* changes |
| `entries[].headword_raw` | `entries[].garo_form_raw` | **renamed**, not repurposed — see naming rule below |
| `entries[].entry_type` | `entries[].entry_type` | copied verbatim; see entry_type rule below for affix handling |
| `entries[].raka_note` | `entries[].raka_note` | copied verbatim |
| `entries[].pos_groups[].pos` | `entries[].pos_groups[].pos` | copied verbatim, structure preserved (no flattening) |
| `entries[].pos_groups[].senses[]` | one flipped entry per sense string | see fan-out rule below |
| `entries[].examples[]` | `entries[].examples[]` | copied verbatim, unchanged direction (still `{garo, english}`, not reversed) |
| `entries[].cross_references` | `entries[].cross_references` | copied verbatim — **do not drop** (observed missing from schema entirely in the page-89 sample) |
| `entries[].notes` | `entries[].source_notes` | renamed for clarity that this is Gemini's note, not Claude D's |
| `entries[].ocr_confidence` | `entries[].ocr_confidence` | copied verbatim — **do not drop** (observed missing in the page-89 sample) |
| `entries[].flagged_for_review` | `entries[].flagged_for_review` | copied verbatim, unmodified. Claude D never clears or sets this — only Gemini (upstream) and Claude A (downstream review) may touch it |

### Naming rule

Never reuse a source field name for a value with a different meaning
across directions. The page-89 sample called the English gloss
`headword_raw`, which was `Skigipa`/`Cha·mata`/etc. (the Garo form) in
the source schema. Same key, opposite meaning, across two files that
sit next to each other in the same pipeline — a guaranteed future bug.
Rule: the Garo string is always `garo_form_raw` in every artifact this
pipeline produces, regardless of direction. The English string is
always `english_gloss_raw`.

### Fan-out rule (one Garo→English entry → many English→Garo rows)

A single canonical entry usually has multiple senses (e.g. `Chalak,
adj.: Clever; cunning; shrewd; tactful; ...`). Each sense becomes its
own flipped row, all pointing at the same Garo form:

```json
{"garo_form_raw": "Chalak", "english_gloss_raw": "Clever", "pos": "adj.", "parent_headword": "Chalak", ...}
{"garo_form_raw": "Chalak", "english_gloss_raw": "cunning", "pos": "adj.", "parent_headword": "Chalak", ...}
```

`parent_headword` is new (not in the page-89 sample) — see the
affix-example rule immediately below for why it's required, not
optional.

### entry_type rule (this must be written down, not improvised)

Canonical `entry_type` is `"lexical"` or `"affix"` — a closed
two-value enum, per the Gemini extraction spec. Claude D must not
invent a third value. The page-89 sample introduced
`"entry_type": "example"` for affix worked-examples on the fly; that
stops now. Affix worked-examples become flipped rows with:

- `entry_type: "affix_example"` (a real, spec'd third value, not an
  ad hoc one) — OR simply nested under the parent affix entry as an
  `examples` array (preferred; matches how the source already nests
  them). **Use nesting, not flat sibling rows with a prose backlink.**

Concretely: an affix entry flips to *one* row per affix (not one row
per example), carrying its full `examples[]` array as a proper nested
field:

```json
{
  "garo_form_raw": "-grogro",
  "entry_type": "affix",
  "english_gloss_raw": "A suffix denoting the early hours of day appended to pring",
  "pos": null,
  "examples": [
    {"garo": "pringgrogro", "english": "early hours of the morning"}
  ],
  "flagged_for_review": true
}
```

This eliminates the `"source_notes": "Example illustrating affix
-grogro"` pattern entirely — that was a foreign key encoded as a
sentence, unqueryable and one rewording away from silently breaking.

### Verification requirement

Stage 1 output must pass `scripts/verify-claude-d-flip.js` before it's
considered committed. With Stage 1 now deterministic code rather than
a model call, this gate is mainly a regression test for the flip
script itself (catches a future edit to the script breaking the
contract) rather than a defense against per-run model drift — but it
stays mandatory, since a code bug can silently drop a field just as
effectively as a hallucinating model can. The script does not evaluate
translation quality or linguistic content; it only asserts nothing was
dropped, renamed silently, or invented outside the enum. Claude A does
linguistic review separately, after this gate passes.

## Stage 2 — mechanical reduction to the flat importer shape

Purely mechanical, script-driven (no LLM call needed at all for this
stage — it's a field-selection problem, not a judgment problem):

| Stage 1 field | Flat importer field | Rule |
|---|---|---|
| `english_gloss_raw` | `english` | copied |
| `garo_form_raw` | `garo` | copied |
| `pos` (per pos_group) | `pos` | copied if present, else omitted |
| — | `category` | not derivable from source; omitted (importer treats as optional) |
| — | `classifier` | not derivable from source; omitted |
| `source_notes` | `notes` | copied if present, else omitted |

Entries with `entry_type: "affix"` are **excluded** from Stage 2
entirely — `master_dictionary.json` / `import-dictionary.js` model
single-word lexical entries only; affixes belong in
`MORPHOLOGY_SPECIFICATION.md`'s domain, not the flat dictionary. Same
for any entry with `flagged_for_review: true` — those route to human/
Claude A review first, never straight into the importer's clean-batch
path, regardless of what the importer's own conflict detection would
have caught anyway. This is a stricter gate than the importer applies
by default, intentionally: Stage 2 should never hand the importer
something Gemini itself already flagged as uncertain.

## What Claude D must never do (unchanged from original framing, now itemized against real risks observed)

- Never invent enum values not in this spec (observed: `entry_type: "example"`)
- Never drop a field present in the source (observed: `ocr_confidence`, `cross_references`)
- Never reuse a field name for a different meaning across directions (observed: `headword_raw`)
- Never encode a structural relationship as a prose sentence (observed: affix↔example backlink via `source_notes`)
- Never merge, split, deduplicate, or reorder senses beyond the fan-out rule above
- Never touch `flagged_for_review` — read-only for Claude D
- Never alter Unicode, raka marks (·), hyphens, or spacing in any Garo or English string
