import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Engineering fix, 2026-09-08 (Claude B), per AGENT_A_B_C_LANGUAGE_ENGINEERING_
// HANDOFF_20260908.json v2026-09-08.2 / Claude C's forensic audit.
//
// Root cause (boy/girl): master_dictionary.json carried two independently
// "variant/VERIFIED/HIGH"-tagged rows for the same key ('boy'/'me·a bi·sa',
// citation NV-130, and 'Boy'/'ko·ka', uncited) with no distinguishing
// evidence signal pickPrimary could use — so its verified-variant-tie
// fallback (last-write-wins by file order) silently picked the uncited
// 'ko·ka'/'ko·ki' every compile. phrase_maps.js independently hardcoded the
// same stale 'ko·ka'/'ko·ki' values, which would have kept resurrecting
// them at runtime even after a pure master_dictionary.json fix.
//
// Fix: removed the uncited 'Boy'/ko·ka and 'Girl'/ko·ki rows from
// master_dictionary.json (re-tagged SUPERSEDED, per the handoff's explicit
// old_live_values_to_remove authorization — not a new linguistic call),
// leaving 'me·a bi·sa'/'me·chik bi·sa' as the sole verified-variant
// candidate so pickPrimary's single-candidate branch wins outright. Also
// updated phrase_maps.js's hardcoded 'boy'/'girl' entries to match, so
// that source layer can't resurrect the stale values independently.

test('"boy" resolves to the NV-130-cited me·a bi·sa (input->old->new)', async () => {
  // input: "boy" -> old output: "ko·ka" (stale, uncited tie-winner) -> new output:
  const result = await translate('boy');
  assert.equal(result.garo, 'me·a bi·sa');
});

test('"girl" resolves to the NV-130-cited me·chik bi·sa (input->old->new)', async () => {
  // input: "girl" -> old output: "ko·ki" (stale, uncited tie-winner) -> new output:
  const result = await translate('girl');
  assert.equal(result.garo, 'me·chik bi·sa');
});

test('capitalized "Boy"/"Girl" case-variant inputs also resolve correctly (no case-collision resurrection)', async () => {
  const boy = await translate('Boy');
  const girl = await translate('Girl');
  assert.equal(boy.garo, 'me·a bi·sa');
  assert.equal(girl.garo, 'me·chik bi·sa');
});

test('bi·sa is preserved (not stripped) in the boy/girl compounds', async () => {
  const boy = await translate('boy');
  const girl = await translate('girl');
  assert.ok(boy.garo.includes('bi·sa'), `expected 'bi·sa' preserved, got "${boy.garo}"`);
  assert.ok(girl.garo.includes('bi·sa'), `expected 'bi·sa' preserved, got "${girl.garo}"`);
});

test('stale ko·ka/ko·ki can never resurface for "boy"/"girl"', async () => {
  const boy = await translate('boy');
  const girl = await translate('girl');
  assert.ok(!boy.garo.includes('ko·ka'), `expected no stale 'ko·ka', got "${boy.garo}"`);
  assert.ok(!girl.garo.includes('ko·ki'), `expected no stale 'ko·ki', got "${girl.garo}"`);
});

test('kitten (menggo bi·sa family) is unaffected by the boy/girl fix', async () => {
  const result = await translate('kitten');
  assert.ok(result.garo.includes('bi·sa'), `expected 'bi·sa' preserved, got "${result.garo}"`);
});

// Married/elderly reachability fix. Root cause: the verified compound
// answers ('married or elderly woman' -> Me·chikma, 'married or elderly
// man' -> me·apa, both NV-130) existed only under their full compound
// English key — natural split phrasings ("married woman", "elderly
// woman", "married man", "elderly man") had no lookup path to them and
// fell through to the weaker sov-assembly fallback. Fix: added
// corrections.json aliases for the four split phrasings, pointing at the
// existing approved Garo forms — no new linguistic form invented.

test('"married woman" reaches the approved Me·chikma (input->old->new)', async () => {
  // input: "married woman" -> old output: unreachable, fell through to sov-assembly -> new output:
  const result = await translate('married woman');
  assert.equal(result.garo, 'Me·chikma');
});

test('"elderly woman" reaches the approved Me·chikma', async () => {
  const result = await translate('elderly woman');
  assert.equal(result.garo, 'Me·chikma');
});

test('"married man" reaches the approved me·apa (input->old->new)', async () => {
  // input: "married man" -> old output: unreachable, fell through to sov-assembly -> new output:
  const result = await translate('married man');
  assert.equal(result.garo, 'me·apa');
});

test('"elderly man" reaches the approved me·apa', async () => {
  const result = await translate('elderly man');
  assert.equal(result.garo, 'me·apa');
});

test('the original compound phrasings still resolve correctly (no regression)', async () => {
  const woman = await translate('married or elderly woman');
  const man = await translate('married or elderly man');
  assert.equal(woman.garo, 'Me·chikma');
  assert.equal(man.garo, 'me·apa');
});

// Regression protection for adjacent approved native examples, per the
// handoff's explicit regression list — confirming this session's changes
// didn't disturb any of them.

test('"sit" still resolves to aonga', async () => {
  const result = await translate('sit');
  assert.equal(result.garo, 'aonga');
});

test('"sitting" still resolves to asongenga', async () => {
  const result = await translate('sitting');
  assert.equal(result.garo, 'asongenga');
});

test('"can" still resolves to man·a', async () => {
  const result = await translate('can');
  assert.equal(result.garo, 'man·a');
});

test('"need" still resolves to nanga', async () => {
  const result = await translate('need');
  assert.equal(result.garo, 'nanga');
});
