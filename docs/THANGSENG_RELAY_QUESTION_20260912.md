# Thangseng Relay Question — 2026-09-12 (Claude A)

Re-sent 2026-09-12: the original 2026-09-11 batch (below) had 4 of its
11 items answered directly by Thangseng over WhatsApp on 2026-09-12
(early, empty, lie, plus egg which wasn't originally asked) — see
NV-156 in docs/THANGSENG_NATIVE_VALIDATION.md. Those are removed here.
Added 4 new items (9-12) found in this session's re-check of
docs/PICKPRIMARY_VERIFIED_TIES.md and docs/SUPERSEDED_ONLY_KEYS.md —
everything else on those reports was checked against session history
and found already resolved (see "Already resolved" list at the
bottom), so only genuinely open items are included. NOT YET SENT —
Project Owner/Tridip to relay.

---

## SEND THIS SECTION TO THANGSENG

For each pair/group below: are these different words for the same
thing (synonyms, either one is fine), or do they mean slightly
different things / get used in different situations? If they differ,
please give one short example sentence for each so the difference is
clear.

1. **Agree** (verb, "to agree with someone/something") — three words
   on record: *kin·a·chak·a*, *ku·chak·a*, *ku·ra·chak·a*.

2. **Brave** (adjective, "brave/courageous") — *pa·a* vs *sang·chak·a*.

3. **Greedy** (adjective, "greedy") — *mat·u·a*, *mik·bok·a*,
   *mik·ni·a*.

4. **Horn** (noun — an animal's horn, like a cow's horn) — *a·du·ri*
   vs *sing·ga*.

5. **Last** (adjective, "last" as in "the last one in a line/list" —
   not "last week") — *bon·kamgipa* vs *ja·mangipa*.

6. **Leg** (noun, the body part) — *ja·chok*, *ja·git·teng*,
   *ja·teng*. If these refer to different parts of the leg (e.g.
   whole leg vs. thigh vs. shin), please say which is which.

7. **Outside** (adverb/location, "outside") — *A·pal* vs *a'palo*.
   Are these just two spellings of the same word, or genuinely
   different words?

8. **Fever / suffer** — *jom·a* is confirmed as "fever" (a symptom).
   It's also showing up in our notes as a possible word for "suffer"
   (general pain/ache). Can *jom·a* mean both, the way "ache" can
   lead to "fever" in English, or is that a mistake and "suffer"
   needs a different word?

9. **Hoe** (noun, the farming tool) — *git·chi* vs *ko·dal*. Same
   tool, or two different kinds of hoe?

10. **Alone** (adjective/adverb, "alone/by oneself") — *ak·sa* vs
    *saksan*.

11. **Bake / roast** (verb) — we only have one old, unconfirmed word
    on record: *Ang·a*. Is this right for "to bake" or "to roast"
    (or both)? If it's wrong, what's the correct word?

12. Counting past 60: we've confirmed "forty-one" = *Chattro
    saksotbri sa*, "fifty-five" = *Chattro saksotbonga bonga*, and
    "sixty-seven" = *Chattro saksotdok sni* for counting people
    (using *sak*, fused with no space before the tens-word). We also
    have the base words for seventy/eighty/ninety (*Sotsni*/
    *Sotchet*/*Sotsku*), but no example of them actually used this
    way with *sak*. Does the same fused pattern keep working — e.g.
    would seventy-one be *Chattro saksotsni sa*? Or does something
    change once you're past sixty?

---

## Internal notes (do not send this part)

Source: docs/PICKPRIMARY_VERIFIED_TIES.md (auto-generated, current
as of 2026-09-12 rebuild) + fever/suffer flag (unchanged from
2026-09-11) + docs/SUPERSEDED_ONLY_KEYS.md (item 11, bake/roast) +
this session's sak 40+ classifier-engine gap (item 12, see
docs/CLAUDE_B_HANDOFF_20260911_number_classifier_runtime.md).

Items 1-10 are each a `pickPrimary` tie: 2-3 candidates that are all
independently `VERIFIED/HIGH`, with no signal in the data to prefer
one over another — the shipped value is currently whichever came
first in array order (last-write-wins), not a linguistic decision.
Nothing is broken at runtime; these are open disambiguation
questions, same shape as the `answer` (Aganchaka/Aganchakani) case
already tracked separately. Item 11 is different — no candidate ships
at all (superseded-only), needs a fresh confirmation, not a
disambiguation. Item 12 is a generalization question, not a tie.

Already resolved — checked against session history this pass, do NOT
re-ask: `early`/`empty`/`lie`/`egg` (NV-156, 2026-09-12, this is what
prompted re-sending this doc), `able`/`i can eat`/`i can go`/
`i can work` (ama vs man·a — closed by NV-117, confirmed freely
interchangeable), `big red house` (NV-110, 3 tied VERIFIED variants,
deliberately kept as flexible/stress-dependent), `how` (Maikai vs
maidake — reviewed 2026-09-11, judged a genuine semantic-scope
difference not a defect, maikai broader), `leaf` (Claude B/engine
territory, not a linguistic tie question), `where (relative pronoun)`
(jeon/jeo — already confirmed free variants, NV-054).
