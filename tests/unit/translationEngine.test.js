import test from 'node:test';
import assert from 'node:assert/strict';

import translationEngine from '../../src/translationEngine.js';

test('translate uses phrase-level dictionary matches for common expressions', () => {
  assert.equal(translationEngine.translate('good morning'), 'Pringnam.');
});

test('phrase suggestions return relevant matches for partial input', () => {
  const suggestions = translationEngine.getPhraseSuggestions('good');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.some((entry) => entry.english.toLowerCase().includes('good')));
});
