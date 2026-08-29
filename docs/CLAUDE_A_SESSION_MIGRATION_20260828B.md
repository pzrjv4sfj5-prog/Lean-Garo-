# Claude A Session Migration — 2026-08-28 (Session 2)

**Status: CLEAN CLOSE.** All work this session is committed, pushed, and
gate-verified. No open blockers left mid-task.

## What this session did

Project Owner relayed new Thangseng answers directly in chat (not via
uploaded transcript), targeting exactly the open items listed in
`docs/CLAUDE_A_SESSION_MIGRATION_20260828.md` ("Exact next actions"):

### 1. `only` = mangmang — CLOSED

New VERIFIED/HIGH master row. Also fixed a live bug found while syncing
runtime: `src/data/corrections.json` was shipping `only` -> `saksakosan`,
a value with **zero** master_dictionary.json backing (a pre-existing
orphan, not introduced this session). Corrected to `mangmang`, rebuilt,
live-verified.

Does not touch the separate citation-hygiene defect from the 2026-08-01
audit (a SUPERSEDED note miscites `ak·sa`/`·pit·chi`/`·sa`/`ma·mang` as
VERIFIED/HIGH when they're tagged unverified in live data) — that
archaeology remains open, unaddressed by this relay.

### 2. `go` family — PARTIALLY CLOSED

- **`going`** = re·angenga, **`will go`** = re·anggen: new VERIFIED/HIGH
  rows. Both match RULE-030's pre-existing confirmed examples exactly
  (`re·angenga=going`, `nokchi re·anggen="will go home now"`) —
  DERIVED-confirmed, no tension. Rebuilt, live-verified.
- **`go`** = re'a (Rakka-normalized re·a): new VERIFIED/HIGH row, but
  **genuinely open, not closed**. FLAGGED TENSION with RULE-030's own
  example `Re·anga=go` and with the engine's conjugation root.
  **Mistake made and corrected this session:** initially set
  `src/data/phrase_maps.js`'s `go` entry to `re·a` to match the new
  relay — this broke 4 live regression tests (`going`, `will go`, "he
  did not go", "i did not go") because `findVerbForm('go')` feeds stem
  derivation for every conjugated form via the existing re·ang- stem
  system. Reverted; engine root stays `Re·anga`. `re·a` now ships only
  as a standalone dictionary citation for the bare `go` lookup key, not
  wired into the engine. Documented in both the master row's notes and
  a new RULE-030.yaml `corrections` entry. **A relay question is
  queued** (see below) — not resolved by guessing.
- **`will not go`** = re'angjawa (re·angjawa): new VERIFIED/HIGH row,
  added but **not used to override** the already-shipping
  `corrections.json` value `re·jawa` (RULE-030's 2026-07-26 bare-stem
  derivation). Both forms are native-sourced; flagged as a tension in
  RULE-030.yaml, **relay question queued**, runtime left unchanged.

### 3. Tang-/dong- root family (live/living) — CLOSED

Project Owner's relay gave the exact sense distinction the prior
session's migration doc said was needed: `donga`/`dongenga` = locative/
existential ("living at a place"); `tanga`/`tangenggipa` = vital
("being alive"). The four VERIFIED/HIGH master rows already had these
exact garo values from earlier sessions (NV-093/095/097) — only the
sense-distinguishing citation was missing. Added a sense-confirmation
note to each of the four rows (`live`=donga, `live (alt)`=donga,
`live (alt)`=tanga, `living`=dongenga, `living`=tangenggipa — 5 rows
total, `donga` appears under two keys). No garo values changed, no
runtime change needed — this was a documentation/provenance close, not
a data fix.

### 4. `knowledge (alt, fuller compound)` — untouched, still open

Not addressed by this session's relay. See prior migration doc, item 4.

## Runtime Handoff

Every key touched this session verified via live `translate()` calls,
both immediately after the initial edits and again after the rebase
(Claude B's concurrent pickPrimary cutover landed mid-session):

```
only            -> mangmang        (correction, 1.0)
go              -> Re·anga         (phrase-map, 0.99 — unchanged, engine root)
going           -> re·angenga      (exact-phrase, 0.98)
will go         -> re·anggen       (exact-phrase, 0.98)
will not go     -> re·jawa         (correction, 1.0 — unchanged, flagged tension)
live            -> donga           (correction, 1.0 — unchanged, sense confirmed)
living          -> dongenga        (correction, 1.0 — unchanged, sense confirmed)
he did not go   -> Ua Re·angja     (grammar-assembly, 0.82 — regression-protected)
i did not go    -> Anga Re·angja   (grammar-assembly, 0.82 — regression-protected)
i will not go   -> Anga re·jawa    (correction, 1.0 — regression-protected)
```

**Build/test gate**, verified after every commit this session:
`prepare-data.js` clean (no new pickPrimary tie warnings for any
touched key), `test-dictionary.js` 8189/8189 entries valid, 8/9
grammatical corrections (pre-existing unrelated baseline, unchanged),
`node --test tests/unit/*.test.js` 247/247 (4 failures surfaced
mid-session by the phrase_maps.js mistake above, all fixed by the
revert, confirmed back to 247/247 before commit),
`repository-intelligence.js` 0 new violations (2 new Check-C/Check-F
items — `go` and `corrections:will not go` — individually reviewed and
cited in `known_dictionary_conflicts.json`/`known_cross_source_conflicts.json`,
not blindly suppressed).

## Cross-role updates (already merged)

Rebased cleanly onto Claude B's concurrent 2026-08-28 commit `8272495`
("complete pickPrimary cutover with read-only impact analysis") before
push. Only generated-artifact files conflicted
(`src/compiled_dict.json`, `src/compiled_dict_alternates.json`,
`docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`) — resolved by taking
origin's version and regenerating from source via `prepare-data.js`,
not hand-merged. All of this session's source-of-truth edits
(`master_dictionary.json`, `RULE-030.yaml`, `corrections.json`,
`known_*_conflicts.json`) applied without conflict. Full gate
re-verified and all touched keys re-verified live via `translate()`
after the rebase, before push.

## Pending Thangseng relay questions (not yet sent)

Logged in `.ai/WORKSTATE.yaml` `claude_a.pending_thangseng_questions`
for the next relay batch:

1. **"go"** — Thangseng gave "go = re'a" this session, but RULE-030 has
   an established example "Re·anga = go" from an earlier session, and
   the engine uses Re·anga/re·ang- as the root for every conjugated
   form (going, will go, did not go). Are re'a and re'anga two
   different things (e.g. a short/bare form vs. a fuller form), or the
   same word said two ways? When would a speaker use one over the
   other?
2. **"will not go"** — Thangseng gave "will not go = re'angjawa" this
   session, but an earlier session recorded "re·jawa" (without "ang")
   for "I will not go" with no destination mentioned. Are re·jawa and
   re'angjawa the same, or different (e.g. one with a destination in
   mind and one without; or a formality/register difference)?

## Do NOT repeat

- Do not re-open `only`, `going`, `will go`, or the live/living
  tang-/dong- sense distinction — all four closed this session with
  direct native evidence, see above.
- Do not set `src/data/phrase_maps.js`'s `go` entry to anything other
  than `Re·anga` without first re-verifying `going`/`will go`/"did not
  go" regression tests — `findVerbForm('go')` is the shared derivation
  root for all of them. This exact mistake was made and reverted this
  session.
- Do not treat `go`=re'a or `will not go`=re'angjawa as resolved — both
  are logged VERIFIED/HIGH citations in tension with existing rule/
  runtime values, not closed. Send the two queued relay questions above
  before touching either key again.
- Do not re-open the `only` citation-hygiene archaeology
  (ak·sa/·pit·chi/·sa/ma·mang miscited as VERIFIED in a 2026-08-01
  note) as part of this session's work — it's a separate, still-open
  item, untouched here.

## Exact next actions (priority order)

1. Send the two queued relay questions above to Thangseng (via Tridip
   or Project Owner). **Role: Owner/native.**
2. `knowledge (alt, fuller compound)` — still open from session 1,
   untouched this session. Needs a relay question on whether
   `U·iani ba ma·siani` and `u·i-ma·siani` are free variants or carry a
   sense/register distinction. **Role: Owner/native.**
3. `only` citation-hygiene archaeology (2026-08-01 SUPERSEDED note
   miscited unverified variants as VERIFIED) — same shape as the
   NV-092 stand-up/take-revenge finding, not yet traced to a specific
   commit. **Role: Claude A, git archaeology.**
4. Pre-existing deferred backlog, unchanged: pickPrimary verified-ties
   backlog (Claude B territory, though Claude B's 2026-08-28 cutover
   may have addressed some of this — check `docs/PICKPRIMARY_VERIFIED_TIES.md`
   fresh next session rather than assuming stale count) and the
   repository-wide space-before-`ma` sweep (Claude B territory).

No other Thangseng questions are pending beyond items 1–2 above.

## Resume protocol addendum (for the next Claude A session)

This session's own mistake (setting `phrase_maps.js`'s `go` root
directly from a new relay value, without checking what else depends on
that specific table entry) is worth naming as a general resume-time
check, not just a one-off "do not repeat" line:

**Before changing any `corrections.json`/`phrase_maps.js` entry for a
verb, check whether `grammarEngine.js`/`morphologyEngine.js` reads that
same table entry as a stem/root source for other derived forms** (grep
the key name across `src/*.js`, not just `src/data/*`). A new native
answer for the bare/citation form of a word is not automatically safe
to write into the table the engine uses for conjugation — confirm the
two are the same table entry, or ship them as two separate facts (a
dictionary citation vs. an engine root) as was done here for `go`. Run
the full unit test suite (`node --test tests/unit/*.test.js`) after any
such change, before committing — not just `test-dictionary.js` — since
the regression tests that caught this session's mistake are conjugated
sentence-level tests, not dictionary-entry-level ones.

## Repository status at close

- HEAD after this session's final commit: `git rev-parse HEAD`
  (recorded in `.ai/WORKSTATE.yaml` `repository.head`, verified equal
  to `origin/main` before this doc was written).
- `origin/main` match: verified via `git fetch` + `git rev-parse
  origin/main` immediately after push — exact match, `568e9b6...`.
- `git status`: clean immediately before and after this migration
  commit.
- `.ai/WORKSTATE.yaml`: updated this commit (`claude_a.next_action`,
  `claude_a.pending_thangseng_questions`, `repository.head`,
  `repository.last_updated`).
- `.ai/SESSION_BOOTSTRAP.md`: updated this commit (top pointer).
- No local-only commits — this migration commit is pushed in the same
  step it's created.
- No uncommitted or untracked files at close.
- Native-validation/blocker status: 3 items closed (only, going/will
  go, tang-/dong- senses), 2 flagged and queued for relay (go,
  will not go — questions above), 1 pre-existing item untouched
  (knowledge alt), 1 pre-existing archaeology item untouched (only's
  citation-hygiene defect). No mid-task state.

---

**This chat thread should be closed now** — per the project's thread-
hygiene rule (`.ai/SESSION_BOOTSTRAP.md`, "Thread hygiene &
zero-local-state ground rule"), every message in a long-running thread
resends the entire prior conversation as input tokens. Start a new
conversation and paste this document in; the next Claude A instance
should re-sync from `.ai/WORKSTATE.yaml` + actual repo state per the
mandatory resume sequence (Rule 10), not from this chat's history.
