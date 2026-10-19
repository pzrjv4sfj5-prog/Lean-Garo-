import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// 2026-10-19 (Claude B). Counting a verified attributive phrase row
// ("big dog" = dal·gipa achak) must use the HEAD noun's classifier
// (dog -> mang-), not the generic ge- fallback the whole phrase got
// ("two big dogs" was "dal·gipa achak ge·gni": wrong classifier, same error
// class as the PO's scenario 2). Formula B inside a clause also has to
// accept the adjective ("two big dogs eat rice" was "mi ge·gni", subject
// dropped). Counted -> never -rang.

const CASES = [
  ['two big dogs', 'dal·gipa achak mang·gni'],
  ['three big cats', 'dal·gipa menggo mang·gittam'],
  ['two big books', 'dal·gipa ki·tap king·gni'],
  ['five big birds', 'dal·gipa do·o mang·bonga'],
  ['two big dogs eat rice', 'Dal·gipa achak mang·gni mi·ko Cha·a'],
  ['two big dogs sleep', 'Dal·gipa achak mang·gni Tusia'],
];
for (const [en, garo] of CASES) {
  test(`counted adjective+noun: "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
    assert.ok(!/rang/i.test(r.garo));
  });
}

const UNCHANGED = [
  ['two dogs', 'achak mang·gni'],
  ['two red apples', 'apple ronggni'],
  ['three sugar canes', 'grit ge·gittam'],
  ['two dogs eat rice', 'Achak mang·gni mi·ko Cha·a'],
];
for (const [en, garo] of UNCHANGED) {
  test(`counted adjective guard: "${en}"`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}
