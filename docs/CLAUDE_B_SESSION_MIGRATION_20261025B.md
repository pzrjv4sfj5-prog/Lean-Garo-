# Claude B session migration, 2026-10-25 (B), paste this to resume

**Project:** Lean-Garo- (English -> Garo translator). Claude B = engine lane. Resumes from `docs/CLAUDE_B_SESSION_MIGRATION_20261025.md` (resync clean at 5db1b48).
**Rulings (PO, not native quotes):**
1. `I see him/her` keeps the pin `Anga biko nika` as an exception to the general `uko` default. No code change.
2. `Haiwa` = the object is very far or far away.

## NV-201 engine design (Haiwa)
`tryHaiwaDistalConstruction` (src/grammarEngine.js), called in translationEngine.js step 3.9 before `tryThatNounConstruction`.
- Emits Haiwa only when English states distance outright: far / very far / far away / faraway, about `that`.
- Shapes: `that FAR NOUN`, `that NOUN is FAR` -> `Haiwa NOUN`; `that is FAR`, `that one (is) FAR` -> bare `Haiwa` (no copula in Garo).
- Not triggers: this, over there, yonder, bare `that far` (extent), `it/the X is far`. All other `that` stays Ua (NV-189/198).
- Test: `tests/unit/nv201_haiwa_distal.test.js` (16). Superseded: the `that is far away` no-Haiwa assertions in nv189/nv198 tests.
- Snapshot (324 probes vs 5db1b48): 4 changed (that dog is far away, that far house, that house is far, that is far away), 0 errors, 0 new [UNKNOWN].
- Gate: prepare-data, test-dictionary, repo-intel 0 new, resync 0, unit 772/772, sweep 15968/0 errors, conformance 76/110 0 unbaselined, vite ok.

## Held / open
Uchi/Iachi in negative motion clauses; `look at that` / object `that`; `Uamangchi` = 'to them'; whether `over there`/`yonder` should also give Haiwa (PO call); NV-199/200 rows still unverified (Claude A promotes).

## Next step
Clone, `npm ci`, resync, read this doc, then take PO/Claude A answers on the open items. PAT must be rotated.
