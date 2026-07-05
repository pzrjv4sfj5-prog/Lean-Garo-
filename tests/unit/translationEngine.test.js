import test from 'node:test';
import assert from 'node:assert/strict';

import translationEngine from '../../src/translationEngine.js';
import { translate } from '../../src/translationEngine.js';

test('translate uses phrase-level dictionary matches for common expressions', async () => {
  const result = await translationEngine.translate('good morning');
  assert.equal(result, 'Pringnam.');
});

test('phrase suggestions return relevant matches for partial input', () => {
  const suggestions = translationEngine.getPhraseSuggestions('good');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.some((entry) => entry.english.toLowerCase().includes('good')));
});

// --- Regression suite (baseline 13 + all fixes through e80a6a6) ---
// Persistent source of truth for "does the engine still work" across
// sessions — run before AND after any engine/data change instead of
// hand-writing throwaway /tmp scripts.
const REGRESSION_CASES = [
  // Baseline 13 (f6edcf8 resume test)
  { in: 'eat', expectMethod: ['correction'] },
  { in: 'good', expectMethod: ['correction'] },
  { in: '2 dogs', expectMethod: ['classifier'] },
  { in: 'did you eat food', expectMethod: ['correction'] },
  { in: 'i saw him', expectMethod: ['correction'] },
  { in: 'lets dance', expectMethod: ['correction'] },
  { in: 'LETS GO', expectMethod: ['correction'] },
  { in: "don't eat", expectMethod: ['correction'] },
  { in: 'cook', expectMethod: ['correction'] },
  { in: '1 tree', expectMethod: ['classifier'] },
  { in: '2 bamboo', expectMethod: ['classifier'] },
  { in: '21 dogs', expectMethod: ['classifier'] },
  // 'i did not eat' intentionally NOT expected to match the old wrong
  // jaha-based answer — as of 108918c, no confidently-wrong output is
  // preferred over a visibly-imperfect grammar-assembly fallback, since no
  // confirmed true-past-negation suffix exists (Rule 25 outstanding item).
  { in: 'i did not eat', expectGaro: 'Anga Cha·ja', expectMethod: ['grammar-assembly'] },

  // jaha/manaha semantic correction (108918c)
  { in: 'i stopped eating', expectGaro: 'Anga cha·jaha', expectMethod: ['correction'] },
  { in: 'he stopped eating', expectGaro: 'Ua cha·jaha', expectMethod: ['correction'] },
  { in: 'she stopped eating', expectGaro: 'Ua cha·jaha', expectMethod: ['correction'] },
  { in: 'i stopped drinking', expectGaro: 'Anga ringjaha', expectMethod: ['correction'] },
  { in: 'i stopped working', expectGaro: 'Anga dakjaha', expectMethod: ['correction'] },
  { in: 'stopped doing', expectGaro: 'dakjaha', expectMethod: ['correction'] },
  { in: 'ate', expectGaro: 'Cha·aha', expectMethod: ['correction'] },

  // jaha/manaha assembly-path + gija->ja negation (a38749b)
  { in: 'i finished eating', expectMethod: ['grammar-assembly'] },
  { in: 'she completed her work', expectMethod: ['grammar-assembly'] },
  { in: "she doesn't eat", expectGaro: 'Ua Cha·ja', expectMethod: ['grammar-assembly'] },
  { in: "he doesn't work", expectGaro: 'Ua Dakja', expectMethod: ['grammar-assembly'] },

  // chim/pastcont/gija-construction fixes (e80a6a6)
  { in: 'i used to eat', expectGaro: 'Anga Cha·achim', expectMethod: ['grammar-assembly'] },
  { in: 'i was eating', expectGaro: 'Anga Cha·enga chim', expectMethod: ['grammar-assembly'] },
  { in: 'i was sitting', expectGaro: 'Anga asongenga chim', expectMethod: ['grammar-assembly'] },
  { in: 'she stayed without doing her work', expectGaro: 'Ua an·tangni kamko dakgija dongaha', expectMethod: ['correction'] },

  // --- Bug sweep fixes (2026-07-05): future-negative jawa, dog/a·chak dup ---
  { in: 'i will not eat', expectGaro: 'Anga cha·jawa', expectMethod: ['correction'] },
  { in: 'i will not drink', expectGaro: 'Anga ringjawa', expectMethod: ['correction'] },
  { in: 'i will not go', expectGaro: 'Anga re·jawa', expectMethod: ['correction'] },
  { in: 'dogs', expectGaro: 'Achak' },
  { in: '0 dogs', expectGaro: 'Achak' },

  // --- Rules 27/28/29 (2026-07-05): no true simple past, aha/manaha overlap, -bo hortative ---
  { in: 'he did not go', expectGaro: 'Ua Re·angja', expectMethod: ['grammar-assembly'] },
  { in: 'i did not go', expectGaro: 'Anga Re·angja', expectMethod: ['grammar-assembly'] },
  { in: 'go', expectGaro: 'Re·anga' },
  { in: 'hai cha·bo', expectGaro: 'Hai cha·bo', expectMethod: ['correction'] },

  // --- Grammar-modeling audit (2026-07-05): affirmative past tense via
  // real Rule 2 (-aha) suffix logic instead of per-word memorized corrections ---
  { in: 'he studied', expectGaro: 'Ua po·ri·aha', expectMethod: ['grammar-assembly'] },
  { in: 'he cooked', expectGaro: 'Ua Song·aha', expectMethod: ['grammar-assembly'] },
  { in: 'he walked', expectGaro: 'Ua re·aha', expectMethod: ['grammar-assembly'] },
  { in: 'he answered', expectGaro: 'Ua Aganchakaha', expectMethod: ['grammar-assembly'] },

  // --- Rule 32 (2026-07-05): search=Sandia, replaces am·e·nik·na contamination ---
  { in: 'search', expectGaro: 'Sandia', expectMethod: ['correction'] },
  { in: 'search for him', expectGaro: 'Biko sandibo', expectMethod: ['correction'] },
  { in: 'he searched', expectGaro: 'Ua Sandiaha', expectMethod: ['grammar-assembly'] },
  { in: 'he was searching', expectGaro: 'Ua Sandienga chim', expectMethod: ['grammar-assembly'] },
];

for (const c of REGRESSION_CASES) {
  test(`regression: "${c.in}"`, async () => {
    const r = await translate(c.in);
    if (c.expectMethod) assert.ok(c.expectMethod.includes(r.method), `method: got ${r.method}, expected one of ${c.expectMethod.join(', ')}`);
    if (c.expectGaro) assert.equal(r.garo, c.expectGaro);
  });
}
