# Claude A session migration, 2026-11-01 (paste into a new conversation)

## Project identity
Lean-Garo (github.com/pzrjv4sfj5-prog/Lean-Garo-): Garo dictionary and English-to-Garo engine. I am Claude A (linguistic authority; data only this session, no engine code touched). Owner: T. Native validator: Thangseng (relayed, blocks drafted by an intermediary, raw messages not on file). Resumed from CLAUDE_A_SESSION_MIGRATION_20261031.md at 768429c.

## Current state
Pushed this session (each verified HEAD == origin/main after the push; later: dce9e5d close, 8d1e1aa NV-254): ddada5d NV-243, b847354 really? pin, a6b038f NV-244, f496965/703eebf NV-245, 3d1a274 NV-247 (rebased over Claude B), e00fee2 NV-248, 65a65ea NV-249, be49519 NV-251, plus the close commit (hash in the closing message). Gate at last full run: dictionary tests pass, repository-intelligence 0 new violations, unit green, runtime sweep 0 errors, audit-mechanical 0.

## Done this session (A's own work only)
- NV-243 (batch-1 closure): help = dakchaka, walking = re·enga; suspended rows deleted. teach part SUPERSEDED by NV-251.
- b847354: stale phrase_maps pin `really?` fixed to Bebema? (native NV-080); baselined `phrase_maps:really` (Check F strips `?`, key collision).
- NV-244: right = Jak·ra (direction); kra·a = the "correct" sense. NV-245: i am fine = Anga namenga (primary; namengava stays variant). NV-247 (renumbered from 246): `that is right` = kra·a; teacher = Skigipa confirmed.
- NV-248 (Thangseng batch): promise = Ku·rachaka (reverses NV-242), Ku·chaka = confess/admit/respond, cabbage = banda kobi, run away = katanga, obedient = knachakgipa / katta ra·gipa, letter = chitti, kingsa = a/one classifier; 8 sentence pins (eat rice = Mi cha·bo, drink water = Chi ringbo, he is running away, i knew it, i brought it, i will bring it, are those your dogs?, is this my house?). The block said 16 pins: it held 8 vocabulary entries + 8 sentence pins.
- NV-249 (Thangseng block): chata (no raka) homonym = umbrella (n.) / to fit (v.); chatchi = kin / relative / clan; pin what kin are you? = Na·a mai chatchi?.
- NV-251 (Owner, renumbered from 250): teach = Skia (native-verified); every Sikie row deleted; given words override old, dups deleted for umbrella (sat·ti, Satta), fit, cabbage (Kobi), promise.
- NV-252 (Owner): door = do·ga (overrides do·oga); old verified do·oga row deleted, do·ga promoted, doorway stem aligned (still unverified), phrase_maps pin + one test updated.
- Detail log of each step: Addenda below.

## Runtime Handoff (Claude B)
1. Bare-noun imperative (`Eat rice!`, `drink water!`, `please eat rice`): Claude B's NV-250 commit (19f4e19) already fixed it; I re-verified `Mi cha·bo` / `Chi ringbo` on the `!` forms after pulling. docs/HANDOFF_CLAUDE_B_20261101_imperative_bare_noun.md is now historical.
2. repository-intelligence Check F joinKey strips `?`, so keys differing only by `?` collide (`really?` vs `really`); baselined, please consider keying on the raw string.
3. compiled_dict `to walk` tie-break picks Re·rama while the shipped primary is Re·mama (engine output correct).
4. NV numbers: A used 243-245, 247-249, 251, 252; B used 246 and 250. Check the counter before taking one. Next free: 253.
5. Verified live at close: teach Skia, to teach Skia, door do·ga, umbrella chata, to fit chata, kin / relative / clan chatchi, what kin are you? Na·a mai chatchi?, cabbage banda kobi, promise Ku·rachaka, run away katanga, letter chitti, right Jak·ra, that is right kra·a, i am fine Anga namenga.

## Rule-generalization check (Governance §5)
New rule: none written (vocabulary and pin rulings only). Standing rule applied again: given words override old words, delete the replaced rows and duplicates. Vocabulary-heavy session: flag if the next Claude A session also closes vocabulary with no grammar rule.

## Duplicate representation check: PASS
Checked master, garo_dictionary, final_entries, corrections, phrase_maps, pending_lexicon, tests for Sikie, Skie on·a, sat·ti, Satta, Kobi, chi·ti, katsit·tap·a, Bakdil, kinsman chat·chi, do·oga. Pending-lexicon links to deleted rows were set to rejected (PL-0000238). Remaining hits: the NV-081-era `Door` text in docs and old tests that only describe history.

