# Bug Report — Negation Silently Lost in `assembleSentenceSOV` Fallback
_Found by Claude B — 2026-06-20, while verifying commit 5157256_
_Same risk class as the bug fixed in 8ead984 — different code path_

---

## Confirmed via testing

```
"eat"                -> "Cha·bo"   [correction]
"didnt eat"           -> "Cha·a"   [sov-assembly]
"didn't eat"          -> "Cha·a"   [sov-assembly]
"doesnt understand"   -> "hai··a"  [sov-assembly]
"doesn't understand"  -> "hai··a"  [sov-assembly]
```

`"didn't eat"` and a hypothetical non-negated equivalent are indistinguishable
in output — the negation is silently dropped with zero trace, same failure
mode as the contraction bug fixed in `8ead984`, just in a different function.

---

## Root cause

`src/translationEngine.js`, function `assembleSentenceSOV` (line 251):

```js
function assembleSentenceSOV(words) {
  const content = words.filter(w => !STOP_WORDS.has(w.toLowerCase()));
  if (!content.length) return null;
  const corrections = EN_INDEX['__corrections__'] || {};
  const translated = content.map(w => {
    const lw = w.toLowerCase().replace(/[^a-z'·]/g,'');
    return lookupPhrase(lw) || lookupGaro(lw)
      || IRREGULAR_VERBS[lw]
      || lookupGaro(lw.replace(/ing$/,'')) || lookupGaro(lw.replace(/ed$/,''))
      || lookupGaro(lw.replace(/s$/,'')) || null;
  });
  // ... joins translated words, no negation handling anywhere
}
```

This function has **no awareness of negation at all** — it just filters stop
words and translates what's left. Since `"didn't"`/`"doesn't"` etc. were
added to `STOP_WORDS` in `8ead984` (to stop them leaking through as
`[UNKNOWN]` in object position), they now get silently stripped here too,
taking the negation meaning with them, with nothing left to signal it.

**Why this matches the `8ead984` bug class:** that fix added `isNegative`
detection (line 143: `const isNegative = /n't|\b(not|never)\b/i.test(input);`)
and applies a `·gija` suffix — but only inside `analyzeGrammar`'s main verb-
detection loop (lines ~182-184). Short/simple inputs that don't go through
that full path — and instead fall through to `assembleSentenceSOV` — never
see `isNegative` at all. It's computed in one function and consumed in
another, with this fallback never checking it.

---

## Suggested fix direction (not prescriptive — your call on engine logic)

`assembleSentenceSOV` needs either:

1. **Receive `isNegative` as a parameter** from whatever calls it, and apply
   the same `·gija` suffix logic used in `analyzeGrammar` to the main verb
   in `translated`, OR
2. **Run its own negation detection** independently (duplicating the regex
   check), which is more fragile but doesn't require touching the call
   signature.

Given `8ead984`'s approach already established `·gija` as the negation
suffix pattern for this codebase, option 1 (threading `isNegative` through)
seems more consistent — but you have full context on the call graph here
that I don't, so flagging the issue and root cause rather than prescribing
the exact fix.

---

## Secondary, lower-priority finding — `hai··a` for "understand"

```
"doesn't understand" -> "hai··a"  [sov-assembly]
```

Two issues bundled in this one output:
1. Double-raka pattern (`··`) — possibly connected to the broader 833-entry
   cluster already reported in `docs/double_raka_report.csv`, worth checking
   if `hai` is in that list.
2. `hai` doesn't match any root we've used for "understand" previously —
   earlier sessions used `ui`/`uija` (e.g. `"i do not understand"` → `"Anga
   uija"`, already verified and in corrections.json). Worth checking
   whether `lookupGaro('understand')` or `IRREGULAR_VERBS['understand']` is
   returning an unexpected value, possibly itself a duplicate-key collision
   from the same cluster flagged in `docs/duplicate_keys_report.csv`.

Lower priority than the negation-loss issue above, but flagging since it
surfaced in the same test pass and may share a root cause with the ongoing
duplicate-key/double-raka cleanup.

---

## Verification test once fixed

```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = [
  'eat', 'didnt eat', "didn't eat", 'doesnt understand', "doesn't understand",
  'i didn't go', 'she doesn't eat rice', // longer forms, should already work via analyzeGrammar
];
for (const t of tests) {
  const r = await translate(t);
  console.log(`"${t}" -> "${r.garo}" [${r.method}]`);
}
EOF
```
Expect: negated forms produce visibly different output from their
non-negated counterparts (e.g. `·gija` suffix present), regardless of which
code path/method handles them.

---

_Claude B — Platform Side_
_Context: found while verifying commit 5157256 (current/no-current fix, which is good and unrelated to this issue)_
