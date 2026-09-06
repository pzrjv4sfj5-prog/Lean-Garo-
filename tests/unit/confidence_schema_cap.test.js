import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Handoff B item 4 (docs/HANDOFF_CLAUDE_B_20260906.md, closed 2026-09-06
// Claude B). "two cat" was fixed as a side effect of NV-135, but "dog"
// still shipped .98-1.0 confidence from an unverified master row — this
// is the GENERAL confidence-schema gap behind it, not a single instance.
// Root cause: confidence for dictionary-lookup methods (phrase-map/
// exact-phrase/exact-word/stopword-stripped) was a fixed per-method
// number, with no connection at all to whether the underlying
// master_dictionary.json row was ever verified. Fixed by capping these
// specific methods' confidence when the resolved key has zero VERIFIED/
// HIGH evidence across every one of its dictionary candidates (a signal
// prepare-data.js already computes for its own pickPrimary reporting,
// reused here rather than re-derived).

test('"dog" (unverified source row) reports capped confidence, not phrase-map\'s full 0.99', async () => {
  const r = await translate('dog');
  assert.equal(r.garo, 'Achak');
  assert.ok(r.confidence <= 0.75, `expected capped confidence for an unverified source row, got: ${r.confidence}`);
});

test('a verified entry ("cat") still reports full dictionary-lookup confidence (regression guard)', async () => {
  const r = await translate('cat');
  assert.equal(r.garo, 'Menggo');
  assert.equal(r.confidence, 0.99);
});

test('a verified entry ("leaf") via exact-phrase also reports full confidence (regression guard)', async () => {
  const r = await translate('leaf');
  assert.equal(r.method, 'exact-phrase');
  assert.equal(r.confidence, 0.98);
});
