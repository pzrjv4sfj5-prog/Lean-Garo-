import test from 'node:test';
import assert from 'node:assert/strict';
import { countNoun, getClassifier, CLASSIFIER_MAP } from '../../src/garo_classifier.js';

// Direct Thangseng relay, 2026-08-01: fruit and alcohol nouns take the
// 'rong' classifier (roundish-shape class), not the 'ge' general
// fallback previously assumed. Thangseng's own typed examples
// ("rongsa", "rongbonga") carry no raka mark, so rong is a no-raka
// classifier (like jol/sak), unlike ge/gong/mang/king -- mang and king
// reconfirmed WITH the dot 2026-09-28/29, see garo_classifier.js. (sak corrected
// to no-raka 2026-09-03, NV-124 — dictionary data fixed then; engine's
// RAKA_CLASSIFIERS set fixed 2026-09-05, same handoff, see below.)

test('rong classifier: fruit nouns resolve to rong, no raka', () => {
  assert.equal(getClassifier('fruit'), 'rong');
  assert.equal(countNoun('mewa', 4, 'fruit'), 'mewa rongbri');
  assert.equal(countNoun('mewa', 1, 'fruit'), 'mewa rongsa');
});

// CORRECTION (2026-09-13, Claude B, direct Owner chat confirmation):
// the fused "chu rongsa" example above was itself a stale assumption.
// Owner confirmed live: "beer rong sa is correct" (literal space before
// the number), and clarified "beer"/"alcohol" both resolve to the
// single Garo noun chu ("chu is alcohol, it can be beer gin or
// anything") -- so the space applies to chu itself. Owner said "maybe
// water" when asked whether this generalizes to 'chi' (water) too --
// that's not a confirmation, so water/chi deliberately keeps the old
// fused behavior (see SPACED_NOUNS in garo_classifier.js) pending a
// firmer answer. Fruit nouns (mewa/apple/etc, same 'rong' classifier)
// are unaffected -- this is a per-noun exception (SPACED_NOUNS), not a
// change to the classifier's default join rule.
test('rong classifier: alcohol nouns resolve to rong, no raka, WITH a space before the number (chu is the Owner-confirmed exception)', () => {
  assert.equal(getClassifier('alcohol'), 'rong');
  assert.equal(getClassifier('beer'), 'rong');
  assert.equal(countNoun('chu', 1, 'alcohol'), 'chu rong sa');
  assert.equal(countNoun('chu', 5, 'alcohol'), 'chu rong bonga');
  assert.equal(countNoun('chu', 1, 'beer'), 'chu rong sa');
});

test('rong classifier: does not carry raka (·) unlike mang/sak/ge/gong', () => {
  const phrase = countNoun('chu', 5, 'alcohol');
  assert.ok(!phrase.includes('·'), `expected no raka in "${phrase}"`);
});

test('regression: ge fallback still applies to genuinely uncategorized/tool nouns', () => {
  assert.equal(getClassifier('pen'), 'ge');
  assert.equal(countNoun('kolom', 2, 'pen'), 'kolom ge·gni');
});

test('regression: existing classifier roots unaffected by rong addition', () => {
  // mang's dot status has flipped four times total; current state
  // (2026-09-28/29, direct Project Owner statement in chat, shown and
  // overriding a 2026-09-18 Thangseng "No" citation) is WITH the dot --
  // see garo_classifier.js RAKA_CLASSIFIERS comment for the full chain.
  assert.equal(countNoun('achak', 1, 'dog'), 'achak mang·sa');
  // FIXED (NV-124 engine handoff, closed 2026-09-05): 'sak' removed from
  // RAKA_CLASSIFIERS in src/garo_classifier.js, so the classifier-
  // composition fallback (for phrases with no exact dictionary match)
  // now matches the already-corrected dictionary data (no raka dot).
  // Re-confirmed 2026-09-28/29, same message as the mang/king reversal.
  assert.equal(countNoun('mande', 1, 'person'), 'mande saksa');
  // king's dot status flip-flopped twice: added 2026-09-12, removed
  // 2026-09-19 (direct Owner directive: "king doesn't use rakka"),
  // restored 2026-09-28/29 (direct Owner statement in chat, matching
  // all 11 verified_high master_dictionary.json rows for king -- see
  // garo_classifier.js RAKA_CLASSIFIERS comment for the full chain).
  assert.equal(countNoun('ki·tap', 3, 'book'), 'ki·tap king·gittam');
  assert.equal(countNoun('tangka', 5, 'coin'), 'tangka gong·bonga');
  // "do·a" corrected to "do·o" 2026-09-28 (docs/GRAMMAR_RULE_AUDIT_AND_
  // ROADMAP_20260928.md) to match the verified_high dictionary row for
  // "ten birds" -- do·a only survives in a superseded row.
  assert.equal(countNoun('do·o', 10, 'bird'), 'do·o mang·chiking');
});

test('CLASSIFIER_MAP sanity: rong entries present', () => {
  assert.equal(CLASSIFIER_MAP['fruit'], 'rong');
  assert.equal(CLASSIFIER_MAP['apple'], 'rong');
  assert.equal(CLASSIFIER_MAP['chu'], 'rong');
  assert.equal(CLASSIFIER_MAP['alcohol'], 'rong');
});
