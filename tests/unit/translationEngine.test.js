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
  { in: 'i want to search', expectGaro: 'Anga Sandi·na ska', expectMethod: ['grammar-assembly'] },
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
  assert.equal(Object.keys(irregularVerbs).length, 50, 'entry count: 49 from the original extraction + "has" added 2026-07-13 (suppletive form of "have", same confirmed value "donga")');
  assert.equal(irregularVerbs['went'], 're·anga');
  assert.equal(irregularVerbs['ate'], 'cha·aha');
  assert.equal(irregularVerbs['eaten'], 'cha·manaha');
  assert.equal(irregularVerbs['want'], 'ska', 'corrected 2026-07-18 from sikenga - see docs/PENDING_LINGUISTIC_PROPOSAL_20260718_sikenga_ska_sika.md');
  assert.equal(irregularVerbs['sitting'], 'asong·enga');
  // RC-CANDIDATE-008 (partial, d0e6c06): the 4 specific values actually
  // fixed (truncation typos / missing raka marks) were never individually
  // spot-checked before - only the aggregate count/shape was covered.
  assert.equal(irregularVerbs['coming'], 're·baenga');
  assert.equal(irregularVerbs['slept'], 'tusiaha');
  assert.equal(irregularVerbs['sleeping'], 'tusienga');
  assert.equal(irregularVerbs['laughing'], 'ka·dingenga');
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

// --- classifierHints gap fix (2026-07-11), flagged by Claude A: this
// inline array only covered mang/sak/gong/king, missing jol/ge which
// already exist confirmed in garo_classifier.js's CLASSIFIER_MAP ---
test('classifierHints includes jol (long objects) and ge (pen/stick), matching garo_classifier.js CLASSIFIER_MAP', async () => {
  const { analyzeGrammar } = await import('../../src/translationEngine.js');
  const bamboo = analyzeGrammar('the bamboo pole');
  assert.ok(bamboo.classifierHints.some(h => h.classifier === 'jol'), 'bamboo/pole should hint jol');
  const pencil = analyzeGrammar('give me a pencil');
  assert.ok(pencil.classifierHints.some(h => h.classifier === 'ge'), 'pencil should hint ge');
});

// --- RC-CANDIDATE-011(b) fix (2026-07-12, same commit as RC-010): "in"
// vs "at" locative marking generalized to ALL location nouns, not just
// "bed" (already covered by the pre-existing RC-002 test above). Root
// cause was the verb-search loop's hardcoded exclusion list only
// covering "down"/"bed" pre-fix (RC-003), letting every other location
// noun get wrongly consumed as the verb before reaching the object
// loop. This test locks in the generalization across other locations,
// since only "bed" was previously guarded against regression. Part (a)
// of RC-011 (the "lying in X" verb-slot loss, NV-007) remains open and
// is deliberately NOT asserted as correct here - only that the ·o
// locative marker itself is present and no verb-collision occurs. ---
test('RC-CANDIDATE-011(b): "at"/"in" locative ·o marking generalizes beyond "bed"', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const school = await translate('i am waiting at the school');
  assert.ok(school.garo.includes('·o'), `"at the school" should produce ·o locative marker, got: ${school.garo}`);
  const house = await translate('i am waiting at the house');
  assert.ok(house.garo.includes('·o'), `"at the house" should produce ·o locative marker, got: ${house.garo}`);
});

// --- RC-CANDIDATE-008/VerbsGrammar.jsx fix (48aee52, 2026-07-11): source
// -text-level lock on the 6 corrected strings in the user-facing grammar
// page (no JSX/component test infra exists in this repo - node:test has
// no jsdom/testing-library wiring - so this checks the raw file text
// directly rather than rendering the component). Also locks in that the
// 6 removed dead phrase_maps.js hortative duplicates stay removed. ---
test('VerbsGrammar.jsx: 6 confirmed corrections (48aee52) remain applied', async () => {
  const fs = await import('node:fs');
  const src = fs.readFileSync(new URL('../../src/pages/VerbsGrammar.jsx', import.meta.url), 'utf8');
  assert.ok(src.includes('agana'), 'agan·a should be corrected to raka-free agana');
  assert.ok(!src.includes("agan·a'"), 'old agan·a form should not reappear');
  assert.ok(src.includes('nika'), 'nik·a should be corrected to raka-free nika');
  assert.ok(src.includes('brea·na') && src.includes('brea·enga') && src.includes('brea·aha') && src.includes('brea·gen'), 'brea-X hyphens should be corrected to raka');
  assert.ok(src.includes('tusiaha'), 'tusieaha typo should be corrected to tusiaha');
  assert.ok(src.includes('re·angbo: Go!'), 'go imperative example should not be the copy-pasted sleep example');
  assert.ok(src.includes('ge·sa Chokki') && src.includes('ge·gni Kettal') && src.includes('ge·gittam Mez'), 'ge classifier examples should use classifier-then-number order');
});

