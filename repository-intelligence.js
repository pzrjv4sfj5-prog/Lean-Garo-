/**
 * repository-intelligence.js — BACKLOG-006, first increment.
 *
 * Not "just a validation script" (see docs/REPOSITORY_INTELLIGENCE.md for
 * the design rationale). This is the first piece of a reusable,
 * self-auditing capability: as more lexical tables get externalized to
 * JSON (BACKLOG-001/002, done) or as new tables get added, this file is
 * where their cross-consistency gets checked automatically instead of by
 * manual audit (which is how the last 3 raka bugs and RC-CANDIDATE-006
 * were found — each one required a human/Claude to happen to look).
 *
 * Two checks, deliberately asymmetric in how much authority they claim:
 *
 * CHECK A — Raka locality (RULE-001), REPORT-ONLY, never fails the build.
 * Confirmed no-raka roots (Claude A's native-verified table, src/data/
 * raka_roots.json) matched as a literal substring "root·" across the
 * lexical tables. This is intentionally NOT a hard gate: a first pass
 * (2026-07-09) showed several hits are the exact "lexical split" trap
 * CLAUDE_A_FINAL_HANDOUT.md warns about — e.g. "ring·na"/"ring·a" for the
 * VERB "drink" (no-raka root, confirmed) collides as a substring with
 * "ring·" the NOUN "ring/bell"'s possessive form (which DOES carry raka,
 * per the source table's own note), and "nam·e" in "loved the picture"
 * may be a different word/idiom ("try"/"smell") than the no-raka verb
 * "nam". Deciding which is which requires word-sense knowledge this
 * script doesn't have. So: report every hit, make zero claims about
 * which are bugs, and route all of them to Claude A rather than asserting.
 *
 * CHECK B — Cross-table lexical consistency, DOES fail the build on new
 * findings. Two sub-checks with different strictness, because the tables
 * are not all meant to hold identical forms:
 *   B1 (strict, case-insensitive): pronoun_map, possessives, irregular_verbs
 *   vs corrections — these ARE meant to hold the same form as corrections
 *   for a shared key, so an exact mismatch (ignoring case, which varies
 *   for reasons unrelated to meaning) is a real finding.
 *   B2 (root-prefix heuristic): purpose_map vs corrections — purpose_map
 *   intentionally holds a purposive/infinitive-suffixed form ("cha·na" =
 *   "to eat"), which is SUPPOSED to differ from corrections' bare/
 *   imperative form ("Cha·a"). Flagging every difference would be mostly
 *   noise. Instead, flag only when the two values share no common prefix
 *   at all (case-insensitive) — a coarse but low-false-positive signal
 *   that two genuinely different lexical roots were chosen, which is
 *   exactly the RC-CANDIDATE-006 ("search") bug class.
 * CHECK C — Internal dictionary self-consistency, DOES fail the build on
 * new findings. Unlike Check B (which compares small curated tables
 * against corrections.json), Check C audits master_dictionary.json
 * against ITSELF: does any english key resolve to 2+ distinct garo
 * values within the 7000+-entry source file alone? Found by manual audit
 * 2026-07-16 (1053 such keys existed already, unaudited by anything).
 * Most are legitimate (dialectal/register variants, "the X" vs "X"
 * collection artifacts) — this is NOT asserting they're all bugs, same
 * posture as Check A. The baseline (src/data/known_dictionary_conflicts.json,
 * 1053 keys) is allowlisted so the build doesn't fail on pre-existing
 * conflicts. Anything NEW — critically, any conflict introduced by a
 * bulk dictionary import (scripts/import-dictionary.js) — fails the
 * build immediately, because a growing pile of unreviewed silent
 * conflicts is exactly how RC-CANDIDATE-012 and RC-CANDIDATE-019 were
 * born (a normal, expected cost until now; the whole point of this
 * check is that it should no longer be free to introduce another one).
 *
 * CHECK D — Pending Lexicon structural integrity (src/data/pending_lexicon.json),
 * DOES fail the build, but ONLY on structural problems — never on
 * unresolved linguistic content. An entry sitting at review_status
 * "unreviewed" or flagged with a "conflict" is expected, normal, healthy
 * pending state and never fails this check. What DOES fail: missing
 * required fields (id/english/garo/provenance), duplicate IDs, an
 * invalid review_status/promotion_status enum value, a promotion_status
 * of "promoted" whose review_status isn't "approved" (promotion must
 * always follow approval, never bypass it) or whose (english,garo) pair
 * isn't actually present in master_dictionary.json (a promoted record
 * that didn't really land in production), and — checked once, not
 * per-entry — prepare-data.js referencing pending_lexicon.json at all
 * (production must never read pending data; promotion copies fields
 * into master_dictionary.json, it never makes the pending file itself a
 * build input).
 *
 * Exit code 0 = clean, or only Check A hits (report-only) plus allowlisted
 * Check B issues. Exit code 1 = new Check B violation. Wired into
 * `npm run build` after test-dictionary.js.
 */
