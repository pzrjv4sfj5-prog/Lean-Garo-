import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';

const compiled = JSON.parse(fs.readFileSync(new URL('../../src/compiled_dict.json', import.meta.url)));

// RC-CANDIDATE-037: bulk-generated "two X"/"three X"/"twelve X"/"thirteen X"
// entries in garo_dictionary.json and master_dictionary.json wrongly used
// "do·o" (chicken/bird) or "na·tok" (fish) as a filler for nouns that have
// nothing to do with birds or fish - e.g. "two teachers" compiled to
// "do·o skigipa·gni" instead of "skigipa·gni". For animal-classifier nouns
// where the correct noun was entirely absent (not just prefixed), the
// erroneous do·o/na·tok stood in for the missing noun itself and needed
// replacement, not just removal (dog -> achak, cat -> menggo, both
// independently confirmed via their own standalone dictionary entries).
test('RC-CANDIDATE-037: non-bird/fish nouns no longer carry a stray do·o/na·tok prefix', () => {
  const shouldNotStartWithDoO = [
    'two teachers', 'two books', 'two persons', 'two students',
    'two houses', 'two trees', 'two cars',
  ];
  for (const k of shouldNotStartWithDoO) {
    const v = compiled[k];
    assert.ok(v, `expected a compiled entry for "${k}"`);
    assert.ok(!/^do·o\s/i.test(v), `"${k}" still starts with stray "do·o": ${v}`);
  }

  const shouldNotStartWithNaTok = ['three persons', 'three teachers'];
  for (const k of shouldNotStartWithNaTok) {
    const v = compiled[k];
    assert.ok(v, `expected a compiled entry for "${k}"`);
    assert.ok(!/^na·tok\s/i.test(v), `"${k}" still starts with stray "na·tok": ${v}`);
  }
});

test('RC-CANDIDATE-037: dog/cat entries get the correct noun substituted, not just stripped', () => {
  assert.equal(compiled['two dogs'], 'achak mang·gni');
  // "three dogs" was corrected 2026-08-09 (NV-071 follow-up, Thangseng
  // direct) from the shared-with-"two" placeholder to the numerically
  // correct achak+mang·+gittam('three') form. "three cat" was closed the
  // same way 2026-08-11 (Thangseng direct, WhatsApp relay via Tridip):
  // 'three cat'=Menggo mang·gittam, confirming the identical mang·gittam
  // pattern for the cat root.
  assert.equal(compiled['three dogs'], 'achak mang·gittam');
  assert.equal(compiled['two cat'], 'menggo mang·gni');
  assert.equal(compiled['three cat'], 'menggo mang·gittam');
});

test('RC-CANDIDATE-037: genuine bird/chicken/fish entries are unaffected', () => {
  assert.equal(compiled['two birds'], 'do·o mang·gni');
  assert.equal(compiled['three fish'], 'na·tok mang·gni');
});
