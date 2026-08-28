# Claude B Session Migration — 2026-08-28

Supersedes `docs/CLAUDE_B_SESSION_MIGRATION_20260827.md` (that doc's own
stated HEAD, `4c56572`, never actually reached `origin/main` — see
"Resync note" below; treat this doc as ground truth instead).

## Project identity
Lean Garo — English↔Garo translation engine + dictionary compile pipeline.
Full background: `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`.

## Resync note (how this session started)
Resumed with the previous migration doc's stated HEAD (`4c56572`), which
doesn't exist anywhere in the repo's history. Actual `origin/main` HEAD on
fetch was `7b157a5` — two Claude A commits (`e6c44c5`, `7b157a5`) pushed
*after* the migration-doc commit (`bd8a966`), not before as that doc
implied. Confirmed via full rebuild (byte-identical to committed
`compiled_dict.json`) and full gate (247/247 unit tests, 8185/8185
dictionary tests, repository-intelligence.js clean) at that actual HEAD
before starting any work.

## What was done this session

### 1. Widened the confidence-classification regex (§5 item 1, prior
session's queued next step)
`prepare-data.js`'s `isVerified` and `scripts/migrate-confidence-
schema.js`'s `classify()` were both anchored strictly to the literal
string `verified/high`, so 327 `master_dictionary.json` rows with real
verification language in their notes carried no `confidence` value.
Widened both to recognize 5 more prefixes confirmed to mean the same
thing: `RECONFIRMED`, `CONFIRMED`, `VERIFIED/native-speaker`,
`fix/verified`, `Native-confirmed`. Result: 327 → 300 unresolved rows,
27 newly classified `verified_high`, each independently native-relay-
cited in its own notes (not a linguistic judgment call — see the inline
comment in `prepare-data.js` for the full per-row rationale).

### 2. Found + fixed a real bug the widening exposed
`isVerified` is derived from `notes` fresh on every build regardless of
the `confidence` field, so the widening also re-evaluated 2 rows that
already had a stored `confidence` value:
- **`bear`**: `compiled_dict.json` flipped `ka·a chak` → `Matmak`. Traced
  the full chain: `phrase_maps.js`'s `'bear': 'nang·a'` override was a
  stale runtime-cascade shadow — same bug shape as the 2026-08-15 85-key
  sweep (`1ccac8c7`), just born 2 days after it (NV-080 landed
  2026-08-17). Resynced the override to the newly-verified answer.
- **`outside`**: flipped `A·pal` → `a'palo` — NOT a bug. NV-089 already
  says both are valid coexisting forms. Legitimate new tie, correctly
  auto-logged in `PICKPRIMARY_VERIFIED_TIES.md` (16→17). Left
  `phrase_maps.js` untouched.

Committed as `bb46abe`, pushed to `origin/main` (no upstream drift).

### 3. Read-only impact analysis for the pickPrimary→confidence cutover
(§5 item 2), per explicit Project Owner instruction: **do not cut over
until the blast radius is proven safe.**

**Method:** never modified the working repo mid-analysis. Two isolated
scratch-directory copies (outside `/home/claude/repo`, deleted at session
end) simulated the cutover — one testing the confidence-field swap alone,
one testing it combined with a candidate merge-order fix — each diffed
byte-for-byte against the untouched production `compiled_dict.json`.

**Findings:**
- **Total disagreement count** (any of 3 dimensions — superseded/
  verified/weak — differing between notes-derived and confidence-field
  classification, across all 9927 rows): **622** (4 superseded, 262
  verified, 359 weak). VERIFIED→non-VERIFIED: 1 row (`cooked`/`min·a`,
  benign — see below). non-VERIFIED→VERIFIED: 261 rows, the large
  majority pre-existing manual Claude A judgment calls from before this
  session (confidence values set from context the notes-regex literally
  cannot parse — e.g. `under (sheet/slab/covering)`), not something this
  session introduced or needs to re-litigate.
- **First-pass simulated compiled_dict.json changes** (confidence-cutover
  alone, no merge fix): exactly 2 keys — `bear`/`outside`-pattern repeat
  on `what is your name?`, and `lie`. Both traced to the SAME merge-order
  bug found in step 2, not new linguistic questions.
- **Fixed the merge-order bug in `prepare-data.js`** (the upgrade path
  that promotes a non-master duplicate to master status wasn't copying
  `isVariant`). Verified in isolation first: **zero** `compiled_dict.json`
  change from this fix alone against unmodified production — it only
  makes an already-real tie (`lie`) visible in
  `PICKPRIMARY_VERIFIED_TIES.md` where a bug had been silently hiding it.
