import test from 'node:test';
import assert from 'node:assert/strict';

import translationEngine from '../../src/translationEngine.js';
import { translate } from '../../src/translationEngine.js';
import { analyzeGrammar } from '../../src/grammarEngine.js';

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
  // 2026-08-16 (Claude B): expected value updated from 'Ua Dakja' to
  // 'Ua ka·ja'. 'Dak·a' was the corpus's SUPERSEDED root for "work"
  // (corpus-internal audit, 2026-08-01); 'ka·a' is the VERIFIED/HIGH
  // replacement. This test previously baked in the stale root because
  // pickPrimary had no way to prefer a variant-tagged VERIFIED candidate
  // over an untagged/OCR neutral one (fixed this session, see
  // docs/CLAUDE_B_SESSION_MIGRATION_20260816.md) — the grammar-assembly
  // pipeline was always correctly suffixing whatever root it was given;
  // only the root itself was wrong.
  { in: "he doesn't work", expectGaro: 'Ua Dak·ja', expectMethod: ['grammar-assembly'] }, // updated 2026-08-17: 'work' root corrected ka·a -> Dak·a, native relay NV-080

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
  // NOTE (2026-08-29, Claude B, session migration): was `expectGaro:
  // 'Achak'` alone. That relied on assembleSentenceSOV's own silent
  // content-word drop (fixed this session, see sentenceBuilder.js) to
  // quietly discard "0" — which itself has no sane translation reachable
  // here (buildClassifierPhrase deliberately rejects count<=0 by design,
  // so classifier composition never fires for "0 X"; master_dictionary.json's
  // literal `"0"` entry is a confirmed, self-evidently wrong data artifact,
  // `confidence: "unverified"`, garo value "don't do" — NOT edited here,
  // fixing a linguistic value has no citation to defer to and is out of
  // engineering scope per this repo's governance §6; flagged for Claude A
  // in this session's migration doc instead). Once the silent-drop bug is
  // fixed, "0" honestly resolves to '[UNKNOWN]' (not silently dropped, and
  // not the garbage dictionary value either, per the digit-stripping guard
  // added to translationEngine.js step 7 this same session) and the
  // sentence correctly falls to the morphology fallback instead of
  // sov-assembly.
  { in: '0 dogs', expectGaro: '[UNKNOWN] Achak', expectMethod: ['morphology'] },

  // --- Rules 27/28/29 (2026-07-05): no true simple past, aha/manaha overlap, -bo hortative ---
  { in: 'he did not go', expectGaro: 'Ua Re·angja', expectMethod: ['grammar-assembly'] },
  { in: 'i did not go', expectGaro: 'Anga Re·angja', expectMethod: ['grammar-assembly'] },
  // 2026-08-31 (Claude B, go/re·ang- stem-decoupling fix): was 'Re·anga'
  // (stale — that's actually "went"/"gone", per NV-100 VERIFIED/HIGH).
  // phrase_maps.js['go'] mechanically resynced to compiled_dict.json's
  // already-correct 're·a' now that the conjugation-stem coupling that
  // required the wrong bare form is fixed (see conjugation_roots.json /
  // getConjugationRoot in morphologyEngine.js). No linguistic decision
  // made here — 'go'='re·a' was already the VERIFIED master_dictionary.json
  // value; this test only catches up to it.
  { in: 'go', expectGaro: 're·a' },
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

  // Coverage review, 2026-07-25 (Claude B) — genuinely confirmed
  // constructions found untested while auditing rule-catalogue
  // coverage against the stress benchmark + unit suite, ahead of
  // Phase 5. See docs/GRAMMAR_RULE_CATALOGUE.md for each rule.

  // RULE-042: -de temporal suffix, confirmed across all 3 tenses.
  { in: 'tomorrow i will go to the market', expectGaro: 'Knalde bajalchi re·anggen', expectMethod: ['correction'] },
  { in: 'today i will go to the market', expectGaro: 'Da·alde bajalchi re·anggen', expectMethod: ['correction'] },
  { in: 'yesterday i went to the market', expectGaro: 'Mijalde bajalchi re·anga', expectMethod: ['correction'] },

  // RULE-033: locative "under" (distinct from the more commonly
  // tested "on") — confirmed, was untested.
  { in: 'the dog is under the table', expectGaro: 'Achak tebil kokkimao ong·a', expectMethod: ['correction'] },

  // RULE-036: fixed discourse expression Da·mo ("wait!") never
  // inflects. Bare imperative form, confirmed correct and already
  // covered indirectly; adding directly since it's the base case for
  // the RC-CANDIDATE-015 fix immediately below.
  { in: 'wait', expectGaro: 'Damo', expectMethod: ['correction'] },

  // RC-CANDIDATE-015 fix (2026-07-25, Claude B): master_dictionary.json's
  // "wait"/"to wait" headwords were a literal unresolved "Damo / Sengbo"
  // placeholder (never a real value) — corrected to the native-confirmed
  // declarative root "senga" (Da·mo is reserved for genuine imperative
  // "Wait!", untouched). Fixes the 5 "waiting at X" sentences already
  // in the 237-sentence stress corpus (previously all emitted the
  // literal placeholder string). Guard against the placeholder recurring:
  { in: 'he waits', expectGaro: 'Ua senga', expectMethod: ['grammar-assembly'] },
  { in: 'i am waiting at the bed', expectGaro: 'Anga palang·o senga', expectMethod: ['grammar-assembly'] },
  // Known residual gap, NOT fixed here (same class as the "he works" /
  // "i work" inconsistency from the previous session): declarative
  // sentences where the verb is already bare base-form with no suffix
  // to strip ("i will wait", "they wait") still resolve via
  // corrections.json's bare "wait"->"Damo" entry before findVerbForm's
  // infinitive-preference check ever runs. Extending that check to the
  // base-form case was tried and reverted last session (broke "he
  // doesn't work" - "he doesn't wait" would hit the same negation-
  // polarity conflict). Documenting current (wrong) behavior as a
  // regression guard so a future fix attempt has a clear before-state,
  // not silently making it worse in the meantime:
  { in: 'i will wait', expectGaro: 'Anga Damogen', expectMethod: ['grammar-assembly'] },

  // RULE-030 generalization (2026-07-25, Claude B, per Claude A's
  // flag that this was now safe to generalize): findVerbForm('go')
  // returns the "Re·anga"-family root for all tenses, but native-
  // confirmed negative-future "go" uses the bare "re·a" root instead
  // ("Re·jawa"). Without an exception, any negative-future "go"
  // sentence not already hardcoded in corrections.json (e.g. subjects
  // other than "i") fell through to the generic root and produced
  // "Re·angjawa" - confirmed wrong. Fixed with a narrow, verb-specific
  // exception at the negative-future call site.
  { in: 'he will not go', expectGaro: 'Ua re·jawa', expectMethod: ['grammar-assembly'] },
  { in: 'they will not go', expectGaro: 'Uamang re·jawa', expectMethod: ['grammar-assembly'] },

  // RC-CANDIDATE-036 follow-up (2026-08-01): pickPrimary's master-
  // preference fix (RC-036) didn't resolve master_dictionary.json's OWN
  // internal duplicate-key conflicts, which still fell back to plain
  // last-write-wins by array order regardless of confidence tags. Added a
  // scoped VERIFIED-preference rule (exactly one non-variant VERIFIED/HIGH
  // candidate wins) — but NOT for "to X" infinitive keys, where a
  // VERIFIED citation form can still carry the Garo infinitive/purpose
  // -na suffix baked in, which the tense-suffixing pipeline (findVerbForm
  // -> applyTense) treats as a bare stem, producing a malformed
  // double-suffixed form. "one person" is the clean case the new rule is
  // FOR; "he answered" is the case it must NOT touch.
  // expectMethod widened 2026-08-14 (Claude B, runtime-propagation fix,
  // Claude C's audit §3.5): "exact phrase" (compiled_dict.json) now runs
  // BEFORE classifier composition, matching this file's own documented
  // priority cascade, so a confirmed phrase-level entry for "one person"
  // wins the race instead of the bare-noun classifier recomposing it from
  // scratch every time. The garo VALUE is unchanged ('mande saksa') —
  // only which pipeline step produces it changed, which is the whole
  // point of the fix (see translationEngine.js step 2's comment).
  { in: 'one person', expectGaro: 'mande saksa', expectMethod: ['classifier', 'exact-phrase'] },
  { in: 'he answered', expectGaro: 'Ua Aganchakaha', expectMethod: ['grammar-assembly'] },
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
  assert.equal(Object.keys(irregularVerbs).length, 51, 'entry count: 49 from the original extraction + "has" added 2026-07-13 (suppletive form of "have", same confirmed value "donga") + "smiled" added 2026-08-06 (Ka·dingsmitaha, confirmed same date as the Ka·dingsmita "smile" root)');
  assert.equal(irregularVerbs['went'], 're·anga');
  assert.equal(irregularVerbs['ate'], 'cha·aha');
  assert.equal(irregularVerbs['eaten'], 'cha·jok', 'corrected 2026-08-23 (NV-095, Thangseng final reconciliation relay) from cha·manaha');
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
  // "the book is on the table" now has a direct native-confirmed exact-
  // phrase entry (2026-08-08, NV-069: book=Ki·tap reconfirmed, overriding
  // the earlier 2026-08-01 audit's 'boi' guess) which correctly takes
  // precedence over the generic grammar-assembly template — a genuine
  // improvement, not the RC-CANDIDATE-010 mechanism this test targets.
  // "the market is far" (below) still exercises the actual NP-subject
  // grammar-assembly path this test is meant to cover.
  const r1 = await translate('the book is on the table');
  assert.equal(r1.method, 'exact-phrase');
  assert.equal(r1.garo, 'Ki·tap tebilo ong·a');
  const r2 = await translate('the market is far');
  assert.equal(r2.method, 'grammar-assembly');
  assert.equal(r2.garo, 'bajal Chel·a');
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
  assert.ok(bright.garo.toLowerCase().includes('ching·a'), `bright should use raka, got: ${bright.garo}`);
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
  // RC-CANDIDATE-036: was 'Ua do·o mang·gni·ko donga' - 'do·o mang·gni'
  // literally means "two birds" (do·o = chicken/bird; confirmed via
  // "two birds" itself compiling to the identical string). That was the
  // pre-fix compiler bug's output, not the correct translation. Master
  // agrees unambiguously (2 entries, one VERIFIED/HIGH) that "two dogs"
  // is 'achak mang·gni' (achak = dog). This assertion was locking in the
  // bug; the verb-guard behavior under test here is unaffected.
  assert.equal(r.garo, 'Ua achak mang·gni·ko donga');
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
  assert.equal(r.garo, 'Ka·dimea');
});

test('RC-CANDIDATE-025: verb present in sentence assembly for a "to X"-only headword ("bind")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('they bind the rope');
  assert.ok(r.garo.includes('Kadima'), `verb must not be silently dropped, got: ${r.garo}`);
});

test('RC-CANDIDATE-025: verb present in sentence assembly for a "to X"-only headword ("console")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('you console the child');
  assert.ok(r.garo.includes('Ka·dimea'), `verb must not be silently dropped, got: ${r.garo}`);
});

test('RC-CANDIDATE-025 regression guard: bare-infinitive aliasing never overwrites an existing independently-chosen bare-form entry ("hang")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('hang');
  assert.equal(r.garo, 'sring·a');
});

// --- corrections.json had two stale entries discovered the same session:
// "angry" was a truncated fragment (ka·o, not a complete word) instead of
// the VERIFIED/HIGH master_dictionary.json entry; "smile"
// was silently overridden to laugh's word (Ka·dinga) instead of its own
// VERIFIED entry. That VERIFIED entry was itself provisional
// (ka·ding·sim·ik·a) until 2026-08-06, when the Project Owner relayed a
// direct native answer confirming "smile" = Ka·dingsmita and that
// Ka·ding·a (used for both the old "laugh" and "smile" candidates before
// this session) was wrong for both. Both fixes below restore the
// current VERIFIED dictionary value — no new linguistic content chosen
// here. The separate open question of whether the newly-imported
// "Ka·a chakna amja" is a legitimate distinct-register synonym for angry
// is NOT resolved by this fix and is left for Claude A.
//
// 2026-08-14 (NV-078, Claude A, two rounds): the master_dictionary.json
// VERIFIED value was first corrected from 'ka·o·nang·a' (three raka) to
// 'Ka·o nanga' (one raka, but with a space), then corrected again the
// same day to 'Ka·onanga' (no space) once the Project Owner supplied
// the exact raka a second time, explicitly one word. This assertion is
// updated to match the final form; see NV-078 in master_dictionary.json.

