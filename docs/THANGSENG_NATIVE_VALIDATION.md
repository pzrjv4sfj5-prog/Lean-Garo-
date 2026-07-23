# Thangseng Native Validation — Canonical Open Question Repository
_Created 2026-07-08 by Claude A. Permanent document — do not create
per-question `PENDING_NATIVE_QUESTIONS_*` files; add new questions here
and update in place as answers arrive._

## Minimal question set (for relay — smallest possible set)
If only a short list can be relayed to Thangseng at once, these three are
the highest-value, most self-contained asks. Everything else in this
document either depends on these, is lower priority, or (NV-006) may not
need Thangseng at all.

1. **(NV-001, Rule 30) — ANSWERED 2026-07-18.** Does "go" change form
   depending on whether a destination is mentioned? Thangseng: *"No,
   the form depends primarily on the mood and the tense. Apart from
   those the negative suffix also affects the form."* On `-ang`/`-ba`
   as general directional markers: *"'ang' can be looked at as an
   indicator for movement 'away from' but only when used with the
   with word re'a (to walk or to go). Ang is used with other words as
   well and there it doesn't carry the same sense."* So `-ang` is real
   but narrowly scoped to `re·a`, not a general prefix — see
   `GRAMMAR_RULE_CATALOGUE.md` RULE-030 for the full update and the
   still-unreconciled destination-presence surface pattern.
2. **(NV-002, Rule 31) — ANSWERED 2026-07-18.** After "happy"/"good"/
   "tired" as a predicate, is `ong·a` required, optional, or specific
   to certain persons? Thangseng: *"Yes. Ong'a in such a use functions
   as the 'to be' verb. I am happy. = Anga kusi ong'a. If the ong'a is
   omitted, the be verb is missing. Example: anga kusi = I happy."*
   Confirmed required, not optional. Also volunteered: `ong·a` has a
   second, unrelated sense, "correct/right" (`Ong'ama ong'ja?` = "is
   it correct or not?"), and a general account of `daka`'s "to do" +
   phrase-forming behavior (`Seng·a daka`="to be rude", `Jara
   daka`="to be foolish") — see `GRAMMAR_RULE_CATALOGUE.md` RULE-031
   for the full update. Doesn't fully close NV-017 (noun-predicate
   case), but is the first real structural account of `daka`.
3. **(NV-010, narrowed 2026-07-10) — PARTIALLY ANSWERED 2026-07-18.**
   When you say "want to speak"/"want to study," is there a `·` in the
   verb, even though there isn't one in "I spoke"/"I was studying"?
   Thangseng, unprompted while answering a different question: *"There
   is no raka in speak and study. Speak = agana; to study = poraia."*
   Resolves the raka-locality question for these two specific verbs —
   no raka in either. The `agan·`/`tus·` distinct-word question is
   still open (`ring` resolved independently; `tusi`'s `tus·aha` form
   tracked in the full NV-010 entry below, separate smaller question).

4. **(NV-013, updated 2026-07-16) — ANSWERED 2026-07-18.** `Chroka`
   ("dance") itself was settled; only the purposive form was open.
   Thangseng: *"I want to dance. = Anga chrokna ska."* Confirmed:
   `chrokna` (no raka), not `Chroka·na`. Committed to `corrections.json`.
5. **(NV-016, added 2026-07-13) — PARTIALLY ANSWERED 2026-07-18.**
   "Is `nanga`('need') related to `nangja`('need not')?" Thangseng:
   *"Yes, nanga is related to nangja. We can say that nangja is a form
   of nanga with the negative suffix."* Confirmed. The `ska`/`sikenga`
   half of this question turned out to be much bigger than expected —
   split out to its own high-priority item, NV-021 below, since it now
   touches 13 live production sentences.
6. **(NV-017, added 2026-07-16) — ANSWERED and CLOSED, 2026-07-18.**
   For "my father is a teacher": is it `pagipa/pa·a skigipa daka` or
   `...ong·a`? Thangseng, definitively: *"It is pagipa. daka is to do
   in terms of working. Ong'a is to be. So it is ong'a. Angni pagipa
   skigipa ong'a."* Corrected the live `corrections.json` entry (was
   `Ang·ni pa·a skigipa daka`, provenance-uncertain per the old
   RULE-005 note — now `Angni pagipa skigipa ong·a`, three corrections
   at once: word choice, copula, and raka). Confirms `ong·a` is used
   for noun predicates too, not just adjective predicates — see
   `GRAMMAR_RULE_CATALOGUE.md` RULE-005 and RULE-031 for the
   downstream update this requires.
7. **(NV-018, added 2026-07-16) — SUBSTANTIALLY ANSWERED 2026-07-18.**
   Is `ama` ("mother," address form, relayed 2026-07-16) the same word
   in any way as a modal/possession `ama` candidate ("can eat,"
   flagged in the 2026-07-13 modals proposal), or are these unrelated
   homophones? Thangseng: *"Yes, ama has the same spelling in both the
   meanings. No difference."* Also, unprompted correction: *"ama is
   not 'can eat'. It only means can"* — the modal gloss is the bare
   ability modal "can," not "can eat" (the "eat" came from the specific
   example sentence `cha·na ama`, not from `ama` itself). **Still
   open:** whether `apa`/`ama` are address-only or usable as the
   subject of a full descriptive sentence — Thangseng said he'd reply
   later, still in a meeting.
8. **(NV-019, added 2026-07-18) — ANSWERED 2026-07-18.** "Is `Bal`
   ever used alone to mean 'wind,' or only in the established `Balwa`
   form?" Thangseng: *"Wind is 'balwa'. The bal has a totally different
   meaning. It means load or burden."* Confirmed: `Bal` ≠ "wind."
9. **(NV-020, added 2026-07-18)** Does `Bal` on its own ever mean "a
   flower," "air," or "a big basket" — or is `load`/`burden` really its
   only meaning, like NV-019 confirmed for the wind sense? The source
   dictionary lumped all six senses under one `Bal` headword; three
   (bundle/load/burden) are now confirmed, the other three are
   unconfirmed and already live in `master_dictionary.json` — see
   `PENDING_LINGUISTIC_PROPOSAL_20260718_bal_homonymy.md`.
10. **(NV-021, added 2026-07-18) — SUBSTANTIALLY RESOLVED 2026-07-18.**
    Thangseng, now declarative rather than uncertain: *"Sikenga is not
    derived from ska. It is derived from sika meaning to push, to
    insert. Sikenga is continuous of sika."* And: *"Ska is want in
    terms of desire."* Corrected 10 production `corrections.json`
    entries plus `master_dictionary.json` and `irregular_verbs.json`
    (`want`/`wants`, both tables) from `sikenga` to `ska` — see
    `PENDING_LINGUISTIC_PROPOSAL_20260718_sikenga_ska_sika.md` for the
    full list. **Still open:** the object-only cases (`"i want
    water"`/`"i want food"`/`"i want to see you"` — no verb+`na` to
    attach `ska` to, pattern unconfirmed for bare nouns); whether
    `"need"` should map to `ska` or `nanga` (Thangseng draws a clear
    conceptual line between desire and necessity, but "need" is
    currently still on the old, uncorrected `sikenga`); and the
    `bag-o` raka-locality question.
verb, ability-modal) are real but lower-priority — bundle them into a
second relay only after this first batch lands, to avoid overloading a
single native-validation session. NV-006 and NV-009 do not need to be
asked at all yet (see their entries below).

## How to use this document
Each question has a stable ID (`NV-###`). When a native answer arrives —
direct from Thangseng, or relayed — update the question's **Status** and
**Required Native Validation** fields in place, then propagate the
resolution into the relevant canonical doc (`GRAMMAR_RULE_CATALOGUE.md`,
`MORPHOLOGY_SPECIFICATION.md`, `VALIDATION_CORPUS.md`) and mark the
question **Closed** here with a pointer to where it landed. Do not delete
closed questions — they're institutional memory, same discipline as the
counterexamples already kept in the Rule Catalogue.

Evidentiary standard: a "direct" answer (live session with Thangseng,
worked example sentence) resolves a question to Verified/High confidence.
A "relayed" answer (WhatsApp, secondhand) can move a question forward but
should generally land at Medium confidence pending direct confirmation,
consistent with how RULE-034/035 were handled.

---

## NV-001 — `re·` vs `re·ang` for "go" (Rule 30)
_**Answered 2026-07-18** — see the minimal question set above and `GRAMMAR_RULE_CATALOGUE.md` RULE-030 for the current answer. Detail below is the pre-answer evidence review, kept for the record._


**Topic:** Verb root selection for "go" — bare `re·` vs extended `re·ang`.

**Background:** Two forms of "go" coexist in confirmed data with no
settled selection rule between them.

**Current Repository Evidence:**
- `Re·jawa` = "I will not go" (bare, no destination) — direct native
  reconfirmation.
- `Hai re·naha` = "let's go" (bare, no destination) — original confirmed
  sentence, matches the above.
- `Re·anga`=go, `re·anga`=went (context-disambiguated), `re·angenga`=going,
  `re·angja`=did not go, `Dokanchi re·angbo`=go to the shop — all use
  `re·ang`, all destination-bearing or general-dictionary forms.
- `Re·angja` ("did not go") was itself confirmed in a destination-bearing
  context ("did you go to the market") — so it's not necessarily evidence
  against the bare/directional split hypothesis, it's just not evidence
  *for* it either, since no bare-context "did not go" has been tested.

**Existing Grammar Rules:** RULE-030 (`GRAMMAR_RULE_CATALOGUE.md`, added
2026-07-09, status OPEN). *(Correction 2026-07-10: this note previously
said "no numbered rule yet" — stale, fixed.)*

