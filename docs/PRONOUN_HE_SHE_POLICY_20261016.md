# he / she pronoun policy (R8, Claude B, 2026-10-16)

Ua and Bia are both native-confirmed (2026-08-09, 2026-09-19), so this is a consistency
rule, not a correctness fix. No dictionary rows changed.

- Constructed output (phrase-map, grammar-assembly, sov-assembly) always uses **Ua** for he and she.
- Native-confirmed whole-sentence rows in corrections.json ship verbatim with their cited form,
  e.g. `is he angry?` -> `Bia ka'o nangengama?`. They are not rewritten.
- The tie report entry saying `he` ships `Bia` is stale.
- Locked by tests/unit/handoff_20261016_runtime_bugs.test.js (R8).
