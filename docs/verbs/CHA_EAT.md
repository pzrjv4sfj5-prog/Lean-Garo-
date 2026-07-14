# Verb: `cha·` — "eat"
_Canonical verb page, created 2026-07-08 by Claude A. This is the
template exemplar — `cha·` was chosen because it's the most exhaustively
attested verb in the repository with no unresolved internal conflicts.
Every form below is transcribed from repository sources; nothing is
invented. Where a form's function is inferred rather than directly
glossed, that's marked._

## Root
`cha·` (raka confirmed, part of the root per RULE-001 — every single
attested form below carries it, no exceptions found).

## Meaning
"eat" (also used with an explicit object, `mi` = "rice/food", in several
forms — both bare-intransitive and object-marked usage are attested).

## Attested Paradigm

| Form | Gloss | Source |
|---|---|---|
| `Anga cha·aha` | I ate | corrections.json |
| `Anga mi cha·aha` | I ate rice | corrections.json |
| `Anga cha·enga` | I am eating | corrections.json |
| `Anga mi cha·enga` | I am eating rice/food | corrections.json |
| `Ua cha·enga` | she is eating | corrections.json |
| `Anga cha·ja` | I am not eating / I do not eat | corrections.json (same form covers both readings) |
| `Anga cha·jok` | I have eaten | corrections.json |
| `Anga mi·ko cha·jok` | I have eaten food (object marked with `·ko`) | corrections.json |
| `Ua cha·jok` / `Uamang cha·jok` / `Na·a cha·jok` / `An·ching cha·jok` | he/they/you/we have eaten | corrections.json (full person paradigm attested for this form specifically) |
| `Anga cha·gen` | I will eat | corrections.json |
| `Anga cha·jawa` | I will not eat | corrections.json |
| `Na·a cha·ode` / `Anga cha·ode` | if you eat / if I eat | corrections.json; RULE-008 |
| `Na·a cha·ode, bilakgen` | if you eat, [you] will be strong | corrections.json |
| `cha·nabe` | don't eat (negative imperative) | corrections.json; RULE pattern `+nabe` |
| `Hai cha·bo` | let's eat (imperative-form hortative) | corrections.json |
| `Hai cha·na` | let's eat | corrections.json — **note:** two distinct "let's eat" forms exist (`Hai cha·bo` and `Hai cha·na`); relationship between them (register? emphasis? free variation?) is not confirmed. |
| `Hai cha·ha` | let us eat | corrections.json — a **third** "let's eat"-adjacent form; not reconciled with the two above. Flagged as an open question below. |
| `Ua cha·china` | let him/her eat | corrections.json |
| `Anga cha·jaha` | I stopped eating | corrections.json; RULE-025 (cessative) |
| `Ua cha·jaha` | he/she stopped eating | corrections.json |
| `Na·a cha·ama?` | did you eat? (with object, e.g. `Na·a na·rang cha·ama?` = did you eat orange) | corrections.json |
| `Na·a mi cha·jok ma?` | did you have lunch? (lit. "have you eaten rice") | corrections.json |
| `Na·a basako cha·aha?` | when did you eat? | corrections.json |
| `Na·a basako cha·gen?` | when will you eat? | corrections.json |
| `Anga cha·na sikenga` | I want to eat | corrections.json — infinitive `cha·na` + `sikeng` want-construction |
| `Anga cha·na man·gen` | I can eat / I will be able to eat (in context "I work so I can eat") | corrections.json; connects to NV-008 (ability modal) |
| `cha·manaha` | (implied completive form, "has eaten") | GRAMMAR_RULE_CATALOGUE.md RULE-026 — cited as the rule's own example but **not independently found as a corrections.json entry**; the paradigm's completive slot is filled in the Rule Catalogue but not yet in the Validation Corpus (matches the Coverage Audit's RULE-026 finding). |

## Morphology
Every suffix attaching to `cha·` matches an existing, independently
confirmed morpheme from `MORPHOLOGY_SPECIFICATION.md` §3: `-aha`
(past/perfect, RULE-002), `-enga` (continuous), `-ja` (negative,
RULE-017), `-jok` (perfect "have eaten" — not yet in the §3 paradigm
table as a standalone entry; worth adding, see note below), `-gen`
(future), `-jawa` (future negative), `-ode` (if-clause, RULE-008),
`-nabe` (negative imperative), `-bo` (imperative/hortative, RULE-029),
`-china` (jussive "let him/her" — not yet in §3 table, worth adding),
`-jaha` (cessative, RULE-025), `-ama` (interrogative past), `-na`
(infinitive). No suffix here is unique to `cha·` — this verb is best
understood as a full demonstration of the general suffix paradigm
applying cleanly to one root, rather than having any idiosyncratic
behavior of its own.

**Documentation gap surfaced by this exercise:** `-jok` (perfect) and
`-china` (jussive) are both productively used with `cha·` but neither
has a standalone entry in `MORPHOLOGY_SPECIFICATION.md` §3's suffix
table. Recommend adding both — they're clearly real morphemes (multiple
person-forms attested for `-jok` specifically), just not yet formalized
there.

