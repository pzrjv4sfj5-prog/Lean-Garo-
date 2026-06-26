# GRAMMAR FLAGS — For Claude A Review
_Flagged by Claude B — 2026-06-25_
_Claude A is actively working on engine improvements — check these before next push_

---

## FLAG 1 — `let's` construction inconsistency (TWO different patterns in data)

Existing Rule 2 entries use `Hai + verb + ha`:
```
let's eat   -> Hai cha·ha
let's go    -> Hai re·naha
let's drink -> Hai ringaha
let's sit   -> Hai asongha
let's play  -> Hai kalaha
let's work  -> Hai dakha
```

But the new batch uses bare `-na` form (no `Hai`, no `-ha`):
```
let's dance -> chrokna
let's sing  -> ring·na
let's swim  -> jrona
```

**Question for native speaker / Claude A:** Are these two genuinely different
constructions, or should `let's dance/sing/swim` also follow `Hai + verb + ha`?
e.g. should it be `Hai chrokha` / `Hai ring·ha` / `Hai jroha`?
Do NOT fix blind — needs native speaker confirmation.

---

## FLAG 2 — `Na·ara` vs `Na·a` subject pronoun (interrogative form)

All question sentences in the new batch use `Na·ara` (not `Na·a`):
```
who are you        -> Na·ara sawa?
why are you lying  -> Na·ara maini gimin tol·enga?
are you sick       -> Na·ara saengama?
what job do you do -> Na·ara mai kamko ka·a?
```

But SOV question sentences use `Na·a`:
```
did you eat food   -> Na·a Mi Cha·aha ma?
are you sleeping   -> Na·a Tusienga ma?
are you going      -> Na·a Re·angenga ma?
```

**Pattern hypothesis:** `Na·ara` = "you" in open questions (wh-questions: who/why/what/when),
`Na·a` = "you" in yes/no questions (confirmed with `-ma` question particle).
Needs native speaker confirmation before the engine handles this distinction.

If confirmed, the pronoun map in `translationEngine.js` needs a new slot:
- `Na·a` = 2nd person, yes/no question or statement
- `Na·ara` = 2nd person, wh-question (interrogative with question word)

---

## FLAG 3 — `saw` = `Nikaha` (past of see) conflicts with `see` = `Nika`

```
see -> Nika     (present/root — native verified)
saw -> Nikaha   (past — from new batch)
```

`Nikaha` = `Nika` + `-ha` (past suffix). This is CONSISTENT with the
`-aha`/`-ha` past pattern (`cha·a` → `cha·aha`, `re·a` → `re·aha`).
But note: the current engine builds past tense algorithmically from the root.
Check whether `lookupGaro('saw')` would return `Nikaha` from compiled_dict
and conflict with the algorithmic path.

No fix needed — just confirm the engine handles this correctly.

---

## NEW ENTRY ADDED (native verified, 2026-06-25)

```
i sing a song        -> Anga git ring·a
i am singing a song  -> Anga git ring·enga
```

`git` = song (confirmed), `ring·a` = sing (verb root, same as `drink`/`Ringa`
— different word, same phonetic form). The engine should NOT confuse these
since `ring·a` as verb (sing) vs `Ringa` as verb (drink) are context-dependent.
Flag for Claude A: check if `lookupGaro('ring')` returns drink or sing — if
both share the same root there may be a collision.

---
_Claude B — no changes made to engine files — flagging only_
_Repo HEAD: 099babb → corrections still being updated_
