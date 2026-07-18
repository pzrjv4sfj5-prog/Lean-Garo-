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
**Narrow case resolved, 2026-07-17, Claude A.** The three exact
sentences above are now committed to `corrections.json` (confidence
1.0): raka-locality decided (apostrophe = casual typing for raka,
canonical `Na·a cha·genma?` etc. — cross-checked against
`pronoun_map.json` and existing `corrections.json` entries), object
mid-sentence position confirmed. General engine fix (removing the
`"will": "·gen"` dictionary entry causing RC-018's floating token, and
building general question-formation support) is diagnosed and handed
to Claude B in `docs/PENDING_REGRESSION_CASES.md` RC-CANDIDATE-020 —
not yet implemented.

**Correction, 2026-07-18, Claude A:** the "will you eat an apple" entry
was committed as `Na·a apal cha·genma?`, silently substituting the
dictionary's Garo-ified `apal` for "apple" instead of the bare English
loanword Thangseng actually used (`"na'a apple cha'genma?"`). Caught on
re-checking against the verbatim source rather than my own earlier
summary of it. Fixed to `Na·a apple cha·genma?`, matching the source
exactly. This isn't a minor spelling fix — it's the same class of error
this project's integration rule exists to prevent (never silently
"improve" native evidence toward something that looks more correct),
and it directly undermines the original point this sentence was logged
for: the bare-loanword insertion (`apple`, untranslated) is itself the
evidence, cited elsewhere as support for RC-CANDIDATE-005 (English
loanword passthrough). Substituting `apal` erased the exact data point
being preserved. Worth double-checking any other corrections.json
entries added from paraphrased/summarized notes rather than re-checked
against the original relay text.
