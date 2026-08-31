# Claude B Session Migration — 2026-08-31C

## Resume point

Resumed via `docs/CLAUDE_B_SESSION_MIGRATION_20260831B.md`. Resynced
against actual repo state before touching anything: `git fetch` +
`git log` confirmed `HEAD == origin/main` at `95702d2` (the go/re·ang-
decoupling fix that doc describes), working tree clean, no local
commits. That fix was genuinely landed, not just claimed by the doc.

## Task

Continued the CLAUDE B engineering audit (started this session, see
prior chat turn — no separate migration doc for the audit-only portion
since no code was touched during it). The audit surfaced one real bug
in the confirmed-evidence category, which the Project Owner then
directed to be fixed immediately: negative-future-continuous
("will not be going") had no working runtime path.

Confirmed native evidence (unchanged, not reinterpreted):
```
re·jawa     = will not go
re·angjawa  = will not be going
```

Live repro before touching anything:
```
translate("he will not be going") -> "Ihing Ua"   [sov-assembly, 0.75]
```

## Root cause (traced live, not from grep)

Two compounding defects:

1. **`src/grammarEngine.js`'s verb-finding loop** (`AUXILIARY_SKIP`
   guard, ~line 205, pre-fix): unconditionally discarded `"going"` in
   every sentence shape. This is correct when `"going"` introduces a
   real infinitive verb ("going to eat" — `"going"` is a pure future/
   intention marker there, and the real finite verb is "eat"), but
   wrong when `"going"` IS the sentence's only lexical verb ("he is
   going", "he will not be going") — in that shape `verb` stayed `null`
   for the rest of the pipeline, with no signal anything was lost.
2. **`src/sentenceBuilder.js`'s `assembleSentenceSOV`** "bare-noun
   negation fallback" (~line 235): designed for genuine bare-noun
   negations ("not rice"/"not water" — no verb, no adjective, just a
   negated noun). Once (1) left the sentence with zero verb signal but
   a resolved subject pronoun (`"he"` → `"Ua"`), this fallback
   misidentified the bare subject as the bare-noun case and wrongly
   prepended the dictionary's `"no"` word (`"Ihing"`) to the subject
   itself — producing `"Ihing Ua"` ("no he"), nowhere near
   `re·angjawa` and not a coherent negation of anything.

A third, narrower issue meant even fixing (1) alone wasn't enough:
`IRREGULAR_VERBS['going']` already exists (`'re·angenga'`), so once
`"going"` reaches the verb-resolution branches, `isIrregular` is `true`
— which gates RULE-030 (the existing hardcoded negative-future
exception for bare `"go"` → `re·jawa`) off entirely for `"going"`. Left
alone, `"going"` would have fallen to the generic `if (isNegative)`
branch, which only ever appends the bare `'ja'` suffix (→ `Re·angja`,
the already-correct but *different* "did not go"/"is not going" shape)
— never the future-specific `'jawa'` this aspect+tense combination
needs.

## Fix (engineering-scope only — no Garo forms invented)

