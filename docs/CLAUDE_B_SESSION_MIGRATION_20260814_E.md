# Claude B Session Migration — 2026-08-14 (session E, session close)

Resumed from `docs/CLAUDE_B_SESSION_MIGRATION_20260814_D.md`
(checkpoint `ed53f47`, via user-pasted filename reference + PAT).
Supersedes that doc.

## What was verified at resume

- **HEAD == origin/main, clean tree** at resume: `ed53f47`. No new
  commits since the prior migration doc's checkpoint.
- Full gate green at resume: `npm test` (206/206), `npm run lint`
  (clean).

## Source of this session's task list

Claude C's independent audit was relayed live in this session's chat
by the Project Owner (not a committed repo file — search of `docs/`
and `.ai/` at resume found no matching file, consistent with how the
2026-08-12 and 2026-08-13 Claude C references were handled in prior
sessions). Two distinct engineering findings, both closed this
session; the doc's other sections (role-boundary revert, production
`prepare-data.js` filtering, `audit-counting-phrases.mjs` ordering)
were already confirmed/fixed at the audited HEAD (`73b7a8f`) per
session D's own migration doc and needed no further action.

## Work done this session

### 1. Runtime-propagation fix — §3.5 (commit `f737f14`)

**Root cause, verified directly, not assumed from the audit text:**
`translationEngine.js`'s own header docstring has always documented
"2. Exact phrase match (compiled dict)" as outranking "5. Number +
classifier engine". `8f7dfba` (2026-06-13, wiring classifier
counting) placed that block at step "1.6" — running *before* the
exact-phrase lookup at step 2, inverting the documented cascade.
Confirmed with a direct call: `translate('twenty student')` returned
`'porai·gipa sak·Kolgrik'` (composed from the bare noun's *stale*
`Porai·gipa` root) even though `compiled_dict.json` already carried
NV-073's fixed phrase-level entry, `'Chattro sak·Kolgrik'` — because
classifier composition ran first and returned before exact-phrase
ever got a turn. This is a structural fact about the pipeline, not a
one-off: any future counted-noun fix landing only in
`compiled_dict.json` (not the bare-noun entry) would silently fail
to reach users the same way.

**Fix:** moved the exact-phrase block ahead of classifier
composition in `translate()`. Composition remains the fallback for
the large majority of counted-noun phrases that have no dedicated
`compiled_dict.json` entry (`translate('six dogs')` still resolves
via classifier, confirmed unaffected).

**Regression tests** (`tests/unit/translationEngine.test.js`):
exact-phrase wins over composition when both paths could answer
(`'twenty student'`), classifier still reached as fallback with no
exact-phrase entry present (`'six dogs'`). Widened the pre-existing
`'one person'` regression case's `expectMethod` to accept either —
the garo value is unchanged, only the producing pipeline step
changed (it now resolves via `exact-phrase` instead of `classifier`,
since it too has a `compiled_dict.json` entry).

### 2. SUPERSEDED-only-candidate pipeline fix — §3 (commit `f0453d6`)

