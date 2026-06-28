# GARO GRAMMAR REFERENCE
_Compiled by Claude B from native-speaker sessions with Thangseng_
_Last updated: 2026-06-28_
_Status: All rules native-speaker confirmed unless marked TODO_

---

## 1. WORD ORDER

Garo is **SOV** — Subject + Object + Verb.

| English | Garo |
|---|---|
| I eat food | Anga Mi cha·a |
| Did you eat food? | Na·a Mi Cha·aha ma? |
| He saw me | Ua angko Nikaha |

Questions: add `-ma` at end. Word order unchanged.

---

## 2. PRONOUN SYSTEM

### Roots and case suffixes

| Case | 1st sg (ang·) | 1st pl (An·ching) | 2nd (nang·) | 3rd formal (u) | 3rd informal (bi) |
|---|---|---|---|---|---|
| Subject | anga | An·ching | na·a | ua | bia |
| Object | angko | An·ching·ko | nang·ko | uko | biko |
| Possessive | ang·ni | An·ching·ni | nang·ni | uni | bini |
| For/dative | angna | An·ching·na | nang·na | una | bina |
| With/comitative | ango | An·ching·o | nang·o | uo | bio |
| To (locative) | angchi | — | — | — | — |

### Formality
- `na·a` = you (formal/neutral) — use as default
- `na·ara` = you (informal, `-ra` suffix) — both correct, context-dependent
- `ua` = he/she (formal) — default
- `bia` = he/she (informal)

### Confirmed sentences
- `Na·a angko Nikaha ma?` = Did you see me?
- `Anga uko Nikaha` = I saw him/her
- `Ua angko Nikaha` = He/she saw me
- `Bia una aganaha` = He spoke to her (informal)
- `nang·ni ming` = your name
- `Angchi re·babo` = Come to me

---

## 3. VERB ROOTS AND TENSE SUFFIXES

### Key principle
> "The Garo language relies on suffixes a lot. In fact, the tense of a sentence is totally dependent on the suffixes added to the verb."

### Raka rule
The raka (`·`) is part of the **root**, not the suffix. Suffixes never carry raka.
If root has raka → ALL inflected forms have it. If not → none do.

| Root | Raka? | Meaning |
|---|---|---|
| `cha·` | ✅ yes | eat |
| `kat` | ❌ no | run |
| `ring` | ❌ no | drink |
| `tusi` | ❌ no | sleep |
| `agan`/`agana` | ❌ no | speak |
| `nam` | ❌ no | good |
| `re·` | ✅ yes | go/walk |
| `on·` | ✅ yes | give |
| `ra·` | ✅ yes | take |

### Tense suffix table

| Suffix | Function | cha· example | kat example |
|---|---|---|---|
| `+a` | present/root | cha·a | kata |
| `+aha` | past | cha·aha | kataha |
| `+jok` | perfect (has done) | cha·jok | katjok |
| `+enga` | progressive (doing) | cha·enga | katenga |
| `+gen` | future (will do) | cha·gen | katgen |
| `+bo` | imperative (do!) | cha·bo | katbo |
| `+na` | infinitive / future let's | cha·na | katna |
| `+naha` | imminent let's (about to) | cha·naha | katnaha |
| `+ja` | negation predicative | cha·ja | katja |
| `+chi+na` | subjunctive (let X do) | cha·china | — |

### Hai + verb constructions
- `Hai + verb·na` = let's [do] (future, not imminent): `Hai knalo momo cha·na` = let's eat momo tomorrow
- `Hai + verb·naha` = let's [do] (imminent, about to start): `Hai cha·naha` = let's eat (food is ready)
- These are NOT interchangeable — `naha` for imminent only

### Confirmed verb forms in corrections.json
```
eat=cha·a, ate=cha·aha, eating=cha·enga, has eaten=cha·jok
drink=Ringa, drank=ring·aha, drinking=ringenga
run=Kata, ran=kataha, running=katenga
see=Nika, saw=Nikaha, seeing=nikenga
speak=Agana, spoke=aganaha
go=re·ang·a, went=re·anga, going=re·angenga
come=re·ba·a, came=re·ba·aha, coming=re·baenga
give=on·a, gave=on·aha
take=ra·a
sleep=Tusia, slept=tus·aha, sleeping=tusenga
work=Dak·a, worked=dak·aha, working=dakenga
dance=Chroka, sing=ring·a, swim=jrona
stand=Chakata, sit=Asong·a
laugh=ka·ding·a, cry=Grap·a
```

