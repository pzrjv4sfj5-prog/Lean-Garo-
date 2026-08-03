# Runtime Engineering Audit — 2026-08-03

Claude B. Scope: engineering correctness of the runtime translation path
only. No Native Validation performed, no linguistic decisions made or
proposed. Resumed from repository only per Resume Protocol; HEAD 7c490ad
re-verified fresh against origin before starting (not assumed unchanged
from any prior session's memory).

## Objective

Ensure there is no engineering path that can override a VERIFIED Native
Translation. Audited: `translationEngine.js`, `sentenceBuilder.js`,
`lookupEngine.js`, `morphologyEngine.js`, `grammarEngine.js`,
`prepare-data.js`, `compiled_dict.json`, `compiled_dict_alternates.json`,
`corrections.json`, `phrase_maps.js`.

## Runtime defects found and fixed

### 1. `lookupGaro()` never consulted `phrase_maps.js`

**File:** `src/lookupEngine.js`

`lookupGaro()` is the shared low-level lookup used by every fallback path
in `translate()` that isn't the top-level exact-string match — stopword-
stripped fallback, `findVerbForm` (morphology, which sits on the *main*
grammar-assembly path, not just a fallback edge case), compound-split. It
checked `corrections.json` then `compiled_dict.json` only. `phrase_maps.js`
was reachable exclusively via `translate()`'s own top-level step-1.5 exact
match — so any word whose only override lived in `phrase_maps.js` was
silently invisible the moment the input didn't hit that exact string.

**Confirmed live, before fix:**
- `"so food"` → `al·a` (stale `compiled_dict.json`) instead of `Mi`
  (`phrase_maps.js`'s value — what bare `"food"` correctly returns)
- `"he washes"` → `Su·gala` instead of `Su·srong·a`, via `findVerbForm` on
  the main grammar-assembly path

**Fix:** added a `phrase_maps.js` check to `lookupGaro()`, at the same
precedence `translate()`'s own cascade already documents (corrections >
phrase-map > compiled_dict). One shared fix corrected every caller
(`grammarEngine.js`, `morphologyEngine.js`, `sentenceBuilder.js`)
uniformly — no per-call-site changes needed.

**Verification:** confirmed both bugs fixed live; confirmed corrections.json
still wins over phrase_maps.js where both exist (`"no"` case); 168/168 tests
(4 new); 0 lint errors; build clean; Check F (runtime-cascade source
agreement) still 0 new violations; 237-sentence stress benchmark output
byte-identical before/after — confirms zero regression on the existing
tested surface (does not by itself prove the fix beyond what was
spot-checked).

### 2. Stale comment in `sentenceBuilder.js` (docs-only, no behavior change)

A comment described a `purpose_map.json` `"search"` bug as still-live. It
was actually fixed 2026-07-10 (`d0e6c06`, RC-CANDIDATE-006) — the comment
was copied verbatim during a later extraction and had described
already-fixed behavior for three-plus weeks. Re-verified
`purpose_map.json`'s current value directly (`"Sandi·na"`, correct).
Comment corrected; no code path affected.

## Confirmed NOT defects (checked, ruled out)

- 11 `master_dictionary.json` VERIFIED/HIGH entries not reflected in
  `compiled_dict.json` — all are the already-documented `"to X"`
  infinitive-suffix exclusion (bare-stem-suffixing trap), working as
  intended. Verified the exclusion applies consistently to all 11 and to
  no unrelated key.
- No duplicate keys within `corrections.json` or `phrase_maps.js`
  themselves (checked programmatically, not just by inspection).
- `compiled_dict_alternates.json` / `getAlternates()` — dead code, zero
  callers anywhere in `src/`, not a live override path. No fix needed
  since nothing reachable depends on it.

## Remaining engineering backlog (not fixed this session)

### `grammarOverrides` in `prepare-data.js` can silently beat a VERIFIED candidate

This is **not** a linguistic call — in both cases below, Claude A's own
`master_dictionary.json` notes already state the verdict explicitly. This
is purely a compile-time precedence bug: the hardcoded `grammarOverrides`
map is applied *after* `pickPrimary` runs, unconditionally, with no
`isVerified` check at all — so it can silently override a VERIFIED/HIGH
result regardless of confidence.

**`'wait'`:** `master_dictionary.json`'s notes (2026-07-25, Claude A,
third-pass native validation) state explicitly: *"Da·mo/Sengbo confirmed
imperative-only... Ua sengbo is an incorrect translation of he waits"* —
declarative is `senga`/`sengaia`. But `grammarOverrides['wait'] =
'Damo/Sengbo'` unconditionally, and `corrections.json` separately also
has bare `"wait": "Damo"`. Live-confirmed **inconsistent** behavior by
grammatical person: `"he waits"` / `"he is waiting"` → correctly
`Ua senga` (some other resolution path already avoids the stale value —
not fully traced why this specific path is fine), but `"i wait"` →
`Anga Damo` (wrong, hits the stale value).

**`'salt'`:** `master_dictionary.json`'s own notes literally say:
*"SUPERSEDED — corpus-internal audit 2026-08-01 (Claude A): legacy
unannotated import, same english key 'salt' has VERIFIED/HIGH form(s)
['kai·sim']. Not authoritative for compile; retained per citation
discipline, not deleted. Compile pipeline does not yet apply confidence
precedence — see handoff to Claude B."* — an explicit open handoff to
this role, still unresolved as of this audit. Complication found this
session: the VERIFIED `"kai·sim"` entry is itself tagged
`variant/VERIFIED/HIGH`, so `pickPrimary`'s existing `verifiedNeutral`
rule (which explicitly excludes variant-tagged candidates from winning)
would not rescue it even if the `grammarOverrides` entry were simply
deleted — most likely still resolves to the SUPERSEDED `Kari` via
master-preference/last-write-wins.

**Why not fixed now:** genuinely needs more design and verification time
than remained this session — either a scoped check (mirroring Check F's
cross-source-agreement pattern, extended to catch `grammarOverrides`
silently beating a VERIFIED/HIGH candidate) or a `pickPrimary` rule change
for "the sole VERIFIED candidate happens to carry a variant tag." Given
the project's own established discipline (see RC-CANDIDATE-036/037/038
history — overly broad automatic rules have caused new regressions
before), shipping a fix here without full verification would violate
"smallest safe fix" + "regression tests mandatory." Flagged in detail so
it's directly actionable next session.

## Repository locations still requiring engineering work

- `prepare-data.js`: `grammarOverrides` vs. VERIFIED-candidate precedence
  (above) — highest priority, has a direct citation asking for it.
- No automated check currently exists comparing `grammarOverrides`'
  final output against `pickPrimary`'s own VERIFIED-preference result —
  same architectural gap shape as the one Check F closed for
  corrections/phrase_maps vs. compiled_dict, not yet extended to this
  third override layer.
- `getAlternates()` / `compiled_dict_alternates.json` is unreachable dead
  code — not a safety issue, but worth either wiring it into the UI it
  appears to have been built for, or removing it, next time someone is in
  this area (out of scope for a pure engineering-correctness audit to
  decide alone).
