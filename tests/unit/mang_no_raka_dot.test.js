import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import { countNoun } from '../../src/garo_classifier.js';

// Owner-confirmed 2026-09-13 (live chat, direct Thangseng citation):
// "Ango na·tok manggittam donga" = "I have three fish" -- mang (the
// animals classifier: dog/bird/fish/cat/etc) has NO raka dot. Explicitly
// checked whether the missing dot was a real point vs. a typing/relay
// artifact (the '·' character is easy to drop when typing casually) --
// Owner confirmed "Real — mang genuinely has no raka dot, full stop".
// This reverses 'mang' membership in RAKA_CLASSIFIERS.
//
// Scope note: this only fixes the runtime classifier-composition
// fallback (used when no literal dictionary entry exists for a given
// noun+count). It does NOT retroactively correct the large number of
// existing master_dictionary.json rows that still literally store the
// old dotted 'mang·' form as a hardcoded string -- that's a separate,
// much larger data-correction pass, flagged for a dedicated audit, not
// attempted here.

test('mang (animals) classifier composition has no raka dot', () => {
  assert.equal(countNoun('na·tok', 3, 'fish'), 'na·tok manggittam');
  assert.equal(countNoun('achak', 1, 'dog'), 'achak mangsa');
  assert.equal(countNoun('do·a', 10, 'bird'), 'do·a mangchiking');
});

test('translate: fallback composition (no exact-phrase entry) surfaces the no-dot mang form end-to-end', async () => {
  const r = await translate('six dogs');
  assert.equal(r.method, 'classifier');
  assert.equal(r.garo, 'achak mangdok');
});

test('other raka classifiers (king, ge, gong) are unaffected by the mang fix', () => {
  assert.equal(countNoun('ki·tap', 3, 'book'), 'ki·tap king·gittam');
  assert.equal(countNoun('tangka', 5, 'coin'), 'tangka gong·bonga');
  assert.equal(countNoun('kolom', 2, 'pen'), 'kolom ge·gni');
});