test('corrections.json: "angry" resolves to the VERIFIED entry, not the truncated fragment', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he is angry');
  assert.ok(r.garo.includes('Ka·onanga'), `must use full VERIFIED word, got: ${r.garo}`);
});

test('corrections.json: "smile" resolves to its own word, not to laugh', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('she smiles');
  assert.ok(r.garo.includes('ka·dingsmita'), `must use smile's own word, got: ${r.garo}`);
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

// --- RULE-040 fix: "right" was a 3-way homonymy collapse (direction /
// matching / correct) via pickPrimary's last-write-wins, native-confirmed
// distinct 2026-07-22. Bare "right" is deliberately removed rather than
// defaulting to one sense — see prepare-data.js's grammarOverrides comment.
test('RULE-040: "right" sense split — bare key removed, no silent wrong default', async () => {
  const { lookup } = await import('../../src/lookupEngine.js');
  assert.equal(lookup('right'), null, 'ambiguous bare "right" must not resolve to any single sense');
});

test('RULE-040: "right (direction)" resolves to Jak·ra', async () => {
  const { lookup } = await import('../../src/lookupEngine.js');
  assert.equal(lookup('right (direction)').garo, 'Jak·ra');
});

test('RULE-040: "right (matching)" resolves to kra·a', async () => {
  const { lookup } = await import('../../src/lookupEngine.js');
  assert.equal(lookup('right (matching)').garo, 'kra·a');
});

test('RULE-040: "right (correct)" resolves to Kakket', async () => {
  const { lookup } = await import('../../src/lookupEngine.js');
  assert.equal(lookup('right (correct)').garo, 'Kakket');
});

test('RULE-040: "turn right" phrase correction is unaffected by the sense split', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('turn right');
  assert.equal(r.garo, 'Rikka chepbo');
});

// --- RC-CANDIDATE-027 fix: case-key silent-clobber, same shape as
// RC-016/RC-019 ("book"/"teacher"), applied uniformly wherever a genuine
// case-collision (e.g. "table"/"Table") has exactly one non-variant-
// tagged entry vs one-or-more "variant/..."-tagged entries. Same-case
// duplicate rows (e.g. "watch", "call" — no case variation, and the
// "neutral" row's own data doesn't match its own notes) are deliberately
// excluded and keep the old last-write-wins behavior; see prepare-data.js.
test('RC-CANDIDATE-027 -> SUPERSEDED-audit update (2026-08-07): "table" resolves to VERIFIED te·bil, not the now-superseded Mez', async () => {
  const { lookup } = await import('../../src/lookupEngine.js');
  assert.equal(lookup('table').garo, 'te·bil');
});

test('RC-CANDIDATE-027 -> SUPERSEDED-audit update (2026-08-07): "buy" resolves to VERIFIED bre·a, not the now-superseded Brea', async () => {
  const { lookup } = await import('../../src/lookupEngine.js');
  assert.equal(lookup('buy').garo, 'bre·a');
});

test('RC-CANDIDATE-027 -> SUPERSEDED-audit update (2026-08-07): "door" resolves to VERIFIED do·oga, not the now-superseded Do·ga', async () => {
  const { lookup } = await import('../../src/lookupEngine.js');
  assert.equal(lookup('door').garo, 'do·oga');
});

test('RC-CANDIDATE-027: same-case duplicates ("watch") are unaffected, old behavior preserved', async () => {
  const { lookup } = await import('../../src/lookupEngine.js');
  assert.equal(lookup('watch').garo, 'ni·rik·a');
});

// --- General, generative interrogative formation (Project Owner
// directive root cause 3) is still deliberately NOT implemented or
// tested here. Two things changed since this was first written, neither
// of which closes the gap:
// (a) RC-CANDIDATE-030 (2026-07-29): punctuated interrogatives that
// already have a confirmed corrections.json entry ("will you eat?" etc)
// now correctly reach it instead of silently falling through to
// sov-assembly - see the RC-CANDIDATE-030 tests below. This is an
// engineering fix for a lookup bug, not new linguistic content.
// (b) NV-031 (docs/THANGSENG_NATIVE_VALIDATION.md, closed 2026-07-25)
// confirmed "-ma" is verb-final and productive across tenses (not
// future-only as the single earlier WhatsApp data point suggested), with
// specific present/continuous/negative-future forms now attested.
// Despite this, NV-031's own status line still reads "OPEN, feeds
// RC-CANDIDATE-020/021" - present-tense, past-tense, and object-present
// interrogative forms remain unconfirmed for general use, and no
// generative rule exists in analyzeGrammar for producing "-ma" forms
// from arbitrary input the way applyTense does for tense suffixes.
// Encoding one into the regression suite before that rule is reviewed
// and committed to the grammar docs would still lock in content the
// standing integration rule prohibits implementing directly. Revisit
// once RC-CANDIDATE-020/021 close or a dedicated interrogative-formation
// rule is committed.

// --- Found via live end-to-end quality check (2026-07-29, Claude B),
// not from a regression report: an unresolved object (word not in the
// dictionary) was being silently OMITTED from assembleGrammar's output
// instead of surfacing as '[UNKNOWN]', which defeated that function's
// own '[UNKNOWN]'-rejection safety check. Confirmed live: "she is using
// her smartphone" -> "Ua Chingna" (entire object AND possessive silently
// vanished), returned as method='grammar-assembly' confidence=0.82 -
// indistinguishable from a correct translation. Fixing this exposed a
// second, deeper bug: analyzeGrammar's object-extraction loop had no
// negation guard, so bare "not"/"never" were being captured as the
// OBJECT in negative intransitive sentences ("i did not eat"), which
// also produces '[UNKNOWN]' - the two bugs had been silently
// cancelling out. Both fixed together; see grammarEngine.js and
// sentenceBuilder.js for the two fix-site comments.
test('unresolved object no longer silently vanishes from grammar-assembly output', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('she is using her smartphone');
  // Must NOT be a confident grammar-assembly result missing its object -
  // either it correctly falls through to a lower-confidence method, or
  // it surfaces [UNKNOWN] - anything but silently dropping content while
  // claiming grammar-assembly's normal confidence.
  assert.ok(
    r.method !== 'grammar-assembly' || r.garo.includes('[UNKNOWN]') || r.garo.includes('[unknown]'),
    `object must not silently vanish while claiming full grammar-assembly confidence, got: ${JSON.stringify(r)}`
  );
});

test('negation guard: bare "not"/"never" are never captured as the object', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r1 = await translate('i did not eat');
  assert.equal(r1.method, 'grammar-assembly');
  assert.ok(!r1.garo.includes('[UNKNOWN]') && !r1.garo.includes('[unknown]'), `got: ${r1.garo}`);
  const r2 = await translate('he did not go');
  assert.equal(r2.method, 'grammar-assembly');
  assert.ok(!r2.garo.includes('[UNKNOWN]') && !r2.garo.includes('[unknown]'), `got: ${r2.garo}`);
});

// --- RC-CANDIDATE-030 fix (diagnosed by Claude A, fixed by Claude B,
// 2026-07-29): corrections.json stores question keys without "?"
// ("will you eat"), so a real user typing the punctuation they'd
// naturally type ("will you eat?") missed the confirmed correction
// entirely and fell through to sov-assembly's word-salad output.
test('RC-CANDIDATE-030: "will you eat?" (with punctuation) hits the confirmed correction', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const withPunct = await translate('will you eat?');
  const withoutPunct = await translate('will you eat');
  assert.equal(withPunct.method, 'correction');
  assert.equal(withPunct.garo, withoutPunct.garo);
});

test('RC-CANDIDATE-030: "?"-stripping does not shadow a deliberately different "!"-keyed entry', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('eat!');
  assert.equal(r.garo, 'Cha·bo!', 'exclamatory-imperative "eat!" must keep its own entry, not fall back to plain "eat"');
});

test('RC-CANDIDATE-030: a corrections.json key that deliberately includes "?" is still matched directly, not shadowed', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('did you eat?');
  assert.equal(r.method, 'correction');
});

// --- RC-CANDIDATE-031 fix (2026-07-30, Claude B, engineering quality
// audit): parseCountingPhrase only ever read words[0] as the count,
// so a two-word compound number ("twenty one") silently swallowed the
// units word into the noun instead of combining to 21. The classifier
// system itself already renders 21 correctly given a single integer -
// this was purely a parsing-order bug, not a linguistic gap.
test('RC-CANDIDATE-031: "twenty one apples" parses as count 21, not 20 + "one apple"', async () => {
  const { parseCountingPhrase } = await import('../../src/garo_classifier.js');
  const r = parseCountingPhrase('twenty one apples');
  assert.equal(r.count, 21);
  assert.equal(r.englishNoun, 'apple');
});

test('RC-CANDIDATE-031: "twenty one apples" translates using the correct compiled 21, not 20', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('twenty one apples');
  assert.equal(r.method, 'classifier');
  assert.ok(r.garo.includes('Kolgrik·sa'), `expected 21 (Kolgrik·sa) in output, got: ${r.garo}`);
});

test('RC-CANDIDATE-031: a plain single-number phrase ("twenty apples") is unaffected', async () => {
  const { parseCountingPhrase } = await import('../../src/garo_classifier.js');
  const r = parseCountingPhrase('twenty apples');
  assert.equal(r.count, 20);
  assert.equal(r.englishNoun, 'apple');
});

test('RC-CANDIDATE-031: an ordinary non-compound count ("three books") is unaffected', async () => {
  const { parseCountingPhrase } = await import('../../src/garo_classifier.js');
  const r = parseCountingPhrase('three books');
  assert.equal(r.count, 3);
  assert.equal(r.englishNoun, 'book');
});

test('RC-CANDIDATE-031: an invalid compound ("twenty ten apples") does not falsely combine', async () => {
  const { parseCountingPhrase } = await import('../../src/garo_classifier.js');
  const r = parseCountingPhrase('twenty ten apples');
  assert.equal(r.count, 20, '"ten" is not a 1-9 units word, must not combine with "twenty"');
});

// --- RC-CANDIDATE-034 fix (2026-07-31, Claude B): step 7 (morphology)
// was silently dropping unresolvable words from its joined output with no
// signal, so an all-stopword-shaped input produced identical text whether
// or not it contained an unresolvable word. Fix carries an '[UNKNOWN]'
// marker through in place of a dropped word instead of filtering it out
// silently — the >=50% resolution threshold itself is unchanged.
test('RC-CANDIDATE-034: an unresolvable word inside an all-function-word sentence is surfaced, not silently dropped', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const withGap = await translate('is on xyzzy at');
  assert.equal(withGap.method, 'morphology');
  assert.ok(withGap.garo.includes('[UNKNOWN]'), 'unresolved word must be visibly signalled in the output');
});

test('RC-CANDIDATE-034: the same sentence without the unresolvable word is unaffected (no false marker, no regression)', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const clean = await translate('is on at');
  assert.equal(clean.method, 'morphology');
  assert.ok(!clean.garo.includes('[UNKNOWN]'), 'a fully-resolved input must not gain a spurious marker');
});

test('RC-CANDIDATE-034: before/after outputs for the gap-vs-no-gap pair are now distinguishable', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const clean = await translate('is on at');
  const withGap = await translate('is on xyzzy at');
  assert.notEqual(clean.garo, withGap.garo, 'previously both produced identical output, masking the dropped word');
});

