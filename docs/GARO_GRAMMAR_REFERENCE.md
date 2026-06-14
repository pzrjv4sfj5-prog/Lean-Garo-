# Garo Grammar Reference
_Compiled by Claude B from academic sources — for engine improvement_
_Sources: Burling (2003), Phillips (1904), languagesgulper.com, Wiktionary Appendix: Garo Verbs_
_Last updated: 2026-06-14_

---

## 1. LANGUAGE OVERVIEW

- **Family:** Sino-Tibetan → Tibeto-Burman → Bodo-Garo
- **Word order:** SOV (Subject → Object → Verb). OSV also acceptable due to case markers. Verb ALWAYS final.
- **Tones:** None (unlike most Tibeto-Burman languages)
- **Script:** Roman (A'chik/A'we dialect, developed by Baptist missionaries ~1890s)
- **Key dialects:** A'we (standard, NE Garo Hills), A'beng (W Garo Hills + Bangladesh), A'chik
- **Suffixing language** — grammar expressed almost entirely through suffixes, not word order changes

---

## 2. VERB CONJUGATION

### 2.1 Main Tenses
Verb = **verb root + tense suffix**. No agreement with subject or object (no conjugation by person).

| Tense | Suffix | Example (root: `bil` = fly) | Translation |
|---|---|---|---|
| Present / Neutral | `-a` | `Bila` | [I] fly |
| Past | `-aha` | `Bilaha` | [I] flew |
| Future (positive) | `-gen` | `Bilgen` | [I] will fly |
| Future (A'beng dialect) | `-noa` | `Bilnoa` | [I] will fly |

> **Critical for engine:** Past tense is always `-aha`. This confirms native speaker data:
> `chika` (bite) → `chikaha` (bit) ✅

### 2.2 Extended Tenses / Aspects

| Function | Suffix | Meaning |
|---|---|---|
| Perfect / Recent past | `-jok` | "just happened" / change of state |
| Progressive | `-eng` | ongoing action ("is doing") |
| Immediate / Intentional future | `-gin-ok` / `-na-jok` | "about to do" |
| Conditional / Past perfect | add `-chim` after tense marker | irrealis mood |

### 2.3 Moods

| Mood | Suffix | Example | Translation |
|---|---|---|---|
| Imperative (positive) | `-bo` | `cha·bo` | Eat! |
| Imperative (negative) | `-na-be` | `cha·na-be` | Don't eat! |
| Interrogative (yes/no) | `-ma-` (infix) | `cha·ma?` | Have [you] eaten? |

> **For engine:** Imperative suffix `-bo` confirms `Tusibo` (sleep! / go to sleep) ✅

### 2.4 Negation

| Context | Suffix | Notes |
|---|---|---|
| Standard negation | `-ja-` (infix before tense) | "does not / did not" |
| Negative future | `-jawa` | negates `-gen` |
| Negative imperative | `-na-be` | "don't do X" |

> **Engine note:** Our current corrections use `-gija` (e.g. `nama-gija`). Academic standard is `-ja-` as infix. Both may be valid in A'chik dialect — native speaker to verify which form is standard in speech.

### 2.5 Verb Structure Formula
```
[verb root] + [pre-tense infixes] + [tense suffix] + [post-tense suffixes]
```
Pre-tense infixes (in fixed order) can indicate:
- Action directed toward another person
- Action in progress
- Reciprocal or causative
- Direction of motion
- Adverbial modification

Post-tense suffixes indicate: probability, interrogation, quotation, politeness, conditionality, perfective aspect.

### 2.6 Infinitive
- Suffix: `-na`
- Meaning: "to do X"
- Example: `cha·na` = to eat, `re·na` = to go, `tusina` = to sleep
- Note: Infinitives end in `-na` but verb is still present tense in meaning

### 2.7 Subordinate Clauses
- Subordinate clause ALWAYS precedes the main clause
- Subordination marked by special suffixes on the subordinate verb: `-e`, `-e-ming`, etc.
- Subordinate verb LACKS a tense suffix

---

## 3. NOUN MORPHOLOGY

### 3.1 Case Markers
Case is indicated by suffix at the END of the noun phrase. Subject nouns have NO case marker.

| Case | Suffix | Meaning / Use |
|---|---|---|
| Nominative (subject) | _(none)_ | Subject of sentence — unmarked |
| Accusative (object) | `-ko` | Object of verb — "him/her/it" |
| Genitive (possessive) | `-ni` | Possession — "of / 's" |
| Dative | `-na` | "to / for" |
| Locative (time+space) | `-o` | "at / in / on" |
| Locative (space only) | `-chi` | "at / in (spatial)" |
| Instrumental ("with") | `-chi` | "with / by means of" |
| Instrumental ("accompanying") | `-ming` | "with (company)" |

> **Engine note:** We currently only use `-ko` (accusative). Adding `-ni` (genitive/possessive), `-o` (locative), and `-na` (dative) would significantly improve sentence assembly.

### 3.2 Plural Markers
Plural is not obligatory in Garo. When used:

| Suffix | Notes |
|---|---|
| `-rang` | most common plural |
| `-dang` | variant |
| `-drang` | variant |

Plural suffix precedes the case marker.
Example: `mande-rang-ko` = people (accusative plural)

### 3.3 Pronouns
Personal pronouns distinguish 3 persons × 2 numbers + 1st person plural inclusive/exclusive.

| Person | Pronoun | With accusative `-ko` | With genitive `-ni` |
|---|---|---|---|
| 1st singular (I) | `Anga` / `Ang` | `Angko` / `Angako` | `Ang-ni` (my) |
| 2nd singular (you) | `Nang` | `Nangko` | `Nang-ni` (your) |
| 3rd singular (he/she/it) | `Ua` | `Ua-ko` | `Ua-ni` (his/her) |
| 1st plural excl. (we, not you) | `Nija` | `Nija-ko` | `Nija-ni` |
| 1st plural incl. (we all) | `Nia` | `Nia-ko` | `Nia-ni` |
| 2nd plural (you all) | `Nang-rang` | — | — |
| 3rd plural (they) | `Ua-rang` | — | — |

Demonstratives:
- `i` / `ia` = this (near)
- `u` / `ua` = that (far)
- Final `-a` is dropped when case marker is added

### 3.4 Numeral Classifiers
Always used with numbers. Classifier specifies nature of thing counted.

| Classifier | Used for | Example |
|---|---|---|
| `mang-` | animals | `mang-gni achak` = 2 dogs |
| `sak-` | people / persons | `sak-gitam mande` = 3 people |
| `king-` | flat objects (books, paper, leaves) | `king-gni ki·tap` = 2 books |
| `gong-` | money / coins | |
| `do-` | birds (also prefix in bird names) | `do·o` = bird |
| `bi-` | plants (also prefix in plant names) | |
| `-ge` | general (when no specific classifier) | fallback classifier |

> Note: Classifiers with numbers usually FOLLOW the noun, but can precede.

---

## 4. SYNTAX RULES

### 4.1 Word Order
- **Main rule:** SOV — Subject → Object → Verb
- Subject has NO case marker (identified by absence of suffix)
- Object takes `-ko` accusative suffix
- Verb ALWAYS comes last
- Order of noun phrases before the verb is relatively free (case markers clarify role)

### 4.2 Postpositions
Garo uses postpositions (not prepositions). They come AFTER the noun phrase + case marker.
Many postpositions follow the genitive `-ni`. Example: `mik-kang-o` = "in front of"

### 4.3 Adjectives
Garo has few true adjectives. Instead, **verb + nominalizing suffix** acts as adjective.
Example: `nama` (good) functions as both verb and adjective.

### 4.4 Adverbs
Many adverbs formed by **reduplication** of verb-derived forms.

### 4.5 Sentence Examples (from Burling)
```
ang-ni pi'-sa   nok-o    cha'-ja-ing-a
my     child    at-house eat-NEG-PROG-PRES
"My child is not eating at home"
```

```
Ua   mi-ko    brea-na   re·anga
she  rice-ACC buy-INF   went
"She went to buy rice"  ✅ (matches our engine output)
```

---

## 5. WHAT OUR ENGINE IS MISSING (Action Items for Claude A)

### Priority 1 — Tense Detection + Suffix Application
Current state: past tense handled only via corrections/IRREGULAR_VERBS
What's needed: detect past tense verbs in English input → strip to root → apply `-aha`
```
"ate" → detect past → root "eat" → cha· → cha·aha
"went" → detect past → root "go" → re· → re·aha  (re·anga already in corrections ✅)
"bit" → detect past → root "bite" → chika → chikaha ✅
```

### Priority 2 — Negation as Infix
Current: corrections only (`nama-gija`, `Anga uija`)
What's needed: detect "not/don't/doesn't/didn't" → apply `-ja-` infix before tense suffix
```
"I eat" → Anga cha·a
"I do not eat" → Anga cha·ja·a  (NEG infix between root and tense)
```

### Priority 3 — Case Markers Beyond `-ko`
Currently missing:
- `-ni` genitive: "my dog" = `ang-ni achak`, "his house" = `ua-ni nok`
- `-o` locative: "at home" = `nok-o`, "in the market" = `bajal-o`
- `-na` dative: "to me" = `ang-na`, "for you" = `nang-na`

### Priority 4 — Plural
Add `-rang` suffix recognition:
`"dogs"` → `achak-rang`, `"people"` → `mande-rang`

### Priority 5 — Subordinate Clause Handling
"She went to buy rice" = `Ua mi-ko brea-na re·anga`
The "buy" clause is subordinate with `-na` (infinitive/purpose marker) — our engine handles this via `-na` already ✅ but needs generalization.

### Priority 6 — Apostrophe Normalization
`lets` and `let's` should resolve identically — strip apostrophes at input normalization step before any lookup.

---

## 6. KEY SOURCES
1. **Burling, R. (2003)** — *The Language of the Modhupur Mandi (Garo), Vol. 1* — University of Michigan. Full text: https://quod.lib.umich.edu/s/spobooks/bbv9808.0001.001
2. **Phillips, E.G. (1904)** — *Outline Grammar of the Garo Language* — Public domain. Available on Amazon/archive.org
3. **Sangma, S.K. (1991)** — *Achik Grammar* — UNT Digital Library: https://digital.library.unt.edu/ark:/67531/metadc2124470/
4. **Wiktionary** — Appendix: Garo Verbs: https://en.wiktionary.org/wiki/Appendix:Garo_verbs
5. **languagesgulper.com** — Garo overview: http://www.languagesgulper.com/eng/Garo.html

---

_Claude B — Platform Side_
