# Claude A session migration, 2026-10-31 (paste into a new conversation)

## Project identity
Lean-Garo (github.com/pzrjv4sfj5-prog/Lean-Garo-): Garo dictionary and English-to-Garo engine. I am Claude A (linguistic authority; one small engine exception below, see Runtime). Owner: T. Native validator: Thangseng (relayed). Resumed from CLAUDE_A_SESSION_MIGRATION_20261028.md at bdedfb2.

## Current state
Session start bdedfb2. Pushed (each verified HEAD == origin/main): 511f399/a7750ce NV-226 poraina, 0fe7cc5/36e9a4e poraia study/read, d1c3b2a NV-227 closure, 31d0fe8 NV-236 (was 228) bed/food, 2c65c6b NV-229 imperative-object-ko, d96db47/47beb1b NV-230 live/alive, 3b0015a delete-not-suspend rule, 365c353 + 2b2a65c NV-231 keep-lists, da1b69c NV-232 cha·jok/cha·manaha, 8966a93 NV-233 conflicts, 666a455 NV-234 Kinachaka/Knabo/Ku·chaka, cf21eab NV-235 type guard, 64950ce renumber, 9ae41b0 NV-237 template rows, plus this close commit on top. Claude B pushed b4be6fc, e1e9318, 6ecbde7, a3e1799, bc8bbdd (NV-228 capitals/bring, template deletions). Gate at close: unit 1117/1117, repository-intelligence PASSED, runtime sweep 15698 calls / 0 errors.

## Done this session (A's own work only)
- NV-226: Owner ruled poraia = study = read; poraina = infinitive/purpose (not pora·na); Poraibo imperative; Anga poraienga = I am studying; Anga poraina ska = I want to study (Thangseng). to read row added so read! = poraibo. Chakchik poraibo, paradigm `read` stem, three corrections (Poraiahama / Poraijokma / Poraiengama, by composition) aligned.
- NV-227: open items closed from repo evidence (i stopped going pin removed; did-not NOT generalised to -jaha; to support = Chaka primary, al·du·na variant; shall i sit = Anga asongnama? by composition).
- NV-236 (first numbered 228): Thangseng bed/food sentences: Palang name tarigimin ong·a; Bijak name minaha (cooked properly); Bijak toaha song·a toaha; Cha·ani toa.
- NV-229: engine method `imperative-object-ko` (read the book = Ki·tapko poraibo; eat rice = Miko cha·bo; please -> Ka·sapae. ...). Grammar logic on RULE-029, not a native quote.
- NV-230: live (reside) donga / dongenga; live (alive) tanga / tangenggipa; alive = tanga; where do you live = donga.
- STANDING RULE (Owner, 2026-10-30): when a new correct word is given, DELETE the replaced row (no suspending). Old superseded rows stay until Thangseng verifies them (~1100; do not purge).
- Verification batches: nipple Sok kute, playing kal·enga, cooked Song·aha, cooking Song·enga; NV-231 keep-list (curry bijak, cut Den·a, daily Salanti, dance Chroka, dangerous namen kenbegnigipa, darkness Andalani, dead sigimin / Manggisi, deceive Tol·napa, doctor Sam on·gipa, down Ka·ma, dried tipjok / ran·aha, eaten cha·jok, few On·titi, goat Do·bok); duplicates deleted.
- NV-232: cha·jok and cha·manaha both retained, both simple past (Owner). NV-233: 138 unverified dup rows deleted where one verified word exists. NV-234: Kinachaka = to listen / heed advice; listen (imperative) Knabo / Knatimbo; Ku·chaka = respond (to a call) / confess. NV-237: 162 legacy OCR `<pronoun> <verb> (<tense>)` rows deleted (na· runa etc.).
- Close fixes: final_entries read po·ri·a, live tang·a, living git·tang·a deleted; Doctor / Sam on·gipa in two legacy files.

