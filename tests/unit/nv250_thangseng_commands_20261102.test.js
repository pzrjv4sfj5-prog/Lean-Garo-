// NV-250 (Claude B, 2026-11-02). Thangseng native relay (pasted by the Owner 2026-11-02), commands & requests.
// Native: exact pins only; no general rule is inferred (see docs/CLAUDE_B_NV250_THANGSENG_RELAY_20261102.md).
// Thangseng typed '.' for the middle dot; stored as the repo's '·'.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const g = async (en) => (await translate(en)).garo;
const cases = [
  ['Write a letter.', 'Chitti sebo'],
  ['Drink water.', 'Chi ringbo'],
  ['Eat rice.', 'Mi cha·bo'],
  ['read books', 'Ki·taprangko poraibo'],
  ['Please read the book.', 'Ka·sapae ki·taprangko poraibo'],
  ['Drink!', 'Ringbo'],
  ['Ask!', 'Sing·bo'],
  ['Dance!', 'Chrokbo'],
  ['Please come.', 'Ka·sapae re·babo'],
];
for (const [en, garo] of cases) test(`NV-250 Thangseng: ${en} -> ${garo}`, async () => assert.equal(await g(en), garo));
// Engine (imperative-object-ko): habitual objects rice/water drop -ko whatever the surface form (A's handoff 20261101); other nouns keep -ko.
test('NV-250: Eat rice! / eat the rice! / please eat rice use the bare habitual object', async () => {
  assert.equal(await g('Eat rice!'), 'Mi cha·bo');
  assert.equal(await g('eat the rice!'), 'Mi cha·bo');
  assert.equal(await g('please eat rice'), 'Ka·sapae mi cha·bo');
  assert.equal(await g('Drink water!'), 'Chi ringbo');
});
test('NV-250: non-habitual objects keep -ko; polite form has no full stop (Thangseng spelling)', async () => {
  assert.equal(await g('read the book'), 'Ki·tapko poraibo');
  assert.equal(await g('Please read the book.'), 'Ka·sapae ki·taprangko poraibo');
});
test('NV-250: He is running away. -> Ua katangenga (Claude A NV-248 pin, native-confirmed again)', async () => assert.equal(await g('He is running away.'), 'Ua katangenga'));
// ---- Thangseng 2026-11-02 (second message) ----
test('NV-250: Run fast (imperative) = Ta·rake katbo', async () => { assert.equal(await g('Run fast.'), 'Ta·rake katbo'); assert.equal(await g('Run fast!'), 'Ta·rake katbo'); });
test('NV-250: I do not know / I don\'t know = Anga u·ija (native spelling with the dot)', async () => {
  for (const s of ['I do not know.', "I don't know.", 'I dont know']) assert.equal(await g(s), 'Anga u·ija', s);
});
test('NV-250: know negatives share the u·ia stem in every person/tense (DERIVED beyond the bare form); positives keep hai·a', async () => {
  assert.equal(await g('I do not know him.'), 'Anga biko u·ija');
  assert.equal(await g('He does not know.'), 'Ua u·ija');
  assert.equal(await g('I will not know.'), 'Anga u·ijawa');
  assert.equal(await g('I will know.'), 'Anga hai·gen');
  assert.equal(await g('I know.'), 'Anga hai·a');
});
test('NV-250: he/she is running away = Ua katangenga; other subjects take the same present-continuous form (verb has no person marking)', async () => {
  for (const s of ['He is running away.', 'She is running away.', 'He/she is running away.']) assert.equal(await g(s), 'Ua katangenga', s);
  assert.equal(await g('I am running away.'), 'Anga katangenga');
  assert.equal(await g('They are running away.'), 'Uamang katangenga');
});
test('NV-250: particle verb run away = katanga: past katangaha (derived), command Katangbo! (derived), no [UNKNOWN] leak', async () => {
  assert.equal(await g('He ran away.'), 'Ua katangaha');
  assert.equal(await g('Run away!'), 'Katangbo!');
  for (const s of ['He ran away.', 'She is running away.', 'I am running away.', 'Run away!']) assert.ok(!(await g(s)).includes('[UNKNOWN]'), s);
});
