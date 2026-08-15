# Claude A — Session Migration Document — 2026-08-15

## Resume protocol followed
Resumed via `docs/CLAUDE_A_SESSION_MIGRATION_20260814F.md` (pasted filename)
+ live PAT. Re-synced first: HEAD == origin/main == `6ce3785` at start,
clean tree, zero drift from the pasted doc's own checkpoint (one extra
docs-only Claude B commit had landed on top of it, reviewed, no overlap).
Treated the pasted doc as ground truth, did not re-litigate its settled
decisions.

## What was done this session

### 1. `student` bare-noun root gap (Rule 10 top-of-block handoff)
Per `claude_a.next_action` (top of the WORKSTATE.yaml block, per Rule 10):
`master_dictionary.json`'s bare `"student"` entry still held the stale,
untagged `Porai·gipa` root even though NV-073's phrase-level 1-20 series
(`"one student"` through `"twenty student"`) already used the
native-confirmed `Chattro` root. Corpus-internal fix, no new native
input needed — applies an already-VERIFIED value to the one place it
was missed, same pattern already used for teacher/person's own bare-noun
entries.
- Old `Porai·gipa` entry marked SUPERSEDED (not deleted).
- New `"student"` = `Chattro` entry added, VERIFIED/HIGH, `sak`
  classifier, citing NV-073.
- `corrections.json`/`phrase_maps.js` checked — no `student` key in
  either, nothing to propagate (Rule 8 sweep).
- `known_dictionary_conflicts.json`: `student` added (intentional new
  Check C conflict, VERIFIED vs SUPERSEDED).
- Verified live: `translate('twenty students')` (plural, no phrase-level
  entry, falls through to classifier composition) now correctly
  produces `chattro sak·Kolgrik` instead of the stale
  `porai·gipa sak·Kolgrik`.

Independently, Claude C's read-only audit (`docs/CLAUDE_C_AUDIT_20260815.md`,
landed mid-session, HEAD `6ce3785`) flagged the same gap and characterized
it as needing native confirmation on whether `Chattro`/`Porai·gipa` are
the same word or two distinct valid forms. I judge this corpus-internal
(NV-073 already settled the root at phrase level; this is applying it,
not a new question) — noting the disagreement explicitly rather than
silently overriding the audit's more cautious framing. If the Project
Owner or a future native check surfaces evidence `Porai·gipa` is a
distinct valid register, that's a straightforward reversal, not a
re-litigation of settled work.

### 2. Mechanical resync of 85 stale SUPERSEDED overrides (per Claude C audit §3.2/§3.4)
Claude C's audit found the 2026-08-01/10/12-13 bulk corpus-internal
SUPERSEDED sweeps in `master_dictionary.json` never propagated to
`corrections.json`/`phrase_maps.js` (the two runtime-cascade override
tables that sit ahead of `compiled_dict.json` in `translate()`'s
precedence), sampling 37/334 Check-F baseline entries and finding 28
serving stale values. I ran the full 334-entry sweep rather than
extrapolating from the sample.

