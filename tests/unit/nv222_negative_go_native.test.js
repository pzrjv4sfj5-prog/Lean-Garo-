// NV-222 (2026-10-28, Claude A): native "not going" / "did not go" forms from Thangseng's original response, Project Owner ruling.
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const cases = [
  ['i am not going', 'Anga re·angjaenga'],
  ['i am not going to the market', 'Anga antichi re·angjaenga'],
  ['he did not go', 'Ua re·angjaha'],
  ['he did not go to the market', 'Ua antichi re·angjaha'],
];
for (const [en, garo] of cases) {
  test(`NV-222 native form: "${en}"`, async () => {
    const r = await translate(en, { useCache: false });
    assert.equal(r.garo, garo);
  });
}
