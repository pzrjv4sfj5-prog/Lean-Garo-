# Trace: "it's/it is very hot (today)" — three composition failures (2026-09-07)

## Scope

Trace-only, per explicit instruction: **do not start the fix** until Claude A
confirms the corrected Garo word-order pattern for intensifier+adjective(+
time-word) predicates. No code, logic, or linguistic data modified. Repo left
clean (`git status --short` empty), 341/341 tests pass before and after this
investigation.

## Method

Called `analyzeGrammar`, `assembleGrammar`, and `assembleSentenceSOV`
directly via a temporary, uncommitted script (deleted after use — never
touched repo files), then read the relevant code paths in `grammarEngine.js`
and `sentenceBuilder.js` to confirm why each observed output looks the way
it does.

## Summary: two distinct, unrelated root causes, not one shared bug

The three reported symptoms are NOT three faces of one composition rule.
They are two independent bugs whose failure surfaces happen to overlap on
this one sentence shape:

- **Bug A** (cases 2 & 3, `grammar-assembly`): the verb-finding loop wrongly
  elects the intensifier ("very") as the finite verb, stranding the real
  predicate adjective ("hot") as a leftover "object" that incorrectly gets
  the `-ko` object marker.
- **Bug B** (case 1, `sov-assembly`): `"it's"` fails subject detection
  entirely (a separate, narrower bug), which reroutes the WHOLE sentence to
  the weaker `sov-assembly` fallback instead of `grammar-assembly` —
  a fallback that already gets predicate-adjective placement right, but has
  no concept of time-adverbial fronting, so "very" and "today" keep their
  input order instead of "today" moving in front of "very".

