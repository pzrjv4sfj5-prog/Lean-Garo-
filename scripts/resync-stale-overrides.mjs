// Mechanical resync pass, per docs/CLAUDE_C_AUDIT_20260815.md §3.2/§3.4.
// For every entry in the Check F baseline (src/data/known_cross_source_conflicts.json),
// determine whether the corrections.json/phrase_maps.js override value matches an
// explicitly-SUPERSEDED master_dictionary.json candidate for that key, while
// compiled_dict.json (already correctly resolving to a VERIFIED candidate) sits
// unused. Where both hold, resync the override to compiled_dict.json's value —
// same shape as the 2026-08-04/07 salt/wait/book/table/buy/door precedent.
// No native input, no linguistic judgment: pure mechanical byte-comparison.
//
// Run with --apply to write changes; without it, report-only (dry run).

import fs from 'fs';
import { normalizeGaro } from './import-dictionary.js';

const APPLY = process.argv.includes('--apply');

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function normalize(v) { return String(v).toLowerCase().trim(); }
function joinKey(k) { return normalize(k).replace(/\?+$/, ''); }
// Garo-value comparison uses the project's own canonical normalizeGaro()
// (strips raka dots/hyphens/parenthetical glosses, case-folds) rather than
// a strict byte-match — matches how Claude C's audit table paired e.g.
// override "Daka" against SUPERSEDED "Dak·a" as the same underlying value.

const baseline = loadJSON('src/data/known_cross_source_conflicts.json');
const corrections = loadJSON('src/data/corrections.json');
const compiledDict = loadJSON('src/compiled_dict.json');
const master = loadJSON('master_dictionary.json');

// phrase_maps.js is an ES module exporting PHRASE_MAPS — extract it via regex-free
// dynamic import through a small CJS-compatible shim (Node ESM import works here
// since this script itself runs as ESM, .mjs).
const { PHRASE_MAPS } = await import('../src/data/phrase_maps.js');

const cdNorm = {};
for (const [k, v] of Object.entries(compiledDict)) cdNorm[joinKey(k)] = { key: k, value: v };

// Build an index from normalized english key -> array of master_dictionary rows
const masterIndex = new Map();
for (const e of master) {
  if (typeof e.english !== 'string') continue;
  const nk = joinKey(e.english);
  if (!masterIndex.has(nk)) masterIndex.set(nk, []);
  masterIndex.get(nk).push(e);
}

function isSuperseded(notes) {
  return typeof notes === 'string' && notes.trim().toUpperCase().startsWith('SUPERSEDED');
}
// Looser than pickPrimary's own strict verifiedNeutral test (which requires
// notes to literally START with "verified/high" and excludes variant-tagged
// entries) — deliberately so, because compiled_dict.json's live output for
// several baseline keys (sleep/teacher/mountain/window/boy/bamboo, spot-
// checked) legitimately resolves to a variant/VERIFIED/HIGH candidate via a
// separate master-preference rule, not the verifiedNeutral shortcut. What
// matters here is only: is this candidate genuinely verified content (not
// SUPERSEDED, not UNVERIFIED, not an OCR-flagged import) — not which of
// prepare-data.js's internal selection paths produced it.
function isVerifiedLike(notes) {
  if (typeof notes !== 'string') return false;
  const n = notes.trim();
  if (isSuperseded(n)) return false;
  if (/unverified/i.test(n)) return false;
  if (/ocr-flagged/i.test(n)) return false;
  return /verified\/high/i.test(n);
}

const results = { resync: [], skip_no_verified_match: [], skip_not_superseded_match: [], skip_no_master_entry: [] };

