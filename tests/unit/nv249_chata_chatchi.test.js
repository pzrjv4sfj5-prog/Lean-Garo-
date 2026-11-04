// NV-249 (Claude A, 2026-11-01): Thangseng block relayed by the Project Owner.
// chata (no raka) is a homonym: umbrella (n.) and to fit (v.); chat·a (raka) = thick/dull is a different word.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

test('NV-249 chata homonym (umbrella n. / to fit v.)', async () => {
  for (const en of ['umbrella', 'an umbrella', 'to fit', 'fit']) assert.equal((await translate(en)).garo, 'chata', en);
});

test('NV-249 chatchi = kin / relative / clan (no raka)', async () => {
  for (const en of ['kin', 'relative', 'clan']) assert.equal((await translate(en)).garo, 'chatchi', en);
});

test('NV-249 exact pin: what kin are you?', async () => {
  assert.equal((await translate('what kin are you?')).garo, 'Na·a mai chatchi?');
});

test('NV-249 chat·a (raka) stays a different word', async () => {
  assert.equal((await translate('dull')).garo, 'chat·a');
});

// NV-251 (Claude A, 2026-11-01): Owner ruling: teach = Skia (native-verified), Sikie deleted everywhere;
// given words override old ones (umbrella sat·ti, fit legacy words, cabbage Kobi removed).
test('NV-251 teach = Skia; Sikie gone', async () => {
  for (const en of ['teach', 'to teach']) assert.equal((await translate(en)).garo, 'Skia', en);
  assert.equal((await translate('teacher')).garo, 'Skigipa');
});
test('NV-251 cabbage = banda kobi only', async () => {
  assert.equal((await translate('cabbage')).garo, 'banda kobi');
});

// NV-252 (Claude A, 2026-11-01): Owner directive: door = do·ga (overrides do·oga).
test('NV-252 door = do·ga', async () => {
  assert.equal((await translate('door')).garo, 'do·ga');
});

// NV-259 (Claude A, 2026-11-01): Owner: skia is also learn (Skia = teach and learn).
test('NV-259 learn = Skia, same word as teach', async () => {
  for (const en of ['learn', 'to learn', 'teach']) assert.equal((await translate(en)).garo, 'Skia', en);
  assert.equal((await translate('i want to teach')).garo, 'Anga skia·na ska');
  assert.equal((await translate('i want to learn')).garo, 'Anga skia·na ska');
});