Wrote `scripts/resync-stale-overrides.mjs` (mechanical, no native input):
for every Check-F baseline entry, checks whether the override value
matches (via the project's own canonical `normalizeGaro()`) an
explicitly-SUPERSEDED master candidate for that key, while
`compiled_dict.json`'s live value matches a genuinely verified
(non-SUPERSEDED, non-UNVERIFIED, non-OCR-flagged) candidate for the same
key — and resyncs the override to `compiled_dict.json`'s value if so.
- 85 of 334 baseline entries matched (12 `corrections.json` + 73
  `phrase_maps.js` keys); all 85 removed from the Check-F baseline
  (334 → 249) since they no longer mismatch.
- 152 did not match a SUPERSEDED candidate (genuine intentional
  divergences — the tables' actual purpose) — left untouched.
- 9 had no verified master candidate matching `compiled_dict.json`'s
  value (see §3 below) — deliberately NOT resynced.
- 5 had no `compiled_dict.json` entry for the key at all — untouched.

Caught and fixed one bug in my own script before finalizing: ambiguous
ossenkey resolution matched `phrase_maps.js`'s `"really?"` key instead of
the actually-flagged baseline key `"really"` (no `?`) — both keys map to
the same underlying master fact via the trailing-`?`-stripped join, and
my first-match lookup picked the wrong one. Caught by Check F itself
re-flagging `"really"` as a new mismatch after the first apply pass.
Fixed by resyncing both keys to the confirmed value (`chek·chek`).

Fixed 2 stale test assertions in `tests/unit/translationEngine.test.js`
that had hardcoded `phrase_maps.js`'s old `"food"`=`"Mi"` value as the
*expected* outcome — the test's actual purpose was only to verify
`lookupGaro()` consults `phrase_maps.js` at all, not to assert a
specific linguistic value. Since `"food"` now correctly agrees with
`compiled_dict.json` (both `"al·a"`), it stopped demonstrating
override-precedence. Swapped to `"quick"`/`"Tarkbo!"` (confirmed
phrase_maps-only, not shadowed by a `corrections.json` entry the way a
first-attempt replacement, `"hurry"`, turned out to be — caught by the
test failing again after the first swap).

### 3. Deliberately NOT resynced — new finding, flagged for Claude B
9 baseline entries had a SUPERSEDED-matching override but no verified
master candidate matched `compiled_dict.json`'s own live value —
spot-checked two (`work`→`Kam`, `answer`→`a·gan·chak·a`): both resolve
to unverified/OCR-flagged content in `compiled_dict.json` itself, not a
real VERIFIED candidate. This is a **different, deeper bug** than the
one Claude C's audit described — `compiled_dict.json` is not
authoritative for these keys either, so resyncing the override tables
to match it would launder the wrong value from one layer into another,
not fix anything. Not resynced. This looks like the same
master-internal-duplicate-conflict/`pickPrimary` precedence class
already open in prior sessions' handoffs (RC-CANDIDATE-036-adjacent),
not a new linguistic question — Claude B's territory, not mine to
touch (engine/compile-pipeline code).

## Duplicate-representation check (Rule 8)
Covered inline per-item above: `student` (corrections.json/phrase_maps.js
checked, no key present); the 85-entry resync *is itself* the Rule-8
duplicate-representation sweep the 2026-08-01/10/12-13 sessions never
performed, now closed for the 85 confirmed cases (the remaining 249
baseline entries are intentional divergences or need the separate
compiled_dict fix in §3 first).

## Verification
- `node prepare-data.js`: 8132 unique compiled entries (unchanged from
  session start — the resync touches `corrections.json`/`phrase_maps.js`
  only, which are not compile inputs; `compiled_dict.json` is
  byte-identical before/after that fix).
- `node test-dictionary.js`: 8132/8132 valid, JSON compliance clean.
- `node repository-intelligence.js`: 0 new violations across Checks A-F
  both times (student fix: Check C +1 new, allowlisted with citation,
  re-ran clean; resync fix: Check F 334→249 known/allowlisted, 0 new,
  one self-caught false-positive from the script bug above, fixed and
  re-verified clean).
- `npm test`: 215/215 passing (2 stale assertions updated, not a
  regression — see §2 above).
- Rebased cleanly onto two separate concurrent commits mid-session
  (Claude C's read-only audit doc + WORKSTATE wiring, `922ef9d`; Claude
  B's docs-only "angry" flag resolution, `216ee46`) — both zero file
  overlap with this session's changes, full gate re-verified after each.

## PAT handling
Session-supplied PAT used inline in clone/push remote URLs only, never
persisted to git config, commit content, or any tracked file. Stripped
from the remote URL immediately after each push.

## Repository status at close
- HEAD: `1ccac8c`
- `origin/main`: matches HEAD exactly (verified via `git fetch` +
  `git rev-parse` both sides post-push)
- `git status`: clean, no uncommitted changes, no local-only commits
- `WORKSTATE.yaml`: updated this session (see below, committed alongside
  this doc)
- `SESSION_BOOTSTRAP.md`: unchanged by Claude A this session
- Migration doc: this document, complete
- Native-validation/blocker status: no open native-validation items
  from this session. New engineering handoff for Claude B: the `work`/
  `answer`/+7 more `compiled_dict.json` values resolving to
  unverified/OCR-flagged content instead of a real VERIFIED candidate
  (§3 above) — needs the `pickPrimary`/master-internal-duplicate
  precedence class of fix, not a data resync. Full list reproducible via
  `node scripts/resync-stale-overrides.mjs` (dry-run, no `--apply`) —
  see its `skip_no_verified_match` bucket.
