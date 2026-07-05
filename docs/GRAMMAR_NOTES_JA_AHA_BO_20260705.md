# Garo Grammar Notes (Native Speaker Reference)

**Source:** Conversation with Thangseng (Native Speaker)
**Date:** 5 July 2026

> **Status:** These clarifications supersede earlier assumptions where they conflict. See docs/THANGSENG_RULES_LOOKUP.md Rules 27-29.

## 1. No true simple past suffix
> "I don't think that we have something that may be called a true simple past suffix. As far as I can tell, 'ja' is also used to talk about past events." — Thangseng

Example: `Na·a mijalo anti re·angama?` = Did you go to the market yesterday?
Natural reply: `Re·angja.` = Did not go.

`-ja` is primarily a negative marker and naturally covers past-referring negatives too — no separate past-negative suffix should be assumed. Do not force every English past tense onto its own dedicated Garo suffix.

## 2. -aha / -manaha overlap
> "'aha' and 'manaha' do overlap in meaning as far as spoken Garo is concerned." — Thangseng
> "How it is used in literature cannot be verified due to lack of source." — Thangseng

Both forms are valid in spoken Garo where they might otherwise seem to compete; do not enforce a rigid distinction. Literary usage remains unverified.

## 3. -bo is imperative AND hortative
Primary: imperative (command). Also: hortative ("let us...").
Preferred: `Hai cha·na` = Let us eat.
Acceptable alternative: `Hai cha·bo` = Let us eat.

## Action items status (2026-07-05, this pass)
1. ✅ Reviewed — engine does NOT assume a dedicated simple-past suffix. The
   tense-detection `past` case never modifies `garoWithTense` in
   translationEngine.js (only future/discontinued/completed/chim/pastcont
   do) — negation already falls through to plain `-ja` regardless of
   detected past-tense evidence, matching `Re·angja` exactly. No code
   change needed; this was accidentally already correct.
2. ✅ Confirmed — `-ja` already used for both present and past negation
   uniformly (single code path, see #1).
3. ✅ Documented — Rule 28 in THANGSENG_RULES_LOOKUP.md notes the overlap;
   no code currently forces a rigid split between -aha/-manaha (they're
   independent, non-conflicting suffix options), so no code change needed,
   just don't add logic that treats them as mutually exclusive later.
4. ✅ Added — `Hai cha·bo` accepted as an alternate hortative correction
   alongside `Hai cha·na`.
5. Found via this review: `go` root had a raka inconsistency (`Re·ang·a`
   in 3 dictionary source files) that directly contradicted this session's
   own confirmed example (`Re·angja`, no second raka). Fixed at source —
   see Rule 27 note in THANGSENG_RULES_LOOKUP.md.
