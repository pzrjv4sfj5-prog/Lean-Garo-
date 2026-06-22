# CLAUDE A — CURRENT BRIEF
_Updated by Claude B — 2026-06-22_
_Claude A is already actively working on corrections this session._

---

## WHAT YOU'VE ALREADY FIXED THIS SESSION ✅

Verified by Claude B against live engine:

- `see` → `nik·a` (was wrong `nina`) ✅
- `show me` → `nina` correctly separated ✅
- `i went to see my grandmother` → `Angni ambiko nina re·anga` ✅ (possessive also fixed)
- Classifier word order flipped to noun-first (`achak mang·sa`, `mande sak·gitam`) ✅
- `ge` fallback classifier now appears in output (`four fruits` → `bi·te ge·bri`) ✅
- corrections.json bypass in classifier branch fixed (`two oranges`, `one monkey`) ✅
- Stray double-raka in `i am happy` fixed ✅
- Dictionary alternates system built (`fd7cbd6`) ✅
- Connectives applied (`91b60d0`) ✅
- All previous session fixes still holding (negation, double-raka cluster, good/Nama, current/karen, home/Nok, SOV order, 3 people) ✅

---

## OPEN ITEMS FROM THE AUDIT (prioritized)

### CRITICAL — still outstanding from the repo audit doc

**1. `number_engine.js` line 36 — wrong 11-19 pattern**
```js
// CURRENT (wrong):
if (n >= 11 && n <= 19) { return "chi" + BASE[n - 10]; }
// Produces: "chisa", "chigni" — wrong

// FIX:
if (n >= 11 && n <= 19) { return "chiking·ma·" + BASE[n - 10]; }
// Matches the CORRECT version already in garo_classifier.js line 78
```
Live test confirms `"11 dogs"` works correctly via the classifier path
(which has its own right version), but `toGaroNumber()` called directly
from `number_engine.js` would still produce wrong output.

**2. `server.js` — dead code decision**
Confirmed not called anywhere in the deployed app (no imports in
`src/pages/` or `src/components/`). Two options:
- Delete it entirely (cleanest)
- Keep but add a clear comment that it's not wired to the live engine
Either way, the current state (maintained, diverged, silently unused)
is a future audit risk.

---

### HIGH — connectives need engine support

**3. `and`/`but`/`or`/`if`/`so` are in STOP_WORDS (line 58-59)**

Native-verified Garo forms added to corrections.json (`91b60d0`):
```
and  = Aro
but  = Indiba
or   = ba
if   = Ode
so   = Uni gimin
```

Standalone lookups now work. But these words are currently stripped
by `STOP_WORDS` before any lookup runs in multi-word sentences:

```
"i am going and she is coming" -> "Anga ua·ko re·angenga"
// "and" / "Aro" completely absent from output
```

For connectives to appear in translated sentences:
- Remove `and`/`but`/`or`/`if`/`so` from `STOP_WORDS` (line 58-59)
- Add positioning logic — in Garo these connectives likely go between
  clauses the same way as English; needs native speaker confirmation
  on exact placement rules before implementing

This is the key unlock for multi-clause sentence support — the #1
capability gap identified in the 20-sentence stress test.

---

### MEDIUM — remaining audit items

**4. `speak` inconsistency**
`corrections.json` has `"speak": "a·gan·na"` but `phrase_maps.js`
and compiled dict use `Agana` (no dots, no suffix). Recommend
standardising to `Agana` across both — it's what the native speaker
uses in all the phrase-map entries and the compiled dict.

**5. `IRREGULAR_VERBS 'eaten':'cha·man·aha'`**
Burling academic form. Native speaker pattern throughout this project
uses `cha·jok` for perfect aspect. Worth replacing.

**6. `four fruits` lookup**
Live test shows `"four fruits"` → `"bi·te ge·bri"`. `bi·te` doesn't
look right for fruit (could be wrong lookup, possible duplicate-key
collision). Worth checking what `compiled_dict['fruit']` returns and
whether a correction is needed. Not urgent.

---

## WHAT CLAUDE B WILL HANDLE

- UI for connectives/multi-clause output display (once engine supports it)
- Any further native sentence batches the user provides
- Ongoing audit report work (`docs/`)
- The location-noun-dropped bug (`docs/BUG_location_noun_dropped.md`) —
  still pending, low priority, your call on when to tackle it

---

## REPO STATE
```
HEAD: 91b60d0
Build: ✅ PASS
Corrections: 340 entries
Double-raka: 0 remaining
```

_Claude B — Platform Side_
