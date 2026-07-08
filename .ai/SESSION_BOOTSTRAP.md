# SESSION_BOOTSTRAP.md
_Read this first, before `.ai/WORKSTATE.yaml`. Last updated: 2026-07-08 by Claude B._

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
6. `git log --oneline -15` and `git status` to confirm HEAD matches
   `WORKSTATE.yaml`'s recorded head — if it doesn't, repo is ahead of the
   last recorded session; that's normal, not a conflict, unless the diff
   touches your own role's files unexpectedly.
7. Check `docs/PENDING_*` and `docs/pending_corrections.md` for anything
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

## Do not repeat (see `.ai/WORKSTATE.yaml` for full per-role lists)
- Do not re-derive the suffix paradigm table — final in
  `MORPHOLOGY_SPECIFICATION.md` §3 unless native validation changes it.
- Do not re-audit `raka` consistency across `corrections.json` — done,
  majority-vote method established, see `ARCHITECTURE.md` §9.
- Do not re-litigate Gemini-fallback removal — settled, architectural.
- Do not re-add `PROGRESSIVE_MAP`/`PAST_TO_ROOT` — confirmed dead, removed.
