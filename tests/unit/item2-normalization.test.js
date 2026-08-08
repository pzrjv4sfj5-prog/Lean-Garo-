import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  normalizeGaro,
  buildNormalizedGaroIndex,
  findNearDuplicates,
} from '../../scripts/import-dictionary.js';

// --- normalizeGaro() — the ruleset itself, in the exact spec order ---

test('normalizeGaro: strips raka dots', () => {
  assert.equal(normalizeGaro('bi·te'), 'bite');
});

test('normalizeGaro: strips hyphens', () => {
  assert.equal(normalizeGaro('Bol-asa-ri'), 'bolasari');
});

test('normalizeGaro: collapses consecutive whitespace and trims', () => {
  assert.equal(normalizeGaro('  ra a   bi   te  '), 'ra a bi te');
});

test('normalizeGaro: case-folds to lowercase', () => {
  assert.equal(normalizeGaro('Bolasari'), 'bolasari');
});

test('normalizeGaro: preserves apostrophes exactly (genuine raka realization, not noise)', () => {
  assert.equal(normalizeGaro("cha'a"), "cha'a");
  assert.equal(normalizeGaro("Cha'A"), "cha'a");
});

test('normalizeGaro: removes a complete parenthetical OCR/pronunciation gloss', () => {
  assert.equal(normalizeGaro('Bolasari (a middle-sized deciduous tree)'), 'bolasari');
});

test('normalizeGaro: does not normalize or compare inside the parenthetical — it is dropped wholesale, marks inside it never leak into the key', () => {
  // A raka/hyphen INSIDE the parenthetical must not affect the key at
  // all — the whole segment is removed before any other rule runs.
  assert.equal(normalizeGaro('Bitong (bi·am-bong, alt. spelling)'), 'bitong');
});

test('normalizeGaro: two entries differing only by a parenthetical gloss normalize identically', () => {
  const a = normalizeGaro('a middle-sized deciduous tree (lagerstroemia)');
  const b = normalizeGaro('a middle-sized deciduous tree');
  // (this is testing garo-value normalization, but the rule is generic
  // string handling — exercised again below on real garo-shaped values)
  assert.equal(a, b);
});

test('normalizeGaro: combined pipeline (parens, raka, hyphen, whitespace, case) on one value', () => {
  assert.equal(normalizeGaro("  Bol-asa·ri (OCR note, page 31)  "), 'bolasari');
});

test('normalizeGaro: empty/null-ish input returns empty string, never throws', () => {
  assert.equal(normalizeGaro(''), '');
  assert.equal(normalizeGaro(null), '');
  assert.equal(normalizeGaro(undefined), '');
});

test('normalizeGaro: compare-only — never mutates or is used in place of the original stored value', () => {
  const original = 'Bol-asa·ri (page 31)';
  normalizeGaro(original);
  assert.equal(original, 'Bol-asa·ri (page 31)', 'input string must be untouched');
});

// --- buildNormalizedGaroIndex() / findNearDuplicates() — the index + lookup ---

