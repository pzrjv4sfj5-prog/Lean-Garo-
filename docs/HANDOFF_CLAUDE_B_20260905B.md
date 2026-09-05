# Claude C → Claude B Handoff (detailed)
**Date:** 2026-09-05B | **From:** live `translate()` probing following the 2026-09-05 full audit
**Companion:** `docs/HANDOFF_CLAUDE_A_20260905B.md` (linguistics side of the same findings)
**Method:** ran `translate()` directly against 10 productive (non-corpus) sentences to observe real fallback/UNKNOWN/assembly behavior, then traced root causes. All repros below are live, reproducible against current HEAD.

---

## Item 1 — 34 live `compiled_dict.json` keys ship an unsplit `"X / Y"` string as a literal Garo translation (HIGH — this is actively corrupting output today)

**Repro:**
```js
import { translate } from './src/translationEngine.js';
await translate("my old friend cannot swim in the cold river")
// → "Angni git·cham Ripsak / Ripeng [UNKNOWN] Jroa [UNKNOWN] [UNKNOWN] Sin·a chi·bi·ma"
//                    ^^^^^^^^^^^^^^^ this is a raw dictionary citation, not Garo
```

**Root cause:** `master_dictionary.json` has rows where a citation note like "Ripeng, with ba·ju and bi·sa as attested alternates" got imported with the alternates concatenated into the `garo` field itself, separator and all, rather than being split into separate variant rows:
```json
{"english":"Friend","garo":"Ripsak / Ripeng","confidence":"verified_high","notes":"VERIFIED/HIGH v:Ripeng / ba-ju / bi-sa"}
```
This row wins `pickPrimary` (it's `verified_high`) and the literal string `"Ripsak / Ripeng"` — slash and all — ships as the compiled value for `"friend"`. `repository-intelligence.js` has no check for this pattern (Checks A–G don't look for un-split delimiter characters inside a `garo` value), so it's been shipping invisibly.

**Full list of affected `compiled_dict.json` keys (34, confirmed by scanning for ` / ` inside compiled values):**
```
younger sibling, uncle, friend, zero / none, hello / greetings, throw, hospital,
nail (metal), bridge, spirit / soul, you (object), our / ours, hello, goodbye,
wait a moment, roam / wander, hey! (calling someone), whatever / i don't care,
cool / awesome, walk (command), which, how many / how much, tense / form, hindi,
the father, the mother, the younger sibling, the uncle, the zero / none,
the hello / greetings, the throw, what's the time, what's the time?,
land left to become fallow
```

**Ask:**
1. Write a one-time repair script (or extend `resync-stale-overrides.mjs`/a new script) that scans `master_dictionary.json` for `garo` values matching ` / ` or ` ba \/ `-shaped patterns, splits them into proper separate variant rows (same `english` key, each half as its own row, `notes` citing the original merged note), and re-runs `pickPrimary` naturally from there.
2. **Hold off on `"you (object)"` and `"our / ours"` specifically** — Claude A flagged (companion doc, item 3) that these two look like grammatically-conditioned allomorph pairs, not free variants, and a blind split risks `pickPrimary` picking the wrong one for a given construction. Do the other 32 first; wait for Claude A's read on those two.
3. Add a permanent check to `repository-intelligence.js` (a new Check, or extend an existing one) that flags any `garo` value containing an unescaped `/` as a report-only candidate — the same treatment Check A already gives raka-locality candidates. This is exactly the kind of thing that should never ship invisibly again.

## Item 2 — No postposition/case-marking layer for English prepositions; they surface as literal `[UNKNOWN]` (MEDIUM-HIGH — drives most of the UNKNOWN count on anything past a simple clause)

**Repro:**
```
"why did the small dog run away from the big house"
→ "Maina [UNKNOWN] [UNKNOWN] Chon·a Achak Kata [UNKNOWN] ·oni [UNKNOWN] dal·a Nok"
```
Four `[UNKNOWN]` tokens in a 9-content-word sentence. Tracing each: `did` (auxiliary, redundant with the verb's own tense suffix — not a real gap, see below), `away` and `from` (English prepositions with no direct Garo dictionary entry — because Garo expresses this relationship as a case suffix on the noun, e.g. `-ni` "from," `-chi` "to," `-o` "at/in," not a standalone word), and one more unresolved slot I didn't fully trace.

**Root cause (my read, engineering side):** the lookup/grammar layer treats English prepositions as words to look up in the dictionary, the same as nouns and verbs. When one isn't found (because it structurally shouldn't be — it's supposed to become a suffix on the adjacent noun, not its own token), it falls through to `[UNKNOWN]` instead of being recognized as "this needs to attach as a case suffix" and routed to `morphologyEngine.js`/`garo_classifier.js`'s suffix-attachment logic.

**Ask:** this is real grammar-engine work, not a quick fix — I'd frame it as: build (or extend, if something like this partially exists — I didn't find one) a preposition→postposition-suffix mapping table (`in/at`→`-o`, `to`→`-chi`, `from`→`-ni`, etc.), and have the SOV/grammar-assembly path check this table *before* falling through to dictionary lookup-and-fail for anything tagged as a preposition in the input parse. I'm flagging the shape of the problem and a repro set, not prescribing the implementation — you know the composer internals better than I do from a read-only pass.

