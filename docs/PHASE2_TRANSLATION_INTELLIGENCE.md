# Phase 2 — Translation Intelligence & Future Vision
_Started: 2026-07-08 by Claude B. Documentation only — no engine changes,
no Hindi, no architecture rewrite. Companion to `docs/ARCHITECTURE.md`
§12 (Architectural Backlog) and `docs/PENDING_reverse_translation.md`,
which this builds on rather than duplicates._

---

## P0 — Decision Intelligence: reclassifying recent findings

The instruction is specific: don't call everything "missing vocabulary."
Re-examining the 5 candidate regression cases from `docs/
PENDING_REGRESSION_CASES.md` (Native Sentence Validation Audit, Case 1)
against a finer taxonomy — **Vocabulary / Grammar / Morphology / Context
/ Parser / Selection Logic / Rendering** — most of them are *not*
primarily vocabulary problems, even though the surface symptom (a dropped
or wrong word) looks the same:

| Candidate | Surface symptom | Actually caused by |
|---|---|---|
| RC-001 (`nangja` necessity-modal → collapses to `sikengja`) | Wrong word choice | **Grammar** (no distinct necessity-negation rule exists) + **Selection Logic** (routes to the nearest existing form, `sikenga`/"want", instead of failing or asking for a rule) |
| RC-002 (`·ko` vs `·o` on "in bed") | Wrong suffix | **Parser** (how "in X" is recognized) + **Selection Logic** (which suffix a recognized locative maps to) — not a vocabulary gap at all; `Palang`+`·o` both individually exist and work correctly elsewhere |
| RC-003 (posture verb "lying" → `Anga Palangha`) | Garbled/invalid output | **Parser** (a noun, `Palang`, gets matched by the generic verb-root fallback) + **Rendering** (the fallback then appends a verb suffix to it, producing a form that isn't valid Garo) — this is the one true bug in the set, not a gap |
| RC-004 (ability modal "can" dropped) | Missing word | **NOT vocabulary** — confirmed via direct dictionary lookup that `"can": "man·a"` already exists in `master_dictionary.json`. This is pure **Selection Logic**: the existing lexical resource is never invoked for English "can + verb" constructions. |
| RC-005 (`TV`/`status` loanwords dropped) | Missing word | **Vocabulary** (genuinely absent from both dictionaries) **+ Rendering** (no pass-through mechanism for unrecognized tokens generally — they're silently discarded rather than retained or flagged, which is a rendering-stage design gap, not just a missing entry) |

**Pattern across all 5:** only one of five is a clean vocabulary gap. Three
involve **Selection Logic** — the engine's linear cascade (`translate()`,
11 sequential strategies, first-match-wins) has no concept of "this word
exists, but the wrong construction is being chosen for it." That's not a
vocabulary problem no matter how many dictionary entries get added.

**Implication for future work:** when a translation looks wrong, the
default hypothesis should be "which pipeline stage owns this decision,"
not "what word is missing." The reclassification above is now the
template — apply it to future findings before assuming vocabulary.

---

## P1 — Translation Pipeline: where intelligence currently lives vs. where it should

The target future pipeline (per Phase 2 brief):
```
User Input → Language Detection → Semantic Meaning Layer → Grammar
Selection → Morphology Selection → Context Resolution → Vocabulary
Selection → Sentence Rendering → Target Language
```

### What V1.0 actually does
`translate()` (`src/translationEngine.js`, line 674) is **not** a staged
pipeline. It's a single linear cascade of 11 strategies tried in order,
each a first-match-wins heuristic that bundles multiple future-pipeline
concerns into one step:

1. Corrections exact-match (bundles vocabulary + grammar + morphology +
   rendering into one pre-baked string)
2. Phrase map
3. Classifier/counting
4. Exact phrase
5. Single word
6. If-clause / multi-clause connective splitting
7. Stop-word strip
8. `gija` positive construction
9. Grammar assembly (`analyzeGrammar` + `assembleGrammar`) — the closest
   thing to "grammar selection," but it's the *6th* strategy tried, after
   five vocabulary-first shortcuts already had a chance to intercept
10. Fallback SOV assembly
11. Morphology / compound-split / fuzzy match / passthrough

**Key observation:** vocabulary lookup isn't a stage *within* the
pipeline — for most inputs, it *is* the pipeline. Grammar assembly only
runs when nothing matched a pre-baked phrase first. This is the inverse
of the target order (semantic meaning → grammar → morphology → context →
vocabulary). It works for V1.0 because the domain (short, common
sentences) is well covered by the exact-match layers. It would not scale
to a semantic multilingual system, where grammar/morphology selection
needs to happen *before* vocabulary is chosen (a word's target form often
depends on grammatical role, which vocabulary-first lookup can't know
yet).

### Rough current-stage → future-stage mapping

| Future stage | Closest V1.0 equivalent | Gap |
|---|---|---|
| Language Detection | None — English is hardcoded as input language | Total gap, but low-risk: not needed until a second input language exists |
| Semantic Meaning Layer | None — no intermediate representation exists anywhere | **Largest gap.** Every strategy in `translate()` operates directly on the English surface string, not on an extracted meaning. See P3. |
| Grammar Selection | `analyzeGrammar()` (line 214) — but only reached after 5 other strategies decline | Exists, but wrong position in the cascade for a semantic architecture; also entangled with vocabulary lookup inside itself (calls `lookupGaro` internally) |
| Morphology Selection | `applyTense()`, `applyNegation()`, `findVerbForm()` | Reasonably well-isolated already — this is the one area the final handout specifically called "a real generative paradigm," and it shows here: these functions take a root + a tense/polarity flag and produce a form, which is close to the target shape |
| Context Resolution | None as a distinct concept | RC-002/RC-004 above are exactly this gap — "in bed" needs its grammatical role (locative adjunct vs. object) resolved before the suffix can be chosen correctly, and nothing in the engine does that resolution as a separate step |
| Vocabulary Selection | `lookupGaro()`, `corrections.json`, dictionaries | Well-built, but positioned first instead of last |
| Sentence Rendering | `assembleGrammar()`, `assembleSentenceSOV()` | Exists, but the RC-003 bug shows it doesn't validate what it's assembling — it will happily fuse a noun with a verb suffix if a preceding stage handed it that combination |
| Target Language | Garo, hardcoded throughout | Total gap by design — expected for V1.0 |

**This is documentation, not a rewrite plan.** `BACKLOG-001` in
`ARCHITECTURE.md` §12 already tracks extracting linguistic data out of
`translationEngine.js` into structured resources — that's a prerequisite
for any future pipeline, since a pipeline needs stages to consume
*data*, not hand-maintained JS logic. Nothing here proposes doing that
work now.

---

## P2 — Reverse Translation Readiness

Asking, of what already exists: **could this support reverse translation
without redesign?**

- **`corrections.json` (792 entries, exact English string → exact Garo
  string):** No. This is a one-way lookup table keyed by English surface
  form. `docs/PENDING_reverse_translation.md` already found 915/4,026
  (22%) of `compiled_dict.json`'s Garo forms are ambiguous when reversed,
  and confirms **zero reverse-translation infrastructure exists** in the
  engine. Nothing from this session changes that finding — it's
  reconfirmed, not new.
- **`applyTense()`/`applyNegation()` (morphology functions):** Partially
  reusable. These are root+rule→form functions; a reverse parser would
  need the *inverse* (form→root+rule), which is a different algorithm,
  but the *rule definitions themselves* (which suffix means what) are
  language-fact knowledge that transfers either direction. This is the
  one place where current work is a genuine down-payment on reverse
  translation.
- **The Native Sentence Validation Audit vocabulary/regression queues
  (`PENDING_VOCABULARY.md`, `PENDING_REGRESSION_CASES.md`):** Yes, in
  principle — every entry records an English gloss *and* a Garo form
  with morpheme breakdown, which is exactly the bidirectional data shape
  reverse translation would need. Currently these are captured as prose
  tables, not structured data, so there's no engineering reuse yet — but
  the *information* is already reverse-compatible if it's later moved
  into structured form.
- **`GRAMMAR_RULE_CATALOGUE.md` / `MORPHOLOGY_SPECIFICATION.md`:** Yes —
  these are rule descriptions, not one-directional lookup tables. A rule
  like "`-aha` = simple past AND perfect" is equally true read forward or
  backward. No redesign needed to reuse this content in a reverse parser.

**Where this documents a limitation rather than proposing work:** the
core dictionary architecture (`corrections.json` → `master_dictionary.json`
→ `garo_dictionary.json` cascade) is fundamentally a forward-only design.
This isn't new information — `PENDING_reverse_translation.md` already
says so — but it's worth restating here as the answer to the Phase 2
question directly: **no, the current vocabulary layer cannot support
reverse translation without redesign.** That redesign is already scoped
in `PENDING_reverse_translation.md`'s three-phase plan and remains
blocked on the user acquiring better source data, per that document.

---

## P3 — Semantic Integrity

**The question to ask of every change: does it preserve a clean semantic
layer, or does it create English-surface-string-to-Garo-surface-string
coupling that a semantic layer would have to unwind later?**

Assessed against what exists:

- **`corrections.json`'s exact-match design is the biggest existing
  semantic-integrity debt**, and it's foundational, not incidental. An
  entry like `"the dog is under the table": "Achak tebil kokkimao ong·a"`
  encodes a full sentence's worth of meaning as a single opaque
  string-to-string mapping. There's no intermediate representation of
  *what the sentence means* — only what English surface form produces
  what Garo surface form. A future semantic layer would need to either
  (a) keep this table as a fast-path cache sitting *in front of* the
  semantic pipeline (harmless — it already works, and a cache in front of
  a slower correct path is a normal pattern), or (b) treat every entry as
  a data point to eventually re-derive through the semantic layer and
  verify still matches. Either way, this needs an explicit decision
  later, so: **documented here as future technical debt**, not fixed now.
- **`analyzeGrammar()`/`assembleGrammar()` mix vocabulary lookup into
  grammar logic** (§P1) — this is the same debt from a different angle:
  grammar assembly directly calls `lookupGaro()` rather than working
  against an abstract semantic structure that vocabulary selection would
  fill in later. **Documented as future technical debt**, consistent with
  `BACKLOG-001`'s existing framing.
- **This session's own evidence-gathering work (Native Sentence
  Validation Audit, `PENDING_VOCABULARY.md`) is semantically clean by
  construction** — every entry captures an English gloss + Garo form +
  morpheme breakdown as separate fields, not a fused string pair. This
  wasn't done with Phase 2 in mind at the time, but it happens to already
  be in the right shape. Worth continuing this pattern deliberately going
  forward now that the reason is explicit.