## Rework-prevention checklist (Governance §12)
- Already resolved before? NV-243 teach (Sikie) was reversed by NV-251 (Skia); NV-242 promise spelling reversed by NV-248; NV-080/2026-08 do·oga reversed by NV-252. All three are newer native/Owner evidence, logged.
- Other representation with old value? Checked, see above.
- Runtime vs linguistic? Data only; one Claude B handoff already picked up.
- Generalizes? Delete-on-replace applied, no new rule.
- Over-derived? doorway = do·ga·chol is a stem alignment, still unverified.

## Open items
STILL OPEN, each needs a native word or Owner ruling, none blocks the build:
- knowledge (Gni / Ma·siani superseded; engine ships U·iani ba ma·siani).
- (CLOSED by NV-259) Skia family: learn = Skia = teach. Still unruled: `i am learning` = `Anga bida` (learning = Bida).
- door: `Open the door` / `Close the door` pins use the loan word Duar (verified rows); do·ga forms not ruled. doorway = do·ga·chol unverified.
- `to help | Chaka` unverified, unruled. kinsman now ships ang·bak (unverified).
- Glossary keys with slashes/parentheticals return [UNKNOWN] (not user sentences).
- Backlog: 71 keys with several verified words (batches of 10), 464 verified + suspended, 720 no verified word, ~1100 old superseded rows (verify, do not purge).

## Standing rules (unchanged; do not re-litigate)
Anga always; apostrophes and periods inside Garo words are raka typos (forms written without one keep no raka); native text stands where Owner says so; provenance labels (Thangseng quote vs Owner directive vs by-composition); apply only what is ruled; given words override old, delete the replaced row and duplicates, never mass-purge old suspended rows; gate with hard stops before any commit (a chained command once pushed past a failing check); PAT: one-shot header only, never in .git/config or any file, rotate it; fetch and compare before push, rebase over Claude B and renumber NV on collision.

## Repository status at close (verified against the repo)
Verified after the final push, values in the closing message: HEAD == origin/main, git status clean, WORKSTATE.yaml updated (handoff_20261101_nv243_252, next_action_claude_a_20261101), SESSION_BOOTSTRAP.md pointer updated, this doc complete, no local-only commits, no uncommitted files, native-validation blockers listed under Open items.

## Exact next step
New conversation: paste this file, clone with a fresh PAT (scrub it from .git/config), git fetch, verify HEAD, read .ai/SESSION_BOOTSTRAP.md then .ai/WORKSTATE.yaml, run the gate, then take Owner words: knowledge, the Skia family forms, door phrases, then the 71 multi-verified keys in batches of 10. Next free NV: 260.

---

# Detail log (addenda moved from the 20261031 doc)

## Addendum 2026-11-01: NV-243 (batch-1 closure, Owner relaying Thangseng)
- help = dakchaka (verified row stays; suspended `chak·a` row deleted). `to help | Chaka` (unverified) not ruled, untouched.
- walking = re·enga (verified row stays; suspended `Re·ang·enga` row deleted).
- teach = Sikie for every teach form (Owner). Replaced `Skie on·a` (verified, master row + garo_dictionary x2) and suspended `Sikie on·a`; phrase_maps pin updated. `teacher = Skigipa` not ruled, untouched (flag: spelling vs Sikie).
- STILL OPEN from batch 1: knowledge (Gni / Ma·siani superseded; shipped U·iani ba ma·siani). Next free NV: 244.

## Addendum 2026-11-01b: bug sweep
- FIXED: phrase_maps `really?` pinned superseded `chek·chek`; now `Bebema?` (native-confirmed NV-080). Baselined `phrase_maps:really` in known_cross_source_conflicts.json: Check F's joinKey strips `?`, so `really?` and `really` collide in compiled_dict (the Check F key collision is a check limitation, not a data conflict).
- FLAGGED, not changed (need Owner ruling): `right` pin `Jak·ra` is superseded vs verified variant `kra·a` (direction vs correct unclear); `i am fine` ships `Anga namenga` while verified variant `Anga namengava.` (NV-203) exists; `to walk` compiled `Re·rama` vs shipped `Re·mama`; `teacher = Skigipa` vs teach = Sikie; `knowledge` still open.
- Dictionary-gloss keys with slashes/parentheticals (`him / her / it (accusative object)`, `it exists / it's there`, `to hold (as this room holds 50 persons)`) produce [UNKNOWN] output through the engine; they are glossary keys, not user sentences.

## Addendum 2026-11-01c: NV-244
- right = Jak·ra (direction, Owner). kra·a = 'correct' sense. phrase_maps pin `right: Jak·ra` now matches a verified row. Next free NV: 245. Unruled: `that is right` currently resolves to Jak·ra via stopword-stripping (wrong sense; kra·a likely).

