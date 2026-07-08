# Pending Linguistic Proposal — Locative/Directional Word Set
_Logged: 2026-07-08 by Claude B_
_Status: REVIEWED 2026-07-08 by Claude A — see disposition below._

## Disposition (Claude A review, 2026-07-08)
- `down` = `Ka·ma` — **no action needed**, already confirmed repository
  state (RULE-033/`corrections.json`).
- `kokkima`/`nokkima` spelling variance — **resolved**, both confirmed
  legitimate; folded into RULE-033 as an update, no new rule needed.
- `under` (general) vs. `mitapo` (sheet/slab/covering sense) — **assigned
  RULE-035**. Needs a direct confirmed example sentence before promotion
  to Validation Corpus / `corrections.json`.
- Remaining 9 words (below, inside, outside, above, behind, beside, up,
  over, across) — **assigned RULE-034**, Medium confidence (Low for
  `over`/`badeao`, source-flagged uncertain). Not promoted to
  `corrections.json` or Validation Corpus yet — recommend a direct
  Thangseng confirmation pass, ideally with one example sentence per word,
  matching the evidentiary bar RULE-033 was held to.
- **Not implemented in engine/`corrections.json`** — per the standing
  integration rule, that step is Claude B's, and only after these items
  reach "Verified" status via direct native confirmation, not relay.

See `docs/GRAMMAR_RULE_CATALOGUE.md` RULE-033/034/035 for full detail.

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
