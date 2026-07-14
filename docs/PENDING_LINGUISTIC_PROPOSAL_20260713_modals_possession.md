# Pending Linguistic Proposal — Modal Verbs (can/need/want) + Possession Confirmation
_Logged: 2026-07-13 by Claude B_
_Status: PENDING — chat-only, NOT repository state, NOT implemented_

## Source
Provided directly in a Claude B chat session by the Project Owner
(likely relaying Thangseng). Per the standing integration rule
(`.ai/SESSION_BOOTSTRAP.md`), this is recorded as a pending proposal
only — no `corrections.json`/`irregular_verbs.json`/engine changes have
been made from it.

## Proposed forms

| English | Proposed Garo | Note |
|---|---|---|
| can eat | `cha·na ama` / `cha·na man·a` | Two forms given — unclear if free variants, register difference, or one is a correction of the other |
| need to eat | `cha·na nanga` | |
| want to eat | `cha·na ska` | |
| he has two dogs | `uo achak manggni donga` | Confirms `donga` = "has" (matches what `RC-CANDIDATE-014`'s engineering fix already assumed by reusing the existing `have`=`donga` value) and confirms classifier `manggni` for "two dogs" |

## Why this matters for open work

- **`RC-CANDIDATE-004`** (ability modal "can", currently blocked on
  `NV-008` — the `master_dictionary.json` `man·a` entry is unverified):
  this proposal gives **two** candidate forms (`ama`, `man·a`), one of
  which matches the currently-unverified dictionary entry. This could
  resolve `NV-008`, but the two-form ambiguity needs resolving first —
  is `ama` the correct one and `man·a` was a lucky guess, or are they
  genuine alternates?
- **`RC-CANDIDATE-001`** (necessity-modal `nangja`/`"need not"` currently
  collapsing into desire-negation): `"need to eat"` → `cha·na nanga` is
  the **positive** counterpart and looks directly related to the
  already-confirmed `nangja` ("need not") from the Native Sentence
  Validation Audit's Case 1 — worth checking whether `nanga`/`nangja` are
  the same root with different polarity, which would let one rule cover
  both.
- **"want to eat" → `cha·na ska`**: differs from what's currently
  implemented (`sikenga`, e.g. `"i want to eat"` → `"Anga cha·na
  sikenga"`). Needs reconciling — is `ska` a shorter/casual register
  variant of `sikenga`, a different person/tense form, or does this
  supersede the current value?
- **`RC-CANDIDATE-014`** possession: `donga` = "has" is now
  independently confirmed twice — once by this proposal, once by the
  engineering fix already landed (`translationEngine.js`, reusing the
  existing `have`=`donga` correction for the `has` inflection). No
  action needed here beyond noting the convergence; the classifier
  `manggni` for "two dogs" also matches what the engine already
  produces via a pre-existing phrase entry (`do·o mang·gni` — worth
  Claude A confirming `manggni` vs `mang·gni` spelling, and `uo` vs
  `Ua` for "he", both appear to be minor transcription/register
  variants rather than substantive disagreements).

## Claude A Review (2026-07-13) — Disposition

- **`donga`="has":** confirmed, no action needed — matches the already-
  landed engineering fix (`RC-CANDIDATE-014`) and `RULE-G7`. `manggni`
  (this proposal) vs. `mang·gni` (already-live `corrections.json`,
  `"i have two dogs"`) is a minor spelling/raka-omission difference in
  the relay, not a substantive disagreement — treat `mang·gni` (with
  raka) as authoritative, already implemented. `uo` vs. `Ua` for "he" is
  the same kind of casual-transcription variance already seen elsewhere
  this session, not a new question.

- **`"need to eat"` → `cha·na nanga`:** strong hypothesis, not yet
  confirmed as a formal rule. Very likely the positive counterpart of
  the already-confirmed `nangja`("need not," Native Sentence Validation
  Audit Case 1) — `nanga`+`RULE-017`'s regular `-ja` negation would
  cover both with one rule instead of two unrelated ones. **Not
  promoting to a RULE yet** — this is a single relayed data point,
  same evidentiary bar issue as `RULE-034` was originally held to.
  Added as `NV-016` for direct confirmation (cheap: one question
  confirms or denies the `nanga`/`nangja` relationship).

- **`"can eat"` → `ama` / `man·a`:** **do not treat as two equally-
  weighted candidates.** Checked `"ama"` against repository history —
  `GLOBAL_RAKA_CONVERSION_HANDOFF.md` explicitly documents `mother =
  ama` as a **confirmed wrong** form, corrected to `aai`. That's not
  proof `ama` is wrong here too (Garo has genuine homonyms elsewhere in
  this repository — `nika` alone has 3+ senses), but a string with a
  documented error history recurring in an unrelated relay is worth
  real caution, not default acceptance. `man·a` remains the safer
  primary candidate (already the pre-existing, if unverified,
  dictionary entry) — this proposal doesn't resolve `NV-008`, it adds a
  new candidate that itself needs scrutiny before either can be trusted.
  `NV-008` stays open, updated with this caution rather than closed.

- **`"want to eat"` → `cha·na ska`:** does not supersede `sikenga` —
  most likely a casual-register contraction, matching the exact shape
  of three already-confirmed formal/casual doublets this session
  (`An·ching`/`chinga`, `gnang`/`donga`, `hai cha·na`/`hai cha·bo`).
  `sikeng` (longer, citation form) / `ska` (short, casual) fits the
  same pattern. **Not implemented as a replacement** — added as a
  register note pending confirmation, not a correction to the existing
  value. Added as part of `NV-016`.

**Rule/NV assignments:** `NV-016` created (`nanga`/`nangja` relationship,
`ska`/`sikeng` register question — bundled, cheap to ask together).
`NV-008` updated with the `ama` caution, not closed. No new
`GRAMMAR_RULE_CATALOGUE.md` entries yet — everything here is single-
relay evidence, held to the same bar as prior proposals before
promotion. **Status: reviewed, not implementable yet** — per the
proposal's own "required before implementation" note, the `ama`/`man·a`
and `ska`/`sikeng` ambiguities are flagged for native confirmation, not
resolved, so this stays a proposal pending `NV-016`, not a green light
for Claude B.

