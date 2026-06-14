# Pending Corrections for Claude A
_Last updated: 2026-06-14 by Claude B_

These corrections need to be added to `src/data/corrections.json` and/or `master_dictionary.json`.

---

## 1. `lets go to the market` — missing no-apostrophe variant
**Input:** `lets go to the market`  
**Current output:** `Re·ang-a Bajal / Anti` [sov-assembly] ❌  
**Correct:** `Hai Bajal Anti Re·na`  
**Fix:** Add to `corrections.json`:
```json
"lets go to the market": "Hai Bajal Anti Re·na"
```
**Note:** Root cause is apostrophe stripping not happening at input normalization. Consider normalizing `lets` → `let's` in `translationEngine.js` pre-processing so all variants resolve without needing duplicate correction entries.

---

## 2. `dog bit me` / `the dog bit me` — wrong verb
**Input:** `dog bit me`, `the dog bit me`  
**Current output:** `Achak ak-ki Angko` [sov-assembly] ❌  
**Correct:** `Achak anga ko chikaha` (native speaker verified)  
**Breakdown:**
- `Achak` = Dog
- `Angako` = Me
- `Chikaha` = Bit (past tense of `chika`, to bite)

**Fix:** Add to `corrections.json`:
```json
"dog bit me": "Achak anga ko chikaha",
"the dog bit me": "Achak anga ko chikaha"
```
**Note:** Also worth adding `chika` (to bite) and `chikaha` (past) to `master_dictionary.json` so SOV assembler handles variants like `dog bit him/her` correctly going forward.

---

## 3. `sleep` corrections (from earlier session)
**Fix:** Add to `corrections.json`:
```json
"i want to sleep": "Anga tusina sikenga",
"sleep": "tusina",
"to sleep": "tusina"
```
And in `translationEngine.js` IRREGULAR_VERBS, fix: `'sleep': 'tusina'` (was `'tusia-na'` if present).

---

## Summary
| Input | Current (wrong) | Correct |
|---|---|---|
| `lets go to the market` | `Re·ang-a Bajal / Anti` | `Hai Bajal Anti Re·na` |
| `dog bit me` | `Achak ak-ki Angko` | `Achak anga ko chikaha` |
| `the dog bit me` | `Achak ak-ki Angko` | `Achak anga ko chikaha` |
| `i want to sleep` | — | `Anga tusina sikenga` |
| `sleep` / `to sleep` | — | `tusina` |
