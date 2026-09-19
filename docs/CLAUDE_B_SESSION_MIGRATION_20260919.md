# Claude B Session Migration — 2026-09-19

## 1. Project identity
Lean Garo — English↔Garo translation engine. `translate()` in `src/translationEngine.js` is the runtime entry point; compiles from `master_dictionary.json` (not `pending_lexicon.json`, which is staging-only for the OCR review pipeline).

## 2. Current state
- **HEAD:** `7baa4df` on `origin/main`, pushed and verified clean (`git status` empty, no local-only commits).
- **Gate at push time:** 441/441 unit tests, 0 repository-intelligence violations, 0 resync candidates, 0 runtime-sweep errors (15,275 translate() calls).
- Session history at this point: `fd2973d` (prior Claude B close) → `2ab0859` (Claude A: 192 OCR entries staged) → `e561782` (prior Claude B session-close doc) → `fc32cc0` (Claude A: friend=Ripeng correction) → `fed025e` (Claude A session-close doc, 20260918D) → `7baa4df` (this session, Claude B).

## 3. What's done this session
- **Fixed:** `singularize()` regex bug (`src/garo_classifier.js`) — the `-es` sibilant-strip rule couldn't distinguish "house+s" from "bus+es" (both end in "...ses"). Added explicit `IRREGULAR_PLURALS` entries: house, horse, nose, nurse, promise, sunrise, surprise (all real `master_dictionary.json` headwords hitting this class). `translate("2 houses")` now returns `nok te·gni` (0.96, classifier) instead of `[UNKNOWN] Nok` (0.65, morphology fallback).
- **Fixed:** `fuzzyMatch()` threshold (`src/normalizationEngine.js`) — was confidently substituting unrelated real words for missing vocabulary (tool→fool d=1, tools→books d=2). Tightened: words ≤5 letters excluded entirely; longer words need dist ≤ 15% of length (was 25%). Verified no existing test asserted a *successful* fuzzy match — every fuzzy test in the suite asserts one must NOT fire — so nothing of value was lost.
- **Verified (not fixed, Claude A's territory):** Claude A's 192-entry OCR push (`2ab0859`) is staging-only, doesn't touch the runtime dictionary. Found 3 pending_lexicon pairs that look like one entry double-counted across two POS rows rather than two distinct facts — see §4.
- **Verified (not fixed, Claude A's territory):** `fc32cc0` "friend = Ripeng" correction — rebased cleanly, gate re-run and green after rebase, no interaction with this session's changes.

## 4. Held / open items (not touched this session)
- **3 pending_lexicon near-dupe pairs**, identical english+garo+notes differing only in `pos`:
  - `PL-0002116`/`-117` — "second" / "Bamil rata" (v./n.)
  - `PL-0002118`/`-119` — "last weeding of a jhum" / "Bamil rata" (v./n.)
  - `PL-0002182`/`-183` — "one who says yes to everything" / "Jola jola dakgipa" (adj./n.)
  Root cause: exact-dedup check keys on english+garo+pos, so two POS-tagged rows for what may be one dictionary entry pass as distinct. Needs a human/Claude A call — flagged, not resolved.
- **94 near-duplicate rows** from Claude D's audit batch (predates this session, see `docs/CLAUDE_A_SESSION_20260918C.md`) — still unresolved, some flagged pairs look like genuinely distinct senses, not real duplicates.
- `se` 20-99 compound — zero evidence, no guess exists.
- `jol` 20-99 compound — shipped as unverified guess, still needs a real citation.
- `DERIVED` confidence-schema gap — `VALID_CONFIDENCE_VALUES` enum still missing the tag.

## 5. Standing rules this session followed (carried forward)
- Never fabricate a Garo linguistic form without citation; decline (honest `[UNKNOWN]`) over a confident guess. This was the explicit rationale for tightening `fuzzyMatch()` rather than expanding its guess radius.
- Mechanical English-orthography fixes (plural stripping, regex) are in-scope without owner sign-off; Garo-form decisions (word choice, classifier assignment) are not.
- Before pushing: full gate (unit tests + repository-intelligence + resync + runtime-sweep) re-run at the exact commit being pushed, not just at the commit written locally — this session's rebase onto Claude A's two new remote commits triggered a full gate re-run before push, not a trust-and-push.
- Commit messages document root cause, not just the change, and explicitly flag anything left open for the next session/agent.

## 6. Exact next step
No in-progress edit — last action was a clean push, gate green. Next session should pick from §4, most actionable: resolve the 3 pos-only pending_lexicon pairs (quick, likely a straightforward "merge to one row with pos:[\"v.\",\"n.\"]" or similar schema call) or tackle the `se`/`jol` 20-99 compound citations if new source material has surfaced.

## 7. Resume protocol for whoever picks this up
Treat this doc as ground truth for what happened, but re-sync with actual current state before continuing: `git fetch`, check `origin/main` HEAD against `7baa4df`, re-run the full gate at whatever HEAD actually is (not just trust this doc), then proceed. Don't re-litigate the fixes or open items listed above as settled — they're settled — but do verify nothing new landed between this doc and resume time.
