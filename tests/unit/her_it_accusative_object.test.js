import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Fix (2026-09-20, Claude B), docs/CLAUDE_B_SESSION_MIGRATION_20260920.md
// §4.1/§6.1. Unblocked by Claude A's uko-vs-Biko content adjudication
// (commit d50a4c0, docs/CLAUDE_A_SESSION_MIGRATION_20260920.md), which
// confirmed 'uko' (VERIFIED/HIGH) as the general 3rd-person accusative
// object form for "him"/"her"/"it", citing docs/GARO_GRAMMAR_REFERENCE.md,
// docs/THANGSENG_RULES_LOOKUP.md, docs/GRAMMAR_CONFIDENCE_MATRIX.md, and
// NV-011 ("Anga uko nika" = "I see it").
//
// Root cause (pre-fix): src/grammarEngine.js's object-extraction loop
// unconditionally skipped any word matching POSSESSIVES or STOP_WORDS,
// with no disambiguation between "her" the possessive determiner ("her
// book") vs. the accusative object pronoun ("marry her"), or "it" the
// demonstrative/stop-word vs. the object pronoun ("help it"). Confirmed
// live pre-fix: "i will help her" -> "Anga dakchakgen" (object silently
// dropped, confidence unchanged at 0.82, no [UNKNOWN] trace).
//
// First fix attempt this session line was reverted mid-session: a scoped
// object-loop fix alone surfaced a second, independent bug — phrase_maps.js
// has a bare 'her': 'Uni' entry mapping to the POSSESSIVE sense only, so
// the naive fix produced a confidently WRONG translation ("Anga Uni
// uni·ko dakchakgen") instead of an honest drop. This version resolves
// 'her'/'it' in true sentence-final object position directly to 'uko',
// bypassing lookupPhrase/lookupGaro entirely for that token so the
// phrase_maps.js collision is never consulted.
//
// A second collision was caught live during THIS fix's own verification:
// a separate, earlier possessive-scan loop in grammarEngine.js matched
// POSSESSIVES['her'] unconditionally anywhere in the sentence, so the
// first working version of this fix produced "Anga Uni uko dakchakgen"
// (stray possessive "Uni" alongside the correct accusative "uko"). Fixed
// by applying the identical sentence-final/no-following-content guard to
// that loop too.
//
// A third thing this fix reuses rather than reinvents: 'uko' is already
// a complete '-ko'-suffixed accusative pronoun (same shape as the
// existing 'Angko' case, docs/CLAUDE_B_SESSION_MIGRATION_20260920.md
// §3.2) — sentenceBuilder.js's objAlreadyMarked exemption was extended to
// 'uko' so the accusative marker isn't doubled ("uko·ko").

test('translate: "her" as a sentence-final accusative object resolves to uko, not dropped', async () => {
  const r = await translate('i will help her');
  assert.equal(r.method, 'grammar-assembly');
  assert.match(r.garo, /\buko\b/, `expected "uko" in the output, got "${r.garo}"`);
  assert.doesNotMatch(r.garo, /uko·ko/, 'accusative marker must not be doubled on uko');
  assert.doesNotMatch(r.garo, /\bUni\b/, 'must not also carry the stray possessive "Uni"');
});

test('translate: "it" as a sentence-final accusative object resolves to uko, not dropped', async () => {
  const r = await translate('i will help it');
  assert.equal(r.method, 'grammar-assembly');
  assert.match(r.garo, /\buko\b/, `expected "uko" in the output, got "${r.garo}"`);
  assert.doesNotMatch(r.garo, /uko·ko/, 'accusative marker must not be doubled on uko');
});

test('regression guard: corrections.json-shortcircuited "her"/"him" sentences are byte-for-byte unaffected', async () => {
  const marry = await translate('i will marry her');
  assert.equal(marry.method, 'correction');
  assert.equal(marry.garo, 'Anga uko kimgen');

  const saw = await translate('i saw him');
  assert.equal(saw.method, 'correction');
  assert.equal(saw.garo, 'Anga uko Nikaha');
});

test('regression guard: him/us/them objects are unaffected by this fix (still ·ko-suffixed, untouched code path)', async () => {
  const him = await translate('i will help him');
  assert.match(him.garo, /bichi·ko/i);

  const us = await translate('i will help us');
  assert.match(us.garo, /chingna·ko/i);

  const them = await translate('i will help them');
  assert.match(them.garo, /uamangna·ko/i);
});

test('regression guard: "me" (angko) object is unaffected by this fix', async () => {
  const r = await translate('i will help me');
  assert.match(r.garo, /\bangko\b/i);
  assert.doesNotMatch(r.garo, /angko·ko/i);
});

test('regression guard: "her" as a possessive determiner is NOT swept into the accusative-object fix', async () => {
  const book = await translate('her book is red');
  assert.match(book.garo, /\bUni\b/, `expected possessive "Uni", got "${book.garo}"`);
  assert.doesNotMatch(book.garo, /\buko\b/, 'possessive "her book" must not resolve to accusative uko');

  const dog = await translate('this is her dog');
  assert.match(dog.garo, /\bUni\b/, `expected possessive "Uni", got "${dog.garo}"`);
});

test('regression guard: "it" as a demonstrative/stop-word is NOT swept into the accusative-object fix', async () => {
  const r = await translate('it is raining');
  assert.doesNotMatch(r.garo, /\buko\b/, `"it is raining" has no object-pronoun "it"; got "${r.garo}"`);
});

test('regression guard: "her" followed by a noun after a transitive verb stays possessive, not accusative', async () => {
  // Adversarial case: "her" is NOT sentence-final here ("book" follows),
  // so this must stay a possessive-style parse, not trip the
  // sentence-final accusative-object branch.
  const r = await translate('i will marry her book');
  assert.match(r.garo, /\bUni\b/, `expected possessive "Uni", got "${r.garo}"`);
});
