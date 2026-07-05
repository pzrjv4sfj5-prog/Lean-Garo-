# Grammar Specification — Living Knowledge Base

Structured index of every grammar rule, cross-referencing description,
implementation location, test coverage, and confidence. Full prose/examples
for each rule live in `docs/THANGSENG_RULES_LOOKUP.md` — this file is the
at-a-glance status tracker. Update both files together when a rule changes.

**Confidence levels:** `confirmed` (direct native-speaker statement or
example) · `tentative` (native speaker expressed uncertainty) · `derived`
(inferred from confirmed examples, not itself directly confirmed) ·
`open` (explicitly flagged as unresolved/needs Thangseng follow-up)

| # | Rule | Confidence | Implementation | Tests |
|---|---|---|---|---|
| 1 | Raka belongs to root only, never suffix | confirmed | `applyTense` stem logic, all suffix sites | regression: raka-sensitive cases throughout |
| 2 | `-aha` = simple past AND perfect (one suffix, context disambiguates) | confirmed | `applyTense('past')` → `verbRoot+'ha'` | `he studied`, `he cooked`, `he walked`, `he ate` |
| 3 | Word order: SOV | confirmed | `assembleGrammar`, `assembleSentenceSOV` | all grammar-assembly cases |
| 4 | Pronouns (subject/object distinct forms) | confirmed | `PRONOUN_MAP` | pronoun sweep (i/you/he/she/we/they/it) |
| 5 | Copula `daka` | confirmed | not yet wired into grammar-assembly | none — **gap** |
| 6 | Adjective placement | confirmed | not modeled | none — **gap** |
| 7 | `Hai` (let's) construction | confirmed | corrections.json exact entries only | `lets eat`, `lets go`, `hai cha·bo` |
| 8 | If-clause `-ode` | confirmed | `translateIfClause` | none in regression suite — **gap** |
| 9 | Noun suffixes (`-ko`/`-o`/`-chi`/`-ni`/`-na`) | confirmed | `assembleGrammar` (`-ko` only); `-o`/`-chi`/`-ni`/`-na` not modeled | partial — **gap** |
| 10 | Classifiers | confirmed | `src/garo_classifier.js` | 21 dogs, 2 bamboo, 1 tree, etc. |
| 11 | Key vocab | confirmed | `master_dictionary.json` etc. | baseline 13 |
| 12 | `maini gimin` validity | confirmed | corrections.json | none |
| 13 | `chim` = discontinued past / "used to" | confirmed | `applyTense('chim')`, pattern detection | `i used to eat` |
| 14 | `dongama` = existential "there is" | confirmed | not modeled | none — **gap** |
| 15 | Stem formation (strip trailing `a`) | confirmed | `applyTense` generic branch | implicit throughout |
| 16 | Complete suffix table | confirmed | `applyTense` suffixes map | throughout |
| 17 | `jaha` = discontinuation, NOT past negation | confirmed (corrected 2026-07-04) | `applyTense('discontinued')`, pattern detection | `i stopped eating` etc. |
| 18 | `gija` = verbal adjective, not negation | confirmed | `tryWithoutGijaConstruction`; `applyNegation` no longer misuses it | `he left without eating`, `she stayed without doing her work` |
| 19 | Classifiers (raka table) | confirmed | `src/garo_classifier.js` | classifier sweep |
| 19b | Classifiers update (jol/pang/dot/ge·/king) | confirmed | `src/garo_classifier.js` | classifier sweep |
| 20 | `an·tang` = self/reflexive possessive | confirmed | corrections.json only | none — **gap** |
| 21 | `song·` vs `songna` — raka changes meaning | confirmed | dictionary entries (cook vs plant) | none direct |
| 22 | `Hai -na` vs `-naha` nuance | confirmed | corrections.json | `lets go` (na variant) |
| 23 | `-gen` future never adds raka | confirmed | `applyTense` generic stripping | future-tense cases |
| 24 | `ha` exception — full-root-append | confirmed | `applyTense('past')` special-case | `he cooked` etc. |
| 25 | `manaha` = completed action | confirmed | `applyTense('completed')`, pattern detection | `i finished eating` |
| 26 | Engine verification fixes (chim/pastcont/eaten/gija-positive) | confirmed (internal QA, 2026-07-04) | `applyTense`, `tryWithoutGijaConstruction` | `i was sitting`, `i was eating` |
| 27 | No true simple-past suffix; `-ja` covers past-referring negation | confirmed | `applyNegation` (tense-independent) | `he did not go`, `i did not go` |
| 28 | `-aha`/`-manaha` overlap in spoken Garo | confirmed | no code enforces separation (by design) | n/a |
| 29 | `-bo` is imperative AND hortative | confirmed | corrections.json (`Hai cha·bo`) | `hai cha·bo` |
| 30 | `re·` vs `re·ang` for "go" — real distinction or free variation? | **open** | corrections.json hardcodes bare form for future-negative only | `i will not go` |
| 31 | Copula inconsistency: bare-adjective (Rule 6) vs `daka` (Rule 5) vs `ong·a` (seen in Rule 8 locative + some predicative corrections) | **open** | none unified — 3 strategies coexist in live data | `he is happy` (bare), `i am happy` (ong·a) — inconsistent |
| 32 | `search` = `Sandia` (replaces contaminated `am·e·nik·na` root) | confirmed | corrections.json + natural `applyTense` generation | `search`, `search for him`, `he searched`, `he was searching`, `she used to search` |

## Known architectural gaps (not yet rule violations, just unimplemented)
- **Copula `daka`** (Rule 5) and **adjective placement** (Rule 6) have no
  grammar-assembly path — sentences needing "is/am/are X" or attributive
  adjectives fall through to low-confidence `sov-assembly`.
- **Locative constructions** ("the dog is under the table") — only one
  confirmed example (Rule 8 doc), word order not generalized. Flagged
  2026-07-05.
- **Noun suffixes** beyond `-ko` (accusative) — `-o` (locative), `-chi`
  (directional/instrumental), `-ni` (possessive, partially via
  `POSSESSIVES`), `-na` (dative) are documented but not systematically
  applied in grammar-assembly.
- **`dongama`** (existential "there is") has no detection pattern.

## Process (per project workflow, section 7)
Every newly confirmed Thangseng rule gets: (1) full write-up in
`THANGSENG_RULES_LOOKUP.md`, (2) a row in the table above, (3) at least one
regression case in `tests/unit/translationEngine.test.js`. A rule is not
"done" until all three exist.
