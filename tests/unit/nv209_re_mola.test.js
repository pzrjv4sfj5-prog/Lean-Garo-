// NV-209 (2026-10-26): Project Owner directive (new word, not a Thangseng quote): go together = Re·mola.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
for (const en of ['go together', 'to go together']) {
  test(`NV-209 ${en} => re·mola`, async () => assert.equal((await translate(en)).garo.toLowerCase(), 're·mola'));
}
