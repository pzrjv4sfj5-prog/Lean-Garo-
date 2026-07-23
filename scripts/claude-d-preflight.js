/**
 * scripts/claude-d-preflight.js — Claude D's pre-transcription and
 * pre-submission checks, per docs/CLAUDE_D_INGESTION_CONTRACT_20260722.md
 * (design: Claude A; implementation: Claude B).
 *
 *   OCR page → THIS SCRIPT (schema-normalize, pre-flight dedupe, classify)
 *     → clean entry array + conflict manifest
 *     → scripts/import-dictionary.js (unchanged, still authoritative)
 *
 * This tool makes zero linguistic decisions, same charter as
 * import-dictionary.js: it never picks a winner between conflicting
 * garo forms, never judges synonym vs. homonymy, never infers grammar.
 * It only does deterministic string-comparison classification and
 * structural cleanup, then hands everything to Claude A via the
 * manifest — see contract Section 4/5 for the exact boundary.
 *
 * IMPORTANT DEVIATION FROM THE DRAFT CONTRACT (documented, not silent):
 * the draft spec's Section 3 describes "exact duplicate" as garo
 * string-equality "after stripping -, ·, spaces, lowercasing — same
 * normalization already used for the raka/case-only duplicate check in
 * the batch-review workflow." That function does not exist anywhere in
 * this repository — import-dictionary.js's own exact-duplicate check
 * (which this script reuses directly, not a reimplementation) compares
 * garo values with a bare `.trim()`, no raka/dash/space stripping at
 * all. Implementing the draft's looser rule here would mean this
 * script's "exact duplicate" classification could disagree with what
 * import-dictionary.js actually does downstream — exactly the kind of
 * drift the contract's own Section 7 says is worth flagging. Since
 * this script's classification is explicitly advisory (Section 7:
 * "Claude D's pre-flight is an optimization, not a trust boundary" —
 * import-dictionary.js re-checks everything independently regardless),
 * matching production's real behavior exactly was judged the safer
 * default. If Claude A wants a looser raka-aware fuzzy check, it
 * belongs under "possible_conflict" as an ADDITIONAL signal, not as a
 * redefinition of "exact duplicate" — flag it back if so.
 *
 * Also: "existing_source" in the manifest is null/placeholder for the
 * vast majority of production entries. As of 2026-07-22, 0 of 8,535
 * production entries carry a source/source_page field — provenance
 * tracking only began with recent imports. This is not a bug in this
 * script; there is genuinely nothing to report for older entries.
 *
 * USAGE:
 *   node scripts/claude-d-preflight.js <input.json>
 *     --source-page "116" [--source "Name of published dictionary"]
 *     [--ocr-version "v1"] [--legacy-schema]
 *
 *   --legacy-schema: run scripts/normalize-flat-ocr-schema.js first if
 *   the input isn't already in canonical {english, garo, ...} shape.
 *   Omit if the page is already canonical.
 *
 * Output (both written next to the input, not to docs/IMPORT_REPORTS/
 * — that directory is import-dictionary.js's own report space, kept
 * separate per contract Section 6 "not interleaved with it"):
 *   <input>.clean.json     — canonical entry array, ready for
 *                             import-dictionary.js
 *   <input>.manifest.json  — conflict manifest, contract Section 6 shape
 *   <input>.examples.json  — pulled-out entry_type:"example" rows,
 *                             written only if any exist
 *
 * Exit code 2 (not 0/1) specifically when the page-level pre-flight
 * check halts the run — distinct from a generic error, so a calling
 * script/session can tell "already processed, stop" apart from "this
 * actually broke."
 */
import fs from 'fs';
import path from 'path';
import {
  normalize,
  loadJSON,
  buildExistingIndex,
  buildPendingKeys,
} from './import-dictionary.js';

const MASTER_DICT_PATH = 'master_dictionary.json';
const PENDING_LEXICON_PATH = 'src/data/pending_lexicon.json';

// Same required/optional field contract as import-dictionary.js input,
// per the ingestion contract's Section 1 canonical schema.
const REQUIRED_FIELDS = ['english', 'garo', 'source', 'source_page', 'ocr_version'];
const OPTIONAL_FIELDS = ['category', 'pos', 'classifier', 'notes'];