function withTmpMaster(entries, fn) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'item2-test-'));
  const p = path.join(tmpDir, 'master_dictionary.json');
  fs.writeFileSync(p, JSON.stringify(entries));
  try {
    return fn(p);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

test('buildNormalizedGaroIndex + findNearDuplicates: flags a raka/case variant of an existing production entry', () => {
  withTmpMaster(
    [{ english: 'fruit', garo: 'bi·te', category: 'food' }],
    (masterPath) => {
      const idx = buildNormalizedGaroIndex(masterPath);
      const matches = findNearDuplicates('Bite', idx);
      assert.equal(matches.length, 1);
      assert.equal(matches[0].garo, 'bi·te');
      assert.equal(matches[0].english, 'fruit');
    }
  );
});

test('findNearDuplicates: does NOT flag an exact raw-string match (that is the authoritative exact-duplicate path\'s job, not this one\'s)', () => {
  withTmpMaster(
    [{ english: 'fruit', garo: 'bi·te', category: 'food' }],
    (masterPath) => {
      const idx = buildNormalizedGaroIndex(masterPath);
      const matches = findNearDuplicates('bi·te', idx);
      assert.equal(matches.length, 0, 'identical raw string must not double-report as a near-duplicate');
    }
  );
});

test('findNearDuplicates: does NOT flag a genuinely distinct word', () => {
  withTmpMaster(
    [{ english: 'fruit', garo: 'bi·te', category: 'food' }],
    (masterPath) => {
      const idx = buildNormalizedGaroIndex(masterPath);
      const matches = findNearDuplicates('achak', idx);
      assert.equal(matches.length, 0);
    }
  );
});

test('findNearDuplicates: flags across a parenthetical-gloss difference', () => {
  withTmpMaster(
    [{ english: 'tree', garo: 'Bolasari (lagerstroemia)', category: 'plants' }],
    (masterPath) => {
      const idx = buildNormalizedGaroIndex(masterPath);
      const matches = findNearDuplicates('Bolasari', idx);
      assert.equal(matches.length, 1);
      assert.equal(matches[0].garo, 'Bolasari (lagerstroemia)');
    }
  );
});

test('findNearDuplicates: is global (english-independent) — catches the same headword under a totally different english gloss', () => {
  withTmpMaster(
    [{ english: 'trunk', garo: 'Bitong', category: 'plants' }],
    (masterPath) => {
      const idx = buildNormalizedGaroIndex(masterPath);
      const matches = findNearDuplicates('bi-tong', idx);
      assert.equal(matches.length, 1);
      assert.equal(matches[0].english, 'trunk');
    }
  );
});

// --- import-dictionary.js end-to-end: near_duplicate field on staged pending records ---

test('end-to-end (import-dictionary.js --apply): a near-duplicate (not exact-match) entry is staged with a near_duplicate field, never skipped or auto-merged', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'item2-import-test-'));
  const repoRoot = process.cwd();
  try {
    fs.mkdirSync(path.join(tmpDir, 'src', 'data'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'scripts'), { recursive: true });
    fs.cpSync(path.join(repoRoot, 'scripts', 'import-dictionary.js'), path.join(tmpDir, 'scripts', 'import-dictionary.js'));
    fs.writeFileSync(
      path.join(tmpDir, 'master_dictionary.json'),
      JSON.stringify([{ english: 'fruit', garo: 'bi·te', category: 'food' }])
    );
    fs.writeFileSync(path.join(tmpDir, 'src', 'data', 'pending_lexicon.json'), '[]');
    const inputPath = path.join(tmpDir, 'input.json');
    fs.writeFileSync(inputPath, JSON.stringify([{ english: 'fruit (variant spelling)', garo: 'Bite' }]));

    const { execFileSync } = await import('child_process');
    execFileSync('node', [path.join(tmpDir, 'scripts', 'import-dictionary.js'), inputPath, '--apply'], {
      cwd: tmpDir,
      encoding: 'utf8',
    });

    const pending = JSON.parse(fs.readFileSync(path.join(tmpDir, 'src', 'data', 'pending_lexicon.json'), 'utf8'));
    assert.equal(pending.length, 1);
    const staged = pending[0];
    assert.equal(staged.english, 'fruit (variant spelling)');
    assert.equal(staged.garo, 'Bite');
    // Exact-match rules treat this as "new" (different english key,
    // different raw garo) — conflict.type stays null. near_duplicate is
    // the independent, additive Item 2 signal.
    assert.equal(staged.conflict.type, null, 'near-duplicate must not be conflated with the authoritative conflict classification');
    assert.ok(staged.near_duplicate, 'near_duplicate field must be populated');
    assert.equal(staged.near_duplicate.matches.length, 1);
    assert.equal(staged.near_duplicate.matches[0].garo, 'bi·te');
    assert.equal(staged.near_duplicate.matches[0].english, 'fruit');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('end-to-end (import-dictionary.js --apply): an entry with no near-duplicate gets near_duplicate: null', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'item2-import-test-clean-'));
  const repoRoot = process.cwd();
  try {
    fs.mkdirSync(path.join(tmpDir, 'src', 'data'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'scripts'), { recursive: true });
    fs.cpSync(path.join(repoRoot, 'scripts', 'import-dictionary.js'), path.join(tmpDir, 'scripts', 'import-dictionary.js'));
    fs.writeFileSync(
      path.join(tmpDir, 'master_dictionary.json'),
      JSON.stringify([{ english: 'fruit', garo: 'bi·te', category: 'food' }])
    );
    fs.writeFileSync(path.join(tmpDir, 'src', 'data', 'pending_lexicon.json'), '[]');
    const inputPath = path.join(tmpDir, 'input.json');
    fs.writeFileSync(inputPath, JSON.stringify([{ english: 'completely unrelated word', garo: 'zzqxvw' }]));

    const { execFileSync } = await import('child_process');
    execFileSync('node', [path.join(tmpDir, 'scripts', 'import-dictionary.js'), inputPath, '--apply'], {
      cwd: tmpDir,
      encoding: 'utf8',
    });

    const pending = JSON.parse(fs.readFileSync(path.join(tmpDir, 'src', 'data', 'pending_lexicon.json'), 'utf8'));
    assert.equal(pending.length, 1);
    assert.equal(pending[0].near_duplicate, null);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// --- promote-lexicon.js: near-dup is advisory-only, never blocks promotion ---

test('end-to-end (promote-lexicon.js --apply): a near-duplicate candidate is still promoted (warning only, never blocked)', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'item2-promote-test-'));
  const repoRoot = process.cwd();
  try {
    fs.mkdirSync(path.join(tmpDir, 'src', 'data'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'scripts'), { recursive: true });
    fs.cpSync(path.join(repoRoot, 'scripts', 'import-dictionary.js'), path.join(tmpDir, 'scripts', 'import-dictionary.js'));
    fs.cpSync(path.join(repoRoot, 'scripts', 'promote-lexicon.js'), path.join(tmpDir, 'scripts', 'promote-lexicon.js'));
    fs.writeFileSync(
      path.join(tmpDir, 'master_dictionary.json'),
      JSON.stringify([{ english: 'fruit', garo: 'bi·te', category: 'food' }])
    );
    fs.writeFileSync(
      path.join(tmpDir, 'src', 'data', 'pending_lexicon.json'),
      JSON.stringify([{
        id: 'PL-0000001',
        english: 'fruit (variant spelling)',
        garo: 'Bite',
        category: 'food',
        pos: null,
        classifier: null,
        notes: null,
        provenance: { source: 'test', source_page: null, import_batch: 'test', import_date: '2026-01-01T00:00:00.000Z', ocr_version: null },
        review_status: 'approved',
        review_notes: null,
        reviewed_by: 'Claude A',
        reviewed_date: '2026-01-01T00:00:00.000Z',
        conflict: { type: null, details: null },
        near_duplicate: { normalized_key: 'bite', matches: [{ english: 'fruit', garo: 'bi·te' }] },
        promotion_status: 'pending',
        promoted_date: null,
      }])
    );

    const { execFileSync } = await import('child_process');
    const out = execFileSync('node', [path.join(tmpDir, 'scripts', 'promote-lexicon.js'), '--id', 'PL-0000001', '--apply'], {
      cwd: tmpDir,
      encoding: 'utf8',
    });

    assert.match(out, /WARN near_duplicate PL-0000001/, 'expected an advisory warning to be printed');
    assert.match(out, /1 entries promoted to master_dictionary\.json/, 'promotion must proceed despite the near-duplicate warning');

    const master = JSON.parse(fs.readFileSync(path.join(tmpDir, 'master_dictionary.json'), 'utf8'));
    assert.ok(master.some(e => e.english === 'fruit (variant spelling)' && e.garo === 'Bite'), 'the near-duplicate candidate must actually be promoted, not blocked');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
