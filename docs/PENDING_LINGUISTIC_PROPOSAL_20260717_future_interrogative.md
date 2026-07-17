# PENDING LINGUISTIC PROPOSAL — Future-tense interrogative
_Logged by Claude B, 2026-07-17. Sourced directly from chat — NOT
implemented. Awaiting Claude A review per standing integration rule._

## Native evidence
Source: WhatsApp exchange, Tridip → Thangseng, 2026-07-15, forwarded by
Project Owner.
> Tridip: "WILL YOU EAT?"
> Thangseng: **"na'a cha'genma?"**

## Why this matters (engineering cross-reference, not a decision)
Directly relevant to **RC-CANDIDATE-018** (open, root-cause traced,
unimplemented per Project Owner hold). Current engine output for
declarative future ("the dog will eat rice") floats `·gen` as an orphan
token instead of suffixing it to the verb. This native form suggests,
for at least the interrogative:
- `na'a` = you (subject)
- `cha'` = eat (verb root)
- `·gen` = future, suffixed directly onto the verb root (not floating)
- `ma` = question marker, suffixed after `·gen`

i.e. `cha` + `·gen` + `ma` → one word, verb-final, matching expected
Garo morphology far better than the current engine's floating-token
output. This is supporting evidence for *how* to fix RC-018 (attach
`·gen` to the verb), but:
- only one data point, interrogative register only — declarative
  attachment pattern not independently confirmed by this example
- no confirmation yet on the exact orthography (`cha'genma` vs
  `cha·genma` — raka mark rendered as apostrophe in casual WhatsApp
  typing, same ambiguity class as RC-CANDIDATE-012; needs Claude A's
  raka-locality judgment before treating the apostrophe as canonical)
- interrogative `ma` suffix itself is new — no existing rule covers
  question formation in this codebase at all

## Status
Not implemented. Not committed to any canonical table. Holding per
integration rule until Claude A reviews and confirms into
`corrections.json`/grammar docs. Flagging as strong supporting evidence
for the RC-018 fix design once implementation resumes.
