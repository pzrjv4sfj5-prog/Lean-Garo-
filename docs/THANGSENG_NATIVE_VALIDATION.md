# Thangseng Native Validation — Canonical Open Question Repository
_Created 2026-07-08 by Claude A. Permanent document — do not create
per-question `PENDING_NATIVE_QUESTIONS_*` files; add new questions here
and update in place as answers arrive._

**Convention note (added 2026-07-29, per
`docs/AUDIT_NATIVE_VALIDATION_PROPAGATION_20260729.md`):** a `CLOSED`
tag in a section **header** means the investigation/relay round for
that item is closed — not necessarily that the linguistic content is
fully confirmed or propagated to production. The authoritative status
is always the **`Status:` line inside the record**, not the header.
Where a record's own `Status:` line still says `OPEN`, treat it as
open regardless of the header (see NV-031, NV-038 for examples this
applies to).

**For relaying to Thangseng:** see
`docs/THANGSENG_QUESTION_BATCH_20260725.md` — the current
consolidated, ready-to-send question set covering every open item
below. Update that file (don't create a new one) each time it's
re-sent or a round of answers comes back.

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

## NV-003 — RULE-034 locative/directional set: direct confirmation — CLOSED 2026-07-25

**CLOSED 2026-07-25.** All 9 remaining locative sentences confirmed
directly: below=`ka'mao`, inside=`ning'ao`, outside=`a'palo`,
above=`kosako`, behind=`janggilo` (alt. `paksao`, "other side" -
preferred, better captures "behind a door" specifically),
beside=`sambao`, up on the roof=`kosako` (same word as "above" - roof
uses the general "above" locative, not a distinct word), "let's go
over the bridge"=`Hai dollongni nalsachi re'na`, "the boat is going
across the river"=`Ring chibimani nalsachi re'angenga`. Full sentences:
`Ki'tap tableni ka'mao ong'a` ("the book is below the table"), `Ki'tap
bakosni ning'ao ong'a` (inside the box), `Ki'tap nokni a'palo ong'a`
(outside the house), `Ki'tap shelfni kosako ong'a` (above the shelf),
`Ki'tap cholgugani janggilo ong'a` (behind the door), `Ki'tap kelkini
sambao ong'a` (beside the window), `Ki'tap nokkingni kosako ong'a` (up
on the roof).


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

## NV-004 — RULE-035 "under" vs. "beneath" (`mitapo`) sense split — CLOSED 2026-07-25

**CLOSED 2026-07-25.** Three distinct "under" words confirmed, not
two: `ning'ao` (literally "inside" - the general-purpose, most accurate
choice), `mitapo` (accepted alternate specifically for "under a
blanket/covering"), `nokkimao` (the word already used for "under the
table" - captures "covered under something" more precisely than
`ning'ao` in that specific context, per direct explanation). "The book
is under the blanket" = `Ki'tap kombolni ning'ao ong'a` (or `mitapo`).
"The dog is under the table" = `Achak tableni nokkimao ong'a`
(unchanged, already correct). "The rock is under the water" = `Ro'ong
chini ning'ao ong'a` — `nokkimao` explicitly NOT preferred here;
`ning'ao` given as the more accurate general-purpose word, with
`nokkimao` reserved for the more specific "covered under" sense (like
the table case).


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

## NV-005 — Necessity-modal negation (`nangja`) vs. simple desire-negation — CLOSED 2026-07-25

**CLOSED 2026-07-25.** Confirmed directly: `ska` = want, `sikja` =
don't want; `nanga` = need, `nangja` = don't need — cleanly distinct
pairs, no overlap. "I don't want to watch TV" = `Anga(de) TV nina
sikja`. "I don't need to watch TV" = `Angade TV nina nangja`.


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

## NV-007 — Posture verb `tue` ("lying") — malformed output, missing coverage — CLOSED 2026-07-25

**CLOSED 2026-07-25.** Full paradigm confirmed: "I am lying down" =
`Anga tue dongenga`. "I am lying in bed" = `Anga palango tue dongenga`.
"I was lying down" (past) = `Anga tue dongengachim`. "I am not lying
down" (negative) = `Anga tue dongjaenga`.


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

## NV-008 — Ability modal `man·ienga` ("can/able") — entirely dropped — CLOSED 2026-07-25

**CLOSED 2026-07-25.** `ama` confirmed as "can/able": "I can eat" =
`Anga cha'na ama`. "I can go" = `Anga re'angna ama`. "I can work" =
`Anga kam ka'na ama`. Homonymy risk directly confirmed and resolved:
"Yes, `ama` also means can. `ama`=mother and `ama`=can are two
different words with the same spelling, but they are pronounced
differently" — same pattern as `senga`(wait)/`senga`(smell), a true
homonym pair, not a single polysemous word.


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

## NV-009 — `TV` / `status` loanword coverage — CLOSED 2026-07-25

**CLOSED 2026-07-25.** Nuanced answer, not simple loanword adoption:
TV has a native Garo word, `bairong`, but "its use has been forgotten
today" (functionally obsolete, English "TV" used in practice). No
Garo word exists for "status" at all. Phone has a native word,
`ku'bilbat`, also not in current use. No Garo word exists for
"internet."


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

## NV-010 — Raka-Inconsistency Cluster in `-na` Infinitive Forms — CLOSED 2026-07-25

**CLOSED 2026-07-25.** Confirmed no raka inconsistency: "want to
speak" = `Aganna ska`, "want to study" = `poraina ska` — "There is no
raka because the verbs in their original form do not have raka."
Directly asked whether a separate raka-marked pair exists (e.g.
`agan·`/`tus·` vs. `agan`/`tusi`): "Not that I can recall" — the
originally-observed raka inconsistency in the corpus is very likely a
transcription/OCR artifact, not a real grammatical pattern.

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

## NV-011 — `nina` vs. `Nia`/`nika`: same root or different form? — CLOSED 2026-07-25

**CLOSED 2026-07-25.** "Watch" and "see" confirmed as genuinely
different words, not the same root with different endings: `Nia`
("watch" root, e.g. `nina`=infinitive, `nienga`="I am watching") vs.
`Nika` ("see" root, e.g. `Anga uko nika`="I see it"). Not the same
root.


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

## NV-012 — `nisona` vs. `nina`: selection rule between two "watch"-adjacent verbs — CLOSED 2026-07-25

**CLOSED 2026-07-25.** Confirmed NOT substitutable: "No, `nisona`
cannot be substituted for `nina`. `Nisona` can also be used to mean to
wait. It carries the idea of looking or waiting with expectation." —
a third "wait"-adjacent word, distinct register/nuance from
`senga`/`Sengbo`/`Da·mo`, worth noting but not conflating. "I am
watching TV" = `Anga TV nienga` (uses the `Nia`/watch root, not
`nisona`).


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

## NV-015 — `senga`("wait") vs. `Da·mo`("wait," fixed expression) — CLOSED 2026-07-25 (third and final correction, full detail below)

**FINAL CORRECTION, 2026-07-25 (Claude A, full native-validation
document response — supersedes the same-day terse retraction below).**
Direct, detailed, reasoned answer received: **`senga` = "to wait" and
`senga` = "smell" are two different words, same spelling, same
pronunciation — true homonyms** (not exclusively "smelly" as the
terse mid-day correction stated). Explicit, unambiguous: *"Ua sengbo
is an incorrect translation of 'he waits'."* Declarative "he waits" =
**`Ua senga`** or **`Ua sengaia`** (the latter offered with "I think,"
so treated as a possible variant, not promoted to the primary
dictionary value). `Sengbo`/`Da·mo` confirmed imperative-only, with a
clean general rule given directly: *"'bo' suffix is always imperative,
unless there is another suffix after it"* — cross-confirmed
independently via the `ska`/`sika` paradigm in the same response
(`sikbo` = imperative "want," `sikgen`/`sikja` = non-imperative forms
built on the same root without a bare `-bo`).
`master_dictionary.json`'s `"wait"`/`"to wait"` corrected back to
`senga` (from `Sengbo`, which was itself a correction of the original
`senga` — three stages, all documented below, nothing deleted).

**Second stage, 2026-07-25 (retracted above) — retained for history:**
**RETRACTION (Claude A, direct native correction via
Project Owner):** the 2026-07-12 transcript below was misread. Direct,
unambiguous new correction received: **"senga is not wait, it's
Sengbo or Damo"**; **"senga is the translation of smelly into Garo"**
— `senga` only means smelly, it is not a wait/smelly homonym. The
original transcript's phrasing ("Senga can mean to wait and it can
also mean foul smell") is now understood to have been transcribed or
read incorrectly — the intended root for "wait" was `sengbo`/`Sengbo`
(`senga` + `-bo` imperative suffix, RULE-029), not bare `senga`.
`master_dictionary.json`'s `"wait"`/`"to wait"` headwords corrected
back from `senga` to `Sengbo` (2026-07-25). **Not resolved:** the
transcript's `"Anga senggen"` = "I will wait" claim is now uncertain —
kept on record below for history, not deleted, but should not be
trusted or acted on until re-verified directly with Thangseng. Add to
next relay batch: confirm whether `senggen` is a valid inflected form
of `sengbo`/a shared `seng-` stem, or was itself part of the original
misreading.

**Original entry, retained for history — do not treat as current:**

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

## NV-016 — `nanga`("need") vs. `nangja`("need not"); `ska` vs. `sikeng` ("want") — CLOSED 2026-07-25

**CLOSED 2026-07-25.** Confirmed: "`Nangja` comes from `nanga`. It's
the same word with negative suffix" — not a separate lexeme. Full
`ska`("want")/`sika`("push, insert") paradigm given, confirming they
are different words with `ska` following an irregular pattern modeled
on `sika`'s regular one: `ska`=want, `sikja`=doesn't want,
`sikbo`=want(imperative), `siknabe`=do not want(imperative,
negative), `sikgen`=will want, `sikjawa`=will not want. Parallel:
`sika`=push/insert, `sikja`=does not push, `sikbo`=push(imperative),
`sikjawa`=will not push, `sikgen`=will push. Also confirms the general
rule (stated directly in the same response, re: `senga`/`Sengbo`):
`-bo` is always imperative unless another suffix follows it
(`sikbo`=imperative "want," contrasted with `sikgen`/`sikja` built on
the same root without a bare `-bo`).

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

## NV-027 — "angry" register cluster: which of 6 candidates are real distinct-register synonyms vs. OCR noise — PARTIALLY CLOSED 2026-07-25

**UPDATE 2026-07-25:** direct native glosses received for all 5
non-`ka·o·nang·a` candidates. Three refine (not contradict) the
existing dictionary entries: `ka'a chakna amja` = "cannot bear or
tolerate" (existing gloss "not to be able to restrain anger" —
consistent, confirmed). `ka'a soa` = "irritated" (given with an
explicit "I think" hedge — milder register than the existing
angry/rage/furious gloss suggests; existing entry not contradicted,
but treat "irritated" as the more precise register note). `ka'chaa` —
**meaningful correction**, not just refinement: native gloss is "to
berate, to scold" (an action verb, transitive), notably different in
character from the existing dictionary gloss's primary framing ("to be
cross/to be angry/to get angry with/to be annoyed or vexed," which
centers a state/feeling sense) — worth updating the dictionary entry's
primary sense to lead with "to berate/to scold." The other two
remain **genuinely unconfirmed**, explicitly: `bika so'a` — "cannot be
confirmed right now." `hel'hel` — "cannot be confirmed right now."
Not resolved by omission or inference; still open, needs another ask
when possible.

**Status:** OPEN, narrowed 2026-07-25 (Claude A, corpus-internal
review — see below). Raised in Claude A review of
`docs/PENDING_LINGUISTIC_PROPOSAL_20260722_thangseng_batch.md` item 1.

**Native response (verbatim):** "Yes, ka·o·nang·a is a general purpose
word for angry."

**Determination:** `ka·o·nang·a` confirmed as the general-purpose
production value — no change needed there. Thangseng was not asked
about, and did not individually confirm or reject, the other five
"angry" candidates already in `known_dictionary_conflicts.json`.

**Corpus-internal triage, 2026-07-25:** re-examined all five directly
in `master_dictionary.json`. Three are richly attested and NOT marked
`UNVERIFIED` in the data itself — real print-dictionary headwords, not
OCR noise:
- `Ka-a soa` — 4 coherent senses (Angry/rage/infurate[sic,
  preserved typo for infuriate]/furious), all `adj.`, single source
  entry with a faithfully-preserved OCR typo — a strong signal of a
  real, clean scan, not garbled noise.
- `Ka-chaa` — 4 coherent verbal senses (to be cross/to be angry/to get
  angry with/to be annoyed or vexed), all `v.`, no OCR flags at all.
- `Ka-a chakna amja` — 2 senses ("not to be able to restrain anger"
  v., "Angry" adj.), OCR-confidence High. Morphologically plausible as
  a compositional phrase (shares the `Ka-a` root with the two entries
  above; the adjectival sense is a natural extension of "unable to
  restrain anger").

Two remain genuinely thin, still marked `UNVERIFIED/HIGH` in the data,
and are the only two that still need a native answer on whether they're
real:
- `bi·ka so·a` — single entry, cross-references `hel·hel` and
  `ka·o·nang·a` in its own notes.
- `hel·hel` — single entry, reduplicated form. Plausible as a real
  ideophone/intensifier (reduplication for intensity is a common
  pattern), but no corroborating internal evidence either way.

**What this does and doesn't resolve:** corpus evidence establishes
the first three are real, attested words, not transcription noise —
that half of the original question is settled without needing
Thangseng. It does NOT establish register (which is more
intense/formal/colloquial than `ka·o·nang·a`) — that nuance genuinely
needs a native speaker regardless. The follow-up ask (see
`docs/THANGSENG_QUESTION_BATCH_20260725.md` §L) is narrowed to just
`bi·ka so·a` and `hel·hel` for the existence question, plus register
framing for all five if/when Thangseng has time.

**Repository components impacted:** `known_dictionary_conflicts.json`
allowlist unchanged — no entries pruned, since corpus evidence
supports keeping all five pending register confirmation.

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

## NV-029 — "tied"/"bound": converb+auxiliary construction confirmed; generalization beyond "tie" untested — CLOSED 2026-07-25

**CLOSED 2026-07-25 — pattern does NOT generalize.** Tested against 3
other past-participle-adjective English constructions; each uses its
own distinct construction, not the tie-pattern (`X kae dongenga`):
"the picture is hung [on the wall]" = `Noksako pakmao sitea`. "the key
is hidden" = `Chabiko donnuaha` (an alternate literal form,
`Chabi donnugimin ong'a`, was also given but explicitly NOT
recommended: "don't go with this one"). "the cup is broken" =
`Cup be'aha` (note: "Cup" used as an English loanword as-is). Clear,
definitive negative answer — the converb+auxiliary pattern is specific
to "tied," not a general past-participle-adjective strategy.


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

