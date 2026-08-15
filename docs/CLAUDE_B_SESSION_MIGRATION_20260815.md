# Claude B Session Migration — 2026-08-15 (QA-sync / verification session)

Resumed from `docs/CLAUDE_B_SESSION_MIGRATION_20260814_E.md` (checkpoint
`216ee46`, via user-pasted filename reference + PAT). This session did
**no engineering or linguistic edits of its own** — it verified Claude
C's first audit report, found and documented one methodology error in
it, confirmed a concurrent Claude A commit had already independently
and correctly resolved the audit's main mechanical finding, and
surfaced one new bug in the course of live-testing that neither prior
session had caught. **Final pushed commit: see "Commits this session"
below.**

## What was verified at resume

- `git fetch origin` found two commits ahead of the checkpoint:
  `bbd3b3f` (Claude A, `student` bare-noun root fix, `Chattro`) and
  `922ef9d` (Claude A, committing Claude C's first audit report,
  `docs/CLAUDE_C_AUDIT_20260815.md`, plus `WORKSTATE.yaml`/
  `SESSION_BOOTSTRAP.md` wiring for the new Claude C role). Rebased
  clean, fast-forward, zero conflicts.
- Mid-session, a further fetch found `1ccac8c` (Claude A, mechanical
  resync of 85 stale `corrections.json`/`phrase_maps.js` keys per the
  audit's own §3.2/§3.4). Pulled clean via fast-forward.

## Source of this session's task

Project Owner asked directly, in-session chat, to check the Claude C
audit report's content and sync status — not a committed task file.

## Work done this session

### 1. Verified the Claude C audit report's core claim, live

Re-executed `translate()` calls (not just read the report's JSON
table) for the report's key claims: `student`'s bare-noun root gap
(closed since by `bbd3b3f`), the exact-phrase/classifier precedence
fix, and the SUPERSEDED-only-candidate filtering — all confirmed
correct and live, matching the report.

### 2. Found and documented a false positive in the audit's §3.2 sample table

The report's 37-word sample table lists `answer` → `Aganchaka` as
matching an explicitly-`SUPERSEDED` `master_dictionary.json` candidate
for that key, with `Aganchakani` as the unused `VERIFIED` alternative.
Checked directly: `master_dictionary.json`'s actual `answer`
(lowercase) key is **`VERIFIED/HIGH` via NV-077**
(2026-08-14, Project Owner direct native relay — "answer: noun
Aganchakani / verb Aganchaka" — explicitly reverses the original
2026-08-01 audit's SUPERSEDED tag on this word). The SUPERSEDED tag
the report's script actually matched against belongs to a *different*
key, `"To answer"` (capitalized), which happens to carry the same
garo string (`Aganchaka`) coincidentally. Confirmed the adjacent
`food` row by contrast is a genuine match (same key both directions).

This looks like a case/key-normalization gap in how the audit script
compared override values against source candidates for a given key —
not a wholesale methodology failure (only this one row checked out as
wrong in spot-checking), but worth tightening before the same script
is reused on the remaining ~249-entry baseline. Documented in
`.ai/WORKSTATE.yaml`'s `claude_c.next_action` block as an addendum,
not as an edit to Claude C's own report — Claude C has no write
access and the report is written in its voice; silently editing it
would misrepresent what Claude C actually found.

### 3. Confirmed Claude A had already independently resolved the mechanical finding at scale

Commit `1ccac8c` (pulled mid-session) resynced 85 stale override keys
using a stricter per-key check than the audit's own table (requires
`compiled_dict.json`'s live value to itself be non-SUPERSEDED/
non-UNVERIFIED/non-OCR-flagged before resyncing to it) — this
independently and correctly excluded `answer` from the resync too,
for a related but distinct reason: see next finding.

### 4. New finding, this session's own: pickPrimary defect upstream of the override tables

Live-tested `work` and `answer` directly against `compiled_dict.json`
and `master_dictionary.json`:

```
compiled_dict.json['work']   = 'Kam'            ([OCR-flagged, high confidence])
master_dictionary.json 'Work' = 'ga·a'           (variant/VERIFIED/HIGH)
master_dictionary.json 'Work' = 'ka·a'           (variant/VERIFIED/HIGH)

compiled_dict.json['answer'] = 'a·gan·chak·a'    (UNVERIFIED)
master_dictionary.json 'answer' = 'Aganchaka'    (VERIFIED/HIGH, NV-077)
```

`prepare-data.js`'s `pickPrimary` is selecting an OCR-flagged or
UNVERIFIED candidate over a plain VERIFIED one for the same key, for
at least these two words. This is **upstream of and distinct from**
the override-table staleness Claude A's `1ccac8c` already fixed — it
means `compiled_dict.json` itself can ship the wrong value even when
a correct VERIFIED master entry exists, with no override table
involved at all.

Live-cascade impact differs by word:
- **`answer`** — currently masked. `corrections.json`'s override
  (`Aganchaka`) happens to independently hold the correct value, so
  `translate('answer')` returns the right thing today, but only by
  coincidence of the override layer, not because the underlying
  defect is fixed.
- **`work`** — **not masked, live-broken**. `corrections.json`'s own
  `work` override is itself the original 2026-08-01-superseded value
  (`Daka`) — correctly left untouched by `1ccac8c`'s resync script,
  since `compiled_dict.json`'s `work` value (`Kam`) wasn't a safe
  resync target either. `translate('work')` returns `Daka` today, and
  there is currently **no correct value anywhere in the runtime
  cascade** for this key.

Flagged, not fixed, this session — needs a scoped sweep (same shape as
the 2026-08-14 SUPERSEDED-only-candidate fix: mechanical to *find*,
but the precedence-rule design in `pickPrimary` needs care, not a
blind swap) plus a check for how many other keys this affects beyond
these two. See `.ai/WORKSTATE.yaml`'s `claude_b.pending_next_session`.

## Verification (per Governance Rules 7–8: scope stated explicitly, not just result)

**What WAS verified, this session, against the final pushed state:**
- `node prepare-data.js` re-run: byte-identical output (8132 unique
  entries, 190 held, confirmed via `git status --short` showing no
  diff afterward).
- `node test-dictionary.js`: **8132/8132** valid.
- `npm install` run to restore a missing local `eslint` binary
  (sandbox-environment gap only — `package.json`/lockfile unchanged,
  not a repository defect) — `npm run lint`: 0 errors, 0 warnings.
- `node --test tests/unit/*.test.js`: **215/215**.
- `npx vite build`: clean.
- `node repository-intelligence.js`: PASSED, **0 NEW violations** all
  checks (Check F: 203 known/allowlisted, 0 new — down from 334 at
  session start via `1ccac8c`'s resync, further reflecting this
  session's own re-run against the fully-pulled state).
- Live `translate()` smoke-test (not source-reading) for 10
  representative keys — `work`, `sleep`, `food`, `teacher`, `angry`,
  `i am angry`, `answer`, `twenty student`, `twenty students`,
  `student` — spanning resynced words, the held angry-phrase question
  (confirmed unchanged), and the newly-surfaced pickPrimary gap. No
  exceptions, no malformed/empty responses; confirms the `work` defect
  above is live and real, not just visible in source JSON.
- `git status` clean throughout; `HEAD == origin/main` (or a clean
  fast-forward ahead of it) confirmed at each fetch point and again at
  final push.

**What was NOT verified / explicitly out of scope this session:**
- The pickPrimary/OCR-flagged defect's full scope — only `work` and
  `answer` were confirmed; whether other keys are similarly affected
  was not swept.
- No attempt was made to fix `pickPrimary`, resync `work`'s override,
  or touch any dictionary source file — this session made zero edits
  to `master_dictionary.json`, `garo_dictionary.json`,
  `corrections.json`, `phrase_maps.js`, or any engine file. All
  changes this session are docs-only (`WORKSTATE.yaml`,
  `SESSION_BOOTSTRAP.md` if applicable, this migration doc).
- The audit report's remaining ~249-entry baseline was not
  independently re-verified beyond the `answer`/`food` spot-check
  above — the false-positive finding is reported as a single
  confirmed instance, not assumed to generalize.

## Commits this session

1. (this commit) — docs-only: `.ai/WORKSTATE.yaml` (new `repository`
   history entry, `claude_b` and `claude_c` block updates), this
   migration doc. No code/test/dictionary content changed.

## Pending for next session

**Reconciliation note added post-rebase:** two commits landed on
`origin/main` after this section was originally drafted —
`888c61a` (Claude A's own session-close, which independently found the
*same* pickPrimary defect class at fuller scope: 9 keys, not the 2
this session spot-checked) and `96de20d` (Claude C's follow-up audit,
which pins the exact mechanism behind `answer` specifically: a
lowercasing collapse creates a genuine 2-way `VERIFIED` tie between
`Aganchaka`/`Aganchakani` that `pickPrimary`'s tie-break declines to
resolve, distinct from the 9-key no-verified-candidate bucket). Their
accounts are more precise than the "OCR-flagged/UNVERIFIED" framing
below and should be treated as authoritative for next session; see
`.ai/WORKSTATE.yaml`'s `claude_a.next_action` and
`claude_c.next_action` for the reconciled, correct framing and
sequencing. This session's own contribution stands: independently
confirming the defect live via `translate()` (not just source-reading)
before either of those landed, and the `answer`-row audit-table
correction below, which neither of those commits addresses.

1. **pickPrimary OCR-flagged/UNVERIFIED precedence defect** —
   Claude B's lane, mechanical to find, needs careful design to fix
   (same category as the 2026-08-14 SUPERSEDED-only-candidate
   precedent). `work` is live-broken now; scope beyond `work`/`answer`
   unknown.
2. **Claude C audit script key-matching gap** — flagged for a future
   Claude C session, not urgent (didn't change the report's overall
   conclusion), but should be fixed before the same script is reused
   on the remaining allowlist.
3. Standing open items, unchanged, not re-investigated this session:
   `phrase_maps.js` "angry" phrase (held, needs native input, Claude
   A's channel); house/rice/water/food counting (~76 keys); person/
   student/teacher 111-candidate root conflict.
