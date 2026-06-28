# GRAMMAR — Pronoun Roots and Case Suffixes

Source: Thangseng (native speaker), 2026-06-28
Status: CONFIRMED

## Root principle

Pronouns have a root to which case suffixes are added.
`ang` is the root for first-person singular ("I/me").

## First-person singular — `ang` root

| Form | Breakdown | Meaning | Usage |
|---|---|---|---|
| `anga` | ang + a | I / me (subject) | Subject of sentence |
| `angko` | ang + ko | me (object) | Object of sentence |
| `angna` | ang + na | with me | Comitative |
| `ango` | ang + o | with me / at me | Locative/comitative variant |

## Examples in sentences
- `Anga Ua Nikaha` — I saw him (anga = subject)
- `Na·a angko Nikaha ma?` — Did you see me? (angko = object)
- `Ua angko Nikaha` — He saw me (angko = object)

## Engine note (Claude A)
When assembling sentences with first-person object ("me"), always use `angko` not `anga`.
Subject = `anga`, Object = `angko`. This is a case distinction, not a different word.

## TODO — confirm other pronoun roots
Same root+suffix logic likely applies to all pronouns:
- `na` root → `na·a` (you-subject), `nako` (you-object)? — needs native-speaker confirmation
- `u` root → `ua` (he/she-subject), `uko`? — needs confirmation
- `an·ching` (we) — root and case forms unknown

Ask Thangseng: "What is the object form of 'you' (nako?) and 'he/she' (uko?)?"

---

## Second-person singular — `nang·` root

Source: Thangseng (native speaker), 2026-06-28
Status: CONFIRMED

| Form | Breakdown | Meaning | Usage |
|---|---|---|---|
| `na·a` | nang· + a | you (subject) | Subject of sentence |
| `nang·ko` | nang· + ko | you (object) | Object of sentence |
| `nang·na` | nang· + na | for you | Dative/benefactive |
| `nang·ni` | nang· + ni | yours / of you | Genitive/possessive |
| `nang·o` | nang· + o | with you | Comitative/locative |

## Confirmed in live corrections.json
- `nang·ni` (yours/of you) — used in: "your name", "your hand", "is it yours" ✅
- `nang·ko` (you-object) — used in: "i want to see you", "i am waiting for you", "nice to meet you" ✅
- `na·a` (you-subject) — used throughout all question sentences ✅

## Parallel structure — ang· vs nang·

| Case | 1st person (ang·) | 2nd person (nang·) |
|---|---|---|
| Subject | anga | na·a |
| Object | angko | nang·ko |
| Possessive | ang·ni | nang·ni |
| With/for | angna | nang·na |
| Comitative | ango | nang·o |

## TODO — confirm 3rd person root
- `ua` (he/she) — root unknown, object/possessive forms unconfirmed
- Ask Thangseng: "What is the root for ua? And what are ua-object, ua-possessive forms?"

---

## First-person plural — `An·ching` root

Source: Thangseng (native speaker), 2026-06-28
Status: CONFIRMED

| Form | Breakdown | Meaning | Usage |
|---|---|---|---|
| `An·ching` | root | we / us (subject) | Subject of sentence |
| `An·ching·ko` | An·ching + ko | us (object) | Object of sentence |
| `An·ching·na` | An·ching + na | for us | Dative/benefactive |
| `An·ching·ni` | An·ching + ni | ours / of us | Genitive/possessive |
| `An·ching·o` | An·ching + o | with us | Comitative/locative |

## Full pronoun case table (confirmed to date)

| Case | 1st sg (ang·) | 1st pl (An·ching) | 2nd sg (nang·) | 3rd sg (ua — TBC) |
|---|---|---|---|---|
| Subject | anga | An·ching | na·a | ua |
| Object | angko | An·ching·ko | nang·ko | ? |
| Possessive | ang·ni | An·ching·ni | nang·ni | ? |
| For/dative | angna | An·ching·na | nang·na | ? |
| With/comitative | ango | An·ching·o | nang·o | ? |

## TODO — 3rd person (ua) still unconfirmed
Ask Thangseng: "What is the root for ua (he/she)? Object=uko? Possessive=uani?"

---

## Third-person singular — `u` root

Source: Thangseng (native speaker), 2026-06-28
Status: CONFIRMED (with native-speaker caveat: "oversimplification, possibly wrong at edges")

| Form | Breakdown | Meaning | Usage |
|---|---|---|---|
| `ua` | u + a | he / she / it (subject) | Subject of sentence |
| `uko` | u + ko | him / her (object) | Object of sentence |
| `uni` | u + ni | his / hers / of him/her | Genitive/possessive |
| `una` | u + na | for him / for her | Dative/benefactive |
| `uo` | u + o | with him / with her | Comitative/locative |

## Confirmed in live corrections.json
- `una` — "he spoke to her" → `Bia una aganaha` ✅

## COMPLETE pronoun case table

| Case | 1st sg (ang·) | 1st pl (An·ching) | 2nd sg (nang·) | 3rd sg (u) |
|---|---|---|---|---|
| Subject | anga | An·ching | na·a | ua |
| Object | angko | An·ching·ko | nang·ko | uko |
| Possessive | ang·ni | An·ching·ni | nang·ni | uni |
| For/dative | angna | An·ching·na | nang·na | una |
| With/comitative | ango | An·ching·o | nang·o | uo |

**Table complete — all four persons confirmed by native speaker.**

## Native speaker note
The `u` root is an oversimplification for machine processing purposes.
May not hold at every edge case in natural speech, but sufficient for
engine implementation. Flag any exceptions found in real usage.

---

## Third-person singular informal — `bi` root

Source: Thangseng (native speaker), 2026-06-28
Status: CONFIRMED

| Form | Breakdown | Meaning | Usage |
|---|---|---|---|
| `bia` | bi + a | he / she (subject, informal) | Informal subject |
| `biko` | bi + ko | him / her (object, informal) | Informal object |
| `bini` | bi + ni | his / hers (informal) | Informal possessive |
| `bina` | bi + na | for him / for her (informal) | Informal dative |
| `bio` | bi + o | with him / with her (informal) | Informal comitative |

## Confirmed in live corrections.json
- `bia` already in use: "he spoke to her" → `Bia una aganaha` ✅

## Formal vs informal 3rd person

| Case | Formal (u) | Informal (bi) |
|---|---|---|
| Subject | ua | bia |
| Object | uko | biko |
| Possessive | uni | bini |
| For/dative | una | bina |
| With/comitative | uo | bio |

Same formality distinction as `Na·a` (formal) vs `Na·ara` (informal) for 2nd person.