import fs from 'fs';

let hasNewViolation = false;

function loadJSON(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

// --- CHECK A: Raka locality — report-only, see file header ---
function checkRakaLocality() {
  console.log('\n=== CHECK A: Raka locality candidates (report-only, does not fail build) ===');
  const rakaData = loadJSON('src/data/raka_roots.json');
  const noRakaRoots = rakaData.roots.filter(r => !r.has_raka).map(r => r.root);

  const lexicalFiles = [
    'src/data/corrections.json',
    'src/data/purpose_map.json',
    'src/data/pronoun_map.json',
    'src/data/possessives.json',
    'src/data/irregular_verbs.json',
  ];

  let hits = 0;
  for (const file of lexicalFiles) {
    if (!fs.existsSync(file)) continue;
    const data = loadJSON(file);
    for (const [key, value] of Object.entries(data)) {
      if (typeof value !== 'string') continue;
      for (const root of noRakaRoots) {
        const pattern = new RegExp(root + '·', 'i');
        if (pattern.test(value)) {
          console.log(`  candidate: ${file} — "${key}": "${value}" — root "${root}" (confirmed no-raka) + raka mark`);
          hits++;
        }
      }
    }
  }
  console.log(`  ${hits} candidate(s) — NOT asserted as bugs, see docs/REPOSITORY_INTELLIGENCE.md for why (lexical-split risk).`);
  return hits;
}

// --- CHECK B: Cross-table lexical consistency ---
// Add an entry here ONLY after logging the finding in
// docs/PENDING_REGRESSION_CASES.md. Never add just to make the build pass.
const KNOWN_CROSS_TABLE_EXCEPTIONS = new Set([
  // RC-CANDIDATE-007 — Claude A reviewed 2026-07-10: 'sing' candidate fix
  // (ring·na) is medium-confidence only, not confirmed — flagged for
  // Thangseng, not swapped silently. 'dance' fully open, no evidence yet.
  'dance', 'sing',
  // RC-CANDIDATE-008 — Claude A reviewed 2026-07-10, per-key verdicts:
  'eaten',      // NOT A BUG — cha·jok (perfect) vs cha·manaha (completive)
                // are both independently confirmed distinct aspectual
                // forms (RULE-026). Permanently allowlisted, not pending.
  'heard',      // Escalated — rangsan chanchiaha vs knachik·aha are
                // different words, no repo evidence favors either.
  'standing', 'sitting', // Escalated — no primary-source confirmation of
                // asong/chadat/chad roots' raka status; possible 3-way
                // vocabulary question (a third form 'Chakata' also exists
                // for "stand" elsewhere in corrections.json).
  'bought',     // Escalated 2026-07-10 — Claude A's original "breaha, no
                // raka" verdict was RETRACTED: VALIDATION_CORPUS.md
                // already has "have you bought"->"Na·a Bre·ajok ma?" (WITH
                // raka), marked Verified/High from a prior deliberate
                // raka-audit pass. Two credible sources conflict, not one
                // clear answer vs. one outlier — needs Thangseng, not a
                // repository-evidence call. NOT fixed in the data.
  // Resolved and removed from this list 2026-07-10 (fixed in the data
  // instead): search, coming, slept, sleeping, laughing.
]);

function normalize(v) {
  return v.toLowerCase().trim();
}

function sharedPrefixLength(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

function checkCrossTableConsistency() {
  console.log('\n=== CHECK B: Cross-table lexical consistency ===');
  const corrections = loadJSON('src/data/corrections.json');
  const purposeMap = loadJSON('src/data/purpose_map.json');
  const strictTables = {
    pronoun_map: loadJSON('src/data/pronoun_map.json'),
    possessives: loadJSON('src/data/possessives.json'),
    irregular_verbs: loadJSON('src/data/irregular_verbs.json'),
  };

  let newViolations = 0;
  let knownIssues = 0;

  // B1: strict (case-insensitive) comparison against corrections
  for (const [tableName, data] of Object.entries(strictTables)) {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value !== 'string') continue;
      const k = key.toLowerCase().trim();
      if (!(k in corrections)) continue;
      const correctionsValue = corrections[k];
      if (typeof correctionsValue !== 'string') continue;
      if (normalize(value) === normalize(correctionsValue)) continue; // match, incl. case-insensitive

      if (KNOWN_CROSS_TABLE_EXCEPTIONS.has(k)) {
        knownIssues++;
        console.log(`  KNOWN: "${k}" — corrections="${correctionsValue}", ${tableName}="${value}"`);
        continue;
      }
      newViolations++;
      console.log(`  NEW (B1 strict): "${k}" — corrections="${correctionsValue}", ${tableName}="${value}"`);
    }
  }

  // B2: root-prefix heuristic for purpose_map (expected to differ by suffix)
  for (const [key, value] of Object.entries(purposeMap)) {
    if (typeof value !== 'string') continue;
    const k = key.toLowerCase().trim();
    if (!(k in corrections)) continue;
    const correctionsValue = corrections[k];
    if (typeof correctionsValue !== 'string') continue;
    const shared = sharedPrefixLength(normalize(value), normalize(correctionsValue));
    if (shared > 0) continue; // shares a root prefix, expected suffix variation

    if (KNOWN_CROSS_TABLE_EXCEPTIONS.has(k)) {
      knownIssues++;
      console.log(`  KNOWN: "${k}" — corrections="${correctionsValue}", purpose_map="${value}" (no shared prefix)`);
      continue;
    }
    newViolations++;
    console.log(`  NEW (B2 root-mismatch): "${k}" — corrections="${correctionsValue}", purpose_map="${value}" (no shared prefix — likely different lexical root chosen)`);
  }

  console.log(`  ${knownIssues} known/allowlisted issue(s), ${newViolations} new violation(s).`);
  if (newViolations > 0) hasNewViolation = true;
  return newViolations;
}

