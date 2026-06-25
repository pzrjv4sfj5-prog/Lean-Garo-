# IMPROVEMENT BRIEF — Claude A
_Based on calibration testing — 2026-06-25_
_Claude B analysis — prioritized by impact, all actionable now_

---

## CONFIRMED WORKING (do not touch)
53/53 calibration tests passing. Tier 1 simple sentences are production quality.
All verb roots, tense suffixes, classifiers, corrections — solid.

---

## PRIORITY 1 — Remove question words from STOP_WORDS (quick, high impact)

`when`, `why`, `who`, `what`, `where`, `how` are currently in STOP_WORDS
(line 58-59 of `translationEngine.js`) and get stripped before lookup.

Native-verified Garo forms now in corrections.json:
```
when  -> Basaku
why   -> Maini
who   -> Sawa
what  -> mai (already in compiled)
where -> Bano (already in compiled)
how   -> baita (already in compiled)
```

**Fix:** Remove these from STOP_WORDS. Add them to a new `QUESTION_WORDS`
set that gets passed through to output rather than stripped.

**Live evidence of the bug:**
```
"when will you come" -> "Na·a Re·ba·a"   // when dropped, future lost
"who is that"        -> "Sawa"            // only gets that->Sawa, who dropped
"why are you crying" -> "Maina Na·a grapenga"  // partially works by accident
```

**After fix expected:**
```
"when did you come"  -> "Na·a basaku i·baa?"
"who are you"        -> "Na·ara sawa?"
"why are you crying" -> "Na·ara maini gimin grapenga?"
```

---

## PRIORITY 2 — Remove connectives from STOP_WORDS (medium effort, very high impact)

`and`/`but`/`or`/`if`/`so` are in STOP_WORDS — native-verified Garo forms
already in corrections.json:
```
and -> Aro
but -> Indiba
or  -> ba
if  -> Ode
so  -> Uni gimin
```

**Current broken output:**
```
"i eat rice and drink water" -> "Anga chi·ko cha·a"
// "and drink water" completely vanishes
```

**Suggested approach (not prescriptive):**
Detect connectives BEFORE the main SOV assembly. Split input on connective
words, translate each clause separately, join with the Garo connective.

```
"i eat rice and drink water"
  -> clause1: "i eat rice"    -> "Anga mi·ko cha·a"
  -> connective: "and"        -> "Aro"
  -> clause2: "i drink water" -> "Anga chi·ko ring·a"
  -> joined: "Anga mi·ko cha·a Aro Anga chi·ko ring·a"
```

Even a basic version (just preserve the Garo connective word between two
halves) would dramatically improve the output quality for everyday speech.

---

## PRIORITY 3 — `Na·ara` subject form (new finding from question words)

Native examples show `Na·ara` (not `Na·a`) as subject in question sentences:
```
Na·ara sawa?         = Who are you?
Na·ara maini gimin tol·enga? = Why are you lying?
```

`Na·a` = "you" (standard form)
`Na·ara` = "you" (in question/interrogative context, appears to add `-ra`)

**Check:** Is `Na·ara` already handled in the pronoun map, or does it need
adding? And is `-ra` a general interrogative marker that should be in
`IRREGULAR_VERBS`/`STOP_WORDS` handling?

---

## PRIORITY 4 — Location noun dropped bug (already documented)

`docs/BUG_location_noun_dropped.md` — still open.
```
"i went to the market to buy rice" -> "Anga mi·ko brea·na re·anga"
// "market" (bajal) completely missing
```

Root cause: `analyzeGrammar` has no locative slot — both "market" and "rice"
get pushed into single `objectWords`, lookup fails on "market rice" combined,
falls back to last word only.

Fix: add dedicated locative detection before the object-collection loop.
Trigger: noun immediately following `"to the"` / `"to"` (before a purpose
`"to [verb]"` pattern) → goes into `locative` slot, gets `-o` suffix.

---

## PRIORITY 5 — Subordinating conjunctions (longer term)

These have zero handling currently and cause clause collapse:
```
because, since, although, while, that (subordinate), which, whose
```

Not asking for this now — just flagging so it's on the roadmap. Each one
needs its own Garo form confirmed by native speaker before implementing.
Known so far:
```
because -> (unknown — need native speaker)
that    -> (unknown as subordinator)
```

---

## WHAT CLAUDE B WILL DO IN PARALLEL

- Add `Na·ara` to corrections.json if you confirm it's a distinct pronoun form
- Add `when`/`why`/`who` example sentences as needed
- Wire ReverseTranslator page once Claude C delivers it
- Continue adding native vocab batches as user provides them

---

## Verification test for Priorities 1 + 2 once fixed

```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = [
  'when did you come',
  'who are you',
  'why are you crying',
  'i eat rice and drink water',
  'come and eat',
  'if it rains we will not go',
  'she is tall but he is short',
];
for (const t of tests) {
  const r = await translate(t);
  console.log(`"${t}" -> "${r.garo}" [${r.method}]`);
}
EOF
```

Expected after fix: question words present in output, connectives joining
clauses rather than vanishing.

---
_Claude B — Platform Side_
_Repo HEAD: 0fcc4e3 | Corrections: 458 | Build: ✅_
