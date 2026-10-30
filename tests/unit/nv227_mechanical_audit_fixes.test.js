// NV-227 (Claude B, 2026-10-29): fixes from the mechanical audit (scripts/audit-mechanical.mjs).
// Everything here is ENGINE behaviour; items marked DERIVED are rule output, not native quotes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase().replace(/[.!]$/, '');

// 1. Output must not depend on the final period (legacy `i like house` = `ang on·a rang` template rows are superseded).
for (const s of ['I like the house', 'I like the water', 'I like the book', 'I like the car', 'I take that house', 'you like the house', 'they want the book'])
  test(`NV-227 period-invariant: ${s}`, async () => assert.equal(await lc(s), await lc(s + '.')));
test('NV-227: no legacy `ang on·a` / `na· on·a` template output', async () => {
  for (const s of ['I like the house', 'you like the book', 'we give the car', 'he takes the water'])
    assert.ok(!/\bang\b|\bna·\s|\bu\s/i.test((await translate(s)).garo), s);
});

// 2. Irregular English pasts no longer leave [UNKNOWN] (DERIVED via `did <lemma>`, flagged).
for (const [en, garo] of [['I knew it.', 'anga uko hai·aha'], ['I made a house.', 'anga nokko tariaha']]) test(`NV-227 irregular past: ${en}`, async () => {
  const r = await translate(en); assert.equal(r.garo.toLowerCase(), garo); assert.equal(r.derived, true); assert.ok(r.confidence <= 0.6);
});
test('NV-227: irregular past with a covered entry is untouched', async () => assert.equal(await lc('I saw it.'), 'anga uko nikaha'));

// 3. Words ending in -ed that are not pasts.
for (const [en, garo] of [['I feed.', 'anga kan·a'], ['I exceed.', 'anga bat·a'], ['I will feed the dog.', 'anga achakko kan·gen']]) test(`NV-227 non-past -ed: ${en}`, async () => assert.equal(await lc(en), garo));

// 4. Bare single-verb commands take -bo (RULE-029) for every paradigm verb, not only the four in VERB_LEMMAS. DERIVED unless paradigm-native.
for (const [en, garo] of [['Drink!', 'ringbo'], ['Ask!', 'sing·bo'], ['Dance!', 'chrokbo'], ['Close!', 'chip·bo'], ['Hear!', 'kin·a·bo']]) test(`NV-227 command: ${en}`, async () => assert.equal(await lc(en), garo));
test('NV-227: exact verified commands are untouched', async () => { assert.equal(await lc('Eat!'), 'cha·bo'); });

// 5. `please` keeps no stray period and takes the -bo command (attested shapes: `ka·sapae maikoba aganbo`).
for (const [en, garo] of [['Please come.', 'ka·sapae re·babo'], ['Please sit.', 'ka·sapae asongbo'], ['Please go.', 'ka·sapae re·angbo']]) test(`NV-227 please: ${en}`, async () => assert.equal(await lc(en), garo));
test('NV-227: please negative only loses the stray period', async () => assert.ok(!/\.\s/.test((await translate('Please do not go.')).garo)));
