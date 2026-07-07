# Garo Grammar Specification — v1.0

Chief Linguistic Scientist deliverable, Version 1.0 Launch Sprint.
Source of truth: `docs/THANGSENG_RULES_LOOKUP.md` (33 rules, native-speaker
sourced) and `src/data/corrections.json` (790 verified sentence-level
entries). This document is a canonical, standards-form restatement — it
supersedes nothing, it organizes what already exists.

## 1. Typological Profile

Garo is agglutinative and verb-final (SOV). Grammatical meaning
(tense, aspect, polarity, mood) is expressed through suffix chains
attached to a verb root, not through free-standing auxiliary words.
Word order elsewhere is comparatively free, but modifying material
(objects, locatives, classifiers-with-numbers) clusters before the verb.

**Status:** Verified. **Priority:** P0.

## 2. Word Order

**Rule G1 (SOV).** Subject – Object – Verb is the base order.
Example: `Achak Angko chikaha` (dog me bit = "the dog bit me").
**Status:** Verified. **Priority:** P0.

**Rule G2 (Pre-verbal clustering).** Locative phrases, classifier+number
phrases, and purpose clauses sit immediately before the finite verb.
Example: `Achak tebil nokkimao ong·a` (dog table under+LOC is).
**Status:** Verified. **Priority:** P0.

**Rule G3 (Imperative subject-drop).** Commands omit the subject entirely.
Example: `Sengbo` (stop!), not `*Na·a Sengbo`.
**Status:** Verified. **Priority:** P0.

## 3. Pronouns

| Person | Subject | Object | Possessive | Notes |
|---|---|---|---|---|
| I | Anga | angko | Angni | |
| you | Na·a | nang·ko | Nang·ni | |
| he/she (formal) | Ua | uko | Uni | |
| he/she (informal) | Bia | biko | Bini | register variant of Ua-row |
| we | An·ching | — | An·chingni | |
| they | Uamang | — | Uamangni | |

**Status:** Verified. **Priority:** P0.

## 4. Negation

**Rule G4.** Negation is expressed by a verb suffix, never a separate
negating word. There is no confirmed simple past-negative suffix — `-ja`
covers both present-negative and past-referring negation uniformly.
Example: `Re·angja` = "did not go" / "does not go" (context disambiguates).
**Status:** Verified (native-confirmed 2026-07-05, corrects an earlier
2026-07-01 assumption). **Priority:** P0.

**Rule G5.** `-jaha` is NOT past negation — it marks cessation/discontinuation
("was doing, has stopped"). This is a distinct grammatical category
(aspect) from simple negation. **Status:** Verified (corrects a documented
prior error). **Priority:** P0.

## 5. Copula and Predication — OPEN ISSUE

**Rule G6.** Three predicative strategies coexist in currently-confirmed
data with no reconciling rule: bare-adjective predication, `daka`-copula,
and `ong·a`-copula (seen in locative and some predicative sentences).
No unifying rule has been native-confirmed.
**Status: Needs Native Validation. Priority: P0 — highest-priority open
item, since predicate sentences ("X is Y") are a high-frequency
construction and the current data contains unreconciled contradictions,
not merely gaps.**
**Recommendation:** do not promote any single strategy to canonical status
pre-launch; document all three as attested, flag the ambiguity in the
Validation Corpus, and prioritize a targeted native-speaker question before
V1.1: *"For 'he is happy' / 'the car is beautiful,' is a copula word
required, optional, or context-dependent? Does it differ between transient
states and inherent qualities?"*

## 6. Noun Case Suffixes

| Suffix | Function | Status |
|---|---|---|
| `-ko` | Accusative/object marker | Verified |
| `-o` | Locative | Verified (one full-sentence example; general productivity not yet validated) |
| `-chi` | Directional ("to/toward") | Verified |
| `-ni` | Possessive/genitive | Verified |
| `-na` | Dative ("for/to") | Verified |

**Priority:** P0 for `-ko` (high frequency, well-attested); P1 for
systematic productivity confirmation of `-o`/`-chi`/`-ni`/`-na` beyond
their currently-confirmed individual examples.

## 7. Classifiers (Numeral Classifier System)

Counted nouns require a classifier bound to the number suffix; the
classifier depends on the noun's semantic class. Confirmed classes:
`mang·` (animals), `sak·` (people), `gong·` (money), `king` (flat/book-like
objects, no raka), `jol` (bamboo/long objects, no raka), `pang` (trees, no
raka), `ge·` (general default, with raka).
**Status:** Verified. **Priority:** P0 — fully specified and implemented;
treat as a model for how other productive systems (noun case, see §6)
should eventually be specified.

## 8. Existential/Possessive Constructions

**Rule G7.** Possession is expressed via existential predication
(quantity + possessed-noun + `donga`), not a dedicated transitive "have"
verb. Example: `Uo bi·sa sakgittam donga` = "she has three children"
(lit. "she child three-CLASSIFIER exists").
**Status:** Verified. **Priority:** P1.

**Rule G8 (`dongama`).** Existential "there is" construction referenced in
rule catalogue but not yet exemplified in the validation corpus.
**Status:** Needs Native Validation (confirmed to exist, insufficient
examples to specify productivity). **Priority:** P1.

## 9. Honorific / Register Variation

Bia/Ua and gnang/donga are confirmed synonym pairs distinguished by
register (informal/formal, spoken/written) rather than meaning.
**Status:** Verified. **Priority:** P1 — not launch-blocking, but should
be documented so future corrections don't treat register variants as
errors.

## 10. Out of Scope for v1.0 (P2, deferred)

- Multi-clause/subordinate sentence composition (Garo is predominantly
  paratactic; see Architecture note in Rule Catalogue).
- Reverse translation (Garo→English) grammar — separate track (Claude C).
- Dialectal variation beyond what has been directly volunteered by the
  native-speaker source.
