# Handoff A -> B, 2026-10-22 (NV-187)
1. Accept dropped-pronoun request inputs; generate the dropped form as primary for common requests (RULE-004 note, 2026-10-22). Explicit pronoun = variant.
2. Map `May I` / `Can I` + verb to `<verb>na man·gengma?` (primary) or `<verb>boma?` (polite). Today `Can I sit?` = `Anga asonga` (sov-assembly), wrong.
3. `sit` and `sit down` -> stem `asong`; do not parse `down` here.
4. Data-only pins are in master + `phrase_maps.js`; test neighbours before and after (pin leakage rule). Do not regress NV-185 `can you help me` / `can you write the exam`.
