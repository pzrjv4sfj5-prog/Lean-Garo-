import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Bug A fix (2026-09-07, Claude B — docs/
// CLAUDE_B_TRACE_INTENSIFIER_ADJECTIVE_20260907.md, open item 1 of
// docs/CLAUDE_B_SESSION_MIGRATION_20260907.md). The grammar-assembly
// verb-finding loop had no restriction against electing a non-verb
// dictionary word as the finite verb — intensifiers like "very" have
// their own real dictionary entry ("very"->"namen"), so they were
// wrongly elected as the verb before the loop ever reached the real
// predicate adjective, stranding the adjective as a leftover object
// with an incorrectly-applied -ko marker. Fixed via INTENSIFIER_WORDS
// (normalizationEngine.js), the same closed-class-table discipline as
// STOP_WORDS/AUXILIARY_SKIP, applied to both the verb-finding loop and
// the object-extraction loop.
//
// Deliberately uses "cold"/"tired"/"happy", NOT "hot" — "it is very
// hot [today]" is covered by tryVeryHotConstruction (an exact,
// narrowly-scoped construction match), which fires before grammar-
// assembly and would mask whether this general fix works on its own.
// These sentences never match that construction's regex, so they
// exercise the verb-finding loop directly.
//
// What correct Garo word order/placement for "very" is in these
// non-"hot" sentences remains open (word-order generalization beyond
// the one attested "very hot" sentence is explicitly blocked per
// Project Owner instruction pending further native evidence — item 3
// of the 20260907 migration doc). This test only asserts the
// verb-election defect itself is fixed: the real predicate adjective
// is found as the verb, and no -ko marker is wrongly applied to
// "very"/"too"/"really".

test('"it is very cold" elects the real predicate ("cold") as the verb, not "very"', async () => {
  const r = await translate('it is very cold');
  assert.ok(r.garo.includes('Sin\u00b7a'), `expected the real predicate "cold"=Sin\u00b7a in output, got: ${r.garo}`);
  assert.ok(!r.garo.includes('namen'), `intensifier "very"=namen must not be wrongly elected as verb, got: ${r.garo}`);
  assert.ok(!r.garo.includes('-ko') && !r.garo.includes('\u00b7ko'), `must not carry an object marker, got: ${r.garo}`);
});

test('"it is too tired" elects the real predicate ("tired") as the verb, not "too"', async () => {
  const r = await translate('it is too tired');
  assert.ok(r.garo.includes('nenga'), `expected the real predicate "tired"=nenga in output, got: ${r.garo}`);
  assert.ok(!r.garo.includes('\u00b7ko'), `must not carry an object marker, got: ${r.garo}`);
});

test('"she is really happy" elects the real predicate ("happy") as the verb, not "really"', async () => {
  const r = await translate('she is really happy');
  assert.ok(r.garo.includes('kusi'), `expected the real predicate "happy" in output, got: ${r.garo}`);
  assert.ok(!r.garo.includes('\u00b7ko'), `must not carry an object marker, got: ${r.garo}`);
});

test('regression guard: ordinary object sentences are unaffected by the intensifier guard', async () => {
  const r = await translate('i eat rice');
  assert.equal(r.garo, 'Anga mi\u00b7ko Cha\u00b7a');
});

test('regression guard: "it is very hot" (attested construction) is unaffected by this fix', async () => {
  const r = await translate('it is very hot');
  assert.equal(r.garo, 'namen Ding\u00b7a');
  assert.equal(r.method, 'very-hot-construction');
});
