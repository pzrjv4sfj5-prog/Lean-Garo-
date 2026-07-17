/**
 * scripts/flip-garo-to-english.js — deterministic Stage 1 transformation.
 *
 * Replaces the originally-proposed "Claude D" LLM role. Everything this
 * script does is a fully-specified mechanical rule (see
 * docs/CLAUDE_D_TRANSFORMATION_SPEC.md) — renaming fields, fanning out
 * senses into rows, copying arrays verbatim. That means it should be
 * code, not a model call: zero drift, zero per-page cost, and no
 * chance of inventing an enum value the way the one real LLM-flip
 * sample did (entry_type: "example", never spec'd).
 *
 * Input:  canonical Garo→English page JSON, as produced by Gemini
 *         (direction: "garo_to_english")
 * Output: English→Garo page JSON (direction: "english_to_garo"),
 *         written next to the input as <name>.en_garo.json
 *
 * This script is intentionally dumb. It does not deduplicate, does not
 * judge translation quality, does not resolve conflicts. That's Claude
 * A's job, downstream, working from the repository.
 *
 * USAGE:
 *   node scripts/flip-garo-to-english.js <source.json> [output.json]
 */
import fs from 'fs';
import path from 'path';

const ALLOWED_ENTRY_TYPES = new Set(['lexical', 'affix']);

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function flipEntry(srcEntry, page, sourceImage) {
  const entryType = srcEntry.entry_type;
  if (entryType && !ALLOWED_ENTRY_TYPES.has(entryType)) {
    throw new Error(`Entry "${srcEntry.headword_raw}" on page ${page} has entry_type "${entryType}", outside {lexical, affix} — fix upstream (Gemini) extraction, do not patch here.`);
  }

  const shared = {
    garo_form_raw: srcEntry.headword_raw,
    entry_type: entryType,
    raka_note: srcEntry.raka_note ?? null,
    cross_references: srcEntry.cross_references ?? null,
    source_notes: srcEntry.notes ?? null,
    ocr_confidence: srcEntry.ocr_confidence ?? null,
    flagged_for_review: srcEntry.flagged_for_review ?? false,
  };

  if (entryType === 'affix') {
    // One row per affix — examples stay nested, never exploded into
    // sibling rows with a prose backlink (that was defect #4 in the
    // original LLM sample).
    const senses = (srcEntry.pos_groups || []).flatMap(pg => pg.senses || []);
    return senses.map(sense => ({
      ...shared,
      english_gloss_raw: sense,
      pos: (srcEntry.pos_groups || [])[0]?.pos ?? null,
      examples: srcEntry.examples || [],
    }));
  }

  // Lexical: fan out one row per sense, per pos_group.
  const rows = [];
  for (const pg of srcEntry.pos_groups || []) {
    for (const sense of pg.senses || []) {
      rows.push({
        ...shared,
        english_gloss_raw: sense,
        pos: pg.pos ?? null,
        examples: srcEntry.examples || [],
      });
    }
  }
  return rows;
}

function flipPage(src) {
  if (src.direction !== 'garo_to_english') {
    throw new Error(`Expected direction "garo_to_english", got "${src.direction}" — wrong input file?`);
  }
  const entries = (src.entries || []).flatMap(e => flipEntry(e, src.page, src.source_image));
  return {
    page: src.page,
    source_image: src.source_image,
    direction: 'english_to_garo',
    leading_continuation_text: src.leading_continuation_text ?? null,
    entries,
  };
}

function main() {
  const [, , srcPath, outPathArg] = process.argv;
  if (!srcPath) {
    console.error('Usage: node scripts/flip-garo-to-english.js <source.json> [output.json]');
    process.exit(1);
  }
  const src = loadJSON(srcPath);
  const flipped = flipPage(src);
  const outPath = outPathArg || srcPath.replace(/\.json$/, '.en_garo.json');
  fs.writeFileSync(outPath, JSON.stringify(flipped, null, 2));
  console.log(`Wrote ${flipped.entries.length} flipped rows (from ${(src.entries || []).length} source entries) to ${outPath}`);
}

main();
