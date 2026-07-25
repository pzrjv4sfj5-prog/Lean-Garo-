/**
 * lookupEngine.js
 * Claude B — Repository Steward / Engineering Architect
 *
 * Phase 2 of the translationEngine.js modularization roadmap (see
 * docs/ARCHITECTURE.md's engine-audit entry, 2026-07-25). Lexical
 * lookup + corrections precedence — extracted verbatim from
 * translationEngine.js with zero logic changes. Behavior verified
 * byte-identical via the full 237-sentence stress benchmark diff
 * before/after.
 *
 * This is the exact module flagged in the 2026-07-25 "he works"
 * incident (SESSION_BOOTSTRAP.md) — findVerbForm's dependency on
 * lookupGaro()'s corrections-precedence order wasn't visible from
 * reading findVerbForm alone. Isolating it here, with its own export
 * surface, is meant to make that coupling visible going forward.
 */

import compiledDictRaw from './compiled_dict.json' with { type: 'json' };
import correctionsRaw from './data/corrections.json' with { type: 'json' };

// Shadow index: apostrophe-stripped keys for typo tolerance (lets go -> let's go)
export const corrections = { ...correctionsRaw };
for (const [k, v] of Object.entries(correctionsRaw)) {
  const stripped = k.toLowerCase().replace(/['’]/g, '');
  if (stripped !== k.toLowerCase() && !corrections[stripped]) corrections[stripped] = v;
}

// Index build — support both string and array format
export function normalizeEntry(val) {
  if (!val) return null;
  if (typeof val === 'string') return { garo: val, pos: null, category: null };
  if (Array.isArray(val)) return val[0];
  return val;
}

export const EN_INDEX = {};
for (const [key, val] of Object.entries(compiledDictRaw)) {
  EN_INDEX[key.toLowerCase().trim()] = val;
}

export function lookup(key) {
  const entry = EN_INDEX[key.toLowerCase().trim()];
  return entry ? normalizeEntry(entry) : null;
}

export function lookupGaro(key) {
  // Check corrections.json first — single-word keys were previously
  // bypassed here since EN_INDEX is built only from compiled_dict.json.
  // This meant confirmed corrections only took effect in the top-level
  // translate() fast-path, not in findVerbForm/grammar-assembly which
  // call lookupGaro() directly.
  const k = key.toLowerCase().trim();
  if (corrections[k]) return corrections[k];
  const e = lookup(k);
  return e ? e.garo : null;
}