for (const baselineKey of baseline) {
  const [prefix, ...rest] = baselineKey.split(':');
  const rawKey = rest.join(':');
  const source = prefix === 'corrections' ? corrections : (prefix === 'phrase_maps' ? PHRASE_MAPS : null);
  if (!source) continue;

  // Find the actual source key (case may differ from the normalized baseline key)
  let actualKey = null;
  for (const k of Object.keys(source)) {
    if (joinKey(k) === rawKey) { actualKey = k; break; }
  }
  if (actualKey === null) continue; // key no longer present in source at all

  const overrideValue = source[actualKey];
  if (typeof overrideValue !== 'string') continue;

  const nk = joinKey(actualKey);
  const cdEntry = cdNorm[nk];
  if (!cdEntry) { results.skip_no_master_entry.push({ prefix, key: actualKey, reason: 'no compiled_dict match' }); continue; }
  const compiledValue = cdEntry.value;

  if (normalizeGaro(overrideValue) === normalizeGaro(compiledValue)) continue; // already agrees, not a real mismatch anymore

  const candidates = masterIndex.get(nk) || [];
  const supersededMatch = candidates.find(e => isSuperseded(e.notes) && normalizeGaro(e.garo) === normalizeGaro(overrideValue));
  const verifiedMatch = candidates.find(e => isVerifiedLike(e.notes) && normalizeGaro(e.garo) === normalizeGaro(compiledValue));

  if (!supersededMatch) {
    results.skip_not_superseded_match.push({ prefix, key: actualKey, overrideValue, compiledValue });
    continue;
  }
  if (!verifiedMatch) {
    results.skip_no_verified_match.push({ prefix, key: actualKey, overrideValue, compiledValue });
    continue;
  }

  results.resync.push({ prefix, key: actualKey, from: overrideValue, to: compiledValue, baselineKey });
}

console.log(`Baseline entries checked: ${baseline.length}`);
console.log(`RESYNC candidates (override=SUPERSEDED, compiled_dict=VERIFIED): ${results.resync.length}`);
for (const r of results.resync) {
  console.log(`  [${r.prefix}] "${r.key}": "${r.from}" -> "${r.to}"`);
}
console.log(`Skipped — override doesn't match a SUPERSEDED master candidate (likely intentional variant): ${results.skip_not_superseded_match.length}`);
console.log(`Skipped — no VERIFIED master candidate matches compiled_dict value: ${results.skip_no_verified_match.length}`);
console.log(`Skipped — no compiled_dict entry for this key: ${results.skip_no_master_entry.length}`);

if (APPLY && results.resync.length > 0) {
  const correctionsKeysToUpdate = results.resync.filter(r => r.prefix === 'corrections');
  const phraseMapKeysToUpdate = results.resync.filter(r => r.prefix === 'phrase_maps');

  if (correctionsKeysToUpdate.length > 0) {
    const correctionsPath = 'src/data/corrections.json';
    const c = loadJSON(correctionsPath);
    for (const r of correctionsKeysToUpdate) c[r.key] = r.to;
    fs.writeFileSync(correctionsPath, JSON.stringify(c, null, 2) + '\n');
    console.log(`\nWrote ${correctionsKeysToUpdate.length} update(s) to ${correctionsPath}`);
  }

  if (phraseMapKeysToUpdate.length > 0) {
    const phraseMapsPath = 'src/data/phrase_maps.js';
    let src = fs.readFileSync(phraseMapsPath, 'utf8');
    for (const r of phraseMapKeysToUpdate) {
      // Match the exact "key": "value" or 'key': 'value' line for this key.
      const escapedKey = r.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedFrom = r.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(
        `(['"]${escapedKey}['"]\\s*:\\s*['"])${escapedFrom}(['"])`,
        'u'
      );
      if (!pattern.test(src)) {
        console.log(`  WARNING: could not locate literal source line for phrase_maps key "${r.key}" — skipped, needs manual edit`);
        continue;
      }
      src = src.replace(pattern, `$1${r.to}$2`);
    }
    fs.writeFileSync(phraseMapsPath, src);
    console.log(`Wrote ${phraseMapKeysToUpdate.length} update(s) to ${phraseMapsPath}`);
  }

  // Remove resynced keys from the baseline — they will no longer mismatch.
  const baselineSet = new Set(baseline);
  for (const r of results.resync) baselineSet.delete(r.baselineKey);
  const newBaseline = Array.from(baselineSet).sort((a, b) => a.localeCompare(b));
  fs.writeFileSync('src/data/known_cross_source_conflicts.json', JSON.stringify(newBaseline, null, 2) + '\n');
  console.log(`Removed ${results.resync.length} resynced key(s) from src/data/known_cross_source_conflicts.json baseline (${baseline.length} -> ${newBaseline.length})`);
}

process.exit(0);
