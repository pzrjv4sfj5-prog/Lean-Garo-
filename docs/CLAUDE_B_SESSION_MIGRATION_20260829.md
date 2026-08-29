# Claude B Session Migration — 2026-08-29

## Resume context

Resumed via a pasted reference to `docs/CLAUDE_B_SESSION_MIGRATION_20260828.md`
(exact filename given, `...20260828.md`, did not exist — the actual most
recent doc on disk was dated 20260828 with a different final digit; read the
correct one and resynced against live `git log`/`git status` rather than
trusting the doc's own stated HEAD, since two more Claude A commits
(`5936b0e`, `568e9b6`) had landed after that doc's checkpoint). Verified
clean before starting: `git status --short` empty, HEAD == origin/main ==
`568e9b6`, fresh `prepare-data.js` rebuild byte-identical to the committed
`compiled_dict.json`.

## Part A — Engineering QA pass against current origin/main

Scope: engineering/runtime integrity only, per instruction — no linguistic
decisions, no redoing Claude A's linguistic work.

1. **Propagation (master → compiled → corrections/phrase_maps → runtime):**
   fresh `node prepare-data.js` rebuild diffed clean against the committed
   `compiled_dict.json`/`compiled_dict_alternates.json` (`git status --short`
   empty after rebuild) — confirmed reproducible, not just trusted from the
   last build.
2. **Stale duplicates / shadowing overrides:** `scripts/resync-stale-overrides.mjs`
   run before any changes — 0 mechanical candidates at that point (the `no`
   finding below was surfaced later, by Part B, not this initial pass).
3. **Runtime checks, not just tests:** ran `translate()` directly (not just
   `node --test`) across pickPrimary/confidence-cutover-sensitive keys
   (`only`, `going`, `will go`, `live`/`living`/`alive` tang-/dong- senses,
   `cooked`, `bye`, `bland`), plus tang-/dong- family sentences (`he is
   alive`, `she lives here`, `is he alive?`). All correct.
4. **Grammar `ma` propagation:** spot-checked via the existing RULE-046
   regression tests (already covered by `node --test`) plus a live
   `translate()` check on `"i live in the village"` (grammar-assembly path,
   correct locative composition).
5. **New finding (not previously flagged anywhere in this repo):** OOV
   proper nouns are silently dropped with zero trace. `translate("i live in
   guwahati")` → `"Anga donga"` — the destination vanishes, no `[UNKNOWN]`,
   no error, confidence still reports 0.75 as if nothing were missing.
   Traced to `assembleSentenceSOV`'s `pairs = content.map(...).filter(p =>
   p.garo)` step (`src/sentenceBuilder.js`) — any content word whose
   translation attempt returns `null` is silently excluded rather than
   surfaced. This is the same *shape* of bug this repository has fixed
   repeatedly before (AI-002's multi-word-object fix, the sibilant-plural
   `boxes`→`box` fix, the original `[UNKNOWN]`-marker convention itself),
   but in a function none of those prior fixes touched. **Not fixed this
   session** — found late in the pass; the smallest-diff shape likely
   mirrors `assembleGrammar`'s existing `[UNKNOWN]`-surfacing precedent, but
   `assembleSentenceSOV`'s own early-return (`if (pairs.every(p => p.garo
   === p.eng)) return null;`) and its STOP_WORDS/AUXILIARY_SKIP pre-filter
   both interact with any change here and deserve their own care rather
   than a rushed fix. Flagged as next session's first item.

Full gate at this checkpoint (before Part B): 8189/8189 dictionary entries,
8/9 grammatical corrections (see Part B item 3 below — this was already a
pre-existing gap, not introduced by this session), 247/247 unit tests,
repository-intelligence.js 0 new violations all checks A–G.

## Part B — Claimed Claude C audit (2026-08-29)

**No `docs/CLAUDE_C_AUDIT_20260829.md` exists** — checked the repo working
tree, `git log --all`, a fresh `git fetch origin`, and `/mnt/user-data/uploads`.
Per this project's own standing discipline (every cited audit finding is
re-verified against current HEAD before acting — see e.g. the 2026-08-15
"answer" false-positive precedent in `.ai/WORKSTATE.yaml`'s `claude_c`
block), every claimed finding was independently re-derived from the live
repository rather than taken on faith.

### 1. Stale `no` phrase_maps.js override — CONFIRMED, fixed

`src/data/phrase_maps.js` shipped `'no': 'Ong·ja'`, which
`master_dictionary.json` explicitly tags `SUPERSEDED` (superseded by
NV-095's `Ihing`, now `verified_high`). Confirmed via
`scripts/resync-stale-overrides.mjs`'s own mechanical check — this was its
one live RESYNC candidate. Applied via `--apply`. **Zero live-runtime
change** (`corrections.json` already independently served `Ihing`, and
`translate()`'s cascade checks corrections before phrase_maps) — but this
closes a real latent bug: if the shadowing `corrections.json` entry is ever
resynced or removed first, the stale phrase_maps.js value would have shipped
with no warning. Also removed the now-resolved key from
`src/data/known_cross_source_conflicts.json`'s baseline (242 → 241 known
entries).

### 2. Stale `wait` corrections.json value — INVESTIGATED, reverted (false positive)

`corrections.json`'s bare `"wait": "Damo"` looked stale against master's
cited `verified_high` `"Damo/Sengbo"` (NV-083) — the same shape as item 1.
Changed it to match. **This broke live conjugation**:
`translate("i will wait")` went from the correct `"Anga Damogen"` to the
malformed `"Anga Damo/Sengbogen"` — future-tense `-gen` suffixed directly
onto a two-form imperative citation (`Damo/Sengbo`) that was never a safe
bare stem to conjugate. Master's own note on that row explicitly scopes it
to "imperative sense." Two pre-existing regression tests
(`tests/unit/translationEngine.test.js:202`, cases `"wait"` and `"i will
wait"`) caught this immediately on the next `node --test` run.

