// NV-228 follow-up (Claude B, 2026-10-31). Pinned corrections are exempt from neutraliseMidCapitals,
// so the `i will cook` / `she will cook` pins carried a mid-sentence capital (`Song·gen`). Pins lowercased (Owner ruling: capitals neutralised).
import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';
const g = async (en) => (await translate(en)).garo;
test('NV-228b: I will cook (future)', async () => assert.equal(await g('I will cook'), 'Anga song·gen'));
test('NV-228b: She will cook (future)', async () => assert.equal(await g('she will cook'), 'Ua song·gen'));
