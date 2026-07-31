import test from 'node:test';
import assert from 'node:assert/strict';

import { toGaroNumber, BASE } from '../../src/number_engine.js';

// RC-CANDIDATE-032: toGaroNumber's teens formula ("chiking·ma·" + digit) was
// the disproven form, contradicting garo_classifier.js's own native-speaker-
// confirmed fix (TEENS table: "Chi·" + digit). This function was unreachable
// dead code for 11-19 (garo_classifier.js's TEENS table intercepts first),
// but was misleading in isolation and a latent trap for future refactors.
test('RC-CANDIDATE-032: toGaroNumber(11-19) uses the confirmed "Chi·" + digit form', () => {
  const expected = {
    11: 'Chi·sa', 12: 'Chi·gni', 13: 'Chi·gittam', 14: 'Chi·bri',
    15: 'Chi·bonga', 16: 'Chi·dok', 17: 'Chi·sni', 18: 'Chi·chet', 19: 'Chi·sku',
  };
  for (const [n, expectedForm] of Object.entries(expected)) {
    assert.equal(toGaroNumber(Number(n)), expectedForm);
  }
});

test('RC-CANDIDATE-032: toGaroNumber(11-19) no longer returns the disproven "chiking·ma·" form', () => {
  for (let n = 11; n <= 19; n++) {
    assert.ok(!toGaroNumber(n).startsWith('chiking·ma·'));
  }
});

test('RC-CANDIDATE-032: teens formula stays consistent with BASE digits it composes from', () => {
  for (let n = 11; n <= 19; n++) {
    assert.equal(toGaroNumber(n), 'Chi·' + BASE[n - 10]);
  }
});
