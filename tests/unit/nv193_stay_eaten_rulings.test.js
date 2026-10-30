// NV-193 (Project Owner rulings, 2026-10-24): `stay` splits roa / donga by sense; `eaten` stays cha·jok.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

test('NV-193: eaten = cha·jok (perfective primary); ate = cha·aha (simple past)', async () => {
  assert.equal((await translate('eaten')).garo, 'cha·jok');
  assert.equal((await translate('I ate')).garo, 'Anga cha·aha');
  assert.equal((await translate('Have you eaten your lunch?')).garo, 'Na·a mipring cha·jokma?');
});
test('NV-193: stay = physical presence -> donga (default); pin: I will stay here', async () => {
  assert.equal((await translate('I will stay here')).garo, 'Anga iano donggen.');
  assert.equal((await translate('I will stay here.')).garo, 'Anga iano donggen.');
  assert.match((await translate('I stayed at home')).garo, /dongaha$/);
  assert.equal((await translate('he stayed without doing her work')).garo, 'Ua dak·ako ka·gija dongaha');
});
test('NV-193: stay = visit / spend time (explicit cue) -> roa', async () => {
  assert.match((await translate('I stayed on vacation')).garo, /roaha$/);
  assert.match((await translate('I will stay for the holiday')).garo, /rogen$/);
  assert.equal((await translate('How many years has your stay there been?')).garo, 'Na·a uano roa badita bilsi ong·aha?');
});
