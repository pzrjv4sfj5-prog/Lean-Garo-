# Grammar & Morphology Confidence Review
_Created 2026-07-08 by Claude A. Cross-references `GRAMMAR_RULE_CATALOGUE.md`
confidence tags against actual corpus coverage
(`docs/VALIDATION_CORPUS_COVERAGE_AUDIT.md`) to produce one consolidated
confidence classification per rule. Four categories: **High Confidence**,
**Medium Confidence**, **Low Confidence**, **Native Validation Required**._

## Part 1 — Grammar Rules

| Rule | Classification | Reason |
|---|---|---|
| RULE-001 (Raka Locality) | **High Confidence** | 5 corpus examples + 8+ independent root-consistency audits. Best-evidenced rule in the repository. |
| RULE-002 (Past/Perfect Unification) | **High Confidence** | 3 corpus examples, no counterexamples, consistent with morphology spec §3/§4. |
| RULE-003 (SOV Word Order) | **High Confidence** | Only 1 explicit corpus citation, but SOV structure is implicitly reinforced by nearly every other sentence in the corpus and in `corrections.json`. Confidence is earned by pervasiveness, not by explicit citation count. |
| RULE-003b (Imperative Subject-Drop) | **High Confidence** | Same reasoning as RULE-003 — thin explicit citation, broad structural support from every RULE-029 imperative example. |
| RULE-004 (Pronoun Paradigm) | **High Confidence** (core table); **Native Validation Required** (informal locative `bio` cell only) | Core paradigm cross-validated by `corrections.json` volume and the legacy `GRAMMAR_CONFIDENCE_MATRIX.md` audit. The one unfilled cell is correctly marked N/A rather than guessed. |
| RULE-007 (Hai construction) | **High Confidence**, evidence exists | 2 corpus examples, consistent behavior. Currently has no formal catalogue entry — a documentation gap, not a confidence problem (see Coverage Audit recommendation #1). |
| RULE-008 (If-Clause `-ode`) | **High Confidence** | 1 row in the formal corpus table, but 3 confirmed examples exist per the legacy confidence matrix — genuinely well-evidenced, just not fully synced into the newer document. |
| RULE-013 (Chim) | **High Confidence** | 3 examples covering both plain-root and continuous-form patterns, plus an explicitly documented historical bug (fused form) retained as a counterexample — this kind of "we know what wrong looks like too" evidence is a strong confidence signal. |
| RULE-017 (Simple Negation `-ja`) | **High Confidence** | 3 examples, explicit contrast with RULE-025 prevents a documented prior confusion from recurring. |
| RULE-018 (Verbal-Adjective `-gija`) | **High Confidence** (structural distinction); **Native Validation Required** (full "not X-ing" selection rule vs. RULE-017) | The catalogue's own split is correct and doesn't need revision. |
| RULE-025 (Cessative `-jaha`) | **Medium Confidence** | Only 1 corpus example. Confidence is earned by specificity (directly corrects a documented 2026-07-01 error) rather than volume — real but narrower evidence base than the "High Confidence" tier rules above. Recommend one additional example if a future session touches aspect. |
| RULE-026 (Completive `-manaha`) | **Medium Confidence** | Existence and overlap with `-aha` are native-confirmed, but **zero** Validation Corpus rows exist for it — a genuine gap between the catalogue's confidence claim and the corpus's actual coverage. Confidence downgraded from the catalogue's own "Medium-High" to plain "Medium" here specifically because of the missing corpus representation; the underlying linguistic claim isn't in doubt, but the repository's evidentiary trail for it is incomplete. |
| RULE-029 (Hortative/Imperative `-bo`) | **High Confidence** | 2 examples, dual-function behavior (imperative + hortative) explicitly confirmed, not assumed. |
| RULE-030 (`re·`/`re·ang` for "go") | **Native Validation Required** | See NV-001. Individual forms are High confidence; the selection rule between them is Low/unresolved. |
| RULE-031 (Copula Inconsistency) | **Native Validation Required** | See NV-002. Individual strategies (bare adjective, `daka`, `ong·a`) are each High confidence; the selection rule is Low/unresolved. Highest-priority open item, given predication's frequency. |
| RULE-033 (Locative "Under") | **High Confidence** (core rule); **Medium Confidence** (spelling-variant resolution) | Core "under the table" sentence is a direct native confirmation. The `kokkima`/`nokkima` spelling-variant resolution came from a relayed source, hence Medium rather than High. |
| RULE-034 (Locative/Directional Set) | **Medium Confidence** (8 words); **Low Confidence** (`over`/`badeao`) | Relayed source, no full example sentences yet. See NV-003. |
| RULE-035 (Under/Beneath Sense Split) | **Medium Confidence** (distinction plausible); **Low Confidence** (no worked example) | See NV-004. |
| RULE-G2 (Pre-verbal clustering) | **High Confidence**, evidence exists | Same documentation-gap situation as RULE-007 — no formal catalogue entry yet, but the pattern is well-attested structurally throughout the corpus. |
| RULE-G7 (Existential possession) | **Medium Confidence** | Single example, no contrast example testing a different possessed quantity or a negative ("she does NOT have three children") — plausible but narrower evidence than the High-confidence tier. |
| RULE-G-classifier (Numeral classifiers) | **High Confidence** | 5 examples spanning distinct classifier classes (`king`, `mang·`, `jol`, `pang`, `ge·`) — one of the best-evidenced areas alongside RULE-001, though also lacking a formal catalogue entry (documentation gap, not confidence problem). |

### Grammar summary
- **High Confidence:** 13 rules/rule-components.
- **Medium Confidence:** 5 rules/rule-components (RULE-025, RULE-026, RULE-033's spelling-variant piece, RULE-034, RULE-G7).
- **Low Confidence:** 2 (RULE-034's `over`, RULE-035's worked-example gap).
- **Native Validation Required:** RULE-030, RULE-031, RULE-004's unfilled cell, RULE-018's full selection rule.

## Part 2 — Morphology (`MORPHOLOGY_SPECIFICATION.md` §3 Suffix Paradigm)

| Item | Classification | Reason |
|---|---|---|
| `-a` (citation form) | **High Confidence** | Foundational, unmarked default, no dispute anywhere in the data. |
| `-aha` (past/perfect) | **High Confidence** | Directly tied to RULE-002, 3 corpus examples, well-established. |
| `-manaha` (completive) | **Medium Confidence** | See RULE-026 above — same evidentiary gap (confirmed existence, no corpus row). |
| `-jaha` (cessative) | **Medium Confidence** | See RULE-025 above — single corpus example, though high-specificity (corrects a documented error). |
| `-ja` (negative) | **High Confidence** | Tied to RULE-017, 3 corpus examples, explicit contrast with `-jaha` well-documented. |
| `-jawa` (future negative) | **Medium Confidence** | Appears in RULE-030's evidence (`Re·jawa`) but has no dedicated corpus row of its own outside that context — plausible and internally consistent, not independently stress-tested. |
| `-gen` (future) | **Medium Confidence** | Appears in Validation Corpus (`bilakgen`) but only once; the note "never carries raka regardless of root" is a specific, testable claim that would benefit from one more example with a raka-bearing root to confirm the raka-suppression behavior. |
| `-bo` (imperative/hortative) | **High Confidence** | Tied to RULE-029, dual-function explicitly confirmed. |
| `-nabe` (negative imperative) | **Medium Confidence** | One corpus example (`Re·angna·be`), correctly noted in the corpus as "raka-majority-vote corrected" — meaning this specific form went through an audit process, which is reassuring, but it's still a single worked example. |
| `-enga` (continuous/progressive) | **High Confidence** | Appears across multiple rules (RULE-013's `chim` combination, RULE-026's contrast discussion) and multiple distinct verb roots (`poraienga`, `Sandienga`, `tusienga` per the legacy matrix) — genuinely productive, not just repeated on one root. |
| `chim` (discontinued-past-continuous) | **High Confidence** | RULE-013, 3 examples, plus an explicitly documented historical implementation bug (fused form) that was caught and fixed — strong signal. |
| `-ode` (if-clause) | **High Confidence** | RULE-008; 3 examples per the legacy confidence matrix even though only 1 is in the current formal corpus table (documentation-sync gap, not a confidence problem). |

### Morphology summary
- **Well-established, productive, native-evidenced (High Confidence):** `-a`, `-aha`, `-ja`, `-bo`, `-enga`, `chim`, `-ode`. These form the reliable core of the tense/aspect/mood/polarity system.
- **Still requiring confirmation or additional examples (Medium Confidence):** `-manaha`, `-jaha`, `-jawa`, `-gen`, `-nabe`. None of these are in doubt as *existing* morphemes — every one is independently attested — but each rests on thinner corpus evidence than the High-confidence tier, mostly single examples or examples borrowed from another rule's evidence rather than dedicated testing.
- **No morphology items currently fall in Low Confidence or Native Validation Required** — the open linguistic questions (RULE-030, RULE-031) are about *selection between* existing forms (which suffix/strategy applies when), not about whether any individual morpheme exists or means what it's claimed to mean. This is a meaningful distinction: Garo's morphological inventory itself is comparatively solid; the remaining uncertainty is concentrated in grammar-level selection rules layered on top of it.

## Repository maturity note
This review's main finding isn't a new problem — it's that the
repository's *linguistic* confidence is generally higher than its
*documentation* confidence in several places (RULE-007, RULE-G2, RULE-G7,
RULE-G-classifier lack formal catalogue entries despite good evidence;
RULE-026/`-manaha` and RULE-008/`-ode` have more real evidence than their
corpus-table representation shows). Closing these documentation gaps
(Coverage Audit recommendations 1-3) would raise the *measured* maturity
of the repository without requiring any new native evidence — pure
formalization work, appropriate for a P1 pass.
