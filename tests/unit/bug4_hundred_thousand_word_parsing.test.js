import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import { parseCountingPhrase } from '../../src/garo_classifier.js';

// Bug 4 fix (2026-09-12, Claude B, session 20260912 continuation).
//
// parseCountingPhrase already listed 'hundred':100 and 'thousand':1000
// in NUMBER_WORDS, but only ever read words[0] (plus, for tens
// compounds, one extra units word) — "hundred"/"thousand" were never
// actually consumed as number words. "one hundred dogs" was parsed as
// count=1 with "hundred dogs" swallowed whole into the noun remainder,
// silently dropping the hundred multiplier entirely.
//
// Fix: explicit thousands/hundreds/tens-block grammar. This makes the
// word-form path consistent with the digit-form path ("100 dogs") that
// was already live and already correctly composing via
// buildLargeClassifierPhrase -- it does not change or invent any Garo
// surface rule, only which English number words map to which integer.
//
// Known, deliberately NOT fixed here: buildLargeClassifierPhrase's
// composition for n=100 and n=101 (also "one hundred one") renders to
// the *same* string ("ritcha mang·sa" for a 'mang'-classifier noun).
// This is the real substance of Bug 3 and is a genuine code-level
// collision independent of word-vs-digit input -- but fixing it means
// choosing the correct Garo surface form for exact multiples of 100,
// which is unverified anywhere in the repo (no confirmed example for a
// classifier attached to an exact hundred in
// data/garo_number_classifier_engine_machine_ready.json). Flagged for
// Owner/Thangseng confirmation, not guessed at here.

test('parseCountingPhrase: "one hundred X" parses as count 100, matching digit "100 X"', () => {
  const word = parseCountingPhrase('one hundred dogs');
  const digit = parseCountingPhrase('100 dogs');
  assert.equal(word.count, 100);
  assert.equal(word.count, digit.count);
  assert.equal(word.englishNoun, 'dog');
});

test('parseCountingPhrase: "two hundred X" parses as count 200, matching digit "200 X"', () => {
  const word = parseCountingPhrase('two hundred dogs');
  const digit = parseCountingPhrase('200 dogs');
  assert.equal(word.count, 200);
  assert.equal(word.count, digit.count);
});

test('parseCountingPhrase: "one hundred one X" parses as count 101 (and, deliberately, still collides with 100 downstream -- see Bug 3 note above)', () => {
  const r = parseCountingPhrase('one hundred one dogs');
  assert.equal(r.count, 101);
});

test('parseCountingPhrase: "one thousand X" parses as count 1000', () => {
  const r = parseCountingPhrase('one thousand dogs');
  assert.equal(r.count, 1000);
  assert.equal(r.englishNoun, 'dog');
});

test('translate: "one hundred dogs" now composes via the classifier engine, matching "100 dogs" byte-for-byte', async () => {
  const word = await translate('one hundred dogs');
  const digit = await translate('100 dogs');
  assert.equal(word.method, 'classifier');
  assert.equal(word.garo, digit.garo);
});

test('regression guard (RC-CANDIDATE-031): "twenty ten apples" still does not falsely combine', () => {
  const r = parseCountingPhrase('twenty ten apples');
  assert.equal(r.count, 20);
});

test('regression guard (RC-CANDIDATE-031): "twenty one apples" still parses as 21, not 20', () => {
  const r = parseCountingPhrase('twenty one apples');
  assert.equal(r.count, 21);
  assert.equal(r.englishNoun, 'apple');
});
