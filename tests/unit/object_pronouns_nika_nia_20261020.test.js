import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// 2026-10-20 (Claude B). NV-177/178 + PO rulings (docs/HANDOFF_CLAUDE_B_20261020_
// adjective_pronoun_nia.md items 2-5). Evidence class: PO-relayed Thangseng
// answers; raw messages not on file.
//  - biko = him/her, humans only; uko = it (and a valid universal variant).
//    A direct object him/her is biko, never the -chi form (bichi·ko).
//  - nika = see (direct sight, -ko object); nia = look at (directional) and
//    needs the -chi pronoun: Anga bichiko nia. Never "bichiko nika".
//  - some = mitam; fat = mitim.
//  - little (size) = chona, never ontisa; quantity = ontisa / banggija.
const norm = (s) => String(s).toLowerCase().replace(/[^\p{L} ]/gu, '').replace(/\s+/g, ' ').trim();
const g = async (eng) => norm((await translate(eng)).garo);

test('3rd-person -s verb: "sees" resolves to nika (was mis-parsed as a noun plural)', async () => {
  assert.equal(await g('she sees the dog'), 'ua achakko nika');
  assert.equal(await g('he sees the cat'), 'ua menggoko nika');
});

test('him/her as direct object = biko, not bichiko', async () => {
  assert.equal(await g('i hit him'), 'anga biko nanga');
  assert.equal(await g('she sees him'), 'ua biko nika');
  assert.equal(await g('he hits her'), 'ua biko chadika');
  // 'i saw him' is a corrections.json row (Anga uko Nikaha, NV-011); uko is a valid universal variant, so it is left to Claude A.
});

test('it is uko and never biko; biko never appears for non-human objects', async () => {
  assert.equal(await g('i see it'), 'anga uko nika');
  assert.equal(await g('i hit it'), 'anga uko nanga');
  for (const s of ['i see it', 'i hit it', 'i see the dog', 'i eat rice']) assert.ok(!/\bbiko\b/.test(await g(s)), s);
});

test('nia (look at) takes the -chi pronoun; never bichiko + nika', async () => {
  assert.equal(await g('i look at him'), 'anga bichiko nia');
  assert.equal(await g('she looks at him'), 'ua bichiko nia');
  assert.equal(await g('they look at her'), 'uamang bichiko nia');
  for (const s of ['i see him', 'i look at him', 'she sees him', 'she looks at him', 'i see her', 'i look at her']) {
    assert.ok(!/bichiko nika/.test(await g(s)), `${s} -> ${await g(s)}`);
  }
});

test('some = mitam, fat = mitim', async () => {
  assert.equal(await g('some'), 'mitam');
  assert.equal(await g('fat'), 'mitim');
  assert.equal(await g('some people'), 'mitam mande');
});

test('little (size) = chona, pre-noun -gipa; never ontisa for size', async () => {
  const x = async (eng) => (await translate(eng)).garo.toLowerCase();
  assert.equal(norm(await x('the little dog sleeps')), 'chongipa achak tusina');
  assert.equal(await x('a little cat is sleeping'), 'chon\u00b7gipa menggo tusienga');
  assert.equal(norm(await x('i see a little dog')), 'anga chongipa achakko nika');
  for (const s of ['the little dog sleeps', 'a little cat is sleeping', 'i see a little dog']) assert.ok(!/ontisa/.test(await x(s)), s);
});

test('little (quantity, mass noun) never becomes chona (size)', async () => {
  for (const s of ['i have a little rice', 'a little rice', 'i want a little water']) {
    assert.ok(!/chon/.test(await g(s)), `${s} -> ${await g(s)}`);
  }
});
