import test from 'node:test';
import assert from 'node:assert/strict';
import { countNoun, getClassifier, CLASSIFIER_MAP } from '../../src/garo_classifier.js';

// Direct Thangseng relay, 2026-08-01: fruit and alcohol nouns take the
// 'rong' classifier (roundish-shape class), not the 'ge' general
// fallback previously assumed. Thangseng's own typed examples
// ("rongsa", "rongbonga") carry no raka mark, so rong is a no-raka
// classifier (like king/jol), unlike mang/sak/ge/gong.

test('rong classifier: fruit nouns resolve to rong, no raka', () => {
  assert.equal(getClassifier('fruit'), 'rong');
  assert.equal(countNoun('mewa', 4, 'fruit'), 'mewa rongbri');
  assert.equal(countNoun('mewa', 1, 'fruit'), 'mewa rongsa');
});

test('rong classifier: alcohol nouns resolve to rong, no raka', () => {
  assert.equal(getClassifier('alcohol'), 'rong');
  assert.equal(getClassifier('beer'), 'rong');
  assert.equal(countNoun('chu', 1, 'alcohol'), 'chu rongsa');
  assert.equal(countNoun('chu', 5, 'alcohol'), 'chu rongbonga');
});

test('rong classifier: does not carry raka (·) unlike mang/sak/ge/gong', () => {
  const phrase = countNoun('chu', 5, 'alcohol');
  assert.ok(!phrase.includes('·'), `expected no raka in "${phrase}"`);
});

test('regression: ge fallback still applies to genuinely uncategorized/tool nouns', () => {
  assert.equal(getClassifier('pen'), 'ge');
  assert.equal(countNoun('kolom', 2, 'pen'), 'kolom ge·gni');
});

test('regression: existing classifier roots unaffected by rong addition', () => {
  assert.equal(countNoun('achak', 1, 'dog'), 'achak mang·sa');
  assert.equal(countNoun('mande', 1, 'person'), 'mande sak·sa');
  assert.equal(countNoun('ki·tap', 3, 'book'), 'ki·tap kinggittam');
  assert.equal(countNoun('tangka', 5, 'coin'), 'tangka gong·bonga');
  assert.equal(countNoun('do·a', 10, 'bird'), 'do·a mang·chiking');
});

test('CLASSIFIER_MAP sanity: rong entries present', () => {
  assert.equal(CLASSIFIER_MAP['fruit'], 'rong');
  assert.equal(CLASSIFIER_MAP['apple'], 'rong');
  assert.equal(CLASSIFIER_MAP['chu'], 'rong');
  assert.equal(CLASSIFIER_MAP['alcohol'], 'rong');
});
