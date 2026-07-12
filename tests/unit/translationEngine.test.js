import test from 'node:test';
import assert from 'node:assert/strict';

import translationEngine from '../../src/translationEngine.js';
import { translate } from '../../src/translationEngine.js';

test('translate uses phrase-level dictionary matches for common expressions', async () => {
  const result = await translationEngine.translate('good morning');
  assert.equal(result, 'Pringnam.');
});

test('phrase suggestions return relevant matches for partial input', () => {
  const suggestions = translationEngine.getPhraseSuggestions('good');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.some((entry) => entry.english.toLowerCase().includes('good')));
});

// --- Regression suite (baseline 13 + all fixes through e80a6a6) ---
// Persistent source of truth for "does the engine still work" across
// sessions — run before AND after any engine/data change instead of
// hand-writing throwaway /tmp scripts.
const REGRESSION_CASES = [
  // Baseline 13 (f6edcf8 resume test)
  { in: 'eat', expectMethod: ['correction'] },
  { in: 'good', expectMethod: ['correction'] },
  { in: '2 dogs', expectMethod: ['classifier'] },
  { in: 'did you eat food', expectMethod: ['correction'] },
  { in: 'i saw him', expectMethod: ['correction'] },
  { in: 'lets dance', expectMethod: ['correction'] },
  { in: 'LETS GO', expectMethod: ['correction'] },
  { in: "don't eat", expectMethod: ['correction'] },
  { in: 'cook', expectMethod: ['correction'] },
  { in: '1 tree', expectMethod: ['classifier'] },
  { in: '2 bamboo', expectMethod: ['classifier'] },
  { in: '21 dogs', expectMethod: ['classifier'] },
  // 'i did not eat' intentionally NOT expected to match the old wrong
  // jaha-based answer — as of 108918c, no confidently-wrong output is
  // preferred over a visibly-imperfect grammar-assembly fallback, since no
  // confirmed true-past-negation suffix exists (Rule 25 outstanding item).
  { in: 'i did not eat', expectGaro: 'Anga Cha·ja', expectMethod: ['grammar-assembly'] },

  // jaha/manaha semantic correction (108918c)
  { in: 'i stopped eating', expectGaro: 'Anga cha·jaha', expectMethod: ['correction'] },
  { in: 'he stopped eating', expectGaro: 'Ua cha·jaha', expectMethod: ['correction'] },
  { in: 'she stopped eating', expectGaro: 'Ua cha·jaha', expectMethod: ['correction'] },
  { in: 'i stopped drinking', expectGaro: 'Anga ringjaha', expectMethod: ['correction'] },
  { in: 'i stopped working', expectGaro: 'Anga dakjaha', expectMethod: ['correction'] },
  { in: 'stopped doing', expectGaro: 'dakjaha', expectMethod: ['correction'] },
  { in: 'ate', expectGaro: 'Cha·aha', expectMethod: ['correction'] },

  // jaha/manaha assembly-path + gija->ja negation (a38749b)
  { in: 'i finished eating', expectMethod: ['grammar-assembly'] },
  { in: 'she completed her work', expectMethod: ['grammar-assembly'] },
  { in: "she doesn't eat", expectGaro: 'Ua Cha·ja', expectMethod: ['grammar-assembly'] },
  { in: "he doesn't work", expectGaro: 'Ua Dakja', expectMethod: ['grammar-assembly'] },

  // chim/pastcont/gija-construction fixes (e80a6a6)
  { in: 'i used to eat', expectGaro: 'Anga Cha·achim', expectMethod: ['grammar-assembly'] },
  { in: 'i was eating', expectGaro: 'Anga Cha·enga chim', expectMethod: ['grammar-assembly'] },
  { in: 'i was sitting', expectGaro: 'Anga asongenga chim', expectMethod: ['grammar-assembly'] },
  { in: 'she stayed without doing her work', expectGaro: 'Ua an·tangni kamko dakgija dongaha', expectMethod: ['correction'] },

  // --- Bug sweep fixes (2026-07-05): future-negative jawa, dog/a·chak dup ---
  { in: 'i will not eat', expectGaro: 'Anga cha·jawa', expectMethod: ['correction'] },
  { in: 'i will not drink', expectGaro: 'Anga ringjawa', expectMethod: ['correction'] },
  { in: 'i will not go', expectGaro: 'Anga re·jawa', expectMethod: ['correction'] },
  { in: 'dogs', expectGaro: 'Achak' },
  { in: '0 dogs', expectGaro: 'Achak' },

  // --- Rules 27/28/29 (2026-07-05): no true simple past, aha/manaha overlap, -bo hortative ---
  { in: 'he did not go', expectGaro: 'Ua Re·angja', expectMethod: ['grammar-assembly'] },
  { in: 'i did not go', expectGaro: 'Anga Re·angja', expectMethod: ['grammar-assembly'] },
  { in: 'go', expectGaro: 'Re·anga' },
  { in: 'hai cha·bo', expectGaro: 'Hai cha·bo', expectMethod: ['correction'] },

  // --- Grammar-modeling audit (2026-07-05): affirmative past tense via
  // real Rule 2 (-aha) suffix logic instead of per-word memorized corrections ---
  { in: 'he studied', expectGaro: 'Ua po·ri·aha', expectMethod: ['grammar-assembly'] },
  { in: 'he cooked', expectGaro: 'Ua Song·aha', expectMethod: ['grammar-assembly'] },
  { in: 'he walked', expectGaro: 'Ua re·aha', expectMethod: ['grammar-assembly'] },
  { in: 'he answered', expectGaro: 'Ua Aganchakaha', expectMethod: ['grammar-assembly'] },

  // --- Rule 32 (2026-07-05): search=Sandia, replaces am·e·nik·na contamination ---
  { in: 'search', expectGaro: 'Sandia', expectMethod: ['correction'] },
  { in: 'search for him', expectGaro: 'Biko sandibo', expectMethod: ['correction'] },
  { in: 'he searched', expectGaro: 'Ua Sandiaha', expectMethod: ['grammar-assembly'] },
  { in: 'he was searching', expectGaro: 'Ua Sandienga chim', expectMethod: ['grammar-assembly'] },

  // --- Rule 33 (2026-07-05): down = Ka·ma ---
  { in: 'down', expectGaro: 'Ka·ma', expectMethod: ['correction'] },
  { in: "what's down there", expectGaro: 'Aiwa ka·machi maia donga?', expectMethod: ['correction'] },

  // --- under = Kokkimao, fixing under/Ka·ma·o lexical confusion (2026-07-07) ---
  { in: 'under', expectGaro: 'Kokkimao', expectMethod: ['correction'] },
  { in: 'the dog is under the table', expectGaro: 'Achak tebil kokkimao ong·a', expectMethod: ['correction'] },

  // --- RC-CANDIDATE-002/003/006 fixes (2026-07-10, Claude A approved directives) ---
  // RC-002: stative-locative "in/on/at" now maps to ·o instead of the
  // default object marker ·ko in the SOV grammar-assembly fallback.
  { in: 'I am lying in bed', expectGaro: 'Anga palang·o', expectMethod: ['grammar-assembly'] },
  { in: 'I put the book on the table', expectGaro: 'Anga te·bil·o ron·a', expectMethod: ['grammar-assembly'] },
  // RC-003: "down" excluded from the verb-search loop so it no longer
  // collides with "lying down" (was producing invalid "Anga Ka·ma" as if
  // Ka·ma were a conjugated verb form). Not a correct full translation of
  // "lying" yet (that needs native validation, tracked NV-007) - this
  // only guards against the confirmed-invalid output, per Claude A's
  // explicit "graceful gap over invalid Garo" directive.
  { in: 'I am lying down', expectGaro: 'Anga ka·ma·ko', expectMethod: ['grammar-assembly'] },
  // RC-006: purpose_map.json 'search' fixed from the retired
  // am·e·nik·na contamination to Sandi·na (regular -na on the confirmed
  // Sandia/RULE-032 stem).
  { in: 'i want to search', expectGaro: 'Anga Sandi·na sikenga', expectMethod: ['grammar-assembly'] },
];