// --- CHECK C: master_dictionary.json internal self-consistency ---
function checkDictionarySelfConsistency() {
  console.log('\n=== CHECK C: Dictionary self-consistency (master_dictionary.json) ===');
  const dict = loadJSON('master_dictionary.json');
  const baseline = new Set(loadJSON('src/data/known_dictionary_conflicts.json'));

  const seen = new Map(); // normalized english -> Set of garo values
  for (const entry of dict) {
    const k = (entry.english || '').toLowerCase().trim();
    const v = (entry.garo || '').trim();
    if (!k || !v) continue;
    if (!seen.has(k)) seen.set(k, new Set());
    seen.get(k).add(v);
  }

  let known = 0;
  let fresh = 0;
  const freshFindings = [];
  for (const [k, values] of seen) {
    if (values.size <= 1) continue;
    if (baseline.has(k)) {
      known++;
      continue;
    }
    fresh++;
    freshFindings.push(`  NEW: "${k}" — ${[...values].map(v => `"${v}"`).join(', ')}`);
  }

  freshFindings.slice(0, 20).forEach(l => console.log(l));
  if (freshFindings.length > 20) console.log(`  ... and ${freshFindings.length - 20} more`);
  console.log(`  ${known} known/allowlisted conflicting key(s), ${fresh} NEW conflicting key(s).`);
  if (fresh > 0) hasNewViolation = true;
  return fresh;
}


// --- CHECK D: Pending Lexicon structural integrity ---
const REVIEW_STATUSES = new Set(['unreviewed', 'approved', 'rejected', 'needs-discussion']);
const PROMOTION_STATUSES = new Set(['pending', 'promoted', 'rejected', 'duplicate-skip']);

