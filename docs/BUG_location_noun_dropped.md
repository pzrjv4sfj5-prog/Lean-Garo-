# Bug Report — Location Noun Silently Dropped When Sentence Has Both Location + Purpose Clause
_Found by Claude B + user — 2026-06-20_

## Confirmed via testing

```
"i went to the market to buy rice" -> "Anga mi·ko brea·na re·anga"
```

`bajal` (market) is completely missing. `mi` (rice) and `brea·na` (to buy)
are correct, but the location is silently dropped — no `[UNKNOWN]`, no error,
just gone. Confirmed across multiple variants of the same sentence
(with/without "yesterday", with/without "the") — always missing.

We already know `bajal` works correctly elsewhere:
`"let's go to market"` → `"Hai Bajal Anti Re·na"` (correction, works fine).
So this isn't a missing-vocabulary problem — it's an object-collection bug
in `analyzeGrammar`.

---

## Root cause — traced exactly

`src/translationEngine.js`, `analyzeGrammar()`, the object-word collection
loop (around line 213-227):

```js
let objectWords = [];
let purposeAction = null;

for (let i = 1; i < words.length; i++) {
  const w = words[i].toLowerCase().replace(/[^a-z]/g,'');
  if (w === 'to' && i + 1 < words.length) {
    const nextW = words[i+1].toLowerCase().replace(/[^a-z]/g,'');
    if (PURPOSE_VERBS[nextW]) {
      purposeAction = { english: words[i+1], garo: PURPOSE_VERBS[nextW] };
      i++; continue;
    }
  }
  if (POSSESSIVES[w] || STOP_WORDS.has(w) || w === words[0].toLowerCase()) continue;
  if (verb && words[i] === verb.english) continue;
  if (IRREGULAR_VERBS[w] || IRREGULAR_VERBS[w.replace(/ing$|ed$|es$|s$/, '')]) continue;
  objectWords.push(words[i]);
}
```

Walking through `"i went to the market to buy rice"` token by token:

| word | what happens |
|---|---|
| `to` (1st) | followed by `the`, not in `PURPOSE_VERBS` → falls through, not consumed |
| `the` | stop word, skipped |
| `market` | none of the skip conditions match → **pushed to `objectWords`** |
| `to` (2nd) | followed by `buy`, IS in `PURPOSE_VERBS` → correctly becomes `purposeAction`, `buy` consumed via `i++` |
| `rice` | **also pushed to `objectWords`** |

Result: `objectWords = ["market", "rice"]` — **both nouns land in the same
single object slot**, even though one is a location/destination and the
other is the actual grammatical object of "buy".

Then, a few lines later:
```js
if (objectWords.length > 0) {
  const objEng = objectWords.join(' ');  // "market rice"
  const lastWord = objectWords[objectWords.length-1];  // "rice"
  const objGaro = lookupPhrase(objEng) || lookupGaro(objEng)
    || lookupPhrase(lastWord) || lookupGaro(lastWord) || '[UNKNOWN]';
  object = { english: objEng, garo: objGaro, withMarker: objGaro + '·ko' };
}
```

`lookupPhrase("market rice")` / `lookupGaro("market rice")` both fail (no
such combined phrase exists) → falls back to `lookupGaro("rice")` →
succeeds → **only "rice" survives, "market" is silently discarded** with no
trace, no `[UNKNOWN]` flag, nothing.

---

## Why this matters beyond just this one sentence

`analyzeGrammar` has no concept of a "location" or "destination" grammatical
role at all — only `subject`, `verb`, `object`, `possessive`, `purposeAction`.
Any sentence with a location noun phrase (anywhere, not just before "to
[verb]") will likely get silently merged into `objectWords` and then lost
the same way, any time there's more than one noun phrase competing for the
single object slot. This is the same class of "no [UNKNOWN] error, meaning
just vanishes" issue as the negation-loss bugs found earlier in the session
— consistent enough now to call it a recurring pattern in this engine: when
in doubt, words disappear instead of erroring.

---

## Suggested fix direction (not prescriptive)

`analyzeGrammar` needs a dedicated **locative/destination slot**, separate
from `object`. Detection could key off:
- A noun immediately following `"to"` BEFORE a purpose-clause `"to [verb]"`
  pattern is hit (i.e. `"to the market"` = destination, `"to buy"` = purpose)
- Possibly also `"at"`, `"in"`, `"from"` as other locative prepositions

Once captured separately, `assembleGrammar` would need a new slot in its
output ordering — likely: `Subject + Location-na/-o + Object-ko + Purpose-na
+ Verb`, matching the `-o`/`-na` locative/dative case markers already
documented in `docs/GARO_GRAMMAR_REFERENCE.md` (section 3.1, Case Markers)
but never wired into this function.

You have fuller context on the call graph and whether a quick patch (e.g.
just special-case "to the X" before a purpose-clause "to Y" as location)
or a more structural fix (proper locative slot) fits better here — flagging
the precise mechanism rather than prescribing the fix, same as previous
reports.

---

## Verification test once fixed

```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = [
  'i went to the market to buy rice',
  'i went to market to buy rice',
  'she went to the field to work',
  'he went to school to study',
];
for (const t of tests) {
  const r = await translate(t);
  console.log(`"${t}" -> "${r.garo}" [${r.method}]`);
}
EOF
```
Expect: the location noun (market/field/school) present in every output,
not just the purpose-clause object.

---

_Claude B — Platform Side_
_Found while user-testing 20 difficult sentences — full results not yet
written up separately, this was the most clearly diagnosable issue found_
