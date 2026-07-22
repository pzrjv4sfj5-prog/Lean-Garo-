import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  splitPosMarker,
  checkPageAlreadyProcessed,
  classifyEntry,
} from '../../scripts/claude-d-preflight.js';
import { buildExistingIndex, buildPendingKeys, normalize } from '../../scripts/import-dictionary.js';

test('splitPosMarker splits a mid-string ".—POS. gloss" marker', () => {
  const r = splitPosMarker('to trust.—n. Hope');
  assert.ok(r);
  assert.equal(r.headword, 'to trust');
  assert.equal(r.derived.english, 'hope');
  assert.equal(r.derived.pos, 'n.');
});

test('splitPosMarker returns null for a plain headword (no marker)', () => {
  assert.equal(splitPosMarker('duty'), null);
  assert.equal(splitPosMarker('to bind or tie hands behind'), null);
});

test('checkPageAlreadyProcessed halts on a source_page already recorded in pending_lexicon.json (covers both pending and already-promoted entries)', () => {
  const pending = JSON.parse(fs.readFileSync('src/data/pending_lexicon.json', 'utf8'));
  const known = pending.find(e => e.provenance && e.provenance.source_page);
  assert.ok(known, 'expected at least one pending_lexicon.json record with a provenance.source_page to test against');
  const result = checkPageAlreadyProcessed(known.provenance.source_page);
  assert.equal(result.alreadyProcessed, true);
  assert.ok(result.locations.includes('src/data/pending_lexicon.json'));
});

test('checkPageAlreadyProcessed does not halt on a page that has never been processed', () => {
  const result = checkPageAlreadyProcessed('page-that-will-never-exist-999999');
  assert.equal(result.alreadyProcessed, false);
  assert.deepEqual(result.locations, []);
});

test('classifyEntry: new entry (english not present anywhere)', () => {
  const existingByKey = buildExistingIndex('master_dictionary.json');
  const pendingKeys = buildPendingKeys('src/data/pending_lexicon.json');
  const r = classifyEntry({ english: 'zzznonexistentword12345', garo: 'x' }, existingByKey, pendingKeys);
  assert.equal(r.classification, 'new');
});

test('classifyEntry: exact duplicate (english + garo both match production, trim-exact)', () => {
  const master = JSON.parse(fs.readFileSync('master_dictionary.json', 'utf8'));
  const sample = master.find(e => e.english && e.garo);
  const existingByKey = buildExistingIndex('master_dictionary.json');
  const pendingKeys = buildPendingKeys('src/data/pending_lexicon.json');
  const r = classifyEntry({ english: sample.english, garo: sample.garo }, existingByKey, pendingKeys);
  assert.equal(r.classification, 'exact_duplicate');
});

test('classifyEntry: possible conflict (english matches production, garo differs)', () => {
  const master = JSON.parse(fs.readFileSync('master_dictionary.json', 'utf8'));
  const sample = master.find(e => e.english && e.garo);
  const existingByKey = buildExistingIndex('master_dictionary.json');
  const pendingKeys = buildPendingKeys('src/data/pending_lexicon.json');
  const r = classifyEntry({ english: sample.english, garo: sample.garo + '-DEFINITELY-DIFFERENT' }, existingByKey, pendingKeys);
  assert.equal(r.classification, 'possible_conflict');
});

