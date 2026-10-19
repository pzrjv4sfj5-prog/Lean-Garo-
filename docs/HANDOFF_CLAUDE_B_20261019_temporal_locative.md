# Handoff to Claude B: temporal nouns and locative -o (2026-10-19)

Rule: `docs/grammar_rules_structured/RULE-053.yaml`. Provenance: Project Owner addendum 2026-10-19 (pasted, no native attribution) plus native sentences NV-104 (`Bia bus o raba·a mijalo`) and NV-107 (`Mejao anga nang'chi re'angachim`). Data done by Claude A (NV-171): `yesterday` = `Mijal` (primary; `Mejal`/`me·ja·o` retagged variants), `phrase_maps` `yesterday` fixed. Gate green, unit 540/540.

## Engine work (your lane)
1. **Time words must not take the object marker.** Live: `I eat rice today` -> `Anga da.alo·ko Cha·a` (rice `mi` dropped); `I went to the market yesterday` -> `Anga bajalchi mejal·ko re·anga`. A time word in an event sentence takes the locative `-o` (`da·alo`, `mijalo`), never `-ko`.
2. **Isolated vs event split for `today`.** Per the rule, isolated `today` = `Da·al`, event sentences use `Da·alo`. Shipped isolated `today` is still `Da.alo`. A data-only pin of `Da·al` (corrections or phrase_maps) leaks into sentence composition, so I did not ship it. Same for `yesterday`: `Mijal` is the base; `mijalo` is the event form.
3. **Reconcile with the 2026-10-18 PO scenario 3** (`Da·al achak manggni mi·ko cha·a`, today two dogs eat rice): superseded for event sentences by this addendum (`Da·alo achak manggni mi·ko cha·a`). Existing tests expect `Da.alo achak mang·gni mi·ko Cha·a`.

## Not decided / not added
- The addendum's example `Mijalo anga bajal re·anga` conflicts with verified `Anga bajalchi re·angenga` and `Hai bajalchi re·na`; no row added. PO to say which is right.
- Other time words (`tomorrow` = `Knal`): no locative form stated, do not generate.
