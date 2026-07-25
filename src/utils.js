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
