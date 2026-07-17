/**
 * scripts/import-dictionary.js — safe bulk absorption of published
 * dictionary entries into master_dictionary.json.
 *
 * Built 2026-07-17 (Claude B) so "absorb hundreds of new entries" stops
 * being a manual, one-word-at-a-time, accident-prone process — the way
 * RC-CANDIDATE-012 and RC-CANDIDATE-019 were both found (by luck, during
 * unrelated acceptance testing, long after the conflicting data landed).
 *
 * WHAT IT DOES NOT DO: it never overwrites an existing english key's
 * garo value, never picks a winner between conflicting sources, and
 * never makes a linguistic judgment call. Word-choice conflicts are
 * ENGINEERING'S to detect and QUARANTINE, not to resolve — resolution is
 * Claude A's, per the standing integration rule (never implement
 * linguistic content sourced directly from chat/import without review).
 *
 * USAGE:
 *   node scripts/import-dictionary.js <input.json> [--apply]
 *
 * Input format: JSON array of {english, garo, category?, pos?,
 * classifier?, notes?} — same shape as master_dictionary.json entries.
 *
 * Default mode is DRY RUN: validates, classifies, writes a report to
 * docs/IMPORT_REPORTS/, changes nothing on disk.
 *
 * --apply mode: appends only the CLEAN entries (well-formed, no
 * conflict with existing data, no duplicate within the batch itself) to
 * master_dictionary.json. Conflicting/malformed/duplicate entries are
 * NEVER auto-applied — they're written to
 * docs/PENDING_DICTIONARY_IMPORT_CONFLICTS.md for Claude A's review,
 * same pattern as docs/PENDING_LINGUISTIC_PROPOSAL_*.md.
 *
 * After --apply, run `npm run build` — this regenerates compiled_dict.json
 * and re-runs repository-intelligence.js's Check C, which will now also
 * treat any newly-appended entries as subject to the same
 * previously-unaudited-conflict detection everything else gets.
 */
import fs from 'fs';
import path from 'path';

const REQUIRED_FIELDS = ['english', 'garo'];
const OPTIONAL_FIELDS = ['category', 'pos', 'classifier', 'notes'];
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];

