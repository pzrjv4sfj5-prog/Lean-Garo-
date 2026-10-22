// NV-183 (Project Owner-provided, 2026-10-21): nine exact-phrase pins; vocabulary rows.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

const cases = [
  ['How did you write?', 'Na·a maidake seata?'],
  ['He slept the whole night.', 'Bia walgimik tuaha.'],
  ['In which room did you sleep?', 'Na·a badia room o tusia?'],
  ['He wrote well in the exam.', 'Bia porikka namen seataha.'],
  ['Can you write the exam?', 'Na·a porikka sena man·genma?'],
  ['What is written in the letter?', 'Chitthio mai sea dongachim?'],
  ['How did you drive?', 'Na·a maidake sala?'],
  ['Why do you drive the car?', 'Na·a maina gariko sala?'],
  ['Why did she pay the money?', 'Bia maina tangkako gama?'],
];
for (const [en, garo] of cases) {
  test(`NV-183: ${en}`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}
for (const [en, garo] of [['to drive', 'sala'], ['to pay', 'gama'], ['pull', 'sala']]) {
  test(`NV-183 vocab: ${en}`, async () => {
    const r = await translate(en);
    assert.equal(r.garo.toLowerCase(), garo);
  });
}
// NV-184 (2026-10-21): raka audit
test('NV-184: can you help me uses man·genma', async () => {
  const r = await translate('Can you help me');
  assert.equal(r.garo, 'Na·a angna dakchakna man·genma?');
});