Fixing Bug A will not fix Bug B or vice versa. Confirmed by testing "it is"
(full form, no contraction) against the same sentence: it reaches
`grammar-assembly` (Bug A fires), while `"it's"` never does (Bug B fires,
sov-assembly's own separate ordering gap shows instead).

## Case 1: `"it's very hot today"` → `"namen Da.alo Ding·a"` (sov-assembly)

**Root cause: `"it's"` never resolves to the subject pronoun, so the
sentence never reaches `grammar-assembly` at all.**

`PRONOUN_MAP` (`src/data/pronoun_map.json`) has a key for `"it"`, but not
`"its"`. `analyzeGrammar`'s subject check does:

```js
const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g,'');
...
if (PRONOUN_MAP[firstWord] || npSubjectGaro) { ... }
```

`/[^a-z]/g` strips the apostrophe, turning `"it's"` into `"its"` —
which has no entry in `PRONOUN_MAP` (only `"it"` does; `"its"` would be the
*possessive* form if it were mapped at all, a different word). So
`PRONOUN_MAP[firstWord]` is `undefined`, `npSubjectGaro` is also null (not
an `a/an/the` NP), and the entire subject-gated block — the ONLY place
`grammar-assembly`'s verb/object logic lives — never runs. `analyzeGrammar`
returns `subject: null, verb: null`, `assembleGrammar` returns `null`
(requires a subject), and `translate()` falls all the way through the
cascade to `assembleSentenceSOV`.

Confirmed directly:
```
lookupGaro("it's") -> null
analyzeGrammar("it's very hot today").subject -> null
analyzeGrammar("it is very hot today").subject -> { english: 'it', garo: 'Ua' }
```
Same sentence, same meaning — completely different code path, purely
because of the apostrophe.

**Inside `sov-assembly` itself** (once routed there): `assembleSentenceSOV`
elects the LAST word matching its verb-signal heuristic (`/·a$/` etc.) as
the sentence-final predicate. For `["it's","very","hot","today"]`,
`"hot"` → `Ding·a` is the only word matching that signal, so it's correctly
elected as the predicate and moved to the end — this part is NOT wrong,
and matches the desired final-position pattern. The remaining non-verb
words (`"very"`→`namen`, `"today"`→`Da.alo`) are just joined in their
original left-to-right input order, because `assembleSentenceSOV` has no
time-adverbial-fronting logic at all — it doesn't distinguish a time word
from any other leftover modifier. Input order was "very" (intensifier)
before "today" (time word), so output preserves that: `namen Da.alo Ding·a`
— intensifier, time-word, adjective, instead of the reportedly correct
time-word, intensifier, adjective.

## Cases 2 & 3: `"it is very hot [today]"` → `"very"` elected as the verb, `-ko` on the leftover NP

**Root cause: the verb-finding loop in `analyzeGrammar` has no restriction
against electing a non-verb dictionary word as the finite verb.**

Once subject detection succeeds (`"it"` → `Ua`), the loop starting at
`grammarEngine.js:252` walks the remaining words looking for the first one
that isn't a stop word / auxiliary / possessive, and accepts it as the verb
via `findVerbForm(w)`. `findVerbForm` falls back to a plain `lookupGaro`,
so it succeeds on **any** word with a dictionary entry, not just verbs —
this exact failure mode is already called out, in comments, at the
NP-subject-coherence check a few dozen lines earlier in the same file
(`grammarEngine.js:225-236`):

> "findVerbForm falls back to a plain lookupGaro, so it succeeds on ANY
> dictionary word, not just verbs ... Restricting to copula/stopword/
> auxiliary/absent is strictly less coverage but is the only signal
> actually verifiable without real POS data."

That safety restriction was applied to the NP-subject check, but the
**verb-finding loop itself has no equivalent restriction** — it's exactly
the gap that comment warns about, just in a different call site.

`"very"` has its own real, correct dictionary entry (`"very": "namen"`,
confirmed via `lookupGaro('very')`), so `findVerbForm('very')` succeeds and
the loop accepts it as the finite verb before it ever reaches `"hot"` (the
actual predicate). Confirmed directly:

```json
"verb": {"english":"very","garo":"namen","tense":"present","garoWithTense":"namen", ...}
```

With `"very"` wrongly consumed as the verb, `"hot"` (and `"today"` when
present, both swallowed into a single multi-word object phrase — see
`"object":{"english":"hot today", ...}`) falls into the leftover-NP /
object-extraction path, which unconditionally applies the accusative
object marker `-ko` to whatever it captures — appropriate for a true direct
object, wrong for a predicate complement. This produces:

- `"it is very hot today"` → `Ua da.alo·ko namen` (adjective "hot" dropped
  from output entirely — swallowed into the `"hot today"` object-phrase
  lookup, which only resolves `"today"` since no dictionary entry exists
  for the literal two-word string `"hot today"`; `-ko` lands on `"today"`)
- `"it is very hot"` → `Ua ding·a·ko namen` (adjective survives here since
  the object phrase is just `"hot"`, but still wrongly marked with `-ko`
  and the whole clause is still ordered around the wrong elected verb)

## What a fix needs (not implemented — awaiting Claude A)

1. **Bug A** needs the verb-finding loop to stop treating "resolves in the
   dictionary" as sufficient evidence of being a verb — the same
   restriction already applied to NP-subject coherence
   (copula/stopword/auxiliary/absent-only, or an equivalent POS-safe
   signal) needs to reach this call site too. This is a pure engineering
   fix and does not depend on Claude A's pattern confirmation — the
   underlying defect (a non-verb word being electable as "the verb" at all)
   is architecture-level, not a wording-pattern question.
2. **Bug B**'s subject-detection gap (`"it's"` vs `"it"`) is also a pure
   engineering fix independent of the word-order question — either
   normalize contractions like `"it's"`/`"he's"`/`"she's"` to their
   expanded form before subject matching, or extend `PRONOUN_MAP`
   awareness to strip the `'s` copula-contraction specifically (careful:
   `'s` is ALSO the possessive marker on nouns — "the dog's" — so this
   needs to distinguish "PRONOUN + is-contraction" from "NOUN +
   possessive-contraction," not a blanket apostrophe strip).
3. **The actual word-order rule** (time-word before intensifier, adjective
   last) is the one piece genuinely gated on Claude A's confirmation, since
   it's linguistic content this repo has no independent evidence for yet —
   correctly not guessed at here.

Items 1 and 2 could, in principle, be fixed now without waiting (they're
engineering-only and don't invent any Garo content), but per the explicit
instruction this session treats the whole investigation as one unit and
defers all three until Claude A's pattern lands, to avoid shipping a
partial fix that then needs to be revisited once the word-order rule is
known.
