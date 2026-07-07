# Lean-Garo Translation Engine — Architecture Reference

**Audience:** engineers, not end users. Explains exactly how the code works today.
**Source of truth:** `src/translationEngine.js` (909 lines, single file — see §9 for why this matters).
**Companion docs:** `docs/THANGSENG_RULES_LOOKUP.md` (rule prose/examples), `docs/GRAMMAR_SPEC.md` (rule status index).

---

## 1. Pipeline Overview

```
User input (string)
      │
      ▼
┌─────────────────────┐
│ normalizeInput()     │  lets→let's, dont→don't, im→i'm (case-preserving)
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ lowercase + strip    │  apostrophe variants for lookup keys
│ apostrophes          │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ tokenize (split /\s+/)│
└─────────┬───────────┘
          ▼
┌─────────────────────────────────────────────────────────────┐
│              11-STEP PRIORITY CASCADE (translate())          │
│  1. corrections.json exact match          confidence 1.00    │
│ 1.5 phrase_maps.js exact match            confidence 0.99    │
│ 1.6 number/classifier counting phrase     confidence 0.96    │
│  2. exact phrase (compiled_dict)          confidence 0.98    │
│  3. single-word exact                     confidence 0.95    │
│ 3.5 if-clause / multi-clause connective   confidence 0.70    │
│  4. stop-word-stripped retry              confidence 0.88    │
│ 5.5 gija-construction ("without X-ing")   confidence 0.85    │
│  6. grammar-assembly (analyzeGrammar)     confidence 0.82    │
│ 6.5 SOV-assembly fallback                 confidence 0.75    │
│  7. morphology (partial word coverage)    confidence 0.65    │
│  8. compound-split (hyphenated)           confidence 0.60    │
│  9. fuzzy match (Levenshtein)             confidence 0.40-0.75│
│ 11. passthrough → "text [UNKNOWN]"        confidence 0        │
└─────────┬─────────────────────────────────────────────────────┘
          ▼
   { garo, method, confidence }
          │
          ▼
   UI layer (translationEngine default export wraps this)
```

Each step is a short-circuit: the **first** step that produces a result wins. This is
the single most important architectural fact about the engine — it is not a parser
that builds one analysis and renders it; it's a cascade of independent strategies
tried in order, from "most certain" to "least certain." A sentence that's fully
covered by a `corrections.json` entry never touches the grammar engine at all.

**Step 10 (Gemini fallback) was removed 2026-07-05** — it's listed in the file's
own header comment as a historical step number but the code path no longer exists
(was silently eating a 403 on every miss). The header comment is now aspirational/
historical, not a live description — flagged as a documentation-drift risk in §9.

---

## 2. Input Normalization & Typo Handling