// --- RC-CANDIDATE-035 fix (2026-07-31, Claude B): "using" strips
// (ing$ rule, in both findVerbForm and assembleSentenceSOV) to "us",
// which collides with the pronoun dictionary entry for "us", producing
// a stray "Chingna" token wherever "using" appeared, with no connection
// to the word "using" itself. Guarded via pronoun_map.json in both
// independent code paths that do this stripping.
test('RC-CANDIDATE-035: "using" no longer resolves to the stray pronoun "us"', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('she is using her phone');
  assert.ok(!result.garo.includes('Chingna'), 'must not leak the "us" pronoun translation via ing$-stripping of "using"');
});

test('RC-CANDIDATE-035: the dictionary addition of "phone" (NV-044) no longer surfaces the stray token either', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('she is using her smartphone');
  assert.ok(!result.garo.includes('Chingna'), 'must not leak the "us" pronoun translation for the smartphone variant either');
});

test('RC-CANDIDATE-035: genuine "us" pronoun resolution is unaffected', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('help us');
  // "us" as an actual word (not stripped from "using") must still resolve normally.
  assert.ok(result && result.garo && result.garo.length > 0, 'genuine "us" usage must still translate');
});

// --- BUG-REPORT-WHERE-GOING fix (2026-08-02, Claude B, engineering-only,
// per Project Owner bug report): two independent stale artifacts both
// caused "where ... going?" constructions to surface the stationary/
// no-movement locative "bano" instead of the VERIFIED movement-to
// locative "bachi" (RULE-044, NV-047, Claude A, Project Owner closure
// 2026-07-31):
//  (1) corrections.json's "where are you going" phrase entry predated
//      NV-047's dictionary fix and was never synced with it.
//  (2) phrase_maps.js's flat single-word 'where':'Bano' entry, consulted
//      by assembleSentenceSOV's per-word fallback (the path taken by
//      "where is he going?"/"where are they going?", which have no
//      corrections.json phrase entry), had no way to reflect RULE-044's
//      bano/bachi distinction — it always returned the stationary form
//      regardless of sentence context.
// Fixed (1) by syncing corrections.json's value with the already-
// VERIFIED compiled_dict.json/master_dictionary.json value, and (2) by
// adding a narrowly-scoped movement-verb-signal override inside
// assembleSentenceSOV — not a new linguistic rule, just making the
// fallback path respect the distinction Claude A already established.
test('BUG-REPORT-WHERE-GOING: "where are you going?" uses the VERIFIED movement-locative "bachi", not "bano"', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('Where are you going?');
  assert.equal(result.garo, 'Na·a bachi re·angenga?');
  assert.equal(result.method, 'correction');
});

test('BUG-REPORT-WHERE-GOING: "where is he going?" selects "bachi", not "bano"', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('Where is he going?');
  assert.ok(result.garo.includes('Bachi'), `expected the movement-locative "Bachi", got: ${result.garo}`);
  assert.ok(!result.garo.includes('Bano'), `must not regress to the stationary-locative "Bano": ${result.garo}`);
});

test('BUG-REPORT-WHERE-GOING: "where are they going?" selects "bachi", not "bano"', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('Where are they going?');
  assert.ok(result.garo.includes('Bachi'), `expected the movement-locative "Bachi", got: ${result.garo}`);
  assert.ok(!result.garo.includes('Bano'), `must not regress to the stationary-locative "Bano": ${result.garo}`);
});

// Regression guard: unrelated stationary "where" questions (no movement
// verb present) must continue using the correct no-movement locative
// "bano" and must not be swept up by the movement-verb-signal override,
// which is scoped strictly to the literal word "going".
test('BUG-REPORT-WHERE-GOING: sibling stationary location questions are unaffected ("where do you live?")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('Where do you live?');
  assert.equal(result.garo, 'Na·a bano tanga?');
});

test('BUG-REPORT-WHERE-GOING: sibling stationary location questions are unaffected ("where is the market?")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('Where is the market?');
  assert.equal(result.garo, 'Bajal bano?');
});

test('BUG-REPORT-WHERE-GOING: sibling stationary location questions are unaffected ("where are you?")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('Where are you?');
  assert.equal(result.garo, 'Na·ara bano?');
});

// Data-level regression guard (Claude C forensic audit, 2026-08-02):
// the translate()-level tests above only prove the cascade currently
// resolves correctly because corrections.json's fixed entry is checked
// (and returns) before phrase_maps.js's exact-phrase entry is ever
// reached. They do NOT prove phrase_maps.js's own data is correct, so a
// future edit or removal of the corrections.json entry (e.g. as part of
// the cleanup this bug report itself recommends, since compiled_dict.json
// already has the right exact-phrase match) would silently re-expose
// phrase_maps.js's stale value with no test catching it. Asserting
// directly against PHRASE_MAPS closes that gap.
test('BUG-REPORT-WHERE-GOING: phrase_maps.js\'s own "where are you going" entry is synced to "bachi", independent of corrections.json shadowing it', async () => {
  const { PHRASE_MAPS } = await import('../../src/data/phrase_maps.js');
  assert.equal(PHRASE_MAPS['where are you going'], 'Na·a bachi re·angenga?');
});

// --- isVerified anchoring fix (2026-08-02, Claude B, prepare-data.js
// pickPrimary): the RC-036-follow-up VERIFIED-preference check used an
// unanchored substring match (/verified\/high/i.test(notes) &&
// !/unverified/i.test(notes)) across an entry's ENTIRE notes field, not
// just its tag prefix. This produced two distinct failure modes:
//  - False negative: a genuinely VERIFIED/HIGH entry whose notes
//    describe what it was promoted FROM ("...promoted from prior
//    variant/UNVERIFIED/HIGH") got disqualified by its own promotion
//    history. Flagged retroactively via the mandatory Runtime Handoff
//    governance rule (WORKSTATE.yaml, 2026-08-02) on the "ripe" key.
//  - False positive: a SUPERSEDED/"not authoritative for compile"
//    legacy entry whose notes describe what supersedes it ("...has
//    VERIFIED/HIGH form(s) [...]") got wrongly treated as itself
//    VERIFIED, silently overriding Claude A's explicit non-authoritative
//    annotation on at least 56 keys corpus-wide.
// Fixed by anchoring the check to the notes field's actual start
// (/^verified\/high\b/i), matching the same anchoring convention
// isVariant already uses. Full corpus diff before/after confirmed all
// 78 affected keys fall cleanly into one of the two categories above,
// zero unexplained changes.
test('isVerified anchoring: "ripe" resolves to the sole VERIFIED/HIGH candidate "min·a", not the untagged last-write-wins fallback', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('ripe');
  assert.equal(result.garo, 'min·a');
});

test('isVerified anchoring: a SUPERSEDED legacy entry ("type") is no longer force-selected over its non-authoritative status', async () => {
  const { lookupGaro } = await import('../../src/lookupEngine.js');
  // Claude A's notes explicitly mark the legacy "ambiguous" value
  // "Not authoritative for compile" — it must never be the compiled
  // primary regardless of which fallback ultimately wins.
  assert.notEqual(lookupGaro('type'), 'ambiguous');
});

// Runtime Engineering Audit (2026-08-03, Claude B): lookupGaro() checked
// corrections.json and compiled_dict.json but never phrase_maps.js, so
// any word whose ONLY override lived in phrase_maps.js was invisible to
// every fallback path that calls lookupGaro() instead of the top-level
// translate() cascade's own step-1.5 exact-match — stopword-stripping,
// morphology's findVerbForm, compound-split. Confirmed live before the
// fix: "so food" returned compiled_dict.json's stale "al·a" instead of
// phrase_maps.js's "Mi" (what bare "food" correctly returns); "he
// washes" returned compiled_dict.json's "Su·gala" instead of
// phrase_maps.js's "Su·srong·a" (what bare "wash" correctly returns) via
// findVerbForm on the main grammar-assembly path, not just the fallback.
//
// UPDATED 2026-08-15 (Claude A, mechanical stale-override resync per
// docs/CLAUDE_C_AUDIT_20260815.md §3.4): "food" was itself one of the
// resynced words -- phrase_maps.js's "food" was the SUPERSEDED value
// "Mi", now corrected to VERIFIED "al·a", which happens to be identical
// to compiled_dict.json's own value. That makes "food" no longer
// demonstrate override-precedence (both layers now agree), so the
// mechanism check below was moved to "quick"/"Ta·rakbo!" (phrase_maps-only,
// an intentional exclamation-marked imperative variant, not shadowed by
// a corrections.json entry the way "hurry" is) vs. compiled_dict's
// punctuation-free "Ta·rakbo" -- a genuine, stable divergence, same
// precedent as the RC-CANDIDATE-010/012 test-value swaps after a real
// correction landed. Values updated 2026-08-23 (NV-095, Thangseng final
// reconciliation relay): "quick"="Ta·rakbo!" was previously wrongly
// borrowing "hurry"'s value "Tarkbo!" — the relay confirmed these are
// distinct headwords with distinct forms.
test('lookupGaro() consults phrase_maps.js: direct call', async () => {
  const { lookupGaro } = await import('../../src/lookupEngine.js');
  assert.equal(lookupGaro('quick'), 'Ta·rakbo!');
});

test('RUNTIME-AUDIT: stopword-stripped fallback path reaches phrase_maps.js ("so quick")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('so quick');
  assert.equal(result.garo, 'Ta·rakbo!');
});

test('RUNTIME-AUDIT: findVerbForm/grammar-assembly path reaches phrase_maps.js ("he washes")', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const result = await translate('he washes');
  assert.equal(result.garo, 'Ua Su·sranga');
});

test('RUNTIME-AUDIT: corrections.json still takes precedence over phrase_maps.js through lookupGaro()', async () => {
  // "no" exists in both corrections.json ("Ihing") and phrase_maps.js
  // ("Ong·ja") with different values — corrections must still win,
  // matching translate()'s own documented step 1 > step 1.5 order.
  const { lookupGaro } = await import('../../src/lookupEngine.js');
  assert.equal(lookupGaro('no'), 'Ihing');
});

// --- grammarOverrides vs. VERIFIED precedence (2026-08-04, Claude B,
// prepare-data.js pickPrimary/finalizeDictionary) ---
//
// ENGINEERING DESIGN DEFECT (docs/RUNTIME_ENGINEERING_AUDIT_20260803.md):
// grammarOverrides previously applied unconditionally, after pickPrimary,
// with no check at all against pickPrimary's own result — so it could
// silently discard an explicit VERIFIED/HIGH native-validation
// confirmation. Investigated for two regression examples ('wait',
// 'salt') per Project Owner instruction — NOT special-cased in the fix
// itself. Traced independently:
//   - 'wait': master_dictionary.json's 'senga' entry is the linguistically
//     correct declarative form (Claude A, 2026-07-25 native validation),
//     but its notes ("CORRECTED 2026-07-25...") don't match the narrow,
//     unbroadened isVerified signal (notes must start literally with
//     "verified/high") — so pickPrimary's verifiedNeutral branch never
//     selects it; it falls to master-last-write-wins.
//   - 'salt' (post NV-055, master_dictionary.json 'Kari' now the
//     native-confirmed correct form): same shape — neither 'Kari' nor
//     'kai·sim' carries the literal isVerified signal, so pickPrimary
//     again falls to master-last-write-wins rather than a genuine
//     verified selection.
// Both traces converge on the SAME root cause: pickPrimary only ever
// treats a selection as "verified" for the narrow verifiedNeutral
// branch, and grammarOverrides did not respect even that existing,
// already-computed signal. Per explicit instruction: do NOT broaden the
// isVerified regex or add new note-parsing heuristics — that would
// perpetuate the existing architectural weakness (fragile prose-parsing
// as the source of truth for confidence). No machine-readable
// confidence field exists anywhere in master_dictionary.json's schema
// (english/garo/category/notes/pos/classifier only) to prefer instead,
// per the audit above — so this fix does NOT resolve 'wait' or 'salt'
// to a "corrected" value; it only closes the precedence gap using the
// signal that already exists. See docs/RUNTIME_ENGINEERING_AUDIT_20260803.md
// "UPDATE, 2026-08-04" and the proposed metadata model reported
// alongside this change for the schema-level fix, deferred pending
// Project Owner decision.
test('grammarOverrides precedence: "wait" and "salt" compile values are unchanged by this fix (regression examples, not linguistic endorsement)', async () => {
  const dict = JSON.parse(
    (await import('node:fs')).readFileSync(
      new URL('../../src/compiled_dict.json', import.meta.url),
      'utf8'
    )
  );
  // Both keys still resolve via grammarOverrides (as before this fix),
  // since neither currently carries the literal isVerified signal —
  // this fix must not have silently changed either value.
  assert.equal(dict['wait'], 'Damo/Sengbo');
  assert.equal(dict['salt'], 'Kari');
});

