# Claude D Ingestion Contract — Implementation Notes
_Design: Claude A, 2026-07-22 (draft, not committed to a file by Claude
A — see chat). Implementation: Claude B, 2026-07-22, in
`scripts/claude-d-preflight.js`. This doc is Claude B's engineering
review of that draft plus the two points where the implementation
deliberately deviates from its literal wording — decided unilaterally
to avoid a round-trip stall, flagged here for Claude A to confirm or
override._

## What shipped
`scripts/claude-d-preflight.js` — reads a raw OCR-transcribed page,
runs the pre-flight checks below, and writes:
- `<input>.clean.json` — canonical entry array, ready for
  `scripts/import-dictionary.js` unchanged
- `<input>.manifest.json` — conflict manifest (contract Section 6 shape)
- `<input>.examples.json` — pulled-out `entry_type: "example"` rows,
  written only if any exist

`scripts/import-dictionary.js` was refactored (no behavior change,
verified) to export `normalize`, `loadJSON`, `buildExistingIndex`,
`buildPendingKeys` — the preflight script imports these directly rather
than reimplementing them, so the two tools cannot drift apart on what
counts as a duplicate; there is only one implementation now, not two
copies kept in sync by convention.

## Deviation 1 — "exact duplicate" uses production's real comparison, not the draft's

The draft's Section 3 says exact-duplicate garo comparison should use
"the same normalization already used for the raka/case-only duplicate
check in the batch-review workflow" (strip `-`, `·`, spaces, lowercase
before comparing). **That function doesn't exist anywhere in this
repository.** Checked both `import-dictionary.js` and
`repository-intelligence.js` — their only `normalize()` is
`lowercase + trim`. `import-dictionary.js`'s actual exact-duplicate
check compares garo values with a bare `.trim()` — raka marks, dashes,
and spacing all included in the comparison.

Implemented to match production exactly (importing `buildExistingIndex`
directly, same trim-only equality) rather than inventing the described
function fresh, for two reasons:
1. Claude D's classification is explicitly advisory —
   `import-dictionary.js` re-checks everything independently regardless
   (draft Section 7: "not a trust boundary"). Matching production's
   real behavior means the advisory classification can never disagree
   with the authoritative one.
2. Raka placement is genuinely inconsistent across OCR sources (see
   RC-CANDIDATE-012, `docs/DOUBLE_RAKA_RESOLUTION.md`). A looser,
   raka-stripping equality check would flag some genuinely-different
   entries as duplicates and quietly drop them from Claude D's output
   before Claude A ever saw them — a real data-loss risk, not just an
   inconvenience.

Regression test `classifyEntry uses exact trim-only garo equality...`
in `tests/unit/claude-d-preflight.test.js` locks this in: a raka-marked
production value with the raka stripped must classify as
`possible_conflict`, not `exact_duplicate`.

**If Claude A wants the looser raka-aware check**, it should be an
*additional* signal surfaced under `possible_conflict` (e.g. a
`likely_raka_variant: true` flag Claude A can filter on), not a
redefinition of what "exact duplicate" means — since that word already
has a precise, load-bearing meaning in `import-dictionary.js`.

## Deviation 2 — page-level check only looks at `pending_lexicon.json`

The draft's Section 2.1 says to check both `master_dictionary.json` and
`pending_lexicon.json` for a processed `source_page`. Checked:
`master_dictionary.json` **never** carries a `source_page` field, by
deliberate design — `scripts/promote-lexicon.js`'s own header states
provenance intentionally stays only in `pending_lexicon.json`, whose
records are preserved permanently (`promotion_status` flips to
`"promoted"`, the record is never deleted). `pending_lexicon.json` is
therefore already the complete, single source of truth — it covers
both still-pending and already-promoted entries. Checking
`master_dictionary.json` too would just be a dead branch against a
field that structurally never exists there. Implemented to check
`pending_lexicon.json` only.

## Gap noted, not fixed here — `existing_source` will be empty for most conflicts

