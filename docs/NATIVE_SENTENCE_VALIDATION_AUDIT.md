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

**Step 2 — FULL gloss and morpheme breakdown (native-confirmed 2026-07-08,
Thangseng):**

> "(I) don't need to watch TV, (I) can just watch on status lying in bed."

| Garo | Gloss | Note |
|---|---|---|
| `TV` | TV | English loanword, used verbatim |
| `nina` | to watch | base `ni` ("see/watch") + infinitive/purposive |
| `nangja` | need not | modal necessity negation — **distinct from simple "don't want"** |
| `palango` | in the bed | `Palang` ("bed") + `·o` locative |
| `tue` | lying (contextual) / sleeping (more literal) | converb/participle, posture verb |
| `status-o` | the status | `status` (loanword) + `·o` — here functioning closer to a topic/object marker than locative |
| `nisona` | to watch(ingly wait) | broader sense than `nina` — can also mean "wait expectantly for someone arriving" |
| `man·ienga` | can / am able | ability modal, continuous-aspect marked |
| *(subject)* | I | **null/pro-drop — not spoken, fully implied** |

This is now a fully native-confirmed gloss and morpheme breakdown — the
highest-confidence data in this audit so far.

**Step 3 — engine output for the confirmed gloss and sub-clauses:**

| English input | Engine output | Method | Confidence |
|---|---|---|---|
| "I don't need to watch TV, I can just watch status lying in bed" | `Anga palang·ko sikengja` | grammar-assembly | 0.82 |
| "I don't need to watch TV" (isolated clause) | `Anga sikengja` | grammar-assembly | 0.82 |
| "I can watch status lying in bed" (isolated clause) | `Anga palang·ko ni·rik·a` | grammar-assembly | 0.82 |
| "I am lying in bed" (isolated, testing `tue`) | `Anga Palangha` | grammar-assembly | 0.82 |

**Final comparison against native target — confirmed findings:**

1. **`TV` and `status` are never produced, in any of the 7 candidate inputs
   tested across this case (this session + prior).** Confirmed dictionary
   gap — not an artifact of a bad gloss guess, since the gloss is now
   native-verified. **Repository fix needed:** add `TV`/`status` (and
   likely other common tech/media loanwords) as pass-through entries in
   `corrections.json` or `master_dictionary.json`.
2. **"need not" (`nangja`, modal necessity) collapses to the same output as
   plain "want"/`sikenga`.** The engine has no apparent distinct handling
   for necessity-modal negation vs. simple desire negation — both "I don't
   need to watch TV" and (presumably) "I don't want to watch TV" would
   route through the same `sikengja` (want+negation) dictionary path. This
   is a **grammar-level** gap: the semantic distinction Thangseng
   explicitly drew (`nangja` = "need not", not "don't want") isn't
   representable in current engine output.
3. **`·ko` vs `·o` divergence:** engine renders "bed" with the object
   marker `·ko` (`palang·ko`, "the bed" as direct object of watching) where
   the native sentence uses the locative `·o` (`palango`, "in/on the bed").
   This is a genuine grammatical divergence, not a lexical gap — the engine
   is choosing the wrong case/postposition for a locative-adjunct reading
   of "in bed", defaulting to treating it as the object instead. **Repository
   component affected:** whatever logic selects `·ko` vs `·o` in
   grammar-assembly (`translationEngine.js`).
4. **`tue` (posture/converb "lying") has no equivalent at all.** "I am
   lying in bed" produced `Anga Palangha` — not a recognized dictionary
   form (confirmed by direct lookup), effectively a malformed output
   treating `Palang` (a noun, "bed") as if it were a verb root and
   appending a past-tense-shaped suffix `-ha` to it. This is a **bug**, not
   just a missing feature — the output is not merely incomplete, it's
   structurally invalid Garo.
5. **`man·ienga` (ability modal "can") never appears in any output.**
   Confirmed gap — no ability/capability modal handling observed in any of
   the 4 candidates tested.
6. **Positive finding retained from the prior revision:** the `Palang`
   lexical entry itself is correct and the `·o` locative morpheme exists
   and works correctly elsewhere in the engine (per `corrections.json`'s
   `"in / at": "·o"` entry) — the failure is in *selection* (choosing `·ko`
   over `·o` here) and in the missing posture-verb/ability-modal/loanword
   coverage, not in the underlying morphological inventory.

**Repository components potentially affected:**
- `src/data/corrections.json` / `master_dictionary.json` — missing loanword
  entries (`TV`, `status`); missing posture-verb concept ("lying");
  missing ability-modal ("can/able") rendering path.
- `src/translationEngine.js` grammar-assembly path — `·ko` (object) vs
  `·o` (locative) selection logic for locative-adjunct phrases like "in
  bed"; the `Palang` + `-ha` malformed-output bug (noun treated as verb
  root) when "lying in bed" is the input.
