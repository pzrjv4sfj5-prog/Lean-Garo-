// NV-194 (Project Owner ruling, 2026-10-24): NV-158 (direct native) is final: past wh-questions take bare -a.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

const cases = [
  ['Who ate?', 'Sawa cha·a?'],
  ['What did you eat?', 'Na·a maiko cha·a?'],
  ['Where did you eat?', 'Na·a bano cha·a?'],
  ['Why did you eat?', 'Na·a maina cha·a?'],
  ['How did you eat?', 'Na·a maidake cha·a?'],
  ['Which food did you eat?', 'Na·a badia cha·aniko cha·a?'],
  ['How much did you eat?', 'Na·a badita cha·a?'],
];
for (const [en, garo] of cases) {
  test(`NV-194: ${en}`, async () => {
    assert.equal((await translate(en)).garo, garo);
  });
}
test('NV-194: non-wh simple past is unchanged (I ate = cha·aha)', async () => {
  assert.equal((await translate('I ate')).garo, 'Anga cha·aha');
});
