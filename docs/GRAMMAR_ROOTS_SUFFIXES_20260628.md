# GRAMMAR — Roots, Suffixes, and Morphology

Source: Thangseng (native speaker), 2026-06-28
Status: CONFIRMED

---

## Verb roots (oversimplified for machine processing)

| Root | Meaning | Note |
|---|---|---|
| `cha·` | eat | Raka is IN the root — carries through all forms |
| `kat` | run / go | No raka in root |
| `nam` | good | Adjective root |

### Suffix pattern on `cha·` root

| Form | Breakdown | Meaning |
|---|---|---|
| `cha·a` | cha· + a | eat (present/root form) |
| `cha·ja` | cha· + ja | not eat (negation, predicative) |
| `cha·gen` | cha· + gen | will eat (future) |
| `cha·aha` | cha· + aha | ate (past) |
| `cha·bo` | cha· + bo | eat! (imperative) |
| `cha·na` | cha· + na | let's eat / to eat (future) |
| `cha·naha` | cha· + naha | let's eat (imminent) |
| `cha·enga` | cha· + enga | eating (progressive) |
| `cha·jok` | cha· + jok | has eaten (perfect) |

### Suffix pattern on `kat` root (no raka)

| Form | Breakdown | Meaning |
|---|---|---|
| `kata` | kat + a | run (present) |
| `katgen` | kat + gen | will run (future) |
| `kataha` | kat + aha | ran (past) |

### `nam` root

| Form | Breakdown | Meaning |
|---|---|---|
| `Nama` | nam + a | good |
| `namja` | nam + ja | bad / not good (predicative, after noun) |
| `namgija` | nam + gija | not good (attributive, before or after noun) |

---

## Noun derived from verb root

`cha·` (eat root) + `u` → `cha·u` = thief
Demonstrates that verb roots can yield nouns with different suffixes.

---

## Suffix `chi` — locative, agentive, and subjunctive functions

### 1. Locative (with nouns) — "to [place/person]"

| Example | Breakdown | Meaning |
|---|---|---|
| `angchi` | ang + chi | to me |
| `dokanchi` | dokan + chi | to the shop |

Sentences:
- `Angchi re·babo` = Come to me
- `Dokanchi re·angbo` = Go to the shop

### 2. Agentive (with nouns) — "with [instrument]"

| Example | Breakdown | Meaning |
|---|---|---|
| `attechi` | atte + chi | with a dao (knife) |
| `garichi` | gari + chi | with a car |

Sentences:
- `Attechi den·a` = Cut with a dao
- `Garichi salgaka` = Hit/run over with a car

### 3. Subjunctive (with verbs) — "let [subject] do"

`chi` is placed **between root and suffix** when used with verbs:

| Example | Breakdown | Meaning |
|---|---|---|
| `cha·china` | cha· + chi + na | let (someone) eat |

Sentence:
- `Ua cha·china` = Let him/her eat

**Key distinction:** `chi` position determines function:
- After noun → locative or agentive
- Between verb root and suffix → subjunctive ("let")

---

## Suffix `ja` vs `gija` — negation placement rule

Both mean "not good / bad" but placement differs:

| Form | Can precede noun? | Can follow noun? |
|---|---|---|
| `namgija` | ✅ `namgija mande` (bad person) | ✅ `mande namgija` |
| `namja` | ❌ `namja mande` = WRONG | ✅ `mande namja` only |

**Rule:**
- `gija` = attributive negation — flexible, works before OR after noun
- `ja` = predicative negation — ONLY after noun, never before

**Examples:**
- `mande namgija` ✅ = bad person (adjective before noun)
- `namgija mande` ✅ = bad person (adjective after noun)
- `mande namja` ✅ = the person is bad (predicative)
- `namja mande` ❌ = WRONG

---

## Key raka principle (reconfirmed)

> "The raka is almost always part of the root or the stem. The suffixes don't have raka."

Suffixes (`-a`, `-ja`, `-gen`, `-aha`, `-bo`, `-na`, `-enga`, `-jok`, `-chi`) never carry raka.
Raka belongs to the root only. If root has raka, all forms inherit it. If not, none do.

---

## Engine notes for Claude A

1. **Future tense `-gen`** — not yet in engine. Add alongside existing tense suffixes.
2. **Subjunctive `chi`** — `Ua cha·china` pattern not yet handled. Needs new assembly rule.
3. **`ja` vs `gija` placement** — engine must enforce: `ja` only post-noun, `gija` either position.
4. **Locative/agentive `chi`** — `angchi`, `dokanchi` patterns not yet in engine.
5. **`cha·u` = thief** — add to corrections.json separately.
