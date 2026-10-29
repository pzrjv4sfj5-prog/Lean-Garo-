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

## Open (not touched)
- `re·ba·gen` (future), `re·ba·ja` (negative) and `re·ba·aha` (past, grammar-assembly) still carry the extra raka dot; paradigm says `re·bagen`,
  `re·baja`, `re·baaha`. Past `re·ba·aha` also has a native relay (NV-214 `Ua maiaba a·selni gimin re·ba·aha`), so dot placement is inconsistent
  in native sources: needs one native ruling before changing.
- `corrections.json` `i came` = `Anga re·ba·a` looks stale (present form pinned as past).
- Claude A: promote the confirmed forms; `like = namnika`, `those`/`these` rows and the retired `red house` row are still pending from NV-219(B).
- `prep-phrase-rewrite` outputs are still flagged `derived: true` at confidence <= 0.6 although `-oni`/`-ming`/`-rangchi` are now native-confirmed.
