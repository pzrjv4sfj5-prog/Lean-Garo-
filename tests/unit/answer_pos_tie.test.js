import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { translate } from '../../src/translationEngine.js';

// Handoff B item 8 (docs/HANDOFF_CLAUDE_B_20260906.md, closed 2026-09-06
// Claude B). compiled_dict.json["answer"] shipped the wrong-POS noun form
// ("Aganchakani") because pickPrimary's verifiedNeutral tie-break (two
// independently VERIFIED/HIGH non-variant candidates: 'answer'/Aganchaka
// the verb, 'Answer'/Aganchakani the noun, both from NV-077) fell back to
// plain last-write-wins with no POS awareness. This was previously masked
// at runtime only by a corrections.json override — the compiled data
// itself was still wrong, and the override would silently stop protecting
// the moment it was removed. Fixed by having prepare-data.js prefer,
// among tied VERIFIED/HIGH candidates, whichever one matches its own
// verified "to <key>" infinitive sibling's value — the same "to X" bare
// verb-form convention already used elsewhere in this codebase.

const compiled = JSON.parse(fs.readFileSync(new URL('../../src/compiled_dict.json', import.meta.url)));

test('compiled_dict.json ships the verb form for "answer", not the noun', () => {
  assert.equal(compiled['answer'], 'Aganchaka');
});

test('corrections.json no longer needs an override for "answer" (fixed at the data level)', () => {
  const corrections = JSON.parse(fs.readFileSync(new URL('../../src/data/corrections.json', import.meta.url)));
  assert.equal(corrections['answer'], undefined);
});

test('bare "answer" still resolves to the verb form at runtime', async () => {
  const r = await translate('answer');
  assert.equal(r.garo, 'Aganchaka');
});

test('"he answered" still composes correctly (regression guard)', async () => {
  const r = await translate('he answered');
  assert.equal(r.garo, 'Ua Aganchakaha');
});
