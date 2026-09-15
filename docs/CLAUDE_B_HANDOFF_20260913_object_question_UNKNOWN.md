# Claude B Handoff — object-final "?" breaks interrogative composition (2026-09-13)

## Reported by Project Owner
"did you eat rice?" → `Na·a Mi Cha·a` (no question mark, no interrogative
suffix, method `sov-assembly`, confidence 0.75) instead of a properly
conjugated interrogative, even though "did you eat?" (no object) works
correctly (`Na·a Cha·ahama?`, method `correction`).

## Root cause (confirmed live, traced to source line)
`src/grammarEngine.js` line 584:
```js
objectWords.push(words[i]);
```
This pushes the **raw, unstripped** token. Every other extraction point
in this file cleans the token first (`words[i].toLowerCase().replace(/[^a-z]/g,'')`,
used at lines 96, 174, 221, 251, 257, 538, etc.) — the object-word push
is the one place that doesn't. When the object is also the sentence-
final word, it still carries the trailing `?` (e.g. `"rice?"`), so:

1. `lookupGaro("rice?")` / `lookupPhrase("rice?")` both fail →
   `object.garo = '[UNKNOWN]'` (grammarEngine.js ~line 712).
2. `sentenceBuilder.js` line 298 / 400: `if (result.includes('[UNKNOWN]')) return null;`
   — `assembleGrammar` bails entirely, discarding the already-correctly-
   detected subject/verb/tense/isQuestion.
3. `translationEngine.js` line 453 falls through to
   `assembleSentenceSOV`, which (per its own existing comment,
   grammarEngine.js line ~58) "has no question-marking of its own" —
   so the `?` and the interrogative verb suffix are both lost, and the
   sentence silently degrades to a declarative-looking string at 0.75
   confidence with no signal anything went wrong.

Confirmed via `analyzeGrammar`: for `"did you eat rice?"`,
`object.english = "rice?"`, `object.garo = "[UNKNOWN]"`. For
`"did you eat?"` (no object), the trailing `?` lands on `verb.english`
(`"eat?"`) instead, and verb resolution happens to succeed regardless —
so the bug is specific to the object slot, not general question
handling.

## Suggested fix
Strip trailing punctuation before the line-584 push (or on `lastWord`/
`objEng` before the dictionary lookups at ~635 and ~712), matching the
same `.replace(/[^a-z·]/g,'')`-style cleaning already used everywhere
else in this file. Keep the raka dot (`·`) in the allowed set, since it's
a real character in Garo dictionary keys elsewhere in this file's own
patterns.

## Scope check
This should reproduce for any question with a sentence-final object
that isn't already hardcoded in `corrections.json` — e.g.
`"did you eat water?"` also reproduces it live (`Na·a Chi Cha·a`, same
bug). `"did you drink water?"` does NOT reproduce it only because that
exact phrase already has a `corrections.json` override
(`"did you drink water": "Na·a Chi Ringahama?"`) that short-circuits
before grammar-assembly ever runs.

## Native-evidence note (Claude A, not part of the engine fix)
Once this is fixed, `"did you eat rice?"` will presumably compose to
something like `Na·a Mi Cha·a<suffix>?`. The Project Owner proposed
`cha·agama`, but the only on-record citation for this exact verb+object
shape is `corrections.json`'s `"did you eat food"` → `Na·a Mi Cha·ahama?`
(`-hama`, not `-gama`) — and `"did you eat"` (no object) also uses
`-hama`. `-gama` is otherwise attested for present-continuous questions
("are you eating" → `...engama?`) and a couple of specific past-tense
verbs ("did you go" → `Re·angama?`), not for `eat`. Flagged to the
Project Owner directly rather than assumed either way — do not hardcode
`-gama` for `eat` without a fresh citation.