**Existing Morphology:** `re·` treated as the bare root; `re·ang` as an
extended/directional form of the same root. **Update (2026-07-10):**
`docs/GARO_GRAMMAR_VALIDATED.md` (Burling academic grammar, GOLD-tier
external source) confirms `-ang-`("away from speaker") and `-ba-`("toward
speaker") as a **general, productive directional suffix pair**, not
verb-specific — this would mean `-ang` in `re·ang` isn't a "go"-specific
irregularity at all, and directly explains the already-confirmed
`re·ba`("come") as the same system's toward-speaker counterpart. Not
native-direct, so doesn't resolve this on its own, but is a much
better-grounded starting hypothesis than treating the split as arbitrary.

**Candidate Hypotheses:**
1. Bare `re·` = intransitive/destinationless "go"; `re·ang` = directional
   "go to X", required whenever a destination is present or implied.
2. Free variants — either is acceptable regardless of context, and the
   apparent pattern in the data is coincidental (all destination-bearing
   examples happened to use `re·ang` in the data collected so far).
3. Register or aspectual distinction unrelated to destination-presence
   (e.g. formality, immediacy) that happens to correlate with the
   destination pattern seen so far.
4. **(Added 2026-07-10, highest-supported)** `-ang`/`-ba` are a general
   away-from-/toward-speaker directional suffix pair (per Burling),
   independent of destination presence — `re·` is simply "move/go" and
   the directional suffix marks orientation relative to the speaker, not
   whether a destination is stated. This would explain `re·ba`("come")
   for free and doesn't require positing destination-presence as the
   trigger at all. Needs the same native confirmation as hypothesis 1,
   but is a better first thing to ask about given external corroboration.

**Required Native Validation:** Present Thangseng with paired minimal
contrasts, both with and without a destination, across at least
tense/aspect (present, past, future, negative, imperative) to see which
form each context selects. Suggested test sentences:
- "I am not going" (no destination) vs. "I am not going to the market"
- "He did not go" (no destination) vs. "he did not go to the market"
- "I am going" (no destination) vs. "I am going home"

**Why the Answer Matters:** Affects every "go"-related translation the
engine produces — a high-frequency verb. Currently `corrections.json`
has a narrow, safe fix (`will not go`/`i will not go` → `re·jawa` only)
specifically to avoid over-generalizing an unconfirmed pattern.

**Repository Components Impacted:** `src/data/corrections.json` (verb-go
entries), `docs/GRAMMAR_RULE_CATALOGUE.md` (would become a new numbered
rule once resolved), `docs/MORPHOLOGY_SPECIFICATION.md` (verb-root
extension patterns), future Verb Family entry for "go".

**Status:** OPEN — Needs Native Validation (direct). Unchanged since
2026-07-05 flag.

---

## NV-002 — Copula/predication selection rule (Rule 31)
_**Answered 2026-07-18** — see the minimal question set above and `GRAMMAR_RULE_CATALOGUE.md` RULE-031 for the current answer. Detail below is the pre-answer evidence review, kept for the record._


**Topic:** Which of three attested predicative strategies applies when.

**Background:** Three copula/predication strategies are independently
attested in confirmed data with no rule governing which applies in a
given context. This is Rule 31 in `GRAMMAR_RULE_CATALOGUE.md`
(RULE-031), the highest-priority open linguistic question for the
launch sprint given predication's frequency.

**Current Repository Evidence:**
- **Zero-copula bare adjective:** `Gari sila` = "the car is beautiful"
  (noun+adjective, nothing else). Matches `he is happy`→`Ua kusi`, `she
  is tired`→`Ua nenga` (grammar-assembly, no copula).
- **`daka`:** confirmed to exist (Rule 5) but no worked complement
  example — its behavior with predicative adjectives is unattested, not
  just unconfirmed.
- **`ong·a`:** appears in `i am happy`→`Anga kusi ong·a`, `it is
  good`→`Nama ong·a` (predicative-adjective use), and separately in the
  locative existential `Achak tebil kokkimao ong·a` = "the dog is under
  the table" (`ong·a`="is [located]").

**Existing Grammar Rules:** RULE-031 (Copula Inconsistency, OPEN),
RULE-004 (Pronoun Paradigm — dependency, predication generally),
Grammar Specification §5.

**Existing Morphology:** No morphological account yet distinguishes
when `ong·a` attaches vs. is omitted vs. `daka` is used instead.

**Candidate Hypotheses:**
1. `ong·a` is required specifically in first-person predicative-adjective
   statements (`Anga kusi ong·a`) but optional/absent in third-person
   (`Ua kusi`) — a person-conditioned rule.
2. `ong·a` is a general acceptable alternate to bare-adjective regardless
   of person, and the third-person bare examples simply weren't tested
   with `ong·a` added.
3. `ong·a` is fundamentally a locative/existential copula ("is
   located/exists") that has leaked into unrelated predicative-adjective
   corrections as an error, not a real predication strategy — meaning
   `Anga kusi ong·a` and `Nama ong·a` may themselves need re-examination.
4. `daka` and `ong·a` are register variants of each other (one more
   formal/careful than the other) rather than each having a distinct
   grammatical trigger.

**Required Native Validation:** Direct question to Thangseng, as
originally framed in `THANGSENG_RULES_LOOKUP.md` Rule 31: "Is `ong·a`
required after predicative adjectives, optional, or specific to certain
persons/contexts? How does it relate to `daka`?" Suggested test matrix:
same adjective ("happy", "good", "tired") across all three grammatical
persons (I/you/he-she), with and without `ong·a`, to isolate whether
person is the conditioning factor.

**Why the Answer Matters:** Predication (X is Y) is one of the most
frequent sentence types in any language; an unresolved 3-way ambiguity
here has broader translation-quality impact than most single-word
vocabulary gaps.

**Repository Components Impacted:** `src/data/corrections.json`
(predicative-adjective entries), `docs/GRAMMAR_RULE_CATALOGUE.md`
RULE-031 (would resolve from OPEN to Verified), `docs/
GRAMMAR_SPECIFICATION.md` §5, future Verb Family / copula documentation.

**Status:** OPEN — Needs Native Validation (direct). Unchanged since
2026-07-05 flag; highest P0 linguistic priority.

---

## NV-003 — RULE-034 locative/directional set: direct confirmation

**Topic:** Nine locative/directional words (below, inside, outside,
above, behind, beside, up, over, across) currently at Medium/Low
confidence from a relayed source.

**Background:** See `docs/GRAMMAR_RULE_CATALOGUE.md` RULE-034 and
`docs/PENDING_LINGUISTIC_PROPOSAL_20260708_locatives.md` for full
detail. Reviewed 2026-07-08; deliberately not promoted past Medium
confidence because the source was a relayed WhatsApp exchange
(Thangseng via Tridip), not a direct confirmation session.

**Current Repository Evidence:** Single-word mappings only, no full
example sentences (contrast with RULE-033's "under the table," which has
a complete native-confirmed sentence). `over`/`badeao` explicitly
flagged uncertain by the source itself.

**Existing Grammar Rules:** RULE-033 (established `-o` locative
pattern this set is proposed to extend), RULE-034 (this proposal, OPEN),
Grammar Specification §2 RULE-G2 (pre-verbal clustering — productivity
beyond the single confirmed sentence not yet validated).

**Existing Morphology:** `-o` locative suffix confirmed productive in
at least one case (RULE-033); general productivity across arbitrary
locative roots not yet confirmed (Grammar Specification §6 explicitly
flags this: "one full-sentence example; general productivity not yet
validated").

**Candidate Hypotheses:** The 9 proposed mappings are plausible and
internally consistent with Garo's locative-suffix pattern, but plausible
is not the same as confirmed — no hypothesis-level uncertainty here
beyond ordinary translation risk, mainly an evidentiary-standard gap.

**Required Native Validation:** One example sentence per word, ideally
in the same format as RULE-033's ("the X is [locative] the Y"), directly
confirmed with Thangseng — not relayed. `over`/`badeao` needs particular
attention given the source's own flagged uncertainty.

**Why the Answer Matters:** Currently blocks promotion of 9 vocabulary
items from the Rule Catalogue into `corrections.json`/Validation Corpus.

**Repository Components Impacted:** `src/data/corrections.json`,
`docs/VALIDATION_CORPUS.md`, `docs/GRAMMAR_RULE_CATALOGUE.md` RULE-034.

**Status:** OPEN — Needs Native Validation (direct), Medium priority
(vocabulary expansion, not a correctness bug, does not block V1.0).

---

## NV-004 — RULE-035 "under" vs. "beneath" (`mitapo`) sense split

**Topic:** Whether `mitapo` is genuinely a distinct sense from
`kokkimao`/`nokkimao`, and what its productivity boundary is.

**Background:** See RULE-035. Relayed source specifies `mitapo` for the
"under a sheet/slab/covering" sense specifically, distinct from general
"under" (`kokkimao`/`nokkimao`).

**Current Repository Evidence:** No confirmed example sentence for the
`mitapo` sense exists. RULE-033's "dog under the table" example is
confirmed to be the *general* sense — it should not be reused as
evidence for `mitapo`.

**Existing Grammar Rules:** RULE-033 (the sense this splits from),
RULE-035 (this question).

**Existing Morphology:** Unknown whether `mitapo` takes the same `-o`
locative pattern or is already a complete locative form (compare
`kokkima`+`-o` vs. a possible `mitap`+`-o` — the proposal's spelling
`mitapo` doesn't disambiguate this without native confirmation).

**Candidate Hypotheses:**
1. Clean sense split as described — `mitapo` exclusively for
   covering/slab sense, `kokkimao`/`nokkimao` for everything else.
2. `mitapo` is a regional or register variant that happens to be
   preferred in covering contexts but isn't strictly exclusive.
3. The covering/general distinction is real but the boundary is fuzzier
   than "sheet/slab/covering" — needs example sentences at the edges
   (e.g. "under a blanket" vs. "under a rock" vs. "under water").

**Required Native Validation:** At least one worked sentence for the
`mitapo` sense (e.g. "the book is under the blanket"), plus ideally one
boundary-testing example to check hypothesis 3.

**Why the Answer Matters:** Prevents a future implementer from
collapsing `mitapo` and `kokkimao`/`nokkimao` into a single "under"
mapping, which would be a real semantic loss if the sense split is
confirmed.

**Repository Components Impacted:** `src/data/corrections.json`,
`docs/GRAMMAR_RULE_CATALOGUE.md` RULE-035.

**Status:** OPEN — Needs Native Validation (direct), Medium priority.

---

## NV-005 — Necessity-modal negation (`nangja`) vs. simple desire-negation

**Topic:** Whether Garo grammatically distinguishes "need not X" from
"don't want to X", and if so, how.

**Background:** Surfaced by `docs/NATIVE_SENTENCE_VALIDATION_AUDIT.md`
Case 1. Thangseng's native-confirmed gloss explicitly distinguished
`nangja` ("need not," modal necessity negation) from plain desire
negation, but the engine's current output collapses both into the same
`sikengja` ("want"+negation) path.

**Current Repository Evidence:** Native sentence `TV ninan nangja...`
glossed as "(I) don't need to watch TV..." with `nangja` explicitly
noted by Thangseng as "need not," distinct from "don't want." Engine
output for "I don't need to watch TV" is `Anga sikengja` — same
construction the engine presumably also produces for "I don't want to
watch TV" (untested directly, but same lexical path).

**Existing Grammar Rules:** RULE-017 (Simple Negation, `-ja`) covers
general negation but has no necessity-modal sub-case. No existing rule
in `GRAMMAR_RULE_CATALOGUE.md` addresses modal necessity at all.

**Existing Morphology:** `nangja` not yet analyzed morphologically —
unclear whether it's `nang` (a necessity root) + `-ja` (negation), which
would parallel RULE-017's general negation pattern, or a distinct lexical
item.

**Candidate Hypotheses:**
1. `nangja` = `nang` (necessity/obligation root, "need/must") + `-ja`
   (RULE-017 negation) — a compositional necessity-negation, distinct
   from `sikeng` ("want") + `-ja`.
2. `nangja` is lexically fixed/idiomatic, not compositional.
3. The distinction is real but only surfaces in certain registers or
   sentence types, not universally.

**Required Native Validation:** Confirm the morphological breakdown of
`nangja` directly with Thangseng, and get a minimal pair: "I don't want
to watch TV" vs. "I don't need to watch TV" as two separately-elicited
sentences (the audit only has the second, glossed from a single natural
sentence — the first is inferred, not elicited).

**Why the Answer Matters:** If confirmed, this is a real grammar gap
(new suffix/root pattern), not a vocabulary gap — necessity modality is
a common category cross-linguistically and worth a dedicated rule.

**Repository Components Impacted:** `src/translationEngine.js` (would
need new modal-negation routing — Claude B's domain once a rule exists),
`docs/GRAMMAR_RULE_CATALOGUE.md` (candidate new rule), `docs/
MORPHOLOGY_SPECIFICATION.md` (if compositional hypothesis confirmed).

**Status:** OPEN — Needs Native Validation (direct). Single natural
sentence is suggestive, not sufficient for a new rule (see the "Native
Sentence Validation Audit" review below — this is flagged as a candidate
lead, not yet promoted).

**Reconciled 2026-07-08 with `docs/PENDING_REGRESSION_CASES.md`
RC-CANDIDATE-001** (Claude B's independently-collected evidence, same
underlying finding — cross-checked to avoid duplication per the joint
work package): isolated engine test confirms "I don't need to watch TV"
→ `Anga sikengja` (confidence 0.82), same output path as plain desire-
negation, confirming the collapse is systematic and not an artifact of
the compound sentence. Severity: Medium (produces a plausible but
imprecise output, not a crash). Still needs the same native validation
described above — RC-CANDIDATE-001 doesn't resolve NV-005, it sharpens
the evidence for it.

---

## NV-006 — `·ko` (object) vs. `·o` (locative) selection on locative adjuncts

**Topic:** Why the engine selects the object marker `·ko` where native
usage selects the locative `·o` for "in bed" ("watch on status lying
**in bed**").

**Background:** Surfaced by the same audit case. Native sentence uses
`palango` (`Palang`+`·o`, locative), engine-generated output for the
isolated clause uses `palang·ko` (object marker).

**Current Repository Evidence:** `·o` locative confirmed correct
elsewhere — RULE-033's "under the table" example, and `corrections.json`'s
general `"in / at": "·o"` entry. The failure is in *selection logic*
(when the engine chooses `·ko` vs. `·o`), not in whether `·o` itself
works.

**Existing Grammar Rules:** No rule yet governs `·ko`/`·o` selection for
locative-adjunct phrases like "in bed" (as opposed to true direct
objects). This is an engineering/grammar-assembly logic question as much
as a linguistic one — flagged here because the underlying linguistic
question (when is "in bed" an adjunct vs. treated as an object of
"watching") needs a grammar answer before Claude B can fix the selection
logic correctly.

**Existing Morphology:** `·ko` (accusative/object) and `·o` (locative)
both independently confirmed and well-attested; this is purely a
selection/disambiguation question, not a morphology gap.

**Candidate Hypotheses:**
1. The engine's grammar-assembly path defaults to `·ko` for any noun
   immediately preceding certain verb classes (e.g. perception verbs
   like "watch") regardless of adjunct/object status — an engineering
   bug, not a missing linguistic rule.
2. There's a genuine ambiguity in the source English ("watch [on
   status] lying in bed" — "bed" could plausibly be misparsed as the
   object of an implicit "watching the bed") that a better English-side
   parse would resolve without needing new Garo grammar rules.

**Required Native Validation:** This one may not need Thangseng at all
— it may be resolvable by Claude B reviewing the grammar-assembly
selection logic once flagged. Documented here so the linguistic
justification (what should the output actually be) is on record before
that engineering work happens, per the standing role boundary.

**Why the Answer Matters:** A genuine grammatical divergence with a
concrete wrong-output example — worth a regression test once resolved
either way.

**Repository Components Impacted:** `src/translationEngine.js`
grammar-assembly path (Claude B), `docs/GRAMMAR_RULE_CATALOGUE.md` (if a
genuine linguistic rule turns out to be needed, not just a bug fix).

**Status:** CLOSED (2026-07-12, Task 4 NV backlog review) — effectively
resolved by later evidence. Hypothesis 1 (engineering routing bug, not a
native question) was correct. Now precisely tracked as engineering work:
`RC-CANDIDATE-002` (fixed, `d0e6c06`) resolved the compound-sentence
`·ko` case; `RC-CANDIDATE-011` tracks the remaining `"in"`-preposition
gap with much sharper evidence (12-sentence benchmark vs. this item's
1-sentence origin). No native validation was ever needed for this one,
confirming the original "may not need Thangseng at all" note. See
`docs/PENDING_REGRESSION_CASES.md` for current status.

---

## NV-007 — Posture verb `tue` ("lying") — malformed output, missing coverage

**Topic:** "I am lying in bed" produces a structurally invalid output
(`Anga Palangha`), not a graceful gap.

**Background:** Surfaced by the same audit case. `tue` (posture/converb
"lying," contextually also "sleeping" in a more literal sense) has no
engine equivalent at all.

**Current Repository Evidence:** Direct-lookup-confirmed that
`Anga Palangha` is not a recognized dictionary form — it's `Palang`
("bed," a noun) with a past-tense-shaped suffix `-ha` appended as if it
were a verb root. This is a bug (structurally invalid Garo), not merely
an incomplete feature.

**Existing Grammar Rules:** No rule yet covers posture verbs
(lying/sitting/standing) as a category.

**Existing Morphology:** `tue` itself is unanalyzed — root shape,
whether it takes standard tense/aspect suffixes like other verbs, and
its relationship (if any) to `Palang`("bed") are all unknown.

**Candidate Hypotheses:**
1. `tue` is a regular verb root missing from the dictionary entirely —
   once added, standard suffix rules (RULE-002 etc.) should apply
   normally.
2. Posture verbs are a distinct morphological class with irregular
   behavior (cross-linguistically common — posture verbs are often
   irregular).

**Required Native Validation:** Basic paradigm elicitation for `tue`:
present, past, negative, continuous forms, directly from Thangseng —
this is a straightforward vocabulary/morphology gap-fill, not a deep
open question, but needs the base forms before it can be documented.

**Why the Answer Matters:** Currently a genuine bug (malformed output),
not just a gap — worth prioritizing the minimum fix (even just excluding
`tue`-type inputs from the noun-as-verb-root fallback) before full
paradigm coverage exists.

**Repository Components Impacted:** `src/data/corrections.json` /
`master_dictionary.json` (missing `tue` entry), `src/translationEngine.js`
(the `Palang`+`-ha` malformed-output bug specifically — Claude B should
treat this as a bug regardless of full posture-verb documentation
timeline), `docs/GRAMMAR_RULE_CATALOGUE.md` (candidate posture-verb
rule), future Verb Family entry.

**Status:** OPEN — Needs Native Validation (direct, for full paradigm);
the malformed-output bug itself does not need to wait for that — flagged
to Claude B as a standalone engineering fix.

**Reconciled 2026-07-08 with `docs/PENDING_REGRESSION_CASES.md`
RC-CANDIDATE-003** — additional confirmed detail: "I am lying down"
(without "in bed") produces a *different* malformed output, `Anga
Ka·ma` — misparsed as directional "down," incorrectly reusing the
unrelated `down = Ka·ma` mapping from RULE-033. So `tue` currently fails
in two distinct ways depending on context: bare "lying down" collides
with an unrelated existing correction (RULE-033's `down`), while "lying
in bed" produces the noun-treated-as-verb-root error already documented.
Claude B flags this as the single highest-severity item in the current
evidence queue since it's the only one producing structurally invalid
Garo rather than an incomplete-but-valid output. Confirms my original
priority assessment.

---

## NV-008 — Ability modal `man·ienga` ("can/able") — entirely dropped

**Topic:** No engine output tested in the audit ever produces an
ability-modal rendering.

**Background:** Surfaced by the same audit case. `man·ienga` ("can/am
able," continuous-aspect marked) is present in the native sentence but
absent from all 4 candidate engine outputs tested.

**Current Repository Evidence:** Confirmed absent across all tested
inputs; no ability-modal handling observed anywhere in
`corrections.json` or `GRAMMAR_RULE_CATALOGUE.md`.

**Existing Grammar Rules:** None — a genuine, previously undocumented
gap category (modality generally is underrepresented in the current
catalogue, which is otherwise strong on tense/aspect/negation).

**Existing Morphology:** `man·ienga` unanalyzed — root `man·` (possibly
related to "get/obtain," common cross-linguistic source for ability
modals) + `-ienga` (continuous-aspect shape, parallel to other `-enga`
continuous forms already confirmed elsewhere, e.g. `poraienga`
"studying").

**Candidate Hypotheses:**
1. `man·` is a general ability/possibility root that combines
   productively with the same continuous-aspect suffix pattern already
   confirmed for other verbs (RULE pending — would parallel existing
   `-enga` continuous morphology).
2. Ability modality is expressed as a fixed idiom in this specific
   sentence, not a productive pattern.

**Required Native Validation:** Elicit ability-modal forms across a few
different main verbs ("I can eat," "I can go," "I can work") to test
whether `man·` + continuous-aspect is productive.

**Update, 2026-07-18 (Claude A):** a separate relay (2026-07-13 modals
proposal) gave `ama` as a second candidate for "can" (`cha·na ama` =
"can eat"), alongside this entry's `man·ienga`. That proposal
originally flagged `ama` as risky specifically because
`GLOBAL_RAKA_CONVERSION_HANDOFF.md` records `mother = ama` as
confirmed wrong (corrected to `aai`) — a documented error history
recurring in an unrelated context. That caution is now substantially
resolved: Thangseng directly confirmed (2026-07-18, answering NV-018)
that `ama` genuinely means both "mother" (address form) and "can"
(bare ability modal, not "can eat" specifically) — "same spelling in
both meanings, no difference." Combined with the 2026-07-16 relay
(`apa`/`ama` as a legitimate address register, distinct from
colloquial `baba`/`a·ai`), this suggests the June 17 "ama is wrong for
mother" note was most likely a register mixup, not a real error — see
the correction added directly to
`GLOBAL_RAKA_CONVERSION_HANDOFF.md`. Net effect: `ama` is now a
better-evidenced "can" candidate than it was, but this still doesn't
resolve the `ama`-vs-`man·ienga` relationship (free variants? register
difference? different persons/tenses?) — that's a distinct open
question, not yet asked directly.

**Why the Answer Matters:** Modality (ability, necessity — see NV-005)
is a systematically underrepresented category in the current grammar
catalogue relative to tense/aspect/negation. Two of the four candidate
new-rule questions in this document (NV-005, NV-008) are both modality
gaps, suggesting modality generally may be worth a dedicated grammar
sweep once native validation on both lands.

**Repository Components Impacted:** `src/translationEngine.js` (no
ability-modal path exists to route to), `docs/GRAMMAR_RULE_CATALOGUE.md`
(candidate new rule), `docs/MORPHOLOGY_SPECIFICATION.md` (if `man·`+
continuous-aspect productivity confirmed).

**Status:** OPEN — Needs Native Validation (direct).

**Reconciled 2026-07-08 with `docs/PENDING_REGRESSION_CASES.md`
RC-CANDIDATE-004** — important refinement: `master_dictionary.json`
**already contains** `"can": "man·a"`. This changes the diagnosis from
"the engine has no ability-modal vocabulary" to "the vocabulary exists
but the grammar-assembly path never invokes it for English 'can + verb'
constructions" — a wiring gap, not a missing-word gap. Confirmed
systematic across 3 independent isolated tests ("I can watch," "I can
eat," "I can watch status lying in bed" — all identical to their
non-modal counterparts). This changes NV-008's own "Repository
Components Impacted" note: `src/translationEngine.js`'s grammar-assembly
modal-detection logic is now the more likely fix location than adding
new dictionary content, though the underlying morphological question
(does `man·` + continuous-aspect productively combine with arbitrary
verbs, per my original hypothesis 1) is still open and still needs
Thangseng. **Additional caveat found during this reconciliation:**
`master_dictionary.json`'s own entry for `man·a`/"can" carries a
`notes: "UNVERIFIED/HIGH"` flag internally — even this dictionary entry
hasn't cleared the project's normal confirmation bar. The fix isn't
simply "wire up an already-confirmed entry" — the entry itself should
get direct Thangseng confirmation alongside the ability-modal question.

**Update 2026-07-13:** A new relayed proposal
(`docs/PENDING_LINGUISTIC_PROPOSAL_20260713_modals_possession.md`)
offers `ama` as an alternate form for "can eat" alongside `man·a`. **Not
treating these as equally-weighted candidates** — `ama` has a documented
error history in this repository (`GLOBAL_RAKA_CONVERSION_HANDOFF.md`:
`mother = ama` confirmed wrong, corrected to `aai`). Not proof `ama` is
wrong here too, but a red flag worth carrying into the eventual native
question rather than silently picking one. Suggested addition to the
eventual relay: confirm both `man·a` and `ama` directly, and ask whether
`ama` might be a mishearing/mistranscription of `aai`(mother) bleeding
into an unrelated context, or a genuine distinct word.

---

## NV-009 — `TV` / `status` loanword coverage

**Topic:** Common tech/media loanwords entirely absent from the
dictionaries.

**Background:** Surfaced by the same audit case — a pure vocabulary gap,
not a grammar question.

**Current Repository Evidence:** `TV` and `status` never produced across
7 tested candidate inputs; confirmed dictionary gap, not a bad-gloss
artifact (gloss is native-verified).

**Existing Grammar Rules:** N/A — vocabulary/lexicon issue, not grammar.

**Required Native Validation:** Minimal — loanwords used verbatim
generally don't need deep native validation the way grammar does, but
worth confirming the expected spelling/register (is `status` always
English-script, or is there a Garo-script convention for common
loanwords?) and identifying other likely-missing loanwords in the same
category (phone, internet, other common tech terms) proactively rather
than one at a time.

**Why the Answer Matters:** Low linguistic complexity, likely
high-frequency impact — loanwords for modern technology/media concepts
are probably common in real conversational Garo (P4 territory —
conversational Garo, per the priority framework).

**Repository Components Impacted:** `src/data/corrections.json` /
`master_dictionary.json` — straightforward additions once a short list
is confirmed.

**Status:** OPEN — Needs Additional Evidence (low priority, P2/P4
territory per the priority framework — vocabulary expansion, not a
grammar correctness issue).

**Reconciled 2026-07-08 with `docs/PENDING_REGRESSION_CASES.md`
RC-CANDIDATE-005** — one upgrade to this item's severity assessment:
Claude B's isolated testing found the loanword isn't just missing, it's
**silently dropped with no error marker** ("I watch TV" → `Anga
ni·rik·a`, `TV` vanishes with no `[UNKNOWN]` flag the way full-sentence
passthrough gets). Silent data loss is a worse failure mode than a
visible gap. Doesn't change the P2/P4 priority classification (still
vocabulary, not grammar), but the fix should include a passthrough/flag
mechanism for unrecognized loanwords generally, not just a `TV`/`status`
dictionary entry — Claude B frames this as a policy decision (individual
entries vs. systematic pass-through), which is the right level for me to
weigh in on once this priority comes up.

---

## NV-010 — Raka-Inconsistency Cluster in `-na` Infinitive Forms
_**Partially answered 2026-07-18** (agana/poraia specifically — no raka) — see the minimal question set above. Detail below is the pre-answer evidence review, kept for the record._


**Update (2026-07-10):** `ring` is **resolved and removed from this
cluster** — primary-source chat transcripts confirm `ring·a` = "to sing"
and `ringa` = "to drink" are two distinct roots, not one root with
inconsistent raka. `ring·na` ("want to drink") is now suspect as a
possible mix-up between the two roots rather than evidence for a
`-na`-triggered phonological rule — cross-referenced into
`docs/PENDING_REGRESSION_CASES.md` RC-CANDIDATE-009 by Claude B. The
remaining cluster — `agan` (speak), `porai`/`pora` (study), `tusi`
(sleep) — has **no equivalent alternate-word explanation found yet** and
stays open exactly as below. Do not assume the same resolution applies;
each needs its own check.

**Topic:** Whether the `-na` infinitive suffix (used in the `[verb]-na
sikenga` = "want to [verb]" construction) genuinely triggers raka on
certain roots that are raka-free everywhere else, or whether this is a
transcription-error cluster in `corrections.json`.

**Background:** Surfaced during the Canonical Verb Inventory pass
(2026-07-08, see `docs/VERB_INVENTORY.md`). RULE-001 states raka lives in
the root only, never the suffix, and is either always present or always
absent for a given root. Three roots remain in this cluster after the
`ring` resolution above: `agan` (speak), `porai`/`pora` (study), and
`tusi` (sleep, one form) are all raka-free in `THANGSENG_RULES_LOOKUP.md`'s
audited table and in most `corrections.json` entries, but show raka in
their `-na` infinitive form specifically (`a·gan·na`, `pora·na`,
`tus·aha`).

**Current Repository Evidence:**
`agana`/`aganaha` vs. `a·gan·na` in `'i want to speak' -> 'Anga a·gan·na
sikenga'`; `poraienga`/`poraienga chim` vs. `pora·na` in `'i want to
study' -> 'Anga pora·na sikenga'`; `tusia`/`tusienga` vs. `tus·aha`
(this last one isn't even in the `-na` construction, so it may be a
narrower, separate transcription issue). No alternate-word explanation
(the kind that resolved `ring`) has been found for any of these three —
unlike `ring·`/`sing`, there's no independently-confirmed second Garo
word that looks like `agan·`/`pora·`/`tus·` with a different meaning.

**Existing Grammar Rules:** RULE-001 (Raka Locality) — this cluster is
either a genuine, previously-undocumented exception to RULE-001, or
three separate data-entry errors that happen to share a pattern.

**Existing Morphology:** No account yet of `-na` (infinitive) triggering
phonological changes; every other confirmed suffix in
`MORPHOLOGY_SPECIFICATION.md` §3 is raka-neutral.

**Candidate Hypotheses:**
1. `-na` genuinely triggers raka insertion on certain root shapes (a real
   phonological rule, would be a genuine RULE-001 refinement/exception,
   not a violation).
2. These three entries in `corrections.json` are transcription errors
   from a different, less rigorously-audited data-entry pass than the
   one that produced `THANGSENG_RULES_LOOKUP.md`'s raka table — the
   `ring` case's resolution as a lexical split (not this) makes a
   similar per-word explanation worth checking for each of these three
   individually before assuming hypothesis 1.
3. Mixed — some of the three are real, some are errors.

**Required Native Validation:** Ask Thangseng directly: "When you say
'want to speak' / 'want to study,' is there a `·` in the verb, even
though there isn't one when you just say 'I spoke' / 'I was studying'?"
Also worth asking, per the `ring` precedent: "Is there a different Garo
word that sounds like `agan·`/`tus·` with a `·`, distinct from
`agan`/`tusi`?" — since that's exactly what resolved the `ring` case and
wasn't the first thing asked there either.

**Why the Answer Matters:** If hypothesis 1 is correct, this is a real
gap in RULE-001 affecting an unknown number of other roots beyond the
two found here — worth knowing before more infinitive-based
constructions get built. If hypothesis 2 is correct, `corrections.json`
has at least 2-3 wrong entries currently in production.

**Repository Components Impacted:** `src/data/corrections.json` (2-3
entries, possibly wrong), `docs/GRAMMAR_RULE_CATALOGUE.md` RULE-001
(would need a documented exception if hypothesis 1 confirmed),
`docs/MORPHOLOGY_SPECIFICATION.md` (infinitive suffix behavior).

**Status:** OPEN — Needs Native Validation (direct). Newly added
2026-07-08. Efficient to bundle with NV-001/NV-002 in a future relay
since it's a single yes/no-style question with high leverage (resolves
3-4 data points at once).

---

## NV-011 — `nina` vs. `Nia`/`nika`: same root or different form?

**Topic:** Whether `nina` (from the Case 1 audit, "to watch") is a
conjugated/infinitive form of the already-confirmed `Nia`/`nika` root
("see/look/watch"), or a distinct item.

**Background:** Surfaced in `docs/PENDING_VOCABULARY.md` (Claude B).
`master_dictionary.json` has `Nia` = "see/look/watch" (3 entries,
general category). `THANGSENG_RULES_LOOKUP.md` separately confirms
`nika` (lowercase, with raka) = "see," raka-free, via `nikaha` ("seen").
`docs/VERB_INVENTORY.md` Part 2 already treats these as one root
(`nika`/`ni`). The Case 1 audit's `nina` could be a third spelling of
the same thing, or a genuinely different infinitive form.

**Current Repository Evidence:** `Nia` (master_dictionary.json, no
raka shown), `nika`/`nikaha` (THANGSENG_RULES_LOOKUP.md, explicitly
raka-free), `nina` (Case 1 sentence, segmentation itself unconfirmed —
could be `ni`+`na` infinitive, or a fixed form). No sentence directly
contrasts two of these forms to test whether they're interchangeable.

**Existing Grammar Rules:** None specifically; would connect to the
`-na` infinitive suffix already used productively elsewhere (`cha·na`,
`dakna`, etc. — see `docs/verbs/CHA_EAT.md`).

**Candidate Hypotheses:**
1. One root, multiple attested spellings across different documentation
   passes (`Nia`/`nika`/`ni`) with `nina` = `ni` + `-na` infinitive,
   entirely regular.
2. `nina` and `Nia`/`nika` are related but distinct (e.g. `nina` might
   carry a narrower "watch [media]" sense vs. general "see/look").

**Required Native Validation:** Confirm whether "I see it" / "I want to
watch it" / "I am watching" all use the same root with regular suffixes,
or whether "watch" (especially media-watching, as in the TV context)
is lexically distinct from general "see/look."

**Why the Answer Matters:** Affects whether this needs one clean verb
page or two separate ones, and whether the engine's existing `Nia`-based
"watch TV" handling is using the right root at all.

**Repository Components Impacted:** `docs/VERB_INVENTORY.md`,
`docs/GRAMMAR_MORPHOLOGY_CONFIDENCE_REVIEW.md` (currently lists
`nika`/`ni` as Medium confidence partly because of this open question).

**Status:** OPEN — Needs Native Validation (direct), Low priority
(doesn't block any P0 item, mainly a documentation-cleanliness question).

---

## NV-012 — `nisona` vs. `nina`: selection rule between two "watch"-adjacent verbs

**Topic:** When does a speaker choose `nisona` ("to watch(ingly wait),"
per Claude B's gloss — can also mean "wait expectantly for someone
arriving") over `nina`/`Nia` (general "watch/see/look")?

**Background:** Surfaced in `docs/PENDING_VOCABULARY.md` (Claude B),
same Case 1 sentence. Both appear in the same sentence in different
clauses (`TV ninan nangja ... status o nisona manaienga`), suggesting
they're not free variants of each other within at least this one
speaker's usage — but the semantic boundary isn't mapped.

**Current Repository Evidence:** One confirmed instance of `nisona`
used specifically for "watching a status/social-media post" rather than
"watching TV" (`ninan`) in the same sentence — a real, if thin, contrast.
Possible morphological link to the `-na`/purposive-suffix family already
in `MORPHOLOGY_SPECIFICATION.md` §3 (Claude B's own note, worth
checking rather than treating `nisona` as an unrelated new root).

**Candidate Hypotheses:**
1. `nisona` is reserved for lower-engagement/ongoing "watching for/
   awaiting" senses (checking a status, waiting for someone) while
   `nina` is for direct, engaged watching (TV) — the one contrast
   available is consistent with this but doesn't prove it.
2. Free variation with no strict rule; the speaker's choice in this one
   sentence was stylistic, not governed by a selection rule.

**Required Native Validation:** Minimal pairs needed — e.g. "I am
watching TV" with `nisona` substituted for `nina`, to see if it sounds
wrong, and vice versa with the status-watching clause.

**Why the Answer Matters:** Lower priority than NV-005/007/008 (this is
vocabulary/lexical-selection, not a grammar correctness bug), but worth
capturing while the single data point exists rather than losing the
observation.

**Repository Components Impacted:** `docs/VERB_INVENTORY.md` (would add
`nisona` as a new entry once resolved), `docs/PENDING_VOCABULARY.md`
(Claude B's source entry).

**Status:** OPEN — Needs Native Validation (direct), Low priority.

---

## Linguistic Model: Formal/Casual Register Doublets

Recurring pattern, three independent instances found this session:
`An·ching`/`chinga` ("we"), `gnang`/`donga` (existential "have/is," `gnang`
older+written, `donga` spoken), `hai cha·na`/`hai cha·bo` ("let's eat,"
`cha·na` standard, `cha·bo` "not so strict"). All three: one form is
citation/formal, the other is a spoken/casual variant, both native-
confirmed, neither wrong. Consistent with Thangseng's own methodology
answer (July 7 transcript): natural-usage register choice isn't rule-
governed, it's habit-governed. **Implication for open questions:**
NV-002 (copula) and NV-001 (go) should each get a "is this register
variation rather than a grammatical rule" branch before assuming a
strict selection rule exists.

---

## NV-013 — Purposive form of `ring·a` ("sing") and `Chroka` ("dance")
_**Answered 2026-07-18** — see the minimal question set above. Detail below is the pre-answer evidence review, kept for the record._


**Topic:** Confirm `ring·na`/`Chroka·na`(or equivalent) as the "want to
sing"/"want to dance" forms, replacing `purpose_map.json`'s unconfirmed
`bit·na`/`ruru·na`.

**Background:** `docs/PENDING_REGRESSION_CASES.md` RC-CANDIDATE-007.
`bit·na`/`ruru·na` have no confirmation trail at all; `ring·na` is a
plausible regular `-na` formation by analogy (RULE-015) on the
independently-confirmed `ring·a` root, not itself confirmed.

**Required Native Validation:** "How do you say 'I want to sing'? 'I
want to dance'?" — cheap, two words, high translation-impact (fixes a
reachable "want to X" construction class).

**Update 2026-07-14:** A third candidate for "dance" — `Grika` — found
in a printed Garo-English dictionary source (page-photographed,
title/edition unidentified). Now three unreconciled candidates for
"dance" total: `Chroka` (existing `corrections.json`), `ruru·na`
(existing `purpose_map.json`), `Grika` (this new source). Academic-
source tier only, not native-confirmed — doesn't resolve the question,
adds a third option needing the same direct confirmation. Note: `Grika`
is a distinct dictionary entry from the suffix `-grika` (reciprocal,
see `MORPHOLOGY_SPECIFICATION.md` §7) — same string, unrelated items,
flagging so a future reader doesn't conflate them.

**Update 2026-07-14 (native-confirmed):** The "dance" half of this
question is now resolved. Direct Thangseng confirmation: *"The common
word for dance is chroka. Grika does not mean to dance in general. It
is used for a specific dance performed by the male lead dancer in
Wangala. I think😁"* — hedge preserved deliberately, not smoothed over.
`Chroka` confirmed as the general-purpose "dance" word — the `Grika`
candidate from the printed-dictionary source (added earlier today) is
**withdrawn** as a competing synonym and reclassified as a specific
cultural/ceremonial term (see `VERB_INVENTORY.md` note below). This
also retroactively confirms the printed dictionary's gloss ("Grika, v.
To dance") was accurate but overly general — a real, useful lesson about
that source's granularity, not an error in the source itself.
**Remaining open:** the purposive form (`"want to dance"` — is it
`Chroka·na`, following the regular `-na` pattern, or `ruru·na` as
`purpose_map.json` currently has it?) is still unconfirmed. The "sing"
half of this NV item is also still fully open.

**Update 2026-07-14 (native-confirmed, direct):** Primary source, June
25 chat (relayed today): *"let's dance, let's sing, let's swim?"* →
*"Hai (an·ching) chrokna, hai (git) ring·na, hai (chio) jrona."*
Resolves both remaining questions:
- **"sing"** = `ring·na` — **with raka**, exactly matching the
  already-confirmed `ring·`("sing") vs. `ring`("drink") lexical split.
  Regular `-na` stem formation on the `ring·` root (RULE-015).
- **"dance"** = `chrokna` — regular stem formation on the now-confirmed
  `Chroka` root (`Chroka`→`Chrok`+`na`, RULE-015 applies cleanly).
- **Bonus, unprompted:** "swim" = `jroa`/`jrona` — independently
  corroborates the printed-dictionary source read earlier today
  ("Some verbs without raka: jroa = to swim," suffixes.pdf) with a
  live native-chat confirmation. Two independent sources now agree.
- **Not confirmed, flagged rather than assumed:** the parenthetical
  subjects — `(an·ching)`="we" matches the known pronoun cleanly, but
  `(git)` and `(chio)` don't match any pronoun in the current paradigm.
  `chio` plausibly parses as `chi`("water")+`·o`(locative) — "in the
  water," a location for swimming, not a subject — but this is a
  hypothesis, not confirmed. `git` remains genuinely unclear; not
  guessing at it.

**Update 2026-07-14 (native-confirmed, direct follow-up):** `chio`
confirmed exactly as hypothesized — Thangseng, asked directly "what is
chio": *"In the water."* Confirms the `chi`("water")+`·o`(locative)
parse. `git` remains unconfirmed — not asked directly in this exchange,
still open if it comes up again. **Second, more general finding:**
Thangseng also stated *"The normal use is with the words in the bracket
omitted"* — i.e., dropping the parenthetical (subject or location) is
the **default**, unmarked case, not an optional stylistic choice. This
strengthens `RULE-004`'s existing pro-drop note (already documented as
broader than imperative-only) with a direct statement that omission is
the normal register, not the marked one — worth folding into RULE-004.

**Precision note:** this confirms the **hortative** ("let's X",
`RULE-007`) form specifically, not the `sikenga`("want to X")
construction directly. Given `-na`'s demonstrated regularity across
multiple constructions this session (hortative, want-to, purpose
clauses), it's a well-supported inference — not a separate
confirmation — that `"i want to sing"` = `"Anga ring·na sikenga"` and
`"i want to dance"` = `"Anga Chrokna sikenga"` would follow the same
pattern. High confidence, not identical to direct confirmation.

**Status:** Effectively CLOSED — both original questions resolved with
native evidence. The `sikenga`-construction extension is a strong
inference, not itself re-confirmed; low-priority to re-ask given the
regularity already demonstrated.

---

## NV-014 — `stand`/`sit`/`heard`/`bought` root confirmation (RC-CANDIDATE-008 remainder)

**Topic:** Four unresolved forms, no existing evidence sufficient to adjudicate.

**Required Native Validation:** "How do you say 'standing'? Is it
`chadatenga`, `chadenga`, or related to `Chakata` ('stand,' already in
the dictionary)?" / "'sitting' — `asongenga` or `asong·enga`?" / "'heard'
— is it `rangsan chanchiaha` or `knachik·aha`, or are these two
different things (e.g. 'heard [a sound]' vs. 'heard [news/that X]')?" /
"'bought' — is there a `·` in it? We have two conflicting records:
`breaha` (no raka) and `Bre·ajok`/`brea·aha` (with raka)."

**Why the Answer Matters:** `standing` may be a 3-way vocabulary
question (`Chakata` vs. `chadat`/`chad`), not just a 2-way raka
question — worth surfacing to Thangseng as such rather than a simple
either/or.

**Status:** OPEN — Needs Native Validation (direct), low priority (verb
paradigm cleanup, not launch-blocking).

---

## Provisional recommendation: RULE-031 default (not a resolution)

Copula selection (RULE-031) stays genuinely open — no native validation
exists to resolve it. But `translationEngine.js` currently has **zero**
copula-insertion logic at all for predicate adjectives (confirmed via
full engine read, 2026-07-09), so *something* runs today, unguided. Given
the evidence: the zero-copula bare-adjective strategy (`Gari sila`,
`Me·chik sila`, `Anga am`) is the most-attested pattern (5+ independent
examples, 3 different sentence types) and requires no suffix machinery
to implement. **Recommendation to Claude B, if a default is wanted before
NV-002 resolves:** default new predicate-adjective grammar-assembly to
bare adjective, no copula insertion — matches the safest, most-attested
existing pattern, doesn't foreclose the `ong·a`/`daka` question, and is
easy to override once NV-002 lands. Not a claim that this is "correct"
in general — a conservative default under genuine uncertainty.

---

## Observation: `dong·a`/`donga` raka context-dependence (connects to NV-010)

`docs/GARO_GRAMMAR_REFERENCE.md` (verified-per-claim, see RULE-005 note)
states `dong` shows raka in some contexts and not others: `dong·a`
(general) vs. `donga` "without raka in the 'Ango...donga' construction"
specifically — i.e. the same root varies by grammatical context, not
just by lexical identity. This is a live example of NV-010's hypothesis
1 (a real, context-conditioned raka rule), which lost ground when `ring`
turned out to be a lexical split rather than a phonological pattern.
Not itself confirmed (this document's `daka` claims were individually
verified; this specific claim about `dong` was not separately checked
against corrections.json for the "Ango...donga" context specifically).
Worth a native question if NV-010 gets revisited: "does `dong` ever
change with raka?" — separate from the `agan`/`porai`/`tusi` cluster,
since `dong` isn't part of that group.

---

## NV-015 — `senga`("wait") vs. `Da·mo`("wait," fixed expression) — CLOSED, native-confirmed

**Topic:** Two candidate translations for English "wait" — which is
correct for declarative/inflected use vs. imperative/discourse use.

**Status:** CLOSED (2026-07-12) — fully resolved by direct native
confirmation, no further validation needed.

**Native evidence (direct transcript):**
> User: I will wait. Thangseng: `Anga senggen.`
> User: Damo is also waiting na? Thangseng: Senggen is from the word
> senga. Senga can mean to wait and it can also mean foul smell,
> depending on context.
> User: Translator currently produces: `Anga Damogen` Thangseng: Yes,
> Da·mo can also be understood to mean wait. But I'd call it an
> expression. It does not take any suffix... Da·mo is used when you want
> someone to wait for you. It cannot be changed into any other form.

**Resolution:** `senga`/`senggen` is the correct, inflectable verb for
declarative "wait" ("I will wait" = `Anga senggen`). `Da·mo` is a fixed
discourse expression (see new `RULE-036`) — imperative-only, invariant,
never takes a suffix. The engine's `"Anga Damogen"` output for "I will
wait" is a **confirmed error**, not a valid alternate — `Da·mo` was
never a candidate for inflection at all.

**Cross-checked against existing repository evidence (not just the new
transcript):** `corrections.json` already has `"i am waiting for
you"`→`"Anga nangko sengenga"` and `"i am waiting at the market"`→
`"Anga antio sengenga"` — both correctly using the `senga` root. But the
237-sentence stress-test benchmark (`docs/PENDING_REGRESSION_CASES.md`
RC-CANDIDATE-011 evidence) shows `"i am waiting at the [bed/school/
house/table/room]"` all falling to `grammar-assembly` and generating
`"...Damo"` — confirming this is a **live, systematic error**, not a
one-off. The engine has the right root already, correctly used in 2 of
7 tested "waiting" sentences; the other 5 use the wrong one.

**Repository components impacted:** `src/translationEngine.js`
(whatever table/logic generates `Damo` for declarative "waiting" —
should generate `senga`-based forms instead), `src/data/corrections.json`
(no direct edit needed — `Damo`'s existing entries, `'wait'→'Damo'`,
`'you wait'→'Damo'`, are plausibly fine as-is for imperative/bare
citation use, not necessarily wrong themselves).

**Engineering handoff (linguistic classification complete — this is a
build request for Claude B, not for me):** the `grammar-assembly`
fallback for "waiting at/for X" should route through the `senga` root
(pattern: `Anga [X]·o sengenga` / `Anga [X]ko sengenga` depending on the
locative/object marking already established) instead of `Da·mo`, for
any declarative (non-imperative) "wait" sentence. `Da·mo` should be
reserved for genuine imperative "Wait!" input, consistent with
`RULE-036`. Suggested regression cases: `"i will wait"`→`"Anga
senggen"`, `"i am waiting at the school"`→`senga`-based (not `Damo`),
`"wait!"`→`Da·mo` (imperative should still correctly use `Da·mo`, not
regress to `senga`).

---

## NV-016 — `nanga`("need") vs. `nangja`("need not"); `ska` vs. `sikeng` ("want")
_**`nanga`/`nangja` answered 2026-07-18** (confirmed related). **`ska`/`sikeng` escalated to NV-021** — see the minimal question set above and `PENDING_LINGUISTIC_PROPOSAL_20260718_sikenga_ska_sika.md`. Detail below is the pre-answer evidence review, kept for the record._


**Topic:** Two bundled, cheap questions from a single relayed proposal
(`docs/PENDING_LINGUISTIC_PROPOSAL_20260713_modals_possession.md`).

**Background:** `"need to eat"` was relayed as `cha·na nanga`. The
already-confirmed `nangja`("need not," Native Sentence Validation Audit
Case 1) looks like its negative counterpart — `nanga` + `RULE-017`'s
regular `-ja` would unify two currently-separate-looking forms under one
rule. Separately, `"want to eat"` was relayed as `cha·na ska`, differing
from the currently-implemented `sikenga` (`"i want to eat"` →
`"Anga cha·na sikenga"`, live and working). Shape matches the
formal/casual register-doublet pattern already confirmed three times
this session (`An·ching`/`chinga`, `gnang`/`donga`, `hai cha·na`/`hai
cha·bo`).

**Current Repository Evidence:** `nangja` native-confirmed via direct
gloss ("need not," Case 1). `nanga` only via this single relay, no
worked sentence beyond the one proposal line. `sikenga` extensively
attested (13+ `corrections.json` entries). `ska` only via this single
relay.

**Candidate Hypotheses:**
1. `nanga`/`nangja` are the same root, positive/negative pair via
   `RULE-017`'s regular `-ja` — one rule would cover both.
2. `ska` is a casual-register contraction of `sikeng`, not a competing
   or superseding form — matches the established doublet pattern.
3. (Lower probability, worth ruling out rather than ignoring) either
   pair could be unrelated near-homophones — same caution class as the
   `ama`/`aai` concern in `NV-008`.

**Required Native Validation:** "Is `nanga`('need') related to
`nangja`('need not') — same word, just negated?" / "Is `ska`('want') a
shorter, more casual way of saying `sikenga`, or a different word?" —
both answerable in one short exchange.

**Why the Answer Matters:** If hypothesis 1 confirms, it's a real
grammar simplification (one modal-negation rule instead of tracking two
forms as unrelated). If hypothesis 2 confirms, it adds a genuine, useful
register note without disturbing the working `sikenga` implementation.

**Repository Components Impacted:** `docs/GRAMMAR_RULE_CATALOGUE.md`
(candidate rule if hypothesis 1 confirms — would formalize the
`nangja`/`RULE-005`(necessity-modal) connection first raised in
`NV-005`), `docs/VERB_INVENTORY.md` (`sikeng` entry, register note if
hypothesis 2 confirms). No `corrections.json` changes implied either
way — `sikenga` stays the implemented form regardless.

**Status:** OPEN — Needs Native Validation (direct), low effort,
bundles naturally with other open questions in the next relay.

---

## NV-022 — `chi` as general destination-locative marker ("to the market")

**Status:** CLOSED — native-confirmed, 2026-07-20, Tier 2 (relayed via
Tridip). Raised by Claude B from live acceptance testing
(`docs/PENDING_LINGUISTIC_PROPOSAL_20260719_market_pronoun_case_negation_order.md`).

**Question raised:** engine output for "she will go to the market" was
`Ua bajal / anti·ko Re·anggen` — a malformed dual dictionary value
(`"Bajal / Anti"`) plus the object marker `·ko`, where dozens of other
already-verified entries (`bajalchi`, `Anga bajalchi re·angenga.`,
etc.) use a `chi`-suffixed locative form instead.

**Native response (verbatim):** "Ua antichi re·anggen. Remember
chi=locative 'to'"

**Determination:** `chi` is confirmed as a general destination-locative
suffix ("to X"), attached directly to the place noun — not limited to
this one sentence. This matches the pre-existing `bajalchi`/`skulchi`/
`nokchi` pattern already present throughout `master_dictionary.json`.

**Separately, Project Owner decision (not a native-validation
question):** the malformed `"market": "Bajal / Anti"` dictionary entry
is resolved to `"Bajal"` as the single canonical value (2026-07-20).
`anti` remains valid as a distinct attested form used in the
locative-destination construction; both coexist in the dictionary, not
in conflict.

**Repository components impacted:** `master_dictionary.json` (index
353, patched). Engine fix (`·ko`→`chi` for destination-locative
sentences) tracked as `RC-CANDIDATE-023` in
`docs/PENDING_REGRESSION_CASES.md` — engineering-only, no further
native input needed for the general `chi` rule.

---

## NV-023 — `Chinga` (subject "we") vs. `An·ching` (object "us")

**Status:** CLOSED — native-confirmed, 2026-07-20, Tier 2 (relayed via
Tridip). Raised by Claude B from live acceptance testing (same
proposal doc as NV-022).

**Question raised:** engine output for "we are drinking water" was
`An·ching chi·ko ringenga`, using `An·ching` in subject position.
`pronoun_map.json` currently maps English "we" to a single Garo form.

**Native response (verbatim):** "Chinga chi(ko) ringenga." — then, on
follow-up ("why not An·ching? It is also we" / "so which is
correct"): "Use depends on the case .. I think we can use chinga for
'we' and an·ching for 'us'."

**Determination:** confirmed case-based split for this pronoun pair —
`Chinga` = subject ("we"), `An·ching` = object ("us"). This is
currently only confirmed for this one pair, not generalized to other
pronouns (I/me, he/him, etc.) — do not assume a systematic
subject/object distinction applies elsewhere in `pronoun_map.json`
without separate native confirmation for each pair.

**Repository components impacted:** `pronoun_map.json` — needs a
case-aware entry for "we" (subject) vs. "us" (object) instead of one
shared form. Tracked as part of `RC-CANDIDATE-023` (engineering,
narrow scope: this pair only).

---

## NV-024 — Negative-continuous suffix order (`ja` before `enga`)

**Status:** CLOSED — native-confirmed, 2026-07-20, Tier 2 (relayed via
Tridip). Raised by Claude B from live acceptance testing (same
proposal doc as NV-022/023).

**Native response (verbatim, confirming the corrected form):** "nga
mi·ko cha·jaenga." — followed by "Nice" (native approval).

**Determination:** for negative-continuous constructions, the negation
morpheme `ja` sits before the continuous suffix `enga` (`cha·ja·enga`,
not `cha·enga·ja` or other orderings). Confirmed for this one verb
(`cha`, "eat") in this one tense combination — not yet generalized to
other tense+negation combinations. `applyNegation`/`applyTense`
composition order should not be changed for other combinations without
a second confirmed data point.

**Repository components impacted:** tracked as part of
`RC-CANDIDATE-023` — narrow, verb-specific fix, not a blanket
composition-order change.

---

## NV-025 — Noun+Classifier-Number counting construction; `do·o` = "chicken," not "bird"/"two"/"dog" — resolves Claude B's `RC-CANDIDATE-022`

**Status:** CLOSED for the specific items confirmed below —
Project-Owner-relayed native data, 2026-07-20. This entry resolves the
open questions in `RC-CANDIDATE-022` (logged by Claude B, 2026-07-19,
across three investigation commits) — see that entry in
`docs/PENDING_REGRESSION_CASES.md` for the full prior diagnosis
(`pickPrimary()` order-driven collapse, the 41-key list of
similarly-shaped conflicts, the separate `analyzeGrammar` routing
split, and the 67-entry numbers-category risk audit). Not repeated
here. This entry adds native evidence on top of that engineering work
— it does not redo it.

**Confirmed data (Project Owner relay, 2026-07-20):**
```
achak mang-sa       → one dog
do·o mang-gni        → two chicken        (do·o = chicken, not "bird" or "two")
na·tok mang-gittam   → three fish
manderang sak-sa     → one person
skigipa sak-gni       → two teachers
ki·tap king-sa        → one book
kettal ge-gni         → two knives
```

**Determination:** the counting construction is **Noun +
Classifier-Number** — confirms Claude B's `RC-CANDIDATE-022` diagnosis
exactly (17-entry `do·o`-as-generic-"two"-prefix corruption; `do·o`'s
real meaning was unconfirmed at "bird" pending native check — now
confirmed as **"chicken,"** superseding that provisional "bird" gloss)
and independently confirms `na·tok`("three") = fish,
`Gittam`(standalone) = three — matching
`docs/PENDING_LINGUISTIC_PROPOSAL_20260719_number_system_table.md`'s
native table exactly. Four classifier roots now have at least one
directly-confirmed Noun+Classifier-Number example: `mang`
(animals/birds/fish), `sak` (people), `king` (books/flat objects),
`ge` (tools/general objects) — matching the `classifier` section
already present in `src/compiled_dict.json`.

**New discrepancy surfaced, not resolved — flagging rather than
guessing:** the confirmed example uses `manderang sak-sa` for "one
person," but `master_dictionary.json` (index 3433, tagged
`VERIFIED/HIGH` from an earlier session) has `mande sak·sa` instead —
`manderang` vs. `mande`. Both roots are independently attested
elsewhere in the dictionary (`manderang` appears in `"people say it's
good, is it good?": "Manderang aganna nama ine, namama?"`; `mande`
appears standalone as `"person": "man·de"`), so this isn't a
nonsense-vs-real-word case — could be singular/generic distinction,
could be one of them simply wrong in this construction. Needs a direct
native check before touching either the `mande sak·sa` `VERIFIED/HIGH`
entry or the older `sa mande·sa` duplicate. Neither was changed this
session.

**Action taken (2026-07-20, Claude A) — narrow, evidence-backed only.**
Per Project-Owner governance instruction this session (native
confirmation resolves conflicts; engineering evidence alone does not),
and per Claude B's own explicit caution in `RC-CANDIDATE-022` against
blanket-preferring `VERIFIED/HIGH` tags without individual review, only
5 of the 13 duplicate-key pairs initially reviewed were patched — the
ones with direct corroboration beyond the tag alone:
- `one dog` → `achak mang·sa`, `two dogs` → `achak mang·gni` — directly
  confirmed by the Project Owner data above, and independently flagged
  by Claude B's own 41-key `pickPrimary` audit.
- `three books` → `ki·tap king·gittam`, `ten birds` → `do·a
  mang·chiking` — not directly given by the Project Owner, but built
  entirely from separately-confirmed morphemes (`ki·tap`=book,
  `king`=book classifier, `gittam`=three, `chiking`=ten all confirmed
  elsewhere) rather than trusting the tag alone; both also appear in
  Claude B's 41-key list of similarly-mis-resolved conflicts.
- `"3"` → `gittam` (was `"soul"`, an unambiguous build artifact, also
  in Claude B's 41-key list).
Reverted 8 other entries (including `one person`, given the
`mande`/`manderang` discrepancy above) that were initially touched on
tag-preference alone with no corroborating evidence — consistent with
not blanket-applying the `VERIFIED/HIGH`-preference heuristic Claude B
already declined to script. `npm test` (77/77) and `node
repository-intelligence.js` (PASSED) both green after the narrowed
patch.

**Still open — do not extend without further native confirmation:**
Claude B's 41-key `pickPrimary` list and 67-entry numbers-category risk
audit (both in `RC-CANDIDATE-022`) cover ground well beyond this
entry's 5 patches — most of it still needs either a direct native
example or the same compositional-corroboration standard applied here,
not a blanket tag-preference sweep. The `mande`/`manderang` conflict
above is a new addition to that queue.

**Repository components impacted:** `master_dictionary.json` (5
entries patched this session, 8 reverted). `docs/GRAMMAR_RULE_CATALOGUE.md`
(candidate new rule for the Noun+Classifier-Number construction, not
yet added — pending Claude B sign-off since it touches sentence
assembly, not just vocabulary — also relevant to the `analyzeGrammar`
routing split Claude B found, where a working classifier engine exists
but full-sentence object extraction bypasses it).

---

## NV-026 — Direct relay confirmations: "ten," "first," "everyone," "someone" — resolves `skang`/`Chipprangni` conflict

**Status:** CLOSED — native-confirmed, 2026-07-21, Tier 2 (Tridip
asking Thangseng directly, WhatsApp, relayed verbatim by Project
Owner). Resolves the `"first"` conflict logged in
`docs/PENDING_LINGUISTIC_PROPOSAL_20260719_number_system_table.md`.

**Verbatim exchange:**
```
Tridip: what is Ten?
Thangseng: Chikking
Thangseng: The old spelling is chikkung
Tridip: first?
Thangseng: Skang
Thangseng: One is 'sa'
Tridip: everyone"="Sakanti
Tridip: someone"="Saksa
```

**Determination:**
- `"ten"` = `Chiking`/`Chikking` (spelling variant only — `chikkung`
  noted as an old/superseded spelling) — matches the existing
  `master_dictionary.json` entry (`"ten": "Chiking"`) exactly. No
  change needed. Also reconfirms `docs/DICTIONARY_ERROR_AUDIT_20260719.md`
  Audit B and `RC-CANDIDATE-022`: standalone "ten" is the `Chiking`
  family, not `chi` — the numbers-category entries using bare `chi` as
  a "ten"-prefix remain confirmed wrong (already tracked, not
  re-opening here).
- `"first"` = `Skang` — **resolves** the two-candidate conflict from
  the number-system-table proposal in favor of the value already in
  `master_dictionary.json` (`"first": "skang"`). `Chipprangni` is
  rejected as the answer for "first" (it remains valid for "second"/
  "third" ordinals — see new vocabulary below). No dictionary change
  needed; conflict closed.
- `"one"` = `Sa` — reconfirms existing entry, no change.
- `"everyone"` = `Sakanti`, `"someone"` = `Saksa` — both reconfirm
  existing `master_dictionary.json` entries exactly, no change.

**New vocabulary (from the same number-system-table proposal, now
that "first" is no longer an open conflict blocking it):** already
present in `master_dictionary.json` — `"second (ordinal)":
"Gni·prangni"`, `"third (ordinal)": "Gittam·prangni"`, `"zero / none":
"Bangbang / Ong·ja"` (dual value retained as-is, both attested, no
basis yet to pick one canonical form). No addition needed this
session; confirming they match the relayed values.

**Not yet resolved — flagging, not guessing:** the same relay includes
"someone"="Saksa" followed by a bare "Saoba" with no attached English
gloss in the transcript as relayed — unclear if this is a typo, a
continuation of the "someone" answer (e.g. an alternate/related form),
or the start of an unrelated answer. Not added to the dictionary.
Tridip's request ("give me the classifier definitions once again for
all categories") — directly relevant to `RULE-038` — is still
unanswered in this transcript; the full classifier-root inventory
remains incomplete pending that reply.

**Repository components impacted:** `master_dictionary.json` — no
changes needed (all reconfirmed values already correct).
`docs/PENDING_LINGUISTIC_PROPOSAL_20260719_number_system_table.md`
conflict resolved, can be marked implemented.
`docs/GRAMMAR_RULE_CATALOGUE.md` RULE-038 updated to note the pending
classifier-definitions request.

---

## NV-027 — "angry" register cluster: which of 6 candidates are real distinct-register synonyms vs. OCR noise

**Status:** OPEN. Raised in Claude A review of
`docs/PENDING_LINGUISTIC_PROPOSAL_20260722_thangseng_batch.md` item 1.

**Native response (verbatim):** "Yes, ka·o·nang·a is a general purpose
word for angry."

**Determination:** `ka·o·nang·a` confirmed as the general-purpose
production value — no change needed there. Thangseng was not asked
about, and did not individually confirm or reject, the other five
"angry" candidates already in `known_dictionary_conflicts.json`
(`Ka-a chakna amja`, `Ka-a soa`, `bi·ka so·a`, `hel·hel`, `Ka-chaa`).
**Open:** are these legitimate distinct-register synonyms (mild vs.
intense anger, formal vs. colloquial) or OCR/transcription noise that
should be pruned from the allowlist? Needs a follow-up native question
listing all six explicitly.

**Repository components impacted:** none yet — `known_dictionary_conflicts.json`
allowlist entries unchanged pending this follow-up.

---

## NV-028 — "quarrel": new candidate `jegrika` needs orthography confirmation; existing `Kajia` entries unexplained; `bot·a` corrected

**Status:** PARTIALLY RESOLVED. Raised in
`docs/PENDING_LINGUISTIC_PROPOSAL_20260722_thangseng_batch.md` item 3.

**Native response (verbatim):** "Quarrel is jegrika. Bota does not
necessarily mean quarrel. It carries the meaning of to incite or
provoke. I'm coming across the word niria for the first time. I don't
know about that one."

**Determination:**
- `bot·a` = "to incite/provoke," **not** quarrel — confirmed wrong as a
  quarrel-gloss. Corrected in `master_dictionary.json` (see below).
- `ni·ri·a` — unrecognized by Thangseng. Left as-is
  (`UNVERIFIED/HIGH`), not deleted — absence of recognition isn't
  the same as rejection; could be regional/dialectal. Do not promote
  or generalize from this entry until independently confirmed.
- `jegrika` — new primary candidate for "quarrel," but Thangseng's
  answer came with no raka marks or syllable-boundary indication.
  Per this project's own raka discipline (never guess placement), this
  is **not** being added to `master_dictionary.json` yet. Needs a
  direct follow-up asking for the exact written form.
- **New discrepancy surfaced, not resolved:** `master_dictionary.json`
  already contains `"Quarrel"`/`"dispute"` → `Kajia` (indices 8335–8337,
  from the same Bakwe/Kaj- dictionary source as the `Kajina`/`Kajana`
  duty confusion in NV item 6 below) — Thangseng's answer didn't
  mention `Kajia` at all. Unclear whether `Kajia` is wrong, a synonym,
  or a different register. Given `Kajina`/`Kajana`/`Ka·jana` already
  turned out to be three unrelated words colliding by orthographic
  coincidence, `Kajia` sitting in the same word-family cluster is worth
  specific follow-up rather than assuming it's fine by default.

**Repository components impacted:** `master_dictionary.json` index 5730
(`english: "quarrel"`, `garo: "bot·a"`) corrected to `english: "incite"`
— see commit. Index 5731 (`ni·ri·a`) and the `Kajia` cluster (8335–8337)
left untouched pending follow-up.

---

## NV-029 — "tied"/"bound": converb+auxiliary construction confirmed; generalization beyond "tie" untested

**Status:** OPEN (grammar rule provisionally added as RULE-039, marked
Needs Native Validation for generalization).

**Native response (verbatim):** "To tie is ka·a. There is no raka. The
reason some things seem missing is probably because it is missing. The
Garo grammar simply does not have them. Instead Garo grammar takes the
help of additional words to make sense of it. The dog is tied. =
Achakko kae donenga. Or Achak kae donako man·enga."

**Determination:** Garo has no single-word stative/passive participle
for "tied" — the meaning is built periphrastically via a converb
(`ka·e`, "having tied") + auxiliary (`don·enga`/`man·enga`). This is a
genuine grammar gap, not a missing lexicon entry — see RULE-039 below
for the formalized pattern. **Not yet confirmed to generalize** beyond
"tie": needs 2–3 more examples with different verbs (e.g. "is hung,"
"is hidden," "is broken") before Claude B implements a general
converb+auxiliary rule rather than a one-off `"tied"` translation.

**Repository components impacted:** `docs/GRAMMAR_RULE_CATALOGUE.md`
RULE-039 (new, provisional). No engine changes yet — Claude B should
not implement general passive/stative construction from this single
verb alone.

---

## NV-030 — `ong·ja` vs. `dongja` negative-existential: free variation or contextual?

**Status:** OPEN. Surfaced as a loose end in the same answer that
resolved RC-CANDIDATE-017 (see NV-032 below) — Thangseng gave both
forms for the same sentence ("The book is not on the table") without
marking either as preferred.

**Native response (verbatim, full sentence):** "Ki·tap tableo ong·ja/
dongja."

**Determination:** not resolved by this data point alone. Could be
free variation (either acceptable, no meaning difference), a
register/dialect difference, or a syntactic conditioning environment
neither form's usage has been tested against yet. Do not treat as
interchangeable in engine logic until confirmed either way.

**Repository components impacted:** none yet — flagging only.

---

## NV-031 — Interrogative `-ma`: second data point, still future-tense only

**Status:** OPEN, feeds `RC-CANDIDATE-020`/`RC-CANDIDATE-021`.

**Native response (verbatim):** "The interrogative ma is always with
the the verb. It is placed at the very last. Example: cha·genma? =
Will (you) eat?; Cha·jawama? = Will (you) not eat?"

**Determination:** confirms `-ma` is always verb-final (consistent
with the single prior data point in
`docs/PENDING_LINGUISTIC_PROPOSAL_20260717_future_interrogative.md`),
and gives the first confirmed **negative**-future-interrogative form,
stacking `jawa` (negative future) + `ma` (interrogative):
`cha·jawama?`. Present-tense, past-tense, and object-present
interrogative forms remain entirely unconfirmed — `RC-CANDIDATE-021`
stays open; do not generalize `-ma` placement to non-future tenses from
this data.

**Repository components impacted:** none yet — insufficient data to
implement.

---

## NV-032 — Negation + locative predicates do not conflict — resolves `RC-CANDIDATE-017`

**Status:** CLOSED — native-confirmed, 2026-07-22 (relayed via Project
Owner → Thangseng).

**Native response (verbatim):** "Yes, negation does survive with a
locative predicate because the locative suffix is used with the noun,
whereas the negative is used with the verb. Example. The book is not
on the table. = Ki·tap tableo ong·ja/ dongja. Note the the locative o
is with the noun table (tableo). The negative ja is with the verb
(ong·ja/dongja)."

**Determination:** locative marker `·o` and negative marker `ja`
attach to different hosts (noun vs. verb respectively) and never
compete for the same slot. `RC-CANDIDATE-017`'s suspected negation-loss
bug is not a grammar-rule gap — if the engine loses negation on
locative-predicate sentences, it's an implementation bug in how the two
suffixes compose, not a missing linguistic rule. See NV-030 above for
the still-open `ong·ja`/`dongja` variant question this same answer
raised.

**Repository components impacted:** `RC-CANDIDATE-017` in
`docs/PENDING_REGRESSION_CASES.md` — closed with this determination,
handed to Claude B to verify against actual engine output.

---

## NV-033 — "hot" = `ding·a` confirmed via natural sentence; `Kama` confirmed wrong; `Da·al` orthography reconfirmed; two candidates remain open

**Status:** MOSTLY RESOLVED, updated 2026-07-23 with a direct
follow-up. Native response direct Thangseng confirmation, relayed via
Project Owner.

**Native response (verbatim, WhatsApp relay):**
Tridip: "it's very hot today?"
Thangseng: "Da·alde indakpile (very) ding·enga."

**Determination:**
- `ding·a` (existing `UNVERIFIED/HIGH` entry, `master_dictionary.json`
  #4992) is **confirmed** — the inflected present/continuous form
  `ding·enga` appears in unprompted natural discourse for "is hot,"
  matching the `-enga` continuous-suffix pattern already seen
  elsewhere (`ka·o·nang·a`-type stative verbs, `RULE-039`'s
  `don·enga`). Citation form `ding·a` stays as-is, per Project Owner
  instruction — no dictionary edit needed, it was already the entry.
- `gek·gek` and `jro·a` (the other two `UNVERIFIED/HIGH` "hot"
  candidates, #4993/#4994) — **not confirmed, not rejected.** This
  answer didn't address them. Leave as-is pending direct follow-up;
  do not assume they're wrong just because `ding·a` got independent
  confirmation first.
- **`Kama` (v., "hot," promoted from page 115 via `PL-0001409`,
  never native-validated, only OCR-flagged) is now suspect.** Natural
  usage reached for `ding·enga`, not any `Kama`-based form, for the
  exact same meaning. `Kama` also resembles the Sanskrit/Hindi loanword
  "kāma" (desire), which raises a real possibility this promoted entry
  is either a mistranscription, a different-but-similarly-spelled
  headword, or an OCR/homonym collision — the same failure pattern as
  `Kajina`/`Kajana` (NV-032 handoff) and `Kajia` (NV-028). **Not
  removed from `master_dictionary.json` on this evidence alone** — the
  absence of a form in one natural sentence isn't the same as a direct
  rejection — but flagging for a dedicated follow-up: ask Thangseng
  directly whether `Kama` means "hot" at all.
- **New, unconfirmed:** `Da·alde` — likely `Da·al`/`Da·alo` ("today,"
  existing `VERIFIED/HIGH` entries #3674/#3675) + a `-de` particle not
  yet documented anywhere in `GRAMMAR_RULE_CATALOGUE.md`. Plausibly a
  topic/contrastive marker ("as for today...") rather than a separate
  word. **Not added as a new headword or rule** — one data point,
  could just as easily be conditioning specific to this sentence.
  Needs a dedicated question, not silent inference.
- **New, unconfirmed:** `indakpile`, glossed "(very)" — completely
  unrelated in form to all 5 existing "very" candidates already in
  `master_dictionary.json` (`Be·en`, `Bakkan`, `bang·e`, `·be·`,
  `·mi·si·`, `be·si`). **Not added** — unclear whether this is a
  general-purpose intensifier or an idiom specific to weather/heat
  expressions ("scorching," effectively). Needs a direct question
  before it's treated as a 6th synonym for "very."

**Repository components impacted:** none yet beyond this record.
`ding·a` unchanged (correctly — it needed no change).
`known_dictionary_conflicts.json`'s existing `"hot"` allowlist entry
unchanged; `Kama` not removed from production, just flagged.

---

### Follow-up, 2026-07-23 — Kama confirmed wrong for "hot"; Da·al orthography reconfirmed; new corroborating sentence for RULE-041

**Native response (verbatim, WhatsApp relay):**
Tridip (testing a translation): "Chinga da·alo kam ka·gen" [= "we
will work today"]
Thangseng: "and today is da.l right?"
[Claude A, via Project Owner]: confirmed — Da·al, raka in the middle.
Thangseng: "and also Kama?"
Thangseng: "kama = to burn; ka'ma = below"

**Determination:**
- **`Kama` (no raka) = "to burn." Confirmed NOT "hot."** This closes
  the suspicion raised above — the production `master_dictionary.json`
  entry `{"english": "hot", "garo": "Kama"}` (#8484, originally
  promoted via `PL-0001409`, page 115) has been **removed** as a
  duplicate-wrong-sense: the correct "to burn" sense for `Kama` was
  already independently present in production (`"To burn"` → `Kama`).
  "Hot" stays exclusively `ding·a`, per the top of this entry.
  `PL-0001409`'s `promotion_status` changed from `promoted` to
  `rejected` to reflect this — `repository-intelligence.js` Check D
  has no "retracted" state, `rejected` is the closest accurate fit;
  full explanation in its `review_notes`.
- **`Ka·ma` (raka present) = "below."** This independently confirms
  the *existing* `"down"` → `Ka·ma` entry already in production
  (unrelated to today's correction) — same word, adjacent sense
  (below/down), correctly distinguished from raka-less `Kama` by the
  print dictionary already. No change needed there.
- **Not yet resolved:** `master_dictionary.json` still has `Kama`
  (no raka) glossed as `"Warm"` (adj., #8532, same page-115 batch as
  the removed "hot" entry). This wasn't directly addressed by either
  answer — could be a legitimate extended sense of "to burn" (cf.
  English "it's a scorcher"), or the same over-broad-gloss problem.
  Left untouched pending a direct question.
- **`Da·al` orthography reconfirmed**: raka in the middle, matching
  the existing `VERIFIED/HIGH` entries (#3674/#3675). No change
  needed. This also resolves the standing question from this NV's
  first entry about `Da·alde` (from the "hot" sentence) — almost
  certainly `Da·al` + an unlogged `-de` particle, not a separate root.
  The particle itself is still not documented in
  `docs/GRAMMAR_RULE_CATALOGUE.md` — needs its own question before
  formalizing as a rule.
- **New corroborating sentence for `RULE-039`/`RULE-041`:**
  `Chinga da·alo kam ka·gen` = "we will work today." `kam ka·gen`
  ("work" noun + future-tense verb) is a live, natural confirmation of
  `RULE-041`'s `Kam ka·a` compound verb, here inflected with the
  future suffix `-gen` (same pattern already confirmed elsewhere,
  e.g. `cha·gen` "will eat"). Strengthens `RULE-041`'s confidence —
  not just an elicited example, but spontaneous natural usage.
  `da·alo` (locative-marked "today," "on today"/"today, [we will]")
  also matches the existing `VERIFIED/HIGH` `Da·alo` entry exactly.

**Repository components impacted:** `master_dictionary.json` — #8484
removed. `src/data/pending_lexicon.json` `PL-0001409` — `promotion_status`
→ `rejected`, `review_notes` updated. `RULE-041` in
`docs/GRAMMAR_RULE_CATALOGUE.md` gains a corroborating natural-sentence
example (see that file). `tests`/`repository-intelligence.js` clean
after the correction (104/104 tests, Check D 0 problems).

---

## Closed Questions
- **NV-006** (`·ko`/`·o` selection) — closed 2026-07-12, effectively
  resolved as engineering work, not a native question. See NV-006 above
  for disposition; tracked as `RC-CANDIDATE-002`/`011` going forward.
- **NV-015** (`senga` vs. `Da·mo` for "wait") — closed 2026-07-12,
  fully resolved by direct native confirmation. See full entry above.
  Live engine bug now tracked separately as engineering work (see
  `docs/PENDING_REGRESSION_CASES.md`).
- **NV-013** (sing/dance purposive forms) — closed 2026-07-14, both
  confirmed by direct native evidence (`ring·na`, `chrokna`). See full
  entry above. `RC-CANDIDATE-007` updated with the confirmed values.
