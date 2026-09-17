import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Bug 2 fix (2026-09-16, Claude B): the sak (person) 20-99 compound
// surface form ("Chattro saksotbri sa") had been assumed to generalize
// to every other classifier by blindly substituting the classifier name
// into the same template. It doesn't -- the old code fused the tens
// multiplier word straight onto other classifiers with leftover
// capitalization and an inconsistent raka dot from that word's own
// dictionary casing ("gari bolSotbri·sa" for "41 cars"). Nobody had
// confirmed whether non-sak classifiers even use a spaced or fused
// 20-99 form at all.
//
// Live Thangseng citations (relayed by Project Owner in chat) now
// confirm four classifiers specifically -- and they do NOT all share
// one shape:
//   sak (person): fused, no raka dot  -- "saksotbrisa"
//   mang (animal): fused, WITH a raka dot -- "mang·sotbrisa"
//   rong (fruit): fused, no raka dot  -- "rongkolgrikbonga"
//   gong (money): fused, WITH a raka dot -- "gong·sotbrisa" (2026-09-17)
// Every other classifier (bol/king/ge/jol/se/te/...) remains
// unconfirmed for n>19; the fix makes those fall through to the
// engine's existing morphology fallback ('[UNKNOWN] <word>') instead of
// shipping a fabricated/garbled compound -- Bug 2 is only partially
// closed by this fix, not fully generalized.

test('translate: sak 20-99 compound is fused with no raka dot, no space', async () => {
  const r = await translate('41 students');
  assert.equal(r.method, 'classifier');
  assert.equal(r.garo, 'chattro saksotbrisa');
});

test('translate: mang 20-99 compound is fused WITH a raka dot (distinct from sak/rong)', async () => {
  const r = await translate('41 dogs');
  assert.equal(r.method, 'classifier');
  assert.equal(r.garo, 'achak mang·sotbrisa');
});

test('translate: rong 20-99 compound is fused with no raka dot', async () => {
  const r = await translate('25 mangoes');
  assert.equal(r.method, 'classifier');
  assert.equal(r.garo, 'te·gatchu rongkolgrikbonga');
});

test('translate: gong 20-99 compound is fused WITH a raka dot', async () => {
  const r = await translate('41 coins');
  assert.equal(r.method, 'classifier');
  assert.equal(r.garo, 'tangka bisil gong·sotbrisa');
});

test('regression guard: an unconfirmed classifier at n>19 no longer ships a garbled fabricated form', async () => {
  const r = await translate('41 cars');
  // Must not contain a mid-word capital letter or a spurious raka dot
  // from the old bug -- either it honestly surfaces [UNKNOWN], or some
  // future confirmed fix legitimately changes this; either way it must
  // never again be "gari bolSotbri·sa".
  assert.notEqual(r.garo, 'gari bolSotbri·sa');
  assert.doesNotMatch(r.garo, /[a-z][A-Z]/, `expected no mid-word capital letter, got: ${r.garo}`);
});

test('regression guard: sak/mang/rong counts under 20 are unaffected by the compound fix', async () => {
  const student = await translate('three students');
  assert.equal(student.garo, 'Chattro sakgittam');
  const dog = await translate('three dogs');
  assert.equal(dog.garo, 'achak manggittam');
});
