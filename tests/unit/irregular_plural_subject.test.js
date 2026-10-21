import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// 2026-10-19 (Claude B). PO rule 1 (2026-10-18): Garo has no irregular
// plurals; English irregulars (people, men, women) are NOT mapped to special
// Garo words, the untouched root takes the universal -rang:
// mande -> manderang, Me·asa -> Me·asarang, Me·chik -> Me·chikrang.
// Applies to the subject slot via the noun-subject clause path. Counted
// (two people) is Formula B and unaffected; a dictionary row that already
// holds a lexicalized plural (children -> Bi·sarang) is kept as is.

const GENERATED = [
  ['people eat rice', 'Manderang miko Cha·a'],
  ['men eat rice', 'Me·asarang miko Cha·a'],
  ['women drink water', 'Me·chikrang chiko Ringa'],
  ['people are here', 'Manderang Iano'],
  ['the men are here', 'Me·asarang Iano'],
];
for (const [en, garo] of GENERATED) {
  test(`irregular plural subject: "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}

const UNCHANGED = [
  ['children drink water', 'Bi·sarang chiko Ringa'], // lexicalized row kept
  ['two people eat rice', 'Mande sakgni miko Cha·a'],   // counted: Formula B
  ['person eats rice', 'Mande miko Cha·a'],             // singular
  ['people', 'mande'],                                   // bare plural headword: no ruling
];
for (const [en, garo] of UNCHANGED) {
  test(`irregular plural guard: "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}
