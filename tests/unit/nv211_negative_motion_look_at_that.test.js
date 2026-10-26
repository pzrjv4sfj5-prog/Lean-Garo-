// NV-211 / NV-212 (Thangseng, relayed 2026-10-25): iachi / uachi never take the negative suffix, it goes on the verb;
// `Look at that dog.` = `Ua achakko nibo`. Native spelling is Uachi (master_dictionary verified_high), not Uchi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase().replace(/[.!?]$/, '');
for (const [en, garo] of [
  ['I do not go there', 'anga uachi re·angja'], ['they did not go there', 'uamang uachi re·angja'],
  ['I will not go there', 'anga uachi re·jawa'], ['he did not come here', 'ua iachi re·ba·ja'],
  ['I go there', 'anga uachi re·a'], ['he comes here', 'ua iachi re·ba·a'],
  ['I did not eat there', 'anga uano cha·ja'],            // static verb: bare locative, unchanged
  ['Look at that dog.', 'ua achakko nibo'], ['look at that house', 'ua nokko nibo'], ['look at that', 'uko nibo'],
  ['I see that dog', 'anga achakko nika'],
]) test(`NV-211/212: ${en}`, async () => assert.equal(await lc(en), garo));
