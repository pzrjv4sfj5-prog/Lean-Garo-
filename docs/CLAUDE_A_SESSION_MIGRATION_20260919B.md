# Claude A Session Migration — 2026-09-19B

Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260919.md`.

## Resync at start
HEAD `a59e5d4` == origin/main, clean tree. No drift beyond that prior
doc's own commit and a Claude B doc-only follow-up
(`docs/CLAUDE_B_SESSION_MIGRATION_20260919B.md`, §8/§9 additions) —
no dictionary/engine/data files touched between the two, confirmed via
`git diff --stat 1c7504f a59e5d4b` (docs/WORKSTATE/BOOTSTRAP only).
Gate not re-run at resume for that reason (nothing changed that could
affect it); re-run fully below once this session's own edits landed.

## NV-158 — closes docs/THANGSENG_RELAY_QUESTION_20260916.md
Thangseng WhatsApp transcript relayed by Tridip.

**Part 1** (wh-question survey, verb held constant as "eat"): 6 new
VERIFIED/HIGH sentences (who/what/where/why/how/which-food ate),
compositional from already-VERIFIED roots except one new headword,
`cha·ani` ("food, the thing eaten" — nominalized eat-root). All 6 use
a bare `-a` verb ending, not `-aha` — directly contradicts the
existing NV-121 citation for the identical key "what did you eat?"
(`Na·a maiko cha·aha?`, with -aha). NOT force-resolved: both kept as
coexisting rows, tension stated in each row's notes, corroborating
(much more strongly, 6 items vs. 1) the NV-155 temporal-word-implies-
past observation already flagged as an unbuilt rule candidate.

**Part 2** ("who called?"): confirmed `-ata` fuses onto the verb, no
gap — matches existing VERIFIED `Sawa ka·ata?`/`Sawa okamata?`.
`na·ara` explicitly rejected as a substitute here. Settles the open
question: `na·ara`'s one other citation is a separate, unrelated
construction, not general.

**Unprompted counting fragment** (same transcript, not part of the
relay question): "100=ritcha, 101=ritchasa" + a worked example
("100 dogs"=`Achak mang·ritchasa`) + an unglossed "Ritchasa gni".
The worked example corroborates the already-VERIFIED "one
hundred"=`Ritchasa` (contradicting the transcript's own "101="
label) — added `Ritcha` (bare root) as a single unverified citation
only, NOT promoted; "Ritchasa gni" left uninterpreted, no gloss
given. Flagged for a follow-up relay question, not resolved.

**Runtime finding, Claude B territory, not fixed:** the new
`Achak mang·ritchasa` citation exposes that the classifier engine's
own "100 dogs" (digit form) composition — `achak mangritcha` — is
missing the `-sa` multiplier suffix and its raka dot that the native
form confirms should be there (matching the `mang·sa`=one pattern
used everywhere else in the counting system). Updated one stale unit
test (`tests/unit/bug4_hundred_thousand_word_parsing.test.js`) that
had asserted byte-for-byte parity between "100 dogs" and "one hundred
dogs" via the classifier engine — the new dictionary entry now
shadows that path via exact-phrase lookup for the word-form only;
genuine improvement, not a regression, per the same discipline used
for prior stale-test fixes this project.

## NV-159 — smell (verb/noun), volunteered directly, no relay question
smell (verb) = `Gingsika`, reconfirms the already-VERIFIED
`smell`->`Gingsika` (NV-080). smell (noun) = `Biba` and `Sengani`
(new, coexisting, neither preferred). Upgraded the pre-existing
untagged `odour`->`Biba` row to VERIFIED/HIGH, same evidence.

Resolves this session's earlier Task 2 finding (see
`docs/CLAUDE_A_SESSION_MIGRATION_20260919.md`) that
`corrections.json`'s `"smell": "biba"` override "looked
truncated/corrupted" — it isn't; `Biba` is the direct native-confirmed
noun. Left `corrections.json` unchanged (already correct). `skin`->
`bigi` (the sibling half of that same original flag) is still
untouched — no native evidence for it yet, stays open. `Sengani`
coincides in spelling with the already-unverified `wisdom`->
`Seng·ani` — flagged as a possible homonym, not merged, no evidence
either way.

Duplicate sweep done per explicit instruction ("no dups"): checked
every smell/odour-related master_dictionary.json row for exact
(english, garo) duplicates before adding anything — zero found.

## Gate status (final, this session)
8824/8824 dictionary entries, 9/9 grammatical corrections, 442/442
unit tests (was 441 at session start — +1 net from the stale test
split into two, no other test files touched), 0 new
repository-intelligence violations (all 8 checks), 0
resync-stale-overrides candidates. Live-verified every new/changed
key via `translate()`: who ate?/where/why/how/which-food-did-you-eat,
smell/smell (noun)/odour all resolve correctly; "100 dogs" digit-form
composition gap confirmed live and documented above, not fixed.

## Runtime Handoff to Claude B
"100 dogs" (and any other digit-form exact-hundred classifier
composition) is missing the `-sa` multiplier suffix + raka dot in
`buildLargeClassifierPhrase`'s n=100 output — now has a real native
citation (`Achak mang·ritchasa`) to fix against, where before this was
explicitly unconfirmed (see this session's updated
`tests/unit/bug4_hundred_thousand_word_parsing.test.js` header note).
Not touched — engine code, out of Claude A's lane.

## Still open, unchanged
- `corrections.json`'s `skin`->`bigi` (still unresolved, no native
  input yet).
- The NV-121 vs. NV-158 "what did you eat?" -aha/-a tension — not
  built into a grammar rule, now has 7 total data points favoring
  bare -a vs. 1 favoring -aha.
- The unglossed "Ritchasa gni" counting fragment — needs a direct
  follow-up question, not guessed at.
- Dedup-deviation flag, Thangseng relay (2026-09-16 doc, now
  answered/superseded by this session — see next), and the other
  carried-forward items from the prior migration doc's "Still open"
  section (44-key interrogative family, `derived` confidence tag,
  corrections.json's corrupted-looking `skin` override) — all
  unchanged except `smell`, resolved this session.

## Repository status at close
- HEAD: this doc's own commit will follow at session end
- origin/main match: verify after push
- `git status`: clean before this doc's own commit
- WORKSTATE.yaml: updated this session (see below)
- SESSION_BOOTSTRAP.md: updated this session (see below)
- Migration doc: this file
- No local commits outstanding, no uncommitted changes at push
- Native-validation/blocker status: none blocking; 2 new NV closures
  this session (158, 159); 2 items still open (skin corruption flag,
  unglossed counting fragment) — both explicitly flagged above, not
  guessed at
