import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import { countNoun, buildClassifierPhrase } from '../../src/garo_classifier.js';

// Owner-confirmed 2026-09-13 (live chat, direct to Claude B): "beer rong
// sa is correct" -- a literal space before the number, not the fused
// "rongsa" the 'rong' classifier otherwise ships (see rong_classifier.
// test.js for the fruit/solid case, still fused). Clarified same
// conversation: beer and alcohol both resolve to the single Garo noun
// 'chu' -- so this is chu itself taking a space, a per-noun exception
// (SPACED_NOUNS), not a change to rong's classifier-level default.
// Water/chi deliberately NOT included: Owner said "maybe water", not a
// confirmation.

test('chu (alcohol/beer) counts with a space before the number', () => {
  assert.equal(countNoun('chu', 1, 'alcohol'), 'chu rong sa');
  assert.equal(countNoun('chu', 1, 'beer'), 'chu rong sa');
  assert.equal(countNoun('chu', 5, 'alcohol'), 'chu rong bonga');
});

test('fruit nouns sharing the rong classifier remain fused (unaffected by the chu exception)', () => {
  assert.equal(countNoun('mewa', 1, 'fruit'), 'mewa rongsa');
  assert.equal(countNoun('mewa', 4, 'fruit'), 'mewa rongbri');
});

test('water/chi is deliberately left fused pending firmer confirmation ("maybe water" is not a yes)', () => {
  assert.equal(countNoun('Chi', 1, 'water'), 'chi rongsa');
});

test('translate: "one beer" and "five alcohol" surface the space end-to-end', async () => {
  const beer = await translate('one beer');
  assert.equal(beer.garo, 'chu rong sa');
  const alcohol = await translate('five alcohol');
  assert.equal(alcohol.garo, 'chu rong bonga');
});

test('buildClassifierPhrase: spaced flag threads through the >=100 composition path too', () => {
  assert.equal(buildClassifierPhrase('rong', 1, true), 'rong sa');
  assert.equal(buildClassifierPhrase('rong', 100, true), 'ritcha rong sa');
  assert.equal(buildClassifierPhrase('rong', 1, false), 'rongsa');
});