test('phrase_maps.js: 6 dead hortative duplicates remain removed (shadowed by corrections.json)', async () => {
  const fs = await import('node:fs');
  const src = fs.readFileSync(new URL('../../src/data/phrase_maps.js', import.meta.url), 'utf8');
  for (const dead of ["let's eat", "let's drink", "let's sit", "let's play", "let's work"]) {
    assert.ok(!src.includes(`"${dead}"`) && !src.includes(`'${dead}'`), `dead entry "${dead}" should stay removed from phrase_maps.js`);
  }
});

// --- RC-CANDIDATE-010 fix (2026-07-12): NP subjects (article + noun +
// copula) now reach grammar-assembly instead of only pronoun subjects.
// Scoped to a coherence check (see translationEngine.js's "Parser-
// boundary review" comment) - covers Claude A's exact reported class,
// NOT multi-word/adjective-modified subjects (documented boundary,
// tested explicitly below to lock in the safe-fallback behavior). ---
test('RC-CANDIDATE-010: NP subject (article+noun+copula) reaches grammar-assembly', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r1 = await translate('the book is on the table');
  assert.equal(r1.method, 'grammar-assembly');
  assert.equal(r1.garo, 'boi te·bil·o');
  const r2 = await translate('the market is far');
  assert.equal(r2.method, 'grammar-assembly');
  assert.equal(r2.garo, 'bajal chel·a');
});

test('RC-CANDIDATE-010 boundary: adjective-modified NP subject safely falls back, does not mislabel', async () => {
  const { analyzeGrammar, translate } = await import('../../src/translationEngine.js');
  // "big" must NOT be picked as the subject in place of "dog" - this is
  // the parser-boundary coherence check working as designed (rejects
  // rather than guesses when no POS data can disambiguate).
  const g = analyzeGrammar('a big dog is running');
  assert.notEqual(g.subject?.english, 'big');
  const r = await translate('a big dog is running');
  assert.equal(r.method, 'sov-assembly', 'should safely fall back, not confidently mislabel via grammar-assembly');
});

// --- RC-CANDIDATE-012 fix (2026-07-12): non-first-person "sad"/"bright"
// were resolving to a duplicate master_dictionary.json entry with a
// literal apostrophe typo instead of raka ("Duk ong'a" instead of
// "Duk ong·a"). NOT a rendering/Unicode bug - root cause was source-data
// duplication (two "sad" entries, prepare-data.js's pickPrimary()
// deliberately takes the last value, which was the wrong one). Fixed at
// the source (master_dictionary.json), not by changing pickPrimary's
// established last-wins behavior (that policy has its own considered
// history - see prepare-data.js's comment on the "i·a" corruption
// incident). A broader search found 95 entries using "a'"/"an'"/"am'" as
// a prefix pattern (earth/land/blood/search-related words) - this looks
// like a genuine morpheme, not the same typo class, and was
// EXPLICITLY NOT TOUCHED. Regression test locks in that boundary. ---
test('RC-CANDIDATE-012: non-first-person predicate adjectives use raka, not apostrophe', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  for (const subj of ['you are sad', 'he is sad', 'she is sad', 'we are sad', 'they are sad']) {
    const r = await translate(subj);
    assert.ok(r.garo.includes('ong·a'), `"${subj}" should use raka (ong·a), got: ${r.garo}`);
    assert.ok(!r.garo.includes("'"), `"${subj}" should not contain an apostrophe, got: ${r.garo}`);
  }
  const bright = await translate('the sky is bright');
  assert.ok(bright.garo.includes('Ching·a'), `bright should use raka, got: ${bright.garo}`);
});

test('RC-CANDIDATE-012 boundary: legitimate a\'/an\'/am\' prefix words are untouched', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('earthquake');
  assert.equal(r.garo, "a'a banggri·a", 'genuine prefix morpheme must not be altered by the raka-typo fix');
});

