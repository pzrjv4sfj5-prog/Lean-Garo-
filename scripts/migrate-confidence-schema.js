/**
 * scripts/migrate-confidence-schema.js — one-time migration, step 2 of
 * docs/PROPOSAL_CONFIDENCE_SCHEMA_20260822.md (AI-001 structural fix).
 *
 * Materializes a `confidence` value onto every master_dictionary.json
 * row where the existing `notes` text unambiguously implies one, by
 * restating prepare-data.js's own regex classification rather than
 * inventing a new one. Six enum values, in precedence order (first
 * match wins, mirrors the order prepare-data.js itself checks them):
 *
 *   1. superseded    — notes starts "superseded" (already excluded
 *                       from pickPrimary candidacy entirely today).
 *   2. rejected       — notes starts "rejected". NEW as of this
 *                       migration: prepare-data.js's isWeak() does not
 *                       currently recognize this prefix, so a REJECTED
 *                       row is wrongly treated as non-weak today (Gap
 *                       A, docs/CLAUDE_B_TRIAGE_..._20260822.md §3).
 *                       Materializing it here is a deliberate, flagged
 *                       fix, not a neutral restatement.
 *   3. open           — notes starts "open" (native relay batches
 *                       NV-080/NV-085: a new candidate under active
 *                       investigation, not yet resolved). NEW as of
 *                       this migration for the same reason as
 *                       `rejected` — currently misclassified non-weak.
 *   4. verified_high  — notes matches ^verified/high or
 *                       ^variant/verified/high (case-insensitive).
 *   5. unverified     — notes empty, or contains "unverified".
 *   6. ocr_flagged    — notes contains "ocr-flagged".
 *
 * Rows matching none of the above (the ~350-row "other/untagged free
 * text" bucket, docs/PROPOSAL_CONFIDENCE_SCHEMA_20260822.md Current
 * State) are left with NO confidence field — ambiguous, needs Claude
 * A's manual call per the proposal's step 3, not guessed here.
 *
 * 442 rows already carried an ad hoc `confidence` value (uppercase,
 * copied verbatim from notes' leading tag by an earlier, undocumented
 * import step — discovered running this migration's own build-gate
 * check, not anticipated by the original proposal). A pre-existing
 * value is treated as AUTHORITATIVE and only casing-normalized, not
 * re-derived from notes — 2 of the 442 ("bear", "under (sheet/slab/
 * covering)") don't independently reclassify from notes text alone
 * (one is a Gap-B mid-note case, the other has no literal tag string
 * at all — a Project Owner content judgment this script has no basis
 * to second-guess), so re-deriving instead of trusting the existing
 * value would have silently discarded real signal.
 *
 * Idempotent: safe to re-run. A row with an existing valid confidence
 * value keeps it (casing-normalized); a row with none gets classified
 * fresh from notes.
 *
 * USAGE: node scripts/migrate-confidence-schema.js [--apply]
 * Dry run by default; --apply writes master_dictionary.json.
 */
import fs from 'fs';

const PATH = 'master_dictionary.json';
// Legacy ad hoc values found in 442 rows this migration discovered
// (2026-08-17/08-20 relay-import batches) — case-insensitive alias map
// to the canonical lowercase form. Purely a casing/vocabulary
// normalization; the underlying meaning does not change.
const LEGACY_ALIASES = { superseded: 'superseded', 'verified/high': 'verified_high', open: 'open', rejected: 'rejected', 'ocr-flagged': 'ocr_flagged', unverified: 'unverified' };

function normalizeLegacy(value) {
  if (value === undefined || value === null) return undefined;
  const key = String(value).toLowerCase();
  return LEGACY_ALIASES[key];
}

function classify(notes) {
  const n = notes || '';
  const nl = n.toLowerCase();
  if (/^superseded\b/i.test(n)) return 'superseded';
  if (/^rejected\b/i.test(n)) return 'rejected';
  if (/^open\b/i.test(n)) return 'open';
  if (/^variant\/verified\/high\b/i.test(n) || /^verified\/high\b/i.test(n)) return 'verified_high';
  if (!nl || nl.includes('unverified')) return 'unverified';
  if (nl.includes('ocr-flagged')) return 'ocr_flagged';
  return null; // ambiguous — Claude A's call, step 3, not guessed here
}

function main() {
  const apply = process.argv.includes('--apply');
  const dict = JSON.parse(fs.readFileSync(PATH, 'utf8'));

  const counts = {};
  let unresolved = 0;
  let legacyNormalized = 0;
  let newlyAssigned = 0;

  for (const row of dict) {
    const had = row.confidence;
    // A pre-existing confidence value is treated as authoritative, not
    // re-derived — it may reflect a content-level judgment call (see
    // "under (sheet/slab/covering)": Project Owner-confirmed 2026-08-04,
    // notes contain no literal "VERIFIED/HIGH" string at all for the
    // notes-based classifier to find) that this mechanical pass has no
    // basis to override. Only its casing is normalized to canonical form.
    const legacyNormalized_ = normalizeLegacy(had);
    let next;
    if (legacyNormalized_ !== undefined) {
      next = legacyNormalized_;
    } else {
      next = classify(row.notes);
    }
    if (next === null || next === undefined) {
      delete row.confidence;
      unresolved++;
      continue;
    }
    counts[next] = (counts[next] || 0) + 1;
    if (had === undefined) newlyAssigned++;
    else if (had !== next) legacyNormalized++;
    row.confidence = next;
  }

  console.log('Classification counts:');
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: ${v}`);
  console.log(`Unresolved (left without confidence, needs Claude A - step 3): ${unresolved}`);
  console.log(`Newly assigned: ${newlyAssigned}`);
  console.log(`Legacy value normalized to new casing: ${legacyNormalized}`);
  console.log(`Total rows: ${dict.length}`);

  if (!apply) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply to commit.');
    return;
  }
  fs.writeFileSync(PATH, JSON.stringify(dict, null, 2) + '\n');
  console.log('\nmaster_dictionary.json updated.');
}

main();
