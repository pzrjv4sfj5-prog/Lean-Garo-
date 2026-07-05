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
| `dak` | ❌ | Daka, dakaha, dakenga |
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

---

## RULE 15 — STEM FORMATION (from official suffix doc, 2026-07-01)

> "We get the stem of a word by removing a letter from the principal word."
> "If a word has a raka, the letter(s) after the raka is removed, the raka is retained."

| Root word | Stem | Rule |
|---|---|---|
| `daka` | `dak` | remove trailing `a` |
| `cha·a` | `cha·` | remove `a` after raka, retain raka |
| `ka·a` | `ka·` | remove `a` after raka, retain raka |
| `nama` | `nam` | remove trailing `a` |

For compound verbs: changes apply to SECOND word only.
`a·jak soka` → stem = `a·jak sok` → `a·jak sokgen`, `a·jak sokbo`

---

## RULE 16 — COMPLETE SUFFIX TABLE (official, 2026-07-01)

### Verb suffixes (applied to stem)
| Suffix | Meaning | daka example | cha·a example |
|---|---|---|---|
| `+gen` | will (future) | dakgen | cha·gen |
| `+bo` | do! (imperative) | dakbo | cha·bo |
| `+nabe` | don't (neg imperative) | daknabe | cha·nabe |
| `+jawa` | will not (neg future) | dakjawa | cha·jawa |
| `+gipa` | good/positive adj | namgipa | — |
| `+ja` | not/bad (predicative) | namja | — |
| `+gijagipa` | bad (attributive) | namgijagipa | — |

### Noun/pronoun suffixes (applied to stem)
| Suffix | Meaning | anga example |
|---|---|---|
| `+ni` | genitive (my/mine) | angni = my |
| `+na` | dative (for/to me) | angna = for me |
| `+o` | locative (at/in/on/with) | — (added to noun directly, no letter removed) |
| `+chi` | directional (to — motion) | antichi = to the market |

**Note on `+o`:** added WITHOUT removing letter. `tableo` = on the table, `antio` = at the market.
**Note on `+chi`:** implies motion toward. `re·angbo` = go. `Antichi re·angbo` = go to the market.

### Key vocab from doc
```
daka = to do | ka·a = to do (alternate)
te·rik = banana | anti = market
ra·baa = to bring | ra·babo = bring (imperative)
gnang = have (possessive) — Ango ki·tap gnang = I have a book
ong·a = is/am/are (alongside daka)
a·jak soka = to take revenge
```

### PENDING — gnang vs donga for "have"
PDF says: `Ango ki·tap gnang` = I have a book (possessive have)
Thangseng earlier confirmed: `Ango pen donga` = I have a pen
These may be synonyms or context-dependent. Ask Thangseng before changing any donga entries.

---

## RULE 17 — `jaha` = DISCONTINUATION, NOT PAST NEGATION (CORRECTED 2026-07-04)

> **SUPERSEDES the 2026-07-01 version of this rule below.** Thangseng revisited
> and corrected this on 2026-07-03 — full source in
> `docs/GRAMMAR_NOTES_JAHA_MANAHA_20260703.md`.

> "The 'ha' ending when used with 'ja' may be understood as termination or
> discontinuation of an action." — Thangseng (2026-07-03)

`jaha` does **NOT** mean "did not X." It means the subject **was** doing the
action but **has stopped**. Never translate `jaha` as "did not" or "never did."

| Form | Meaning | cha· example | dak example |
|---|---|---|---|
| stem+`ja` | does not (present negation) | cha·ja | dakja |
| stem+`jaha` | has stopped X-ing / no longer X-ing (discontinuation) | cha·jaha | dakjaha |

**True simple past negation ("did not eat") has NO confirmed suffix as of
2026-07-04.** `corrections.json` entries that previously mapped "did not eat"
etc. to `jaha` forms were WRONG and have been relabeled to their correct
"stopped X-ing" meaning (see `docs/fix_jaha_semantic_correction.cjs`). Do not
reintroduce "did not X" → `jaha` mappings. Flag to Thangseng as open (see
Rule 25 outstanding items).

### ~~Original 2026-07-01 rule (WRONG, kept for history only)~~
~~"Cha·ja is present tense. The past will add the suffix 'ha'. So anga
cha·jaha = i did not eat." — this reading is incorrect, see above.~~

---

## RULE 25 — `manaha` = COMPLETED ACTION (confirmed 2026-07-03)

> "'manaha' has the meaning of completion of something." — Thangseng

| Form | Meaning |
|---|---|
| stem+`manaha` | completed / has done / finished |

