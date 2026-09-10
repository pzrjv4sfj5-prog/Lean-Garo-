# Claude B Session Migration — 2026-09-10 (session close, zero-runtime)

## Project identity
Lean-Garo: English→Garo translation engine. Claude B role: engineering/
runtime/build/data-pipeline. Does NOT adjudicate linguistic disputes.

## Repo state at close
HEAD = origin/main = `2b78781`. Working tree clean. Git identity this
session: `user.name "Claude B"`, `user.email claude-b@anthropic-session.local`.

## Credential status — TWO compromised PATs, neither rotated
Unchanged from prior doc. A github_pat_11CDWG5UI0... token was pasted in
plaintext in this session's chat (again against the standing rule) and
used to clone/push. **Both known tokens remain compromised and unrotated.
Do not reuse either. Get any replacement via a secure channel, not chat.**

## Work this session

### 1. Cucumber fix — DONE, pushed, full gate re-run clean (real runtime)
Per `docs/PROJECT_OWNER_CUCUMBER_AND_OPEN_ITEMS_20260909.json`: `so·sra`
and `Te·e` marked `confidence: superseded` in `master_dictionary.json`
for both the `cucumber` and `the cucumber` keys (the pipeline's actual
exclusion mechanism is `confidence === 'superseded'`, not an invented
`'suspended'` value — caught and corrected before compiling). `temit`
added as the sole active `verified_high` candidate for both keys.
`"the cucumber"` logged in `src/data/known_dictionary_conflicts.json`
(repository-intelligence.js CHECK C) since it now legitimately carries
two values, citing the same Owner directive.

Verified end-to-end via the real `translationEngine.js translate()`
(not just the compiled JSON): plain `cucumber` lookup, `"the cucumber is
fresh"` (a/an/the SUBJECT-is path), and `"I like cucumber"`
(grammar-assembly path) all resolve to `temit`; `so·sra`/`Te·e` confirmed
unreachable from any traced path.

Full build gate run and green, twice (once pre-rebase, once re-verified
post-rebase against concurrent commits — see below): `prepare-data.js`,
`test-dictionary.js` (8264/8264), `repository-intelligence.js` (0 new
violations across all checks), `resync-stale-overrides.mjs` (0
candidates), `node --test tests/unit/*.test.js` (379/379 pass).
`vite build` not run — no `node_modules` in this sandbox, pre-existing
gap, not a regression from this session. **0 runtime errors.**

Concurrent-write handling: pushed once, got rejected (`bbc7bb0` had
landed — 8 commits, NV-155 closures + Batch 4 mother/sit fixes from
Claude A/C/D sessions). Rebased cleanly (`master_dictionary.json`
auto-merged with no conflict; only the *generated* files —
`compiled_dict.json`, `unverified_words.json` — conflicted, resolved by
regenerating from the merged source via `prepare-data.js` rather than
hand-merging build artifacts, per standing discipline). Re-ran the full
gate against the merged state before the second push. Commits:
`33d8989`→rebased to `7cf5997`, then `ed5e4ec` (gate-regeneration
commit). Both pushed, `HEAD == origin/main` confirmed clean at that
point.

### 2. Stage 2C tied-key classification — PAUSED, batch 3 done, left PENDING
Continued from `docs/CLAUDE_B_SESSION_MIGRATION_20260909B.md` (batches
1-2: `able`/`agree`/`alone`/`big red house`/`brave` classified,
`demand` separately root-caused as a real bug, not a tie). Before
resuming, re-confirmed the current `docs/PICKPRIMARY_VERIFIED_TIES.md`
is still the 22-key list this doc expects (re-fetched, no drift at that
point) — the walk/mother/sit fixes that landed concurrently did not
touch any of the 22 tied keys.

Batch 3 (`early`, `empty`, `fever`) traced against `compiled_dict.json`
+ `compiled_dict_alternates.json` (real files, not simulated) — all
three ship exactly what the tie report claims, no drift, no bug. No
engineering-level tiebreaker signal found for any (flat
`variant/VERIFIED/HIGH` on every candidate, no POS/case/structural
distinguisher — unlike `demand`, which had one). Provisional
classification for all three: **LINGUISTIC-ADJUDICATION-REQUIRED**, same
shape as the batch-1/2 keys. One side-note flagged for Claude A, not
acted on: `fever`'s shipped value `jom·a` is also the shipped value for
`suffer` elsewhere in the dictionary — likely a genuine homograph, not a
data conflict, but worth a second pair of eyes.