---

## 4. NOUN MORPHOLOGY

### Noun from verb root
`cha·` (eat) + `u` → `cha·u` = thief

### Suffix `chi` on nouns — locative and agentive

**Locative** ("to [place/person]"):
- `ang + chi` = `angchi` = to me → `Angchi re·babo` = Come to me
- `dokan + chi` = `dokanchi` = to the shop → `Dokanchi re·angbo` = Go to the shop

**Agentive** ("with [instrument]"):
- `atte + chi` = `attechi` = with a dao → `Attechi den·a` = Cut with a dao
- `gari + chi` = `garichi` = with a car → `Garichi salgaka` = Hit with a car

### Classifier system (counting nouns)
Format: `[noun] [classifier·number]`

| Classifier | Category | Example |
|---|---|---|
| `mang·` | animals, birds, fish | `achak mang·sa` = one dog |
| `sak·` | people | `mande sak·sa` = one person |
| `king·` | flat objects (books, paper) | `ki·tap king·gittam` = three books |
| `gong·` | money/currency | `tangka gong·bonga` = five coins |
| `ge·` | general fallback | `mewa ge·bri` = four fruits |
| `brong·` | long objects (sticks, pens) | — |

Number suffixes: sa(1) gni(2) gittam(3) bri(4) bonga(5) dok(6) sni(7) chet(8) sku(9) chiking(10)
Teens: Chi·sa(11) Chi·gni(12) ... Chi·sku(19)
20+: Kolgrik·sa(21) Kolgrik·gni(22) etc — raka joins all parts

---

## 5. ADJECTIVE PLACEMENT AND NEGATION

### Predicative (after noun, no `-gipa`)
`noun + adjective` → `Gari sila` = the car is beautiful

### Attributive (before noun, with `-gipa`)
`adjective+gipa + noun` → `Silgipa gari` = beautiful car

### Negation: `ja` vs `gija`

| Form | Placement | Example |
|---|---|---|
| `namja` | after noun ONLY | `mande namja` ✅ = the person is bad |
| `namgija` | before OR after noun | `namgija mande` ✅ OR `mande namgija` ✅ |
| `namja mande` | ❌ WRONG | Never before noun |

---

## 6. SUBJUNCTIVE — `chi` in verbs

`chi` placed between verb root and suffix = "let [subject] do":
- `cha· + chi + na` = `cha·china` = let (someone) eat
- `Ua cha·china` = Let him/her eat

---

## 7. KEY VOCABULARY (native-confirmed)

### Core words
```
yes=Am, no=Ihing, good=Nama, bad=namja
and=Aro, but=Indiba, or=ba, if=Ode, so=Uni gimin
when=Basaku, why=maini, who=sawa, where=bano, what=Mai/Maia
I/me=anga/angko, you=na·a/nang·ko, he/she=ua/uko, we=An·ching
very=namen, only=saksakosan, long=ro·a
```

### Animals
```
dog=achak, cat=menggo, cow=matchu, goat=dobok, pig=wak
bird=do·o, fish=na·tok, elephant=buring·o
```

### Places
```
forest=mongma, market=bajal, shop=dokan
```

### Common phrases
```
how are you=Na·a namenga ma?
what are you doing=Na·a Mai Dakenga
did you eat food=Na·a Mi Cha·aha ma?
come to me=Angchi re·babo
go to the shop=Dokanchi re·angbo
let him eat=Ua cha·china
thief=cha·u
sounds good=knatoa
```

---

## 8. OPEN ITEMS FOR ENGINE (Claude A priority list)