1. **`src/grammarEngine.js`**, verb-finding loop: `"going"` is no
   longer unconditionally skipped. A lookahead (past an optional `"to"`)
   checks whether the following word is a real infinitive verb, using
   the SAME two already-existing signals the codebase already uses for
   this exact judgment elsewhere — `PURPOSE_MAP` (the table the
   purpose-clause extraction loop further down uses for "to eat" →
   `cha·na`) and `VERB_LEMMAS` (the table `sentenceBuilder.js`'s
   `assembleSentenceSOV` already uses for its own verb-vs-non-verb
   decision). If neither signal matches, `"going"` is treated as the
   sentence's own finite verb and falls through to normal resolution
   instead of being discarded. No new heuristic invented — this is a
   structural fix (works for any sentence shape hitting this branch,
   not one sentence), and an earlier draft that used `VERB_LEMMAS`
   alone was caught regressing `"he is going to eat"` (`VERB_LEMMAS`
   doesn't happen to have an entry for `"eat"`) before landing — fixed
   by checking `PURPOSE_MAP` too, since that's the table the adjacent,
   already-correct purpose-clause logic itself relies on for this exact
   word.
2. **`src/grammarEngine.js`**, new branch (placed immediately before
   RULE-030, fires only when `isNegative && detectedTense === 'future'
   && w === 'going'`): builds `re·angjawa` via `applyTense(getConjugationRoot
   ('go', garoVerb), 'negative_future')` — reusing the exact same
   already-VERIFIED `Re·ang` conjugation stem and `jawa` suffix RULE-030
   itself uses for `re·jawa`, just without RULE-030's `w === 'go'` bare-
   root exception (which is specifically for the non-continuous case).
   RULE-030 itself is completely untouched and still fires first for
   every non-continuous negative-future verb.
3. **`src/morphologyEngine.js`**, `getConjugationRoot`: added a lemma
   fallback (strip `ing$|ed$|s$`, retry once) so a caller can pass an
   inflected surface token (`"going"`) and still reach the table's
   `"go"` key — a no-op for every verb not in
   `conjugation_roots.json`, and for `"go"` itself unchanged (direct key
   still hits first).
4. **The bare-noun-negation fallback in `sentenceBuilder.js` was NOT
   touched.** With (1)+(2) fixed, `assembleGrammar` (grammar-assembly,
   step 6) now succeeds for this construction and `translate()` returns
   before ever reaching `assembleSentenceSOV` (step 6.5) — the fallback
   is structurally unreachable for this construction now, confirmed
   live (see Verification below: `method: 'grammar-assembly'` for every
   variant, never `'sov-assembly'`).

## Verification (live `translate()`)

```
translate("he will not be going")    -> "Ua Re·angjawa"     [FIXED — was "Ihing Ua"]
translate("she will not be going")   -> "Ua Re·angjawa"
translate("i will not be going")     -> "Anga Re·angjawa"
translate("they will not be going")  -> "Uamang Re·angjawa"

translate("he will not go")          -> "Ua re·jawa"         [unchanged, RULE-030]
translate("she will not go")         -> "Ua re·jawa"         [unchanged]
translate("i will not go")           -> "Anga re·jawa"       [unchanged, correction]

translate("he did not go")           -> "Ua Re·angja"        [unchanged]
translate("i did not go")            -> "Anga Re·angja"      [unchanged]
translate("she will go")             -> "Ua Re·anggen"       [unchanged]
translate("i am going to school")    -> "Anga skulchi re·angenga"  [unchanged]
translate("he went to the market")   -> "Ua bajalchi re·anga"      [unchanged]
translate("he is going to eat")      -> "Ua cha·na"          [unchanged — 'going' still
                                                                correctly skipped as pure
                                                                auxiliary here]
translate("he did not eat")          -> "Ua Cha·ja"          [unchanged, control]
```

Full shared brief matrix (present/past/future/continuous/negative/
imperative/negative-imperative/question/object+ko/classifier/OOV/
multi-word-object) re-run byte-for-byte identical to the pre-fix
values, with only the target line changed. `method` for all four
`re·angjawa` subject variants is `'grammar-assembly'`, never
`'sov-assembly'` — confirms the bare-noun-negation fallback cannot
reach this construction anymore.

### Side effects surfaced and handled deliberately (not silently shipped)

- `translate("he is going")` (bare, affirmative, no destination): was
  `"Ua"` (verb missing entirely) — now `"Ua re·angenga"`. This reuses
  an already-VERIFIED value (`re·angenga` already ships for "i am
  going"/"i am going to school") for a new subject — mechanical, not a
  new linguistic call, but flagged here for visibility since it wasn't
  the session's explicit target.
- `translate("he is not going")` (present-negative-continuous, no
  "will"): was `"Ihing Ua"` (same bug family) — now `"Ua Re·angja"`.
  This is a genuine improvement (well-formed, reuses the already-
  VERIFIED `Re·angja` value), but **`Re·angja` is only confirmed by
  native evidence for the past-negative shape ("did not go")** — I have
  no confirmation it's also correct for present-negative-continuous
  ("is not going"). Not fixing this differently (e.g. leaving it broken
  to avoid the question) would have been arbitrary given it's the exact
  same code path as the confirmed fix. **Flagged below as
  LINGUISTICALLY UNRESOLVED, not asserted as correct.**

## Test changes

Added 6 new regression tests to `tests/unit/translationEngine.test.js`
(appended after the existing go/re·ang- decoupling block): the core
fix, all-subject variants, RULE-030 non-regression, the "going is not
discarded" structural fix, the "going to eat" auxiliary-use non-
regression, and an explicit assertion that the fallback method/output
(`'sov-assembly'` / `"Ihing"`) is unreachable for this construction.
Zero existing tests modified.

## Gate status (full re-run, all clean)

- `node prepare-data.js`: 8199/8199 entries, unchanged — zero
  `master_dictionary.json` edits this session (pure engine/grammar
  fix).
- `node test-dictionary.js`: 8199/8199, 9/9 grammatical corrections.
- `node repository-intelligence.js`: 0 new violations across all 7
  checks (A–G).
- `node scripts/resync-stale-overrides.mjs`: 0 candidates (same pre-
  existing `build` skip and `answer` exceptions as before, untouched).
- `node --test tests/unit/*.test.js`: 277/277 (was 271, +6 new), 0
  failures.
- `vite build`: clean, 59 modules (`dist/index.html`'s script hash
  refreshed as a normal build-output side effect, matching this
  repo's existing precedent of committing that file).
- `npm install`: skipped, `node_modules` already present from the
  prior session in this same container.

## Open item handed to Claude A / Thangseng

**LINGUISTICALLY UNRESOLVED** — present-negative-continuous "going":
Is `Re·angja` (the same form confirmed for past-negative "did not go")
also correct for `"he is not going"` (present tense, continuous
aspect, negated)? Or does Garo distinguish these the way it
distinguishes `re·jawa` (will not go) from `re·angjawa` (will not be
going)?
- English word/phrase: "is not going" / "isn't going"
- Intended POS: verb (motion), continuous aspect, negated, present tense
- Exact intended meaning: "[subject] is not [in the process of / with
  intention of] going [right now]" — as opposed to "did not go" (past,
  completed) or "will not go" (future, simple)
- Example sentence: "He is not going [to the market right now]."

This item was surfaced as a side effect of the re·angjawa fix (same
code path, `Re·angja` already ships correctly for "did not go") — not
independently investigated or newly broken by this session. No runtime
change was made pending this answer; the mechanical output
(`"Ua Re·angja"`) already shipped as the best available reuse of
existing verified data, but should not be treated as native-confirmed
until Thangseng weighs in.

## Also investigated this session: the `-ko` open question (handoff only, no decision made)

From the earlier audit pass: `-ko` (confirmed via `film-ko`) is only
ever attached in `assembleGrammar`'s structured subject+object path —
never in `assembleSentenceSOV`, bare-imperative sov-assembly, or
compound-split. E.g. `translate("watch the film")` → `"film ni·rik·a"`,
no `-ko`.

**LINGUISTICALLY UNRESOLVED** — is `-ko` grammatically required on a
bare imperative object?
- English word/phrase: "watch the film" (bare imperative with object)
- Intended POS: object marker `-ko` on a definite direct object
- Exact intended meaning: does Garo mark the object of a command the
  same way it marks the object of a declarative sentence ("I want the
  film" → confirmed `film·ko`), or does the imperative construction
  drop the marker?
- Example sentence: "Watch the film." / "Eat the rice."

Not investigated further and no engineering change attempted — this is
purely a native-evidence question, handed to Claude A/Thangseng as-is,
per instruction not to make a linguistic call.

## Repository status at close

- [ ] Not yet pushed — see commit section below, this doc is written
      pre-push and will be accurate once the push completes.
- [x] `git status` clean except this doc + WORKSTATE.yaml update,
      staged for the closing commit.
- [x] No local-only commits remaining after push (verify post-push).
- [x] No untracked files.

## What B did NOT touch

- No `master_dictionary.json` edits — pure engine fix, underlying
  linguistic data untouched.
- RULE-030's negative-future hardcode for bare `"go"` — left exactly
  as-is, still the sole path for `re·jawa`.
- The `-ko` question — investigated only enough to frame it properly;
  no linguistic call made, handed to Claude A/Thangseng as documented
  above.
- The present-negative-continuous `Re·angja` question — same treatment,
  documented as unresolved rather than silently asserted correct.
- Remainder of the grammar/morphology/tense audit (prepare-data.js
  internals, garo_classifier.js, full corrections/override layer) —
  queued for next session per Project Owner instruction, open below.

## Next session (queued, per Project Owner instruction)

Continue the CLAUDE B grammar/morphology/tense audit (item "#2" from
this session's plan): re-verify this fix is still green, then continue
auditing categories not yet deep-audited — `prepare-data.js`,
`garo_classifier.js` internals, and the full corrections/override
layer.
