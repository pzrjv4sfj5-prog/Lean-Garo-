/**
 * utils.js
 * Claude B — Repository Steward / Engineering Architect
 *
 * Phase 1 of the translationEngine.js modularization roadmap (see
 * docs/ARCHITECTURE.md's engine-audit entry, 2026-07-25). Pure,
 * dependency-free helpers only — no module-level state, no imports
 * from data files. Extracted verbatim from translationEngine.js with
 * zero logic changes; behavior verified byte-identical via the full
 * 237-sentence stress benchmark diff before/after.
 */

export function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, (_,i) => Array.from({length: n+1}, (_,j) => i===0?j:j===0?i:0));
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++)
    dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}

// Bounded Levenshtein (2026-09-28, Claude B, perf): returns the exact edit
// distance when it is <= max, otherwise any value > max. Two rolling rows
// (no per-call 2D allocation) and early exit once a whole row exceeds max.
// Callers must only compare the result against a threshold <= max; the
// exact value above max is meaningless by contract.
export function levenshteinBounded(a, b, max) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > max) return max + 1;
  let prev = new Array(n + 1), cur = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    let rowMin = cur[0];
    const ai = a.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const v = ai === b.charCodeAt(j - 1)
        ? prev[j - 1]
        : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    const t = prev; prev = cur; cur = t;
  }
  return prev[n];
}