## Runtime Handoff (Claude B)
1. NV-229 `imperative-object-ko` and the NV-235 `translate()` type guard are my only code edits (translationEngine.js; guard sits in the wrapper above B's translateRaw). Please review.
2. `listen` continuous / third person is assembled as `Anga Kinachaka` (no native form): need Thangseng's continuous form of Kinachaka.
3. `i stopped going` = `Anga Re·angjaha` is Rule 17 (-jaha discontinuation), not a bug; homograph with native did-not-go for `go` only.
4. `read` family uses poraia via paradigm; confirm paradigm regeneration keeps `poraibo` / `porainabe`.
5. NV numbers I used: 226, 227, 229-237 (B took 225, 228). Check the counter before taking one. Next free: 238.
6. Verified live at close: study poraia, read poraia, to study poraina, i want to study Anga poraina ska, read the book Ki·tapko poraibo, listen Knabo, to listen Kinachaka, alive tanga, where do you live Na·a bano donga?, food is nice Cha·ani toa.

## Rule-generalization check (Governance §5)
New rule: none written (stem/sense rulings only). Standing rule added: delete-on-replace. Vocabulary-heavy session: flag if the next Claude A session also closes vocabulary with no grammar rule.

## Duplicate representation check: PASS (with fixes)
Checked master, final_entries, garo_dictionary, corrections, phrase_maps, purpose_map, irregular_verbs, verb_paradigms, src/*.js, tests, docs/grammar_rules_structured for pora·na, po·ri·a, tang·a, kina·chak·a, ku·chak·a, na· runa, Knachika, Kala·enga, Giso·enga, Sam·on·gipa, bi·jak. Fixed at close: three final_entries rows, two Doctor rows. Remaining hits are intentional (superseded rows kept per Owner; unrelated words such as mit·tang·a, sam·bi·jak, Leaf bi·jak).

## Rework-prevention checklist (Governance §12)
- Already resolved before? NV-232 restored cha·manaha that my NV-233 sweep had deleted in error; the sweep must exclude rows Owner has just ruled.
- Other representation with old value? Checked, see above.
- Runtime vs linguistic? Two small code edits, handed to B for review.
- Generalizes? Delete-on-replace rule recorded.
- Over-derived? Composed rows are labelled by composition (Poraiahama/Poraijokma/Poraiengama, Anga asongnama?, imperative-object-ko).

## Open items
- Spelling alignment: Leaf = bi·jak (NV-080) vs curry/food `bijak` (no dot, today); Promise = ku·chak·a vs Ku·chaka; obedient = Knachika·gipa (from old listen); ripe = min·a vs minaha. Need Owner/Thangseng spelling ruling.
- Batch 1 verification, 4 of 10 still suspended: knowledge, teach, walking, help; ~1100 older suspended rows (29 from NV-095).
- 71 keys with several verified words (docs/CONFLICT_RESOLUTION_NV233.md), 720 keys with no verified word, 26 human-noted unverified rows, cross-table bought / heard / standing / sitting.
- Continuous form of Kinachaka; bare `dried` primary (tipjok vs ran·aha); `cha·manjok` not restored; purpose form of dance; vocabulary gaps draw / wake / become / freeze; `ka·a soa`, hit, break, D's OCR flags unchanged.

## Standing rules (unchanged; do not re-litigate)
Anga always; apostrophes and periods inside Garo words are raka typos (forms written without one keep no raka); native text stands where Owner says so; provenance labels (Thangseng quote vs Owner directive vs by-composition); apply only what is ruled; delete the replaced row when a new correct word is given, never mass-purge old suspended rows; PAT: one-shot header only, never in .git/config or any file, rotate it (it was pasted in chat this session); fetch and compare before push, rebuild generated files after every rebase, re-run the gate, verify HEAD == origin/main.

## Repository status at close (verified against the repo)
See the closing message for final hashes, verified after the push: HEAD == origin/main, git status clean, WORKSTATE.yaml updated (handoff_20261031_nv226_237, next_action_claude_a_20261031), SESSION_BOOTSTRAP.md pointer updated, this doc complete, no local-only commits, no uncommitted files.

## Exact next step
New conversation: paste this file, clone with a fresh PAT (scrub it from .git/config), git fetch, verify HEAD, read .ai/SESSION_BOOTSTRAP.md then .ai/WORKSTATE.yaml, run the gate (install js-yaml with --no-save for conformance), then take Owner words: the four suspended batch-1 rows (knowledge, teach, walking, help) and the spelling alignments listed above; first: bijak spelling (Leaf vs curry/food).
