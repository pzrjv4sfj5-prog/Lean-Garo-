# GARO GRAMMAR REFERENCE
_Compiled by Claude B from native-speaker sessions with Thangseng_
_Last updated: 2026-06-28 — HEAD: 749c10f_
_All rules native-speaker confirmed unless marked TODO_

---

## 1. WORD ORDER

Garo is **SOV** — Subject + Object + Verb. Questions add `-ma` at end; word order unchanged.

| English | Garo |
|---|---|
| I eat food | Anga Mi cha·a |
| Did you eat food? | Na·a Mi Cha·aha ma? |
| He saw me | Ua angko Nikaha |
| What are you saying? | Maiko aganenga? |

**Subjectless questions:** Subject pronoun is optional when inferable. Both forms correct:
- `Maiko aganenga?` ✅ and `Na·a Maiko aganenga?` ✅ = What are you saying?

---

## 2. PRONOUN SYSTEM

### Roots
Every pronoun has a root. Case suffixes attach to the root.

| Person | Root | Note |
|---|---|---|
| 1st singular | `ang·` | I / me |
| 1st plural | `An·ching` | we / us (root = full word) |
| 2nd singular | `nang·` | you |
| 3rd formal | `u` | he / she / it |
| 3rd informal | `bi` | he / she (casual speech) |

### Case suffix table

| Case | Suffix | 1st sg | 1st pl | 2nd | 3rd formal | 3rd informal |
|---|---|---|---|---|---|---|
| Subject | +a | anga | An·ching | na·a | ua | bia |
| Object | +ko | angko | An·ching·ko | nang·ko | uko | biko |
| Possessive | +ni | ang·ni | An·ching·ni | nang·ni | uni | bini |
| For/dative | +na | angna | An·ching·na | nang·na | una | bina |
| With/comitative | +o | ango | An·ching·o | nang·o | uo | bio |
| To (locative) | +chi | angchi | — | — | — | — |

### Formality
- `na·a` = you, formal/neutral — **engine default**
- `na·ara` = you, informal (`-ra` suffix) — both correct, context-dependent
- `ua` = he/she, formal — **engine default**
- `bia` = he/she, informal

### Confirmed sentences
```
Na·a angko Nikaha ma?   = Did you see me?
Anga uko Nikaha         = I saw him/her
Ua angko Nikaha         = He/she saw me
Na·a uko Nikaha ma?     = Did you see him/her?
Bia una aganaha         = He spoke to her (informal 3rd)
nang·ni ming            = your name
Angchi re·babo          = Come to me
```

---

## 3. VERB MORPHOLOGY

### Core principle
> "The Garo language relies on suffixes a lot. The tense of a sentence is totally dependent on the suffixes added to the verb. It's the morphology of words that is difficult."
— Thangseng

### Raka rule (CRITICAL)
- Raka (`·`) is part of the **root only** — suffixes NEVER carry raka
- If root has raka → every inflected form inherits it
- If root has no raka → no form ever gets one

| Root | Raka? | Meaning |
|---|---|---|
| `cha·` | ✅ | eat |
| `re·` | ✅ | go/walk |
| `on·` | ✅ | give |
| `ra·` | ✅ | take |
| `kat` | ❌ | run |
| `ring` | ❌ | drink |
| `tusi` | ❌ | sleep |
| `agan` | ❌ | speak |
| `nam` | ❌ | good |
| `wa` | ❌ | rain (verb) |
| `dong` | ❌ | stay |
| `bilak` | ❌ | strong |

### Tense / mood suffix table

| Suffix | Function | cha· (raka root) | kat (no raka) |
|---|---|---|---|
| `+a` | present / root form | cha·a | kata |
| `+aha` | past | cha·aha | kataha |
| `+jok` | perfect (has done) | cha·jok | katjok |
| `+enga` | progressive (doing) | cha·enga | katenga |
| `+gen` | future (will do) | cha·gen | katgen |
| `+bo` | imperative (do!) | cha·bo | katbo |
| `+na` | infinitive / future let's | cha·na | katna |
| `+naha` | imminent let's | cha·naha | katnaha |
| `+ja` | negation predicative | cha·ja | katja |
| `+ode` | if-clause (conditional) | cha·ode | katode |
| `+chi+na` | subjunctive (let X do) | cha·china | — |

### Hai + verb — let's constructions
- `Hai + verb·na` = let's do (future, not imminent): `Hai knalo momo cha·na` = let's eat momo tomorrow
- `Hai + verb·naha` = let's do (imminent, about to start): `Hai cha·naha` = let's eat (food is on the table)
- **NOT interchangeable** — `naha` = imminent only. `Hai knalo momo cha·naha` = WRONG

### If-clauses — `-ode`
`-ode` attaches to verb stem. Raka carries through.

```
cha· + ode = cha·ode    (if eat)
wa   + ode = waode      (if rains)
Na·a cha·ode, bilakgen          = If you eat, you will be strong
Mikode cha·ode, bilakgen        = If you eat rice, you will be strong
Mikka waode noko donggen        = If it rains, we will stay at home
```

