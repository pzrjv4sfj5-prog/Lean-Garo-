// NV-214 (native-verified PO relay 2026-10-25): strict split. uamangna = "for them" (benefactive) ONLY;
// uamangchi = "to them" (directional / recipient) ONLY. Bare "them" stays uamangko (accusative).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase();
for (const [en, garo] of [
  ['to them', 'uamangchi'], ['for them', 'uamangna'], ['them', 'uamangko'],
  ['I gave it to them', 'anga uamangchi on·aha'], ['give it to them', 'uamangchi on·a'],
  ['I speak to them', 'anga uamangchi agana'], ['I went to them', 'anga uamangchi re·anga'],
  ['I bought it for them', 'anga uamangna breaha'], ['this is for them', 'uamangna'],
  ['I see them', 'anga uamangko nika'],
]) test(`NV-214: ${en}`, async () => assert.equal(await lc(en), garo));
test('NV-214: to and for never share a form', async () => assert.notEqual(await lc('to them'), await lc('for them')));
