// NV-189 (Project Owner-relayed, 2026-10-23) + NV-188 drop of asongboma.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

for (const [en, garo] of [
  ['Yes, of course.', 'Oe, man·genba.'],
  ['Can you lift the box?', 'Na·a boxko de·na man·genma?'],
  ['May I sit down?', 'Anga asongna man·genma?'],
  ['Can you give me water?', 'Angna chi on·na man·genma?'],
  ['Do you love me?', 'Na·a angna ka·saama?'],
  ['Yes, I love you.', 'Oe, anga nang·na ka·saa.'],
]) {
  test(`NV-189: ${en}`, async () => {
    assert.equal((await translate(en)).garo, garo);
  });
}
test('NV-188: asongboma not produced for may I sit', async () => {
  for (const en of ['May I sit?', 'May I sit down?']) {
    assert.ok(!/asongboma/i.test((await translate(en)).garo));
  }
});
