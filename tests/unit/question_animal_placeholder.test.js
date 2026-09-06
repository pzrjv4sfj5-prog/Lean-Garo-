import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Handoff B item 6 (docs/HANDOFF_CLAUDE_B_20260906.md, root-caused and
// closed 2026-09-06 Claude B). "where is the cat?" -> "kade mang?" — mang
// is the bare animal-classifier morpheme, not a translation of "cat".
// Root cause traced: master_dictionary.json had 36 unverified, uncited
// literal phrase-table rows for every {what/where/when/why/how/who/
// which/how many/how much} x {cat/dog/bird/fish} combination, all using
// the generic classifier placeholder "mang" instead of the real
// species noun. These literal rows intercepted input via the
// stopword-stripped/exact-phrase path before it ever reached the working
// sov-assembly composition that animals WITHOUT such a row (cow, goat,
// etc.) already use correctly. Fixed by marking the 36 rows superseded
// (no native citation existed to correct them against) so sov-assembly
// composes these the same way cow/goat already do.

test('"where is the cat?" no longer outputs the bare classifier morpheme "mang"', async () => {
  const r = await translate('where is the cat?');
  assert.notEqual(r.garo, 'kade mang?');
  assert.ok(r.garo.includes('Menggo'), `expected the real cat root (Menggo) in output, got: ${r.garo}`);
});

test('question-word + animal composes with the real species root for cat/dog/bird/fish', async () => {
  const cases = [
    ['what is the dog?', 'Achak'],
    ['when is the bird?', 'do·o'],
    ['who is the fish?', 'na·tok'],
    ['which is the cat?', 'Menggo'],
  ];
  for (const [input, expectedRoot] of cases) {
    const r = await translate(input);
    assert.ok(r.garo.includes(expectedRoot), `"${input}" -> "${r.garo}" missing expected root "${expectedRoot}"`);
    assert.ok(!r.garo.includes('mang'), `"${input}" -> "${r.garo}" still leaks the generic "mang" placeholder`);
  }
});

// Regression guard: animals that already composed correctly (no bad
// placeholder row existed for them) must be unaffected.
test('cow/goat question composition is unaffected (regression guard)', async () => {
  const cow = await translate('where is the cow?');
  assert.equal(cow.garo, 'Bano ma·su');
});