## NV-030 — `ong·ja` vs. `dongja` negative-existential: free variation or contextual? — CLOSED 2026-07-25

**CLOSED 2026-07-25 — NOT free variation, real grammatical
distinction.** Confirmed: "`Ong'ja` = is not; `Dongja` = is not
(present). `Ong'ja` speaks about being. `Dongja` speaks about
presence." This is a genuine identity-negation vs.
existence/presence-negation split, not stylistic/contextual free
choice as originally hypothesized — a real structural finding, not
just a lexical confirmation. Worth a grammar-rule-catalogue entry if
one doesn't already cover this distinction; flagged for Claude A
follow-up, not created in this pass.


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

## NV-031 — Interrogative `-ma`: second data point, still future-tense only — investigation round CLOSED 2026-07-25, linguistic item OPEN

**Investigation round CLOSED 2026-07-25** (this data point resolved,
matching the header — see doc-top convention note). `-ma` confirmed
productive across tenses, not future-only, with a real nuance on past
tense specifically. "Did you
eat?" = `Na'a cha'ama?` OR `Na'a cha'ahama?` — both valid, context-
dependent: simple past ("did you eat yesterday") uses plain `-ma`;
recent-relevant/perfect sense ("did you eat the cake I was saving," or
"have you eaten?") uses `-ha` + `-ma` = `-hama`. "Are you eating?" =
`Na'a cha'engama?` (`-ma` after continuous `-enga`). "Do you want the
book?" = `Na'a ki'tapko nangnikama?` (introduces another "want" word,
`nangnika`, alongside already-confirmed `ska`/`sikeng` — register or
distribution not yet investigated, not urgent).


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

## NV-033 — "hot" = `ding·a`; `Kama` = "to burn," NOT "hot"; `Ka·ma` = "below" — CLOSED

**Status:** CLOSED — native-confirmed, 2026-07-23. (Remaining loose
threads from this exchange spun out to NV-034, NV-035, NV-036 below,
so this record can close cleanly rather than staying open-ended.)

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

## NV-034 — "hot": `gek·gek` and `jro·a` still unconfirmed — CLOSED 2026-07-25

**CLOSED 2026-07-25.** `gek·gek` rejected outright: "Nope" — not a
real word for hot, should not be added. `jro·a` confirmed real but
with a corrected meaning and a raka correction: written **without**
raka (`jroa`, not `jro·a`), and refers to "the sensation, not the heat
itself" — e.g. `Ku'sik jroenga` = "the mouth is burning" (from chili).
Also: `jroa` is a homonym with a completely unrelated word meaning "to
swim." Dictionary action needed: remove raka mark if `jro·a` exists as
a headword, correct gloss to "burning sensation" (not "hot" itself),
note the swim-homonym.


**Status:** OPEN. Spun out of NV-033 so that record could close
cleanly — `ding·a` is settled, these two are not.