`normalizeInput()` (line ~529) expands common contractions **without lowercasing**
(case-preserving, so `corrections.json`'s exact-case keys still match):
`lets→let's`, `dont→don't`, `doesnt→don't`, `didnt→didn't`, `cant→can't`,
`wont→won't`, `isnt→isn't`, `arent→aren't`, `wasnt→wasn't`, `werent→weren't`,
`im→i'm`.

Separately, a **shadow index** is built once at module load (line ~24-29): every
`corrections.json` key gets an apostrophe-stripped duplicate registered too, so
`"dont eat"` finds the same entry as `"don't eat"` even before `normalizeInput`
runs. Two independent typo-tolerance mechanisms exist for historical reasons —
flagged as consolidation debt in §9.

There is **no spell-checker** and no fuzzy correction earlier than step 9 — typo
tolerance is limited to the specific contraction/apostrophe cases above plus
whatever the Levenshtein fuzzy match (step 9) catches at the very end of the
cascade.

---

## 3. Tokenization

Trivial: `input.trim().split(/\s+/)`. No POS tagging, no real tokenizer — words are
plain strings, classified ad-hoc at each pipeline stage by set-membership checks
(`STOP_WORDS`, `POSSESSIVES`, `AUXILIARY_SKIP`, `IRREGULAR_VERBS` keys, dictionary
lookup success/failure). This is workable at the current vocabulary size but is the
main reason word-order edge cases (see Rule 5/6/31 gaps) are hard to generalize —
there's no syntax tree to reason over, just sequential string scans.

---

## 4. Sentence Analysis — `analyzeGrammar()`

The core analysis function (line 213). Runs independently of the cascade above —
it's called both by step 6 (grammar-assembly) and directly by the UI layer for the
"Grammar Analysis" panel. Two very different code paths inside one function:

### 4a. Tense detection (regex cascade, checked in this exact order)
```
"used to VERB"              → chim          (Rule 13)
"was/were VERBing"          → pastcont      (Rule 26)
"stopped/quit/no longer"    → discontinued  (Rule 17 — NOT past negation)
"finished/completed"        → completed     (Rule 25)
"will/shall/going to"       → future
"was/were/had/did/went/     → past
 came/ate/drank" (auxiliary)
"please" (≤4 words)         → command
(none of the above)         → present (default)
```
**Order matters** — "used to" must be checked before the generic "was/were"
pastcont check, which must be checked before the generic past-auxiliary check, or
more specific patterns get swallowed by broader ones.

**Separately**, inside the verb-finding loop (§4b), a *second*, independent
past-tense signal exists: if the candidate verb word itself ends in `-ed` and no
sentence-level tense was already detected, that's treated as local past evidence
too. This exists because English marks past tense on the verb itself far more
often than via a sentence-level auxiliary ("she cooked" has no auxiliary at all)
— found as a real bug 2026-07-05 (`he studied` was returning bare `Ua`, verb
silently dropped, because detectedTense stayed `'present'` with nothing to signal
past tense; see Rule 2 in the spec).

### 4b. Subject/verb/object extraction
Only runs if `words[0]` is a recognized pronoun (`PRONOUN_MAP` — I/you/he/she/it/
we/they). **Sentences not starting with a pronoun get a degraded return value**
(`subject: null`) and grammar-assembly (step 6) will refuse to run for them —
they fall through to the SOV-assembly fallback (step 6.5) instead, which has much
weaker grammar (no tense/possessive/purpose-clause handling, see §4e).

Given a pronoun subject, the verb search scans remaining words, skipping
`STOP_WORDS`, `POSSESSIVES`, and `AUXILIARY_SKIP` (will/shall/going/would/could/
should/may/might/can/used/to/stopped/quit/finished/completed/longer), and takes
the **first** word that resolves via `findVerbForm()`. There is no verb-ranking —
first match wins, which is usually correct for these short sentence patterns but
would break down on longer, multi-verb sentences (not attempted).

### 4c. Tense/negation suffix composition
This is where the accumulated rules actually get applied to the resolved verb
root. Order of checks (line 282-310):
1. **Future negative special case** (Rule 5): if negative AND future AND not
   irregular → `applyTense(verb, 'negative_future')` directly (stem+`jawa`), then
   `break` immediately — this bypasses everything below, because future-negative
   is NOT future-tense-then-negated, it's its own suffix.
2. Otherwise, if tense is future/discontinued/completed/chim/pastcont →
   `applyTense(verb, detectedTense)`.
3. Otherwise, if **not negative** and (tense is past OR verb word ends in `-ed`)
   and the verb isn't already suffix-inflected → `applyTense(verb, 'past')`
   (Rule 2, `-aha`).
4. **Then**, regardless of what happened above, if the sentence is negative:
   `applyNegation()` is applied on top — **except** case 1 above already
   returned, so negation never composes with future. For all other tenses,
   negation composes by discarding whatever tense suffix was just added and
   applying `-ja` instead (see `applyNegation`, §6) — this is intentional per
   Rule 27 (no dedicated past-negative suffix; `-ja` covers past-referring
   negation too), but it does mean tense information is *lost* on negation for
   every tense except future. This is a deliberate simplification matching the
   native-speaker evidence, not an oversight.

### 4d. Object/possessive/purpose-clause extraction
A second independent word-scan (line 328) looks for: a possessive pronoun
(`POSSESSIVES`), a `"to VERB"` purpose clause (checked against `PURPOSE_MAP`,
specifically guarded against `"used to"` so `chim` sentences don't also get
mis-parsed as purpose clauses), and leftover content words as the object.
Object translation prefers `lookupPhrase()` (multi-word phrase_maps.js) over
single-word `lookupGaro()`, tried on both the full object phrase and just its
last word.

### 4e. Two return shapes
`analyzeGrammar` returns different objects depending on whether a pronoun subject
was found (includes `possessive`/`purposeAction` if so) — both shapes include
`wordCount, detectedTense, tenseEvidence, isNegative, garoWordOrder ('SOV...'),
notes`. `garoTenseSuffix` is always `null` (dead field, kept only for backward
API compatibility — see §9).

---

## 5. Dictionary Resolution — Priority Order

There is **no single dictionary** — seven independent lookup sources exist, and
different code paths query them in different orders. This is the area with the
most accumulated technical debt (see §9).

| Source | File | Format | Queried by |
|---|---|---|---|
| **corrections.json** | `src/data/corrections.json` | flat `{english: garo}` | `lookupGaro()` (always checked first), `translate()` step 1 directly |
| **compiled_dict** | `src/compiled_dict.json` (generated, see §9) | `{english: garo \| {garo,pos,category} \| array}` | `lookup()` → `EN_INDEX`, wrapped by `lookupGaro()` |
| **phrase_maps** | `src/data/phrase_maps.js` | `{phrase: garo}`, multi-word only | `lookupPhrase()` — object extraction, step 1.5, SOV fallback |
| **PURPOSE_MAP** | inline in `translationEngine.js` (~37 entries) | `{verb: purposeForm}` | purpose-clause detection (`"to eat"` → `cha·na`) |
| **IRREGULAR_VERBS** | inline in `translationEngine.js` (~28 entries) | `{inflectedForm: garo}` | `findVerbForm()` first check, before dictionary lookup |

**`lookupGaro()`'s own priority** (line 53): `corrections.json` → `compiled_dict`
(via `EN_INDEX`). This function is the single most-called lookup primitive in the
file — `findVerbForm`, object extraction, `tryWithoutGijaConstruction`, and the
SOV fallback all route through it, meaning a `corrections.json` entry effectively
overrides the dictionary **everywhere**, not just in the top-level cascade. This
is why several bugs this session (`answer`, `search`, `down`, `dog`, `go`) were
fixed by editing `corrections.json` even when the underlying issue was a bad
dictionary entry — the correction masks the dictionary error but doesn't remove
it (the dictionary entries were also cleaned up separately in each case).

**`findVerbForm()`'s priority** (line 195): `IRREGULAR_VERBS[word]` →
`lookupGaro(word)` → strip `-ing/-ed/-es/-s` → `IRREGULAR_VERBS[stripped]` →
`lookupGaro(stripped)` → y→ied spelling-change retry (`studied`→`study`).

---

## 6. Suffix Generation — `applyTense()` / `applyNegation()`

`applyTense(verbRoot, tense)` (line 117) is the single suffix-application
function for every tense **except** negation, which has its own function
(`applyNegation`, extracted 2026-07-05 from what was 3 duplicated copies).

```
Suffix table:
  present            → a
  past               → ha   (FULL-ROOT-APPEND EXCEPTION — see below)
  future             → gen
  command            → bo
  negative_future    → jawa
  negative_command   → nabe
  discontinued       → jaha
  completed          → manaha
  chim               → chim (FULL-ROOT-APPEND EXCEPTION)
  pastcont           → " chim" (TWO-WORD FORM — see below)
```

**Stem rule (default, Rule 15):** strip one trailing `a` (raka-aware: `cha·a`→
`cha·`, `Tusia`→`Tusig`), then append suffix. Applies to future/command/
negative_future/negative_command/discontinued/completed.

**Exceptions (do not strip the stem):**
- `past` (`ha`) and `chim`: append to the **full** root. `cha·a`+`ha`=`cha·aha`
  (not `cha·`+`aha`). This is Rule 24, confirmed directly by Thangseng — the most
  commonly-forgotten rule in this codebase (re-broken twice this session before
  being locked into regression tests).
- `pastcont`: not a suffix at all — a **two-word** construction,
  `[progressive-form] + ' chim'`. Must special-case pre-inflected progressive
  irregulars (e.g. `asongenga`) *before* the generic "already inflected, return
  as-is" guard, or the guard fires first and `' chim'` never gets appended
  (real bug, fixed 2026-07-04).

`applyNegation(garoForm)` (line 112): strips trailing vowel (raka-aware, same
stem rule as above) and appends `ja` — **regardless of what tense the input was
in**. This is the codebase's implementation of Rule 27 (no true simple-past
suffix; `-ja` naturally covers past-referring negation) and Rule 18 (gija is a
verbal adjective, not a negation marker — this function replaced 3 separate
`gija`-appending call sites on 2026-07-04).

