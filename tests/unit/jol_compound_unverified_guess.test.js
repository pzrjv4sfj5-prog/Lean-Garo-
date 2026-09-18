import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import { buildClassifierPhrase, isUnverifiedCompoundGuess } from '../../src/garo_classifier.js';

// jol 20-99 compound: UNVERIFIED GUESS, Project Owner explicit override
// (chat, 2026-09-19), NOT a citation. No source (native or documentary)
// covers jol's 20-99 shape -- jol was not in the Counting_docx_thanseng.
// docx table that confirmed bol/king/ge/te/gong for this range (only
// jol's n=1 form is cited, from a separate dictionary photo -- see
// jol_bamboo_classifier.test.js). The Owner was shown the standing rule
// against exactly this move (mang and gong both broke an equivalent
// majority-pattern guess once each, see CONFIRMED_COMPOUND_CLASSIFIERS'
// comment in garo_classifier.js) and instructed it anyway, so it ships
// -- but flagged distinctly at every layer: a separate source map
// (UNVERIFIED_COMPOUND_CLASSIFIERS_PENDING_EVIDENCE, not
// CONFIRMED_COMPOUND_CLASSIFIERS), a distinct translate() method tag
// ('classifier-unverified-guess', not 'classifier'), and confidence
// dropped from 0.96 to 0.75 (same tier as sov-assembly, the engine's
// other "reasonable but not citation-grade" result). Delete this guess
// the moment a real citation arrives, positive or negative.

test('jol 20-99 compound: guessed shape is fused, no dot (pattern from sak/rong/bol/king/ge/te)', () => {
  assert.equal(buildClassifierPhrase('jol', 20), 'jolkolgrik');
  assert.equal(buildClassifierPhrase('jol', 25), 'jolkolgrikbonga');
  assert.equal(buildClassifierPhrase('jol', 41), 'jolsotbrisa');
});

test('isUnverifiedCompoundGuess: true for jol at n>19, false for jol at n<20 and for any confirmed classifier', () => {
  assert.equal(isUnverifiedCompoundGuess('jol', 25), true);
  assert.equal(isUnverifiedCompoundGuess('jol', 15), false); // n<20 isn't a compound at all
  assert.equal(isUnverifiedCompoundGuess('mang', 25), false); // confirmed, not a guess
  assert.equal(isUnverifiedCompoundGuess('gong', 25), false); // confirmed, not a guess
  assert.equal(isUnverifiedCompoundGuess('se', 25), false); // still fully unconfirmed, no guess exists for it
});

test('translate: a guessed jol count is tagged distinctly, never indistinguishable from a cited classifier result', async () => {
  const r = await translate('25 bamboos');
  assert.equal(r.garo, 'wa· jolkolgrikbonga');
  assert.equal(r.method, 'classifier-unverified-guess');
  assert.equal(r.confidence, 0.75);
});

test('regression guard: jol at n=1 (the actually-cited form) is unaffected -- still full-confidence classifier', async () => {
  const r = await translate('one bamboo');
  assert.equal(r.garo, 'wa· jolsa');
  assert.equal(r.method, 'classifier');
  assert.equal(r.confidence, 0.96);
});

test('regression guard: mang/gong/sak 20-99 counts are unaffected by the jol guess path -- still full-confidence classifier', async () => {
  const dog = await translate('41 dogs');
  assert.equal(dog.garo, 'achak mangsotbrisa');
  assert.equal(dog.method, 'classifier');
  assert.equal(dog.confidence, 0.96);

  const coin = await translate('41 coins');
  assert.equal(coin.garo, 'tangka bisil gong·sotbrisa');
  assert.equal(coin.method, 'classifier');
  assert.equal(coin.confidence, 0.96);
});

test('regression guard: se remains fully unconfirmed at n>19 -- no guess exists for it, still null/[UNKNOWN]', () => {
  assert.equal(buildClassifierPhrase('se', 25), null);
});
