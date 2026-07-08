# Garo Grammar Rule Catalogue — v1.0

Structured per Sprint Work Package schema. Rule IDs map to
`THANGSENG_RULES_LOOKUP.md` source rules where applicable (cited).

---
### RULE-001 — Raka Locality
**Description:** Raka (·) exists only in verb/noun roots, never introduced by a suffix.
**Examples:** `cha·a→cha·aha` (retained); `dak→dakja` (never introduced).
**Counterexamples:** none confirmed.
**Dependencies:** Stem Formation Rule (RULE-015).
**Native Notes:** Source Rule 1, foundational, re-confirmed via majority-vote audits across 8+ separate root-consistency bugs found and fixed.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-002 — Past/Perfect Unification
**Description:** `-aha` marks both simple past and perfect aspect; Garo does not obligatorily split these.
**Examples:** `cha·aha` = "ate" / "has eaten" (both, context-disambiguated).
**Counterexamples:** none confirmed.
**Dependencies:** RULE-015 (full-root-append exception).
**Native Notes:** Source Rule 2.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-003 — SOV Word Order
**Description:** Base sentence order is Subject-Object-Verb.
**Examples:** `Achak Angko chikaha` (dog me bit).
**Counterexamples:** Imperatives drop subject (RULE-003b).
**Dependencies:** none.
**Native Notes:** Source Rule 3.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-003b — Imperative Subject-Drop
**Description:** Commands have no overt subject.
**Examples:** `Sengbo` (stop!).
**Counterexamples:** none.
**Dependencies:** RULE-003.
**Native Notes:** Source Rule 3.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-004 — Pronoun Paradigm
**Description:** Full subject/object/possessive pronoun table, plus formal/informal register pair (Ua/Bia).
**Examples:** See Grammar Specification §3.
**Counterexamples:** `bio` (informal locative "at him/her") has no attested form in either register — not a counterexample, an unfilled cell.
**Dependencies:** none.
**Native Notes:** Source Rule 4.
**Validation Status:** Verified (core table); Unknown (informal locative cell).
**Confidence:** High (core); N/A (unfilled cell — do not guess).
**Launch Priority:** P0 (core); deferred (unfilled cell, low practical impact).

---
### RULE-008 — If-Clause Suffix `-ode`
**Description:** Subordinating suffix attached directly to verb stem for conditional clauses.
**Examples:** `cha·ode` = "if eat"; `Na·a cha·ode, bilakgen` = "if you eat, you will be strong."
**Counterexamples:** none confirmed.
**Dependencies:** RULE-015.
**Native Notes:** Source Rule 8.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P1 (subordination is lower-frequency than core tense/negation).

---
### RULE-013 — Chim (Discontinued Past)
**Description:** `chim` is a free-standing post-verbal word (not a fused suffix) marking "used to X" (with plain root) or "was X-ing, no longer" (with continuous form).
**Examples:** `ka·achim` = "used to work"; `poraienga chim` = "was studying" (note: space).
**Counterexamples:** Do not fuse as `poraiengachim` — confirmed wrong; the pastcont+chim construction is always two words.
**Dependencies:** RULE-001, RULE-011 (continuous), RULE-015 exception.
**Native Notes:** Source Rule 13. This was a real, fixed implementation bug (fused form produced incorrect output) — retained here as a explicit counterexample for future implementers.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-017 — Simple Negation (`-ja`)
**Description:** `-ja` marks negation for both present and past reference; there is no separate confirmed simple-past-negative suffix.
**Examples:** `cha·ja` = "does not / did not eat."
**Counterexamples:** `-jaha` does NOT mean past negation (see RULE-025).
**Dependencies:** RULE-015.
**Native Notes:** Source Rule 17, corrected 2026-07-05 from an earlier (wrong) assumption that `-jaha` was past negation.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-018 — Verbal-Adjective `-gija`
**Description:** `-gija` forms a verbal adjective ("without doing X"), always paired with a following main verb; it is not a general negation strategy.
**Examples:** `Ua an·tangni kamko dakgija dongaha` = "she stayed without doing her work."
**Counterexamples:** `-gija` used alone as a sentence's only verb is a misuse (a historical implementation bug, since fixed).
**Dependencies:** RULE-017 (contrast).
**Native Notes:** Source Rule 18, corroborated by independent adjective-placement evidence (namja vs. namgija positional flexibility) in `GARO_GRAMMAR_REFERENCE.md`.
**Validation Status:** Verified (structural distinction); Needs Native Validation (exact English-pattern-to-form selection rule, i.e. when an arbitrary "not X-ing" input should trigger `-gija` vs. `-ja`, beyond the "without" pattern already implemented).
**Confidence:** High (structure); Medium (full selection rule).
**Launch Priority:** P0 (structure, already implemented); P1 (selection-rule refinement).

