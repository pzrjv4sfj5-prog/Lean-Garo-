# Claude B Session Migration — 2026-09-21

## 1. Project identity

Lean-Garo: an English↔Garo (Mandi language) translation engine. Repo:
`pzrjv4sfj5-prog/Lean-Garo-`. Role: Claude B = engineering (translation
engine code, tests, build pipeline, repository-intelligence checks).
Linguistic data (`master_dictionary.json`, native-speaker citations from
Thangseng) is Claude A's lane; engineering does not invent Garo forms
without an existing citation.

## 2. Resumed from

`docs/CLAUDE_B_SESSION_MIGRATION_20260920C.md`. Its pinned commit
`f437199` was 2 commits stale at resume time — both docs-only (the
migration doc's own commit, and Claude A's unsent relay-question draft,
`docs/THANGSENG_RELAY_QUESTION_20260920C.md`). No code impact. Confirmed
via full gate re-run before starting new work.

## 3. Current state (as of this close)

- **HEAD: `4836730`, confirmed == `origin/main`** via `git ls-remote`
  (not just local `git log` — see §5 on why that distinction mattered
  this session).
- **Gate: all green.**
  - 458/458 unit tests
  - 8824/8824 dictionary entries compile clean
  - 9/9 grammatical corrections
  - 0 new `repository-intelligence.js` violations
  - `npm run build` clean (same pre-existing >600kB chunk-size advisory
    only, not new)
  - `npm run lint`: same 9 pre-existing errors, all in
    `prepare-data.js`/`src/research/*.js`, none in any file touched this
    session
  - `scripts/runtime-error-sweep.mjs`: **0 errors across 15,764
    `translate()` calls** (full compiled_dict key sweep + plural forms +
    counted-noun forms + structural edge cases + null/undefined
    type-safety inputs + full exported API surface). Re-run explicitly at
    user request immediately before this close, not carried over from an
    earlier point in the session.

## 4. What was done this session

### 4.1 RULE-046 space-before-`ma` regression (user-caught)

User asked for a translation of "did you eat rice?", got
`Na·a mi·ko Cha·aha ma?`, and correctly flagged the space before `ma?` as
wrong (`Cha·ahama?` is correct).

**Root cause, confirmed before touching code:**
`src/sentenceBuilder.js`'s live grammar-assembly path
(`return grammar.isQuestion ? result + ' ma?' : result;`) appended the
yes/no-question particle **with a space**. This contradicts RULE-046
(`docs/GRAMMAR_RULE_CATALOGUE.md`) — Thangseng-confirmed, High confidence,
marked "P0 — CLOSED project-wide" after a 2026-08-28 sweep. That sweep
fixed the *static* `corrections.json`/`master_dictionary.json` entries but
never touched this *live-composition fallback*, so any question that
doesn't hit a canned correction (like "did you eat rice?", which has a
sentence-final object and so never matches a `corrections.json` key)
still emitted the disproven spaced form.

Worse: the code comment justifying the space cited
`corrections.json`'s `"will you eat"` entry as evidence — but that entry
is `Na·a cha·genma?`, **joined, no space**. The citation was simply wrong.
Checked every `ma?`-ending entry in `corrections.json` (dozens): 100%
joined, 0 spaced.

**Fixed:**
- `src/sentenceBuilder.js:436` — `result + 'ma?'` (no space)
- `src/grammarEngine.js` comment corrected to stop misquoting its
  citation
- 3 regression tests that had hardcoded and defended the wrong spaced
  form as "already-VERIFIED" (`tests/unit/translationEngine.test.js`,
  `tests/unit/object_final_punctuation.test.js`,
  `tests/unit/polar_question_aux_inversion.test.js`) — corrected to
  assert the joined form, and one loosened `endsWith('ma?')` check
  tightened to exact-match (it had been passing for both the right and
  wrong forms, which is how the bug went undetected for as long as it
  did)

### 4.2 Purpose-clause `-ko` drop (user-caught)

User: "i want to eat rice = the .ko should not [be] here[,] check the
translation for i want to eat momo". Live check at the time:
`"i want to eat momo"` (dictionary exact-phrase entry) correctly had no
`-ko`; `"i want to eat rice"` (live grammar-assembly) incorrectly
produced `Anga mi·ko cha·na ska`.

**Root cause, confirmed before touching code:**
`master_dictionary.json` already had the answer on record.
`"i want water"` → `"Anga chi ringna skenga"`, noted: *"'ko' dropped in
this eat/drink-desire construction"* (NV-021 follow-up, direct Thangseng
native validation via Tridip WhatsApp). `"i want to eat momo"` (NV-153)
is Thangseng's own live self-correction of an accidental `momo·ko` typo,
explicitly landing on the no-`-ko` form. But only those two *exact*
sentences had been patched as dictionary overrides — `src/sentenceBuilder
.js`'s `objMarker` logic still unconditionally applied `-ko` regardless
of whether `grammar.purposeAction` was set, so every other "want to
eat/drink X" sentence fell through to the unfixed live path.

**Fixed:**
- `src/sentenceBuilder.js` — `objMarker` now checks
  `grammar.purposeAction` and drops `-ko` when present (scoped strictly
  to that condition; ordinary direct objects of a finite verb are
  untouched — verified live: `"did you eat rice?"` still correctly keeps
  `mi·ko`)
- 2 new regression tests: the fix itself, and a guard confirming plain
  finite-verb direct objects are unaffected

### 4.3 `phrase_maps.js` / `Bigil` sync (gate-caught, not user-reported)

