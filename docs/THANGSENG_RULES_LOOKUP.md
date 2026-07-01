# THANGSENG RULES — Pre-Change Lookup Table
_Check this BEFORE touching any data or engine code._
_If your change contradicts a rule here → STOP, flag it, don't proceed._
_If your change has no rule here → flag as PENDING, don't guess._

Last updated: 2026-06-30 | Source: Thangseng (primary), Alia (secondary)

---

## HOW TO USE THIS DOC

Before adding/changing any Garo word or sentence:
1. Find the relevant section below
2. If a rule covers your case → apply it, no native confirmation needed
3. If no rule covers your case → add to PENDING section, ask Thangseng

---

## RULE 1 — RAKA IS IN THE ROOT ONLY

> "The raka is almost always part of the root or the stem. The suffixes don't have raka." — Thangseng

- Raka (`·`) belongs to the root — NEVER to any suffix
- If root has raka → ALL inflected forms inherit it
- If root has no raka → NO form ever gets one
- **Test:** if you see `cha·` anywhere in a word family, ALL words in that family must have `·` after `cha`. If even one doesn't, it's wrong.

### Confirmed root raka table
| Root | Raka | All forms carry it |
|---|---|---|
| `cha·` | ✅ | cha·a, cha·aha, cha·enga, cha·jok, cha·bo, cha·ja, cha·gen, cha·ode, cha·china |
| `re·` | ✅ | re·anga, re·baa, re·babo, re·angbo, re·enga |
| `on·` | ✅ | on·a, on·aha |
| `ra·` | ✅ | ra·a |
| `ka·` (love) | ✅ | ka·saa, ka·saaha, ka·saenga, ka·saagen |
| `nang·` | ✅ | nang·ni, nang·ko, nang·na, nang·o |
| `ang·` | ✅ | ang·ni (possessive only — subject=anga, object=angko) |
| `dak·` | ✅ | Dak·a, dak·aha, dak·enga |
| `kat` | ❌ | kata, kataha, katenga, katbo, katgen — NEVER kat·anything |
| `ring` | ❌ | Ringa, ring·aha (NOTE: ring·aha has raka — this is the NOUN ring's possessive, not the verb suffix) |
| `tusi` | ❌ | Tusia, tusienga, tus·aha, tusibo |
| `agan` | ❌ | Agana, aganaha, aganenga, aganbo |
| `nam` | ❌ | Nama, namja, namgija — NEVER nam·a |
| `dong` | ❌ | donga, dongja, donggen, dongenga, dongachim(past) — confirmed: "Ango pen donga", "Uo ki·tap dongachim" |
| `wa` (rain) | ❌ | waode — no raka |
| `bilak` | ❌ | bilakgen — no raka |

---

## RULE 2 — PAST TENSE: SHORT vs LONG FORM

> "Both works depending on how you use it. But it may be better to remove 'ha'." — Thangseng
> "The ones with 'ha' suffix maybe better translated as 'have [done]'." — Thangseng

| Suffix | Tense | Meaning | Example |
|---|---|---|---|
| root+`aa`/`a` | simple past | did X | `re·baa` = came |
| root+`aha` | perfect | have done X | `re·baaha` = have come |

**Engine default:** Use short form (`-aa`/`-a`) for simple past. Use `-aha` for perfect "have done."
These are DIFFERENT tenses, not style variants.

---

## RULE 3 — WORD ORDER (SOV)

Subject + Object + Verb. Always.
- Questions: add `-ma` at end, word order unchanged
- Subject is optional when inferable (subjectless questions valid)
- Imperatives: verb only, no subject (`Sengbo` not `Na·a Sengbo`)

> "Sometimes spoken way skips prepositions and only focuses on verb like Sengbo" — Thangseng

---

## RULE 4 — PRONOUNS

### Subject vs Object — NEVER mix these up
| Person | Subject | Object | Possessive | Dative | Locative |
|---|---|---|---|---|---|
| I | `anga` | `angko` | `ang·ni` | `angna` | `angchi` |
| I (have/possessive context) | `Ango` | — | — | — | — |
| You | `na·a` | `nang·ko` | `nang·ni` | `nang·na` | — |
| He/She (formal) | `ua` | `uko` | `uni` | `una` | — |
| He/She (informal) | `bia` | `biko` | `bini` | `bina` | — |
| We | `An·ching` | `An·ching·ko` | `An·ching·ni` | `An·ching·na` | — |

**Critical:** `ua` = subject ONLY. Object = `uko`. Never `Anga Ua Nikaha` — must be `Anga uko Nikaha`.
**`Ango`** = "I" specifically in possessive/have constructions: `Ango pen donga`, `Ango achak mang·gni donga`

### Formality
- `na·a` = formal/neutral YOU (engine default)
- `na·ara` = informal YOU (both correct per Thangseng)
- `ua` = formal HE/SHE | `bia` = informal

---

## RULE 5 — COPULA `daka`

`daka` = is/am/are — ALL persons, confirmed.
- `Anga daka` | `Na·a daka` | `Ua daka` | `An·ching daka`

---

## RULE 6 — ADJECTIVE PLACEMENT

- Predicative (after noun): `noun + adj` — `Gari sila` = the car is beautiful
- Attributive (before noun): `adj+gipa + noun` — `Silgipa gari` = beautiful car
- Negation `ja` = ONLY after noun. `mande namja` ✅ | `namja mande` ❌ WRONG
- Negation `gija` = either position. Both `namgija mande` ✅ and `mande namgija` ✅

---

## RULE 7 — HAI (LET'S) CONSTRUCTION

- `Hai + verb·na` = let's do (future, not happening yet): `Hai knalo momo cha·na`
- `Hai + verb·naha` = let's do (imminent, about to start): `Hai cha·naha`
- NOT interchangeable — using `naha` with future context = WRONG

---

## RULE 8 — IF-CLAUSE `-ode`

Attaches to verb stem. Raka from root carries through.
- `cha· + ode` = `cha·ode` | `wa + ode` = `waode`
- `Na·a cha·ode, bilakgen` = If you eat, you will be strong
- `Mikka waode noko donggen` = If it rains, we will stay at home

---

## RULE 9 — NOUN SUFFIXES

| Suffix | Meaning | Example |
|---|---|---|
| `+ko` | accusative (object marker) | `miko`=rice-obj, `angko`=me, `uko`=him |
| `+o` | locative (at/in/on) | `noko`=at home, `bajal·o`=at market |
| `+chi` | to (locative) OR with (agentive) | `angchi`=to me, `garichi`=with car |
| `+ni` | possessive | `nang·ni`=yours, `ang·ni`=mine |
| `+na` | dative (for) | `nang·na`=for you, `una`=for him/her |

---

## RULE 10 — CLASSIFIERS

Format: `[noun] [classifier·number]`
Numbers 21+: raka joins ALL parts — `mang·Kolgrik·sa` (not `mang·Kolgrik sa`)

| Classifier | Category |
|---|---|
| `mang·` | animals, birds, fish |
| `sak·` | people |
| `king·` | flat objects (books, paper) |
| `gong·` | money |
| `ge·` | general fallback |

---

## RULE 11 — KEY VOCAB (CONFIRMED, DON'T CHANGE WITHOUT NATIVE SOURCE)

```
yes=Am | no=Ihing | good=Nama (NOT nam·a) | is/am/are=daka
and=Aro | but=Indiba | or=ba | so=Uni gimin | if=Ode
why=Maina (NOT Maini) | who=sawa | where=bano | when=Basaku | how=maidake
happy=kusi | tired=nenga | love(v)=ka·saa | beloved(n)=Ka·sara
angry=ka·o | gentle=rinok | long=ro·a | very=namen
thief=cha·u | rain(n)=mikka | home=nok | at home=noko
have/stay/live=donga | strong=bilak | family=po·ri·bar
stop=Sengbo | wait=Damo (synonym of Sengbo) | stand=Chakata
```

---

## RULE 12 — WHAT maini gimin IS (AND ISN'T)

`maini gimin` is a valid construction — correct for "yapping about":
`Na·a maini gimin bel·belenga` ✅

But WRONG for lying/crying/saying:
- `why are you lying` → `Na·a maina tol·enga?` (maina, no gimin)
- `what are you saying` → `Maiko aganenga?` (different structure)

---

## PENDING — NEEDS THANGSENG BEFORE ANY CHANGE

| Item | Question |
|---|---|
| `brong·` classifier | Never tested in a real sentence |
| Past of have | ~~dongachim confirmed 2026-07-01~~ ✅ |
| `how much` | Confirmed `Iako baita dam?` — but is `baita` "how much" or "price"? |
| `angna`, `ango` comitative | Pattern-inferred, not explicitly tested |
| `biko/bini/bina/bio` | Informal 3rd person case forms — pattern only |
| `jedakode` | Confirmed in 1 sentence — is this productive (any verb+dak+ode)? |
| `man·gen` | Confirmed in 1 sentence — is this "will get/obtain" generally? |

---

## RULE 13 — `chim` SUFFIX — DISCONTINUOUS PAST / "USED TO" ✅ CONFIRMED

Source: Thangseng, 2026-07-01

> "chim has a sense of discontinuity. Not just something that happened in the past
> but it is discontinued. 'anga ka·achim' = I used to work — in the past, not working anymore."

### Suffix breakdown
| Suffix | Meaning | Example |
|---|---|---|
| root+`chim` | discontinuous past / used to / had | `dongachim`, `ka·achim` |
| root+`engachim` | past continuous (was doing, no longer) | `poraienga chim` |

- `enga` = continuous + `chim` = discontinuous past → `engachim` = was doing (stopped)

### Confirmed examples
```
Ango dongachim        = I had it
Ango ki·tap dongachim = I had a book
Ango kolom dongachim  = I had a pen
Anga ka·achim         = I used to work
Anga poraienga chim   = I was studying
```

### Key distinction from -aha
- `-aha` = perfect, have done X (relevant to present)
- `-chim` = discontinued past, used to do X (no longer the case)

### Engine note (Claude A)
Add `chim` to tense suffix table. Two patterns:
- root+`chim` = discontinuous simple past
- root+`enga`+`chim` = past continuous (written `engachim`)
---

## RULE 14 — `dongama` = EXISTENTIAL "THERE IS"

Confirmed in multiple sentences:
- `Karen dongama` = there is current (electricity)
- `Nang·ni palang ning·o guang donga` = there's a spider under your bed

`donga` = has/have/there is (present)
`dongama` = there is (existential, affirmative — slight variant)
`dongja` = there is not / does not have (negation)

Both `donga` and `dongama` appear valid for "there is" — context dependent.
