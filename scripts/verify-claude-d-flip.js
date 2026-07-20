/**
 * scripts/verify-claude-d-flip.js — round-trip gate for Claude D's
 * Stage 1 transformation (canonical Garo→English → English→Garo).
 *
 * This does NOT evaluate translation quality or linguistic content.
 * It only asserts the mechanical contract in
 * docs/CLAUDE_D_TRANSFORMATION_SPEC.md was followed: every field that
 * should survive did survive, no enum value was invented, no
 * structural relationship got encoded as a prose sentence.
 *
 * Built 2026-07-17 (Claude A) after finding concrete data loss
 * (ocr_confidence, cross_references dropped; headword_raw silently
 * repurposed; entry_type: "example" invented) in the first sample
 * flip, before any volume of pages went through Claude D for real.
 *
 * USAGE:
 *   node scripts/verify-claude-d-flip.js <source.json> <flipped.json>
 *
 * Exit code 0 = clean. Exit code 1 = spec violations found (printed).
 * This is meant to gate commits of Stage 1 output — a Stage 1 file
 * that fails this script is not considered committed, per the spec.
 */
import fs from 'fs';

const ALLOWED_ENTRY_TYPES = new Set(['lexical', 'affix']);
const CARRY_FIELDS = ['raka_note', 'ocr_confidence', 'cross_references', 'flagged_for_review', 'entry_type'];

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function collectAllStrings(obj, out) {
  if (typeof obj === 'string') {
    out.push(obj);
  } else if (Array.isArray(obj)) {
    for (const v of obj) collectAllStrings(v, out);
  } else if (obj && typeof obj === 'object') {
    for (const v of Object.values(obj)) collectAllStrings(v, out);
  }
  return out;
}