for (const c of REGRESSION_CASES) {
  test(`regression: "${c.in}"`, async () => {
    const r = await translate(c.in);
    if (c.expectMethod) assert.ok(c.expectMethod.includes(r.method), `method: got ${r.method}, expected one of ${c.expectMethod.join(', ')}`);
    if (c.expectGaro) assert.equal(r.garo, c.expectGaro);
  });
}

// --- BACKLOG-002 (2026-07-08): IRREGULAR_VERBS extracted from a hardcoded
// JS object to src/data/irregular_verbs.json. This test guards the data
// itself (count + a spot-check of known values) independent of engine
// wiring, which the REGRESSION_CASES above already exercise end-to-end.
// Protects against accidental corruption of the JSON file specifically. ---
test('irregular_verbs.json data integrity (BACKLOG-002)', async () => {
  const { default: irregularVerbs } = await import('../../src/data/irregular_verbs.json', { with: { type: 'json' } });
  assert.equal(Object.keys(irregularVerbs).length, 49, 'entry count should match the extraction (49, verified byte-for-byte against the pre-extraction inline object)');
  assert.equal(irregularVerbs['went'], 're·anga');
  assert.equal(irregularVerbs['ate'], 'cha·aha');
  assert.equal(irregularVerbs['eaten'], 'cha·manaha');
  assert.equal(irregularVerbs['want'], 'sikenga');
  assert.equal(irregularVerbs['sitting'], 'asong·enga');
  for (const [k, v] of Object.entries(irregularVerbs)) {
    assert.equal(typeof v, 'string', `value for "${k}" should be a string`);
    assert.ok(v.length > 0, `value for "${k}" should not be empty`);
  }
});

