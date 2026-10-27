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
