import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// "it's/it is very hot (today)" fix (2026-09-07, Claude B — native
// evidence relayed via Thangseng, see grammarEngine.js's
// tryVeryHotConstruction for the full citation and
// docs/CLAUDE_B_TRACE_INTENSIFIER_ADJECTIVE_20260907.md for the root-
// cause trace this closes). Three previously-broken variations on one
// input concept, now unified under one narrowly-scoped construction:
//
// 1. "it's very hot today" (contraction) previously failed subject
//    detection entirely, rerouting to sov-assembly's ordering-naive
//    fallback: "namen Da·alo Ding·a" (intensifier-time-adjective, wrong).
// 2. "it is very hot today" (full form) previously reached grammar-
//    assembly, whose verb-finding loop wrongly elected the intensifier
//    "very" as the finite verb, stranding "hot" as a leftover object
//    with a wrongly-applied -ko marker AND dropping it from output
//    entirely (only "today" survived, itself wrongly -ko-marked).
// 3. "it is very hot" (no time word) hit the same verb-misidentification
//    bug as #2, keeping "hot" but still with the wrong -ko marker.
//
// Confirmed correct: "Da·alo namen Ding·a" (time-word + intensifier +
// adjective) for the today variant, "namen Ding·a" for the bare variant
// — NOT generalized beyond this exact attested sentence pair per Project
// Owner instruction ("don't assume it generalizes on one example").

test('"it\'s very hot today" (contraction) now composes correctly', async () => {
  const r = await translate("it's very hot today");
  assert.equal(r.garo, 'Da\u00b7alo namen Ding\u00b7a');
});

test('"it is very hot today" (full form) no longer drops "hot" or misapplies -ko', async () => {
  const r = await translate('it is very hot today');
  assert.equal(r.garo, 'Da\u00b7alo namen Ding\u00b7a');
  assert.ok(!r.garo.includes('-ko') && !r.garo.includes('·ko'), `must not carry an object marker, got: ${r.garo}`);
});

test('"it is very hot" (no time word) no longer misapplies -ko', async () => {
  const r = await translate('it is very hot');
  assert.equal(r.garo, 'namen Ding\u00b7a');
  assert.ok(!r.garo.includes('-ko') && !r.garo.includes('·ko'), `must not carry an object marker, got: ${r.garo}`);
});

// Regression guard: this is a narrowly-scoped exact construction, not a
// general intensifier-placement rule — a different adjective/time-word
// must NOT be swept in.
test('regression guard: a different adjective is not swept into this construction', async () => {
  const r = await translate('it is very cold today');
  assert.notEqual(r.method, 'very-hot-construction');
});
