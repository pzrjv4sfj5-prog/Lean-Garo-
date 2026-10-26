// NV-210 (2026-10-26): -ja on adjectives; ong·ja = different sense; on·a / on·na / on·ana (pasted native-writer text, relayed by Project Owner).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase();
for (const [en, garo] of [
  ['not big', 'dal·ja'],
  ['not the big one', 'dal·gipa ong·ja'],
  ['he gives me water', 'ua angna chiko on·a.'],
  ['she gives me water', 'ua angna chiko on·a.'],
  ['because he gave me water i was very happy', 'uni angna chi on·ana anga kusi ong·beaha.'],
  ['can you give me water', 'angna chi on·na man·genma?'],
]) test(`NV-210 ${en} => ${garo}`, async () => assert.equal(await lc(en), garo));
