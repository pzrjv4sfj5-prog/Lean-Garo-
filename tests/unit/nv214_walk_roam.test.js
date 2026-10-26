// NV-214 (2026-10-26): Project Owner directive: walk = Re·mama (purposeful, raka); roam/wander = rorama (aimless, no raka).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase();
for (const [en, garo] of [
  ['walk', 're·mama'], ['to walk', 're·mama'], ['roam', 'rorama'], ['to roam', 'rorama'], ['wander', 'rorama'], ['to wander', 'rorama'],
]) test(`NV-214 ${en} => ${garo}`, async () => assert.equal(await lc(en), garo));
