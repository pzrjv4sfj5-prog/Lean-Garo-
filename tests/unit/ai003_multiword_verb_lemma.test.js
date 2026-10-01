// AI-003 (2026-09-28, Claude B): 2-word "to X Y" verb lemmas must be visible
// to the verb-search loop. Cutoff: exactly-2-word lemmas only.
import test from 'node:test';
import assert from 'node:assert/strict';
import translationEngine from '../../src/translationEngine.js';
import { analyzeGrammar } from '../../src/grammarEngine.js';
import { MULTI_WORD_VERB_LEMMAS, matchMultiWordVerbLemma } from '../../src/lookupEngine.js';

test('AI-003: map holds only exactly-2-word lemmas', () => {
  assert.ok(MULTI_WORD_VERB_LEMMAS.size > 100);
  for (const k of MULTI_WORD_VERB_LEMMAS.keys()) assert.equal(k.split(' ').length, 2);
});

test('AI-003: matcher handles inflected head word', () => {
  // "crumble down" updated 2026-09-30 (Claude A): "Be·rurua" was an
  // OCR print-dictionary import with no native citation
  // (docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md: "weak/OCR"); a direct
  // Thangseng relay answer (docs/THANGSENG_RELAY_ANSWERS_20260930.md)
  // gives "be.grua" -> normalized "be·grua", now the verified_high
  // dictionary value. "Be·rurua" stays on file as a coexisting weaker
  // candidate, not deleted.
  for (const w of ['crumble', 'crumbled', 'crumbles', 'crumbling']) {
    assert.equal(matchMultiWordVerbLemma(w, 'down')?.garo, 'be·grua', w);
  }
  assert.equal(matchMultiWordVerbLemma('it', 'crumbled'), null);
});

test('AI-003: "it crumbled down" no longer ships "down"->Ka·ma as object', async () => {
  const g = analyzeGrammar('it crumbled down');
  assert.ok(g.verb, 'verb must be detected');
  assert.equal(g.verb.garo, 'be·grua');
  assert.equal(g.object, null);
  const out = await translationEngine.translate('it crumbled down');
  assert.ok(!out.includes('Ka·ma'));
  assert.ok(out.includes('be·grua'));
});

test('AI-003: NP subject + particle verb resolves without [UNKNOWN]', async () => {
  const out = await translationEngine.translate('the wall crumbles down');
  assert.ok(!out.includes('[UNKNOWN]'));
  assert.ok(out.includes('be·grua'));
});
