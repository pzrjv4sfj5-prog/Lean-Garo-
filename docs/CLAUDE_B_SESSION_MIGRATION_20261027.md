# Claude B session migration, 2026-10-27 (close-out)

## Project identity
Lean-Garo- (English -> Garo/A·chik translator). Claude B = engine lane (src/*.js, tests, governance). Claude A = data lane (master_dictionary.json promotion). Read docs/CLAUDE_B_SESSION_MIGRATION_20261026.md and docs/CLAUDE_B_NV219_DEMONSTRATIVE_PLURAL_20261027.md for the full account. Cite NV-219 from this lane as NV-219(B) (Claude A also used NV-219 for Re·rama).

## State
origin/main = local at push time; rebased onto Claude A's 83dbbb0 (NV-221). Working tree clean after this commit.
Gate on the merged tree: `npm run build` exit 0, unit 1037/1037, 0 new violations/mismatches/placeholders, rule conformance 78/112 (0 not in baseline), runtime-error-sweep 16,147 calls / 0 errors, strict no-drop probe 5,760/5,760, invariance probe 2,000/2,000, stress_237 benchmark: 0 output changes vs 83dbbb0 (no regression).

## Done
Plural demonstratives (`Ua/Ia achakrang`), bare `that` object = `uko`, `like` = `namnika` (Thangseng native); then derived coverage: adjectives/numbers/case suffixes, plural-adjective drop, bare this/those/these objects, copular + question + adjective/possessive predicates, benefactive, prepositional phrases (plural/adjective + to/in/at; from/with derived), multi-word nouns, `X-rang` plural rows, -ves plurals, `took` = `ra·aha`, bad `red house` row retired.

## Native vs derived (do not blur)
Native (Thangseng): `Ua achakrang` = those dogs; `Ia achakrang` = these dogs; `Anga ua nokko namnika.` = I like that house (present); `Anga uko nika.` = I see that (present). Everything else is rule output; prepositional rewrites carry `derived: true`, confidence <= 0.6.

## Handoffs (cannot be closed without native input; nothing else is open in the engine)
Claude A: promote `like = namnika`, then drop the corrections pin and `corrections:like` baseline row; review the retired `red house` row; `those = Uamang` / `these = Iamang` rows look like `them` (Wiktionary suggests `uarang`/`iarang`).
Thangseng (state tense with every sentence): the 14 tense-labelled sentences in the NV-219(B) doc. Needed: raka/forms of `-oni`, `-ming`, plural + locative (`nokrangchi`), copular question particle, superlatives (`this is the best` = [UNKNOWN]), non-verb `like`.
Not run: browser/UI check.

## Standing rules
1. Whenever a full sentence goes to Thangseng for checking, state the intended tense.
2. Never invent Garo: derived output must be flagged as derived and listed for native check.
3. PAT hygiene: the GitHub PAT was pasted into chat twice; rotate it, never store it in the repo config.
4. Rebase onto origin before pushing; for generated files take upstream and rebuild.

## Exact next step
Rotate the PAT; send Thangseng the tense-labelled list; when answers return, encode with provenance and tests, then ask Claude A to promote the master rows.
