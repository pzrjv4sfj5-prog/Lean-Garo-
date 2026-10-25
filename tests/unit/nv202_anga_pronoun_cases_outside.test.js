// NV-202 (2026-10-25, Project Owner decisions, AI-formatted relay, no raw native quote):
// Anga is always `Anga`; uamang/bisong synonyms + case suffixes; uan emphatic; a·pal / a·palo / a·palni.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import master from '../../master_dictionary.json' with { type: 'json' };

const cases = [
  ['What should I do?', 'Anga maiko dakgen?'],
  ['I am fine', 'Anga namenga'],
  ['they', 'Uamang'],
  ['them', 'uamangko'],
  ['their', 'uamangni'],
  ['to them', 'uamangna'],
  ['by them', 'uamangchi'],
  ['I see them', 'Anga uamangko Nika'],
  ['I gave it to them', 'Anga uamangna on·aha'],
  ['give it to them', 'uamangna on·a'],
  ['their house', 'Uamangni nok'],
  ['their mountain', 'Uamangni ha·bri'],
  ['It is he', 'uan'],
  ['It is she', 'uan'],
  ['outside', 'A·pal'],
  ['outdoors', 'a·palo'],
  ['outward', 'a·palni'],
];
for (const [en, garo] of cases) {
  test(`NV-202: ${en}`, async () => {
    assert.equal((await translate(en)).garo, garo);
  });
}
test('NV-202: no `Ang·a` pronoun remains (only the two superseded bake/roast verb rows)', () => {
  const left = master.filter(r => /\bAng[·.'’]a\b/i.test(r.garo || '') && !/bake \/ roast/i.test(r.english));
  assert.deepEqual(left.map(r => r.garo), []);
});
test('NV-202: new pronoun forms are tagged pr.', () => {
  for (const g of ['uamangko', 'uamangni', 'uamangna', 'uamangchi', 'uan', 'bisong']) {
    const rows = master.filter(r => (r.garo || '').toLowerCase() === g && r.confidence === 'verified_high');
    assert.ok(rows.length > 0 && rows.every(r => r.pos === 'pr.'), g);
  }
  assert.ok(master.some(r => r.garo === 'Uamang' && r.pos === 'pr.'));
});