This is the exact sense-collision this repo has had open since (at least)
the 2026-08-04 audit — `master_dictionary.json` carries both a declarative
`'wait'`→`'senga'` row (idx 758) and an imperative-only `'wait'`→
`'Damo/Sengbo'` row (idx 9783) under the same bare key, and nothing
disambiguates which a plain unmarked "wait" should mean. `corrections.json`'s
existing `"Damo"` value is not "stale" in the resync sense — it is a
(possibly also imperfect, but not provably wrong) attempt to pick a bare
conjugatable stem for that ambiguous key. **Reverted `corrections.json`
back to `"Damo"` unchanged.** Not re-guessed at.

This became the worked example for the new governance section (item 5
below): a fix that requires picking a winner between two independently
cited candidates is a linguistic call, not an engineering sync, even when
the diff looks mechanically identical to item 1.

### 3. Stale `quick` test-dictionary.js assertion — CONFIRMED, fixed

`test-dictionary.js`'s `requiredCorrections` table still asserted
`'quick': 'Tarkbo'`. The actual/live value has been `'Ta·rakbo!'` since
NV-095 (2026-08-23) — already asserted correctly by
`tests/unit/translationEngine.test.js`'s own regression test
(`lookupGaro('quick') === 'Ta·rakbo!'`), and confirmed live via
`compiled_dict.json`. This exact mismatch was visible in Part A's own first
gate run as "Grammatical corrections verified: 8/9" — now 9/9. Updated with
a citation comment matching the file's existing convention.

### 4. `check:resync` added to the mandatory build gate — DONE

`package.json`'s `build` script now runs
`node scripts/resync-stale-overrides.mjs` between `repository-intelligence.js`
and the unit-test run. The script has existed as a standalone `npm run
check:resync` command since 2026-08-19b but was never part of the mandatory
gate — item 1 above is exactly the kind of drift this would have caught
automatically at the time it was introduced, rather than being found by a
manual QA pass weeks later.

### 5. Governance clarification — DONE

