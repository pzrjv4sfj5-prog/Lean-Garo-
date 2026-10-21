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

// 2026-10-20 (Claude B), PO ruling: universal derivation. Every -a-final
// adjective takes -gipa before the noun: drop the final -a, KEEP the raka
// (dal·a -> dal·gipa, Chon·a -> Chon·gipa, Nama -> Namgipa, Sila -> Silgipa,
// Ta·rak·a -> Ta·rak·gipa). -rang goes on the NOUN only; the adjective never
// takes it. Stacking: every -a-final adjective takes -gipa, colour stays bare.
// Exact-dot assertions (not norm) because the raka is part of the rule.
const exact = async (eng) => (await translate(eng)).garo.replace(/\.$/, '').toLowerCase();

test('universal -gipa: raka retained in the stem', async () => {
  assert.equal(await exact('the big dog sleeps'), 'dal·gipa achak tusina');
  assert.equal(await exact('the small cat sleeps'), 'chon·gipa menggo tusina');
  assert.equal(await exact('the fast dog sleeps'), 'ta·rak·gipa achak tusina');
});

test('universal -gipa: dotless -a adjectives (good, beautiful)', async () => {
  assert.equal(norm(await exact('the good dog sleeps')), 'namgipa achak tusina');
  assert.equal(norm(await exact('the beautiful cat sleeps')), 'silgipa menggo tusina');
});

test('universal -gipa: stacks, colour stays bare', async () => {
  assert.equal(norm(await exact('the big heavy dog sleeps')), 'dalgipa jrigipa achak tusina');
  assert.equal(norm(await exact('the big red dog sleeps')), 'dalgipa gitchak achak tusina');
});

test('-rang attaches to the noun only', async () => {
  assert.equal(await exact('big dogs eat rice'), 'dal·gipa achakrang mi·ko cha·a');
  const g = await exact('good dogs sleep');
  assert.ok(/^namgipa achakrang /.test(g), g);
  assert.ok(!/gipa\w*rang/.test(g.replace(/\u00b7/g, '')), `adjective must not take -rang: ${g}`);
});

test('no -a-final adjective is ever bare before the noun', async () => {
  for (const adj of ['good', 'fast', 'beautiful', 'heavy', 'strong', 'hot', 'cold', 'sweet', 'thick', 'sick', 'warm', 'wide']) {
    const g = norm((await translate(`the ${adj} dog sleeps`)).garo);
    const first = g.split(' ')[0];
    assert.ok(first.endsWith('gipa'), `${adj}: first word must be -gipa, got ${g}`);
  }
});

test('adjectives without a -a-final base are not given a derived -gipa (old/new/young keep the fallback)', async () => {
  for (const adj of ['old', 'new', 'young']) {
    const g = norm((await translate(`the ${adj} dog sleeps`)).garo);
    assert.ok(!g.startsWith('dalgipa') && !/^\w+gipa /.test(g), `${adj}: ${g}`);
  }
});

// Object noun phrases (grammar path): same rule, and the adjective is never
// silently dropped. Pre-fix: "i eat a sweet fruit" -> "Anga bite·ko Cha·a".
test('object NP with -a-final adjective takes -gipa and is not dropped', async () => {
  assert.equal(await exact('i eat a sweet fruit'), 'anga chi·gipa bite·ko cha·a');
  assert.equal(await exact('i like the hot food'), 'anga ding·gipa al·a·ko sin·a');
  assert.equal(await exact('i buy a heavy bag'), 'anga jrigipa jol·a·ko bre·a');
  assert.equal(await exact('i eat sweet rice'), 'anga chi·gipa mi·ko cha·a');
});
test('object NP: stacked adjectives, verified rows untouched', async () => {
  assert.equal(await exact('i see a big red dog'), 'anga dal·gipa gitchak achak·ko nika');
  assert.equal(norm(await exact('i see a big dog')), 'anga dalgipa achakko nika');
});
