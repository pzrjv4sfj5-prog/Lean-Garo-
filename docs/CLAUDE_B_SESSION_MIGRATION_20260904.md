# Claude B Session Migration — 2026-09-04

## Project identity
Lean-Garo-: a Garo-language translation/dictionary engine
(`master_dictionary.json` -> `prepare-data.js` -> `compiled_dict.json`,
consumed by `translationEngine.js`/`grammarEngine.js`/`sentenceBuilder.js`).
Native-speaker (Thangseng) evidence is relayed via Project Owner and
logged as sequential `NV-###` entries in
`docs/THANGSENG_NATIVE_VALIDATION.md`. Two agents (Claude A, Claude B)
work concurrently in separate sessions against the same `origin/main`.

## Current state (verified, not assumed)
- **HEAD:** `009df0f`, pushed, matches `origin/main`. Confirmed by
  `git log -1` + successful `git push` at session end, not just claimed.
- **Gate, re-run AFTER merge, at this exact commit:** dictionary
  8268/8268, grammatical corrections 9/9, unit tests 314/314,
  repository-intelligence.js 0 new violations, resync-stale-overrides.mjs
  0 candidates. All commands and raw output are in this session's
  transcript if you need to re-verify the methodology, not just the
  numbers.
- `node_modules` was missing on clone this session (fresh clone) —
  `npm install` needed before running the gate again.

## What's done this session
Processed 3 Thangseng relay answers (received via Project Owner,
WhatsApp-style transcript, night of 2026-09-03):
- **NV-127** (renumbered from my original NV-124) — "only X"
  third-person scope (e.g. "he is the only teacher"). Answer received
  ("Yes, but... borrowed from the Bible translation, other ways
  depending on intention") but **NOT sufficient to close** — no actual
  third-person sentence was transmitted, and the caveat explicitly warns
  against assuming naive pronoun substitution works. **No code change.**
  The `tryOnlyIdentityConstruction` scope guard is untouched.
- **NV-128** (from NV-125) — stationary "where" (`bano`) confirmed to
  take no `-ma` question suffix, closing RULE-048's flagged P2 gap.
  Direct citation: `(Na·a) Bano dongenga?` = "Where are you staying?"
  Closed. `RULE-048.yaml`, `GRAMMAR_RULE_CATALOGUE.md`,
  `master_dictionary.json` updated.
- **NV-129** (from NV-126) — `jedakode` and `maikai` both confirmed as
  purpose ("so that"/"in order that") connectives via 2 full sentences.
  Closed NV-122's explicitly-open flag. Also independently validates the
  *shape* (not the exact sentence) of a prior pattern-logic-only guess in
  `GARO_GRAMMAR_REFERENCE.md` §7 — updated in place. 2 new word-tensions
  flagged and left unresolved: `merong` vs. existing `mi` (rice);
  `Gisik nange poraibo` vs. existing `po·ri·a` (study). Do not silently
  merge these.

**No engine/runtime code was touched this session** — docs and
`master_dictionary.json` only.

## Numbering collision (important — read before assigning new NV numbers)
Claude A pushed NV-124/125/126 concurrently, for 3 *different*, unrelated
findings (sak-classifier raka-dot fix, old-man/old-woman promotion,
student gendered pairs — see `7acf794`). No content overlap with my
work, but same number range. I renumbered mine to NV-127/128/129 across
every file that referenced them (`THANGSENG_NATIVE_VALIDATION.md`
headings + body text, `RULE-048.yaml`, `GRAMMAR_RULE_CATALOGUE.md`,
`GARO_GRAMMAR_REFERENCE.md`, and the 4 new `master_dictionary.json`
rows) before merging and pushing. **This is at least the second time
this exact collision pattern has happened** (see RULE-047/048 in
`RULE-048.yaml`'s own `native_notes`). Before assigning a new NV number
next session: `git pull` first, then check the actual highest number in
use across *both* `THANGSENG_NATIVE_VALIDATION.md` and any in-flight
`master_dictionary.json` notes — don't trust a stale migration doc's
claimed "next number" without re-checking against fresh `origin/main`.
Highest number now in use: **NV-129**.

## Open issues (with root cause where known)
1. **NV-127 (only-X third-person)** — genuinely blocked on native
   evidence, not an engineering task. Next step: ask Thangseng directly
   for the actual sentences ("he is the only teacher" / "she is the only
   doctor"), and what "depending on the intention" means (possibly a
   register/stress choice similar to `mangmang`/`saksa kamkam`).
2. **RULE-038 `sak·sa` tension** — still open, pre-existing, untouched
   this session.
3. **Two new word-tensions from NV-129** — `merong` vs `mi` (rice),
   `Gisik nange poraibo` vs `po·ri·a` (study). Not resolved, not asked
   about yet. Don't assume synonymy without a direct citation.
4. Per Claude A's NV-124 commit: a `RAKA_CLASSIFIERS` engine gap was
   flagged for Claude B specifically — I have not looked at this yet
   this session, it's still open. Check `12c95f2`'s commit message for
   detail before starting.
5. §8 of `GARO_GRAMMAR_REFERENCE.md`: the "i went to the market to buy
   rice" engine bug (location-noun dropped) — status **not re-verified**
   this session, don't assume it's fixed just because a near-equivalent
   sentence now has native evidence.

## Standing rules established (in addition to prior sessions' rules)
- When two concurrent sessions might grab the same next NV number,
  resolve by renumbering the *not-yet-pushed* side after a fresh pull,
  never by overwriting the side that's already on `origin/main`.
- Merge conflicts in `master_dictionary.json` from two sessions both
  appending rows: keep both sides' rows, don't drop either.
- Never hand-merge `compiled_dict.json` / `category_index.json` /
  `compiled_dict_alternates.json` — always regenerate via
  `node prepare-data.js` from the resolved `master_dictionary.json`.

## Exact next step
`git pull` (or fresh clone), `npm install` if `node_modules` is missing,
run the full gate once as a resync check, then either: (a) pursue the
`RAKA_CLASSIFIERS` engine gap Claude A flagged, or (b) ask Project Owner
to relay the NV-127 follow-up question to Thangseng. No other item is
currently unblocked and unassigned.

---
**Start a new conversation and paste this document in to resume.**
