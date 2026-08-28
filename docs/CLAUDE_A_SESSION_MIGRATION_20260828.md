# Claude A Session Migration — 2026-08-28

**Status: CLEAN CLOSE.** All work this session is committed, pushed, and
gate-verified. No open blockers left mid-task.

## What this session did

### 1. NV-097 — uploaded Thangseng PDF transcript batch (Rakka normalization applied)

Processed a Project-Owner-uploaded PDF transcript (raw apostrophe
morpheme-separator orthography) against the Rakka convention: apostrophe
(`'`/`’`) as morpheme separator → `·`; hyphen as English/Garo suffix
separator → `·`; hyphens inside genuine lexical/compound forms left
untouched. This resolved most of the `docs/CLAUDE_A_SESSION_MIGRATION_
20260826.md` §8 "LINGUISTICALLY OPEN" list.

**New VERIFIED/HIGH (closes migration-doc §8 items), stale unverified
rows superseded where directly contradicted:**
`don't eat`=`cha·nabe`, `don't go`=`re·angnabe`, `give me water`,
`go away`, `help me`, `how are you` (`Namengama?` primary / `Na·a mai
rokom?` rare-register variant), `how many`=`Badita`, `how much`=`Badita`
(native explicitly: no separate Garo words for "many"/"much"),
`how much is this`=`Iara badita?`, `hurry up`=`Ta·rakbo`.