---

## 7. Sentence Formation — Worked Examples

### "I eat rice."
```
tokenize → ["i","eat","rice"]
analyzeGrammar:
  detectedTense = 'present' (no tense evidence matched)
  isNegative = false
  subject = {english:"i", garo:"Anga"}         (PRONOUN_MAP)
  verb search: "eat" not in STOP_WORDS/AUXILIARY_SKIP
    → findVerbForm("eat") → lookupGaro("eat") → "Cha·a"
    → not irregular, tense=present → no applyTense call (present IS the
      dictionary's stored form already)
    → not negative → garoWithTense = "Cha·a"
  object search: "rice" → lookupGaro("rice") → "Mi"
    → object = {garo:"Mi", withMarker:"Mi·ko"}
assembleGrammar:
  parts = ["Anga", "Mi·ko", "Cha·a"]   (subject, object+ko, verb — SOV)
  → "Anga Mi·ko Cha·a"
method: grammar-assembly
```

### "I did not eat."
```
isNegative = true (matches /n't|\bnot\b/)
detectedTense = 'past' (matches "did")
verb: findVerbForm("eat") → "Cha·a"
  Step 3 (past check) is skipped — guarded by `!isNegative`
  Step 4: isNegative → applyNegation("Cha·a") → strip "a" → "Cha·" + "ja"
    → "Cha·ja"
assembleGrammar: ["Anga", "Cha·ja"] → "Anga Cha·ja"
method: grammar-assembly
(Historical note: before Rule 27 was confirmed 2026-07-05, this used to
produce "Anga cha·jaha" via a since-corrected misunderstanding that jaha
was the past-negative suffix. It is not — jaha means discontinuation.)
```

### "I will not eat."
```
detectedTense = 'future' (matches "will")
isNegative = true
verb loop, special case 1 fires immediately:
  applyTense("Cha·a", 'negative_future') → strip "a" → "Cha·" + "jawa"
    → "Cha·jawa"
  (break — negation-composition logic below is never reached)
assembleGrammar: ["Anga", "Cha·jawa"] → "Anga Cha·jawa"
method: grammar-assembly
(In practice this exact sentence resolves one step earlier via
corrections.json — "i will not eat" → "Anga cha·jawa" — added 2026-07-05
after this exact construction was found to have a stacking bug for less
common verbs; the grammar-assembly path above is what handles any OTHER
verb not covered by a correction, e.g. "I will not drink/go/work...")
```

