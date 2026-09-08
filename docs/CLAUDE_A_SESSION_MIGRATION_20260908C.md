# Claude A Session Migration — 2026-09-08C

**Resumed from:** `docs/CLAUDE_A_SESSION_MIGRATION_20260908B.md`
**Repository status at close:** see §5 below.
**Stopping reason:** clean close, Batch B fully complete.

---

## 1. Resync

On arrival, `origin/main` had moved one commit past the 20260908B migration doc's stated HEAD (`5177462`): commit `80fe266` (Claude B) closed the exact `phrase_maps.js` boy/girl hardcode + married/elderly reachability handoff that doc's §4 Runtime Handoff named. No conflict with this session's work — inspected, no action needed, full gate reconfirmed green at `80fe266` before starting.

## 2. Work completed and pushed this session

**Batch B — fruit/food canonical-form directives** (`.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json`, `owner_directives_2026_09_08`), all six items closed:

- **three fish**: already correctly resolved from a prior session (`na·tok mang·gittam` verified_high, `na·tok mang·gni` correctly superseded, `two fish` untouched). Only cleanup: promoted `the three fish` unverified→verified_high (value was already correct).
- **orange**: canonical `Narang`. Un-superseded `orange`/`the orange`→`Narang` (was wrongly SUPERSEDED since a 2026-08-01 corpus audit that predates this directive). Superseded the uncited `orange`→`a·mnk` (`VERIFIED/HIGH/doc7`, no real citation) that was the sole non-variant candidate winning the pool pre-fix — retained, not deleted. Cross-referenced `Orange`→`na·rang` (idx 3479) as the same lexical item (raka/case variant, cleans identically at compile). **Duplicate-representation gap found and fixed** (Rule 8): `corrections.json`'s `"orange": "a·mnk"` override was stale and would have kept shipping the wrong value even after the master_dictionary.json fix — corrected to `"Narang"`.
- **papaya**: canonical `Modupol`. Added new verified_high rows for `papaya`/`the papaya`→`Modupol` (per the directive, `Modupol` didn't exist in the repo). Superseded the conflicting NV-080 native-cited `Papaya`→`mo·du` (idx 3491) per `owner_directive_precedence` — documented, not deleted, older native evidence doesn't veto a current Owner directive.
- **watermelon**: canonical `tor·mus`, already the sole verified candidate for the bare key. Superseded `the watermelon`→`Te·e raja`, added `the watermelon`→`tor·mus` verified_high.
- **mango**: canonical `te·ga·chu` (already Native (Thangseng)-cited, already the sole verified candidate for the bare key — no bare-key fix needed). Superseded `the mango`→`Te·gachu`, added `the mango`→`te·ga·chu` verified_high.
- **sweet potato**: canonical `ta·mil·ang`, already the sole verified candidate for the bare key. Superseded `the sweet potato`→`Ta·we`, added `the sweet potato`→`ta·mil·ang` verified_high. Also recorded provenance (`Project Owner directive`) on the previously-uncited canonical row per the directive's `required_action`.

All new/changed rows tagged with provenance `Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json schema 2026-09-08.2)` per `.ai/PROJECT_OWNER_AUTHORITY.md`'s labeling convention — never mislabeled as native quotes.

`known_dictionary_conflicts.json`: added the 4 newly-multi-valued `the X` keys (`the papaya`, `the mango`, `the watermelon`, `the sweet potato`) that Check C flagged as new self-consistency conflicts — expected, since each now legitimately holds both a superseded old row and the new verified_high canonical row.

Rebuilt via `prepare-data.js`: 8251 unique entries (unchanged count — no new *compiled* keys, only new source rows filling previously-unverified/wrong-value keys). No new pickPrimary ties introduced (all 6 canonical forms are the sole verified_high candidate for their key post-fix).

**Live-verified via `translate()`** (not just compiled_dict.json read) for all 9 touched keys: `orange`, `the orange`, `papaya`, `the papaya`, `watermelon`, `mango`, `sweet potato`, `three fish`, `two fish` — all correct, `two fish` confirmed unaffected.

Gate at close: `prepare-data.js` clean (8251 entries), `test-dictionary.js` 8251/8251 · 9/9, `repository-intelligence.js` 0 new violations (8 checks, after the `known_dictionary_conflicts.json` allowlist addition), `resync-stale-overrides.mjs` 0 candidates (after the `corrections.json` fix — 1 unrelated pre-existing `build` skip, not touched), `node --test` 379/379 (unchanged, no test added — data-only session), `runtime-error-sweep.mjs` 14747 calls, 0 errors.

## 3. Not started this session

- **Batch A** ("FINAL OPEN-ITEM CLOSURE PASS" — `able`, `male/man=me·a`, `female/woman=me·chik`, `bi·sa` semantic rule, `ska`/`skenga`/`sikenga`, explicit-object `·ko` rule, `ska·` trailing raka dot) — untouched, per the 20260908B doc's own recommended ordering (Batch B first, this next). The `ska`/`skenga`/`sikenga` cluster remains the one genuinely research-heavy item, still recommended as its own dedicated batch.

## 4. Runtime Handoff (mandatory section)

None — no engine code touched, no new engineering-affecting mismatch introduced (Check F stayed at 69 known/0 new throughout, including after the corrections.json fix).

## 5. Repository status at close (verified, not asserted)
