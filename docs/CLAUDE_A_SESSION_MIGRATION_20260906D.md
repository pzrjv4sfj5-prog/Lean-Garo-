# Claude A Session Migration — 2026-09-06D

## Resume sequence (Rule 10)
Resumed as Claude A from `docs/CLAUDE_A_SESSION_MIGRATION_20260906C.md`.
`git fetch` found `origin/main` matching that doc's own claimed close
exactly (HEAD `4342a58`, the migration-doc-close commit itself). Read
`.ai/WORKSTATE.yaml` and `.ai/SESSION_BOOTSTRAP.md` before starting.
Also reviewed Claude C's `docs/HANDOFF_CLAUDE_A_20260906.md` (the
2026-09-05/06 audit handoff) per Project Owner instruction to check it —
item 1 (cat menggo/meng·gong) is exactly what this session closes; items
4-6 remain queued for a future session, untouched here.

## Work this session
Project Owner directly relayed, in-session, a native confirmation: cat =
Menggo. This is the explicit reconciling answer NV-134 was waiting on
(NV-134 had left the Menggo/meng·gong conflict deliberately unresolved,
per the NV-089 precedent of not silently flipping a contradiction without
an explicit answer — its same-day addendum had already found the
evidence asymmetric in Menggo's favor via NV-071's independent 2026-08-11
citation, but correctly declined to resolve on documentation-richness
alone).

Closed as **NV-135** in `docs/THANGSENG_NATIVE_VALIDATION.md`. Traced
every `master_dictionary.json` row touching either form before editing
(4 keys, not just the headword):
- `cat`→`Menggo`: superseded → verified_high
- `the cat`→`Menggo`: unverified → verified_high
- `two cat`→`menggo mang·gni`: unverified → verified_high (already
  matched the confirmed root and the established counting-family
  pattern from NV-071's "one cat" through "twenty cat" — just hadn't
  been tagged)
- `Cat`→`meng·gong`: verified_high → superseded, not deleted (its own
  citation trail never went beyond an undated "variant/VERIFIED/HIGH"
  tag, confirmed by NV-134's own archaeology)

**Rule 8 duplicate-representation check:** `src/data/corrections.json`
had no `cat` entry. `src/data/phrase_maps.js` DID — a live override
(`'cat': 'meng·gong'`) that would have kept shipping the now-superseded
value at runtime regardless of the dictionary fix. Corrected to
`'Menggo'`, comment added citing NV-135. `garo_dictionary.json` (a live
`prepare-data.js` pipeline source) was checked and already agreed
(`Menggo` for both `cat` and `Cat`) — no fix needed. `final_entries.json`
(confirmed orphaned/non-pipeline in prior sessions) still has both
`Cat`→`Menggo` and `Cat`→`meng·gong` — not touched, out of live-pipeline
scope, flagged for a future full-repo consistency pass.

**Not touched, separate pre-existing engineering bug:** `"where is the
cat?"` still resolves to `"kade mang?"`, leaking the bare animal-
classifier morpheme `mang` instead of a real word — this is Claude C's
HANDOFF item 2, already routed to Claude B, unaffected by and unrelated
to this closure.

## Gate at close
- `node prepare-data.js`: 8280 unique entries (unchanged — values-only
  edit, no keys added/removed)
- `node test-dictionary.js`: 8280/8280 valid, 9/9 grammatical corrections
- `node --test tests/unit/*.test.js`: 314/314 pass (one test was live-
  asserting the pre-fix `phrase_maps.js` value for `cat`; it now passes
  against the corrected value — not modified to assert something new,
  it was simply exercising the live cascade and caught the phrase_maps.js
  gap before push)
- `node repository-intelligence.js`: 0 new violations (Check F briefly
  flagged 1 new runtime-cascade mismatch after the dictionary-only edit,
  before the phrase_maps.js fix landed — cleared, confirmed via a second
  run)
- `node scripts/resync-stale-overrides.mjs`: 0 new candidates

Live-verified via `translate()` post-rebuild: `"cat"`, `"the cat"`,
`"Cat"` all resolve to `Menggo` (0.98–0.99 confidence); `"one cat"`
through `"twenty cat"` unchanged and still correct.

## Runtime Handoff (Claude B)
None. This closure is entirely data + a data-layer override fix
(phrase_maps.js), no engine code touched, no new engineering item
created.

## Push and resync
Committed. `git fetch` immediately before push showed no further remote
movement (HEAD still `4342a58`). Pushed fast-forward.

## Repository status at close
- [x] HEAD hash: verified == `origin/main` (see final push output)
- [x] `git status` clean, no untracked files
- [x] `.ai/WORKSTATE.yaml` updated (this session's work + prior chained
      below it)
- [x] `.ai/SESSION_BOOTSTRAP.md` — no standing-rule changes, not touched
- [x] Migration doc complete (this file)
- [x] No local-only commits — pushed and verified
- [x] No uncommitted changes
- [x] Native-validation/blocker status: NV-134 CLOSED via NV-135; all
      other prior open items unchanged
- [x] PAT rotated out of `origin` remote URL at session close (per
      standing policy — Project Owner's call on reuse timing, not
      enforced as mandatory rotation)

## Exact next step (for next Claude A)
1. **Item 4 of `docs/HANDOFF_CLAUDE_A_20260906.md`** — `leaf`/`leaves`
   plural question + evaluate whether `Re·ongkata` ("to leave") has
   enough evidence to promote to verified_high.
2. Item 5 — vocabulary gaps (`ball`, `pole`, `babies`, `cities`): confirm
   which need native input vs. which are pure engineering (regular
   pluralization).
3. Item 6 — spot-check the adjective+animal composition once Claude B's
   placeholder-row fix lands (check whether it has landed).
4. Standing carried-forward items, unchanged: `RULE-038`/`NV-109`
   tension; `NV-127` (only-X third-person); the `man·a` lexical-collision
   question; the 2 slash-variant rows; `final_entries.json`'s stale
   `Cat`→`meng·gong` row (cosmetic, non-pipeline, low priority).
