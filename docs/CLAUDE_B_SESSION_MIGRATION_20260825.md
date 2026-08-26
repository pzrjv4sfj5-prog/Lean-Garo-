# Claude B — Session Migration Document (2026-08-25)

## Verification performed this close (scope stated explicitly, per Rule 7)

- **Runtime errors:** `npm run build` (`prepare-data.js` → `test-dictionary.js`
  → `repository-intelligence.js` → full unit suite) → 235/235 tests pass
  (229 baseline + 6 new AI-002 tests), 0 failures, 0 new
  `repository-intelligence.js` violations. `vite build` step at the end of
  `npm run build` fails with `vite: not found` — this sandbox has no
  `node_modules` installed at all (fresh checkout, `npm install` never run
  this session); unrelated to this fix, not a code-gate failure. Flagging
  explicitly per Rule 7 rather than silently treating the gate as fully
  green.
- **Nothing local-only:** `git fetch origin` at session start → local `HEAD`
  (`50b06b6`) already equalled `origin/main`, nothing landed since the
  prior close, no rebase needed to begin work. A **second** `git fetch`
  immediately before committing this close found Claude A had pushed
  `47437e0` (`-rang` plural-marking scope ruling — doc-only, no
  dictionary/engine content, see commit message) in the interim.
  Rebased `66e8cb1` cleanly onto `47437e0`: one conflict, in
  `.ai/SESSION_BOOTSTRAP.md`'s "Current joint work package" section —
  both sessions' entries were purely additive (different topics, no
  textual overlap), resolved by keeping both, my entry first (newest).
  `.ai/WORKSTATE.yaml` auto-merged clean; its `head` pointer corrected
  from `50b06b6` to `47437e0` per the file's own stated convention
  (records state immediately before the commit that updates it). Full
  gate re-verified post-rebase before pushing (see below) — not assumed
  clean from the pre-rebase run.
- **Scope discipline:** no `master_dictionary.json` / `corrections.json` /
  `compiled_dict.json` changes. No linguistic backlog touched. AI-fallback
  prototype (`src/research/*`) untouched — still Phase 1, not wired in.

## What this session did: AI-002 fixed

**Bug (docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md §4, logged prior session):**
`analyzeGrammar`'s object-resolution fallback in `src/grammarEngine.js`
(originally lines 544-545) resolved a multi-word object phrase by falling
straight to `lookupPhrase(lastWord) || lookupGaro(lastWord)` once the
full-phrase and counting-phrase lookups both failed — it never checked
whether an *earlier* word in the phrase was the one that actually failed
to resolve. When it did, and the last word happened to resolve on its own
(e.g. a trailing time adverb), the unrelated resolved word was silently
placed in the object slot with the object marker, and the true unresolved
word vanished with zero trace — worse than a plain drop, since no
`'[UNKNOWN]'` string was ever produced, so it evaded the existing
`result.includes('[UNKNOWN]')` safety check in `sentenceBuilder.js:314`
entirely.

**Root cause, precisely:** the fallback checked resolution status of only
the *last* word in `objectWords`, never the others, and used whatever it
found as the value for the entire object phrase regardless of whether
earlier words had also been checked.

**Reproduced (before fix):**
`analyzeGrammar('i bought a gadget yesterday').object` → `{ english:
'gadget yesterday', garo: 'Mejal', ... }` — `translate()` → `'Anga
mejal·ko breaha'`, method `grammar-assembly`, confidence `0.82`
(indistinguishable from a correct translation; "gadget" is gone, no trace).

**Fix (`src/grammarEngine.js`):** in the same fallback block, after
`existingFullPhrase` (unchanged, still wins outright — no behavior change
there):
- If `analyzeGrammar` found no finite verb elsewhere in the sentence (the
  affirmative-copula/locative-residue construction — e.g. "I am lying in
  bed", where "lying" never resolves to a Garo verb and is *expected* to
  be dropped in favor of the locative noun that follows it), the
  pre-existing last-word-wins behavior is preserved unchanged. This case
  is structurally distinct from AI-002's bug: there is no genuine
  transitive-sentence verb elsewhere, and forcing `'[UNKNOWN]'` here would
  have lost the locative/object marker downstream (regression — confirmed
  by first attempting the broader fix and watching two existing tests
  fail, see below).
