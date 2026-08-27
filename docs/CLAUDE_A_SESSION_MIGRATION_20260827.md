# Claude A Session Migration — 2026-08-27

**Status: task complete, clean close.** Resumed via user-pasted
`docs/CLAUDE_A_SESSION_MIGRATION_20260826.md`. Resolved item 1 of that
doc's pending-work queue (the NV-093 parenthetical-key pattern) plus
items 3–4 (bring/cooked cross-checks, folded in as part of the same
investigation). Items 2, 5–10 remain open, see below.

## What this session did

### Item 1: NV-093 parenthetical-key pattern — RESOLVED

Traced each parenthetical row NV-093 (commit `9ef4603`, 2026-08-23) added
against `docs/THANGSENG_RELAY_BATCH_20260820.md`'s exact original wording.
For the 4 items that were actually open relay-batch entries (begin,
bland, bye, coming — items 4/5/9/16), the parenthetical key's value is
**word-for-word the value the relay batch itself proposed and asked
"correct?"** — not a distinct sense, just filed under an annotated key
instead of the bare one.

- `begin` → `a'bachengna`, new VERIFIED/HIGH row. Coexists with unverified
  bare-root `a·ba·cheng·a` — not rejected, not superseded.
- `bland` → `Chibroka`, new VERIFIED/HIGH row. Supersedes the stale
  `chi·brek·a`/`·brok·` candidates it directly confirms.
- `bye`/`Bye` → `De`, promoted AMBIGUOUS/HIGH → VERIFIED/HIGH. Explicit
  POS/sense default stated per `CLAUDE_A_OPERATING_GOVERNANCE.md` §10
  (see below) — `Bai`/`Ra` remain unresolved variants, neither confirmed
  nor rejected. Superseded the imprecise bundled lowercase
  `"De / Ra / Bai"` row.
- `coming` → `re·baenga`, new VERIFIED/HIGH row. Coexists with
  differently-spelled unverified `Re·baengjok` — not rejected.

**Duplicate-representation check (§7):** `corrections.json`/
`phrase_maps.js` already served these exact 4 values before this
session's edit — confirmed via live `translate()` calls, not assumed.
Zero runtime change. This was pure citation-hygiene: the linguistic fact
was already correctly shipping, `master_dictionary.json` just hadn't
been updated to reflect it under the bare key.

**POS/sense governance statement (§10), key "bye"/"Bye":**
```
Sense A: De  — interjection, VERIFIED/HIGH (relay item 9, NV-093)
Sense B: Bai — interjection, variant/AMBIGUOUS/HIGH, unconfirmed
Sense C: Ra  — interjection, variant/AMBIGUOUS/HIGH, unconfirmed
Default for bare key: A (De)
Reasoning: De is the only one of the three the relay batch explicitly
  asked about and got a native "correct" on. Native's own phrasing
  ("just an expression") doesn't reject Bai/Ra, so they stay recorded,
  just not promoted without their own confirmation.
```

### Items 3–4: `bring` / `cooked` parenthetical cross-checks — CONFIRMED, no action

- `bring (imperative)` = `ra·babo` is a distinct construction (imperative
  suffix `-bo`) from bare `bring` = `ra·ba·a` (NV-089, already shipping
  correctly) — not a contradiction, no fix needed.
- `cooked (past-tense verb, 'I cooked')` = `Song·aha` matches the
  already-shipping NV-095 value exactly — no fix needed.

### Not touched this session (out of scope, correctly deferred)

The 7 other parenthetical rows from the same NV-093 commit (`dance`,
`eaten`, `happy`, `how`, `knowledge`, `live`, `living`) were never part
of the 149-item relay batch (not flagged open) — left untouched per the
prior session's own scoping, unless they surface elsewhere.

## Rule-generalization check (§5)

No new or updated grammar rule this session — this was a citation/
classification-hygiene task (class D, per the §4 framework: stale/
duplicate source-data representation), not a new linguistic fact or a
productive pattern. Correctly not forced into a rule. This is the first
session since NV-096/RULE-046 (2026-08-23) with zero rule-catalogue
activity; not yet at the 3-consecutive-session drift-check threshold
(§5), not flagged.

## Runtime Handoff

**Scope of this session's verification:** all 4 touched keys (`begin`,
`bland`, `bye`/`Bye`, `coming`) verified via live `translate()` calls
before and treated as ground truth for the "already correct" conclusion
— not inferred from `compiled_dict.json` or `master_dictionary.json`
tags alone.

