# New Sentences — Batch 2 (Native Speaker Verified)
_Provided directly by user — 2026-06-17_
_Verified runnable by Claude B — script tested, then state restored for Claude A to apply_

## Trust Level: ✅ HIGH — direct native speaker source

Unlike Batch 1 (algorithmically generated from grammar rules), these 29 entries
came directly from the user/native speaker. This is the highest-trust category
of data in the project alongside earlier confirmed corrections ("dog bit me",
"did you eat food").

## How to Apply
```bash
git pull origin main
node docs/add_native_batch2.cjs
npm run build 2>&1 | tail -5
git add src/data/corrections.json
git commit --no-gpg-sign -m "feat: add 29 native-speaker-verified sentences batch 2"
git push origin main
```

Tested by Claude B: **Added: 29 | Skipped: 1** (`"coming"` already existed as a
different standalone entry — not a conflict, just already covered).

## Full List

| English | Garo |
|---|---|
| dog bite me | Angko a·chak chika |
| dog is chasing me to bite | Angko a·chak chikna rika |
| chasing me | rika |
| head is itching | Sko brika |
| my back is itching | Angko janggil brikat |
| back | janggil |
| smile | Ka·dinga |
| child is crying | Bi·sa grapenga |
| do you know how to cook | Na·a bijak songna changa? |
| do you know | Changa? |
| cook | Songna |
| my backbone is hurting | Angni kangkare sadikenga |
| backbone | kangkare |
| hurting | sadikenga |
| are you coming home or not | Nokchi re·bama re·bakuja? |
| not coming | re·bakuja |
| coming (skipped — already existed) | Re·bama |
| my throat is drying | Gitok ranenga |
| drying | ranenga |
| water is not flowing in my house | Noko chi jokjaenga |
| in my house | Noko |
| water | Chi |
| not flowing | jokjaenga |
| our well is dry | Chingni chiakol de tipjok |
| well | chiakol |
| dried | tipjok |
| snake bit me | Angko chipu sua |
| snake | chipu |
| let's eat | Hai, cha·na! |
| let's eat food | Hai, mi cha·na! |

## RESOLVED — "dog bit me" vs "dog bite me" — confirmed tense distinction

User confirmed (2026-06-17): the difference between these two IS a genuine
tense distinction, not a word-order variant or error.

```
"dog bit me"  (past)            -> "Achak Angko chikaha"   (-aha = past suffix)
"dog bite me" (present/habitual) -> "Angko a·chak chika"    (no tense suffix = present/habitual)
```

This confirms the Burling GOLD rule: verb root + `-aha` = past, verb root alone
(or + `-a`) = present/habitual. Good — the grammar engine's tense logic is
validated by this real example.

**Note:** word order also differs between the two (Achak-first vs Angko-first).
Per Burling, Garo allows flexible OSV/SOV order since case markers (here, `-ko`
folded into `Angko`) disambiguate roles regardless of position. Both orders
are likely acceptable; the existing correction entries don't need to be
changed for word order, only the tense distinction matters.

## CLEANUP COMPLETED — anga·ko → Angko standardization

User requested (2026-06-17): replace all instances of `anga·ko` with `Angko`
across the repository, since `Angko` is the correct contracted form
(Ang + ko = "me" accusative).

**Claude B fixed (docs files):**
- `docs/NEW_SENTENCES_BATCH2_NATIVE.md` ✅
- `docs/INSTRUCTIONS_FOR_CLAUDE_A.md` ✅

**Still pending — Claude A files (run script below):**
- `src/data/corrections.json` — 3 occurrences:
  - `"dog bit me": "Achak anga·ko chikaha"` → `"Achak Angko chikaha"`
  - `"the dog bit me": "Achak anga·ko chikaha"` → `"Achak Angko chikaha"`
  - `"a dog bit me": "Achak anga·ko chikaha"` → `"Achak Angko chikaha"`

**Script:** `docs/fix_angako.cjs` — run with `node docs/fix_angako.cjs`

## New Vocabulary Captured (for master_dictionary.json — optional)
These standalone words emerged from the sentences and could be useful dictionary
additions if not already present:
```
janggil = back (body part)
kangkare = backbone
chiakol = well (water source)
chipu = snake
gitok = throat
```
