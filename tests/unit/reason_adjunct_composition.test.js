// reason_adjunct_composition.test.js
// Claude B, 2026-09-26. Closes the last open composition-gap item from
// docs/CLAUDE_B_SESSION_MIGRATION_20260925.md.
//
// "for some reason or other" already resolved correctly standalone
// (corrections.json -> "Mainaba"), but embedded in a sentence, "for" is a
// STOP_WORD (silently skipped) and "some"/"reason"/"other" have no
// individual dictionary entries, so the phrase fell into the object slot
// unresolved. Confirmed live before this fix: "he came for some reason or
// other" -> "Ua [UNKNOWN]·ko re·ba·aha".
//
// Fix, per Project Owner directive (Thangseng in chat gave the native
// construction directly): grammarEngine.js now matches the literal
// 5-word phrase "for some reason or other" as a fixed reason-adjunct
// (mirroring this same function's existing "to X" purpose-clause and
// locative-adjunct handling), and sentenceBuilder.js places it right
// before the main verb. This is the embedded-sentence realization, a
// genuinely different Garo form from the standalone "Mainaba" answer-word
// — both are correct in their own context and neither was changed to
// match the other.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

test('"he came for some reason or other" composes the native reason-adjunct form', async () => {
  const r = await translate('he came for some reason or other');
  assert.equal(r.garo, 'Ua maiaba a·selni gimin re·ba·aha');
  assert.equal(r.method, 'grammar-assembly');
});

test('"for some reason or other" alone is unaffected — still the standalone correction', async () => {
  const r = await translate('for some reason or other');
  assert.equal(r.garo, 'Mainaba');
  assert.equal(r.method, 'correction');
});

test('the reason-adjunct generalizes to a different verb ("she left for some reason or other")', async () => {
  const r = await translate('she left for some reason or other');
  assert.match(r.garo, /maiaba a·selni gimin/);
  assert.equal(r.method, 'grammar-assembly');
});

test('regression guard: an unrelated [UNKNOWN] object is untouched by this fix', async () => {
  const r = await translate('i bought a gadget yesterday');
  assert.match(r.garo, /\[UNKNOWN\]/);
});
