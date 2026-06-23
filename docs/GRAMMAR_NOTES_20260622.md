# Grammar Notes — Native Speaker Input (2026-06-22)
_Do not edit corrections.json based on this doc until Claude A is done with the file._

---

## 1. "let's go to market" correction

`"let's go to market"` = `"Hai Bajal Anti Re·na"` — **CORRECT, do not change.**

The Rule 2 script (`docs/fix_lets_rule2.cjs`) wrongly changed this to
`"Hai bajal re·naha"`. Claude A is reverting this. The original
`"Hai Bajal Anti Re·na"` was correct all along.

---

## 2. New sentence examples (native verified)

```
Na·a na·rang cha·ama?   = Did you eat orange?
Na·a apple cha·ama?     = Did you eat apple?
Ua cha·jaha             = He didn't eat (informal: Bia cha·jaha)
```

Note on `cha·jaha`: `-ja` here is the **negative marker** (different from
`-gija`). See Grammar Rule below.

---

## 3. GRAMMAR RULE — `-ja` vs `-gija` (negation)

These are two distinct negation patterns, not interchangeable:

**`-ja`** = predicative negation (verb/predicate negated directly)
- `Ua cha·jaha` = He didn't eat (`-ja` inserted into verb, before `-aha` past)
- `Ua namja` = He is bad/not good (`namja` = predicate adjective, negated)

**`-gija`** = attributive/adjectival negation (used when modifying a noun)
- `nama·gija` in `"this is not good"` uses `-gija`
- But strictly: `namgija` before a noun takes `-gipa` suffix → `namgijagipa`

---

## 4. GRAMMAR RULE — Predicate adjective vs Attributive adjective (`-gipa` suffix)

**Key distinction:** Where the adjective appears in the sentence determines its form.

### Predicative use (adjective AS the predicate, no object noun follows)
Adjective used WITHOUT `-gipa`:
```
Ua namja          = He is bad/not good      (namja = predicate)
Gari sila         = The car is beautiful    (sila = predicate)
```

### Attributive use (adjective BEFORE a noun)
Adjective used WITH `-gipa` suffix:
```
Namgijagipa bi'sa = Bad boy (namgijagipa modifies bi'sa)
Ua namgijagipa bi'sa ong'a = He is a bad boy
Silgipa gari      = The beautiful car (silgipa modifies gari)
```

**The rule in full:**
- Adjective ALONE as predicate → no `-gipa`
- Adjective BEFORE a noun → add `-gipa`
- Word order: adjective comes AFTER the noun in predicative use (`gari sila`)
  but BEFORE the noun in attributive use (`silgipa gari`)
- Note: the suffix `-gipa` rule is not always strict — without a suffix on
  the following noun, the adjective may appear without `-gipa`. This is
  uncommon syntax but not incorrect.

### Examples summary
| English | Garo | Pattern |
|---|---|---|
| He is bad | Ua namja | Predicative — no -gipa |
| The bad boy | Namgijagipa bi'sa | Attributive — -gipa added |
| He is a bad boy | Ua namgijagipa bi'sa ong'a | Attributive in predicate |
| The car is beautiful | Gari sila | Predicative — no -gipa |
| The beautiful car | Silgipa gari | Attributive — -gipa added |

---

## 5. Implications for the engine (Claude A — when ready)

The `-ja` negation path needs to be handled separately from `-gija`:
- Verb negation past tense: verb root + `·ja` + `ha` (e.g. `cha·jaha`)
- Adjective predicate negation: adjective + `ja` (e.g. `namja`)
- Adjective attributive negation: adjective + `gija` + `gipa` + noun

The `-gipa` attributive suffix is a new morphological rule not yet
implemented anywhere in the engine. This is Phase 2 grammar work.

_Claude B — Platform Side — for handoff when corrections.json is free_
