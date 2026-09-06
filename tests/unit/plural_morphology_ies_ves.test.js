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

test('leaves resolves to leaf (bi·jak), not the "to leave" alias', async () => {
  const r = await translate('leaves');
  assert.equal(r.garo, 'bi·jak');
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

// Regression guard: "leave" alone (the real verb) must still resolve to
// its own correct alias — this fix must not touch the bare-infinitive
// alias itself, only the order in which plural forms are tried against it.
test('bare "leave" (the verb) is unaffected by the plural-form ordering fix', async () => {
  const r = await translate('leave');
  assert.equal(r.garo, 'Re·ongkata');
});

// Regression guard: existing sibilant/regular plurals unaffected.
test('existing regular/sibilant plurals still resolve correctly', async () => {
  assert.equal((await translate('dogs')).garo, 'Achak');
  assert.equal((await translate('boxes')).garo, 'bak·so');
  assert.equal((await translate('wishes')).garo, 'sik·a');
});