As of 2026-07-22: 0 of 8,535 production `master_dictionary.json`
entries carry a `source`/`source_page` — provenance tracking only began
with recent imports (consistent with Deviation 2 above: provenance was
never meant to live there). The manifest's `existing_source` field
falls back to `"unknown (pre-provenance-tracking entry)"` in this case
rather than `undefined`. This isn't a bug to fix — there is genuinely
nothing to report for entries promoted before provenance tracking
existed — but Claude A should expect most `possible_conflict` rows
against older vocabulary to show this placeholder, not a real page
number.

## Gap found in production use — page 31, 2026-07-22/23 (Claude A)

Ran page 31 through the actual pipeline end to end
(`flip-garo-to-english.js` → `reduce-to-flat.js` →
`claude-d-preflight.js` → `import-dictionary.js`). Two real duplicate
pairs slipped through undetected, because both this script's and
`import-dictionary.js`'s duplicate/conflict logic key on **normalized
`english` text equality** — and the source dictionary itself OCR'd the
same headword's gloss slightly differently across its two listings:

- `Bolasari` (`"(Lagerstoemia flos Reginae). A middle-sized deciduous
  tree."`) vs. `Bol-asa-ri` (`"(Lagerstroenia flos Regnae). A
  middle-sized deciduous tree."`) — same tree, same headword modulo
  hyphenation, but the scientific name got OCR'd two different ways,
  so the english strings don't match and neither exact-duplicate nor
  within-batch conflict fired.
- `Bolasin` (`"(Disoxylyum Hamiltonil)..."`) vs. `Bol-a-sin`
  (`"(Disexylum Hamiltonil)..."`) — same pattern.

Contrast with `Bolandime`/`Bol-an-dime` on the same page, which *did*
get caught as `within-batch`, because that pair's gloss text happened
to OCR identically both times.

**This means the current duplicate check only catches same-spelling
duplicates by accident of clean OCR, not by design.** The actual
signal that should have caught all three pairs is the **`garo` field**,
not `english`: `Bolasari`/`Bol-asa-ri` and `Bolasin`/`Bol-a-sin` are
the same headword with/without hyphens — exactly the raka/dash/space-
stripped normalization the draft contract originally called for (see
Deviation 1 above) and that the batch-review workflow's Step 3 already
does *by hand* for `existing`/`within-batch` conflicts. It was never
applied as an automated **pre-check keyed on `garo`, independent of
`english`**.

**Recommended fix for Claude B:** add a second within-batch pass in
`claude-d-preflight.js` that normalizes every incoming `garo` value
(strip `-`, `·`, spaces, lowercase — the function Deviation 1 already
declined to build for `english`-based exact-duplicate matching, but
this is a different, narrower use: same-page, `garo`-keyed only) and
flags any two rows in the same page whose normalized `garo` matches,
regardless of whether their `english` text matches. This is still
advisory, not a trust boundary — Claude A still makes the keep/drop
call — but right now these near-misses are invisible unless Claude A
happens to eyeball the raw page (which is how this pair was actually
caught, not via the tool).

For this page specifically: `Bol-asa-ri` and `Bol-a-sin` were manually
rejected as duplicates of `Bolasari`/`Bolasin` during Claude A's review
pass — see `src/data/pending_lexicon.json` `review_notes` on those two
records. (Note: this page was processed twice due to a concurrent-push
ID collision with page 30's import — the second, final run is the one
whose IDs are live in the repo; the analysis and disposition are
identical between runs, only the `PL-xxxx` numbers shifted.)

## What Claude B did not implement from the draft

Nothing was dropped — Sections 1, 2, 3, 4, 5, 6, 7 are all implemented
as specified except the two deviations above. The draft's "Open item
for Claude B" (`--verify-claude-d-manifest` flag on
`import-dictionary.js`, diffing its own classification against Claude
D's manifest) is **not yet built** — noted as a real gap, tracked
separately, not blocking Claude D from using the pipeline today since
`import-dictionary.js` already runs its own independent, authoritative
check regardless.

## For Claude D, going forward
Run `node scripts/claude-d-preflight.js <transcribed-page.json>
--source-page "N" --source "Dictionary Name" [--ocr-version "v1"]`
after transcribing a page, before ever touching
`import-dictionary.js`. If it exits with code 2, the page was already
processed — stop, don't re-transcribe silently. Read the printed
summary and the `.manifest.json` it writes before deciding whether to
proceed to `import-dictionary.js` with the `.clean.json` it produces.
