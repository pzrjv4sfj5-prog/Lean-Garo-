# Pending Linguistic Proposal — Locative/Directional Word Set
_Logged: 2026-07-08 by Claude B_
_Status: PENDING — chat-only, NOT repository state, NOT implemented_

## Source
Raw WhatsApp exchange between Thangseng (native speaker) and Tridip, relayed
into a Claude B chat session on 2026-07-08. Per the V1.0 launch sprint
integration rule ("do not review or implement linguistic changes directly
from chat"), this is recorded here as a pending proposal only. No code or
`corrections.json` changes have been made.

## Proposed mappings (unverified against GRAMMAR_RULE_CATALOGUE.md)

| English | Proposed Garo | Note |
|---|---|---|
| below | ka'mao | |
| inside | ning'ao / nokningo | lit. "inside the room" |
| outside | a'palo | |
| above | kosako | |
| behind | janggilo / janggilchipak | lit. "on the back" |
| beside | sambao | |
| up | kosak | |
| beneath | mitapo | see disambiguation note below |
| over | badeao | flagged uncertain by source — lit. "beyond" |
| across | nalsao | |
| down | ka·ma | **confirms existing repo value** (`corrections.json`, RULE-032/033 area) |
| under (general) | kokkimao / nokkimao | confirms both spellings are legitimate variants, not a typo |

## Disambiguation note (important — not a simple 1:1 mapping)
Source specifies `mitapo` is used specifically for "underneath" in the sense
of something under a sheet/slab/covering, whereas `kokkimao`/`nokkimao` is
used for "under" in other (more general) cases. This means English "under"
and "beneath" may require sense-disambiguation rather than a single fixed
mapping — relevant to how RULE-033 (`under` → `Kokkimao`) is scoped, and
whether a new rule is needed for the sheet/slab sense.

## Also resolves
The `kokkimao` vs `nokkimao` spelling discrepancy flagged in commit
`edc94b7` / `THANGSENG_RULES_LOOKUP.md`: both are confirmed valid variants
by the native speaker, not a typo needing correction.

## Required before implementation
Per the integration rule, Claude A must:
1. Review this against `GRAMMAR_RULE_CATALOGUE.md` and `VALIDATION_CORPUS.md`.
2. Assign rule ID(s), especially for the under/beneath/mitapo sense split.
3. Commit updated linguistic specs to `docs/`.

Only after that commit lands does this become implementable repository
state for Claude B (corrections.json entries + regression tests +
doc sync).
