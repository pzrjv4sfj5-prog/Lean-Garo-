# Claude B Session Migration — Stage 2A/2B complete, 2026-09-09 (resume)

## Project identity
Lean-Garo: English→Garo translation engine. Claude B role: engineering/
runtime/build/data-pipeline. Does NOT adjudicate linguistic disputes.

## Credential status — TWO compromised PATs, neither rotated
1. PAT pasted in a prior session — flagged, owner had not confirmed
   rotation as of last migration doc.
2. A SECOND PAT (`github_pat_11CDWG5UI0...`) was pasted in plaintext in
   this session's chat, explicitly against the standing rule (get
   tokens via secure channel, not chat). Owner directed proceeding
   anyway. This token was used to clone the repo this session.
**Both tokens should be treated as compromised and rotated. Do not
reuse either. Get any replacement via a secure channel, not chat.**

## Repo state — moved substantially since last migration doc
Last doc expected HEAD = `c7d451b`. On fetch, origin/main had moved to
`b7d4ec3` — SIX new commits from a concurrent Claude A session,
including two fish-related deletions. **Always re-sync live; do not
trust a prior doc's HEAD.**

New commits since `c7d451b` (all Claude A, verified via `git show`):
- `2564ddc`/`0dba5bd`/`fdd37f7` — able/bi·sa/kitten batch + migration
  bookkeeping (not independently re-verified this session, not in my
  scope).
- `226b41b` — fruit/food canonical-form directives batch.
- `17678ea` — garlic superseded-entry deletion + kitten typo fix.
- `62f5f67` — category_index.json rebuild after rebase.
- `aaac072` — ginger/tomato/brinjal/pumpkin live-bug fix.
- `1112255` — **deleted the stale `two fish`=`do·o mang·gni` SUPERSEDED
  row** (a different Garo string than the two-fish *winner*
  `na·tok mang·gni` — no collision).
