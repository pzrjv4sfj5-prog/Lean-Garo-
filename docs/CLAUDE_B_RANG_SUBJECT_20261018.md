# Claude B: subject-position -rang plural generation (2026-10-18)

Authority: docs/CLAUDE_A_RANG_SUBJECT_BARE_RULING_20261018.md (subject slot authorized, tests first, no bare plurals, no dictionary rows); Thangseng relay 2026-09-30 Q2 and 2026-10-18 (`Achakrang miko cha.a.`). PO instruction: counting and plural are different.

Where: `subjectRangForm()` in `src/sentenceBuilder.js`, called from `assembleSentenceSOV` (the noun-subject fallback). Tests: `tests/unit/rang_subject_plural.test.js` (written first; 8 generation cases failed before the change).

Fires only when ALL hold; every doubt resolves to no -rang (status quo):
- no numeral anywhere in the sentence (counted nouns stay on the classifier path);
- the word is a regular English -s/-es/-ies plural (suppletive plurals people/men/women untouched);
- subject position: first content word, or after only my/your/his/her/our/their/many/some/several/all/few/these/those; before the verb;
- a predicate follows (verb, copula, or a verb-final Garo word); a bare noun phrase ("dogs", "my cats") is not a sentence and is unchanged;
- singular is not a verb lemma (eats, runs) and the word is not in a small not-really-plural list (news, thanks, series, ...);
- plural and singular resolve to the same Garo (lexicalized plurals children/friends/leaves untouched); never doubled on -rang;
- plain concatenation, raka dot kept (Achak -> Achakrang).

Verification: before/after snapshot of 2941 engine outputs (corrections keys, dictionary phrases, 31 plural nouns x 11 predicates, singular/verb-s controls). 0 changes outside plural-subject sentences; 0 changes to bare nouns, `two N`, `i see N`.

Not done / for others:
- Object `-ko` is still not generated on the noun-subject path (`Achakrang mi cha·a`, Thangseng has `miko`). Exact sentence `dogs eat rice` stays a corrections row.
- Counted nouns with a numeral: classifier path untouched (Claude A relay Q-b still open: `achakrang ge·gni` is emitted today for `two dogs eat rice`, `achak manggni` is cited data).
- Bare plurals: unchanged, Q-a open.
- `stories`, `knives`, `potatoes`, `fish` skipped because plural and singular lookups differ or are unchanged; irregular verbs/adjectives never touched.
- Definiteness and vowel/consonant alternation of -rang: no evidence, plain concatenation.

## Addendum 2026-10-19: object -ko on noun-subject sentences
`translateNounSubjectClause()` in `src/translationEngine.js` (tests `tests/unit/noun_subject_object_ko.test.js`). A noun-subject clause used to fall to `assembleSentenceSOV`, which has no object -ko and sometimes misordered the sentence (`my cats drink water` -> `... ringa chi`). Now the clause is translated with a pronoun placeholder (`they`/`he`) through the verified grammar-assembly path (object -ko, tense, negation), then the subject noun phrase replaces the pronoun; regular plurals get -rang via `resolveSubjectNoun()` (sentenceBuilder.js, same guards as `subjectRangForm`).
Shape: `[time adverb] [the|a|an] [possessive] NOUN + predicate`, one simple clause, no numeral, no question, no conjunction. Used only when its result differs from the fallback ignoring case. Examples: `cats eat rice` -> `Menggorang mi·ko Cha·a`; `my cats drink water` -> `Angni menggorang chi·ko Ringa`; `cats see dogs` -> `Menggorang achakrang·ko Nika`; `dogs go home` -> `Achakrang nok·ko rea`.
Snapshot diff over 2,944 outputs: 90 changed, all noun-subject clauses with a transitive or locative predicate; intransitives and copulas unchanged. Shared predicate test `startsWithPredicate()` is also used by the counted-subject handler.

## Addendum 2026-10-19 (2): irregular English plurals as subject
PO rule 1 (Garo has no irregular plurals; root stays untouched, `-rang` added): `resolveSubjectNoun()` in `src/sentenceBuilder.js` now maps English irregular plurals through their singular: people -> `Manderang`, men -> `Me·asarang`, women -> `Me·chikrang`, feet -> `Ja·arang`. A dictionary row that already holds a different lexicalized plural wins (children -> `Bi·sarang`, teeth -> `Wagam`). Tests: `tests/unit/irregular_plural_subject.test.js`. Also allows two-word clauses (`men work`). Before: `men eat rice` -> `[UNKNOWN] Cha·a Mi`; `people are here` -> `mande iano`. Snapshot: 42 changes vs the previous step, all irregular-plural or related word-order fixes (`leaves run` was `Kata bijakrang`).
Not covered: bare `people`/`men`/`women` (no ruling; `people` is a corrections row = `mande`), and `the people are here` (goes through the earlier grammar-assembly NP path, still `mande Iano`).

## Addendum 2026-10-19 (3): counted adjective + noun ("two big dogs")
Two fixes, tests `tests/unit/counted_adjective_noun.test.js`:
1. `getClassifier()` (`src/garo_classifier.js`): an unmapped multi-word phrase now takes its HEAD (last) noun's classifier instead of the generic `ge-`. `two big dogs`: `dal·gipa achak ge·gni` -> `dal·gipa achak mang·gni`; books -> `king·`, trees -> `pang·`, apples -> `rong·`, students -> `sak·`. Before/after over 756 counted-phrase probes: 148 classifier-path changes, every one altered only the trailing classifier.
2. `translateCountedSubjectClause()` accepts a verified attributive phrase row between the numeral and the predicate: `two big dogs eat rice` was `mi ge·gni` (subject dropped), now `Dal·gipa achak mang·gni mi·ko Cha·a` (64 clause changes).
Not fixed (pre-existing, found while probing): some adjective+noun counts silently DROP the adjective when no phrase row exists (`two big houses` -> `nok te·gni`, `two black dogs` -> `achak mang·gni`, `two old men` -> `me·asa sakgni`). Composing an adjective needs a verified attributive form per adjective (only `dal·gipa` is cited); that is a Claude A / Thangseng question, not an engine guess.
