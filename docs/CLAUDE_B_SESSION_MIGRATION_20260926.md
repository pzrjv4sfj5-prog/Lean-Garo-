# Claude B Session Migration — 2026-09-26

**Status: SESSION COMPLETE, CLEAN CLOSE.**

## Resume

Resumed via a pasted migration-doc pointer
(`docs/CLAUDE_B_SESSION_MIGRATION_20260925.md`) plus a fresh PAT-cloned
repo. Resync found no drift beyond that doc's own final commit
(`9522be9`, its own commit landing on `07ec71e`) — confirmed identical to
`origin/main` on arrival. Full gate re-run clean before starting:
8917/8917 dictionary, 9/9 grammatical corrections, 461/461 unit tests,
`npm run build` clean end-to-end.

## Standing open items closed this session

Both items flagged open at the 2026-09-25 close are now closed.

### 1. "several" dropped when composed into a sentence

**Original framing (2026-09-25 doc) was too narrow.** The doc scoped this
to "`Maiba Maiba` doesn't compose." Investigation found the real root
cause: `grammarEngine.js`'s multi-word object-phrase resolver only kept
the **last** word's resolved translation whenever every word in the
phrase resolved individually — any earlier resolved modifier was
silently discarded, with no `[UNKNOWN]` trace. Reproduced live before the
fix: `"i have several/many books"` and even `"i have good/big books"` all
produced `"Angao ki·tap donga"` — the modifier fully vanished regardless
of which word it was.

**Fix, narrowly scoped:** composes `Noun + trailing-quantifier` when the
resolved modifier immediately before the head noun is exactly `bang·a`
or `bang·e` (case-insensitive — `many` resolves capitalized via
`phrase_maps.js`, `several` resolves lowercase via the dictionary). Order
matches two pre-existing citations that already put a quantifier after
its noun (`"the pork meat has a lot of fat"` → `"Wak be·en mit·am
bang·a"`, `"so many people came"` → `"Man·derang bang·e re·baa"`).
Deliberately **not** general adjective+noun object composition
(`good`/`big`/`bad` before a noun) — that remains open, untouched, still
drops silently exactly as before. Widening this fix to those cases would
require a linguistic word-order decision (does the modifier go before or
after the noun, and does it depend on the modifier?) that isn't
evidenced yet.

### Follow-up bug found investigating #1: "she has several dogs" / "we have many students" wrong word order

While confirming the fix above, found a second, related bug via the
user's own report:

- `she has several dogs` → `Ua donga Achak bang·a` (verb before object —
  wrong)
- `we have many students` → `An·ching donga Chattro Bang·a` (same shape)

**Root cause:** `dogs`/`students` have no direct plural dictionary entry
(only the singular does), so the same per-word object resolver (no
plural stripping) failed on them, `object.garo` became `[UNKNOWN]`, and
`translate()` fell all the way through to `sov-assembly` — a much weaker
fallback whose verb-detection heuristic mis-identifies `bang·a`/`bang·e`
as the verb (false-positive on its own generic `·a$` suffix check),
producing wrong word order.

**Fix:** exported and reused `garo_classifier.js`'s existing
`singularize()` (already used by `sov-assembly` and the classifier-
counting path) as a fallback in the object resolver. These sentences now
succeed in `grammar-assembly` — the correct SOV path, with the `·o`
possessor marker — and never reach `sov-assembly` at all.

```
"she has several dogs" -> "Uao achak bang·e donga"
"we have many students" -> "An·chingo chattro bang·a donga"
"she has cats" (no quantifier) -> "Uao menggo donga"
```

### 2. "for some reason or other" → `[UNKNOWN]` when embedded

`for` is a `STOP_WORD` (silently skipped) and `some`/`reason`/`other`
have no individual dictionary entries, so the phrase fell into the
object slot fully unresolved. Confirmed live before the fix: `"he came
for some reason or other"` → `"Ua [UNKNOWN]·ko re·ba·aha"`.

