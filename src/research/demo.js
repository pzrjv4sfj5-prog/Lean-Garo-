/**
 * demo.js
 * Claude B — AI/Web Fallback Research Prototype, Phase 1
 *
 * Small proof-of-concept per the brief's "FIRST PHASE — do not build
 * everything" instruction. Demonstrates the full pipeline:
 *
 *   input -> translate() -> detectUnresolvedWords() -> researchMissingWord()
 *   -> PROVISIONAL / NO_EVIDENCE_FOUND result -> requires_native_validation
 *
 * for two real, currently-unresolved words, using REAL evidence gathered
 * via a live web search performed in this session (not by this script —
 * this sandbox's Node runtime has no general web egress; see design doc
 * §4 "AI Integration" for why the search itself is dependency-injected
 * rather than hardcoded). The `demoProvider` below replays that real
 * evidence rather than fabricating anything — this is a demonstration of
 * data flow and status handling, not a live-search demo.
 *
 * Case 1 — "gadget": a real web search for Garo-language evidence for
 * this word turned up NOTHING Garo-specific (English/French/Greek/Dutch
 * dictionary entries, unrelated software-widget results, Garo language
 * background pages with no lexical content) — the honest, and actually
 * the MORE common, outcome for a low-resource language. Demonstrates the
 * NO_EVIDENCE_FOUND path: no candidate is invented just because a search
 * ran.
 *
 * Case 2 — "computer": same real search turned up a genuine, named
 * external resource that plausibly contains the answer (Glosbe's
 * English-Garo dictionary, glosbe.com/en/grt) but not the specific
 * translated string itself (this prototype phase didn't fetch and parse
 * that page — see design doc §4 for why that's deliberately left for the
 * next integration phase, not invented here). Demonstrates the case where
 * evidence POINTS toward an answer without confirming one — status stays
 * NO_EVIDENCE_FOUND (no confirmed candidate_garo), but `sources` records
 * the lead for a human/Claude A to follow up on, rather than silently
 * dropping it the way the existing translate() cascade would.
 */

import { translate } from '../translationEngine.js';
import { detectUnresolvedWords } from './detectUnresolved.js';
import { researchMissingWord, STATUS } from './researchFallback.js';

// Real evidence gathered via live web search this session (see comment
// block above) — NOT generated or invented by this script.
const REAL_EVIDENCE = {
  gadget: [], // confirmed: no Garo-specific result in the real search
  computer: [
    {
      sourceType: 'garo_dictionary',
      source: {
        url: 'https://glosbe.com/en/grt',
        title: 'The English - Garo dictionary | Glosbe',
        note: 'General English-Garo dictionary resource exists and is publicly queryable; this prototype phase did not fetch/parse the specific "computer" entry.',
      },
      retrievedText: 'Glosbe hosts a community-maintained English-Garo (ISO 639-3: grt) dictionary with translations, audio, and images.',
    },
  ],
};

const demoProvider = {
  async search(englishWord) {
    return REAL_EVIDENCE[englishWord.toLowerCase()] || [];
  },
  // Deliberately does NOT synthesize a candidate_garo for "computer" —
  // per the brief, a source that merely EXISTS is not evidence of what
  // the word IS. A real Phase 2 provider would fetch glosbe.com's actual
  // entry and pass its content here; this stub correctly refuses to
  // guess in its absence.
  async synthesize(_englishWord, _evidence) {
    return { candidates: [] };
  },
};

async function runCase(sentence, targetWord) {
  console.log(`\n=== "${sentence}" ===`);
  const translation = await translate(sentence);
  console.log('translate() output:', JSON.stringify(translation.garo), `(method=${translation.method}, confidence=${translation.confidence})`);

  const detection = detectUnresolvedWords(sentence);
  console.log('detectUnresolvedWords():', JSON.stringify(detection.unresolvedWords), `isComplete=${detection.isComplete}`);
  console.log(
    `  [note: translate()'s own output above ${translation.garo.includes(targetWord) || translation.garo.toLowerCase().includes('unknown') ? 'happens to show' : 'does NOT show'} any trace that "${targetWord}" was lost — this is exactly the gap detectUnresolvedWords() closes]`
  );

  if (!detection.isComplete) {
    for (const word of detection.unresolvedWords) {
      const research = await researchMissingWord({ englishWord: word, sentence, provider: demoProvider });
      console.log(`researchMissingWord("${word}"):`, JSON.stringify({
        status: research.status,
        candidate_garo: research.candidate_garo,
        candidates: research.candidates,
        sources: research.sources,
        requires_native_validation: research.requires_native_validation,
      }, null, 2));
    }
  }
}

export async function runDemo() {
  await runCase('she is carrying a widget', 'widget');
  await runCase('i bought a gadget yesterday', 'gadget');
  await runCase('i need a computer for work', 'computer');
}

// Allow `node src/research/demo.js` directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
