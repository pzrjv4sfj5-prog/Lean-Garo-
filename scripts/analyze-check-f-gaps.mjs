/**
 * analyze-check-f-gaps.mjs
 * Claude B, 2026-08-13
 *
 * Read-only analysis tool for the Check F allowlist backlog
 * (src/data/known_cross_source_conflicts.json). Reuses repository-
 * intelligence.js's EXACT matching logic (normalize/joinKey) rather than
 * reimplementing it — a first version of this tool used a slightly
 * different normalize() that stripped trailing punctuation, which caused
 * silent key collisions (e.g. "eat" absorbing "eat!"'s compiled_dict
 * value) and produced a materially wrong dataset. Caught by a direct
 * spot-check against src/compiled_dict.json before anything was acted on
 * — see docs/CLAUDE_B_SESSION_MIGRATION_20260813.md for the full account.
 * Keep this file's normalize()/joinKey() byte-identical to
 * repository-intelligence.js's if that file ever changes.
 *
 * Output: every CURRENT Check F allowlist entry (only allowlisted ones —
 * this does not re-derive "new" violations, run `node
 * repository-intelligence.js` for that), each tagged with a
 * classification (caseOnly / punctuationOnly / sharedRoot / noSharedRoot)
 * based on surface string similarity only. This is NOT a bug/not-bug
 * verdict — see docs/CHECK_F_GAP_REPORT_20260813.md's own warning about
 * treating a data mismatch as bug evidence without checking
 * tests/unit/*.test.js and docs/ history first (the "wait" near-miss).
 *
 * Usage: node scripts/analyze-check-f-gaps.mjs > /tmp/gap_report.json
 */
import fs from 'fs';
import { PHRASE_MAPS } from '../src/data/phrase_maps.js';

// Must match repository-intelligence.js's normalize()/joinKey() exactly.
function normalize(v) { return v.toLowerCase().trim(); }
function joinKey(k) { return normalize(k).replace(/\?+$/, ''); }

const baseline = new Set(JSON.parse(fs.readFileSync(new URL('../src/data/known_cross_source_conflicts.json', import.meta.url), 'utf8')));
const corrections = JSON.parse(fs.readFileSync(new URL('../src/data/corrections.json', import.meta.url), 'utf8'));
const compiledDict = JSON.parse(fs.readFileSync(new URL('../src/compiled_dict.json', import.meta.url), 'utf8'));

const cdNorm = {};
for (const [k, v] of Object.entries(compiledDict)) cdNorm[joinKey(k)] = v;

const all = [];
function checkSource(sourceName, sourceData, prefix) {
  for (const [k, v] of Object.entries(sourceData)) {
    if (typeof v !== 'string') continue;
    const nk = joinKey(k);
    if (!(nk in cdNorm)) continue;
    const cdVal = cdNorm[nk];
    if (typeof cdVal !== 'string') continue;
    if (normalize(cdVal) === normalize(v)) continue;
    const baselineKey = prefix + ':' + nk;
    if (!baseline.has(baselineKey)) continue;
    all.push({ key: k, source: sourceName, sourceVal: v, compiledVal: cdVal, baselineKey });
  }
}
checkSource('corrections', corrections, 'corrections');
checkSource('phrase_maps', PHRASE_MAPS, 'phrase_maps');

function stripPunct(s) { return normalize(s).replace(/[^\w·]/g, ''); }
for (const d of all) {
  if (d.sourceVal.toLowerCase() === d.compiledVal.toLowerCase()) d.category = 'caseOnly';
  else if (stripPunct(d.sourceVal) === stripPunct(d.compiledVal)) d.category = 'punctuationOnly';
  else {
    const a = stripPunct(d.sourceVal), b = stripPunct(d.compiledVal);
    const minLen = Math.min(a.length, b.length);
    let sp = 0;
    while (sp < minLen && a[sp] === b[sp]) sp++;
    d.category = (sp >= 3 || (minLen > 0 && sp / minLen > 0.5)) ? 'sharedRoot' : 'noSharedRoot';
  }
}

console.log(JSON.stringify(all, null, 2));
