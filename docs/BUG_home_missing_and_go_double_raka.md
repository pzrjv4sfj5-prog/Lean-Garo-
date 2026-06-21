# Bug Report — "i will go home" missing/wrong, two separate causes
_Found by Claude B — 2026-06-20_

## Confirmed via testing

```
"i will go home now" -> "Anga da·o·ko re··gen"   [grammar-assembly]
"i will go home"     -> "Anga re··gen"            [grammar-assembly]  ("home" silently dropped)
"i will go now"      -> "Anga da·o·ko re··gen"   [grammar-assembly]
"i will go"          -> "Anga re··gen"            [grammar-assembly]
```

Two separate, unrelated bugs are stacking in these outputs:

---

## Bug 1 — "home" has no standalone dictionary entry

```js
compiled_dict["home"]  // undefined
```

Confirmed `home` does NOT exist as a standalone lookup key in
`compiled_dict.json`. It only exists inside pre-built compound phrases:

```
"at home"        -> "Nokchi"
"at / to home"   -> "nok·chi"
"go home"        -> "nokchi re·bo"
"I am going home." -> "Anga nokchi re·angenga."  (VERIFIED/HIGH/200sentences)
```

So `nok`/`nokchi` is clearly the correct root, but it's never registered as
the answer for the bare word `"home"`. Any sentence where "home" needs to be
looked up as an individual token (rather than matching one of these fixed
phrases) silently fails — `"i will go home"` just drops the word entirely
rather than erroring or falling back to `[UNKNOWN]`.

**Suspected fix:** add `"home": "nok"` (or `"nokchi"`, whichever is the
correct standalone root — your call) to corrections.json or
master_dictionary.json.

---

## Bug 2 — "now" (`Da·o`) wrongly inserted, "go" still double-raka

```js
compiled_dict["now"] // "Da·o"
compiled_dict["go"]  // "re··a"   <- still double-raka
```

Two things tangled together here:

**2a.** `"i will go home"` (no "now" in the input) still somehow produces
`da·o·ko` in `"i will go home now"`'s sibling test — actually on closer look,
`da·o·ko` only appears when "now" IS in the input (`"i will go home now"`,
`"i will go now"`), so this part may not be a bug — `now → Da·o` is a
legitimate dictionary entry, this could just be the grammar-assembly
function placing it before the verb, which may or may not be correct word
order. Flagging for your judgment whether `da·o·ko` placement is right SOV
order or not, since I'm not certain on this one.

**2b.** `"go"` → `"re··a"` is unambiguously the pre-existing double-raka
corruption, already part of the 833-entry cluster in
`docs/double_raka_report.csv` (this exact entry was used as Claude A's own
example earlier: `"come"->"re··ba·a"`, `"walk"->"re··am·a"` — `"go"` fits
the same pattern). This will keep surfacing in every future-tense sentence
using "go" until that cluster is resolved. Not a new bug, just another
visible symptom of the known pending item.

---

## Verification test once Bug 1 is fixed

```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = ['i will go home', 'i will go home now', 'home', 'go home'];
for (const t of tests) {
  const r = await translate(t);
  console.log(`"${t}" -> "${r.garo}" [${r.method}]`);
}
EOF
```
Expect: "home" present in every output that includes it in the English input.
"go" will still show double-raka until the cluster fix lands — that's
expected and tracked separately, not part of this bug.

---

## RESOLVED — Native speaker input (2026-06-20)

User provided the correct forms directly:

**"are you home?"** — literal: `Na·a Nokoma?` — but in natural spoken Garo
this is shortened to just `Nokoma?` (subject dropped). We've added the
shortened spoken form as canonical, matching how it's actually used.

**"i will go home now"** — literal: `Anga da·o nokchi re·anggen`. User noted
several natural spoken variants exist, all valid, noun/subject often omitted:
```
nokchi re·genok
re·genok
re·anggen          (noun "home" omitted)
da·o re·gen         (noun "home" omitted)
```
We've set the full literal form (`Anga da·o nokchi re·anggen`) as the
canonical default per user's explicit choice, with the shortened spoken
variants documented here as known-valid alternates for future reference —
not yet added as separate correction entries, since corrections.json is a
single-answer lookup and we didn't want to guess which shortened variant
should win if multiple short inputs map to the same intent.

**Confirms Bug 1 was real:** `nok`/`nokchi` is indeed the correct root for
"home" — now added to corrections.json as `"home": "Nok"`.

**Bug 2 (go = re··a double-raka) is unaffected by this fix** — still part
of the pending 833-entry cluster. The underlying `"go"` dictionary entry
itself remains double-raka until that cluster is resolved.

## Applied
5 entries added via `docs/add_native_batch7.cjs`, verified working:
```
"are you home"          -> "Nokoma?"
"are you home?"         -> "Nokoma?"
"i will go home now"    -> "Anga da·o nokchi re·anggen"
"i will go home"        -> "Anga nokchi re·anggen"
"home"                  -> "Nok"
```

---

_Claude B — Platform Side_
