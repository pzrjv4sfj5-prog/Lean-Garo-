// NV-215 (native-verified PO relay, 2026-10-25): `that` + noun = `ua` + noun, `this` + noun = `ia` + noun, placed
// immediately before the noun; the case marker (-ko) attaches to the NOUN, never the demonstrative (`ua achakko`, not `uako achak`).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase().replace(/[.!?]$/, '');
for (const [en, garo] of [
  ['Look at that dog.', 'ua achakko nibo'], ['I see that dog.', 'anga ua achakko nika'],
  ['I see this dog', 'anga ia achakko nika'], ['I saw that dog', 'anga ua achakko nikaha'],
  ['I will see that dog', 'anga ua achakko nikgen'], ['I do not see that dog', 'anga ua achakko nikja'],
  ['I want that dog', 'anga ua achakko ska'], ['he sees this house', 'ua ia nokko nika'],
  ['I bought this house', 'anga ia nokko breaha'], ['that dog is big', 'ua achak dal·a'],
  ['that dog', 'ua achak'], ['this dog', 'ia achak'],
]) test(`NV-215: ${en}`, async () => assert.equal(await lc(en), garo));
test('NV-215: case marker on the noun, not the demonstrative; adjectives not captured', async () => {
  for (const en of ['I see that dog', 'I see this dog', 'I want that dog']) assert.ok(!/\b(ua|ia)ko\b/i.test((await translate(en)).garo), en);
  for (const en of ['that big', 'this good', 'that good']) assert.ok(!/^(ua|ia) /i.test((await translate(en)).garo), en);
});
test('NV-215: look at this dog mirrors that (ia + noun-ko)', async () => assert.equal(await lc('look at this dog'), 'ia achakko nibo'));
