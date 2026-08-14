# Claude B Session Migration — 2026-08-14 (session D, session close)

Resumed from `docs/CLAUDE_B_SESSION_MIGRATION_20260814_C.md`
(checkpoint `6786849`, via user-pasted filename reference + PAT).
Supersedes that doc.

## What was verified at resume

- **HEAD == origin/main, clean tree** at resume: `6786849`. Matched
  the prior migration doc's checkpoint exactly, plus one new commit
  since (`6786849` itself, Claude A: Migration Policy/Resume Policy
  Rules 9-10) — read, not conflicting with anything in flight.
- Full gate green at resume: `npm test` (203/203; lint needed
  `npm install` first — `npx eslint` alone was resolving to a
  mismatched global eslint 9 with no config; repo-pinned `npm run
  lint` against eslint 8 + `.eslintrc.json` is correct and passed
  clean), Check F 289 known/0 new, Check E 115 known/0 new, 11 raka
  candidates unchanged.

## Work done this session

### 1. Corrected stale Check F ledger rows (commit `82508cd`)
`docs/CHECK_F_GAP_REPORT_20260813.md`'s four rows for `always`/
`answer`/`a dog bit me`/`are you sleeping` still said "Not closed",
stale since NV-077 (`d28882b`) closed all four last session. Updated
each row to state the closure, cite the commit, and keep the prior
"Not closed" text as a **History** note for record rather than delete
it. Caught and fixed one drafting error before committing: my first
pass flagged `corrections.json["are you sleeping"]` as unconfirmed
against the new master value — direct read showed it already matched
(`Na·a tusiengama?`), so corrected that row to say so instead of
leaving a false flag.

### 2. Re-flagged `angry` raka-count placement for Claude A (commit `76163dc`)
NV-077 explicitly did not address this item from
`docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md` (confirmed by
NV-077's own commit message and by direct read: `master_dictionary
.json`'s `ka·o·nang·a` still three raka marks, `corrections.json`/
`translationEngine.test.js:569` still mirror it, Owner's flagged
`ka.onanga` spelling still unmatched by any live entry). Appended a
status-update section to the handoff doc itself (closing the loop on
the other three items, re-stating this one is still open, still
Claude A's linguistic call) and added a `next_action` pointer at the
**top** of `claude_a`'s WORKSTATE block so it's the first thing read
on resume per Rule 10, rather than buried in `current_task` prose.

### 3. Fixed Claude C's audit finding — `audit-counting-phrases.mjs` ordering bug (commit `8e614e0`)
Claude C's independent read-only audit (HEAD `73b7a8f`, pasted by the
user) found the script's own `files` array had
`master_dictionary.json` scanned *before* `garo_dictionary.json`, so
`garo_dictionary.json` (last-write-wins) silently overwrote master's
value in the script's internal bare-noun lookup — opposite of the
file's own comment ("master wins ties") and opposite of
`prepare-data.js`'s actual production master-preference logic.
Verified the concrete instance Claude C cited directly against the
data before touching anything: master's live `pen=kolom`
(VERIFIED/HIGH) was being overwritten by `garo_dictionary.json`'s
untagged legacy `pen=Pen` placeholder (that file's rows can't carry
SUPERSEDED tags at all), which is what produced the bogus `pen
ge·chet`-style candidates Claude C flagged.

Fix:
- Swapped `files` array order (`garo_dictionary.json` first,
  `master_dictionary.json` second).
- Extracted the merge logic into an exported, injectable
  `mergeBareNounIndex()` (and exported `isSuperseded()`) so it's
  unit-testable without touching disk; guarded `main()` behind an
  `import.meta.url` check so importing the module for tests doesn't
  trigger the full file-scan-and-write side effect.
- Added `tests/unit/audit-counting-phrases.test.js`: regression test
  on the exact `pen`/`kolom` case (both correct-order and
  wrong-order-as-bug-documentation), a SUPERSEDED-precedence check,
  and an `isSuperseded()` matcher check. 3 new tests, suite now
  206/206 (was 203/203).
- Regenerated `docs/COUNTING_PHRASE_AUDIT_20260810.md`: **368
  mismatches across 7 categories** (previously-committed version was a
  stale 253 undercounting real work; Claude C's own throwaway rerun
  was a bug-affected 367 with an extra bogus `ge` category from the
  `pen` corruption). This is the version Claude A should use.

This was engineering-file work throughout (script logic, test,
regenerated report) — no linguistic content in `master_dictionary
.json`/`corrections.json` was touched, consistent with Claude B's
remit.

### Rebase note
Pushing this commit hit real divergence: Claude A pushed `a1cd496`
("Session close: migration doc 2026-08-14D") concurrently, touching
`.ai/WORKSTATE.yaml` and a new migration doc — no file overlap with
this session's changes (`scripts/`, `tests/`, one `docs/` report).
`git rebase origin/main` was clean, zero conflicts. Full gate re-run
after rebase, still green, then pushed.

## What was NOT verified / not in scope

- Whether the 368 candidates in the regenerated
  `COUNTING_PHRASE_AUDIT_20260810.md` are themselves linguistically
  correct — that's Claude A / native-validation territory, this
  session only fixed the tool that generates the candidate list.
- Claude C's own audit conclusions in §1/§2/§4/§5 of their doc were
  read and cross-checked for currency (§5's item list is stale, now
  superseded by NV-077) but not independently re-audited from scratch.

## Governance decisions made this session

None novel — followed the existing Migration Policy (Rule 9)/Resume
Policy (Rule 10) framework, which was itself added by Claude A mid
last-session and read at this session's resume.

## Remaining engineering work

- Check F ledger: 289 known/allowlisted mismatches, only a handful
  investigated (`docs/CHECK_F_GAP_REPORT_20260813.md`). Bulk still
  open, multi-session.
- Placeholder audit: 115 known/allowlisted, none newly investigated
  this session.
- 11 raka-locality candidates (report-only), not yet triaged.
- The regenerated `COUNTING_PHRASE_AUDIT_20260810.md`'s 368 candidates
  need Claude A / native-speaker review, batched by classifier category
  as the report already groups them (`sak` 150, `mang` 88, `pang` 44,
  `rong` 27, `te` 22, `king` 22, `gong` 15).

## Remaining Claude A work

- `angry` raka-count placement (re-flagged this session, see above).
- `answer`'s remaining `UNVERIFIED/HIGH` variant family (`a·gan·chak·a`/
  `in·chak·a`/`ku·chak·a`) — NV-077 resolved the noun/verb split but
  didn't touch these.
- Native-speaker review of the regenerated counting-phrase candidates
  (368, see above).

## Remaining Claude C work

None flagged this session — their audit's actionable finding (§3) was
picked up and closed here.

## Exact next step

Nothing in-progress or mid-edit. Next Claude B session should resume
by:
1. `git fetch && git status` — check for further Claude A/C activity.
2. Re-run the full gate before touching anything (`npm test`,
   `npm run lint` — not bare `npx eslint`, use the repo-pinned
   version — and `node repository-intelligence.js`).
3. Check whether Claude A has acted on the `angry` raka flag or the
   regenerated counting-phrase report.
4. Continue the Check F ledger's next unresolved item, or pick up
   whichever of the above is still open.
