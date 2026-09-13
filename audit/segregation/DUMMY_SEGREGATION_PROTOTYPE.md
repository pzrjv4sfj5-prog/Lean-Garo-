# Dummy Segregation Prototype — Claude D

**Status: prototype/demonstration only. No repository, dictionary, or runtime file was modified to produce this. No linguistic adjudication is made anywhere below — every Garo form shown is copied verbatim from `master_dictionary.json` as of hash `9aff8a3fb1786177ef2902a0a8148c0702029182` (10,180 records).**

Every claim below is tagged `OBSERVED IN D AUDIT`, `PROPOSED STRUCTURE`, `DEMONSTRATION`, or `LINGUISTIC DECISION REQUIRED`, per the request.

---

## Part 1 — Dummy segregation sample

`English | Garo | Current status/confidence | Proposed record_type | Provenance/reason | Translation role`

| English | Garo | Status | Proposed record_type | Provenance/reason | Translation role |
|---|---|---|---|---|---|
| student | Chattro | verified_high | LEXICAL WORD | root headword, no compositional trace in `notes` | primary lookup for bare "student" |
| female student | Chattri | verified_high | LEXICAL WORD | sibling gendered root, same shape as `Chattro` | primary lookup for "female student" |
| one student | Chattro sakgni *(sic — see below)* | verified_high | GENERATED/COMPOSITIONAL | `Chattro` + `sak` classifier + numeral suffix table (NV-124 pattern, cited in repo history) | should be *derived at translation time*, not looked up as an independent fact |
| twenty student | Chattro sakKolgrik | verified_high | GENERATED/COMPOSITIONAL | same numeral-table pattern, 20-specific suffix | same as above |
| student *(second entry)* | Porai·gipa | superseded | HISTORICAL/SUPERSEDED | competing root, `confidence=superseded`, still present in file | excluded from active lookup, retained for citation trail |
| one dog | achak mang·sa | superseded | DUPLICATE / DATA-QUALITY | byte-identical `(english,garo)` pair appears twice in the file (D3) | neither copy should be double-counted as independent evidence |
| pineapple | Anaros | superseded | VARIANT (orthography) | raka-stripped form matches a sibling `a·na·ros`-shaped entry under the same English key (D6) | should collapse to one lexical fact, not two |
| do you love me? | Na·a angna kasa·ama? | unverified | UNRESOLVED/CANDIDATE | notes explicitly flag an unresolved tension (D8), no VERIFIED sibling | should NOT be served as a confident translation until Claude A rules |
| where are you? | Na·ara bano? | verified_high | RULE-DERIVED SENTENCE | cites RULE-044 in notes | usable both as a fixed phrase AND as evidence for the locative rule |
| teacher | Skigipa | verified_high | LEXICAL WORD (flagged) | notes reference `compiled_dict`/runtime layer explicitly | lexically fine, but has a known cross-layer note — Claude B territory, not Claude A |

`OBSERVED IN D AUDIT` — every row above is a real record from `master_dictionary.json`, unmodified.
`PROPOSED STRUCTURE` — the `record_type` and `Translation role` columns are this prototype's proposal, not something the corpus currently encodes.

**One honest correction caught while assembling this table:** the request's example gloss `three student → Chattro sakgittam` matches the corpus exactly; `two student → Chattro sakgni` also matches exactly. Good — the request's illustrative examples were drawn from (or independently converged with) real data, not invented.

---

## Part 2 — Lexical knowledge vs. generated output

`OBSERVED IN D AUDIT`:

```
student            → Chattro                    (root, verified_high)
female student     → Chattri                    (sibling root, verified_high)
one student        → Chattro saksa               (verified_high)
two student        → Chattro sakgni              (verified_high)
three student       → Chattro sakgittam           (verified_high)
... (four through twenty student, all verified_high, same shape)
```

`PROPOSED STRUCTURE` — two-layer representation:

**Layer 1 — LEXICAL KNOWLEDGE (irreducible facts)**
```
{ "lemma": "student", "garo": "Chattro", "gender_variant": {"female": "Chattri"} }
```
This is the only fact a linguist actually asserted about "student." Everything else in the `one student` … `twenty student` block is arithmetic on top of it.

