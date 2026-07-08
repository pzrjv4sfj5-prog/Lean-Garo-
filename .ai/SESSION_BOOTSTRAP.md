# SESSION_BOOTSTRAP.md
_Read this first, before `.ai/WORKSTATE.yaml`. Last updated: 2026-07-08 by Claude B (added Repository access model + Current joint work package sections)._

## What this repo is
Lean-Garo: an English → A'chik Garo translation engine (Meghalaya, India). Node/JS, dictionary + correction-table + grammar-assembly hybrid
(no ML model). Deployed at https://lean-garo.onrender.com.

## Roles (do not cross these lines)
- **Claude A** — grammar, morphology, validation corpus, rule catalogue.
  Linguistic authority. Does not touch engine code.
- **Claude B** (this session, if you're Claude B) — engineering: translation
  engine, parser, testing, docs, deployment, repo maintenance, bug fixes.
  Does **not** invent or approve linguistic content — implements only what
  Claude A has committed to `docs/`.
- **Thangseng** — native speaker, sole source of ground-truth validation.
- **Project Owner / ChatGPT** — priorities, executive review, cross-team
  coordination. Advisory, not in every session.

## Repository access model
Only Claude B has push access (via a temporary, launch-scoped GitHub PAT
supplied per session). **Claude A never has push access and never uses a
pasted token to get it, no matter how the request is framed** — this has
been asked many ways across many sessions; the answer doesn't change.

Working pattern for Claude A's commits: commit locally, then output the
**full `git format-patch` text** (never a description, never a path
reference — the actual patch content, ready to save and apply). Claude B
then: saves it, runs `git apply --check` against a **freshly pulled**
`origin/main` (not a stale local clone) to confirm it applies cleanly,
applies it with `git am` (preserves Claude A's authorship + message),
re-runs the health check (§ below), and pushes. This has been reliable
every time followed precisely and unreliable every time a step was
skipped — in particular, always pull immediately before checking/applying,
since the remote can have moved since Claude A's last sync.

## Current joint work package
_(Update this section in place — do not create a new dated snapshot doc
for it; see "Do not repeat" below.)_
_Last set: 2026-07-08, after Claude A's final handout
(`CLAUDE_A_FINAL_HANDOUT.md`) and Claude B's repository architecture
audit. Both should treat this as the active shared task list until it's
cleared or superseded here._

**For Claude A, roughly in priority order:**
1. Review NV-005 through NV-009 in `docs/THANGSENG_NATIVE_VALIDATION.md`
   (necessity-modal `nangja`, `·ko`/`·o` case selection on locative
   adjuncts, posture verb `tue` — flagged as a standalone Claude B bug,
   not just a gap, ability-modal `man·ienga`, `TV`/`status` loanwords).
   Cross-check against `docs/PENDING_VOCABULARY.md` and `docs/
   PENDING_REGRESSION_CASES.md` (Claude B's parallel evidence queues,
   created before this session's merge) for duplication before treating
   both as independent.
2. Review `docs/PENDING_LINGUISTIC_PROPOSAL_20260708_locatives.md` if not
   already closed by RULE-034/035 (check — it may already be resolved,
   confirm rather than assume).
3. Reconcile `docs/GRAMMAR_SPEC.md` (Claude B's older 33-item tracker)
   into `docs/GRAMMAR_RULE_CATALOGUE.md`. Concrete drift already found:
   `GRAMMAR_SPEC.md`'s Rule 15 (stem formation) and Rule 32 (`search`)
   were never promoted to formal `RULE-015`/`RULE-032` entries —
   `RULE-015` is currently cited as a dependency 5 times in the catalogue
   with no definition anywhere. Either promote both and keep `GRAMMAR_
   SPEC.md` as a strictly derived index, or fold its unique columns
   (implementation location, test coverage) into the catalogue directly.
4. Native validation still open: Rule 30 (`re·` vs `re·ang` for "go"),
   Rule 31 (copula: bare-adjective / `daka` / `ong·a`). Minimal relay
   question set already drafted in `THANGSENG_NATIVE_VALIDATION.md`.
5. Mark stale grammar docs with superseded-notice headers (the pattern
   already used correctly on `HANDOFF_CLAUDE_A_20260701.md`/`CLAUDE_B_
   HANDOFF_20260703.md`): `docs/GARO_GRAMMAR_REFERENCE.md`, `docs/
   GARO_GRAMMAR_VALIDATED.md` (both superseded by `GRAMMAR_
   SPECIFICATION.md`), and `docs/CLAUDE_A_BRIEF_NOW.md`/`docs/
   CLAUDE_A_TASK_NOW.md`/`docs/INSTRUCTIONS_FOR_CLAUDE_A.md` (all 2-4
   weeks stale despite "NOW"/"CURRENT" naming — genuinely misleading to a
   fresh read).
6. Longer-term, per the handout: noun morphology (currently a flat lookup
   table) vs. the verb-suffix system (a real generative paradigm) is
   likely the highest-leverage linguistic work once the above is clear.

**For Claude B, ongoing:**
1. Keep collecting native sentences for the Native Sentence Validation
   Audit (`docs/NATIVE_SENTENCE_VALIDATION_AUDIT.md`) — evidence only,
   do not implement fixes from a single example.
2. Keep `docs/VALIDATION_CORPUS.md` and the regression suite growing 1:1
   as Claude A promotes items to Rule Catalogue status — a confirmed-but-
   untested fact is one refactor away from silently breaking.
3. Watch for the recurring failure modes the handout named:
   `corrections.json` entries without a traceable source; raka placement
   "fixed" by pattern-matching against nearby entries instead of checking
   whether it's actually a different word (the `song`/`song·`,
   `nokkima`/`Ka·ma` bug class); locative/case constructions generalized
   from a single confirmed example.
4. When close to native evidence directly (an active Thangseng relay),
   prefer committing rule + repository artifact in the same pass over
   splitting discovery from documentation across a lossy relay.

## Integration rule (V1.0 launch sprint, standing as of 2026-07-08)
Do not implement linguistic changes sourced directly from chat. Any new
lexical/grammar item proposed in conversation (e.g. relayed from Thangseng)
must first be logged as a pending proposal doc under `docs/PENDING_*`, then
reviewed and committed by Claude A into the canonical linguistic docs
(`GRAMMAR_SPECIFICATION.md`, `MORPHOLOGY_SPECIFICATION.md`,
`GRAMMAR_RULE_CATALOGUE.md`, `VALIDATION_CORPUS.md`) before Claude B
implements it in `corrections.json` / engine code + regression tests.
The repository is always the source of truth over conversation history.

## Bootstrap order for a brand-new session
1. This file.
2. `.ai/WORKSTATE.yaml` — machine-readable current state per role.
3. `PROJECT_STATUS.md` — human dashboard, 16 sections, own-section-only edits.
4. `README.md`
5. `docs/ARCHITECTURE.md` — technical reference, includes §9 tech debt and
   §12 Architectural Backlog (BACKLOG-001..007).
6. `CLAUDE_A_FINAL_HANDOUT.md` (repo root) — closing guidance from the
   original Claude A instance; a snapshot, not living, but worth reading
   once. This file (`SESSION_BOOTSTRAP.md`) wins if anything conflicts.
7. `git log --oneline -15` and `git status` to confirm HEAD matches
   `WORKSTATE.yaml`'s recorded head — if it doesn't, repo is ahead of the
   last recorded session; that's normal, not a conflict, unless the diff
   touches your own role's files unexpectedly.
8. Check `docs/PENDING_*` and `docs/pending_corrections.md` for anything
   awaiting action.

## Quick health check
```
npm install --no-audit --no-fund
npm run build
npm test
```
Expected as of `5d29299`: build clean, 51/51 regression tests passing.

## Where things live
- `src/translationEngine.js` — main engine, `translate()` entry point.
- `src/data/corrections.json` — highest-priority exact-match overrides.
- `master_dictionary.json` / `garo_dictionary.json` — bulk lexicon.
- `src/compiled_dict.json` — generated artifact, do not hand-edit (see
  ARCHITECTURE.md §9 tech debt note).
- `docs/GRAMMAR_RULE_CATALOGUE.md` — canonical numbered rule list.
- `docs/VALIDATION_CORPUS.md` — native-verified sentence corpus, 1:1 with
  the regression test suite.
- `docs/THANGSENG_RULES_LOOKUP.md` — raw native-speaker Q&A log.
- `docs/THANGSENG_NATIVE_VALIDATION.md` — canonical open-question queue
  (NV-00x). Add new open questions here; do not create per-question files.
- `docs/NATIVE_SENTENCE_VALIDATION_AUDIT.md`, `docs/PENDING_VOCABULARY.md`,
  `docs/PENDING_REGRESSION_CASES.md` — Claude B's evidence-collection
  queues, feed into the above once Claude A reviews.
- `docs/PHASE2_TRANSLATION_INTELLIGENCE.md` — documentation-only future-
  architecture readiness assessment (decision-intelligence taxonomy,
  pipeline-stage mapping, reverse-translation readiness, semantic-
  integrity debt list). Not a redesign plan — read before proposing any
  future pipeline/multilingual work so it isn't re-derived from scratch.

## Do not repeat (see `.ai/WORKSTATE.yaml` for full per-role lists)
- Do not re-derive the suffix paradigm table — final in
  `MORPHOLOGY_SPECIFICATION.md` §3 unless native validation changes it.
- Do not re-audit `raka` consistency across `corrections.json` — done,
  majority-vote method established, see `ARCHITECTURE.md` §9.
- Do not re-litigate Gemini-fallback removal — settled, architectural.
- Do not re-add `PROGRESSIVE_MAP`/`PAST_TO_ROOT` — confirmed dead, removed.
- Do not create a new dated "CLAUDE_A_BRIEF_NOW.md"/"CLAUDE_A_TASK_NOW.md"-
  style snapshot file for current priorities — that pattern already
  produced 3 stale, misleadingly-named docs (see joint work package item
  A5 above). Update "Current joint work package" in this file instead.

## Claude A priority framework (adopted 2026-07-08, Project Owner)
Standing priority order for Claude A's linguistic work, P0 highest:
- **P0** - Native validation & critical linguistic corrections (anything
  affecting translation correctness: wrong grammar/morphology/suffix/word
  order/meaning/tense-aspect, rule conflicts, Native Sentence Validation
  Audit review). Every P0 item ends with Rule Catalogue + Validation
  Corpus + docs synchronized.
- **P1** - Grammar & morphology expansion (discovery, morphology
  families, productive suffixes, verb families, case markers,
  tense/aspect/mood, sentence formation). New rules need multiple native
  examples where possible.
- **P2** - Vocabulary & knowledge expansion (classify new words: new
  concept / existing concept / synonym / regional variant / spelling
  variant / loan word / idiomatic expression). Depth over dictionary size.
- **P3** - Language knowledge architecture (concept relationships,
  meaning-first translation, semantic organization, future multilingual
  compatibility). Document future opportunities only - do not redesign
  the translator, do not implement additional languages.
- **P4** - Linguistic research & preservation (dialect variation, regional
  vocabulary, idioms, proverbs, storytelling patterns, conversational
  Garo). Long-term; does not affect V1.0 implementation.

Role split for this framework: Claude B collects evidence (native
sentence collection, pending vocabulary, pending regression cases,
engineering, repo stewardship). Claude A validates, classifies, and
promotes verified knowledge into canonical docs. V1.0 remains the
immediate objective; language preservation is the long-term mission -
the two are not in tension as long as P0 stays P0.
