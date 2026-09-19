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

// UPDATED 2026-09-19 (Claude A, NV-158): "one hundred dogs" now has a
// direct Thangseng-confirmed dictionary entry ("Achak mang·ritchasa"),
// so it resolves via exact-phrase lookup rather than falling through to
// the classifier engine, and no longer matches "100 dogs" byte-for-byte
// -- a genuine improvement, not a regression: the classifier engine's
// n=100 composition ("100 dogs" -> "achak mangritcha") was always
// unconfirmed (see this file's Bug 3/4 header note) and the new native
// citation shows it's actually missing the -sa multiplier suffix and its
// raka dot (should be "mang·ritchasa", matching the established
// classifier+raka+number-suffix pattern used everywhere else in the
// counting system, e.g. "mang·sa"=one). Restated as a Runtime Handoff to
// Claude B in docs/CLAUDE_A_SESSION_MIGRATION_20260919B.md -- not fixed
// here, engine code is out of Claude A's lane.
test('translate: "one hundred dogs" resolves via the native-confirmed dictionary entry', async () => {
  const word = await translate('one hundred dogs');
  assert.equal(word.method, 'exact-phrase');
  assert.equal(word.garo, 'Achak mang·ritchasa');
});

test('translate: "100 dogs" (digit form, no dictionary entry) still falls through to the classifier engine', async () => {
  const digit = await translate('100 dogs');
  assert.equal(digit.method, 'classifier');
  // Known engine gap (not fixed here, Claude B territory): this currently
  // produces "achak mangritcha" -- missing the -sa suffix/raka dot that
  // "one hundred dogs" -> "Achak mang·ritchasa" confirms should be there.
  assert.equal(digit.garo, 'achak mangritcha');
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
