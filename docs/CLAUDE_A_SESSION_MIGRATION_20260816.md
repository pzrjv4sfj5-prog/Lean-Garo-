# Claude A — Session Migration Document — 2026-08-16

## Resume protocol followed
Resumed via `docs/CLAUDE_A_SESSION_MIGRATION_20260815C.md` (pasted filename)
+ live PAT. Re-synced first: `git fetch` found HEAD `061b0f2` — 3 commits
ahead of the pasted doc's own checkpoint (`ef8a742` closed cleanly at
`cb53f1c`, then `e9a9fcf`/`cc311e4` Claude C re-audit, `061b0f2` Claude C
lost-session flag). Reviewed all 3 — Claude C re-audit confirmed the
prior session's SUPERSEDED tag correct with zero drift, then flagged
that an intervening Claude B session's claimed pickPrimary work never
reached `origin/main` (verified twice) and does not exist anywhere.
Zero file overlap with Claude A's lane. Clean tree, `origin/main`
matched exactly.

## What was done this session
Project Owner gave native reconfirmation + four items in one message.
Handled as one scoped session (all four items are the same native-input
event and touch the same corpus):

**1. Answer POS/raka cluster (primary ask)** — PO reconfirmed NV-077
directly: Aganchakani=noun, Aganchaka=verb, no raka dot in either. Found
and fixed 7 uncited/mistagged rows contradicting this:
- `master_dictionary.json["Answer"]→"in·chak·a"` and `→"ku·chak·a"`
  (idx 3114/3115): bare `variant/VERIFIED/HIGH` tags, no date/citation,
  never native-confirmed. These were sitting in the same
  case-insensitive `answer`/`Answer` pickPrimary pool as
  Aganchaka/Aganchakani and were the actual source of the wrong
  `ku·chak·a` runtime value flagged by Claude C's audits. SUPERSEDED,
  citing this session's reconfirmation.
- `"To answer"→"a·gan·chak·na"` (idx 6933, was VERIFIED/HIGH/doc7):
  legacy syllable-fragmented import with raka dots, contradicts the
  no-raka confirmation. SUPERSEDED.
- `"To answer"→"Aganchaka"` (idx 7647, was SUPERSEDED only because it
  lost to 6933): promoted to VERIFIED/HIGH now that its blocker is gone.
- `"An answer"/"a reply"/"a respond"/"a rejoinder."→"Aganchaka"` (idx
  7652–7655, all tagged pos `"n."`): legacy doc7 import mislabeling
  Aganchaka as a noun. NV-077 confirms Aganchaka is verb-only.
  SUPERSEDED (not relabeled in place — no native confirmation exists
  for these specific English glosses as standalone words, so no
  replacement value asserted).

Net effect: the pool for `answer`/`Answer` went from a noisy 4-way tie
to a clean, correctly-diagnosed 2-way POS tie (Aganchaka verb / idx 411,
Aganchakani noun / idx 3113). Did NOT implement a tie-break —
that's pickPrimary/engine code, Claude B's lane. `compiled_dict.json`
now resolves `answer`→`Aganchakani` (previously `ku·chak·a`, which had
zero legitimate citation).

**2. Usage-case examples** — added cross-reference notes to the two
existing sentence-level examples rather than fabricating new ones:
idx 944 (`"answer the question"`→`"Sing·ani·ko aganchaka·bo"`) now
annotated as the verb-sense usage example; idx 1008
(`"what will be the answer?"`→`"Aganchakani·ara mai ong·en?"`) as the
noun-sense usage example. Both already used the correct no-raka roots
with legitimate suffix-boundary dots (not root-internal raka) — no
value changes needed.

**3. Adultery / Mature / Jeon-Jeo** — checked all three against
`compiled_dict.json` before touching anything: all three already
compile to exactly what the Project Owner just confirmed (`Til'eka`,
`brigimin`, `jeo`), and `master_dictionary.json` already carries the
correct VERIFIED/HIGH tags with the losing variants already SUPERSEDED
or REJECTED. **No changes made** — these were already closed from
earlier sessions (NV-062, NV-056, NV-054). Confirmed rather than
re-litigated.

**4. Full-corpus dedup audit** ("run entire audit... no dups"): ran a
global exact-duplicate check (identical english+garo pairs) across all
9,767 entries. Found 9 duplicate groups. 6 are the project's established
retain-both-for-citation pattern (SUPERSEDED legacy row + VERIFIED
replacement row sharing the same value — `one dog`, `3`, `two dogs`,
`three books`, `one plate of rice`, plus the two intentional `pen`/`Pen`
case-variant closures) — these are load-bearing audit trail per
existing convention ("retained per citation discipline, not deleted"),
left untouched. 3 got hygiene fixes:
- `"ten birds"→"do·a mang·chiking"` (idx 3695): note text claimed an
  in-place correction to `do·o` that was never actually applied to the
  field (the real fix ships as a separate replacement row, idx 9245).
  Corrected the note wording only — no value change, doesn't affect
  compile.
- `"Hope"→"Ka·donga"` (idx 8571): redundant OCR import duplicating an
  already-VERIFIED variant (idx 3371). SUPERSEDED.
- `"tax"→"Kajina"` (idx 623): untagged legacy import, same value as the
  native-confirmed `Tax` entry (idx 8369). Annotated only (not
  conflicting), for clarity.

## Duplicate-representation check (Rule 8)
`corrections.json`/`phrase_maps.js` don't reference any of the touched
rows — none of these keys have engine-side overrides. No propagation
needed.

## Verification
- `node prepare-data.js`: 8128 unique compiled entries (was 8132 — 4
  keys, "An answer"/"a reply"/"a respond"/"a rejoinder.", lost their
  only VERIFIED candidate and correctly moved to
  `docs/SUPERSEDED_ONLY_KEYS.md` (held, not shipped), not deleted).
- `node test-dictionary.js`: 8128/8128 valid.
- `node repository-intelligence.js`: 0 new violations across Checks A-F.
- `npm test`: 215/215 passing, no regressions.
- `node scripts/runtime-error-sweep.mjs`: 14,525 `translate()` calls +
  full API surface, 0 errors.

## PAT handling
Session-supplied PAT used inline in clone/push remote URLs only, never
persisted to git config, commit content, or any tracked file.

## Repository status at close
- HEAD: (this commit, see `git log -1` at push time)
- `origin/main`: matches HEAD exactly (verify via `git fetch` +
  `git rev-parse` both sides post-push)
- `git status`: clean, no uncommitted changes, no local-only commits
- `WORKSTATE.yaml`: updated by Claude A this session (claude_a block —
  `next_action` closed; also added a data-side pointer to `claude_b`
  explaining the reduced/cleaner 'answer' tie-break shape, informational
  only, not a mandate)
- `SESSION_BOOTSTRAP.md`: unchanged by Claude A this session
- Migration doc: this document, complete
- Native-validation/blocker status: no open native-validation items, no
  queued task. One engineering handoff remains open for Claude B
  (unchanged in substance, changed in shape — see WORKSTATE claude_b
  block): the `answer`/`Answer` pickPrimary POS tie-break, now a clean
  2-candidate tie instead of a noisy 4-candidate one.

## Exact next step for the next Claude A session
1. Resume per Rule 10 (fetch/verify HEAD/pull-if-needed/confirm clean/
   read WORKSTATE+BOOTSTRAP+this doc).
2. No queued linguistic task. Check `.ai/WORKSTATE.yaml`'s
   `claude_a.next_action` and Claude C's latest audit for anything new
   before starting fresh work.