**Root cause, verified directly:** `master_dictionary.json`'s sole
row for `'twenty students'` is marked `SUPERSEDED`
(`'chi chi chik·gni'`), with no VERIFIED replacement ever added —
unlike its singular sibling `'twenty student'`, which NV-073 did fix.
`garo_dictionary.json` (no `notes` field, structurally unable to
carry a `SUPERSEDED` tag) independently duplicates the identical
wrong string, untagged. Previously: `normalizeFile()` dropped
master's SUPERSEDED row entirely and kept no record of the value it
had rejected; once master contributed zero surviving candidates for
that key, `pickPrimary` fell back to `garo_dictionary.json`'s
untagged duplicate with no way to recognize it as the exact same
already-rejected content — silently re-shipping the value master had
explicitly ruled out. This is the un-actioned half of Claude A's own
2026-08-13 counting-pipeline audit's handoff item (a) to Claude B
("compile pipeline should ship nothing rather than a SUPERSEDED
value when no VERIFIED candidate exists for a key").

**Fix, `prepare-data.js`:**
- `normalizeFile()` now returns `{ normalized, superseded }` —
  `superseded` is `{ key: Set<garo value> }` for every value a
  source file explicitly marked `SUPERSEDED` for that key (in
  practice only `master_dictionary.json`, the only file with a
  `notes` field).
- `main()` merges the three sources' `superseded` maps into one
  `supersededByKey` and passes it to `finalizeDictionary()` as a new
  third argument.
- `finalizeDictionary()` filters out any **non-master**
  (`source !== 2`) candidate whose (cleaned) value matches a
  superseded value recorded for that key, before `pickPrimary` ever
  sees it. If a key's candidate pool empties entirely, it's held out
  of `compiled_dict.json`/`compiled_dict_alternates.json` (not
  shipped with a fabricated or known-wrong value) and recorded in a
  new `heldSupersededOnly` map.
- `main()` writes `heldSupersededOnly` to `docs/SUPERSEDED_ONLY_KEYS.md`
  (auto-regenerated every build, deleted if empty — not hand-edited)
  listing each held key and its rejected value(s), for follow-up
  native review.

**Deliberately scoped to `source !== 2` only.** Caught by the full
test suite before this was scoped correctly: `'two dogs'` has both a
stale `SUPERSEDED` row in `master_dictionary.json` *and* a separate,
still-live `VERIFIED/HIGH` row that happen to share the exact same
garo string (`'achak mang·gni'`) — the `SUPERSEDED` note there flags
an already-resolved *different* contradiction, not this value. An
unscoped filter incorrectly stripped this legitimate, currently-live
master candidate too. The merge step in `main()` already upgrades an
entry's `source` to `2` whenever master re-confirms a value
non-superseded, so any entry surviving finalization with
`source === 2` is master's own current, live word on the matter and
must never be second-guessed by a stale sibling row's note.

**Result:** 190 keys held this build — the bulk of Claude A's
~230-key 2026-08-13 finding not already closed by that session's
teacher/mountain/village/road/banana/car relay (120 keys). Remaining
held keys are chiefly house/rice/water/food (~19 keys each) plus
`'two cars'`/`'twenty students'` and similar orphaned-fabrication
cases — all still need native input, not an engineering call.

**Regression tests** (new file `tests/unit/prepare-data.test.js`, 5
tests, isolated with synthetic data so they don't depend on the real
dictionaries' current content): held-when-only-a-superseded-value-
matches; shipped-when-a-genuinely-different-candidate-exists;
NOT-filtered-when-master-itself-reconfirms-the-same-value (the "two
dogs" case, explicit regression guard); unaffected when a key has no
superseded history at all; `supersededByKey` defaults to `{}` when
omitted.

### 3. Rebuild + downstream test fix (commit `c22ae5a`)

Ran `node prepare-data.js` then `npm run build` with both fixes
applied. `compiled_dict.json`/`compiled_dict_alternates.json`/`dist/`
regenerated. One pre-existing test needed updating as a direct,
expected consequence of fix #2, not a regression:
`tests/unit/rc037_bird_classifier.test.js` asserted a compiled entry
existed for `'two cars'` — its sole candidate (`'rang·gni'`) was
already flagged `SUPERSEDED` by Claude A on 2026-08-12 as a
corpus-internal fabrication (root `'rang'` wrongly reused from
`'house'`) with no replacement asserted, so it never should have
shipped. Removed it from that test's do·o-prefix list and gave it its
own dedicated test asserting it's now correctly held.

## Flagged, not fixed — Claude A's territory

`'student'`'s bare-noun dictionary entry (`compiled_dict['student']`)
was never updated to NV-073's `'Chattro'` root alongside the
phrase-level `'twenty student'` fix. With fix #1 + fix #2 both
applied, `translate('twenty students')` (plural — no phrase-level
`compiled_dict.json` entry of its own, and now correctly can't fall
back to the rejected bulk value either) falls through to classifier
composition consistently, but still composes from the stale
`'Porai·gipa'` root rather than `'Chattro'`. This is a linguistic
gap, not an engineering defect — needs a native-confirmed bare-noun
update from Claude A, same class of item as the person/student/
teacher 111-candidate root conflict noted open since 2026-08-11/12.

## Verification

- `npm run build`: **green end-to-end.**
  - `node prepare-data.js`: 8109 unique entries, 190 held
    (SUPERSEDED-only), 1019 alternates, category index 3907.
  - `node test-dictionary.js`: 8109/8109 valid.
  - `node repository-intelligence.js`: PASSED, **0 NEW violations**
    across all checks (A raka-locality 11 report-only unchanged; B
    7 known/0 new; C 1533 known/0 new; D 2014 checked/0 problems; E
    115 known/0 new; F 289 known/0 new — down from 292 known at
    session D's resume, expected and harmless: some previously-
    allowlisted Check F mismatches were for keys this session's fix
    correctly stopped shipping from `compiled_dict.json`, so they
    can no longer be found as mismatches at all, not silently
    dropped from the allowlist).
  - `node --test tests/unit/*.test.js`: **215/215** (up from 206 at
    resume — 8 new tests, 1 pre-existing case widened, 1 pre-existing
    case's assertion set corrected as described above).
  - `npm run lint`: 0 errors, 0 warnings.
  - `vite build`: clean.
- No `master_dictionary.json`/`garo_dictionary.json`/
  `corrections.json` edits this session — all changes are pure
  engineering (`translationEngine.js`, `prepare-data.js`, generated
  `compiled_dict*.json`/`dist/`, test files, docs).
- `git status` clean, `HEAD == origin/main` at every commit, fully
  pushed. PAT supplied live by the Project Owner, used inline in the
  push URL only, never persisted to git config.

## Commits this session

1. `f737f14` — runtime-propagation fix + tests (§3.5)
2. `f0453d6` — SUPERSEDED-only-candidate pipeline fix + tests (§3)
3. `c22ae5a` — rebuild (`compiled_dict*`/`dist`) + rc037 test update
4. (this commit) — `docs/SUPERSEDED_ONLY_KEYS.md` was created by
   commit 3 above; this commit closes the session:
   `.ai/WORKSTATE.yaml`, `.ai/SESSION_BOOTSTRAP.md`, this migration
   doc.

## Next unvisited item

None from this session's task list — both engineering findings
closed, tested, and verified. Standing open items unchanged from
session D and earlier, all Claude A's territory: `student`'s
bare-noun root (this session's flagged item, above); house/rice/
water/food counting (~76 keys, need native input); person/student/
teacher 111-candidate root conflict; `always`/`answer`/`a dog bit
me`/`are you sleeping` (evidence-only, waiting on Claude A per
session D); `angry` raka-count placement (re-flagged session D, still
open).
