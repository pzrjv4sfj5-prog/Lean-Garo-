# NV-219 (Claude B lane, 2026-10-27): plural demonstratives, bare `that` object, `like` = namnika

Cite as NV-219(B) or by commit; NV numbers collide across lanes.

## Native evidence (Thangseng, relayed by the PO 2026-10-27)
| English | Garo | Tense |
|---|---|---|
| those dogs | Ua achakrang | n/a (noun phrase) |
| these dogs | Ia achakrang | n/a (noun phrase) |
| I like that house. | Anga ua nokko namnika. | present |
| I see that. | Anga uko nika. | present |

A first relay of the dog pair had ua/ia swapped; Thangseng's own list settles it: **ua = that/those, ia = this/these in both numbers.** The demonstrative does not change in the plural; only the noun takes -rang.

## What changed
- `garoPluralNoun` / `tryThosePluralConstruction` (grammarEngine.js): `those|these + plural noun` -> `Ua|Ia + noun-rang`, same regular -rang rule as the object slot (English plural must singularize, no lexicalized plural row, single-word Garo only).
- NV-215 post-translation insertion and the NV-212 `look at` block extended to `those/these` (-ko stays on the noun: `Anga ua achakrangko nika`).
- Bare sentence-final `that` object (`I see that`) is routed through the `it` sentence and kept only if it yields `uko`. Complementizer verbs (`know`, `think`, `say`...) are excluded.
- `like` pinned to `namnika` (corrections.json; baseline `corrections:like` in known_cross_source_conflicts.json). Compiled `like` was `sin·a`, an unverified row; `nam·nik·a` exists in master only as an unverified variant.
- Tests: tests/unit/nv219_demonstrative_plural_uko_like.test.js (21). `adjective_position_rule006` expectation `sin·a` -> `namnika`.

## Provenance of outputs
Native: the four rows above. **Derived (rule by analogy, NOT native):** every other tense/person (`I saw those dogs`, `I will see that`, `namnikaha`, `namnikgen`, `namnikja`...), `these/those houses`, `Look at those dogs` (`Ua achakrangko nibo`), -ko on plural nouns.

## Gate (Rule 7)
`npm run build` exit 0: 9067/9067 dictionary, 0 NEW violations, resync 0 candidates, unit 969/969, runtime-error-sweep 16089 translate() calls / 0 errors.
**Not checked:** 324-probe snapshot not re-run; no browser/UI check; `like` in non-verb senses (`like a dog`) now also goes through `namnika` (previously `sin·a`, equally unverified); demonstratives with adjectives or numbers in the plural (`those two dogs`, `those big dogs`); `I like that.` (bare object with `like`, excluded from the uko rule).

## For Claude A (data)
1. Promote `like = namnika` (Thangseng, `Anga ua nokko namnika`, present) in master; retire/annotate `sin·a` as `like`, keep `nam·nik·a` variant reconciled (raka dots?). Then drop the corrections pin and the `corrections:like` baseline row.
2. `Namnikgipa` (favourite, verified NV-102) shares the root; check it against the new verb row.

## Governance (AI-004)
This extended two existing output rewrites (NV-215 insertion, NV-212 look-at) and added one more pre-pass (bare `that` -> `it`). Instance count in AI-004 raised; the structural fix (carry demonstrative + number as fields into `assembleGrammar`) is still not done, deliberately, to ship the native rows.

## Standing rule from Thangseng (2026-10-27)
**Whenever a full sentence is sent to Thangseng for checking, state the intended tense** (present, past, future, negative, imperative).

## To send Thangseng (derived forms to confirm)
1. I see those dogs. (present) = Anga ua achakrangko nika.
2. I saw those dogs. (past) = Anga ua achakrangko nikaha.
3. I will see those dogs. (future) = Anga ua achakrangko nikgen.
4. I do not see those dogs. (present, negative) = Anga ua achakrangko nikja.
5. Look at those dogs. (imperative) = Ua achakrangko nibo.
6. I liked that house. (past) = Anga ua nokko namnikaha.
7. I will like that house. (future) = Anga ua nokko namnikgen.
8. I do not like that house. (present, negative) = Anga ua nokko namnikja.
9. I saw that. (past) = Anga uko nikaha. / I will see that. (future) = Anga uko nikgen.

