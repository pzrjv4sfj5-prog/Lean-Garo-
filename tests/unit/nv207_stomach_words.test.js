// NV-207 (2026-10-25): Project Owner-supplied words (relayed, not native quotes; unverified):
// belly = Ok; stomach ache = Ok saa (no raka); to rumble / to grumble = Ok gam·a;
// windiness due to gases = Okdita. Older unverified belly=bik·ma and stomach ache=ok sa·a superseded.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase();

for (const [en, garo] of [
  ['belly', 'ok'], ['stomach', 'ok'], ['stomach ache', 'ok saa'],
  ['to rumble', 'ok gam·a'], ['to grumble', 'ok gam·a'], ['windiness due to gases', 'okdita'],
]) {
  test(`NV-207 ${en} => ${garo}`, async () => assert.equal(await lc(en), garo));
}
