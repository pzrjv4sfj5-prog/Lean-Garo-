import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
import { countNoun } from '../../src/garo_classifier.js';

// HISTORY (see src/garo_classifier.js RAKA_CLASSIFIERS/CONFIRMED_COMPOUND_CLASSIFIERS
// comments for the full chain): mang has flipped dot-status FOUR times;
// king has flipped twice. Current state, both n<20 and n20-99, per a
// direct Project Owner statement in chat 2026-09-28/29 ("mang·sa not
// mangsa (mang has rakka)... king has a rakka"), given after being shown
// that this reverses a 2026-09-18 Thangseng "No" citation for mang: mang
// and king BOTH carry the raka dot. rong is unaffected (still dot:false,
// also reconfirmed the same message: "rong doesn't have rakka").
//
// KNOWN OPEN GAP, not fixed by this test or by the engine change it
// covers: all 37 verified_high master_dictionary.json rows for mang
// still ship WITHOUT the dot (exact-phrase lookup wins over composition
// for existing dictionary entries), so "one dog" etc. still surface
// without a dot at runtime even though composeNouns/countNoun below now
// produce the dotted form for anything NOT already in the dictionary.
// Flagged for a dedicated data-correction pass, not attempted here --
// see docs/GRAMMAR_RULE_AUDIT_AND_ROADMAP_20260928.md Phase 2.

test('mang (animals) classifier composition takes the raka dot', () => {
  assert.equal(countNoun('na·tok', 3, 'fish'), 'na·tok mang·gittam');
  assert.equal(countNoun('achak', 1, 'dog'), 'achak mang·sa');
  assert.equal(countNoun('do·o', 10, 'bird'), 'do·o mang·chiking');
});

test('king classifier composition takes the raka dot', () => {
  assert.equal(countNoun('ki·tap', 3, 'book'), 'ki·tap king·gittam');
});

test('translate: fallback composition (no exact-phrase entry) surfaces the dotted mang form end-to-end', async () => {
  const r = await translate('six elephants');
  assert.equal(r.method, 'classifier');
  assert.equal(r.garo, 'mongma mang·dok');
});

test('other raka classifiers unaffected by the mang/king fix', () => {
  assert.equal(countNoun('tangka', 5, 'coin'), 'tangka gong·bonga');
  assert.equal(countNoun('kolom', 2, 'pen'), 'kolom ge·gni');
});

test("rong (fruits/roundish/alcohol) remains dot-free -- reconfirmed same message (\"rong doesn't have rakka\")", () => {
  assert.equal(countNoun('te·gatchu', 5, 'mango'), 'te·gatchu rongbonga');
});
