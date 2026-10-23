// NV-187 (PO-relayed 2026-10-22): "May I / Can I + verb" request = Anga <verb>na man·genma?
// Engine construction (not a pin) for verbs with attested infinitive stems only.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

for (const [en, garo] of [
  ['May I eat?', 'Anga cha·na man·genma?'],
  ['Can I eat?', 'Anga cha·na man·genma?'],
  ['May I go?', 'Anga re·angna man·genma?'],
  ['Can I go?', 'Anga re·angna man·genma?'],
  ['Can I sit?', 'Anga asongna man·genma?'],
  ['Can I sit down?', 'Anga asongna man·genma?'],
  ['may i sit', 'Anga asongna man·genma?'],
]) {
  test(`NV-187 may-I: ${en}`, async () => {
    assert.equal((await translate(en)).garo, garo);
  });
}
// Neighbour guards: no leakage into statements, NV-185 pins, or unattested verbs.
for (const [en, garo] of [
  ['Can you help me?', 'Na·a angna dakchakna man·genma?'],
  ['Can you write the exam?', 'Na·a porikka sena man·genma?'],
  ['I can eat', 'Anga cha·na man·a'],
]) {
  test(`NV-187 guard: ${en}`, async () => {
    const g = (await translate(en)).garo;
    if (en === 'I can eat') assert.ok(!g.includes('genma'), g);
    else assert.equal(g, garo);
  });
}
test('NV-187: unattested verb does not get a guessed form', async () => {
  const g = (await translate('May I dance?')).garo;
  assert.ok(!/^Anga danca?na man·genma\?$/i.test(g), g);
});
