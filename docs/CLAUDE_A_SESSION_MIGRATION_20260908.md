# Claude A Session Migration — 2026-09-08

## Resume verification
Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260907C.md`. `git fetch` +
HEAD check on arrival: local HEAD matched origin/main, and the only commit
since the prior migration doc's stated close (`3e42832`) was that doc's own
session-close commit (`7309945`). No drift, no re-verification needed
beyond that check.

## Work performed this session

### 1. Reconciliation package cleanup
Source: `docs/lean_garo_thangseng_reconciliation_v2_machine_ready.json`
(Project Owner–supplied, v2.1, `PROJECT_OWNER_UPDATED`).

Cross-checked all 54 confirmed keys (`project_owner_confirmed_closures` +
`key_confirmations` + `batch_terms`) against `master_dictionary.json`,
`phrase_maps.js`, and `corrections.json`. Most were either already correct
or differed only by case/raka-dot presence (normalization-safe, no action).
Applied fixes only where the canonical value was unambiguous and had no
contradicting evidence:

- **elephant**: deleted 3 contaminated master rows (`Monga` SUPERSEDED,
  `Mong` and `ha·ti` both wrongly VERIFIED/HIGH); kept sole `mongma`.
  Fixed stale `phrase_maps.js` override (`Mong` → `mongma`).
- **teacher**: deleted 3 dead SUPERSEDED rows (`di·di`, `ma·star`,
  `ti·char`) per the reconciliation doc's deletion policy (delete wrong/
  contaminated rows from runtime/build-source rather than retain as
  SUPERSEDED).
- **cat**: deleted 1 dead SUPERSEDED row (`meng·gong`); live value
  (`Menggo`) was already correct.
- **student (male/female)**: already correct (`Chattro`/`Chattri`,
  case-only difference from the reconciliation doc's casing). No action.
- **dog**: promoted `unverified` → `verified_high` (value unchanged,
  `Achak`) — matches reconciliation, no contradicting evidence.
- **dead body / corpse**: promoted `unverified` → `verified_high`,
  canonicalized spelling to `Manggisi` (was `mang·gi·si`).

### 2. Thangseng follow-up (relayed live by Project Owner mid-session): forest = Buring
- `master_dictionary.json`: promoted the correct `Buring` row (wrongly
  SUPERSEDED) to `verified_high`; deleted a typo'd `bring` duplicate that
  had wrongly gone live as the primary VERIFIED/HIGH candidate.
- `phrase_maps.js`: `forest` override `bring` → `Buring`.
- `corrections.json`: fixed `forest` → `mongma` (an unrelated pre-existing
  collision where "forest" was resolving to the elephant word) → `Buring`.
  This is also the exact forest/mongma collision the reconciliation doc's
  `open_adjudications.forest` entry described.

### 3. Push collision (resolved via rebase)
On push, found Claude B had concurrently landed
`643fa62` — a fix for the sibling collision, `corrections.json`'s
`"an elephant": "mangsa buring·o"` → `"mongma"`, same reconciliation
package, same file, adjacent lines. Rebased onto `origin/main`; one
conflict in `corrections.json` (both commits touched neighboring lines),
resolved by keeping both fixes:
```
"elephant": "mongma",
"forest": "Buring",
"an elephant": "mongma",
```
Re-ran `prepare-data.js` + full gate after the rebase, before pushing.

### 4. Test maintenance
`tests/unit/confidence_schema_cap.test.js` asserted `"dog"` reports capped
confidence *because* its source row was unverified — my dog promotion
invalidated that premise. Moved `dog` to a regression-guard assertion
(expects full confidence, 0.99) and substituted `guava` (still unverified
at time of writing) to keep the cap-behavior case covered. Net +1 test.

## Deliberately NOT touched — flagged for next Thangseng relay
Each of these has a genuine contradiction or lock discovered during
investigation, not just an unconfirmed guess:

- **stop**: reconciliation doc says `Sengbo`. Existing native evidence
  (NV-089, in `master_dictionary.json` notes on the `dontonga` row)
  explicitly states *"Tridip's guess 'Sengbo' was explicitly rejected
  (Sengbo confirmed elsewhere as 'wait')."* Direct contradiction between
  two purportedly-native sources — needs Thangseng re-ask, not a guess.
  Live value unchanged: `dontonga`.
- **can / ama**: reconciliation's example sentences read as if `ama` is
  specific to "can go" (`Anga re·angna ama`), but the existing native
  quote (NV-018, on the `ama` row) explicitly says *"ama is not 'can eat'.
  It only means can"* — i.e. general-purpose, not go-specific. This is
  also the same `man·a`/`ama` question already flagged unresolved in prior
  sessions (see `docs/THANGSENG_RELAY_QUESTION_20260901B.md` item 2).
  `repository-intelligence.js`'s pickPrimary-tie report now additionally
  shows this surfaces as 2-way ties on `i can eat`/`i can go`/`i can work`
  compound sentences too — same root cause, not separately resolved.
  Nothing changed.
- **boy / girl**: reconciliation says bare `Me·a`/`Me·chik`. Existing
  NV-130 (detailed native quote) says `me·a bi·sa`/`me·chik bi·sa`
  specifically for "boy"/"girl" (distinguishing from `me·asa` = male/man).
  Live `phrase_maps.js` currently ships a *third* value, `ko·ka`/`ko·ki`
  (weak, uncited "variant" master rows). Three-way disagreement — nothing
  changed, all three candidates still on file.
- **wait**: live value `Damo/Sengbo` is intentionally locked — matches a
  hardcoded `grammarOverrides` constant in `prepare-data.js` and a
  regression test (`tests/unit/translationEngine.test.js:1117`) that
  exists specifically to pin this value. Changing it requires coordinated
  engine-code work — Claude B territory, not touched.
- **eaten / curry / wrist / sitting**: reconciliation's canon differs from
  live only by raka-dot presence, or (for "eaten") the extra candidates
  are pre-existing documented-legitimate variants from a prior Claude A
  session, not contamination. No real conflict found — left as-is rather
  than guess at dot placement, consistent with prior sessions' handling of
  raka-placement ambiguity (see angry-cluster precedent, still also open).

## Runtime Handoff (mandatory)
- No engine code (`translationEngine.js`, `prepare-data.js` logic,
  `grammarOverrides`) was modified this session — data/citation-layer only.
- `prepare-data.js`, `test-dictionary.js`, `repository-intelligence.js`,
  and `scripts/resync-stale-overrides.mjs` were all re-run after every
  data change, including after the rebase merge, before pushing.
- `node --test tests/unit/*.test.js`: 364/364 passing (started at 360;
  +3 from Claude B's `an_elephant_correction.test.js`, +1 from this
  session's `confidence_schema_cap.test.js` update).
- `vite build`: clean, no errors, run twice (once before the push
  collision, once after the rebase merge).
- Nothing queued for Claude B or Claude C from this session beyond the
  standing "wait"/grammarOverrides note above (informational, not a task).

## Next Recommended Tasks
1. Draft and send a Thangseng relay batch covering: `stop` (Sengbo vs
   dontonga contradiction), `can`/`ama` (general-purpose vs "can go"
   contradiction — also surfaces in 3 compound sentences per
   pickPrimary-tie report), `boy`/`girl` (3-way: `Me·a`/`me·a bi·sa`/
   `ko·ka`). This can likely be combined with the still-unsent
   `docs/THANGSENG_RELAY_QUESTION_20260901B.md` batch.
2. `docs/PICKPRIMARY_VERIFIED_TIES.md` now lists 26 tied keys total
   (regenerated this session) — worth a skim next session for any other
   quick, unambiguous wins like `forest` turned out to be.

## Repository status at close
- HEAD: `8220f36ddc7cef237f807dc569fa4f746782054d`
- origin/main: `8220f36ddc7cef237f807dc569fa4f746782054d` — **matches**
- `git status`: clean except gitignored `dist/index.html` build artifact
  (not tracked as a repo concern; regenerated by `vite build`, gitignored)
- No local-only commits, no uncommitted changes, no untracked files
  outside `dist/` and `node_modules/`
- `.ai/WORKSTATE.yaml`: updated (this session's summary now
  `claude_a.next_action`, prior rotated to `next_action_prior_20260907C`)
- `.ai/SESSION_BOOTSTRAP.md`: no new standing rule established this
  session — not modified
- Migration doc: complete (this file)
- Native-validation status: no new NV-numbered item this session (forest
  confirmation was relayed inline, not yet given a formal NV number —
  flagging for whoever maintains the NV log)
- Blocker status: none blocking; 4 items above queued for next Thangseng
  relay, not blocking further engineering or data work