Examples: `Cha·manaha` = ate / has eaten / has done eating. `Ringmanaha` =
drank / has done drinking.

**vs `jaha`:** `cha·jaha` = termination of an ongoing action (stopped eating).
`cha·manaha` = completion of an action (ate, finished eating). Never
interchangeable.

**Relationship to Rule 2 (`-aha`) — UNRESOLVED:** Rule 2 already uses `-aha`
for both simple past and perfect (e.g. `cha·aha` = ate/have eaten). Whether
`-manaha` replaces, supplements, or is a stylistic alternate to `-aha` in
these contexts is an **open question** — do not assume one replaces the
other. Existing `-aha` corrections entries are left untouched pending
clarification.

**Tentative, unconfirmed:** `Angade cha·manaha` = "I have already eaten" —
Thangseng flagged this himself as "not so sure about this one." Do not add
as a confirmed correction until re-verified.

---

## RULE 18 — `gija` IS ADJECTIVAL, NOT VERBAL NEGATION (confirmed 2026-07-01)

> "The 'gija' suffix is adjectival in nature. Therefore, when we use this ending with a verb, we get a verbal adjective." — Thangseng

| Form | Type | Meaning |
|---|---|---|
| `dakja` | verbal negation | does not do |
| `dakjaha` | discontinuation (CORRECTED 2026-07-04, was wrongly "past negation") | has stopped doing / no longer doing |
| `dakgija` | verbal adjective | without doing / not doing (adjectival) |

