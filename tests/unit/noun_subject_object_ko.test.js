import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// 2026-10-19 (Claude B). Noun-subject sentences used to fall to the weaker
// sov-assembly fallback, which has no object -ko and misordered some
// sentences ("my cats drink water" -> "... ringa chi", object after verb).
// Now the clause is translated with a pronoun placeholder through the
// verified grammar-assembly path (object -ko, tense, negation) and the
// subject noun phrase replaces the pronoun. Plural subjects keep -rang
// (Formula A); counted subjects are handled elsewhere (Formula B).

const IMPROVED = [
  ['cats eat rice', 'Menggorang miko cha·a'],
  ['cats will eat rice', 'Menggorang miko cha·gen'],
  ['cats did not eat rice', 'Menggorang miko cha·ja'],
  ['the dog eats rice', 'Achak miko cha·a'],
  ['my cats drink water', 'Angni menggorang chiko ringa'],
  ['cats see dogs', 'Menggorang achakrangko nika'],
];
for (const [en, garo] of IMPROVED) {
  test(`noun subject gets object -ko: "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}

// Must be exactly as before.
const UNCHANGED = [
  ['cats sleep', 'Menggorang tusia'],             // intransitive: no object, nothing to add
  ['dogs run', 'Achakrang kata'],
  ['dogs eat rice', 'Achakrang miko cha·a'],     // native-confirmed correction row
  ['two dogs eat rice', 'Achak manggni miko cha·a'], // counted: Formula B
  ['he eats rice', 'Ua miko cha·a'],
  ['children eat rice', 'Bi·sarang miko cha·a'],  // lexicalized plural kept, now with -ko
  ['dogs', 'Achak'],
  ['two red apples', 'apple ronggni'],
];
for (const [en, garo] of UNCHANGED) {
  test(`noun-subject guard: "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}
