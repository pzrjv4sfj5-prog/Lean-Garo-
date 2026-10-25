// NV-196 (Project Owner-relayed, AI-formatted block, 2026-10-25; no raw native quote).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

const cases = [
  ['What should I do?', 'Anga maiko dakgen?'],
  ['What can I do?', 'Anga maiko dakgen?'],
  ['be sick', 'Joma'],
  ['get unwell', 'Joma'],
  ['sneak', 'jom·a'],
  ['slink', 'jom·a'],
  ['covet', 'mikboka'],
  ['desire', 'mikboka'],
];
for (const [en, garo] of cases) {
  test(`NV-196: ${en}`, async () => {
    assert.equal((await translate(en)).garo, garo);
  });
}
