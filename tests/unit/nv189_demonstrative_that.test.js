// NV-189 (PO-relayed 2026-10-23): default `that` = Ua, placed before the noun
// (attested: "Ua nok namen dal·a" = that house is very big, NV-177).
// Haiwa (distance emphasised) has NO verified trigger list: never emitted by inference.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

for (const [en, noun] of [['that dog','achak'],['That house','nok'],['that house?','nok']]) {
  test(`NV-189 that+noun: ${en}`, async () => {
    const g = (await translate(en)).garo;
    assert.ok(g.startsWith('Ua '), g);
    assert.equal(g.slice(3).toLowerCase().replace(/[·.]/g,''), noun);
  });
}
test('NV-189: exact rows unchanged', async () => {
  assert.equal((await translate('that house is very big')).garo, 'Ua nok namen dal·a.');
  assert.equal((await translate('give me that')).garo, 'Iako angna on·bo');
  assert.equal((await translate('who is that')).garo, 'Ua sawa?');
});
// NV-201 supersedes: `that is far away` etc. now -> Haiwa (see nv201_haiwa_distal.test.js).
test('NV-189: no guessed Haiwa (non-far cues), no leakage to this/that one', async () => {
  for (const en of ['that dog over there','that far','that one','this dog','I see that dog']) {
    const g = (await translate(en)).garo;
    assert.ok(!/haiwa/i.test(g), `${en} -> ${g}`);
  }
  assert.equal((await translate('I see that dog')).garo, 'Anga achakko Nika');
  assert.equal((await translate('this dog')).garo, (await translate('this dog')).garo);
});
test('NV-189: that + adjective is not treated as that + noun', async () => {
  for (const en of ['that big', 'that good', 'that red']) {
    assert.ok(!(await translate(en)).garo.startsWith('Ua '), en);
  }
});