**What A has verified:** `master_dictionary.json` now correctly reflects,
under the bare keys, what `corrections.json`/`phrase_maps.js` already
ship. No `corrections.json`/`phrase_maps.js`/`compiled_dict.json` edits
were needed — confirmed, not assumed.

**What A has NOT verified:** the pre-existing `cooked` pickPrimary tie
(`min·a` vs `Song·aha`, both now regex-matching as VERIFIED via the
notes-text-prefix pattern regardless of the `confidence` field) was
noticed during this session's gate run but **predates this session**
(confirmed via `git stash` baseline diff — identical tie present before
any of this session's edits) and ships the correct value anyway via
`corrections.json`'s override. Not fixed, not this session's task — see
Item 10 note below for the general class this belongs to.

**Build/test gate:** 247/247 unit tests, `npm run` prepare-data.js +
test-dictionary.js (8185/8185 valid, 8/9 grammatical corrections —
unchanged from pre-session baseline, confirmed via `git stash`) +
repository-intelligence.js (0 new violations, all checks A–G) — verified
both pre-rebase and post-rebase (this session rebased cleanly onto
Claude B's concurrent doc-only `bd8a966`, zero file overlap).

## Rework-prevention checklist (§12)

- Already resolved before? No — checked `THANGSENG_NATIVE_VALIDATION.md`
  NV-093 and the prior migration doc, this was explicitly left open by
  the prior session, not re-litigating a closed item.
- Another representation still hold the old value? No — checked and
  confirmed `corrections.json`/`phrase_maps.js` already correct.
- Runtime problem, not linguistic? No — confirmed linguistic/citation
  only, zero runtime behavior change.
- Should generalize into a rule? No — see Rule-generalization check
  above, genuinely a one-off citation-hygiene fix ×4.
- Asking for native confirmation of something already established? N/A
  — no new relay made this session.
- Deriving something not yet established? No — every value applied was
  itself the product of a prior direct native confirmation (NV-093),
  not derived/guessed.
- Enough info for Claude B? N/A — no engineering handoff this session
  (zero runtime change, nothing to propagate).

## Resume Protocol (next Claude A session — read this first)

1. Read `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` in full (standing rule).
2. Rule 10 resume sequence: `git fetch origin`; compare HEAD against
   `.ai/WORKSTATE.yaml`'s `repository.head`; `git log <head>..HEAD
   --oneline`, read in full anything touching `master_dictionary.json`,
   `corrections.json`, or `phrase_maps.js`.
3. Continue the 2026-08-26 queue at **item 2**: recalculate the true
   LINGUISTICALLY OPEN count for the 149-item relay batch now that item 1
   is closed (fold this session's 4 resolutions into the accounting
   table in `docs/CLAUDE_A_SESSION_MIGRATION_20260826.md`).
4. Item 5 (`go` — genuinely open) and item 6 (`only` — needs commit
   archaeology) are next after that, unchanged from the 2026-08-26 doc.
5. Item 7 (`i don't know` citation formalization) is a quick close-out,
   same doc.
6. Item 8: once 2–7 settle, assemble and actually send the corrected
   relay batch to Tridip → Thangseng (still not sent, only classified).
7. Item 10 (pickPrimary verified-ties backlog, space-before-`ma` sweep):
   Claude B territory, unchanged. Worth flagging to Claude B as a
   possible new instance of the AI-001 class: the `cooked` tie noted
   above stays "resolved" (ships correctly) only because of a
   `corrections.json` override — same masking pattern as the historical
   `answer` tie. Not urgent, no live bug.

Full itemized pending-work detail (items 2, 5–10) is unchanged from
`docs/CLAUDE_A_SESSION_MIGRATION_20260826.md`'s "Next Session — Pending
Work" section — not re-copied here, read that doc's item numbers 2,
5–10 directly.

## Repository status at close

- HEAD: `e6c44c5` (rebased commit; parent `bd8a966` = Claude B's
  concurrent doc-only close).
- `origin/main` match: to be verified via `git fetch` + `git rev-parse
  origin/main` immediately before push, same step as the push itself.
- `git status`: clean immediately before this migration commit.
- `.ai/WORKSTATE.yaml`: updated this commit (see diff).
- This migration doc: complete.
- No local-only commits: pushed in the same step as creation.
- No uncommitted changes at close.
- Native-validation/blocker status: no open blocker from this session's
  own work. Broader relay-batch queue (items 2, 5–10 above) remains
  open, unblocked, ready for the next session.