Example: `Ua an·tangni kamko dakgija dongaha` = She stayed without doing her work
- `dakgija` = without doing (verbal adjective modifying the subject's state)
- `dongaha` = stayed/remained (the MAIN verb)
- `an·tangni` = his/her (from `an·tang` = self, `+ni` = possessive)

**Engine note:** `gija` never replaces the main verb — it modifies it adjectivally. Always needs a main verb alongside it.

---

## RULE 19 — CLASSIFIERS CONFIRMED (2026-07-01)

| Classifier | Category | Example |
|---|---|---|
| `jol` | bamboo and similar long objects | `Wa·a jolsa` = a stalk of bamboo |
| `ge·` | pen (kolom), general fallback | `kolom ge·sa` = a pen |
| `king` | flat objects (books, paper) — NO raka | `ki·tap kinggittam` = three books |

**Note on `jol` after 10:** numbers written as separate word — `ge chi·sa` = eleven pieces (to be verified).
**Note on `king`:** Thangseng confirmed no raka — `kinggittam` not `king·gittam`.

---

## RULE 20 — `an·tang` = SELF / REFLEXIVE POSSESSIVE (confirmed 2026-07-01)

`an·tang` = self → `an·tangni` = his/her own (reflexive possessive)
`an·tangni kamko` = his/her own work/job

---

## RESOLVED PENDING ITEMS (2026-07-01)
- ✅ `gnang` vs `donga` — synonyms; gnang=older/written, donga=spoken/common
- ❌ SUPERSEDED 2026-07-04: `jaha` is NOT past negation — it's discontinuation. See Rule 17 (corrected) and Rule 25 (`manaha`).
- ✅ `gija` raka — NO raka before gija when root has no raka (`dakgija` not `dak·gija`)
- ✅ `seen` — `nikaha` (no raka, nika root confirmed raka-free)
- ✅ `brong·` classifier — replaced by `jol` (bamboo), `ge·` (pen/general)
- ✅ `she bought three books` — `Ua ki·tap kinggittamko breaha`

---

## RULE 21 — `song·` vs `songna` — RAKA CHANGES MEANING (confirmed 2026-07-03)

> "Song·na = to cook. Songna = to plant or erect. The raka is the difference and it changes the meaning." — Thangseng

| Word | Raka | Meaning |
|---|---|---|
| `song·a` | ✅ | to cook |
| `songna` | ❌ | to plant / to erect |

`song·` root confirmed — all cook forms carry raka:
`Song·a, Song·aha, Song·enga, Song·gen, Song·bo, Song·nabe, Song·jawa`

Interrogative: `Song·ahama?` / `Song·engama?` / `Song·ama?` (add `-ma` to any tense)

---

## RULE 22 — HAI `-na` vs `-naha` NUANCE (confirmed 2026-07-03)

> "Both suffixes are used in hortative sentences but with slight difference in meaning." — Thangseng

| Suffix | Meaning | Example |
|---|---|---|
| `-na` | general urge (anytime) | `Hai antichi re·na` = let's go to the market (sometime) |
| `-naha` | right away OR finally getting done | `Hai nokchi re·naha` = let's go home (now) |

**Extra nuance of `-naha`:** also used for something long-planned finally happening:
`Hai knalde antichi re·naha` = let's finally go to the market tomorrow

**Engine default:** `-na` for unqualified "let's". Use `-naha` when "now"/"finally" is implied.

---

## RULE 23 — `-gen` FUTURE SUFFIX NEVER ADDS RAKA (confirmed 2026-07-03)

> "The suffixes do not have the raka. The raka comes from the root. This applies to gen as well." — Thangseng

- `cha·` root + `gen` = `cha·gen` (raka from root)
- `kat` root + `gen` = `katgen` (no raka)
- `song·` root + `gen` = `Song·gen` (raka from root)

This confirms the general raka rule applies universally to ALL suffixes including `-gen`.

---

## RULE 19b — CLASSIFIERS UPDATE (confirmed 2026-07-03)

Supersedes earlier brong·/ge entries for long objects:

| Classifier | Category | Raka | Example |
|---|---|---|---|
| `jol` | bamboo, pole, rod | ❌ | `jolsa`=one, `jolgni`=two, `jolgittam`=three |
| `pang` | tree | ❌ | `pangsa`=one tree, `panggni`=two trees |
| `dot` | log, wooden post | ❌ | `dotsa`=one log, `dotgni`=two logs |
| `ge·` | pen, pencil, general | ✅ | `ge·sa`=one, `ge·gni`=two |
| `king` | flat objects (books) | ❌ | `kingsa`=one, `kinggittam`=three |
| `jol` above 10 | separate word | — | `ge chi·sa`=11 pieces (to verify) |

---

## RULE 26 — ENGINE VERIFICATION FIXES (2026-07-04)

Cross-check of `applyTense`/`translationEngine.js` against Rules 17/18/24/25
turned up 4 implementation bugs, now fixed:

1. **`chim` full-root-append exception.** `chim` behaves like `ha` (Rule 24)
   — it appends to the FULL root, not the stripped stem. Was producing
   `Cha·chim` (wrong, stripped like a normal suffix); now correctly
   produces `Cha·achim`.
2. **`pastcont` is a two-word form, not a fused suffix.** Native-confirmed
   pattern is `[progressive-form] + ' chim'` (e.g. `Anga poraienga chim`),
   not a fused `engachim` ending. The fused form also had a silent-drop bug:
   pre-inflected progressive irregulars (e.g. `sitting`->`asongenga`) matched
   the "already inflected, return as-is" guard and skipped tense application
   entirely — `' chim'` never got appended. Both fixed.
3. **`IRREGULAR_VERBS['eaten']` raka inconsistency.** Was `cha·man·aha`
   (extra raka before `aha`), doesn't match the confirmed `manaha` form
   (Rule 25) or Rule 1 (raka belongs to the root only, never mid-suffix).
   Fixed to `cha·manaha`.
4. **Rule 18 positive construction was unimplemented.** The a38749b fix
   only addressed the negation-misuse half of `gija` (stopped `gija` from
   being used as a general negation marker). The actual positive
   construction Rule 18 describes — `without VERB-ing` → `stem+gija` paired
   with the sentence's main verb — had no grammar-assembly path at all
   (only the one confirmed corrections.json sentence worked). Added
   `tryWithoutGijaConstruction()`, wired into `translate()` before general
   grammar-assembly.

### Scope note: Garo is paratactic, not complex-subordination

`tryWithoutGijaConstruction` is intentionally narrow (single `without
VERB-ing (his/her/... NOUN)?` clause + one main verb). Garo grammar as
documented so far shows no evidence of nested/complex subordinate clause
structures — constructions are paratactic (simple clauses juxtaposed or
suffix-marked, e.g. `-ode` if-clauses, `-na` purpose clauses, `gija`
verbal-adjective clauses) rather than embedding one full clause inside
another via subordinating conjunctions. Do not generalize the without-gija
function toward arbitrary clause nesting without native-speaker
confirmation that such structures exist — it's more likely additional
patterns should be added as their own flat detectors, matching how
if-clauses and purpose-clauses are already handled elsewhere in this file.

---

## RULE 27 — NO TRUE SIMPLE PAST SUFFIX (confirmed 2026-07-05)

> "I don't think that we have something that may be called a true simple
> past suffix. As far as I can tell, 'ja' is also used to talk about past
> events." — Thangseng

`Re·angja` = "did not go" (reply to `Na·a mijalo anti re·angama?` = "Did you
go to the market yesterday?"). `-ja` is primarily a negative marker and
naturally covers past-referring negatives — do not assume a dedicated
simple-past suffix distinct from this. This RETROACTIVELY CONFIRMS the
a38749b fix (gija->ja for negation) was correct, and explains why
`i did not eat` -> `Anga Cha·ja` (present-negative form used for
past-referring negation) is the right answer, not a workaround.

**Side finding while verifying this rule:** `go` root had a raka
inconsistency — `Re·ang·a` (extra raka before the tense-suffix `a`) in
master_dictionary.json/garo_dictionary.json/final_entries.json, directly
contradicting this rule's own confirmed example `Re·angja` (no second
raka) and the already-correct `re·angbo`/`re·angjawa`/`re·angjaha` forms
already used elsewhere. Fixed to `Re·anga` at source (2026-07-05).

---

## RULE 28 — `-aha` / `-manaha` OVERLAP IN SPOKEN GARO (confirmed 2026-07-05)

> "'aha' and 'manaha' do overlap in meaning as far as spoken Garo is
> concerned." — Thangseng
> "How it is used in literature cannot be verified due to lack of source."
> — Thangseng

This resolves the "UNRESOLVED" note under Rule 25: both forms are valid in
spoken Garo, don't enforce a rigid distinction between them going forward.
Literary/written usage remains unverified — flag if it ever matters for a
specific deliverable (e.g. formal writing).

---

## RULE 29 — `-bo` IS ALSO HORTATIVE, NOT ONLY IMPERATIVE (confirmed 2026-07-05)

Primary function: imperative (command). Secondary: hortative ("let us...").

| Form | Meaning | Register |
|---|---|---|
| `Hai cha·na` | Let us eat | preferred |
| `Hai cha·bo` | Let us eat | acceptable alternative |

Do not restrict "let us..." constructions to only the `-na` form.

---

## RULE 30 — OPEN QUESTION: `re·` vs `re·ang` for "go" (flagged 2026-07-05)

User reconfirmed the original Rule 5 example directly: `Re·jawa` = "I will
not go" (bare, no destination) — matching `Hai re·naha` = "let's go" (also
bare, original confirmed sentences). This conflicts with the bulk of
dictionary/corrections data, which uses `re·ang` as the general "go" root
(`Re·anga`=go, `re·anga`=went, `re·angenga`=going, `re·angja`=did not go,
`Dokanchi re·angbo`=go to the shop).

