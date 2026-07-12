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
 * Known, already-logged findings are allowlisted so the build doesn't
 * fail on issues already pending Claude A's review — anything NEW fails
 * immediately.
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
  // Resolved and removed from this list 2026-07-10 (fixed in the data
  // instead): search, coming, slept, sleeping, laughing, bought.
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

console.log('Repository Intelligence validation (BACKLOG-006) starting...');
const rakaCandidates = checkRakaLocality();
const crossTableViolations = checkCrossTableConsistency();

console.log('\n=== Summary ===');
console.log(`Raka locality candidates (report-only): ${rakaCandidates}`);
console.log(`New cross-table violations: ${crossTableViolations}`);

if (hasNewViolation) {
  console.log('\nFAILED — new cross-table inconsistency detected. Fix the data or, if');
  console.log('this is a genuine intentional divergence, get Claude A to confirm and');
  console.log('log it in docs/PENDING_REGRESSION_CASES.md, then add the key to');
  console.log('KNOWN_CROSS_TABLE_EXCEPTIONS in repository-intelligence.js with that citation.');
  process.exit(1);
} else {
  console.log('\nPASSED — no new cross-table violations. Raka candidates above are');
  console.log('report-only; see docs/REPOSITORY_INTELLIGENCE.md.');
  process.exit(0);
}

