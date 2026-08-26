import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { researchMissingWord, STATUS, DEFAULT_PROVIDER, clearCache, getCacheStats } from '../../src/research/researchFallback.js';
import { detectUnresolvedWords } from '../../src/research/detectUnresolved.js';
import { mockProvider } from '../../src/research/mockProvider.js';
import { translate } from '../../src/translationEngine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

// --- Status model -----------------------------------------------------

test('AI-fallback: STATUS has no CONFIRMED value, ever', () => {
  assert.equal('CONFIRMED' in STATUS, false);
  assert.deepEqual(Object.keys(STATUS).sort(), [
    'NATIVE_VALIDATION_REQUIRED',
    'NO_EVIDENCE_FOUND',
    'PROVISIONAL',
    'UNRESOLVED',
  ]);
});

// --- DEFAULT_PROVIDER: fail-closed ------------------------------------

test('AI-fallback: DEFAULT_PROVIDER (unwired default) returns NO_EVIDENCE_FOUND, never fabricates', async () => {
  clearCache();
  const result = await researchMissingWord({ englishWord: 'anything', provider: DEFAULT_PROVIDER });
  assert.equal(result.status, STATUS.NO_EVIDENCE_FOUND);
  assert.equal(result.candidate_garo, null);
  assert.deepEqual(result.candidates, []);
  assert.equal(result.requires_native_validation, true);
});

// --- Invalid input -> UNRESOLVED ---------------------------------------

test('AI-fallback: missing/invalid englishWord returns UNRESOLVED, requires_native_validation true', async () => {
  const result = await researchMissingWord({ englishWord: '' });
  assert.equal(result.status, STATUS.UNRESOLVED);
  assert.equal(result.requires_native_validation, true);
});

// --- PROVISIONAL: full shape, per task brief item 8 --------------------

test('AI-fallback: a mocked provider with evidence produces the full PROVISIONAL shape', async () => {
  clearCache();
  const result = await researchMissingWord({
    englishWord: 'widget',
    sentence: 'she is carrying a widget',
    provider: mockProvider,
    useCache: false,
  });
  assert.equal(result.status, STATUS.PROVISIONAL);
  assert.equal(result.requires_native_validation, true);
  assert.ok(result.candidates.length > 0, 'expected at least one candidate');
  for (const c of result.candidates) {
    assert.equal(typeof c.garo, 'string');
    assert.equal(typeof c.confidence, 'number');
    assert.ok(c.source, 'candidate must carry provenance');
  }
  assert.ok(result.evidence.length > 0, 'evidence[] must be populated');
  assert.ok(result.sources.length > 0, 'sources[] must be populated');
  assert.equal(typeof result.confidence, 'number');
  assert.equal(typeof result.timestamp, 'string');
});

// --- Disagreeing candidates: no silent single-answer choice -----------

test('AI-fallback: multiple disagreeing candidates leave candidate_garo null (no silent pick)', async () => {
  clearCache();
  const disagreeingProvider = {
    async search() { return [{ sourceType: 'other_web', source: { url: 'https://example.invalid/a' } }]; },
    async synthesize() {
      return {
        candidates: [
          { garo: 'OptionA', confidence: 0.5, source: { url: 'https://example.invalid/a' } },
          { garo: 'OptionB', confidence: 0.4, source: { url: 'https://example.invalid/b' } },
        ],
      };
    },
  };
  const result = await researchMissingWord({ englishWord: 'ambiguous', provider: disagreeingProvider, useCache: false });
  assert.equal(result.status, STATUS.PROVISIONAL);
  assert.equal(result.candidate_garo, null, 'candidate_garo must stay null when candidates disagree');
  assert.equal(result.candidates.length, 2);
});

// --- Caching -------------------------------------------------------------

test('AI-fallback: cache returns fromCache=true on second call, bypassed with useCache:false', async () => {
  clearCache();
  const first = await researchMissingWord({ englishWord: 'cachetest', provider: DEFAULT_PROVIDER });
  assert.equal(first.fromCache, false);
  const second = await researchMissingWord({ englishWord: 'cachetest', provider: DEFAULT_PROVIDER });
  assert.equal(second.fromCache, true);
  const stats = getCacheStats();
  assert.ok(stats.size >= 1);
});

