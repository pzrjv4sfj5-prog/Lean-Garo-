// NV-200 (2026-10-25): PO direct submission. Ua+chi -> Uchi (Ua elides its -a
// before -chi/-chipak/-ko: Uchi, Uchipak, Uko=Uako) whereas Ia keeps it (Iachi,
// Iachipak). Uchi/Iachi = to that/this place; motion verbs take them instead of
// Uano/Iano+ko (grammar logic, PO-authorised; not a native quote).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase().replace(/[.!?]$/, '');

for (const [en, garo] of [
  ['to that place', 'uchi'], ['that side', 'uchipak'], ['that way', 'uchipak'], ['towards that', 'uchipak'],
  ['this side', 'iachipak'], ['to them', 'uamangchi'], ['by them', 'uamangchi'],
  ['I go there', 'anga uachi re·a'], ['I come here', 'anga iachi re·ba·a'],
  ['We went there', 'an·ching uachi re·anga'], ['She will go there', 'ua uachi re·anggen'],
]) test(`NV-200: ${en}`, async () => assert.equal(await lc(en), garo));

test('NV-200: unchanged (static verbs, home, accusative uko)', async () => {
  assert.equal(await lc('I stay here'), 'anga iano donga');
  assert.equal(await lc('I eat there'), 'anga uano cha·a');
  assert.equal(await lc('I go home'), 'anga nokko re·a');
  assert.equal(await lc('I see it'), 'anga uko nika');
  assert.equal(await lc('there'), 'uano');
});
test('NV-200: no inferred Uachi / Uachipak / Uanoni', async () => {
  for (const en of ['from there', 'go there', 'there side']) assert.ok(!/uachi|uanoni/.test(await lc(en)), en);
});