**Fixed for now (corrections.json, exact-match, safe):** `will not go` /
`i will not go` → `re·jawa` (bare), matching the direct reconfirmation.
**NOT changed:** the general `go`/`went`/`going` dictionary forms, or
`did not go` — these still use `re·ang`, since `did not go`'s only
native-confirmed example (`Re·angja`) was itself in a destination-bearing
context ("did you go to the **market**").

**Open question for Thangseng:** is `re·` vs `re·ang` a real distinction
(e.g. bare/intransitive "go" vs directional "go to X"), or are they free
variants where either is acceptable? Until confirmed, don't propagate
`re·jawa` broadly to `went`/`going`/`did not go` forms — they may
legitimately need `re·ang` when a destination is present or implied.

---

## RULE 31 — OPEN QUESTION: copula inconsistency in predicative adjectives (flagged 2026-07-05)

Rule 6 confirms bare predicative adjective, no copula: `Gari sila` = "the
car is beautiful" (noun+adjective, nothing else). This matches engine
output for `he is happy`→`Ua kusi`, `she is tired`→`Ua nenga` (both via
grammar-assembly, no copula).

But existing corrections.json has `i am happy`→`Anga kusi ong·a` and
`it is good`→`Nama ong·a` — same predicative-adjective construction, but
WITH an `ong·a` suffix word appended. `ong·a` also appears in Rule 8's
locative example (`Achak tebil kokkimao ong·a` = "the dog is under the
table", `ong·a`="is [located]"). Three possible copula strategies are live
in the data simultaneously: (1) zero-copula bare adjective (Rule 6), (2)
`daka` (Rule 5, confirmed but no worked complement example), (3) `ong·a`
(seen in locative + a couple of predicative-adjective corrections).

**Not fixed this pass** — insufficient confirmed examples to know whether
`ong·a` is: a first-person-specific requirement, a general acceptable
alternate to bare-adjective, a locative-only copula that leaked into
unrelated predicative corrections, or something else. Do not consolidate
one direction without asking Thangseng: "Is 'ong·a' required after
predicative adjectives, optional, or specific to certain persons/contexts?
How does it relate to 'daka'?"
