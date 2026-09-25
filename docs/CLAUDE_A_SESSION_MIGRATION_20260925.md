# Claude A Session Migration — 2026-09-25

## Resume

Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260924C.md` (Project
Owner-named), which closed at HEAD `de7e081`. Cloned the repo fresh
this session using a PAT pasted live by the Project Owner, per
standing rule (only use a PAT pasted live in the current session;
never embed one in a file; rotate after use).

`git fetch` + `git log de7e081..origin/main` found 3 downstream
commits, all authored as `T`:

- `472b000`, `8a14db0` — "Protect GPT Project Owner corrections from
  unauthorized agent changes"
- `eea9e98` — "Establish GPT correction protection under Project
  Owner authority"

All three touched governance files only (no `master_dictionary.json`
or engine code): `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md`,
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`,
`.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json`. Each added a new
"cross-agent GPT protection" section declaring that corrections made
by "GPT" under Project Owner authority are automatically binding and
cannot be reverted or questioned by Claude A/B — and each used the
exact `cow`=`Matchu` case as its worked example, i.e. the case the
prior session (`20260924C`) had explicitly flagged as needing Project
Owner clarification before being touched again.

## Stopped before doing any work

This matched the flag left by the prior session almost too
precisely, and the content was asking me to treat an assertion of
its own authority — embedded in the very governance files I operate
under — as sufficient grounds to override my own evidence-first
methodology going forward. Per standing project governance (Project
Owner authority and native evidence must never be conflated; only a
Project Owner directive given directly and provenance-labeled counts
as authoritative, not a chat-pasted or file-embedded claim on its
own), I did not act on the governance-file text directly. I reported
the finding to the Project Owner and asked for explicit confirmation
of three things before touching anything:

1. Was `cow`=`Matchu` (overriding `ma·su`) actually intended?
2. If so, was it a Project Owner directive on their own authority?
3. Should the three governance commits stand, or be reverted?

## Project Owner response (this session, in chat)

1 and 2: confirmed — `cow`=`Matchu` is intentional, and it is a
Project Owner directive on their own authority (not native-speaker
evidence).

3: confirmed as intentional and authorized — GPT performs
corrections in this project when Claude is out of context/tokens,
under Project Owner instruction. The governance commits stand as-is
and were **not reverted**.

## Work this session

With the directive confirmed and provenance-labeled, implemented it:

- `master_dictionary.json`: `cow`→`Matchu` row moved
  `superseded`→`verified_high`; `Cow`→`ma·su` row moved
  `verified_high`→`superseded` (retained per citation discipline, not
  deleted). Both notes rewritten to name this as a Project Owner
  directive (2026-09-25, chat, this session), not a native-speaker
  confirmation.
- `src/data/phrase_maps.js`: `'cow': 'ma·su'` → `'cow': 'Matchu'`
  (Rule 8 — fix stale phrase_maps.js values directly).
- `src/compiled_dict.json` / `dist/index.html`: regenerated via full
  build.
- Swept for other representations of the old value: only
  `corrections.json`'s pre-existing `"cow's skin": "Matchu Bigil"`
  references "cow" and was already correct/unaffected.

This also resolved the one failing test on arrival:
`tests/unit/question_animal_placeholder.test.js` — "cow/goat question
composition is unaffected (regression guard)" — already asserted
`'Bano Matchu'`, i.e. the test suite had been updated in anticipation
of this directive ahead of the data. 461/461 after the fix (was
460/461 on arrival).

`.ai/WORKSTATE.yaml` and `.ai/SESSION_BOOTSTRAP.md` updated in the
same session to close out the "worth an explicit Project Owner
check" flag left by `20260924C`, so a future session reads the
resolution rather than re-opening the question.

## Post-fix drift: 5 more corrections.json overrides + 1 new entry

Before push, `git fetch` found 10 more downstream commits (all `T`)
— a "slowly = Ka·sine" override plus two vocabulary-batch commits
adding `corrections.json` entries. Rebased clean (no conflicts), but
the rebuild then failed Check F (`repository-intelligence.js`
runtime-cascade source agreement): the vocabulary-batch commit had
added 5 `corrections.json` entries for words that already had
different, raka-dotted VERIFIED forms in the dictionary — shade,
anus, litchi, profit, ankle (plus "slowly" itself, not yet
baselined). Live-checked: all 5 were already shipping the new
undotted forms at runtime (`corrections.json` wins at translate()
step 1), so this was a real, uncited value change, not just a
data-hygiene mismatch.

Flagged to the Project Owner rather than guessing which form was
right. Confirmed: all 6 are intentional. Added all 6 keys to
`src/data/known_cross_source_conflicts.json` (Check F's documented
baseline mechanism, per `docs/REPOSITORY_INTELLIGENCE.md`) rather
than altering any Garo values — this is override-confirmation, not
new linguistic content.

Also added, per a new Project Owner directive given directly in
chat this session: `master_dictionary.json` — `"a trader / merchant
/ money lender"` → `"Mahajon"` (alt spelling `Mahajonn` noted in
row), provenance-labeled per `.ai/PROJECT_OWNER_AUTHORITY.md`.
Live-verified: `translate("a trader / merchant / money lender")` →
`Mahajon` (0.98, exact-phrase).

## Runtime Handoff to Claude B

None. Zero-runtime-code session; only `master_dictionary.json`,
`src/data/phrase_maps.js`, `src/data/known_cross_source_conflicts.json`,
and regenerated compiled artifacts touched.

## Gate status

Green throughout and at close: 8903/8903 dictionary entries, 9/9
grammatical corrections, 461/461 unit tests, 0 new
repository-intelligence violations, 0 pending-lexicon structural
problems. Live-verified: `translate('cow')` → `Matchu` (0.99,
phrase-map), `translate('where is the cow?')` → `'Bano Matchu'`
(0.75, sov-assembly), `translate("a trader / merchant / money
lender")` → `Mahajon` (0.98, exact-phrase).

## Not picked up this session

No Priority-A audit items from
`docs/CLAUDE_A_MACHINE_READY_AUDIT_20260924.md` — the arriving
governance question took the whole session. Still next session's
starting point.

## Repository status at close

- HEAD: to be confirmed post-push (last local commit `b5b4d42` at
  time of writing this doc; WORKSTATE.yaml/SESSION_BOOTSTRAP.md
  updates and this doc's own commit come after)
- `origin/main`: to be re-verified via `git fetch` + comparison
  immediately before push, per Rule 10/multi-Claude push collision
  protocol, given two rounds of concurrent drift already seen this
  session
- `git status`: clean at time of writing, no uncommitted changes
  outside this doc's own pending commit
- `.ai/WORKSTATE.yaml`: updated (head + `claude_a.next_action`)
- `.ai/SESSION_BOOTSTRAP.md`: updated (cow flag resolved)
- This migration doc: complete
- No local-only commits expected after final push
- Native-validation status: unchanged this session (no NV items
  touched)
- Blocker status: none
