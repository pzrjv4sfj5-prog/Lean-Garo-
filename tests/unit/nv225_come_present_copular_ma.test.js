// NV-225 (Claude B, 2026-10-29). Thangseng native, tense stated (present):
//   `I come from that house.` = `Anga ua nokoni re·baa.`   (present of `come` is re·baa, NOT re·ba·a; also confirms `-oni` = from)
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
test('NV-225: past / future / negative of come are untouched (no native input yet)', async () => {
  assert.equal((await translate('I will come.')).garo.toLowerCase(), 'anga re·ba·gen');
  assert.equal((await translate('he came here.')).garo.toLowerCase().includes('re·baa'), false);
});
