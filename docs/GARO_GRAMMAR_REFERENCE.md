# GARO GRAMMAR REFERENCE

**SUPERSEDED (2026-07-10):** This file's closing line ("This is the only
grammar reference file... do not create new ones") is now false — it
predates and has been superseded by `docs/GRAMMAR_RULE_CATALOGUE.md`,
`GRAMMAR_SPECIFICATION.md`, `MORPHOLOGY_SPECIFICATION.md`, and
`VALIDATION_CORPUS.md` (all built July 2026), which are canonical from
here on. Kept for historical content, not as a live reference — **do not
cite this file's claims directly; verify per-claim against the catalogue
or primary sources first.** Two concrete reasons this matters, found
during review:
- §8 lists `"my father is a teacher"` and `"she bought three books"` as
  **unconfirmed** (June 29 — "assembled via SOV pattern-logic... do not
  cite as grammar fact until confirmed"). Both are now live in
  `corrections.json`, but this file's own note means their original
  confirmation provenance is genuinely uncertain — treat with the same
  caution as any `corrections.json` entry, per §10's own warning that
  the VERIFIED/HIGH tag "is unreliable — never auto-trust as tiebreaker."
  (This affects `GRAMMAR_RULE_CATALOGUE.md` RULE-005's predicate-nominal
  example — flagged there now too.)
- §10 flags `nik·aha`("seen") raka status as unconfirmed — this is now
  **resolved**: primary-source notes.pdf directly confirms `nika` is
  raka-free ("there is no raka in nikaha because the root word 'nika'
  does not have any raka"). This file was accurate for its time; newer
  evidence superseded it without this file ever being updated — same
  pattern as the rest of this document.

_Original content follows, historical:_

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
`Maiko aganenga?` ✅ and `Na·a Maiko aganenga?` ✅ = What are you saying?

---

## 2. PRONOUN SYSTEM

### Roots and case suffixes

| Person | Root |
|---|---|
| 1st singular | `ang·` |
| 1st plural | `An·ching` (root = full word) |
| 2nd singular | `nang·` |
| 3rd formal | `u` |
| 3rd informal | `bi` |

| Case | Suffix | 1st sg | 1st pl | 2nd | 3rd formal | 3rd informal |
|---|---|---|---|---|---|---|
| Subject | +a | anga | An·ching | na·a | ua | bia |
| Object | +ko | angko | An·ching·ko | nang·ko | uko | biko |
| Possessive | +ni | ang·ni | An·ching·ni | nang·ni | uni | bini |
| For/dative | +na | angna | An·ching·na | nang·na | una | bina |
| With/comitative | +o | ango | An·ching·o | nang·o | uo | bio |
| To (locative) | +chi | angchi | — | — | — | — |

**Note:** "I have" constructions use `Ango` (not `Anga`) — confirmed by two
speakers independently: `Ango achak mang·gni donga` = I have two dogs.

### Formality
- `na·a` = you, formal/neutral — **engine default**. `na·ara` = informal, both correct.
- `ua` = he/she, formal — **engine default**. `bia` = informal.

### Copula — `daka` (is/am/are)
`daka` works for ALL persons, confirmed:

| Garo | Meaning |
|---|---|
| `Anga daka` | I am |
| `Na·a daka` | You are |
| `Ua daka` | He/she is |
| `An·ching daka` | We are |

### Confirmed pronoun sentences
```
Na·a angko Nikaha ma?     = Did you see me?
Anga uko Nikaha           = I saw him/her
Ua angko Nikaha           = He/she saw me
Na·a uko Nikaha ma?       = Did you see him/her?
Bia una aganaha           = He spoke to her (informal 3rd)
nang·ni ming              = your name
Angchi re·babo            = Come to me
Ango achak mang·gni donga = I have two dogs
Sawa nang·na iako on·a    = Who gave you this?
```

---

## 3. VERB MORPHOLOGY

### Core principle
> "The Garo language relies on suffixes a lot. The tense of a sentence is totally dependent on the suffixes added to the verb. It's the morphology of words that is difficult." — Thangseng

### Raka rule (CRITICAL)
Raka (`·`) belongs to the **root only** — suffixes NEVER carry raka.
If root has raka → every inflected form inherits it. If not → none do.

| Root | Raka? | Meaning |
|---|---|---|
| `cha·` | ✅ | eat |
| `re·` | ✅ | go/walk/come |
| `on·` | ✅ | give |
| `ra·` | ✅ | take |
| `ka·saa` | ✅ | to love |
| `kat` | ❌ | run |
| `ring` | ❌ | drink |
| `tusi` | ❌ | sleep |
| `agan` | ❌ | speak |
| `nam` | ❌ | good |
| `wa` | ❌ | rain (verb) |
| `dong` | ❌ | have/stay/live (same word, no raka — Thangseng confirmed: Ango pen donga, Guwahatio dongenga) |
| `bilak` | ❌ | strong |

### Tense / mood suffix table

| Suffix | Function | cha· example | kat example |
|---|---|---|---|
| `+a` | present / root | cha·a | kata |
| `+aha` | past (long form) | cha·aha | kataha |
| `+jok` | perfect (has done) | cha·jok | katjok |
| `+enga` | progressive (doing) | cha·enga | katenga |
| `+gen` | future (will do) | cha·gen | katgen |
| `+bo` | imperative (do!) | cha·bo | katbo |
| `+nabe` | negative imperative (don't!) | cha·nabe | katnabe |
| `+jawa` | negative future (will not) | cha·jawa | katjawa |
| `+na` | infinitive / future let's | cha·na | katna |
| `+naha` | imminent let's | cha·naha | katnaha |
| `+ja` | negation, predicative | cha·ja | katja |
| `+ode` | if-clause (conditional) | cha·ode | katode |
| `+chim` | discontinuous past ("used to") | cha·chim | katchim |
| `+engachim` | past continuous ("was doing") | cha·engachim | katengachim |
| `+chi+na` | subjunctive (let X do) | cha·china | — |

### Short vs long past forms — RESOLVED: this is simple past vs perfect, not register
What looked like "two valid forms of the same tense" is actually two
DIFFERENT tenses with different meanings. Native-speaker confirmed
2026-06-30:

| Form | Tense | Meaning |
|---|---|---|
| `-a` / `-aa` (short) | simple past | did X |
| `-aha` (long) | perfect | have done X (implies relevance to now) |

| Verb | Simple past | Perfect ("have...") |
|---|---|---|
| come | re·baa = came | re·baaha = have come |
| give | on·a = gave | on·aha = have given |

Examples:
- `Na·a maini gimin re·baa?` = Why did you come? (simple past)
- `Na·a maina re·baaha?` = What have you come for? (perfect)
- `Sawa nang·na iako on·a?` = Who gave you this? (simple past)
- `Sawa nang·na iako on·aha?` = Who has given you this? (perfect)

**This means `-aha` is NOT just a "long form" — it's the perfect tense
suffix, distinct in meaning from the simple past `-a`.** Engine should
treat these as two separate tenses, not interchangeable variants.

### Hai + verb — "let's" constructions
- `Hai + verb·na` = let's do (future, not imminent): `Hai knalo momo cha·na` = let's eat momo tomorrow
- `Hai + verb·naha` = let's do (imminent, about to start): `Hai cha·naha` = let's eat (food is ready)
- **NOT interchangeable.** `Hai knalo momo cha·naha` = WRONG (imminent form with future context)

### If-clauses — `-ode`
`-ode` attaches to verb stem; raka carries through.
```
cha· + ode = cha·ode    (if eat)
wa   + ode = waode      (if rains)

Na·a cha·ode, bilakgen      = If you eat, you will be strong
Mikode cha·ode, bilakgen    = If you eat rice, you will be strong
Mikka waode noko donggen    = If it rains, we will stay at home
```

### Subjunctive — `chi` between root and suffix
`chi` inserted between root and suffix = "let [subject] do":
```
cha· + chi + na = cha·china
Ua cha·china = Let him/her eat
```

### Noun derived from verb root
`cha·` (eat) + `u` → `cha·u` = thief

### Confirmed verb inventory
```
eat=cha·a, ate=cha·aha, eating=cha·enga, has eaten=cha·jok
drink=Ringa, drank=ring·aha, drinking=ringenga
run=Kata, ran=kataha, running=katenga
see=Nika, saw=Nikaha, seeing=nikenga
speak=Agana, spoke=aganaha
go=re·ang·a, went=re·anga, going=re·angenga
come=re·ba·a, came=re·baa (preferred) / re·baaha
give=on·a (preferred) / on·aha, gave=on·aha | take=ra·a
sleep=Tusia, slept=tus·aha, sleeping=tusenga
work=Daka, worked=dakaha, working=dakenga
have=dong·a (donga without raka in "Ango...donga" construction)
dance=Chroka | sing=ring·a | swim=jrona
stand=Chakata | sit=Asong·a
laugh=ka·ding·a | cry=Grap·a
stay=donga | rain (v)=wa, waode=if rains
love (verb)=ka·saa, loved=ka·saaha, loving=ka·saenga, will love=ka·saagen
```

---

## 4. NOUN SUFFIXES

### Accusative `-ko` (object marker)
No independent meaning — marks noun as object. Same suffix as pronoun object.
`mi` (rice) + `ko` = `miko` (rice as object) | `ang+ko=angko`, `u+ko=uko`

### Prepositional `-o` (locative: at/in/on)
Same suffix as pronoun comitative.
`nok` (home) + `o` = `noko` (at home) | `ang+o=ango`, `nang+o=nang·o`

### Directional `-chi` (to / with)
**Locative** — "to [place/person]":
`angchi` = to me → `Angchi re·babo` = Come to me
`dokanchi` = to the shop → `Dokanchi re·angbo` = Go to the shop

**Agentive** — "with [instrument]":
`attechi` = with a dao → `Attechi den·a` = Cut with a dao
`garichi` = with a car → `Garichi salgaka` = Hit with a car

### Classifiers (counting nouns)
Format: `[noun] [classifier·number]`

| Classifier | Category | Example |
|---|---|---|
| `mang·` | animals, birds, fish | `achak mang·sa` = one dog |
| `sak·` | people | `mande sak·sa` = one person |
| `king·` | flat objects | `ki·tap king·gittam` = three books |
| `gong·` | money/currency | `tangka gong·bonga` = five coins |
| `ge·` | general fallback | `mewa ge·bri` = four fruits |
| `brong·` | long objects | — |

Numbers: `sa`(1) `gni`(2) `gittam`(3) `bri`(4) `bonga`(5) `dok`(6) `sni`(7) `chet`(8) `sku`(9) `chiking`(10)
Teens: `Chi·sa`(11) ... `Chi·sku`(19)
20+: `Kolgrik·sa`(21), `Kolgrik·gni`(22) — raka joins ALL parts including multi-word numbers

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

### Reduplication for emphasis
Doubling an adjective intensifies meaning: `rinok rinok` = very gentle.
Productive pattern — applies broadly, not just to this one word.

---

## 6. QUESTION WORDS

| English | Garo | Note |
|---|---|---|
| who | sawa | |
| what | Mai / Maia / Maiko | Maiko = what (accusative) |
| why | Maina | NOT Maini (was a standardization fix) |
| where | bano | |
| when | Basaku | |
| how | maidake | ✅ Thangseng confirmed |

### `maini gimin` — valid construction, context-specific
NOT categorically wrong. Correct for "yapping about":
`Na·a maini gimin bel·belenga` ✅ = What are you yapping about
But WRONG for lying/crying/saying — those use `maina` or `Maiko` instead.

---

## 7. KEY VOCABULARY

### Core
```
yes=Am | no=Ihing | good=Nama | bad=namja
and=Aro | but=Indiba | or=ba | if=Ode | so=Uni gimin
very=namen | only=saksakosan | long=ro·a | strong=bilak
thief=cha·u | rain (noun)=mikka | home=nok | at home=noko
love (verb)=ka·saa | beloved (noun)=Ka·sara | angry=ka·o | gentle=rinok
is/am/are=daka | family=po·ri·bar | work=Daka | have=dong·a
```

### Animals
```
dog=achak | cat=menggo | cow=matchu | goat=dobok | pig=wak
bird=do·o | fish=na·tok | elephant=buring·o
```

### Places & things
```
forest=mongma | market=bajal | shop=dokan | food=mi | rice=mi
coin=tangka bisil
```

### Confirmed full sentences
```
how are you                    = Na·a namenga ma?
what are you doing             = Na·a Mai Dakenga
what are you saying            = Maiko aganenga?
did you eat food                = Na·a Mi Cha·aha ma?
when did you eat                = Na·a basako cha·aha?
if you eat you will be strong   = Na·a cha·ode, bilakgen
if it rains we stay home        = Mikka waode noko donggen
come to me                      = Angchi re·babo
go to the shop                  = Dokanchi re·angbo
let him eat                     = Ua cha·china
sounds good                     = knatoa
i love you                      = Anga nang·na ka·saa
i have two dogs                 = Ango achak mang·gni donga
who gave you this                = Sawa nang·na iako on·a
who has given you this           = Sawa nang·na iako on·aha?
why did you come                 = Na·a maini gimin re·baa
what have you come for           = Na·a maina re·baaha?
love is not angry but gentle     = Ka·sara ka·o nangja, indiba rinok rinok daka
i work so i can eat (literal)    = Anga kam ka·a jedakode anga cha·na man·gen
i work so that i can eat (alt)   = Anga cha·na man·na gita kam ka·a
```

### New vocab from "i work so i can eat"
```
kam = work (noun) | ka·a = do (verb, distinct from dak·a)
jedakode = "since/because" conditional connector (verb+ode pattern extended)
man·gen = will get/will be able (future of man = to get/obtain)
gita = "in order to" / purposive connector (alternate construction)
```

---

## 8. UNVERIFIED / PENDING ITEMS

These were assembled via SOV pattern-logic, NOT yet native-confirmed.
Treat as best-guess only — do not cite as grammar fact until confirmed.

- `i went to the market to buy rice` — blocked on engine bug (location-noun dropped), not yet asked
- `she bought three books` — unconfirmed
- `the boy is playing in the school` — unconfirmed
- `my father is a teacher` — unconfirmed
- `what did you buy` / `where did you go` — unconfirmed, best-guess SOV only

---

## 9. ENGINE PRIORITY LIST (Claude A)

| # | Item | Detail |
|---|---|---|
| 1 | STOP_WORDS — question words | Remove when/why/who/what/where/how from strip list |
| 2 | STOP_WORDS — connectives | Remove and/but/or/if/so from strip list |
| 3 | Future tense `-gen` | Not yet in engine tense table |
| 4 | If-clause `-ode` | New conditional mood — fully documented above |
| 5 | Subjunctive `chi` | `Ua cha·china` pattern — new assembly rule needed |
| 6 | Accusative `-ko` on nouns | `miko` distinct from base `mi` |
| 7 | Locative/agentive `-chi` | `angchi`, `garichi` patterns |
| 8 | Pronoun case in assembly | Use `uko` not `ua` when 3rd person is object |
| 9 | `ja` vs `gija` enforcement | Block `ja` before noun |
| 10 | Short-form past tense default | Prefer `-a` over `-aha` when generating past tense |
| 11 | Location-noun-dropped bug | `docs/BUG_location_noun_dropped.md` |
| 12 | `getCategories()` broken | Returns 1 category — stray numeric keys in compiled_dict.json |
| 13 | `server.js` dead code | Confirmed dead by Claude C audit — delete or mark |

---

## 10. KNOWN DATA ISSUES

- 1,055 duplicate-key groups in `master_dictionary.json` — needs human review, not automatable
- VERIFIED/HIGH tag in dictionaries is unreliable — never auto-trust as tiebreaker
- `seen` (past participle of see) — raka status unconfirmed, currently `nik·aha`

---

_This is the only grammar reference file. All individual GRAMMAR_*.md and_
_FLAG_*.md files are superseded and historical — do not create new ones._
_Update sections in place; do not append new dated sections at the bottom._