## Grammar Rules Referenced
RULE-001 (Raka Locality), RULE-002 (Past/Perfect), RULE-008 (If-Clause),
RULE-017 (Negation), RULE-025 (Cessative), RULE-026 (Completive,
`-manaha` — this verb is the rule's own citation example), RULE-029
(Hortative/Imperative).

## Related Verbs
`ring` (drink) and `porai`/`pora` (study) share the same `sikenga`
want-construction pattern (`[verb]-na sikenga`) but both show the
raka-inconsistency documented in NV-010 — `cha·na sikenga` does NOT show
this problem (raka is consistently present, matching the root's own
confirmed raka status), which is itself useful evidence: it suggests
`cha·`'s raka-bearing status is not the source of the `ring`/`agan`/
`porai` conflict, since `cha·` also bears raka and shows no inconsistency.

**New compound form, academic source only (2026-07-14):** `cha·brina`
= "to eat together," from `cha·` + `-brina` (a "to mix" derivational
suffix — see `MORPHOLOGY_SPECIFICATION.md` §7). Not native-confirmed,
not yet added to the attested paradigm table above — a candidate
extension, not a confirmed form.

## Open Questions From This Page
1. Three distinct "let's eat" forms (`Hai cha·bo`, `Hai cha·na`,
   `Hai cha·ha`) are unreconciled — is this free variation, register
   variation, or do they mean subtly different things? Not yet added to
   `THANGSENG_NATIVE_VALIDATION.md` as its own NV item since it's low
   linguistic risk (all three are plausible hortative-adjacent forms and
   none look like an error) — flagged here for awareness, escalate only
   if it turns out to matter for another verb's documentation too.
2. `-jok` and `-china` should be added to `MORPHOLOGY_SPECIFICATION.md`
   §3's suffix table — pure documentation gap, no native validation
   needed, evidence already exists on this page.

## Confidence
**High.** No unresolved conflicts in the core paradigm; every suffix
traces to an independently-confirmed morpheme; the only open items are
(a) a low-stakes three-way variant question and (b) two documentation
formalization gaps, neither of which casts doubt on any individual form
shown here.

## Validation Status
Verified (individual forms); the paradigm as a whole has not been
elicited in a single structured native session (it's assembled from many
separate `corrections.json` entries built up over time) — worth noting
as a methodological difference from a from-scratch elicitation, though
it doesn't reduce confidence in the forms themselves.

## Repository References
`src/data/corrections.json` (24 entries), `docs/GRAMMAR_RULE_CATALOGUE.md`
RULE-001/002/008/017/025/026/029, `docs/MORPHOLOGY_SPECIFICATION.md` §3,
`docs/VERB_INVENTORY.md` (Part 1).
