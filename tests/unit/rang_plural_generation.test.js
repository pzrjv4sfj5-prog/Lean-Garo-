// Claude B, 2026-10-17: general -rang plural generation (object slot).
// Authority: Thangseng relay 2026-09-30 Q2 (-rang on any countable noun);
// Project Owner go-ahead 2026-10-17. Plain concatenation, raka dot kept.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

test('English plural object takes -rang (plain concatenation, dot kept)', async () => {
  assert.equal((await translate('I read books')).garo, 'Anga ki·taprang·ko po·ri·a');
  assert.equal((await translate('I see dogs')).garo, 'Anga achakrang·ko Nika');
});

test('QUANTITY + NOUN-rang order, matches cited adita ki·taprang / bang·a chattrorang', async () => {
  assert.equal((await translate('I have many books')).garo, 'Ango bang·a ki·taprang donga');
  assert.equal((await translate('she has several dogs')).garo, 'Uao adita achakrang donga');
});

test('lexicalized plurals are left exactly as the data has them (no double plural)', async () => {
  assert.equal((await translate('I have many friends')).garo, 'Ango bang·a cham·e donga');
  assert.equal((await translate('children')).garo, 'Bi·sarang');
});

test('counted nouns stay -rang-free (classifier path)', async () => {
  assert.doesNotMatch((await translate('I have two dogs')).garo, /rang/);
  assert.doesNotMatch((await translate('eleven dogs')).garo, /rang/);
});

test('singular object is unchanged', async () => {
  assert.equal((await translate('I read a book')).garo.includes('rang'), false);
});
