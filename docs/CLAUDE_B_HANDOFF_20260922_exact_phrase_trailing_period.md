# Claude B Handoff — exact-phrase lookup doesn't strip a trailing "." (2026-09-22)

## Reported by
Surfaced while live-verifying NV-162 (`she can cook` =
`Ua Song·na ama.` / `Ua Song·na man·a.`, added this session).

## Exact error (confirmed live)

```
$ node -e "
import('./src/lookupEngine.js').then(m => {
  console.log('lookupGaro(\"she can cook\"):', m.lookupGaro('she can cook'));
  console.log('lookupGaro(\"she can cook.\"):', m.lookupGaro('she can cook.'));
});
"
lookupGaro("she can cook"): Ua Song·na man·a.
lookupGaro("she can cook."): null
```

Same divergence one layer up, via the public `translate()` API:

```
translate("she can cook")  -> {"garo":"Ua Song·na man·a.","method":"exact-phrase","confidence":0.98}
translate("she can cook.") -> {"garo":"Ua Song·timgipa","method":"grammar-assembly","confidence":0.82}
```

The dictionary key itself (`master_dictionary.json`/`compiled_dict.json`)
is stored as `"she can cook"` — **no trailing period** in the English
key. So the no-period query is the one that should need no special
handling, and it's the period-bearing query — closer to what a real
user actually types for a full sentence — that silently degrades.

## Root cause (confirmed live, traced to source line)

`src/translationEngine.js`, step 2 (exact phrase), line 254:

```js
const exactPhrase = lookupGaro(lowerWithApos) || lookupGaro(cleaned) || lookupGaro(lower);
```

None of the three forms tried here (`lowerWithApos`, `cleaned`, `lower`
— see lines 149–151) strip a trailing `.`. `normalizeInput()`
(`src/normalizationEngine.js` line 107) only expands contractions and
trims whitespace; it does not touch trailing punctuation at all.

By contrast, **step 1 (corrections)**, two blocks earlier, already has
exactly this kind of fallback — but scoped to `?` only:

```js
// line 179
const lowerNoPunct = lower.replace(/\?+$/, '');
// line 180
const correction = corrections?.[lowerWithApos] || corrections?.[cleaned] || corrections?.[lower] || corrections?.[lowerNoPunct];
```

That fix (RC-CANDIDATE-030, 2026-07-29) was deliberately scoped to `?`
only — its own comment (lines 170–177) explains why `.`/`!` were
excluded from *that* fix: an earlier draft that also stripped `!`/`.`
broke `"eat!"` by shadowing its own dedicated exclamatory-imperative
entry (`"Cha·bo!"`, distinct from plain `"eat"`'s `"Cha·a"`) with the
plain form.

So this is not simply "copy the `?`-strip pattern into step 2" —
that same imperative-`!`-shadowing risk needs re-checking for the
exact-phrase table specifically (its key set is much larger and
includes many more sentence-level entries than `corrections.json`
did at the time of the original fix), and `.` carries an *additional*
one `?` never had: some `compiled_dict.json`/`master_dictionary.json`
keys are two senses of the same words with and without a period
already (this repo has prior VERIFIED sentence-terminal-punctuation
pairs, e.g. imperative-vs-plain forms) — a blind strip could cause a
period-bearing key to shadow a distinct no-period key the same way
the `!`/`.` draft did for `corrections.json`.

## Scope note

Only checked the one pair (`she can cook` / `she can cook.`) directly.
Not surveyed: how many other exact-phrase keys have this same
no-period-only-reachable shape, or whether any dictionary key
*deliberately* differs with vs. without a trailing period (the
imperative-`!` precedent above suggests at least checking for this
before a blanket strip). Flagging as found, not scoping the fix —
Claude B's call on the safe repro/fix boundary, same as the `?`
precedent this mirrors.

## Not fixed here
Engine code (`src/translationEngine.js`), Claude B territory. No
`src/` files touched by Claude A this session.
