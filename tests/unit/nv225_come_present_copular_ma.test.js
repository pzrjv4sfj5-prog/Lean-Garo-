// NV-225 (Claude B, 2026-10-29). Thangseng native, tense stated (present):
//   `I come from that house.` = `Anga ua nokoni re·baa.`   (present of `come` is re·baa, NOT re·baa; also confirms `-oni` = from)
//   `Is that your dog?`       = `Ua nang·ni achakma?`       (yes/no particle -ma suffixed to the predicate noun)
// Thangseng also confirmed the other 13 sentences of the NV-219(B) tense-labelled list exactly as the engine derived them
// (see docs/CLAUDE_B_NV225_NATIVE_CONFIRMATION_20261029.md). Everything marked DERIVED below is rule output, not a native quote.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase().replace(/[.!]$/, '');
for (const [en, garo] of [
  // native
  ['I come from that house.', 'anga ua nokoni re·baa'], ['Is that your dog?', 'ua nang·ni achakma?'],
  // native-confirmed present of `come`, other frames (DERIVED frames, native verb form)
  ['I come.', 'anga re·baa'], ['I come here.', 'anga iachi re·baa'], ['he comes.', 'ua re·baa'],
  // DERIVED: -ma on plural / this / article nouns
  ['Are those your dogs?', 'ua nang·ni achakrangma?'], ['Is this my house?', 'ia angni nokma?'],
  // NOT evidenced: adjective predicate keeps the bare question mark
  ['Is that big?', 'ua dal·a?'],
]) test(`NV-225: ${en}`, async () => assert.equal(await lc(en), garo));
test('NV-225: -ma flags native vs derived', async () => {
  assert.equal((await translate('Is that your dog?')).derived, false);
  assert.equal((await translate('Are those your dogs?')).derived, true);
});
// Project Owner ruling 2026-10-29: the extra raka dot in `re·ba·` forms is wrong. Every tense of `come` is written without it
// (paradigm: re·baa / re·baaha / re·bagen / re·baja / re·babo / re·baenga / re·bana).
for (const [en, garo] of [
  ['I came.', 'anga re·baaha'], ['I will come.', 'anga re·bagen'], ['I do not come.', 'anga re·baja'], ['I will not come.', 'anga re·bajawa'],
  ['I am coming.', 'anga re·baenga'], ['Come!', 're·babo'], ['I want to come.', 'anga re·bana ska'],
  ['the dogs came', 'achakrang re·baaha'], ['friends came', 'cham·e re·baaha'], ['he did not come here', 'ua iachi re·baja'],
]) test(`NV-225 (no extra dot): ${en}`, async () => assert.equal(await lc(en), garo));
test('NV-225: no `re·ba·` (extra dot) anywhere in come output', async () => {
  for (const en of ['I come.', 'I came.', 'I will come.', 'I do not come.', 'I am coming.', 'Come!', 'who came?', 'why did you come', 'I want to come.'])
    assert.ok(!/re·ba·/i.test((await translate(en)).garo), en);
});
