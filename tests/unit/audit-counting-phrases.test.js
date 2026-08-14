import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeBareNounIndex, isSuperseded } from '../../scripts/audit-counting-phrases.mjs';

// Regression test for a bug Claude C's independent audit found
// (2026-08-14): scripts/audit-counting-phrases.mjs's `files` array had
// master_dictionary.json and garo_dictionary.json in the wrong order,
// so garo_dictionary.json (processed last) silently overwrote master's
// value in the script's own bare-noun lookup table — the opposite of
// the file's own stated intent ("master wins ties"), and the opposite
// of what prepare-data.js's production pipeline actually does.
//
// Concrete real-world instance this caused: master_dictionary.json's
// live, VERIFIED/HIGH "pen"="kolom" was overwritten by
// garo_dictionary.json's untagged, pre-fix "pen"="Pen" placeholder
// (garo_dictionary.json rows can't carry SUPERSEDED tags at all), which
// then propagated into the audit's candidate report as a bogus
// "expected" value built from the English loanword instead of the
// Garo root.

test('mergeBareNounIndex: later source wins ties (master must be scanned second)', () => {
  const garoSource = {
    name: 'garo_dictionary.json',
    items: [{ english: 'pen', garo: 'Pen' }], // untagged legacy placeholder
  };
  const masterSource = {
    name: 'master_dictionary.json',
    items: [
      { english: 'pen', garo: 'Pen', notes: 'SUPERSEDED — legacy import' },
      { english: 'pen', garo: 'kolom', notes: 'VERIFIED/HIGH — native-confirmed' },
    ],
  };

  // Production order: garo_dictionary.json first, master_dictionary.json
  // second, so master's non-superseded value wins.
  const index = mergeBareNounIndex([garoSource, masterSource]);
  assert.equal(index['pen'], 'kolom');

  // Sanity check the bug this guards against: the wrong order silently
  // lets garo_dictionary.json's untagged placeholder win instead.
  const buggyIndex = mergeBareNounIndex([masterSource, garoSource]);
  assert.equal(buggyIndex['pen'], 'Pen');
});

test('mergeBareNounIndex: SUPERSEDED rows are never selected, even if scanned last', () => {
  const index = mergeBareNounIndex([
    { name: 'a', items: [{ english: 'x', garo: 'good' }] },
    {
      name: 'b',
      items: [{ english: 'x', garo: 'stale', notes: 'SUPERSEDED — audit 2026-08-01' }],
    },
  ]);
  assert.equal(index['x'], 'good');
});

test('isSuperseded: matches leading "SUPERSEDED" case-insensitively, not substrings elsewhere', () => {
  assert.equal(isSuperseded({ notes: 'SUPERSEDED — corpus-internal audit' }), true);
  assert.equal(isSuperseded({ notes: 'superseded, no citation' }), true);
  assert.equal(isSuperseded({ notes: 'VERIFIED/HIGH — not superseded' }), false);
  assert.equal(isSuperseded({ notes: undefined }), false);
});