**Layer 2 — GENERATED/COMPOSITIONAL RULE (a function, not a fact)**
```
count_noun(N, "Chattro") = "Chattro" + "sak" + NUMERAL_SUFFIX[N]
```
where `NUMERAL_SUFFIX` is the same table already implicated elsewhere in the corpus (e.g. `Chi·sa`..`Chi·sku` for 11–19, cited in repo history as a native-confirmed teens rule).

`DEMONSTRATION` — if this split were real, the 20 "N student" rows would not need to exist as separate `master_dictionary.json` records at all. They'd be **regression-test fixtures proving the rule reproduces them**, not independent lexical facts. That distinction matters directly for Part 5's counting question below.

`LINGUISTIC DECISION REQUIRED` — whether `sak` is a general human classifier or specific to this noun class, and whether the numeral suffix table is fully general or has exceptions, is Claude A's call, not observable from the audit alone. This prototype assumes generality only for demonstration.

---

## Part 3 — Translation impact: 10 dummy inputs

Legend: CMV = Current Master View, SMV = Segregated Master View.

### 1. Single word
**Input:** `teacher`
- CMV: one `verified_high` row, `Skigipa`, plus a `notes` field mentioning `compiled_dict.json`/runtime (Class E in the audit).
- SMV: lexical lookup → `Skigipa`. The runtime note is filed as an *engineering annotation on the fact*, not mixed into the fact itself.
- Consults: LEXICAL layer only.
- Expected path: direct lexical hit.
- Why segregation helps: today a translator reading raw `notes` text can't tell "this is a cross-layer engineering flag" from "this is a linguistic caveat" without parsing prose. Segregation makes that a structured field.

