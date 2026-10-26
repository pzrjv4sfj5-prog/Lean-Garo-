// NV-211 (2026-10-26): Project Owner rulings + delegated logic closure of verified ties.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase();
for (const [en, garo] of [
  ['i can eat', 'anga cha·na man·a'],
  ['i can go', 'anga re·angna ama'],
  ['i can work', 'anga kam ka·na man·a'],
  ['i can speak garo', 'anga garo aganna man·a'],
  ['able', 'man·a'],
  ['fever', 'joma'],
  ['i know', 'anga hai·a'],
]) test(`NV-211 ${en} => ${garo}`, async () => assert.equal(await lc(en), garo));