| Priority | Item | Notes |
|---|---|---|
| 1 | STOP_WORDS — remove question words | when/why/who/what/where stripped, breaking sentences |
| 2 | STOP_WORDS — remove connectives | and/but/or/if/so stripped, biggest quality gap |
| 3 | Future tense `-gen` | `cha·gen`, `katgen` — not yet in engine |
| 4 | Subjunctive `chi` | `Ua cha·china` pattern not handled |
| 5 | `ja` vs `gija` placement enforcement | Engine must block `ja` before noun |
| 6 | Locative/agentive `chi` on nouns | `angchi`, `dokanchi` patterns |
| 7 | Pronoun case switching | Object vs subject form in assembly |
| 8 | Location-noun-dropped bug | `docs/BUG_location_noun_dropped.md` |
| 9 | `getCategories()` returns 1 category | Stray numeric keys in compiled_dict.json |
| 10 | `server.js` dead code | Delete or mark clearly |

---

## 9. KNOWN DATA ISSUES

- 1,055 duplicate-key groups in master_dictionary.json — needs human review
- VERIFIED/HIGH tag unreliable — never auto-trust as tiebreaker
- `seen` (past participle of see) — raka status unconfirmed, left as `nik·aha` pending

---

_This document supersedes scattered grammar notes in individual GRAMMAR_*.md files._
_Single source of truth for Garo grammar as understood by the engine team._
_Update this file whenever Thangseng confirms new rules._

---

## 10. SUBJECTLESS QUESTIONS

Native-speaker confirmed: subject pronoun is optional in questions.
Both forms are correct — shorter form is natural in everyday speech.

| With subject | Without subject | Meaning |
|---|---|---|
| `Na·a Maiko aganenga?` | `Maiko aganenga?` | What are you saying? |
| `Na·ara Maiko aganenga?` | `Maiko aganenga?` | What are you saying? (informal) |

Engine default: use subjectless form when question word is present and subject is inferable.

---

## 11. `maini gimin` — confirmed valid construction

Native-speaker confirmed 2026-06-28:
`maini gimin` is a genuine Garo construction — correct in "what are you yapping about":
`Na·a maini gimin bel·belenga` ✅

It was NOT correct in "lying/crying/saying" — those needed different structures:
- `why are you lying` → `Na·a maina tol·enga?` (not maini gimin)
- `why are you crying` → `Na·a maina grapenga?` (not maini gimin)
- `what are you saying` → `Maiko aganenga?` (not maini gimin)

**Conclusion:** `maini gimin` is valid — just context-specific. Not categorically wrong.

---

## 12. IF-CLAUSES — `-ode` suffix

Source: Thangseng (native speaker), 2026-06-28
Status: CONFIRMED

### Rule
`-ode` attaches directly to the verb stem (root): `verb·root + ode`
Raka in root carries through: `cha· + ode` = `cha·ode`

### Pattern
`[Subject] [verb·ode], [result clause]`

| Example | Breakdown | Meaning |
|---|---|---|
| `cha·ode` | cha· + ode | if (someone) eats |
| `Na·a cha·ode` | you + if-eat | if you eat |
| `Anga cha·ode` | I + if-eat | if I eat |
| `waode` | wa + ode | if it rains |

### Full sentences
- `Na·a cha·ode, bilakgen` = If you eat, you will be strong
- `Mikode cha·ode, bilakgen` = If (you) eat rice, you will be strong
- `Mikka waode noko donggen` = If it rains, we will stay at home

### New vocab confirmed
| English | Garo | Notes |
|---|---|---|
| rain (noun) | mikka | |
| rain (verb root) | wa | derived from waa = to rain |
| strong | bilak | + gen = bilakgen (will be strong) |
| stay | dong | + gen = donggen (will stay) |
| at home | noko | nok + o (prepositional suffix) |
| rice (accusative) | miko | mi + ko (accusative suffix) |

### Accusative suffix `-ko`
`ko` = accusative marker (object of verb). No independent meaning.
- `mi` (rice) + `ko` = `miko` (rice, as object)
- Same `ko` as pronoun object suffix: `ang+ko=angko`, `nang+ko=nang·ko`, `u+ko=uko`

### Prepositional suffix `-o`
`o` = at/in/on (locative)
- `nok` (home) + `o` = `noko` (at home)
- Same pattern as pronoun comitative: `ang+o=ango`, `nang+o=nang·o`

### Engine note (Claude A)
`-ode` if-clause: new tense/mood suffix to add to engine.
Pattern: strip English "if", find verb, apply `·ode` to root, place at start of sentence.
