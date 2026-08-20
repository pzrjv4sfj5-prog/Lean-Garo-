# Claude B Session Migration — 2026-08-20c

## Repository state at close
- HEAD == origin/main (before this session's commit): `37f421b`
- Tree clean before and after every gate run
- 218/218 unit tests, 0 runtime errors (14,523-call sweep), 0 compiled-dict
  drift, 0 new resync candidates — all re-verified after the fixes below

## What happened this session
Project Owner supplied three native-speaker sentences directly in chat and
asked for a translate() spot-check + gap check:
- "I am going to school" = "Anga skulchi re.angenga"
- "I want to eat food" = "Anga cha.aniko cha·na ska"
- "Can eat / Need to eat / Want to eat" = "cha.na ama/man.a" / "cha.na nanga" / "cha.na ska"

Per the standing role-boundary rule (2026-08-14 incident, still in force):
linguistic content only enters the repo via Claude A's own commit, a
format-patch relay, or an Owner-supplied PAT push — never a chat message to
Claude B, regardless of source. So each item was checked against existing
repo data before doing anything:

1. **can eat / need to eat / want to eat** — all three already exist as
   VERIFIED/HIGH `master_dictionary.json` entries, byte-identical to what
   was supplied (`cha·na man·a`, `cha·na nanga`, `cha·na ska·`). Confirmed
   resolving correctly at runtime. No action needed — not new content.

2. **"I want to eat food" / cha·ani** — `cha·ani` does not exist anywhere in
   `master_dictionary.json`; current VERIFIED value for "food" is `al·a`.
   This IS new linguistic content and was NOT applied. Logged as a handoff
   item for Claude A below — needs the same channel as always (Claude A's
   own commit / relay / PAT), not applied by me.

3. **"I am going to school" / skulchi re·angenga** — turned out to be
   **already-VERIFIED data** (`skulchi`, RULE-044/NV-051, confirmed general
   movement-to locative), just not being *used* by the engine. This was a
   real, verifiable engineering bug, not new linguistic content, so I fixed
   it directly (see below).

## Engineering fix shipped this session
Root cause: in `grammarEngine.js`'s verb-search loop, "going"/"to" are both
in `AUXILIARY_SKIP` and get silently skipped — but nothing stopped the
*next* word (the destination noun, e.g. "school") from then being picked up
by `findVerbForm`'s generic `lookupGaro` fallback, which succeeds on **any**
dictionary word, not just verbs. So "school" was being mis-identified as
the main verb and future-suffixed directly onto the noun (`Skulgen`),
completely bypassing the already-VERIFIED `skulchi` + `re·angenga`
locative+verb pattern that the one existing "market" exact-phrase sentence
already used correctly.

Fixes (all in `src/grammarEngine.js` + `src/sentenceBuilder.js`, same
pattern-class as the existing RC-CANDIDATE-010 in/on/at guard):

1. **Verb-search guard**: a word immediately following bare "to" is now
   never treated as the candidate main verb (mirrors the existing in/on/at
   guard) — except "used to X" (`prevW === 'used'`), which genuinely does
   need the following word resolved as the verb (`chim` tense).
2. **Location composition now prefers the already-VERIFIED "to X" phrase
   entry** (`skulchi`, `bajalchi`, `nokchi`, `buringchi`, `chibimachi`) over
   composing bare-noun+`·chi` itself, which had been producing a mismatched,
   unconfirmed form (`bajal·chi` vs. the actual VERIFIED `bajalchi`). Tries
   both "to X" and "to the X" surface forms since the confirmed key set is
   inconsistent on including "the".
3. **Verb synthesis, narrowly scoped**: when "going to X" supplies the
   tense evidence, no other lexical verb was found, subject is first-person
   ("Anga"), and the destination resolved via the confirmed "to X" entry —
   verb is filled in as `re·angenga`, the exact (and only) form on record
   from the existing "I am going to the market." sentence. Deliberately
   **not** extended to other persons/tenses — no confirmed instance exists
   for those, so they're left alone rather than guessed at.
4. **Location-extraction punctuation bug** (pre-existing, exposed not
   introduced by fix #1): `locationWords` was pushing the raw token
   including trailing punctuation (`"school?"`), which failed every
   dictionary lookup. Previously masked because the mis-picked-verb bug
   (fix #1's target) always intercepted first. Now pushes the
   punctuation-stripped form.
5. Fixed a resulting double-suffix bug in `assembleGrammar` (`bajalchi·chi`)
   by guarding against re-appending `·chi` to an already-precomposed value.

Verified before/after: `I am going to {school, the market, the forest, the
river}` all now produce the correct `Anga <dest>chi re·angenga` pattern
(4/4 already-VERIFIED destinations); "he/she is going to school" (no
confirmed conjugation) correctly stays unfixed rather than guessed;
"I am going to college" (unconfirmed destination) correctly stays unfixed;
inverted questions and "used to eat" regressions caught by the full test
suite were fixed in the same pass. Full test suite run 3 times over the
course of this fix (initial regression catch, after each subsequent patch);
final run clean at 218/218.

## Standing blocker (unchanged)
Same as every session since 08-19b: still blocked on Claude A reading
`docs/CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md` (bear,
elephant/outside, 20 unproven-stale, 160 no-candidate items — 150 of which
have a drafted-not-sent Thangseng relay batch, still pending send+reply).

## New handoff item for Claude A
**"cha·ani" (food, alternate to al·a)** — Project Owner supplied "I want to
eat food" = "Anga cha·aniko cha·na ska" in chat this session. `cha·ani`
does not exist anywhere in the dictionary; current VERIFIED value is
`al·a`. Not applied — needs Claude A's own commit/relay/PAT per the
2026-08-14 role-boundary rule. Open question for Claude A to resolve:
is `cha·ani` a genuine alternate/register variant of `al·a`, a
correction, or a different word entirely (e.g. a nominalized "eating"
vs. "food" the item)?

## Process note (Project Owner raised this directly)
WORKSTATE.yaml and the migration-doc chain are growing large enough that the
Project Owner flagged it as "becoming big, need to find a way" this
session. Not resolved here (would be a process/tooling decision, not an
engineering fix within scope of this task) — flagging for whichever
Claude/Owner picks this up next: candidates worth considering are pruning
`next_action_prior_*`/`next_action_stale_*` entries past some age or count
threshold into an archive file, or truncating WORKSTATE.yaml's `head`
section changelog prose to just the last 2-3 entries with a pointer to full
git history for older ones.
