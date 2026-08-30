import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { finalizeDictionary, pickPrimaryNoVerifiedCandidate, normalizeFile } from '../../prepare-data.js';

// 2026-08-14, Claude B — regression tests for the SUPERSEDED-only-candidate
// fix (per Claude C's audit §3, the "twenty students" case: master
// explicitly marks a value SUPERSEDED for a key, that key has no surviving
// non-SUPERSEDED master candidate, but a non-master source with no `notes`
// field to tag it — garo_dictionary.json et al — independently duplicates
// the exact same wrong string untagged. Before this fix, that untagged
// duplicate silently shipped to compiled_dict.json anyway, defeating the
// entire SUPERSEDED mechanism. finalizeDictionary now takes a third
// `supersededByKey` argument (key -> Set<garo value>) built from
// normalizeFile's new `superseded` return, and filters any non-master
// (source !== 2) candidate whose value matches out before pickPrimary ever
// sees it. Isolated with synthetic entries so these tests don't depend on
// the real dictionaries' current content.

test('finalizeDictionary: a key with ONLY a SUPERSEDED-matching candidate is held, not shipped', () => {
  const mergedValues = {
    'twenty students': [
      // garo_dictionary.json (source 0) — untagged, but identical to the
      // value master_dictionary.json flagged SUPERSEDED for this key.
      { v: 'chi chi chik·gni', isVariant: false, isVerified: false, rawKey: 'twenty students', source: 0 },
    ],
  };
  const supersededByKey = {
    'twenty students': new Set(['chi chi chik·gni']),
  };
  const { finalized, heldSupersededOnly } = finalizeDictionary(mergedValues, {}, supersededByKey);
  assert.equal(finalized['twenty students'], undefined,
    'a key whose only candidate matches a SUPERSEDED value must not ship');
  assert.ok(heldSupersededOnly['twenty students'],
    'the held key must be reported in heldSupersededOnly for follow-up review');
  assert.deepEqual(heldSupersededOnly['twenty students'], ['chi chi chik·gni']);
});

test('finalizeDictionary: a genuinely different non-master candidate for the same key still ships', () => {
  // Master superseded ONE specific wrong value, but a different, distinct
  // candidate exists for the same key. That's not the same tainted content
  // resurfacing — it's an independent (if unverified) value, and the
  // existing last-write-wins fallback should still apply to it.
  const mergedValues = {
    'some phrase': [
      { v: 'a different value entirely', isVariant: false, isVerified: false, rawKey: 'some phrase', source: 0 },
    ],
  };
  const supersededByKey = {
    'some phrase': new Set(['the wrong old value']),
  };
  const { finalized } = finalizeDictionary(mergedValues, {}, supersededByKey);
  assert.equal(finalized['some phrase'], 'a different value entirely');
});

test('finalizeDictionary: master\'s own live re-confirmation of a value is NOT filtered, even if a stale sibling row shares the same string (the "two dogs" case)', () => {
  // master_dictionary.json can hold a stale SUPERSEDED row and a separate,
  // still-live VERIFIED/HIGH row that happen to share the exact same garo
  // value (the SUPERSEDED note there flags a *different*, already-resolved
  // contradiction, not this value itself). main()'s merge step upgrades
  // such an entry's `source` to 2 when master re-confirms it — the filter
  // must only strip source !== 2 (non-master) duplicates.
  const mergedValues = {
    'two dogs': [
      { v: 'achak mang·gni', isVariant: false, isVerified: true, rawKey: 'two dogs', source: 2 },
    ],
  };
  const supersededByKey = {
    'two dogs': new Set(['achak mang·gni']),
  };
  const { finalized, heldSupersededOnly } = finalizeDictionary(mergedValues, {}, supersededByKey);
  assert.equal(finalized['two dogs'], 'achak mang·gni',
    'master\'s own live-sourced (source===2) candidate must survive even if a stale sibling note shares its value');
  assert.equal(heldSupersededOnly['two dogs'], undefined);
});

test('finalizeDictionary: a key with no superseded history at all is completely unaffected', () => {
  const mergedValues = {
    'ordinary key': [
      { v: 'ordinary value', isVariant: false, isVerified: false, rawKey: 'ordinary key', source: 0 },
    ],
  };
  const { finalized, heldSupersededOnly } = finalizeDictionary(mergedValues, {}, {});
  assert.equal(finalized['ordinary key'], 'ordinary value');
  assert.equal(heldSupersededOnly['ordinary key'], undefined);
});

test('finalizeDictionary: supersededByKey defaults to {} when omitted (back-compat with any other caller)', () => {
  const mergedValues = {
    k: [{ v: 'v', isVariant: false, isVerified: false, rawKey: 'k', source: 0 }],
  };
  const { finalized } = finalizeDictionary(mergedValues, {});
  assert.equal(finalized['k'], 'v');
});

