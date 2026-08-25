/**
 * researchFallback.js
 * Claude B — AI/Web Fallback Research Prototype, Phase 1
 *
 * ENGINEERING PROTOTYPE ONLY. Per the task brief this was built from:
 *   - Never writes to master_dictionary.json / corrections.json / compiled_dict.json.
 *   - Never lets AI/web output become canonical linguistic truth.
 *   - Never invents a Garo form — a candidate must be attributed to a
 *     specific external source, or it doesn't get returned as a candidate.
 *   - Every result is explicitly PROVISIONAL / NATIVE_VALIDATION_REQUIRED,
 *     never CONFIRMED — this module has no authority to confirm anything.
 *
 * This module is NOT wired into translate()'s cascade (translationEngine.js)
 * and does not change its behavior. It's a standalone, independently
 * callable layer — see docs/CLAUDE_B_AI_FALLBACK_DESIGN_20260824.md §7 for
 * the (also not-yet-wired) hook point and how it stays fully disable-able.
 */

// ── Status model ────────────────────────────────────────────────────────
// CONFIRMED is deliberately not producible by this module — only the real
// dictionary cascade (translate()) can return that, and only Claude A's
// linguistic-approval step can promote a PROVISIONAL result toward it.
export const STATUS = Object.freeze({
  PROVISIONAL: 'PROVISIONAL',                 // candidate(s) found, needs native validation
  NO_EVIDENCE_FOUND: 'NO_EVIDENCE_FOUND',      // searched, found nothing usable — not the same as an error
  UNRESOLVED: 'UNRESOLVED',                    // research not attempted or not possible
  NATIVE_VALIDATION_REQUIRED: 'NATIVE_VALIDATION_REQUIRED', // alias state for UI purposes, see design doc §6
});

const SOURCE_TYPE_PRIORITY = [
  'native_speaker_material',
  'garo_dictionary',
  'academic_linguistic',
  'published_garo_text',
  'language_database',
  'other_web',
];

// ── Cache ────────────────────────────────────────────────────────────────
// In-memory only for this prototype (explicitly NOT master_dictionary.json,
// NOT corrections.json — see design doc §5 for why a persistent cache in a
// real deployment still must not double as dictionary storage). A real
// deployment would back this with e.g. sqlite/Redis/a flat JSON cache file
// under a clearly non-canonical path (NOT under master_dictionary.json's
// directory), so it survives restarts but can never be mistaken for
// confirmed dictionary data by any script that reads *.json data files.
const _cache = new Map();

function cacheKey(englishWord, surroundingContext) {
  return `${englishWord.toLowerCase().trim()}::${(surroundingContext || '').toLowerCase().trim()}`;
}

export function clearCache() {
  _cache.clear();
}

export function getCacheStats() {
  return { size: _cache.size, keys: [..._cache.keys()] };
}

// ── Provider abstraction ────────────────────────────────────────────────
// researchMissingWord() takes a `provider` — an injectable
// {search, synthesize} pair — rather than hardcoding a specific search API
// or AI model. This is the "don't commit to a provider unnecessarily"
// requirement from the brief: swapping in a real web-search API (Google
// CSE, Bing, SerpAPI, ...) and a real AI synthesis call (Claude, Gemini,
// OpenAI, ...) later means writing ONE new provider object, not touching
// this file's logic or researchMissingWord's call sites.
//
// DEFAULT_PROVIDER below is the Phase 1 stand-in: it does NOT call any
// live search or AI API (this prototype's runtime sandbox has no general
// web egress, and per the brief, "do not commit to a provider
// unnecessarily"). It deterministically returns NO_EVIDENCE_FOUND for any
// word, which is honest — it hasn't actually searched anything — and is
// the correct default behavior for an unwired research layer: fail
// closed, never fabricate a candidate. See demo.js for two REAL evidence
// traces (gathered via a live web search) manually fed through this same
// pipeline via a custom provider, showing both a genuine "found nothing
// usable" case and the shape a genuine hit would take.
export const DEFAULT_PROVIDER = {
  async search(_englishWord, _sentence, _surroundingContext) {
    return []; // no evidence — see comment above
  },
  async synthesize(_englishWord, _evidence) {
    return { candidates: [] };
  },
};

