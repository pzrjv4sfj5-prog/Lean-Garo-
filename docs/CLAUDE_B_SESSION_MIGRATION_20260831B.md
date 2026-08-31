# Claude B Session Migration — 2026-08-31B

## Resume point

Resumed via `docs/CLAUDE_B_SESSION_MIGRATION_20260831.md` == prior
`.ai/WORKSTATE.yaml` state. That doc/the resume brief named `a48139f` as
the latest commit — this was stale. Actual `git fetch` + `git log` showed
HEAD at `c581ee0`, two commits ahead: Claude A had already actioned the
`pending_data_cleanup_from_b` handoff from that same doc (bye/bland
confidence-field fix, commits `6d1267a` + `c581ee0`) between that
session's close and this one's start. Resynced against the actual repo
state rather than the doc's own claim, per standing resume protocol.
`HEAD == origin/main` at `c581ee0`, working tree clean, no local commits,
confirmed before any edits.

## Task

Project Owner directive: investigate and fix the `go`/`re·ang-`
conjugation-stem decoupling engineering bug, flagged **OPEN — CLAUDE B**
in `docs/CLAUDE_A_SESSION_MIGRATION_20260830E.md`. Use A/Thangseng's
confirmed forms as given; make no linguistic decision or new Garo form;
fix only the engineering mechanism coupling the two.

## Root cause

Re-read the 20260830E doc first, then reproduced live before touching
anything:

```
translate("go")                                -> "Re·anga"   (phrase-map)
translate("he did not go")                      -> "Ua Re·angja" (grammar-assembly)
translate("she will go")                        -> "Ua Re·anggen" (grammar-assembly)
translate("he will not go")                     -> "Ua re·jawa" (grammar-assembly, RULE-030)
translate("yesterday i went to the market")     -> "Mijalde bajalchi re·anga" (correction)
translate("i am going to school")               -> "Anga skulchi re·angenga" (grammar-assembly)
```

`findVerbForm('go')` resolves through `lookupGaro('go')` →
`phrase_maps.js['go']`, and that single value was being used for two
different jobs: (a) the bare/imperative translation of "go" itself, and
(b) the stem every other tense (future, present-continuous synthesis,
negative-past) suffixes onto. `compiled_dict.json['go']` was already
correctly `re·a` (NV-100, VERIFIED/HIGH — "go" and "went" are confirmed
distinct senses), but `phrase_maps.js['go']` still held the stale
`Re·anga` value (the "went" sense) — the *only* reason the tense-suffixed
forms above weren't already broken, per Claude A's own diagnosis. Any
attempt to mechanically resync `phrase_maps.js['go']` to `re·a` without
first decoupling the two roles regressed 4 tests: `applyTense('re·a',
'future')` produces `re·gen`, not the confirmed `re·anggen`; `applyNegation
('re·a')` produces `re·ja`, not the confirmed `Re·angja`.

## Fix (engineering-scope only)