The other two `UNVERIFIED/HIGH` "hot" candidates in
`master_dictionary.json` (#4993 `gek·gek`, #4994 `jro·a`) were never
addressed by either the original "hot" answer or the `Kama` follow-up.
Not confirmed, not rejected — needs a direct question rather than
inference from `ding·a`'s confirmation.

---

## NV-035 — `Kama` (no raka) glossed "Warm" — CLOSED

**Status:** CLOSED, 2026-07-23 (Project Owner). `Kama`="Warm" confirmed
as a genuine related sense of `Kama`="to burn" — the same semantic
extension English makes ("it's a scorcher," "warming/burning"), not
the over-broad-gloss error the removed "hot" entry turned out to be.
No dictionary change needed — the entry was already correct as-is.

---

## NV-036 — `Da·alde` = `Da·al` + `-de` suffix; `indakpile` ("very") — CLOSED

**Status:** CLOSED, 2026-07-23.
- `Da·alde` = `Da·al` ("today") + `-de`, a temporal suffix meaning
  roughly "at that time," usable across past/present/future — direct
  Thangseng confirmation, now formalized as `RULE-042`. Not a
  topic/contrastive particle as originally guessed.
- `indakpile` ("very") confirmed by Project Owner and added to
  `master_dictionary.json` as a 6th "very" candidate alongside `Be·en`/
  `Bakkan`/`bang·e`/`·be·`/`·mi·si·`/`be·si`. Not a verbatim Thangseng
  re-confirmation of the word itself in this exchange — logged with
  that provenance noted honestly in the entry, not overstated as a
  fresh direct quote.

---

## NV-037 — `nam` ("good"): no raka in any derivation — CLOSED

**Status:** CLOSED — direct Thangseng confirmation, 2026-07-23:
"No raka in nama. Nama, namja, namgipa, namgijagipa, name." Both
suspect forms were wrong: `master_dictionary.json` #874 corrected
`Nama·gipa`→`Namgipa`. `corrections.json`'s "loved the picture" entry
replaced entirely — Thangseng: Garo doesn't use "love" for objects;
correct translation is `Noksako sile nikaha` (lit. "thought the
picture was beautiful," `Noksa`="picture," `sile`="beautiful"). Also
closes the parallel `porai`/`pora` raka outlier from NV-010: "i want
to study" (`pora·na`, raka) was contradicted by "poraina" appearing
raka-free in two other confirmed sentences (incl. today's "this is a
good book to read") — fixed to `porana`, same pattern as
`agan`/`tusi`/`ring` in `RC-CANDIDATE-009`.

**Evidence:** `nam` is robustly raka-free in its base and most derived
forms — `Nama` ("good"), `Namja` ("bad"), `Namen`/`namen` ("well,"
adverb), `Nama ong·a` ("it is good"), `Namnikgipa` ("favourite," a
`nik`+`gipa` compound). But two independent forms show raka appearing
with this same root: `corrections.json`'s `"Nang photo ko nam·e
nikaha"` ("[you] looked at/loved the picture [nicely]" — literal
meaning unclear, possibly not "love" as a verb at all, see below) and
`master_dictionary.json` #874, `"kind/gentle"` → `Nama·gipa`.

**Determination:** not resolvable from repo evidence alone, unlike the
`agan`/`tusi`/`ring·gen` cases closed under `RC-CANDIDATE-009` today —
those had direct same-file contradictions or an already-Verified rule
(`RULE-023`) to settle them. Here there's no contradiction to appeal
to: two derivational contexts with raka, several non-derivational
contexts without. Two live possibilities, not distinguishable without
native input:
1. Genuine suffix-conditioned raka insertion — some derivational
   suffixes (`-gipa`, whatever `-e` is here) trigger raka on `nam`
   specifically, a real (if narrow) `RULE-001` refinement.
2. Both are independent transcription errors that happen to coincide
   in having a derivational suffix nearby — coincidence, not a pattern.
- Separately worth asking: is `"Nang photo ko nam·e nikaha"` actually
  a translation of "loved" at all, or does it more literally mean
  "looked at the photo nicely/admiringly" (`nam` "good" + adverbial
  `-e` + `nikaha` "saw") — i.e. an idiom the English gloss overstated,
  not a verb "to love" in its own right? `master_dictionary.json`
  separately has `"did you love"` → `Ka·saaha` (a completely different
  root), suggesting Garo may not use `nam` for "love" as a primary verb
  at all.

**Repository components impacted:** none — flagging only, no dictionary
or `corrections.json` edit made pending native input.

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
- **NV-033** (`Kama` = "to burn," not "hot"; `Ka·ma` = "below") —
  closed 2026-07-23, direct native confirmation. Wrong `"hot"→Kama`
  production entry removed. Remaining loose ends from the same
  exchange tracked separately as NV-034, NV-035, NV-036 (still open).

## NV-039 — `tampi` confirmed for "housefly" — CLOSED (housefly only; broader `fly` noun conflict stays open)

**Status:** `housefly` CLOSED, 2026-07-25 — added as its own confirmed
headword (`"housefly": "Tampi"`). 2026-07-24 WhatsApp relay (Tridip
asked "is that a housefly? aiwaa tampi ma?", Thangseng answered
"Tampi").

**What this confirms:** `tampi` is a real, native-recognized word for
housefly/fly. `known_dictionary_conflicts.json` currently flags `fly`
as a three-way conflict (`Bila`/`Tampi`/`til·a`, plus `bil·a` also
means "to fly" as a verb). This exchange confirms `tampi` is correct
for the noun; it does not confirm or rule out `bila`/`til·a` as
regional or contextual alternates (e.g. `bila` may be verb "to fly"
being conflated with the noun in some entries). Full three-way
resolution stays open — do not extend this single confirmation to
close the whole conflict.

## NV-038 — `na·sta` ("breakfast"/"snack"): loanword status, not yet asked — investigation round CLOSED 2026-07-25, linguistic item OPEN

**Investigation round CLOSED 2026-07-25** (this data point resolved,
matching the header — see doc-top convention note). `na·sta` confirmed
real but restricted: "Rarely
used by the younger generation. But it may be used occasionally by old
people from some regions" — genuinely regional/generational, not a
core production value. Separately, a genuine, common native
expression for breakfast exists, found via direct question: **`cha`**
(literally "tea") is used metonymically — "`cha ringjokma?`" (literally
"have you had tea?") "usually" means "have you taken breakfast." This
is the better production value for "breakfast" in casual/common usage
— `na·sta` should be kept as a marked regional/dated variant, not the
primary translation.


**Status:** OPEN. Investigation only — dictionary entry NOT touched.

**Background:** Thangseng stated flatly there is no Garo word for
breakfast. The Project Owner asked this to be investigated (loanword?
regional? outdated? error?) before any dictionary action, per the
2026-07-23 migration doc's explicit instruction to leave the entry
exactly as flagged.

**Corpus-internal observation (not native-confirmed):**
`master_dictionary.json` currently has `na·sta` under two separate
headwords — `"breakfast": "na·sta"` and `"snack": "na·sta"` — and a
sentence entry spells it `"nastha"`: `"have you eaten breakfast?":
"Naa nastha chaa ha ma?"`. The `-h-` spelling and the double gloss
(breakfast/snack) both point toward the same word rather than two
coincidentally similar ones.

**External research (background only, not a linguistic ruling):**
Standard etymological sources trace this word to Classical Persian
*nāštā*, borrowed into Hindi/Urdu as नाश्ता/ناشتا and from there into
Bengali (নাস্তা), Marathi, Gujarati, Kannada, Marwari, and other South
Asian languages, generally as a term for a light morning meal.
Multiple Hindi sources also note it isn't originally a Hindi word
either — it's a Persian loan that spread regionally. This is
consistent with — but does not prove — `na·sta` being a similar late
loan into Garo rather than an inherited term, which would explain why
Thangseng doesn't recognize a native Garo word for the concept.

**What this does NOT settle:** whether Garo speakers today actually
use `na·sta`/`nastha` in practice, whether it's regional, and whether
"breakfast" should simply be marked as a loanword in the dictionary
rather than removed or replaced. That needs a direct native answer,
not corpus inference or outside etymology.

**Relay question drafted:** Is `na·sta` (or `nastha`) a word Thangseng
recognizes and would actually use for "breakfast," even if borrowed?
Is there any other Garo expression for the morning meal (even a
descriptive phrase, e.g. "morning food")? Add to the next Thangseng
relay batch alongside other open NV items.

## NV-040 — `Bite` ("fruit"), no raka — CLOSED

**Status:** CLOSED. First direct native confirmation.

**Correction to the record:** commit `564295d`'s message ("fruit dedup
to Bite") reads as a native-confirmed decision but was not — it was a
mechanical hygiene dedup of a duplicate `"fruit":"bi·te"` entry down to
the existing `"fruit":"Bite"` entry, based on corpus-internal reasoning
only. No NV entry was ever written for it, which this closes.

**Native confirmation (Tridip → Thangseng, 2026-07-23):**
> Tridip: fruit?
> Thangseng: Bite

Confirms `Bite` (no raka mark) is correct for "fruit." No dictionary
change needed — the earlier mechanical dedup happened to land on the
right form. Logged here so the decision has an actual evidentiary
basis on record, not just an unverified commit message.

## NV-041 — `watch`/`see`/`call` cluster — CLOSED

**Status:** CLOSED. Direct native confirmation. Closes the "watch"/"call"
data anomaly Claude B flagged during RC-CANDIDATE-027 (see
`PENDING_REGRESSION_CASES.md`), where the neutral row's `garo` value for
each didn't match the alternates listed in its own `notes` field.

**Native confirmation (Tridip → Thangseng, WhatsApp, 2026-07-26 and
2026-07-29):**
> Thangseng: Watch = nia
> Nienga = watching (continuous)
> Nibo = watch (imperative)
> Ninabe = don't watch (imperative)
> Niaha = watched (past)
> Nigen = will watch (future)
> Nijawa = will not watch (negative)
>
> Thangseng: Nika = to see, to find
> Nikbo = find, see
> Niknabe = don't find
> Nikjawa = will not find, see
> Nikgen = will find, see
> Nikaha = found, saw
> The meaning depends on the context
>
> Thangseng: Okama [call]
> Cannot be used to mean phone call!!
> Calling is okamani

**Findings:**
1. **watch = nia** — confirmed, full tense/imperative paradigm given.
   Matches the existing `ni·a` variant already under "watch" in
   `master_dictionary.json`. The other three "watch" entries (`go·ri`,
   `ni·chak·a`, `ni·rik·a`) are **not** addressed by this data — remain
   unconfirmed, untouched.
2. **see = nika** — confirmed, with an explicit dual meaning
   (see/find) that Thangseng flagged proactively as context-dependent
   rather than a fixed single gloss. Matches the existing `nik·a`
   entry under "see." This is consistent with NV-011/012 (watch=nia
   root vs. see=nika root are genuinely distinct, not free variants).
3. **call = Okama, calling = Okamani** — this is the real resolution
   of the anomaly: none of the four existing "call" entries (`don·a`,
   `ming·a`, `ok·gam·a`, `pe·a`) is the confirmed word. All four are
   now superseded pending replacement with `Okama`/`Okamani`.
4. **Open gap, not resolved by this exchange:** Thangseng explicitly
   said `Okama`/`Okamani` cannot mean "phone call." No word for that
   sense has been confirmed. Needs its own relay question — do not
   guess a term for it.

**Dictionary action taken:** see commit for `master_dictionary.json`
changes (call/calling entries superseded and replaced). Watch/see
entries left as-is — already correct, no change needed.

**Addendum (Thangseng, WhatsApp, 2026-07-29, same day follow-up):**
full `okama` paradigm, same pattern as `nia`:
> okama = to call (verb)
> okambo = call (imperative)
> okamnabe = do not call (imperative)
> okamgen = will call
> okamjawa = will not call
> okamaha = called
> okamani = calling (noun; technically a verbal noun)
> okamenga = calling (present continuous)

Confirms `okama`/`okamani` follow the same imperative/tense suffix
pattern already seen on `nia` (-bo/-nabe/-gen/-jawa/-aha) plus the
continuous marker (-enga, matches `nienga`). Thangseng distinguished
`okamani` (verbal noun) from `okamenga` (present continuous) — two
different forms, not variants of each other. Not added as individual
dictionary entries (consistent with how the `nia` paradigm was
handled) — logged here as the evidentiary record.

**Correction (2026-07-31, Claude A):** WORKSTATE.yaml previously
flagged this paradigm as needing "its own RULE-XXX." On review, it
does not — every suffix here (`-bo`, `-nabe`, `-gen`, `-jawa`, `-aha`,
`-enga`) is already independently Verified in
`MORPHOLOGY_SPECIFICATION.md` (§ mood/tense/aspect table) as a
generic stem+suffix mechanism per RULE-015, not tied to specific
verbs. `nia`/`nika`/`okama` are three more confirmed roots following
the existing general pattern, not a new grammatical category. No new
rule created — would have been a duplicate. This item is closed.

## NV-042 — "can you help me?" and "how many apples do you have?" — RESOLVED, see NV-043

**Status:** CLOSED. Raw native data logged by Claude B (2026-07-29/30)
at the Project Owner's relay. Claude A's determination (originally
left open here) is now recorded in NV-043 below — see there for the
resolution of all three open items listed originally in this entry.

**Context:** these two sentences were flagged live (2026-07-29, this
session's quality check) as producing `sov-assembly` word-salad —
`"can you help me"` → `"Betoi Angko Na·a"`, `"how many apples do you
have"` → `"Maidake apal donga Bang·a Na·a"` — both grammatically
uncovered constructions (modal "can", quantity-question "how many").

**Native response (Thangseng → Project Owner, WhatsApp, 2026-07-30):**
> Thangseng: can you help me=?
> Na·a angna (or angko depending on the context) dakchakna man·genma?
>
> Thangseng: "how many apples do you have?
> Nang·o badita rong apple donga?

**Repository components impacted:** see NV-043 — added to
`src/data/corrections.json`.

## NV-046 — RESOLVED: `maidake` vs. `maikai` ("how"), and "phone call" is a verb phrase, not a noun

**Status:** Resolved by direct Thangseng relay (via Project Owner,
2026-07-31). Two separate items in one relay message.

**Item 1 — `maidake` vs. `maikai`:** not free variation, not a form
conflict — `maikai` and `maidake` are both "how," but `maikai` is
broader: it also covers "in order that" / "so that" (purpose/result
clause), a sense `maidake` does not carry. Thangseng's own framing:
*"Maikai is a bit versatile than Maidake."*
**Determination:** `maidake` = "how" only (narrower). `maikai` = "how"
+ "in order that"/"so that" (wider). Not interchangeable in the
purpose/result sense — only `maikai` covers that. Promote to a RULE
entry once a purpose/result-clause example sentence exists to anchor
the second sense (currently glossed, not yet exemplified).

**Item 2 — "phone call":** resolves and *supersedes* NV-044's PENDING
loanword entry for the calling sense specifically (NV-044's
phone/smartphone/mobile *noun* entries stand — this is about the verb
"to call," not the device noun). There is no direct noun for "phone
call" itself, and the earlier device word `ku'bilbat` is confirmed
obsolete/out of use. The productive construction is the verb phrase
`phone ka'a`, inflecting like any other verb:
- `Phone ka'enga` — "(I am) calling," e.g. `Tridipna phone ka'enga.`
  = "(I am) calling Tridip."
- `Phone ka'atenga` — "(someone) is calling," e.g. `Tridip
  ka'atenga.` = "Tridip is calling."
- `Phone ka'atbo` — imperative "call!"
- `Phone ka'atnabe` — negative imperative "do not call"
- `Phone ka'atjawa` — future negative "will not call"

**Cross-reference:** this is the verb-side counterpart to the earlier
`call` RC-CANDIDATE-027 finding (NV-041) that resolved the 4 old noun/
verb "call" entries to `Okama`/`Okamani` and left "phone call"
specifically as an open gap. This closes that gap: "phone call" isn't
a single noun to translate — it's this `phone ka'a` verb paradigm.

**Action taken (2026-07-31, completed):** all 5 inflected forms plus
updated `Okama`/`Okamani` cross-references written to
`master_dictionary.json`. Orthography normalized from the relayed
apostrophe (`ka'a`) to the dictionary's established middle-dot
convention (`ka·a`), matching existing glottal-stop spellings
(`Da·al`, `Mipringde cha·ahama`) — normalization only, not an
independent confirmation of this word's orthography specifically.
Base/citation-form question (how to key the paradigm's root, if a
single root entry is wanted beyond the 5 inflected phrase entries) is
still open — logged as phrase entries only this pass, matching the
dictionary's existing phrase-based convention rather than inventing a
lemma structure the rest of the dictionary doesn't use.



**Status:** PENDING/MEDIUM confidence, not CLOSED. Source is a Project
Owner note (Tridip, 2026-07-29), not a direct Thangseng quote — flagged
here per the same standard applied throughout this doc: Tridip's own
commentary is logged as lower-confidence than a verbatim relayed
answer, until confirmed.

**Note (Tridip, 2026-07-29):** no distinct Garo word for "smartphone" —
covered by the same loanword as "phone."

**Action taken:** added `phone`/`smartphone`/`mobile` → `Phone` to
`master_dictionary.json`, all three marked `PENDING/MEDIUM`, not
`VERIFIED/HIGH`. Orthography (`Phone` vs. a raka'd form) assumed by
loanword convention (cf. `Apple`, `Cup`, `Room` already in the
dictionary as bare English loanwords), not independently confirmed.

**Open:** add to the next Thangseng relay batch to confirm spelling
and promote to VERIFIED. Do not treat as settled until then.

## NV-043 — RESOLVED: "can you help me?" / "how many apples do you have?"

**Status:** CLOSED for the two exact sentences given. This resolves
NV-042 above (logged by Claude B from the same relay round) — the raw
quote lives there; this entry records the Claude A determination
NV-042 explicitly left open, so it isn't duplicated here.

**Determinations made:**
1. **`angna` vs. `angko`** (Thangseng flagged this as context-dependent,
   unresolved by the one data point) — committed `angna` as the
   default for this sentence. `angko` is a known valid alternate, not
   wrong, just not disambiguated. This closes the sentence, not the
   general case-marking question — do not treat `angna`/`angko` choice
   as settled for other sentences.
2. **Does `badita` generalize beyond this exact question?** — Not
   resolved, left open. No claim made either way.
3. **`corrections.json` phrase entry vs. general grammar rule?** —
   Chose `corrections.json`, scoped to these 2 exact sentences only,
   same precedent as the "will you eat" fix (`RC-CANDIDATE-020`). Not
   a generative rule — no claim that other "can you X" or "how many Y"
   sentences are covered.

**Action taken:** added both sentences to `src/data/corrections.json`
(no `?` in the key — as of `RC-CANDIDATE-030`'s fix, the corrections
lookup now falls back to a `?`-stripped key, so this no longer carries
the punctuation-exposure risk earlier entries had before that fix
landed). These are the exact two sentences flagged as garbled
`sov-assembly` output in this session's capability rating check
(`"can you help me"` → `Betoi Angko Na·a`; `"how many apples do you
have"` → `Maidake apal donga Bang·a Na·a`, both confidence 0.75,
incoherent).

**Not resolved:** why `sov-assembly` produces incoherent output for
sentences like these generally — that's the underlying engine gap
(word order / verb resolution for "can," "have," "how many"), only
patched for these 2 exact sentences via `corrections.json`. General
case remains open, Claude B's domain.

## NV-045 — "have"/"how" sentence batch (Thangseng, relayed via Project
Owner, source: `Have_and_How.pdf`, 2026-07-31)

**Status:** RAW DATA logged. One narrow determination made below
(badita generalization); everything else left OPEN pending further
review — do not treat unlisted items as resolved.

**Raw sentences (verbatim as relayed):**
1. "Do you have my book?" — `Nang'o angni ki'tap dongama?`
2. "I have a dog." — `Ango achak mangsa donga.`
3. "Have you eaten your lunch?" — `Na'a mipring cha'ahama?`
4. "I have come to you." — `Anga nang'ona re'baaaha.`
5. "Do you have to go to the market?" — `Na'a antichi re'angna
   nangengama?`
6. "How many apples are on the table?" — `Tableo badita rong apple
   donga?`
7. "How is your grandmother?" — `Nang'ni ambide mai rokom?`
8. "How are you going to do it?" — `Na'a uako maikai dakna am'enga?`
9. "How can I be a better person?" — `Anga maikai nambatgipa mande
   ong'na amgen?`

**Determination made — badita generalizes beyond the NV-043 sentence:**
NV-043 (above) explicitly left open whether `badita` ("how many")
generalizes past the one confirmed sentence ("how many apples do you
have?" → `Nang·o badita rong apple donga?`, already in
`corrections.json`). Sentence 6 here is a *different* English question
("how many apples are ON THE TABLE") with a different subject
(`Tableo`, not `Nang·o`) but the same `badita rong apple donga`
core — two independently native-confirmed sentences sharing that
exact substring is direct confirmation, not inference. **Closing
this specific sub-question:** `badita rong [noun] donga` is
confirmed productive for "how many [noun] are/do [X] have" across at
least a possessive and a locative subject. Not yet confirmed
productive for classifiers other than `rong`, or nouns other than
`apple`.

**Flagged, NOT resolved — "how" appears to split by sense, with an
unexplained form conflict:**
- Existing `corrections.json`: `"how"` → `maidake` (line 676); `"how
  did i get it"` → `maidake` (line 679).
- Existing: `"how are you"` → idiomatic `Na·a namenga ma?` (not
  compositional).
- New sentence 7 (condition/state sense — "how is X"): `mai rokom`.
- New sentences 8–9 (manner/method sense — "how do/can I X"):
  `maikai`.
- This suggests "how" may not be a single lexical item in Garo but
  splits by sense (manner vs. state vs. idiomatic greeting) — but
  `maikai` (sentences 8–9) directly conflicts with the already-stored
  `maidake` (manner sense, "how did I get it"). Could be a dialectal
  or transcription variant, or a genuine distinct word — **not
  determined, do not merge or pick one over the other.** Needs a
  targeted relay question.

**Flagged, NOT resolved — vocabulary/construction items, no action
taken:**
- `donga` (possession "have") reconfirmed consistent with existing
  dictionary entry (sentences 1–2).
- `mipring` (sentence 3, no `-de` suffix, explicit `Na'a` subject) vs.
  existing `mipringde` (`corrections.json` line 803, `-de` suffixed,
  no explicit subject) — same word for "lunch," different
  suffixing/word-order pattern. Possibly free variation, possibly
  register-dependent. Not analyzed.
- `re'baaaha` ("have come," perfect aux, sentence 4) — new, no
  existing rule covers perfect-tense "have" as an auxiliary. Distinct
  from possessive `donga`.
- `nangengama` ("have to," obligation, sentence 5) — new, confirms
  obligation "have to" is a distinct construction from possessive
  "have," not yet ruled on.
- `ambide` (sentence 7, "your grandmother") vs. existing `ambi`/
  `ambiko` (`corrections.json` lines 32/34) — possible `-de` suffix
  attachment (cf. RULE-038–042 `-de` work) on a kinship noun rather
  than a verb; not analyzed, not assumed to be the same `-de`.

**Action taken:** logging only. No `corrections.json` or dictionary
edits this entry except the scope note above (badita finding is
recorded here, not yet promoted to code — promotion is a separate
step).

**Second determination (2026-07-31) — "have" (perfect aux) vs. "have
to" (obligation) vs. "have" (possession) are three distinct
constructions:** resolved corpus-internally, promoted to RULE-043.
`donga` (possession), `re'baaaha` (perfect aux), and `nangengama`
(obligation) are three formally non-overlapping surface forms within
this same native-confirmed batch — no shared root, no ambiguity to
guess through. This confirms distinctness only; the internal
morphology of `re'baaaha` and `nangengama` remains undetermined, and
each still rests on a single example sentence. See
`docs/grammar_rules_structured/RULE-043.yaml`.

**Third determination (2026-07-31) — `ambide` is out of RULE-042's
confirmed scope, not assumed to be the same suffix:** RULE-042 is
explicitly scoped to `-de` attaching to *day/time words*
(`Knal`/`Da·al`/`Mijal`/clock-time `bajio`). `ambi` ("grandmother") is
a kinship noun, not a day/time word, so sentence 7's `ambide` falls
outside that rule's stated scope by the rule's own terms — this does
not require guessing, only reading RULE-042's boundary as written.
**Determination: `ambide` is NOT confirmed to be an instance of
RULE-042's `-de`.** Treat as a distinct, unanalyzed `-de`-shaped
morpheme (possibly homonymous, possibly a different suffix entirely)
until it has its own evidence. No rule promotion — this is a negative
determination (ruling out a merge), not a positive one.

**Partial resolution (2026-07-31) — `mipring` = "lunch" (bare noun),
direct Thangseng relay:** confirms `mipring` is the root noun itself,
not a separate/alternate word from `mipringde` — rules out the
"two unrelated synonyms" reading. This narrows, but doesn't close,
the original question: it confirms `-de` in `mipringde` is a suffix
attaching to this same root, but not *what* the suffix is doing there
(topic marking correlated with subject-drop, free variation, register,
etc. all remain consistent with a root+optional-suffix picture).

**Still open, NOT resolved this pass (needs Thangseng or more
examples, not corpus-internal reasoning):**
- `maidake` vs. `maikai` — direct form conflict for manner "how,"
  needs a targeted relay question. Do not guess.
- What `-de` is doing when it attaches to `mipring` (topic/focus
  marking correlated with subject-drop vs. free variation vs.
  register) — the noun/suffix relationship itself is now settled,
  the function of the suffix is not. Still only two data points
  differing in two dimensions at once (subject presence AND suffix);
  needs a disambiguating example (e.g. a subject-less non-`-de` form,
  or an explicit-subject `-de` form) to isolate cause.
- Promote the badita-generalization finding into code/tests once the
  above are far enough along to avoid fragmenting the work.

## NV-047 — CLOSED: `Na·a bachi re·angenga?` = "where are you going?";
`Na·ara bano?` = "where are you?"; `Bao` = "where?"; `-chi`/`-o`
movement-locative contrast confirmed

**Status:** CLOSED — Project Owner closure, 2026-07-31, resolving the
ambiguity below in the direction RULE-044 predicted.

**Final determinations:**
- **"where are you going?"** = `Na·a bachi re·angenga?` — `bachi`
  (movement-to locative) pairs correctly with the movement verb
  `re·angenga`. **VERIFIED/HIGH.** This corrects the pre-existing
  `master_dictionary.json` entry, which had used `bano` instead
  (grammatically inconsistent with RULE-044 — `bano` is the
  no-movement locative, wrong pairing for a movement verb). Both
  occurrences of this entry (`"where are you going?"` and the
  malformed-key duplicate `"the where are you going?"`) corrected
  same pass.
- **"where are you?"** = `Na·ara bano?` — `bano` (no-movement
  locative), consistent with this being the stationary question.
  **VERIFIED/HIGH.** New entry, didn't previously exist in
  `master_dictionary.json`.
- **`Bao`** = "where?" (bare interrogative) — **VERIFIED/HIGH**,
  already added prior pass, unchanged.
- **RULE-044** (`-chi` = movement-to locative, `-o` = no-movement
  locative) — confidence upgraded Medium → High. The closure above
  isn't just a removal of the earlier ambiguity, it's corroborating
  evidence for the rule: all three forms landed exactly where
  RULE-044 predicted (movement verb + movement suffix; stationary
  question + no-movement suffix; bare form + no suffix).

**Superseded from this entry's earlier partial-resolution pass:** the
open follow-up question drafted below is no longer needed — answered
directly by this closure. Left in place only as a record of what was
asked and how it was resolved, not as an active item.

---

**[Earlier partial-resolution text, retained for record — see
CLOSED determination above for the actual outcome]**

**Status:** Partially resolved. Source: WhatsApp, Tridip ↔ Thangseng,
2026-07-31, 6:41–6:44 PM IST — relayed to Claude A in two passes: a
raw/unlabeled paste first, then a labeled synthesis (compiled by a
different Claude instance, "not yet reviewed" per its own framing).

**Important process note on this entry:** the two passes disagreed on
one point. The raw paste, read on its own, suggested `Na·ara bano?`
was confirmed as the answer for "where are you going?" with "where
are you?" left unaddressed. The labeled synthesis instead presents
`Bano na·a` = "where are you?" as separately confirmed ("Yep"), and
flags `Na·ara bano?`'s mapping as genuinely ambiguous in the source
chat (its own ⚠ marker). Both readings were produced by inferring
turn-attribution onto the same underlying ambiguous chat text — the
synthesis's ⚠ flag is not resolved by having more labels, since the
labels themselves are an interpretation, not a transcript feature.
**Treating the ⚠ point as still genuinely open, per both sources'
own uncertainty, not resolving it by picking a reading.**

**Confirmed clean — no ambiguity in either pass:**
- `Bao` = "Where?" — bare/short interrogative, given as a direct
  definition when Tridip asked about it specifically. **VERIFIED/
  HIGH.** Promoted to `master_dictionary.json` this session.
- `Na·a bano re·angenga?` and `Na·a bachi re·angenga?` are both
  confirmed/accepted forms for "where are you going?" — Thangseng
  restated the first as correct and offered the second as an
  alternate. **VERIFIED/HIGH for both as accepted forms of "where are
  you going?".** Not promoted as competing `master_dictionary.json`
  entries this session — `Na·a bano re·angenga?` is already present;
  adding `bachi` as a second same-key entry would recreate the exact
  duplicate-key clobber shape flagged in RC-036 this session. Needs
  the proper alternates mechanism (`compiled_dict_alternates.json`,
  per the Copilot audit response) rather than a raw duplicate key —
  flagging for Claude B, not doing myself (build-pipeline territory).
- **Grammar point, direct native statement of the general rule (not
  just one more example):** `-chi` suffix = movement *to* a locative;
  `-o` suffix = locative *without* movement. Thangseng gave this as
  an explicit rule in response to Tridip's own clarifying question
  ("difference between Bano and bachi? and also Bao"), not as a
  one-off sentence correction. This is qualitatively stronger evidence
  than another single example would be, because it's the native
  speaker stating the pattern itself. See RULE-044 below.

**RESOLVED by the closure above — retained for record only, no longer
open:**
- Does `Na·ara bano?` mean "where are you?" (stative, no movement) on
  its own, or is it a shortened form of "where are you going?" that
  happens to drop the movement particle `re·angenga`? The two passes
  disagree, and the disagreement traces to ambiguous reply-quoting in
  the original chat, not to a resolved fact either source is sure of.
- Correspondingly: is `Bano na·a` (confirmed "Yep" in the synthesis
  pass) actually a separate, independently-confirmed form for "where
  are you?" — or was the synthesis's own turn-labeling here also an
  inference rather than a literal transcript reading? The raw pass
  didn't clearly separate this as its own confirmed turn.
- **Recommended follow-up question for the next relay, precise enough
  to close this cleanly:** *"Does 'Na·ara bano?' by itself mean 'where
  are you' (staying still), or is it short for 'where are you going'?
  And is 'Bano na·a' also correct for 'where are you', separately?"*
  Not added to the standing 42-question batch — flagging here so it
  isn't lost, but not bundling into that already-large, already-
  awaiting-response batch.

**Action taken:** `Bao` = "where?" added to `master_dictionary.json`
(VERIFIED/HIGH). RULE-044 added for the `-chi`/`-o` contrast. Nothing
else promoted to code this pass — the open item above is a genuine
gap, not something to guess through.

## NV-048 — CLOSED: numeral-classifier counting batch re-confirmed; `rong` (roundish objects, incl. alcohol) added; `chu` = "alcohol" (new word)

**Status:** CLOSED. Direct native confirmation via Project Owner relay,
2026-08-01.

**Confirmed unchanged (re-validation of the RULE-038 seven-example
set):**
- `achak mang·sa` = "one dog", `achak mang·gni` = "two dogs"
- `ki·tap kinggittam` = "three books"
- `mande sak·sa` = "one person" — Thangseng explicitly re-confirmed
  ("mande sak-sa? correct. Yes")
- `tangka gong·bonga` = "five coins"
- `do·a mang·chiking` = "ten birds" (Thangseng's own typed form dropped
  the final vowel to `do·`; treated as a typing slip, not a new form —
  the noun-first `do·a mang·chiking` example under RULE-038 already has
  stronger, repeated corroboration)

**Correction — fruit classifier:**
> Thangseng: "But with fruits, rong is the preferred prefix because
> they are roundish in shape, e.g., apple rongsa; te·gatchu rongbonga,
> etc."

The dictionary's pre-existing `"four fruits": "mewa ge·bri"` was wrong
— it was never a native-confirmed form, just an unquestioned default
fallback (`ge`) that went unchallenged until this relay. Corrected to
`mewa rongbri`. Both of Thangseng's own typed examples (`rongsa`,
`rongbonga`) show no raka mark, so `rong` is implemented as a no-raka
classifier (like `king`/`jol`), unlike `mang`/`sak`/`ge`/`gong`.
Confidence: medium (2 direct examples, consistent, from the native
speaker's own typed forms — narrower evidence base than the original
5-classifier set, but not corpus-internal guessing).

**New word — alcohol:**
> Thangseng: "...and for alcohol is rong and in Garo alcohol is chu
> (new word)"

`chu` = "alcohol" added to `master_dictionary.json` (VERIFIED/HIGH).
Cross-reference: a pre-existing `"beer": "chu"` entry (UNVERIFIED/HIGH,
origin untraced) is the same Garo word — this relay confirms `chu` as
the general term for alcohol, not specifically "beer" as a narrower
sense. Left as a separate entry rather than merged/deleted; its notes
now point here. `rong` also applies to alcohol as a classifier: `chu
rongsa` = "one alcohol", `chu rongbonga` = "five alcohol".

**Not added to the dictionary (insufficient evidence for a full
gloss):** "apple" and `te·gatchu` from Thangseng's own examples above —
these support the classifier rule but no English gloss for `te·gatchu`
was given, and "apple" as literally the Garo word (vs. shorthand for
"one apple") is ambiguous. Flagged for a future relay if a full
sentence-level confirmation is wanted.

**Action taken:** `RULE-038` and `RULE-G-classifier` updated (5th
classifier root `rong`, no-raka, roundish objects). `garo_classifier.js`
CLASSIFIER_MAP updated (`fruit`/`fruits`/`mewa`/`bite`/`bi·te`/`apple`
→ `rong`; `alcohol`/`chu`/`beer` → `rong`). `master_dictionary.json`:
`"four fruits"` corrected to `mewa rongbri`; new entry `"alcohol": "chu"`
added; `"beer": "chu"` notes updated to cross-reference this entry.
`compiled_dict.json`/`compiled_dict_alternates.json`/`category_index.json`
regenerated via `npm run build`. New test file
`tests/unit/rong_classifier.test.js` added (rong resolution, no-raka
behavior, ge/mang/sak/king/gong regression coverage). Full suite:
153/153 passing.

## NV-049 — CLOSED: mipring/mipringde resolved; phone/smartphone/mobile confirmed; apple + mango (te·gatchu) confirmed

**Status:** CLOSED. Direct native confirmation via Project Owner relay,
2026-08-01, closing all remaining items from the NV-045/046 lineage and
the "apple"/`te·gatchu` gloss gap flagged in NV-048.

**mipring vs mipringde (NV-045, previously open — only resolvable via a
disambiguating example, now received):**
> "Mipringde minaha. = Lunch is ready. mipring = lunch"

`mipring` = "lunch" (bare noun) was already VERIFIED/HIGH in the
dictionary (Thangseng, 2026-07-23). This relay adds a second,
independent sentence using `mipringde` (`mipring` + `-de`) before a
*different* predicate than the first data point (`minaha` = "is
ready", vs. the existing `cha·ahama` = "have you eaten" sentences).
Two confounded variables from NV-045 (subject-presence, `-de`
attachment) are now separated: `-de` attaches to `mipring` regardless
of which predicate follows, so it is not tied to one specific verb —
consistent with `-de` functioning as a general topic/subject marker,
not a construction-specific fossilized form. Added `"lunch is ready":
"Mipringde minaha"` to `corrections.json` (VERIFIED/HIGH, direct
quote). Not added: a standalone `mina`/`minaha` "ready/finished" root
headword — only one form of this verb is on record, insufficient to
paradigm-build from a single sentence. Flagged as a small, genuinely
open item if the fuller paradigm is ever wanted (not urgent, not
blocking anything).

**Phone/smartphone/mobile (was PENDING/MEDIUM, Tridip's own note not a
direct quote):**
> "Phone/smartphone/mobile=phone"

Direct confirmation: single loanword `Phone` covers all three, no
distinct forms. All three `master_dictionary.json` entries promoted
PENDING/MEDIUM → VERIFIED/HIGH.

**Apple (was ambiguous — unclear if "apple" in Thangseng's own
NV-048 example was the real Garo word or shorthand):**
> "Apple = apple"

Confirmed literal: the loanword `Apple` is the real, current word
(the rarely-used native `te·spu` variant, already on record, stands as
an alternate, not the default). No dictionary change needed — the
existing `"apple": "Apple"` entry was already correct; notes updated
to record direct confirmation.

**Mango = te·gatchu (closes the NV-048 gloss gap):**
> "Mango= te·gatchu"

`te·gatchu` — the fruit used in Thangseng's own `rong`-classifier
example in NV-048 (`te·gatchu rongbonga` = "five [mangoes]") — is now
identified as "mango". The dictionary already independently held
`"mango": "Te·gachu"` / `"Mango": "te·ga·chu"` (VERIFIED/HIGH,
pre-existing), so this closes the gap by cross-referencing rather than
adding a new entry: the NV-048 example sentence and the pre-existing
dictionary word are confirmed to be the same word, closing the loop
Thangseng's own example had left open.

**Reconfirming evidence (no change needed):** the pre-existing
`"how many apples do you have": "Nang·o badita rong apple donga?"`
(NV-043, 2026-07-30) already demonstrates `rong` + `apple`, consistent
with `apple` → `rong` in `CLASSIFIER_MAP` (NV-048). Sent back
unprompted by the Project Owner as supporting evidence for this batch;
no dictionary action required, noted here for the record.

**Action taken:** `master_dictionary.json` — 3 phone/smartphone/mobile
entries promoted to VERIFIED/HIGH; `Mango`/`apple` entries' notes
updated with direct-confirmation cross-references. `corrections.json`
— new entry `"lunch is ready": "Mipringde minaha"`.
`garo_classifier.js` — `mango` added to `CLASSIFIER_MAP` → `rong`
(consistent with `apple`, already `rong`). No `compiled_dict.json`
regeneration needed beyond the standard `npm run build` pass (run
before commit). Full suite re-run before commit.

---

**NV-050, 2026-08-02 — mina/minaha root correction (closes the small
open item flagged at the end of NV-045/049 above):**
> "mina = ripe, cooked. 'ready/finished' are incorrect. Minaha = ripe.
> e.g. Te'gatchu minaha. = The Mango/es (can be plural; but not always
> plural) are ripe. Minengaha = ripe (kinda continuous). e.g. Tegatchu
> minengha. = The mangoes have started ripening. Minkuja = not
> ripe/have not ripened. e.g. Tegatchu minkuja. = The mangoes are not
> ripe./ The mangoes have not started ripened. Minenga = ripening
> (should be continuous, but can used in a simple present sense too).
> e.g. Tegatchu minenga. = The mango is ripening. Or, The mango is
> ripe. Or even, Ua te'gatchu minenga. = That mango is ripe."

Corrects the root gloss that had been sitting as a flagged-but-not-
paradigm-built open item: `mina`/`minaha` is not a "ready/finished"
root, it is "ripe" (of fruit) / "cooked" (of food). This directly
corroborates two pre-existing UNVERIFIED/HIGH corpus entries that had
been sitting unconnected — `"cooked": "min·a"` and `"ripe": "min·a"`
(variant) — both promoted to VERIFIED/HIGH by this relay. Four
inflected forms added as new entries: `minaha` (stative), `minengaha`
(has started ripening), `minkuja` (not ripe, negative), `minenga`
(ripening / is ripe, continuous-usable-as-simple-present). Full
paradigm and citation written up as RULE-045.

The earlier NV-045 gloss `"lunch is ready": "Mipringde minaha"` in
`corrections.json` is **not wrong as an idiomatic translation** — food
being cooked/ripe maps naturally to "ready to eat" in both languages —
but the standalone root gloss "ready/finished" that had been
tentatively attached to `mina`/`minaha` (and explicitly *not* added to
the dictionary at the time, per the NV-045 note above, for lack of a
full paradigm) is superseded by this correction. `corrections.json` is
a flat key→string map with no field for notes, so the idiomatic entry
is left as-is; this log entry is the record of the correction.

**Action taken:** `master_dictionary.json` — 2 pre-existing entries
(`cooked`→`min·a`, `ripe`→`min·a`) promoted UNVERIFIED/HIGH →
VERIFIED/HIGH; 4 new entries added (`minaha`, `minengaha`, `minkuja`,
`minenga`). `docs/grammar_rules_structured/RULE-045.yaml` — new rule
documenting the paradigm. `corrections.json` — unchanged (idiomatic
translation still valid, see note above). Full suite re-run before
commit.

---

**NV-051, 2026-08-02 — `-chi`/`-o` locative contrast confirmed general
(closes the open productivity question RULE-044 had flagged):**
> "'chi' suffix cannot mean 'at'. chi carries a sense of 'motion to'.
> At is locative 'o'. to the market = bajalchi / at the market =
> bajalo / to the school = skulchi / at the school = skulo / at home =
> noko / to home = nokchi / at the river = chibimao / to the river =
> chibimachi / to the forest = buringchi / in the forest = buringo."

RULE-044 (closed 2026-07-31) had confirmed the movement-to (`-chi`) vs.
stationary (`-o`) contrast for where-question forms (`bano`/`bachi`/
`bao`) but explicitly left open whether the same contrast holds for
ordinary noun locatives generally — flagged `needs_native_validation`.
This relay closes that gap with five noun-locative pairs, all
consistent with the rule as stated: `-chi` = movement-to, `-o` =
stationary.

This also surfaces that several pre-existing dictionary entries had
conflated the two senses under a single `-chi` form glossed "at X" (or
"at/to X"), which is now known to be wrong for the "at" half:
`"at the market / to the market": "Bajalchi"`, `"at school":
"Skulchi"`, `"at home": "Nokchi"`, `"in the forest": "Buringchi"`, and
their dotted-spelling duplicates (`bajal·chi`, `nok·chi`, `skul·chi`).
Each is annotated INCORRECT GLOSS / superseded (not deleted, per
citation discipline) with a note pointing to the corrected standalone
entry — e.g. `"Bajalchi"` is retained as the correct value for "to the
market", not "at the market".

One entry is a genuine open question rather than a clear error:
`"at the river": "chiko"` (pre-existing, unannotated) conflicts with
the newly-confirmed `"at the river": "chibimao"`. Not resolved either
way — `chiko` (`chi` = "water" + `-o`) may denote a distinct "at the
water" sense rather than being wrong. Both entries are kept, `chiko`'s
notes flag the discrepancy for a future clarifying question if useful;
not urgent, not blocking.

A pre-existing correct entry, `"at the school": "skulo"`, was already
in the corpus unannotated — promoted to VERIFIED/HIGH as directly
corroborated by this relay.

**Action taken:** `master_dictionary.json` — 7 pre-existing entries
annotated INCORRECT GLOSS/superseded (nothing deleted); 1 pre-existing
entry (`at the river`→`chiko`) flagged as an open discrepancy, not an
error; 1 pre-existing entry (`at the school`→`skulo`) promoted to
VERIFIED/HIGH; 10 new entries added for the confirmed `-chi`/`-o`
pairs. `docs/grammar_rules_structured/RULE-044.yaml` — productivity
claim upgraded from `needs_native_validation` to `verified`, launch
priority raised P2→P0, new examples and native_notes appended. No
engine code touched. Full suite re-run before commit.

---

**NV-052, 2026-08-02 — market spelling closed (Bajal, not Bajar);
`bajaro`/`bajalo` discrepancy closed; -chi forms clarified as
present-continuous-sentence components (Project Owner direct
decision):**
> "it's Bajalo close it, market is Bajal and Bajalchi, Skulchi,
> Nokchi, Buringchi are present continuous tense, like i am going to
> the market."

Two closures:

1. **`bajaro` vs `bajalo`** — the open discrepancy flagged in NV-051
   (`"at the market": "bajaro"` pre-existing vs `"at the market":
   "bajalo"` newly confirmed) is closed in favor of `bajalo`. `bajaro`
   annotated INCORRECT/superseded.

2. **Market = `Bajal`, not `Bajar`** — legacy dictionary-import entries
   (`Market`→`Bajar`, `mart`→`Bajar`, `hat.`→`Bajar`, `Market
   price`/`prevailing price.`→`Bajar dol`) all carry a spelling error;
   corrected form is `Bajal`/`Bajal dol`. Each annotated SPELLING
   CORRECTED/superseded, nothing deleted. The pre-existing correctly-
   spelled `"market": "Bajal"` entry (previously SUPERSEDED only
   because a variant `"market": "ha·ti"` was VERIFIED) is now
   independently confirmed and promoted to VERIFIED/HIGH — coexists
   with `ha·ti` as a legitimate variant (loanword vs. likely-native
   term), not a conflict.

3. **-chi forms as present-continuous-sentence components** —
   clarifies that `Bajalchi`/`Skulchi`/`Nokchi`/`Buringchi` (and the
   NV-051 `to the market`/`to school`/`to home`/`to the forest`
   entries) canonically occur inside a present-continuous "going to X"
   sentence, e.g. the pre-existing VERIFIED `"I am going to the
   market." → "Anga bajalchi re·angenga."`. This is a pragmatic/usage
   clarification, not a revision of RULE-044's core morphological
   claim: `-chi` remains the movement-to locative suffix on the noun;
   the continuous sense comes from the paired verb (`re·angenga`), not
   from `-chi` itself. Usage notes appended to all 8 affected
   dictionary entries (4 legacy superseded + 4 NV-051 new) and to
   RULE-044's `native_notes`.

**Action taken:** `master_dictionary.json` — 1 entry (`bajaro`)
annotated INCORRECT/superseded; 1 entry (`bajalo`) confirmed
VERIFIED/HIGH closing the discrepancy; 5 legacy `Bajar` entries
annotated SPELLING CORRECTED/superseded; 1 entry (`market`→`Bajal`)
promoted to VERIFIED/HIGH; usage-note clarification appended to 8
`-chi` entries. `docs/grammar_rules_structured/RULE-044.yaml` —
native_notes appended documenting both closures. No engine code
touched, no new dictionary keys added (unlike NV-050/051, this is a
closure/annotation pass on existing entries). Full suite re-run before
commit.

---

**NV-053, 2026-08-03 — ma·jong confirmed over a·jong; An-sre and Gana
glosses refined; two new pronoun candidates logged unconfirmed;
an·chaa/an·chi-jakchi nanga left open (Project Owner direct relay):**
> "ma·jong is the correct one also where as a relative pronoun = jeon,
> or jeo where as an interrogative pronoun = bachina?/bao?/bano? this
> I'm not sure of, but according to the meaning given in Holbrook's
> dictionary an'sre = the front end of a non-Christian Garo man's
> loincloth. Gana (verb) = to put on, clothe. Gana (noun) = dress (or
> cloth) worn by Garo women to cover the lower body. an'chaa/an'chi-
> jakchi nanga = (no reference to check this)."

Five items, three closed, two logged unconfirmed:

1. **`a·jong` vs `ma·jong`** (open item from this session's audit) —
   closed. `ma·jong` confirmed correct; promoted VERIFIED/HIGH.
   `a·jong` (previously VERIFIED/HIGH/doc7 under "Mother's elder
   sister") superseded, not deleted.
2. **`An-sre`** — generic "a wearing apparel." gloss refined per
   Holbrook's dictionary (documented-source citation, not a native-
   speaker confirmation): front end of a non-Christian Garo man's
   loincloth.
3. **`Gana` (verb)** — existing gloss "to wear; to put on; to dress."
   corroborated directly.
   **`Gana` (noun)** — generic "a wearing apparel." gloss refined:
   dress/cloth worn by Garo women to cover the lower body.
4. **Two new pronoun candidates logged, NOT promoted** (net-new
   vocabulary, no corpus support, no formal confirmation ritual):
   - relative pronoun "which" = `jeon`/`jeo` (PL-0002012) — stated
     without hedging, but still logged pending vs. promoted per
     evidence-first discipline.
   - interrogative pronoun "which" = `bachina?`/`bao?`/`bano?`
     (PL-0002013) — Project Owner explicitly unsure. Also collides
     with the existing `Bachina` = "to which place." (locative) sense;
     needs disambiguation, not just confirmation.
5. **`An·chaa`/`An·chi-jakchi nanga`** ("to have sexual intercourse.")
   — Project Owner confirmed no reference available to check either
   form. Left open, both entries annotated, neither promoted nor
   superseded.

**Action taken:** `master_dictionary.json` — 7 entries annotated
(1 promoted VERIFIED/HIGH, 1 superseded, 2 refined with source
citation, 1 corroborated, 2 flagged open/no-reference).
`src/data/pending_lexicon.json` — 2 new candidate entries added,
`needs-discussion`, not promoted. No engine code touched. Full suite
re-run before commit.

---

**NV-054, 2026-08-03 — where-cluster (jeon/jeo, bachi/bao/bano/banona/
banoni) and angry (ka'o nanga) confirmed; PL-0002012/PL-0002013
resolved as mislabeled "which" (Thangseng direct native validation,
via Tridip WhatsApp relay):**
> "where as a relative pronoun = jeon, or jeo / where as an
> interrogative pronoun = bachina?/bao?/bano? ... Bachi implies no
> particular destination. It simply means 'where to?' ... Bao is not
> used for places. It is probably a shortened version of bano. It is
> usually used for the placement of objects ... Bano can also take
> suffix. Banona = Where to? Banoni = Where from? ... Angry = ka'o
> nanga."

Key finding: this is a **direct native transcript**, not a Project
Owner relay — it retroactively clarifies that NV-053's pending
candidates PL-0002012/PL-0002013 (logged as "which") were mislabeled;
Thangseng's actual answer was about "where", not "which".

Six items closed:

1. **`jeon`/`jeo`** — relative pronoun "where" (not "which").
   Promoted PL-0002012 to master_dictionary.json, VERIFIED/HIGH, two
   entries (free variants).
2. **`bachina?`/`bao?`/`bano?`** — interrogative "where" (not
   "which"). PL-0002013 resolved as not-promoted-duplicate: already
   covered by existing Bachina/Bachi/Bao/Bano entries and RULE-044.
   No new sense.
3. **`Bao` refined** — native states Bao is NOT used for places, is
   probably a shortened `bano`, and is normally used for the location
   of objects (e.g. "Angni ki·tap bao?" = "Where is my book?").
   Narrows RULE-044's prior "bare interrogative, no locative suffix"
   characterization. Dictionary entry and RULE-044 both updated.
4. **`banona`** ("where to?") and **`banoni`** ("where from?") — new
   standalone VERIFIED/HIGH entries; bano + -na/-ni suffixes,
   corroborating the -ni sense already embedded in the pre-existing
   "Na·a banoni?" = "Where are you from?" sentence.
5. **6 new VERIFIED/HIGH example sentences** added to
   `master_dictionary.json`: "Where is my book?", "Where did you put
   my book?", "Where does he live?", "Where should I put the book?",
   "From where did you buy this dress?", plus the pre-existing "Where
   are you going?" reconfirmed as exact match (no change needed).
6. **`angry` = `ka'o nanga`** — direct confirmation. Promoted the
   existing `ka·o·nang·a` UNVERIFIED/HIGH variant to VERIFIED/HIGH.
   3 new VERIFIED/HIGH sentences added: "Do not be angry.", "Is he
   angry?", "Do not make the children angry." Not reconciled against
   the two other unrelated "angry" clusters already in the dictionary
   (`bi·ka so·a`/`hel·hel`, and `an'chi ding·na`/`Ka-chaa`
   secondary-sense) — flagged as a three-way unreconciled synonym
   cluster, not resolved here.

**Action taken:** `master_dictionary.json` — 12 entries added
(6 vocabulary/suffix entries, 6 example sentences), 2 entries
annotated/refined (`ka·o·nang·a` promoted, `Bao` note updated).
`src/data/pending_lexicon.json` — PL-0002012 marked
resolved-promoted, PL-0002013 marked resolved-not-promoted-duplicate.
`docs/grammar_rules_structured/RULE-044.yaml` — native_notes appended
documenting the Bao refinement and banona/banoni suffixes; core -chi/-o
movement claim unaffected. No engine code touched. Full linguistic
review only — runtime propagation handed off to Claude B (see Runtime
Handoff).

---

**NV-021 follow-up, 2026-07-19 (relayed 2026-08-03) — object-case
"want" construction, need/want re-confirmed, bag-o hyphen resolved
(Thangseng, direct, via Tridip WhatsApp):**
> "Usually, wanting water and food is talked in terms of wanting to
> eat and drink. (Anga) Chi ringna skenga. = I want to drink water...
> the usual 'ko' suffix is dropped... Likewise, 'apple cha'na skenga'
> translates into 'i want to eat apple'... Need = nanga. Want = ska...
> the hyph[en] has no function here except distinguishing between the
> English word and the Garo suffix."

Three items closed:

1. **Object-case "want" construction resolved.** "I want water"/"I
   want food" are not object+`ko`+`ska` directly — they're reframed as
   "want to drink/eat", with `ko` dropped: `chi ringna skenga` (not
   `chi·ko ringna skenga`). Corrected `corrections.json` and
   `master_dictionary.json` for "i want water" (`Anga chi ringna
   skenga`) and "i want food" (`Anga mi cha·na skenga`, by direct
   analogy to the stated apple/eat example - "mi" itself not
   independently confirmed word-for-word, flagged). "I want to see
   you" already has its own verb (`nina`) so `ko` is retained; only
   the root corrected `sikenga`→`skenga`.
2. **`need`=`nanga`, `want`=`ska` re-confirmed directly** — matches
   the corpus-internal fix already applied this session (before this
   message arrived) from already-VERIFIED NV-005/NV-016 evidence.
   No further action; both sources now agree.
3. **`bag-o` hyphen resolved** — purely orthographic (loanword/suffix
   boundary marker), not raka. `Kolomko bag-o sikatbo` ("put the pen
   inside the bag") added to `master_dictionary.json`, VERIFIED/HIGH -
   first time this sentence has been added anywhere.

**New discrepancy surfaced, NOT resolved:** today's examples use
`skenga` (continuous of `ska`) throughout, but the 10 already-
implemented "i want to X" sentences (NV-021, 2026-07-18) use bare
`ska` for the identical verb+na+X frame (e.g. `Anga cha·na ska` = "i
want to eat", vs. today's `apple cha'na skenga` = "i want to eat
apple"). Left untouched pending clarification — free variation,
register difference, or real tense/aspect distinction is unclear from
current evidence.

**Action taken:** `master_dictionary.json` — 4 entries added, 2
superseded/cited. `src/data/corrections.json` — 3 entries corrected.
`docs/PENDING_LINGUISTIC_PROPOSAL_20260718_sikenga_ska_sika.md` — all
three "still open" items marked resolved with citations. No engine
code touched.

---

**NV-055, 2026-08-04 — "salt" = kari confirmed, resolves 2026-08-01
supersession dispute (Tridip relay):**
> Translation of "salt" into Garo: kari

Resolves the open Claude-A handoff flagged in
`docs/RUNTIME_ENGINEERING_AUDIT_20260803.md` ('salt' section): a
2026-08-01 corpus-internal audit had marked `master_dictionary.json`'s
`salt`→`Kari` entries SUPERSEDED in favor of `Salt`→`kai·sim` (tagged
`variant/VERIFIED/HIGH` with no clear citation trail). Direct native
confirmation now settles it: `kari` is correct.

**Action taken:** `master_dictionary.json` — idx 215 (`salt (noun)`→
`Kari`) promoted VERIFIED/HIGH; idx 472 (`salt`→`Kari`) un-superseded,
resolved; idx 3543 (`Salt`→`kai·sim`) annotated CONTRADICTED, not
deleted per citation discipline. No new entries added — existing
`Kari` entries reused, no duplicates created.
`docs/RUNTIME_ENGINEERING_AUDIT_20260803.md` — resolution note appended
to the 'salt' section. The underlying `pickPrimary`/`grammarOverrides`
precedence bug remains Claude B's task, now unblocked by having a
single, uncontested VERIFIED candidate to point the fix at.

---

**NV-056, 2026-08-03/04 — jean="which" (distinct from jeon/jeo="where"),
4 new banona/banoni examples, adult/mature confirmed (Thangseng, via
Tridip WhatsApp):**
> Bano can take 'na,' 'ni'. Example: Banona = where to?; Banoni = Where
> from? Banoni re'baa na'ara? = where did you come from? Banoni
> mandesa iara? = where is this man from? Ia ki'tapko banona ra'angbo?
> = Where should I take this book to? Banona re'angbo angara? = Where
> should I go to? [...] jeon/jeo is relative 'where'. jean is relative
> 'which'. [...] dal'gimin = mature; brigimin = mature; dal'gimin
> mande = adult.

Three items closed:

1. **`jean` = relative "which"**, genuinely distinct from `jeon`/`jeo`
   ("where", NV-054). This resolves the ambiguity NV-053/NV-054 left
   open about whether a separate "which" word exists — it does.
   New VERIFIED/HIGH entry.
2. **4 new banona/banoni example sentences** added — see RULE-044 for
   the grammar-side note. Two of the four glosses ("where did you come
   from?", "where should I go to?") already had older, unverified
   legacy entries with different word order/construction; not
   overwritten, both retained, flagged as unreconciled.
3. **adult/mature**: `dal·gimin` and `brigimin` both confirmed as
   "mature" (new entries, coexisting with the pre-existing unverified
   `dil·ding bal·jak`, not reconciled); `dal·gimin mande` ("mature
   person") confirmed as "adult" - first time this word is added.

**Not answered in this transcript, still open:** the 3 flagged "to X"
substitutions (to commit adultery→Gro daka, to hang→al·a·i·na, to
support→Chaka) and the three-way "angry" cluster were relayed as
questions by the Project Owner in this same conversation but Thangseng's
replies here only cover the bano-suffix and jean/adult topics — those
two items remain genuinely unanswered, not resolved by this transcript.

**Action taken:** `master_dictionary.json` — 7 entries added (jean,
4 example sentences, mature×2, adult). No entries overwritten;
existing unverified legacy entries with overlapping English glosses
retained and cross-referenced, not deleted. `docs/grammar_rules_
structured/RULE-044.yaml` — native_notes appended. No engine code
touched.

---

**NV-057, 2026-06-30 (relayed 2026-08-04) — closes
PENDING_DIALECT_DISCREPANCY_20260629.md (Thangseng, via Tridip
WhatsApp):**
> both works depending on how you use it. But it may be better to
> remove 'ha'. Let's just say re'baa and on'a.

Resolves the last open item from the 2026-06-29 two-speaker
discrepancy: "who gave you this?" (`on'aha` vs `on'a`) and "why did
you come?" (`re'baaha` vs `re'baa`, already flagged resolved same-day
by an earlier answer) are both register/style variants, not errors,
with the shorter form recommended — matching what was already live in
`corrections.json`.

**Action taken:** `master_dictionary.json` — added "who gave you
this?"→`Sawa nang·na iako on·a?` (new), updated "why did you come?"
(idx 939) with citation. `docs/PENDING_DIALECT_DISCREPANCY_20260629.md`
closed in full (all 3 items resolved). No `corrections.json` changes
needed — already on the confirmed forms.

---

**NV-018 follow-up, 2026-07-18 (relayed 2026-08-04) — closes the `ama`
homonymy resolution flagged in
`PENDING_LINGUISTIC_PROPOSAL_20260716_family_terms.md` §3 (Thangseng,
via Tridip WhatsApp):**
> Yes, ama has the same spelling in both the meanings. No difference.
> ... ama is not 'can eat'. It only means can and for mother we have
> replaced with A.ai (Remember the raka in a.ai).

Two messages received this round were duplicate relays of
already-logged NV-018/NV-019 (`ama`="can" not "can eat"; `Bal`≠"wind")
— no new action for those. The genuinely new piece: **mother's
address-register word has moved to `a·ai`**, retiring the collision-
prone bare `ama` from that sense entirely rather than disambiguating
it by context.

**Action taken:** `master_dictionary.json` — added `can`→`ama`
(VERIFIED/HIGH, general ability modal) and `mother (address form)`→
`a·ai` (VERIFIED/HIGH, new); annotated the legacy `mother`→`Ma / Ama`
entry noting `Ama` is retired from this sense. §3 of the family_terms
doc closed. **Still open:** whether `apa`/`ama` (as concepts) are
address-only or usable as a full sentence subject — Thangseng said
he'd answer later; moot for `ama` now that it's retired from the
mother sense, but still open for `apa` (father).

---

## NV-058 — RULE-035 `mitapo` vs. `kokkimao`/`nokkimao` reconfirmed, spelling canonicalized — CLOSED 2026-08-04

**Direct Project Owner confirmation (2026-08-04):**
> mitapo will be used when the word 'underneath' is used to talk about
> something that is under a sheet or a slab. In other cases kokkimao
> or nokkimao is also used (we shall use only one) these are same
> words.

Reconfirms the sense split RULE-035/NV-004 already established:
`mitapo` exclusively for the sheet/slab/covering sense; `kokkimao`/
`nokkimao` for all other "under" cases. New piece resolved today: the
long-standing "both are legitimate variants" note (RULE-033, logged
2026-07-08) is now settled to a single canonical spelling —
`kokkimao` and `nokkimao` are the same word, `kokkimao` is canonical
(already the form `master_dictionary.json` used). `nokkimao` is a
deprecated spelling variant going forward, not a separate sense.

This confirmation does not mention `ning'ao`; NV-004's 2026-07-25
three-way finding (`ning'ao` as general-purpose default, `mitapo` as
covering-sense alternate, `nokkimao`/`kokkimao` for the more specific
"covered-under" sense) stands unchanged — today's input isn't in
tension with it, just narrower in scope.

**Action taken:** `master_dictionary.json` — added
`"under (sheet/slab/covering)"`→`Mitapo` (VERIFIED/HIGH, new); the
existing `under`→`Kokkimao` entry annotated as canonical spelling with
`nokkimao` noted as the deprecated variant. `RULE-035.yaml` claims
updated from `needs_native_validation`/medium to `verified`/high for
the sense-distinction claim (worked full-sentence example for the
`mitapo` side specifically remains open, non-urgent). `RULE-033` and
`RULE-035` entries in `GRAMMAR_RULE_CATALOGUE.md` updated with
2026-08-04 notes. Existing doc examples elsewhere using `nokkimao`
spelling are historical and not bulk-edited this session.

---

## NV-059 — `Bajal Anti` market imperative — RESOLVED 2026-08-05, see NV-060

**Trigger:** Claude C's audit (2026-08-04, Finding 1) flagged `master_dictionary.json`
`"let's go to market"`/`"let's go to the market"` → `Hai Bajal Anti Re·na` as
possible `Anti`(week)-contamination in market phrases, blocking on a Claude A call.

**Resolved by existing evidence (no guess):** `Anti` is not exclusively "week" —
`pending_lexicon.json` `PL-0001992` records Project Owner direct confirmation
(2026-08-02, same session as NV-052) that `Anti` genuinely also means market/bazaar;
NV-052 chose `Bajal` as the *standardized* standalone `market` word among synonyms,
it did not invalidate `Anti`'s market sense. So `Bajal Anti` is not obviously the
same class of error as the other 7 rows in Finding 1 (where `Anti` sits alone
against the standardized `Bajal`).

**Not resolved:** whether `Bajal Anti` together is the correct/idiomatic phrase for
this specific imperative, or a duplication artifact. Full reasoning and the exact
follow-up question to send Thangseng: `docs/CLAUDE_A_RESPONSE_20260804_audit_finding1.md`.

**Action taken:** No `master_dictionary.json` change — rows 83–85 held pending
native confirmation. Response doc written for Claude B/C. Independent Finding-1 rows
(86, 712, 713, 714, 759, 764, `phrase_maps.js:89`) are clear to fix without waiting
on this.

## NV-060 — Market locative paradigm — RESOLVED 2026-08-05

**Trigger:** NV-059 (above), targeted native check.

**Native evidence (Thangseng, via Tridip WhatsApp, 2026-08-05), unprompted, full set:**
- Let's go to market. = Hai bajalchi re'na. (Garo has no article "the")
- Let's go to the market. = Hai bajalchi re'na. (the "the" is simply assumed)
- I am at the market. = Anga bajalo.
- Go to the market. = Bajalchi re'angbo.
- The market is nearby. = Bajalde sambaon. / Bajalara sambaon.
- Tomorrow is market day. = Knalde bajal sal.

**Resolution:** `Anti` is not part of the "let's go to market" idiom — native gave
the bare form with no "Anti" for both English variants (article-less, as expected).
`master_dictionary.json` "let's go to market" / "let's go to the market" corrected
from `Hai Bajal Anti Re·na` → `Hai bajalchi re'na`. This confirms Claude B's 2026-08-04
revert in `phrase_maps.js` (bare `'market': 'Bajal'`) was the right call — no engine
change needed.

**Paradigm value:** confirms RULE-044 (`-chi` = movement-to, `-o` = no-movement
locative) cleanly across "at the market" (`bajalo`) vs. "go to the market"
(`bajalchi`). Also introduces `-de`/`-ara` as free-variant topic/subject markers on
`bajal` ("nearby" sentence) — distinction between the two not yet characterized,
flagged for a future question if it matters for the engine.

**5 new VERIFIED/HIGH entries added**, 2 existing entries corrected.

## NV-061 — "to hang": sitea vs. kadea — PARTIALLY RESOLVED 2026-08-05

**Trigger:** flagged item "to hang → al·a·i·na", awaiting native-speaker confirmation.

**Native evidence:** "To hang = sitea (to hang by letting a thing hang on something,
may be a nail, or anything); kadea (to hang by tying on something)."

**Resolution:** two distinct verbs by manner, both new/reconfirmed VERIFIED/HIGH:
`sitea` (dangle-hang, new entry) and `kadea` (tie-hang — this un-supersedes the
2026-08-01 corpus-audit demotion of the existing `Kadea` entry, which had been
deprioritized on citation-count grounds alone, without native input).

**Not resolved:** `al·a·i·na` (the specific flagged candidate) was not repeated back
or endorsed by native when asked directly — its existing VERIFIED/HIGH/doc7 status is
left unchanged, but flagged for a future targeted check, since native volunteered
different vocabulary instead. Do not treat as confirmed.

## NV-062 — Adultery: Til'eka — PARTIALLY RESOLVED 2026-08-05

**Trigger:** flagged item "to commit adultery → Gro daka", awaiting native-speaker
confirmation.

**Native evidence:** "Adultery = Til'eka."

**Resolution:** `Til'eka` added as new VERIFIED/HIGH noun entry for "adultery" — matches
the `tileka` component of the existing UNVERIFIED/MEDIUM `Jua ba tileka` entry.

**Not resolved:** native did not repeat back or endorse `Gro daka` (the specific
flagged verb candidate for "to commit adultery"); it remains open, neither confirmed
nor rejected. The existing VERIFIED/HIGH/doc7 `an·chak·na` ("to commit adultery")
entry is unaffected either way.

## NV-063 — "to support" = chaka — RESOLVED 2026-08-05

**Trigger:** flagged item "to support → Chaka", awaiting native-speaker confirmation.

**Native evidence:** "to support = chaka" — exact match to the flagged candidate.

**Resolution:** `Chaka` promoted from SUPERSEDED to VERIFIED/HIGH. Coexists with
`al·du·na` (VERIFIED/HIGH/doc7) — both accepted; not reconciled as synonyms vs.
distinct senses, no further action without new evidence.

## NV-054 follow-up — angry cluster, additional confirmed forms — 2026-08-05

**Native evidence:** "angry = ka'o nanga (most common usage), bika ding'a, bika chaa
(metaphorical usage). ka'chaa = to reprimand, to scold."

Two new VERIFIED/HIGH entries added (`bika ding'a`, `bika chaa`), spelled distinctly
from the pre-existing unreconciled `bi·ka so·a`/`hel·hel` cluster from NV-054 — not
merged, no guess made about whether they're the same words differently transcribed.
The `ka'chaa` = "to reprimand/scold" primary-sense reading reconfirms the existing
2026-07-25 native correction on the `Ka-chaa` entries verbatim.

## Check C build-gate reconfirmations — 2026-08-05

Native reconfirmed, via Tridip WhatsApp:
- **can**: both `man·a` and `ama` correct ("Man·a, ama"). `man·a` promoted
  UNVERIFIED/HIGH → VERIFIED/HIGH.
- **where did you come from?**: both `Na·a banoni reba·a?` and `Banoni re'baa na'ara?`
  (NV-056) confirmed correct, free variants, not ranked. Former promoted to
  VERIFIED/HIGH.
- **mature**: `dal·gimin` and `brigimin` (NV-056) reconfirmed. The third variant
  `dil·ding bal·jak` was NOT repeated back this time — still unconfirmed, not
  selected, left as-is (no guess).

Check C's fourth item, `jeon`/`jeo` ("where," relative pronoun), was not asked this
round — still open.

## Boka / "to demand unduly" (PL-0001540) — PARTIALLY ADDRESSED 2026-08-05

Native confirmed `Boka` = white cleanly (already correctly reflected in
`master_dictionary.json`; citation added). The polysemy question — whether `Boka Boka`
also legitimately means "to demand unduly" — was NOT addressed; native gave no
comment on that sense at all. **Still open per evidence-first discipline** (silence is
not resolution). Separately, native tentatively offered `dabia` ("I think we can use
'dabia' for this one as well...") as a possible independent word for "to demand
unduly" — hedged, not a firm confirmation. Logged as a `tentative_candidate` on
`PL-0001540` in `pending_lexicon.json`, not promoted to `master_dictionary.json`.

## NV-064 — Final closure batch: chiko/chibimao, jeon/jeo, Gro daka, al·a·i·na, dil·ding bal·jak — RESOLVED 2026-08-06

Project Owner-relayed native final words (Thangseng), treated per Project Owner
direction as authoritative/closing (not requiring further reconfirmation round):

- **`chibimao` = "at/in the river"** — reconfirms NV-051, VERIFIED/HIGH, unchanged garo.
- **`chiko` = "the water"** — NOT a competing form of `chibimao`/"at the river" as
  NV-051 had flagged. Reclassified: `chiko` english key changed from "at the river"
  to "the water". Distinct from bare `Chi` ("water"/"the water") — assessed as `chi` +
  `-ko` topic/emphatic marker, both entries correct and kept separate (allowlisted in
  `known_dictionary_conflicts.json`, not merged). Resolves the "not answered" item
  from 2026-08-05.
- **`jeon` = "where" (relative pronoun)**, **`jeo` = "where" (relative pronoun), short
  form of `jeon`** — reconfirms NV-054, VERIFIED/HIGH, free variants. Relationship
  (jeo = short form of jeon) newly clarified.
- **`Gro daka` = "to owe something"** — resolves the NV-062 "not answered" item, but
  in a *different* sense than the one asked about there. Native did not confirm or
  reject the "commit adultery" sense; instead gave "to owe something," matching the
  pre-existing unverified `Gro daka` -> "to be in debt." entry, now promoted to
  VERIFIED/HIGH. The "commit adultery" sense of `Gro daka` remains untouched —
  already SUPERSEDED since 2026-08-01 in favor of `an·chak·na (2)`, not reopened.
  `Gro daka`'s other senses ("to commit an offence", "to break the law") also
  untouched — polysemous root, each sense stands on its own evidence.
- **`al·a·i·na` for "to hang"** — REJECTED. Native does not recognize the word;
  assessed as a probable mis-transcription of something else. Superseded by the
  existing confirmed `sitea`/`kadea` distinction, NV-061.
- **`dil·ding bal·jak`** (for both "mature" and "adolescent") — REJECTED. Native does
  not recognize the word; assessed as possibly real but out of current usage. "mature"
  stays resolved via `dal·gimin`/`brigimin` (NV-056). "adolescent" has no replacement
  candidate on record — key stays open, entry marked REJECTED rather than deleted.

All entries retained (not deleted) per citation discipline. `known_dictionary_conflicts.json`:
+1 key (`the water`). `repository-intelligence.js`: 0 new violations across all checks.
`test-dictionary.js`: 8055/8055.

## Not answered / still open (remain open, no guess made)

- **"adolescent"** — `dil·ding bal·jak` REJECTED 2026-08-06 (NV-064); no replacement
  candidate on record.
- **`Bal` = "air" / "a bundle" / "a load" / "a big basket"** — NV-020 flower sense
  closed 2026-08-06 (see below); these four senses still unaddressed.
- **~9 same-english-key raka/orthography pairs with no confidence tag on either
  side** (duplicate audit, 2026-08-06 — see
  `docs/CLAUDE_B_HANDOFF_20260806_supersede_precedence_bug.md` for full context):
  `laugh` (`Ka·ding·a` vs `Ka·dinga`), `mouth` (`Ku·sik` vs `Kusik`), `joking`
  (`kal·akenga` vs `Ka·lakenga`), `at` (`·o` vs `O`), `bright` (`ching·a` vs
  `Ching·a`), `sad` (`duk ong·a` vs `Duk ong·a`), `"praise the lord"`
  (`Gitelna rasong` vs `Gitel na rasong`), `direct`/`straight` (shared
  `tong·tang`/`·tong·tang·` pair, unclear which headword it belongs under).
  Neither side of any pair is marked correct — no evidence-first basis to
  pick one without asking.
- **"who gave you this" — keep or drop trailing `?`** — this is a JSON key-naming /
  schema question (source-of-truth: `corrections.json` vs. `compiled_dict.json`), not
  a linguistic question; native did not and would not be expected to address it.
  Remains Claude B's / Project Owner's call.



## Working-note: informant methodology, 2026-08-05

Thangseng, unprompted, on why fewer alternate translations are volunteered per entry:
"We've been refraining from giving too many possible translations because it might
confuse the system." Worth keeping in mind when native answers seem terser than the
question asked — it may be a deliberate simplification choice on the informant's side,
not incomplete knowledge.

## NV-065 — "i have not eaten", closed 2026-08-06

Project Owner-relayed WhatsApp exchange, 2026-08-06:
> Tridip: i have not eaten?
> Thangseng: Anga cha.kuja.

Canonicalized `.` → `·` (root `cha·` "eat" is a confirmed-raka root per
`docs/GRAMMAR_RAKA_RULE_CONFIRMED_20260626.md` — raka is total across all
inflected forms of a root, so this isn't a guess, it's the standing rule
applied). `-kuja` is an already-established productive negative suffix,
independently confirmed on two other roots: `minkuja` (NV-050, "not
ripe", negative of `mina`) and `re·bakuja` (`NEW_SENTENCES_BATCH2_NATIVE.md`,
"not coming", negative of `re·ba`). `cha·kuja` fits the same pattern
exactly — negative perfect of `cha·` (eat).

**Resolves a real bug, not just a gap fill:** prior to this, `translate()`
resolved "i have not eaten" via grammar-assembly fallback to `Anga dongja`
("i don't have" — wrong lexical match, unrelated to eating), flagged
during this session's runtime-error check. Root cause was absence of a
`corrections.json` entry for this exact phrase, so it fell through to a
mismatched pattern.

**Fix applied:** added `"i have not eaten": "Anga cha·kuja"` to
`src/data/corrections.json` (`corrections`-precedence beats
grammar-assembly, so this closes the mismatch directly).

## NV-066 — PL-0001540 (`Boka Boka` polysemy) — CLOSED 2026-08-06

Project Owner relay, 2026-08-06: "it's only Boka meaning white and
dabia = deman[d] unduly / demand."

Confirms the print dictionary's merge of "white" and "to demand unduly"
under one `Boka` headword was a homonym-collision error, same failure
mode as the Kajina/Kajana collision (NV-032) — not genuine polysemy.
`Boka` = white only. The 2026-08-05 hedged `dabia` candidate is now
firm. **Applied:** `pending_lexicon.json` PL-0001540 marked
`rejected-redirected`; `master_dictionary.json` gained two new
VERIFIED/HIGH entries, `"to demand unduly": "dabia"` and
`"to demand": "dabia"`.

## NV-028 followup — `jegrika` meaning reconfirmed, orthography still open — 2026-08-06

Thangseng, via Tridip WhatsApp: "jegrika? Quarrel." Second independent
confirmation of the meaning (first was 2026-07-22, "Quarrel is
jegrika"). Raka placement still not given by native either time — the
orthography half of NV-028 stays open. **Applied:** added `jegrika` to
`master_dictionary.json` as UNVERIFIED/HIGH (meaning solid, spelling
provisional, flagged not to feed raka-locality tooling until confirmed).

Same relay also closed the other half of NV-028: "Kajia=fight." Confirms
`Kajia` is a real, distinct word (not a Kajina/Kajana-style collision) —
corroborates the existing quarrel/dispute/wrangling/to-dispute glosses
already in `master_dictionary.json`. **Applied:** citation added to all
4 `Kajia` entries. `jegrika` and `Kajia` stand as two real, separate
"quarrel" words — no register/distribution distinction asked or given;
not assuming one.

## NV-020 followup — flower sense: `Bal` rejected, two new words confirmed — 2026-08-06

Thangseng, via Tridip WhatsApp: "Bal flower/air/basket? Flower - bibal
(if only the flower itself is meant) / Flower - pul (the whole flower
plant)."

Native gave two *different* words instead of confirming `Bal` — this is
a rejection of the "A flower" sense currently sitting under `Bal` in
`master_dictionary.json` (index-independent match, print-dictionary
sense), not a confirmation of it. `Bibal` was already the correct entry
for "flower" (now reconfirmed); `pul` for "flower plant" (whole plant)
is new. **Applied:** `Bal`/"A flower" entry marked REJECTED with full
citation; `flower`/`Bibal` entry got a reinforcing citation; new entry
`"flower plant": "pul"` added, VERIFIED/HIGH.

**NV-020 is only partially closed.** The flower sense is now resolved
(negatively). The air/basket/bundle/load senses under `Bal` — "air"
(index-independent), "a bundle", "a load", "a big basket" — were not
addressed by this answer and remain unconfirmed. Do not close NV-020 as
fully resolved; a follow-up ask on air/basket specifically is still
needed if the Project Owner wants those closed too.

## NV-027 remainder — `bika so'a`/`hel'hel` — CLOSED (native unfamiliar), no dictionary entries existed

Thangseng, via Tridip WhatsApp, 2026-08-06: "bika so'a/hel'hel? I have
no idea."

Neither term was ever promoted to `master_dictionary.json` or
`pending_lexicon.json` — both were print-dictionary candidates flagged
during the NV-027 "angry cluster" review and never used in production.
Native not recognizing them closes the investigation thread: no further
native ask needed, and there is nothing live in the dictionary to
correct or roll back. Leaving as a documented dead end (possible OCR
noise, a different Garo register/dialect, or a print-dictionary error)
rather than guessing a resolution.

## "laugh" orthography — CLOSED 2026-08-06

Project Owner relay, Thangseng direct: "ka·dinga example - Why do you laugh?
na.a maina ka.dinga?"

Canonicalized `.` → `·`. Confirms `Ka·dinga` (single raka, before "dinga"
only) over `Ka·ding·a` (double raka) — resolves the unlabeled-duplicate
pair flagged in the 2026-08-06 duplicate audit. **Applied:** `Ka·ding·a`
marked SUPERSEDED in `master_dictionary.json`; `Ka·dinga` marked
VERIFIED/HIGH. Also fixed the same wrong value in `src/data/phrase_maps.js`
(a separate, higher-precedence override table `translate()` checks before
`compiled_dict.json` — it had `'laugh': 'Ka·ding·a'` independently of
`master_dictionary.json`, so master's SUPERSEDED marker alone wouldn't have
fixed live translation output even after Claude B's precedence-bug fix
lands).

The example sentence also gave a second confirmed word order for "why do
you laugh?": `Na·a maina ka·dinga?` (subject-first), alongside the
existing `Maina na·a ka·dinga?`/`Maina (na·a) ka·dinga?` (question-word-
first). Added as a new `variant/VERIFIED/HIGH` entry.

**Follow-on finding:** checking `phrase_maps.js` for the same
SUPERSEDED-vs-shipped-value bug pattern found 5 more affected entries —
`forest`, `some`, `all`, `god`, `white` — all independently confirmed via
`docs/CLAUDE_B_HANDOFF_20260806_supersede_precedence_bug.md`'s cross-
reference. Fixed `forest` and `some` with full confidence (exactly one
VERIFIED/HIGH replacement each). `all`, `god`, `white` each have 2-3
VERIFIED/HIGH synonym candidates in `master_dictionary.json` with no
native confirmation of which is primary — picked the orthographically
closest match to the legacy spelling as a provisional single value
(phrase_maps.js can only hold one), flagged inline as provisional, not
guessed at as a firm linguistic conclusion.

## "laugh"/"smile" cluster — FULLY ELIMINATED, 2026-08-06

Follow-up Project Owner relay: "Ka·ding·a is a wrong word for smile
replace with ka.dingsmita as instructed." This resolved the caution
flagged earlier the same day (that `Ka·ding·a` looked like a legitimate
VERIFIED word for "smile") — it wasn't; both the "laugh" and "smile"
uses of `Ka·ding·a` were wrong, `Ka·dingsmita` is the one correct
"smile" word.

**Applied — full repo sweep, not just `master_dictionary.json`:**
Removed every `Ka·ding·a` entry for "laugh"/"smile" (not just marked
SUPERSEDED — actually deleted, per explicit Project Owner instruction
that retained duplicates were themselves the problem) from
`master_dictionary.json`, `garo_dictionary.json` (a live compile-pipeline
source file — this is likely where the wrong value originally entered
the corpus from), `final_entries.json` (an orphaned, non-pipeline
snapshot, fixed anyway for repo-wide consistency), and `phrase_maps.js`/
`corrections.json` (already fixed earlier the same session). `Ka·dingsmita`
is now the sole "smile" word throughout.

Also closed with direct native answers: `laughter` = `Ka·dingani` (was
wrongly duplicating the verb `Ka·dinga`), `smiled` = `Ka·dingsmitaha`
(past tense, root+aha pattern). Both added to `master_dictionary.json`
and `irregular_verbs.json`.

## Global hyphen→raka conversion — executed, 2026-08-06

Project Owner instruction: "all hyphens needs to be replaced with rakka
if exist, hyphens are wrong entry." Converts every remaining literal `-`
in every `garo` field across the repo to `·`, per the standing native
rule already on record ("ALL hyphens become raka, no exceptions",
`docs/GLOBAL_RAKA_CONVERSION_HANDOFF.md`) — this closes the gap flagged
earlier the same day (328 entries had never received the 2026-06-18
global conversion, since it was a one-time script rather than an
enforced rule). Converted 327 `master_dictionary.json` entries and 332
`pending_lexicon.json` promotion records (kept in sync so Check D
doesn't flag stale references). `garo_dictionary.json`, `final_entries.json`,
`phrase_maps.js`, and `corrections.json` already had zero hyphens.

## NV-067: smiled reconfirmed; mouth = Ku·sik (2026-08-08)

Project Owner relay, Thangseng direct:
- **smiled = Ka·dingsmitaha** — reconfirms the existing VERIFIED/HIGH
  entry (added 2026-08-06, laugh/smile elimination pass) unchanged.
  Already correct in master_dictionary.json/irregular_verbs.json/
  compiled_dict.json, no action needed.
- **mouth = Ku·sik** (with raka) — closes the open no-confidence-tag
  orthography pair flagged in the 2026-08-06 duplicate sweep
  (`.ai/WORKSTATE.yaml` `latest_6`). master_dictionary.json's existing
  `Ku·sik` entry (idx 140) promoted to VERIFIED/HIGH; the no-raka
  duplicate `Kusik` (idx 3022, health category) marked SUPERSEDED,
  retained per citation discipline, not deleted.
  `known_dictionary_conflicts.json`'s existing "mouth" allowlist entry
  stays as-is (Check C correctly expects 2 garo values under this key).

Remaining no-confidence-tag orthography pairs from the same 2026-08-06
sweep, still open: joking, at, bright, sad, "praise the lord",
direct/straight.

## Runtime bug found during NV-067 verification (2026-08-08, Claude A -> Claude B handoff)

`compiled_dict.json['smile']` ships **`ka·ding·sim·ik·a`** — the
never-native-confirmed candidate — instead of the VERIFIED/HIGH
`Ka·dingsmita`. Root cause is `prepare-data.js`'s `masterEntries`
(master-preference) branch in `pickPrimary()`: it ignores `isVariant`
entirely, so a lone `variant/VERIFIED/HIGH`-tagged master entry under
key "smile" (from `english: "Smile"`) wins outright, and the bare-
infinitive alias step (`"to smile"` -> `"smile"`) never fires because
it only fills a *missing* key, not an existing variant-shadowed one.
This is the same failure shape as the SUPERSEDED-precedence bug
(`9b5d61b`) but for `isVariant`, not `isSuperseded` — master-preference
should likely also skip variant-tagged-only candidate sets, or the
alias step should run before master-preference resolves a variant-only
key. Not fixed here — engine logic, Claude B's territory. The
underlying data is correct and unambiguous (`Ka·dingsmita` VERIFIED/HIGH,
`ka·ding·sim·ik·a` explicitly flagged unconfirmed) — this is purely a
compile-precedence bug, not a linguistic question.

## NV-068: dambe/bi·sa semantic correction (2026-08-08)

**Corrects a wrong interpretation already relayed to Claude B this
session (2026-08-07 raka-fix commit, WORKSTATE.yaml claude_b section:
"bi·sa (child/young-offspring morpheme)").** That framing wrongly
implied `bi·sa` itself means "young one." Native re-clarification
(Thangseng, via Tridip/WhatsApp) corrects this:

- **dambe = "young"** (adjective/modifier)
- **bi·sa = "offspring"** (noun)
- These are two distinct morphemes, not one word with a blended sense.

Confirmed compounds (goat, directly from transcript):
- **do·bok dambe = "young goat"** (new entry, added this session)
- **do·bok bi·sa = "kid" / "baby goat"** (already correct in the
  dictionary; Thangseng's own suggestion to key the English gloss as
  "kid" was already implemented prior to this transcript arriving)

General productive pattern per native's own general (non-goat-specific)
definition of the two morphemes: **animal + dambe = young [animal]**;
**animal + bi·sa = baby/offspring of [animal]** (e.g. existing
`achak bi·sa` = puppy, dog+offspring). `dambe bi·sa` = literal
compositional "young offspring" (PL-0002014, promoted this session,
notes corrected).

**NOT independently native-confirmed, NOT added:** "kitten" (menggo
bi·sa), "calf" (a·chak bi·sa or matchu/ma·su bi·sa). The Project
Owner's own relayed "ANIMAL COMPOUND PATTERN" example list includes
"a·chak bi·sa = calf" — this conflicts with already-VERIFIED `achak` =
dog (not cow/calf; existing `puppy` = `achak bi·sa` is correct and
unaffected) and with the pending-lexicon note's own prior wording
("matchu bi·sa=calf, achak bi·sa=puppy"). Treated as a probable relay
transcription slip, not new native vocabulary — flagged back to
Project Owner rather than acted on. New animal-specific compounds
(kitten, calf) need their own direct native confirmation before
addition, per evidence-first discipline; the general dambe/bi·sa
*meaning* is confirmed, but that doesn't license guessing which
specific animal-name root pairs with which compound for words not yet
in the corpus.

**Also flagged, not touched:** existing entry `"young"` = `"pi·sa"`
(UNVERIFIED/HIGH) — possible OCR/raka confusion with `bi·sa`, or a
genuine separate word. Not addressed by this transcript. Needs its own
native check.

**Human meanings of bi·sa confirmed unaffected and untouched:** `child`
= `Bi·sa` (VERIFIED/HIGH), `children` = `Bi·sa` (VERIFIED/HIGH), plus
the already-SUPERSEDED `Degipa`/`De` entries — all as before, no
changes made or needed.

**Duplicate check:** full sweep of every bi·sa/dambe-containing entry
(23 rows) found zero exact-key duplicates in this cluster — the
multiple entries under related keys (e.g. "puppy" vs "a puppy.", "kid"
vs "Kid (young goat)") are distinct citation-discipline entries with
different keys, not engine-level duplicates. Nothing deleted.

**Runtime Handoff (Claude B):** None. This was a documentation/gloss-
semantics correction only — no `garo` surface-form values changed (the
raka-corrected strings from the 2026-08-07 commit were already
orthographically correct; only their English-language explanation was
wrong). One new key added (`young goat`), one pending-lexicon entry
promoted (`young offspring`) — both are new compiled_dict.json entries
with no prior value to conflict with, so nothing to reconcile.

## NV-069: final closure — young/bi·sa/children/calf/book/table (2026-08-08)

Project Owner relay, Thangseng direct. Consolidates and finalizes
NV-067/NV-068, corrects remaining errors, closes the whole cluster.

**Deleted (confirmed wrong, not a valid variant):**
- `young` = `pi·sa` — removed from master_dictionary.json and
  final_entries.json entirely (not just SUPERSEDED-tagged), per
  explicit Project Owner instruction. Not a citation-worthy legacy
  form, a plain transcription/analysis error.
- `young goat` = `Do·bok dambe` — removed entirely. Native: "there is
  nothing called a young goat" as a distinct concept from kid. This
  entry was Claude A's own addition last session (NV-068), based on a
  premature reading of the goat-specific example; retracted.

**Final vocabulary (VERIFIED/HIGH, universal unless noted):**
- `young` = `dambe` (universal general word, not goat-specific)
- `child` / `offspring` / `human kid` = `bi·sa` (singular; unchanged,
  already correct)
- `children` = `Bi·sarang` (bi·sa + plural `-rang`; old bare `Bi·sa`
  entry for "children" marked SUPERSEDED, not deleted — singular/plural
  distinction, not a wrong-word case)
- `puppy` = `achak bi·sa` (achak=dog + bi·sa=offspring) — confirmed
  final, tagged VERIFIED/HIGH
- `calf` = `matchu bi·sa` (matchu=cow + bi·sa=offspring) — new
  VERIFIED/HIGH entry; prior `ba·sur`/`ma·su gen·da` candidates marked
  SUPERSEDED (already matched corrections.json's pre-existing value —
  now reconciled at the master level too)
- `goat` = `Do·bok` — unchanged, already correct (RECONFIRMED prior
  session)
- `kid` / `Kid (goat child)` = `Do·bok bi·sa` — value unchanged;
  English gloss on the phrase-form entry corrected from
  "Kid (young goat)" to "Kid (goat child)" since "young goat" is not a
  valid concept per this session's closure
- `book` = `Ki·tap` — **RECONFIRMED**, reverses the 2026-08-01
  corpus-internal-audit call that had promoted `boi` instead. `boi` now
  marked SUPERSEDED. Confirmed via full sentence: "the book is on the
  table" = "Ki.tap tebilo ong.a"
- `table` = `te·bil` — unchanged, already correct (was already
  VERIFIED/HIGH from a prior session)
- `the book is on the table` = `Ki·tap tebilo ong·a` — new sentence
  entry

**Root cause of the book/boi and calf confusion:** same class as the
dambe/bi·sa issue — an earlier under-specified relay led to a
corpus-internal-audit guess (2026-08-01) being trusted over what
native speaker input later corrected directly. No repo process fix
needed here beyond what NV-068 already documented; this is the same
"direct native input overrides corpus-internal-audit guesses" pattern
already established for `goat` (Do·bok) and `adultery`/`mature`.

**Propagation:** `phrase_maps.js` `'book'` entry updated to `Ki·tap`
(was `boi`). `corrections.json` already used `ki·tap` throughout its
book-related sentences and `matchu bi·sa` for calf — already correct,
no change needed. `garo_dictionary.json` already had `Ki·tap`/`Mez`
consistently (no notes/confidence field, doesn't need editing).
`final_entries.json` (orphaned, not in the live build pipeline)
synced for full-repo consistency per standing instruction: `young`=
`pi·sa`/`pi˙·sa` removed, calf/children/young/book/Kid-gloss updated
in parallel with master_dictionary.json.
`known_dictionary_conflicts.json`: added `children` (new genuine
multi-value key); `calf`/`book`/`table` were already allowlisted from
prior sessions, no change needed there; `young` was NOT added since it
now has exactly one value (no conflict).

**Duplicate check:** re-swept the full bi·sa/dambe/young/calf/book/
table cluster across every source file after all edits — zero
exact-key duplicates remain. All multi-value keys are legitimate
VERIFIED-vs-SUPERSEDED citation pairs, not unresolved duplicates.

**Pending Lexicon:** confirmed zero pending/unreviewed entries remain
for any word in this cluster (PL-0002014 already promoted in NV-068).

**Runtime Handoff (Claude B):** compiled_dict.json will change for
`book` (boi -> Ki·tap) and `calf` (previously unresolved/absent ->
matchu bi·sa) after rebuild — both are genuine value corrections, not
bugs to fix in engine code. No prepare-data.js/pickPrimary changes
needed; the existing SUPERSEDED-filter + master-preference logic
(fixed 2026-08-07/08, commit 9b5d61b) handles this reversal correctly
on its own, confirmed via rebuild.

## NV-070 (2026-08-09, Project Owner relay, Thangseng direct via WhatsApp)

Seven-item vocabulary relay: `Mouth - Ku·sik`, `Joking - bal·eka`,
`At - 'o' (suffix)`, `Bright - ching·a`, `Sad - duk ong·a`,
`Praise the lord - Gitelko mittelbo`, `Direct/straight -
joljol/srongsrong (usage will depend on context)`.

Corpus cross-check (evidence-first, per SESSION_BOOTSTRAP.md
do-not-repeat entry — checked every term against
master_dictionary.json/pending_lexicon.json before trusting) found:

- **mouth**: already VERIFIED/HIGH since NV-067 — exact match,
  reconfirmed unchanged, no edit made.
- **at, bright, sad**: exact matches to existing untagged corpus
  entries — promoted those to VERIFIED/HIGH, superseded case/raka-only
  duplicate rows (`O`, `Ching·a`, `Duk ong·a`).
- **joking**: relay (`bal·eka`) has a different root from the existing
  untagged `kal·akenga`/`Ka·lakenga` entries (b- vs k-) — treated as a
  correction, those two superseded, `Bal·eka` added VERIFIED/HIGH.
  Existing `Bal·ekonga` (variant/AMBIGUOUS/MEDIUM, same root, different
  suffix) left as-is with a note flagging the shared root — bare vs
  -konga-suffixed relationship (aspect? synonym?) not yet
  disambiguated, needs a follow-up native question.
- **praise the lord**: relay (`Gitelko mittelbo`) is a materially
  different phrase from the existing untagged `Gitelna rasong`/
  `Gitel na rasong` — treated as a correction, both superseded,
  `Gitelko mittelbo` added VERIFIED/HIGH.
- **direct/straight**: PO explicitly flagged this as context-dependent
  without specifying the split. Added `direct`=`joljol` and
  `straight`=`srongsrong` as variant/AMBIGUOUS/MEDIUM (native-confirmed
  both words exist) but deliberately did NOT touch or supersede the
  existing UNVERIFIED candidates (`tong·tang`, `wa·rek·rek`,
  `dim·breng·a`) — guessing the sense-split would violate evidence-first.
  **Open question for next Thangseng relay:** which contexts take
  `joljol` vs `srongsrong` (e.g. physical path/line "straight" vs.
  "direct/honest" speech or manner)?

**Duplicate check:** confirmed no lingering exact-key/exact-value
duplicates introduced by this round beyond the ones explicitly marked
SUPERSEDED above.

**Test fix:** `RC-CANDIDATE-012` (tests/unit/translationEngine.test.js)
hardcoded the now-superseded capitalized `Ching·a`; changed to a
case-insensitive check against the confirmed lowercase `ching·a` —
genuine improvement, not a regression.

**Runtime Handoff (Claude B):** compiled_dict.json changes for
`joking`, `at`, `bright`, `sad`, `praise the lord`, `direct`,
`straight` after rebuild — all via the existing master-preference
mechanism, no engine changes needed, confirmed via rebuild + full test
suite (196/196) + repository-intelligence.js (0 new violations).
Separately, see `docs/CLAUDE_B_HANDOFF_20260809_smile_alias_gap.md`
for the smile bug — re-diagnosed root cause (bare-infinitive alias
gap-fill, not pickPrimary's master-preference branch), fix still
outstanding.
