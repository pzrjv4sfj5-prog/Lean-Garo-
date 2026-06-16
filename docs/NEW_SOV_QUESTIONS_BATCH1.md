# New SOV Question Sentences — Batch 1
_Prepared & verified by Claude B — 2026-06-16_

## Summary
74 new sentence corrections following the verified SOV + question pattern
(`Subject + Verb-tense + ma?`), built from 25 common verbs already in
`master_dictionary.json`. Each English form checked for correct grammar
(irregular past participles fixed) before inclusion.

**24 verbs × 3 question forms (did/have/are) = ~72-74 entries**
(some forms reused, e.g. `read`/`study` share past tense `poraha`)

## Pattern Used
```
did you [verb]?        -> Na·a [Verb-past] ma?
have you [past-part]?  -> Na·a [Verb-perfect] ma?
are you [verb-ing]?    -> Na·a [Verb-progressive] ma?
```

This follows the Subject → Verb → question-marker structure confirmed by
native speaker in the "did you eat food" correction. No object included in
this batch (object versions like "did you eat food" already added in
previous session) — these are the simpler no-object question forms.

## How to Apply
1. Run the script: `docs/add_sov_questions.js`
   ```bash
   node docs/add_sov_questions.js
   ```
2. It safely skips any key that already exists in corrections.json (won't overwrite)
3. Reports exactly how many were added vs skipped
4. Then: `npm run build` to verify, and commit

## Full List (74 entries)

| English | Garo |
|---|---|
| did you drink | Na·a Ringaha ma? |
| have you drunk | Na·a Ringjok ma? |
| are you drinking | Na·a Ringenga ma? |
| did you sleep | Na·a Tusieaha ma? |
| have you slept | Na·a Tusijok ma? |
| are you sleeping | Na·a Tusienga ma? |
| did you go | Na·a Re·anga ma? |
| have you gone | Na·a Re·angjok ma? |
| are you going | Na·a Re·angenga ma? |
| did you come | Na·a Rebaaha ma? |
| have you come | Na·a Rebajok ma? |
| are you coming | Na·a Rebaenga ma? |
| did you eat | Na·a Cha·aha ma? |
| have you eaten | Na·a Cha·jok ma? |
| are you eating | Na·a Cha·enga ma? |
| did you work | Na·a Dakaha ma? |
| have you worked | Na·a Dakjok ma? |
| are you working | Na·a Dakenga ma? |
| did you study | Na·a Poraha ma? |
| have you studied | Na·a Porajok ma? |
| are you studying | Na·a Poraenga ma? |
| did you pray | Na·a Bi·aaha ma? |
| have you prayed | Na·a Bi·ajok ma? |
| are you praying | Na·a Bi·aenga ma? |
| did you run | Na·a Kataha ma? |
| have you run | Na·a Katjok ma? |
| are you running | Na·a Katenga ma? |
| did you give | Na·a On·aha ma? |
| have you given | Na·a On·jok ma? |
| are you giving | Na·a On·enga ma? |
| did you see | Na·a Nik·aha ma? |
| have you seen | Na·a Nik·jok ma? |
| are you seeing | Na·a Nik·enga ma? |
| did you speak | Na·a Agan·aha ma? |
| have you spoken | Na·a Agan·jok ma? |
| are you speaking | Na·a Agan·enga ma? |
| did you write | Na·a Seaha ma? |
| have you written | Na·a Sejok ma? |
| are you writing | Na·a Seenga ma? |
| did you read | Na·a Poraha ma? |
| have you read | Na·a Porajok ma? |
| are you reading | Na·a Poraenga ma? |
| did you buy | Na·a Breaaha ma? |
| have you bought | Na·a Breajok ma? |
| are you buying | Na·a Breaenga ma? |
| did you sell | Na·a Palaaha ma? |
| have you sold | Na·a Palajok ma? |
| are you selling | Na·a Palaenga ma? |
| did you play | Na·a Kal·aha ma? |
| have you played | Na·a Kal·jok ma? |
| are you playing | Na·a Kal·enga ma? |
| did you cook | Na·a Song·aha ma? |
| have you cooked | Na·a Song·jok ma? |
| are you cooking | Na·a Song·enga ma? |
| did you wash | Na·a Su·srongaha ma? |
| have you washed | Na·a Su·srongjok ma? |
| are you washing | Na·a Su·srongenga ma? |
| did you help | Na·a Chakaha ma? |
| have you helped | Na·a Chakjok ma? |
| are you helping | Na·a Chakenga ma? |
| did you call | Na·a Donaha ma? |
| have you called | Na·a Donjok ma? |
| are you calling | Na·a Donenga ma? |
| did you understand | Na·a Uiaha ma? |
| have you understood | Na·a Uijok ma? |
| did you love | Na·a Ka·saaha ma? |
| have you loved | Na·a Ka·sajok ma? |
| are you loving | Na·a Ka·saenga ma? |
| did you laugh | Na·a Ka·dingaha ma? |
| have you laughed | Na·a Ka·dingjok ma? |
| are you laughing | Na·a Ka·dingenga ma? |
| did you cry | Na·a Grapaha ma? |
| have you cried | Na·a Grapjok ma? |
| are you crying | Na·a Grapenga ma? |

## Notes / Caveats

1. **Source of Garo roots:** Derived algorithmically from existing
   `master_dictionary.json` entries + the confirmed `-aha`/`-jok`/`-enga`
   tense suffix rules (Burling GOLD). NOT individually native-speaker
   verified like the original "dog bit me" / "did you eat food" examples.
   **Recommend spot-checking 5-10 of these with a native speaker before
   treating them as fully authoritative.**

2. **Dropped "are you understanding"** — not natural English phrasing
   (English doesn't typically use progressive with "understand"), so
   only `did you understand` / `have you understood` included for that verb.

3. **`read` and `study` share the same Garo root** (`pora`) in our current
   dictionary — both produce identical Garo output. May need disambiguation
   later if dictionary adds distinct roots.

4. **No object variants in this batch** — these are the simpler "did you eat?"
   forms without a direct object. Object forms (e.g. "did you eat food")
   were already added in the previous session.

## Verification Status
✅ All 74 entries checked for:
- Correct English grammar (no "have you drinked" type errors)
- Consistent SOV + question pattern
- Raka (·) placement matching existing verb root conventions in corrections.json
- No duplicate/conflicting keys with current corrections.json (74 unique, 0 conflicts)

⚠️ NOT yet checked for: actual Garo grammatical correctness by a native speaker.
This is algorithmically generated from documented rules, not independently verified.