test('grammarOverrides precedence: pickPrimary reports verifiedSelection only for its verifiedNeutral branch (mechanism, synthetic data)', async () => {
  const { pickPrimary } = await import('../../prepare-data.js');

  // Genuine single VERIFIED/HIGH candidate among untagged siblings —
  // must report verifiedSelection: true.
  const verified = pickPrimary(
    [
      { v: 'wrong-value', isVariant: false, isVerified: false, rawKey: 'testword', source: 0 },
      { v: 'right-value', isVariant: false, isVerified: true, rawKey: 'testword', source: 2 }
    ],
    'testword'
  );
  assert.equal(verified.value, 'right-value');
  assert.equal(verified.verifiedSelection, true);

  // Same shape as 'wait'/'salt': no candidate carries the isVerified
  // signal, so pickPrimary falls to master-last-write-wins — this must
  // NOT be reported as a verified selection.
  const unverified = pickPrimary(
    [
      { v: 'legacy-value', isVariant: false, isVerified: false, rawKey: 'testword2', source: 0 },
      { v: 'master-value', isVariant: false, isVerified: false, rawKey: 'testword2', source: 2 }
    ],
    'testword2'
  );
  assert.equal(unverified.verifiedSelection, false);
});

test('grammarOverrides precedence: finalizeDictionary skips a grammarOverrides entry when pickPrimary already selected a VERIFIED/HIGH candidate', async () => {
  const { finalizeDictionary } = await import('../../prepare-data.js');

  const mergedValues = {
    // A key present in grammarOverrides AND with a genuine single
    // VERIFIED/HIGH candidate — grammarOverrides must NOT clobber it.
    'testverb': [
      { v: 'stale-legacy-value', isVariant: false, isVerified: false, rawKey: 'testverb', source: 0 },
      { v: 'native-confirmed-value', isVariant: false, isVerified: true, rawKey: 'testverb', source: 2 }
    ],
    // A key present in grammarOverrides with NO verified candidate
    // (same shape as current 'wait'/'salt') — grammarOverrides must
    // still apply exactly as before.
    'testadj': [
      { v: 'legacy-a', isVariant: false, isVerified: false, rawKey: 'testadj', source: 0 },
      { v: 'legacy-b', isVariant: false, isVerified: false, rawKey: 'testadj', source: 2 }
    ]
  };
  const grammarOverrides = {
    'testverb': 'hardcoded-override-value',
    'testadj': 'hardcoded-override-value-2'
  };

  const { finalized } = finalizeDictionary(mergedValues, grammarOverrides);
  assert.equal(finalized['testverb'], 'native-confirmed-value');
  assert.equal(finalized['testadj'], 'hardcoded-override-value-2');
});


// --- RUNTIME-AUDIT (2026-08-04, Claude B): findVerbForm corrections.json
// precedence fix. Root cause: IRREGULAR_VERBS (static table) was checked
// BEFORE corrections.json in findVerbForm, silently shadowing any
// native-validated correction sharing a key with an irregular-verb entry.
// 'need' was a live, confirmed regression of NV-005/NV-016/NV-021's
// sikenga->nanga fix — findVerbForm('need') still returned the superseded
// 'sikenga' with corrections.json correctly holding 'nanga'. Fix scoped to
// corrections.json only (the pipeline's own documented top-priority
// override layer), not the full lookupGaro cascade — see morphologyEngine.js
// comment for why compiled_dict precedence is deliberately left untouched.
test('findVerbForm: corrections.json overrides IRREGULAR_VERBS (regression: need must not regress to superseded sikenga)', async () => {
  const { findVerbForm } = await import('../../src/morphologyEngine.js');
  assert.equal(findVerbForm('need'), 'nanga');
  assert.equal(findVerbForm('needs'), 'nanga');
});

test('findVerbForm: corrections.json precedence holds for all confirmed-stale IRREGULAR_VERBS keys (eaten/bought/heard/standing/sitting)', async () => {
  const { findVerbForm } = await import('../../src/morphologyEngine.js');
  const corrections = (await import('../../src/data/corrections.json', { with: { type: 'json' } })).default;
  for (const key of ['eaten', 'bought', 'heard', 'standing', 'sitting']) {
    assert.equal(findVerbForm(key), corrections[key], `findVerbForm('${key}') should match corrections.json, not the stale IRREGULAR_VERBS value`);
  }
});

test('findVerbForm: IRREGULAR_VERBS still used as fallback when no corrections.json entry exists (went/gone/came — genuinely irregular, no other source)', async () => {
  const { findVerbForm } = await import('../../src/morphologyEngine.js');
  const IRREGULAR_VERBS = (await import('../../src/data/irregular_verbs.json', { with: { type: 'json' } })).default;
  for (const key of ['went', 'gone', 'came']) {
    assert.equal(findVerbForm(key), IRREGULAR_VERBS[key]);
  }
});

// --- Claude C audit (2026-08-04), Finding 1: 'Anti' (week) contamination
// in market-going phrases. Root cause: phrase-level corrections/phrase-maps
// written against 'market' before NV-051/NV-052 settled market=Bajal (Anti
// explicitly rejected as a market synonym, PL-0001992), never swept
// afterward. Fixed 7 of 9 flagged rows (2 — "let's go to market" family —
// remain open pending Claude A's targeted native-check, NV-059).
test('market phrases do not contain the stale "Anti" (week) contamination', async () => {
  const cases = [
    ['at the market', 'bajalo'],
    ['go to the market', "Bajalchi re'angbo"],
    ["let's go to the market", 'Hai bajalchi re·na'],
    ['i am waiting at the market', 'Anga bajalo sengenga'],
  ];
  for (const [input, expected] of cases) {
    const result = await translate(input);
    assert.equal(result.garo, expected);
    assert.ok(!result.garo.toLowerCase().includes('anti'), `"${input}" should not contain the stale Anti (week) token`);
  }
});

test('phrase_maps market fallback resolves to Bajal, not the stale Bajal Anti compound', async () => {
  const { lookupPhrase } = await import('../../src/data/phrase_maps.js');
  assert.equal(lookupPhrase('market'), 'Bajal');
});

// --- Claude C audit (2026-08-04), Finding 2: inverted yes/no questions
// ("is he going to X?") never reached grammar-assembly — dropped the verb
// entirely (fell to assembleSentenceSOV, which has no verb-tense assembly).
// Fixed by normalizing aux-inversion word order before the existing
// subject/verb search, and appending the already-VERIFIED ' ma?' yes/no
// marker (confirmed via "are you going"->"...enga ma?" etc.).
test('inverted yes/no questions ("is he/she going to X?") retain the verb, matching the declarative form + ma marker', async () => {
  const declarative = await translate('he is going to school');
  const question = await translate('is he going to school?');
  assert.equal(question.method, 'grammar-assembly');
  assert.equal(question.garo, declarative.garo + ' ma?');

  const sheQuestion = await translate('is she going to school?');
  assert.equal(sheQuestion.method, 'grammar-assembly');
  assert.ok(sheQuestion.garo.includes('ma?'));
});

// --- getCategories()/getByCategory() dormant (flagged P1 in
// docs/CLAUDE_B_MIGRATION_20260808.md, carried over multiple prior
// sessions): both always returned only ['uncategorized'] / an empty list,
// because getAllVocabulary() built every entry from compiled_dict.json —
// which stores plain Garo strings with no category field at all — and
// never consulted category_index.json (built separately from
// master_dictionary.json), even though the default-export wrapper's
// getAllCategories()/getCategoryVocabulary() already fell back to it.
// Fix: getAllVocabulary() now looks each english key up in CATEGORY_INDEX
// when the compiled-dict entry itself has no category. Real category data
// existed the whole time; this was purely a wiring gap.
test('getCategories() returns real categories from category_index.json, not just ["uncategorized"]', async () => {
  const { getCategories } = await import('../../src/translationEngine.js');
  const cats = getCategories();
  assert.ok(cats.length > 1, `expected multiple real categories, got: ${JSON.stringify(cats)}`);
  assert.ok(cats.includes('home'), `expected 'home' among categories, got: ${JSON.stringify(cats)}`);
  assert.ok(cats.includes('animals'), `expected 'animals' among categories, got: ${JSON.stringify(cats)}`);
});

test('getByCategory("home") returns real dictionary entries tagged with that category', async () => {
  const { getByCategory } = await import('../../src/translationEngine.js');
  const homeEntries = getByCategory('home');
  assert.ok(homeEntries.length > 0, 'expected at least one "home"-category entry');
  assert.ok(homeEntries.every(e => e.category === 'home'), 'every returned entry must actually be tagged "home"');
  assert.ok(homeEntries.some(e => e.english === 'door'), `expected "door" among home entries, got: ${JSON.stringify(homeEntries.map(e => e.english).slice(0, 10))}`);
});

test('getAllVocabulary() prefers a compiled-dict entry\'s own category over category_index.json when both exist (no silent override of real data)', async () => {
  const { getAllVocabulary } = await import('../../src/translationEngine.js');
  const vocab = getAllVocabulary();
  // compiled_dict.json entries are plain strings today (category always
  // null coming in), so every entry's category currently comes from
  // CATEGORY_INDEX or the 'uncategorized' default — this just guards
  // that assumption doesn't silently reverse if compiled_dict.json's
  // shape ever changes to carry its own category again.
  assert.ok(vocab.length > 0);
  assert.ok(vocab.every(e => typeof e.category === 'string' && e.category.length > 0));
});

// --- "she has three children" open issue (P1 in
// docs/CLAUDE_B_MIGRATION_20260808.md): grammarEngine.js's object-
// extraction loop went straight from a failed full-phrase lookup
// ("three children") to a bare lastWord lookup ("children" ->
// "Bi·sarang"), silently dropping the leading number word and never
// applying a classifier — even though garo_classifier.js's countNoun()/
// parseCountingPhrase() already handle exactly this correctly on their
// own. Fixed by wiring that existing classifier engine into the object
// loop, scoped to only fire when no full-phrase lookup already succeeds
// (so it can never override an existing, even if separately-flagged-
// wrong, dictionary/phrase-map entry like "three dogs").
test('"she/he has N children" applies the sak (person) classifier instead of silently dropping the number', async () => {
  const cases = [
    ['she has three children', 'Ua bi·sa sakgittam donga'],
    ['he has three children', 'Ua bi·sa sakgittam donga'],
  ];
  for (const [input, expected] of cases) {
    const result = await translate(input);
    assert.equal(result.garo, expected);
  }
});

test('"she has N children" for counts without a corrections.json entry still applies the classifier via grammar-assembly', async () => {
  const result = await translate('she has five children');
  assert.equal(result.method, 'grammar-assembly');
  assert.equal(result.garo, 'Ua bi·sa sak·bonga·ko donga');
  assert.ok(!result.garo.includes('bi·sarang'), 'should not fall back to the bare plural noun with no classifier');
});

test('object-loop classifier fix does not touch already-resolved counting phrases (e.g. existing dictionary "three dogs" entry)', async () => {
  const withNumber = await translate('she has three dogs');
  const withoutNumber = await translate('she has dogs');
  // "three dogs" itself is no longer a stale/wrong value (see prepare-
  // data.js's counting-phrase self-correction, 2026-08-09, which fixed
  // this specific entry along with 214 others) — but this test's actual
  // job is narrower and still holds regardless: it must NOT be identical
  // to the number-less sentence, i.e. the number must not be silently
  // dropped the way "children" was before the object-loop fix.
  assert.notEqual(withNumber.garo, withoutNumber.garo);
});

