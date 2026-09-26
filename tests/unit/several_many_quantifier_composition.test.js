// several_many_quantifier_composition.test.js
//
// History (all same session, 2026-09-26):
// 1. Claude B, chat: "several/many is also bang·a, like we used for pig fat
//    statement" -> 'several' set to bang·a (matching 'many' at the time).
// 2. While investigating, found and fixed the real root cause of the open
//    composition-gap item from docs/CLAUDE_B_SESSION_MIGRATION_20260925.md:
//    grammarEngine.js's multi-word object resolver only kept the LAST
//    word's translation when every word in the object phrase resolved
//    individually — any leading modifier was silently dropped with no
//    [UNKNOWN] trace. Confirmed live before that fix: "i have several/many
//    books" and even "i have good/big books" all produced "Angao ki·tap
//    donga" — the modifier fully vanished.
// 3. Investigating a follow-up word-order bug ("she has several dogs" /
//    "we have many students" producing wrong order via a different, buggy
//    fallback path — sov-assembly), also fixed: plural object nouns with
//    no direct dictionary entry (only the singular does) now resolve via
//    garo_classifier.js's singularize(), so these sentences succeed in
//    grammar-assembly and never reach sov-assembly at all.
// 4. Native-speaker correction from Thangseng in chat superseded step 1:
//    "i have several books" -> "Ango adita ki.taprang donga" (several =
//    adita, not bang·a) and "we have many students" -> "Chingo bang·a
//    chattrorang donga" (confirming many = bang·a is correct). Then
//    superseded again, same message: "we will use Bang.e instead of
//    adita, log it." -> several = bang·e (not adita, not bang·a).
//
// Current, live state: several = bang·e, many = bang·a. Both are
// recognized by grammarEngine.js's trailing-quantifier composition
// (Noun + quantifier order), which matches the two existing citations
// that already put a quantifier after its noun: "the pork meat has a lot
// of fat" -> "Wak be·en mit·am bang·a" and "so many people came" ->
// "Man·derang bang·e re·baa".
//
// NOT yet addressed (flagged to the Project Owner, awaiting direction,
// not implemented here): Thangseng's own "Ango adita ki.taprang donga"
// example shows the modifier BEFORE the noun and a "-rang" plural suffix
// on the noun, both of which the engine does not currently do anywhere.
// Whether that's a general rule (quantifiers before the noun, plurals
// always take -rang) or specific to "adita" (now superseded) is an open
// question — scope not extended past the bang·e swap until answered.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

test('"i have several books" keeps the quantifier (bang·e), not silently dropped', async () => {
  const r = await translate('i have several books');
  assert.match(r.garo, /bang·e/);
  assert.match(r.garo, /ki·tap/i);
});

test('"i have many books" keeps the quantifier (bang·a), not silently dropped', async () => {
  const r = await translate('i have many books');
  assert.match(r.garo, /bang·a/);
  assert.match(r.garo, /ki·tap/i);
});

test('"several" alone resolves to bang·e via the corrections override', async () => {
  const r = await translate('several');
  assert.equal(r.garo, 'bang·e');
});

test('"many" alone resolves to bang·a via the corrections override', async () => {
  const r = await translate('many');
  assert.equal(r.garo, 'bang·a');
});

test('AI-002 regression guard is untouched: an unresolved object word still surfaces [UNKNOWN]', async () => {
  const r = await translate('i bought a gadget yesterday');
  assert.match(r.garo, /\[UNKNOWN\]/);
});

test('numeral object composition (a different, already-working path) is untouched', async () => {
  const r = await translate('i have three books');
  assert.match(r.garo, /king·gittam/);
});

test('"she has several dogs" uses grammar-assembly with correct SOV order (bang·e), not the sov-assembly fallback', async () => {
  const r = await translate('she has several dogs');
  assert.equal(r.method, 'grammar-assembly');
  assert.equal(r.garo, 'Uao achak bang·e donga');
});

test('"we have many students" uses grammar-assembly with correct SOV order (bang·a), not the sov-assembly fallback', async () => {
  const r = await translate('we have many students');
  assert.equal(r.method, 'grammar-assembly');
  assert.equal(r.garo, 'An·chingo chattro bang·a donga');
});

test('plural object noun with no quantifier still resolves via the singularize fallback ("she has cats")', async () => {
  const r = await translate('she has cats');
  assert.equal(r.method, 'grammar-assembly');
  assert.match(r.garo, /menggo/);
});
