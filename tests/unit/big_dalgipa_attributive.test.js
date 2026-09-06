import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';

const compiled = JSON.parse(fs.readFileSync(new URL('../../src/compiled_dict.json', import.meta.url)));

// NV-136 (2026-09-06, Project Owner-confirmed direct Thangseng relay):
// "dal.a" = big, predicate position ("Ua nok namen dal.a" = that house is
// very big). "dal'gipa" = big, attributive/before-noun position
// ("Dal.gipa nok" = a big house).
//
// Every "big [noun]" phrase-table row in master_dictionary.json (all
// attributive by construction — adjective before noun) had instead been
// shipping an uncited, unverified root, "gonga", with no citation trail
// anywhere else in the dictionary. The working sov-assembly composition
// path already independently used "dal·a" (the predicate form) for "big"
// in sentences not covered by this static phrase table, so the
// phrase-table rows disagreed with both the new citation and the
// engine's own working path. Fixed this session: gonga -> dal·gipa,
// noun half untouched, for the 15 affected nouns.

const NOUNS = {
  person: /mande$/i, dog: /achak$/i, cat: /menggo$/i, bird: /do·o$/i,
  fish: /na·tok$/i, teacher: /skigipa$/i, student: /chattro$/i,
  house: /nok$/i, tree: /bol$/i, book: /ki·tap$/i, car: /mot$/i,
  apple: /se$/i, banana: /sobo$/i, rice: /mi$/i, water: /chi$/i,
};

test('adjective "big": attributive phrase-table rows use dal·gipa, not the uncited "gonga" placeholder (NV-136)', () => {
  for (const [noun, canonRe] of Object.entries(NOUNS)) {
    const v = compiled[`big ${noun}`];
    assert.ok(v, `expected a compiled entry for "big ${noun}"`);
    assert.match(v, /^dal·gipa /i, `"big ${noun}" does not start with the cited attributive root dal·gipa (NV-136): ${v}`);
    assert.match(v, canonRe, `"big ${noun}" does not end with its own canonical noun root: ${v}`);
    assert.ok(!/gonga/i.test(v), `"big ${noun}" still contains the old uncited placeholder "gonga": ${v}`);
  }
});

test('adjective "big": bare predicate form (dal·a, NV-080) is unaffected by the attributive fix', () => {
  // Sanity guard: this fix only touched the "big [noun]" phrase-table
  // batch. The pre-existing bare "big"/"Big" -> dal·a predicate entries
  // (NV-080) must remain untouched.
  assert.equal(compiled['big'], 'dal·a');
});
