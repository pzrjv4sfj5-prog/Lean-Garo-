# Garo tense, aspect and sentence structure: Claude B's synthesis (2026-11-03)

Built from the rule catalogue (RULE-001..055), the Thangseng notes (JAHA_MANAHA 07-03, JA_AHA_BO 07-05), the paradigm table (263 verbs x 9 forms), the native pins in corrections.json, today's relays, and the reference PDF. Evidence tags: N = native (Thangseng or Burling gold), O = Project Owner rule, D = derived by me, P = PDF only.

## 1. The verb is a stem plus ONE suffix; person is never marked
Stem = root minus its last letter, raka kept (RULE-015: `cha·a` -> `cha·`, `daka` -> `dak`, `re·a` -> `re·` / `re·ang-`). Suffixes attach to the stem and never create a raka (RULE-001, RULE-023). Because the verb does not agree with the subject, one native sentence covers every subject (`Anga/Na·a/Ua cha·a`). Tense/aspect/mood is carried by the suffix alone; the English auxiliary (do/did/is/will/have) has no Garo word of its own.

## 2. Tense and aspect inventory (what each suffix means)
| Category | Form (eat / go) | Meaning | Evidence |
|---|---|---|---|
| Present / habitual | `-a`: cha·a / re·a | I eat, he goes | N |
| Present continuous | `-enga`: cha·enga / re·angenga (Mandi -inga) | is eating | N |
| Past (and perfect) | `-aha`: cha·aha / re·anga | ate = has eaten (RULE-002, 028) | N |
| Completive | `-manaha`: cha·manaha | has finished eating; overlaps -aha in speech | N (RULE-026/028) |
| Perfect (alt.) | `-jok`: cha·jok(ma?) | has had/eaten (Burling) | N (RULE-046 example) |
| Future | `-gen`: cha·gen / re·anggen | will eat | N |
| Negative (present AND past) | `-ja`: cha·ja | does not / did not eat; no separate past negative (RULE-027) | N |
| Negative future | `-jawa`: cha·jawa / re·jawa | will not eat | N |
| Negative continuous | `-jaenga`: cha·jaenga / re·angjaenga | is not eating (ja BEFORE enga) | N |
| Cessative | `-jaha`: cha·jaha | has stopped eating; NOT "did not eat" (RULE-025) | N |
| Discontinued past | word `chim`: ka·achim, cha·enga chim | used to / was ...-ing, no longer (two words) | N (RULE-013) |
| Imperative | `-bo`: cha·bo | eat! (subject dropped, RULE-003b) | N |
| Negative imperative | `-nabe`: cha·nabe | don't eat | N |
| Hortative | `Hai` + `-na`: Hai cha·na | let's eat | N (RULE-007) |
| Infinitive / purpose | `-na`: cha·na | to eat; also the base for `ama/man·a` (can) and `ska` (want) | N |
| Conditional | `-ode`: cha·ode | if you eat | N (RULE-008) |
| Verbal adjective | `-gija` | without doing (RULE-018) | N |
Aspect is the real axis: Garo marks completion, continuation, cessation and discontinuation; it does NOT mark a plain English "did". Hence `-ja` for both present and past negatives, and `-aha`/`-manaha` interchangeable in speech.

## 3. Sentence structure
SOV, verb last, subject unmarked, object `-ko`, possessor `-ni`, recipient `-na`, place `-o`/`-chi`, accompaniment `-ming`. Noun phrases before the verb are freely ordered (case marks the role). Time words lead the clause and take locative `-o` in event sentences (`Mijalo`, `Da·alo`, `Knalo`, `Da·o`; `-de` for contrast, RULE-042/053). Plural `-rang` only when needed; demonstrative `ua/ia` stands where English has "the/those". Adjectives are verbs. Existence/possession split three ways (RULE-043): `donga` (be/stay), possession, `daka`/`ong·a` copulas (RULE-005/031).

## 4. Questions
Yes/no: `-ma` fused to the verb, no space (`Na·a cha·ahama?`, `Na·a cha·genma?`, RULE-046). Wh-questions: the wh-word replaces the missing item and takes NO `-ma` (RULE-048). Wh position is FREE: dominant order is subject + wh (`Na·a maina cha·a?`, `Na·a maiko cha·a?`, `Na·a bachi re·anga?`, `Mijalo na·a maina angko gela?`); clause-initial also occurs (`Maina na·a ka·dinga?`). Past wh-questions take the bare `-a` (NV-194), but Thangseng says contextual past "may depend on the verb" (NV-197).

