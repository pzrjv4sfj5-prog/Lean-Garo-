# Claude B Session Migration — 2026-08-29B

## Resume context

Resumed via `docs/CLAUDE_B_SESSION_MIGRATION_20260829.md` (this session's
own predecessor, same day). Verified clean before starting: `git fetch
origin`, local HEAD == origin/main == `5c08102`, `git status --short`
empty. Read `.ai/WORKSTATE.yaml`'s `claude_b.next_action` in full and
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` (including §6, added last
session) before touching anything.

Per the predecessor doc's own resume protocol item 4, re-ran the live
`translate("i live in guwahati")` repro first to confirm it was still
reproducing exactly as described (intervening Claude A data changes could
in principle have added "guwahati" to the dictionary and masked the bug):
confirmed still reproducing — `"Anga donga"`, destination silently
vanished, no `[UNKNOWN]`, confidence 0.75.

## Scope

Priority item from the predecessor migration doc: fix
`assembleSentenceSOV`'s silent content-word drop for OOV/unresolved words
(`src/sentenceBuilder.js`). Explicit constraints given: no linguistic-data
changes, no invented translations; add regression tests; verify actual
runtime behaviour; run the full gate; check for propagation/duplicate
issues.

## The fix

**Root cause** (`src/sentenceBuilder.js`, `assembleSentenceSOV`): the
`pairs = content.map(...).filter(p => p.garo)` step silently removed any
content word whose translation attempt returned `null`. For an
out-of-dictionary proper noun (city/place name), that meant the word just
vanished from the output with zero trace — no `[UNKNOWN]`, no error,
confidence unchanged. Same silent-drop shape already fixed once in
`assembleGrammar`'s object/location handling (2026-07-29) and again in
step 7 morphology (RC-CANDIDATE-034, 2026-07-31), but this function's own
`pairs` step had never been touched by either fix.

**Fix**: every content word is now kept in `pairs`; a failed lookup
becomes an explicit `'[UNKNOWN]'` marker instead of being filtered out.
Mirroring `assembleGrammar`'s own existing
`result.includes('[UNKNOWN]')` bail (rather than confidently returning a
sentence with a bare `"[UNKNOWN]"` token stitched into otherwise-fluent
output at sov-assembly's higher 0.75 confidence), `assembleSentenceSOV`
now returns `null` when its own joined result would contain
`'[UNKNOWN]'`. `translate()`'s cascade needed no changes at all — it
already falls through correctly from a `null` sov-assembly result to step
7 (morphology), which already surfaces `'[UNKNOWN]'` cleanly and reports
its own honest, lower confidence (0.65).

Confirmed live, post-fix:
- `translate("i live in guwahati")` → `"Anga donga [UNKNOWN] [UNKNOWN]"`
  (method `morphology`, confidence 0.65) — was `"Anga donga"` (method
  `sov-assembly`, confidence 0.75).
- Verified across 3 independent OOV city names (guwahati, delhi,
  shillong) — not a single-word coincidence.
- `translate("i live in tura")` (a place name genuinely already in the
  dictionary) unaffected: `"Anga Tura·o ong·enga"`, method `exact-phrase`.
- `translate("i live in the village")` (grammar-assembly path) unaffected.

No linguistic data changed, no new Garo vocabulary invented — the OOV
word remains genuinely untranslated, now visibly so.

## Two regressions surfaced (not introduced) by the fix, both fixed

Both were **pre-existing latent bugs** that the old silent-drop behavior
had been accidentally masking — the fix above didn't create either one,
it just stopped hiding them. Found via the full `node --test` run
immediately after the core fix, before this session's own gate check —
exactly the discipline this repo's history repeatedly documents ("don't
trust a single fixed example, run the actual suite").

### 1. `translationEngine.js` step 7's own unguarded ing$-stripping

Step 7 (morphology) does its own independent `ing$/ed$/s$/ly$` stripping
before dictionary lookup — a **third, independent copy** of the exact
RC-CANDIDATE-035 collision class ("using" strips to "us", a real
`pronoun_map.json` key, producing the stray pronoun translation
"Chingna") already guarded in two other places
(`sentenceBuilder.js`'s own stripping, `morphologyEngine.js`'s
`findVerbForm`) but never in this copy. It was never actually reached for
`"she is using her phone"` before today, because sov-assembly's own
silent-drop bug always intercepted that sentence one cascade step
earlier and returned before step 7 was ever tried.

**Fix**: added the same `PRONOUN_MAP` guard, mirroring the existing
precedent exactly (`src/translationEngine.js`, imported `PRONOUN_MAP`).
Confirmed `"she is using her phone"` no longer leaks "Chingna"
(pre-existing regression test `RC-CANDIDATE-035` at
`tests/unit/translationEngine.test.js:903` — this test was untouched and
now correctly still passes).

### 2. Bare "not" missing from `assembleSentenceSOV`'s content-word filter

Bare `"not"` was in neither `STOP_WORDS` nor `AUXILIARY_SKIP` — only the
contraction forms (`dont`, `wont`, `cant`, etc.) were. So `"not"` reached
`assembleSentenceSOV`'s own translation attempt, failed (negation is
handled entirely via the `isNegative` flag, never as lexical content),
and was silently dropped by the *old* filter — meaning
`"a big dog will not eat rice"` secretly depended on that exact same
silent-drop bug to reach its correct output
(`"dal·a Achak Mi Cha·jawa"`) at all. Once the drop was fixed, this
sentence started bailing to morphology and losing its whole
negative-future structure.

**Fix**: added a local `/^(not|never)$/` exclusion to
`assembleSentenceSOV`'s own content filter — deliberately **not** a
global `STOP_WORDS` change (smaller diff; `STOP_WORDS` is shared by other
call sites not audited this session). This exactly mirrors
`grammarEngine.js`'s own **pre-existing** identical guard (2026-07-29,
"Negation-word guard" comment, in its object-extraction loop) — same two
words, same rationale, not a new linguistic rule.

Confirmed `translate("a big dog will not eat rice")` restored to
`"dal·a Achak Mi Cha·jawa"`, method `sov-assembly` — byte-identical to
pre-session behavior.

## Third finding — surfaced, explicitly NOT fixed (Claude A scope)

`master_dictionary.json` carries a literal `"0"` entry
(`confidence: "unverified"`, garo value `"don't do"`) that is
self-evidently a data-entry error (a digit mapped to an unrelated,
semantically nonsensical value). This was surfaced because morphology's
raw (unstripped) word lookup, once reachable for `"0 dogs"` (a second-
order effect of the OOV fix — see below), would otherwise pick up this
garbage value.

Checked against `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §6's bright
line before doing anything: `"0"`'s entry has `confidence: "unverified"`
— no `verified_high`/citation to point at and say "the override doesn't
match this yet." This is a linguistic judgment call, not an engineering
sync. **Not edited.** Flagged here for Claude A/Thangseng relay.

