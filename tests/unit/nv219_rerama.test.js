// NV-219 (2026-10-26): Project Owner directive: Re·rama ("Re.rama") is a second option (valid synonym) for walk; Re·mama stays primary.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { translate } from '../../src/translationEngine.js';
const master = JSON.parse(readFileSync(new URL('../../master_dictionary.json', import.meta.url), 'utf8'));
for (const en of ['walk', 'to walk']) {
  test(`NV-219 ${en} primary stays Re·mama`, async () => assert.equal((await translate(en)).garo.toLowerCase(), 're·mama'));
  test(`NV-219 ${en} has Re·rama as verified variant`, () => {
    const r = master.find(x => x.english === en && x.garo === 'Re·rama');
    assert.ok(r); assert.equal(r.confidence, 'verified_high'); assert.match(r.notes, /^variant\//);
  });
}