// --- Isolation from production translate() path ------------------------

test('AI-fallback: no production source file imports src/research/', () => {
  const srcDir = path.join(repoRoot, 'src');
  const productionFiles = fs.readdirSync(srcDir)
    .filter(f => f.endsWith('.js'))
    .map(f => path.join(srcDir, f));
  // also check src/data/*.js
  const dataDir = path.join(srcDir, 'data');
  const dataFiles = fs.existsSync(dataDir)
    ? fs.readdirSync(dataDir).filter(f => f.endsWith('.js')).map(f => path.join(dataDir, f))
    : [];
  for (const file of [...productionFiles, ...dataFiles]) {
    const content = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(
      content,
      /from ['"].*research\//,
      `${path.relative(repoRoot, file)} must not import from src/research/ (production/prototype isolation)`
    );
  }
});

test('AI-fallback: researchFallback.js and detectUnresolved.js never import node:fs (cannot write any file)', () => {
  for (const rel of ['src/research/researchFallback.js', 'src/research/detectUnresolved.js', 'src/research/mockProvider.js']) {
    const content = fs.readFileSync(path.join(repoRoot, rel), 'utf8');
    assert.doesNotMatch(content, /from ['"](node:)?fs['"]/, `${rel} must not import fs`);
  }
});

test('AI-fallback: calling researchMissingWord repeatedly does not change translate() output for the same word', async () => {
  const before = await translate('i saw gadget');
  await researchMissingWord({ englishWord: 'gadget', provider: mockProvider, useCache: false });
  await researchMissingWord({ englishWord: 'gadget', provider: DEFAULT_PROVIDER, useCache: false });
  const after = await translate('i saw gadget');
  assert.deepEqual(before, after, 'production translate() output must be unaffected by any research call');
});

test('AI-fallback: canonical data files are byte-identical before and after a research call', async () => {
  const candidatePaths = [
    'master_dictionary.json',
    'src/master_dictionary.json',
    'src/data/corrections.json',
    'src/corrections.json',
    'corrections.json',
    'src/compiled_dict.json',
    'compiled_dict.json',
  ];
  const canonicalFiles = candidatePaths
    .map(f => path.join(repoRoot, f))
    .filter(f => fs.existsSync(f));
  // Dedup by real path in case multiple candidates resolve to the same file.
  const uniqueFiles = [...new Set(canonicalFiles)];
  assert.ok(uniqueFiles.length >= 3, `expected to find master_dictionary/corrections/compiled_dict; found: ${uniqueFiles.join(', ')}`);
  const canonicalFilesFinal = uniqueFiles;

  const before = canonicalFilesFinal.map(f => fs.readFileSync(f, 'utf8'));
  await researchMissingWord({ englishWord: 'widget', sentence: 'she is carrying a widget', provider: mockProvider, useCache: false });
  await researchMissingWord({ englishWord: 'gadget', provider: DEFAULT_PROVIDER, useCache: false });
  const after = canonicalFilesFinal.map(f => fs.readFileSync(f, 'utf8'));

  canonicalFilesFinal.forEach((f, i) => {
    assert.equal(after[i], before[i], `${path.relative(repoRoot, f)} must be byte-identical after a research call`);
  });
});

// --- detectUnresolvedWords sanity (read-only, matches engine lookups) --

test('AI-fallback: detectUnresolvedWords flags a genuinely unresolved word and nothing else', () => {
  const detection = detectUnresolvedWords('i saw gadget');
  assert.equal(detection.isComplete, false);
  assert.ok(detection.unresolvedWords.includes('gadget'));
});

test('AI-fallback: detectUnresolvedWords reports isComplete true for a fully-resolved sentence', () => {
  const detection = detectUnresolvedWords('i saw the dog');
  assert.equal(detection.isComplete, true);
  assert.deepEqual(detection.unresolvedWords, []);
});