// 2026-08-22, Claude B — AI-001 subclass (b) enumeration (docs/
// CLAUDE_B_ENGINEERING_GOVERNANCE.md §1/§4): pickPrimaryNoVerifiedCandidate
// is a module-level collector populated as a side effect of
// finalizeDictionary, so these tests check for the presence of the
// expected key rather than exact array equality — the array accumulates
// across every finalizeDictionary call in this process, same shared-state
// shape as pickPrimaryVerifiedTies already has (untested before this).

test('finalizeDictionary: a key with zero verified candidates anywhere is recorded in pickPrimaryNoVerifiedCandidate', () => {
  const mergedValues = {
    'no_verified_test_key_20260822': [
      { v: 'Kam', isVariant: false, isVerified: false, isVariantVerified: false, isWeak: true, rawKey: 'work', source: 0 },
      { v: 'ga·a', isVariant: true, isVerified: false, isVariantVerified: false, isWeak: false, rawKey: 'Work', source: 0 },
    ],
  };
  const { finalized } = finalizeDictionary(mergedValues, {});
  const entry = pickPrimaryNoVerifiedCandidate.find(e => e.key === 'no_verified_test_key_20260822');
  assert.ok(entry, 'expected key to be recorded in pickPrimaryNoVerifiedCandidate');
  assert.equal(entry.chosen, finalized['no_verified_test_key_20260822']);
  assert.equal(entry.candidates.length, 2);
  assert.ok(entry.candidates.some(c => c.v === 'Kam' && c.isWeak === true));
});

test('finalizeDictionary: a key with a VERIFIED/HIGH candidate is NOT recorded in pickPrimaryNoVerifiedCandidate', () => {
  const mergedValues = {
    'has_verified_test_key_20260822': [
      { v: 'wrongvalue', isVariant: false, isVerified: false, isVariantVerified: false, isWeak: false, rawKey: 'x', source: 0 },
      { v: 'correctvalue', isVariant: false, isVerified: true, isVariantVerified: false, isWeak: false, rawKey: 'X', source: 0 },
    ],
  };
  const { finalized } = finalizeDictionary(mergedValues, {});
  assert.equal(finalized['has_verified_test_key_20260822'], 'correctvalue');
  const entry = pickPrimaryNoVerifiedCandidate.find(e => e.key === 'has_verified_test_key_20260822');
  assert.equal(entry, undefined, 'a key with a genuine VERIFIED candidate must not appear in the no-verified-candidate report');
});

// 2026-08-30, Claude B — SUPERSEDED-eligibility audit (docs/CLAUDE_B_
// SESSION_MIGRATION_20260830.md). Two confirmed real bugs, both regression-
// tested against the actual pipeline functions (not just synthetic shape
// checks), using a real temp master_dictionary.json so normalizeFile's own
// file-parsing/notes-reading logic is exercised end to end, not bypassed.

