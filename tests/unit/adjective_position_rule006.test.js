import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// 2026-10-20 (Claude B). RULE-006 (NV-177, Claude A handoff
// docs/HANDOFF_CLAUDE_B_20261020_adjective_pronoun_nia.md item 1; PO
// statement, Thangseng Q3 examples relayed): an adjective BEFORE the noun
// takes -gipa and stacks directly (size, then colour, then noun:
// Dalgipa gitchak nok); AFTER the noun it is the base -a form (Menggo
// chona; Achak dala tusienga). A bare -a adjective is never placed before
// the noun. Pre-fix, sov-assembly gave "dala achak mi chaenga" and put the
// adjective after the verb ("Achak tusia dala"). Generation is limited to
// adjectives with attested pre-noun forms (big = dalgipa, small = chongipa,
// red = bare gitchak); anything else keeps the previous cascade.
const norm = (s) => String(s).toLowerCase().replace(/[^\p{L} ]/gu, '').replace(/\s+/g, ' ').trim();

const PRE_NOUN = [
  ['the big dog sleeps', 'Dalgipa achak tusina'],
  ['a big dog is eating rice', 'Dalgipa achak miko chaenga'],
  ['a big cat is sleeping', 'Dalgipa menggo tusienga'],
  ['the small cat sleeps', 'Chongipa menggo tusina'],
  ['the big red dog sleeps', 'Dalgipa gitchak achak tusina'],
  ['big dogs eat rice', 'Dalgipa achakrang miko chaa'],
];
for (const [eng, garo] of PRE_NOUN) {
  test(`pre-noun adjective takes -gipa: ${eng}`, async () => {
    assert.equal(norm((await translate(eng)).garo), norm(garo));
  });
}

test('a bare -a adjective is never placed before the noun', async () => {
  for (const eng of ['the big dog sleeps', 'a big dog is eating rice', 'a big cat is sleeping', 'the small cat sleeps', 'big dogs eat rice']) {
    const g = norm((await translate(eng)).garo);
    assert.ok(!/^(dala|chona|gitchak achak|gitchak) /.test(g), `${eng} -> ${g}`);
    assert.ok(!/ (dala|chona)$/.test(g), `adjective stranded after the verb: ${eng} -> ${g}`);
  }
});

const UNCHANGED = [
  ['the cat is small', 'Menggo chona'],
  ['small cat', 'Menggo chona'],
  ['a big dog is sleeping', 'Achak dala tusienga'],
  ['that house is very big', 'Ua nok namen dala'],
  ['the big red house', 'Dalgipa gitchak nok'],
  ['the small white house', 'Chongipa gipok nok'],
  ['i see a big dog', 'Anga dalgipa achakko nika'],
];
for (const [eng, garo] of UNCHANGED) {
  test(`verified/predicative form unchanged: ${eng}`, async () => {
    assert.equal(norm((await translate(eng)).garo), norm(garo));
  });
}
