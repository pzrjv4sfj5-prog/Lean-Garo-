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

## Runtime Handoff to Claude B

None. Zero-runtime-code session; only `master_dictionary.json`,
`src/data/phrase_maps.js`, and regenerated compiled artifacts
touched.

## Gate status

Green throughout and at close: 8902/8902 dictionary entries, 9/9
grammatical corrections, 461/461 unit tests, 0 new
repository-intelligence violations, 0 pending-lexicon structural
problems. Live-verified: `translate('cow')` → `Matchu` (0.99,
phrase-map), `translate('where is the cow?')` → `'Bano Matchu'`
(0.75, sov-assembly).

## Not picked up this session

No Priority-A audit items from
`docs/CLAUDE_A_MACHINE_READY_AUDIT_20260924.md` — the arriving
governance question took the whole session. Still next session's
starting point.

## Repository status at close

- HEAD: `f7f9e06`
- `origin/main`: matches HEAD exactly (verified via `git fetch` +
  comparison)
- `git status`: clean, no uncommitted changes
- `.ai/WORKSTATE.yaml`: updated (head + `claude_a.next_action`)
- `.ai/SESSION_BOOTSTRAP.md`: updated (cow flag resolved)
- This migration doc: complete
- No local-only commits
- Native-validation status: unchanged this session (no NV items
  touched)
- Blocker status: none
