# NV-221 (A), 2026-10-27: Thangseng written response document (A-Q, 42 items)

Source: `Reponse_to_Questions.pdf`, uploaded by Project Owner T. All apostrophes read as raka (`·`) per standing rule; forms written without an apostrophe (janggilo, kombolni, nokkimao, sikja, nanga, jroa) are kept exactly as written.

## Added to master_dictionary.json (39 rows, verified_high, no duplicates)
Spatial sentences (items 5-7, incl. variants paksao, nokking, mitapo); don't want/need to watch TV (8-9); want to speak (10); ska irregular paradigm `sikja` / `sikgen` / `sikjawa` (26); `nangja` (25); lying-down sentences (14-17); archaic `bairong` (TV) and `ku·bilbat` (phone), recorded under their own English keys so the loanword stays primary (22, 24); `ka·a chakna amja` = cannot bear/tolerate (27); picture hung / key hidden / cup broken (32-34); `dongja` presence vs `ong·ja` being (35); did-you-eat context pair (36); do you want the book / `nangnika` (38); `Ku·sik jroenga` (40); `nisona` (13); `i don't want` = `Anga sikja`.

## Corrected
- `i don't want` was `Anga nang·ja` (phrase_maps pin + master, unverified). `nang·ja` is "don't need"; native gives `sikja` for "don't want" (items 8, 9, 26). Pin and master fixed, old row superseded.
- Two engine tests pinned the old placeholder output for "I am lying down / in bed" (NV-007); updated to the native forms.
- 4 keys added to known_dictionary_conflicts.json (legitimate variant/superseded pairs).

## Already in repo, left alone
happy paradigm, i can eat/go/work, have you eaten, are you eating, nanga/nika/nia, ong·ja, cha ringjokma, jroa, ka·chaa.

## Not changed; needs a Project Owner ruling or Claude B
1. `i am not going` ships `Anga re·ang·ja` (corrections.json); native item 1 gives `Anga re·angjaenga` (continuous -enga after -ja). Item 3 `Ua re·angjaha` = "did not go" contradicts the RULE-025/027 reading (-jaha = cessative, `Ua re·angja` = did not go). Left as is.
2. `-de`: item 8 writes `Anga(de)`, item 9 `Angade`. Treated as optional topic marker; not generalised.
3. Item 10 writes `poraina ska`; master has `pora·na ska` (NV-153). Spelling not reconciled.
4. `ama` (can): native writes `ama` in items 18-20 and says it is a different word from `ama` (mother), pronounced differently. Primary remains `man·a` per directive 2026-09-08; contradicts nothing newly settled but feeds the open `can` ruling.
5. Items 28 (`ka·a soa` = irritated, "I think"), 29, 30 are unconfirmed; nothing stored. 23/24: no Garo word for status or internet.
6. `The dog is under the table` already ships via corrections (`tebil kokkimao`); not overwritten.
7. Item 36 is context evidence for -ma (simple past) vs -hama (present perfect); not applied to the open NV-158/182 wh-question conflict.

## Runtime handoff for Claude B
Engine still mis-handles `ska` conjugation by composition (`don't want to watch TV` ships `skja` outside the pin). A `ska` irregular paradigm (follows `sika`: -ja → sikja, -bo → sikbo, -nabe → siknabe, -gen → sikgen, -jawa → sikjawa) is the fix, in verb_paradigms.json / grammarEngine.js. Claude A did not touch engine code.