test('classifyEntry uses exact trim-only garo equality, matching import-dictionary.js exactly — not a raka/dash/space-stripped comparison', () => {
  // Documents the deliberate deviation from the draft contract's
  // Section 3 wording (see scripts/claude-d-preflight.js header).
  // A garo value that's identical except for raka placement must NOT
  // classify as exact_duplicate, because import-dictionary.js's own
  // downstream check would not treat it as one either.
  const master = JSON.parse(fs.readFileSync('master_dictionary.json', 'utf8'));
  const sample = master.find(e => e.english && e.garo && e.garo.includes('·'));
  assert.ok(sample, 'expected at least one production entry containing a raka mark to test against');
  const existingByKey = buildExistingIndex('master_dictionary.json');
  const pendingKeys = buildPendingKeys('src/data/pending_lexicon.json');
  const rakaStripped = sample.garo.replace(/·/g, '');
  assert.notEqual(rakaStripped, sample.garo, 'fixture must actually contain a raka mark for this test to be meaningful');
  const r = classifyEntry({ english: sample.english, garo: rakaStripped }, existingByKey, pendingKeys);
  assert.equal(r.classification, 'possible_conflict', 'raka-stripped garo must not be treated as an exact duplicate');
});

test('end-to-end: CLI run on a synthetic page produces clean array + manifest with correct classification counts', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-d-test-'));
  const inputPath = path.join(tmpDir, 'page.json');
  const master = JSON.parse(fs.readFileSync('master_dictionary.json', 'utf8'));
  const existingEntry = master.find(e => e.english && e.garo && !e.english.includes('.'));

  fs.writeFileSync(inputPath, JSON.stringify([
    { english: 'brandnewword_e2e_test_999', garo: 'gagaga' },
    { english: existingEntry.english, garo: existingEntry.garo },
    { english: 'trust.—n. Hope', garo: 'somegaro' },
    { english: 'example row', garo: 'xx', entry_type: 'example' },
  ]));

  const { execFileSync } = await import('child_process');
  const out = execFileSync('node', ['scripts/claude-d-preflight.js', inputPath, '--source-page', 'e2e-test-page-999', '--source', 'Test'], { encoding: 'utf8' });

  assert.match(out, /1 new, 1 exact duplicate, 1 possible conflict/);

  const clean = JSON.parse(fs.readFileSync(inputPath.replace(/\.json$/, '.clean.json'), 'utf8'));
  assert.equal(clean.length, 3); // new word, duplicate, split-off "trust" headword
  assert.ok(clean.some(e => e.english === 'brandnewword_e2e_test_999'));
  assert.ok(clean.some(e => e.english === normalize(existingEntry.english)));
  assert.ok(clean.some(e => e.english === 'trust'));

  const manifest = JSON.parse(fs.readFileSync(inputPath.replace(/\.json$/, '.manifest.json'), 'utf8'));
  assert.equal(manifest.new_count, 1);
  assert.equal(manifest.exact_duplicate_count, 1);
  // "trust" (split off "trust.—n. Hope") already exists in production
  // with a different garo value — a genuine possible_conflict, not a
  // bug in this test.
  assert.equal(manifest.possible_conflict_count, 1);
  assert.equal(manifest.manual_review_count, 1); // the .—POS. marker's derived-entry flag

  const examples = JSON.parse(fs.readFileSync(inputPath.replace(/\.json$/, '.examples.json'), 'utf8'));
  assert.equal(examples.length, 1);
  assert.equal(examples[0].english, 'example row');

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('end-to-end: halts with exit code 2 on an already-processed page, writes no output files', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-d-test-'));
  const inputPath = path.join(tmpDir, 'page.json');
  const pending = JSON.parse(fs.readFileSync('src/data/pending_lexicon.json', 'utf8'));
  const known = pending.find(e => e.provenance && e.provenance.source_page);
  fs.writeFileSync(inputPath, JSON.stringify([{ english: 'irrelevant', garo: 'irrelevant' }]));

  const { execFileSync } = await import('child_process');
  let threw = null;
  try {
    execFileSync('node', ['scripts/claude-d-preflight.js', inputPath, '--source-page', known.provenance.source_page], { encoding: 'utf8' });
  } catch (e) {
    threw = e;
  }
  assert.ok(threw, 'expected the process to exit non-zero');
  assert.equal(threw.status, 2);
  assert.equal(fs.existsSync(inputPath.replace(/\.json$/, '.clean.json')), false);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});
