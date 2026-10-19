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
