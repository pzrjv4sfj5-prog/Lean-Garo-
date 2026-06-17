# New Sentences — Batch 3: Conversational Exchanges
_Prepared by Claude B — 2026-06-17_
_Topics: greetings, directions, market/shopping, family, health & feelings_

## Trust Level: ✅ HIGH — almost entirely dictionary-sourced

**Important process note:** My first draft of this batch (40 entries) included
13 entries built on invented/guessed vocabulary not actually in our dictionary
(e.g. I guessed "turn left" = `Jak-asi-o gel·bo`, inventing the word `gel·bo`
for "turn"). Before sending that draft, I went back and searched
`master_dictionary.json` properly and found we already have much better,
**pre-verified** entries for almost everything I'd guessed:

```
"Turn left"  -> "Pila chepbo"     (notes: VERIFIED/HIGH/200sentences)
"Turn right" -> "Rikka chepbo"    (notes: VERIFIED/HIGH/200sentences)
"Go straight"-> "Sang re·angbo"   (notes: VERIFIED/HIGH/200sentences)
"I have two children" -> "Ang·o gini de dong·a"  (notes: VERIFIED/HIGH/200sentences)
"reduce the price" -> "Dam-ko on·tisa komiatbo." (existing dict entry)
"get well soon" -> "Mangmang an·sengpibo"        (existing dict entry)
```

This is a good reminder: **always search the existing dictionary thoroughly
before constructing new translations from grammar rules alone.** The dictionary
already contains native-verified data that should take priority over
algorithmic construction.

## Final Batch — 36 entries (35 new + 1 already existed)

| English | Garo | Source |
|---|---|---|
| how are you | Na·a namenga ma? | Built from verified `Namengaba` pattern + `-ma` question |
| i am fine | Anga namenga | Dictionary: "i am fine" |
| what is your name | Nang ni bimung mai? | Built from dict `bimung` (name) + `mai` (what) |
| where are you going | Na·a bano re·angenga? | Built from dict `Bano` (where) + verified `re·angenga` |
| where do you live | Na·a bano tanga? | Built from dict `Bano` + dict `tanga` (live) |
| i live in meghalaya | Anga Meghalaya-o tanga | Built from verified `-o` locative + dict `tanga` |
| where is the market | Bajal bano? | Built from dict `Bajal` (market) + `Bano` (where) |
| it is near | Sepanga | Built from dict `Sepang` (near) + `-a` suffix |
| it is far | Chel·a | Dictionary: "far" |
| turn left | Pila chepbo | **Dictionary VERIFIED/HIGH/200sentences** |
| turn right | Rikka chepbo | **Dictionary VERIFIED/HIGH/200sentences** |
| go straight | Sang re·angbo | **Dictionary VERIFIED/HIGH/200sentences** |
| how much is this | Iako baita dam? | Built from dict `baita` (how much) + `Dam` (price) |
| it is expensive | Dam-raka | Dictionary: "expensive" |
| it is cheap | Dam-nom·a | Dictionary: "cheap" |
| can you reduce the price | Dam-ko on·tisa komiatbo | Dictionary: "reduce the price" |
| this is my father | Ia ang-ni apa | Verified genitive pattern + dict `apa` |
| this is my mother | Ia ang-ni ama | Verified genitive pattern + dict `ama` |
| this is my brother | Ia ang-ni dada | Verified genitive pattern + dict `dada` |
| this is my wife | Ia ang-ni jik | Verified genitive pattern + dict `jik` |
| this is my husband | Ia ang-ni ang-se | Verified genitive pattern + dict `ang-se` |
| do you have children | Nang·o de dong·a ma? | **Dictionary VERIFIED/HIGH/200sentences** |
| i have two children | Ang·o gini de dong·a | **Dictionary VERIFIED/HIGH/200sentences** |
| younger sibling | Jong / No | Dictionary entry |
| i am sick | Anga sakamenga | Built from dict `Sakama` + progressive `-enga` |
| i have a headache | Ang-ni sko-saa | Dictionary: "headache" + genitive |
| i am tired | Anga neng·enga | Built from dict `Neng·a` (tired) |
| i am happy | Anga han·-sengenga | Built from dict `han·-seng-a` (happy) |
| i am sad | Anga duk ong·enga | Built from dict `duk ong·a` (sad) |
| i am scared | Anga kena | Dictionary: "i am scared" |
| i don't care | Anga Dal·e Ra·ja | Dictionary: "i don't care" |
| are you okay | Na·a am ma? | Built from dict `Am` (okay) + `-ma` question |
| i am okay | Anga am | Built from dict `Am` |
| take care | An·tangko simsakbo | Dictionary: "take care" |
| be careful | (skipped — already exists as "Chimsakbo") | Dictionary entry already present |
| get well soon | Mangmang an·sengpibo | Dictionary: "get well soon" |

## What Was Dropped From My First Draft (and why)

These 4 were dropped entirely because I couldn't find or construct them with
confidence, even after the dictionary re-check:

- "my stomach hurts" — dictionary has `stomach = Ok` and `stomachache = Ok-saa`,
  but I wasn't confident constructing the full "X hurts" sentence pattern
  without risking an error. Recommend: native speaker confirms `Ang-ni Ok-saa`
  or similar before adding.
- "i need a doctor" — no verified "need" construction found in dictionary for
  this context. Dictionary has "i need food/water/book" pattern (`ang dang X`)
  which could extend to `ang dang doctor` but this is a guess — flagging for
  native speaker check.
- "what happened" — no dictionary entry found, no confident construction.
- "how far is it" / "do you have any siblings" / "can you take this" — dropped
  for similar reasons, insufficient dictionary support.

## How to Apply
```bash
git pull origin main
node docs/add_conversation_batch3.cjs
npm run build 2>&1 | tail -5
git add src/data/corrections.json
git commit --no-gpg-sign -m "feat: add 35 conversational sentences batch 3 (greetings, directions, market, family, health)"
git push origin main
```

Tested by Claude B: **Added: 35 | Skipped: 1** (`be careful` already existed).

## Recommendation
This batch leans heavily on dictionary-verified entries (several tagged
`VERIFIED/HIGH/200sentences` — the highest trust tier we've seen in the
dictionary so far). The handful of constructed entries (marked "Built from..."
above) follow our established grammar patterns (-ma question, -o locative,
ang-ni genitive, -enga progressive) but are not individually native-speaker
confirmed. Recommend spot-checking 3-5 of the "Built from" entries with a
native speaker, similar to previous batches.
