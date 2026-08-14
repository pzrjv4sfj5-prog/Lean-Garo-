# Claude B Session Migration — 2026-08-14 (session E, migration-mode final close)

Resumed from `docs/CLAUDE_B_SESSION_MIGRATION_20260814_D.md`
(checkpoint `ed53f47`, via user-pasted filename reference + PAT).
Supersedes that doc. This version finalized in migration mode after
two post-close rebases onto concurrent Claude A pushes — see "Post-close
sync" below for what changed after the engineering work itself was
already done and verified. **Final pushed commit: `39763a3`.**

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

### 3. Rebuild + downstream test fix (commit `c22ae5a`, later rewritten — see Post-close sync below)

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

## Post-close sync (migration mode, same session, no further engineering)

Two concurrent Claude A pushes landed while resolving/pushing the work
above: `8d165f7`+`5ccb79a` (NV-078 medicine/pill counting + angry
raka-count closure), then `a01d729` (angry raka pass 2). Both required
a `git rebase origin/main`, since the earlier commits above touch the
same generated files Claude A's sessions also regenerate. Both
conflicts were **only** in generated JSON
(`compiled_dict.json`/`compiled_dict_alternates.json`) — resolved by
regenerating fresh via `node prepare-data.js` at each rebase point
rather than hand-merging, then re-running the full gate before
continuing. Both rebases rewrote this session's commit hashes; the
`f737f14`/`f0453d6`/`c22ae5a` hashes cited above no longer exist on
`origin/main`'s history (confirmed: `git merge-base --is-ancestor
c22ae5a origin/main` returns false) — this is expected, ordinary
rebase behavior per this repo's own established practice, not data
loss; the content is identical, only the hashes changed. **Final
commit hashes, as actually pushed:** `6187b2a` (runtime-propagation
fix), `5ac363f` (SUPERSEDED-only-candidate fix), `cc903d4` (rebuild
#1), `5da5b16` (session-close docs, itself later amended — see below),
`3ff50c0`/`39763a3` (further dist rebuilds after the second rebase).
**This session's true final commit: `39763a3`.**

Two further Claude A commits (`56291e4`, `1901a56` — a session-close
migration doc plus a new `flag_from_claude_a` item for Claude B,
`src/data/phrase_maps.js`'s stale "angry" form) landed immediately
after and were pulled via a clean fast-forward (`git merge --ff-only
origin/main`, zero conflict, docs-only). **Not investigated or
actioned** — entering migration mode per explicit instruction to stop
rather than continuing to chase a moving target. This migration doc
and `.ai/WORKSTATE.yaml`/`.ai/SESSION_BOOTSTRAP.md` were updated in
place afterward, in migration mode, purely to correct now-stale
commit-hash references and entry counts and to record what's pending
— no code, test, or dictionary content changed after the fast-forward.

Full gate re-verified once more, against the final fully-merged state
(after both rebases, before the trailing fast-forward, and confirmed
unaffected by the fast-forward since it touched no shared files):
215/215 unit tests (unchanged from before the rebases), 0 NEW
`repository-intelligence.js` violations, lint clean, vite build clean.
See the corrected counts in Verification below.

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

## Verification (per Governance Rules 7–8: scope stated explicitly, not just result)

**What WAS verified, this session, against the final pushed state
(`39763a3`):**
- `node prepare-data.js`: 8132 unique entries (8109 before Claude A's
  concurrent NV-078 medicine/pill additions were rebased in; the delta
  is entirely NV-078 content, not this session's own work), 190 held
  (SUPERSEDED-only, this session's own fix — count unchanged by the
  rebases since no rebased-in content touched the held-key set), 1019
  alternates, category index 3930.
- `node test-dictionary.js`: **8132/8132** valid.
- `node repository-intelligence.js`: PASSED, **0 NEW violations**
  across all checks (A raka-locality 11 report-only unchanged; B 7
  known/0 new; C 1533 known/0 new; D 2014 checked/0 problems; E 115
  known/0 new; F 289 known/0 new — down from 292 known at session D's
  resume, expected and harmless: some previously-allowlisted Check F
  mismatches were for keys this session's fix correctly stopped
  shipping from `compiled_dict.json`, so they can no longer be found
  as mismatches at all, not silently dropped from the allowlist).
- `node --test tests/unit/*.test.js`: **215/215** (up from 206 at
  resume — 8 new tests from this session's own fixes; 1 pre-existing
  case widened, 1 pre-existing case's assertion set corrected, both
  described above; unaffected by either rebase — Claude A's own test
  edits this session were to unrelated cases, confirmed by diff
  before rebasing).
- `npm run lint`: 0 errors, 0 warnings — re-run after each rebase.
- `vite build`: clean — re-run after each rebase, `dist/` committed
  fresh each time (asset hashes change because the underlying
  `compiled_dict.json` content changed; this is expected and not
  itself evidence of a problem).
- Both rebase conflicts were confirmed to be **exclusively** in
  generated files (`compiled_dict.json`/`compiled_dict_alternates.json`)
  — checked via `git status --short` immediately after each conflict,
  not assumed.
- `docs/SUPERSEDED_ONLY_KEYS.md` spot-checked post-rebase: `'two cars'`
  and `'twenty students'` still present and correctly held, confirming
  the fix survived both rebases intact.
- No `master_dictionary.json`/`garo_dictionary.json`/
  `corrections.json` edits by Claude B this session — all Claude-B-side
  changes are pure engineering (`translationEngine.js`,
  `prepare-data.js`, generated `compiled_dict*.json`/`dist/`, test
  files, docs).
- `git fetch origin` run before every push attempt (three times total
  this session); `git status` clean and `HEAD == origin/main` (or a
  clean fast-forward ahead of it) confirmed at each of those points and
  again at final migration-mode close.

**What was NOT verified / explicitly out of scope this session:**
- The two items Claude A's own concurrent commits introduced or
  flagged (NV-078 medicine/pill content; the new `phrase_maps.js`
  "angry" flag) were **not** independently reviewed for linguistic
  correctness — only confirmed not to conflict with or break this
  session's own engineering changes (full gate green after each
  rebase). Reviewing NV-078's content, or acting on the
  `phrase_maps.js` flag, is out of scope for this session per the
  explicit instruction to stop and enter migration mode.
- The `student` bare-noun root gap (this session's own finding) was
  **flagged, not resolved** — no attempt was made to guess or derive
  a replacement value; that is explicitly left for Claude A, see
  below.
- A full Rule-8-style duplicate-representation sweep (checking
  `corrections.json`/`phrase_maps.js`/`category_index.json` for any
  other place the `'twenty students'`/`'two cars'`-class fix might
  need to propagate) was **not** performed this session — the fix
  operates at the `prepare-data.js` compile-pipeline level, upstream
  of all of those derived tables, so by construction none of them can
  independently re-introduce a filtered SUPERSEDED-only value; this
  reasoning was checked against the pipeline's actual data flow but
  not verified by an exhaustive per-table audit. Noted as provisional
  in that narrow sense, not because a gap is suspected.
- No new native-speaker input was sought, relayed, or applied this
  session — consistent with "pure engineering" scope stated above.

## Commits this session (final hashes, post-rebase, as pushed to `origin/main`)

1. `6187b2a` — runtime-propagation fix + tests (§3.5)
2. `5ac363f` — SUPERSEDED-only-candidate pipeline fix + tests (§3)
3. `cc903d4` — rebuild (`compiled_dict*`/`dist`) + rc037 test update
4. `5da5b16` — session close: `.ai/WORKSTATE.yaml`, `.ai/
   SESSION_BOOTSTRAP.md`, this migration doc (initial version)
5. `3ff50c0` — dist rebuild after first post-close rebase (NV-078)
6. `39763a3` — dist rebuild after second post-close rebase (angry raka
   pass 2) — **this session's true final commit**
7. (this commit) — migration-mode finalization: corrected stale
   commit-hash references and entry counts in this doc,
   `.ai/WORKSTATE.yaml`, `.ai/SESSION_BOOTSTRAP.md` to match the
   actually-pushed state; added explicit pending-next-session notes.
   No code/test/dictionary content changed.

Two trailing Claude A commits (`56291e4`, `1901a56`) sit on
`origin/main` on top of `39763a3` as of migration-mode close —
pulled clean via fast-forward, not authored by this session, not
actioned.

## Pending for next session (nothing further investigated past this point)

1. **`src/data/phrase_maps.js` line 38** — stale spaced "angry" form
   (`'Anga ka·o nanga'`), superseded by NV-078's corrected
   `'Ka·onanga'` in `master_dictionary.json`/`corrections.json` but not
   yet updated in this engine-layer file. Claude B's lane. See
   `.ai/WORKSTATE.yaml`'s `claude_b.flag_from_claude_a` and
   `claude_b.pending_next_session`, and
   `docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md`'s closing
   update.
2. **`student` bare-noun root** — see "Flagged, not fixed" above.
   Claude A's lane. `.ai/WORKSTATE.yaml`'s `claude_a.next_action` now
   carries this at the top of that block per Rule 10.
3. Standing open items, unchanged from session D and earlier, not
   re-investigated this session: house/rice/water/food counting (~76
   keys, need native input); person/student/teacher 111-candidate root
   conflict; `always`/`answer`/`a dog bit me`/`are you sleeping`
   (evidence-only, waiting on Claude A); the P2/P3
   `phrase_maps.js`/`RC-CANDIDATE-038` backlog noted since 2026-08-07/09.
