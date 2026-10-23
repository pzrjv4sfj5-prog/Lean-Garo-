// NV-187 (Project Owner-relayed, 2026-10-22): "give water" / "may I sit" pins.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

for (const [en, garo] of [
  ['Can you give me water?', 'Angna chi on·na man·genma?'],
  ['May I sit?', 'Anga asongna man·genma?'],
  ['May I sit down?', 'Anga asongna man·genma?'],
]) {
  test(`NV-187: ${en}`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}
test('NV-187: sit and sit down share the stem asong', async () => {
  const a = (await translate('sit')).garo.toLowerCase();
  const b = (await translate('sit down')).garo.toLowerCase();
  assert.ok(a.startsWith('asong') && b.startsWith('asong'));
});
