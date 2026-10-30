// NV-197 (2026-10-25): Thangseng's raw reply relayed by the Project Owner.
// Apostrophes in Garo are raka typos (a'palo = a·palo). Past sense via context is NOT a general rule.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import master from '../../master_dictionary.json' with { type: 'json' };

const cases = [
  ['What did you do?', 'Na·a maiko daka?'],
  ['What did you do yesterday?', 'Na·a mijalo maiko daka?'],
  ['Why did you avoid me yesterday?', 'Mijalo na·a maina angko gela?'],
  ['mountain', 'ha·bri'],
  ['lips', 'ku·chil'],
];
for (const [en, garo] of cases) {
  test(`NV-197: ${en}`, async () => {
    assert.equal((await translate(en)).garo, garo);
  });
}
test('NV-197: no Garo master row keeps an apostrophe inside a word (English "don\'t do" row excepted)', () => {
  const bad = master.filter(r => /[A-Za-z·]['’‘`´ʼ][A-Za-z]/.test(r.garo || '') && !/\b\w+n['’]t\b/i.test(r.garo));
  assert.deepEqual(bad.map(r => r.garo), []);
});
test('NV-197: past wh-question rule stays NV-194 only (no general contextual-tense rule)', async () => {
  assert.equal((await translate('I ate yesterday')).garo, 'Mijalo anga cha·aha');
});
