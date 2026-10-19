# PO-provided Garo plural and counting rules, 2026-10-18

Provenance: pasted by the PO (Tridip) in chat as a "structured prompt". Rule 2 (-rang as the universal plural) is stated there as native-speaker confirmed and matches Thangseng's relay (2026-09-30 Q2; 2026-10-18 `Achakrang miko cha.a.`). The classifier list and the two counting scenarios carry no separate attribution; the dog classifier `mang-` and `achak manggni` match Claude A's cited data. Treat the counting scenarios as PO-provided, Thangseng attribution unconfirmed.

1. Untouched root: no root changes for plural or count (`mande` stays `mande`).
2. `-rang` = universal general plural, attached to the untouched root (Achakrang, Do·orang, Me·asarang, Me·chikrang, Manderang, Biterang).
3. Classifiers: `mang-` animals, `sak-` humans, `ge-` inanimate objects.
4. Formula A (general plural) = root + `-rang`. Formula B (specific count) = root + classifier + number, adjacent. Never both.
5. Scenarios: `Achakrang mi·ko cha·a` (dogs eat rice); `Achak manggni mi·ko cha·a` (two dogs eat rice; the old `achakrang mi·ko cha·a ge·gni` was wrong on three counts); `Da·al achak manggni mi·ko cha·a` (today two dogs eat rice).

## What Claude B implemented (same day)
- Formula A, subject position: `subjectRangForm()` in `src/sentenceBuilder.js` (commit a571fcc, docs/CLAUDE_B_RANG_SUBJECT_20261018.md).
- Formula B, counted subject in a clause: `translateCountedSubjectClause()` in `src/translationEngine.js`, tests `tests/unit/counted_subject_formula_b.test.js`. The clause is translated with a pronoun in place of the counted noun phrase through the verified grammar-assembly path (verb, tense, negation and object -ko come from there), then the counted phrase `noun + classifier + number` replaces the pronoun. Fires only when a numeral is followed by a noun and then an auxiliary/copula/known verb; adjective+noun phrases, units (`two kg of rice`), multi-word dictionary nouns (`sugar cane`), bare counted phrases (`two dogs`) and `i see two dogs` are untouched. A leading today/yesterday/tomorrow/now is translated separately and placed first.
- Fixed by this: `two dogs eat rice` was `achakrang miko chaa gegni`; `two people eat rice` was `mi gegni` (subject dropped); `two books are heavy` was `jeetjeet gegni`; `five students run` was `kata gebonga`. 30 probe sentences changed, 0 outside counted subjects.

## Known gaps vs the PO's expected strings (not changed without a call)
- Casing: the grammar path capitalizes the verb (`Cha·a`), PO string has `cha·a`. Cosmetic.
- `today`: dictionary has `Da.alo`; PO scenario 3 has `Da·al`. Data row, Claude A's lane; check which is right.
- Object `-ko` is still not generated in noun-subject sentences that do not go through the counted path (`dogs eat meat` -> `Achakrang be·en cha·a`).
- Irregular English plurals as subject (`men`, `women`, `people` in an uncounted subject slot) are not generated; the PO's Rule 1 says `people` -> `mande`+`rang` (as the object slot already does). Not built; needs a decision because the first subject-rang build deliberately left suppletive plurals alone.
- Counted objects/phrases not in subject position, and counts above a following verb phrase other than the listed predicates, still go through the old classifier path. `two big dogs` -> `dal·gipa achak ge·gni` is a pre-existing bug (wrong classifier `ge`, the same error class); not touched.
- Classifier for `ge-` objects is whatever garo_classifier.js assigns per noun (kitap -> king·, nok -> te·); the PO's flat "ge- for objects" is a simplification of the verified per-noun table, which I left alone.
