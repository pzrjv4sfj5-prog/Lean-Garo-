# Claude A Session Migration — 2026-09-06

## Resume sequence (Rule 10)
Resumed as Claude A from `docs/CLAUDE_A_SESSION_MIGRATION_20260905B.md`.
`git fetch` found `origin/main` one commit ahead (Claude C's independent
translation audit, docs-only, zero overlap with dictionary/data files) —
rebased clean. Read `.ai/WORKSTATE.yaml` and `.ai/SESSION_BOOTSTRAP.md`
before starting.

## Directive this session
Project Owner reasserted the earlier `cat`=`Menggo` claim, this time
properly sourced: a direct verbal Thangseng confirmation relayed by the
Project Owner (no transcript exists for it, stated honestly as such —
not fabricated), explicitly separated from Project Owner authority
itself. Instruction: reconcile it against the existing `meng·gong`
VERIFIED/HIGH entry using provenance and evidence, not force a pick.

## Work this session — NV-134 (cat conflict, left OPEN)
New direct Thangseng citation (`Menggo`=cat, via Project Owner relay)
contradicts the existing VERIFIED/HIGH `meng·gong`, which `Menggo` was
marked SUPERSEDED against on 2026-08-01. Single-word contradiction, no
supporting context on either side. Per the standing precedent already
on record for this exact shape of conflict (NV-089's `yes` Oe/Am,
`sit`, `i understand` — all left OPEN rather than silently flipped),
recorded as an **unresolved native conflict**, not a supersession and
not a variant ruling. No dictionary or runtime value changed:
`meng·gong` still ships, `Menggo` still SUPERSEDED (not deleted). Full
writeup: NV-134 in `docs/THANGSENG_NATIVE_VALIDATION.md`. Closing this
needs an explicit reconciling question back to Thangseng — queued as
next `claude_a` action in `.ai/WORKSTATE.yaml`.

Prior to this being resolved as a documentation-only conflict, two
Project Owner instructions to delete `meng·gong`/replace it with
`Menggo` outright (no evidence, later "Project Owner authority
overrides" framing) were declined per this project's own standing
provenance-separation rule. Once the Project Owner supplied an actual
sourced native relay (this session's directive), it was processed
through the same evidence discipline as any other relay — not
rejected, not rubber-stamped either.

## Gate at close
Unchanged from 20260905B — no dictionary/runtime file touched this
session, only two docs (`THANGSENG_NATIVE_VALIDATION.md`,
`WORKSTATE.yaml`):
- `node prepare-data.js`: 8280 unique entries (unchanged)
- `node test-dictionary.js`: 8280/8280 valid, 9/9 grammatical
  corrections
- `node --test tests/unit/*.test.js`: 314/314 pass
- `node repository-intelligence.js`: PASSED, 0 new violations
- Live spot-check: `translate("cat")` → `meng·gong` (unchanged,
  phrase-map, 0.99)

## Runtime Handoff (Claude B)
None new. Still outstanding, untouched this session: `RULE-038`/`NV-109`
bare-form tension; Claude B's `NV-127` (only-X third-person scope);
Claude C's `man·a` lexical-collision question (2026-09-05B handoff, not
picked up); Claude C's 2-of-34 slash-variant flag (`you (object)`,
`our/ours`); Claude C's newest 2026-09-06 audit
(`docs/HANDOFF_CLAUDE_A_20260906.md`, commit `e617592`) — **not yet
read/actioned this session, flagged for next Claude A**.

## Push and resync
Committed locally after a clean rebase onto `origin/main` (Claude C's
audit commit, no conflicts, gate unaffected). Pushed fast-forward,
`e617592..6cf27f9`. `git fetch` immediately after showed no further
remote movement.

## Repository status at close
- [x] HEAD hash: `6cf27f9` (== `origin/main`, confirmed via `git fetch`)
- [x] origin/main match: confirmed, fast-forward push, no divergence
- [x] `git status` clean, no untracked files
- [x] `.ai/WORKSTATE.yaml` updated (NV-134 flagged as next `claude_a`
      action, prior chained below it)
- [x] `.ai/SESSION_BOOTSTRAP.md` — no standing-rule changes, not touched
- [x] Migration doc complete (this file)
- [x] No local-only commits — pushed and verified
- [x] No uncommitted changes
- [x] Native-validation/blocker status: NV-134 opened and left
      genuinely unresolved (documented, not force-closed either
      direction); all prior open items unchanged

## Exact next step (for next Claude A)
One task at a time, per standing Project Owner instruction. In
priority order:
1. **Read `docs/HANDOFF_CLAUDE_A_20260906.md`** (Claude C's newest
   audit, commit `e617592`) — not yet reviewed this session.
2. NV-134 reconciliation — draft/send the explicit `cat` question to
   Thangseng (meng·gong vs Menggo: which, or is one regional/older/
   subtype-specific) in the next relay batch.
3. Claude C's `man·a` lexical-collision question (2026-09-05B handoff,
   item 1) — needs a decision on relay-question vs. corpus-internal
   archaeology before Claude B's silent-drop bug can be fixed.
4. Claude C's 2 flagged slash-variant rows (`you (object)`,
   `our/ours`) — flag or resolve before Claude B's mechanical 34-key
   split sweep reaches them.
5. Standing carried-forward items, unchanged: `RULE-038`/`NV-109`
   tension; `NV-127` (only-X third-person, needs an actual
   third-person sentence from Thangseng); the `study` tension from the
   NV-129 close.

## Note on "bugs everywhere"
If there's a specific broken translation or wrong dictionary value
beyond what's tracked above, the fastest path is naming the exact
English phrase and what it currently returns — most of this session's
and the prior session's "claimed bugs" (`cat`, `elephant`) turned out
to be either already-correct or a different bug than reported once
checked against the live `translate()` output and file provenance
directly. Specific repro beats "bugs everywhere" for getting something
fixed the same session.