Added §6 to `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`,
"Engineering-scope edits to master_dictionary metadata." States the bright
line as a standing rule: a fix is engineering-scope only when it can be
fully justified by pointing at one already-existing `verified_high`/citation
and saying "the override doesn't match this yet" (item 1's shape). If
justifying the fix requires deciding *which* of two-or-more candidates is
linguistically correct — a genuine tie, or a real sense split like item 2
above — it is not engineering-scope, regardless of how mechanical the diff
looks. Item 2's investigate-then-revert is used as the section's worked
example, written up in the same commit it happened in rather than smoothed
over.

## Verification

Full gate re-run after every change, not just at close:

| Check | Before this session | After |
|---|---|---|
| Dictionary entries | 8189/8189 | 8189/8189 (unchanged — no new/removed keys) |
| Grammatical corrections | 8/9 | **9/9** |
| Unit tests | 247/247 | 247/247 |
| repository-intelligence.js | 0 new violations | 0 new violations (Check F 78→76 known mismatches — items 1 and 3 above each closed one) |
| `scripts/resync-stale-overrides.mjs` | 1 RESYNC candidate | **0** |
| `npx vite build` | — | clean (58 modules, no errors) |

Runtime-verified live via `translate()` post-fix:
- `no` → `Ihing` (correction, 1.0) — unchanged from pre-fix, confirms zero
  live-behavior regression from the phrase_maps.js sync.
- `quick` → `Ta·rakbo!` (phrase-map, 0.99); `so quick` → `Ta·rakbo!`
  (stopword-stripped, 0.88) — both now correct.
- `wait` → `Damo` (correction, 1.0); `i wait` → `Anga Damo` (grammar-assembly,
  0.82); `i will wait` → `Anga Damogen` (grammar-assembly, 0.82) — all
  confirmed unchanged from session start, post-revert.

## Runtime Handoff

None beyond the OOV silent-drop finding (Part A item 5) and the wait
sense-collision (Part B item 2) — both explicitly deferred, not silently
carried, see Next Session below.

## Remaining items / Next Session

1. **[Engineering, priority]** Fix `assembleSentenceSOV`'s silent
   content-word drop (`src/sentenceBuilder.js`) for OOV/unresolved words —
   surface `[UNKNOWN]` (or an equivalent explicit marker) instead of
   silently filtering the word out of `pairs`. Mirror the `assembleGrammar`
   `[UNKNOWN]`-surfacing precedent (AI-002) but this is a different function
   with its own early-return and pre-filter interactions — needs its own
   trace, not a copy-paste of that fix. Add regression coverage matching the
   existing "all resolve / some fail" test shape already used elsewhere in
   `tests/unit/translationEngine.test.js`.
2. **[Linguistic, Claude A/Thangseng]** Resolve the imperative-vs-declarative
   `wait` sense-collision surfaced live this session (Part B item 2): does
   bare declarative "wait" default to `senga` (idx 758), with `Damo/Sengbo`
   reserved strictly for the imperative-with-punctuation path (`"wait!"`,
   already correctly handled via `sov-assembly`)? Not decided here — explicitly
   engineering-out-of-scope per this session's own new governance §6.
3. **[Linguistic, Claude A, pre-existing]** The ~300-row no-confidence
   backlog (AI-001's actual remaining linguistic scope, unchanged) and the 4
   stale-confidence citation-hygiene rows (`bye`, `bland` ×2, `cooked`)
   flagged at the 2026-08-28 close — both still untouched, still not this
   session's scope.

No other engineering-scoped work is outstanding as of this commit.

## Resume protocol for whoever picks this up next

1. `git fetch origin`; confirm local HEAD == origin/main before any work
   (this session found the prior migration doc's own stated checkpoint was
   two commits stale — always compare against live `git log`, not just the
   doc's claimed HEAD).
2. Read `.ai/WORKSTATE.yaml`'s `claude_b.next_action` (top entry) in full —
   supersedes this doc's summary if the two ever disagree post-hoc.
3. Read `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` in full, including the new
   §6 added this session, before making any master-metadata-adjacent edit.
4. If picking up item 1 above (OOV silent-drop fix): re-run the live
   `translate("i live in guwahati")` repro first to confirm it's still
   reproducing exactly as described, since intervening Claude A data changes
   could in principle add "guwahati" to the dictionary and mask the
   engineering bug without fixing the underlying mechanism — verify against
   a definitely-still-OOV word if so.
5. If picking up item 2 (wait sense-collision): this needs an actual
   Thangseng/native relay question, not corpus-internal guessing — the
   corpus already contains two independently-cited, mutually exclusive
   candidates.