### Subjunctive — `chi` between root and suffix
`chi` placed between root and suffix = "let [subject] do":
```
cha· + chi + na = cha·china
Ua cha·china    = Let him/her eat
```

### Noun derived from verb root
`cha·` (eat root) + `u` → `cha·u` = thief

### Confirmed verb inventory
```
eat=cha·a, ate=cha·aha, eating=cha·enga, has eaten=cha·jok
drink=Ringa, drank=ring·aha, drinking=ringenga
run=Kata, ran=kataha, running=katenga
see=Nika, saw=Nikaha, seeing=nikenga
speak=Agana, spoke=aganaha
go=re·ang·a, went=re·anga, going=re·angenga
come=re·ba·a, came=re·ba·aha, coming=re·baenga
give=on·a, gave=on·aha | take=ra·a
sleep=Tusia, slept=tus·aha, sleeping=tusenga
work=Dak·a, worked=dak·aha, working=dakenga
dance=Chroka | sing=ring·a | swim=jrona
stand=Chakata | sit=Asong·a
laugh=ka·ding·a | cry=Grap·a
stay=donga | rain (v)=wa, waode=if rains
```

---

## 4. NOUN SUFFIXES

### Accusative `-ko` (object marker)
`ko` marks noun as object of verb. No independent meaning.
- `mi` (rice) + `ko` = `miko` (rice as object)
- Same suffix as pronoun object: `ang+ko=angko`, `nang+ko=nang·ko`, `u+ko=uko`

### Prepositional `-o` (locative: at/in/on)
- `nok` (home) + `o` = `noko` = at home
- Same suffix as pronoun comitative: `ang+o=ango`, `nang+o=nang·o`

### Directional `-chi` (to / with)
**Locative** — "to [place/person]":
- `angchi` = to me → `Angchi re·babo` = Come to me
- `dokanchi` = to the shop → `Dokanchi re·angbo` = Go to the shop

**Agentive** — "with [instrument]":
- `attechi` = with a dao → `Attechi den·a` = Cut with a dao
- `garichi` = with a car → `Garichi salgaka` = Hit with a car

### Classifiers (counting nouns)
Format: `[noun] [classifier·number]`

| Classifier | Category | Example |
|---|---|---|
| `mang·` | animals, birds, fish | `achak mang·sa` = one dog |
| `sak·` | people | `mande sak·sa` = one person |
| `king·` | flat objects (books, paper) | `ki·tap king·gittam` = three books |
| `gong·` | money/currency | `tangka gong·bonga` = five coins |
| `ge·` | general fallback | `mewa ge·bri` = four fruits |
| `brong·` | long objects (sticks, pens) | — |

Number suffixes: `sa`(1) `gni`(2) `gittam`(3) `bri`(4) `bonga`(5) `dok`(6) `sni`(7) `chet`(8) `sku`(9) `chiking`(10)
Teens: `Chi·sa`(11) `Chi·gni`(12) ... `Chi·sku`(19)
20+: `Kolgrik·sa`(21) `Kolgrik·gni`(22) — raka joins ALL parts including multi-word numbers

---

## 5. ADJECTIVES

### Predicative (after noun — no `-gipa`)
`noun + adjective` → `Gari sila` = the car is beautiful

### Attributive (before noun — with `-gipa`)
`adjective+gipa + noun` → `Silgipa gari` = beautiful car

### Negation: `ja` vs `gija`

| Form | Position rule | Example |
|---|---|---|
| `namja` | after noun ONLY | `mande namja` ✅ = the person is bad |
| `namgija` | before OR after noun | `namgija mande` ✅ `mande namgija` ✅ |
| `namja mande` | ❌ NEVER before noun | WRONG |

---

## 6. QUESTION WORDS (native-confirmed)

| English | Garo | Note |
|---|---|---|
| who | sawa | |
| what | Mai / Maia / Maiko | Maiko = what (accusative) |
| why | Maina | NOT Maini |
| where | bano | |
| when | Basaku | |
| how | — | TODO |

### `maini gimin` — confirmed valid construction
NOT wrong categorically — correct in specific contexts:
- `Na·a maini gimin bel·belenga` ✅ = What are you yapping about
- But WRONG for lying/crying/saying — those use `maina` or `Maiko`

---

## 7. KEY VOCABULARY

### Core
```
yes=Am | no=Ihing | good=Nama | bad=namja
and=Aro | but=Indiba | or=ba | if=Ode | so=Uni gimin
very=namen | only=saksakosan | long=ro·a | strong=bilak
thief=cha·u | rain (noun)=mikka | home=nok | at home=noko
```

### Animals
```
dog=achak | cat=menggo | cow=matchu | goat=dobok | pig=wak
bird=do·o | fish=na·tok | elephant=buring·o
```

### Places & things
```
forest=mongma | market=bajal | shop=dokan | food=mi | rice=mi
```

