# Claude B — Session Migration Document (2026-08-26)

## Divergence found mid-close, then resolved same session (Rule 9a step 4, then Rule 10)

The initial migration-mode close (Rule 9a) found `origin/main` had moved
to `5273c0f` (Claude A, doc-only) while this session was working —
`git pull --ff-only` correctly refused, `git push` was rejected, and per
Rule 9a step 4 this session did not resolve it under migration mode; the
two commits were left local-only and documented for the next session.

**Immediately after, on continued instruction, the divergence was
resolved:** `git fetch` (confirmed `origin/main` unchanged at `5273c0f`),
`git rebase origin/main` — clean, zero conflicts (Claude A's commit was
doc-only in `docs/`/`repository.head`; this session's commits touched only
`claude_b:` in `.ai/WORKSTATE.yaml`, disjoint fields). Full gate re-run
post-rebase (not assumed clean): 247/247 tests, 0 new
`repository-intelligence.js` violations. Rule 12 apostrophe spot-check
re-run for good measure (`"i don't know"` → `"Anga uija"`, phrase-map —
correct, not the polarity-reversed regression). Pushed:
`5273c0f..4724bb5`. Verified after push: `git fetch` + `git status` clean,
local `HEAD` (`4724bb5`) == `origin/main` (`4724bb5`), zero divergence.

**Nothing below this point needs revisiting** — the actual engineering
work (AI-002 verification, AI-fallback additions) was unaffected by the
divergence; only the final push mechanics needed the extra step.

## AI-002: independent runtime re-verification (per explicit instruction, not just re-running unit tests)

**Scope verified:** live `translate()` calls (not `analyzeGrammar()` alone,
though both were checked) for every required shape:

| Shape | Sentence | Result |
|---|---|---|
| All resolve, single word | `i saw the dog` | `Anga achak·ko Nikaha`, grammar-assembly, 0.82 |
| All resolve, full-phrase classifier path | `he has two dogs` | `Ua achak mang·gni·ko donga`, grammar-assembly, 0.82 |
| All resolve, per-word branch (2-word, no existingFullPhrase) | `i bought a dog cat` | `Anga meng·gong·ko breaha`, grammar-assembly, 0.82 |
| First word unresolved, last resolves (**the original AI-002 bug**) | `i bought a gadget yesterday` | `Anga Mejal breaha` → sov-assembly, 0.75 — **"yesterday"/Mejal no longer wrongly occupies the object slot; it's absent, not substituted** |
| Middle word unresolved (3-word object) | `i bought a dog gadget yesterday` | `Anga Achak Mejal breaha` → sov-assembly, 0.75 |
| Last word unresolved, first resolves | `i bought a dog gadget` | `Anga Achak breaha` → sov-assembly, 0.75 |
| Multiple words unresolved | `i bought a gadget widget` | `Anga breaha` → sov-assembly, 0.75 |
| Single-word unresolved (pre-existing baseline, unaffected) | `i saw gadget` | `Anga Nikaha` → sov-assembly, 0.75 |

Plus non-interference guards, all confirmed byte-identical to expected:
`i am lying in bed`, `i am lying down` (no-verb copula branch, unaffected),
`good morning` (exact-phrase), `two sticks` (classifier), `she has three
children` (correction).

**How "surfaced correctly" was verified, precisely:** `analyzeGrammar()`
now returns `object.garo === '[UNKNOWN]'` internally for every unresolved
case above (confirmed directly, not inferred). Traced downstream: the
existing `sentenceBuilder.js:314` guard (`if (result.includes('[UNKNOWN]'))
return null;`) makes `assembleGrammar` return `null` whenever this fires,
which makes `translationEngine.js`'s cascade fall through to
`sov-assembly` — the same honest-drop fallback the single-word-unresolved
case has always used (confirmed: identical `method`/`confidence` in both).
This is the project's actual intended unresolved-representation at the
`translate()` output level — it does not print the literal string
`[UNKNOWN]` in the final Garo string; it demotes to a lower-confidence
method that omits unresolved content rather than guessing. Confirmed this
is deliberate design, not incidental, by reading the guard's own code and
comments, not assuming.