// --- BACKLOG-001 remaining tables (2026-07-09): PURPOSE_MAP, PRONOUN_MAP,
// POSSESSIVES extracted from translationEngine.js to src/data/*.json,
// same pattern as irregular_verbs.json above. ---
test('purpose_map.json data integrity (BACKLOG-001)', async () => {
  const { default: purposeMap } = await import('../../src/data/purpose_map.json', { with: { type: 'json' } });
  assert.equal(Object.keys(purposeMap).length, 37);
  assert.equal(purposeMap['eat'], 'cha·na');
  assert.equal(purposeMap['go'], 're·ang·na');
  assert.equal(purposeMap['begin'], "a'ba·cheng·na");
  // Deliberately NOT asserting this is "correct" - it's a known-stale
  // pre-Rule-32 value, preserved as-is per behavior-preservation. See the
  // extraction-site comment in translationEngine.js and
  // docs/PENDING_REGRESSION_CASES.md RC-CANDIDATE-006.
  // RC-CANDIDATE-006 fixed 2026-07-10 (Claude A confirmed 'search'):
  // Sandi·na is the regular -na infinitive on the confirmed Sandia stem
  // (RULE-032), replacing the pre-Rule-32 contamination am·e·nik·na that
  // had leaked into this separate table.
  assert.equal(purposeMap['search'], 'Sandi·na');
  for (const [k, v] of Object.entries(purposeMap)) {
    assert.equal(typeof v, 'string', `value for "${k}" should be a string`);
    assert.ok(v.length > 0, `value for "${k}" should not be empty`);
  }
});

test('pronoun_map.json data integrity (BACKLOG-001)', async () => {
  const { default: pronounMap } = await import('../../src/data/pronoun_map.json', { with: { type: 'json' } });
  assert.equal(Object.keys(pronounMap).length, 10);
  assert.equal(pronounMap['i'], 'Anga');
  assert.equal(pronounMap['you'], 'Na·a');
  assert.equal(pronounMap['they'], 'Uamang');
  for (const [k, v] of Object.entries(pronounMap)) {
    assert.equal(typeof v, 'string', `value for "${k}" should be a string`);
    assert.ok(v.length > 0, `value for "${k}" should not be empty`);
  }
});

test('possessives.json data integrity (BACKLOG-001)', async () => {
  const { default: possessives } = await import('../../src/data/possessives.json', { with: { type: 'json' } });
  assert.equal(Object.keys(possessives).length, 7);
  assert.equal(possessives['my'], 'Angni');
  assert.equal(possessives['their'], 'Uamangni');
  for (const [k, v] of Object.entries(possessives)) {
    assert.equal(typeof v, 'string', `value for "${k}" should be a string`);
    assert.ok(v.length > 0, `value for "${k}" should not be empty`);
  }
});

// --- BACKLOG-006 (2026-07-09): repository-intelligence.js smoke test.
// This is deliberately an integration-style check (run the real script
// against the real data, assert it exits 0) rather than unit-testing
// internal functions, since the script isn't structured as an importable
// module. It guards against two failure modes: (1) the script itself
// breaking (syntax error, missing file, etc.), and (2) a NEW, un-
// allowlisted cross-table inconsistency being introduced without anyone
// noticing - if this test starts failing, check the console output for
// which key is newly inconsistent, then follow the process documented in
// docs/REPOSITORY_INTELLIGENCE.md ("How to extend this safely") rather
// than just adding it to the allowlist to make the test pass again. ---
test('repository-intelligence.js exits 0 against current lexical data (BACKLOG-006)', async () => {
  const { execFileSync } = await import('node:child_process');
  assert.doesNotThrow(() => {
    execFileSync('node', ['repository-intelligence.js'], { cwd: process.cwd(), stdio: 'pipe' });
  }, 'repository-intelligence.js should exit 0 - a non-zero exit means either a script error or a NEW un-allowlisted cross-table finding (see docs/REPOSITORY_INTELLIGENCE.md)');
});