- Otherwise (a genuine verb was found — the actual AI-002 case), every
  word in `objectWords` is now checked individually via
  `lookupPhrase(w) || lookupGaro(w)`. If **any** word fails to resolve,
  the object surfaces `'[UNKNOWN]'` — the same signal the single-word case
  already correctly produced — instead of silently substituting whatever
  the last word alone happens to resolve to. If every word resolves
  individually, behavior is byte-identical to before (last word's
  resolution is used).

No multi-word object composition was added — joining multiple resolved
words into one Garo phrase would be inventing a linguistic translation,
outside engineering scope. `master_dictionary.json` untouched.

## Regression tests added (`tests/unit/translationEngine.test.js`)

Six new tests, all under an `// --- AI-002 fix` heading:

1. `AI-002: object-word resolution is tracked per-word, not by
   last-word-only fallback` — unit-level, calls `analyzeGrammar` directly,
   covers all 4 required shapes: all words resolve; first resolves/later
   fails; earlier fails/later resolves (**the exact bug — this assertion
   would have failed under old behavior**, old value `'Mejal'`, new value
   `'[UNKNOWN]'`); multiple words fail; plus single-word resolve/fail as
   baseline.
2. `AI-002: end-to-end translate() no longer ships the wrong-substitution
   output` — confirms `translate('i bought a gadget yesterday')` no
   longer returns `'Anga mejal·ko breaha'` via `grammar-assembly`.
3. `AI-002 regression guard: exact-phrase/corrections lookups still take
   precedence` — `'good morning'` unaffected.
4. `AI-002 regression guard: classifier composition ... unaffected` —
   `'two sticks'` still resolves via `method: 'classifier'`.
5. `AI-002 regression guard: "she has three children" classifier fix
   (2026-08-09) still applies` — exact value unchanged.
6. `AI-002 regression guard: a fully-resolved multi-word object sentence
   still reaches grammar-assembly correctly` — `'i saw the dog'` still
   produces `method: 'grammar-assembly'` with `achak` present.

## Runtime cases tested (manual, via one-off scratch scripts, not committed)

All 6 required shapes from the task brief, via `analyzeGrammar` directly:

| Input | objectWords | Old `object.garo` | New `object.garo` |
|---|---|---|---|
| `i saw dog` | `[dog]`, all resolve | `Achak` | `Achak` (unchanged) |
| `i saw gadget` | `[gadget]`, fails | `[UNKNOWN]` | `[UNKNOWN]` (unchanged) |
| `i bought a dog gadget` | first resolves, last fails | `[UNKNOWN]` | `[UNKNOWN]` (unchanged — old code already correct here, since it only ever checked the last word) |
| `i bought a gadget yesterday` | earlier fails, last resolves | `Mejal` (**wrong substitution — the bug**) | `[UNKNOWN]` (**fixed**) |
| `i bought a gadget widget` | multiple fail | `[UNKNOWN]` | `[UNKNOWN]` (unchanged) |
| `he has two dogs` | full phrase resolves via `existingFullPhrase` | `achak mang·gni` | `achak mang·gni` (unchanged — `existingFullPhrase` still wins first) |

Plus the two no-verb/copula cases that required the `!verb` branch to
avoid regressing:

| Input | Old (and expected) | Without `!verb` branch | With `!verb` branch (final) |
|---|---|---|---|
| `I am lying in bed` | `Anga palang·o` (grammar-assembly) | `Anga Palang` (sov-assembly, lost `·o` marker) | `Anga palang·o` (grammar-assembly, unchanged) |
| `I am lying down` | `Anga ka·ma·ko` (grammar-assembly) | `Anga Ka·ma` (sov-assembly, lost `·ko` marker) | `Anga ka·ma·ko` (grammar-assembly, unchanged) |

## Gate results

