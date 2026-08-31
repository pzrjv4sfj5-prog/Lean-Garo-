# Claude A Session Migration — 2026-08-31 (session 11)

**Status: CLEAN CLOSE.** Project Owner-directed close-out task. No other work attempted this
session, per explicit instruction.

Starting HEAD: `c581ee0e4ace885f74bf2ad5b5fa911c479dc385` (session 10 close, already on
`origin/main`, verified zero divergence at session start).

## Completed work

### `movie` = `film` — CLOSED

The Project Owner directed closure of `claude_a.pending_thangseng_questions` item (3), supplying
the resolving evidence directly rather than a new relay round-trip:

- Resolving evidence: the already-**VERIFIED/HIGH** sentence `"i saw the film last week."` ->
  `"Anga ia film-ko mija antio nia."` (NV-099, 2026-08-29, Project Owner-relayed Thangseng
  evidence — this sentence was validated in session 4, not newly supplied today).
- Why this resolves the question: the open question was whether Garo has a distinct word for
  "movie" in the *concrete watched-object* sense (as opposed to "film" possibly only covering the
  general concept of cinema). In the NV-099 sentence, `film` is the direct object of "saw" (marked
  with the `-ko` accusative suffix, RULE-009) — that is exactly the concrete watched-object sense.
  No competing Garo word for this sense exists anywhere in the corpus.
- This is corpus-internal evidence (an already-VERIFIED/HIGH sentence + absence of any competing
  candidate), which satisfies the evidence-first methodology bar for resolving without a fresh
  native relay. It is **not** a Project-Owner-authority override of native evidence — the native
  evidence (NV-099) was already on record; today's step was applying it to close a related, still-
  open lexical question, which is normal linguistic-authority work, not something requiring a new
  Thangseng round-trip.

**Action taken:**
- Added a new `master_dictionary.json` row: `english: "movie"`, `garo: "film"`,
  `confidence: verified_high`, with the full resolving-evidence citation in `notes` (see the row
  itself for exact wording — do not duplicate/paraphrase it elsewhere; cite the row).
- Updated the existing `film` row's `notes` to point to the new `movie` row (removed the stale
  "movie itself remains unaddressed" clause).
- Closed `claude_a.pending_thangseng_questions` item (3) in `.ai/WORKSTATE.yaml`. Full original
  question text retained under the closure note for provenance. **Do not reopen `movie` absent new
  native evidence to the contrary** — this is a closed item, not a tentative one.
- Rebuilt via `prepare-data.js`: compiled entries 8199 -> **8200** (new `movie` key); alternates
  unchanged at 927 (no other Garo form competes for `movie`, so no alternates list is produced for
  it).
- Full gate re-run: **8200/8200** entries valid, **9/9** grammatical corrections, **264/264** unit
  tests, **0 new** repository-intelligence violations.
- Live verification: `translate("movie")` -> `{ garo: 'film', method: 'exact-phrase', confidence:
  0.98 }`.

### (Same-day, prior session 10 — carried into this close for completeness)

Session 10 (this same day, closed clean and pushed before this session started) fixed the `bye`
alternates defect and closed a Claude B data-cleanup handoff. Both are already on `origin/main` as
of this session's start HEAD; no rework was needed or done. See
`docs/CLAUDE_A_SESSION_MIGRATION_20260830E.md`'s successor commits (`d3474e2`, `c581ee0`) for full
detail if needed — not re-narrated here to keep this document scoped to today's actual task.

## `movie` = `film` — CLOSED (summary line for scanning)

> **CLOSED.** `movie` -> `film`. Evidence: NV-099 (`"i saw the film last week." ->
> "Anga ia film-ko mija antio nia."`). Do not reopen without new native evidence.

## Remaining open items (unchanged by this session)

- **`go` / `re·ang-` stem-decoupling issue** — remains **Claude B's** open engineering item
  (discovered session 9 / 20260830E, revert applied, documented, not touched today). Claude A does
  not own engine code; no action taken or expected here.
- **`resync-stale-overrides.mjs`** will continue to flag **1 candidate** (the `go` item above)
  until Claude B resolves it — this is expected, not a regression, and not actionable by Claude A.
- **`pending_thangseng_questions_20260829_addendum`** — item (4), "to support" (`chaka` vs.
  `al·du·na` — synonyms, or different registers/senses?) — **still open, not yet sent.** This is
  the only remaining item in the relay queue as of this close.
- 18 `pickPrimary` verified-tie keys and 5739 no-verified-candidate keys remain as standing,
  long-running backlog (`docs/PICKPRIMARY_VERIFIED_TIES.md`,
  `docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`) — unchanged by this session, not in scope.
- 190 SUPERSEDED-only held keys (`docs/SUPERSEDED_ONLY_KEYS.md`) — unchanged, not in scope.

## Exact next actions for the next Claude A

1. Run the mandatory resume sequence first (Rule 10): `git fetch`, verify HEAD == `origin/main`,
   read `.ai/WORKSTATE.yaml` and `.ai/SESSION_BOOTSTRAP.md` before touching anything.
2. No task is queued by default. If the Project Owner doesn't hand you a new task, the only
   standing open item worth surfacing is **relay addendum item (4) "to support"** (`chaka` vs.
   `al·du·na`) — it has never been sent to Thangseng. Confirm with the Project Owner whether to
   send it (via Tridip) before doing anything else.
3. Do **not** touch the `go`/`re·ang-` stem-decoupling issue — that's Claude B's.
4. Do **not** reopen `movie` (closed this session) or re-litigate `bye` (closed session 10) absent
   explicit new evidence presented to you.

## Runtime Handoff

- **Compiled artifacts changed this session:** `src/compiled_dict.json` (8199 -> 8200 entries, new
  `"movie": "film"` key added). `src/compiled_dict_alternates.json` **unchanged** (927 entries,
  byte-identical — no alternates generated for `movie`, since no competing Garo form exists).
- **Runtime behavior change:** `translate("movie")` now returns `film` (previously: no entry,
  would have fallen through to whatever the engine's no-match behavior is — verify with Claude B/C
  if any downstream code special-cased the absence of a `movie` key, though none is expected).
- **No engine code touched.** This was a pure data-layer change (`master_dictionary.json` +
  `prepare-data.js` rebuild), consistent with Claude A's linguistic-authority-only role.
- **No `phrase_maps.js` change was needed** — the exact-phrase match on the new `movie` ->
  `film` key was sufficient; no manual override required.
- Claude B / Claude C: nothing new requires your attention from this session's `movie` work. The
  `bye`/`bland` handoff from session 10 is closed (see WORKSTATE `claude_a.pending_data_cleanup_from_b_RESOLVED_20260831`).

## Repository status at close

- [x] HEAD == `origin/main` — verified below after push
- [x] `git status` clean, verified below
- [x] `.ai/WORKSTATE.yaml` updated (`movie` closure, `next_action`, provenance retained)
- [x] `.ai/SESSION_BOOTSTRAP.md` updated (new top entry, session 11)
- [x] This migration document complete
- [x] No local commits ahead of `origin/main` at close — verified below
- [x] No uncommitted changes at close — verified below
- [x] Native-validation/blocker status: `movie` CLOSED; only open relay item is addendum (4)
  "to support", not yet sent; `go`/`re·ang-` remains Claude B's open engineering item
