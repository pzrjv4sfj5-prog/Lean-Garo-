import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// 2026-10-18 (Claude B). Subject-position -rang plural generation in the
// noun-subject fallback (assembleSentenceSOV). Authority: Claude A ruling
// docs/CLAUDE_A_RANG_SUBJECT_BARE_RULING_20261018.md (Thangseng relay
// 2026-09-30 Q2 "-rang can be added to any countable nouns to make it
// plural"; Thangseng 2026-10-18 "Achakrang miko cha.a." = dogs eat rice).
// Counting and plural are DIFFERENT: numerals go through the classifier path
// and are never touched here; bare standalone plurals are never touched.

const GENERATED = [
  ['cats eat rice', 'Menggorang miko Cha·a'],
  ['dogs sleep', 'Achakrang tusia'],
  ['pigs sleep', 'Wakrang tusia'],
  ['students run', 'Chattrorang kata'],
  ['cows are here', 'Matchurang iano'],
  ['the dogs came', 'Achakrang re·ba·aha'],
  ['my cats are heavy', 'Angni menggorang jria'],
  ['many dogs eat rice', 'Bang·a achakrang mi cha·a'],
];
for (const [en, garo] of GENERATED) {
  test(`subject -rang generated: "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}

// Must stay exactly as before (no -rang): lexicalized plurals, non-plural
// -s words, singular nouns, verbs ending in -s, bare plurals, counted nouns.
const UNCHANGED = [
  ['children eat rice', 'Bi·sarang miko Cha·a'],   // lexicalized plural
  ['friends came', 'cham·e re·ba·aha'],           // lexicalized plural
  ['news today', 'Gital da·alo'],                 // "news" is not plural "new"
  ['mother eats rice', 'A·ai miko Cha·a'],          // verb "eats" is not a plural noun
  ['his dog eats', 'Uni achak cha·a'],            // singular subject
  ['he eats rice', 'Ua miko Cha·a'],
  ['two dogs eat rice', 'Achak manggni miko Cha·a'], // counted: Formula B (see counted_subject_formula_b.test.js), never -rang
  ['people', 'mande'],                           // bare plural headword unchanged (irregular plurals in a clause are covered by irregular_plural_subject.test.js)
  ['my cats', 'Angni menggo'],                    // bare noun phrase, no predicate: not a sentence
  ['dogs', 'Achak'],                              // bare plural headword: no ruling, unchanged
  ['books', 'Ki·tap'],
];
for (const [en, garo] of UNCHANGED) {
  test(`subject -rang NOT applied: "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}