function main() {
  const [, , srcPath, flipPath] = process.argv;
  if (!srcPath || !flipPath) {
    console.error('Usage: node scripts/verify-claude-d-flip.js <source.json> <flipped.json>');
    process.exit(1);
  }

  const src = loadJSON(srcPath);
  const flip = loadJSON(flipPath);
  const violations = [];

  // --- Page-level fields ---
  // (src[f] ?? null) normalizes "key absent" and "key present but null"
  // to the same value - a source file that omits leading_continuation_text
  // entirely (no continuation on that page) is not a violation, it's
  // equivalent to explicitly writing null.
  for (const f of ['page', 'source_image', 'leading_continuation_text']) {
    if (JSON.stringify(src[f] ?? null) !== JSON.stringify(flip[f] ?? null)) {
      violations.push(`page-level field "${f}" changed: ${JSON.stringify(src[f] ?? null)} -> ${JSON.stringify(flip[f] ?? null)}`);
    }
  }
  if (src.direction !== 'garo_to_english') {
    violations.push(`source direction is "${src.direction}", expected "garo_to_english" — wrong input file?`);
  }
  if (flip.direction !== 'english_to_garo') {
    violations.push(`flipped direction is "${flip.direction}", expected "english_to_garo"`);
  }

  // --- Forbidden field name reuse ---
  const flipHasOldHeadwordRaw = (flip.entries || []).some(e => 'headword_raw' in e);
  if (flipHasOldHeadwordRaw) {
    violations.push('flipped entries still use "headword_raw" — must be renamed to "garo_form_raw" per naming rule (source and flip must never share a field name with a different meaning)');
  }

  // --- Per-source-entry checks ---
  const flipByGaro = new Map(); // garo_form_raw -> [flipped rows]
  for (const row of flip.entries || []) {
    const key = row.garo_form_raw;
    if (!flipByGaro.has(key)) flipByGaro.set(key, []);
    flipByGaro.get(key).push(row);
  }

  for (const srcEntry of src.entries || []) {
    const garoKey = srcEntry.headword_raw;
    const flipRows = flipByGaro.get(garoKey);

    if (!flipRows || flipRows.length === 0) {
      violations.push(`source headword "${garoKey}" has no corresponding flipped row(s) at all — entry dropped entirely`);
      continue;
    }

    // entry_type enum check
    if (srcEntry.entry_type && !ALLOWED_ENTRY_TYPES.has(srcEntry.entry_type)) {
      violations.push(`source entry "${garoKey}" has entry_type "${srcEntry.entry_type}" outside the spec'd enum — this shouldn't happen upstream either`);
    }
    for (const row of flipRows) {
      if (row.entry_type && !ALLOWED_ENTRY_TYPES.has(row.entry_type)) {
        violations.push(`flipped row for "${garoKey}" has entry_type "${row.entry_type}" — not in allowed set {${[...ALLOWED_ENTRY_TYPES].join(', ')}}; Claude D must not invent enum values (e.g. "example")`);
      }
    }

    // carry-field preservation. NOTE: headwords can legitimately repeat
    // in this dictionary (e.g. two separate "Bal" entries on page 18 -
    // one a noun cluster, one a numeral-prefix note). So we can't just
    // check flipRows[0] against this source entry - a matching flipped
    // row (by identical carry-field signature) must exist SOMEWHERE
    // among the rows sharing this garo_form_raw, not necessarily first.
    const srcSignature = JSON.stringify(CARRY_FIELDS.map(f => srcEntry[f] ?? null));
    const matchFound = flipRows.some(row => {
      const flipSignature = JSON.stringify(CARRY_FIELDS.map(f => row[f] ?? null));
      return flipSignature === srcSignature;
    });
    if (!matchFound) {
      violations.push(`no flipped row for "${garoKey}" matches source entry's carry-field signature (entry_type/raka_note/ocr_confidence/cross_references/flagged_for_review) - dropped or altered. Source: ${srcSignature}`);
    }

    // sense fan-out check: every sense string in source must appear as
    // an english_gloss_raw somewhere in the flipped rows for this headword
    const srcSenses = [];
    for (const pg of srcEntry.pos_groups || []) {
      for (const s of pg.senses || []) srcSenses.push(s);
    }
    const flipGlosses = new Set(flipRows.map(r => r.english_gloss_raw));
    for (const sense of srcSenses) {
      if (!flipGlosses.has(sense)) {
        violations.push(`sense "${sense}" (from "${garoKey}") not found as english_gloss_raw in any flipped row — dropped or altered in the fan-out`);
      }
    }

    // examples must survive as structured data, not a prose backlink.
    // Checked against any row matching this entry's carry signature
    // (repeated headwords again make "the" single representative row
    // ambiguous - check across the matching set instead).
    const srcExamples = JSON.stringify(srcEntry.examples || []);
    const matchingRows = flipRows.filter(row => {
      const flipSignature = JSON.stringify(CARRY_FIELDS.map(f => row[f] ?? null));
      return flipSignature === srcSignature;
    });
    if (srcEntry.entry_type === 'affix') {
      const anyExamplesMatch = matchingRows.some(row => JSON.stringify(row.examples || []) === srcExamples);
      if (!anyExamplesMatch) {
        violations.push(`affix "${garoKey}" examples not preserved verbatim as a nested array in any matching flipped row (source: ${srcExamples})`);
      }
    }
    for (const row of matchingRows) {
      if (row.source_notes && /example illustrating/i.test(row.source_notes)) {
        violations.push(`"${garoKey}": affix-example relationship encoded as a prose note ("${row.source_notes}") instead of a nested examples[] array — forbidden per spec`);
      }
    }
  }

  // --- Global string-survival sanity check (belt and suspenders) ---
  // Excludes "garo_to_english" itself — that's the source page's own
  // `direction` value, which is SUPPOSED to change to "english_to_garo"
  // per the spec (the one field whose value intentionally differs).
  const srcStrings = new Set(collectAllStrings(src, []).filter(s => s.length > 1 && s !== 'garo_to_english'));
  const flipStrings = new Set(collectAllStrings(flip, []).filter(s => s.length > 1));
  let missingCount = 0;
  for (const s of srcStrings) {
    if (!flipStrings.has(s)) missingCount++;
  }
  if (missingCount > 0) {
    violations.push(`${missingCount} distinct string(s) from the source do not appear anywhere in the flipped output (this is a coarse check — see per-entry violations above for specifics)`);
  }

  if (violations.length === 0) {
    console.log(`OK — ${srcPath} -> ${flipPath}: no spec violations found (${(src.entries || []).length} source entries checked).`);
    process.exit(0);
  } else {
    console.error(`FAILED — ${violations.length} spec violation(s):\n`);
    for (const v of violations) console.error(`  - ${v}`);
    process.exit(1);
  }
}

main();
