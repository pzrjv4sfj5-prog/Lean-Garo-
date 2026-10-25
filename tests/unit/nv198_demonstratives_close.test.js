// NV-198 (2026-10-25): PO authorized Claude B to close demonstrative items by
// grammar logic (NOT native evidence; PO ruling, mirrors attested NV-189 `Ua NOUN`
// and `Iako angna on·bo`). Haiwa is still never emitted.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

for (const [en, garo] of [
  ['this dog', 'Ia achak'], ['This house', 'Ia nok'],
  ['this is a dog', 'Ia achak'], ['that is a dog', 'Ua achak'],
  ['this one', 'Ia'], ['that one', 'Ua'],
]) {
  test(`NV-198: ${en}`, async () => {
    assert.equal((await translate(en)).garo.toLowerCase().replace(/[·.]/g, ''), garo.toLowerCase());
  });
}
test('NV-198: standalone that is capitalised like this', async () => {
  assert.equal((await translate('that')).garo, 'Ua');
  assert.equal((await translate('this')).garo, 'Ia');
});
test('NV-198: adjectives / unrelated forms are not captured', async () => {
  for (const en of ['this big', 'this good', 'this is far']) {
    const g = (await translate(en)).garo;
    assert.ok(!/haiwa/i.test(g) && !/^(Ia|Ua) /.test(g), `${en} -> ${g}`);
  }
  assert.ok(!/haiwa/i.test((await translate('that is far away')).garo));
});
test('NV-198: prior NV-189 rows unchanged', async () => {
  assert.equal((await translate('that house is very big')).garo, 'Ua nok namen dal·a.');
  assert.equal((await translate('give me that')).garo, 'Iako angna on·bo');
  assert.equal((await translate('who is that')).garo, 'Ua sawa?');
});
test('NV-198: May I work / pro-drop / locatives unchanged (PO: synonyms, keep)', async () => {
  assert.equal((await translate('May I work?')).garo, 'Anga kam ka·na man·genma?');
  assert.equal((await translate('I stay there')).garo, 'Anga uanoko donga');
});
