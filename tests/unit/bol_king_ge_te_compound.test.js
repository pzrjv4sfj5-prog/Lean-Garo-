import test from 'node:test';
import assert from 'node:assert/strict';
import { buildClassifierPhrase } from '../../src/garo_classifier.js';

// CONFIRMED (2026-09-18, Counting_docx_thanseng.docx -- direct Thangseng
// upload, table of n=1-41 for bol/king/gong/ge/te). Closes Bug 2 for
// these four classifiers' 20-99 range: fused, NO raka dot, same shape
// as 'sak'. Verified mechanically against number_engine.toGaroNumber()
// before landing -- not just copied from the table. gong is deliberately
// NOT covered by this test file: its n=41 compound is covered separately
// in bug2_classifier_20_99_compound.test.js, and now resolves WITH a
// dot ("gong·sotbrisa") per the 2026-09-18 Owner directive -- see
// garo_classifier.js's CONFIRMED_COMPOUND_CLASSIFIERS comment for the
// full reasoning on why the no-dot reading of this same docx table was
// traced to a transcription gap rather than treated as authoritative.
// jol/se are not in this table at all and remain fully unconfirmed.

test('bol (cars) 20-99 compound: fused, no dot', () => {
  assert.equal(buildClassifierPhrase('bol', 20), 'bolkolgrik');
  assert.equal(buildClassifierPhrase('bol', 21), 'bolkolgriksa');
  assert.equal(buildClassifierPhrase('bol', 24), 'bolkolgrikbri');
  assert.equal(buildClassifierPhrase('bol', 30), 'bolkolatchi');
  assert.equal(buildClassifierPhrase('bol', 40), 'bolsotbri');
  assert.equal(buildClassifierPhrase('bol', 41), 'bolsotbrisa');
});

test('king (books) 20-99 compound: fused, no dot', () => {
  assert.equal(buildClassifierPhrase('king', 20), 'kingkolgrik');
  assert.equal(buildClassifierPhrase('king', 21), 'kingkolgriksa');
  assert.equal(buildClassifierPhrase('king', 41), 'kingsotbrisa');
});

test('ge (pens) 20-99 compound: fused, no dot', () => {
  assert.equal(buildClassifierPhrase('ge', 20), 'gekolgrik');
  assert.equal(buildClassifierPhrase('ge', 21), 'gekolgriksa');
  assert.equal(buildClassifierPhrase('ge', 41), 'gesotbrisa');
});

test('te (houses) 20-99 compound: fused, no dot -- note this differs from te\'s own n<20 dotted rule (te·sa), a different construction, not a contradiction', () => {
  assert.equal(buildClassifierPhrase('te', 20), 'tekolgrik');
  assert.equal(buildClassifierPhrase('te', 21), 'tekolgriksa');
  assert.equal(buildClassifierPhrase('te', 41), 'tesotbrisa');
});

test('se remains unconfirmed for 20-99 -- no guess, returns null; gong now resolved (see bug2 test file), no longer null; jol now ships an Owner-approved guess (see jol_compound_unverified_guess.test.js), no longer null', () => {
  assert.equal(buildClassifierPhrase('se', 25), null);
  assert.equal(buildClassifierPhrase('gong', 25), 'gong·kolgrikbonga'); // corrected 2026-09-18, WITH dot -- see garo_classifier.js comment
});