// Splits a mid-string ".—POS. gloss" marker into two logical entries,
// per contract Section 1. Example: "to trust.—n. Hope" ->
// ["to trust", {gloss: "Hope", pos: "n."}]. Returns null if the pattern
// isn't present, so callers can tell "nothing to split" from "split
// into an empty result."
const POS_MARKER = /^(.*?)\.\s*—\s*([a-z.]+)\.?\s+(.+)$/i;
export function splitPosMarker(englishText) {
  const m = POS_MARKER.exec((englishText || '').trim());
  if (!m) return null;
  const [, headword, pos, gloss] = m;
  return {
    headword: headword.trim(),
    derived: { english: gloss.trim().toLowerCase(), pos: pos.trim() },
  };
}

function isExampleRow(entry) {
  return entry && entry.entry_type === 'example';
}

function validateCanonical(entry, idx) {
  const errors = [];
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
    return { valid: false, errors: [`entry ${idx}: not an object`] };
  }
  for (const f of ['english', 'garo']) {
    if (typeof entry[f] !== 'string' || entry[f].trim() === '') {
      errors.push(`entry ${idx}: missing/empty required field "${f}"`);
    }
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Page-level pre-flight check (contract Section 2.1). The contract's
 * original wording says to check both master_dictionary.json and
 * pending_lexicon.json — but master_dictionary.json never carries a
 * source_page field by deliberate design (see
 * scripts/promote-lexicon.js's own header: provenance intentionally
 * stays only in pending_lexicon.json, whose records are preserved
 * permanently — promotion_status flips to "promoted", the record is
 * never deleted). pending_lexicon.json is therefore already the
 * complete, single source of truth for "has this page been processed,"
 * covering both still-pending AND already-promoted entries. Checking
 * master_dictionary.json in addition would just be dead code against a
 * field that structurally can't be there.
 * Returns { alreadyProcessed: boolean, locations: string[] }.
 */
export function checkPageAlreadyProcessed(sourcePage, pendingLexiconPath = PENDING_LEXICON_PATH) {
  const pending = loadJSON(pendingLexiconPath, []);
  const inPending = pending.some(e => (e.provenance && e.provenance.source_page) === sourcePage);
  return { alreadyProcessed: inPending, locations: inPending ? ['src/data/pending_lexicon.json'] : [] };
}

/**
 * Entry-level classification (contract Section 3). Deterministic,
 * string-comparison only. `existingByKey`/`pendingKeys` come from
 * import-dictionary.js's own builders — see file header for why.
 */
export function classifyEntry(entry, existingByKey, pendingKeys) {
  const k = normalize(entry.english);
  const garo = (entry.garo || '').trim();
  const existingValues = existingByKey.get(k);

  if (existingValues && existingValues.has(garo)) {
    return { classification: 'exact_duplicate', existing_garo: [...existingValues] };
  }
  if (existingValues) {
    return { classification: 'possible_conflict', existing_garo: [...existingValues] };
  }
  if (pendingKeys.has(k)) {
    return { classification: 'possible_conflict', existing_garo: null, note: 'already has an unreviewed pending record' };
  }
  return { classification: 'new', existing_garo: null };
}

/**
 * Advisory-only signal (does NOT affect classification): does the
 * incoming garo match an existing value after stripping raka marks,
 * dashes, spaces, and case? This is exactly the looser comparison the
 * original draft contract described for "exact duplicate" — kept out
 * of that classification deliberately (see file header, Deviation 1)
 * but genuinely useful as a triage hint: on page 30, 4 of 6
 * possible_conflict entries turned out to be raka/case variants of an
 * already-production word ("Bite" vs "bi·te" for fruit, "Bitong" vs
 * "bi·am·bong" for trunk) rather than new synonyms. Flagging this lets
 * Claude A separate "probably just formatting, confirm and skip" from
 * "genuinely new word" without this script silently deciding either
 * way — it only ever suggests, never merges or drops an entry.
 */
export function normalizeGaroLoose(s) {
  return (s || '').toString().toLowerCase().replace(/[·\-\s]/g, '');
}

function findRakaVariantMatch(incomingGaro, existingValues) {
  if (!existingValues) return null;
  const loose = normalizeGaroLoose(incomingGaro);
  for (const v of existingValues) {
    if (v !== incomingGaro && normalizeGaroLoose(v) === loose) return v;
  }
  return null;
}

/**
 * Within-batch, garo-keyed near-duplicate detection (contract notes
 * doc, "Gap found in production use — page 31", Claude A 2026-07-23).
 * Complementary to classifyEntry's possible_conflict check, not a
 * replacement: that check only fires once english already matches
 * something. This one is independent of english entirely, because the
 * actual failure mode was the SAME garo headword OCR'd two different
 * ways across two listings on one page (Bolasari / Bol-asa-ri), with
 * the gloss also OCR'd slightly differently each time — so neither
 * english-keyed exact-duplicate nor within-batch conflict detection
 * ever saw them as related.
 *
 * Groups same-batch entries by normalizeGaroLoose(garo). A group only
 * gets flagged if it contains 2+ DISTINCT raw garo strings — a group
 * where every row shares one identical raw garo string is normal
 * multi-sense fan-out from a single headword (e.g. "Bitong" ->
 * trunk/girth/shaft/stalk, four rows, same literal garo each time) and
 * must NOT be flagged; only near-misses where the raw spelling itself
 * differs are the actual signal.
 */
export function findGaroKeyedNearDuplicates(entries) {
  const groups = new Map(); // normalized garo -> Map(raw garo -> [english,...])
  for (const e of entries) {
    const loose = normalizeGaroLoose(e.garo);
    if (!loose) continue;
    if (!groups.has(loose)) groups.set(loose, new Map());
    const rawMap = groups.get(loose);
    if (!rawMap.has(e.garo)) rawMap.set(e.garo, []);
    rawMap.get(e.garo).push(e.english);
  }

  const flagged = [];
  for (const [loose, rawMap] of groups) {
    if (rawMap.size < 2) continue; // one raw spelling only -> normal fan-out, not a near-duplicate
    flagged.push({
      normalized_garo: loose,
      variants: [...rawMap.entries()].map(([garo, englishList]) => ({ garo, english: englishList })),
    });
  }
  return flagged;
}

function findExistingSource(entry, existingByKey, masterDictionaryPath) {
  // Best-effort only — see file header re: provenance coverage gap.
  const master = loadJSON(masterDictionaryPath);
  const k = normalize(entry.english);
  const match = master.find(e => normalize(e.english) === k);
  if (match && (match.source || match.source_page)) {
    return [match.source, match.source_page].filter(Boolean).join(', page ');
  }
  return 'unknown (pre-provenance-tracking entry)';
}

function main() {
  const args = process.argv.slice(2);
  const inputPath = args.find(a => !a.startsWith('--'));
  const flagValue = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const sourcePage = flagValue('--source-page');
  const source = flagValue('--source');
  const ocrVersion = flagValue('--ocr-version');

  if (!inputPath || !sourcePage) {
    console.error('Usage: node scripts/claude-d-preflight.js <input.json> --source-page "116" [--source "..."] [--ocr-version "..."]');
    process.exit(1);
  }

  // --- Step 1: page-level pre-flight (contract Section 2.1) ---
  const pageCheck = checkPageAlreadyProcessed(sourcePage);
  if (pageCheck.alreadyProcessed) {
    console.error(`HALT: source_page "${sourcePage}" already appears in: ${pageCheck.locations.join(', ')}.`);
    console.error('Not re-transcribing. If this page genuinely needs re-processing (e.g. correcting a bad prior OCR pass), say so explicitly rather than re-running silently.');
    process.exit(2);
  }

  const incoming = loadJSON(inputPath);
  if (!Array.isArray(incoming)) {
    console.error('Input must be a JSON array.');
    process.exit(1);
  }

  // --- Step 2: pull out non-headword rows (contract Section 1) ---
  const examples = [];
  const headwordCandidates = [];
  for (const raw of incoming) {
    if (isExampleRow(raw)) {
      examples.push(raw);
      continue;
    }
    headwordCandidates.push(raw);
  }

  // --- Step 3: split .—POS. compound rows (contract Section 1) ---
  const split = [];
  const manualReview = [];
  for (const entry of headwordCandidates) {
    const posMarker = splitPosMarker(entry.english);
    if (posMarker) {
      // Original headword, cleaned.
      split.push({ ...entry, english: posMarker.headword });
      // Derived entry from the embedded gloss. Its garo value is not
      // independently known from the marker text alone (the marker
      // only gives an English gloss + POS, not a Garo form) — flagged
      // for manual review rather than guessed.
      manualReview.push({
        raw_ocr_text: entry.english,
        reason: `.—POS. marker split off a derived headword ("${posMarker.derived.english}", pos: ${posMarker.derived.pos}) with no Garo form given in the marker itself — needs a Garo value before it can be a real entry, not something this script can supply.`,
      });
    } else {
      split.push(entry);
    }
  }

  // --- Step 4: structural validation ---
  const clean = [];
  split.forEach((entry, idx) => {
    const v = validateCanonical(entry, idx);
    if (!v.valid) {
      manualReview.push({ raw_ocr_text: JSON.stringify(entry), reason: v.errors.join('; ') });
      return;
    }
    clean.push({
      english: entry.english.trim().toLowerCase(),
      garo: entry.garo.trim(),
      category: entry.category ?? undefined,
      pos: entry.pos ?? undefined,
      classifier: entry.classifier ?? undefined,
      notes: entry.notes ?? undefined,
      source: entry.source ?? source,
      source_page: entry.source_page ?? sourcePage,
      ocr_version: entry.ocr_version ?? ocrVersion,
    });
  });

  // --- Step 5: classify against production + pending (contract Section 2.2/3) ---
  const existingByKey = buildExistingIndex(MASTER_DICT_PATH);
  const pendingKeys = buildPendingKeys(PENDING_LEXICON_PATH);

  let newCount = 0, exactDupCount = 0, conflictCount = 0;
  const possibleConflicts = [];
  for (const entry of clean) {
    const { classification, existing_garo } = classifyEntry(entry, existingByKey, pendingKeys);
    if (classification === 'new') newCount++;
    else if (classification === 'exact_duplicate') exactDupCount++;
    else {
      conflictCount++;
      const rakaMatch = findRakaVariantMatch(entry.garo, existing_garo);
      possibleConflicts.push({
        english: entry.english,
        incoming_garo: entry.garo,
        existing_garo: existing_garo || null,
        existing_source: existing_garo ? findExistingSource(entry, existingByKey, MASTER_DICT_PATH) : null,
        likely_raka_variant: rakaMatch !== null,
        raka_variant_of: rakaMatch,
      });
    }
  }

  // --- Step 6: write outputs ---
  const outBase = inputPath.replace(/\.json$/, '');
  const cleanPath = `${outBase}.clean.json`;
  const manifestPath = `${outBase}.manifest.json`;
  const examplesPath = `${outBase}.examples.json`;

  fs.writeFileSync(cleanPath, JSON.stringify(clean, null, 2) + '\n');

  const manifest = {
    source_page: sourcePage,
    new_count: newCount,
    exact_duplicate_count: exactDupCount,
    possible_conflict_count: possibleConflicts.length,
    likely_raka_variant_count: possibleConflicts.filter(c => c.likely_raka_variant).length,
    manual_review_count: manualReview.length,
    garo_keyed_near_duplicates: findGaroKeyedNearDuplicates(clean),
    possible_conflicts: possibleConflicts,
    manual_review_items: manualReview,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  if (examples.length) {
    fs.writeFileSync(examplesPath, JSON.stringify(examples, null, 2) + '\n');
  }

  console.log(`Page ${sourcePage}: ${clean.length} candidate entries (${newCount} new, ${exactDupCount} exact duplicate, ${possibleConflicts.length} possible conflict [${manifest.likely_raka_variant_count} likely raka/spelling variant], ${manualReview.length} manual review).`);
  if (manifest.garo_keyed_near_duplicates.length) {
    console.log(`  ${manifest.garo_keyed_near_duplicates.length} within-batch garo-keyed near-duplicate group(s) found — same headword OCR'd more than one way on this page. See manifest.`);
  }
  console.log(`Clean entry array: ${cleanPath}`);
  console.log(`Manifest: ${manifestPath}`);
  if (examples.length) console.log(`Examples pulled out: ${examplesPath} (${examples.length})`);
  console.log('\nNext step (unchanged): node scripts/import-dictionary.js ' + cleanPath + ' --apply --source-page "' + sourcePage + '"' + (source ? ` --source "${source}"` : ''));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
