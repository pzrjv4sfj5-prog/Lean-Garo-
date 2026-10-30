// NV-228 (Claude B, 2026-10-29). Project Owner rulings:
//  * mid-sentence capitals are neutralised (dictionary headwords carry a capital by convention; native text is lowercase);
//  * `bring` has no extra raka dot either: ra·baa / ra·baaha / ra·bagen / ra·baja / ra·babo (analogy with come, Thangseng re·baa).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const g = async (en) => (await translate(en)).garo;
const midCaps = (s) => s.split(' ').slice(1).filter((t, i, a) => /^[A-Z][a-z·]+[.,!?]*$/.test(t));
for (const en of ['I eat rice.', 'I do not eat rice.', 'I will go to the market.', 'he came here.', 'the dog will eat rice', 'I see that dog.', 'you like the house.', 'we are going.', 'I bring it.', 'Please sit.'])
  test(`NV-228 no mid-sentence capital: ${en}`, async () => assert.deepEqual(midCaps(await g(en)), [], en));
test('NV-228: the first word keeps its capital', async () => { assert.match(await g('I eat rice.'), /^Anga /); });
test('NV-228: names passed through from the input keep their capital', async () => {
  assert.match(await g('my name is Tridip'), /Tridip$/); assert.match(await g('I go to Tura'), /\bTura·chi\b/);
});
test('NV-228: unresolved English words passed through stay as written', async () => assert.match(await g('I only love Klingon.'), /Klingonko/));
test('NV-228: pinned exact/native phrases are untouched', async () => { assert.equal(await g('Eat!'), 'Cha·bo!'); });
for (const [en, garo] of [['I bring it.', 'anga uko ra·baa'], ['I brought it.', 'anga uko ra·baaha'], ['I will bring it.', 'anga uko ra·bagen'], ['I do not bring it.', 'anga uko ra·baja'], ['Bring!', 'ra·babo']])
  test(`NV-228 bring (no extra dot): ${en}`, async () => assert.equal((await g(en)).toLowerCase().replace(/[.!]$/, ''), garo));
test('NV-228: no `ra·ba·` anywhere in bring output', async () => { for (const en of ['I bring it.', 'I brought it.', 'Bring!']) assert.ok(!/ra·ba·/i.test(await g(en))); });