- `docs/GRAMMAR_RULE_CATALOGUE.md` — no existing rule appears to cover (a)
  necessity-modal negation (`nangja` = "need not") as distinct from simple
  desire-negation, or (b) ability-modal ("can") rendering. Needs Claude A
  confirmation of whether these are true gaps or existing-rules-not-firing.

**Native validation required:** Full gloss and morpheme breakdown
**confirmed 2026-07-08 by Thangseng** — nothing further required to close
out Case 1's interpretation. Subject pro-drop also confirmed ("I" not
spoken, fully implied). This case is now ready to inform Claude A's rule
work and future regression tests once reviewed.

**Confidence in this audit entry:** **HIGH on interpretation** (full
native-confirmed gloss + morpheme table). HIGH on all mechanical findings:
(a) engine cannot reverse-translate, (b) `status`/`TV` loanwords are a
confirmed dictionary gap, (c) necessity-modal (`nangja`) collapses into
desire-negation, (d) `·ko`/`·o` case-selection divergence on locative
adjuncts, (e) the `Palang`+`-ha` malformed-output bug for posture/"lying"
input, (f) ability-modal ("can") is dropped entirely, (g) the `Palang`+`·o`
locative pattern itself is structurally correct where it does fire — a
genuine partial success worth preserving as a future regression case.

---

## Summary table (living, update as cases are added)

| # | Native sentence (excerpt) | Classification | Native validation needed | Status |
|---|---|---|---|---|
| 1 | `TV ninan nangja palango tue status o nisona manaienga` | Dictionary (TV/status loanwords) + Grammar (necessity-modal `nangja`; `·ko`/`·o` case selection; ability-modal `man·ienga`) + Morphology (posture-verb `tue` unsupported, produces malformed output) | No — fully glossed | Ready for Claude A review |

## Explicitly out of scope for this audit (per instruction)
- No engine changes made or proposed as final.
- No new grammar rules inferred from a single case — findings above are
  candidate leads for Claude A, not adopted rules.
- No linguistic content added to `GRAMMAR_RULE_CATALOGUE.md` — this
  document is evidence for Claude A, not a substitute for Claude A's review.

## Claude A Review (2026-07-08)

Reviewed in full. Findings sorted into two categories per the priority
framework's "strengthen before creating" guidance:

**Strengthened existing knowledge (no new rule needed):**
- Finding (g): subject pro-drop confirmed outside the imperative context —
  strengthens RULE-004's notes (see `GRAMMAR_RULE_CATALOGUE.md`), doesn't
  need a new rule since RULE-003b's imperative case was never claimed to
  be the *only* pro-drop context.
- Finding (g)/positive finding: the `Palang`+`·o` locative pattern
  firing correctly is a second confirmed example of `-o` locative
  productivity — strengthens `GRAMMAR_SPECIFICATION.md` §6's noun-case
  table, moving it from "one full-sentence example" to "two confirmed
  examples."

**Promoted to canonical open questions (see `docs/THANGSENG_NATIVE_VALIDATION.md`):**
- Finding (b): necessity-modal negation (`nangja`) collapsing into
  desire-negation → NV-005.
- Finding (c): `·ko`/`·o` case-selection divergence on locative adjuncts
  → NV-006 (flagged as likely engineering-first, not necessarily a new
  linguistic rule — see NV-006 for reasoning).
- Finding (d): posture verb `tue` malformed output → NV-007 (the
  malformed-output part is a standalone bug Claude B can fix without
  waiting on full paradigm validation).
- Finding (e): ability-modal `man·ienga` dropped entirely → NV-008.
- Finding (a)/loanword gap (`TV`/`status`) → NV-009 (vocabulary, P2/P4
  priority, not P0).

None of these five are promoted to Rule Catalogue status yet — each is a
single natural sentence, which per the project's own standard (compare
how RULE-033 required a direct confirmed example, and how RULE-034 was
deliberately held at Medium confidence from a relayed source) is
suggestive evidence, not sufficient grounds for a new rule on its own.
NV-005 and NV-008 are both modality gaps — noted in NV-008 as a possible
signal that modality generally deserves a dedicated grammar sweep once
both get native validation.

No engine changes made. No new rules added to `GRAMMAR_RULE_CATALOGUE.md`
from this case alone — existing rules strengthened where the evidence
supported it, everything else staged as an open question pending direct
native validation.


- Case 1 is now fully glossed and analyzed — ready for Claude A to assess
  whether any findings above warrant new/revised rules, and for Claude B to
  eventually turn confirmed fixes (loanword entries, `·ko`/`·o` selection,
  the `Palang`+`-ha` bug) into regression tests, once approved through the
  standard integration workflow.
- Awaiting additional native sentences to build the case library further.
- Once 3+ cases exist, look for cross-case patterns (e.g. is loanword
  handling or the `·ko`/`·o` selection issue recurring, or specific to this
  sentence) before recommending any regression-test or dictionary
  additions as a batch.
