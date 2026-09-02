# Thangseng Relay — Combined Batch (drafted 2026-09-02, session resumed from CLAUDE_A_SESSION_MIGRATION_20260901C)

**Status:** DRAFTED, NOT YET SENT. Project Owner/Tridip to relay.
**Source:** `docs/COMPLEX_SENTENCE_GRAMMAR_MATRIX_20260901.md` "Unresolved
Linguistic Boundaries" section (items 1-5, wording copied verbatim from
there per that doc's own instruction), plus the pre-existing open item
in `.ai/WORKSTATE.yaml` → `claude_a.pending_thangseng_questions` (queued
2026-08-31C), plus 2 new items surfaced by Claude B's investigation-only
session on 2026-09-02 (`docs/CLAUDE_B_SESSION_MIGRATION_20260902.md`,
Finding 2) that need native sign-off before any engineering work.

This is one combined batch — **item 1 below merges two previously
separate queue entries (the original `ama`/`man·a` question and grammar-
matrix boundary #1); do not send them as two separate questions.**

---

## 1. "Can" — `ama` vs `man·a`, and where it goes in a sentence

We already have a full confirmed paradigm for `ama` = "can/be able to"
in simple present-habitual ability sentences (NV-008, closed):
"I can eat" = *Anga cha'na ama*, "I can go" = *Anga re'angna ama*, "I can
work" = *Anga kam ka'na ama*. That part is settled — not what we're
asking about.

Separately, a second word, `man·a`, is also recorded for "can" and shows
up productively in second-person and negated sentences from a later
batch (NV-103): "can you talk in Garo?" → ...*man·ama?*, "can you help
...?" → ...*man·genma?*, "I don't know Garo" → ...*man·ja.*, "I cannot
help you" → ...*man·jawa.* We have **not** confirmed whether this is the
same word as `ama` in a different context, a genuinely separate word, or
a person/register distinction — we are not guessing from the pattern.

**Question for Thangseng:**

> "Can" — is it `man·a` or `ama` (or are both valid, in different
> contexts)? And separately: in a sentence like "I can speak Garo",
> where exactly does the "can" word go — before the verb, after it, or
> does it take its own subject marking? A worked example sentence would
> help most.

---

## 2. Animate/human classifier for counting people

Our confirmed counting rule (RULE-038) is NOUN+CLASSIFIER+NUMBER-SUFFIX,
with classifiers split by category (animals/birds = `mang`, people =
`sak`, flat objects = `king`, money = `gong`, trees = `pang`). We have
not tested whether counting people specifically (e.g. "two friends")
follows this general pattern cleanly or has its own quirks.

**Question for Thangseng:**

> When counting people (e.g. "two friends", "three teachers"), is there
> a special counting word/classifier used instead of the general
> pattern, the way English says "two of them" vs "two pieces"? A worked
> example with a specific number + a person-noun would help most.

---

## 3. Multi-adjective stacking order

We have no confirmed rule for what happens when two adjectives describe
the same noun at once (e.g. "big red house").

**Question for Thangseng:**

> If a noun has two describing words at once (e.g. "big" and "red" for
> a house), which order do they go in — does it matter? A worked
> example with two adjectives on one noun would help most.

---

## 4. Purpose/infinitive `-na` clause — is there a citable rule?

We use `-na` productively as a purpose/infinitive marker in several
confirmed sentences, but this session's grammar-matrix work did not find
a clean, dedicated numbered rule confirming it (the catalogue was not
exhaustively re-searched — it may exist and just not be cited under an
obvious heading).

**Question for Thangseng:**

> When you want to say "in order to [verb]" or "to [verb]" as a purpose
> (e.g. "I go to eat," "she came to help"), is `-na` the ending that
> marks that, every time? A worked example or two would help us write
> this down as a confirmed rule.

---

## 5. Does `-ma` (yes/no question marker) ever co-occur with wh-words?

RULE-046 confirms `-ma` marks yes/no questions. We don't know whether it
also appears on questions that already have a question-word like "why"
(`Maina`) or "what," or whether those two markers are mutually
exclusive.

**Question for Thangseng:**

> For a question that already has a question-word like "why" or "what"
> in it, does the sentence still need the "-ma" ending, or does the
> question-word alone make it a question? A worked example would help
> most.

---

## 6. "I am the only student" / "the only fruit I eat is mango" — is this natural Garo?

New this session, from Claude B's engineering investigation (not yet
checked against any native source): the app currently produces two
outputs using our "only X" construction (`tryOnlyIdentityConstruction`,
already confirmed correct for a different sentence shape, "the only
language I speak is English"):

- "I am the only student" → *Anga chattro·ko mangmang* (this is a
  different sentence shape — "I am the only X," not "the only X I do Y
  is Z" — so it's not automatically covered by the prior confirmation)
- "the only fruit I eat is mango" → *Angade te·ga·chu Bitekosan
  Cha·aia*

We are not asking Thangseng to fix the engine — only to tell us whether
these two Garo sentences sound correct/natural for their English
meanings, or not.

**Question for Thangseng:**

> Do these two sentences sound right for their English meanings?
> 1. "Anga chattro·ko mangmang" — meant to say "I am the only student."
> 2. "Angade te·ga·chu Bitekosan Cha·aia" — meant to say "the only fruit
>    I eat is mango."
> If either sounds wrong, could you say it the correct way?

---

## Why we're asking (all 6 items)

None of these six items has native confirmation yet, and none should be
resolved by pattern-matching or engineering inference — that's the
project's standing evidence-first rule. Items 1-5 come directly from
testing productive grammar composition against our confirmed rule
catalogue this session; item 6 blocks a specific engineering decision
(Claude B will not touch `tryOnlyIdentityConstruction` until this is
answered).

**Does not block other work:** none of these are prerequisites for
already-shipped, already-confirmed material. Items 1 and 6 do gate two
specific pending engineering fixes (modal insertion word order; the
"only"-construction generalization) — those stay flagged/open until
answered, nothing is shipped as confirmed in the meantime.
