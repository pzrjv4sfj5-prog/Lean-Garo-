// NV-216 (2026-10-26): Project Owner directive: Re·rika (v.) = to follow; to accompany.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
for (const en of ['follow', 'to follow', 'accompany', 'to accompany'])
  test(`NV-216 ${en} => Re·rika`, async () => assert.equal((await translate(en)).garo.toLowerCase(), 're·rika'));
