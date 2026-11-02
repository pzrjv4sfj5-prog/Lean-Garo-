// NV-248 (Claude A, 2026-11-01): Thangseng native-validation batch relayed by the Project Owner.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

const PINS = [
  ['eat rice', 'Mi cha·bo'],
  ['drink water', 'Chi ringbo'],
  ['he is running away', 'Ua katangenga'],
  ['i knew it', 'Anga uko hai·aha'],
  ['i brought it', 'Anga uko ra·baaha'],
  ['i will bring it', 'Anga uko ra·bagen'],
  ['are those your dogs?', 'Ua nang·ni achakrangma?'],
  ['is this my house?', 'Ia angni nokma?'],
];
const WORDS = [
  ['vegetables', 'me·su'], ['cabbage', 'banda kobi'], ['promise', 'Ku·rachaka'], ['to promise', 'Ku·rachaka'],
  ['confess', 'Ku·chaka'], ['admit', 'Ku·chaka'], ['respond', 'Ku·chaka'], ['obedient', 'knachakgipa'],
  ['run away', 'katanga'], ['letter', 'chitti'],
];

test('NV-248 exact-phrase pins', async () => {
  for (const [en, ga] of PINS) assert.equal((await translate(en)).garo, ga, en);
});

test('NV-248 vocabulary', async () => {
  for (const [en, ga] of WORDS) assert.equal((await translate(en)).garo, ga, en);
});

test('NV-248 untouched: -ko stays for non-habitual object commands', async () => {
  assert.equal((await translate('read the book')).garo, 'Ki·tapko poraibo');
});