### 2. Fixed phrase
**Input:** `one dog`
- CMV: TWO byte-identical `(english, garo)` records — `achak mang·sa`, `superseded` — both present (D3 exact duplicate, `OBSERVED IN D AUDIT`).
- SMV: one lexical fact, `achak mang·sa`, with a `duplicate_count: 2` provenance note instead of two ledger rows.
- Consults: DUPLICATE-COLLAPSE layer before lexical lookup.
- Expected path: single confident hit, not two competing "sources."
- Why segregation helps: today an automated confidence-counting heuristic (like this audit's own D7 tie-detector) could be fooled into thinking two independent citations exist when it's one fact typed twice.

### 3. Sentence
**Input:** `where are you?`
- CMV: `verified_high`, `Na·ara bano?`, notes cite RULE-044.
- SMV: served from a SENTENCE/PHRASE-FIXED layer *and* logged as one supporting instance for the locative rule, not treated as two unrelated facts.
- Consults: sentence-fixed lookup first (fast path); rule-evidence layer second (for future rule refinement, not for this translation).
- Expected path: direct fixed-phrase hit.
- Why segregation helps: today this record is simultaneously a translation and a piece of grammatical evidence, with no structural marker distinguishing the two uses.

### 4. Number + noun
**Input:** `three students`
- CMV: `Chattro sakgittam`, `verified_high` — AND a same-english-key sibling entry `Chattro sak·gittam`-shaped competing under the reconciled-plural key (audit shows `student`/`Porai·gipa` as a separate superseded root, and the ledger's D1/D2 counts for this cluster are large — 12 distinct English glosses share the Garo form `chik·gni`, per the audit).
- SMV: `three students` → GENERATED layer output from `count_noun(3, "Chattro")` = `Chattro sakgittam`, cross-checked against the stored fixture (they already agree).
- Consults: GENERATED layer first (if the rule exists and is trusted), lexical-fixture layer to confirm.
- Expected path: rule-derived, confirmed by stored example.
- Why segregation helps: right now this fact is stored 21 times (one through twenty) instead of once-plus-a-rule; if the rule is ever corrected, the corpus doesn't know it has 21 places to update.

### 5. Number + classifier construction
**Input:** `four fruits`
- CMV: `LINGUISTIC DECISION REQUIRED` — the audit does not contain a directly-pulled record for this exact phrase in this pass; the repo's own history (WORKSTATE.yaml) records a `rong`-classifier fruit-counting rule, but this prototype does not re-derive or assert its current value.
- SMV: would route to the classifier-rule layer (`rong` + numeral) if that rule is confirmed current, else fall through.
- Consults: classifier/morphology layer.
- Expected path: **LINGUISTIC DECISION REQUIRED** — cannot confirm from this audit pass alone without re-pulling the specific record.
- Why segregation helps: forces an explicit "which classifier rule applies to this noun class" check instead of silent last-write-wins.

### 6. Form where a generated entry currently exists
**Input:** `two student`
- CMV: `Chattro sakgni`, `verified_high` — but the audit also shows this exact English key colliding with a differently-spelled sibling (`two students`, `chik·gni`, `superseded`) under the pre-reconciliation root, and case-duplicate siblings (`Two student` etc., D5).
- SMV: GENERATED layer serves `Chattro sakgni` (rule output); the `chik·gni`-rooted sibling is filed as HISTORICAL, excluded from the active path.
- Consults: GENERATED layer, with the historical root explicitly suppressed rather than silently outranked.
- Expected path: rule-derived hit.
- Why segregation helps: today "which one currently ships" depends on undocumented compile-time tie-break behavior (Claude C's audits have repeatedly found this exact pattern — see repo history on `pickPrimary`/`Check F` mismatches). Segregation makes the active/historical split an explicit, inspectable field instead of an emergent property of array order.

### 7. Form where no generated entry exists
**Input:** `six teachers`
- CMV: `LINGUISTIC DECISION REQUIRED` — no record for this exact phrase was pulled from the audit in this pass.
- SMV: GENERATED layer would attempt `count_noun(6, "Skigipa")` (if the classifier/root are confirmed compatible) — but this prototype does not invent that output.
- Consults: GENERATED layer only, since no fixture exists.
- Expected path: **LINGUISTIC DECISION REQUIRED** — whether `Skigipa` takes the same `sak`+numeral pattern as `Chattro` is not established here.
- Why segregation helps: makes the *absence* of a fixture visible and explicit, instead of silently falling through to an [UNKNOWN] token with no diagnostic trail (a failure mode the repo's own engineering history documents repeatedly).

### 8. Superseded/historical candidate
**Input:** `student` (bare)
- CMV: TWO records compete — `Chattro` (`verified_high`) and `Porai·gipa` (`superseded`).
- SMV: lexical layer serves `Chattro`; `Porai·gipa` is retained in a HISTORICAL layer, visible on request but excluded from the active translation path.
- Consults: lexical layer (active only).
- Expected path: `Chattro`.
- Why segregation helps: this is exactly what `confidence: superseded` is supposed to accomplish already — the demonstration shows segregation making that exclusion structural (a separate layer) rather than a per-record flag a downstream compiler has to remember to check.

### 9. Unresolved candidate
**Input:** `do you love me?`
- CMV: `Na·a angna kasa·ama?`, `unverified`, notes explicitly flag an unresolved tension (`OBSERVED IN D AUDIT`, D8).
- SMV: routed to an UNRESOLVED/CANDIDATE layer, never served as a confident translation.
- Consults: UNRESOLVED layer — which, by design, should NOT feed the translator's normal output path.
- Expected path: **LINGUISTIC DECISION REQUIRED** — no confident Garo output should be asserted here.
- Why segregation helps: today `unverified` records can and do reach compiled output under certain tie-break conditions (documented repeatedly in this repo's own Claude B/C history); segregation would make "unresolved" a hard gate, not a soft hint.

### 10. Multiple records currently competing
**Input:** `orange`
- CMV: `Narang`, `verified_high` — flagged in the audit as having a raka/orthography-only sibling variant under the same key (D6, `OBSERVED IN D AUDIT`).
- SMV: one lexical fact (`Narang`), with the orthographic sibling folded in as a spelling variant annotation, not a second competing fact.
- Consults: lexical layer, with variant-collapse applied before the translator ever sees two candidates.
- Expected path: `Narang`.
- Why segregation helps: distinguishes "two people wrote the same word differently" from "two people disagree about the word" — the audit currently can only flag both as "multiple candidates," not tell them apart automatically.

---

## Part 4 — Proposed lookup architecture

`PROPOSED STRUCTURE` — this prototype's suggested order, NOT asserted as correct:

```
English input
      ↓
1. FIXED sentence/phrase lookup  (exact-match citations — cheapest, most confident)
      ↓
2. LEXICAL word lookup            (root headwords — "student", "teacher")
      ↓
3. GENERATED/COMPOSITIONAL layer  (numeral+classifier, morphology-derived forms)
      ↓
4. Grammar/morphology assembly    (sov-assembly, suffixing, for anything not covered above)
      ↓
5. HISTORICAL/SUPERSEDED — excluded from all of the above, consulted only for citation/audit trail
      ↓
6. UNRESOLVED/CANDIDATE — excluded from all of the above, routed to Claude A, never silently served
      ↓
7. Fallback / [UNKNOWN]
```

**Why this order, and where the audit data pushes back on the "obvious" order in the prompt:**

- Fixed sentence/phrase lookup is placed *before* lexical lookup, not after — because the audit's `Class C` rule-candidate rows (e.g. `where are you?` citing RULE-044) show that fixed citations are often *more* reliable than reconstructing from parts, precisely because they're the ones with direct native evidence attached.
- GENERATED/COMPOSITIONAL sits *after* lexical, not folded into it, because Part 2 above showed it's structurally a function-of-a-fact, not a fact — conflating them (as the current flat file does) is exactly what makes the 21-row `Chattro` numeral cluster look like 21 independent facts to a naive counter.
- HISTORICAL and UNRESOLVED are pulled OUT of the main path entirely rather than being "step 6 of 7 in a cascade" — the audit found both are currently reachable through undocumented tie-break behavior (D3/D5 exact/case duplicates, D7 verified-ties), which argues for a hard exclusion gate rather than a low-priority fallback position.

`LINGUISTIC DECISION REQUIRED` — whether grammar/morphology assembly should run *before* the generated-compositional layer (i.e., whether numeral+classifier forms are themselves a case of general morphology or a special-cased lexical pattern) is exactly the kind of question this prototype flags rather than answers.

---

## Part 5 — Critical test: how many of the 10,180 are independent lexical facts?

**What can be established from this audit pass:**
- `OBSERVED IN D AUDIT`: 2,754 records (27%) are Class B — single `verified_high` candidate, no detected discrepancy. This is an *upper bound* on "clean," not a count of "irreducibly lexical," because Class B as defined by this audit does not distinguish a root word from a rule-generated form that merely happens to have no competing sibling (e.g. `twenty student` is Class B-shaped in isolation but is compositional per Part 2).
- `OBSERVED IN D AUDIT`: 3,833 records carry a D1 flag (same English key, multiple distinct Garo forms) and 5,441 carry a D2 flag (same Garo form, multiple English glosses) — these are NOT necessarily duplicates; D2 in particular is expected to include large amounts of legitimate polysemy (one Garo word, several English senses) that this audit cannot distinguish from genuine data error without linguistic review.
- `OBSERVED IN D AUDIT`: the `Chattro`/`Chattri` student cluster alone contributes at least 21+ records that are demonstrably one lexical fact plus one general rule (Part 2), not 21 independent facts. Numeral-suffix clusters of this shape recur elsewhere in the corpus per repo history (e.g. the teens 11–19 rule, `Chi·` + suffix) — but this audit pass did not exhaustively enumerate every such cluster.

**What cannot yet be established:**
- The true count of "irreducible lexical roots" vs. "generated from a root+rule" requires knowing, for every WORD/PHRASE record, whether a general compositional rule already covers it — that's a rule-inventory cross-reference this audit pass did not perform.
- How much of the 5,441-record D2 population is genuine polysemy vs. genuine data conflict is a linguistic call, not a mechanical one.

**What additional classification pass would be required:**
1. A rule-inventory sweep: enumerate every known productive pattern (numeral+classifier tables, `-rang` plural, tense/aspect suffixing, etc.) and mechanically check which WORD/PHRASE records are fully reproducible by an existing rule from a shorter root already present in the corpus. Only the *irreducible* remainder is a true lexical-fact count.
2. A D2 sub-classification pass distinguishing "same Garo, unrelated English senses" (polysemy — legitimate) from "same Garo, near-synonymous English glosses that look like data drift" (candidate real conflict) — this needs either linguistic judgment (Claude A) or a much finer mechanical heuristic than this audit's regex-based approach.

`LINGUISTIC DECISION REQUIRED` for both of the above — Claude D is not asserting a final number.

---

## Part 6 — Risks of blindly implementing this segregation

`PROPOSED STRUCTURE`-level risks, all `DEMONSTRATION`/analysis, not audit findings:

- **Legitimate phrases misclassified as generated.** A fixed idiom that happens to *look* decomposable (e.g. resembles a numeral+noun pattern) could be silently routed to the GENERATED layer and regenerated wrong, losing a native-confirmed exact form. The `where are you?` RULE-044 example in Part 3 shows real records straddle both categories deliberately — a hard split could actively discard the fixed-citation version in favor of a rule-reconstructed one.
- **Legitimate polysemy treated as duplicates.** The D2 metric (5,441 flagged records) is the clearest case: one Garo word with several genuinely distinct English senses is not an error, but a naive "collapse same-Garo records" step (as sketched loosely in Part 3, input 10) would destroy real information if applied without a polysemy check.
- **Historical evidence being lost.** Every HISTORICAL/SUPERSEDED record in this corpus is retained *on purpose*, per the project's own stated citation discipline (visible throughout repo history — SUPERSEDED rows are tagged, never deleted). A segregation implementation that treats "historical" as "safe to prune" would violate that standing policy.
- **Native-verified forms incorrectly downgraded.** If the segregation logic weights "matches a general rule" over "has a direct native citation," a `verified_high` record with strong native evidence could be treated as merely a generated-and-therefore-lower-priority fact, inverting the actual evidentiary hierarchy.
- **Generated forms that are actually lexicalized.** Some numeral+classifier or compound forms may have drifted into being their own fixed expression (idiomatization) even if they were originally rule-generated. Treating everything that *matches* a rule's shape as *purely* generated risks discarding a lexicalization that a native speaker would insist is now its own word.
- **Classifier/morphology rules confused with dictionary entries.** The corpus currently stores rule *instances* (e.g. all 21 `Chattro` counted forms) as flat dictionary rows. A segregation pass that naively promotes "matches a rule" to "delete the instance, keep only the rule" would need the rule to be 100% correct and 100% general — Part 5 already flags that this hasn't been established.
- **English key ambiguity.** Case-only duplicates (D5, 3,678 records) and near-duplicate phrasing (e.g. "student" vs "Student") could cause a segregation pass keyed on normalized English to silently merge two records that a closer look would show are legitimately distinct (e.g. a proper-noun sense vs. a common-noun sense).
- **Garo orthography/raka differences normalized incorrectly.** This audit's own raka-stripping normalization (used to detect D6) is a heuristic, not a linguistic ruling — the repo's real history shows raka placement is sometimes linguistically meaningful (e.g. the still-open "angry cluster raka placement" question cited in repo history) and sometimes purely cosmetic. Blind normalization risks collapsing a real linguistic distinction into a false "spelling variant."

---

## Summary

This is a prototype only. It demonstrates that the corpus *could* be split into lexical-fact / generated-rule / historical / unresolved layers using real examples (the `Chattro` student cluster is a clean, verified illustration), and that doing so would change several translation paths for the better (duplicate collapse, historical exclusion, unresolved gating). It does **not** establish a corpus-wide lexical-fact count, does **not** decide any contested linguistic form, and does **not** recommend implementation without the Part 6 risks being addressed by Claude A/Claude B/Project Owner review first.