// --- Number-word-as-verb + 'has' inflection fix (2026-07-13), same "no
// POS data" collision class as RC-CANDIDATE-010/003. "he has two dogs"
// was wrongly picking "two" (a number, resolves via lookupGaro to "Gni")
// as the verb, then "dogs" as a second wrong candidate once "two" was
// excluded, because "has" itself never resolved (only base "have" was in
// the dictionary; naive suffix-stripping turns "has" into "ha", not
// "have" - a suppletive irregular form, same class as BACKLOG-002's
// table). Fixed with two small, reusable pieces: (1) guard the
// verb-search loop against NUMBER_WORDS (existing table, not a new
// heuristic), (2) add "has"->"donga" to irregular_verbs.json (same
// confirmed value already used for "have", not a new linguistic claim). ---
test('number word is never picked as the verb; "has" resolves as an irregular form of "have"', async () => {
  const { translate, analyzeGrammar } = await import('../../src/translationEngine.js');
  const g = analyzeGrammar('he has two dogs');
  assert.equal(g.verb?.english, 'has');
  assert.equal(g.verb?.garo, 'donga');
  const r = await translate('he has two dogs');
  assert.equal(r.garo, 'Ua do·o mang·gni·ko donga');
});

// --- Second half of the same 2026-07-13 fix's benchmark claim ("exactly
// 2 of 237 sentences changed... both now show the correct verb") - only
// "he has two dogs" was locked in above; "she has three children" was
// never given its own regression test. Deliberately only asserting verb
// correctness, NOT full translate() output: the object-phrase
// number+noun routing gap (no "three" in the output, see
// RC-CANDIDATE-014's "New follow-up finding") is a separate, still-open
// root cause - asserting a full garo string here would either falsely
// lock in that unrelated bug or require fixing it, both out of scope. ---
test('RC-CANDIDATE-014 (partial): "has" resolves correctly for "she has three children" too (quantifier ≠ verb)', async () => {
  const { analyzeGrammar } = await import('../../src/translationEngine.js');
  const g = analyzeGrammar('she has three children');
  assert.equal(g.verb?.english, 'has');
  assert.equal(g.verb?.garo, 'donga');
});

// --- RC-CANDIDATE-018 fix (2026-07-18, Claude A confirmed engineering-
// only 2026-07-16; NOT RC-CANDIDATE-017, which Claude A reopened as a
// genuine unresolved linguistic question and is deliberately untouched
// here). Two root causes fixed: (a) analyzeGrammar's NP-subject
// coherence check didn't recognize "will" as a coherent continuation,
// so NP-subject future sentences never reached grammar-assembly at all;
// (b) assembleSentenceSOV (the fallback still legitimately used for
// RC-010-excluded constructions like adjective-modified subjects) had
// no future-tense handling and no auxiliary exclusion, so "will"
// resolved via its own dictionary entry ("·gen") and printed as a
// floating orphan token instead of suffixing onto the verb. ---
test('RC-CANDIDATE-018(a): NP-subject future reaches grammar-assembly, ·gen suffixes onto the verb', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('the dog will eat rice');
  assert.equal(r.method, 'grammar-assembly');
  assert.equal(r.garo, 'Achak mi·ko Cha·gen');
  // object ("mi·ko") between subject ("Achak") and verb ("Cha·gen") —
  // Project Owner directive root cause 5, SOV order preserved.
  assert.ok(r.garo.indexOf('mi·ko') > r.garo.indexOf('Achak'));
  assert.ok(r.garo.indexOf('Cha·gen') > r.garo.indexOf('mi·ko'));
});

test('RC-CANDIDATE-018(a) regression guard: pronoun-subject future unaffected by the coherence-check widening', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('she will go');
  assert.equal(r.garo, 'Ua Re·anggen');
});

test('RC-CANDIDATE-018(a) regression guard: adjective-modified subjects still correctly fall to sov-assembly (RC-010 documented exclusion, unaffected by this fix)', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('a big dog is sleeping');
  assert.equal(r.method, 'sov-assembly');
});

test('RC-CANDIDATE-018(b): sov-assembly fallback attaches ·gen to the verb instead of leaving it as a floating token', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('a big dog will eat rice');
  assert.equal(r.method, 'sov-assembly');
  assert.ok(!/\s·gen(\s|$)/.test(r.garo), `·gen must not appear as its own space-separated token, got: ${r.garo}`);
  assert.ok(r.garo.includes('Cha·gen'), `·gen must be suffixed onto the verb, got: ${r.garo}`);
});