- First fix attempt (per-word check applied unconditionally, no
  `existingFullPhrase`/`!verb` gating): **229/229 baseline tests → 3
  failures** (`"I am lying in bed"`, `"I am lying down"`,
  `"has"`-irregular-verb test). Root-caused each (see table above,
  `existingFullPhrase` priority + no-finite-verb copula construction),
  corrected the fix structurally rather than special-casing the
  individual failing test inputs.
- Final fix: **235/235 tests pass** (229 baseline + 6 new), 0 failures.
  `repository-intelligence.js`: 0 new violations. `node --test` run
  directly and via `npm run build`'s full pipeline, same result both
  ways.

## Verified non-interference with (per task brief)

- **Exact phrases:** `'good morning'` still `'Pringnam.'` (never reaches
  the touched code path — exact/corrections lookup precedes it).
- **Corrections:** unaffected, same reason.
- **Grammar assembly:** `'i saw the dog'`, `'I am lying in bed'`, `'I am
  lying down'`, `'he has two dogs'` all confirmed byte-identical to
  pre-fix output.
- **Classifier composition:** `'two sticks'`, `'three long sticks'`,
  `'she has three children'`, `'she has five children'` — all confirmed
  byte-identical (classifier/counting-phrase paths run *before* the
  touched fallback and are structurally untouched).
- **Existing unknown-word behavior:** single-word unresolved objects
  (`'i saw gadget'`) unchanged — still `'[UNKNOWN]'` via the same
  mechanism as before.

## Remaining AI-fallback work (untouched this session, per instruction)

Unchanged from the 2026-08-24C migration doc — still open, in this order:

1. Implement a real `provider` (`{search, synthesize}`) behind
   `researchMissingWord()`'s existing interface in
   `src/research/researchFallback.js` — the interface and cache are done,
   only the provider is a stub.
2. Decide (with Project Owner input — changes runtime behavior) whether/
   how to wire `detectUnresolvedWords()` into `translate()` as an opt-in
   flag, per `docs/CLAUDE_B_AI_FALLBACK_DESIGN_20260824.md` §3.
3. `STATUS.CONFIRMED` still deliberately absent from `researchFallback.js`
   — do not add without explicit Project Owner sign-off, same standing
   note as last close.
4. Promotion path for any research result remains: PROVISIONAL → human/
   native validation → Claude A linguistic approval → only then
   canonical. No write path from `src/research/` to
   `master_dictionary.json`/`corrections.json`/`compiled_dict.json`.

## Resume protocol for the next Claude B session

1. **Resync first.** `git fetch origin`, compare against
   `.ai/WORKSTATE.yaml`'s `repository.head` pointer, `git log --oneline
   <head>..HEAD`, `git pull --ff-only` if behind. Treat this doc as a
   snapshot, not current truth.
2. **Read `.ai/SESSION_BOOTSTRAP.md` in full, then
   `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` in full**, every session —
   AI-002's row should now read **fixed** (this close); if it doesn't,
   resync before trusting this doc.
3. **AI-fallback prototype** is the standing next engineering task if
   nothing more urgent surfaces — see "Remaining AI-fallback work" above.
4. **Note on this fix's scope boundary:** the `!verb` branch added here
   (preserving last-word-wins for the no-finite-verb copula construction)
   is deliberately narrow — it does not attempt to detect or filter
   verb-fragment words (like "lying") out of `objectWords` at the source,
   which would be a cleaner, more complete fix but is a distinct,
   unscoped change (verb detection, not object-resolution). If a future
   session finds another case where a genuine object word is silently
   lost specifically in a no-verb sentence, that is a new, separate bug —
   log it in the governance doc's §4 table rather than folding it into
   AI-002's now-closed scope.
5. **Before closing your own session:** update
   `.ai/WORKSTATE.yaml`'s `claude_b.next_action` (new entry on top, prior
   moved to a dated key) and `.ai/SESSION_BOOTSTRAP.md`'s "Current joint
   work package" section. Confirm `git status` is clean and `git log`
   shows you're not behind origin — checked fresh, not assumed.
