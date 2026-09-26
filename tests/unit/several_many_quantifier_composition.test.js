// several_many_quantifier_composition.test.js
// Claude B, 2026-09-26, Project Owner directive in chat ("several/many is
// also bang·a, like we used for pig fat statement").
//
// Root cause (found while investigating the open composition-gap item from
// docs/CLAUDE_B_SESSION_MIGRATION_20260925.md): grammarEngine.js's
// multi-word object resolver only kept the LAST word's translation when
// every word in the object phrase resolved individually — any leading
// modifier (quantifier or plain adjective) was silently dropped with no
// [UNKNOWN] trace, even though it had a real dictionary translation.
// Confirmed live before this fix: "i have several books" and "i have many
// books" both produced "Angao ki·tap donga" (the quantifier fully gone),
// same for "i have good books"/"i have big books".
//
// Fix scope: narrowly composes Noun + bang·a when the resolved modifier
// immediately before the head noun is exactly 'bang·a' (case-insensitive —
// 'several' resolves via the dictionary as lowercase 'bang·a', 'many' via
// phrase_maps.js as capitalized 'Bang·a'), matching the two existing
// citations that already put a quantifier after its noun: "the pork meat
// has a lot of fat" -> "Wak be·en mit·am bang·a" and "so many people came"
// -> "Man·derang bang·e re·baa". This does NOT attempt general adjective+
// noun object composition (good/big/bad/etc. before a noun) — that remains
// open, is a separate and larger word-order decision, and is unaffected by
// this fix (still drops silently, same as before — see regression case
// below).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

test('"i have several books" keeps the quantifier (was silently dropped)', async () => {
  const r = await translate('i have several books');
  assert.match(r.garo, /bang·a/);
  assert.match(r.garo, /ki·tap/i);
});

test('"i have many books" keeps the quantifier (was silently dropped)', async () => {
  const r = await translate('i have many books');
  assert.match(r.garo, /bang·a/);
  assert.match(r.garo, /ki·tap/i);
});

test('"several" alone still resolves via the corrections override', async () => {
  const r = await translate('several');
  assert.equal(r.garo, 'bang·a');
});

test('AI-002 regression guard is untouched: an unresolved earlier object word still surfaces [UNKNOWN], not a wrongly-substituted later word', async () => {
  const r = await translate('i bought a gadget yesterday');
  assert.match(r.garo, /\[UNKNOWN\]/);
});

test('numeral object composition (a different, already-working path) is untouched', async () => {
  const r = await translate('i have three books');
  assert.match(r.garo, /king·gittam/);
});

// Follow-up fix, same session: "she has several dogs" and "we have many
// students" were producing wrong word order ("Ua donga Achak bang·a" --
// verb before object). Root cause: "dogs"/"students" have no direct
// plural dictionary entry (only the singular does), so this object
// resolver's per-word lookup (no plural stripping) failed on them,
// object.garo became [UNKNOWN], and translate() fell all the way through
// to sov-assembly -- a much weaker fallback whose verb-detection
// heuristic mis-identifies bang·a as the verb (it matches that
// heuristic's generic ·a$ suffix check). Fix: reuse garo_classifier.js's
// existing singularize() as a fallback in this resolver, so these
// sentences now succeed in grammar-assembly (the correct SOV path) and
// never reach sov-assembly at all.
test('"she has several dogs" uses grammar-assembly with correct SOV order, not the sov-assembly fallback', async () => {
  const r = await translate('she has several dogs');
  assert.equal(r.method, 'grammar-assembly');
  assert.equal(r.garo, 'Uao achak bang·a donga');
});

test('"we have many students" uses grammar-assembly with correct SOV order, not the sov-assembly fallback', async () => {
  const r = await translate('we have many students');
  assert.equal(r.method, 'grammar-assembly');
  assert.equal(r.garo, 'An·chingo chattro bang·a donga');
});

test('plural object noun with no quantifier still resolves via the singularize fallback ("she has cats")', async () => {
  const r = await translate('she has cats');
  assert.equal(r.method, 'grammar-assembly');
  assert.match(r.garo, /menggo/);
});