**Gate:** `prepare-data.js` → `test-dictionary.js` →
`repository-intelligence.js` → `node --test tests/unit/*.test.js`:
235/235 baseline tests pass, 0 new `repository-intelligence.js`
violations. `vite build` still fails with `vite: not found` — no
`node_modules` in this sandbox, pre-existing environment gap, unrelated
to any code here, flagged rather than silently treated as gate-clean
(same as the 2026-08-25 close).

**No `master_dictionary.json`/`corrections.json`/`compiled_dict.json`
changes.** Confirmed via `git status`/`git diff` before and after this
verification pass (empty).

## AI-fallback prototype: PROVISIONAL path demonstrated, isolation tests added

**Inspected first, per instruction:** `src/research/researchFallback.js`
and `detectUnresolved.js` (both from the 2026-08-24 session) already had a
clean, pluggable `{search, synthesize}` provider interface, a correct
status model (`PROVISIONAL`/`NO_EVIDENCE_FOUND`/`UNRESOLVED`/
`NATIVE_VALIDATION_REQUIRED`, no `CONFIRMED`), an in-memory cache, and
`requires_native_validation: true` unconditionally. Not wired into
`translate()`. This session did not need to rebuild any of that.

**Gap found and closed:** the existing `demo.js` (real evidence, replayed
via `demoProvider`) has exactly two cases, both landing on
`NO_EVIDENCE_FOUND` — the PROVISIONAL path (task brief item 8:
candidate(s), evidence, sources, confidence, status=PROVISIONAL,
requires_native_validation=true, all populated together) was never
actually exercised end to end, only asserted as a design claim in the
2026-08-24 design doc.

**Added, both new files:**
- `src/research/mockProvider.js` — an explicitly-labeled, clearly-marked
  mocked/fabricated evidence source and candidate Garo string (`"Bewal"`
  for `"widget"`, flagged `FABRICATED` in its own file header and in the
  `source.note` field returned). Not real linguistic content, not
  intended to be mistaken for one, never imported by any production file.
- `src/research/demoProvisional.js` — runs `researchMissingWord()` through
  `mockProvider` and asserts every field of the documented PROVISIONAL
  shape is actually populated. Run live this session
  (`node src/research/demoProvisional.js`): all 7 shape checks pass
  (candidates present with `garo`/`confidence`/`source`; `evidence[]`
  populated; `sources[]` populated; `confidence` numeric;
  `status === 'PROVISIONAL'`; `requires_native_validation === true`).

**Added `tests/unit/researchFallback.test.js`, 12 tests, now part of the
standard `npm run build` gate:**
1. `STATUS` has no `CONFIRMED` key (exact key-set assertion).
2. `DEFAULT_PROVIDER` fails closed (`NO_EVIDENCE_FOUND`, no fabrication).
3. Invalid/empty `englishWord` → `UNRESOLVED`,
   `requires_native_validation: true`.