### Common sentences
```
how are you              = Na·a namenga ma?
what are you doing       = Na·a Mai Dakenga
what are you saying      = Maiko aganenga?
did you eat food         = Na·a Mi Cha·aha ma?
if you eat you will be strong  = Na·a cha·ode, bilakgen
if it rains we stay home = Mikka waode noko donggen
come to me               = Angchi re·babo
go to the shop           = Dokanchi re·angbo
let him eat              = Ua cha·china
sounds good              = knatoa
```

---

## 8. ENGINE PRIORITY LIST (Claude A)

| # | Item | Detail |
|---|---|---|
| 1 | **STOP_WORDS — question words** | Remove when/why/who/what/where/how — engine strips them, breaking sentences |
| 2 | **STOP_WORDS — connectives** | Remove and/but/or/if/so — biggest quality gap in full sentences |
| 3 | **Future tense `-gen`** | `cha·gen`=will eat, `katgen`=will run — not yet in engine |
| 4 | **If-clause `-ode`** | `Na·a cha·ode, bilakgen` — new conditional mood, now fully documented |
| 5 | **Subjunctive `chi`** | `Ua cha·china` = let him eat — needs new assembly rule |
| 6 | **Accusative `-ko` on nouns** | `miko`=rice-as-object, distinct from base `mi` |
| 7 | **Locative/agentive `-chi`** | `angchi`=to me, `garichi`=with car |
| 8 | **Pronoun case in assembly** | Use `uko` not `ua` when 3rd person is object |
| 9 | **`ja` vs `gija` enforcement** | Block `ja` before noun |
| 10 | **Location-noun-dropped bug** | `docs/BUG_location_noun_dropped.md` |
| 11 | **`getCategories()` broken** | Returns 1 category — stray numeric keys in compiled_dict.json |
| 12 | **`server.js` dead code** | Confirmed dead by Claude C — delete or mark |

---

## 9. KNOWN DATA ISSUES

- 1,055 duplicate-key groups in `master_dictionary.json` — needs human review, not automatable
- VERIFIED/HIGH tag unreliable — confirmed wrong on "current" and "good" — never auto-trust
- `seen` (past participle) — raka status unconfirmed, currently `nik·aha`, flagged pending

---

_Single source of truth. Supersedes all individual GRAMMAR_*.md files._
_Update here whenever Thangseng confirms new rules._

---

## 13. COPULA — `daka` (is/are)

Source: Thangseng (native speaker), 2026-06-29
Status: CONFIRMED

`daka` functions as the copula verb "is/are" in Garo.

Example:
```
Ka·sara ka·o nangja, indiba rinok rinok daka
love    angry not     but    gentle(x2)  is
= Love is not angry, but is gentle
```

### Reduplication for emphasis
`rinok rinok` = doubling the adjective intensifies meaning ("very gentle").
This is a productive Garo pattern — reduplication = emphasis/intensity.

### Engine note (Claude A)
`daka` as copula is not yet handled by grammar-assembly.
Sentences like "X is Y" currently use adjective-only output (e.g. `Ua Nama`).
`daka` may be needed explicitly in some constructions — needs more examples.

---

## 14. `ka·sara` vs `ka·saa` — noun vs verb

Source: Thangseng, 2026-06-29. CONFIRMED.

| Word | Type | Meaning |
|---|---|---|
| `Ka·sara` | noun | beloved |
| `ka·saa` | verb | to love |

Example: `Anga nang·na ka·saa` = I love you (verb form)

## 15. `daka` — copula, all persons confirmed

`daka` = is/am/are — works for ALL persons (native-speaker confirmed).

| Garo | Meaning |
|---|---|
| `Anga daka` | I am |
| `Na·a daka` | You are |
| `Ua daka` | He/she is |
| `An·ching daka` | We are |

---

## 16. PAST TENSE VARIANTS — confirmed flexibility

Source: Thangseng, 2026-06-29

For some verbs, multiple past-tense suffix lengths are equally valid:
`re·baaha` and `re·baa` (both = "came") — confirmed both correct.

**Implication:** Not every suffix variation is an error. Some verbs allow
shorter/longer past forms interchangeably (register or speaker preference,
not grammatically distinct). Don't assume an unconfirmed form is wrong
just because it differs in length from another confirmed form of the
same verb — ask before correcting.

---

## 17. SHORT vs LONG PAST FORMS — preference rule

Source: Thangseng, 2026-06-29. CONFIRMED.

> "Both works depending on how you use it. But it may be better to
> remove 'ha'. Let's just say re'baa and on'a."

**Rule:** When a verb has both a short (`-a`) and long (`-aha`) past form,
**prefer the short form** as the default/standard. Both are grammatically
valid, but short form is the recommended default for the engine.

| Verb | Short (preferred) | Long (also valid) |
|---|---|---|
| come | re·baa | re·baaha |
| give | on·a | on·aha |

**Engine note:** When generating past tense, default to short form
(`root+a` style) rather than `root+aha`, unless a specific confirmed
sentence uses the long form.