---
### RULE-025 — Cessative `-jaha`
**Description:** `-jaha` marks cessation ("was doing, has now stopped"), an aspectual category distinct from both negation and simple past.
**Examples:** `cha·jaha` = "has stopped eating" (NOT "did not eat").
**Counterexamples:** The 2026-07-01 assumption that this meant past-negation is a documented, corrected error — retained as counterexample for institutional memory.
**Dependencies:** RULE-017 (contrast).
**Native Notes:** Source `GRAMMAR_NOTES_JAHA_MANAHA_20260703.md`, direct native correction.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-026 — Completive `-manaha`
**Description:** Marks completive aspect ("has finished X"); overlaps with `-aha` in casual spoken usage per direct native confirmation, but is not identical in careful usage.
**Examples:** `cha·manaha` = "has eaten" / "ate" (completive framing).
**Counterexamples:** none confirmed; the aha/manaha overlap itself is confirmed, not a counterexample.
**Dependencies:** RULE-002 (contrast/overlap).
**Native Notes:** Source Rule 28.
**Validation Status:** Verified (existence and overlap); Needs Native Validation (precise contexts where they diverge, if any).
**Confidence:** Medium-High.
**Launch Priority:** P1.

---
### RULE-029 — Hortative/Imperative `-bo`
**Description:** Single suffix form serves both imperative (command) and hortative ("let's") functions.
**Examples:** `Sengbo` = "stop!" (imperative); `Biko sandibo` = "search for him!" (imperative); hortative use disambiguated by subject/context.
**Counterexamples:** none confirmed.
**Dependencies:** RULE-003b.
**Native Notes:** Source Rule 29, corrects an earlier imperative-only assumption.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-031 — Copula Inconsistency [OPEN]
**Description:** Three unreconciled predicative strategies (bare adjective, `daka`-copula, `ong·a`-copula) coexist in confirmed data.
**Examples:** attested for each strategy individually; no rule determines which applies when.
**Counterexamples:** N/A — this rule documents an unresolved contradiction, not a settled pattern.
**Dependencies:** affects RULE-004 (predication generally), Grammar Specification §5.
**Native Notes:** Source Rule 31, flagged by repository audit, not yet put to Thangseng.
**Validation Status:** Needs Native Validation.
**Confidence:** Low (as a unified rule); High (each strategy individually attested).
**Launch Priority:** P0 — highest-priority open linguistic question for the launch sprint, given predication's frequency.

---
### RULE-033 — Locative "Under," Retiring a Lexical Confusion
**Description:** "Under" = `nokkima`/`kokkima` (confirmed equivalent register/spelling variants, not one correct and one erroneous form — see update below) + locative `-o`. A prior implementation entry (`Ka·ma·o`) incorrectly reused the unrelated word "down" (`Ka·ma`) + `-o`.
**Examples:** `Achak tebil nokkimao ong·a` = "the dog is under the table."
**Counterexamples:** `Ka·ma·o` — confirmed wrong, retained as a documented counterexample.
**Dependencies:** RULE-001 (raka), Grammar Specification §6 (locative suffix), Morphology Specification §5 (lexical-split caution). See also RULE-034 (wider locative/directional set) and RULE-035 (under/beneath sense split).
**Native Notes:** Source Rule 33; root cause traced to a same-suffix confusion between two unrelated roots (`down` vs. `under`), not a random error — instructive for future implementers per Morphology Specification §5.
**Update (2026-07-08):** The `kokkima`/`nokkima` spelling discrepancy flagged in `edc94b7`/`THANGSENG_RULES_LOOKUP.md` is now resolved — both are confirmed legitimate variants, not a typo needing correction. Source: relayed native guidance (Thangseng via Tridip, 2026-07-08), logged in `docs/PENDING_LINGUISTIC_PROPOSAL_20260708_locatives.md`. See RULE-035 for the related but distinct "under" vs. "beneath" (`mitapo`) sense split, which this rule's general "under" mapping does not cover.
**Validation Status:** Verified (core "under the table" sentence, direct Thangseng confirmation, unchanged); Verified at Medium confidence (spelling-variant resolution — relayed, not a direct real-time confirmation session; see RULE-035 note on evidentiary standard).
**Confidence:** High (core rule); Medium (spelling-variant resolution, pending direct confirmation opportunity).
**Launch Priority:** P0 (correction already implemented); P1 (generalizing locative word order beyond this single confirmed sentence — see Grammar Specification §2, RULE-G2 productivity boundary).

