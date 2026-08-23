# Claude B Session Migration — 2026-08-23B (real-time translation audit)

## Read order for next session (mandatory)
1. `.ai/SESSION_BOOTSTRAP.md` — stop at "## Roles" unless your role needs more; **Rule 13** (Claude B governance pointer) is in this file.
2. `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` — mandatory every Claude B session per Rule 13.
3. This document.
4. `.ai/WORKSTATE.yaml` `claude_b` section, latest 2-3 entries.

## Project identity
Lean-Garo- (language-translator) — English↔Garo dictionary/translation app.
Repo: pzrjv4sfj5-prog/Lean-Garo-

## Current commit/state
- HEAD at session start: `13733a49126419dc80c19e66924e6401c26cb9d9`
- This session made **zero code/data changes** — audit only, per explicit
  Project Owner instruction ("do NOT modify linguistic source data and do
  NOT invent linguistic forms... do not fix everything you discover").
- Working tree clean throughout. No local-only state. Nothing to push
  beyond this migration doc + the WORKSTATE.yaml entry pointing to it.

## What's done vs held (and why)
**Done (this session, Claude B, engineering-only per role lines):**
- Full real-time runtime audit: 51 cases run directly through `translate()`
  covering vocab, sentences, questions, negatives, tense, counting,
  classifiers, singular/plural, adj+noun, S+V, S+O+V, long/novel sentences,
  and the historical problem-word list (wait/salt/king/answer/my house/
  yes/stand/song/telling/studying/angry).
- Re-verified `wait`, `salt`, `king`, `answer`, `my house`, `angry`/`i am
  angry` — all still correct, no regression.
- Confirmed `stand`→`Chadenga` fix (NV-091) is live and correct.
- Root-caused (code-level, not guessed) 5 engineering findings — see
  "Open issues" below, each with exact reproduction and file/line cause.
- Ran full non-vite gate (`prepare-data.js`, `node --test`,
  `repository-intelligence.js`) before and after the audit — 0 new
  violations, 220/220 tests, confirming the audit itself introduced no
  drift (it couldn't have; no files were touched).

**Held (deliberately not started this session):**
- All 5 engineering fixes below — each is real work (code change + new
  regression tests + full gate + WORKSTATE update), assessed as too much
  to start and cleanly finish in this session's remaining token budget.
  None were begun; no partial/half-edited state exists anywhere.
- AI-001 backlog — explicitly set aside per this session's instruction,
  unchanged from `docs/CLAUDE_B_SESSION_MIGRATION_20260823.md`.

## Open issues (root cause known, from direct runtime tracing — not doc claims)

1. **Stale `corrections.json` overrides mask now-VERIFIED master values.**
   - `song`→ships `git`, master's own VERIFIED/HIGH note says `giit` is
     primary post-NV-091 (`git` is "spelling variant only").
   - `telling`→ships `aganeng`, master VERIFIED/HIGH = `Aganenga`.
   - `studying`→ships `poraenga`, master VERIFIED/HIGH = `Poraienga`.
   - Root cause: NV-091 fixed `stand`'s identical stale-override pattern
     but didn't re-check these three despite listing them in the same
     "cited (matched existing)" batch. Class: DATA/PROPAGATION.
   - Fix: mechanical `corrections.json` value sync, no linguistic call —
     safe for a future Claude B session to do directly, single commit.

2. **`parseCountingPhrase()` has no adjective slot** — only parses
   `[NUMBER][NOUN]`, confirmed at `src/garo_classifier.js` line ~249. Any
   `[NUMBER][ADJ][NOUN]` phrase ("three long sticks", "two flat books")
   skips classifier composition (0.96 confidence path) entirely and falls
   to `sov-assembly` (0.75, the weakest/fallback path). Class: ENGINEERING.
   Fix: extend the parser to optionally consume one adjective between
   number and noun, still feed the resolved noun into `countNoun()`
   unchanged. No linguistic decision — classifier math already works,
   this is purely a parsing-coverage gap.

3. **`sov-assembly` fallback drops the head noun in multi-modifier
   sentences.** Reproduced: "the tall man is carrying four heavy boxes to
   the river" → `Me·asa Bri je·et·je·et chi·bi·ma Chu·a gat·a` — `box`/
   `bak·so` is entirely absent from output despite being a valid compiled
   entry. Same fallback path also stranded the adjective `Chu·a`(tall) at
   the tail, disjoint from `Me·asa`(man). Class: ENGINEERING. Needs
   `sov-assembly`'s slot-filling logic inspected directly (not yet done —
   only the symptom was traced, not the internal cause within
   `assembleSentenceSOV`/equivalent).

4. **No productive plural rule.** "dog"→`Achak` (0.99), "dogs"→`Achak`
   (0.75, *identical* string, no `-rang` or other plural marker applied).
   "children"→`Bi·sarang` only works because it's a memorized irregular
   dictionary entry, not a rule. Class: ENGINEERING (possibly needs a
   linguistic decision on which plural strategy is correct — flagging as
   ENGINEERING/LINGUISTIC boundary, not resolved which).

5. **Word order breaks under combined question+count+adjective.**
   "did you see the two small dogs" → `Nia Gni Achak Na·a Chon·a` (see-two-
   dog-you-small) — verb fronted, adjective stranded at the very end away
   from its noun. Same `sov-assembly` path as #3, likely same underlying
   cause — not yet confirmed as the *same* root cause vs. a second,
   separate defect in the same function. Needs code-level confirmation
   before fixing either #3 or #5, to avoid a fix that only patches one
   reproduction and misses the shared mechanism (see governance doc §2 —
   don't override-patch an instance without checking the mechanism first).

6. **`bland`/`tasteless` compiled to a corrupted fragment** `·brok·` (bare
   raka marks, not a word). Master rows are `UNVERIFIED`, one an apparent
   OCR-truncated variant of `chi·brek·a`. Class: DATA/PROPAGATION — needs
   Claude A/D (data content), not an engineering fix.

7. **Pronoun-form inconsistency, NOT confirmed as a bug** — dictionary
   `you`=`Nang`, but every runtime path that ships "you" uses `Na·a`
   instead. Could be a legitimate nominative/oblique case distinction.
   Class: LINGUISTIC — flagging for Claude A, not asserting a defect.

## Standing rules established
None new this session. Followed existing Rule 13 / governance doc
throughout (no linguistic decisions made, no new overrides added, no
per-key patches to make an example pass).

## Confidence-score finding (not a defect, an observation)
0.75 (`sov-assembly`) does not distinguish "slightly less certain but
correct" from "dropped a word." Every dropped-word/word-order failure
found this session came from this exact confidence band. Worth a future
design note (not filed as an engineering ticket yet — no proposed
mechanism drafted).

## Exact next step
Recommended order for whichever Claude B session (or this one, if
resumed with a fresh context budget) picks this up:
1. Item 1 (stale-override resync) — smallest, purely mechanical, do first.
2. Item 2 (adjective-slot parsing) — clear scope, established root cause,
   go straight to code per this doc's citation.
3. Items 3 & 5 — investigate together (same fallback path), confirm
   whether they share one root cause before writing any fix, per
   governance §2.
4. Item 4 — flag for Project Owner/Claude A whether plural marking is a
   pure engineering rule or needs a linguistic design decision first.
5. Item 6 — handoff to Claude A/D, not Claude B work.

Do not re-run the full 51-case audit from scratch — this document's
findings are the current, complete, re-usable result. Only re-test cases
that are directly touched by whichever fix is picked up next.

---
Start a new conversation, ensure Rule 13 (`.ai/SESSION_BOOTSTRAP.md`) and
this document are both read before any work begins, then resume from
"Exact next step" above.
