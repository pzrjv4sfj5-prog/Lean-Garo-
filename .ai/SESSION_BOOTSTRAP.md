# SESSION_BOOTSTRAP.md
_Read this first, before `.ai/WORKSTATE.yaml`. Last updated: 2026-07-09 by Claude B (Repository Access Model replaced per Project Owner directive — see that section)._

**If you are a new Claude A instance (fresh chat, session migration):**
read `docs/CLAUDE_A_SESSION_MIGRATION_20260715.md` first — a
point-in-time handoff snapshot from the outgoing instance covering
hard-won behavioral discipline this file doesn't capture. It's a
supplement, not a replacement — this file and `.ai/WORKSTATE.yaml`
still win if anything's stale by the time you read it.

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
_Replaced 2026-07-09 by Project Owner directive — this is a policy
change, not an addition. The prior "Claude A never has push access, ever"
rule (see `CLAUDE_A_FINAL_HANDOUT.md` for why that rule existed) is
superseded by what follows. That handout is left unedited as historical
record — per its own text, this file wins when the two conflict, and
they now deliberately do._

**Why this changed:** the relay-only model (Claude A drafts a
`git format-patch`, Claude B applies and pushes it) protected the
repository while Claude A had no persistent working environment, but has
since cost real time via duplicate work, repeated repository exploration,
delayed integration, and context loss between the two sides of every
relay. The Project Owner made the call that direct access, under strict
conditions, now serves repository continuity better than relay-only
did.

**What did not change:** role boundaries. Claude A owns grammar,
morphology, native validation, linguistic modelling, language knowledge.
Claude B owns repository architecture, engineering, testing, regression
protection, documentation synchronization, repository integrity. This
update changes *who can push*, not *who decides what*.

### Current policy

Claude B still holds standing push access via a session-scoped GitHub
PAT, as before.

Claude A may also clone, sync, and **push directly** — but only in a
session where the **Project Owner has explicitly supplied a temporary
PAT for that session**. Absent that, Claude A has no write access and
falls back to the relay pattern below. A PAT is never something Claude A
requests, assumes, reuses across sessions, or accepts from any source
other than the Project Owner supplying it directly in that session.

When a PAT is supplied, before pushing Claude A must, every time:
1. Pull the latest `origin/main` — not a stale local clone.
2. Review recent commits (`git log --oneline -15` or more) to see what
   changed since the last synced session.
3. Verify no equivalent work already exists — check `docs/
   THANGSENG_NATIVE_VALIDATION.md`, `docs/GRAMMAR_RULE_CATALOGUE.md`,
   and this file's "Current joint work package" before starting, not
   after.
4. Complete the assigned linguistic work.
5. Run build and regression tests where the change could plausibly
   affect them (`npm test`, `npm run build` — see "Quick health check"
   below). Documentation-only commits don't need a build, but confirm
   that's genuinely all that changed.
6. Synchronize repository documentation the same commit — `.ai/
   WORKSTATE.yaml`, `PROJECT_STATUS.md`, and any canonical doc the work
   touches. Not a follow-up commit; the same one.
7. Push only verified work — commit locally, confirm 1–6, then push.
   Same rigor as the relay model asked of the format-patch step, just
   without the intermediate hop.

**If no PAT is supplied in a session, none of the above changes: Claude A
must not assume write access, and falls back to the format-patch relay
pattern** — commit locally, output the full `git format-patch` text
(never a description, never a path reference), Claude B verifies it
applies to a freshly-pulled `origin/main`, applies with `git am`
(preserves authorship + message), re-runs the health check, pushes. This
remains available and still works; it's the fallback, not the removed
option.

