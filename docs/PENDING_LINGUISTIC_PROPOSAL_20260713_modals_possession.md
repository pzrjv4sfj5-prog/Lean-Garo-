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

## Required before implementation
Per the integration rule, Claude A must review this against
`GRAMMAR_RULE_CATALOGUE.md`/`THANGSENG_NATIVE_VALIDATION.md`, resolve
the `ama`/`man·a` and `ska`/`sikenga` ambiguities, assign rule ID(s) or
close relevant NV items, and commit to `docs/`. Only then does this
become implementable for Claude B (dictionary entries + regression
tests + doc sync), per the standard workflow.
