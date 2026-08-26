/**
 * mockProvider.js
 * Claude B — AI/Web Fallback Research Prototype, Phase 1
 *
 * `demo.js`'s `demoProvider` replays REAL evidence gathered via a live web
 * search, and both its cases land on NO_EVIDENCE_FOUND — an honest but
 * incomplete demonstration, since it never exercises the PROVISIONAL path
 * (candidates + evidence + sources + confidence + status=PROVISIONAL +
 * requires_native_validation=true) end to end.
 *
 * This file is a SEPARATE, EXPLICITLY-MOCKED provider whose only purpose is
 * structural: prove `researchMissingWord()` produces the full documented
 * result shape when a provider *does* return evidence and a synthesized
 * candidate. The Garo string below ("Bewal") is a FABRICATED placeholder —
 * marked as such in its own `source` object — not a claim about any real
 * word. This module must never be imported by `translate()` or any
 * production path; it exists only for `demoProvisional.js` and the test
 * suite (`tests/unit/researchFallback.test.js`).
 */

export const MOCK_EVIDENCE = {
  widget: [
    {
      sourceType: 'other_web',
      source: {
        url: 'https://example.invalid/mock-source-1',
        title: '[MOCKED] Example lexical forum thread',
        note: 'FABRICATED for structural demo purposes only — not a real source, not real evidence.',
      },
      retrievedText: '[MOCKED TEXT] not real evidence.',
    },
  ],
};

export const mockProvider = {
  async search(englishWord) {
    return MOCK_EVIDENCE[englishWord.toLowerCase()] || [];
  },
  // Deliberately returns confidence < 1 and a single candidate so the
  // demo/test can assert every field of the PROVISIONAL shape without
  // implying the module has any authority to confirm a translation.
  async synthesize(englishWord, evidence) {
    return {
      candidates: [
        {
          garo: 'Bewal', // FABRICATED placeholder, see file header.
          confidence: 0.4,
          source: evidence[0].source,
        },
      ],
    };
  },
};
