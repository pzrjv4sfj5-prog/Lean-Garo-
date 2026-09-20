import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { normalizeFile, posArrayCoercions } from '../../prepare-data.js';

// 2026-09-20, Claude B — docs/CLAUDE_B_SESSION_MIGRATION_20260920.md §6.3.
// Recurring bug pattern first flagged docs/CLAUDE_B_SESSION_MIGRATION_
// 20260919B.md §4: some OCR-batch handoff sources ship `pos` as an array
// (e.g. `["v."]`, confirmed real shape from docs/CLAUDE_D_20260918_p24_p25_
// ready_for_a.json — 84 rows, every one a single-element string array)
// instead of a bare string. Previously `typeof item.pos === 'string'`
// silently discarded ANY array shape to `null` with zero trace. Fixed to
// coerce the unambiguous single-element-array shape and explicitly report
// (never silently guess at) anything more ambiguous.

function withTempMasterFile(rows, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prepare-data-pos-test-'));
  const filePath = path.join(dir, 'master_dictionary.json');
  fs.writeFileSync(filePath, JSON.stringify(rows));
  try {
    return fn(filePath);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('normalizeFile: a single-element string-array pos (["v."]) is coerced to the plain string "v."', () => {
  withTempMasterFile([
    { english: 'pos_array_test_forbid', garo: 'Beng·a', pos: ['v.'], notes: 'Beng·a, V. to forbid', confidence: 'verified_high' },
  ], (filePath) => {
    const { normalized } = normalizeFile(filePath);
    const entry = normalized['pos_array_test_forbid'].find(e => e.v === 'Beng·a');
    assert.ok(entry, 'expected the row to be present in normalized');
    assert.equal(entry.pos, 'v.', 'a single-element pos array must be coerced to its plain string value, not dropped to null');
  });
});

test('normalizeFile: a single-element string-array pos is logged in posArrayCoercions as coerced', () => {
  withTempMasterFile([
    { english: 'pos_array_test_prohibit', garo: 'Beng·a-kanga', pos: ['n.'], notes: 'a compound word meaning to prohibit', confidence: 'verified_high' },
  ], (filePath) => {
    normalizeFile(filePath);
    const entry = posArrayCoercions.find(e => e.key === 'pos_array_test_prohibit');
    assert.ok(entry, 'expected a posArrayCoercions record for this key');
    assert.equal(entry.result, 'n.');
    assert.match(entry.shape, /single-element array, coerced/);
  });
});

test('normalizeFile: an empty pos array is NOT guessed at — resolves to null, but is reported as unresolved (not silently dropped)', () => {
  withTempMasterFile([
    { english: 'pos_array_test_empty', garo: 'Somegaro', pos: [], notes: 'no pos tag at all', confidence: 'verified_high' },
  ], (filePath) => {
    const { normalized } = normalizeFile(filePath);
    const entry = normalized['pos_array_test_empty'].find(e => e.v === 'Somegaro');
    assert.equal(entry.pos, null, 'an empty pos array has no evidence to coerce from and must stay null');
    const report = posArrayCoercions.find(e => e.key === 'pos_array_test_empty');
    assert.ok(report, 'an ambiguous shape must still be visibly reported, not silently discarded');
    assert.equal(report.result, null);
    assert.match(report.shape, /NOT coerced — ambiguous/);
  });
});

test('normalizeFile: a genuine multi-sense pos array (2+ elements) is NOT guessed at — resolves to null, reported as unresolved', () => {
  withTempMasterFile([
    { english: 'pos_array_test_multisense', garo: 'Multigaro', pos: ['n.', 'v.'], notes: 'both a noun and a verb sense', confidence: 'verified_high' },
  ], (filePath) => {
    const { normalized } = normalizeFile(filePath);
    const entry = normalized['pos_array_test_multisense'].find(e => e.v === 'Multigaro');
    assert.equal(entry.pos, null, 'a genuinely ambiguous multi-sense pos must not be guessed at (that is a content decision, not an engineering one)');
    const report = posArrayCoercions.find(e => e.key === 'pos_array_test_multisense');
    assert.ok(report, 'a multi-sense shape must still be visibly reported');
    assert.equal(report.result, null);
    assert.match(report.shape, /array\(length 2\), NOT coerced — ambiguous/);
  });
});

test('normalizeFile: a bare-string pos is completely unaffected by this fix (no regression to the existing, non-array path)', () => {
  withTempMasterFile([
    { english: 'pos_array_test_plain', garo: 'Plaingaro', pos: 'adv.', notes: 'ordinary string pos, pre-existing behavior', confidence: 'verified_high' },
  ], (filePath) => {
    const { normalized } = normalizeFile(filePath);
    const entry = normalized['pos_array_test_plain'].find(e => e.v === 'Plaingaro');
    assert.equal(entry.pos, 'adv.');
    assert.equal(posArrayCoercions.find(e => e.key === 'pos_array_test_plain'), undefined,
      'a row that was never array-shaped must not appear in the coercion report at all');
  });
});

test('normalizeFile: a row with no pos field at all is completely unaffected by this fix', () => {
  withTempMasterFile([
    { english: 'pos_array_test_nopos', garo: 'Nopos', notes: 'no pos field present', confidence: 'verified_high' },
  ], (filePath) => {
    const { normalized } = normalizeFile(filePath);
    const entry = normalized['pos_array_test_nopos'].find(e => e.v === 'Nopos');
    assert.equal(entry.pos, null);
    assert.equal(posArrayCoercions.find(e => e.key === 'pos_array_test_nopos'), undefined);
  });
});