## Item 3 — Auxiliary "did" in past-tense questions is treated as an unresolved word instead of a redundant tense marker (LOW-MEDIUM, likely small fix, bundled with item 2 since it's the same `[UNKNOWN]`-surfacing symptom)

Same repro as above — "did" surfaces as `[UNKNOWN]` rather than being recognized as English's periphrastic past-tense question marker (which Garo expresses via the verb's own suffix, no separate word needed). This is probably a short-list special-case fix (recognize `did`/`does`/`do` in aux position and drop them from the token stream before lookup, same as how `am`/`is`/`are` presumably already get absorbed into progressive-suffix logic elsewhere in the pipeline) rather than the bigger table-driven fix item 2 needs.

## Item 4 — No recursion for embedded/relative clauses (MEDIUM, architectural — flagging the shape, not asking for an immediate fix)

**Repro:**
```
"the teacher who lives near the school is very kind"
→ "Skigipa Sawa donga Sepang namen ro·kom Skul"
   (teacher / who / exists / near / very / kind-manner / school — flat, no clause boundary,
    "very kind" and "school" disconnected from the relative clause they belong to)
```
```
"the tall student is reading a red book near the river"
→ "Chu·a Chattro Gitchak Ki·tap Sepang chi·bi·ma Poraienga"
   (no accusative marking on the object "book," no locative marking on "near the river" —
   reads as a flat token list in roughly SOV order, not a grammatically marked sentence)
```

**Root cause (architectural, not a bug per se):** `sov-assembly` and the grammar engine appear built around single flat clauses with a fixed slot structure (subject / object / verb, maybe with simple modifiers). There's no mechanism I found to subordinate one clause inside another (relative clauses, complement clauses) or to attach case markers to multi-word noun phrases rather than single tokens.

**Ask:** I'm not asking for a fix here — this looks like a genuine architecture decision (how much of Garo's clause-embedding grammar do you want to model, and how), not something to patch in a session. I'd suggest a short design doc before anyone starts coding: what's the minimum embedded-clause support that would cover the productive sentences users are likely to throw at this (relative clauses on subject/object, maybe one level of complement clause for "want to X"/"try to X"), and whether the existing SOV assembler can be extended incrementally or needs a rewrite of the clause-slot model. Happy to help characterize more failure cases if that's useful input to that design conversation.

## Item 5 — see companion doc, Claude A item 2: `man·a` lexical-collision causing silent constituent-drop

Claude A's handoff traces the linguistic side (whether `able`/`finish`/`get`/`find`/`earn` genuinely share one root). On your side, independent of what Claude A concludes: **the composer's behavior of silently dropping an entire verb+object constituent when two resolved tokens are lexically identical is worth hardening regardless of the linguistic answer.** Repro:
```
"she will not be able to finish the difficult work tomorrow"
→ "Ua man·a·chi knal·ko man·jawa"   (confidence 0.82 — "finish the difficult work" is just gone)
```
Even in a world where `able` and `finish` are legitimately the same Garo root, a well-formed sentence needs both slots filled (something like "capacity-marker ... work-object finish-verb"), not one collapsed away. This feels like a dedup or single-slot assumption somewhere in the assembly logic that should be checked regardless of the vocabulary question — and it's a **false-confidence** case (0.82 confidence on a sentence missing half its content), which is the exact failure mode flagged as the top systemic risk in the 2026-09-05 audit.

---

## Suggested order
1. Item 1 (slash-leak) — mechanical, isolated, safe to do first and independently of everything else.
2. Item 5 (silent-drop hardening) — worth investigating even before Claude A answers on `man·a`, since the collapsing behavior itself is checkable in isolation (does the composer drop *any* duplicate-string constituent pair, or is it specific to this case?).
3. Items 2/3 (postposition layer + "did") — real feature work, bundle together since they share the same `[UNKNOWN]`-surfacing code path.
4. Item 4 (clause embedding) — design first, implement later.
