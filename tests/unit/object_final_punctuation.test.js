import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Fix (2026-09-16, Claude B), from Claude A's diagnosis in
// docs/CLAUDE_B_HANDOFF_20260913_object_question_UNKNOWN.md.
//
// Root cause: src/grammarEngine.js's object-extraction loop pushed the
// raw, unstripped token onto objectWords. Every other extraction point
// in that file cleans the word it matches against before use, but this
// was the one place the raw token reached dictionary lookup. When the
// object was the sentence-final word it still carried the trailing '?',
// so lookupGaro("rice?") failed, object.garo became '[UNKNOWN]',
// sentenceBuilder.js bailed (`if (result.includes('[UNKNOWN]')) return
// null`), and translate() fell through to the much weaker
// assembleSentenceSOV fallback, which has no question-marking at all —
// silently discarding the '?' and the interrogative suffix even though
// subject/verb/tense/isQuestion were all already correctly detected.
//
// Live-confirmed before this fix: translate("did you eat rice?")
// returned {garo: "Na·a Mi Cha·a", method: "sov-assembly", confidence:
// 0.75} — no question mark, no interrogative suffix. "did you eat?"
// (no object) was unaffected, since it has no sentence-final object
// word to corrupt.
//
// Fix: strip trailing sentence punctuation (?.!,;:) from each object
// token before it's pushed. '·' is deliberately NOT stripped — it's a
// real character in Garo dictionary keys — and no other internal
// punctuation is touched, since contractions/hyphens inside a word are
// real vocabulary, not noise.
//
// Suffix note: '-hama' for "eat" (not '-gama') is Owner-confirmed
// natively attested (Na·a Mi Cha·ahama?), both with and without an
// object. See §7 of docs/CLAUDE_B_SESSION_MIGRATION_20260916.md.

test('translate: sentence-final object with "?" now composes via grammar-assembly, not sov-assembly', async () => {
  const rice = await translate('did you eat rice?');
  assert.equal(rice.method, 'grammar-assembly');
  assert.ok(rice.garo.endsWith('ma?'), `expected question form, got "${rice.garo}"`);
  assert.match(rice.garo, /Cha·aha/, 'expected the -hama eat-suffix, not a dropped/alternate form');

  const water = await translate('did you eat water?');
  assert.equal(water.method, 'grammar-assembly');
  assert.ok(water.garo.endsWith('ma?'), `expected question form, got "${water.garo}"`);
});

test('regression guard: object-less questions are unaffected by the fix', async () => {
  const noObject = await translate('did you eat?');
  assert.equal(noObject.garo, 'Na·a Cha·ahama?');
});

test('regression guard: a corrections.json-shortcircuited question is unaffected by the fix', async () => {
  // "did you drink water?" never reaches the buggy grammarEngine path at
  // all — a corrections.json override short-circuits before grammar-
  // assembly — so it must keep behaving exactly as before.
  const drink = await translate('did you drink water?');
  assert.equal(drink.method, 'correction');
  assert.equal(drink.garo, 'Na·a Chi Ringahama?');
});

test('regression guard: sentence-final object in a non-question sentence is unaffected', async () => {
  const school = await translate('is he going to school?');
  assert.ok(!school.garo.includes('[UNKNOWN]'), `expected no [UNKNOWN], got "${school.garo}"`);
  assert.ok(school.garo.endsWith('ma?'), `expected question form, got "${school.garo}"`);
});
