# NV-225 (Claude B, 2026-10-29): native confirmation of the NV-219(B) tense-labelled list

Source: Thangseng, relayed by the Project Owner in chat 2026-10-29. Each sentence was sent with its tense (standing rule 1).
Result: 13 of the 15 sentences were correct as the engine derived them; two were corrected.

## Corrections (native)
| English (tense) | Engine had | Native |
|---|---|---|
| I come from that house. (present) | Anga ua nokoni re·ba·a | **Anga ua nokoni re·baa** |
| Is that your dog? (present, copular question) | Ua nang·ni achak? | **Ua nang·ni achakma?** |

## Confirmed unchanged (now native, no longer merely derived)
I see / saw / will see / do not see those dogs; Look at those dogs; I liked / will like / do not like that house; I saw / will see that;
I eat with that dog (`achakming`); I go to those houses (`nokrangchi`); This is for you (`Ia nang·na`).
This confirms the case suffixes `-oni` (from), `-ming` (with), plural + locative `-rangchi`, and `-na` (for) for these nouns.

## Engine changes
- `src/grammarEngine.js`: present of `come` is `re·baa` (was the dictionary headword `re·ba·a`). Present only; this also matches the raka table
  (`re·baa`), paradigm `come.present`, and `Sawa re·baa?`.
- `src/translationEngine.js`: copular noun questions take `-ma` on the predicate (`achakma`). Native: singular `that` + possessive. Derived by
  analogy (flagged `derived: true`): plural (`achakrangma`), `this`, article. Adjective predicates (`Is that big?`) stay bare `?` (not evidenced).
- Tests: `tests/unit/nv225_come_present_copular_ma.test.js` (new); nv200 / nv211 / nv219 expectations updated to `re·baa` and `-ma`.

## Gate
build exit 0; unit 1051/1051; rule conformance 79/112, 0 not in baseline; runtime-error-sweep 16,158 calls / 0 errors.

## Addendum: extra raka dot removed (Project Owner ruling, 2026-10-29)
The extra dot in `re·ba·` forms is wrong for every tense. All `come` forms are now written without it: present `re·baa`, past `re·baaha`,
future `re·bagen`, negative `re·baja` / `re·bajawa`, continuous `re·baenga`, command `re·babo`, purpose `re·bana` (the last follows the same
rule, not separately quoted). The headword `Re·ba·a` was the root cause, so the earlier grammarEngine present-tense special case was removed.
Fixed in: master_dictionary.json (8 rows), garo_dictionary.json (14), irregular_verbs.json (`came`), purpose_map.json, phrase_maps.js,
corrections.json (`i want to come`), conversation_patterns.json, Phrases.jsx, comments, and the tests that quoted the old forms.
`I came` rows (master, garo_dictionary, conversation_patterns) now read `Anga re·baaha`: they held the present-looking `re·ba·a`, which
disagreed with `came` = `-aha`. The NV-214 quote `Ua maiaba a·selni gimin re·ba·aha` is now `re·baaha` per the ruling.
Not changed (historical, not read by the engine): docs/migration_logs, docs/double_raka_fix_log.json, resync sweep data, final_entries.json, backups.
Gate: build exit 0; unit 1061/1061; rule conformance 79/112, 0 not in baseline; runtime-error-sweep 16,158 / 0 errors.

Native confirmation (Thangseng, relayed 2026-10-29, past): `came` = `re·baaha`; `he came for some reason or other` = `Ua maiaba a·selni gimin re·baaha.`
The engine output matches exactly (tests: reason_adjunct_composition, nv225).

## Open
- Claude A (note): master_dictionary.json rows were edited mechanically by Claude B at the Project Owner's request (dot removal only, no other fields).
- Claude A: promote `like = namnika`; review `those`/`these` rows and the retired `red house` row (NV-219(B) handoffs).
- `prep-phrase-rewrite` outputs are still flagged `derived: true` at confidence <= 0.6 although `-oni`/`-ming`/`-rangchi` are now native-confirmed.
