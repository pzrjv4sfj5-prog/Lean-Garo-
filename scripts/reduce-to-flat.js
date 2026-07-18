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
 *   - flagged_for_review entries are EXCLUDED (route to human/Claude A
 *     review first, never straight into the clean-batch import path)
 *   - category/classifier are not derivable from this source; omitted
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
  let excludedFlagged = 0;

  for (const row of flipped.entries || []) {
    if (row.entry_type === 'affix') { excludedAffix++; continue; }
    if (row.flagged_for_review) { excludedFlagged++; continue; }
    if (!row.english_gloss_raw || !row.garo_form_raw) continue;

    const flat = {
      english: row.english_gloss_raw,
      garo: row.garo_form_raw,
    };
    if (row.pos) flat.pos = row.pos;
    if (row.source_notes) flat.notes = row.source_notes;
    kept.push(flat);
  }
  return { kept, excludedAffix, excludedFlagged, total: (flipped.entries || []).length };
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
  let totalAffix = 0, totalFlagged = 0, totalRows = 0;

  for (const p of inputPaths) {
    const flipped = loadJSON(p);
    const { kept, excludedAffix, excludedFlagged, total } = reducePage(flipped);
    allKept = allKept.concat(kept);
    totalAffix += excludedAffix;
    totalFlagged += excludedFlagged;
    totalRows += total;
    console.log(`${p}: ${total} rows -> ${kept.length} kept, ${excludedAffix} affix excluded, ${excludedFlagged} flagged excluded`);
  }

  fs.writeFileSync(outputPath, JSON.stringify(allKept, null, 2));
  console.log(`\nWrote ${allKept.length} flat entries to ${outputPath} (from ${totalRows} total rows across ${inputPaths.length} page(s); ${totalAffix} affix + ${totalFlagged} flagged excluded, held for separate review)`);
}

main();
