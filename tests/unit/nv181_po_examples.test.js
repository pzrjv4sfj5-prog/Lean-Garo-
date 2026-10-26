// NV-181 (Project Owner-provided, 2026-10-21): live-output fixes + how/have splits.
// Exact PO examples are pinned; general have/how composition is Claude B's queue.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

const cases = [
  ['I see him/her', 'Anga biko nika'],
  ['I look at him/her', 'Anga bichiko nia'],
  ['I will do', 'Anga ka·gen'],
  ['has stopped eating', 'cha·jaha'],
  ['two chicken', 'do·o manggni'],
  ['How much did you eat?', 'Na·a badita cha·a?'], // NV-194: NV-158 bare -a is final (reverses NV-182)
  ['How many apples are on the table?', 'Tableo badita rong apple donga?'],
  ['How are you going to do it?', 'Na·a uako maikai dakna am·enga?'],
  ['How is your grandmother?', 'Nang·ni ambide mai rokom?'],
  ['how much', 'Badita'],
  ['I have a dog.', 'Ango achak mangsa donga.'],
  ['Do you have my book?', 'Nang·o angni ki·tap dongama?'],
  ['Have you eaten your lunch?', 'Na·a mipring cha·jokma?'],
  ['I have come to you.', 'Anga nang·ona re·baaha.'],
  ['Do you have to go to the market?', 'Na·a antichi re·angna nangengama?'],
];
for (const [en, garo] of cases) {
  test(`NV-181: ${en}`, async () => {
    const r = await translate(en);
    assert.equal(r.garo, garo);
  });
}
test('NV-181: no [UNKNOWN] for slashed him/her', async () => {
  for (const q of ['I see him/her', 'I look at her/him']) {
    assert.ok(!(await translate(q)).garo.includes('[UNKNOWN]'), q);
  }
});
