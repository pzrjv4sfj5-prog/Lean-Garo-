# Claude B Session Migration — 2026-09-24B

## Project identity
Lean Garo — English↔Garo translation engine. Repo:
`pzrjv4sfj5-prog/Lean-Garo-`, branch `main`. Claude B's lane is
engineering/runtime (grammarEngine.js, sentenceBuilder.js,
morphologyEngine.js, translationEngine.js, prepare-data.js, tests,
repository-intelligence.js). Dictionary/linguistic-content calls
(master_dictionary.json entries, sense adjudication, native-speaker
citation review) are Claude A's lane — see `.ai/PROJECT_OWNER_
DIRECTIVE_PROTOCOL.json` and `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`
for the boundary and how directives are handled.

## Current commit / state
- HEAD at close: **defab0c** (merge commit; see `.ai/WORKSTATE.yaml`'s
  `repository.head`) — this doc's own commit lands on top of it.
- Verified `HEAD == origin/main` after push (check via `git ls-remote`,
  not just push exit code — prior sessions found exit-code-0 false
  positives).
- Working tree clean at close.
- Dictionary: 8902/8902 valid entries. Grammatical corrections: 9/9.
  Unit tests: 461/461. `repository-intelligence.js`: 0 new violations.
  `scripts/runtime-error-sweep.mjs`: 0 errors across 15866 `translate()`
  calls.

## What's done this session
**Fixed (commit c77b599, then carried through the merge below):**
existential-possession construction for `has`/`have`.

- **Report:** Project Owner relayed a Thangseng-confirmed correction
  directly in chat for "the boy has a dog": correct output is
  `Me·a bi·sao achak donga`. The engine's actual live output at the
  time was `Me·a bi·sa achak·ko donga` (from the previous session's
  fix, a9adc4b, which correctly got NP-subject sentences into
  grammar-assembly for the first time but used the ordinary transitive
  accusative-object marker pattern).
- **Root cause:** `SUBJ has OBJECT` is existential possession in Garo
  — literally "at-SUBJ OBJECT exists" — not a transitive-object
  construction. The possessor takes the locative `-o` suffix (appended
  directly, no `·` separator — same convention already established for
  the confirmed `in bed` → `palango` locative-adjunct case), and the
  possessed object is bare (no `·ko` accusative marker at all).
- **Fix:** `src/sentenceBuilder.js`, `assembleGrammar()`. Added
  `isPossessionConstruction`, scoped narrowly: fires only when
  `grammar.verb.garo === 'donga'` AND `grammar.verb.english` matches
  `/^(has|have)$/i` (the confirmed has/have lemma —
  `master_dictionary.json` "have"→"donga") AND `grammar.object` is
  present AND `!grammar.possessive`. When it fires: subject pushed as
  `grammar.subject.garo + 'o'` instead of bare; `objMarker` forced to
  `''` instead of the default `·ko`. Does not touch `grammar.location`
  (distinct construction) or `grammar.possessive` (distinct "SUBJ's
  OBJECT" construction) — confirmed live via regression guards:
  - `the boy sees a dog` (ordinary transitive verb, same NP-subject
    shape) → unaffected, still falls to sov-assembly as before.
  - `the boy has his dog` (possessive object) → unaffected, still
    `me·a bi·sa Uni achak·ko donga`.
- **Verified live**, several subjects, all now consistent:
  - `the boy has a dog` → `me·a bi·sao achak donga`
  - `the girl has a dog` → `me·chik bi·sao achak donga`
  - `the teacher has a book` → `Skigipao ki·tap donga`
  - `he has a dog` → `Uao achak donga` (pronoun subject; this
    generalization to pronouns is a natural consequence of the same
    construction, not a separate claim — no prior citation contradicted
    it, and the two prior pronoun-subject regression tests below were
    only ever locking in an unrelated fix's incidental output, not a
    marker-placement claim, so updating them is correcting an
    unintentional prior gap, not overriding a real citation).

**Tests updated in place** (`tests/unit/translationEngine.test.js`),
both re-commented with the date and rationale rather than silently
changed:
- Line ~455 ("`has` resolves as an irregular form of `have`"):
  `he has two dogs` expected value was `Ua achak manggni·ko donga`.
  That test's own original comment already says this locked in
  RC-CANDIDATE-036's bug output, not a linguistic claim — updated to
  `Uao achak manggni donga`.
- Line ~1366 ("`she has N children` ... via grammar-assembly"):
  `she has five children` expected value was
  `Ua bi·sa sakbonga·ko donga` → updated to `Uao bi·sa sakbonga donga`.

**New regression tests added** (NV-165 — checked first: NV-121 was
already taken by Claude A's prior "what did you eat?" -aha/-a
resolution, see `.ai/WORKSTATE.yaml`'s
`pending_handoff_from_claude_a_20260920B`):
1. Direct citation lock-in: `the boy has a dog` →
   `me·a bi·sao achak donga`, method `grammar-assembly`.
2. Regression guard: ordinary transitive verb (`the boy sees a dog`)
   does not pick up the possessor-`-o`/bare-object pattern.
3. Regression guard: possessive object (`the boy has his dog`) is
   untouched, still the ordinary marker pattern.

**Flagged, NOT touched — dictionary content, Claude A's lane:**
`src/data/corrections.json` has two pre-existing exact-phrase entries
that now diverge from this construction's confirmed pattern:
```
"she has three children": "Ua bi·sa sakgittam donga",
"he has three children": "Ua bi·sa sakgittam donga",
```
Same `has`+`donga` construction, same object-bareness (already
correct), but the subject side is bare `Ua` rather than `Uao`. These
predate this fix and short-circuit the grammar-assembly path entirely
(exact-phrase `correction` method), so they were never touched by
c77b599. Whether to update them to `Uao bi·sa sakgittam donga` for
consistency is a dictionary-content call (Claude A's lane per
`engineering_boundary` in `.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json`)
— flagging rather than deciding.

## Merge handled this session
Concurrent Claude A session-close pushes landed mid-session:
- `46aa62f` — `'animal'` → `Jontu` (Project Owner relay from Thangseng)
  — this closes the "animal vocabulary gap" open item carried in prior
  Claude B migration docs; confirmed no longer open.
- `6ffe11c` — split `'last'` ordinal/specific-person senses (NV-082
  citation) + POS-collision-set priority queue.
- `e187e04` — Claude A's own session-close (WORKSTATE.yaml +
  SESSION_BOOTSTRAP.md + migration doc, full governance re-run).

Merge-base was exactly my own prior HEAD (`15551f3`, a fast-forward
situation from origin's side) — merged with `git merge origin/main`,
clean, no conflict markers anywhere (checked, not assumed). Diffed
file-by-file, not just the stat summary: only `master_dictionary.json`
(content — the animal/last changes above) plus the two generated
compiled files (`src/compiled_dict.json`, `src/data/category_index.json`)
touched on Claude A's side. Zero `src/*.js` collision with c77b599's
`sentenceBuilder.js` edit. The two generated files were regenerated
fresh via `prepare-data.js` against the merged `master_dictionary.json`
rather than trusting the auto-merge result — `git status` was clean
after regeneration, confirming the auto-merged blobs were already
byte-identical to a fresh build.

## Open issues (carried forward, unchanged in substance)
- **Leading-time-word subject-detection gap**: `tomorrow he will go to
  the market` → subject/verb/location all null, falls to sov-assembly,
  loses the already-verified `-de` suffix and `-chi` locative marker.
  Blocked on a real data divergence: the dictionary's bare `today`
  entry (`Da.alo`) doesn't match RULE-042's own verified root (`Da·al`)
  that its `-de` composition depends on. Content question for Claude
  A/D, not an engineering call — do not generalize until resolved.
- **AI-003**: multi-word `VERB_LEMMAS` matcher gap (609/955 entries are
  multi-word, but all 3 consumers match one tokenized word at a time).
  Logged, scoped, not fixed — needs a word-count cutoff decision first.
- Claude D's broader to-prefix canonicalization — still Owner-blocked.
- `VERB_LEMMAS` common-verb coverage gap (run/eat etc.) — content
  decision or suffix-heuristic design call, not attempted.
- S6.2 pronoun `·ko` adjudication (`us` specifically) — pending
  Thangseng relay reply, `him`/`them` already resolved via Claude A's
  pattern-inference.
- `-de`/`-ara` marker distinction — general `-de` semantics clarified
  (NV-163) but the `-de` vs `-ara` distinction itself still
  uncharacterized.
- **New this session**: the `corrections.json` "has three children"
  divergence flagged above, for Claude A.

## Standing rules established / reused this session
- `.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json`: a direct Project Owner
  chat directive relaying native-speaker-confirmed evidence (here,
  "confirmed by thangseng") is authoritative and requires no separate
  proof gate (no transcript/screenshot/migration-doc/re-confirmation
  needed before acting).
- Locative `-o` suffix convention: appended directly to the host word
  with no `·` separator (distinct from the accusative `·ko` and the
  locative-adjunct `·o`, which both use the dot). Established
  precedent: `in bed` → `palango`. This session extended the same
  convention to the existential-possession subject.
- Generated files (`compiled_dict.json`, `category_index.json`,
  `compiled_dict_alternates.json`) are always regenerated fresh from
  the merged `master_dictionary.json` after any merge touching them,
  never trusted from git's auto-merge alone.
- Full gate before every push: `prepare-data.js` → `test-dictionary.js`
  → `repository-intelligence.js` → `node --test tests/unit/*.test.js`
  → `scripts/runtime-error-sweep.mjs`.

## Exact next step
None queued by the Project Owner as of this close. On resume: treat
this doc as ground truth, resync against actual `origin/main` (do not
assume zero drift without checking — `git fetch` + compare), re-run
the full gate fresh before continuing, then pick up the next Project
Owner request or one of the open issues above.