// --- Counting-phrase self-correction (2026-08-09, per explicit native-
// speaker-confirmed reference: "two dogs"=achak mang·gni, "three
// dogs"=achak mang·gittam, "four dogs"=achak mang·bri). prepare-data.js
// now re-derives every "<number> <noun>" compiled_dict.json entry from
// garo_classifier.js's classifier engine at build time (noun's own
// canonical dictionary entry + its confirmed classifier + the count),
// overwriting whatever stale literal value the source dictionaries had —
// closing this as a systemic, self-healing build step rather than a
// one-off patch of the entries known-wrong today.
// 2026-08-09: this test originally asserted a broader set of categories
// (person/teacher/book/coin) that depended on a build-time auto-
// derivation pass which was reverted after merging with Claude A's
// concurrent NV-071 session — see prepare-data.js's comment at the
// former counting-phrase self-correction site for why. Narrowed to just
// the dog case, which is genuinely, natively confirmed (Thangseng
// direct, NV-071 follow-up #2) at the master_dictionary.json source
// level, not derived by engine code.
test('"<number> dogs" counting phrases use the correct, natively-confirmed classifier suffix for their count', async () => {
  const { default: compiledDict } = await import('../../src/compiled_dict.json', { with: { type: 'json' } });
  const cases = [
    ['two dogs', 'achak mang·gni'],
    ['three dogs', 'achak mang·gittam'],
    ['four dogs', 'achak mang·bri'],
  ];
  for (const [key, expected] of cases) {
    assert.equal(compiledDict[key], expected, `compiled_dict["${key}"] should match the native-confirmed value`);
  }
});

// --- Runtime-propagation fix (2026-08-14, Claude B, per Claude C's audit
// §3.5): translate()'s own header docstring has always documented "2.
// Exact phrase match (compiled dict)" as outranking "5. Number + classifier
// engine", but the code that wired classifier composition (8f7dfba) placed
// it at step "1.6", running BEFORE the exact-phrase lookup — inverting the
// documented precedence. That meant a confirmed, native-reviewed
// compiled_dict.json entry for a specific counting phrase (e.g. NV-073's
// "twenty student" -> "Chattro sakKolgrik") was silently shadowed at
// runtime: translate() kept mechanically recomposing from the bare noun's
// (unfixed) dictionary entry every single time, because classifier
// composition ran first and returned before the exact-phrase check ever
// got a turn. These tests guard the fixed precedence directly. ---
test('runtime propagation: an exact compiled_dict.json phrase entry wins over classifier composition (NV-073 "twenty student")', async () => {
  const { default: compiledDict } = await import('../../src/compiled_dict.json', { with: { type: 'json' } });
  assert.equal(compiledDict['twenty student'], 'Chattro sakKolgrik',
    'precondition: compiled_dict.json must carry the NV-073-fixed phrase-level entry for this test to be meaningful');
  const r = await translate('twenty student');
  assert.equal(r.method, 'exact-phrase',
    'a confirmed phrase-level compiled_dict.json entry must win over mechanical classifier composition');
  assert.equal(r.garo, 'Chattro sakKolgrik');
});

test('runtime propagation: classifier composition still runs as the fallback when no exact-phrase entry exists', async () => {
  const { default: compiledDict } = await import('../../src/compiled_dict.json', { with: { type: 'json' } });
  assert.equal(compiledDict['six dogs'], undefined,
    'precondition: this phrase must have no dedicated compiled_dict.json entry for this test to exercise the fallback path');
  const r = await translate('six dogs');
  assert.equal(r.method, 'classifier',
    'with no exact-phrase entry, composition from the bare noun must still be reached (the reorder must not break the fallback)');
  assert.equal(r.garo, 'achak mang·dok');
});

// --- Plural counted-noun generation defect (2026-08-14, Claude B, per
// Claude C's audit §3/§3.5, "twenty students"): the bulk-generated plural
// phrase-level entry for "twenty students" in garo_dictionary.json
// ("chi chi chik·gni") was independently flagged SUPERSEDED for that exact
// key in master_dictionary.json, with no verified replacement ever added —
// unlike its singular sibling "twenty student", which NV-073 did fix.
// Before the SUPERSEDED-only-candidate pipeline fix (prepare-data.js),
// that untagged garo_dictionary.json duplicate shipped anyway once
// master's own (sole) candidate was filtered out as superseded, silently
// re-introducing the exact value master had already rejected. Now the key
// is correctly held out of compiled_dict.json (see
// docs/SUPERSEDED_ONLY_KEYS.md), and translate() falls through to
// classifier composition instead of surfacing the known-wrong bulk value —
// this test guards that translate() never emits the specific rejected
// string again, whatever composition currently produces from the (still
// linguistically unconfirmed) bare "students" root. ---
test('plural counted-noun defect: "twenty students" no longer surfaces the SUPERSEDED bulk value', async () => {
  const { default: compiledDict } = await import('../../src/compiled_dict.json', { with: { type: 'json' } });
  assert.equal(compiledDict['twenty students'], undefined,
    'the SUPERSEDED-only-candidate pipeline fix must hold this key out of compiled_dict.json entirely');
  const r = await translate('twenty students');
  assert.notEqual(r.garo, 'chi chi chik·gni',
    'translate() must never surface the specific value master_dictionary.json marked SUPERSEDED for this key');
});

// --- Item 3 fix (2026-08-23, Claude B, session migration doc): two
// independent bugs in assembleSentenceSOV's fallback path, both
// reproduced via "the tall man is carrying four heavy boxes to the
// river". See sentenceBuilder.js fix-site comments for full root-cause
// analysis (no POS data exists anywhere in this repo to distinguish
// adjectives from verbs - this is a structural fix, not a linguistic one).
test('item 3: sibilant-ending plural ("boxes") no longer silently vanishes from sov-assembly output', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('the tall man is carrying four heavy boxes to the river');
  assert.equal(r.method, 'sov-assembly');
  assert.ok(r.garo.includes('bak·so'), `"box" must resolve and appear in output, got: ${r.garo}`);
});

test('item 3: attributive adjective ending in ·a stays adjacent to its noun instead of stranding at the sentence tail', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('the tall man is carrying four heavy boxes to the river');
  assert.equal(r.method, 'sov-assembly');
  const words = r.garo.split(/\s+/);
  const tallIdx = words.indexOf('Chu·a');
  const manIdx = words.indexOf('Me·asa');
  assert.ok(tallIdx !== -1 && manIdx !== -1, `both "tall" and "man" must be present, got: ${r.garo}`);
  assert.equal(manIdx, tallIdx + 1, `"tall" must sit immediately before "man", got: ${r.garo}`);
});

test('item 3 regression guard: single-predicate-adjective sentences (RC-CANDIDATE-018 family) are unaffected — the lone ·a-ending word is still elected as the verb', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('a big dog is sleeping');
  assert.equal(r.method, 'sov-assembly');
  // "sleeping" resolves to the true verb and, being the last ·a-ending
  // content word, must still be the elected verb — same behavior as before
  // this fix for the ordinary single-verb case.
  assert.ok(r.garo.includes('tusienga') || r.garo.includes('tu·si'), `verb must still resolve, got: ${r.garo}`);
});

test('item 3/5 regression guard: "did you see the two small dogs" — adjective ("small") now lands next to its noun', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('did you see the two small dogs');
  const words = r.garo.split(/\s+/);
  const smallIdx = words.indexOf('Chon·a');
  const dogIdx = words.indexOf('Achak');
  assert.ok(smallIdx !== -1 && dogIdx !== -1, `both "small" and "dog" must be present, got: ${r.garo}`);
  // Item 5's VERB_LEMMAS fix (below) additionally lets "see" be
  // correctly identified as the verb instead of "small" - so "small"
  // now keeps its original pre-noun position (small immediately BEFORE
  // dog, matching natural English adjective-noun order) rather than the
  // post-noun position from item 3's fix alone (which only had the
  // false-positive suffix signal to go on, with "small" wrongly elected
  // as the verb and appended after everything else).
  assert.equal(dogIdx, smallIdx + 1, `"small" must sit immediately before "dog", got: ${r.garo}`);
});

test('item 5 fix: "did you see the two small dogs" — "see" (bare-root Garo verb, no suffix) is now correctly identified as the finite verb, not stranded as a nonverb', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('did you see the two small dogs');
  const words = r.garo.split(/\s+/);
  assert.equal(words[words.length - 1], 'Nia', `"see" (Nia) must be the sentence-final verb per SOV, got: ${r.garo}`);
});

test('item 5 fix regression guard: VERB_LEMMAS is dictionary-derived, not guessed — a definitive lemma match anywhere in the sentence takes priority over an ambiguous suffix match elsewhere', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  // "carrying" (lemma-confirmed: "to carry" exists) must still win over
  // "tall" (only a suffix false-positive) even though "tall" precedes it.
  const r = await translate('the tall man is carrying four heavy boxes to the river');
  const words = r.garo.split(/\s+/);
  assert.equal(words[words.length - 1], 'gat·a', `"carrying" (gat·a) must be the sentence-final verb, got: ${r.garo}`);
});

// --- Item 2 fix (2026-08-23, Claude B, session migration doc): actually
// implemented this session — an earlier turn in this same session
// incorrectly reported it as already done/pushed when it had not been.
// parseCountingPhrase() previously had no way to separate an adjective
// from the noun in a [NUMBER][ADJ][NOUN] phrase, so "three long sticks"
// looked up the whole remainder ("long stick") as if it were a single
// (nonexistent) dictionary entry and fell through to the weaker
// sov-assembly fallback. See garo_classifier.js/translationEngine.js
// fix-site comments for the full no-dictionary-access-in-this-function
// reasoning.
test('item 2: "[NUMBER][ADJ][NOUN]" phrases now reach classifier composition instead of falling to sov-assembly', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('three long sticks');
  assert.equal(r.method, 'classifier', `expected classifier composition, got method: ${r.method}, garo: ${r.garo}`);
  assert.equal(r.confidence, 0.96);
});

test('item 2 regression guard: genuine multi-word noun entries ("sugar cane") are unaffected — they still resolve on the full-phrase lookup and never reach the adjective-stripping fallback', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('three sugar canes');
  assert.equal(r.method, 'classifier', `expected classifier composition via the existing full-phrase entry, got method: ${r.method}, garo: ${r.garo}`);
  assert.ok(r.garo.includes('grit'), `must use the dedicated "sugar cane" root, not a fallback to the last word alone, got: ${r.garo}`);
});

test('item 2 regression guard: plain [NUMBER][NOUN] phrases (no adjective) are unaffected', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('two sticks');
  assert.equal(r.method, 'classifier');
  assert.equal(r.confidence, 0.96);
});

