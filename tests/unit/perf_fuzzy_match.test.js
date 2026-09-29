// Perf fix (2026-09-28, Claude B): fuzzyMatch() ran an unbounded O(n*m)
// Levenshtein against every 6+ char dictionary key on every OOV word,
// live-confirmed 7.4s for a 30-char OOV token (worst case observed).
// Bounded DP short-circuits once a row exceeds the accept threshold.
import test from 'node:test';
import assert from 'node:assert/strict';
import { levenshteinBounded } from '../../src/utils.js';
import { fuzzyMatch } from '../../src/normalizationEngine.js';
import translationEngine from '../../src/translationEngine.js';

test('levenshteinBounded matches exact distance when <= max', () => {
  assert.equal(levenshteinBounded('kitten', 'sitting', 5), 3);
  assert.equal(levenshteinBounded('flaw', 'lawn', 5), 2);
  assert.equal(levenshteinBounded('same', 'same', 5), 0);
});

test('levenshteinBounded returns >max (not exact) once distance exceeds max', () => {
  assert.ok(levenshteinBounded('kitten', 'sitting', 1) > 1);
});

test('fuzzyMatch: long OOV input resolves fast (regression for 7.4s worst case)', () => {
  const start = performance.now();
  fuzzyMatch('a'.repeat(60));
  assert.ok(performance.now() - start < 200, 'fuzzyMatch must not do an unbounded full-dictionary scan');
});

test('translate(): long OOV sentence resolves fast end-to-end', async () => {
  const start = performance.now();
  await translationEngine.translate('a'.repeat(60) + ' ' + 'b'.repeat(60));
  assert.ok(performance.now() - start < 500);
});
