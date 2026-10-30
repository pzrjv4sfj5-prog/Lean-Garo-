// NV-195 (Project Owner rulings, 2026-10-25, not native quotes):
// 1. Kinachaka is the canonical spelling. 2. `iano` stays bare with `donga`.
// 3. donga = to have / to exist / to lodge.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

const cases = [
  ['we stay here', 'An·ching iano donga'],
  ['Do you stay here?', 'Na·a iano dongama?'],
  ['I will stay here', 'Anga iano donggen.'],
  ['to have', 'donga'],
  ['to exist', 'donga'],
  ['to lodge', 'donga'],
  ['heed advice', 'Kinachaka'],
  ['to heed advice', 'Kinachaka'],
];
for (const [en, garo] of cases) {
  test(`NV-195: ${en}`, async () => {
    assert.equal((await translate(en)).garo, garo);
  });
}
test('NV-195: bare iano is scoped to donga (other verbs keep default -ko)', async () => {
  // NV-209 (Thangseng 2026-10-25): iano and uano are correct, bare for all verbs - supersedes the NV-195 scoped default
  assert.equal((await translate('I ate here')).garo, 'Anga iano cha·aha');
});
test('NV-195: uano is NOT ruled, default unchanged', async () => {
  assert.equal((await translate('I stay there')).garo, 'Anga uano donga');
});
