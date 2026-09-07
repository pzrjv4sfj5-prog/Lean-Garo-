import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Bug B part 1 fix (2026-09-07, Claude B — docs/
// CLAUDE_B_SESSION_MIGRATION_20260907B.md, open item 2). Root cause, fully
// traced this session (not just the "it's" contraction the prior migration
// doc described — the same defect fires for uncontracted "it is X" too):
// "it"/"its" are STOP_WORDS members (needed for dummy-it constructions like
// "it is hot"/"it is raining"). translationEngine.js's stopword-strip
// cascade step joins all non-stopword words into one string and does a
// single lookupGaro() call on it. For "it is eating"/"it's eating", once
// "it"/"is" are stripped, "eating" alone remains — and "eating" has its own
// exact dictionary entry ("cha·enga"), so this step short-circuits with a
// confident result BEFORE grammar-assembly or sov-assembly ever run, both
// of which already resolve "it" as subject correctly via PRONOUN_MAP when
// given the chance (confirmed: "it eats"/"it runs" were never affected,
// since "eats"/"runs" have no exact single-word entry to false-positive
// against, so those already reached grammar-assembly naturally).
//
// Fix, two parts:
// 1. translationEngine.js expands "it's" -> "it is" on `cleaned`, before
//    apostrophe-stripping, so it's distinguishable from true possessive
//    "its" (which never carries an apostrophe in correct input) all the
//    way through the pipeline. Possessive "its" is completely untouched.
// 2. The stopword-strip step keeps sentence-initial "it" in the joined
//    string it looks up, defeating the false-positive short-circuit the
//    same way "hes eating"/"shes eating" already naturally avoid it (their
//    joined strings were never real dictionary phrases either).
//
// "he's"/"she's" are deliberately untouched by this fix and unaffected by
// it — confirmed separately they already resolve correctly via
// sov-assembly's own generic s$-strip fallback (lookupGaro("hes"
// .replace(/s$/,'')) => lookupGaro("he") => "Ua"), a pre-existing accident
// of that fallback, not a bug, and included below only as a regression
// guard.

test('it is eating -> subject "Ua" present (contraction form)', async () => {
  const { garo } = await translate("it's eating");
  assert.match(garo, /^Ua\s/);
});

test('it is eating -> subject "Ua" present (uncontracted form, same defect class)', async () => {
  const { garo } = await translate('it is eating');
  assert.match(garo, /^Ua\s/);
});

test('regression guard: "it eats" (already correct pre-fix) still correct', async () => {
  const { garo } = await translate('it eats');
  assert.match(garo, /^Ua\s/);
});

test('regression guard: "it runs" (already correct pre-fix) still correct', async () => {
  const { garo } = await translate('it runs');
  assert.match(garo, /^Ua\s/);
});

test('regression guard: dummy-it "it is raining" still drops subject (unaffected, caught earlier in cascade)', async () => {
  const { garo, method } = await translate('it is raining');
  assert.equal(method, 'correction');
  assert.doesNotMatch(garo, /^Ua\s/);
});

test('regression guard: dummy-it "it is hot" still drops subject (unaffected, caught earlier in cascade)', async () => {
  const { garo } = await translate('it is hot');
  assert.doesNotMatch(garo, /^Ua\s/);
});

test('regression guard: true possessive "its" is not misread as subject "it"', async () => {
  const { garo } = await translate('its color is red');
  // Possessive "its" must never trigger the subject-pronoun path — no
  // "Ua" injected as if "it" were the sentence's subject.
  assert.doesNotMatch(garo, /^Ua\s/);
});

test('regression guard: "he\'s eating" unaffected by this fix', async () => {
  const { garo } = await translate("he's eating");
  assert.equal(garo, 'Ua cha·enga');
});

test('regression guard: "she\'s eating" unaffected by this fix', async () => {
  const { garo } = await translate("she's eating");
  assert.equal(garo, 'Ua cha·enga');
});

test('regression guard: ordinary sentence "i eat rice" unaffected', async () => {
  const { garo } = await translate('i eat rice');
  assert.equal(garo, 'Anga mi·ko Cha·a');
});
