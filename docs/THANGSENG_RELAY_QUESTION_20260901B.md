# Thangseng Relay — Combined Batch (drafted 2026-09-02, updated 2026-09-02 after partial answers received)

**Status:** PARTIALLY ANSWERED. Item 2 (classifier, old numbering) and
part of item 1 (`ama`'s meaning, old numbering) were answered via
Project Owner relay on 2026-09-02 — see NV-105 and NV-106 in
`docs/THANGSENG_NATIVE_VALIDATION.md`. **5 items remain open and ready
to send** (renumbered below, 1-5). Item 1 has been narrowed to only the
part that's still unanswered.

---

## SEND THIS SECTION TO THANGSENG — nothing else in this file

Five separate questions. Please answer in any order, and a short worked
example sentence for each helps a lot.

**1. "Can" — where does it go in a sentence?**
We know `ama` means "can." In a sentence like "I can speak Garo," where
exactly does "can" go — right before the main verb, right after it, or
somewhere else? Does it change the ending on the main verb, or stay
separate?

**2. Two describing words on one noun — which order?**
If something has two describing words at once — like "a big red
house" — which order do they go in? Does it matter?

**3. Saying "in order to" or "to" before a verb**
When you want to say "in order to [do something]" or "to [do
something]" as a purpose — like "I go to eat" or "she came to help" —
is there one word/ending that always marks this? What is it?

**4. Question words and question endings together**
For a question that already has a question-word like "why" or "what"
in it, does the sentence still need a question ending, or does the
question-word alone make it a question? A worked example would help.

**5. Do these two sentences sound right?**
1. "Anga chattro·ko mangmang" — meant to say "I am the only student."
2. "Angade te·ga·chu Bitekosan Cha·aia" — meant to say "the only fruit I
   eat is mango."
If either sounds wrong, could you say it the correct way?

---

## Internal notes (NOT for relay — project record only, below this line)

**Source:** `docs/COMPLEX_SENTENCE_GRAMMAR_MATRIX_20260901.md`
"Unresolved Linguistic Boundaries" section, the pre-existing
`ama`/`man·a` queue item (2026-08-31C), and 1 item from Claude B's
2026-09-02 investigation-only findings
(`docs/CLAUDE_B_SESSION_MIGRATION_20260902.md`, Finding 2).

### CLOSED since drafting — do not re-send

- **Original item 2 (animate/human counting classifier):** Thangseng
  confirmed `Sak` = human/people. Reconfirms the already-VERIFIED
  RULE-038 classifier for people — no new dictionary entry needed. See
  NV-105.
- **Original item 1, meaning half (`ama` = "can eat" vs. `ama` = "can"):**
  Thangseng clarified `ama`'s own lexical meaning is the bare modal
  "can" — the main verb (`cha·na`/`re·angna`/`kam ka·na`) is a separate
  word, not fused into `ama`. Does not resolve the `man·a`/`ama`
  relationship or word order — see NV-106. The word-order half is what
  survives as the new item 1 above.

An earlier round of this conversation flagged items 2-6 as possibly
already answered, then corrected to say that was mostly an input
mistake. Going only by the actual answer content received (`ama` +
`Sak`, above) — nothing else is being treated as answered without its
real content in hand. Items 2, 3, 4 (old 5), and 5 (old 6) below remain
genuinely open.

### Renumbering map (old grammar-matrix numbering → current)

- Old 1 (`ama`/`man·a`, word order half only) → new 1
- Old 2 (people classifier) → CLOSED, NV-105
- Old 3 (adjective order) → new 2
- Old 4 (purpose `-na`) → new 3
- Old 5 (`-ma` + wh-words) → new 4
- Old 6 ("only"-construction sign-off) → new 5

### Why we're asking (remaining 5 items)

None of the 5 remaining items has native confirmation yet, and none
should be resolved by pattern-matching or engineering inference — the
project's standing evidence-first rule. Item 5 gates a specific
engineering decision: Claude B will not touch
`tryOnlyIdentityConstruction` (the "only X" sentence composer) until
this is answered. Item 1 gates the "modal drop" engineering handoff's
word-order decision — the underlying bug (the word disappearing
entirely) doesn't wait on this, only the *correct* fix does.

**Does not block other work:** none of these are prerequisites for
already-shipped, already-confirmed material.
