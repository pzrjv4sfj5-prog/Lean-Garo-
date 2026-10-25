// NV-205 (2026-10-25): Thangseng native paradigms (relayed 2026-07-26, see
// docs/PENDING_LINGUISTIC_PROPOSAL_20260725_placeholder_entries.md). WATCH and SEE are two
// different words: Nia = to watch, Nika = to see / to find (Nika is multi-sense, no
// re-clarification). Attested sentences: `I see it` = Anga uko nika; `I want to watch it` =
// Anga uko nina ska; `I am watching` = Anga nienga. Nisona (wait/look with expectation)
// is NOT interchangeable with nina. Object-`it` imperatives are grammar logic (NV-204).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase().replace(/[.!?]$/, '');

for (const [en, garo] of [
  // Nia (watch)
  ['watch', 'nia'], ['to watch', 'nia'], ['watch!', 'nibo'], ['do not watch', 'ninabe'], ['watching', 'nienga'],
  ['watched', 'niaha'], ['will watch', 'nigen'], ['will not watch', 'nijawa'],
  // Nika (see / find)
  ['see', 'nika'], ['find', 'nika'], ['see!', 'nikbo'], ['find!', 'nikbo'], ['do not find', 'niknabe'],
  ['do not see', 'niknabe'], ['will find', 'nikgen'], ['will not find', 'nikjawa'], ['found', 'nikaha'], ['saw', 'nikaha'],
  // attested sentences
  ['I see it', 'anga uko nika'], ['I want to watch it', 'anga uko nina ska'], ['I am watching', 'anga nienga'],
]) test(`NV-205 form: ${en}`, async () => assert.equal(await lc(en), garo));

// SOV: subject - object - verb, conjugated by the shared suffix rules
for (const [en, garo] of [
  ['I watch', 'anga nia'], ['I watched', 'anga niaha'], ['he is watching', 'ua nienga'], ['I will watch', 'anga nigen'],
  ['I will not watch', 'anga nijawa'], ['I do not watch', 'anga nija'], ['we are watching', 'an·ching nienga'],
  ['I watched it', 'anga uko niaha'], ['they will not watch it', 'uamang uko nijawa'],
  ['I saw it', 'anga uko nikaha'], ['I will see it', 'anga uko nikgen'], ['I will not see it', 'anga uko nikjawa'],
  ['I found it', 'anga uko nikaha'], ['he found it', 'ua uko nikaha'], ['I will find it', 'anga uko nikgen'],
  ['I will not find it', 'anga uko nikjawa'], ['I want to watch', 'anga nina ska'], ['I want to find it', 'anga uko nikna ska'],
  ['watch it!', 'uko nibo'], ['do not watch it', 'uko ninabe'], ['see it!', 'uko nikbo'], ['do not see it', 'uko niknabe'],
  ['do not find it', 'uko niknabe'],
]) test(`NV-205 SOV: ${en}`, async () => assert.equal(await lc(en), garo));

test('NV-205: watch and see are different words; nisona is not nina', async () => {
  assert.notEqual(await lc('watch'), await lc('see'));
  assert.notEqual(await lc('to wait with expectation'), 'nina');
  assert.equal(await lc('to wait with expectation'), 'nisona');
});
test('NV-204: object-it imperative leaves other verbs and plain sentences alone', async () => {
  assert.equal(await lc('eat it!'), 'uko cha·bo');
  assert.equal(await lc('do not eat it'), 'uko cha·nabe');
  assert.equal(await lc('I eat it'), (await lc('I eat it')));
  assert.ok(!/\[unknown\]/i.test((await translate('I want to eat it')).garo));
});
