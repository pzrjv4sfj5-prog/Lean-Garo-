# Handoff to Claude B, 2026-10-20 (Claude A, NV-177)

Data and rules are updated; engine work is yours. All of this is Project Owner-provided unless marked native. See NV-177 in `docs/THANGSENG_NATIVE_VALIDATION.md` and RULE-006.

1. **Adjective position:** post-noun adjective = `-a` (`Menggo chona`, `Achak dal·a tusienga`); pre-noun adjective = `-gipa` (`Dal·gipa nok`), stacking directly (`Dal·gipa gitchak nok`). Generate whichever order the English implies; never put a bare `-a` adjective before the noun. Parse both.
2. **Object pronouns:** `biko` = him/her, humans only; `uko` = him/her/it. `I see him/her` should give `Anga biko nika` (variant `Anga uko nika`). Today's engine gives `Anga bichi·ko Nika` for him: fix outside the pinned master rows. Objects must not get `biko`.
3. **nika vs nia:** `nika` = see, with direct-object pronouns. `nia` = look (directional) and needs the `-chi` pronoun: `Anga bichiko nia`. Never `Anga bichiko nika`. Native 2026-05-10 lists `nia` as an alternate for `see`; keep parsing it as `see`, do not generate it for `see`.
4. **some/fat:** `some` = `mitam`; `fat` = `mitim`. `corrections.json` pork sentence now uses `mitim` (derived, unconfirmed by the PO). `phrase_maps.js` still has the 2026-10-16 comment saying mit·am = fat; update the comment if you touch the file.
5. **Little:** size = `chona`, never `on·tisa`; quantity = `on·tisa` / `bang·gija`.

**Known engine gap found while updating tests (not fixed):** sov-assembly still puts the bare `-a` adjective before the noun: `a big dog is eating rice` -> `dal·a achak mi cha·enga`, `a big cat is sleeping` -> `dal·a menggo tusienga`. Under RULE-006 the pre-noun form needs `-gipa` (`dal·gipa achak ...`) or the adjective goes after the noun (`achak dal·a ...`). Two unit tests that used `a big dog is sleeping` as a sov-assembly guard were repointed to unlisted sentences because that sentence is now an exact-phrase row.

## Addendum (NV-178, 2026-10-20)
- Adjective rule is now confirmed as absolute: never generate a bare `-a` adjective before the noun (`Dal·a achak` is wrong). The sov-assembly gap above is a real bug, not a PO preference.
- `how` = `maidake` (method); `maikai` = so that / in order that only. Check any engine path that uses `Maikai` for plain `how`.
- `phrase_maps.js` still has the English key `let us practice garo together` (gloss now known wrong; correct gloss `come on, practice speaking!`). Same Garo, so output is unchanged.

