# Handoff A -> B, 2026-10-22 (NV-187)
1. Accept dropped-pronoun request inputs; generate the dropped form as primary for common requests (RULE-004 note, 2026-10-22). Explicit pronoun = variant.
2. Map `May I` / `Can I` + verb to `<verb>na man·gengma?` (only form; `asongboma` dropped by PO directive, NV-188). Today `Can I sit?` = `Anga asonga` (sov-assembly), wrong.
3. `sit` and `sit down` -> stem `asong`; do not parse `down` here.
4. Data-only pins are in master + `phrase_maps.js`; test neighbours before and after (pin leakage rule). Do not regress NV-185 `can you help me` / `can you write the exam`.
5. (2026-10-23, NV-189) Demonstratives: default `that` -> `Ua`; use `Haiwa` when physical distance is emphasised. Data rows exist; selection logic is yours. No verified trigger list yet.
6. (2026-10-23) `man·gengba` = "of course" (pin `Oe, man·gengba.`); no generalisation to other verbs yet.
