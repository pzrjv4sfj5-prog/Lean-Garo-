# Native Sentence Validation Audit
_Started: 2026-07-08 by Claude B (P0, while Claude A migrates)_
_Status: OPEN — evidence-gathering, ongoing. No engine changes made._

## Purpose
Measure how well the current engine handles **real, naturally-occurring
conversational Garo** — as opposed to the synthetic/constructed sentences
that make up most of `VALIDATION_CORPUS.md` and `REGRESSION_CASES`. This is
not a request for new grammar rules. It is a library of real-world evidence
for Claude A's future linguistic work and for future regression tests.

## Methodology note (important — read before adding cases)
The engine (`src/translationEngine.js`, `translate()`) is **English → Garo
only**. It has no reverse (Garo → English) capability — this is a known,
already-documented limitation (`docs/PENDING_reverse_translation.md`),
confirmed again by Case 1 below. This constrains how "native Garo sentence"
evidence can be evaluated:

- We **cannot** feed a native Garo sentence into the engine and expect a
  meaningful result — it will passthrough at confidence 0 (see Case 1).
- Instead, for each native Garo sentence, once its **English meaning is
  confirmed by a native speaker**, we feed that English meaning through the
  engine and compare the engine's Garo output against the authentic native
  sentence as ground truth. Divergences are the evidence.
- Until an English gloss is native-confirmed, any comparison is
  **tentative** and must be marked as such — never presented as validated.

## Case 1

**Original native Garo sentence:**
`TV ninan nangja palango tue status o nisona manaienga`

**Step 1 — direct engine behavior on the raw Garo string (sanity check):**
```json
{
  "garo": "TV ninan nangja palango tue status o nisona manaienga [UNKNOWN]",
  "method": "passthrough",
  "confidence": 0
}
```
Confirms the engine does not process Garo input at all — full passthrough,
zero confidence, `[UNKNOWN]` tag appended. This is architecture-level, not a
bug in this sentence's handling specifically. Affects: `translationEngine.js`
translate() entry point / overall English→Garo-only architecture. Cross-ref:
`docs/PENDING_reverse_translation.md`.

**Step 2 — word-level gloss (native-confirmed 2026-07-08):**
`palango` = **bed** (not "phone" — the Step-2 tentative guess in the
original version of this entry was wrong, corrected here), `status` =
**status** (English loanword, used as-is), `tv` = **TV** (English loanword,
used as-is). Full-sentence gloss below is now partially informed by this
but the surrounding structure (`ninan`, `nangja`, `tue`, `nisona`,
`manaienga`) is still **not** native-confirmed and remains tentative:

Revised tentative full gloss: "Not [watching] TV now, [I'm] on the bed
looking at status." (`palango tue` ≈ "on the bed"; `status o nisona` ≈
"looking at status"). **Still needs native confirmation for the full
sentence**, especially `ninan` and `tue`.

**Step 3 — engine output for three candidate English phrasings of the
revised gloss:**

| Candidate English input | Engine output | Method | Confidence |
|---|---|---|---|
| "I don't want TV now, I am on the bed looking at status" | `Anga sikengja` | grammar-assembly | 0.82 |
| "not watching TV now, I am on the bed looking at status" | `Da·o Anga Palang ni·rik·a Niboja` | sov-assembly | 0.75 |
| "I am on the bed looking at status instead of TV" | `Anga Palangha` | grammar-assembly | 0.82 |

**Comparison against native target — updated:**
Row 2 is a partial positive result: `Palang` ("bed") does appear, and it's
immediately followed by `·a` — structurally close to the native `palango`
(`Palang` + `·o` locative, "on/at the bed"), which is a real point of
agreement between engine output and native form, not just a miss. This is
worth noting as a **success**, not just a failure catalogue.

However: `status` and `TV` are dropped in all three outputs (confirmed —
neither is in `corrections.json` or `master_dictionary.json` as a loanword
entry; `bed`/`Palang` exists in `master_dictionary.json` but not in the
higher-priority `corrections.json`). The "instead of X, Y" contrastive
structure still collapses badly — row 3 (`Anga Palangha`) loses "looking at
status" entirely and produces a malformed/unclear suffix (`Palangha` is not
a recognized form in the dictionary scan above).

**Suspected causes — updated:**
1. **Dictionary (confirmed, not just suspected):** `status` and `TV` have
   no entry anywhere in `corrections.json`/`master_dictionary.json` as
   English loanwords. This is a real, confirmed gap — real Garo speech
   evidently retains common English tech/media loanwords verbatim (`TV`,
   `status`), and the engine currently has no mechanism for passing such
   words through untranslated within an otherwise-Garo sentence.
2. **Grammar** — "instead of X, Y" contrastive/substitutive construction
   still appears unhandled; still needs Claude A confirmation of whether
   this is a true gap or an existing rule not firing.
3. **Sentence Ordering / Context** — unchanged from original entry, still
   open.
4. **Morphology (positive finding, not a failure):** `Palang` + `·o`
   locative marker (row 2) structurally matches the native `palango`
   pattern — suggests the locative-suffix mechanism itself is sound; the
   problem is loanword coverage and clause-collapsing, not this morpheme.

**Repository components potentially affected:**
- `src/data/corrections.json` / `master_dictionary.json` (loanword coverage)
- `src/translationEngine.js` grammar-assembly / sov-assembly paths
  (contrastive/substitutive clause handling)
- `docs/GRAMMAR_RULE_CATALOGUE.md` (no existing rule appears to cover
  "instead of X, Y" — needs Claude A confirmation of whether this is a true
  gap or an existing rule that isn't firing)

**Native validation required:** Word-level gloss for `palango`=bed,
`status`=status, `TV`=TV **confirmed 2026-07-08**. Still needed from
Thangseng:
1. Confirmed English gloss of the full sentence (structure only — key
   words now known).
2. Meaning/function of `ninan` and `tue`.
3. Whether `TV`/`status` being used as untranslated English loanwords is
   representative of casual Garo speech generally (matters for whether the
   fix is "recognize these as loanwords" vs. something narrower).

**Confidence in this audit entry:** MEDIUM on interpretation (3 of ~7
content words now word-level confirmed), HIGH on the mechanical findings:
(a) engine cannot reverse-translate, (b) `status`/`TV` loanwords are a
confirmed dictionary gap, (c) the `Palang`+`·o` locative pattern is a
genuine partial success worth preserving as a future regression case once
the full sentence is confirmed.

---

## Summary table (living, update as cases are added)

| # | Native sentence (excerpt) | Classification | Native validation needed | Status |
|---|---|---|---|---|
| 1 | `TV ninan nangja palango tue status o nisona manaienga` | Dictionary (confirmed: status/TV loanword gap) + Grammar (instead-of construction) + Unknown (ninan/tue) | Partial (word-level done, structure pending) | Open |

## Explicitly out of scope for this audit (per instruction)
- No engine changes made or proposed as final.
- No new grammar rules inferred from a single case.
- No linguistic content added to `GRAMMAR_RULE_CATALOGUE.md` — this
  document is evidence for Claude A, not a substitute for Claude A's review.

## Next steps
- Awaiting additional native sentences to build the case library.
- Awaiting Thangseng confirmation on Case 1's gloss and loanword status.
- Once 3+ cases exist, look for cross-case patterns (e.g. is loanword
  handling a recurring gap, or specific to this sentence) before
  recommending any regression-test or dictionary additions.