- `b7d4ec3` (current HEAD = origin/main) — **deleted the stale
  `three fish`=`na·tok mang·gni` SUPERSEDED row** (the arithmetic-
  mismatch row flagged in Stage 1/Claude B's audit report). Winner
  `na·tok mang·gittam` untouched.

**Verified this session (not just trusted from commit messages):**
both deletions remove already-SUPERSEDED rows entirely — they do not
change which candidate wins, do not introduce a global blacklist, and
do not violate the Stage 2 §12 protected regression invariant. This
is citation-discipline cleanup consistent with, not a threat to, the
key-scoped SUPERSEDED mechanism.

Working tree clean at `b7d4ec3`. Git identity this session:
`user.name "Claude B"`, `user.email claude-b@anthropic-session.local`.

## Stage 2 progress this session

### Stage 2A §4.1 — baseline reproduction: DONE (re-verified live)
HEAD/origin/main both `b7d4ec3`, working tree clean.

### Stage 2A §4.2 — three-fish positive control: DONE, real runtime
Ran actual `translate()` from `src/translationEngine.js` (async, not
simulated) for `three fish` / `Three fish` / `THREE FISH` → all
return `na·tok mang·gittam`, method `exact-phrase`, confidence 0.98.
Traced full chain: `compiled_dict.json["three fish"]` =
`na·tok mang·gittam`; not present in `compiled_dict_alternates.json`;
no `corrections.json` or `phrase_maps.js` entry for the key;
`master_dictionary.json` has exactly one remaining row for
`three fish`, VERIFIED/HIGH, `na·tok mang·gittam`. `na·tok mang·gni`
is confirmed absent from every layer for this key. **CLOSED.**

### Stage 2A §4.3 — two-fish negative control: DONE, real runtime
`two fish` / `Two Fish` / `TWO FISH` → all return `na·tok mang·gni`,
`exact-phrase`, confidence 0.98, via the same real `translate()` call.
Confirms the three-fish cleanup stayed key-scoped. **CLOSED.**

### Stage 2B — real build validation: DONE, full pipeline executed
Ran the actual supported build path, not a simulation:
- `npm install` (393 packages, engine-version warning only, non-
  blocking — repo pins Node 20.x, container has 22.22.2).
- `node prepare-data.js` — 8252 unique entries compiled; alternates
  1082; held (SUPERSEDED-only) 226 keys; **pickPrimary verified-tie
  report: 25 keys** (Stage 1 reported 24 — see Evidence Gap below);
  no-verified-candidate report 5645 keys.
- `node test-dictionary.js` — 8252/8252 valid, grammatical corrections
  9/9, JSON compliant.
- `node repository-intelligence.js` — 0 new violations across all six
  checks (self-consistency, pending-lexicon, placeholders, runtime-
  cascade agreement, confidence-schema, modifier+noun collisions).
- `node scripts/resync-stale-overrides.mjs` — 0 resync candidates
  needed; 34 intentional-variant skips, 1 known non-matching skip
  (`build`/phrase_maps, pre-existing, not touched).
- `node --test tests/unit/*.test.js` — **379/379 pass.**

All gate numbers match what commits `1112255`/`b7d4ec3` claimed —
independently reproduced, not just trusted. **Stage 2B CLOSED.**

## Evidence gap flagged (new this session)
Stage 1's report said 24 pickPrimary verified-tie keys; the real
build this session reports **25**. Not yet root-caused — could be a
new tie introduced by one of the six concurrent Claude A commits, or
a stale number in the Stage 1 doc. **Needs checking against
`docs/PICKPRIMARY_VERIFIED_TIES.md` diff before Stage 2C (§6) starts,
since §6 explicitly scopes its audit to that file's key list.**

## Standing rules (confirmed followed this session)
- Repo writes only on explicit Owner authorization — no writes made
  this session; read-only investigation + real build/test execution.
- Always `git fetch` + re-sync before trusting HEAD — done, caught a
  6-commit drift the prior migration doc didn't know about.
- Claude B does not adjudicate linguistic correctness.
- Small-batch execution, no unnecessary re-testing of previously-
  confirmed results — did NOT re-run the calf deletion or the Phase-1
  fish/student simulation-based checks from scratch; did re-run
  fish/student via the *real* runtime since that was the explicit,
  still-open Stage 2B evidence gap, not a repeat of prior work.

## Open items (unchanged unless noted)
1. **"GPT correct forms" doc** — still unresolved from prior session,
   still blocking on Owner input, not touched this session.
2. **NEW: pickPrimary verified-tie count discrepancy** (24 vs 25) —
   needs resolving before Stage 2C (§6) begins.
3. **Stage 2 Objectives C–F** (§6 verified-tie audit, §7 override-layer
   audit, §8 case-collision audit, §9 resurrection test, §10 full
   traces, §15 report, §18 handoff) — not started. §4 (both controls)
   and §5 (real build) are now closed; that's the batch for this
   session.
4. Both compromised PATs — still unrotated as of this doc.
5. Prior Phase-1 "open items for other roles" — unchanged, not mine,
   not re-verified this session.

## Exact next step for resume
1. `git fetch origin`, re-sync — do not assume `b7d4ec3` is still
   current; re-check for further concurrent Claude A commits.
2. Diff `docs/PICKPRIMARY_VERIFIED_TIES.md` against what Stage 1's
   report described to root-cause the 24→25 count change before
   starting §6.
3. Start Stage 2C (§6): per-key candidate/pickPrimary-precedence/
   compilation/runtime trace and classification
   (ENGINEERING-SAFE / ENGINEERING-AMBIGUOUS /
   LINGUISTIC-ADJUDICATION-REQUIRED / RUNTIME-MISMATCH /
   BUILD-MISMATCH) for each of the 25 (or reconciled count) tied keys.
   Do this in small batches, a few keys at a time — not all 25 at
   once.
4. Do not re-litigate the calf deletion, the Stage 2A controls, or the
   Stage 2B build validation — all closed this session with live
   evidence, not assumptions.