### "I have eaten."
```
No sentence-level tense-trigger matches "have" — detectedTense stays
'present'. "eaten" is an IRREGULAR_VERBS entry → isIrregular = true →
tense-application block skipped entirely (irregular forms are used as-is).
findVerbForm("eaten") → IRREGULAR_VERBS["eaten"] → "cha·manaha"
assembleGrammar: ["Anga", "cha·manaha"] → "Anga cha·manaha"
method: grammar-assembly
(Rule 25/28: -manaha = completed action; overlaps with -aha in spoken
Garo per Thangseng, both considered valid — not reconciled into one
"correct" form, see Rule 28.)
```

### "I stopped eating."
```
detectedTense = 'discontinued' (matches "stopped")
SPECIAL_TENSES branch: word "eating" → strip -ing → "eat" →
  lookupGaro("eat") → "Cha·a", isIrregular forced false (root form found)
applyTense("Cha·a", 'discontinued') → strip "a" → "Cha·" + "jaha"
  → "Cha·jaha"
assembleGrammar: ["Anga", "Cha·jaha"] → "Anga Cha·jaha"
method: grammar-assembly
(In practice resolves via corrections.json one step earlier — "i stopped
eating" → "Anga cha·jaha" — confirmed 2026-07-04/05 as part of the Rule 17
correction. Shown here to demonstrate the general mechanism works too.)
```

### "Can I have some water?"
```
No pronoun-initiated tense-trigger relevant; "water" is a plain noun.
This sentence is NOT handled by analyzeGrammar's request/permission
construction — there is no dedicated code path for polite requests.
It resolves via corrections.json exact match:
  "can i have some water" → "Anga chi on·tisa man·genba?"
method: correction
(Rule 9's confirmed construction lives entirely as memorized correction
data — there is no general "Can I VERB some NOUN?" grammar rule
implemented. Flagged as a gap in §9/§10.)
```

### "The dog is under the table."
```
"the" is a STOP_WORD but is not words[0] after trimming articles is
NOT actually stripped before the pronoun check — "the" is not in
PRONOUN_MAP, so subject stays null. analyzeGrammar returns the
degraded (non-pronoun) shape. assembleGrammar refuses to run
(requires grammar.subject). Falls to step 6.5, assembleSentenceSOV:
  content words (STOP_WORDS filtered): ["dog","under","table"]
  ("the", "is" ARE STOP_WORDS and get dropped)
  translated: dog→"Achak", under→ null (no dictionary entry for bare
    "under" outside the one confirmed compound "kokkimao"), table→"Te·bil"
  → low-confidence, word-order not modeled for locative constructions
method: sov-assembly (confidence 0.75) — known gap, Rule 6/31, §10.
```

---

## 8. Flowcharts

### Verb tense/negation decision tree
```
                    ┌─────────────────┐
                    │ verb word found  │
                    │ via findVerbForm │
                    └────────┬─────────┘
                             ▼
                  ┌────────────────────┐
        ┌─────────┤ negative AND future │─────────┐
        │  yes    │  AND not irregular?  │   no    │
        ▼         └────────────────────┘         ▼
 stem + "jawa"                          ┌──────────────────────┐
 (Rule 5)                       ┌───────┤ tense in {future,     │
 [RETURN — negation             │  yes  │ discontinued,         │
  never composes here]          ▼       │ completed, chim,      │
                          applyTense()   │ pastcont}?            │
                                         └──────┬────────────────┘
                                              no │
                                                 ▼
                                    ┌────────────────────────┐
                                    │ !negative AND           │
                                    │ (tense==past OR -ed) AND│
                                    │ not already inflected?  │
                                    └────────┬─────────────┬──┘
                                          yes│           no│
                                             ▼             ▼
                                   applyTense('past')   (leave as-is,
                                   (Rule 2, -aha)         present form)
                                             │             │
                                             └──────┬──────┘
                                                     ▼
                                          ┌────────────────────┐
                                          │ isNegative (still)? │
                                          └──────┬──────────┬──┘
                                              yes│         no│
                                                 ▼           ▼
                                       applyNegation()   (done)
                                       [discards tense
                                        suffix, applies
                                        stem+ja — Rule 27]
```

### Dictionary resolution (`lookupGaro`)
```
lookupGaro(word)
   │
   ▼
corrections.json[word] exists? ──yes──▶ return it (ALWAYS wins)
   │no
   ▼
EN_INDEX[word] (compiled_dict) exists? ──yes──▶ return it
   │no
   ▼
return null
```

### Full translation cascade
See §1 diagram — reproduced here as a decision list for completeness:
corrections → phrase_maps → counting-phrase → exact-phrase → single-word →
if-clause/multi-clause → stopword-stripped → gija-construction →
grammar-assembly → SOV-fallback → morphology → compound-split → fuzzy →
passthrough.

---

## 9. Repository Audit

### Dead code found and removed this session
- `VERB_SUFFIXES` table — contradicted `applyTense`'s real suffix map, unused
  outside one dead informational field.
- `PURPOSE_VERBS` — near-duplicate of `PURPOSE_MAP` (37 vs 15 entries, one
  real conflict on `see`).
- Step 5 "number engine" — `const numResult = null` followed by
  `if (numResult)`, permanently-dead branch.
- Gemini fallback (step 10) — half-removed (docs claimed done, code still
  imported and called an unconfigured API, silently eating a 403 every time).