test('RC-CANDIDATE-018: "will" is never treated as lexical content in either assembly path', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r1 = await translate('the dog will eat rice');
  const r2 = await translate('a big dog will eat rice');
  for (const r of [r1, r2]) {
    assert.ok(!/\bgen\b/i.test(r.garo.replace('·gen', '')), `no standalone "gen" token outside the ·gen suffix, got: ${r.garo}`);
  }
});

test('RC-CANDIDATE-018: negative future uses stem+jawa directly (Rule 5), not gen+ja stacked, in the sov-assembly path', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('a big dog will not eat rice');
  assert.equal(r.method, 'sov-assembly');
  assert.ok(!r.garo.includes('genja'), `must not stack gen+ja (confirmed bug shape, Rule 5), got: ${r.garo}`);
  assert.ok(r.garo.includes('Cha·jawa') || r.garo.includes('jawa'), `expected negative-future jawa suffix, got: ${r.garo}`);
});

test('RC-CANDIDATE-018 regression guard: irregular verbs are not double-inflected by the new future-tense path', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  // "sitting" is a pre-inflected IRREGULAR_VERBS form; future tense
  // wouldn't grammatically compose with it here, but the guard under
  // test is purely mechanical: the fix must not blindly suffix ·gen onto
  // an already-inflected irregular form and produce a malformed double
  // suffix. Asserting no malformed 'engagen'/'ahagen' shape appears.
  const r = await translate('a big dog is sitting');
  assert.ok(!/engagen|ahagen/.test(r.garo), `must not double-inflect an irregular verb form, got: ${r.garo}`);
});

// --- RC-CANDIDATE-025: "to X"-only headwords were unreachable as bare
// verbs in sentence assembly, and worse, fell through to unrelated fuzzy
// matches instead of failing cleanly. Surfaced by the page-112 import
// (bind/console stored only as "To bind"/"To console"), fixed generically
// in prepare-data.js (bare-infinitive aliasing, gap-filling only — never
// overwrites an existing bare-form entry). 237-sentence benchmark diffed
// byte-for-byte before/after: zero unintended changes.

test('RC-CANDIDATE-025: bare "bind" is reachable and does not fuzzy-match "wind"', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('bind');
  assert.notEqual(r.method, 'fuzzy(wind,d=1)');
  assert.equal(r.garo, 'Kadima');
});

test('RC-CANDIDATE-025: bare "console" is reachable, not [UNKNOWN] passthrough', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('console');
  assert.notEqual(r.method, 'passthrough');
  assert.equal(r.garo, 'Ka-dimea');
});

test('RC-CANDIDATE-025: verb present in sentence assembly for a "to X"-only headword ("bind")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('they bind the rope');
  assert.ok(r.garo.includes('Kadima'), `verb must not be silently dropped, got: ${r.garo}`);
});

test('RC-CANDIDATE-025: verb present in sentence assembly for a "to X"-only headword ("console")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('you console the child');
  assert.ok(r.garo.includes('Ka-dimea'), `verb must not be silently dropped, got: ${r.garo}`);
});

test('RC-CANDIDATE-025 regression guard: bare-infinitive aliasing never overwrites an existing independently-chosen bare-form entry ("hang")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('hang');
  assert.equal(r.garo, 'sring·a');
});

// --- corrections.json had two stale entries discovered the same session:
// "angry" was a truncated fragment (ka·o, not a complete word) instead of
// the VERIFIED/HIGH master_dictionary.json entry (ka·o·nang·a); "smile"
// was silently overridden to laugh's word (Ka·dinga) instead of its own
// VERIFIED entry (ka·ding·sim·ik·a). Both fixes restore the existing
// VERIFIED dictionary value already established elsewhere in the repo —
// no new linguistic content chosen here. The separate open question of
// whether the newly-imported "Ka-a chakna amja" is a legitimate
// distinct-register synonym for angry is NOT resolved by this fix and is
// left for Claude A.

test('corrections.json: "angry" resolves to the VERIFIED entry, not the truncated fragment', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he is angry');
  assert.ok(r.garo.includes('ka·o·nang·a'), `must use full VERIFIED word, got: ${r.garo}`);
});

test('corrections.json: "smile" resolves to its own word, not to laugh', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('she smiles');
  assert.ok(r.garo.includes('ka·ding·sim·ik·a'), `must use smile's own word, got: ${r.garo}`);
});

