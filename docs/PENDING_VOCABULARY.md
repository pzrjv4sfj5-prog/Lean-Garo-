# Pending Vocabulary Queue
_Started: 2026-07-08 by Claude B, evidence-collection mode (Claude A unavailable)_
_Status: LIVING DOCUMENT — candidate entries only. Nothing here is in
`corrections.json` or `master_dictionary.json`. Do not implement until
Claude A reviews and a status below reads "Claude A approved."_

## Purpose
Every new word/morpheme encountered during the Native Sentence Validation
Audit (`docs/NATIVE_SENTENCE_VALIDATION_AUDIT.md`) is recorded here so
nothing is lost while Claude A is unavailable. This is a queue, not a
dictionary — entries move through states and are never silently merged
into production data from this file.

## State pipeline (never mixed)
```
Confirmed (native speaker verified meaning)
  ↓
Needs Claude A Review (linguistic classification / rule assignment)
  ↓
Needs Thangseng Validation (only if a genuine ambiguity remains)
```
A word can enter this pipeline already "Confirmed" if a native speaker
supplied it directly (as in Case 1) — it still needs Claude A review before
implementation, because review covers *how* to represent it (rule
classification, morphology interaction), not just *whether* the gloss is
correct.

---

## Candidate entries

### TV
- **Garo:** `TV`
- **English:** TV / television
- **Part of speech:** noun
- **Example sentence:** `TV ninan nangja palango tue status o nisona manaienga`
- **Source:** Native Sentence Validation Audit, Case 1 (Thangseng, 2026-07-08)
- **Confidence:** High — native-confirmed loanword, used verbatim in casual speech
- **Native validation status:** Confirmed
- **Notes:** Isolated engine test ("I watch TV" → `Anga ni·rik·a`) confirms
  `TV` is silently dropped even outside the compound Case 1 sentence — not
  an artifact of sentence complexity. Needs Claude A decision on whether
  this and similar English loanwords get a general pass-through mechanism
  or individual dictionary entries.

### status
- **Garo:** `status`
- **English:** status (as in social-media/WhatsApp status)
- **Part of speech:** noun
- **Example sentence:** `TV ninan nangja palango tue status o nisona manaienga`
- **Source:** Native Sentence Validation Audit, Case 1 (Thangseng, 2026-07-08)
- **Confidence:** High — native-confirmed loanword, used verbatim
- **Native validation status:** Confirmed
- **Notes:** Same loanword-handling question as `TV`. `status-o` in the
  native sentence shows the loanword taking a Garo suffix (`·o`) directly —
  relevant to how a pass-through mechanism would need to interact with
  suffix morphology, not just vocabulary lookup.

### nina
- **Garo:** `nina`
- **English:** to watch
- **Part of speech:** verb (base/infinitive form)
- **Example sentence:** `TV ninan nangja ...`
- **Source:** Native Sentence Validation Audit, Case 1 (Thangseng, 2026-07-08)
- **Confidence:** Medium-High — meaning confirmed, but exact segmentation
  in the original sentence (`ninan` vs `nina` + linking sound before
  `nangja`) is unresolved
- **Native validation status:** Needs Thangseng Validation (segmentation only — meaning is confirmed)
- **Notes:** `corrections.json` already has `"see / look / watch": "Nia"` —
  possible relation to `Nia`/`ni-` root worth Claude A cross-checking
  against `nina` before treating as a wholly new entry vs. a
  paradigm/conjugation form of an existing root.

### nangja
- **Garo:** `nangja`
- **English:** need not (necessity-modal negation)
- **Part of speech:** modal particle / negated auxiliary
- **Example sentence:** `TV ninan nangja palango tue status o nisona manaienga`
- **Source:** Native Sentence Validation Audit, Case 1 (Thangseng, 2026-07-08)
- **Confidence:** High — native-confirmed, explicitly distinguished from
  simple "don't want"
