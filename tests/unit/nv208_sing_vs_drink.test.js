// NV-208 (2026-10-25): Project Owner directive: sing = ring·a (raka); drink = ringa (no raka).
// Native-confirmed Hai ring·na = let's sing (2026-07-14). `singing` was a stale `bitenga` (bite = fruit).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase();
for (const [en, garo] of [
  ['sing', 'ring·a'], ['drink', 'ringa'], ['singing', 'ring·enga'], ['drinking', 'ringenga'],
  ['i will sing', 'anga ring·gen'], ['i will drink', 'anga ringgen'], ['do not sing', 'ring·ja'],
]) test(`NV-208 ${en} => ${garo}`, async () => assert.equal(await lc(en), garo));
