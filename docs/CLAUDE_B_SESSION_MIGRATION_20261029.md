# Claude B session migration, 2026-10-29 (close-out)

Author role: Claude B (engine lane: src/*.js, tests, scripts, governance). This document reports only work Claude B performed this session (Rule 5). Claude A's NV-233/234/235/236 are not claimed here.
NV numbers: this lane used NV-225 (native confirmation), NV-227 (mechanical audit), NV-228 (capitals / bring / go). Claude A also used 225 and 228 and renumbered to NV-226 and NV-236. Cite by commit hash.

## Project identity
Lean-Garo- (English -> Garo/A·chik translator). Read first: this file, then `.ai/WORKSTATE.yaml` `claude_b.next_action_20261029`, then `docs/CLAUDE_B_NV225_NATIVE_CONFIRMATION_20261029.md` and `docs/CLAUDE_B_NV227_MECHANICAL_AUDIT_20261029.md`. Previous close: `docs/CLAUDE_B_SESSION_MIGRATION_20261027.md`.

## First item for the next session (Rule 10 resume)
`git fetch`, `git log --oneline bc8bbdd..origin/main`. Claude A pushed after my last push; nothing of mine is local. Resync, do not assume nothing changed.

## State at close
Claude B commits this session (oldest first, `git log --author="Claude B" a19a835^..bc8bbdd`): a19a835 / 72b2f07 / 8be9ba0 (NV-225), 53f0fce / e1e9318 / a0c7deb (NV-227), 6ecbde7 / a3e1799 / bc8bbdd (NV-228), plus the close commit that carries this file. Pushed; working tree clean and HEAD == origin/main at close (verified after the push).
Gate on the merged tree (HEAD 64950ce + this close): `npm run build` exit 0; unit 1117/1117; 0 NEW conflicts / placeholders / mismatches / collisions; rule conformance 79/112 (0 not in baseline); runtime-error-sweep 15,833 calls / 0 errors; `scripts/audit-mechanical.mjs` 1,329 probes: invariance 0, irregular-past UNKNOWN 0, hygiene 0, mid-sentence capitals 1, paradigm mismatches 3 (see Open).

## Done (personally performed)
- NV-225: Thangseng confirmed 13 of the 15 NV-219(B) tense-labelled sentences unchanged and corrected two: present `come` = `re·baa` (`Anga ua nokoni re·baa`), copular question `Ua nang·ni achakma?`. Engine: `-ma` on the predicate noun; tests nv225.
- Extra raka dot removed (Project Owner ruling, Thangseng native `re·baa`, `re·baaha`): come = `re·baa / re·baaha / re·bagen / re·baja / re·babo / re·baenga`; go = `re·a / re·anga / re·angenga / re·anggen / re·jawa / re·angjawa` (relay 2026-08-29, re-confirmed by the Owner), `Go!` = `Re·angbo`; bring = `ra·baa / ra·baaha / ra·bagen / ra·baja / ra·babo` (Owner ruling, by analogy). Fixed in master (non-superseded rows), garo_dictionary.json, corrections.json, conversation_patterns.json, purpose_map.json, irregular_verbs.json, phrase_maps.js, Phrases.jsx, comments, tests. `I came` rows now `Anga re·baaha`.
- NV-227 mechanical audit (`scripts/audit-mechanical.mjs`, report-only, wired into `npm run build`): period-dependent output (`I like the house` = `ang on·a rang`) traced to legacy template rows; irregular English pasts no longer `[UNKNOWN]` (fallback `did <lemma>`, derived, `src/data/english_irregular_pasts.json`); `feed`/`exceed` no longer read as past; bare `Verb!` takes `-bo` for every paradigm verb; `Please X` loses its stray period and takes `-bo`; `verb_paradigms.json` regenerated.
- NV-228 (Owner ruling: mid-sentence capitals neutralised): `translate()` = `translateRaw` + `neutraliseMidCapitals`. First word and post-sentence capitals kept; names/words passed through from the input, `Garo`/`Achik`, all-caps and inner-capital tokens kept; exact-phrase / correction / phrase-map / loanword-passthrough results untouched. About 90 test expectations lowercased.
- Data deleted per the Owner standing rule (delete replaced rows, do not suspend): legacy `<pronoun> <verb> <noun>` template rows, master and garo_dictionary.json (Claude A's NV-233 removed the remainder).

## Native vs derived (do not blur)
Native (Thangseng): the 13 confirmed sentences; `re·baa`; `Ua nang·ni achakma?`; `came = re·baaha`; `Ua maiaba a·selni gimin re·baaha.`; go forms `re·a / re·anga / re·angenga / re·anggen / re·jawa / re·angjawa`; `kata` = run.
Owner rulings (not native quotes): no extra dot in come/go/bring; capitals neutralised; delete-not-suspend.
Derived (flagged `derived: true` unless noted): `-ma` for plural / this / article nouns; irregular-past fallback; bare-command `-bo` for verbs not paradigm-native; `Please X` -> `-bo`; `re·bana` (purpose) and all `bring` forms (by analogy); prepositional rewrites (`-oni`, `-ming`, `-rangchi` are now native-confirmed but the rewrites are still flagged derived at confidence <= 0.6, not yet lifted).

## Runtime Handoff (Claude B)
Runtime Handoff: None. Every native-quoted form above is executed in tests and confirmed in engine output. Derived forms are listed under the Thangseng list below, not here.

## Duplicate-representation review (Rule 8)
Checked for `re·ba·`, `re·ang·`, `ra·ba·`: master_dictionary.json, garo_dictionary.json, corrections.json, conversation_patterns.json, purpose_map.json, irregular_verbs.json, phrase_maps.js, Phrases.jsx, tests, compiled_dict.json (regenerated): 0 `re·ba·`, 0 `re·ang·`, 1 `ra·ba·` = `Chiti·ra·ba·gipa` (postman, a different word, not changed, may carry the same extra dot: Claude A to check). NOT changed: superseded master rows, docs/ migration logs, backups, final_entries.json (historical, not read by the engine). The bring fix stays PROVISIONAL until a native form is quoted.

## Verification scope (Rule 7)
Executed and output inspected: full build gate, runtime-error-sweep, audit-mechanical (1,329 probes), per-form probes for every change above. NOT run this session: strict no-drop probe, invariance probe, stress_237 benchmark (so "no output drift vs the previous baseline" is NOT claimed), browser/UI check. Test pass counts confirm only the regression set; new behaviour was checked by the probes listed.

## Open / handoffs
1. `corrections.json` pin `i will cook` = `Anga Song·gen` keeps a mid-sentence capital (pinned results are exempt from neutralisation): lowercase it (found in migration mode, not fixed per Rule 9).
2. Claude A: promote `like = namnika` (drop the corrections pin and `corrections:like` baseline row); review `those`/`these` rows (`Uamang`/`Iamang` look like `them`) and the retired `red house` row; 30 rows such as `you (singular) run (present)` = `na· runa`, `he/she run` = `u runa`; vocabulary gaps `draw`, `wake`, `become`, `freeze`; record the Owner rules (delete-not-suspend, no extra dot, capitals neutralised) in governance, they are not in SESSION_BOOTSTRAP yet; check `Chiti·ra·ba·gipa`.
3. Paradigm vs engine mismatches left by the audit: negative of `know` (`uija` vs paradigm `hai·ja`), `help!` / `stop!` (verified exact rows vs derived paradigm). `like!` = `namnikbo`, `walk!` = `re·mambo` unconfirmed.
4. Not run: browser/UI check.

## Thangseng list (state the tense with every sentence, standing rule 1)
Drink! (command) = Ringbo; Ask! (command) = Sing·bo; Dance! (command) = Chrokbo; Please come. (polite command) = Ka·sapae re·babo; Are those your dogs? (present, question) = Ua nang·ni achakrangma?; Is this my house? (present, question) = Ia angni nokma?; I knew it. (past) = Anga uko hai·aha; I brought it. (past) = Anga uko ra·baaha; I will bring it. (future) = Anga uko ra·bagen.

## Standing rules
1. State the intended tense whenever a sentence goes to Thangseng.
2. Never invent Garo: derived output is flagged derived and listed for native check.
3. PAT hygiene: the PAT was pasted into chat repeatedly and used inline for pushes this session; the Owner said to delete it once the new token exists. Never store it in the repo config.
4. Rebase onto origin before pushing; for generated files take upstream and rebuild; for master_dictionary.json conflicts take upstream and re-apply scripted edits.
5. Owner rulings 2026-10-29: no extra raka dot in come/go/bring forms; mid-sentence capitals neutralised; delete replaced rows, do not suspend them.

## Governance-model check
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` not edited. One gate step was added to `npm run build` (`scripts/audit-mechanical.mjs`, report-only): Claude A / Owner to confirm whether it belongs in that document.

## Exact next step
Revoke the PAT and issue the new token; resync against origin; send Thangseng the list above; when answers return, encode with provenance and tests, then ask Claude A to promote master rows; fix the `i will cook` pin.