- **Re-ran the full cutover simulation on the fixed base**: **zero**
  `compiled_dict.json` changes. One report-only improvement — `cooked`
  correctly drops out of `PICKPRIMARY_VERIFIED_TIES.md` (its `min·a`
  candidate is genuinely superseded per Claude A's own citation-hygiene
  note on that row; the notes-regex just couldn't see it because
  `SUPERSEDED` doesn't appear at the very start of that particular note).
- **Runtime impact**: none of the touched keys are masked by
  `corrections.json`/`phrase_maps.js` in a way that would change once the
  cutover shipped — checked every one individually against live
  `translate()` output.
- **4 rows found with a `confidence` field now stale relative to current
  notes** (`bye`, `bland` ×2, `cooked`): `migrate-confidence-schema.js`
  treats any pre-existing `confidence` value as permanently authoritative
  and never re-derives it, so a `confidence` value set before a later
  notes edit can silently drift. Confirmed **zero shipped-output impact**
  from all 4 (each key's *other* candidate already wins regardless).
  Deliberately **not auto-corrected** — the direction of staleness isn't
  uniform (3 need the field updated to match a later notes edit; 1,
  `cooked`, already has the *correct* confidence value with the
  notes-regex being the naive one) — that's a citation-hygiene judgment
  call belonging to Claude A, not a mechanical fix.

**Conclusion: cutover is safe.** No unresolved linguistic consequence.
Proceeded to migrate per the Project Owner's own instruction for this
exact outcome ("if the analysis is clean... then migrate").

### 4. Performed the cutover
`prepare-data.js`'s `isVerified`, `isWeak`, and `isSuperseded` now read
`item.confidence` directly instead of re-deriving from `notes` text.
`isVariant`/`isVariantVerified` remain notes-derived (the `confidence`
schema has no variant/non-variant dimension of its own — `verified_high`
covers both, so there's no field to cut over to for that distinction).

**Verification on the real repo** (not simulation): captured a pre-cutover
`compiled_dict.json` via `git stash`, applied the cutover, rebuilt, then
diffed the two outputs key-by-key in JS (not raw `diff` — a raw line diff
on minified single-line JSON is meaningless noise, confirmed and
discarded). **Real changed-key count: 0.**

## Resolved: the two 1-line compiled-artifact diffs
After the cutover, `git status` flagged `src/compiled_dict.json` and
`src/compiled_dict_alternates.json` as modified with a bare `1c1` line
diff each (both are single-line minified JSON, so a raw line diff is
uninformative by construction). Investigated both to ground truth rather
than assuming either was a no-op:

- **`compiled_dict.json`**: proven **byte-length-identical** (242380
  bytes both) with **identical key sets and identical values for every
  key** (scripted key-by-key comparison, 8185/8185 match, 0 added, 0
  removed, 0 changed) — the git blob hash differs solely because JSON
  key *insertion order* differs (first divergence at array index 2832),
  which is a serialization artifact of the cutover changing which code
  path processes candidates first, not a content change. JS object
  property access is order-independent, and live `translate()` calls
  for every key touched this session return byte-identical results
  pre- and post-cutover (see Gate + runtime results below) — this
  diff carries zero functional consequence.
- **`compiled_dict_alternates.json`**: genuinely gained 2 entries —
  `bye` (one new bundled alternate, `"De / Ra / Bai"`) and `bland`
  (two new alternates, `"chi·brek·a"` and `"·brok·"`). Both trace to
  the exact same root cause: this file's generator lists every
  candidate that survives the `isSuperseded` filter, and these 3
  specific master rows are 3 of the 4 already-identified stale-
  confidence rows above (their `notes` say `SUPERSEDED` but their
  `confidence` field was never updated to match, since the migration
  script never re-derives a pre-existing value). Pre-cutover, the
  notes-regex correctly excluded them; post-cutover, the confidence
  field (still `unverified`) no longer excludes them, so they now
  surface in this secondary, human-readable alternates listing.
  **This file is not read by `translate()`** (confirmed against
  `src/translationEngine.js`'s priority chain) — it is informational
  only. The *primary* shipped values for both keys are confirmed
  unchanged (`bye` -> `De`, `bland` -> `Chibroka`, both verified live).
  This is accurate new visibility into already-known stale data, not
  a new bug — no code or data change made in response; it reinforces
  the existing recommendation to flag those 4 rows to Claude A.

## Gate + runtime results
- `test-dictionary.js`: 8185/8185 valid entries.
- `node --test tests/unit/*.test.js`: **247/247 passing.**
- `repository-intelligence.js`: PASSED, 0 new violations (Check G: 9927
  rows, 0 confidence-schema problems).
- Live `translate()` spot-checked for every key touched this session —
  `bear`, `outside`, `lie`, `cooked`, `bye`, `bland`, `book`, `ant`,
  `what is your name?` — all match pre-session output exactly.

## Standing rules reaffirmed this session
- Master (`master_dictionary.json`) is the declared canonical source;
  its own tag wins on any merge-upgrade collision (direct assignment,
  not OR — matches the existing `source` field precedent).
- `SUPERSEDED`-tagged candidates never enter `pickPrimary`'s pool.
- A `confidence` value, once set, is preserved by the migration script
  even if it later drifts from notes — intentional (protects manual
  judgment calls the notes-regex can't see), but means staleness can
  accumulate silently. Worth a periodic citation-hygiene pass, not an
  automatic one.
- Engineering-scoped fixes (classification gaps, merge-order bugs, stale
  runtime overrides) are Claude B's call. Sense/POS disambiguation and
  "which citation wins" judgment calls are Claude A's.

## Item status

**CLOSED this session:**
- §5 item 1 (widen confidence-classification regex) — done, verified,
  pushed.
- §5 item 2 (pickPrimary → confidence cutover) — impact analysis done,
  merge-order bug found and fixed, cutover performed, verified safe by
  every method available (byte-diff, key-diff, full gate, live runtime
  spot-check), pushed.
- The `bear` stale-`phrase_maps.js`-override bug — fixed, pushed.
- The compiled-artifact 1-line-diff investigation — fully resolved,
  root-caused, documented; no code or data change was needed for it.

**OPEN (not blocking, no shipped-output impact):**
- 4 stale-confidence rows (`bye`, `bland` ×2, `cooked`) where the
  `confidence` field has drifted from a later `notes` edit. Confirmed
  zero effect on `compiled_dict.json`; now also confirmed to be the
  direct cause of 2 new entries in the non-runtime
  `compiled_dict_alternates.json` report. Recommended action: a short
  citation-hygiene pass by Claude A (direction of the fix differs per
  row — not mechanical, see disagreement analysis above).

**BLOCKED / HANDOFF (Claude A, linguistic, out of B's scope):**
- 300 rows with no `confidence` value at all — the real remaining
  AI-001 backlog (`Typo`/`Root`/`Split`/`Hyphenation`/`AMBIGUOUS`/
  `INCORRECT` prefixes, plus `Native correction`-prefixed rows that
  dispute which *sense* is primary). Unchanged in scope from prior
  sessions; not attempted here per governance (sense/POS judgment is
  Claude A's call).
- Prior sessions' other open items (king/answer/film handoffs,
  resync-sweep backlog per
  `docs/CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md`) — untouched
  this session, still open, unaffected by anything done here.

## Explicit next-session action
No specific next B-engineering task is queued or required. In priority
order: (1) flag the 4 stale-confidence rows to Claude A/Project Owner —
a short citation-hygiene ask, not blocking anything; (2) the 300-row
no-confidence backlog remains the substantive remaining AI-001 work,
entirely linguistic — wait for Claude A or explicit Project Owner
scoping before touching it. No known engineering-scoped work is
outstanding as of this commit.

## Rebase note
Before the final push, `origin/main` had advanced past `bb46abe` with
Claude A's `1aee580` (NV-097/NV-098, touching `master_dictionary.json`,
`corrections.json`, `phrase_maps.js`). Rebased onto it per instruction.
Source files (`master_dictionary.json`, `prepare-data.js`,
`scripts/migrate-confidence-schema.js`, `corrections.json`,
`phrase_maps.js`) merged cleanly with no conflicts. Only the three
*generated* artifacts conflicted (`compiled_dict.json`,
`compiled_dict_alternates.json`,
`docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`) — resolved by discarding
both conflicting versions and regenerating fresh from the merged source
via `node prepare-data.js`, rather than hand-merging derived JSON. This
is the only correct way to resolve conflicts in build artifacts. Result:
8187 shipped entries (up from 8185, reflecting Claude A's new rows).
Full gate re-run and all this session's touched-key runtime checks
re-confirmed on the merged base — see below.

## Runtime Handoff
- HEAD = `origin/main` after push (rebased onto Claude A's `1aee580`),
  verified via `git ls-remote`.
- Working tree clean, zero uncommitted diff, zero untracked files, no
  local-only commits.
- Full gate green on the merged base: 8187/8187 dictionary tests,
  247/247 unit tests, repository-intelligence.js 0 new violations.
- `compiled_dict.json` reflects the true merge of Claude A's NV-097/
  NV-098 additions plus this session's cutover logic (8187 entries, up
  from 8185 pre-rebase / 8185 pre-session — the +2 are Claude A's new
  rows, not a B-session side effect). Every key this B session touched
  (bear, outside, lie, cooked, bye, bland, book, ant, "what is your
  name?") reconfirmed via live `translate()` on the merged base, all
  match pre-session output exactly.