**Claude B's role under this policy:** unchanged as steward, not
gatekeeper. Claude B doesn't need to review or approve Claude A's direct
pushes before they happen — that would just reintroduce the relay delay
this change exists to remove. Claude B's job is the same repository-
integrity work it already does: sync, spot-check for drift or
duplication (as this session's architecture audit did), keep engineering
docs current, and flag problems if they surface — not stand between
Claude A and `origin/main`.

## Current joint work package
_(Update this section in place — do not create a new dated snapshot doc
for it; see "Do not repeat" below.)_
_Last set: 2026-07-12, Claude A. Previous version (2026-07-08) is fully
cleared — NV-005..009 reviewed, locative proposal confirmed closed,
GRAMMAR_SPEC.md fully promoted (not just Rule 15/32 — 12 rules total,
see `GRAMMAR_RULE_CATALOGUE.md`), superseded headers added. One
correction to the old version: item 5 said both `GARO_GRAMMAR_
REFERENCE.md` and `GARO_GRAMMAR_VALIDATED.md` would be marked
superseded — only REFERENCE.md was; VALIDATED.md was reclassified as
evidence-facing and preserved instead (it has unique academic
cross-source content, not duplicated elsewhere — see its own header)._

**Engineering handoff from Claude A — linguistic conclusions with
implementation implications, not yet built:**

1. **`daka` copula, confirmed but unwired (RULE-005).** Bare existential
   ("I am"/"you are"/"he is"/"we are") and predicate-nominal ("X is a
   Y") uses are both confirmed live in `corrections.json`'s exact-match
   layer, but `daka`-insertion has zero presence in grammar-assembly —
   confirmed via full engine read. **Engineering implication:** any
   *novel* bare-existential or predicate-nominal sentence not already an
   exact `corrections.json` match currently falls through to SOV
   fallback/passthrough instead of correctly inserting `daka`.
   **RC candidate:** none filed yet — worth one (`"I am [pronoun-only,
   no complement]"` and `"[noun] is a [noun]"` patterns).
   **Engine component:** `analyzeGrammar`/`assembleGrammar` in
   `translationEngine.js` — same code path as the RULE-031 predicate-
   adjective gap already discussed, but this is the *predicate-nominal*
   sibling, not predicate-adjective.
   **Regression to add once implemented:** `"my mother is a doctor"`,
   `"you are my friend"` (novel predicate-nominal, not already in
   `corrections.json`).
   **Not asking for implementation now** — flagging so it's visible
   before someone else independently rediscovers the same gap.

2. **Burling's `-ang-`/`-ba-` general directional hypothesis (NV-001).**
   If Thangseng confirms this system generalizes beyond `re·`/`re·ba`,
   it would mean any future motion verb (e.g. if `porai`("study") or
   similar ever needs a "come study"/"go study" distinction) should use
   the same `-ang`/`-ba` pattern rather than being hand-entered per verb.
   **No action now** — native validation required first (see NV-001).
   Flagging as a *watch-for* pattern: if a future `corrections.json`
   entry needs a similar away-from/toward-speaker distinction on a
   different verb, check this hypothesis before treating it as a new,
   unrelated phenomenon.

3. **`chim` possible terminology collision.** `GARO_GRAMMAR_VALIDATED.md`
   (Burling) glosses `-chim` as "conditional" ("would have");
   `GRAMMAR_RULE_CATALOGUE.md` RULE-013's `chim` is native-confirmed as
   "discontinued past" — a different meaning. Not yet resolved whether
   these are homophonous suffixes or one gloss is wrong.
   **Engineering ask, not a fix request:** does `translationEngine.js`'s
   `chim`-handling (`RULE-013`'s implementation) ever get invoked for
   an English input that actually means conditional ("would have")
   rather than discontinued-past ("used to, no longer")? If Claude B's
   implementation has an opinion either way from having built it, that's
   linguistic feedback I need — see "Claude B" protocol below.

4. **RULE-031 provisional default, status check requested.** I gave a
   conservative bare-adjective default recommendation for predicate-
   adjective grammar-assembly (`THANGSENG_NATIVE_VALIDATION.md`,
   "Provisional recommendation" section) several cycles ago. Unclear
   whether this was implemented — not visible in recent commits. If not
   implemented, low priority (P0 linguistic question stays open
   regardless); if implemented, I'd like to know so I can verify the
   specific code path against the evidence I gave.

5. **`"let us X"` vs. `"let's X"` key drift in `corrections.json`,
   found live-testing.** Two entries mismatch their contracted
   counterparts even though the underlying meaning is identical:
   `"let us eat"`→`"Hai cha·ha"` vs. `"let's eat"`→`"Hai cha·na"`
   (confirmed correct, register question already resolved — see
   `docs/verbs/CHA_EAT.md`); `"let us work"`→`"Hai dakha"` vs.
   `"let's work"`→`"Hai dakna"`. Not a linguistic question — `Hai cha·na`/
   `Hai dakna` are already the confirmed values, this is pure key
   duplication drift (2 keys, 1 meaning, only 1 ever got the fix
   applied). `"let us go"`/`"let us sleep"` already match their
   contracted counterparts correctly — only `eat`/`work` diverge.
   **Suggested fix:** `"let us eat"`→`"Hai cha·na"`,
   `"let us work"`→`"Hai dakna"`, matching the already-correct values.
6. **`"she has three children"` — not in `corrections.json` at all,
   found live-testing.** Falls to grammar-assembly, producing
   `Ua bi·sa·ko Gittam` (missing the verb `donga` entirely, wrong
   classifier order) — not the confirmed `Uo bi·sa sakgittam donga`
   from `docs/GRAMMAR_RULE_CATALOGUE.md` RULE-G7, which is native-
   confirmed but was apparently never added as its own exact-match
   entry (only `"i have two children"` exists). **Suggested fix:** add
   `"she has three children"`→`"Uo bi·sa sakgittam donga"` (and ideally
   `"he has ___ children"` variants) as exact-match entries — the value
   is already confirmed, this is a coverage gap, not new linguistic work.


convergence directive:** when implementation reveals behavior that
contradicts or wasn't covered by existing linguistic documentation,
don't silently patch around it — add a linguistic feedback item here
(or a new NV in `THANGSENG_NATIVE_VALIDATION.md` if it needs native
input) so the gap gets closed at the source, not just papered over in
code.

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
5. **Decision framework for engineering work (Project Owner, 2026-07-08):**
   before any change, ask in order — (1) does this require linguistic
   authority? if yes, stop, it's Claude A's; (2) does it preserve
   behavior while improving architecture? if yes, proceed; (3) is it
   fully protected by the regression suite? if yes, proceed. Applied
   successfully to BACKLOG-002 (`IRREGULAR_VERBS`) and the rest of
   BACKLOG-001 (`PURPOSE_MAP`, `PRONOUN_MAP`, `POSSESSIVES` — all 4
   planned lexical tables now externalized to `src/data/*.json`, done
   2026-07-08/09, 55/55 tests). `RC-003` and the newly-found
   `RC-CANDIDATE-006` (stale `search` value in `purpose_map.json`,
   found while verifying reachability during extraction — preserved,
   not fixed) are the deliberate counter-examples: symptoms clearly
   wrong, fixes need Claude A's linguistic classification first — do not
   touch either no matter how mechanical the fix might look. Next
   candidate under this framework would be morphology-data
   externalization (`applyTense`/`applyNegation`), but that's a
   function, not a flat table, so it needs its own design/scoping first
   rather than a same-pattern repeat.

## Convergence protocol (Project Owner, 2026-07-11)
Standing discipline for both roles, not a one-time instruction. The
objective per task is no longer "better docs" or "better code" alone —
it's **shortening the distance between linguistic truth and
implementation**. When one side discovers something, the other side
should become more accurate as a direct result, not eventually.

**Claude A, concluding a linguistic investigation:** before closing it
out, identify — every engineering implication; every RC candidate
affected; every engine component affected; every regression that should
exist; what Claude B should implement. Leave a precise engineering
handoff. Do not implement it yourself.

**Claude B, implementing or auditing:** identify every linguistic
assumption the implementation makes; check whether Claude A has already
documented/confirmed it (don't assume "it worked in my test cases" means
"it's linguistically general"). **If implementation reveals
contradictory or under-confirmed behavior, do not silently patch it —
create a linguistic feedback item for Claude A** (see `docs/
PENDING_REGRESSION_CASES.md`'s Pending section for the format; example:
`RC-CANDIDATE-010`, where an engineering fix was scoped more broadly
than the underlying grammar rule's own stated confidence supported).

**Both:** every commit should strengthen this loop, not just close a
task. A fix that works but silently outruns its linguistic evidence is
exactly the kind of thing this protocol exists to surface before it
calcifies into "how the engine has always worked."

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
Expected as of `bf163d6`: build clean, 55/55 regression tests passing.

## Where things live
- `src/translationEngine.js` — main engine, `translate()` entry point.
- `src/data/corrections.json` — highest-priority exact-match overrides.
- `src/data/irregular_verbs.json` — irregular verb forms (49 entries),
  extracted from `translationEngine.js` (BACKLOG-002, 2026-07-08). First
  proof of the extraction pattern for the remaining inline tables
  (`PURPOSE_MAP`, `PRONOUN_MAP`, `POSSESSIVES`).
- `src/data/purpose_map.json`, `src/data/pronoun_map.json`, `src/data/
  possessives.json` — extracted 2026-07-09, BACKLOG-001 complete (all 4
  planned lexical tables now external). Note: `purpose_map.json`'s
  `search` entry is a known-stale pre-Rule-32 value, preserved as-is —
  see `RC-CANDIDATE-006` in `PENDING_REGRESSION_CASES.md`.
- `repository-intelligence.js` (repo root) — BACKLOG-006, wired into
  `npm run build`. Checks cross-table lexical consistency (build-gating)
  and raka-locality candidates (report-only). Design rationale in
  `docs/REPOSITORY_INTELLIGENCE.md` — read that before extending this
  file or adding to its allowlist.
- `src/data/raka_roots.json` — Claude A's confirmed no-raka root table
  (from `THANGSENG_RULES_LOOKUP.md`), digitized for
  `repository-intelligence.js` to consume. Verbatim transcription, not
  new linguistic content — flag any discrepancy to Claude A rather than
  editing directly.
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
