# Claude A session migration, 2026-10-28 (paste into a new conversation)

## Project identity
Lean-Garo (github.com/pzrjv4sfj5-prog/Lean-Garo-): Garo dictionary and English-to-Garo engine. I am Claude A (linguistic authority; no engine code). Owner: T. Native validator: Thangseng (relayed). Resumed from CLAUDE_A_SESSION_MIGRATION_20261027.md at 109dfb9.

## Current state
Session start 109dfb9. Pushed (each verified HEAD == origin/main): 8fee1c2 raka sweep, ff4b2a8 tie-break audit doc, 83dbbb0 NV-221, 012ff0a NV-222, fd3617e NV-223, 1ad71db NV-224, plus this close commit on top. Claude B pushed 48c7245 in between (docs/dist only). Gate at close: dictionary PASSED, repository-intelligence 0 new violations, unit 1041/1041, rule conformance 79/112 with 0 unbaselined, runtime sweep 0 errors. Next free NV: 225. Next free RULE: 056.

## Done this session (A's own work only)
- Raka-typo sweep: periods/apostrophes inside Garo values -> `·` in master, final_entries, garo_dictionary, corrections, phrase_maps (today, mother, country, be, ...). 7 resulting exact duplicates removed; 3 stale tests re-expected.
- Audit (read-only): 60 of 65 tied keys are deliberate documented synonym sets; 3 are noun/verb splits (answer, hope, demand); to support (Chaka vs uncited al·du·na) left; to walk compiles Re·rama because pickPrimary falls to last-write-wins when same-case rows tie (docs/CLAUDE_A_TIEBREAK_PASS_20261027.md).
- NV-221: Thangseng's written response document (items A-Q) processed. 39 verified rows (spatial sentences, lying down, ska paradigm forms, nangja, archaic bairong / ku·bilbat, did-you-eat context pair, nangnika, Ku·sik jroenga, nisona ...). Fixed `i don't want` = Anga sikja (nang·ja means don't need). Details: docs/CLAUDE_A_NV221_THANGSENG_RESPONSE_20261027.md.
- NV-222: Owner ruled the native text stands: I am not going = Anga re·angjaenga; He did not go = Ua re·angjaha. RULE-030 claim 2 closed (my 2026-07-26 cessative reading withdrawn for this verb).
- NV-223: open items closed from repo evidence (web had no usable Garo lexical sources): I am sick = Anga sakamenga; I am hungry = Anga okkrienga; how are you, poraina vs pora·na, -de, -jaha vs -ja closed with no change. Correction of my own NV-222 error: market rows had `antichi`; reverted to `bajalchi` per the CLOSED Anti = week / Bajal = market decision. Also briefly flipped `i can go` and reverted: ama is an Owner sentence (NV-213). docs/CLAUDE_A_NV223_OPEN_ITEMS_CLOSURE_20261028.md.
- NV-224 (Owner statement): sia = die, sina = to die (infinitive -na), `Sina skengama?` = Do you want to die?; old `si·a` die row superseded.
- Close commit: RULE-055 (irregular ska paradigm) and three stale secondary representations fixed (see duplicate check).

## Runtime Handoff (Claude B)
1. ska paradigm (RULE-055): engine composes `skja` for don't want outside the pin, builds `Do you want to eat/go?` as `... skama?` (confirmed progressive gives `... skengama?`) and ships `I want to eat` = Anga cha·na ska (correction) against confirmed `skenga`. Fix in verb_paradigms.json / grammarEngine.js.
2. pickPrimary (prepare-data.js): same-case variant rows fall to last-write-wins; compiled `to walk` = Re·rama while phrase_maps pin hides it. Any new same-case variant can flip a primary.
3. POS-aware lookup for answer / hope / demand (noun vs verb); bare key ships the verb.
4. Observed, not changed: dropped words (`He is my friend` loses "my"; `She is cooking food in the house` loses "food"), pre-noun adjective `-gipa` rule not applied (`The big dog bit the small cat`), mid-sentence capitals (`Anga miko Cha·a`), `uko` compound-split [UNKNOWN] tags, `Do you have a boyfriend?` casing.
5. Verified live at close: I am not going / did not go (+ market, bajalchi), I am sick, I am hungry, I can go (ama), to die / die / Do you want to die?.

## Rule-generalization check (Governance §5)
New rule: RULE-055 (ska irregular paradigm follows sika; progressive skenga regular; ska vs nanga). Updated: RULE-030 claim 2. Two vocabulary-heavy sessions in a row is not triggered yet (this session produced a rule); flag only if the next session closes vocabulary with no rule.

## Duplicate representation check: PASS
Checked master_dictionary.json, final_entries.json, garo_dictionary.json, src/data/corrections.json, src/data/phrase_maps.js, src/*.js, tests/unit, docs/grammar_rules_structured for the old values (Anga okkria, Anga sakama, Anga nang·ja, antichi market forms, die = si·a). Found and fixed at close: corrections `i do not want`, garo_dictionary `I don't want`, final_entries `die`. Remaining hits are intentional: superseded master rows (history) and the original native quote in RULE-030's example text. No new exact duplicate (english, garo) pairs vs session start.

## Rework-prevention checklist (Governance §12)
- Already resolved before? `i can go` = ama (NV-213) and Anti/Bajal (closed 2026-09-21): I nearly overrode both; both caught and reverted/corrected before the final push.
- Other representation with old value? Checked, see above.
- Runtime vs linguistic? Handoff items above are B's; no engine code touched.
- Generalizes? Yes: RULE-055.
- Asked native something established? No. Over-derived? `Anga sakamenga`, `Anga sikja`, `okkrienga` are composed from native roots plus a confirmed paradigm, labelled "by composition"; `poraina` not adopted.

## Open items
Owner/native: `to support` Chaka vs al·du·na (uncited doc7); NV-222 `re·angjaha` is now both "did not go" and the corrections row `i stopped going` (homograph, context decides; say if you want the stopped-going row changed); `ka·a soa` = irritated (unconfirmed, "I think"); poraina vs pora·na stem (optional single question to Thangseng); items 29/30 of the July document unconfirmed; D's held OCR rows and Matri/Matkalsi/Me·mana·song flags; `Shall I sit?`; per-class raka confirmations; unverified base verbs (hit, break, make). Generalising `did not X` to -jaha is not done and not ruled.

## Standing rules (unchanged; do not re-litigate)
Anga always; apostrophes and periods inside Garo words are raka typos (forms written without one keep no raka); native text stands where Owner says so; Anti = week, Bajal = market (closed); `i can go` = ama is an Owner sentence; provenance labels (Thangseng quote vs Owner directive vs by-composition); apply only what is ruled; PAT: one-shot header, scrub .git/config, rotate; set repo-local git identity; fetch and compare before push and keep the clone until HEAD == origin/main is verified; never delete superseded history without Owner say-so except exact duplicates the Owner has said are unaffordable.

## Repository status at close (verified against the repo)
See the closing message for final hashes, verified after the push: HEAD == origin/main, git status clean, WORKSTATE.yaml updated (handoff_20261028_nv221_224_closures, next_action_claude_a_20261028), SESSION_BOOTSTRAP.md pointer updated, this doc complete, no local-only commits, no uncommitted files.

## Exact next step
New conversation: paste this file, clone with a fresh PAT (scrub it from .git/config), git fetch, verify HEAD, read .ai/WORKSTATE.yaml and .ai/SESSION_BOOTSTRAP.md, run the gate (install js-yaml with --no-save for conformance), then take Owner decisions on the open items; first: whether `i stopped going` should stay the same string as `Ua re·angjaha`.
