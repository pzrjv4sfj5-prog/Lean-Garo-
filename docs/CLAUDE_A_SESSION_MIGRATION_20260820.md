# Claude A Session Migration — 2026-08-20 (close)

## Project identity
Lean-Garo, English↔Garo dictionary/translation engine. Repo:
github.com/pzrjv4sfj5-prog/Lean-Garo-. This session's role: Claude A
(linguistic authority — grammar/morphology/dictionary quality/native
validation review). Does not touch engine code (Claude B) or OCR
ingestion (Claude D).

## Repository status at close
- HEAD: `72ff3a6`
- origin/main: `72ff3a6` (match confirmed via `git fetch` + `git rev-parse`
  on both, immediately before writing this doc)
- `git status`: clean, no local commits, no uncommitted changes
- Gate (five-command chain): all green
  - `node prepare-data.js` — 8127 entries compiled, 0 errors
  - `node test-dictionary.js` — 8127/8127 valid, **9/9** grammatical
    corrections (was 8/9 earlier this session — traced and closed, see
    below)
  - `node repository-intelligence.js` — PASSED, 0 new violations
    (Check E: 112 known placeholder entries, 0 new; Check F: 181
    known/allowlisted mismatches, 0 new)
  - `node --test tests/unit/*.test.js` — **218/218**
  - `node scripts/runtime-error-sweep.mjs` — **14523/14523**, 0 errors
- WORKSTATE.yaml / SESSION_BOOTSTRAP.md: **NOT updated this session**
  — flagged as outstanding from the prior session close
  (CLAUDE_A_SESSION_MIGRATION_20260819.md) and still not done. Next
  session should do this first.
- Native-validation blockers: unchanged from prior close (82 Brave, 94
  Agree, 96 Bear verb-sense, 44 Gong instrument-sense) — none touched
  this session.

## What's done this session (NV-083)

Source: Thangseng relay via Tridip, responding to
`docs/THANGSENG_RELAY_BATCH_20260820.md` (150-item batch, itself drafted
this session from B's resync-sweep handoff — see below). Only a small
subset of answers came back so far; **144 of 150 items in that batch
remain open**, unanswered.

Confirmed and applied (all committed, all gate-green):
- `let's drink` (Hai ringaha), `let's eat` (Hai cha·ha) — already
  correct in master, citation added only.
- `let's play`, `let's sit`, `let's work`, `my dog` — master held
  **stale, unconfirmed** values that differed from what was actually
  shipping via `corrections.json` (`Hai kalaha`→`Hai kalna`, `Hai
  asongha`→`Hai asongna`, `Hai dakha`→`Hai dakna`, `angni mang`→`ang·ni
  achak`). Old rows tagged SUPERSEDED, new VERIFIED/HIGH rows added
  citing NV-083. Runtime already shipped the correct value in all four
  cases — this closed a citation gap, not a live bug.
- `beautiful` (Sila), `child` (Bi·sa) — citation-only, values were
  already correct and shipping.
- `wait` (Damo/Sengbo, imperative sense) — citation-only **with a
  near-miss worth knowing about**: see "Root cause" below.

## Root cause worth carrying forward: grammarOverrides precedence trap

`prepare-data.js` has a hardcoded `grammarOverrides` constant (separate
from `corrections.json` and `phrase_maps.js`) that Claude B built as a
targeted fix for a pickPrimary precedence bug. Per its logic
(`prepare-data.js` ~line 466-482), grammarOverrides is **skipped** if
pickPrimary already selected a VERIFIED/HIGH master-dictionary
candidate for that key. `tests/unit/translationEngine.test.js:1117` is
an explicit regression test locking `wait` and `salt` to their
pre-existing engine values specifically to guard this mechanism.

My first attempt at closing the `wait` citation gap added a VERIFIED
row with value `"Damo / Sengbo"` (with spaces around the slash) — this
is semantically identical to the existing `"Damo/Sengbo"` (no spaces)
grammarOverrides constant, but the formatting difference was enough
for pickPrimary to treat it as a new verified selection, which silently
**changed the compiled runtime value** and broke the regression test
(217/218, then traced to a 8/9 test-dictionary.js mismatch too — I
initially and **incorrectly** assumed that second one was pre-existing
and unrelated; it was not, it was caused by the same edit). Caught via
the gate before push, corrected by matching the grammarOverrides
string exactly, re-verified fully green, then committed.

**Lesson for next session and for Claude B coordination:** any new
VERIFIED/HIGH master row for a key that already has a `grammarOverrides`
entry in `prepare-data.js` needs its value checked byte-for-byte
against that constant (not just "same meaning") before committing, or
it will silently flip which mechanism wins and can break Claude B's
precedence-fix regression tests without any error until `node --test`
is actually run. This is a real architectural coupling between
Claude A's data edits and Claude B's engine constants that isn't
visible from master_dictionary.json alone.

## Open items (unchanged from prior session, not touched this session)
- Item 82 Brave — deferred, Thangseng wants a different word than
  `ka·donga`/`ka·dongani`
- Item 94 Agree — asked, no answer yet
- Item 96 Bear (verb sense) — no native entry for carry/endure; same
  underlying word as B's resync-handoff `bear` case/sense-risk flag
- Item 44 Gong (instrument sense) — classifier sense confirmed,
  instrument sense unconfirmed
- Anti/Antio/week — 5 questions relayed a prior session, still
  unanswered. A verdict-only claim ("week=anti confirmed") was
  correctly declined this session per standing evidence-first
  methodology — still waiting on the actual relay text.
- `THANGSENG_RELAY_BATCH_20260820.md` — 144/150 items still open
- B's resync-sweep handoff, 3 items not yet relayed or resolved:
  `bear` case/sense risk (see above, same as item 96); `elephant` and
  `outside` tied-candidate picks (need a primary chosen among tied
  VERIFIED/HIGH candidates, not new native evidence — could be Claude
  A judgment call rather than a relay item); 20 "override disagrees
  with a VERIFIED target but isn't tagged SUPERSEDED" items (these
  already have cited evidence per B's audit — worth Claude A reviewing
  directly rather than relaying, next session)

## Standing rules reinforced this session
- Evidence-first methodology held under direct pressure: declined to
  log NV-083 for Anti/Antio/week from a verdict statement alone, even
  when the Project Owner asserted it directly — the actual relay text
  is still required. This is consistent with, not a new exception to,
  the governance distinction (970f891, this session's earlier read)
  that Project Owner authority is real but is not itself native
  evidence.
- "Correct entries don't need Thangseng" pushback (re: the 150-item
  no-VERIFIED-candidate batch) was also held: master having no citation
  isn't the same as the value being wrong, but it's also not the same
  as it being confirmed — Claude A's own judgment that something
  "reads as fluent" isn't the evidence tier this project runs on.

## Exact next step
1. Update WORKSTATE.yaml + SESSION_BOOTSTRAP.md to point at this doc
   (outstanding from last session too — do this first, before any new
   work).
2. Check for further Thangseng relay answers to
   `THANGSENG_RELAY_BATCH_20260820.md` (144 items still open) or to the
   Anti/Antio/week questions — apply as NV-084+ following the same
   evidence-first discipline and the grammarOverrides-precedence
   caution noted above.
3. Consider reviewing the 20 "unproven-stale" items from B's resync
   handoff directly (they already carry citations) rather than
   relaying them — faster and may not need Thangseng at all.