- **`docs/GRAMMAR_RULE_CATALOGUE.md` and `docs/MORPHOLOGY_SPECIFICATION.md`
  are already meaning-first, not string-first** — they describe what a
  suffix *means* (necessity, ability, completive, etc.), independent of
  any specific English sentence. This is the correct shape for a future
  semantic layer and required no change.

**No engine or data changes made from this section** — per the Phase 2
brief, these are documented as future technical debt, not addressed now.

---

## P4 — Repository Stewardship

No new stewardship work identified beyond what's already tracked in
`.ai/SESSION_BOOTSTRAP.md`'s "Current joint work package." Continuing
existing practice:
- Validation Corpus ↔ regression suite stayed 1:1 this session (no new
  confirmed rules landed, so no corpus/test additions were needed).
- Documentation synchronization: this file cross-references rather than
  duplicates `ARCHITECTURE.md` §12 and `PENDING_reverse_translation.md`.
- Confidence integrity: nothing in this document has been promoted past
  "documented observation" — no rule catalogue entries, no corrections.json
  entries, no regression tests added or claimed.
- Traceable linguistic evidence: all findings above cite specific files,
  line numbers, or existing documents rather than asserting from memory.

---

## Summary — what changed, what didn't

**Changed:** nothing in `src/`, nothing in `corrections.json` or the
dictionaries, no new regression tests, no new Rule Catalogue entries.

**Added:** this document only — a decision-intelligence reclassification
of existing findings (P0), a pipeline-stage mapping of the existing engine
against the future architecture (P1), a reverse-translation readiness
assessment building on the existing blocked plan (P2), and an explicit
semantic-integrity debt list (P3), all as documentation per the Phase 2
brief's "do not build this architecture now" instruction.