4. Full PROVISIONAL shape via `mockProvider` (item 8's exact checklist).
5. Disagreeing candidates → `candidate_garo` stays `null` (no silent
   pick), both candidates still returned.
6. Cache hit/miss (`fromCache` true/false correctly).
7. **Structural isolation:** every `.js` file under `src/` and
   `src/data/` scanned for an import of `src/research/` — none found
   (production code cannot reach this module even accidentally).
8. **No write capability:** `researchFallback.js`, `detectUnresolved.js`,
   `mockProvider.js` scanned for any `node:fs`/`fs` import — none found,
   so no code path in this module can write any file, canonical or
   otherwise.
9. **Behavioral isolation, production path:** `translate('i saw gadget')`
   called before and after two `researchMissingWord()` calls (one via
   `mockProvider`, one via `DEFAULT_PROVIDER`) — output `deepEqual`,
   confirming the research layer cannot influence live translation.
10. **Behavioral isolation, canonical data:** `master_dictionary.json`,
    `src/data/corrections.json`, `src/compiled_dict.json` read via `fs`,
    hashed by content before and after two `researchMissingWord()` calls
    — asserted byte-identical (`assert.equal`, not just "no error thrown").
    This directly tests the actual claim item 9 asked for, not just an
    inspection-based argument.
11–12. `detectUnresolvedWords()` sanity (flags a genuinely unresolved
    word; reports `isComplete: true` for a fully-resolved sentence) —
    read-only, no change from the 2026-08-24 session's own module.

**Design doc addendum:** appended to
`docs/CLAUDE_B_AI_FALLBACK_DESIGN_20260824.md` (not a new doc) recording
this session's PROVISIONAL-path gap-close and the new automated isolation
evidence, replacing that doc's prior inspection-only isolation claim with
a tested one.

**Full gate after these additions:** 247/247 tests (235 baseline + 12
new), 0 new `repository-intelligence.js` violations. Both `demo.js` and
`demoProvisional.js` run clean end to end.

## Governance-model check (Rule 13 / Rule 6a)

No §4 intersection this session beyond AI-002 itself, which was already
`FIXED` before this session began — this session only re-verified it
independently at runtime; no new override, no new mechanism, no §4 table
edit needed. AI-fallback prototype work is unrelated to any §4 row.

## Runtime Handoff (Claude B)

Runtime Handoff: None. (No NV closures this session — engineering-only,
per role scope. AI-002's runtime status was independently confirmed, not
just claimed — see above.)

## What remains before production integration (AI-fallback)

Unchanged in substance from the 2026-08-24 design doc, now with the
PROVISIONAL path actually demonstrated rather than only asserted:

1. **No real `provider` implementation.** `DEFAULT_PROVIDER` (honest
   no-op), `demoProvider` (real evidence, replayed, both cases
   `NO_EVIDENCE_FOUND`), and `mockProvider` (fabricated, for shape-testing
   only) are the only three providers that exist. A real
   `{search, synthesize}` backed by an actual web-search API and
   AI-synthesis call is still entirely unbuilt.
2. **Not wired into `translate()`.** `translate()`'s cascade is
   byte-for-byte unchanged by anything in `src/research/` — confirmed
   this session via the new isolation tests (#7, #9 above), not just
   asserted.
3. **No write path exists, anywhere, from `src/research/` to
   `master_dictionary.json`/`corrections.json`/`phrase_maps.js`/
   `compiled_dict.json`** — confirmed this session via the new isolation
   tests (#8, #10 above).
4. **`STATUS.CONFIRMED` still does not exist** in `researchFallback.js`
   — confirmed this session via test #1 (exact key-set assertion, not
   just "I didn't see it").
5. **Explicit Project Owner approval is still required** before any
   wiring into `translate()`'s cascade, per the original task brief and
   unchanged since 2026-08-24. This session made no architecture decision
   that would need re-approval — only added tests and a demo proving the
   already-designed architecture behaves as documented.

## Tests performed this session (summary)

- AI-002: 8 live `translate()` shapes (table above) + 4 non-interference
  guards, all via direct script execution, output inspected by hand
  against expected values — not just "tests passed."
- Full existing gate re-run twice (once before AI-fallback additions,
  once after): 235/235 then 247/247, 0 lint/repository-intelligence
  regressions both times.
- AI-fallback: 12 new automated tests (`node --test`) + 2 manual demo
  script runs (`demo.js`, `demoProvisional.js`), all passing.
- Isolation specifically re-verified twice: once via static source
  scanning (no imports, no `fs`), once via runtime behavior (`translate()`
  output and canonical file contents diffed before/after).

## Resume protocol for the next Claude B (or any role) session

1. **Resync first per Rule 10** — `git fetch`, confirm `HEAD == origin/main`
   (should already be true: `4724bb5`), read this doc, then
   `.ai/WORKSTATE.yaml`. The divergence noted above is already resolved;
   no rebase should be needed unless something new has landed since.
2. **AI-fallback next step, if picked up:** a real `provider`
   implementation is still the standing next task, per
   `docs/CLAUDE_B_AI_FALLBACK_DESIGN_20260824.md` §4 and this doc's "What
   remains" section above — needs Project Owner input on which
   search/AI API to integrate, not purely an engineering call.
3. Read `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` in full, every session,
   per Rule 13 — AI-002's row is unchanged (`FIXED`, 2026-08-25), this
   session only added independent runtime confirmation of that fix.
