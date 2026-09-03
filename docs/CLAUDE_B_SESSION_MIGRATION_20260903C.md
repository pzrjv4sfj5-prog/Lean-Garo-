# Claude B Session Migration — 2026-09-03C (NV-118: embedded loanwords)

## Trigger
Project Owner asked for a translation of "i want to eat momo".
`translate()` returned `"Anga ska ·na Cha·a [UNKNOWN]"` — momo, a
confirmed loanword (NV-115), was shipping as a literal `[UNKNOWN]`
marker inside a real sentence, even though `translate("momo")` alone
already worked correctly.

## Root cause
NV-115/116's fix (session 20260903A/this doc's predecessor) only ever
checked the loanword list against the FULL cleaned input string, at the
top of `translate()`. That's correct for the top-level entry point, but
every other composition path in the codebase (`grammar-assembly`'s
object/location lookups, `sentenceBuilder.js`'s per-word SOV pairs, the
`morphology` fallback tier, compound-word splitting) resolves words
individually via `lookupGaro(word)`, each independently falling back to
a literal `'[UNKNOWN]'` string on failure (a dozen-plus separate call
sites doing `lookupGaro(w) || '[UNKNOWN]'`). None of those had ever seen
the loanword list at all.

## Fix — NV-118
Rather than patching each of the dozen-plus call sites individually
(large, scattered diff, easy to miss one), added the fallback at the one
shared choke point they already all route through: `lookupGaro()` itself
in `src/lookupEngine.js`. Same rationale as that function's existing
corrections/phrase-map precedence checks, which exist for exactly this
reason (callers other than `translate()`'s own top-level cascade need
the same precedence).

Only the **single-word subset** of the loanword list is used here
(`momo, chow, maggie, paneer, panner, roll` — filters out the multi-word
`paneer butter masala`/`panner butter masala` entries, since
`lookupGaro` only ever receives one word at a time; those stay handled
correctly by `translate()`'s own top-level step 1.75).

## Before / after
- `translate("i want to eat momo")`:
  before → `"Anga ska ·na Cha·a [UNKNOWN]"` (method: `morphology`,
  confidence 0.65 — the low-quality bag-of-glosses fallback tier, reached
  only because momo's unresolvability made the better `grammar-assembly`
  path bail).
  after → `"Anga momo·ko cha·na ska"` (method: `grammar-assembly`,
  confidence 0.82 — properly SOV-ordered with the object marker `·ko`,
  because momo now resolves and the better composition path no longer
  bails).
- `translate("i want to eat chow")`: same fix, verified.
- `translate("momo")` alone: unaffected, still `loanword-passthrough`.
- `lookupGaro("paneer butter masala")`: still `null` — confirmed this
  multi-word phrase isn't silently added as dead weight to a function
  that can never receive it as a single argument.

## Naming note
Originally labeled this NV-117, then discovered Claude A had already
claimed NV-117 same-day for the `ama`/`man·a` identity finding
(`docs/CLAUDE_A_SESSION_MIGRATION_20260903.md`). Renumbered to NV-118
before commit — caught via `grep -rn "NV-117" docs/` before pushing, not
after. No stale NV-117 references left in `src/`.

## Tests
Added 3 new tests: embedded "momo" resolves cleanly (no `[UNKNOWN]`),
embedded "chow" resolves cleanly (same fix, different word), and a
regression guard confirming multi-word phrases are correctly excluded
from `lookupGaro`'s fallback set.

## Gate (independently run this session)
- `node prepare-data.js` — 8212 unique entries (Claude A's NV-117 ama/
  man·a rows, pulled at session start — unrelated to this fix), clean.
- `node test-dictionary.js` — 8212/8212 valid, 9/9 corrections.
- `node repository-intelligence.js` — 0 new violations.
- `node scripts/resync-stale-overrides.mjs` — 0 resync candidates.
- `node --test tests/unit/*.test.js` — **304/304 pass** (was 301; +3 new).

## Diff scope
`src/lookupEngine.js` (new import + fallback branch) and
`tests/unit/translationEngine.test.js` only. Zero dictionary/data file
changes — `confirmed_loanwords.json` itself is unchanged, just read from
a second location now.

## Resync note
Pulled Claude A's `NV-117` (ama/man·a) and the follow-up confirmation
commit at session start before doing any work — both docs-only/dictionary
work, no conflict with this session's engine-code change.

## Next session resume
No open engineering items from this session. If more confirmed loanwords
surface, add them to `src/data/confirmed_loanwords.json` only — both the
top-level exact-match check (`translationEngine.js` step 1.75) and this
session's `lookupGaro` fallback already read from that single file, no
further code change needed for new single-word entries. New multi-word
entries also need no code change (top-level step 1.75 already handles
them; `lookupGaro`'s fallback correctly excludes them by design).
