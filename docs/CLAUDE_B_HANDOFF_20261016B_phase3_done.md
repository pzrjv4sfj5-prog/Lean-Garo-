# Claude B -> Claude A: Phase 3 (R1-R8) done, 2026-10-16

Gate (A's order): prepare-data, test-dictionary 9/9, repository-intelligence 0 new violations,
resync-stale-overrides, unit 494/494, runtime-error-sweep 15838 calls 0 errors,
audit-rule-conformance (report-only, 53/97, 0 mismatches not in baseline), vite build; dist restored.
No dictionary rows, rules or examples edited. New tests: tests/unit/handoff_20261016_runtime_bugs.test.js.

| Item | Result |
|---|---|
| R1 | Teens fused to a classifier are lowercase: `achak mang·chi·sa`. Bare `Chi·sa` unchanged. |
| R2 | `N persons` is routed as `N people`: `mande saksa / sakgni / sakgittam`. The `N persons` rows in garo_dictionary.json are legacy junk (e.g. 'three persons' = 'mande·gni'); left in place, bypassed in engine. |
| R3 | Capitalised non-initial unresolved token is left as written: `Angni bimung daka Tridip`. |
| R4 | Bare passthrough returns input, confidence 0, `unresolved: true`, no `[UNKNOWN]`. Garo for "not" still needs Claude A. |
| R5 | Stripped copula/demonstrative: confidence capped 0.5, `droppedWords` reported. Not restored (no evidence for the Garo). |
| R6/R7 | sov-assembly: only the first word capitalised. |
| R8 | he/she -> Ua in all constructed output; confirmed whole-sentence rows ship verbatim. See docs/PRONOUN_HE_SHE_POLICY_20261016.md. |
| Item 8 | RULE-052 licenses only the bare adverb before the verb (`Ka'sine cha'bo`). The `-ko` on `ka·sine` was NOT licensed, and `I eat rice slowly` silently dropped `rice`. Fixed, scoped to `slowly`: `Anga mi·ko Ka·sine Cha·a`. |
| Item 7 | Not touched this session (Project Owner says closed). Please confirm whether general `-rang` generation is in fact done. |

## Decisions for Claude A
1. R7 also lists grammar-assembly outputs (`Anga Re·anggen`, `Ua Ka·onanga`). Lowercasing those broke 37 existing tests, so I kept the change to sov-assembly, as the ask named. Say if you want grammar-assembly done too.
2. `[UNKNOWN]` still appears for non-name gaps (e.g. `0 dogs`); tests require a visible gap marker there.
3. 23 orphan rule examples: extractor fix awaiting Project Owner approval (your triage doc).

## Addendum: roadmap Phase 3 remainder (R-a..R-i), 2026-10-16
Done (engine only):
- **R-d:** "I am not going to the market" dropped its verb. Cause: the multi-word verb-lemma set (my AI-003 fix) held determiner-led keys ('the market', 'the river', 'the forest'), so 'going' read as an auxiliary. Determiner-led lemmas are now excluded. Output `Anga bajalchi Re·angjawa`.
- **R-b (RULE-029, verified high, four verb roots):** bare single-verb `X!` falling through to sov-assembly takes -bo for the final -a: `cook!` -> `Song·bo`, `sleep!` -> `Tusibo`. Exact rows (`Cha·bo!`) and adjectives untouched.
- mit·am = fat per Project Owner (rows/phrase-map changed, see commit 955da3b).

Not done, needs Claude A (data or linguistic fact, not engine):
- **R-i / RULE-036:** cited `Da·mo, anga mi cha·kuna` = "Wait, let me eat" is an orphan example (no data row). Promote it to corrections.json or mark illustrative; engine output `Damo [UNKNOWN] Angko Cha·a` stays wrong until then.
- **R-b lexical:** `stop!` should be `Sengbo` (engine gives `dontonga`); `search for him!` should be `Biko sandibo` (engine `Sandia bichi`: him -> Biko).
- **R-a:** `has eaten` / `has stopped eating` -> -jaha/-manaha, and `does not`: needs the rules' exact scope before building.
- **R-c:** `if eat` (-ode), duplicated subject in "if you eat, you will be strong", `will be strong` (-gen), aspect for `used to work`: rule scope needed.
- **R-f:** `two chicken` (ge vs mang), `ten birds` (do·a vs do·o), `four fruits` (mewa vs bite), `one alcohol` spacing, bamboo raka: each is a data or variant call.
- **R-g:** question forms (RULE-046/048): correction rows currently win; needs your call on rule vs row.
- **R-e / R-h:** Project Owner variant calls, deferred.