// --- AI-002 fix (2026-08-25, Claude B, docs/CLAUDE_B_ENGINEERING_
// GOVERNANCE.md §4): analyzeGrammar's object-resolution fallback
// (grammarEngine.js, the block right after the "buy rice" special case)
// used to fall straight to lookupGaro(lastWord) alone once the full-
// phrase and counting-phrase lookups both failed. If an EARLIER word in
// a multi-word object phrase was the one that actually failed to
// resolve, and the LAST word happened to resolve on its own (e.g. a
// trailing time adverb), the resolved-but-unrelated last word was
// silently placed in the object slot with the object marker, and the
// true unresolved word disappeared with zero trace — worse than a
// plain drop, since no '[UNKNOWN]' string was ever produced, so this
// evaded the existing `result.includes('[UNKNOWN]')` safety check in
// sentenceBuilder.js entirely. Confirmed live pre-fix:
// "i bought a gadget yesterday" -> "Anga mejal·ko breaha" ("mejal" =
// "yesterday" wrongly took the object slot, "gadget" vanished).
//
// Fixture words used below, confirmed directly via lookupGaro():
// "dog" -> "Achak" (resolves), "yesterday" -> "Mejal" (resolves),
// "gadget"/"widget" -> null (do not resolve, not in any dictionary
// source). These are chosen purely for their known resolution status,
// not for grammatical naturalness.
test('AI-002: object-word resolution is tracked per-word, not by last-word-only fallback', () => {
  // (would ALL FAIL under the old lastWord-only fallback, which never
  // even inspected these words to begin with)

  // Case 1: all object words resolve individually — unaffected by the
  // fix, same as the pre-fix fallback (which also happened to be
  // correct here, since the one word it checked, the last, resolved).
  const allResolve = analyzeGrammar('i saw dog');
  assert.equal(allResolve.object.garo, 'Achak');
  assert.notEqual(allResolve.object.garo, '[UNKNOWN]');

  // Case 2: first word resolves, later (last) word fails — the old
  // fallback already produced '[UNKNOWN]' here too (it only ever
  // checked the last word), so this is a regression guard, not a new
  // fix, but must keep working under the new per-word check.
  const laterFails = analyzeGrammar('i bought a dog gadget');
  assert.equal(laterFails.object.garo, '[UNKNOWN]');

  // Case 3 — THE AI-002 BUG ITSELF: an earlier object word fails to
  // resolve, but the last word ("yesterday") resolves on its own. Under
  // the old code this silently shipped "Mejal" (yesterday's Garo value)
  // as if it were the translation of "gadget yesterday" as a whole —
  // this assertion is exactly what would have FAILED under the
  // pre-fix behavior (old value: 'Mejal', not '[UNKNOWN]').
  const earlierFails = analyzeGrammar('i bought a gadget yesterday');
  assert.equal(earlierFails.object.garo, '[UNKNOWN]',
    'an unresolved earlier word must not be silently replaced by an unrelated resolved later word');
  assert.notEqual(earlierFails.object.garo, 'Mejal',
    'the true unresolved word ("gadget") must not disappear in favor of "yesterday"/Mejal');

  // Case 4: multiple object words fail to resolve — must still surface
  // '[UNKNOWN]', not silently succeed or throw.
  const multipleFail = analyzeGrammar('i bought a gadget widget');
  assert.equal(multipleFail.object.garo, '[UNKNOWN]');

  // Case 5 (single-word object, resolves) / Case 6 (single-word object,
  // fails) — unaffected by the fix, same as before.
  assert.equal(analyzeGrammar('i saw dog').object.garo, 'Achak');
  assert.equal(analyzeGrammar('i saw gadget').object.garo, '[UNKNOWN]');
});

test('AI-002: end-to-end translate() no longer ships the wrong-substitution output for the confirmed live repro case', async () => {
  const result = await translate('i bought a gadget yesterday');
  // Pre-fix, this was 'Anga mejal·ko breaha' via method 'grammar-
  // assembly' — grammar-assembly incorrectly succeeded by mislabeling
  // "yesterday" as the object. Post-fix, grammar-assembly must
  // recognize the object as unresolved (see the unit-level test above)
  // and correctly decline (return null), so translate() falls through
  // to a different method rather than shipping the wrong substitution.
  assert.notEqual(result.garo, 'Anga mejal·ko breaha');
  assert.notEqual(result.method, 'grammar-assembly',
    'grammar-assembly must not silently succeed when a genuine object word is unresolved');
});

// --- AI-002 regression guard: verify the fix does not interfere with
// exact phrases, corrections, classifier composition, or already-
// working grammar-assembly object resolution (all paths that reach the
// same object-resolution code but must be structurally unaffected).
test('AI-002 regression guard: exact-phrase/corrections lookups still take precedence over the object-resolution fallback', async () => {
  // "good morning" is an exact corrections/phrase-map match, never
  // reaching analyzeGrammar's object loop at all.
  const result = await translate('good morning');
  assert.equal(result.garo, 'Pringnam.');
});

test('AI-002 regression guard: classifier composition for counted nouns is unaffected (fires before the per-word fallback is ever reached)', async () => {
  const result = await translate('two sticks');
  assert.equal(result.method, 'classifier');
});

test('AI-002 regression guard: "she has three children" classifier fix (2026-08-09) still applies — unaffected by the per-word fallback change', async () => {
  const result = await translate('she has three children');
  assert.equal(result.garo, 'Ua bi·sa sakgittam donga');
});

test('AI-002 regression guard: a fully-resolved multi-word object sentence still reaches grammar-assembly correctly', async () => {
  const result = await translate('i saw the dog');
  assert.equal(result.method, 'grammar-assembly');
  assert.ok(result.garo.toLowerCase().includes('achak'), `expected the resolved object "achak" to appear, got: ${result.garo}`);
});

// --- OOV/proper-noun sov-assembly fix (2026-08-29, Claude B, session
// migration). Root cause: assembleSentenceSOV's `pairs = content.map(...)
// .filter(p => p.garo)` step silently DROPPED any content word whose
// translation attempt returned null — most visibly, out-of-dictionary
// proper nouns (city/place names never added to master_dictionary.json,
// since Claude A's data work is ongoing and can never cover every real
// place name). Confirmed live pre-fix: translate("i live in guwahati")
// -> "Anga donga" (the destination silently vanished, no [UNKNOWN], no
// error, confidence still reported 0.75 as if nothing were missing) —
// same silent-drop shape already fixed once in assembleGrammar's own
// object/location handling (2026-07-29) and again in step 7 morphology
// (RC-CANDIDATE-034, 2026-07-31), but never in this function's own
// `pairs` step until now. Fix: every content word is kept in `pairs`
// (an unresolved lookup becomes an explicit '[UNKNOWN]' marker instead
// of being removed), and — mirroring assembleGrammar's own
// `result.includes('[UNKNOWN]')` bail precedent — assembleSentenceSOV
// now returns null when its own joined output would contain
// '[UNKNOWN]', letting translate()'s cascade fall through to step 7
// (morphology), which already knows how to surface '[UNKNOWN]' cleanly
// and reports the correspondingly lower, honest confidence (0.65)
// instead of sov-assembly's higher (0.75) confidence on an incomplete
// sentence. No linguistic data changed and no new Garo vocabulary
// invented — "guwahati" remains genuinely untranslated, now visibly so.
test('OOV proper noun: "i live in guwahati" no longer silently drops the destination', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('i live in guwahati');
  assert.ok(r.garo.includes('[UNKNOWN]'), `unresolved place name must be visibly signalled, got: ${r.garo}`);
  assert.notEqual(r.method, 'sov-assembly', 'sov-assembly must bail rather than confidently ship an incomplete sentence');
});

test('OOV proper noun: the resolved words in "i live in guwahati" are still present alongside the marker', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('i live in guwahati');
  assert.ok(r.garo.includes('donga'), `"live" must still resolve and appear, got: ${r.garo}`);
});

test('OOV proper noun regression guard: a place name already in the dictionary ("tura") is completely unaffected', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('i live in tura');
  assert.ok(!r.garo.includes('[UNKNOWN]'), `a genuinely resolved place name must not gain a spurious marker, got: ${r.garo}`);
  assert.equal(r.method, 'exact-phrase');
});

test('OOV proper noun regression guard: multiple different OOV city names all correctly surface the marker (not a single-word coincidence)', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  for (const city of ['guwahati', 'delhi', 'shillong']) {
    const r = await translate(`i live in ${city}`);
    assert.ok(r.garo.includes('[UNKNOWN]'), `expected [UNKNOWN] for "${city}", got: ${r.garo}`);
  }
});

test('OOV proper noun regression guard: a fully-resolved sentence with no unknown words is completely unaffected by the sov-assembly bail change', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('a big dog will not eat rice');
  assert.equal(r.method, 'sov-assembly');
  assert.ok(!r.garo.includes('[UNKNOWN]'), `got: ${r.garo}`);
});

// Side-fix, surfaced (not introduced) by the above: translationEngine.js's
// own step 7 (morphology) does its own independent ing$/ed$/s$/ly$
// stripping before dictionary lookup, with no PRONOUN_MAP collision guard
// — the exact RC-CANDIDATE-035 collision class already guarded in two
// other places (sentenceBuilder.js's own stripping, morphologyEngine.js's
// findVerbForm) but never in this third copy, since sov-assembly's own
// silent-drop bug always intercepted "she is using her phone" one
// cascade step earlier and this copy was never actually reached for that
// input before today.
test('morphology ing$-stripping pronoun-collision guard: "she is using her phone" must not leak "Chingna" now that it reaches step 7', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('she is using her phone');
  assert.ok(!r.garo.includes('Chingna'), `must not leak the "us" pronoun translation via ing$-stripping of "using", got: ${r.garo}`);
});

// Second side-fix, surfaced (not introduced) by the sov-assembly bail
// change: bare "not" was neither in STOP_WORDS nor AUXILIARY_SKIP (only
// the contraction forms — "dont", "wont", etc. — were), so it reached
// assembleSentenceSOV's own translation attempt, failed (negation is
// handled entirely via the isNegative flag, never as lexical content),
// and was silently dropped by the old filter — masking the fact that a
// negative-future sentence like "a big dog will not eat rice" depended
// on that silent drop to reach its correct output at all. Mirrors
// grammarEngine.js's own pre-existing identical guard (2026-07-29,
// "Negation-word guard" comment) in its object-extraction loop — same
// two words, not a new linguistic rule.
test('negation-word content-filter guard: "a big dog will not eat rice" still assembles the correct negative-future form', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('a big dog will not eat rice');
  assert.equal(r.garo, 'dal·a Achak Mi Cha·jawa');
  assert.equal(r.method, 'sov-assembly');
});

// 2026-08-30, Claude B — runtime silent-data-loss audit (docs/CLAUDE_B_
// SESSION_MIGRATION_20260830.md). Step 8 (compound-split) was a third,
// previously-unfixed copy of the exact silent-drop bug class already fixed
// in assembleSentenceSOV (sentenceBuilder.js) and step 7/morphology
// (translationEngine.js, prior session): `.map(lookupGaro).filter(Boolean)`
// deleted any word/sub-word whose lookup failed with zero trace, then
// still returned a confident (0.60) result built only from survivors. Live
// pre-fix repro: translate("well-known xyzcitynotreal") -> "chiakol"
// (compound-split, confidence 0.60) — the OOV word vanished entirely, no
// [UNKNOWN], no confidence penalty.
test('compound-split silent-drop fix: an OOV word alongside a resolvable one surfaces [UNKNOWN] instead of silently vanishing', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('well-known xyzcitynotreal');
  assert.ok(r.garo.includes('[UNKNOWN]'), `expected the unresolved word to surface as [UNKNOWN], got: ${JSON.stringify(r)}`);
  assert.equal(r.method, 'compound-split');
});

test('compound-split silent-drop fix: firing condition is unchanged — still requires at least one resolved word before returning this method at all', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  // Two genuinely unresolvable tokens: compound-split must not fire (0
  // survivors), leaving the cascade to fall through further (e.g. to
  // passthrough), exactly as before this fix — only the *content* of a
  // firing result changed (markers instead of silent deletion), not
  // when it fires.
  const r = await translate('xyznotarealword1-xyznotarealword2');
  assert.notEqual(r.method, 'compound-split',
    'compound-split must not fire when zero sub-words resolve, matching pre-fix behavior');
});

// 2026-08-30, Claude B — runtime silent-data-loss audit (docs/CLAUDE_B_
// SESSION_MIGRATION_20260830.md), fourth instance of the silent-drop bug
// class: grammarEngine.js's tryWithoutGijaConstruction ("without VERB-ing"
// idiom) silently erased a named-but-unresolved possessive object
// ("without doing her X" where X is OOV) via `.filter(Boolean)`, still
// returning a fully-confident (0.85) gija-construction result with the
// object simply gone — no [UNKNOWN], no confidence penalty. Live pre-fix
// repro: translate("he stayed without doing her xyzobjectwordnotreal") ->
// "Ua ka·gija dongaha" (gija-construction, 0.85), object vanished.
test('gija-construction silent-drop fix: an OOV possessive object makes the construction bail (return null) so the cascade falls through to a step that surfaces [UNKNOWN]', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he stayed without doing her xyzobjectwordnotreal');
  assert.notEqual(r.method, 'gija-construction',
    'must not confidently ship gija-construction with a silently-dropped object');
  assert.ok(r.garo.includes('[UNKNOWN]'), `expected the unresolved object to surface as [UNKNOWN] via cascade fallthrough, got: ${JSON.stringify(r)}`);
});