function checkPendingLexiconIntegrity() {
  console.log('\n=== CHECK D: Pending Lexicon structural integrity ===');
  if (!fs.existsSync('src/data/pending_lexicon.json')) {
    console.log('  src/data/pending_lexicon.json not found — treated as empty, not a failure.');
    return 0;
  }
  const pending = loadJSON('src/data/pending_lexicon.json');
  const master = loadJSON('master_dictionary.json');
  const masterPairs = new Set(master.map(e => `${(e.english||'').toLowerCase().trim()}\u0000${(e.garo||'').trim()}`));

  const problems = [];
  const seenIds = new Set();

  if (!Array.isArray(pending)) {
    console.log('  FAIL: pending_lexicon.json is not an array.');
    hasNewViolation = true;
    return 1;
  }

  pending.forEach((e, idx) => {
    const where = e && e.id ? e.id : `entry index ${idx}`;
    if (!e || typeof e !== 'object') { problems.push(`${where}: not an object`); return; }
    if (typeof e.id !== 'string' || !/^PL-\d+$/.test(e.id)) problems.push(`${where}: missing/invalid id`);
    else if (seenIds.has(e.id)) problems.push(`${where}: duplicate id`);
    else seenIds.add(e.id);

    if (typeof e.english !== 'string' || e.english.trim() === '') problems.push(`${where}: missing english`);
    if (typeof e.garo !== 'string' || e.garo.trim() === '') problems.push(`${where}: missing garo`);
    if (!e.provenance || typeof e.provenance !== 'object') problems.push(`${where}: missing provenance object`);
    else {
      if (!e.provenance.import_batch) problems.push(`${where}: provenance missing import_batch`);
      if (!e.provenance.import_date) problems.push(`${where}: provenance missing import_date`);
      // source/source_page/ocr_version intentionally NOT required — "if
      // applicable" per spec; not every source has a page number.
    }
    if (!REVIEW_STATUSES.has(e.review_status)) problems.push(`${where}: invalid review_status "${e.review_status}"`);
    if (!PROMOTION_STATUSES.has(e.promotion_status)) problems.push(`${where}: invalid promotion_status "${e.promotion_status}"`);

    if (e.promotion_status === 'promoted') {
      if (e.review_status !== 'approved') {
        problems.push(`${where}: promotion_status is "promoted" but review_status is "${e.review_status}", not "approved" — promotion consistency violation`);
      }
      const pairKey = `${(e.english||'').toLowerCase().trim()}\u0000${(e.garo||'').trim()}`;
      if (!masterPairs.has(pairKey)) {
        problems.push(`${where}: promotion_status is "promoted" but ("${e.english}","${e.garo}") not found in master_dictionary.json`);
      }
    }
  });

  // Production must never read the pending store.
  const prepareDataSrc = fs.existsSync('prepare-data.js') ? fs.readFileSync('prepare-data.js', 'utf8') : '';
  if (prepareDataSrc.includes('pending_lexicon')) {
    problems.push('prepare-data.js references pending_lexicon.json — production build must never read pending data');
  }

  problems.slice(0, 30).forEach(p => console.log(`  FAIL: ${p}`));
  if (problems.length > 30) console.log(`  ... and ${problems.length - 30} more`);
  console.log(`  ${pending.length} pending entries checked, ${problems.length} structural problem(s).`);
  if (problems.length > 0) hasNewViolation = true;
  return problems.length;
}


console.log('Repository Intelligence validation (BACKLOG-006) starting...');
const rakaCandidates = checkRakaLocality();
const crossTableViolations = checkCrossTableConsistency();
const dictSelfConflicts = checkDictionarySelfConsistency();
const pendingLexiconProblems = checkPendingLexiconIntegrity();

console.log('\n=== Summary ===');
console.log(`Raka locality candidates (report-only): ${rakaCandidates}`);
console.log(`New cross-table violations: ${crossTableViolations}`);
console.log(`New dictionary self-consistency conflicts: ${dictSelfConflicts}`);
console.log(`Pending Lexicon structural problems: ${pendingLexiconProblems}`);

if (hasNewViolation) {
  console.log('\nFAILED — new inconsistency detected. Fix the data or, if this is a');
  console.log('genuine intentional divergence, get Claude A to confirm and log it, then');
  console.log('add the key to KNOWN_CROSS_TABLE_EXCEPTIONS (Check B) or');
  console.log('src/data/known_dictionary_conflicts.json (Check C) with that citation.');
  process.exit(1);
} else {
  console.log('\nPASSED — no new violations. Raka candidates above are report-only;');
  console.log('see docs/REPOSITORY_INTELLIGENCE.md.');
  process.exit(0);
}