## Addendum 2026-11-01d: NV-245
- i am fine = Anga namenga (Owner, primary; engine already shipped it via corrections). Added non-variant verified row so compiled_dict agrees; `Anga namengava.` kept as verified variant. Next free NV: 246.

## Addendum 2026-11-01e: NV-247 (renumbered from 246: Claude B took NV-246)
- `that is right` pinned to kra·a (correct sense; Owner). teacher = Skigipa confirmed as-is (verified row untouched). Owner also wrote "teach is Skia(n)" in the same message: ambiguous vs NV-243 teach = Sikie, NOT applied, awaiting clarification. Next free NV: 248.

## Addendum 2026-11-01f: NV-248 (Thangseng batch, relayed by Owner)
- Vocabulary: me·su = vegetables (already NV-240, confirmed; no sam·bi·jak vegetables row exists); cabbage = banda kobi (new primary, Kobi kept as native variant); promise = Ku·rachaka (reverses NV-242 Ku·chaka for promise); Ku·chaka = confess/admit/respond (admit added); obedient = knachakgipa / katta ra·gipa; run away = katanga (deleted katsit·tap·a and unverified kata); letter = chitti (deleted chi·ti); kingsa = a/one classifier-article (glossary row).
- Pins (8) + 2 variants: eat rice = Mi cha·bo, drink water = Chi ringbo, he is running away = Ua katangenga, i knew it = Anga uko hai·aha (variant u·iaha), i brought it = Anga uko ra·baaha, i will bring it = Anga uko ra·bagen, are those your dogs? = Ua nang·ni achakrangma? (variant Ua achakrang nang·nima?), is this my house? = Ia angni nokma?. The block said "16 pins": it contains 8 vocabulary entries + 8 sentence pins; no further sentences were present. Terminal periods dropped to match shipped style.
- Baselined 3 primary+variant verified keys (obedient, i knew it, are those your dogs?) in known_dictionary_conflicts.json.
- Handoff: docs/HANDOFF_CLAUDE_B_20261101_imperative_bare_noun.md (bare-noun default; `!` forms still ship -ko). Next free NV: 249.

## Addendum 2026-11-01g: NV-249 (Thangseng block, relayed by Owner)
- chata (no raka) = umbrella (n.) AND to fit (v.), homonym tagged by pos (rows `umbrella`, `an umbrella` n.; `to fit`, `fit` v.). Shipped umbrella is now chata; sat·ti kept as verified variant. Unverified `fit` rows (tang·rong·rang·a, dang·a, ...) left in place, outranked. chat·a (raka) = thick/dull is a different word.
- chatchi (no raka) = kin / relative / clan (rows kin, relative, clan, n.). Deleted unverified `kinsman | chat·chi` (dotted spelling replaced); kinsman now ships ang·bak (unverified). Deleted unverified `relative` = Bakdil (replaced by chatchi); its pending_lexicon link PL-0000238 set to rejected.
- Pin: `what kin are you?` = `Na·a mai chatchi?`. Tests: tests/unit/nv249_chata_chatchi.test.js. Next free NV: 250.

## Addendum 2026-11-01h: NV-251 (Owner rulings; renumbered from 250, Claude B took NV-250)
- teach = Skia (Owner: native-verified). NV-243 `Sikie` rows and all legacy `Sikie on·a` / `Skie on·a` rows deleted (master, garo_dictionary, final_entries); phrase_maps pin = Skia; `to teach` added. teacher = Skigipa unchanged. NV-243's teach ruling is superseded by this entry.
- Standing: given words override old words, duplicates deleted. Applied to NV-248/249 keys: umbrella (deleted sat·ti, Satta; chata confirmed), fit (deleted chak·a, dang·a, jak·chak·a, tang·rong·rang·a), cabbage (deleted Kobi, ba·da ko·pi, bi·jak ko·pi; banda kobi sole), promise (deleted Ka·ra chaka, ku·mik·chet·a, ku·wat·a, old Ku·chaka). Applied to cabbage/promise by the standing rule, not an explicit per-item answer: restore from git history (e00fee2) if Owner disagrees.
- Not changed, noted: `learn = Sikia` (garo_dictionary, unverified), `educated = skia man·gipa`, purpose_map `teach = skia on·na` and `learn = skia·na` (may need aligning with Skia). Next free NV: 252.

