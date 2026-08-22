# Claude B Engineering Governance Model

Established 2026-08-22, Project Owner directive, following the Claude B
Role Self-Audit (chat, 2026-08-22). The audit's finding: one defect
class — pickPrimary/override precedence ambiguity — has been patched
narrowly at least 6 times since 2026-08-04 (`wait`, `salt`, `smile`,
the 9-key no-verified-candidate defect, `answer`, `king`) without the
class itself ever being closed. This document is the mandatory
operating model that prevents a 7th recurrence from being handled the
same way. It is to `.ai/SESSION_BOOTSTRAP.md` Rule 13 what
`docs/GRAMMAR_RULE_CATALOGUE.md` is to Claude A's linguistic rules —
Rule 13 is the pointer, this file is the protocol.

## 1. Defect class vs. instance

An **instance** is one wrong translation for one key (`king` →
"thin objects"). A **defect class** is the shared mechanism that
allows a whole shape of instance to occur (pickPrimary cannot
distinguish a genuinely-confirmed candidate from one that only looks
tagged the same way). Fixing an instance (`grammarOverrides['king'] =
'Raja'`) does not touch the class — the next miscategorized row
produces the next instance, indefinitely.

Two distinct subclasses are already live under this one root cause:

- **(a) VERIFIED-tie**: 2+ candidates equally tagged VERIFIED/HIGH,
  no signal to prefer one — resolved today by last-write-wins.
  Auto-enumerated on every build: `docs/PICKPRIMARY_VERIFIED_TIES.md`
  (16 keys as of this writing, including `answer` and `king`).
- **(b) No-verified-candidate**: a SUPERSEDED/OCR-flagged/mistagged
  row outranks the actual correct value because nothing structurally
  enforces the tag. Confirmed instances: `work`×2, `boil`, `build`,
  `close`, `empty`, `leg`, `outside`, `strong` (9 keys, `docs/
  CLAUDE_C_AUDIT_20260816.md` §2), plus `king`'s specific mechanism
  (misimported classifier-scope rows). **Gap: subclass (b) has no
  auto-generated enumeration file the way (a) does** — it exists only
  as narrative findings in dated audit docs. Closing this gap
  (a `prepare-data.js`-generated `docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`,
  same pattern as (a)) is the first concrete engineering action under
  this governance model, not yet built as of 2026-08-22.

## 2. Mandatory: architectural investigation before another override

**Rule.** Before adding any entry to `grammarOverrides`,
`corrections.json`, or any equivalent per-key exception mechanism:

1. Check whether the failure's *mechanism* — not just the word —
   matches an existing entry in the table in §4 below.
2. **If it does not match anything open or closed in §4**: this is a
   genuinely new mechanism. Add the override as usual, and add a new
   §4 row (status `OPEN`, one instance) so the next occurrence has
   something to match against.
3. **If it matches an already-`OPEN` §4 row**: adding another override
   is not enough by itself. The override may still ship as an
   immediate stopgap (regressions matter more than process purity),
   but the same commit must also either (a) advance the architectural
   fix, or (b) if not advancing it this session, explicitly say why
   not and update the §4 row's instance count and evidence. A second
   occurrence of the same mechanism with no movement on the class fix
   is the trigger this rule exists to catch — silence is not allowed
   here.
4. **If it matches a §4 row already marked `CLOSED`**: this is a
   regression of a supposedly-fixed class, not a new instance — treat
   it as higher priority than a fresh bug, and reopen the row.

## 3. Closing the A→B→runtime gap

Every Claude B session, for anything touching translation output,
runs this trace — not "tests pass," the actual chain:

1. **Source → compiled**: for any key involved this session, read
   `master_dictionary.json`'s row directly (not its summary in a
   doc) and confirm `compiled_dict.json`'s value for that key matches
   what the row's tag says it should.
2. **Compiled → override**: check both `grammarOverrides` (in
   `prepare-data.js`) and `corrections.json` for the same key. If
   either masks the compiled value, confirm *why* — cite the
   root-cause doc, don't assume a mask is still valid just because it
   exists. A mask with no live citation is itself a finding (stale
   override, §5).
3. **Override → runtime**: call `translate()` directly (not `grep`,
   not a doc claim) for the exact form in question and record the
   actual output, method, and confidence returned.
4. **Report the trace, not just the endpoint**: a migration document
   or audit claiming a key is "fixed" must show what step 1–3 each
   returned, not just step 3's final answer — this is what let
   `answer` look fine at runtime while masking a live unresolved tie
   underneath.

This trace is mandatory for: every key named in a Claude C handoff,
every key touched by a `grammarOverrides`/`corrections.json` edit, and
a random sample of at least 5 keys from `docs/
PICKPRIMARY_VERIFIED_TIES.md` each session where that file is
non-empty, even if none of those 5 were the session's focus — so
regressions in the tie list itself don't go unnoticed between the
sessions that happen to touch it directly.

## 4. Open architectural investigations

| ID | Mechanism | Subclass | Status | Instances (cumulative) | Proposed fix |
|---|---|---|---|---|---|
| AI-001 | pickPrimary cannot distinguish genuinely-confirmed tag from a same-shaped free-text caveat / mistagged row | (a) tie, (b) no-verified-candidate | **OPEN — schema migrated, cutover not done** | `wait`, `salt`, `smile`, work×2/boil/build/close/empty/leg/outside/strong (9), `answer`, `king` — 14+ named, 16 more enumerated in PICKPRIMARY_VERIFIED_TIES.md not yet individually triaged | `confidence`/`confidence_source` schema on `master_dictionary.json` rows (designed 2026-08-04, `docs/MILESTONE_2026-08-11.md` Phase 1 — steps 1-2 done 2026-08-22 per `docs/PROPOSAL_CONFIDENCE_SCHEMA_20260822.md`: all 9,791 rows classified, 335 left unresolved for Claude A (step 3), `prepare-data.js` cutover (step 4) not yet done — regex parsing of `notes` is still what ships) |

New rows are added here, never silently folded into an existing one
unless the mechanism genuinely matches (§2 step 1). This table is
hand-maintained (unlike §1's auto-generated enumeration files) because
"is this the same mechanism" is an engineering judgment call, not a
mechanical pattern match.

## 5. Claude C: verifying class closure, not instance closure

When AI-001 (or any future row) moves from `OPEN` toward `CLOSED`,
Claude C's audit must do more than re-check the named examples:

1. **Regenerate the auto-enumerated artifacts** (`docs/
   PICKPRIMARY_VERIFIED_TIES.md`, and the subclass-(b) equivalent once
   built per §1) fresh, post-fix.
2. **Count, don't sample.** Report: total instances the pattern
   matched before the fix, how many are now resolved (no longer
   appear in the regenerated file, or appear with a principled
   resolution rather than last-write-wins), how many remain and
   specifically why (e.g. genuinely irreducible, needs Claude A
   input, deliberately deferred).
3. **A single fixed example is not evidence of class closure.** `king`
   translating correctly again is instance-level evidence only. Class
   closure requires the count from step 2, cited by number
   (e.g. "16/16 ties in the pre-fix `PICKPRIMARY_VERIFIED_TIES.md`
   snapshot now resolve to a single principled candidate; 0 remain
   last-write-wins").
4. **Only after that count-based report can the §4 row be marked
   `CLOSED`** in this document — Claude C reports the count, whoever
   has push access that session (A or B) updates the row, same
   division of labor as C's existing closure protocol elsewhere in
   this repo.
