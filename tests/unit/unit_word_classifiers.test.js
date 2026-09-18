import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import { buildClassifierPhrase, countNounWithClassifier } from '../../src/garo_classifier.js';

// Confirmed 2026-09-19 (direct Owner/Thangseng clarification):
//   1 plate momo -> "momo plate sa"   (plate: self-classifying, spaced,
//                                       same mechanism as kg)
//   21 litres    -> "litre rong kolgriksa" (litre: NOT self-classifying --
//                                       uses the existing liquid/fruit
//                                       classifier 'rong', spaced)
//   kg gni       -> re-confirmed spaced (see vegetable_teachers_merong_
//                    fixes.test.js for the fix to the already-shipped
//                    but wrongly-fused kg path)
//
// Landing this also required a structural fix: classifierTail's n>19
// compound branch previously ignored the spaced flag entirely (never
// exercised for n>=20 before -- chu/alcohol was only ever confirmed at
// n<20). "litre rong kolgriksa" is the first n>=20 spaced citation, and
// it only works once that branch honors spaced the same way the n<20
// branch already did.

test('plate: self-classifying, spaced, matches direct citation exactly', () => {
  assert.equal(buildClassifierPhrase('plate', 1, true), 'plate sa');
});

test('litre: uses the rong classifier (not itself), spaced, matches direct citation exactly', () => {
  assert.equal(buildClassifierPhrase('rong', 21, true), 'rong kolgriksa');
});

test('kg: spaced, matches direct citation exactly (was wrongly fused before this fix)', () => {
  assert.equal(buildClassifierPhrase('kg', 2, true), 'kg gni');
});

test('countNounWithClassifier: litre maps through to rong, not a literal "litre" classifier', () => {
  assert.equal(countNounWithClassifier('petrol', 21, 'litre'), 'petrol rong kolgriksa');
});

test('countNounWithClassifier: kg/plate remain self-classifying', () => {
  assert.equal(countNounWithClassifier('merong', 2, 'kg'), 'merong kg gni');
  assert.equal(countNounWithClassifier('momo', 1, 'plate'), 'momo plate sa');
});

test('translate: "1 plate momo" surfaces the cited form end-to-end', async () => {
  const r = await translate('1 plate momo');
  assert.equal(r.garo, 'momo plate sa');
});

test('regression guard: n<20 spaced behavior (chu/alcohol) is unaffected by the n>=20 spaced fix', async () => {
  const r = await translate('one beer');
  assert.equal(r.garo, 'chu rong sa');
});

test('regression guard: fused (non-spaced) compound classifiers are unaffected by the spaced-mode fix', () => {
  assert.equal(buildClassifierPhrase('sak', 41), 'saksotbrisa');
  assert.equal(buildClassifierPhrase('rong', 25), 'rongkolgrikbonga'); // fruit reading, unspaced
});
