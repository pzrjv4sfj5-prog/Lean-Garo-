# Claude B session migration, 2026-10-26, paste this to resume

**Project:** Lean-Garo- (English -> Garo translator). Claude B = engine lane. Resumes from `docs/CLAUDE_B_SESSION_MIGRATION_20261025B.md`. Last B code commit `1f2e11a` (NV-215); origin/main at write time = `c76e766` (Claude A NV-217). Read Claude A's `docs/CLAUDE_A_SESSION_MIGRATION_20261026.md` and `docs/HANDOFF_CLAUDE_B_20261026_walk_rere.md` too. **The PAT was pasted in chat; rotate it. It is deliberately NOT recorded here.**
Mandatory reading each session: `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` (Rule 13), `.ai/PROJECT_OWNER_AUTHORITY.md`.

## Work shipped this session (all pushed; provenance: Thangseng = native relayed by the PO; PO = Project Owner direct; derived = my grammar logic, NOT a native quote)
| NV | Commit | What | Provenance |
|---|---|---|---|
| 202 | 7ea0ea3 | `that X over there / yonder` -> Haiwa | PO ruling |
| 204/205 | 373e6e9 | watch = Nia paradigm (Nienga, Nibo, Ninabe, Niaha, Nigen, Nijawa; inf nina); see/find = Nika (Nikbo, Niknabe, Nikaha, Nikgen, Nikjawa); `nisona` (wait/look with expectation) kept apart from nina; `VERB it!` / `do not VERB it` -> `Uko <cmd>` | Thangseng (paradigm); derived (object-it) |
| 206 | 9e6a38f | `I am watching TV.` = `Anga TV nienga` (TV unmarked, no -ko, watch only; film still takes -ko) | Thangseng |
| 207 | ce6ebb3 | generated verb paradigms: `scripts/generate-verb-paradigms.mjs` -> `src/data/verb_paradigms.json`, `docs/VERB_PARADIGMS.md`, `src/verbParadigm.js` (258 verbs x 9 forms; status native / pinned / engine / derived; 4 review, 59 manual) | derived except native rows |
| 207b | e58bbf5 | go = Re·a; **re·anga = went, derived from re·a (NOT a separate verb)**; native `re·ang-` stem forms (re·angenga, re·anggen, re·angja, re·angbo, re·angnabe, re·angna); re·jawa = will not go; re·angjawa = will not be going; re·naha = let's go. My earlier "go away" verb + 4 rows were wrong and removed | Thangseng (NV-100) |
| 207c | 646765c | `Re·ata` = cause to go / make someone go / spend time, money; spent/spending; purpose `re·atna` | Thangseng |
| -- | f378583 | `Re·mola` (v) = to go together added to paradigms (present native, rest derived) | Thangseng |
| -- | 9e0e6cc, 72717c6 | `come` paradigm (stem re·ba); `come!` = `Re·babo!`, `do not come` = `re·banabe` | Thangseng + PO answer |
| 209(B) | 279c5e8 | `iano` / `uano` bare (no -ko) for all verbs; `maio` (how, transport) vs `bano` (which); past-intent questions are present in form | Thangseng |
| 211/212(B) | a6c35e0, 79da1b8 | negative motion keeps `Uachi` / `Iachi` (negative suffix on the verb); **native spelling is `Uachi` (verified), engine had `Uchi`**; `look at that dog` = `Ua achakko nibo`; `look at that` = `Uko nibo` (PO confirmed) | Thangseng + PO |
| 214(B) | 8fc00d8 | strict `uamangna` = "for them", `uamangchi` = "to them"; routed by the English preposition; bare `them` = uamangko | PO relay "native-verified" |
| 215 | 1f2e11a | `that`/`this` + noun keeps `ua`/`ia` before the noun, -ko on the noun: `I see that dog` = `Anga ua achakko nika` | PO relay "native-verified" |

**Numbering collisions (do not trust a bare NV number across lanes):** NV-209, NV-211 and NV-214 are each used by BOTH Claude A and Claude B for different work (A: Re·mola / ties closure / walk vs roam; B: iano-maio / negative motion / uamangna-uamangchi). A's closure doc already notes B used 211/212. Always cite the lane suffix or the commit hash.

