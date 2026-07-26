# Pending Linguistic Proposal — Unresolved Placeholder Entries in master_dictionary.json

**From:** Claude B (consistency audit, 2026-07-25, per Project Owner directive)
**To:** Claude A
**Classification:** Linguistic (per-entry word choice) with an Engineering
component already fixed (see below).

## Background

`RC-CANDIDATE-015` (`wait`) turned out to be caused by a literal,
uncommitted placeholder string sitting in `master_dictionary.json` —
`"Damo / Sengbo"` — never a real value, just two candidate
translations joined with `" / "` that someone never finished
resolving. Auditing the whole dictionary for the same pattern found
**51 more entries** shaped identically.

## Evidence — engineering part (already fixed, no action needed)

A permanent detection check (`repository-intelligence.js` Check E) now
catches any *new* entry shaped like this at build time, so this class
of bug can't silently reappear. The current 51 are allowlisted in
`src/data/known_placeholder_entries.json` pending this proposal's
resolution — removing a key from that file only takes effect once the
corresponding `master_dictionary.json` entry has a single resolved
value, so there's no risk of the check going stale silently.

Direct testing shows **32 of the 51 are currently leaking the raw
placeholder text into live user-facing translations right now** — not
a latent risk, an active one:

```
father        -> "Pa / Apa"
mother        -> "Ma / Ama"
goodbye       -> "Re·ang·na / Nam·en·dongbo."
hello         -> "Salam / Namengama"
throw         -> "Gal·a / Goata"
uncle         -> "Mama / Pabok"
younger sibling -> "Jong / No"
zero / none   -> "Bangbang / Ong·ja"
wait a moment -> "Damo / Gisep sengbo"
you (object)  -> "Nang·na / Nang·ko"
our / ours    -> "Chingni / An·chingni"
walk (command) -> "Roranbo / Rebo"
spirit / soul -> "Janggi / Gisik"
roam / wander -> "Rorama / Roama"
nail (metal)  -> "Gajal / Gojal"
hospital      -> "Hospital / Sam·nok"
hey! (calling someone) -> "Ei! / O!"
how many / how much -> "Baitarong / Baita"
cool / awesome -> "Nito / Nita·gipa"
tense / form  -> "Suffix / Pattern"
friend        -> "Ripsak / Ripeng"
land left to become fallow -> "a'jri / a'jru"
to leach / to strain ash-water -> "Kalchi or Katchi sola"
(+ "the father"/"the mother"/"the uncle"/"the younger sibling"/
  "the zero / none"/"the hello / greetings"/"the throw" — duplicate
  rows of several entries above, same issue)
```

The remaining 19 (`bridge`, `bye`, `climb`, `doctor`, `early`, `for`,
`hindi`, `hoe`, `i don't have`, `if`, `knowledge`, `only`, `rich`,
`very`, `wet`, `what's the time`, `whatever / i don't care`, `which`)
are currently masked by an override elsewhere (`corrections.json` or
`data/phrase_maps.js`) and don't leak — but the underlying
`master_dictionary.json` row is still broken, and would leak
immediately if that override were ever removed or the word were
looked up through a different path (e.g. inside a longer sentence
instead of standalone). One near-miss already found: `"for"` →
`"Gimin /·na"` still has a bare, unspaced `/` slipping through even
with its override active.

## What's needed from you (per-entry, cannot be inferred from existing records)

For each of the 51, which of the two (or more) candidates is the
correct/primary Garo word — this is the part that's genuinely
linguistic, not something I can prove from what's already recorded.
For a few, there may be existing corroborating evidence elsewhere in
the repo (e.g. if one candidate already appears independently
confirmed in `THANGSENG_NATIVE_VALIDATION.md` for an unrelated
sentence) — worth checking before re-asking Thangseng from scratch,
same as how `senga`/`wait` and `RULE-030`'s "go" fix both had
existing evidence I could point to. I did not do that cross-check for
all 51 here — flagging the method, not the full analysis, since it
needs your judgment on which existing evidence actually transfers.

## Impact if left unresolved

Every one of the 32 leaking entries produces a translation containing
literal `/` or `or` text — not valid Garo output under any
interpretation, and immediately visible to anyone using the
translator for these very common, high-frequency words (family
terms, greetings, pronouns).

## Second item — `watch`/`see` cluster not yet reconciled with NV-011/012

Separate from the placeholder issue above: `master_dictionary.json`
still has 4 unreconciled entries for `watch` (`go·ri`, `ni·a`,
`ni·chak·a`, `ni·rik·a`, all tagged `UNVERIFIED/HIGH`) and one for
`see` (`nik·a`, also `UNVERIFIED/HIGH`) — none show any correction
annotation, unlike the `hot`/`jroa` entry from the same batch which
was properly annotated. Your own commit summary for the recent batch
states *"NV-011/012 (watch vs see) - genuinely different roots (Nia
vs Nika); nisona relates to waiting-with-expectation, not
substitutable for nina"* — but I can't tell from that summary alone
which of the 4 `watch` candidates maps to which confirmed sense, so
not touching these. Flagging so the same reconciliation that happened
for `hot` can happen here too, whenever convenient — not urgent,
these aren't confirmed to be leaking into live output the way the
placeholder entries above are.

## Suggested process

Same as `RC-CANDIDATE-015`: once you confirm a value (or already have
one on record), I'll wire it into `master_dictionary.json` and remove
the key from `src/data/known_placeholder_entries.json` in the same
commit, verified with the full stress-benchmark diff, same as every
other fix this session. Happy to take these in batches rather than
all 51 at once if that's easier to review.
