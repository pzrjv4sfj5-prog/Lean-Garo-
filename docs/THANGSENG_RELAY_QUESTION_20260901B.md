# Thangseng Relay — Combined Batch (drafted 2026-09-02, simplified 2026-09-02, 4 of 6 items answered 2026-09-02)

**Status:** PARTIALLY ANSWERED. Items 1-4 (old numbering) answered via
Project Owner/Tridip relay — see NV-108, NV-109, NV-110, NV-111. Old
item 6 (only-X sign-off) answered 2026-09-02 — see NV-112. **2 items
remain open and ready to send** (1 carried forward, 1 new follow-up
from the NV-112 answer).

---

## SEND THIS SECTION TO THANGSENG — nothing else in this file

**1. Questions with a question word**
- When you make a question using a question word such as "who,"
  "what," "where," or "which," is a question ending also used?
- Please give a natural example.
- Are there situations where you would not use a question ending with
  a question word?

**2. Two "only" sentences built differently — is that expected?**
We now have two Garo sentences using "only" that turned out to be built
in different ways, and we'd like to check if that's expected or if we're
missing something:
1. "the only language I speak is english" → "Angade English
   ba·sakosan aganaia" (ends with the verb "aganaia")
2. "the only fruit I eat is mango" → "Angni cha·gipa bitede
   te·gatchusan" (no separate verb at the end, uses "cha·gipa" instead)
- Is the difference just because the verbs are different ("speak" vs
  "eat"), or are there other reasons a sentence like #1's pattern might
  become sentence #2's pattern (or vice versa)?
- If you took sentence #1's pattern and used it for something like "the
  only fruit I eat is mango," would that also sound acceptable, or
  clearly wrong?

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