## Verification scope (Rule 7: what was and was NOT checked)
Gate at `c76e766` + my work: `npm run build` = prepare-data (9006 entries), test-dictionary 9006/9006, repository-intelligence 0 NEW violations, resync 0 candidates, unit **948/948**, rule conformance 78/112 match, 0 mismatches not in baseline (report-only), vite built; `runtime-error-sweep` **16028 translate() calls, 0 errors**.
Executed and inspected (actual outputs, not just the suite): every sentence quoted in this doc and in the per-NV docs `CLAUDE_B_NV205_WATCH_SEE_FIND_20261025.md`, `CLAUDE_B_NV209_...`, `CLAUDE_B_NV211_...`, `CLAUDE_B_NV214_...`, `CLAUDE_B_NV215_...`; each has an NV test file.
**Not checked:** the 324-probe snapshot was not re-run this session (so unintended changes outside the tests/sweep are not ruled out); no browser/UI check of `dist`; paradigm `derived` forms are rule output, NOT native-verified; plurals of demonstratives; `how did you come`/`how will you go`; `I like that house`; sentence-level causatives (`I make him go` still wrong).

## Runtime Handoff (Rule 6)
Compared against the linguistic source: go paradigm vs master_dictionary verified_high rows (matches); Uachi/Iachi vs verified `there/here (towards)` rows (engine changed to match); come/Re·babo vs verified rows (matches); uamang pair vs the PO relay only (no master row yet).
**For Claude A (data, not touched by me):**
1. master `to them | uamangna` (NV-200) is superseded -> `uamangchi`; `by them | uamangchi` (NV-199) now overlaps the strict "to them" meaning: ruling needed (engine still emits it). Compiled `to them` key diverges intentionally (baseline `corrections:to them`).
2. dictionary rows `to that place` / `there (direction)` = `Uchi` (unverified) vs verified `Uachi`; `uchipak` unchecked.
3. `watch`: annotate/retire candidates `ni·rik·a`, `go·ri`, `ni·chak·a`; raka check on `nia` (transcribed unmarked) vs `ni·a`. compiled `come!` = `Re·ba·bo!` (stray raka; baseline `corrections:come!`, `corrections:watch`).
4. NV-199/200 row promotions still yours. Engine/data tension from your NV-217 (`mang` takes no raka): re-check `An·ching`-style outputs and `Uamang` after your gate if any look off.
**For Claude B (next):** from A's handoff: (1) `prepare-data` pickPrimary still compiles `to walk` = `Re·a` though `Re·mama` is the only non-variant verified row (masked by the phrase_maps pin, allowlisted `phrase_maps:to walk`); (2) Re·mama's own paradigm forms are missing (needs Thangseng; do not invent; per NV-216 `re·a` forms are valid synonym forms); (3) routing Walk -> Re·mama, Roam/Wander -> rorama.

## Governance-model check (Rule 6a / Rule 13)
This session did not touch `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §4 rows AI-001..003. **It did add class risk:** NV-203/214 (uamang case), NV-215 (demonstrative) and NV-206 (TV) are post-translation output rewrites in `translationEngine.js`, i.e. the override-patch pattern Rule 13 §2 warns about. Logged as **AI-004** in §4 so the next session investigates the mechanism (move case/demonstrative placement into `assembleGrammar`) before adding a fourth rewrite. No existing row's status changed.

## Open (needs PO / Thangseng / Claude A)
- `Uamangchi` vs `by them`; `see` infinitive (`nina` vs `nikna`); `nikenga` unverified; `nia` spelling; derived forms of Re·mola / Re·ata / come / Re·mama; demonstrative plurals; causatives; `-ang-` is NOT established as a general continuity marker, do not generalize it.

## Next step
Clone with a fresh PAT, `npm ci`, `npm run check:resync`, read Rule 13 doc + this doc + A's handoffs, then take the Claude B items above (pickPrimary `to walk` first) and AI-004.
