import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Handoff B item 1 (docs/HANDOFF_CLAUDE_B_20260906.md, root-caused,
// closed 2026-09-06 Claude B). "leaves" had no y->ies/f->ves
// pluralization rule ahead of the generic s$ strip, so it fell through
// to "leave" -> the auto-generated bare-infinitive alias for the
// unrelated verb "to leave" ("Re·ongkata") instead of "leaf" (bi·jak).
// Two individually-reasonable features (bare-infinitive aliasing +
// naive -s stripping) colliding, not a bad data row — fix is to try
// -y->-ies and -f/-fe->-ves forms before the generic s$/es$ strip in
// sentenceBuilder.js's assembleSentenceSOV per-word lookup.

test('leaves resolves to leaf (bijakrang, NV-145), not the "to leave" alias', async () => {
  const r = await translate('leaves');
  assert.equal(r.garo, 'bijakrang');
});

test('babies resolves via y->ies rule (previously hard [UNKNOWN])', async () => {
  const r = await translate('babies');
  assert.notEqual(r.garo, '[UNKNOWN]');
  assert.equal(r.garo, 'gen·da');
});

test('cities resolves via y->ies rule (previously hard [UNKNOWN])', async () => {
  const r = await translate('cities');
  assert.notEqual(r.garo, '[UNKNOWN]');
  assert.equal(r.garo, 'so·hor');
});

test('knives resolves via f->ves rule at full confidence, not fuzzy-match accident', async () => {
  const r = await translate('knives');
  assert.equal(r.garo, 'Kettal');
  assert.notEqual(r.method, 'fuzzy-match');
});

// Regression guard: "leave" alone (the real verb) is now "donbo" (NV-145/
// NV-146, native-confirmed imperative), superseding the old auto-generated
// bare-infinitive alias "Re·ongkata" this fix originally guarded against —
// this test now checks that the plural-form-ordering fix itself doesn't
// interfere with whatever "leave" resolves to, not a specific hardcoded
// value from before NV-145 landed.
test('bare "leave" (the verb) is unaffected by the plural-form ordering fix', async () => {
  const r = await translate('leave');
  assert.equal(r.garo, 'donbo');
});

// Regression guard: existing sibilant/regular plurals unaffected.
test('existing regular/sibilant plurals still resolve correctly', async () => {
  assert.equal((await translate('dogs')).garo, 'Achak');
  assert.equal((await translate('boxes')).garo, 'bak·so');
  assert.equal((await translate('wishes')).garo, 'sik·a');
});
