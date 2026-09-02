# Thangseng Relay — Combined Batch (drafted 2026-09-02, simplified 2026-09-02, 4 of 6 items answered 2026-09-02)

**Status:** PARTIALLY ANSWERED. Items 1-4 answered via Project
Owner/Tridip relay — see NV-108, NV-109, NV-110, NV-111. **2 items
remain open and ready to send.**

---

## SEND THIS SECTION TO THANGSENG — nothing else in this file

**1. Questions with a question word**
- When you make a question using a question word such as "who,"
  "what," "where," or "which," is a question ending also used?
- Please give a natural example.
- Are there situations where you would not use a question ending with
  a question word?

**2. Do these two sentences sound right?**
1. "Anga chattro·ko mangmang" — meant to say "I am the only student."
2. "Angade te·ga·chu Bitekosan Cha·aia" — meant to say "the only fruit
   I eat is mango."
If either sounds wrong, could you say it the correct way?

There was some confusion about this question last time — happy to
rephrase or explain differently if it helps. We're just checking
whether these two Garo sentences sound natural for those two English
meanings.

---

## Internal notes (NOT for relay — project record only, below this line)

**Source:** `docs/COMPLEX_SENTENCE_GRAMMAR_MATRIX_20260901.md`
"Unresolved Linguistic Boundaries" section, the pre-existing
`ama`/`man·a` queue item, and 1 item from Claude B's 2026-09-02
investigation-only findings (`docs/CLAUDE_B_SESSION_MIGRATION_20260902.md`,
Finding 2).

### CLOSED 2026-09-02 — do not re-send

- **Old item 1 (ability/"can" word order):** "I can speak Garo" =
  `Anga Garo aganna man·a` — modal placed after the infinitive-marked
  verb, sentence-final. See NV-108.
- **Old item 2 (counting-people classifier, worked example):** `sak·sa`
  (one)/`sak·gni` (two)/`sak·gittam` (three) given as bare
  classifier+number forms. See NV-109 — also flags an unresolved
  tension with RULE-038's "noun always stated" claim, and notes a
  dictionary-shipping attempt that was reverted after breaking a
  regression test (not shipped, evidence-only).
- **Old item 3 (adjective order):** three valid natural renderings of
  "big red house" given, order is flexible, stress differs between
  them. See NV-110.
- **Old item 4 (purpose `-na`):** "I went to eat"/"I went to work"
  confirm `-na` as the purpose/infinitive marker before a motion verb.
  See NV-111.

### Still open

- **Item 1 (was old item 5):** question-word + question-ending
  co-occurrence — no evidence yet.
- ~~**Item 2 (was old item 6):** sign-off on the two "only X" sentences~~
  **CLOSED 2026-09-02.** Answer received: "I am the only student." =
  "Angan saksa kamkam chatro." (stress-dependent, alternate framings
  exist, "mangmang" also valid for "only" here). "The only fruit I eat
  is mango." = "Angni cha·gipa bitede te·gatchusan." Implemented as
  NV-112 — see `docs/CLAUDE_B_SESSION_MIGRATION_20260902F.md`. Note:
  the second sentence's answer directly contradicts NV-103's general
  "the only X SUBJ VERB is Y" pattern (single-attestation origin) for
  this specific case; shipped as an exact-match override, not a change
  to NV-103's own attestation. Open follow-up (not yet asked): why do
  "speak"-type and "eat"-type only-constructions differ structurally?

### Why we're asking

Neither remaining item should be resolved by pattern-matching or
engineering inference — the project's standing evidence-first rule.
**Does not block other work:** neither is a prerequisite for
already-shipped, already-confirmed material.