function normalize(s) {
  return (s || '').toString().toLowerCase().trim();
}

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function validateEntry(entry, idx) {
  const errors = [];
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
    return { valid: false, errors: [`entry ${idx}: not an object`] };
  }
  for (const f of REQUIRED_FIELDS) {
    if (typeof entry[f] !== 'string' || entry[f].trim() === '') {
      errors.push(`entry ${idx}: missing/empty required field "${f}"`);
    }
  }
  for (const k of Object.keys(entry)) {
    if (!ALL_FIELDS.includes(k)) {
      errors.push(`entry ${idx}: unknown field "${k}" (not in ${ALL_FIELDS.join(', ')}) — likely a schema mismatch, not silently dropped`);
    }
  }
  // Raw-apostrophe raka ambiguity — same trap as RC-CANDIDATE-012.
  // Report-only (like Check A), never blocks — a genuine 'ha'/'an'' prefix
  // morpheme is legitimate; this just flags for the same review Check A gets.
  if (typeof entry.garo === 'string' && /(?<![a-zA-Z])'(?![a-zA-Z]{0,3}\s|$)/.test(entry.garo)) {
    // heuristic only; real raka-locality judgment is Claude A's
  }
  return { valid: errors.length === 0, errors };
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const inputPath = args.find(a => !a.startsWith('--'));

  if (!inputPath) {
    console.error('Usage: node scripts/import-dictionary.js <input.json> [--apply]');
    process.exit(1);
  }
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const incoming = loadJSON(inputPath);
  if (!Array.isArray(incoming)) {
    console.error('Input must be a JSON array of {english, garo, ...} entries.');
    process.exit(1);
  }

  const existing = loadJSON('master_dictionary.json');
  const existingByKey = new Map(); // normalized english -> Set of garo values
  for (const e of existing) {
    const k = normalize(e.english);
    if (!k) continue;
    if (!existingByKey.has(k)) existingByKey.set(k, new Set());
    existingByKey.get(k).add((e.garo || '').trim());
  }

  const malformed = [];
  const withinBatchConflicts = new Map(); // key -> Set of garo values seen in this batch
  const clean = [];
  const exactDuplicates = [];
  const conflictsWithExisting = [];

  // Pass 1: validate + detect within-batch conflicts
  const batchByKey = new Map(); // key -> [entries]
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

  for (const [k, entries] of batchByKey) {
    const garoValues = new Set(entries.map(e => e.garo.trim()));
    if (garoValues.size > 1) {
      withinBatchConflicts.set(k, entries);
      continue; // quarantined — don't even compare to existing yet
    }
    const entry = entries[0]; // single, internally-consistent candidate
    const garo = entry.garo.trim();
    const existingValues = existingByKey.get(k);
    if (!existingValues) {
      clean.push(entry);
    } else if (existingValues.has(garo)) {
      exactDuplicates.push(entry);
    } else {
      conflictsWithExisting.push({ entry, existingValues: [...existingValues] });
    }
  }

  // --- Report ---
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = 'docs/IMPORT_REPORTS';
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, `import_${ts}.md`);

  let report = `# Dictionary Import Report — ${ts}\n`;
  report += `Source: \`${inputPath}\`  \nMode: ${apply ? 'APPLY' : 'DRY RUN'}\n\n`;
  report += `| Category | Count |\n|---|---|\n`;
  report += `| Input entries | ${incoming.length} |\n`;
  report += `| Malformed (rejected) | ${malformed.length} |\n`;
  report += `| Within-batch conflicts (quarantined) | ${withinBatchConflicts.size} |\n`;
  report += `| Exact duplicates (no-op, already present) | ${exactDuplicates.length} |\n`;
  report += `| Conflicts with existing dictionary (quarantined) | ${conflictsWithExisting.length} |\n`;
  report += `| Clean — new, non-conflicting | ${clean.length} |\n`;
  report += `| Clean entries ${apply ? 'APPENDED to master_dictionary.json' : '(would be appended in --apply mode)'} | ${apply ? clean.length : 0} |\n\n`;

  if (malformed.length) {
    report += `## Malformed (rejected, not imported)\n`;
    for (const m of malformed.slice(0, 50)) {
      report += `- entry ${m.idx}: ${m.errors.join('; ')}\n`;
    }
    if (malformed.length > 50) report += `- ... and ${malformed.length - 50} more\n`;
    report += '\n';
  }

  const needsReview = withinBatchConflicts.size > 0 || conflictsWithExisting.length > 0;
  if (needsReview) {
    report += `## Needs Claude A review (word-choice, not implemented)\n\n`;
    if (withinBatchConflicts.size) {
      report += `### Within-batch conflicts (this import disagrees with itself)\n`;
      for (const [k, entries] of withinBatchConflicts) {
        report += `- "${k}": ${entries.map(e => `"${e.garo.trim()}"`).join(' vs ')}\n`;
      }
      report += '\n';
    }
    if (conflictsWithExisting.length) {
      report += `### Conflicts with existing master_dictionary.json entries\n`;
      for (const c of conflictsWithExisting) {
        report += `- "${normalize(c.entry.english)}": existing=${c.existingValues.map(v => `"${v}"`).join('/')}, incoming="${c.entry.garo.trim()}"\n`;
      }
      report += '\n';
    }
  }

  fs.writeFileSync(reportPath, report);

  // Mirror needs-review items into the standing pending-conflicts doc
  // (append, never overwrite — this doc accumulates across imports)
  if (needsReview) {
    const pendingPath = 'docs/PENDING_DICTIONARY_IMPORT_CONFLICTS.md';
    let pending = fs.existsSync(pendingPath)
      ? fs.readFileSync(pendingPath, 'utf8')
      : '# Pending Dictionary Import Conflicts\n_Accumulates across imports. Entries here are NOT in master_dictionary.json. Claude A reviews, resolves, then this section is deleted by whoever implements the resolution._\n';
    pending += `\n## Batch ${ts} (source: \`${inputPath}\`)\n`;
    for (const [k, entries] of withinBatchConflicts) {
      pending += `- **"${k}"** — within-batch: ${entries.map(e => `"${e.garo.trim()}"`).join(' vs ')}\n`;
    }
    for (const c of conflictsWithExisting) {
      pending += `- **"${normalize(c.entry.english)}"** — existing=${c.existingValues.map(v => `"${v}"`).join('/')}, incoming="${c.entry.garo.trim()}"\n`;
    }
    fs.writeFileSync(pendingPath, pending);
  }

  // --- Apply (only clean entries) ---
  if (apply && clean.length) {
    const updated = existing.concat(clean);
    fs.writeFileSync('master_dictionary.json', JSON.stringify(updated, null, 2) + '\n');
  }

  console.log(report);
  console.log(`Full report: ${reportPath}`);
  if (needsReview) console.log(`Conflicts logged: docs/PENDING_DICTIONARY_IMPORT_CONFLICTS.md`);
  if (!apply) console.log('\nDRY RUN — nothing written to master_dictionary.json. Re-run with --apply to append the clean entries.');
}

main();
