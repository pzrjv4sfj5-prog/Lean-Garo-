# Claude B Session Migration — 2026-09-05C

## Project identity
Lean-Garo-: Garo-language translation/dictionary engine
(`master_dictionary.json` -> `prepare-data.js` -> `compiled_dict.json`,
consumed by `translationEngine.js`/`grammarEngine.js`/`sentenceBuilder.js`/
`garo_classifier.js`). Native-speaker (Thangseng) evidence relayed via
Project Owner, logged as `NV-###` in `docs/THANGSENG_NATIVE_VALIDATION.md`.
Multiple agents (Claude A, B, C) work concurrently against the same
`origin/main`; standing rule: `git pull` before every push, renumber the
not-yet-pushed side on NV-number collisions, never overwrite what's
already on `origin/main`.

## Current state (verified, not assumed)
- **HEAD:** `49cfbe7`, matches `origin/main`. This session was a
  **read-only audit** (Project Owner's explicit spec, reproduced in full
  in the audit report — no dictionary/engine/test file was ever touched).
  `git status --porcelain` clean at close; only scratch diagnostic
  scripts existed mid-session and were deleted before finishing, never
  committed.
- Data has NOT changed since this session started (`045cb6f` ->
  `49cfbe7` is Claude A's session-close commit — `.ai/WORKSTATE.yaml` +
  their own migration doc only, no dictionary/engine changes). This
  session's live `translate()` probes are therefore still valid against
  current HEAD; no re-run needed on resume unless something else lands
  first — `git pull`/resync check per standing rule regardless.
- Gate/full test suite: **not re-run this session** (out of scope — audit
  spec explicitly said audit-only, and no code was touched that would
  invalidate the last-known-passing state from `045cb6f`'s own session).

## What's done this session
Ran the Project Owner's attached "Full-Scale Translation Integrity
Audit" spec in full (word/phrase/sentence/verb/adjective/duplicate-key/
lemmatization/coverage sections). Delivered as a standalone report,
**not committed to the repo** (audit spec's own "leave repo unchanged"
rule) — handed to Project Owner directly as a file. Full detail, code
line references, and all repro commands are in that report; not
reproduced here in full per this doc's own token-discipline convention.
**Headline findings** (mechanically confirmed against live `translate()`
+ static scans of `master_dictionary.json`/`compiled_dict.json`/
`phrase_maps.js`, current HEAD):

1. **`cat` word-vs-counting-family root conflict — genuinely unresolved,
   see "Conflicts with Claude A's session" below.** Three independent
   sources hold different roots for the same lexeme (`phrase_maps.js`
   hardcode + word-level dict entry = `meng·gong`, vs. the native-
   confirmed counting family = `menggo`, cited directly to Thangseng in
   the "one cat" row's own note). `"two cats"` (correct English plural)
   currently resolves to `meng·gong mang·gni` via a fallback lookup that
   never consults the counting family at all, because the counting
   table is keyed by literal singular text (`"two cat"`, never
   `"two cats"`).
2. **Generalizes beyond cat:** 5/67 nouns with a counted-phrase family
   have this same phrase-vs-word root mismatch (`cat`, `coin`, `chair`,
   `fruits`, `mountain`).
3. **New finding, not in the original bug report:** every
   `[adjective]+[animal]` phrase entry collapses to a shared generic
   placeholder root regardless of species — `"big dog"`/`"big cat"`/
   `"big bird"` all currently ship the identical `"gonga mang"`. Traced
   to `master_dictionary.json` row level (`unverified`, bulk-generation
   defect), not a propagation issue.
4. Phrase-table adjective+noun composition and the sentence-assembler's
   own adjective+noun composition are two independently-maintained code
   paths for the same content (`"big dog"` vs `"the big dog is
   sleeping"`) — a fix to one will not fix the other.
5. 65 `master_dictionary.json` keys have ≥2 mutually-exclusive
   `verified_high` values with no schema field to mark which one (if
   either) is the resolved answer.
6. Zero test coverage on `cat` as word/phrase/sentence anywhere in
   `tests/`. `repository-intelligence.js` Check C already detects all
   1,619 known conflicting keys every run but auto-allowlists rather
   than requiring resolution — the tooling that could catch this has
   been silent on it by design, not by oversight.

## Conflicts with Claude A's session — needs Project Owner adjudication before any fix
Claude A's `docs/CLAUDE_A_SESSION_MIGRATION_20260905B.md` (same day,
commit that produced `045cb6f`) investigated a Project-Owner claim that
`cat`=`Menggo` was wrong and concluded **"cat was ALREADY CORRECT —
`Menggo` has been tagged SUPERSEDED... live `translate("cat")` already
correctly ships `meng·gong`; no bug, no action taken."** That check only
looked at the bare word. **This session's audit disagrees**, on
different evidence Claude A's pass didn't examine: the counting-phrase
family (`"one cat"`...`"twenty cat"`) is *also* `verified_high` and
cites Thangseng *directly* ("three cat" = "Menggo mang·gittam" — root
`menggo`, no dot), and disagrees with `meng·gong`. Both sessions are
citing genuine native-adjacent evidence for opposite roots. **This is
not something either agent should resolve unilaterally** — it needs an
explicit Thangseng-sourced answer to "is the cat word `menggo` (no dot)
or `meng·gong` (with dot)?" before any fix touches `cat` specifically.
The other 4 nouns in Defect-class-2 (`coin`, `chair`, `fruits`,
`mountain`) and Defect-class-3 (adjective+animal placeholder) do **not**
have this ambiguity — no conflicting native citation exists for those,
just an unreconciled data-pipeline defect — so they're safe to fix
without waiting on native input.

