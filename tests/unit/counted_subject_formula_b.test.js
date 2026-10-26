import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// 2026-10-18 (Claude B). Formula B: a counted subject inside a sentence is
// [untouched root noun] + [classifier + number], adjacent, in subject
// position; -rang is NEVER combined with a specific count. Classifiers:
// mang- animals, sak- humans, ge-/other noun-specific for objects.
// Source: PO-provided rules 2026-10-18 (Thangseng-confirmed -rang; counting
// scenarios), Claude A cited data `achak manggni`. Before this change,
// "two dogs eat rice" gave "achakrang miko chaa gegni" and
// "two people eat rice" gave "mi gegni" (subject dropped).

const COUNTED = [
  ['two dogs eat rice', 'Achak manggni miko Cha·a'],
  ['one dog eats rice', 'Achak mangsa miko Cha·a'],
  ['two people eat rice', 'Mande sakgni miko Cha·a'],
  ['two books are heavy', 'Ki·tap king·gni jria'],
  ['three birds sleep', 'Do·o manggittam Tusia'],
  ['today two dogs eat rice', 'Da·alo achak manggni miko Cha·a'] // RULE-053 2026-10-20: time word takes -o,
];
for (const [en, garo] of COUNTED) {
  test(`counted subject (Formula B): "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
    assert.ok(!/rang/i.test(r.garo), 'no -rang alongside a specific count');
    assert.doesNotMatch(r.garo, / ge·?gni$| gegni$/, 'count must sit next to the noun, not at sentence end');
  });
}

// Must not change.
const UNCHANGED = [
  ['two dogs', 'achak manggni'],
  ['three sugar cane', 'grit ge·gittam'],           // multi-word dictionary noun whose tail is also a verb lemma
  ['three sugar canes', 'grit ge·gittam'],
  ['2 dogs', 'achak manggni'],
  ['two red apples', 'apple ronggni'],
  ['two kg of rice', 'merong kg gni'],
  ['two cups of tea', 'cha ge·gni'],
  ['i see two dogs', 'Anga achak manggniko Nika'],
  ['dogs eat rice', 'Achakrang miko cha·a'],
];
for (const [en, garo] of UNCHANGED) {
  test(`counting guard unchanged: "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}
