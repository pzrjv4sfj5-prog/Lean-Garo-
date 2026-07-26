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

## Second item — `watch`/`see` cluster — full native data received (2026-07-26), NOT yet implemented

**Update, 2026-07-26:** direct Thangseng transcript received (via
Tridip, relayed by Project Owner), superseding the brief note this
section originally had. Full paradigm:

```
Watch = nia
Nienga = watching (continuous)
Nibo = watch (imperative)
Ninabe = don't watch (imperative)
Niaha = watched (past)
Nigen = will watch (future)
Nijawa = will not watch (negative)
```

For "see" — Thangseng flagged this as genuinely harder, not a simple
lookup:

> Because nia can also mean see. But there's another word — nika —
> that can also mean to see. But nika can also mean 'to find'... If I
> give the meaning of nika as 'to see', the system will later ask for
> clarification again when it finds that nika can also mean to find.

Final answer given, explicitly marked context-dependent:

```
Nika = to see, to find
Nikbo = find, see
Niknabe = don't find
Nikjawa = will not find, see
Nikgen = will find, see
Nikaha = found, saw
```

**Engineering due diligence done (2026-07-26, Claude B) — not a
linguistic call, just checking consistency:** every single confirmed
form above matches the engine's existing generic `applyTense` suffix
system exactly, verified directly (`nia`→`nigen`/`nibo`/`ninabe`/
`nijawa`/`niaha`/`nienga chim`, `nika`→ the same 5 forms) — zero
special-case exceptions needed, unlike the `go` (RULE-030) and `wait`
(RC-CANDIDATE-015) fixes, both of which needed a verb-specific
exception. This means implementation itself will be low-risk *once*
the headword questions below are settled — flagging as encouraging
signal, not asking for less scrutiny on the parts that do need it.

**What's still needed from you before I implement anything:**
1. **Raka placement** — `master_dictionary.json` currently has `ni·a`
   and `nik·a` (with raka marks) as existing `UNVERIFIED/HIGH`
   entries for `watch`, close to but not identical to the unmarked
   `nia`/`nika` in this transcript. Per this project's raka
   discipline, I'm not guessing whether the transcript just omitted
   marks casually or whether the confirmed spelling is genuinely
   unmarked.
2. **`watch` headword replacement** — 4 existing `master_dictionary.json`
   entries for `watch` (`go·ri`, `ni·a`, `ni·chak·a`, `ni·rik·a`, all
   `UNVERIFIED/HIGH`) need a decision on which (if any) get retired
   vs. annotated as rejected, same treatment as `gek·gek`/hot.
3. **`nika`'s dual sense** — whether `"see": "nika"` and `"find":
   "nika"` should simply coexist as two ordinary dictionary entries
   (engineering-trivial, both would resolve correctly independently)
   or whether the "depends on context" caveat implies something more
   — e.g. a disambiguation the engine can't currently make from a
   single word alone. Your call on whether that's a real modeling
   gap or a non-issue for this dictionary's purposes.

## Third item — corrections.json has 2 more, one of them structurally different

Continued the audit into `corrections.json` (the exact-match override
layer, checked before the dictionary): found 2 more entries with the
same shape.

- **`"younger sibling": "Jong / No"`** — same issue as the
  `master_dictionary.json` entry of the same key (both leak). Fixing
  `master_dictionary.json` alone won't be enough for this one — 
  `corrections.json` is checked first and would keep leaking
  regardless. Both need the same resolved value.
- **`"songna": "to plant / to erect"`** — different, and possibly
  worse: `songna` isn't English (it's what looks like a Garo verb),
  and `"to plant / to erect"` isn't Garo — the key/value direction is
  backwards from every other entry in the file, on top of having the
  same unresolved-placeholder shape. Live test: typing the Garo word
  `songna` into the English input returns `"to plant / to erect"`
  verbatim, which is nonsensical either as a translation or as a
  glossary note. This looks like a stray working note that got
  committed into the corrections layer by mistake rather than a
  translation entry — flagging rather than guessing at removal, since
  I can't rule out it was intentional shorthand for something. Your
  call whether to remove it, or split it into proper `"to plant"`/
  `"to erect"` entries if `songna` is confirmed to mean one of those.


## Suggested process

Same as `RC-CANDIDATE-015`: once you confirm a value (or already have
one on record), I'll wire it into `master_dictionary.json` and remove
the key from `src/data/known_placeholder_entries.json` in the same
commit, verified with the full stress-benchmark diff, same as every
other fix this session. Happy to take these in batches rather than
all 51 at once if that's easier to review.
