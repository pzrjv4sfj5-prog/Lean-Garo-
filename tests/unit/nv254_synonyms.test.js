// NV-254 (Claude A, 2026-11-01): Owner directive: Bia = Ua, Namengaba = namenga, bajalchi = antichi are synonyms.
// Primaries stay Ua / Anga namenga / bajalchi; the synonyms are verified variants.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { translate } from '../../src/translationEngine.js';

const alt = JSON.parse(fs.readFileSync(new URL('../../src/compiled_dict_alternates.json', import.meta.url), 'utf8'));

test('NV-254 primaries unchanged', async () => {
  assert.equal((await translate('he')).garo, 'Ua');
  assert.equal((await translate('i am fine')).garo, 'Anga namenga');
  assert.equal((await translate('to the market')).garo, 'bajalchi');
});

test('NV-254 synonyms recorded as variants', () => {
  assert.ok(JSON.stringify(alt['she']).includes('Bia'));
  // NV-262: Owner closed `to the market` = bajalchi only; antichi variant deleted.
  assert.ok(!JSON.stringify(alt['to the market'] || []).includes('antichi'));
  assert.ok(JSON.stringify(alt['i am fine']).toLowerCase().includes('namengaba'));
});
