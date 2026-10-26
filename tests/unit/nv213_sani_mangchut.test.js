// NV-213 (2026-10-26): Project Owner-confirmed native-dictionary words (not Thangseng quotes):
// whose = Sani, someone's = Saniba, mouse = Mangchut (older unverified me·se superseded).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase();

for (const [en, garo] of [
  ['whose', 'sani'], ['whose?', 'sani?'], ["someone's", 'saniba'], ['mouse', 'mangchut'],
]) {
  test(`NV-213 ${en} => ${garo}`, async () => assert.equal(await lc(en), garo));
}