What *was* fixed (engineering-scope, does not touch this data value):
`translationEngine.js` step 7 now strips non-letter characters
(`[^a-z'·]`) from each word before dictionary lookup, mirroring
`assembleSentenceSOV`'s own existing identical strip. This is a general
"a bare non-alphabetic token isn't lexical content this fallback should
trust" normalization — not a judgment about what `"0"` should mean — and
it also confirmed harmless for genuine standalone digit words (`"3"` →
`"gittam"`, etc.): those are handled earlier in the cascade (step 3
exact-word, or classifier composition for count ≥ 1) and never reach step
7 at all. `buildClassifierPhrase` already explicitly rejects `count <= 0`
by design (confirmed by reading `src/garo_classifier.js` directly, not
assumed) — so even fixing the unrelated `parseCountingPhrase`
falsy-zero-count JS bug (`!count` treats `0` as "no count given") would
**not** have prevented "0 dogs" from reaching sov-assembly/morphology
anyway; not attempted, out of today's scope, flagged only as an
observation in case it matters to a future session.

One existing regression test depended on the old, silently-wrong-but-
passing behavior: `{ in: '0 dogs', expectGaro: 'Achak' }` (relying on
sov-assembly's *old* filter to silently drop the untranslatable "0").
Updated to assert the new, honest behavior —
`{ in: '0 dogs', expectGaro: '[UNKNOWN] Achak', expectMethod:
['morphology'] }` — with an inline comment explaining why and
cross-referencing this doc.

## Regression tests added

`tests/unit/translationEngine.test.js`, 7 new tests plus 1 updated
existing case:

1. `"i live in guwahati"` surfaces `[UNKNOWN]`, not `sov-assembly`.
2. The resolved words (`"donga"`) are still present alongside the marker.
3. `"i live in tura"` (dictionary-covered) is completely unaffected.
4. 3 independent OOV city names (guwahati/delhi/shillong) all surface the
   marker — not a single-word coincidence.
5. A fully-resolved sentence with no unknown words
   (`"a big dog will not eat rice"`) is unaffected by the bail change.
6. `"she is using her phone"` no longer leaks `"Chingna"` (side-fix 1).
7. `"a big dog will not eat rice"` still assembles the exact correct
   negative-future form (side-fix 2).
8. Updated: `"0 dogs"` now asserts the honest `[UNKNOWN]`-marked output
   (Claude-A-scope finding, see above).

## Full gate

| Check | Before this session | After |
|---|---|---|
| Dictionary entries | 8189/8189 | 8189/8189 (unchanged — no data files touched) |
| Grammatical corrections | 9/9 | 9/9 (unchanged) |
| Unit tests | 247/247 | **254/254** (+7 new, 0 failures) |
| repository-intelligence.js | 0 new violations | 0 new violations (checks E/F/G all 0 new) |
| `scripts/resync-stale-overrides.mjs` | 0 candidates | 0 candidates |
| `npx vite build` | — | clean (58 modules, no errors) |

Propagation verified: fresh `node prepare-data.js` rebuild byte-identical
to the committed `compiled_dict.json`/`compiled_dict_alternates.json`
(`git status --short` empty on both after rebuild, not just trusted from
a prior run).

Duplicate-key check: not re-run this session — `git status --short`
before any gate command confirms only `src/sentenceBuilder.js`,
`src/translationEngine.js`, and `tests/unit/translationEngine.test.js`
were touched (plus the expected `dist/index.html` rebuild artifact and
this doc/`WORKSTATE.yaml`). No dictionary/data file was touched, so the
pre-existing ~1000-group duplicate-key backlog (flagged ongoing since
2026-08-28) is genuinely unaffected by this session, not newly re-verified.

## Runtime Handoff

None. Both regressions this session's own fix surfaced were investigated
and fixed in the same commit, each with its own regression test — nothing
deferred silently. The one deliberately-deferred item (the `"0"`
dictionary value) is explicitly Claude A's, documented above, not carried
as an unstated gap.

## Remaining items / Next session

1. **[Linguistic, Claude A/Thangseng]** `master_dictionary.json`'s
   `"0"` → `"don't do"` entry (`confidence: "unverified"`) is confirmed
   wrong data — needs a real correct value for the digit zero (or
   removal, if "0" as a standalone dictionary word doesn't actually need
   one — the classifier system's own `NUMBERS`/`getClassifierSuffix`
   tables in `src/garo_classifier.js` are independent of this dictionary
   entry and don't need it fixed to function correctly for `0 <= n`
   composition, which is separately and deliberately unsupported —
   `buildClassifierPhrase` returns `null` for `count <= 0` by design).
2. **[Linguistic, Claude A/Thangseng, pre-existing]** The imperative-vs-
   declarative `wait` sense-collision (predecessor session, Part B item
   2) — unchanged, still open, still explicitly out of engineering scope.
3. **[Linguistic, Claude A, pre-existing]** The ~300-row no-confidence
   backlog and the 4 stale-confidence citation-hygiene rows (`bye`,
   `bland` ×2, `cooked`) flagged at the 2026-08-28 close — both still
   untouched, still not this session's scope.
4. **[Linguistic, Claude A, pre-existing]** The ~1000-group duplicate-key
   backlog (ongoing since 2026-08-28) — untouched this session, no data
   files were modified.

No other engineering-scoped work is outstanding as of this commit.

## Resume protocol for whoever picks this up next

1. `git fetch origin`; confirm local HEAD == origin/main before any work
   (per `repository.head_convention` — compare against live `git log`,
   not just this doc's claimed HEAD).
2. Read `.ai/WORKSTATE.yaml`'s `claude_b.next_action` (top entry) in full
   — supersedes this doc's summary if the two ever disagree post-hoc.
3. Read `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` in full (including §6)
   before making any master-metadata-adjacent edit.
4. If picking up item 1 above (the `"0"` dictionary value): this needs an
   actual Thangseng/native relay question or explicit Project Owner
   decision, not corpus-internal guessing — the entry is `unverified`
   with no other candidate to defer to at all, unlike the predecessor
   session's `wait` case (which had two competing cited candidates).
5. If picking up item 2 (`wait` sense-collision): unchanged from the
   predecessor doc's own guidance — needs a real Thangseng/native relay
   question.
