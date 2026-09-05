# Claude B Session Migration — 2026-09-05

## Project identity
Lean-Garo-: a Garo-language translation/dictionary engine
(`master_dictionary.json` -> `prepare-data.js` -> `compiled_dict.json`,
consumed by `translationEngine.js`/`grammarEngine.js`/`sentenceBuilder.js`).
Native-speaker (Thangseng) evidence is relayed via Project Owner and
logged as sequential `NV-###` entries in
`docs/THANGSENG_NATIVE_VALIDATION.md`. Two agents (Claude A, Claude B)
work concurrently in separate sessions against the same `origin/main`.

## Current state (verified, not assumed)
- **HEAD:** `fb31b7c`, pushed, matches `origin/main`. Confirmed by
  `git log -1` + `git log origin/main -1` both showing `fb31b7c`, and by
  a `git pull` immediately before the push this session returning
  already-up-to-date (no concurrent Claude A commit landed in between —
  unlike last session's collision).
- **Gate, re-run at this exact commit:** dictionary 8278/8278,
  grammatical corrections 9/9, unit tests 314/314,
  repository-intelligence.js 0 new violations, resync-stale-overrides.mjs
  0 candidates, **plus this session additionally ran
  `scripts/runtime-error-sweep.mjs` clean** (14,767 `translate()` calls
  across every compiled_dict key + plurals + counted-noun forms +
  structural/type-safety edge cases + full API surface — 0 errors), and
  `node --check` on every file under `src/` — 0 syntax errors. All
  commands and raw output are in this session's transcript.

## What's done this session
Resumed via `docs/CLAUDE_B_SESSION_MIGRATION_20260904.md`. Resync found
the doc's claimed HEAD (`009df0f`) stale by one commit: Claude A pushed
`d066005` after that doc was written (NV-127/128/129 reused for
DIFFERENT content — boy/girl/man/woman, purpose `-na`, adjective order —
than what my session had already shipped under the same numbers). This
is a genuine unresolved numbering collision, flagged this session,
**not yet fixed** — see Open issues below.

Completed the `RAKA_CLASSIFIERS` engine handoff (NV-124, flagged by
Claude A on 2026-09-03, deferred pending): Thangseng confirmed `sak`
takes no raka dot (`saksa`, not `sak·sa`); the dictionary-data half was
fixed then, but `src/garo_classifier.js`'s classifier-composition
fallback path (used only when a counted-people phrase has no exact
dictionary match) still had `'sak'` in the `RAKA_CLASSIFIERS` set.
- Removed `'sak'` from `RAKA_CLASSIFIERS` (garo_classifier.js:127).
- Updated the two stale-form regression-test assertions that were
  deliberately asserting the OLD (dotted) behavior with explicit
  "don't fix this assertion without removing sak first" comments:
  `tests/unit/rong_classifier.test.js` (`countNoun('mande', 1,
  'person')`: `'mande sak·sa'` -> `'mande saksa'`) and
  `tests/unit/translationEngine.test.js` ("she has five children" via
  grammar-assembly: `'sak·bonga'` -> `'sakbonga'`). Found the second one
  by running the full suite after the fix, not by grep alone.
- Committed as `fb31b7c`. Pulled before pushing (per this project's
  standing numbering-collision rule, generalized to all pushes this
  session) — no concurrent commit found, pushed clean.
- Live spot-checked post-fix: `mande sakchiking` (10 people, fallback
  path, no dot) while `mang`/`te` classifiers still correctly carry
  raka — confirmed the fix didn't bleed into unrelated classifiers.

**No dictionary/linguistic-data files touched this session** — engine
code (`garo_classifier.js`) + 2 test files only.

## Open issues (with root cause where known)
1. **NV-127/128/129 numbering collision with Claude A's `d066005`** —
   genuinely unresolved, flagged to Project Owner this session, **not
   yet fixed, no decision made**. My session's NV-127/128/129 (only-X
   third-person scope / `bano` where-question / `jedakode`+`maikai`
   purpose clauses) landed on `origin/main` first (`009df0f`, merged
   before Claude A's session started). Claude A's `d066005` (boy/girl/
   man/woman, purpose `-na`, adjective order) pushed after, reusing the
   same three numbers for unrelated content. Root cause per Claude A's
   own migration doc (`docs/CLAUDE_A_SESSION_MIGRATION_20260904D.md`):
   it believed "no other Claude touched the repo" since `7acf794`,
   which was stale — my session's merge (`009df0f`) happened in
   between and Claude A didn't re-pull before continuing. Per this
   project's standing rule (renumber the not-yet-pushed side, never
   overwrite what's already on `origin/main`), Claude A's three
   findings should be renumbered to NV-130/131/132 across
   `.ai/WORKSTATE.yaml`, `master_dictionary.json`,
   `docs/grammar_rules_structured/RULE-009.yaml`,
   `docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`, and
   `docs/PICKPRIMARY_VERIFIED_TIES.md` (the 5 files `d066005` touched
   with NV-127/128/129 references) — **but this was proposed to the
   user, not yet actioned or confirmed.** Do not assume it's resolved.
2. **NV-127 (only-X third-person)** — still genuinely blocked on native
   evidence, unchanged since last session. Next step: ask Thangseng
   directly for actual third-person sentences ("he is the only
   teacher" / "she is the only doctor") plus what "depending on the
   intention" means.
3. **RULE-038 `sak·sa` tension** — still open, pre-existing, untouched
   this session.
4. **Two word-tensions from NV-129** — `merong` vs `mi` (rice),
   `Gisik nange poraibo` vs `po·ri·a` (study). Still not resolved, not
   asked about yet.
5. §8 of `GARO_GRAMMAR_REFERENCE.md`: the "i went to the market to buy
   rice" engine bug (location-noun dropped) — status **still not
   re-verified**, unchanged since last session.
6. Claude A's own carried-forward item (`d066005`'s migration doc):
   `Chattri`/`Chattro` full range vs. the new NV-127(Claude A) boy/girl
   pair — flagged as "worth a light sanity pass sometime, not urgent",
   not this session's concern but noting it exists.

## Standing rules established (in addition to prior sessions' rules)
- Before pushing, `git pull` first even for a session that started
  mid-conversation (not just at session-resume) — this session did so
  and it caught nothing, but it's now the default habit going forward,
  since the collision above happened specifically because a prior
  session skipped this step.
- After removing a classifier/rule from an engine `Set` or table,
  search test files for the OLD (stale) value before considering the
  fix done — `grep` for the literal old string across `tests/` is
  cheap and this session's second stale assertion
  (`translationEngine.test.js`) was only found by running the suite,
  not by reading the one file flagged in the original handoff comment.
- When told to "ensure no runtime errors" (or equivalent), use
  `scripts/runtime-error-sweep.mjs` if it exists in the repo rather
  than ad-hoc spot-checks alone — it already covers the full
  dictionary key space + edge cases and is authoritative for this
  project.

## Exact next step
Two independent, unblocked options (no dependency between them):
(a) **Decide and act on the NV-127/128/129 renumbering collision**
    (Open issue 1) — needs a Project Owner decision on whether to
    proceed with renumbering Claude A's three findings to
    NV-130/131/132, or handle differently.
(b) Ask Project Owner to relay the NV-127 follow-up question to
    Thangseng (Open issue 2) — the only other unblocked, unassigned
    item.
`git pull` (or fresh clone) first regardless of which is picked;
`npm install` if `node_modules` is missing; run the full gate once as
a resync check before any new edit.

---
**Start a new conversation and paste this document in to resume.**
