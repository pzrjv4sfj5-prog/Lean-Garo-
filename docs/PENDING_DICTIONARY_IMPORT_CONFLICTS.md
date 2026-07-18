# Pending Dictionary Import Conflicts
_Accumulates across imports. Entries here are NOT in master_dictionary.json. Claude A reviews, resolves, then this section is deleted by whoever implements the resolution._

## Batch 2026-07-18T06-56-04-120Z (source: `/home/claude/scratch/page18_flat.json`) — RESOLVED by Claude A, 2026-07-18

- **"to blossom" — "Bala" vs "Balgaoa".** Not a real conflict — both
  legitimate. `Bala` is a broadly polysemous general verb (bloom, blow,
  carry in the mouth, dress up to attract attention, spread an odour —
  "blossom" is one of many extended senses). `Balgaoa`'s senses are
  narrowly "to blossom, to flower, to bloom" — a dedicated flowering
  verb. Near-synonym pair, like English "bloom" vs. "flower" as verbs.
  **Disposition: import both as-is.**
- **"rest" — existing `neng·tak·a` vs. incoming `Bakki`.** Not a real
  conflict — English homonymy, not a word-choice disagreement.
  `neng·tak·a` = "to rest" (repose); `Bakki`'s "rest" sense is part of
  a remainder/balance/surplus/credit cluster — "the rest" as in "what's
  left over," unrelated to resting. **Disposition: import `Bakki` as
  well; both are correct for different senses.** Worth a future
  importer enhancement (not done here): sense-qualify ambiguous English
  glosses (e.g. `"rest (remainder)"`) so this class of false-positive
  conflict stops surfacing on every homonym.
- **"wind" — existing `Balwa`/`bal·wa`/`wen·a wen·wen·a` vs. incoming
  `Bal`.** Genuinely uncertain, held out. `Balwa` is already
  well-established and corroborated by three variant spellings across
  the existing dictionary. `Bal`'s senses are a disparate cluster
  (flower, wind, air, bundle, load, big basket) that reads more like a
  short root covering several derived/compound senses than a direct
  synonym for "wind" on its own. **Disposition: do NOT import `Bal` =
  "wind" — held pending native confirmation.** The rest of `Bal`'s
  senses (flower, bundle, load, big basket) are not in conflict and can
  import normally; only the "wind" mapping specifically is withheld.

_(The 2026-07-18T06-56-56 apply run re-flagged "to blossom" and "rest"
since the importer's conflict detection doesn't know about resolutions
in this doc — both were manually appended to master_dictionary.json
per the resolution above; no further action needed.)_