- 10 `IRREGULAR_VERBS` entries contaminated with purpose-clause `-na` endings
  instead of real past forms (`searched`/`answered`/`spoke`/etc.) — removed,
  now fall through to general dictionary+`applyTense` pipeline.
- Duplicate corrections.json key `lets go to the market` (permanently
  unreachable — `normalizeInput` already converts `lets`→`let's`).
- **`PROGRESSIVE_MAP`** (26 entries) and **`PAST_TO_ROOT`** (26 entries) —
  confirmed zero call sites anywhere in the codebase, removed 2026-07-06
  (V1.0 launch sprint, P2 low-risk cleanup).

### Dead code NOT yet removed (found, not fixed)
- **Duplicate typo-tolerance mechanisms**: the apostrophe-stripped shadow
  index (module load, line 24) and `normalizeInput()`'s explicit contraction
  expansion (line 529) both solve "lets"→"let's"-class problems, from two
  different eras of the codebase. Not contradictory, but redundant —
  consolidating to one would reduce surface area.
- **Two separate `PURPOSE_MAP`-adjacent negation/tense composition blocks**
  in `analyzeGrammar`'s two return branches (pronoun-subject vs. not) are
  near-identical except the pronoun branch includes `possessive`/
  `purposeAction`. Not urgent, but a candidate for extraction if a third
  variant is ever needed.
- **`translationEngine.js`'s own header comment** (line 1-18) lists Gemini as
  step 10 — now historical/inaccurate since removal. Low-risk, easy fix,
  just hasn't been touched.

### Architectural debt (works correctly today, but fragile)
- **No syntax tree.** Every "parse" is a sequential regex/set-membership scan
  over a flat token array. Works for the current sentence patterns (simple
  SVO, single clause) but doesn't generalize — e.g. locative constructions,
  multi-verb sentences, and complex requests all fall through to the weakest
  fallback (`sov-assembly`) because there's no structure to reason over.
- **Grammar logic and dictionary data are both partly inline JS objects**
  (`IRREGULAR_VERBS`, `PURPOSE_MAP`, `POSSESSIVES`, `PRONOUN_MAP`) and partly
  external JSON (`corrections.json`, `compiled_dict.json`). A raka-consistency
  bug class (Rule 1 violations) was found **three separate times** this
  session in three different storage locations (JSON data files, then
  `IRREGULAR_VERBS`, then `PURPOSE_MAP`) precisely because there's no single
  place that enforces "no-raka roots never carry raka" — it's manually
  re-verified per data source every time a new bug surfaces.
- **`compiled_dict.json` is a build artifact**, regenerated by
  `prepare-data.js` from `master_dictionary.json` + `garo_dictionary.json` +
  `final_entries.json` + others on every `npm run build`. Editing it directly
  (a mistake made once this session, caught before push) is silently
  overwritten. This is correct-by-design but has no guard rail — nothing
  stops a future edit to the generated file from looking like it worked
  (tests would pass against the stale copy) until the next build.
- **Confidence scores are hand-tuned constants**, not derived from anything
  (e.g. why is `exact-phrase` 0.98 and `phrase-map` 0.99? Historical, not
  principled). Fine for the current use (higher number = tried earlier), but
  not meaningful as an actual probability.

### Obsolete grammar (superseded, kept for history)
`docs/THANGSENG_RULES_LOOKUP.md` Rule 17's original 2026-07-01 text (jaha =
past negation) is struck through but left in place, correctly labeled
superseded. `docs/HANDOFF_CLAUDE_A_20260701.md` and
`docs/CLAUDE_B_HANDOFF_20260703.md` carry superseded-notice headers pointing
to the correction. No cleanup needed here — this is intentional historical
record-keeping, not debt.

---

## 10. Grammar Rules — Complete Table

*(Full prose + examples for each rule: `docs/THANGSENG_RULES_LOOKUP.md`. This
table is the engineering-facing index — status/confirmation/implementation
location/tests at a glance.)*