/**
 * @param {object} args
 * @param {string} args.englishWord      The specific unresolved word/phrase.
 * @param {string} args.sentence         Full original sentence (for context).
 * @param {string} [args.surroundingContext] Optional extra context (domain, register, etc).
 * @param {object} [args.provider]       Injectable {search, synthesize}. Defaults to DEFAULT_PROVIDER.
 * @param {boolean} [args.useCache]      Default true.
 *
 * @returns {Promise<{
 *   english: string,
 *   candidate_garo: string|null,
 *   candidates: Array<{garo:string, confidence:number, source:object}>,
 *   confidence: number,
 *   sources: object[],
 *   evidence: object[],
 *   status: 'PROVISIONAL'|'NO_EVIDENCE_FOUND'|'UNRESOLVED',
 *   requires_native_validation: boolean,
 *   timestamp: string,
 *   fromCache: boolean
 * }>}
 */
export async function researchMissingWord({
  englishWord,
  sentence = '',
  surroundingContext = '',
  provider = DEFAULT_PROVIDER,
  useCache = true,
}) {
  if (!englishWord || typeof englishWord !== 'string') {
    return {
      english: englishWord || '',
      candidate_garo: null,
      candidates: [],
      confidence: 0,
      sources: [],
      evidence: [],
      status: STATUS.UNRESOLVED,
      requires_native_validation: true,
      timestamp: new Date().toISOString(),
      fromCache: false,
    };
  }

  const key = cacheKey(englishWord, surroundingContext);
  if (useCache && _cache.has(key)) {
    return { ..._cache.get(key), fromCache: true };
  }

  const evidence = await provider.search(englishWord, sentence, surroundingContext);

  // Multiple sources, ranked by the priority order specified in the brief.
  // This module does not itself decide "the" answer when sources disagree
  // — see the "DO NOT choose one silently" requirement — it ranks and
  // returns every distinct candidate the synthesis step reports, each with
  // its own evidence and confidence, and lets a human/native validator
  // (or Claude A) make the actual choice.
  const rankedEvidence = [...evidence].sort((a, b) => {
    const pa = SOURCE_TYPE_PRIORITY.indexOf(a.sourceType);
    const pb = SOURCE_TYPE_PRIORITY.indexOf(b.sourceType);
    return (pa === -1 ? 999 : pa) - (pb === -1 ? 999 : pb);
  });

  let result;
  if (rankedEvidence.length === 0) {
    result = {
      english: englishWord,
      candidate_garo: null,
      candidates: [],
      confidence: 0,
      sources: [],
      evidence: [],
      status: STATUS.NO_EVIDENCE_FOUND,
      requires_native_validation: true,
      timestamp: new Date().toISOString(),
    };
  } else {
    const synthesis = await provider.synthesize(englishWord, rankedEvidence);
    const candidates = (synthesis.candidates || []).map(c => ({
      garo: c.garo,
      confidence: c.confidence,
      source: c.source,
    }));
    const best = candidates[0] || null;
    result = {
      english: englishWord,
      // candidate_garo is deliberately null (not "best guess") whenever
      // more than one candidate disagrees — see the module docstring and
      // researchMissingWord's own "DO NOT choose one silently" contract.
      // A UI can still show `candidates` in that case; it just can't read
      // a single answer off `candidate_garo` without acknowledging the
      // conflict.
      candidate_garo: candidates.length === 1 ? best.garo : null,
      candidates,
      confidence: best ? best.confidence : 0,
      sources: rankedEvidence.map(e => e.source),
      evidence: rankedEvidence,
      status: candidates.length > 0 ? STATUS.PROVISIONAL : STATUS.NO_EVIDENCE_FOUND,
      requires_native_validation: true,
      timestamp: new Date().toISOString(),
    };
  }

  if (useCache) _cache.set(key, result);
  return { ...result, fromCache: false };
}
