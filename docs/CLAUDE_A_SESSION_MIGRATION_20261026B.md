# Claude A session migration, 2026-10-26B (paste into a new conversation)

## Project identity
Lean-Garo: Garo dictionary + English-to-Garo engine. Repo `github.com/pzrjv4sfj5-prog/Lean-Garo-`, branch `main`. Owner: T (Project Owner). Relay: Tridip. Native validator: Thangseng. Claude A = linguistic data + governance; Claude B = engine; Claude C = audits; Claude D = OCR. Also read `docs/CLAUDE_A_SESSION_MIGRATION_20261026.md` (earlier same-day A session) and `docs/CLAUDE_A_NV213_CLOSURE_20261026.md` (this session's NV-213/214/216/217/218 log).

## Current state
- Resumed from the 20261026 migration doc; origin was f378583 on arrival. Content head at close: 7448d66 (NV-218), then Claude B's 06866c9 (docs only) sits under it; Head = the commit this file ships in (`git log --oneline -3`). WORKSTATE `repository.head` is a content checkpoint, pointer `claude_a.next_action_claude_a_20261026B`.
- Gate at close: dictionary check PASSED (0 new violations), unit 948/948 (re-run after the final rebase).
- NV numbers: A used 213, 214, 216, 217, 218 this session. B also used 214 (uamangna/uamangchi split, `nv214_uamangna_uamangchi_split.test.js`) and 215 (demonstrative + noun). Number 214 is therefore shared; check `ls tests/unit | grep nv2` before taking the next free number (219).

## Done this session (A's own work only)
- NV-213: `whose`/`whose?` = Sani, `someone's` = Saniba promoted to verified_high (Owner: from the native dictionary; Owner directive, not a Thangseng quote); bare `whose` row added. `mouse` = Mangchut (n.) added verified_high; unverified `me·se` superseded, retained. Closes the sani/saniba open item.
- NV-214: Owner directive (unattributed "newly verified" split): walk/to walk = Re·mama (verb, raka); roam/to roam/wander/to wander = rorama (no raka; roam already native NV-095). Re·a and re·am·a demoted to variants. phrase_maps.js pins `walk`, `to walk`. Test `nv214_walk_roam.test.js`.
- NV-216: Re·a recorded as a valid synonym for walk (variant, Re·mama stays primary). New verb Re·rika = follow / to follow / accompany / to accompany, verified_high (Owner directive). Test `nv216_rerika.test.js`.
- NV-217: Owner verified Claude D's mang no-dot audit (`data/claude_d/audit/mang_classifier_dot_audit_20261026.json`). 112 verified_high master rows de-dotted at the `mang·` boundary only (teens/twenty/hundred keep internal dots: `mangchi·sa`, `mangKolgrik`, `mangritchasa`); 24 excluded rows untouched. One-token engine edit by A at Owner direction (mang removed from RAKA_CLASSIFIERS in `src/garo_classifier.js`) so master+engine+tests landed green together; 15 test files re-expected. This supersedes the 2026-09-28/29 re-dot. king keeps its dot.
- NV-218: D's OCR batch Me..Mau (61 entries) promoted to master as unverified, after an independent duplicate check (0 Garo/English dups; Matri "a fit" kept and flagged; Melaprua noun+verb both kept). 8 held rows NOT added.
- Claude D sync: pulled D's pushes (mang audit, Owner dedup, OCR batch). Nothing owed to A from D now except page numbers (Owner, manifest.json) and the held rows (need page images).

## Runtime Handoff (Claude B)
- "walk", "to walk"
  Linguistic decision: Re·mama primary; Re·a valid synonym (both Owner directive NV-214/216). Evidence: Project-Owner-directed (chat), NOT a Thangseng quote; overrides NV-100 and the 2026-09-09 directive (kept as variant).
  Expected Garo output: Re·mama.
  Duplicate representations checked: master, garo_dictionary, final_entries, phrase_maps.js, corrections.json, compiled_dict.
  Runtime/override locations to verify: compiled_dict.json "to walk" still compiles to Re·a (pickPrimary); masked by the phrase_maps pin; `phrase_maps:to walk` allowlisted in known_cross_source_conflicts.json and `to walk`/`accompany`/`mouse` in known_dictionary_conflicts.json. Verb paradigm `walk` root is re·a (valid synonym forms re·aha, re·enga); Re·mama's own inflected forms are not defined. purpose_map `walk` = re·a·na unchanged.
  What A verified: live translate of walk, to walk, i walk (Re·mama); he walked = re·aha, walking = re·enga (synonym forms).
  What A has NOT verified: pickPrimary fix, Re·mama paradigm (needs Owner/Thangseng forms). Spelling `Re.rama` (Owner's later wording) vs `Re·mama` is unconfirmed; nothing changed.
- "roam", "wander", "to roam", "to wander": rorama (live-verified).
- "follow", "to follow", "accompany", "to accompany": Re·rika (live-verified). Verb paradigm for Re·rika not generated.
- "whose", "someone's", "mouse": Sani, Saniba, Mangchut (whose and mouse live-verified; someone's resolves via exact row, not re-run after the walk work).
- mang classifier (NV-217): expected `achak mangsa`, `achak manggni`, `na·tok manggittam`, `Achak mangritchasa`, `mangchi·sa`, `mangKolgrik`. Engine token removed by A (B please review the edit and `garo_classifier.js` comments at ~line 160 which still describe the old dot:true state). Live-verified: one dog, two dogs, three fish, i have three fish, eleven cats, twenty fish, one hundred dogs; king unchanged (`ki·tap king·sa`).
  NOT verified: rule-conformance baseline (`npm run check:rules`; js-yaml missing in A's clone), RULE-G-classifier.yaml was edited for one mang example only; 16 legacy no-dot superseded mang rows with wrong English and "one fishs" glosses untouched.
- OCR batch rows (NV-218): unverified; pos stored as "n. & adv." strings for B's SOV mapping; verbs have bare glosses (Owner rule 2026-09-21).

## Rework-prevention checklist (Governance §12)
- Already resolved before? sani/saniba was an open item in WORKSTATE (closed now); mang dot reversed a fifth time (Owner directive, documented).
- Other representation with old value? mang: master 112 rows fixed; garo_dictionary/final_entries held none; corrections/phrase_maps held none; tests re-expected. walk: phrase_maps + compiled mismatch documented above.
- Runtime vs linguistic? Both flagged in the handoff.
- Generalizes? mang no-dot is a productive classifier rule (engine), not per-row.
- Asked native to confirm something already established? No. Over-derived? No; Re·mama paradigm not invented.

## Open items
`Re.rama` vs `Re·mama` spelling; Re·mama paradigm forms; whether `Re·a` should ever lead; `Shall I sit?`; per-class raka confirmations; unverified base verbs (die, hit, break, make); Thangseng negative-ability questions; D's 8 held OCR rows (page images); OCR page numbers for manifest.json; `Matri`/`Matkalsi`/`Me·mana·song` review flags; whether to retire the superseded `me·se`.

## Standing rules (unchanged; do not re-litigate)
Anga always; apostrophes/periods in Garo words are raka typos; provenance labels (Thangseng quote vs Owner directive vs Owner-delegated logic); apply only what is ruled; never store a PAT (one-shot header; rotate; clones created with a PAT in the URL must have it scrubbed from .git/config); fetch + compare before push; do not delete the clone until local == origin/main; `.ai/CLAUDE_D_HANDOUT.md` is the only channel to Claude D; A does not touch engine code (NV-217 token edit was an explicit Owner-directed exception, B to review).

## Repository status at close (verified against the repo)
Verified after the final push; see the closing message for the exact hashes. Checklist: HEAD == origin/main; `git status` clean; WORKSTATE.yaml updated (head 7448d66, pointer next_action_claude_a_20261026B); SESSION_BOOTSTRAP.md (.ai/) unchanged this commit except none required; migration doc complete; no local-only commits; no uncommitted changes; native-validation/blocker status: no Thangseng relay pending from this session (all rulings this session were Owner directives).

## Exact next step
New conversation: paste this file, clone with a fresh PAT (scrub it from .git/config), `git fetch`, verify HEAD, read `.ai/WORKSTATE.yaml` and `.ai/SESSION_BOOTSTRAP.md`, run the gate, then take Owner decisions on the open items (first: `Re.rama` vs `Re·mama`).
