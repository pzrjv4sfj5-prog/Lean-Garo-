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
RESOLVED: chrokna is correct. The -na suffix form is valid for let.s dance/sing/swim.
Hai + verb + ha (Rule 2) applies to eat/go/sleep/work/drink/sit/play.
The -na form applies to dance/sing/swim. Both are valid, different constructions.

---

## FLAG 2 — `Na·ara` vs `Na·a` subject pronoun — RESOLVED ✅

**Native speaker confirmed (Thangseng, 2026-06-25):**
> "Na•a(ra) maina re•bapila? Oh, ok... Both are used. ra- is an informal way of speaking or writing. Yes, both are technically correct. The difference is the context."

**Rule:** Both `Na·a` and `Na·ara` are correct for ALL question types (yes/no and wh-questions).
`-ra` marks **informal register only** — not a grammatical distinction.

- `Na·a` = formal / neutral "you"
- `Na·ara` = informal "you" (same meaning, relaxed register)

**Engine decision:** No change needed. Engine uses `Na·a` by default (formal/neutral).
Both forms are acceptable in any question. Do NOT implement a yes/no vs wh-question
split — the hypothesis was wrong. The distinction is purely formality.

**Prior hypothesis (incorrect):** Was thought to be yes/no vs wh-question split. Superseded.

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
