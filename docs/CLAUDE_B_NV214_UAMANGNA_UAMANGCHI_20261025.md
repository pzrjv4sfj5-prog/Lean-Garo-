# NV-214: uamangna = "for them", uamangchi = "to them" (Claude B, 2026-10-25)
Native-verified PO relay. Supersedes the NV-203 single dative (`uamangna` for both to/for them) and the NV-200 row `to them = uamangna`.
- `for them` -> `uamangna` (benefactive). `to them` -> `uamangchi` (directional / recipient). Bare `them` stays `uamangko`.
- Routing: `translationEngine.js` swaps the case by the English preposition for any result that contains a uamang- form (sentence builders only see "them"); `to them` / `for them` rows added to corrections.json (baseline `corrections:to them`, intentional divergence from the compiled `to them = uamangna`).
- Examples: `I gave it to them` = Anga uamangchi on·aha; `give it to them` = Uamangchi on·a; `I speak to them` = Anga uamangchi agana; `I went to them` = Anga uamangchi re·anga; `I bought it for them` = Anga uamangna breaha; `this is for them` = Uamangna.
- Tests: `nv214_uamangna_uamangchi_split.test.js`; superseded assertions updated in nv200 and nv203 tests.

**For Claude A (master_dictionary rows, not touched by me):**
1. `to them | uamangna` (NV-200) is superseded: should be `uamangchi`.
2. `by them | uamangchi` (NV-199, print-dictionary) now overlaps the strict "to them" meaning of uamangchi. The engine still outputs it unchanged; needs a ruling whether "by them" keeps uamangchi.
3. The compiled `to them` key still says uamangna until the master row is corrected.
Open: `I made it for them` still gives `Anga [UNKNOWN]ko uamangna` (`made`/`it` unknown, unrelated to this split).
