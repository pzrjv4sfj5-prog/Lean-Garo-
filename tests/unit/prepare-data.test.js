import test from 'node:test';
import assert from 'node:assert/strict';
import { finalizeDictionary } from '../../prepare-data.js';

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