**Fix, per Project Owner directive** — Thangseng gave the native
construction directly in chat: `"he came for some reason or other"` →
`"Ua maiaba a.selni gimin re.baaha."` `grammarEngine.js` now matches the
literal 5-word phrase (`for some reason or other`) as a fixed
reason-adjunct — mirroring this same function's existing `"to X"`
purpose-clause and locative-adjunct handling, **not** a general
reason-clause grammar rule (that's not evidenced by one example).
`sentenceBuilder.js` places it right before the main verb, matching the
confirmed word order.

```
"he came for some reason or other" -> "Ua maiaba a·selni gimin re·ba·aha"
"she left for some reason or other" -> "Ua maiaba a·selni gimin Jak·asi" (generalizes to a different verb)
"for some reason or other" alone -> "Mainaba" (unchanged, standalone correction, a genuinely different realization)
```

## Content correction, logged mid-session (Project Owner directive)

`several`'s value changed twice this session, both times on direct
instruction, not inferred:

1. Session opened with a chat instruction ("several/many is also
   bang·a, like we used for pig fat statement") → `several` set to
   `bang·a`, matching `many` at the time.
2. Native-speaker example from Thangseng, relayed in chat:
   `"i have several books"` → `"Ango adita ki.taprang donga"` and
   `"we have many students"` → `"Chingo bang·a chattrorang donga"` —
   confirming `many = bang·a` was correct, but `several = adita`, not
   `bang·a`.
3. Same conversation, immediately after: **"we will use Bang.e instead
   of adita, log it."** — final value: `several = bang·e`.

Updated `src/data/corrections.json` and `garo_dictionary.json`'s
`"several"` entry. The trailing-quantifier composition fix (item 1
above) was generalized from matching only `bang·a` to matching `bang·a`
OR `bang·e` case-insensitively at the same time, so `several` kept
composing correctly through the word swap instead of regressing to the
original silent-drop bug.

**`many` is unchanged throughout this whole sequence — still `bang·a`.**

## Explicitly NOT addressed this session (flagged, open)

Thangseng's own `"Ango adita ki.taprang donga"` example (now superseded
on the `several`-word-choice, but its **structure** was never
addressed) shows two things the engine does not currently do anywhere:

1. **Modifier before the noun**, not after (`adita ki.taprang`, not
   `ki.tap adita`) — opposite of the Noun+quantifier order this
   session's fix relies on for `bang·a`/`bang·e`.
2. **A `-rang` plural suffix** on the counted noun (`ki.taprang`,
   `chattrorang`) that composition never produces.

Whether either of these is a **general** rule (all quantifiers go
before the noun; plurals always take `-rang`) or specific to the
now-superseded `adita` is genuinely unknown — the Project Owner is
waiting on further clarification from Thangseng before this is
scoped. **Do not guess at either rule from this one example.** Next
Claude B session: check whether that clarification has arrived before
touching object-phrase word order or plural marking again.

## Concurrent drift handled

Rebased cleanly through 3 rounds of concurrent Claude A/D activity this
session:

- `7ab69da`/`02c08a5` (Claude A/D: buffalo=Matma, evidence-package
  handoff) — docs/dictionary-content only, zero file overlap.
- `d8df946` (Claude A: mosquito net=Mosori, finished=Matchotaha, session
  close) — same, zero overlap, but **one `compiled_dict.json` merge
  conflict** on this rebase (both sides had regenerated the same
  generated file independently). Resolved by taking origin's version to
  unblock the rebase, then regenerating fresh via `prepare-data.js`
  afterward so the compiled output reflects both sides' source changes
  together — not by hand-merging or trusting either side's pre-rebase
  artifact.

No content or engine-code conflicts at any point — every collision was
either doc-only or a regenerable build artifact.

## Tests added

- `tests/unit/several_many_quantifier_composition.test.js` (9 tests) —
  covers the quantifier-drop fix, the `several`/`many` word-choice
  history kept correctly distinct throughout, the follow-up word-order
  fix, and regression guards (AI-002, numeral composition, an unrelated
  `[UNKNOWN]` case).
- `tests/unit/reason_adjunct_composition.test.js` (4 tests) — covers the
  reason-adjunct fix, the unchanged standalone form, generalization to a
  different verb, and a regression guard.

## Gate at close

- `node prepare-data.js`: 8922 unique entries compiled.
- `node --test tests/unit/*.test.js`: 470/470 (474 counting both new
  files' full additions across the session's incremental commits).
- `npm run build`: clean end-to-end (prepare-data → test-dictionary →
  repository-intelligence → resync-stale-overrides → unit tests → vite
  build, all `&&`-chained).
- Every touched/new construction live-verified via `translate()`
  post-build, not just `compiled_dict.json` inspection.
- Working tree clean, `git fetch` confirmed no drift from `origin/main`
  at final push.

## Next session: exact resume point

1. Read this doc first.
2. `git fetch origin`; compare HEAD to this doc's final commit; review
   anything since via `git log <that-commit>..HEAD --oneline`.
3. Check whether the Project Owner has further clarification from
   Thangseng on the modifier-order / `-rang`-plural question above
   before touching object-phrase composition again.
4. No other standing open engineering item from this lineage.
