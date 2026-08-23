# Claude A Session Migration Document — 2026-08-23B

## Resume instructions for the next Claude A

1. Resume per `.ai/SESSION_BOOTSTRAP.md` Rule 10: fetch, verify HEAD,
   confirm clean tree, read `.ai/WORKSTATE.yaml` and this doc before
   starting any work.
2. Final HEAD this session: **598bea2**. `origin/main` matches at
   session close — verified via `git fetch` + `git rev-parse` equality
   check.

## Context

Project Owner pasted a 16-item "new validated data" batch (goat,
gossip, happy, help, home, hot, how, hurry, if, knowledge, land, lead,
live, living, log, look) with an instruction to "eliminate all old
ones." Checked against `master_dictionary.json`: **all 16 were
already VERIFIED/HIGH**, added in the NV-092/NV-093 batches that
closed in the immediately-prior session (20260823). Nothing new to
validate — no native judgment call was made this session.

Declined the "eliminate all old" framing as written: superseded/
unverified alt rows are retained per this project's citation
discipline (never deleted), and they don't affect compile output
since VERIFIED/HIGH already wins. Deleting them would violate a
standing rule, not fix anything live.

## Completed work this session

- **Rule 8 fix**: `corrections.json`'s `"gossip"` value was
  `a·gan·jo·jo·na` — the pre-simplification spelling, predating
  NV-089's VERIFIED/HIGH `aganjojoa` ("simplified spelling" note).
  Clean case: the override mirrored old data for the same NV item,
  not an independent third form. Fixed directly, verified live via
  `translate()`.
- **Push collision** with a concurrent Claude B session (item 3,
  sov-assembly plural-drop/adjective-stranding fix, commits
  `86b9016`/`bbf78f9`, no key overlap). Rebased, rebuilt `dist/`,
  re-ran full gate, re-verified the gossip fix live post-rebase,
  pushed clean.

## Verification

- `npm run build`: 220/220 unit tests, vite build clean, before and
  after the rebase.
- `gossip` spot-checked live via `translate()`, not just
  `compiled_dict.json` inspection.

## Runtime Handoff (Rule 6) — 2 new gaps found, NOT fixed (need judgment)

While live-verifying the 16-item batch, found 2 more standalone keys
where the runtime value doesn't match the VERIFIED master data,
neither a clean Rule-8 case:

1. **`help`** — `phrase_maps.js` ships `'help': 'Betoi'`. `Betoi`
   does not appear anywhere in `master_dictionary.json` — zero
   citation, dates to the original June 2026 unannotated import.
   Meanwhile two VERIFIED/HIGH senses now exist from NV-093:
   `help (noun)` = `dakchakani`, `help (verb)` = `dakchaka`. Not
   force-fixed: picking which sense the bare `help` key should
   default to is a judgment call, not a stale-data mirror.
2. **`log`** — `corrections.json` ships `'log': 'dot'`, from a
   July 2 commit establishing `dot` as the **counting classifier**
   for logs (`"a log": "dot dotsa"`, parallel to `pang` for trees).
   `boltong` is the VERIFIED/HIGH standalone noun (NV-089). Whether
   the bare `log` key should resolve to the noun (`boltong`) or the
   classifier stem (`dot`) needs a decision — not obviously wrong
   either way, flagging rather than guessing.

Both are new findings this session, not carried over from the prior
migration doc.

## Open items carried forward (unchanged from 20260823A, not touched this session)

Same priority list as `docs/CLAUDE_A_SESSION_MIGRATION_20260823.md`:
yes=Oe/Am/Hoe; they-are-working / it-is-not-good reconciliation;
i-understand / lets-drink-eat / skenga-sikenga / i-want-to-work-root;
Claude B's 336-row confidence-schema step 3; sit/stay; 10 pre-existing
duplicate rows. See that doc for full detail — none of these were in
scope this session.

## Standing rules referenced this session

- Rule 8 (fix clean stale overrides directly; flag independent-form
  or judgment-call cases instead of force-fixing).
- Rule 9a / Rule 10 (resume + pre-flight sequence).
- Multi-Claude push collision protocol (fetch, compare, rebase,
  rebuild, re-test, push).
- Project Owner authority vs. native evidence: declined the
  "eliminate all old" instruction since the underlying data was
  already correctly VERIFIED and superseded rows are retained by
  design, not by oversight.

Session closed clean. `git status` empty, `HEAD == origin/main ==
598bea2` verified by direct comparison.
