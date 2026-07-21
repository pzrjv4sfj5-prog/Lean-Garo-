/**
 * scripts/normalize-flat-ocr-schema.js — deterministic pre-Stage-1 normalizer.
 *
 * Some incoming OCR pages arrive in a flat legacy schema — one gloss
 * string per entry (semicolon-joined synonym clusters), flat `pos`,
 * `garo_headword_raw`/`english_headword`/`source_page`/`source_notes`
 * field names — rather than the canonical `garo_to_english` schema
 * that scripts/flip-garo-to-english.js expects (`headword_raw`,
 * `pos_groups: [{pos, senses: [...]}]`, `notes`, top-level `page`).
 *
 * This script is a pure, fully-specified mechanical mapping — no
 * linguistic judgment, no conflict resolution, no dedup across
 * repeated headwords (reduce-to-flat.js already handles one-row-per-
 * sense output regardless of whether senses are pre-grouped by
 * headword, so grouping here would add complexity for no benefit).
 *
 * Rule (2026-07-21, Claude A, confirmed against every entry on page
 * 112 before adopting): split `english_headword` on `;`, trim each
 * clause, one clause -> one sense. This is safe ONLY when the
 * semicolon-joined clauses are genuine synonyms under one POS, not
 * distinct senses that happen to share a headword (that's the
 * homonymy risk this project has hit before — `Bal`, `do·o`). Verified
 * true for every page-112 entry; must be spot-checked again for each
 * new page before running this script, not assumed to hold generally.
 *
 * flagged_for_review passes through unchanged from the source (Gemini
 * already flags entries where a repeated headword carries a POS tag
 * that looks copy-pasted from the row above it, e.g. a "-n."/"-adj."
 * sub-entry still tagged "v." — those need Claude A's individual POS
 * correction during pending_lexicon review, not a normalizer guess).
 *
 * Input:  flat legacy schema, {direction, source_page, entries: [
 *           {english_headword, garo_headword_raw, entry_type, pos,
 *            raka_note, cross_references, source_notes,
 *            ocr_confidence, flagged_for_review, source_page,
 *            extra_notes}
 *         ]}
 * Output: canonical schema, ready for flip-garo-to-english.js
 *
 * USAGE:
 *   node scripts/normalize-flat-ocr-schema.js <source.json> [output.json]
 */
import fs from 'fs';

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function normalizeEntry(e) {
  const senses = String(e.english_headword || '')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);

  return {
    headword_raw: e.garo_headword_raw,
    entry_type: e.entry_type || 'lexical',
    raka_note: e.raka_note ?? null,
    cross_references: e.cross_references ?? null,
    notes: e.source_notes ?? e.extra_notes ?? null,
    ocr_confidence: e.ocr_confidence ?? null,
    flagged_for_review: e.flagged_for_review ?? false,
    pos_groups: [{ pos: e.pos ?? null, senses }],
    examples: [],
  };
}

function main() {
  const [, , srcPath, outPathArg] = process.argv;
  if (!srcPath) {
    console.error('Usage: node scripts/normalize-flat-ocr-schema.js <source.json> [output.json]');
    process.exit(1);
  }
  const src = loadJSON(srcPath);
  const page = src.source_page ?? (src.entries?.[0]?.source_page) ?? null;
  const out = {
    page,
    source_image: src.source_image ?? null,
    direction: 'garo_to_english',
    leading_continuation_text: src.leading_continuation_text ?? null,
    entries: (src.entries || []).map(normalizeEntry),
  };
  const outPath = outPathArg || srcPath.replace(/\.json$/, '.normalized.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Normalized ${out.entries.length} entries (page ${page}) -> ${outPath}`);
}

main();
