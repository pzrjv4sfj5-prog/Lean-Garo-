# Claude A Session Migration Document — 2026-08-12 (checkpoint close, counting QA)

## Project identity
Lean-Garo — Garo language dictionary + English-to-Garo translation engine.
Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Claude A role: linguistic
authority only (grammar/morphology/dictionary quality/native validation
review). Never touches engine code (Claude B) or OCR ingestion (Claude D).

## Current commit/state
- HEAD: `6ff4778` — confirmed matches `origin/main` exactly.
- `git status`: clean, nothing local-only, nothing uncommitted.
- 203/203 unit tests passing.
- `repository-intelligence.js`: 0 new violations, all six checks pass.
- `prepare-data.js`: 8149 unique compiled entries (unchanged this session
  — values-only edits, no keys added/removed).

## What's done this session
Task: counting-system QA, per Project Owner relay of "Claude C completed
a repository-wide QA audit, suspects engineering not linguistic."

**No Claude C audit document exists anywhere in the repo** (`docs/`, `.ai/`
both checked thoroughly). Did an independent full-corpus review to the
same evidence-first bar in its place, rather than block on a document that
wasn't there.

1. **Reviewed every live counted-noun entry across all 7 classifier
   families** (`mang`=animals/birds, `king`=flat objects/books, `sak`=
   people, `gong`=money, `pang`=trees/no raka, `rong`=round objects/no
   raka, `ge`=tool/elongated objects). **Confirmed: the classifier engine
   and the `NOUN+CLASSIFIER+SUFFIX` formula are linguistically sound**,
   zero exceptions, everywhere it has a complete 1-20 build-out.
2. **Found and closed the actual gap**: 13 "two X" entries orphaned by the
   2026-08-10 523-entry SUPERSEDED sweep (missed because they're orphans —
   no duplicate-with-a-fix to compare against). Resolved by pure
   corpus-internal contradiction, no native input, no replacement
   asserted:
   - `two apple`(`se·gni`) / `two persons`(`mande·gni`) — directly
     contradict already-VERIFIED entries for the same keys.
   - `rang·gni` identically reused for both car and house.
   - `chik·gni` identically reused for river/student/water.
   - `chak·gni` identically reused for food/rice.
   All 13 tagged SUPERSEDED in place, cited individually. Full detail:
   `docs/CLAUDE_A_COUNTING_QA_20260812.md`.
3. **Deliberately did NOT touch**: mountain(`nok·gni`), village(`rim·gni`),
   road(`lam·gni`), banana(`sobo·gni`), car(`mot·gni`, the non-reused
   singular variant). These only violate the classifier formula — no
   reused-root contradiction to point to — and whether they take a
   numeral classifier at all is still an open native question (carried
   since 2026-08-10, unchanged).
4. **Concurrent-push collision, handled per standing protocol.** Push was
   rejected — origin had advanced with Claude B's tree-root reversal
   (`Bol`, not `a'bil`, direct Project Owner input, commits `1d17cdc`/
   `f67a16b`). Reviewed the commit before merging: well-cited, orthogonal
   to this session's 13 entries (no key overlap). Merged clean via
   commit→fetch→merge→push, rebuilt `compiled_dict.json`/
   `compiled_dict_alternates.json`/`category_index.json` from merged
   sources (byte-identical to pre-merge, confirming sync), re-verified
   203/203 tests + 0 new `repository-intelligence.js` violations
   post-merge before pushing.
5. Updated `.ai/WORKSTATE.yaml` (`repository.head`,
   `repository.last_updated`, `claude_a.current_task`) and
   `.ai/SESSION_BOOTSTRAP.md`'s "Current joint work package" section.

## Handoff to Claude B
Source linguistic data is correct — **no native correction needed for the
counting system itself.** Please confirm the compile pipeline isn't still
surfacing any of the 13 newly-tagged entries at runtime (same
`pickPrimary()`-precedence class as the 2026-08-06 SUPERSEDED-precedence
bug that needed a dedicated fix, not just a SUPERSEDED tag).

Also flagged (not decided — architecture call, not linguistic): given this
exact failure mode (orphaned fabricated entries silently outliving a sweep
because dictionary storage duplicates what the classifier engine could
generate on the fly), full generation-time classifier application might
be the structural fix that makes this whole bug class impossible. Your
call whether to pursue.

## Bugs caught this session
None new. Clean, bounded task — the only anomaly was the pre-existing
orphan gap itself, which was the point of the task.

## Open items — unchanged from 2026-08-11 doc, still not touched, sized
- **Person/student/teacher's 111-candidate root conflict** — largest
  remaining chunk, needs its own scoped session (3 competing teacher
  roots `di·di`/`ma·star`/`ti·char`, `man·de` tagged UNVERIFIED, plus a
  fourth `skigipa` variant surfaced this session in the orphan sweep —
  none resolved, all still blocked on native input).
- **The "10 nouns" open question**: house/car/road/river/mountain/
  village/water/food/rice/banana — whether each takes a numeral
  classifier at all; water/food/rice specifically flagged as possible
  mass nouns.
- **Coin's root**: existing `tangka gong·sa`/`tangka gong·bonga` entries
  are structurally sound (match rupees' confirmed classifier exactly) but
  unannotated — likely just needs a VERIFIED tag added, not new native
  input. Small, single-item.
- **Anna-coin subunit** (`suk·ki`/`a·dul·i`/`rep·a`, already tagged
  UNVERIFIED/HIGH) — legacy currency-subunit system, doesn't fit the
  classifier paradigm at all. Separate question, out of this audit's
  scope.

## Standing rules reaffirmed this session
- Evidence-first methodology: all 13 closures this session used pure
  corpus-internal contradiction (duplicate-key clash or identical-root
  reuse across unrelated nouns) — no native input needed, no guessing, no
  replacement value asserted where none was confirmed.
- Concurrent-push collision protocol (commit → fetch → merge → push) held
  again — review any incoming commit for real conflicts before merging,
  don't just auto-merge blind.
- One task per session: counting QA was the sole task. Other open items
  (above) were found pre-existing, not acted on.
- Size queued work against context budget before starting; this session's
  scope (13 objectively-resolvable entries) was deliberately kept small
  and clean rather than reaching into the formula-violation-only nouns,
  which would require native input this session didn't have.

## Exact next step
No committed next task. In rough priority order:
1. Native-confirmation round for coin's root (small, single-question,
   next Thangseng relay batch) — and for the "10 nouns" classifier
   question, which unblocks the largest remaining volume of orphaned
   entries.
2. Person/student/teacher's 111-candidate root conflict — needs its own
   scoped session per the resume-protocol rule.
3. Claude B: confirm no runtime propagation gap on the 13 newly-tagged
   entries (per Handoff section above).

Start a new conversation and paste this in when ready.
