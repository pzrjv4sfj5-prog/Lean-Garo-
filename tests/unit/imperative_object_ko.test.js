// NV-229 (Claude A, 2026-10-30): subjectless command with a noun object takes object-before-verb,
// -ko on the noun, and the RULE-029 -bo command. Grammar logic, not a native quote.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

test('VERB the NOUN command -> NOUNko VERB-bo', async () => {
  assert.equal((await translate('read the book')).garo, 'Ki·tapko poraibo');
  assert.equal((await translate('read books')).garo, 'Ki·taprangko poraibo');
  // NV-250 (Claude B, 2026-11-02): Thangseng native evidence supersedes the derived outputs (Miko cha·bo; Ka·sapae. ki·tapko poraibo).
  assert.equal((await translate('eat rice')).garo, 'Mi cha·bo');
  assert.equal((await translate('please read the book')).garo, 'Ka·sapae ki·taprangko poraibo');
});

test('bare read! takes -bo (poraia = read, NV-226)', async () => {
  assert.equal((await translate('read!')).garo, 'poraibo');
});

test('exact rows, corrections and statements are untouched', async () => {
  assert.equal((await translate('close the door')).garo, 'do·ga petbo'); // NV-256: Owner, do·ga final, Duar deleted
  assert.equal((await translate('read the newspaper')).garo, 'Janera mingbo');
  assert.equal((await translate('I read the book')).garo, 'Anga ki·tapko poraia');
  assert.equal((await translate('tea cup')).garo, 'Cha piala');
});

test('NV-235: non-string input is empty, not stringified', async () => {
  for (const bad of [null, undefined, {}, [], true]) {
    const r = await translate(bad);
    assert.equal(r.garo, '');
    assert.equal(r.method, 'empty');
  }
  assert.equal((await translate(123)).method, 'number-engine');
});
