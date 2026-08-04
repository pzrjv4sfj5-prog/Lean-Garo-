# Pending Linguistic Proposal — Father/Mother Register Set, Copula Conflict, `ama` Homonymy
_Logged: 2026-07-16 by Claude A_
_Status: REVIEWED 2026-07-16 by Claude A (same session) — see disposition below._

## Source
Raw WhatsApp exchange between Tridip and Thangseng, relayed directly into
this Claude A session on 2026-07-16. Per the standing integration rule,
this is recorded here as a pending proposal only — no `corrections.json`
or dictionary changes have been made. Relayed/WhatsApp = Tier 2 evidence.

## 1. Father/mother register set — new vocabulary, not yet promoted
| Register | Father | Mother |
|---|---|---|
| Formal/descriptive | `pagipa` | `ma·gipa` |
| Address (native) | `apa` | `ama` |
| Colloquial (Bengali/Assamese loan) | `baba` | `a·ai` (raka confirmed) |

Cross-check against current repo state:
- `corrections.json` already has `"my father": "ang·ni baba"` and
  `"this is my father": "Ia ang·ni baba"` — consistent with `baba` as
  the casual-register form. No conflict.
- `phrase_maps.js`/`compiled_dict.json` currently map bare `father`/`mother`
  to `pa·a`/`na·gi·pa`, a spelling variant of `pagipa`/`ma·gipa` (raka
  placement differs slightly — worth a raka-consistency check, not
  flagged wrong).
- `apa` (father, address) is new — not in the dictionary yet.
- `ama` (mother, address) is new **and collides with an existing
  suspect entry** — see §3.

**Disposition:** Not promoted. Recommend adding `apa`, `ama` (address
register), `a·ai` (colloquial, raka-confirmed) as new entries once
`ama` homonymy (§3) is resolved, so the new entry doesn't get merged
into the wrong sense during compilation.

## 2. Predicate-nominal copula conflict — `daka` vs. `ong·a` (relates to RULE-005, RULE-031)
**RESOLVED 2026-07-18.** Thangseng, asked directly (NV-017): *"It is
pagipa. daka is to do in terms of working. Ong'a is to be. So it is
ong'a. Angni pagipa skigipa ong'a."* Corrected in `corrections.json`
from `Ang·ni pa·a skigipa daka` to `Angni pagipa skigipa ong·a` — see
`GRAMMAR_RULE_CATALOGUE.md` RULE-005 (predicate-nominal `daka`
disconfirmed) and RULE-031 for the full downstream update.

Original open-question framing kept below for the record:
("my father is a teacher"):
- `corrections.json:645` (existing, provenance-uncertain per RULE-005):
  `Ang·ni pa·a skigipa daka`
- New relay (2026-07-16, Thangseng direct): `Angni pagipa (saksa)
  skigipa ong·a`

Both native-sourced, different copula. This is not resolved by picking
one — it needs a direct relay question back to Thangseng: *is it
`daka` or `ong·a` for "X is a Y," are both acceptable, or does it
depend on register (formal `pagipa` vs. address `apa`)?*

**Disposition:** Added to the live NV relay queue, ranked above NV-016
(touches two open rules — RULE-005 and RULE-031 — at once).

## 3. `ama` — confirmed homonymy risk, not just a caution
Three unrelated things currently share the string `ama`:
1. A **confirmed-wrong** dictionary entry: `mother = ama` (already
   flagged incorrect elsewhere in the repo).
2. A **candidate modal/possession** sense ("can eat"), flagged
   `ama-caution` in the pending modals/possession proposal
   (`PENDING_LINGUISTIC_PROPOSAL_20260713_modals_possession.md`).
3. This relay's **new, live, native-confirmed** sense: `ama` = "mother"
   (address form), from Thangseng directly.

**Disposition:** Do not merge #3 into #1 or #2. Log `ama` (address,
"mother") as its own lexical entry once added, with an explicit note
distinguishing it from the modal/possession candidate. Recommend a
follow-up relay question to Thangseng confirming these are indeed
separate words and not the same word doing multiple duty.

**RESOLVED, 2026-08-04 (NV-018 follow-up, direct native confirmation,
2026-07-18, relayed today):** the follow-up question was asked and
answered directly — these are NOT separate words doing multiple duty.
Thangseng: *"Yes, ama has the same spelling in both the meanings. No
difference."* And: *"ama is not 'can eat'. It only means can and for
mother we have replaced with A.ai (Remember the raka in a.ai)."*
Resolution in practice: `ama` = the general ability modal "can" only
(entry #2 above, now promoted VERIFIED/HIGH). The mother-address sense
(#1/#3) is retired in favor of `a·ai` — not disambiguated by context,
simply replaced. `master_dictionary.json`: added `can`→`ama` and
`mother (address form)`→`a·ai`; annotated the legacy `Ma / Ama` entry.
**Still open, unrelated to this resolution:** whether `apa`/`ama` are
address-only or usable as a full sentence subject (Thangseng said he'd
answer later, still pending) — moot for `ama` specifically now that
it's retired from the mother sense, but still open for `apa` (father).

## Proposed relay questions (for the next Tridip/Thangseng exchange)
1. For "my father is a teacher": `daka` or `ong·a` — both okay, or
   register-dependent?
2. Is `ama` (mother, address form) the same word in any way as a
   modal "can" sense, or are these unrelated homophones?
3. Confirm `apa`/`ama` are address-only (i.e., not used as the subject
   of a full descriptive sentence the way `pagipa`/`ma·gipa` are).

## Not implemented
Per the standing integration rule, no engine or `corrections.json`
changes have been made from this relay. This is Claude B's to
implement only after Verified status via direct confirmation.
