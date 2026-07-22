/**
 * scripts/import-dictionary.js — Phase 1 of the Pending Lexicon pipeline.
 *
 *   Published Dictionary → IMPORT TOOL → Pending Lexicon → Claude A
 *   Review → Verified → scripts/promote-lexicon.js → master_dictionary.json
 *
 * 2026-07-17 (Claude B, Pending Lexicon sprint): this tool used to
 * auto-append "clean" (non-conflicting) entries straight to
 * master_dictionary.json in --apply mode. That is no longer correct —
 * per the Project Owner's explicit sprint directive, NO imported entry
 * is ever promoted automatically, clean or not. Every entry this tool
 * touches — clean, conflicting, or duplicate — lands in
 * src/data/pending_lexicon.json for Claude A's review. Only
 * scripts/promote-lexicon.js moves anything into production, and only
 * for entries Claude A has explicitly marked review_status="approved".
 *
 * This tool makes zero linguistic decisions. It never picks a winner
 * between conflicting sources, never infers grammar, never resolves
 * register/dialect/vocabulary questions — it validates structure,
 * detects conflicts, and files everything for review with full
 * provenance. See docs/PENDING_LEXICON_WORKFLOW.md for the full
 * lifecycle and schema reference.
 *
 * USAGE:
 *   node scripts/import-dictionary.js <input.json> [--apply]
 *     [--source "Name of published dictionary"]
 *     [--source-page "142"] [--ocr-version "v1"]
 *
 * Input format: JSON array of {english, garo, category?, pos?,
 * classifier?, notes?, source?, source_page?, ocr_version?} — per-entry
 * provenance fields override the batch-level --source/--source-page/
 * --ocr-version flags when present.
 *
 * Default mode is DRY RUN: validates and classifies, writes a report to
 * docs/IMPORT_REPORTS/, changes nothing on disk.
 *
 * --apply mode: appends every non-malformed entry to
 * src/data/pending_lexicon.json as a new pending record (review_status
 * "unreviewed", promotion_status "pending"). Malformed entries are
 * rejected outright — a structural problem, not a lexicon question, so
 * they never even reach the pending store. Exact duplicates of
 * already-production data are reported but skipped (nothing to review).
 */
import fs from 'fs';
import path from 'path';

const ENTRY_FIELDS = ['english', 'garo']; // required
const OPTIONAL_LEXICAL_FIELDS = ['category', 'pos', 'classifier', 'notes'];
const OPTIONAL_PROVENANCE_FIELDS = ['source', 'source_page', 'ocr_version'];
const ALL_INPUT_FIELDS = [...ENTRY_FIELDS, ...OPTIONAL_LEXICAL_FIELDS, ...OPTIONAL_PROVENANCE_FIELDS];

export function normalize(s) {
  return (s || '').toString().toLowerCase().trim();
}

