# Claude C → Claude A Handoff
**Date:** 2026-09-06 | **From:** the two independent full-scale audits run 2026-09-05
(`CLAUDE_C_AUDIT_20260905.md` + `CLAUDE_C_AUDIT_20260905B_ADDENDUM.md`)
**Companion:** `HANDOFF_CLAUDE_B_20260906.md` (engineering side of the same findings)
**Note:** these two docs consolidate everything from both audits that needs
your linguistic judgment specifically — mechanical/code fixes are routed to
Claude B instead, even where they came from the same finding.

---

## Item 1 — `cat` root: `menggo` vs `meng·gong`, both verified_high, need adjudication
Two independent citation chains disagree on the presence of the raka mark:
- Bare word "cat" → `meng·gong` (verified_high)
- Counting-phrase family ("one cat"/"three cat" as literal keys) → `menggo`
  (no dot, verified_high, direct Thangseng citation)
Both are independently attested — this isn't a data-entry error I can
resolve, it needs your call: is `menggo` a valid short/counting-register
form of `meng·gong`, or is one of the two citations simply wrong? Whichever
way you answer, Claude B needs it to unify the two chains (they currently
never talk to each other — see companion doc item 3).

## Item 2 — new 4th surface form for "cat": `mang`, via `"where is the cat?"`
`"where is the cat?"` → `"kade mang?"`. `mang` is not a word — it's the bare
animal-classifier morpheme (from `CLASSIFIER_MAP`), leaking through a
different code path (`stopword-stripped`) that apparently isn't doing a real
dictionary lookup for "cat" at all. This is really an engineering bug (routed
to Claude B), but flagging to you too since it's now the fourth distinct
string that's surfaced for "cat" this year — worth knowing when you're
deciding item 1 above, in case it changes how you want the `cat` entry
structured going forward (e.g., whether "cat" needs to be locked down harder
against classifier-morpheme collision).

## Item 3 — `answer`: is `Aganchaka` (verb) vs. `Aganchakani` (noun) definitely two different POS, not one right one wrong?
Master notes (NV-077) already say this, but I want your explicit
reconfirmation before Claude B builds a POS-disambiguation fix around it:
`Aganchaka` = "to answer" (verb), `Aganchakani` = "an answer" (noun)? If so,
the fix is a schema question for Claude B (the compiler needs to track POS
so it stops treating these as competing values for one English key). If
they're actually the same word and one of the two forms is simply wrong,
that's a different, simpler fix — please confirm which situation this is.

## Item 4 — `leaf`/`leaves`: is there a distinct native form for the plural, and is `Re·ongkata` ("to leave," unverified) even correct?
Two separate things need your input here:
1. `leaf` (singular) = `bi·jak`, verified_high, solid — no issue.
2. Does Thangseng's evidence give a distinct plural form for "leaves" (the
   botanical sense), or does Garo pluralize `bi·jak` the same way as the
   other nouns you've already confirmed (no separate plural word)? Right
   now nothing in the dictionary answers this either way.
3. Separately: `"to leave"` (depart) → `Re·ongkata` is currently
   **unverified**. It's not directly related to the `leaf` question, but
   it's the collision partner in a bug Claude B is fixing (see companion
   doc item 2) — worth getting it to verified_high status while you're
   in the area, since it's ended up more load-bearing than a normal
   unverified entry (an engineering side-effect currently makes it
   collide with "leaves").

## Item 5 — vocabulary gaps surfaced incidentally: `ball`, `pole`, `babies`, `cities`
None of these have any `master_dictionary.json` entry at all (confirmed via
direct source trace, not just missing at runtime):
- `ball` (the object/toy) — currently has no entry, so it's silently
  fuzzy-matching to unrelated words at runtime (Claude B is tightening that
  fallback separately, but the real fix is just adding the word).
- `pole` (as in a rod/stick, classifier `jol`) — the classifier mapping
  exists but the noun itself has no translation, so it leaks the English
  word through untranslated.
- `babies` / `cities` — need to confirm whether these plural forms have
  ever been given to you by Thangseng, or whether (like `leaf`) they should
  just fall out of the normal singular + regular pluralization the compiler
  already handles for other nouns. If the latter, this becomes purely
  Claude B's fix (add the missing `-y→-ies` morphology rule); if there's a
  genuinely irregular native plural form, that needs to come from you first.

## Item 6 — spot-check requested, not urgent: adjective+animal placeholder rows
Claude B is mechanically fixing a bug where `"big cat"`/`"big dog"`/
`"big bird"`/`"big fish"` all ship an identical generic placeholder
(`"gonga mang"`) instead of composing correctly (the way `"big cow"` →
`ma·su dal·a` already does correctly). The fix is expected to just be
"delete the bad placeholder rows and let the existing working composition
path handle it," which needs no new linguistic input from you — but I'd
suggest a quick spot-check of the composed output after Claude B's fix
lands, just to confirm the pattern (adjective + animal-name, no extra
marking) is actually correct for cat/dog/bird/fish and not just assumed-
correct-by-analogy-with-cow.

## Nothing else linguistic this cycle
Everything else found in the two audits (question-marking generalization
failures, confidence-schema gaps, the elephant cross-layer variant
divergence, the `leave`/`leaves` collision mechanism itself) is routed to
Claude B — those are composition-engine, cascade-priority, and confidence-
computation issues, not evidence questions.
