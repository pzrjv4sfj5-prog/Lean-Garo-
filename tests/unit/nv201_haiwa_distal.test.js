// NV-201 (2026-10-25): PO ruling "Haiwa = when the object is very far or far
// away" (a ruling, NOT a native quote). Engine design (Claude B): Haiwa is
// emitted ONLY when the English states the distance outright (far / very far /
// far away / faraway) about a `that` object. Position mirrors attested `Ua NOUN`.
// `over there`, `yonder`, `that far` (= to that extent) and all `this` forms
// are NOT triggers. Garo has no copula, so the predicate shape is bare Haiwa.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

const norm = (s) => s.toLowerCase().replace(/[·.]/g, '').trim();
const t = async (en) => norm((await translate(en)).garo);

for (const [en, garo] of [
  ['that far house', 'haiwa nok'], ['that very far house', 'haiwa nok'],
  ['that far away house', 'haiwa nok'], ['that faraway house', 'haiwa nok'],
  ['that house is far away', 'haiwa nok'], ['that house is very far', 'haiwa nok'],
  ['that dog is far away', 'haiwa achak'], ['that house is far', 'haiwa nok'],
  ['That house is far away.', 'haiwa nok'],
  ['that is far away', 'haiwa'], ['that is very far', 'haiwa'], ['that is far', 'haiwa'],
  ['that one far away', 'haiwa'], ['that one is very far', 'haiwa'],
]) {
  test(`NV-201 Haiwa: ${en}`, async () => assert.equal(await t(en), garo));
}

test('NV-201: no distance statement -> still Ua (NV-189/198 unchanged)', async () => {
  assert.equal(await t('that house'), 'ua nok');
  assert.equal(await t('that is a house'), 'ua nok');
  assert.equal(await t('that one'), 'ua');
  assert.equal(await t('that'), 'ua');
  assert.equal(await t('that house is very big'), 'ua nok namen dala');
});
test('NV-201: not triggers (this, over there, that far=extent, bare far)', async () => {
  for (const en of ['this is far', 'this house is far away', 'this far house', 'that over there',
    'that far', 'I cannot go that far', 'it is far', 'the house is far away']) {
    assert.ok(!/haiwa/i.test((await translate(en)).garo), en);
  }
});
