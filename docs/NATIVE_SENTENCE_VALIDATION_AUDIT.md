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

**Step 2 — tentative English gloss (UNVERIFIED, native confirmation required):**
Something like "Not watching TV today, [I'm] looking at [phone/WhatsApp]
status instead" — inferred from loanwords (`TV`, `status`) and visible
morphology (`nangja` = negative, `nisona` = "to see/look" + purposive,
`manaienga` = continuous-ish). **This gloss is not confirmed and must not be
treated as validated intended meaning.**

**Step 3 — engine output for three candidate English phrasings of that gloss:**

| Candidate English input | Engine output | Method | Confidence |
|---|---|---|---|
| "I am not watching TV today, I am looking at phone status" | `Anga ni·rik·ja` | grammar-assembly | 0.82 |
| "instead of watching TV I am looking at status" | `Anga ni·rik·a Nibo` | sov-assembly | 0.75 |
| "I am watching status instead of TV today" | `Anga da·alo·ko ni·rik·a` | grammar-assembly | 0.82 |

**Comparison against native target:**
None of the three outputs contain `TV`, `status`, `palango`, or anything
resembling `manaienga`/`nangja`/`nisona`. All three collapse a
multi-clause, loanword-mixed, code-switched sentence down to a short
`ni·rik` ("watch/look") clause and drop most content. High engine
confidence (0.75–0.82) is reported despite this — the confidence score is
not tracking semantic completeness here.

**Suspected causes (multiple, not mutually exclusive):**
1. **Dictionary** — `TV`, `status`, `palan(g)` (possibly "phone"/device
   word) are not in `corrections.json` / `master_dictionary.json` as
   loanword pass-throughs, so anything referencing them gets dropped rather
   than transliterated/retained.
2. **Grammar** — "instead of X, Y" contrastive/substitutive construction
   has no apparent handling; both attempts that included "instead of"
   collapsed to a single simple clause.
3. **Sentence Ordering / Context** — multi-clause negated-alternative
   sentences ("not X, Y instead") may not be supported by the
   grammar-assembly or sov-assembly paths at all; unclear whether this is a
   gap or a not-yet-tested capability.
4. **Unknown** — without a native-confirmed gloss, it's possible the
   candidate English inputs themselves don't match the real intended
   meaning, which would make the divergence partly a Step-2 gloss error
   rather than a pure engine gap. This must be resolved before any of the
   above suspected causes are treated as confirmed.

**Repository components potentially affected:**
- `src/data/corrections.json` / `master_dictionary.json` (loanword coverage)
- `src/translationEngine.js` grammar-assembly / sov-assembly paths
  (contrastive/substitutive clause handling)
- `docs/GRAMMAR_RULE_CATALOGUE.md` (no existing rule appears to cover
  "instead of X, Y" — needs Claude A confirmation of whether this is a true
  gap or an existing rule that isn't firing)

**Native validation required:** **Yes — required before any other
conclusion here is trusted.** Specifically need from Thangseng:
1. Confirmed English gloss of the original sentence.
2. Confirmation of what `palango` refers to (phone? WhatsApp specifically?).
3. Confirmation of whether `TV`/`status` are genuinely used as English
   loanwords in casual Garo speech (this matters for whether the fix is
   "add these as recognized loanwords" vs. something else).

**Confidence in this audit entry:** LOW on interpretation (gloss
unconfirmed), HIGH on the mechanical finding (engine cannot reverse-
translate; forward-direction candidates lose loanword/contrastive content).

---

## Summary table (living, update as cases are added)

| # | Native sentence (excerpt) | Classification | Native validation needed | Status |
|---|---|---|---|---|
| 1 | `TV ninan nangja palango tue status o nisona manaienga` | Dictionary + Grammar + Unknown (gloss unconfirmed) | Yes | Open |

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
