# Claude B Session Migration — 2026-09-02

## Scope this session
Investigation only, per explicit instruction. **No code or linguistic data modified.**
Started Priority 4 (deferred grammar/morphology/tense engineering audit of
`prepare-data.js`, `garo_classifier.js`, corrections/override layer). Baseline
reconfirmed clean before starting: HEAD `015d737`, 284/284 tests, build green,
matches `CLAUDE_B_SESSION_MIGRATION_20260901.md` exactly — no drift.

## Finding 1 — CONFIRMED ENGINEERING BUG: "did not go"

- **Current output:** `translate("did not go")` → `"re·ja"` (method: `sov-assembly`, confidence 0.75)
- **Expected (native-backed):** `"Re·angja"` — per Rule 27 comment in `translationEngine.js`
  ("'Re·angja' = did not go, confirmed native reply to a past-tense question")
  and `src/data/conjugation_roots.json` (`"go": "Re·ang"`), which exists
  specifically to produce this form.
- **Relevant files/functions:**
  - `src/grammarEngine.js` lines ~414-422 (negative-tense branch, calls
    `getConjugationRoot(w, garoWithTense)` then `applyNegation`)
  - `src/morphologyEngine.js` `getConjugationRoot()` (line ~37) and
    `applyNegation()` (line ~56)
  - `src/data/conjugation_roots.json`
- **What has been verified:** Manually traced the intended path — if `w ===
  'go'` and `isNegative` reaches line 422, `getConjugationRoot` should return
  `"Re·ang"` and `applyNegation("Re·ang")` should yield `"Re·angja"`. Live
  output has neither the stem's capital nor `"ang"`, so this intended path is
  **not** the one actually executing for this input.
- **What remains to investigate:** Whether the verb-finding loop even matches
  "go" as the finite verb for the "did not go" phrasing (vs. "did" absorbing
  the slot, or negation/tense flags not being set the way this branch
  expects), or whether a different cascade step altogether (not this
  grammar-engine branch) is producing `"re·ja"`. Needs a debug trace inside
  the verb-finding loop for this exact input before touching any code.
- **Next action for next Claude B:** Add a temporary trace/log around the
  verb-finding loop and the branch at `grammarEngine.js:395-422` for
  `translate("did not go")`, identify which branch actually fires and why
  `getConjugationRoot`'s result isn't reaching the final string, then fix with
  a regression test. Do not guess-fix without the trace — cascade order here
  is high-risk (per standing Rule: don't change cascade priority casually).

## Finding 2 — COMPOSITION TESTS TO INVESTIGATE (generalization of "only" logic)

Do **not** assume the existing `tryOnlyIdentityConstruction` fix (verified for
"the only X I eat/speak is Y" object-slot forms) generalizes to these:

- `"i am the only student"` → currently `"Anga chattro·ko mangmang"`
  (method: `grammar-assembly`, confidence 0.82) — did **not** route through
  `tryOnlyIdentityConstruction` at all; this is a subject-slot "I am the only
  X" copular form, structurally different from the object-slot construction
  the fix targeted. No native-backed expected form on record yet.
- `"the only fruit i eat is mango"` → currently `"Angade te·ga·chu
  Bitekosan Cha·aia"` (method: `only-identity-construction`, confidence
  0.85) — same construction family as the verified "language" case, but not
  itself individually verified against native data.
- **Relevant files/functions:** `src/grammarEngine.js`
  `tryOnlyIdentityConstruction` (cascade step 5.7) and its trigger/detection
  conditions.
- **What has been verified:** Nothing yet for these two specific sentences —
  outputs captured above, not checked against any native source.
- **What remains to investigate:** (a) whether "I am the only X" should even
  be handled by the same function or needs its own subject-slot rule; (b)
  whether "the only fruit i eat is mango" is linguistically correct — this
  needs Claude A / native-validation sign-off, not engineering judgment.
- **Next action for next Claude B:** Do not modify `tryOnlyIdentityConstruction`
  until Claude A confirms or corrects the expected Garo for both sentences.
  If Claude A has no native data, this becomes a Thangseng relay question
  (Claude A's lane), not an engineering task — flag it to Claude A rather than
  guessing at the composition.

## Governance-model check
No mechanism or code changed this session (investigation-only per instruction).
AI-001 subclass (b) status unchanged from 2026-09-01 doc.

## Verification scope this session
- [x] Baseline build/tests reconfirmed clean before investigating (284/284,
      0 violations) — not re-run after, since nothing changed.
- [ ] No fixes attempted — out of scope per instruction.

## Next session resume
1. `git fetch origin`; verify HEAD == this doc's commit.
2. Start with Finding 1 (confirmed bug, root cause not yet isolated) — trace
   before fixing.
3. Finding 2 needs Claude A input before any engineering change.
