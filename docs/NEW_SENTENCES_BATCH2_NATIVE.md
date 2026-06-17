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

## Important Discrepancy to Flag — "dog bit me" vs "dog bite me"

We already have in corrections.json:
```
"dog bit me" -> "Achak anga·ko chikaha"     (from earlier native speaker session)
```

This new batch gives:
```
"dog bite me" -> "Angko a·chak chika"        (different word order AND different verb form)
```

**Two real differences, not just tense:**
1. **Word order:** `Achak anga·ko` (Dog-me) vs `Angko a·chak` (me-Dog) — opposite order!
2. **Verb form:** `chikaha` (clearly past, `-aha` suffix) vs `chika` (root/present, no tense suffix)

This suggests:
- "dog bit me" (past) = `Achak anga·ko chikaha`
- "dog bite/bites me" (present/habitual) = `Angko a·chak chika` — OR the word order
  difference could indicate both orders are acceptable in spoken Garo (OSV vs SOV,
  which Burling confirms is grammatically possible since case markers disambiguate
  roles regardless of order)

**Recommend asking the native speaker directly:** is `Angko a·chak chika` understood
as present tense ("the dog bites me" / habitual), or as another valid word order for
the same past-tense meaning? This affects whether we need both as separate corrections
or should treat the OSV variant as the same past-tense meaning with flexible order.

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