test('gija-construction silent-drop fix: a fully-resolved object is completely unaffected', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he stayed without doing her work');
  assert.equal(r.method, 'gija-construction');
  assert.equal(r.garo, 'Ua Dak·ako ka·gija dongaha');
});

test('gija-construction silent-drop fix: a construction with no object at all (legitimate grammatical omission, e.g. "without eating") is completely unaffected', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he stayed without eating');
  assert.equal(r.method, 'gija-construction');
  assert.ok(!r.garo.includes('[UNKNOWN]'), 'a construction with no object named at all must not spuriously show [UNKNOWN]');
});

// 2026-08-31, Claude B — go/re·ang- conjugation-stem decoupling fix (see
// docs/CLAUDE_A_SESSION_MIGRATION_20260830E.md for the original discovery
// and docs/CLAUDE_B_SESSION_MIGRATION_20260831.md-successor for the fix).
// Root cause: findVerbForm('go') was the single source both for the bare-
// form translation AND the stem every other tense suffixes onto. The bare
// form is 're·a' (VERIFIED/HIGH, NV-100) but the tense-suffixed forms all
// share a distinct, also-already-confirmed 'Re·ang' stem (went='re·anga',
// going='re·angenga', will go='re·anggen'). getConjugationRoot() in
// morphologyEngine.js (backed by conjugation_roots.json) now decouples the
// two; phrase_maps.js['go'] was mechanically resynced to 're·a' via
// scripts/resync-stale-overrides.mjs --apply once the decoupling made that
// safe. These tests pin the full affected surface so the two can never
// silently recouple.
test('go/re·ang- decoupling: bare "go" uses the correct VERIFIED "re·a" root, not the "went"-family stem', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('go');
  assert.equal(r.garo, 're·a');
});

test('go/re·ang- decoupling: "going" (present continuous, sov-assembly verb synthesis) still uses the re·ang- stem', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('i am going to school');
  assert.equal(r.garo, 'Anga skulchi re·angenga');
});

test('go/re·ang- decoupling: "will go" (affirmative future) still uses the re·ang- stem, not the resynced bare "re·a" root', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('she will go');
  assert.equal(r.garo, 'Ua Re·anggen');
});

test('go/re·ang- decoupling: "went" (past, IRREGULAR_VERBS entry via corrections.json exact-phrase) is unaffected', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('yesterday i went to the market');
  assert.equal(r.garo, 'Mijalde bajalchi re·anga');
});

test('go/re·ang- decoupling: "did not go" (negative past, grammar-assembly) still uses the re·ang- stem for negation, not the resynced bare "re·a" root', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r1 = await translate('he did not go');
  assert.equal(r1.garo, 'Ua Re·angja');
  const r2 = await translate('i did not go');
  assert.equal(r2.garo, 'Anga Re·angja');
});

test('go/re·ang- decoupling: "will not go" (negative future, RULE-030) is unaffected — still the bare "re·a" root directly, not the re·ang- stem', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r1 = await translate('he will not go');
  assert.equal(r1.garo, 'Ua re·jawa');
  const r2 = await translate('they will not go');
  assert.equal(r2.garo, 'Uamang re·jawa');
});

test('go/re·ang- decoupling: getConjugationRoot is a no-op for every verb not in conjugation_roots.json (control case, "did not eat" unaffected)', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he did not eat');
  assert.equal(r.garo, 'Ua Cha·ja');
});

// ── Negative-future-continuous fix (2026-08-31B) ──────────────────────────
// Confirmed native evidence: re·jawa = "will not go"; re·angjawa = "will
// not be going" — two distinct forms that must never collapse into one.
// See docs/CLAUDE_B_SESSION_MIGRATION_20260831C.md for the full root-cause
// trace (AUXILIARY_SKIP unconditionally discarding "going" as a lexical
// verb, plus the bare-noun-negation fallback wrongly firing on the bare
// subject once no verb survived at all — live repro was
// translate("he will not be going") -> "Ihing Ua").

test('negative-future-continuous: "will not be going" renders the confirmed re·angjawa form (grammar-assembly), distinct from plain "will not go"', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he will not be going');
  assert.equal(r.garo, 'Ua Re·angjawa');
  assert.equal(r.method, 'grammar-assembly');
});

test('negative-future-continuous: subject variations all resolve to the same re·angjawa stem', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const rShe = await translate('she will not be going');
  assert.equal(rShe.garo, 'Ua Re·angjawa');
  const rI = await translate('i will not be going');
  assert.equal(rI.garo, 'Anga Re·angjawa');
  const rThey = await translate('they will not be going');
  assert.equal(rThey.garo, 'Uamang Re·angjawa');
});

test('negative-future-continuous: plain "will not go" (RULE-030, re·jawa) is unaffected by the re·angjawa fix — the two forms stay distinct', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r1 = await translate('he will not go');
  assert.equal(r1.garo, 'Ua re·jawa');
  const r2 = await translate('she will not go');
  assert.equal(r2.garo, 'Ua re·jawa');
});

test('negative-future-continuous: "going" is not incorrectly discarded as a bare finite verb — "he is going" now resolves to the already-VERIFIED re·angenga stem instead of losing the verb entirely', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he is going');
  assert.equal(r.garo, 'Ua re·angenga');
});

test('negative-future-continuous: "going to <infinitive verb>" (intention marker) is unaffected — "going" is still correctly skipped as a pure auxiliary, not misread as the finite verb', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r1 = await translate('he is going to eat');
  assert.equal(r1.garo, 'Ua cha·na');
  const r2 = await translate('i am going to school');
  assert.equal(r2.garo, 'Anga skulchi re·angenga');
});

test('negative-future-continuous: the bare-noun-negation fallback (meant for "not rice"/"not water") cannot capture this construction — output comes from grammar-assembly, never the sov-assembly fallback that produced "Ihing Ua"', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he will not be going');
  assert.notEqual(r.method, 'sov-assembly');
  assert.ok(!r.garo.includes('Ihing'));
});

// ── NV-103 "only X SUBJ VERB is Y" identity/restrictive construction ──────
// (2026-09-01, Claude B — docs/CLAUDE_B_SESSION_MIGRATION_20260901.md).
// Native evidence (single attestation): "the only language i speak is
// english" -> "Angade English ku·sikkosan aganaia." Confirmed pre-fix bug:
// translate() shipped "mangmang ba·sa Anga to be / to exist Agana" via
// sov-assembly (free-standing "only", wrong word order, no verb ending).
// This handler generalizes the attested morphemes (-de topic suffix, -ko
// object marker, -san bound "only", -aia declarative ending) to the whole
// "the only X SUBJ VERB is Y" pattern, not just the one cited sentence.

test('NV-103 only-identity: general mechanism — topic suffix, bound object+only, SOV order, and declarative ending are all present, using clean object/noun words unaffected by any other known data defect', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  // NOTE: this test previously used "the only fruit i eat is mango" as its
  // example. That sentence now has direct native evidence (NV-112,
  // 2026-09-02) contradicting NV-103's general pattern for this specific
  // case, and is shipped as an exact-match override instead (see the
  // dedicated NV-112 test below) — so it no longer exercises the general
  // mechanism and was swapped for a different, still-unquestioned example.
  const r = await translate('the only game they play is football');
  assert.equal(r.method, 'only-identity-construction');
  assert.equal(r.garo, 'Uamangde Football Kal·anikosan Kal·aia');
  // topic suffix on subject
  assert.ok(r.garo.startsWith('Uamangde '));
  // bound object+only as ONE unit (not the free-standing "mangmang")
  assert.ok(r.garo.includes('Kal·anikosan'));
  assert.ok(!r.garo.includes('mangmang'));
  // verb carries the -aia declarative ending, not a bare root
  assert.ok(r.garo.endsWith('aia'));
});

// NV-112 (2026-09-02, Claude B — native sign-off received this session,
// docs/CLAUDE_B_SESSION_MIGRATION_20260902F.md). Second attestation for
// NV-103's "the only X SUBJ VERB is Y" shape CONTRADICTS the general
// pattern for this exact sentence — native evidence gives a structurally
// different rendering (relativizer -gipa + zero-copula, not bare SVO+aia).
// Shipped as an exact-match override, not a change to the general pattern
// (which the test above confirms is still intact for its own attestation).
test('NV-112 only-identity: exact-match override for "the only fruit i eat is mango" — contradicts NV-103\'s general pattern, ships the verified native form directly', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('the only fruit i eat is mango');
  assert.equal(r.method, 'only-identity-construction');
  assert.equal(r.garo, 'Angni cha\u00b7gipa bitede te\u00b7gatchusan');
});

test('NV-103 only-identity: generalizes across subject pronouns, not just "i"', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const rYou = await translate('the only book you read is bible');
  assert.equal(rYou.garo, 'Na·ade Sastro Ki·tapkosan po·ri·aia');
  const rThey = await translate('the only game they play is football');
  assert.equal(rThey.garo, 'Uamangde Football Kal·anikosan Kal·aia');
});

test('NV-103 only-identity: the exact NV-103 cited sentence now routes through the construction (not sov-assembly) — the topic/order/bound-object/verb-ending composition bug is fixed; the object slot for "english" specifically still surfaces a SEPARATE, previously-undocumented data defect (garo_dictionary.json has 7 unrelated rows keyed bare "english") that is out of this fix\'s scope and flagged separately, not silently patched', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('the only language i speak is english');
  assert.equal(r.method, 'only-identity-construction');
  assert.ok(r.garo.startsWith('Angade '));
  assert.ok(r.garo.includes('ba·sakosan'));
  assert.ok(r.garo.endsWith('Aganaia'));
  assert.ok(!r.garo.includes('mangmang'));
});

test('NV-103 only-identity: unresolved object noun falls back to a capitalized loanword pass-through rather than bailing the whole construction (matches the native "English" stays "English" pattern)', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('the only language i speak is klingon');
  assert.equal(r.method, 'only-identity-construction');
  assert.ok(r.garo.includes('Klingon'));
});

// NV-112 (2026-09-02, Claude B — native sign-off received this session,
// docs/CLAUDE_B_SESSION_MIGRATION_20260902F.md): "i am the only student" now
// HAS native evidence and DOES route through only-identity-construction
// (previously it did not — the pattern below supersedes the old "does not
// fire" assertion, which predates this evidence). "Angan saksa kamkam
// chatro" is a zero-copula nominal predicate, structurally distinct from
// NV-103's pattern (no -aia ending, no topic-de, uses bound "kamkam" as an
// alternate to "mangmang") — narrowly attested for subject "I" only.
test('NV-112 only-identity: "i am the only student" now resolves via the construction with native-attested form (was previously unhandled/no evidence)', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('i am the only student');
  assert.equal(r.method, 'only-identity-construction');
  assert.equal(r.garo, 'Angan saksa kamkam Chattro');
  assert.ok(!r.garo.includes('mangmang'));
});

test('NV-112 only-identity: "i am the only X" is narrowly scoped to subject "I" — does not fire for other subjects (no native evidence for those yet)', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('he is the only teacher');
  assert.notEqual(r.method, 'only-identity-construction');
});

test('NV-112 only-identity: "i am the only X" falls through cleanly (no crash, no guessed output) when the noun has no dictionary entry', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate('i am the only zorblax');
  assert.notEqual(r.method, 'only-identity-construction');
});

// ── NV-103 item 5: exact-phrase apostrophe-lookup fix ─────────────────────
// (2026-09-01, Claude B). Third recurrence of the apostrophe-stripped-only
// lookup bug in this same cascade (corrections.json and phrase_maps.js
// were already fixed for this; the exact-phrase/compiled_dict.json step
// had not been). Confirmed live: compiled_dict.json holds an exact key
// "i don't know garo" -> "Angade Garo man·ja." but translate() shipped a
// different grammar-assembly result because the stripped lookup key
// "i dont know garo" isn't in the dict.

