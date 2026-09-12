import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import { parseCountingPhrase } from '../../src/garo_classifier.js';

// Bug 5 fix (2026-09-12, Claude B, session 20260912 continuation).
//
// Root cause: parseCountingPhrase()'s singularizer only stripped a bare
// trailing 's' (`word.replace(/s$/, '')`), so any noun with a regular
// English "-es" plural singularized to a form that doesn't exist in the
// dictionary ("mangoes" -> "mangoe", "boxes" -> "boxe", "potatoes" ->
// "potatoe", "dishes" -> "dishe"). translationEngine.js's classifier-
// counting branch (step 1.6) then silently failed to resolve garoNoun
// and fell all the way through to the much weaker sov-assembly fallback
// (0.75 confidence): wrong word order (number-first instead of
// noun+classifier), and the real Garo classifier for that noun never
// applied at all.
//
// Live-confirmed before this fix: translate("seven mangoes") returned
// {garo: "Sni te·ga·chu", method: "sov-assembly", confidence: 0.75}
// instead of composing "te·ga·chu" (mango) with its 'rong' classifier.
//
// Fix: garo_classifier.js's new singularize() helper handles -ies/-oes/
// -[sxz]es/-ches/-shes plurals before falling back to the generic -s
// strip. translationEngine.js's redundant second `.replace(/s$/, '')`
// on the already-singular value was also removed (it would have
// double-stripped correctly-singularized "-es"-derived words ending in
// a genuine 's', e.g. "buses" -> "bus" -> "bu").

test('parseCountingPhrase: -es plurals singularize correctly (not naive s-strip)', () => {
  assert.equal(parseCountingPhrase('seven mangoes').englishNoun, 'mango');
  assert.equal(parseCountingPhrase('two boxes').englishNoun, 'box');
  assert.equal(parseCountingPhrase('three potatoes').englishNoun, 'potato');
  assert.equal(parseCountingPhrase('two dishes').englishNoun, 'dish');
  assert.equal(parseCountingPhrase('three churches').englishNoun, 'church');
  assert.equal(parseCountingPhrase('five buses').englishNoun, 'bus');
});

test('regular -s plurals are unaffected by the -es fix', () => {
  assert.equal(parseCountingPhrase('two dogs').englishNoun, 'dog');
  assert.equal(parseCountingPhrase('three cats').englishNoun, 'cat');
});

test('translate: "-es" plural counted nouns now compose via the classifier engine, not sov-assembly', async () => {
  const mangoes = await translate('seven mangoes');
  assert.equal(mangoes.method, 'classifier');
  assert.equal(mangoes.garo, 'te·ga·chu rongsni');

  const boxes = await translate('two boxes');
  assert.equal(boxes.method, 'classifier');

  const potatoes = await translate('three potatoes');
  assert.equal(potatoes.method, 'classifier');

  const dishes = await translate('two dishes');
  assert.equal(dishes.method, 'classifier');
});

test('regression guard: already-working -s plural counting is unaffected', async () => {
  const dogs = await translate('two dogs');
  assert.equal(dogs.garo, 'achak mang·gni');
});
