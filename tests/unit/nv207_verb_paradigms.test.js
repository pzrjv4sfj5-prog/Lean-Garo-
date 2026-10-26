// NV-207: generated verb paradigms. Native paradigms (NV-205) must be exact; every emitted verb must agree with
// the live engine on future and negative future; derived forms stay labelled as unverified.
import test from 'node:test';
import assert from 'node:assert/strict';
import { getVerbParadigm } from '../../src/verbParadigm.js';
import { translate } from '../../src/translationEngine.js';

test('NV-207: watch / see / find native paradigms', () => {
  const w = getVerbParadigm('to watch');
  assert.deepEqual([w.forms.present, w.forms.continuous, w.forms.command, w.forms.negative_command, w.forms.past, w.forms.future, w.forms.negative_future, w.forms.infinitive],
    ['nia', 'nienga', 'nibo', 'ninabe', 'niaha', 'nigen', 'nijawa', 'nina']);
  const s = getVerbParadigm('see'); const f = getVerbParadigm('find');
  for (const p of [s, f]) assert.deepEqual([p.forms.present, p.forms.command, p.forms.negative_command, p.forms.past, p.forms.future, p.forms.negative_future], ['nika', 'nikbo', 'niknabe', 'nikaha', 'nikgen', 'nikjawa']);
  assert.equal(w.status.future, 'native');
  assert.notEqual(w.forms.present, s.forms.present);
});
test('NV-207: attested eat / sleep forms are pinned, not invented', () => {
  const e = getVerbParadigm('eat');
  assert.equal(e.forms.past, 'cha·aha'); assert.equal(e.forms.negative_command, 'cha·nabe'); assert.equal(e.status.negative_command, 'pinned');
  assert.ok(['pinned', 'engine'].includes(e.status.continuous));
});
test('NV-207: every emitted verb agrees with the live engine (future, negative future)', async () => {
  const names = ['eat', 'drink', 'sleep', 'run', 'speak', 'give', 'see', 'watch'];
  for (const v of names) {
    const p = getVerbParadigm(v); assert.ok(p, v);
    const g = async (en) => (await translate(en)).garo.toLowerCase().replace(/^anga\s+/, '').replace(/[.!?]$/, '').trim();
    assert.equal(await g('I will ' + v), p.forms.future.toLowerCase(), v);
    assert.equal(await g('I will not ' + v), p.forms.negative_future.toLowerCase(), v);
  }
});

// NV-207b (Thangseng NV-100): go = re·a; re·anga = went (derived from re·a), not a separate verb
test('NV-207b: go paradigm is native-verified, re·ang- stem', async () => {
  const g = getVerbParadigm('go');
  assert.deepEqual([g.forms.present, g.forms.past, g.forms.continuous, g.forms.future, g.forms.negative, g.forms.negative_future, g.forms.command, g.forms.negative_command],
    ['re·a', 're·anga', 're·angenga', 're·anggen', 're·angja', 're·jawa', 're·angbo', 're·angnabe']);
  assert.equal(g.extra.will_not_be_going, 're·angjawa'); assert.equal(g.extra.lets_go, 're·naha');
  assert.equal(getVerbParadigm('go away'), null);
  const lc = async (en) => (await translate(en)).garo.toLowerCase().replace(/[.!?]$/, '');
  assert.equal(await lc('go'), 're·a'); assert.equal(await lc('I went'), 'anga re·anga');
  assert.equal(await lc('I will not go'), 'anga re·jawa'); assert.equal(await lc('will not be going'), 're·angjawa');
  assert.equal(await lc("don't go"), 're·angnabe');
});

// NV-207c (PO/Thangseng 2026-10-25): Re·ata = to cause to go; to make someone go; to spend time, money
test('NV-207c: re·ata (cause to go / spend)', async () => {
  const lc = async (en) => (await translate(en)).garo.toLowerCase().replace(/[.!?]$/, '');
  assert.equal(getVerbParadigm('spend').forms.present, 're·ata');
  assert.notEqual(getVerbParadigm('spend').forms.present, getVerbParadigm('go').forms.present); // re·ata != re·a
  for (const en of ['to spend', 'cause to go', 'to make someone go']) assert.equal(await lc(en), 're·ata', en);
  assert.equal(await lc('spend time'), 'somoi re·ata');
  assert.equal(await lc('I spend money'), 'anga dang·gako re·ata');
  assert.equal(await lc('I spent money'), 'anga dang·gako re·ataha');
  assert.equal(await lc('I will spend money'), 'anga dang·gako re·atgen');
  assert.equal(await lc('I am spending money'), 'anga dang·gako re·atenga');
  assert.equal(await lc('I want to spend money'), 'anga dang·ga re·atna ska');
  assert.equal(await lc('spend money!'), 'dang·ga re·atbo');
});

// Re·mola (v) = to go together (PO/Thangseng 2026-10-25): its own verb, not go (re·a) and not re·ata
test('Re·mola: go together is its own verb; only present is native', async () => {
  const m = getVerbParadigm('go together');
  assert.equal(m.forms.present, 're·mola'); assert.equal(m.status.present, 'native');
  assert.equal(m.forms.future, 're·molgen'); assert.equal(m.status.future, 'derived');
  assert.notEqual(m.forms.present, getVerbParadigm('go').forms.present);
  assert.equal((await translate('go together')).garo, 'Re·mola');
});

// come: stem re·ba; Thangseng 2026-10-25 "Re·ba verb is an imperative mood meaning come"
test('come paradigm: stem re·ba, native imperative re·babo, distinct from go', () => {
  const c = getVerbParadigm('come');
  assert.equal(c.forms.command, 're·babo'); assert.equal(c.status.command, 'native');
  assert.equal(c.forms.continuous, 're·baenga'); assert.equal(c.forms.infinitive, 're·bana');
  assert.notEqual(c.forms.present, getVerbParadigm('go').forms.present);
});

// come imperative (PO answer 2026-10-25: `re·babo`): no stray raka, don't come = re·banabe
test('come! = Re·babo!, do not come = re·banabe', async () => {
  const t = async (en) => (await translate(en)).garo;
  assert.equal(await t('come!'), 'Re·babo!');
  assert.equal(await t('do not come'), 're·banabe');
  assert.equal(await t("don't come"), 're·banabe');
  assert.equal(await t('come with me'), 'Ang·ming re·babo');
});