test("NV-103 item 5: i don't know garo now resolves via exact-phrase, matching its compiled_dict.json entry, instead of falling through to grammar-assembly", async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const r = await translate("i don't know garo");
  assert.equal(r.method, 'exact-phrase');
  assert.equal(r.garo, 'Angade Garo man·ja.');
});

test('NV-103 item 5: existing apostrophe-preserving paths (corrections, phrase-map) are unaffected by the exact-phrase fix', async () => {
  const { translate } = await import('../../src/translationEngine.js');
  const rPhraseMap = await translate("i don't know");
  assert.equal(rPhraseMap.method, 'phrase-map');
  assert.equal(rPhraseMap.garo, 'Anga uija');
  const rCorrection = await translate("let's go");
  assert.equal(rCorrection.method, 'correction');
  assert.equal(rCorrection.garo, 'Hai re·naha');
});

// ── Finding 1 fix: sov-assembly go/re·ang- stem-decoupling ─────────────────
// (2026-09-02, Claude B — see docs/CLAUDE_B_TRACE_FINDING1_20260902.md for
// the full root-cause trace). Root cause: subjectless sentences (no
// pronoun, no a/an/the NP) skip analyzeGrammar's subject-gated verb-finding
// block entirely and fall through to assembleSentenceSOV, a second,
// independent verb-resolution path that had no knowledge of the
// conjugation_roots.json stem-decoupling table grammarEngine.js already
// uses (grammarEngine.js:401/422) — so it resolved "go" via the bare
// dictionary root ('re·a') and negated THAT, producing malformed
// 're·ja' instead of 'Re·angja'. Fix: route the elected verb through the
// same getConjugationRoot() call, in sentenceBuilder.js, before tense/
// negation suffixing. No new table, no go-specific special case — reuses
// the existing mechanism, so it's a no-op for every verb without a
// conjugation_roots.json entry (confirmed below via 'eat').
test('Finding 1: subjectless "did not go" now resolves the Re·ang- conjugation stem via sov-assembly, not the bare re·a root', async () => {
  const r = await translate('did not go');
  assert.equal(r.method, 'sov-assembly');
  assert.equal(r.garo, 'Re·angja');
});

test('Finding 1 regression guard: "will not go" is unaffected (already correct via the higher-priority corrections.json cascade step, never reaches sov-assembly)', async () => {
  const r = await translate('will not go');
  assert.equal(r.method, 'correction');
  assert.equal(r.garo, 're·jawa');
});

test('Finding 1 regression guard: "will not be going" is unaffected (already correct via the higher-priority exact-phrase cascade step, never reaches sov-assembly)', async () => {
  const r = await translate('will not be going');
  assert.equal(r.method, 'exact-phrase');
  assert.equal(r.garo, 're·angjawa');
});

test('Finding 1 regression guard: bare "go" is unaffected — still resolves to the bare re·a root via phrase-map, not the conjugation stem', async () => {
  const r = await translate('go');
  assert.equal(r.method, 'phrase-map');
  assert.equal(r.garo, 're·a');
});

test('Finding 1 regression guard: getConjugationRoot is a no-op for verbs with no conjugation_roots.json entry — "did not eat" (sov-assembly) is byte-identical before/after the fix', async () => {
  const r = await translate('did not eat');
  assert.equal(r.method, 'sov-assembly');
  assert.equal(r.garo, 'Cha·ja');
});

test('Finding 1 regression guard: subject-bearing "he did not go" is unaffected — was already correct via grammar-assembly (grammarEngine.js:422), which has its own, separate getConjugationRoot call untouched by this fix', async () => {
  const r = await translate('he did not go');
  assert.equal(r.method, 'grammar-assembly');
  assert.equal(r.garo, 'Ua Re·angja');
});

// NV-115 (2026-09-03, Claude B). Confirmed loanwords with no Garo
// equivalent were being mis-"translated" by fuzzy match matching them to
// unrelated dictionary entries within edit-distance 1-2 (momo->moo,
// chow->cow, maggie->magic, paneer/panner->anger). Fixed with an
// exact-match loanword list checked before fuzzy match.
test('NV-115 loanword passthrough: "momo" no longer fuzzy-matches to "moo" (im·bo·a)', async () => {
  const r = await translate('momo');
  assert.equal(r.method, 'loanword-passthrough');
  assert.equal(r.garo, 'Momo');
});

test('NV-115 loanword passthrough: "chow" no longer fuzzy-matches to "cow" (ma·su)', async () => {
  const r = await translate('chow');
  assert.equal(r.method, 'loanword-passthrough');
  assert.equal(r.garo, 'Chow');
});

test('NV-115 loanword passthrough: "maggie" no longer fuzzy-matches to "magic" (ban·a)', async () => {
  const r = await translate('maggie');
  assert.equal(r.method, 'loanword-passthrough');
  assert.equal(r.garo, 'Maggie');
});

test('NV-115 loanword passthrough: "paneer" and "panner" no longer fuzzy-match to "anger" (Ka·o nanga)', async () => {
  const paneer = await translate('paneer');
  const panner = await translate('panner');
  assert.equal(paneer.method, 'loanword-passthrough');
  assert.equal(paneer.garo, 'Paneer');
  assert.equal(panner.method, 'loanword-passthrough');
  assert.equal(panner.garo, 'Panner');
});

test('NV-115 loanword passthrough: multi-word "paneer butter masala" / "panner butter masala" pass through cleanly, Title Case, no [UNKNOWN] tag', async () => {
  const r1 = await translate('paneer butter masala');
  const r2 = await translate('panner butter masala');
  assert.equal(r1.method, 'loanword-passthrough');
  assert.equal(r1.garo, 'Paneer Butter Masala');
  assert.equal(r2.method, 'loanword-passthrough');
  assert.equal(r2.garo, 'Panner Butter Masala');
});

test('NV-115 loanword passthrough: case-insensitive match ("MOMO", "Chow")', async () => {
  const r1 = await translate('MOMO');
  const r2 = await translate('Chow');
  assert.equal(r1.garo, 'Momo');
  assert.equal(r2.garo, 'Chow');
});

test('NV-116 loanword passthrough: bare "roll" now means the fast-food roll, promoted ahead of the pre-existing exact-phrase dictionary entry (Romroma)', async () => {
  const r = await translate('roll');
  assert.equal(r.method, 'loanword-passthrough');
  assert.equal(r.garo, 'Roll');
});

test('NV-116 regression guard: "to roll" (verb sense, two words) is untouched and still resolves via its own separate dictionary entry', async () => {
  const r = await translate('to roll');
  assert.equal(r.method, 'exact-phrase');
  assert.equal(r.garo, 'A\u00b7dubeko romroma');
});

// NV-118 (2026-09-03, Claude B). NV-115/116's loanword check only ever
// matched the FULL cleaned input string, so a confirmed loanword embedded
// inside a longer sentence still fell through every other lookupGaro()
// call site to a literal '[UNKNOWN]' — e.g. translate("i want to eat
// momo") shipped "Anga ska ·na Cha·a [UNKNOWN]" even though translate(
// "momo") alone worked. Fixed by adding the single-word subset of the
// loanword list as a fallback inside lookupGaro() itself (lookupEngine.js),
// the shared choke point every one of those call sites already routes
// through.
test('NV-118 embedded loanword: "i want to eat momo" resolves momo instead of shipping a literal [UNKNOWN] marker', async () => {
  const r = await translate('i want to eat momo');
  assert.ok(!r.garo.includes('[UNKNOWN]'));
  assert.ok(/momo/i.test(r.garo));
});

test('NV-118 embedded loanword: works for other single-word confirmed loanwords too ("chow")', async () => {
  const r = await translate('i want to eat chow');
  assert.ok(!r.garo.includes('[UNKNOWN]'));
  assert.ok(/chow/i.test(r.garo));
});

test('NV-118 regression guard: multi-word loanword phrases are NOT added to lookupGaro\'s single-word fallback (would be dead weight — lookupGaro only ever receives one word at a time)', async () => {
  const { lookupGaro } = await import('../../src/lookupEngine.js');
  assert.equal(lookupGaro('paneer butter masala'), null);
});

// NV-119 (2026-09-03, Claude B). Modal "can" (ama/man·a) — Claude A's
// 2026-09-03 handoff Finding 1, reconfirmed general (not first-person-
// scoped): "can" was silently dropped with no record it was ever
// present. Fixed for the 4 verbs with direct native evidence.
test('NV-119 modal-can: "she can eat" (third-person subject, no exact-phrase citation) now includes the modal, was silently dropping it entirely', async () => {
  const r = await translate('she can eat');
  assert.equal(r.method, 'modal-can-construction');
  assert.equal(r.garo, 'Ua cha\u00b7na man\u00b7a');
});

test('NV-119 modal-can: "he can work" uses the native-cited "kam ka·na" form, not purpose_map.json\'s different "dakna"', async () => {
  const r = await translate('he can work');
  assert.equal(r.method, 'modal-can-construction');
  assert.equal(r.garo, 'Ua kam ka\u00b7na man\u00b7a');
});

test('NV-119 modal-can: "they can speak garo" keeps "Garo" as itself, not the unrelated compiled_dict.json "garo"->"Rong" entry', async () => {
  const r = await translate('they can speak garo');
  assert.equal(r.method, 'modal-can-construction');
  assert.equal(r.garo, 'Uamang Garo aganna man\u00b7a');
});

test('NV-119 regression guard: existing first-person exact-phrase citations are untouched (still route via correction, not the new construction)', async () => {
  const r1 = await translate('i can eat');
  const r2 = await translate('i can speak garo');
  assert.equal(r1.method, 'exact-phrase');
  assert.equal(r1.garo, 'Anga cha\u00b7na man\u00b7a');
  assert.equal(r2.method, 'exact-phrase');
  assert.equal(r2.garo, 'Anga Garo aganna man\u00b7a');
});

test('NV-119 regression guard: verbs with no native evidence in modal_can_map.json still fall through untouched (documented limitation, not silently guessed)', async () => {
  const r = await translate('she can sing');
  assert.notEqual(r.method, 'modal-can-construction');
});

test('NV-119 regression guard: "can\'t"/"cannot" (no native evidence for negative modal shape) do not fire this construction', async () => {
  const r = await translate('she cannot eat');
  assert.notEqual(r.method, 'modal-can-construction');
});

test('NV-119 regression guard: an object on an intransitive-in-this-construction verb ("he can eat rice") is unattested and does not fire', async () => {
  const r = await translate('he can eat rice');
  assert.notEqual(r.method, 'modal-can-construction');
});

// NV-120 (2026-09-03, Claude B). "-ma" polar question — Claude A's
// 2026-09-03 handoff Finding 2. Narrowly generalizes ONE of two
// structurally-different existing citations along its one attested
// dimension (subject pronoun) — see grammarEngine.js's
// tryPolarQuestionLunchConstruction for why the two citations are not
// unified.
test('NV-120 polar-question: "did she have lunch?" (pronoun swap, no exact-phrase citation) now resolves instead of the previous "donga"-injection word-salad', async () => {
  const r = await translate('did she have lunch?');
  assert.equal(r.method, 'polar-question-construction');
  assert.equal(r.garo, 'Ua mi cha\u00b7jokma?');
});

test('NV-120 regression guard: both existing exact-phrase citations are untouched and still structurally different from each other', async () => {
  const r1 = await translate('did you have lunch?');
  const r2 = await translate('have you eaten lunch?');
  assert.equal(r1.method, 'correction');
  assert.equal(r1.garo, 'Na\u00b7a mi cha\u00b7jokma?');
  assert.equal(r2.method, 'correction');
  assert.equal(r2.garo, 'Mipringde cha\u00b7ahama?');
});

test('NV-120 regression guard: the possessive variant ("have you eaten your lunch?") is unattested territory and is deliberately NOT fixed — still falls through to the pre-existing broken sov-assembly path rather than being guessed', async () => {
  const r = await translate('have you eaten your lunch?');
  assert.notEqual(r.method, 'polar-question-construction');
});
