# Finding 1 Root-Cause Trace — "did not go" → "re·ja" (2026-09-02)

## Scope
Trace-only per explicit instruction. No code, logic, or linguistic data
modified. Repo left clean (`git status --short` empty), 284/284 tests pass
before and after.

## Method
Ran `analyzeGrammar("did not go")` directly via a temporary, uncommitted
script (`_trace_finding1.mjs`, deleted after use — never touched repo
files), then read the cascade in `translationEngine.js` and
`sentenceBuilder.js` to confirm the path the observed output actually took.

## Result: the branch named in the original finding never runs

`grammarEngine.js:395-422` (the negative-tense branch, which correctly
calls `getConjugationRoot`) is **unreachable** for this input. It lives
inside a block gated on:

```js
if (PRONOUN_MAP[firstWord] || npSubjectGaro) { ... }   // grammarEngine.js:192
```

"did not go" has no subject — `firstWord` is `"did"` (not in
`PRONOUN_MAP`), and there's no `a/an/the`-led NP either. So the entire
subject/verb-finding loop is skipped; `analyzeGrammar` returns
`subject: null, verb: null` (confirmed directly — see raw output below).
`detectedTense: 'past'` and `isNegative: true` are both detected correctly;
only the subject-gated block is skipped.

```json
{
  "detectedTense": "past",
  "tenseEvidence": "did",
  "isNegative": true,
  "subject": null,
  "verb": null
}
```

## Actual path taken

1. `translationEngine.js:292` — `assembleGrammar(grammar)` returns null
   (requires `grammar.subject`, which is null) → falls through.
2. `translationEngine.js:302-303` — cascades to
   `assembleSentenceSOV(words, isNegative=true, detectedTense='past')`,
   the "sov-assembly" fallback (confidence 0.75) — **matches the reported
   live method exactly.**
3. Inside `assembleSentenceSOV` (`sentenceBuilder.js:77`): `"did"` is
   dropped by `AUXILIARY_SKIP`, `"not"` is dropped by the explicit
   negation-word guard, leaving `content = ["go"]`.
4. `sentenceBuilder.js:112`: translates `"go"` via plain
   `lookupGaro('go')` → returns the bare dictionary root `"re·a"`.
   **This function never imports or calls `getConjugationRoot`** — it has
   no knowledge of the go/`Re·ang-` conjugation-stem table at all.
5. `sentenceBuilder.js:228-235`: `detectedTense === 'past'` (not
   `'future'`), so the future branch is skipped; `isNegative && verbs.length`
   → `applyNegation("re·a")` runs.
6. `applyNegation("re·a")` (`morphologyEngine.js:56-59`):
   `"re·a"` matches `/·a$/` → strips to `"re·"` → contains `·` → appends
   `"ja"` → **`"re·ja"`**. Exact match to the live bug.

## Root cause (precise)

Not a bug in the negative-tense branch itself — that logic is correct and
already verified. The bug is that `assembleSentenceSOV`
(`sentenceBuilder.js`), the fallback path this subjectless sentence
actually reaches, independently resolves and negates the verb **without**
the go/`Re·ang-` stem-decoupling fix (`getConjugationRoot`) that
`grammarEngine.js` already has at lines 401 and 422. Same bug class as the
one already fixed there (2026-08-31, `docs/CLAUDE_A_SESSION_MIGRATION_20260830E.md`)
— just not propagated to this second, independent verb-resolution path.

## Why this reaches the fallback at all

Any negative/tense sentence with **no subject** (no pronoun, no
`a/an/the`-led NP) skips `analyzeGrammar`'s entire subject-gated
verb-finding block by design and lands in `assembleSentenceSOV`. "did not
go" is not a one-off — any subjectless past/negative/future sentence using
"go" (or any other verb with a `conjugation_roots.json` entry) hits this
same gap.

## Recommended structural fix (not yet applied)

In `sentenceBuilder.js`'s `assembleSentenceSOV`, when resolving the elected
verb (the `pairs[lastVerbIdx]` entry), route through `getConjugationRoot`
before applying tense/negation suffixes — mirroring
`grammarEngine.js:401`/`:422` exactly, rather than the current plain
`lookupGaro` resolution. This is confined to the verb slot only; the
existing per-word `translated` array (used for non-verb content words) is
correct as-is and must not be changed.

**Do not implement this without a fresh session-start gate check** — this
touches a shared assembly fallback used by many other sentence shapes;
needs the full regression suite plus explicit new test cases for
subjectless negative/future sentences before landing.

## Verification scope this session
- [x] Repo confirmed clean before trace (matches `58eeab4` push, no drift).
- [x] Trace script never committed; deleted immediately after use.
- [x] `git status --short` empty after trace.
- [x] 284/284 tests pass, unchanged, after.
- [ ] No fix attempted — out of scope per instruction.

## Next action for next Claude B
Implement the structural fix above in `assembleSentenceSOV`, scoped to the
verb slot only, with new regression tests covering: "did not go" (this
case), other subjectless negative-past sentences using "go", and a
sanity check that non-"go" verbs (which no-op through `getConjugationRoot`)
are byte-identical to current output. Do not touch Finding 2 — still
blocked on Claude A / native sign-off for the "only"-construction cases.