## 5. How it is spoken (working picture)
Short, suffix-heavy clauses; subject kept in statements, dropped in commands; one suffix does several jobs and context picks the reading (`cha·ja` = does not / did not / is not eating; `cha·aha` = ate / has eaten). Speakers pick among synonyms freely (Ua/Bia, namenga/namengaba, bajalchi/antichi, Ning·chi re·babo/napbabo, mikrakengaha/mikrakbaengaha) and drop redundant case (`Mijalo anga bajal re·anga`, O, untested). Optional aspect prefixes carry nuance (`ba` = beginning to, -manaha = finished). Literary usage of aha/manaha is unverified (Thangseng).

## 6. Engine alignment (what the engine now does)
Correct and native-backed: all rows of section 2 for pinned/native verbs; negative continuous order (NV-255); perfect -> `-manaha` (NV-256, derived); stopped/finished V-ing -> `-jaha`/`-manaha` (NV-261); wh peel-and-replace, in situ default (NV-253/257); leading time word keeps `-o` (NV-261); negative imperative (NV-255); particle verbs (run away, wake up).
Known gaps / inconsistencies (no guess made):
- `He will go.` = `Bia reangen.` (old exact row, no raka, trailing period) vs paradigm `Ua re·anggen`.
- `I am at home.` = `Anga nok·o`: a suffix introducing raka contradicts RULE-001 (`noko`?).
- `I eat rice.` = `miko` but `I am eating rice.` = `mi` (bare habitual object in some pins only).
- `Where will you go?` (positive future wh) falls to the fallback: not ruled.
- Present-continuous wh: `Why are you laughing?` native `Maina na·a ka·dinga?` (simple -a) vs engine `ka·dingenga`.
- Negative perfect (`I have not gone.`) not ruled; `-ja-jok` (P).

## 7. Open questions for Thangseng (tense / mood labeled)
1. Past, wh + negative: `Why did you not eat those vegetables yesterday?` Which is natural: (a) `Mijalo na·a maina ua me·surangko cha·ja?` (b) `Na·a mijalo maina ua me·surangko cha·ja?` (c) `Na·a maina ua me·surangko mijalo cha·ja?` Is the time word's place free, or tied to the wh-word / presence of an object?
2. Past negative, wh: `What did you not eat?` = `Na·a maiko cha·jaha?` (his answer). Does `cha·jaha` here mean "did not eat" or "what have you stopped eating"? RULE-025 says -jaha = stopped, not "did not". Would `Na·a maiko cha·ja?` also be right?
3. Present continuous, wh: `Why are you laughing?` he gave `Maina na·a ka·dinga?` (-a) but `Why are you not eating?` `Na·a maina cha·jaenga?` (-jaenga). When is the continuous marked in a wh-question?
4. Wake up: `I woke up.` (past), `He wakes up.` (present), `He will wake up.` (future), `He did not wake up.` (past negative); is the continuous suffix verb-specific (katangenga vs mikrakbaengaha / mikrakengaha)?
5. Present perfect: `I have gone.` = `Anga re·angmanaha`? or `re·angaha`/`re·angjok`? And `I have not gone.` (present perfect negative)? Earlier `Angade cha·manaha` (I have already eaten) he marked "not so sure".
6. Future: `He will go.` = `Ua re·anggen` or `reangen`? and `Where will you go?` (future wh, positive): word order and form?
7. Locative: `I am at home.` = `Anga noko` or `Anga nok·o`?
8. Habitual object: `I eat rice.` (present habitual) = `Anga mi cha·a` or `Anga miko cha·a`? Is bare mass-noun object a general rule outside commands (bread, milk, tea)?
9. Synonym usage: when does a speaker choose `bia` vs `ua`, `namengaba` vs `namenga`, `antichi` vs `bajalchi`, `napbabo` vs `Ning·chi re·babo`? (register, dialect, politeness, context)
10. Cessative derived: `I have stopped going.` (present perfect, cessative) = `Anga re·angjaha`?
