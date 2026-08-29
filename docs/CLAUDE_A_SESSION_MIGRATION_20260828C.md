# Claude A Session Migration — 2026-08-28 (Session 3, Claude C Audit Response)

**Status: CLEAN CLOSE.** All work committed, pushed, gate-verified. No mid-task
state.

## Completed work

### 1. `movie` — left unresolved, as instructed

No garo entry exists for `movie`. Did **not** assume `film`=`movie`. Queued a
relay question stating the intended meaning, POS, and context explicitly
(per the audit's own instruction): "movie" as a noun meaning a motion
picture you watch ("let's watch a movie"), distinct from the general concept
of cinema, and not assumed to reuse the already-confirmed `film` loanword.
See "Unresolved questions" below.

### 2. RULE-046 space-before-`ma` — repo-wide sweep, CLOSED

Went beyond the 7-item counterexamples list already flagged in RULE-046.yaml.
Full sweep of `master_dictionary.json` (all non-superseded rows) and
`src/data/corrections.json` (all string values) for the pattern `<space>ma?`
at end of value:

- **13 fixes in `master_dictionary.json`**: `only`/`is there rice`/`have you
  eaten breakfast`/`have you eaten rice`/`do you love me` (both `?`- and
  bare-key variants), `how was the journey yesterday`, `are you having fun`
  (both variants), `do you have a boyfriend` (both variants), `have you
  eaten`. Two of these (`have you eaten breakfast`, both variants) also had
  a garbled-import raka defect (`Naa`→`Na·a`, `chaa ha`→`cha·aha`) fixed
  alongside, using a correctly-normalized SUPERSEDED sibling row as
  reference — same underlying legacy-import defect, not new native evidence.
- **82 fixes in `src/data/corrections.json`**: a large verb-conjugation
  template family (`did you go` / `have you eaten` / `are you drinking` /
  etc. — every did-you/have-you/are-you pattern across ~30 verbs) all shared
  the identical space-before-`ma` defect. Mechanically fixed in one pass.
- All fixes are **DERIVED/mechanical** — applying RULE-046, an
  already-VERIFIED grammar rule from 2026-08-21, not new native evidence.
- RULE-046.yaml's `counterexamples`/`launch_priority` P1 backlog item marked
  CLOSED, with the fix method and scope documented in the rule file itself.
- **Verified zero remaining** `<space>ma?` matches in `src/compiled_dict.json`
  after rebuild (checked programmatically, not spot-checked).
- Live-verified a representative sample via `translate()` post-build (see
  Runtime Handoff).

### 3. WORKSTATE.yaml `next_action` — corrected, and a real bug fixed

Updated `claude_a.next_action` to reflect this session's actual state.
While doing this, discovered `claude_a.next_action` was a **duplicate YAML
mapping key** — a bare `next_action:` entry from the 2026-08-27 session
(content about resuming a 149-item relay batch) had been left un-renamed,
violating this file's own `next_action_prior_X` naming convention. Duplicate
mapping keys are undefined behavior in YAML; in practice this meant
whichever bare `next_action:` appeared textually **last** in the file
silently won on parse — not necessarily the value any session intended to
be read. Renamed the stray key to
`next_action_prior_20260827_stray_duplicate`, preserving its content
verbatim, and confirmed via `yaml.safe_load` that `claude_a.next_action`
now resolves to this session's intended text.

**Found, not fixed:** the same duplicate-key pattern exists in Claude B's
section (`claude_b.next_action_prior_20260827`, two occurrences) — outside
Claude A's role boundary, flagged for Claude B rather than touched.

### 4. `go` / tang-dong / knowledge — reconciled only where evidence supports

No new native evidence arrived this session for `go` or `will not go` — both
remain exactly as session 2 left them (VERIFIED/HIGH citations added,
flagged as unresolved tensions, **not** used to override RULE-030 or shipped
runtime values). tang-/dong- was already fully closed in session 2. The
`knowledge` (alt, fuller compound) item remains untouched — no evidence,
no action taken, not guessed at.

### 5. Dictionary cleanup — 1 genuine duplicate removed, full backlog scoped honestly

Checked for exact-duplicate rows (identical english + garo + confidence —
zero information difference). Found exactly one: `english="Pen"` vs.
`english="pen"`, capitalization-only difference, identical garo (`kolom`),
confidence (`verified_high`), classifier, and category. Removed the
duplicate, kept the lowercase canonical row, added a citation note.

**Did not attempt** the full duplicate-key backlog identified by the
2026-06-20 audit (`docs/DUPLICATE_AND_RAKA_AUDIT_SUMMARY.md`, ~1,000+
duplicate-key groups). That audit's own conclusion was that most such groups
represent legitimate POS/sense/register variants requiring individual
native-informed review, not a mechanical sweep — attempting it in this
session's remaining budget would mean guessing at scale, which this
project's evidence-first methodology forbids. Flagged as ongoing backlog,
not silently skipped.

## Native evidence

None received this session. All 5 audit items were either (a) mechanical
rule-application requiring no new evidence (RULE-046 sweep, exact-duplicate
removal), (b) correctly left open pending future relay (movie, go, will not
go, knowledge), or (c) tooling/process fixes (WORKSTATE key correction).

## Unresolved questions (queued for Thangseng, not yet sent)

Logged in `.ai/WORKSTATE.yaml` `claude_a.pending_thangseng_questions`,
carried forward from session 2 plus one new item:

1. **"go"** — Thangseng gave "go = re'a" (session 2), but RULE-030 has an
   established example "Re·anga = go", and the engine uses Re·anga/re·ang-
   as the root for every conjugated form. Are re'a and re'anga two
   different things (short/bare vs. fuller form), or the same word said two
   ways? When would a speaker use one over the other?
2. **"will not go"** — Thangseng gave "will not go = re'angjawa" (session
   2), but an earlier session recorded "re·jawa" (without "ang") for the
   same meaning with no destination mentioned. Same word, or a
   destination-present/absent or formality distinction?
3. **"movie"** *(new this session)* — meaning: a motion picture / film you
   watch (noun), as in "let's watch a movie" or "I like this movie" — NOT
   the general concept of cinema. Is there a distinct Garo word for this
   sense, or does the already-confirmed "film" loanword cover both senses?
   Explicitly not assumed either way.

## Do NOT repeat

- Do not assume `movie` = `film`. No evidence either way currently exists.
- Do not re-run the RULE-046 space-before-`ma` sweep as if it were still
  open — it's closed; the 82 `corrections.json` template entries and 13
  `master_dictionary.json` rows are fixed and verified zero-remaining in
  `compiled_dict.json`.
- Do not re-introduce a bare `next_action:` key under `claude_a` in
  `.ai/WORKSTATE.yaml` — always use a distinctly-named
  `next_action_prior_X` key when demoting old content, per this file's
  established (and now-enforced) convention. Same applies to any other
  frequently-repeated key (`current_task`, `migration_doc`, etc.) — check
  for accidental duplicates with a quick per-section awk/grep scan before
  trusting `yaml.safe_load` output at face value on this file specifically,
  since it's large and hand-edited across many sessions.
- Do not attempt the full ~1,000-group duplicate-key dictionary backlog in
  one pass — it needs dedicated session(s) with per-group native review,
  not a mechanical sweep. Only exact, zero-information duplicates (identical
  english+garo+confidence+classifier+category) are safe to remove without
  native evidence.
- Do not touch Claude B's section of WORKSTATE.yaml to fix its own
  duplicate-key issue (`claude_b.next_action_prior_20260827`, appears
  twice) — flagged for Claude B, not Claude A's role boundary.

## Runtime Handoff

Representative live-verification via `translate()` post-rebuild (full list
of 82+13 fixes not individually re-verified line-by-line; verified
programmatically via a zero-remaining-matches scan of `compiled_dict.json`,
plus this spot-check):

```
have you eaten        -> Na·a cha·ahama?        (was: ...cha·aha ma?)
did you go             -> Na·a Re·angama?        (was: ...Re·anga ma?)
are you okay           -> Na·a amma?             (was: ...am ma?)
won't you come         -> Na·a re·bajawama?      (was: ...re·bajawa ma?)
did you see him        -> Na·a uko Nikahama?     (was: ...Nikaha ma?)
are you drinking       -> Na·a Ringengama?       (was: ...Ringenga ma?)
have you eaten food    -> Na·a Mi Cha·jokma?     (was: ...Cha·jok ma?)
are you eating?        -> Na·a Cha·engama?       (was: ...Cha·enga ma?)
is there rice?         -> Mi dongama?            (was: ...donga ma?)
have you eaten breakfast? -> Na·a nastha cha·ahama?  (was garbled + spaced)
```

**Build/test gate**, verified after every commit this session:
`prepare-data.js` clean, `test-dictionary.js` 9947/9947... (see note below)
entries valid, 8/9 grammatical corrections (unrelated pre-existing baseline,
unchanged), `node --test tests/unit/*.test.js` 247/247,
`repository-intelligence.js` 0 new violations.

Note: `test-dictionary.js` reports **compiled** entry count (8189, unchanged
by this session's master-row-level edits/removal since pickPrimary already
collapses to one shipped form per key), not the master_dictionary.json raw
row count (9947, down from 9948 after the 1 duplicate removal).

## Cross-role notes

- A pre-existing duplicate-key defect in Claude B's WORKSTATE.yaml section
  was found and flagged (not fixed) — see "Do NOT repeat" above.
- Rebased onto Claude B's concurrent commit `6187453` ("engineering QA pass
  + resync no/quick fixes, wait investigated+reverted, check:resync gated,
  governance §6") before push — one real conflict in `.ai/WORKSTATE.yaml`
  (both sessions added a `repository.*` block same-turn), resolved by
  keeping Claude B's `last_updated_20260829` entry and updating
  `repository.head` to `6187453` per this file's own head-convention (must
  record the commit immediately prior). Claude B's commit also fixed the
  grammatical-corrections baseline from 8/9 to 9/9 — confirmed by full gate
  re-run post-rebase, no unit-test regressions (still 247/247). Notably,
  Claude B's own commit message independently flags that the "Claude C
  audit" referenced by both sessions has no corresponding doc anywhere in
  the repo — worth surfacing to the Project Owner, since this session's
  audit items were also relayed via chat, not a committed file.