## Addendum 2026-11-01i: NV-252 (Owner directive)
- door = do·ga (written `do.ga`, raka read as `·`). Deleted verified `Door | do·oga`; promoted the superseded `door | Do·ga` row to verified_high (note rewritten, since prepare-data treats a note starting with "superseded" as authoritative); doorway `do·oga·chol` -> `do·ga·chol` (unverified); phrase_maps `door` pin and `translationEngine.test.js` door test updated. `Open/Close the door` rows (Duar pekatbo / Duar petbo) untouched. Next free NV: 260.

## Addendum 2026-11-01j: NV-254 (Owner synonym rulings on the Claude B grammar-reference PDF)
- Source: PDF `top_priority (first checking)` (Claude B's compile from Burling, Phillips, web; Thangseng's only marks are removal/not-checked notes). Compared 53 example sentences with the engine: 24 matched; differences are mostly earlier rulings. No PDF sentence was pinned (provenance mixed, Owner did not say which are native-validated).
- Owner directive: Bia = Ua, Namengaba = namenga, bajalchi = antichi are synonyms. Primaries unchanged (Ua, Anga namenga, bajalchi). Added verified variant rows: `she | Bia`, `I am fine | Anga namengaba`, `to the market | antichi` (placed before the primary row: same-case duplicate keys fall back to last-write-wins in pickPrimary); `he | Bia` note updated. No `it | Bia` row (not ruled).
- Reverses the NV-223 note "never store antichi as market" only for the destination form `to the market`. `anti` stays `week` (NV-087, native); no `anti = market` row; base noun of antichi not given, open.
- Baselined `she` and `to the market` (primary + verified variant) in known_dictionary_conflicts.json.
- Engine bugs found by the comparison, for Claude B (still present at bdaf50f): `don't eat!` -> `Cha·bo!` (negation lost, `do not eat` works), `i have gone` -> `Anga donga`, bare plurals `dogs`/`people` -> `Achak`/`mande` (NV-169 `-rang`), `at the house` -> `Nok` (locative -o dropped), `i am not eating` -> `Anga cha·ja` (progressive lost). Tests: tests/unit/nv254_synonyms.test.js. Next free NV: 260.

- Update after syncing to Claude B's NV-255 (bd96796): `don't eat!` (now `Cha·nabe`) and `i am not eating` (now `Anga cha·jaenga`) are FIXED. Still open for Claude B: `i have gone` -> `Anga donga`, bare plurals `dogs`/`people` -> `Achak`/`mande`, `at the house` -> `Nok`. NV numbers: B used 246, 250, 253, 255, 256, 257; mine 243-245, 247-249, 251, 252, 254, 258; next free 259.

## Addendum 2026-11-01k: NV-258 (Owner: do·ga final, delete Duar; renumbered from 256, Claude B took NV-256 and NV-257)
- door = do·ga is FINAL (Owner). Every live Duar form removed: master `Open the door` = `do·ga pekatbo`, `Close the door` = `do·ga petbo` (door word swapped in place, verb unchanged; by-composition swap under the Owner directive, not a new native quote); test `imperative_object_ko.test.js` close-the-door line updated. compiled_dict has 0 Duar hits. `sentences200.json` (raw source corpus, not read by the build) still holds the original Duar text as a historical record; docs mentioning Duar are history.
- For Claude B: `Close the door!` (with `!`) still ships `Do·gako chip·bo` via `imperative-object-ko` (verb `chip·bo`, with -ko), while the exact pin `close the door` = `do·ga petbo`; same `!`-path-before-exact-pin shape as the eat rice / drink water fix. Please let pins win and align the verb.
- Closes the door-phrases item from Open items above. Next free NV: 260.

- Update after syncing to Claude B's NV-256/NV-257 (785712a): `i have gone` is FIXED (`Anga re·angmanaha`). Still open for Claude B: bare plurals `dogs`/`people` -> `Achak`/`mande`, `at the house` -> `Nok`, `Close the door!` -> `Do·gako chip·bo`. Runtime sweep 15743 calls, 0 errors.

## Addendum 2026-11-01l: NV-259 (Owner: skia is also learn)
- learn / to learn = Skia (Owner ruling, same word as teach, NV-251). Deleted `Learn | ski·a` (native NV-080) and every `Sikia` row (master, garo_dictionary, final_entries; final_entries `ski·a` variant too); phrase_maps `learn` = Skia; purpose_map `teach` `skia on·na` -> `skia·na` (stem + -na, same as learn; by composition, the old form came from Skie on·a). `i want to learn` and `i want to teach` now both ship `Anga skia·na ska` (expected: one word, context decides). `educated = skia man·gipa` unchanged. Left: `sin·ing·a` (learn, superseded/variant, a different word) and `learning = Bida`, `i am learning` = `Anga bida`: not ruled. Closes the Skia-family open item. Next free NV: 260.