**Reconfirmed, no value change:** `bring (imperative)`, `happy`,
`how (alt)`=`maidake` (bare re-mention of `maikai` in the same line NOT
treated as new promotion evidence — NV-046's distinction stands).

**New flagged variants, deliberately NOT reconciled against existing
primaries:** `dance (alt)`=`mesaa`, `eaten`=`cha·manaha`/`cha·manjok`,
`knowledge (alt, fuller compound)`=`u·i-ma·siani`, `live (alt)`=`tanga`,
`living`=`tangenggipa` — each logged with an explicit note explaining
why it wasn't merged with/promoted over the existing primary.

**Confirmed still genuinely open** (the PDF's own closing note names
both): `go`, `only`.

**Propagation-gap fixes** (corrections.json/phrase_maps.js synced to
match new citations, stale uncited values replaced): `hurry up`,
`how are you` (fixed a live RULE-046 violation — a stray space before
`ma?`), `how much is this`, `how many` (phrase_maps.js still shipped
the *unconfirmed* `Baitarong` candidate).

**Self-caught mistake, reverted before commit:** briefly added a
speculative master row for bare `hurry`=`Ta·rakbo`, extending the
`hurry up` evidence by analogy. Before finalizing, found bare `hurry`
already had a real, independent NV-089 citation (`Tarkbo!`) — the
speculative row would have created a false pickPrimary tie against
actual prior evidence. Reverted the row and the matching
`phrase_maps.js` edit; re-verified gate green. Lesson for future
sessions: don't extend new evidence to an adjacent bare-form key by
analogy without checking it doesn't already have its own citation.

### 2. NV-098 — reconciliation of NV-097's one flagged contradiction

NV-097 deliberately left `i don't know` open: two native-sourced
candidates (`Anga uija.`, long-established uia-root family; `Anga
ma·sija`, new from the PDF batch) looked contradictory, and were NOT
merged or guessed at.

Project Owner relayed Thangseng's direct answer this session: **"Those
two mean the same thing."** — confirmed synonyms, not competitors.
Applied: both rows promoted to `verified_high`; `Anga uija.` kept
primary (already shipping at runtime, cross-referenced throughout
project history), `Anga ma·sija` tagged `variant/VERIFIED/HIGH` so
`pickPrimary` still resolves the key without a new tie. Searched
`corrections.json`, `phrase_maps.js`, `garo_dictionary.json`,
`final_entries.json` for every other representation — all 9 existing
occurrences already agreed with the kept primary (cosmetic
period-only variation), nothing needed syncing.

This closes NV-097's only open item. **No Thangseng questions are
pending from this session's work.**

## Runtime Handoff

Every key touched this session (NV-097's ~20 + NV-098's 2) was
individually verified via live `translate()` calls, not
`compiled_dict.json` inspection alone:

```
don't eat          -> cha·nabe            (correction, 1.0)
don't go            -> re·angnabe          (correction, 1.0)
give me water       -> Angna chi on·bo     (phrase-map, 0.99)
go away             -> Re·angbo            (correction, 1.0)
help me             -> Angko dakchakbo     (phrase-map, 0.99)
how are you         -> Na·a namengama?     (correction, 1.0)
how many            -> Badita              (phrase-map, 0.99)
how much            -> Baita?              (phrase-map, 0.99 — spoken variant, expected)
how much is this    -> Iara badita?        (correction, 1.0)
hurry               -> Tarkbo!             (phrase-map, 0.99 — unchanged, own NV-089 citation)
hurry up            -> Ta·rakbo            (correction, 1.0)
i am eating         -> Anga cha·enga       (correction, 1.0)
i don't know        -> Anga uija           (phrase-map, 0.99 — unchanged, NV-098 confirms synonym)
i do not know       -> Anga uija           (correction, 1.0)
i do not understand -> Anga uija           (correction, 1.0)
bring               -> ra·ba·a             (correction, 1.0 — unaffected by variant row)
dance               -> Chroka              (correction, 1.0 — unaffected by variant row)
happy               -> kusi ong·a          (correction, 1.0)
how                 -> maidake             (correction, 1.0)
knowledge           -> U·iani ba ma·siani  (correction, 1.0 — unaffected by variant row)
live                -> donga               (correction, 1.0 — unaffected by variant row)
living              -> dongenga            (correction, 1.0 — unaffected by variant row)
```

**Build/test gate**, verified after every commit this session, not just
at the end: `test-dictionary.js` 8187/8187 entries valid, 8/9
grammatical corrections (pre-existing unrelated baseline, unchanged),
`node --test tests/unit/*.test.js` 247/247, `repository-intelligence.js`
0 new violations across Checks A–G (10 new Check-C self-consistency
conflicts and 1 new Check-F runtime-cascade mismatch were deliberately
introduced by this session's own new variant rows / the `how are
you` bare-vs-subject-included form — all 10+1 reviewed individually and
allowlisted in `src/data/known_dictionary_conflicts.json` /
`src/data/known_cross_source_conflicts.json` with citations, not blindly
suppressed). `npm run build`'s `vite build` step still fails in this
sandbox only because `node_modules/vite` isn't installed — pre-existing
environment gap, unrelated, not re-flagged as new.

## Do NOT repeat

- Do not re-investigate the NV-093 parenthetical-key pattern
  (`begin (infinitive)` etc.) — fully closed 2026-08-27, see
  `docs/CLAUDE_A_SESSION_MIGRATION_20260827.md`.
- Do not re-open `i don't know` — NV-098 closed it; `uija`/`ma·sija`
  are confirmed synonyms, not a contradiction. Don't re-flag it.
- Do not re-derive the LINGUISTICALLY OPEN count from the 2026-08-26
  batch from scratch — it's down to exactly `go` and `only` now (was
  ~14; NV-097 closed 10 of them, 4 were re-homed as flagged variants
  not counted in that list to begin with). If you need the full
  breakdown, read NV-097/NV-098 in `docs/THANGSENG_NATIVE_VALIDATION.md`
  first, don't re-classify the original 149-item batch again.
- Do not extend a newly-confirmed value to an adjacent bare/inflected
  key "by analogy" without first checking whether that key already has
  its own independent citation — see the `hurry` self-correction above.
- Do not touch the tang-/dong- root family (`live (alt)`, `living`) —
  genuinely flagged, unresolved, needs an explicit future relay
  question, not a guess.

## Exact next actions (priority order)

1. **`only`** — old SUPERSEDED note cites VERIFIED forms (`ak·sa`,
   `ma·mang`, `·pit·chi`, `·sa`) that are all currently tagged
   `unverified` in live data. Needs `git log`/`git show` archaeology on
   `master_dictionary.json` for this key (same shape as the NV-092
   stand-up/take-revenge finding, not yet traced to a specific commit).
   If evidence is found, apply it; if not, this is a genuinely open
   relay item. **Role: A first (archaeology), may resolve to
   Owner/native.**
2. **`go`** — zero VERIFIED candidate under any key variant checked
   across two full sessions now (2026-08-26, 2026-08-28). Not
   corpus-internally resolvable. **Role: Owner/native — needs an actual
   Thangseng relay question**, not further investigation.
3. **Tang-/dong- root family reconciliation** (`live (alt)`=`tanga` vs
   `donga`; `living`=`tangenggipa` vs `dongenga`) — flagged this
   session, not resolved. Needs an explicit relay question
   distinguishing register/sense, not a guess. **Role: Owner/native.**
4. **`knowledge (alt, fuller compound)`** — two structurally different
   native-confirmed compounds now on record (`U·iani ba ma·siani` vs
   `u·i-ma·siani`). Needs a relay question on whether these are free
   variants or carry a sense/register distinction. **Role:
   Owner/native.**
5. Pre-existing deferred backlog, unchanged, still open (see
   `docs/CLAUDE_A_SESSION_MIGRATION_20260826.md` §10 for full detail):
   pickPrimary verified-ties (Claude B territory, AI-001) and the
   repository-wide space-before-`ma` sweep (Claude B territory,
   Claude A input on sense defaults if asked). This session incidentally
   fixed **one instance** of the space-before-`ma` bug (`how are you`
   in corrections.json) as a byproduct of NV-097's duplicate-repr.
   check — the wider sweep is still untouched.

No other Thangseng questions are pending beyond items 1–4 above.

## Repository status at close

- HEAD after this session's commit: verify via `git rev-parse HEAD`
  (recorded in `.ai/WORKSTATE.yaml` `repository.head`).
- `origin/main` match: verified via `git fetch` + `git rev-parse
  origin/main` immediately before push.
- `git status`: clean immediately before and after this migration
  commit.
- `.ai/WORKSTATE.yaml`: updated this commit.
- No local-only commits — this migration commit is pushed in the same
  step it's created.
- No uncommitted or untracked files at close.
- Native-validation/blocker status: clean. No open contradiction, no
  mid-task state. Items 1–4 above are genuinely open (need
  archaeology or a future relay), not unfinished work from this
  session.