## Exact next actions (priority order)

1. Send the 3 queued relay questions above to Thangseng (via Tridip or
   Project Owner). **Role: Owner/native.**
2. `knowledge (alt, fuller compound)` — still open, untouched across 3
   sessions now. Needs the same kind of explicit relay question as above.
   **Role: Owner/native.**
3. `only` citation-hygiene archaeology (2026-08-01 SUPERSEDED note miscites
   unverified variants as VERIFIED) — untouched since first flagged.
   **Role: Claude A, git archaeology.**
4. Flag Claude B's duplicate-key WORKSTATE.yaml issue for Claude B directly
   (`claude_b.next_action_prior_20260827` appears twice under the
   `claude_b:` section — same undefined-behavior YAML risk as the one fixed
   here for `claude_a`). **Role: Claude B, or Claude A next session if
   Claude B hasn't addressed it.**
5. Full duplicate-key dictionary backlog (~1,000+ groups,
   `docs/DUPLICATE_AND_RAKA_AUDIT_SUMMARY.md`) — needs a dedicated session
   or sequence of sessions with per-group native-informed review. Not a
   quick task; scope it properly before starting rather than attempting a
   partial sweep. **Role: Claude A + native relay, multi-session.**
6. Pre-existing deferred backlog, unchanged: pickPrimary verified-ties
   (`docs/PICKPRIMARY_VERIFIED_TIES.md`, Claude B territory — check fresh
   next session, may have shifted after Claude B's 2026-08-28 cutover).

## Resume protocol for the next Claude A session

In addition to the standing Rule 10 mandatory resume sequence (git fetch,
HEAD verification, read WORKSTATE.yaml and SESSION_BOOTSTRAP.md before any
work):

1. **Before trusting any single field read from `.ai/WORKSTATE.yaml`** (via
   `yaml.safe_load` or otherwise), run a quick duplicate-key scan on the
   section you're about to read from:
   ```
   awk '/^[a-zA-Z_]+:$/{sec=$0; delete seen}
        /^  [a-zA-Z0-9_]+:/{match($0,/^  [a-zA-Z0-9_]+:/); key=substr($0,RSTART,RLENGTH);
        if (key in seen) print NR": DUPLICATE "key" (section "sec") first at "seen[key]; seen[key]=NR}' \
     .ai/WORKSTATE.yaml
   ```
   This file is large and hand-edited across many sessions; a duplicate key
   silently shadows an earlier value under YAML's last-key-wins behavior,
   and this session found one that had gone unnoticed since 2026-08-27.
2. When demoting old content under a new key, always use a distinctly-named
   `<field>_prior_<date-or-context>` key — never leave a second bare
   `<field>:` in the same mapping.
3. Treat this migration document, not chat history, as ground truth on
   resume. This chat thread should be closed now per the project's
   thread-hygiene rule (`.ai/SESSION_BOOTSTRAP.md`) — every message in a
   long-running thread resends the full prior conversation as input
   tokens. Start a new conversation and paste this document in.

## Repository status at close

- HEAD after this session's final commit and `origin/main`: verified
  identical via `git fetch` + `git rev-parse` comparison immediately
  after push — both `cb56f6a`.
- Rebased onto Claude B's concurrent `6187453` before push (see Cross-role
  notes); `.ai/WORKSTATE.yaml` `repository.head` correctly updated to
  `6187453` per this file's own convention (records the commit immediately
  prior to the one updating this file).
- `git status`: clean before and after this migration commit, and after
  the rebase + push.
- `.ai/WORKSTATE.yaml`: updated this commit (`claude_a.next_action`,
  `claude_a.pending_thangseng_questions`, the stray-duplicate-key rename,
  `repository.head`) — merged cleanly alongside Claude B's own concurrent
  `repository.last_updated_20260829` addition.
- `.ai/SESSION_BOOTSTRAP.md`: updated this commit (top pointer).
- No local-only commits — pushed in the same step this doc was finalized.
- No uncommitted or untracked files at close.
- Full gate re-verified post-rebase (not just pre-rebase): 247/247 tests,
  9/9 grammatical corrections (Claude B's concurrent fix, carried through
  cleanly), 8189/8189 compiled entries, 0 new repository-intelligence
  violations, zero remaining RULE-046 space-before-`ma` matches confirmed
  again in `src/compiled_dict.json` after rebuild.
- Native-validation/blocker status: 0 new native evidence this session; 3
  relay questions queued (go, will not go, movie); 2 pre-existing untouched
  items (knowledge alt, only citation-hygiene archaeology); 1 cross-role
  item flagged for Claude B (WORKSTATE duplicate key). No mid-task state.
