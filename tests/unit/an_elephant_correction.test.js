import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

test('"an elephant" resolves to the reconciliation-confirmed mongma', async () => {
  const result = await translate('an elephant');
  assert.equal(result.garo, 'mongma');
});

test('"an elephant" no longer carries the banned buring·o fragment', async () => {
  const result = await translate('an elephant');
  assert.ok(
    !result.garo.includes('buring'),
    `expected no 'buring' fragment, got "${result.garo}"`
  );
});

test('plain "elephant" is unaffected and still resolves to mongma', async () => {
  const result = await translate('elephant');
  assert.equal(result.garo, 'mongma');
});