| # | Description | Status | Confirmed by Thangseng? | Files | Example |
|---|---|---|---|---|---|
| 1 | Raka belongs to root only, never suffix | implemented, re-verified 3x this session | Yes | data files, `IRREGULAR_VERBS`, `PURPOSE_MAP` | `dak`/`kat`/`ring`/`tusi`/`agan`/`dong`/`nam` never take raka |
| 2 | `-aha` = simple past AND perfect | implemented (2026-07-05: now via real suffix logic, not just memorized corrections) | Yes | `applyTense('past')` | `he studied`→`Ua po·ri·aha` |
| 3 | SOV word order | implemented | Yes | `assembleGrammar`, `assembleSentenceSOV` | throughout |
| 4 | Pronoun subject/object forms | implemented | Yes | `PRONOUN_MAP` | I/you/he/she/we/they/it |
| 5 | Copula `daka` | **NOT implemented in grammar-assembly** | Yes (but no worked complement example) | — | gap, see §9/Rule 31 |
| 6 | Adjective placement (predicative = bare, no copula) | partially implemented (works by accident via generic dictionary lookup, not a dedicated rule) | Yes | none dedicated | `he is happy`→`Ua kusi` |
| 7 | `Hai` (let's) construction | implemented (corrections.json only) | Yes | `corrections.json` | `lets eat`→`Hai cha·na` |
| 8 | If-clause `-ode` | implemented | Yes | `translateIfClause` | `if you eat you will be strong` |
| 9 | Noun suffixes (-ko/-o/-chi/-ni/-na) | **partial** — only `-ko` (accusative) is systematically applied | Yes | `assembleGrammar` | gap for `-o`/`-chi`/`-na` |
| 10 | Classifiers | implemented | Yes | `src/garo_classifier.js` | `21 dogs`→`achak mang·Kolgrik·sa` |
| 13 | `chim` = "used to" | implemented | Yes | `applyTense('chim')` | `i used to eat`→`Anga Cha·achim` |
| 15 | Stem formation (strip trailing `a`) | implemented | Yes | `applyTense` generic branch | throughout |
| 17 | `jaha` = discontinuation, NOT past negation | implemented (corrected 2026-07-04) | Yes | `applyTense('discontinued')` | `i stopped eating`→`Anga cha·jaha` |
| 18 | `gija` = verbal adjective, not negation | implemented (both halves: negation-misuse fixed 2026-07-04, positive construction added 2026-07-05) | Yes | `applyNegation`, `tryWithoutGijaConstruction` | `he left without eating` |
| 24 | `ha`/`chim` full-root-append exception | implemented | Yes | `applyTense` | `cha·a`+`ha`=`cha·aha` not `cha·`+`aha` |
| 25 | `manaha` = completed action | implemented | Yes | `applyTense('completed')` | `i finished eating` |
| 26 | `pastcont` = two-word `[progressive] chim` | implemented (fixed 2026-07-04, was fused wrong) | Yes (internal QA pass) | `applyTense('pastcont')` | `i was eating`→`Anga Cha·enga chim` |
| 27 | No true simple-past suffix; `-ja` covers past-negation too | implemented | Yes | `applyNegation` | `he did not go`→`Ua Re·angja` |
| 28 | `-aha`/`-manaha` overlap, no rigid distinction | implemented (by not enforcing separation) | Yes | n/a | both valid |
| 29 | `-bo` is imperative AND hortative | implemented (corrections.json alternate) | Yes | `corrections.json` | `Hai cha·bo` = let us eat |
| 30 | `re·` vs `re·ang` for "go" | **open question** | Partially — conflicting evidence | `corrections.json` (bare form hardcoded for future-neg only) | flagged, not generalized |
| 31 | Copula inconsistency (bare-adj vs `daka` vs `ong·a`) | **open question, not fixed** | Conflicting evidence in existing data | none unified | `i am happy`→`...ong·a` vs `he is happy`→bare |
| 32 | `search` = `Sandia` | implemented | Yes | `corrections.json` + natural suffix generation | `he searched`→`Ua Sandiaha` |
| 33 | `down` = `Ka·ma` | implemented | Yes | `corrections.json` | `Aiwa ka·machi maia donga?` |

Rules 11, 12, 14, 16, 19–23 are vocabulary/classifier/suffix-table confirmations
already folded into the implementations above — see `THANGSENG_RULES_LOOKUP.md`
for their individual write-ups.

**Categories requested but with no dedicated implementation:** questions
(resolved entirely via corrections.json memorization — e.g. `did you eat food`
— no general question-transformation rule exists), possession beyond `donga`
(Rule 7's `Ango pen donga` pattern is a correction, not a rule), location
(Rule 8, single example, not generalized — see worked example in §7).

---

## 11. Module Architecture

| Module | Responsibility | Depends on | Inputs | Outputs |
|---|---|---|---|---|
| `translationEngine.js` | Everything: normalization, tokenization, grammar analysis, dictionary resolution, suffix generation, sentence assembly | `compiled_dict.json`, `compiled_dict_alternates.json`, `category_index.json`, `corrections.json`, `phrase_maps.js`, `garo_classifier.js`, `number_engine.js` | raw string | `{garo, method, confidence}` (named export `translate`); platform-adapter shape from default export |
| `garo_classifier.js` | Numeral classifier system (mang·/sak·/king/jol/pang/dot/ge·), number-word parsing | `number_engine.js` (implied for number words) | noun + count | classifier-suffixed phrase or `null` |
| `number_engine.js` | English number word / digit → Garo number word | none | number | Garo numeral string |
| `data/phrase_maps.js` | Multi-word idiomatic phrase lookup, separate from single-word dictionary | none | phrase string | Garo string or `null` |
| `data/corrections.json` | Native-speaker-confirmed exact overrides — highest priority everywhere | none | — | flat `{english: garo}` map |
| `prepare-data.js` (build-time) | Merges `master_dictionary.json` + `garo_dictionary.json` + `final_entries.json` + others → `compiled_dict.json` + `compiled_dict_alternates.json` + `category_index.json` | all source dictionary JSON files | — | 3 generated JSON files (checked into git, but overwritten every build) |
| `test-dictionary.js` (build-time) | Validates compiled dictionary integrity + 9 blocking grammatical-correction checks | `compiled_dict.json` | — | pass/fail, part of `npm run build` |
| `tests/unit/translationEngine.test.js` | 49-case regression suite (grows with every confirmed rule) | `translationEngine.js` (named exports) | — | pass/fail, wired into `npm run build` and CI |
| `src/pages/Translator.jsx` | UI: input/output, keyboard shortcuts, a11y, breakdown display | default export of `translationEngine.js` | user keystrokes | rendered translation + grammar panel |
| `src/pages/Dictionary.jsx`, `Phrases.jsx`, `VerbsGrammar.jsx` | Browsable dictionary/phrase/grammar reference UIs | `getAllCategories`/`searchVocabulary`/`getCategoryVocabulary` | — | rendered lists |
| `server.js` | Express static file server for production deploy | none (Gemini import removed 2026-07-05) | — | serves `dist/` |

**Build pipeline:** `npm run build` = `prepare-data.js` (regenerate compiled
dictionary) → `test-dictionary.js` (validate) → `node --test
tests/unit/translationEngine.test.js` (regression suite, wired in 2026-07-04)
→ `vite build` (bundle). Any failure at any stage aborts the build — this is
the project's only enforced quality gate, and it's comprehensive as of this
session (grammar regressions now fail the build automatically).

---

## 12. Architectural Backlog (post-V1.0, NOT implemented — planning only)

Approved future architectural directions, maintained here rather than
affecting launch planning. Each item: Objective, Current State, Desired
State, Migration Strategy, Priority, Dependencies, Estimated Version.

---

### BACKLOG-001 — Staged Linguistic-Knowledge Extraction (umbrella item)

**Objective:** Reduce coupling in `translationEngine.js` by moving stable
linguistic knowledge into dedicated, version-controlled resources, so the
engine becomes orchestration/parsing/pipeline-coordination only.

**Current State:** `translationEngine.js` combines orchestration logic,
canonical linguistic knowledge (`IRREGULAR_VERBS`, `PURPOSE_MAP`,
`PRONOUN_MAP`, `POSSESSIVES`), morphology (`applyTense`/`applyNegation`),
and irregular-verb handling in one file. The first three stages of the
target pipeline already exist as standalone docs (`docs/
GRAMMAR_SPECIFICATION.md`, `docs/GRAMMAR_RULE_CATALOGUE.md`, `docs/
MORPHOLOGY_SPECIFICATION.md`, `docs/VALIDATION_CORPUS.md`, added `937f5d3`)
but the engine doesn't consume them as data — it's hand-maintained JS that
merely happens to agree with the docs, and can drift (see `under`/`Ka·ma·o`,
`edc94b7` — docs described a fix the code didn't yet have).

**Desired State:**
```
Grammar Specifications → Grammar Rule Catalogue → Morphology Data
    → Lexical Resources → Validation Corpus → Translation Engine (orchestration only)
```
Linguistic knowledge lives in reusable structured resources; the engine
executes rules against them rather than embedding them.

**Migration Strategy:** incremental, backward-compatible, no large-scale
rewrite, every step protected by the regression suite (51 cases and
growing). Proven one table at a time, smallest first (see BACKLOG-002).

**Priority:** Medium — not launch-blocking; higher than "someday" because
the documentation half of the migration is already done, remaining work
is mechanical (extraction + loader), not open-ended design.

**Dependencies:** none blocking; benefits from BACKLOG-005 (dictionary
validation) once any table is externalized.

**Estimated Version:** V1.1–V1.2 (BACKLOG-002 first increment), full
pipeline V2.0+.

---

### BACKLOG-002 — Extract `IRREGULAR_VERBS` to JSON (first increment)

**Objective:** Prove the extraction pattern on the smallest, most
self-contained inline table before migrating larger ones.

**Current State:** `IRREGULAR_VERBS` (~28 entries) is a hardcoded JS
object in `translationEngine.js`, checked first by `findVerbForm()`.

**Desired State:** JSON file matching `corrections.json`'s existing
pattern, loaded via a small accessor function replacing the direct object
reference. Validated against `docs/VALIDATION_CORPUS.md` at build time.

**Migration Strategy:** (1) export current table to JSON unchanged, (2)
replace direct references with a loader, (3) add a build-time check that
every `docs/VALIDATION_CORPUS.md` row referencing an irregular verb
resolves to the documented Garo form, (4) run full regression suite,
(5) only then consider it done.

**Priority:** Medium-High (concrete, low-risk, proves the approach).

**Dependencies:** none. This unblocks BACKLOG-001's remaining tables
(`PURPOSE_MAP`, `PRONOUN_MAP`, `POSSESSIVES`) as repeatable follow-ups.

**Estimated Version:** V1.1.

---

### BACKLOG-003 — Rule Compiler

**Objective:** Generate `applyTense`'s suffix-application logic from a
declarative rule table instead of hand-written if/else exceptions.

**Current State:** Suffix rules (stem-strip vs. full-root-append
exceptions like Rule 24's `ha`/`chim`) are comment-documented, hand-coded
branches in `applyTense()`.

**Desired State:** A small compiler reads a declarative table (e.g.
`{tense: 'past', suffix: 'ha', stemStrip: false}`) and generates the
application logic, making exceptions self-documenting data instead of
prose comments next to code.

**Migration Strategy:** depends on BACKLOG-001 (rules must be data
first). Build the compiler against the existing hand-coded behavior as
its own regression baseline before switching `applyTense` over.

**Priority:** Low-Medium — quality-of-life for maintainability, not
correctness-critical while `applyTense` is well-tested.

**Dependencies:** BACKLOG-001 (rules as data).

**Estimated Version:** V2.0+.

---

### BACKLOG-004 — Morphology Engine (bidirectional)

**Objective:** Real morphological analysis (stem+suffix decomposition in
both directions), enabling Garo→English reverse translation.

**Current State:** One-way generation only (English meaning → Garo
surface form). Reverse translation is fully blocked — no reverse
dictionary exists (`docs/PENDING_reverse_translation.md`).

**Desired State:** A morphology engine that can both generate and parse
Garo surface forms against the root/suffix paradigm in `docs/
MORPHOLOGY_SPECIFICATION.md` §2–3.

**Migration Strategy:** depends on BACKLOG-001 (suffix paradigm as
structured data) and a reverse-dictionary data source (currently
unavailable — separate blocker, not an engineering task).

**Priority:** Low until the reverse-dictionary data blocker is resolved;
re-evaluate priority once unblocked.

**Dependencies:** BACKLOG-001; external reverse-dictionary data source.

**Estimated Version:** V2.0+ (contingent on data availability).

---

### BACKLOG-005 — Parser / Syntax Tree

**Objective:** Replace sequential regex/set-membership scans in
`analyzeGrammar` with a tokenizer→parser→AST pipeline.

**Current State:** No syntax tree — every "parse" is a flat token-array
scan. Works for current simple-SVO sentence patterns; fails for
multi-verb sentences, locative constructions, embedded clauses, and is
the root cause of the copula inconsistency (Rule 31) having no home to
attach a selection rule to.

**Desired State:** Real AST with enough structure that each sub-phrase
(locative, purpose clause, copula complement) can be independently
resolved against the grammar rule catalogue.

**Migration Strategy:** highest-risk item in this backlog — genuinely
architectural, not incremental-safe in the same way as BACKLOG-002.
Recommend prototyping alongside (not replacing) the current pipeline,
gated behind a feature flag, validated against the full regression suite
before any cutover.

**Priority:** Low for V1.x; re-evaluate for V2.0 once BACKLOG-001–003 are
done and the data layer is stable enough to parse against.

**Dependencies:** BACKLOG-001 (rules as data), ideally BACKLOG-003 (rule
compiler) so the parser has a rule-execution target to emit into.

**Estimated Version:** V2.0+.

---

### BACKLOG-006 — Dictionary Optimization / Automated Raka Validation

**Objective:** Single canonical dictionary format with automatic Rule 1
(raka) consistency checks across every storage location, replacing manual
audits.

**Current State:** Raka violations have been found independently 3
separate times this project (data JSON files, then `IRREGULAR_VERBS`,
then `PURPOSE_MAP`) because no single source of truth enforces "no-raka
roots never carry raka" — each new bug required a fresh manual audit.

**Desired State:** A build-time validation pass (part of `npm run build`,
alongside `test-dictionary.js`) that checks every root against the
confirmed no-raka-root list, across all storage locations (JSON files AND
any remaining inline JS objects), and fails the build on violation.

**Migration Strategy:** can be implemented independently of BACKLOG-001
(doesn't require the tables to be externalized first, though it becomes
easier once they are — one validator instead of one-per-format).
Incremental: start with the JSON data files (`test-dictionary.js` already
validates other properties), add inline-JS-object checking once
BACKLOG-002 externalizes the first table.

**Priority:** Medium — directly prevents a recurring, already-3x-seen bug
class; relatively cheap to implement against existing JSON files today.

**Dependencies:** none blocking for the JSON-file portion; benefits from
BACKLOG-002 for full coverage.

**Estimated Version:** V1.1 (JSON-file portion), V1.2+ (full coverage
after BACKLOG-002).

---

### BACKLOG-007 — Plugin Architecture

**Objective:** Formal plugin interface so the grammar engine (Claude A's
domain) and platform/UI layer (Claude B's domain) can evolve somewhat
independently — register a new tense/suffix handler without editing
`translationEngine.js`'s core cascade.

**Current State:** Single-file cascade; any new tense/suffix/construction
requires editing the core `translate()`/`analyzeGrammar()` logic directly,
per the ownership split in `docs/HANDOFF_CLAUDE_A_20260701.md`/`docs/
CLAUDE_B_HANDOFF_20260703.md`.

**Desired State:** A registration interface (e.g. `registerTenseHandler
({name, detect, apply})`) that lets new grammar features be added as
self-contained modules.

**Migration Strategy:** lowest priority, most speculative — only pursue
if BACKLOG-001–005 reveal genuine ownership-boundary friction in
practice, not preemptively.

**Priority:** Low — speculative, no observed pain point yet beyond the
general coupling BACKLOG-001 already addresses.

**Dependencies:** BACKLOG-001, BACKLOG-005 (a plugin interface is much
more natural once rules are data and parsing is structured).

**Estimated Version:** V2.0+, opportunistic.

---

None of the above is scheduled — this section exists so the roadmap
survives independently of any one working session's context. Update
status/priority/estimated-version fields as items progress; do not
delete completed items, mark them done in place for institutional memory.