function withTempMasterFile(rows, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prepare-data-test-'));
  const filePath = path.join(dir, 'master_dictionary.json');
  fs.writeFileSync(filePath, JSON.stringify(rows));
  try {
    return fn(filePath);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('normalizeFile: a row with confidence stuck on "unverified" but notes literally starting "SUPERSEDED" is still excluded from normalized and recorded as superseded (migration-gap fallback)', () => {
  // Reproduces the real 'bye'/'bland' data shape found this session: the
  // confidence-schema migration never re-tagged these rows' `confidence`
  // field even though their `notes` already declared them superseded.
  withTempMasterFile([
    { english: 'bye', garo: 'De / Ra / Bai', notes: 'SUPERSEDED 2026-08-26 — imprecise bundled candidate, no single confirmed default.', confidence: 'unverified' },
    { english: 'Bye', garo: 'De', notes: 'VERIFIED/HIGH — confirmed default.', confidence: 'verified_high' },
  ], (filePath) => {
    const { normalized, superseded } = normalizeFile(filePath);
    assert.ok(!normalized['bye'].some(e => e.v === 'De / Ra / Bai'),
      'the notes-declared-SUPERSEDED bundled candidate must not enter normalized (translation-eligible) at all');
    assert.ok(superseded['bye'] && superseded['bye'].has('De / Ra / Bai'),
      'the notes-declared-SUPERSEDED value must be recorded in the superseded set for provenance/cross-source filtering');
    assert.ok(normalized['bye'].some(e => e.v === 'De'),
      'the genuinely verified sibling row must still ship normally');
  });
});

test('normalizeFile: confidence: "superseded" still works exactly as before (no regression to the existing, non-fallback path)', () => {
  withTempMasterFile([
    { english: 'twenty students', garo: 'chi chi chik·gni', notes: 'legacy import, no notes tag', confidence: 'superseded' },
  ], (filePath) => {
    const { normalized, superseded } = normalizeFile(filePath);
    assert.equal(normalized['twenty students'], undefined);
    assert.ok(superseded['twenty students'].has('chi chi chik·gni'));
  });
});

test('normalizeFile: a row with confidence "unverified" and notes that merely MENTION "superseded" later in the text (not at the start) is NOT treated as superseded — narrow, anchored match only', () => {
  withTempMasterFile([
    { english: 'testword', garo: 'Testgaro', notes: 'UNVERIFIED/HIGH — this entry was superseded in an earlier draft, later reinstated.', confidence: 'unverified' },
  ], (filePath) => {
    const { normalized, superseded } = normalizeFile(filePath);
    assert.ok(normalized['testword'].some(e => e.v === 'Testgaro'),
      'a mid-sentence mention of the word "superseded" must not trigger exclusion — only a notes field that STARTS with SUPERSEDED is a real tag');
    assert.equal(superseded['testword'], undefined);
  });
});

test('finalizeDictionary: alternates uses the SUPERSEDED-filtered candidate list, not the raw pre-filter list (compiled_dict_alternates.json leak fix)', () => {
  // Same shape as the real 'bland' bug (two SUPERSEDED-tainted values plus
  // one genuinely verified value for the same key), but with the tainted
  // candidates sourced non-master (source: 0) — i.e. the "untagged
  // resurfacing from a source file with no notes field" case that the
  // finalizeDictionary-level superseded filter (as opposed to
  // normalizeFile's own notes-fallback, tested separately above) is
  // actually responsible for catching. (A master-sourced, source:2
  // candidate sharing the exact superseded string is deliberately NOT
  // filtered at this layer — see the "one dog"/"two dogs" precedent in
  // finalizeDictionary's own comments; that in-master case is instead
  // caught upstream by normalizeFile never adding the row to `normalized`
  // in the first place, which is what the 'bye'/'bland' fix above targets.)
  // Before this fix, alternates was built from the raw `mergedValues[key]`
  // (bypassing the superseded filter applied to `cleanedEntries`), so a
  // SUPERSEDED value could ship in compiled_dict_alternates.json even when
  // correctly excluded from the primary translation.
  const mergedValues = {
    'bland': [
      { v: 'chi·brek·a', isVariant: false, isVerified: false, isVariantVerified: false, isWeak: true, rawKey: 'bland', source: 0 },
      { v: '·brok·', isVariant: false, isVerified: false, isVariantVerified: false, isWeak: true, rawKey: 'bland', source: 0 },
      { v: 'Chibroka', isVariant: false, isVerified: true, isVariantVerified: false, isWeak: false, rawKey: 'bland', source: 2 },
    ],
  };
  const supersededByKey = {
    bland: new Set(['chi·brek·a', '·brok·']),
  };
  const { finalized, alternates } = finalizeDictionary(mergedValues, {}, supersededByKey);
  assert.equal(finalized['bland'], 'Chibroka');
  // Only 1 cleaned candidate survives the filter (the verified one), so
  // alternates should not even be set for this key (matches the real
  // 'bland' post-fix behavior: alternates === undefined, not a leaked list).
  assert.equal(alternates['bland'], undefined,
    'with only one non-superseded candidate surviving, no alternates entry should be created at all');
});

test('finalizeDictionary: alternates for a key with 2+ genuinely surviving candidates never includes a value filtered out as superseded', () => {
  const mergedValues = {
    'multi': [
      { v: 'staleval', isVariant: false, isVerified: false, isVariantVerified: false, isWeak: true, rawKey: 'multi', source: 0 },
      { v: 'goodval1', isVariant: false, isVerified: true, isVariantVerified: false, isWeak: false, rawKey: 'multi', source: 2 },
      { v: 'goodval2', isVariant: true, isVerified: false, isVariantVerified: true, isWeak: false, rawKey: 'multi', source: 2 },
    ],
  };
  const supersededByKey = {
    multi: new Set(['staleval']),
  };
  const { alternates } = finalizeDictionary(mergedValues, {}, supersededByKey);
  assert.ok(alternates['multi'], 'expected an alternates entry (2 genuine survivors)');
  assert.ok(!alternates['multi'].includes('staleval'),
    'a value filtered out of the primary selection as SUPERSEDED-tainted must never appear in alternates either');
  assert.deepEqual(alternates['multi'].sort(), ['goodval1', 'goodval2'].sort());
});