## Probe pass (2026-10-27, same day): no-drop sweep
Method: 18 nouns x 4 demonstratives (that/this/those/these) x 4 subjects (I/we/you/they) x 20 verb frames = 5,760 sentences, plus a 330-sentence hand-readable set. Check = no `[UNKNOWN]`, demonstrative present and immediately before the noun, `-rang` on plural nouns, `-ko` on the noun and never on `ua`/`ia`.
First run: 94.9% (5,464/5,760). Defects found and fixed:
1. Multi-word Garo nouns (boy = `me·a bi·sa`, girl = `me·chik bi·sa`) lost the demonstrative: insertion/helper now handle multi-word NPs; `-rang` goes on the last word.
2. Plural nouns with an existing `X-rang` row (fruits = `biterang`) lost the demonstrative: the plural helper now accepts a row equal to singular + `rang`.
3. `knives` mis-singularized to `knive` and fell into sov-assembly (verb `see` became `nia`): added -ves irregular plurals (knives, wives, wolves, shelves, loaves, thieves).
4. `took` was `[UNKNOWN]` (288 sentences): added `took` = `ra·aha` (derived from the regular -aha past, same as `will take` = `ra·gen`; NOT native).
Final: 5,760/5,760 pass on that structural check.
**What this proves:** no dropped demonstrative/noun/subject, no `[UNKNOWN]`, consistent placement. **It does not prove the Garo is native-correct:** only the four Thangseng sentences are native; all other tense/verb/noun combinations are rule output. Irregular lexicalized plurals (children, men, women) were checked only for presence of ua/ia + plural, not for correctness of the plural word.
Gate after the probe fixes: `npm run build` exit 0, unit 981/981, rule conformance 78/112 with 0 new mismatches, runtime-error-sweep 16089 calls / 0 errors. `irregular_verbs.json` count pin 56 -> 57 in translationEngine.test.js.

## Second probe pass + web cross-check (2026-10-27)
**Web cross-check (secondary sources, NOT native):** WALS 43A (Burling/Bhat) lists `ia` = this, `ua` = that: matches. Wiktionary's Garo determiner tables (`iano`/`uano`) list pronoun plurals `iarang` / `uarang` and accusatives `iarangko` / `uarangko`; the same table gives singular accusative `iako`/`uako`, but Thangseng's native `Anga uko nika` takes precedence, so `uko` is used and `iko` (this) is derived by analogy.
**New defects found and fixed (all outputs derived, none native):**
1. Demonstrative dropped with adjectives (`that big dog`, `I see that big red dog`) and numbers (`those two dogs`): insertion now skips leading adjectives/numbers to find the noun and goes before the adjectives (`ua dal·gipa achakko`).
2. Demonstrative dropped before case-suffixed nouns (`nok·chi`, `nok·o`): `I go to that house` = `Anga ua nok·chi re·a`.
3. Adjective dropped before a plural object even without a demonstrative (`I see big dogs` was `Anga achakrangko Nika`): RULE-006 path now handles plural nouns (`Anga dal·gipa achakrangko nika`).
4. Bare pronoun objects dropped (`I see those/these/this`): `uarangko` / `iarangko` / `iko` (that stays native `uko`); `I like that/those/this` included.
5. Copular and question shapes: `those are dogs` = `Ua achakrang`, `these are my books` = `Ia angni ki·taprang`, `that is my house` = `Ua angni nok`, `what is that` = `Ua maia?` (mirrors attested `Ua sawa?`).
Invariance probe (strip `ua`/`ia` from the output = the same sentence without a demonstrative): 1,980/2,000 (99.0%); the 20 misses are all `red house`, see below. Earlier strict probe still 5,760/5,760. Gate: build exit 0, unit 1004/1004, conformance 78/112 with 0 new mismatches, sweep 16,089 calls / 0 errors. Two old tests updated (R5 copula-stripping now checked on `this is for you`; `her` possessive match made case-insensitive) because `this is my book` / `this is her dog` now keep `Ia`.