---
### RULE-034 — Locative/Directional Word Set (Vocabulary Expansion)
**Description:** Nine additional single-word locative/directional lexical items, proposed for the productive `-o` locative-suffix pattern established by RULE-033: `inside` (`ning'ao` / `nokningo`, lit. "inside the room"), `outside` (`a'palo`), `above` (`kosako`), `behind` (`janggilo` / `janggilchipak`, lit. "on the back"), `beside` (`sambao`), `up` (`kosak`), `over` (`badeao`, lit. "beyond" — flagged uncertain by the source itself), `across` (`nalsao`), `below` (`ka'mao`).
**Examples:** None yet at full-sentence level — these are single-word lexical proposals only, unlike RULE-033's "under the table" which has a complete native-confirmed sentence. No corpus entry added (see Validation Corpus coverage notes).
**Counterexamples:** None — nothing yet contradicts these; equally, nothing yet confirms them beyond the single relayed source.
**Dependencies:** RULE-033 (established locative `-o` pattern this set extends), Grammar Specification §6, §2 RULE-G2 (productivity boundary — this rule does not resolve that boundary, it adds candidate vocabulary within it).
**Native Notes:** Source: raw WhatsApp exchange between Thangseng and Tridip, relayed via Claude B chat session 2026-07-08 (`docs/PENDING_LINGUISTIC_PROPOSAL_20260708_locatives.md`). This is native-sourced but **evidentially weaker** than the project's usual bar for "Verified" (compare RULE-033's `nokkimao`, which came from a direct native-confirmation session with a full example sentence). `over`/`badeao` is explicitly flagged uncertain by the source and should be treated as lower-confidence than the other eight.
**Validation Status:** Needs Native Validation (direct) — eight items at Medium confidence pending a direct Thangseng confirmation pass (ideally with a full example sentence each, matching RULE-033's standard); `over`/`badeao` at Low confidence, explicitly source-flagged as uncertain.
**Confidence:** Medium (8 items); Low (`over`).
**Launch Priority:** P1 — vocabulary expansion, not a correctness bug; does not block V1.0. Recommend direct native confirmation before promotion to `corrections.json` or Validation Corpus status.

---
### RULE-035 — "Under" vs. "Beneath" Sense Split (`mitapo`)
**Description:** English "under" and "beneath" are not a single Garo mapping. `kokkimao`/`nokkimao` (RULE-033) covers general "under." `mitapo` is used specifically for "underneath" in the sense of something under a sheet, slab, or covering — a distinct sense, not a free variant of RULE-033's form.
**Examples:** None yet at full-sentence level for the `mitapo` sense (e.g. no confirmed sentence like "the book is under the blanket"). RULE-033's `nokkimao` example ("dog under the table") is confirmed to be the *general* sense, not the covering sense.
**Counterexamples:** Treating `mitapo` and `kokkimao`/`nokkimao` as interchangeable would be a misuse of this rule — the whole point of RULE-035 is that they are not.
**Dependencies:** RULE-033 (the sense this rule splits off from).
**Native Notes:** Source: same relayed 2026-07-08 exchange as RULE-034. Not yet confirmed with a worked example distinguishing the two senses in context.
**Validation Status:** Needs Native Validation (direct) — the sense distinction itself is plausible and specific enough to record, but has no confirmed example sentence yet, and RULE-033's existing "under the table" example should NOT be reused as evidence for `mitapo`, since it is a general-sense example.
**Confidence:** Medium (distinction exists); Low (no worked example).
**Launch Priority:** P1 — refines an existing P0 rule's scope but does not change RULE-033's already-implemented behavior; not launch-blocking.
