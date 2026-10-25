// NV-207: read-only access to the generated verb paradigms (src/data/verb_paradigms.json).
// status per form: native (Thangseng), pinned (matches a corrections/irregular row), engine (live engine output),
// derived (suffix rules, NOT native-verified).
import PARADIGMS from './data/verb_paradigms.json' with { type: 'json' };
export function getVerbParadigm(english) {
  const v = String(english || '').toLowerCase().trim().replace(/^to\s+/, '');
  return PARADIGMS.verbs[v] || null;
}
export const PARADIGM_REVIEW = PARADIGMS.review;
export const PARADIGM_MANUAL = PARADIGMS.manual;
