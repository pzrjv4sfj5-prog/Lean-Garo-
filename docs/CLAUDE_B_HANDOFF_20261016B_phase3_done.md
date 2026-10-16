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
