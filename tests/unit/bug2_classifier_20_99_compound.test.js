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
// Live Thangseng citations (relayed by Project Owner in chat, then
// direct doc upload 2026-09-18) confirm several classifiers -- and they
// do NOT all share one shape:
//   sak (person): fused, no raka dot  -- "saksotbrisa"
//   mang (animal): fused, WITH a raka dot -- "mang·sotbrisa"
//   rong (fruit): fused, no raka dot  -- "rongkolgrikbonga"
//   bol/king/ge/te: fused, no raka dot (2026-09-18, Counting_docx_
//     thanseng.docx) -- e.g. "bolsotbrisa", "tesotbrisa"
// gong is UNRESOLVED, not confirmed: the 2026-09-17 chat-relayed
// citation gave "gong·sotbrisa" (WITH dot), but the 2026-09-18 doc
// upload gives "gongsotbrisa" (NO dot) for the same fact (41 coins).
// Two purported Thangseng sources disagree -- gong deliberately falls
// through to the morphology fallback below pending direct
// clarification, rather than either source being picked as a guess.
// jol/se remain fully unconfirmed (not in either source) and also fall
// through to the same fallback.

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

test('translate: gong 20-99 compound is RESOLVED 2026-09-19 (Owner decision between the two conflicting citations, no dot) -- see garo_classifier.js comment for the full reasoning', async () => {
  const r = await translate('41 coins');
  assert.equal(r.method, 'classifier');
  assert.equal(r.garo, 'tangka bisil gongsotbrisa');
});

test('regression guard: bol (now confirmed, 2026-09-18) no longer ships the old garbled fabricated form', async () => {
  const r = await translate('41 cars');
  // Old bug shape, must never reappear:
  assert.notEqual(r.garo, 'gari bolSotbri·sa');
  assert.doesNotMatch(r.garo, /[a-z][A-Z]/, `expected no mid-word capital letter, got: ${r.garo}`);
  // Now confirmed (see bol_king_ge_te_compound.test.js): fused, no dot.
  assert.equal(r.method, 'classifier');
  assert.equal(r.garo, 'gari bolsotbrisa');
});


test('regression guard: sak/mang/rong counts under 20 are unaffected by the compound fix', async () => {
  const student = await translate('three students');
  assert.equal(student.garo, 'Chattro sakgittam');
  const dog = await translate('three dogs');
  assert.equal(dog.garo, 'achak manggittam');
});