- **Native validation status:** Confirmed
- **Notes:** **High priority for Claude A.** Isolated engine test ("I don't
  need to watch TV" → `Anga sikengja`) shows this necessity-modal currently
  has no distinct representation — it collapses into the existing
  `sikenga`/"want" + negation path. This looks like a real gap in the
  modal-negation system (see `GRAMMAR_RULE_CATALOGUE.md`'s existing
  negation rules — RULE-017 simple negation, RULE-018 verbal-adjective
  `-gija` — neither appears to cover necessity-modal negation).

### palango / Palang
- **Garo:** `palango` (= `Palang` + `·o` locative)
- **English:** in the bed / bed
- **Part of speech:** noun (`Palang`) + locative suffix (`·o`)
- **Example sentence:** `... palango tue ...`
- **Source:** Native Sentence Validation Audit, Case 1 (Thangseng, 2026-07-08)
- **Confidence:** High
- **Native validation status:** Confirmed
- **Notes:** Not a new word — `"bed": "Palang"` already exists in
  `master_dictionary.json` (not yet promoted to the higher-priority
  `corrections.json`). The `·o` locative morpheme is independently
  confirmed correct and working (`corrections.json`: `"in / at": "·o"`).
  The gap is **not** vocabulary — see the `·ko`/`·o` selection issue under
  Pending Regression Cases instead. Isolated test: "in bed" alone → `Palang`
  via `stopword-stripped` method, confidence 0.88 — "in" is being treated
  as a discardable stopword rather than a locative trigger in this context,
  which may be the actual root cause (see regression case doc).

### tue
- **Garo:** `tue`
- **English:** lying (contextual, posture) / sleeping (more literal)
- **Part of speech:** converb / participle (posture verb)
- **Example sentence:** `... palango tue status o ...`
- **Source:** Native Sentence Validation Audit, Case 1 (Thangseng, 2026-07-08)
- **Confidence:** Medium-High — meaning confirmed, exact grammatical
  category (converb vs. separate posture-verb conjugation) not yet
  formally classified
- **Native validation status:** Confirmed (meaning); Needs Claude A Review (grammatical category)
- **Notes:** **High priority — currently causes a malformed engine output,
  not just a gap.** "I am lying down" → `Anga Ka·ma` (misparsed as
  directional "down", reusing the unrelated `down = Ka·ma` mapping from
  RULE-033/`corrections.json`); "I am lying in bed" → `Anga Palangha`
  (invalid Garo — `Palang`, a noun, treated as a verb root with a
  past-tense-shaped suffix appended). See Pending Regression Cases.

### nisona
- **Garo:** `nisona`
- **English:** to watch(ingly wait) — broader than `nina`; can also mean
  "to wait expectantly for someone arriving"
- **Part of speech:** verb + purposive suffix
- **Example sentence:** `... status o nisona manaienga`
- **Source:** Native Sentence Validation Audit, Case 1 (Thangseng, 2026-07-08)
- **Confidence:** Medium — core meaning confirmed, exact semantic boundary
  vs. `nina` not yet fully mapped (when does a speaker choose `nisona` over
  `nina`?)
- **Native validation status:** Confirmed (this instance); Needs Thangseng Validation (general selection rule between `nina`/`nisona`)
- **Notes:** Possible relation to `sona`/`-na` purposive suffix pattern
  already in the paradigm table (`MORPHOLOGY_SPECIFICATION.md` §3) — Claude
  A should check before treating `nisona` as an unrelated new root.

### man·ienga
- **Garo:** `man·ienga`
- **English:** can / am able (ability modal, continuous aspect)
- **Part of speech:** modal auxiliary suffix
- **Example sentence:** `... nisona manaienga`
- **Source:** Native Sentence Validation Audit, Case 1 (Thangseng, 2026-07-08)
- **Confidence:** High — native-confirmed
- **Native validation status:** Confirmed
- **Notes:** **High priority for Claude A.** Isolated engine tests ("I can
  watch" → `Anga ni·rik·a`, "I can eat" → `Anga Cha·a`) confirm the
  ability-modal is dropped entirely and systematically, not just in the
  Case 1 sentence — every "can X" input tested produces the same output as
  plain "X", with no ability marker at all. This is a candidate for a
  dedicated ability-modal rule in `GRAMMAR_RULE_CATALOGUE.md`. Possible
  relation to `"can": "man·a"` already present in `master_dictionary.json`
  — worth checking whether `man·a` exists but simply isn't being invoked by
  the grammar-assembly path for "can + verb" constructions.

---

## Summary table

| Garo | English | Confidence | Status | Priority for Claude A |
|---|---|---|---|---|
| `TV` | TV | High | Confirmed | Medium (loanword mechanism) |
| `status` | status | High | Confirmed | Medium (loanword mechanism) |
| `nina` | to watch | Medium-High | Needs Thangseng Validation (segmentation) | Low |
| `nangja` | need not | High | Confirmed | **High** (modal negation gap) |
| `palango`/`Palang` | in the bed / bed | High | Confirmed (not a new word — see regression doc) | Medium (`·ko`/`·o` selection) |
| `tue` | lying / sleeping | Medium-High | Confirmed (meaning); Needs Claude A Review (category) | **High** (causes malformed output) |
| `nisona` | to watch(ingly wait) | Medium | Confirmed (instance); Needs Thangseng Validation (general rule) | Medium |
| `man·ienga` | can / able | High | Confirmed | **High** (ability modal entirely absent) |

## Explicitly out of scope
- No entries here have been added to `corrections.json` or
  `master_dictionary.json`.
- No grammar rules have been written from this list — it is raw material
  for Claude A, not a substitute for review.
