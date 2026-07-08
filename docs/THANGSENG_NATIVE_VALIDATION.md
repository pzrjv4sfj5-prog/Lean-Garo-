# Thangseng Native Validation — Canonical Open Question Repository
_Created 2026-07-08 by Claude A. Permanent document — do not create
per-question `PENDING_NATIVE_QUESTIONS_*` files; add new questions here
and update in place as answers arrive._

## Minimal question set (for relay — smallest possible set)
If only a short list can be relayed to Thangseng at once, these two are
the highest-value, most self-contained asks. Everything else in this
document either depends on these two, is lower priority, or (NV-006) may
not need Thangseng at all.

1. **(NV-001, Rule 30)** Does "go" change form depending on whether a
   destination is mentioned? Test pairs: "I am not going" vs. "I am not
   going to the market"; "he did not go" vs. "he did not go to the
   market."
2. **(NV-002, Rule 31)** After "happy"/"good"/"tired" as a predicate, is
   `ong·a` required, optional, or specific to certain persons (I/you/
   he-she)? How does it relate to `daka`?

NV-003/004 (locative set) and NV-005/007/008 (necessity-modal, posture
verb, ability-modal) are real but lower-priority — bundle them into a
second relay only after NV-001/002 land, to avoid overloading a single
native-validation session. NV-006 and NV-009 do not need to be asked at
all yet (see their entries below).

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

**Existing Grammar Rules:** No numbered rule yet — tracked as an open
item referenced by RULE-033's dependency list and `WORKSTATE.yaml`. Not
yet formally in `GRAMMAR_RULE_CATALOGUE.md` as its own entry.

**Existing Morphology:** `re·` treated as the bare root; `re·ang` as an
extended/directional form of the same root (not yet confirmed whether
`-ang` is a productive suffix elsewhere or specific to this verb).

**Candidate Hypotheses:**
1. Bare `re·` = intransitive/destinationless "go"; `re·ang` = directional
   "go to X", required whenever a destination is present or implied.
2. Free variants — either is acceptable regardless of context, and the
   apparent pattern in the data is coincidental (all destination-bearing
   examples happened to use `re·ang` in the data collected so far).
3. Register or aspectual distinction unrelated to destination-presence
   (e.g. formality, immediacy) that happens to correlate with the
   destination pattern seen so far.

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

**Status:** OPEN — Needs Additional Evidence (engineering-first, not
native-validation-first; Claude B should investigate before this
escalates to a Thangseng question).

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

---

## Closed Questions
_(none yet — this document was created 2026-07-08)_
