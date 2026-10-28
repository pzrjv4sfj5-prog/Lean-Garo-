// Claude B, 2026-10-16: regression tests for Claude A's Phase 3 handoff
// (docs/HANDOFF_CLAUDE_B_20261016.md, R1-R8). Engine behaviour only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

test('R1: teens fused onto a classifier carry no mid-word capital', async () => {
  assert.equal((await translate('eleven dogs')).garo, 'achak mangchi·sa');
  assert.equal((await translate('nineteen dogs')).garo, 'achak mangchi·sku');
  assert.equal((await translate('eleven')).garo, 'Chi·sa'); // bare number unchanged
});

test('R2: "N persons" resolves like "N people" (sak classifier, consistent 1 and 2+)', async () => {
  assert.equal((await translate('one person')).garo, 'mande saksa');
  assert.equal((await translate('two persons')).garo, 'mande sakgni');
  assert.equal((await translate('three persons')).garo, 'mande sakgittam');
  assert.equal((await translate('two persons')).garo, (await translate('two people')).garo);
});

test('R3: unresolved proper noun is left as written, no [UNKNOWN]', async () => {
  const r = await translate('my name is Tridip');
  assert.ok(r.garo.endsWith('Tridip'), r.garo);
  assert.ok(!r.garo.includes('[UNKNOWN]'), r.garo);
});

test('R4: bare passthrough carries no [UNKNOWN], flagged unresolved at confidence 0', async () => {
  const r = await translate('not');
  assert.equal(r.garo, 'not');
  assert.equal(r.confidence, 0);
  assert.equal(r.unresolved, true);
});

test('R5: stripping a copula/demonstrative lowers confidence and reports what was dropped', async () => {
  // NV-219 (2026-10-27): `this is my book` now keeps `Ia` (demonstrative-copular-construction); the stripping/reporting contract is checked on a sentence that is still stripped.
  assert.match((await translate('this is my book')).garo, /^Ia /);
  const r = await translate('that is all');
  assert.ok(r.confidence <= 0.5, `confidence ${r.confidence}`);
  assert.ok(r.droppedWords.includes('that') && r.droppedWords.includes('is'));
});

test('R6/R7: sov-assembly capitalises only the sentence-initial word', async () => {
  for (const input of ['where is the big house?', 'how many?']) {
    const r = await translate(input);
    assert.equal(r.method, 'sov-assembly');
    const rest = r.garo.split(' ').slice(1);
    for (const w of rest) assert.ok(!/^[A-Z]/.test(w), `${input} -> ${r.garo}`);
  }
});

test('R8: constructed he/she output is deterministic (Ua); verified full-sentence rows ship verbatim', async () => {
  for (const input of ['he', 'she', 'he is angry', 'she is angry', 'is she angry?']) {
    assert.ok((await translate(input)).garo.startsWith('Ua'), input);
  }
  // Native-confirmed whole phrase (corrections.json) keeps its cited form.
  assert.equal((await translate('is he angry?')).garo, "Bia ka·o nangengama?");
});

test('Item 8 / RULE-052: "slowly" is a bare adverb before the verb, never an -ko object; real objects survive', async () => {
  const a = await translate('I eat rice slowly');
  assert.ok(!a.garo.includes('sineko'), a.garo);
  assert.ok(a.garo.includes('miko'), `object "rice" must not be dropped: ${a.garo}`);
  const b = await translate('I go to the market slowly');
  assert.ok(/Ka·sine re·a$/i.test(b.garo), b.garo);
});

test('NV-177 (PO 2026-10-20, reverses NV-168): mitim is fat, mitam is some', async () => {
  assert.equal((await translate('fat')).garo, 'mitim');
  assert.equal((await translate('some')).garo, 'mitam');
  assert.equal((await translate('the pork meat has a lot of fat')).garo, 'Wak be·en mitim bang·a');
  for (const input of ['some', 'some books', 'some rice']) {
    assert.ok(!(await translate(input)).garo.toLowerCase().includes('mitim'), input);
  }
});

test('R-d: negative "going to the market" keeps its verb (determiner-led lemma is not a particle verb)', async () => {
  for (const input of ['I am not going to the market', 'he is not going to the river', 'I was not going to the market']) {
    const r = await translate(input);
    assert.ok(/Re·angjawa$/.test(r.garo), `${input} -> ${r.garo}`);
  }
  assert.equal((await translate('I am going to the market')).garo, 'Anga bajalchi re·angenga');
});

test('R-b / RULE-029: bare single-verb command takes -bo (cook! -> Song·bo)', async () => {
  assert.equal((await translate('cook!')).garo, 'Song·bo');
  assert.equal((await translate('eat!')).garo, 'Cha·bo!'); // exact row untouched
  assert.ok(!/bo$/.test((await translate('big!')).garo)); // adjectives untouched
});
