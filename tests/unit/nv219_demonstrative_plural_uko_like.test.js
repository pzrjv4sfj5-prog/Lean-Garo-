// NV-219 (Claude B, 2026-10-27). Thangseng native: `Ua achakrang` = those dogs, `Ia achakrang` = these dogs,
// `Anga ua nokko namnika.` = I like that house (present), `Anga uko nika.` = I see that (present).
// Everything marked DERIVED below is the engine's rule applied by analogy (NV-215 / NV-205 paradigms), NOT a native quote.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const lc = async (en) => (await translate(en)).garo.toLowerCase().replace(/[.!?]$/, '');
for (const [en, garo] of [
  // native (Thangseng)
  ['those dogs', 'ua achakrang'], ['these dogs', 'ia achakrang'],
  ['I like that house.', 'anga ua nokko namnika'], ['I see that.', 'anga uko nika'],
  // DERIVED: same nouns/frames, other tenses and persons
  ['these houses', 'ia nokrang'], ['those houses', 'ua nokrang'],
  ['I see those dogs.', 'anga ua achakrangko nika'], ['I see these dogs.', 'anga ia achakrangko nika'],
  ['I saw those dogs', 'anga ua achakrangko nikaha'], ['I will see those dogs', 'anga ua achakrangko nikgen'],
  ['I do not see those dogs', 'anga ua achakrangko nikja'], ['Look at those dogs.', 'ua achakrangko nibo'],
  ['Look at these dogs', 'ia achakrangko nibo'], ['I like this house.', 'anga ia nokko namnika'],
  ['I liked that house', 'anga ua nokko namnikaha'], ['I will like that house', 'anga ua nokko namnikgen'],
  ['I saw that', 'anga uko nikaha'], ['I will see that', 'anga uko nikgen'], ['I do not see that', 'anga uko nikja'],
]) test(`NV-219: ${en}`, async () => assert.equal(await lc(en), garo));
test('NV-219: singular + complementizer `that` are untouched', async () => {
  assert.equal(await lc('that dog'), 'ua achak');
  assert.equal(await lc('I see that dog.'), 'anga ua achakko nika');
  assert.ok(!/\buko\b/i.test((await translate('I know that.')).garo));
});
test('NV-219: demonstrative stays ua/ia in the plural, -rang on the noun, -ko never on the demonstrative', async () => {
  for (const en of ['I see those dogs', 'I see these dogs', 'Look at those dogs']) assert.ok(!/\b(ua|ia)ko\b/i.test((await translate(en)).garo), en);
});
// Probe-driven regressions (2026-10-27): multi-word Garo nouns, lexicalized `-rang` plural rows, -ves plurals, irregular past `took`.
for (const [en, garo] of [
  ['that boy', 'ua me·a bi·sa'], ['those boys', 'ua me·a bi·sarang'], ['I see those boys.', 'anga ua me·a bi·sarangko nika'],
  ['I see that boy.', 'anga ua me·a bi·sako nika'], ['I see this girl.', 'anga ia me·chik bi·sako nika'], ['Look at that boy.', 'ua me·a bi·sako nibo'],
  ['those fruits', 'ua biterang'], ['I see these fruits.', 'anga ia biterangko nika'],
  ['those knives', 'ua kettalrang'], ['I like those knives.', 'anga ua kettalrangko namnika'],
  ['I took that dog.', 'anga ua achakko ra·aha'], ['I took those dogs.', 'anga ua achakrangko ra·aha'],
]) test(`NV-219 probe: ${en}`, async () => assert.equal(await lc(en), garo));
// Second probe pass (2026-10-27): adjectives, numbers, case suffixes, bare pronoun objects, copular, questions. ALL DERIVED (not native).
for (const [en, garo] of [
  ['I see that big dog.', 'anga ua dal·gipa achakko nika'], ['I see those big dogs.', 'anga ua dal·gipa achakrangko nika'],
  ['I see that big red dog.', 'anga ua dal·gipa gitchak achakko nika'], ['I see these small houses.', 'anga ia chon·gipa nokrangko nika'],
  ['I see big dogs.', 'anga dal·gipa achakrangko nika'], ['that big dog', 'ua dal·gipa achak'], ['those big dogs', 'ua dal·gipa achakrang'],
  ['these small houses', 'ia chon·gipa nokrang'], ['those two dogs', 'ua achak manggni'], ['I saw those two dogs.', 'anga ua achak manggniko nikaha'],
  ['I go to that house.', 'anga ua nok·chi re·a'], ['I am in that house.', 'anga ua nok·o'],
  ['I see those.', 'anga uarangko nika'], ['I see these.', 'anga iarangko nika'], ['I see this.', 'anga iko nika'], ['I like that.', 'anga uko namnika'],
  ['those are dogs', 'ua achakrang'], ['these are books', 'ia ki·taprang'], ['these are my books', 'ia angni ki·taprang'], ['that is my house', 'ua angni nok'],
  ['what is that', 'ua maia?'], ['what are these', 'ia maia?'], ['who are those', 'ua sawa?'],
]) test(`NV-219 probe2 (derived): ${en}`, async () => assert.equal((await translate(en)).garo.toLowerCase().replace(/[.!]$/, ''), garo));
