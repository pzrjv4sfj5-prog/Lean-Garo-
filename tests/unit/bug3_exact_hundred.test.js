import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import { toGaroNumber } from '../../src/number_engine.js';
import { buildClassifierPhrase } from '../../src/garo_classifier.js';

// Bug 3 fix (2026-09-18, direct Thangseng citation, relayed by Project
// Owner: "100 = ritcha, 101 = ritchasa, 100 dogs = achak mangritcha").
// Previously buildLargeClassifierPhrase's remHundred===0 branch guessed
// that an exact multiple of 100/1000 needs a spurious classifier+"sa"
// filler (as if secretly n+1) -- uncited, and it caused n=100 and n=101
// to render identically for every classifier. The citation shows the
// real mechanism: classifier fuses directly onto the quantifier word
// itself with no filler and no raka dot, mirroring the already-
// confirmed round-tens rule one order of magnitude up. Same root-cause
// fix corrected number_engine.toGaroNumber's bare (no classifier) form,
// which had the identical uncited "ritchasa"=100 guess.

test('bare number words: 100 vs 101 no longer collide, match direct citation', () => {
  assert.equal(toGaroNumber(100), 'Ritcha');
  assert.equal(toGaroNumber(101), 'Ritchasa');
});

test('classifier composition: 100 vs 101 no longer collide, mang matches direct citation exactly', () => {
  assert.equal(buildClassifierPhrase('mang', 100), 'mangritcha'); // "achak mangritcha" cited directly
  assert.equal(buildClassifierPhrase('mang', 101), 'ritcha mangsa');
  assert.notEqual(buildClassifierPhrase('mang', 100), buildClassifierPhrase('mang', 101));
});

test('classifier composition: exact hundred has NO raka dot, even for classifiers that are otherwise dot-carrying', () => {
  // mang is dot-carrying at n<20 ("mang·sa") but the citation shows no
  // dot at all for the exact-hundred construction -- a different,
  // explicitly confirmed fact for this specific construction, not a
  // contradiction of the n<20 rule.
  assert.equal(buildClassifierPhrase('mang', 100), 'mangritcha');
  assert.doesNotMatch(buildClassifierPhrase('mang', 100), /·/);
  assert.equal(buildClassifierPhrase('king', 100), 'kingritcha');
  assert.doesNotMatch(buildClassifierPhrase('king', 100), /·/);
});

test('translate: "100 dogs" surfaces the cited form end-to-end, distinct from "101 dogs"', async () => {
  const r100 = await translate('100 dogs');
  const r101 = await translate('101 dogs');
  assert.equal(r100.garo, 'achak mangritcha');
  assert.notEqual(r100.garo, r101.garo);
});

test('exact multiples of 100 beyond 100 itself: mechanically generalized from the same fuse-no-filler mechanism, NOT independently confirmed by their own citation', () => {
  // Flagged distinctly from the n=100 case above: only n=100 itself has
  // a direct worked example. 200/300/etc. apply the identical confirmed
  // mechanism (no filler, no dot, classifier fuses onto the full
  // quantifier word) but that specific extension hasn't been checked
  // against its own citation yet.
  assert.equal(buildClassifierPhrase('mang', 200), 'mangritchagni');
  assert.equal(buildClassifierPhrase('mang', 300), 'mangritchagittam');
});