// --- RC-CANDIDATE-026: silent-e "+s" verb stemming bug. Found testing
// the page-113-115 import (tickle/hope/etc), but not specific to that
// vocabulary - any verb whose base already ends in a silent 'e' hits
// this. The es$ suffix-stripping branch in findVerbForm assumed every
// "-es" ending is a genuine sibilant -es form (watches->watch), but
// tickle->tickles, like->likes, hope->hopes, close->closes strip to a
// non-word ("tickl") and silently fail, causing analyzeGrammar's verb
// search to skip the real verb and mis-pick a later noun instead. Fixed
// with an e-restoration fallback that only fires when the existing
// es$-stripped form doesn't resolve - genuine sibilant -es verbs are
// unaffected (confirmed: "watches" still resolves via the earlier
// branch and never reaches the new fallback). 237-sentence benchmark
// diffed byte-for-byte before/after (combined with the headword fixes
// below): zero unintended changes.

test('RC-CANDIDATE-026: verb present for a silent-e base with an object present ("tickle")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('she tickles the baby');
  assert.ok(r.garo.includes('lek·gu·a'), `verb must not be silently dropped, got: ${r.garo}`);
  assert.ok(r.garo.includes('gen·da·ko'), `object must carry its ·ko marker, got: ${r.garo}`);
});

test('RC-CANDIDATE-026: verb present for a silent-e base with an object present ("like")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('she likes rice');
  assert.notEqual(r.garo, 'Ua mi', 'verb must not be silently dropped');
});

test('RC-CANDIDATE-026: verb present for a silent-e base with an object present ("close")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he closes the door');
  assert.notEqual(r.garo, 'Ua do·oga', 'verb must not be silently dropped');
});

test('RC-CANDIDATE-026 regression guard: genuine sibilant -es verbs are unaffected ("watch")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he watches the dog');
  assert.equal(r.garo, 'Ua achak·ko ni·rik·a');
});

// --- Two page-113 dictionary entries had a corrupted English headword
// (embedded worked-example text leaked in from the source dictionary's
// "-adj./-n." OCR pattern, e.g. "wrangling. Kajia ka·a, v. To quarrel"
// instead of just "wrangling"). Cleaned in master_dictionary.json and
// pending_lexicon.json (audit-trail consistency); the Garo value was
// never touched, no new linguistic content chosen. A third entry
// ("duty") had the same corruption but was deliberately left as-is: 
// cleaning it collides with a separate pre-existing "duty" entry
// (reordered Garo variant), a genuine duplicate that repository-
// intelligence.js correctly flags as needing Claude A's review before
// either can be resolved - not resolved here.

test('dictionary hygiene: "wrangling" resolves to its own clean headword', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('wrangling');
  assert.equal(r.garo, 'Kajia');
});

test('dictionary hygiene: "creek" resolves to its own clean headword', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('creek');
  assert.equal(r.garo, 'Kal');
});

// --- Interrogative formation (Project Owner directive root cause 3) is
// deliberately NOT implemented or tested here.

// --- RC-CANDIDATE-017 fix: negative-locative copula (Thangseng-
// confirmed, item 7 of the 2026-07-22 batch). "the book is not on the
// table" has no explicit English verb (implicit copula "is"), so
// analyzeGrammar's verb search found nothing and the whole clause -
// negation included - was silently dropped. Thangseng's own example:
// "Ki·tap tableo ong·ja". Only fires for the negative case.

test('RC-CANDIDATE-017: negation is not lost with a locative predicate', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('the book is not on the table');
  assert.ok(r.garo.includes('ong·ja'), `negative-existential copula must not be dropped, got: ${r.garo}`);
  assert.ok(r.garo.includes('·o'), `locative marker must stay on the noun, got: ${r.garo}`);
});

// --- Interrogative formation (Project Owner directive root cause 3) is
// deliberately NOT implemented or tested here. No confirmed
// linguistic guidance exists yet for Garo question formation - only one
// unconfirmed WhatsApp data point (see
// docs/PENDING_LINGUISTIC_PROPOSAL_20260717_future_interrogative.md,
// "na'a cha'genma?"), which is exactly the kind of chat-sourced content
// the standing integration rule prohibits implementing directly.
// Encoding a specific interrogative rule into the regression suite
// before Claude A confirms it would lock in unconfirmed linguistic
// content the same way implementing it in the engine would. Revisit
// once that proposal (or a dedicated interrogative-formation rule) is
// reviewed and committed to the grammar docs.
