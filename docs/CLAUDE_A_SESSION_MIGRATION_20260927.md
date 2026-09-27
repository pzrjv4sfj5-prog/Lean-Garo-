# Claude A Session Migration — 2026-09-27

Resume-and-close session. One item closed: bare-key "build" runtime override, found via a Project-Owner-requested full repo audit.

## Resume (Rule 10 / §11.1)

Fresh PAT clone. `git fetch origin`: no drift, HEAD == origin/main == `d0d251c` (matches `docs/CLAUDE_A_SESSION_MIGRATION_20260926B.md`'s stated close exactly). Read that migration doc, `.ai/WORKSTATE.yaml`, `.ai/SESSION_BOOTSTRAP.md` — all consistent, nothing addressed to Claude A pending.

## Task this turn

Repo audit for master/live-layer bugs and drift, at Project Owner request. Ran the full mechanical gate (repository-intelligence.js 8 checks, resync-stale-overrides.mjs): 0 new violations across the board — everything flagged was pre-existing/allowlisted. One allowlisted-but-never-actually-resolved live inconsistency surfaced during the resync-report spot-check (see Classification below); Project Owner directed a fix.

## Classification (§4)

| Item | Class | Reasoning |
|---|---|---|
| bare "build" phrase_maps.js override | A | Citation already existed (VERIFIED/HIGH "build (verb, general)"=Rik·a, 2026-08-09); this closes a wiring gap between an existing citation and the runtime layer, not a new linguistic fact |

## Work performed

`src/data/phrase_maps.js`: bare key `'build'` override changed from `'Rika'` (no raka dot, matching the SUPERSEDED `rik·a` master row) to `'Rik·a'` (matching the existing VERIFIED/HIGH citation at `"build (verb, general)"`, Thangseng-confirmed 2026-08-09). The VERIFIED entry's own note had explicitly intended to prevent the bare key from shipping the unconfirmed spelling, but the override layer was never updated to match — this closes that gap. `"to build"` (idx 632, unverified, "Rika") deliberately left untouched, same as the original citation's stated design.

Live-verified: `build`/`Build` → `Rik·a` (phrase-map, was `Rika`); `i build a house` → `Anga nok·ko Rik·a` (grammar-assembly, now composes with the correct root); `to build` still → `Rika` (unchanged, unverified variant, untouched by design); `build (verb, general)`, `i build the house`, `i am building` all unchanged (already correct, not touched by this fix).

## Gate at close

Re-run in full after the fix: `test-dictionary.js` 8922/8922 entries, 9/9 grammatical corrections; `repository-intelligence.js` 0 new violations (8 checks); `node --test` 474/474 unit tests passing. `compiled_dict.json` unaffected (phrase_maps.js is a separate runtime-override layer, not baked into the compiled artifact) — confirmed via `git status`, no artifact diff.

## §8 Runtime Handoff

```
- "build" (bare key)
  Linguistic decision: no new decision — wired the bare key's runtime
    override to the already-VERIFIED/HIGH citation (Rik·a, 2026-08-09)
    instead of the old unverified/superseded spelling (Rika)
  Evidence: pre-existing VERIFIED/HIGH citation, Thangseng-confirmed
    2026-08-09 (see "build (verb, general)"); this session made no new
    evidentiary claim
  Expected Garo output: Rik·a
  Affected POS/sense: v.
  Duplicate representations checked: master_dictionary.json rows
    3524-3527 (bare "build" family, all unverified/superseded, untouched
    — this was purely an override-layer fix, no master row edited);
    src/data/corrections.json — no "build" entry, nothing to fix there;
    src/compiled_dict.json — unaffected (this key resolves via
    phrase-map override before compiled_dict is consulted; artifact
    confirmed byte-identical via git status)
  Runtime/override locations to verify: src/data/phrase_maps.js (fixed,
    this commit)
  What A has verified: bare "build"/"Build" (phrase-map), "i build a
    house" (grammar-assembly, now composes with Rik·a), "to build"
    unchanged (unverified variant, correctly left alone), "build (verb,
    general)"/"i build the house"/"i am building" unchanged (already
    correct, unaffected by this fix)
  What A has NOT verified: nothing else outstanding for this key
```

Standing open items unchanged, restated for continuity:

- Claude B territory: sov-assembly's "where is the X?" question template still fails on multi-word nouns (confirmed on cow dung / little boy / water buffalo / mosquito net). Not fixed this session — no code touched.
- §5 drift flag (restated from 20260926B, still unaddressed): no new grammar rule since RULE-050 (2026-09-21) — vocabulary-only for 6+ consecutive Claude A sessions, past the 3-session threshold. Recommend a future session be framed explicitly as rule-generalization review (candidates: Matchota/-aha/-ata suffix pattern; bi·sa productive-suffix gap open since 2026-09-09).

## Repository status at close

- HEAD before this doc's own commit: `a46cfea`, verified == origin/main via `git fetch` on resume
- `git status`: clean, no uncommitted changes before this commit
- `WORKSTATE.yaml`: updated in this doc's own close commit
- `SESSION_BOOTSTRAP.md`: updated in this doc's own close commit
- Migration doc: this file, complete
- No local/unpushed commits pending beyond this doc's own close commit
- Native-validation status: no open Thangseng relay items touched this session; no new blockers; §5 drift flag (above) still awaiting Project Owner attention
