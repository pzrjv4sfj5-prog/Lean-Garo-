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
  ['cats eat rice', 'Menggorang mi·ko Cha·a'],
  ['cats will eat rice', 'Menggorang mi·ko Cha·gen'],
  ['cats did not eat rice', 'Menggorang mi·ko Cha·ja'],
  ['the dog eats rice', 'Achak mi·ko Cha·a'],
  ['my cats drink water', 'Angni menggorang chi·ko Ringa'],
  ['cats see dogs', 'Menggorang achakrang·ko Nika'],
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
  ['dogs eat rice', 'Achakrang mi·ko cha·a'],     // native-confirmed correction row
  ['two dogs eat rice', 'Achak mang·gni mi·ko Cha·a'], // counted: Formula B
  ['he eats rice', 'Ua mi·ko Cha·a'],
  ['children eat rice', 'Bi·sarang mi·ko Cha·a'],  // lexicalized plural kept, now with -ko
  ['dogs', 'Achak'],
  ['two red apples', 'apple ronggni'],
];
for (const [en, garo] of UNCHANGED) {
  test(`noun-subject guard: "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}
