/**
 * demoProvisional.js
 * Claude B — AI/Web Fallback Research Prototype, Phase 1
 *
 * Demonstrates the PROVISIONAL path of researchMissingWord() end to end,
 * using the explicitly-mocked provider in mockProvider.js (see that file's
 * header — the Garo candidate is a FABRICATED placeholder, not real
 * linguistic content). Complements demo.js, whose two cases both land on
 * NO_EVIDENCE_FOUND and never exercise this path.
 *
 * Run: node src/research/demoProvisional.js
 */

import { researchMissingWord, STATUS } from './researchFallback.js';
import { mockProvider } from './mockProvider.js';

export async function runProvisionalDemo() {
  const result = await researchMissingWord({
    englishWord: 'widget',
    sentence: 'she is carrying a widget',
    provider: mockProvider,
    useCache: false,
  });

  console.log('researchMissingWord("widget") with mocked provider:');
  console.log(JSON.stringify(result, null, 2));

  const checks = {
    'has at least one candidate': result.candidates.length > 0,
    'candidate has garo/confidence/source': result.candidates.every(
      c => typeof c.garo === 'string' && typeof c.confidence === 'number' && !!c.source
    ),
    'evidence[] populated': result.evidence.length > 0,
    'sources[] populated': result.sources.length > 0,
    'confidence is a number': typeof result.confidence === 'number',
    'status is PROVISIONAL': result.status === STATUS.PROVISIONAL,
    'requires_native_validation is true': result.requires_native_validation === true,
  };
  console.log('\nShape checks:');
  for (const [label, pass] of Object.entries(checks)) {
    console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${label}`);
  }
  const allPass = Object.values(checks).every(Boolean);
  if (!allPass) throw new Error('demoProvisional: one or more shape checks failed');
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runProvisionalDemo().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
