import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import { buildClassifierPhrase, getClassifier, countNoun } from '../../src/garo_classifier.js';

// jol CONFIRMED 2026-09-19 (published Garo dictionary photo): "Jol..,
// A numeral prefix the whole length of bamboo as Wa·a jolsa ra·babo --
// Brings whole length of bamboo." A genuine per-noun classifier (bamboo
// lengths specifically, not a generic fallback), confirmed no-raka-dot
// at n=1: "jolsa", not "jol·sa". The bamboo/wa·a -> jol mapping already
// existed uncited in CLASSIFIER_MAP before this photo; it corroborates
// rather than introduces that mapping. Only n=1 is directly confirmed
// -- the 20-99 compound shape is still uncited (same as 'se'), but as
// of 2026-09-19 ships an Owner-approved UNVERIFIED guess rather than
// null; see jol_compound_unverified_guess.test.js for that path.

test('jol: bamboo classifier, confirmed no raka dot at n=1', () => {
  assert.equal(getClassifier('bamboo'), 'jol');
  assert.equal(buildClassifierPhrase('jol', 1), 'jolsa');
  // 'wa·' matches the project's own already-resolved dictionary noun
  // for bamboo (see translate() test below) -- not the dictionary
  // example sentence's inflected "Wa·a", which carries an extra
  // grammatical suffix beyond the bare noun.
  assert.equal(countNoun('wa·', 1, 'bamboo'), 'wa· jolsa');
});

test('translate: "one bamboo" surfaces the cited jolsa form end-to-end', async () => {
  // Uses the project's own already-resolved dictionary noun for
  // "bamboo" ("wa·") -- the dictionary example sentence "Wa·a jolsa
  // ra·babo" has a trailing "-a" that's a separate grammatical suffix
  // on top of the bare noun, not part of it, so this correctly does
  // NOT hardcode "wa·a" as if it were the bare noun.
  const r = await translate('one bamboo');
  assert.equal(r.garo, 'wa· jolsa');
});

test('jol 20-99 compound: not part of this citation -- now ships an Owner-approved UNVERIFIED guess instead of null, see jol_compound_unverified_guess.test.js', () => {
  assert.equal(buildClassifierPhrase('jol', 25), 'jolkolgrikbonga');
});

test('se remains fully unconfirmed at n>19 -- unaffected by the jol citation (n<20 still ships the flagged default-pattern guess, unchanged, see UNIT_WORDS/CLASSIFIER_MAP comment)', () => {
  assert.equal(buildClassifierPhrase('se', 25), null);
});