## Known remaining defects (NOT fixed)
1. **For Claude A (data):** master row `red house = bilak rang` (unverified) drops `house` and blocks demonstrative insertion in any sentence with `red house`. Retire or fix it. `those = Uamang` / `these = Iamang` (unverified) look like the pronoun `them`, not the demonstratives; Wiktionary suggests `uarang` / `iarang`.
2. Plural noun in a directional/locative phrase (`I go to those houses`) falls to sov-assembly: drops `to`, the demonstrative, and mangles the verb (`re·ang`). Needs the plural + case-suffix form from Thangseng (`nokrangchi`? unverified).
3. Prepositions `with` / `from` are dropped (`with those dogs`, `from this house`, `I eat with these dogs`).
4. `this is for you` drops `this` and `for` (reported via droppedWords, confidence 0.5). `Are those your dogs?` drops `those` and the plural. `who are they` = `Sawa uamang`.
5. `like` now maps to `namnika` in every sense; non-verb `like` (`like a dog`) is unverified.

## Third pass (2026-10-27, "fix all") — status of the earlier "Known remaining defects"
1. `red house = bilak rang`: row retired in master_dictionary.json (confidence superseded, note kept per citation discipline). `red house` now composes (`gitchak nok`); `I see that red house.` = `Anga ua gitchak nokko nika`. (Claude A: please review; row was Claude A's lane.)
2. Plural noun after to/in/at (`I go to those houses.` = `Anga ua nokrangchi re·a`) and adjective + noun after to/in/at (`to a big house` used to be `dal·a·chi nokko re·a`; now `Anga dal·gipa nok·chi re·a`): fixed via `prep-phrase-rewrite` (verified singular locative token + `-rang`; adjective phrase from the object path).
3. `from` / `with`: `I come from that house.` = `Anga ua nokoni Re·ba·a` (-oni: master `from = ·oni`, verified `banoniko`); `I eat with that dog.` = `Anga ua achakming Cha·a` (-ming: verified pronoun forms `Ang·ming`, `Nang·ming`). **DERIVED, raka dots omitted, results carry `derived: true`, confidence <= 0.6.** Pronoun objects (`with him/me/you`) untouched.
4. `this is for you/me/them` = `Ia nang·na` / `Ia ang·na` / `Ia uamangna` (`ang·na` verified `Ang·na chi on·bo`; `nang·na` master unverified row); `Is that your dog?` / `Are those your dogs?` keep the demonstrative and `?` (no copular question particle is evidenced, so none is invented); adjective predicates `that is big` = `Ua dal·a`, `this is very good` = `Ia namen nama`; `this is mine/yours/his` = `Ia angni` / `Ua nang·ni` / `Ua uni`.
Updated stale tests: R5 (copula-stripping contract now checked on `that is all`), NV-214 `this is for them` (`ia uamangna`), irregular_verbs pin 57, `sin·a` -> `namnika` in adjective_position_rule006.
Gate: `npm run build` exit 0, unit 1033/1033, conformance 78/112 with 0 new mismatches, sweep 16,087 calls / 0 errors, strict probe 5,760/5,760, invariance probe 2,000/2,000.

## Still open (needs Thangseng or Claude A; deliberately NOT invented)
- Raka dots and exact forms of derived `-oni`, `-ming`, plural + locative (`nokrangchi`), `Ia angni` possessive-pronoun copulars.
- Copular question particle (`Is that your dog?` has no marker beyond `?`).
- Superlatives (`this is the best` -> `[UNKNOWN]`), `who are they` = `Sawa uamang`, `those = Uamang` / `these = Iamang` master rows (unverified; Wiktionary suggests `uarang` / `iarang`).
- Non-verb `like` (`like a dog`) now goes through `namnika`.
- Not run: 324-probe snapshot, browser/UI check.

## Add to the Thangseng list (state the tense!)
10. I come from that house. (present) = Anga ua nokoni re·ba·a.
11. I eat with that dog. (present) = Anga ua achakming cha·a.
12. I go to those houses. (present) = Anga ua nokrangchi re·a.
13. This is for you. (present, copular, no verb) = Ia nang·na.
14. Is that your dog? (present, question) = Ua nang·ni achak?