After rebasing onto Claude A's concurrent session-close commits (see
§5), `repository-intelligence.js` Check F (runtime-cascade source
agreement) flagged 1 new mismatch: `phrase_maps.js`'s `'skin'` entry
still read the pre-correction `'bi·gil'` after Claude A's `b1289eb`
updated `master_dictionary.json`'s skin rows to `'Bigil'` (no raka, owner
directive 2026-09-21, Thangseng-confirmed). This was Claude A's own
commit leaving a mirror file out of sync, not something introduced this
session — but the gate correctly caught it as new drift regardless of
origin, and it was fixed (not just allowlisted) since it's clearly an
unintentional oversight, not an intentional divergence.

**Fixed:** `src/data/phrase_maps.js` `'skin'` entry → `'Bigil'`.

## 5. Push mechanics this session (unusually noisy — read before assuming a push failed or succeeded)

The user's PAT (same one reused from a prior session, confirmed by the
Project Owner as valid for 25 more days and already in concurrent use by
Claude A) produced a confusing sequence of failures before the two real
commits landed:

1. First attempt failed on my own mistake — referenced `$GH_PAT` in the
   push URL without actually setting it in that command.
2. Several subsequent attempts, with the token correctly set, failed
   with GitHub's literal `Invalid username or token. Password
   authentication is not supported for Git operations.` — **this was
   misleading.** Independently verified via a direct GitHub REST API
   call (`GET /user` → 200 as the expected owner account; `GET` the repo
   → 200 with `permissions.push: true`) that the token was valid and
   had push rights the whole time. Concluded transient/flaky on GitHub's
   end — the identical token, used the identical way, succeeded on a
   later retry.
3. One attempt failed for a real and different reason: **non-fast-forward**
   — Claude A had pushed 3 new commits (including the `skin`/`Bigil`
   fix from §4.3) while this session was mid-flight. Resolved with a
   clean, conflict-free `git rebase origin/main`.
4. One further attempt returned **exit code 0** but still showed the
   `Invalid username or token` text in stderr, and had **not actually
   reached the remote** — caught only because `git ls-remote` was used
   to independently verify the true remote state rather than trusting
   the exit code or a same-turn `git log` comparison against a possibly
   stale `origin/main` ref. The immediately-following retry succeeded
   and was verified the same way.

**Lesson for next session:** after any push in this environment, verify
with `git ls-remote <url> main` (not just `git log HEAD..origin/main`,
which can read stale local refs and give a false "in sync" reading — see
the false-positive this session produced before an explicit `ls-remote`
check corrected it) before treating a push as confirmed.

**End state:** 2 commits pushed, `d20a5c4` (RULE-046 + purpose-clause
fix) and `4836730` (phrase_maps sync), both landed in a single
successful `git push`. `HEAD == origin/main == 4836730`, double-verified
via `git ls-remote`. Token was never written to any file or persisted in
`.git/config` — verified via `git remote -v` / `git config --local -l`
after every single attempt, successful or not; it was passed only as a
one-shot inline URL credential per command and never exported to the
shell environment beyond that single command's scope.

## 6. Open issues (unchanged in substance from the prior migration doc)

- **4 sentence-building gaps** (estrange+object, skin+animal, wall as
  subject/object, crumbled-down), reclassified last session as
  vocabulary-coverage/engineering issues rather than Thangseng questions.
  Only the "wall"/"animal" vocabulary-coverage half was queued as this
  session's intended starting point — not reached; the session was
  redirected to the two user-caught bugs in §4.1–4.2 instead. Still
  genuinely open, no root-cause investigation done yet on any of the 4.
- **2 drafted relay batches, not yet sent** (Project Owner/Tridip action,
  outside engineering's role):
  `docs/THANGSENG_RELAY_QUESTION_20260920.md` (him/her/it/us/them/you-all
  as accusative objects) and `docs/THANGSENG_RELAY_QUESTION_20260920C.md`
  (per Claude A's 2026-09-20C draft, 3 doubt-driven probes).
- **S6.2 pronoun `-ko` adjudication** (him/us/them unconditional
  `-ko` suffix) — status unchanged from the prior doc; see
  `pending_handoff_from_claude_a_20260920B` in `.ai/WORKSTATE.yaml` for
  full detail. Not touched this session.

## 7. Standing rules confirmed/reinforced this session (nothing new, but worth restating since both user-reported bugs were caught by applying these)

- Never accept a claimed linguistic correction (or defend existing
  output) without checking it against the actual citations in
  `master_dictionary.json`/`corrections.json`/`docs/GRAMMAR_RULE_CATALOGUE.md`
  first. Both bugs this session were confirmed as real, pre-existing,
  citable defects before any code was touched — not just taken on the
  user's word, and not dismissed either.
- A passing test suite is not proof of correctness if a test itself
  hardcodes the wrong expected value. Both regressions this session had
  been locked in by tests asserting the buggy output as "already-VERIFIED".
  When fixing a bug, check whether a test is defending it.
- `git log HEAD..origin/main` can lie about sync state if local refs are
  stale relative to a same-turn push attempt; use `git ls-remote` for the
  authoritative check (see §5).

## 8. Exact next step

Resume with the "wall"/"animal" vocabulary-coverage investigation queued
at the end of the prior session (§6, first bullet) — check whether
`"wall"` and `"animal"` are genuinely missing from
`master_dictionary.json` as object-position nouns, per the prior
session's reclassification of the 4 sentence-building gaps as an
engineering task. No code has been written toward this yet.
