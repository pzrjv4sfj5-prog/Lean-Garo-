# Claude B — Handoff to Claude A: `donga`/`ong·a` Precedence Bug Resolvable From Existing Evidence (2026-09-27)

## Summary

The 26/36-entry `<pronoun> have/has X` precedence bug (flagged in
`docs/CLAUDE_B_SESSION_MIGRATION_20260927.md`'s Runtime Handoff) does
**not** need a new Thangseng relay question. The catalogue already
answers it with Verified/High-confidence evidence on both sides. This
is a dictionary cleanup, not an open linguistic question.

## The evidence

**`donga` = existential possession.** `docs/GRAMMAR_RULE_CATALOGUE.md`
RULE-G7: `Uo bi·sa sakgittam donga` = "she has three children,"
Verified, Confidence: High. Cross-confirmed by `VERB_INVENTORY.md`'s
`dong` entry across multiple unrelated sentences — not resting on one
example.

**`ong·a` = "to be" (copula), not possession.** RULE-005, 2026-07-18
update: asked directly (NV-017) why a predicate-nominal sentence used
`daka`, Thangseng answered *"daka is to do in terms of working. Ong'a
is to be. So it is ong'a."* — a direct native gloss of `ong·a` as the
general copula "to be," confirmed again via `Anga kusi ong·a`="I am
happy," `Nama ong·a`="it is good," `Angni pagipa skigipa ong·a`="my
father is a teacher." Every confirmed `ong·a` example is a predicate
adjective or predicate nominal — none is a possession sentence.

These aren't two competing answers to the same question; they're two
different verbs, both independently Verified/High, doing different
jobs.

## What's actually wrong

`master_dictionary.json` has 36 entries (not 26 — re-counted this
session) of the exact shape `<pronoun> ong·a <noun>`, e.g.:

```
"i have house"    -> "ang ong·a rang"
"they have house"  -> "bi ong·a rang"
"you have book"    -> "na· ong·a ki·tap"
"we have money"    -> "i ong·a pisa"
```

All 36 share one construction, one unverified/unconfirmed-confidence
tier, and zero individual native citations — this reads as one bulk
entry batch built on a mistaken assumption that `ong·a` means "have,"
not 36 independently-verified data points. Compare the actually
Verified `donga` form for the same content: `"they have a house"` →
`Uamango Nok donga` (per this session's own live tests), matching
RULE-G7's pattern exactly.

## Recommended disposition (Claude A's lane — not applied by me)

Supersede the 36 `ong·a` entries in favor of `donga`-existential
composition. No new native relay needed — this is applying evidence
already on record, not guessing. Once superseded, the
stopword-stripped short-circuit these entries currently win against
(`translationEngine.js`'s pre-grammar-assembly stage) stops matching
them, and grammar-assembly's already-correct `donga` pattern becomes
reachable for this whole sentence family — closing the Runtime Handoff
item without any engineering change on my side.

## Not touched this session

No `master_dictionary.json`/`corrections.json` edits made — content
disposition is Claude A's call per the existing role split. Flagging
with full evidence rather than acting unilaterally.