No Garo forms invented, no linguistic call made — per governance §6's
test ("if the fix can be fully justified by pointing at a single
already-existing verified value and saying the override doesn't match it
yet, it's engineering-scope"), this both resyncs an override to an
already-VERIFIED value AND separates two previously-conflated roles using
stems that are *already shipping* elsewhere in the codebase (`went` =
`re·anga`, `going` = `re·angenga`, `will go` = `re·anggen` all already
share the `re·ang-` stem before this session).

1. **`src/data/conjugation_roots.json`** (new) — `{"go": "Re·ang"}`. A
   table of verbs whose tense-suffixed forms are built on a stem
   different from their bare-form dictionary translation. Mechanically
   extracted from the already-confirmed forms above, not a new fact.
2. **`src/morphologyEngine.js`** — added `getConjugationRoot(w, garoVerb)`:
   returns `CONJUGATION_ROOTS[w]` if present, else `garoVerb` unchanged.
   No-op for every verb except `go`.
3. **`src/grammarEngine.js`** — the future/special-tense branch and the
   general negation branch (which together build every tense-suffixed
   form except the RULE-030 negative-future exception) now call
   `applyTense(getConjugationRoot(w, garoVerb), detectedTense)` /
   `applyNegation(getConjugationRoot(w, garoWithTense))` instead of
   suffixing onto the raw dictionary value directly. RULE-030's existing
   hardcoded negative-future exception (bare `re·a` root for "will not
   go") was left completely untouched — it's a separate, already-
   native-confirmed rule, and never reaches the changed code (it
   `break`s out of the loop earlier).
4. Ran `node scripts/resync-stale-overrides.mjs --apply` — this
   mechanically flipped `phrase_maps.js['go']` from `Re·anga` to `re·a`
   (the exact one candidate the script was already flagging pre-fix; it
   is by definition engineering-scope per governance §6, since the tool
   only ever proposes replacing a SUPERSEDED-matched override with the
   value `master_dictionary.json` itself already marks VERIFIED).
   `known_cross_source_conflicts.json` baseline updated automatically by
   the script (241 → 240 entries, `phrase_maps:go` removed).

## Verification (live `translate()`, not grep — governance §3)

```
translate("go")                                -> "re·a"          [changed, now correct]
translate("he did not go")                      -> "Ua Re·angja"   [unchanged]
translate("i did not go")                       -> "Anga Re·angja" [unchanged]
translate("she will go")                        -> "Ua Re·anggen"  [unchanged]
translate("tomorrow i will go to the market")    -> "Knalde bajalchi re·anggen" [unchanged, correction]
translate("he will not go")                     -> "Ua re·jawa"    [unchanged, RULE-030]
translate("yesterday i went to the market")      -> "Mijalde bajalchi re·anga" [unchanged, correction]
translate("i am going to school")               -> "Anga skulchi re·angenga" [unchanged]
translate("he did not eat")   (control, no table entry) -> "Ua Cha·ja" [unchanged]
```

Only the bare "go" output changed, and only to the value already
VERIFIED in `master_dictionary.json`/`compiled_dict.json`. Every other
tense/construction — including the control case for a verb not in
`conjugation_roots.json` — is byte-identical to before the fix.

## Test changes

- **Updated 1 stale test** (`tests/unit/translationEngine.test.js:99`):
  `{ in: 'go', expectGaro: 'Re·anga' }` → `expectGaro: 're·a'`. This
  catches the test up to the value `master_dictionary.json` already
  carries as VERIFIED/HIGH (NV-100) — not a new linguistic decision, per
  governance §6's explicit "stale test/doc assertions" carve-out.
- **Added 7 new regression tests** pinning the full affected surface so
  the two roles can't silently recouple: bare `go`, `going` (present-
  continuous synthesis), `will go` (affirmative future), `went` (exact-
  phrase correction, untouched), `did not go` for two subjects (negative
  past), `will not go` for two subjects (negative future / RULE-030,
  untouched), and a control case (`did not eat`, no table entry).

## Gate status (full re-run, all clean)

- `node prepare-data.js`: 8199/8199 entries, 927 alternates, 190 held-
  SUPERSEDED, 18 verified-ties, 5739 no-verified-candidate — all
  unchanged (zero `master_dictionary.json` edits this session).
- `node test-dictionary.js`: 8199/8199 entries, 9/9 grammatical
  corrections.
- `node repository-intelligence.js`: 0 new violations across all 7
  checks (A–G), including Check F (runtime-cascade source agreement —
  74 known/allowlisted mismatches, 0 new; the `go` entry dropped out of
  the *known* baseline automatically via the resync script's own
  baseline update, not flagged as new).
- `node scripts/resync-stale-overrides.mjs`: 0 candidates (down from 1
  pre-fix — the `go` entry). Same pre-existing `build` skip (no VERIFIED
  master candidate matches `compiled_dict`'s `gat·a` — Claude A/Owner
  linguistic call, unrelated to this session) and same 2 confirmed
  exceptions (`answer`) as before.
- `node --test tests/unit/*.test.js`: 271/271 (was 264, +7 new), 0
  failures.
- `vite build`: clean, 59 modules.
- `npm install`: run fresh (`node_modules` absent at session start;
  remains gitignored, not committed).

## Repository status at close

- [x] HEAD == origin/main (verified after push).
- [x] `git status` clean.
- [x] `.ai/WORKSTATE.yaml` updated (`claude_b.next_action`, prepended,
      additive, no history removed).
- [x] Migration doc complete (this file).
- [x] No local-only commits (verified after push).
- [x] No untracked files.

## What B did NOT touch

- No `master_dictionary.json` edits (this was purely an engine/override
  fix; the underlying linguistic data was already correct).
- RULE-030's negative-future hardcode — left exactly as-is, unaffected
  by and independent of this fix.
- The `build` `resync-stale-overrides.mjs` skip — pre-existing, Claude
  A/Owner's call, not touched.
- Subclass (b) content-triage backlog (5,739 no-verified-candidate
  keys) — unrelated to this session's scope, not acted on.