export function loadJSON(p, fallback = null) {
  if (!fs.existsSync(p)) {
    if (fallback !== null) return fallback;
    throw new Error(`File not found: ${p}`);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function validateEntry(entry, idx) {
  const errors = [];
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
    return { valid: false, errors: [`entry ${idx}: not an object`] };
  }
  for (const f of ENTRY_FIELDS) {
    if (typeof entry[f] !== 'string' || entry[f].trim() === '') {
      errors.push(`entry ${idx}: missing/empty required field "${f}"`);
    }
  }
  for (const k of Object.keys(entry)) {
    if (!ALL_INPUT_FIELDS.includes(k)) {
      errors.push(`entry ${idx}: unknown field "${k}" (not in ${ALL_INPUT_FIELDS.join(', ')}) — likely a schema mismatch, not silently dropped`);
    }
  }
  return { valid: errors.length === 0, errors };
}

// Builds the same {normalized-english -> Set<trimmed-garo>} index this
// file uses internally for exact-duplicate/conflict detection against
// production. Exported so Claude D's preflight tooling classifies
// against literally the same data structure and equality rule this file
// uses when it runs its own independent pass later — zero drift by
// construction, not by convention. Equality here is intentionally
// EXACT trim-only, matching this file's own isExactDup check below; it
// does not strip raka marks, dashes, or spacing. See
// docs/CLAUDE_D_INGESTION_CONTRACT_20260722.md for why that specific
// point in the original draft spec doesn't match this file and was
// deliberately not changed to match the draft instead.
export function buildExistingIndex(masterDictionaryPath = 'master_dictionary.json') {
  const existing = loadJSON(masterDictionaryPath);
  const byKey = new Map();
  for (const e of existing) {
    const k = normalize(e.english);
    if (!k) continue;
    if (!byKey.has(k)) byKey.set(k, new Set());
    byKey.get(k).add((e.garo || '').trim());
  }
  return byKey;
}

export function buildPendingKeys(pendingLexiconPath = 'src/data/pending_lexicon.json') {
  const pendingLexicon = loadJSON(pendingLexiconPath, []);
  return new Set(pendingLexicon.map(e => normalize(e.english)));
}

function nextPendingId(pendingLexicon) {
  let max = 0;
  for (const e of pendingLexicon) {
    const m = /^PL-(\d+)$/.exec(e.id || '');
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return (n) => `PL-${String(max + n).padStart(7, '0')}`;
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const inputPath = args.find(a => !a.startsWith('--'));
  const flagValue = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const batchSource = flagValue('--source');
  const batchSourcePage = flagValue('--source-page');
  const batchOcrVersion = flagValue('--ocr-version');

  if (!inputPath) {
    console.error('Usage: node scripts/import-dictionary.js <input.json> [--apply] [--source "..."] [--source-page "..."] [--ocr-version "..."]');
    process.exit(1);
  }
  const incoming = loadJSON(inputPath);
  if (!Array.isArray(incoming)) {
    console.error('Input must be a JSON array of {english, garo, ...} entries.');
    process.exit(1);
  }

  const existingByKey = buildExistingIndex('master_dictionary.json');
  const pendingLexicon = loadJSON('src/data/pending_lexicon.json', []);
  const pendingKeys = buildPendingKeys('src/data/pending_lexicon.json');

  const malformed = [];
  const batchByKey = new Map();
  incoming.forEach((entry, idx) => {
    const v = validateEntry(entry, idx);
    if (!v.valid) {
      malformed.push({ idx, entry, errors: v.errors });
      return;
    }
    const k = normalize(entry.english);
    if (!batchByKey.has(k)) batchByKey.set(k, []);
    batchByKey.get(k).push(entry);
  });

  const batchId = `IMPORT-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const importDate = new Date().toISOString();
  const idFor = nextPendingId(pendingLexicon);
  let idCounter = 1;

  const toStage = [];
  const exactDuplicates = [];
  const alreadyPending = [];

  for (const [k, entries] of batchByKey) {
    const withinBatchConflict = new Set(entries.map(e => e.garo.trim())).size > 1;

    for (const entry of entries) {
      const garo = entry.garo.trim();
      const existingValues = existingByKey.get(k);
      const isExactDup = existingValues && existingValues.has(garo) && !withinBatchConflict;
      if (isExactDup) {
        exactDuplicates.push(entry);
        continue;
      }
      if (pendingKeys.has(k)) alreadyPending.push(entry);

      let conflictType = null;
      let conflictDetails = null;
      if (withinBatchConflict) {
        conflictType = 'within-batch';
        conflictDetails = entries.map(e => e.garo.trim());
      } else if (existingValues && !existingValues.has(garo)) {
        conflictType = 'existing-conflict';
        conflictDetails = [...existingValues];
      }

      toStage.push({
        id: idFor(idCounter++),
        english: entry.english.trim(),
        garo,
        category: entry.category ?? null,
        pos: entry.pos ?? null,
        classifier: entry.classifier ?? null,
        notes: entry.notes ?? null,
        provenance: {
          source: entry.source ?? batchSource ?? null,
          source_page: entry.source_page ?? batchSourcePage ?? null,
          import_batch: batchId,
          import_date: importDate,
          ocr_version: entry.ocr_version ?? batchOcrVersion ?? null,
        },
        review_status: 'unreviewed',
        review_notes: null,
        reviewed_by: null,
        reviewed_date: null,
        conflict: { type: conflictType, details: conflictDetails },
        promotion_status: 'pending',
        promoted_date: null,
      });
    }
  }

  const ts = importDate.replace(/[:.]/g, '-');
  const reportDir = 'docs/IMPORT_REPORTS';
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, `import_${ts}.md`);

  const withinBatchCount = toStage.filter(e => e.conflict.type === 'within-batch').length;
  const existingConflictCount = toStage.filter(e => e.conflict.type === 'existing-conflict').length;
  const cleanCount = toStage.filter(e => e.conflict.type === null).length;

  let report = `# Dictionary Import Report — ${ts}\n`;
  report += `Source: \`${inputPath}\`  \nBatch: \`${batchId}\`  \nMode: ${apply ? 'APPLY (staged to Pending Lexicon)' : 'DRY RUN'}\n\n`;
  report += `| Category | Count |\n|---|---|\n`;
  report += `| Input entries | ${incoming.length} |\n`;
  report += `| Malformed (rejected, never staged) | ${malformed.length} |\n`;
  report += `| Exact duplicates of production (skipped, nothing to review) | ${exactDuplicates.length} |\n`;
  report += `| Already has a pending record from an earlier import | ${alreadyPending.length} |\n`;
  report += `| Staged to Pending Lexicon — clean | ${cleanCount} |\n`;
  report += `| Staged to Pending Lexicon — within-batch conflict | ${withinBatchCount} |\n`;
  report += `| Staged to Pending Lexicon — conflicts with existing production entry | ${existingConflictCount} |\n`;
  report += `| **Total staged to Pending Lexicon** | **${toStage.length}** |\n`;
  report += `| Promoted to production | 0 (this tool never promotes — see scripts/promote-lexicon.js) |\n\n`;

  if (malformed.length) {
    report += `## Malformed (rejected)\n`;
    for (const m of malformed.slice(0, 50)) report += `- entry ${m.idx}: ${m.errors.join('; ')}\n`;
    if (malformed.length > 50) report += `- ... and ${malformed.length - 50} more\n`;
    report += '\n';
  }
  if (toStage.length) {
    report += `## Staged for Claude A review (pending IDs)\n`;
    for (const e of toStage) {
      const flag = e.conflict.type ? ` — **${e.conflict.type}**: ${JSON.stringify(e.conflict.details)}` : '';
      report += `- \`${e.id}\` "${e.english}" → "${e.garo}"${flag}\n`;
    }
    report += '\n';
  }
  fs.writeFileSync(reportPath, report);

  if (apply && toStage.length) {
    const updated = pendingLexicon.concat(toStage);
    fs.writeFileSync('src/data/pending_lexicon.json', JSON.stringify(updated, null, 2) + '\n');
  }

  console.log(report);
  console.log(`Full report: ${reportPath}`);
  if (!apply) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply to stage these entries into src/data/pending_lexicon.json for review.');
  } else {
    console.log(`\n${toStage.length} entries staged to src/data/pending_lexicon.json (review_status: unreviewed).`);
    console.log('Nothing was promoted to production. See docs/PENDING_LEXICON_WORKFLOW.md for next steps.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
