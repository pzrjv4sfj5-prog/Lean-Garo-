// NV-192 (Project Owner directive, 2026-10-23): tense pins, roa / ong·a roots, 'eaten' strict-map.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

const norm = (s) => s.toLowerCase().replace(/\./g, '·');
const cases = [
  ['cooking', 'song·enga'],
  ['cooked', 'song·aha'],
  ['smiled', 'ka·dingsmitaha'],
  ['I ate', 'Anga cha·aha'],
  ['eaten', 'cha·jok'], // NV-193 ruling reverses the NV-192 strict-map
  ['I ate rice', 'Anga mi cha·aha'],
  ['How many years has your stay there been?', 'Na·a uano roa badita bilsi ong·aha?'],
  ['to visit', 'roa'],
  ['to hang around', 'roa'],
  ['to be', 'ong·a'],
  ['to cook', 'song·a'],
  ['to smile', 'ka·dingsmita'],
];
for (const [en, garo] of cases) {
  test(`NV-192: ${en}`, async () => {
    const r = await translate(en);
    assert.equal(norm(r.garo), norm(garo));
  });
}
test('NV-192: have you eaten your lunch? keeps cha·jokma (NV-181)', async () => {
  assert.equal((await translate('Have you eaten your lunch?')).garo, 'Na·a mipring cha·jokma?');
});
test('NV-192: roa root is in the dictionary (stay / visit / hang around)', async () => {
  const { readFileSync } = await import('node:fs');
  const rows = JSON.parse(readFileSync(new URL('../../master_dictionary.json', import.meta.url), 'utf8'));
  const roa = rows.filter((r) => r.garo === 'roa' && r.confidence === 'verified_high').map((r) => r.english);
  for (const k of ['stay (alt, roa)', 'to visit', 'to hang around']) assert.ok(roa.includes(k), k);
});
