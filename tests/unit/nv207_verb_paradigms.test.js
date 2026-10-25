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
