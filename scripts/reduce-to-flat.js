/**
 * scripts/reduce-to-flat.js — deterministic Stage 2 reduction.
 *
 * Takes one or more Stage 1 flipped-page JSON files (output of
 * flip-garo-to-english.js) and produces a single flat array in the
 * shape scripts/import-dictionary.js expects: {english, garo,
 * category?, pos?, classifier?, notes?}.
 *
 * Per docs/CLAUDE_D_TRANSFORMATION_SPEC.md Stage 2 rules:
 *   - affix entries are EXCLUDED (they belong in morphology docs, not
 *     the flat single-word dictionary)
 *   - category/classifier are not derivable from this source; omitted
 *
 * CHANGED 2026-07-18: flagged_for_review entries are NO LONGER
 * excluded. That exclusion was written when import-dictionary.js
 * auto-promoted clean batches and dropping flagged rows was the only
 * way to keep them out of production. Since then, import-dictionary.js
 * was rewritten (Claude B) so that EVERYTHING stages to
 * src/data/pending_lexicon.json for review regardless of clean/
 * flagged status — nothing auto-promotes anymore. Under that
 * architecture, silently dropping flagged rows here means they never
 * reach review at all, which is the opposite of the intent ("route to
 * Claude A review first"). Flagged rows are now included, with the
 * OCR concern folded into `notes` so it's visible in
 * pending_lexicon.json during review.
 *
 * USAGE:
 *   node scripts/reduce-to-flat.js <flipped1.json> [flipped2.json ...] <output.json>
 * (last argument is the output path; all preceding arguments are inputs)
 */
import fs from 'fs';

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function reducePage(flipped) {
  const kept = [];
  let excludedAffix = 0;
  let flaggedIncluded = 0;

  for (const row of flipped.entries || []) {
    if (row.entry_type === 'affix') { excludedAffix++; continue; }
    if (!row.english_gloss_raw || !row.garo_form_raw) continue;

    const flat = {
      english: row.english_gloss_raw,
      garo: row.garo_form_raw,
    };
    if (row.pos) flat.pos = row.pos;

    let notes = row.source_notes || null;
    if (row.flagged_for_review) {
      flaggedIncluded++;
      const flagNote = `[OCR-flagged for review: ocr_confidence=${row.ocr_confidence || 'unknown'}]`;
      notes = notes ? `${flagNote} ${notes}` : flagNote;
    }
    if (notes) flat.notes = notes;
    kept.push(flat);
  }
  return { kept, excludedAffix, flaggedIncluded, total: (flipped.entries || []).length };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node scripts/reduce-to-flat.js <flipped1.json> [flipped2.json ...] <output.json>');
    process.exit(1);
  }
  const outputPath = args[args.length - 1];
  const inputPaths = args.slice(0, -1);

  let allKept = [];
  let totalAffix = 0, totalFlaggedIncluded = 0, totalRows = 0;

  for (const p of inputPaths) {
    const flipped = loadJSON(p);
    const { kept, excludedAffix, flaggedIncluded, total } = reducePage(flipped);
    allKept = allKept.concat(kept);
    totalAffix += excludedAffix;
    totalFlaggedIncluded += flaggedIncluded;
    totalRows += total;
    console.log(`${p}: ${total} rows -> ${kept.length} kept (${flaggedIncluded} flagged, notes-tagged for review), ${excludedAffix} affix excluded`);
  }

  fs.writeFileSync(outputPath, JSON.stringify(allKept, null, 2));
  console.log(`\nWrote ${allKept.length} flat entries to ${outputPath} (from ${totalRows} total rows across ${inputPaths.length} page(s); ${totalAffix} affix excluded to morphology docs, ${totalFlaggedIncluded} flagged and included for review, notes-tagged)`);
}

main();
