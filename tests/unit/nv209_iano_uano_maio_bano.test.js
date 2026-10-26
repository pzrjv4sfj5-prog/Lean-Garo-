// NV-209 (Thangseng, relayed 2026-10-25): "Iano and uano are correct" (bare, no -ko); simple past questions are
// present in form and past in intention (context carries the tense); `Na·a bano re·anga?` is normal; for mode of
// transport `bano` is replaced by `maio` (`Na·a maio re·anga?`); with several vehicles to choose from and "which one
// was taken", `bano` is the right word.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase().replace(/[.?!]$/, '');

for (const [en, garo] of [
  ['I do not go there', 'anga uachi re·angja'], ['they did not go there', 'uamang uachi re·angja'], ['I will not go there', 'anga uachi re·jawa'],
  ['I sit here', 'anga iano asonga'], ['I will sit there', 'anga uano asonggen'], ['I did not sit there', 'anga uano asongja'],
  ['they live there', 'uamang uano donga'], ['we stay here', 'an·ching iano donga'],
  // directional (go / come, non-negative) still Uchi / Iachi (NV-200)
  ['I go there', 'anga uachi re·a'],
  ['how did you go', 'na·a maio re·anga?'], ['by what did you go', 'na·a maio re·anga?'], ['what did you go by', 'na·a maio re·anga?'],
  ['which vehicle did you take', 'na·a bano re·anga?'], ['which vehicle did you go by', 'na·a bano re·anga?'],
  ['where did you go', 'na·a bachi re·anga?'],
]) test(`NV-209: ${en}`, async () => assert.equal((await translate(en)).garo.toLowerCase(), garo.replace('?','') + (garo.endsWith('?') ? '?' : '')));
test('NV-209: no locative carries -ko', async () => {
  for (const en of ['I sit here', 'they sat there', 'I did not sit there'])
    assert.ok(!/(iano|uano)ko/i.test((await translate(en)).garo), en);
});
