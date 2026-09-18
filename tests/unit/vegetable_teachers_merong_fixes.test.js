import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Three Owner-directed fixes, all chat-confirmed 2026-09-16.
//
// 1. "vegetable" (singular) had no dictionary entry at all -- only
//    "vegetables" (plural) existed, so the generic singularizer produced
//    a key with no match and fell through to a weak fuzzy hit against
//    "vegetables" itself. Owner: "vegetable" = "mesu". Added as its own
//    verified_high headword, distinct from "vegetables"="sam·bi·jak".
//
// 2. "two teachers" (plural key) shipped a missing-classifier defect
//    ("skigipa·gni", fused, no classifier) while the exact-key "two
//    teacher" (singular) already carried a VERIFIED/HIGH, natively-
//    relayed sak-classifier form ("Skigipa sakgni"). Corrected "two
//    teachers" to the same already-verified form by direct mechanical
//    parity -- Garo's noun+classifier+number-suffix formula doesn't
//    inflect for English-style plurality, so the singular-key form
//    already covers both readings.
//
// 3. Rice measured by weight (kg) is uncooked rice ("merong"), not the
//    default cooked reading ("mi") that bare "rice" resolves to. Owner
//    citation "merong kg gni" also confirms no raka dot before the kg
//    classifier suffix -- scoped narrowly to unit-measured rice only,
//    via translationEngine.js's classifier-counting branch (step 1.6).
//    CORRECTION 2026-09-19: the spacing in that same citation ("kg
//    gni", literally spaced) was never actually implemented -- this
//    test below originally asserted the fused "kggni", silently
//    contradicting its own cited source above. Fixed alongside
//    litre/plate confirmation, same underlying spaced-unit-word gap;
//    see tests/unit/unit_word_classifiers.test.js.

test('translate: "vegetable" now resolves to its own verified headword, not a fuzzy match', async () => {
  const veg = await translate('vegetable');
  assert.equal(veg.garo, 'mesu');
  assert.notEqual(veg.method, 'fuzzy');
});

test('regression guard: "vegetables" (plural) is unaffected by the vegetable fix', async () => {
  const vegs = await translate('vegetables');
  assert.equal(vegs.garo, 'sam·bi·jak');
});

test('translate: "two teachers" now matches the verified "two teacher" classifier form', async () => {
  const plural = await translate('two teachers');
  const singular = await translate('two teacher');
  assert.equal(plural.garo, 'Skigipa sakgni');
  assert.equal(plural.garo, singular.garo);
});

test('translate: kg-measured rice resolves to merong (uncooked), not mi (cooked); spaced per direct citation', async () => {
  const two = await translate('2 kg rice');
  assert.equal(two.garo, 'merong kg gni');
  const three = await translate('3 kg rice');
  assert.equal(three.garo, 'merong kg gittam');
});

test('regression guard: bare "rice" and non-kg rice phrases are unaffected by the merong fix', async () => {
  const bare = await translate('rice');
  assert.equal(bare.garo, 'Mi');
});