## Standing rules established this session
- When Project Owner or a prior session's migration doc asserts "no bug
  here" / "already correct," re-verify from first principles anyway if
  a broader audit surfaces adjacent evidence — a narrow bare-word check
  can miss a phrase-family-level conflict on the exact same lexeme (this
  is exactly what happened between Claude A's elephant/cat check and
  this session's audit).
- Audit-only tasks: confirm `git status --porcelain` clean and HEAD
  unchanged *before* reporting completion, not just after — this
  session verified both.

## Directive for next session (Project Owner, this message)
**"These bugs need to be eliminated. Zero run time tolerance, all
updates without fail."** Read as: every defect in the audit report is
now in scope to actually fix (not just document), fixes must not
introduce any new runtime error across the full dictionary/edge-case
surface (`scripts/runtime-error-sweep.mjs` must stay clean, 0 errors,
after every change — treat this as a hard gate, not a nice-to-have),
and nothing should ship half-fixed. Per this project's own "one task at
a time" discipline, do NOT batch all 6 findings into one commit.

## Exact next step
1. `git pull` (or fresh clone) first regardless; `npm install` if
   `node_modules` missing; run the full existing gate once (unit tests,
   `repository-intelligence.js`, `runtime-error-sweep.mjs`) as a resync
   baseline before any edit — this session did not touch code so the
   last-known-passing state should still hold, but confirm rather than
   assume.
2. **Start with the safest, unambiguous fix first:** Defect-class-3
   (adjective+animal generic-placeholder collision, finding #3 above) —
   no native-evidence ambiguity, root cause already isolated to specific
   `master_dictionary.json` rows, and it's currently shipping silently
   wrong for every animal, not just one.
3. Then Defect-class-2 for the 3 unambiguous nouns (`coin`, `chair`,
   `fruits`, `mountain` — NOT `cat`, see conflict above) — reconcile
   each noun's counted-phrase-family root against its own standalone
   compiled entry.
4. Relay the `cat`-specific `menggo` vs `meng·gong` question to
   Thangseng before touching `cat` at all; hold that one node open until
   an explicit answer comes back.
5. Architecture item (phrase-table vs sentence-assembler duplicate
   composition logic, finding #4) and the 65-key `verified_high`-vs-
   `verified_high` schema gap (finding #5) are larger structural work —
   flag for a design pass, not a quick patch, per this project's own
   precedent for architecture-scale findings.
6. After each fix: re-run `runtime-error-sweep.mjs` + full unit suite +
   `repository-intelligence.js` before moving to the next item (zero
   run time tolerance — do not proceed on a fix that introduces even
   one new error/regression).

---
**Start a new conversation and paste this document in to resume.**