**Explicitly NOT a methodology I invented from scratch**: the
ENGINEERING-SAFE / ENGINEERING-AMBIGUOUS / LINGUISTIC-ADJUDICATION-
REQUIRED / RUNTIME-MISMATCH / BUILD-MISMATCH category definitions
referenced in `docs/CLAUDE_B_SESSION_MIGRATION_20260909.md`'s next-step
list (§6 of an apparent "Stage 2" plan) are **not committed anywhere in
this repo** — no file matched a search for those exact terms outside
that one migration doc. This session's classifications follow the same
*shape* the batch-1/2 session used (candidate list, shipped value,
engineering-signal check, provisional bucket), but if a formal written
§6 spec exists outside the repo, whoever resumes Stage 2C should get it
and re-check batches 1-3 against it rather than assume this session's
informal replication is authoritative.

**Owner instruction this session: keep Stage 2C in PENDING.** Remaining
14 keys, untouched: `greedy, hoe, horn, how, i can eat, i can go, i can
work, last, leaf, leg, lie, outside, where, where (relative pronoun)`.

### 3. New counting-system input flagged, not yet started
Two new files landed on `origin/main` mid-session, authored directly by
the Project Owner (not Claude A/B/C/D), pulled cleanly (fast-forward,
no conflict) as commits `b23d91b`/`2b78781`:
- `data/garo_number_system_machine_ready.json` — base number table
  (1-10, tens, hundred/thousand/ten-thousand/lakh multipliers),
  `schema: lean-garo.number.v2`.
- `data/garo_number_classifier_engine_machine_ready.json` — a
  machine-ready **contract spec** (`schema:
  lean-garo.number_classifier_engine.v1`) describing an intended
  pipeline: english noun → master-dictionary lookup → category/
  subcategory → classifier/counting-unit → number-engine lookup →
  surface realization → final counted phrase. Explicitly addressed to
  "Claude A linguistic/category review and Claude B runtime
  integration."

Per the Owner's message this session: this is expected to surface a
**major flaw in the current counting system** (the existing
`number_engine.js` in this repo predates this contract). Neither file
has been read in full nor cross-checked against `number_engine.js`,
`src/garo_classifier.js`, or any existing counted-phrase test this
session — flagged for next session's first action, not started here
(zero-runtime close, no build/test run against these new files).

## Standing rules confirmed followed this session
- Repo writes only on explicit Owner authorization — cucumber fix
  authorized explicitly in-chat this session before any write.
- Always `git fetch` + re-sync before trusting HEAD — done twice, caught
  the 8-commit drift before the first push attempt and confirmed zero
  further drift before this doc.
- Claude B does not adjudicate linguistic correctness — Stage 2C batch 3
  classifications are provisional engineering read-outs, not linguistic
  rulings; explicitly routed to Claude A/Owner.
- Small-batch execution — cucumber fix and Stage 2C batch 3 each scoped
  narrowly; did not attempt the counting-system files or further Stage
  2C keys this session per the Owner's own "keep pending" instruction.
- Generated files (`compiled_dict.json`, `unverified_words.json`,
  `PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`) were regenerated from source
  after the rebase, never hand-merged.

## Open items (unchanged unless noted)
1. **"GPT correct forms" doc** — still unresolved, not touched this
   session.
2. **Stage 2C** — 5 keys classified (batch 1-2, prior session), 3 more
   classified this session (batch 3: `early`/`empty`/`fever`), 14
   remain. **Explicitly PENDING per Owner instruction — do not resume
   automatically; wait for Owner direction next session.**
3. **NEW: counting-system contract** (`data/garo_number_*_machine_ready.json`)
   — needs a first read-through and gap analysis against
   `number_engine.js`/`src/garo_classifier.js` before any fix. This is
   the Owner-flagged priority for next session.
4. Both compromised PATs — still unrotated as of this doc.
5. `fever`/`suffer` possible homograph — flagged for Claude A, not
   investigated further.

## Exact next step for resume
1. `git fetch origin`, re-sync — do not assume `2b78781` is still
   current; re-check for further concurrent commits (Claude A/C/D and
   the Owner have all pushed directly to `main` this week without prior
   notice).
2. Read both `data/garo_number_system_machine_ready.json` and
   `data/garo_number_classifier_engine_machine_ready.json` in full, then
   read the current `src/number_engine.js` and `src/garo_classifier.js`
   to locate the "major flaw" the Owner referenced — do not guess at
   its shape from the contract file alone.
3. Stage 2C stays in PENDING until the Owner says otherwise — do not
   resume batch 4 without explicit direction.
4. Do not re-litigate the cucumber fix or Stage 2C batches 1-3 — closed
   this session with live evidence, not assumptions.
