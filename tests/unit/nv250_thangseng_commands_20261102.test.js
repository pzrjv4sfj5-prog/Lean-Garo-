// NV-250 (Claude B, 2026-11-02). Thangseng native relay (pasted by the Owner 2026-11-02), commands & requests.
// Native: exact pins only; no general rule is inferred (see docs/CLAUDE_B_NV250_THANGSENG_RELAY_20261102.md).
// Thangseng typed '.' for the middle dot; stored as the repo's '·'.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const g = async (en) => (await translate(en)).garo;
const cases = [
  ['Write a letter.', 'Chitti sebo'],
  ['Drink water.', 'Chi ringbo'],
  ['Eat rice.', 'Mi cha·bo'],
  ['read books', 'Ki·taprangko poraibo'],
  ['Please read the book.', 'Ka·sapae ki·taprangko poraibo'],
  ['Drink!', 'Ringbo'],
  ['Ask!', 'Sing·bo'],
  ['Dance!', 'Chrokbo'],
  ['Please come.', 'Ka·sapae re·babo'],
];
for (const [en, garo] of cases) test(`NV-250 Thangseng: ${en} -> ${garo}`, async () => assert.equal(await g(en), garo));
// Engine (imperative-object-ko): habitual objects rice/water drop -ko whatever the surface form (A's handoff 20261101); other nouns keep -ko.
test('NV-250: Eat rice! / eat the rice! / please eat rice use the bare habitual object', async () => {
  assert.equal(await g('Eat rice!'), 'Mi cha·bo');
  assert.equal(await g('eat the rice!'), 'Mi cha·bo');
  assert.equal(await g('please eat rice'), 'Ka·sapae mi cha·bo');
  assert.equal(await g('Drink water!'), 'Chi ringbo');
});
test('NV-250: non-habitual objects keep -ko; polite form has no full stop (Thangseng spelling)', async () => {
  assert.equal(await g('read the book'), 'Ki·tapko poraibo');
  assert.equal(await g('Please read the book.'), 'Ka·sapae ki·taprangko poraibo');
});
test('NV-250: He is running away. -> Ua katangenga (Claude A NV-248 pin, native-confirmed again)', async () => assert.equal(await g('He is running away.'), 'Ua katangenga'));
// ---- Thangseng 2026-11-02 (second message) ----
test('NV-250: Run fast (imperative) = Ta·rake katbo', async () => { assert.equal(await g('Run fast.'), 'Ta·rake katbo'); assert.equal(await g('Run fast!'), 'Ta·rake katbo'); });
test('NV-250: I do not know / I don\'t know = Anga u·ija (native spelling with the dot)', async () => {
  for (const s of ['I do not know.', "I don't know.", 'I dont know']) assert.equal(await g(s), 'Anga u·ija', s);
});
test('NV-250: know negatives share the u·ia stem in every person/tense (DERIVED beyond the bare form); positives keep hai·a', async () => {
  assert.equal(await g('I do not know him.'), 'Anga biko u·ija');
  assert.equal(await g('He does not know.'), 'Ua u·ija');
  assert.equal(await g('I will not know.'), 'Anga u·ijawa');
  assert.equal(await g('I will know.'), 'Anga hai·gen');
  assert.equal(await g('I know.'), 'Anga hai·a');
});
test('NV-250: he/she is running away = Ua katangenga; other subjects take the same present-continuous form (verb has no person marking)', async () => {
  for (const s of ['He is running away.', 'She is running away.', 'He/she is running away.']) assert.equal(await g(s), 'Ua katangenga', s);
  assert.equal(await g('I am running away.'), 'Anga katangenga');
  assert.equal(await g('They are running away.'), 'Uamang katangenga');
});
test('NV-250: particle verb run away = katanga: past katangaha (derived), command Katangbo! (derived), no [UNKNOWN] leak', async () => {
  assert.equal(await g('He ran away.'), 'Ua katangaha');
  assert.equal(await g('Run away!'), 'Katangbo');
  for (const s of ['He ran away.', 'She is running away.', 'I am running away.', 'Run away!']) assert.ok(!(await g(s)).includes('[UNKNOWN]'), s);
});
test('NV-250: Sit down! = Asongbo (one word, native NV-091); Sit down. unchanged', async () => {
  for (const s of ['Sit down!', 'sit down!', 'Sit down.']) assert.equal(await g(s), 'Asongbo', s);
});
test('NV-250: Thangseng 2026-11-02 8pm: Get up! = Chakatbo, Come in! = Ning·chi re·babo (variant napbabo), Wake up! = Mikrakbo (imperatives)', async () => {
  assert.equal(await g('Get up!'), 'Chakatbo');
  assert.equal(await g('Come in!'), 'Ning·chi re·babo');
  for (const s of ['Wake up!', 'Wake up.', 'wake up']) assert.equal(await g(s), 'Mikrakbo', s);
});
test('NV-250: He is waking up = Ua mikrakbaengaha (present continuous, inceptive `ba`); He woke up = Ua mikrakaha (past); exact pins, other subjects/tenses of wake up held', async () => {
  for (const s of ['He is waking up.', 'She is waking up.']) assert.equal(await g(s), 'Ua mikrakbaengaha', s);
  for (const s of ['He woke up.', 'She woke up.']) assert.equal(await g(s), 'Ua mikrakaha', s);
});
test('NV-250: I do not understand keeps the dotted native spelling u·ija', async () => assert.equal(await g('I do not understand'), 'Anga u·ija'));
test('NV-250: final baseline u·ija: every know negative and the pinned `i do not understand` use the dotted spelling; `i don\'t understand` stays the VERIFIED master row man·ja', async () => {
  for (const s of ['I do not know', "I don't know", 'I dont know', 'I do not understand']) assert.equal(await g(s), 'Anga u·ija', s);
  assert.equal(await g("I don't understand"), 'Anga man·ja');
});
// ---- NV-253 (Claude B): other subjects of the two native wake-up forms; negated why-question composition ----
test('NV-253: wake-up native forms carry over to every subject (Garo verbs carry no person marking)', async () => {
  assert.equal(await g('I am waking up.'), 'Anga mikrakbaengaha');
  assert.equal(await g('You woke up.'), 'Na·a mikrakaha');
  assert.equal(await g('They woke up.'), 'Uamang mikrakaha');
});
test('NV-253 TENTATIVE PIN (pending Thangseng on time-word placement): negated why-question keeps ua / -rang / -ko / mijalo and no longer drops to sov-assembly', async () => {
  const r = await translate('Why did you not eat those vegetables yesterday?');
  assert.equal(r.garo, 'Mijalo na·a maina ua me·surangko cha·ja?');
  assert.notEqual(r.method, 'sov-assembly');
  assert.equal(r.method, 'wh-peel-assembly');
});
test('NV-253: peel-and-replace covers why/where/when/how (the old fallback even dropped `when`)', async () => {
  assert.equal(await g('When did you not eat those vegetables?'), 'Na·a basako ua me·surangko cha·ja?');
  assert.equal(await g('Where did you not go?'), 'Na·a bano re·angja?');
  assert.equal(await g('How did you not eat those vegetables?'), 'Na·a maidake ua me·surangko cha·ja?');
  assert.equal(await g('Why will you not eat those vegetables?'), 'Na·a maina ua me·surangko cha·jawa?');
});
test('NV-253: positive past wh-question gets the declarative morphology plus the NV-194 bare -a (derived)', async () => {
  assert.equal(await g('Why did you eat those vegetables yesterday?'), 'Mijalo na·a maina ua me·surangko cha·a?');
  assert.equal(await g('Why do you eat those vegetables?'), 'Na·a maina ua me·surangko cha·a?');
});
test('NV-253: earlier cascade steps keep priority; argument wh-words (what/who) are not peeled', async () => {
  assert.equal((await translate('Why did you eat?')).method, 'exact-phrase');
  assert.notEqual((await translate('What did you not eat?')).method, 'wh-peel-assembly');
});
test('NV-253: translate(input, {trace:true}) reports the routing path, method, confidence and overrides; default output has no trace', async () => {
  const r = await translate('Why did you not eat those vegetables yesterday?', { trace: true });
  assert.equal(r.trace.method, 'wh-peel-assembly');
  assert.equal(r.trace.confidence, 0.7);
  assert.match(r.trace.route, /\[wh-peel: why -> Maina\] -> \[grammar-assembly: "you did not eat those vegetables yesterday\."\] -> \[reassemble/);
  assert.ok(r.trace.overrides.includes('demonstrative retained (NV-219)'));
  assert.equal((await translate('Drink!', { trace: true })).trace.route, 'cascade:' + (await translate('Drink!')).method);
  assert.equal((await translate('Drink!')).trace, undefined);
});
// ---- NV-255 (Claude B): negative continuous order, be-aux wh peel, negative imperative (PDF `top_priority (first checking)` bug list) ----
test('NV-255: negative continuous = stem + ja + enga (negation BEFORE the progressive): native re·angjaenga / cha·jaenga, Burling cha·ja-ing-a', async () => {
  assert.equal(await g('I am not going.'), 'Anga re·angjaenga');
  assert.equal(await g('I am not eating.'), 'Anga cha·jaenga');
  assert.equal(await g('I am not eating rice.'), 'Anga miko cha·jaenga');
  assert.equal(await g('You are not eating those vegetables.'), 'Na·a ua me·surangko cha·jaenga');
  assert.equal(await g('She is not running away.'), 'Ua katangjaenga'); // derived by the same order
  assert.equal(await g('I am eating.'), 'Anga cha·enga'); // positive unchanged
});
test('NV-255: Why/Where are/is not V-ing? peels to the declarative with the corrected order', async () => {
  assert.equal(await g('Why are you not eating those vegetables?'), 'Na·a maina ua me·surangko cha·jaenga?');
  assert.equal(await g('Why are you eating those vegetables?'), 'Na·a maina ua me·surangko cha·enga?');
  assert.equal(await g('Where are you not going?'), 'Na·a bachi re·angjaenga?'); // where + going = bachi (BUG-REPORT-WHERE-GOING), kept from the cascade's own choice
});
test('NV-255: negative imperative keeps the negation (-bo -> -nabe); exact pin priority kept', async () => {
  assert.equal(await g('Do not eat rice!'), 'Mi cha·nabe');
  assert.equal(await g("Don't go!"), 'Re·angnabe');
  assert.equal(await g('Do not eat'), 'cha·nabe');
  assert.equal(await g('do not sing'), 'ring·ja'); // bare statement form untouched (NV-208)
  assert.equal(await g('Eat rice!'), 'Mi cha·bo');
});
test('NV-255: verbs that merely end in -ing (bring, sing) are not read as gerunds', async () => {
  assert.equal((await g('I do not bring it.')).toLowerCase(), 'anga uko ra·baja');
  assert.equal(await g('Why am I not singing?').then((s) => /jaenga/.test(s)), true);
});
// ---- NV-256 (Claude B): present perfect = completive -manaha (Thangseng Rules 25/26/28, PDF `re.ang-man.aha`) ----
test('NV-256: have/has + participle = stem + manaha (go = re·ang-, come = re·ba-); DERIVED, native for the manaha meaning', async () => {
  assert.equal(await g('I have gone.'), 'Anga re·angmanaha');
  assert.equal(await g('He has gone.'), 'Ua re·angmanaha');
  assert.equal(await g('She has come.'), 'Ua re·bamanaha');
  assert.equal(await g('I have eaten rice.'), 'Anga mi cha·manaha'); // = native cha·manaha (has eaten)
  assert.equal(await g('They have run away.'), 'Uamang katangmanaha');
});
test('NV-256: exact -jok pins keep priority; have-as-verb, have to, been are NOT read as perfects', async () => {
  assert.equal(await g('I have eaten.'), 'Anga cha·jok');
  assert.equal(await g('He has eaten.'), 'Ua cha·jok');
  assert.ok(!/manaha/.test(await g('I have to go.')));
  assert.ok(!/manaha/.test(await g('I have a dog.')));
  assert.ok(!/manaha/.test(await g('I have been.')));
});
test('NV-256: trace names the perfect rule', async () => {
  const r = await translate('I have gone.', { trace: true });
  assert.equal(r.trace.method, 'perfect-completive-assembly');
  assert.match(r.trace.route, /\[perfect: have\/has \+ participle\].*\[-enga -> -manaha/);
});
// ---- NV-257 (Claude B, 2026-11-03): Thangseng answers + in-situ wh order ----
test('NV-257: Thangseng native: What did you not eat? = Na·a maiko cha·jaha? ; Why are you not eating? = Na·a maina cha·jaenga?', async () => {
  assert.equal(await g('What did you not eat?'), 'Na·a maiko cha·jaha?');
  assert.equal(await g('Why are you not eating?'), 'Na·a maina cha·jaenga?');
});
test('NV-257: wh-word is in situ after the subject (never clause-initial), matching the older native pins', async () => {
  assert.equal(await g('Why did you eat?'), 'Na·a maina cha·a?');
  assert.equal(await g('Why did you avoid me yesterday?'), 'Mijalo na·a maina angko gela?');
  for (const s of ['Why did you not eat those vegetables?', 'When did you not eat those vegetables?', 'Why did he not come?']) assert.ok(!/^(maina|basako|bano|maidake|bachi) /i.test(await g(s)), s);
});
