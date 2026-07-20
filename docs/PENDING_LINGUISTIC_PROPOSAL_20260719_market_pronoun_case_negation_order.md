# PENDING LINGUISTIC PROPOSAL — Live acceptance-testing corrections
_Logged by Claude B, 2026-07-19. Sourced directly from chat (native
speaker feedback, relayed by Project Owner) — NOT implemented. Three
separate findings; not touching translationEngine.js/dictionaries for
any of them per the standing integration rule._

## 1. "market" — confirms a pre-existing dictionary bug, adds a real construction question

Engine currently produces `"she will go to the market"` →
`"Ua bajal / anti·ko Re·anggen"`. Root cause already identified
(2026-07-18, not yet logged as its own RC): `master_dictionary.json`
literally stores `"market": "Bajal / Anti"` — two candidate words joined
by `" / "` as a single value, never resolved to one. Separate entries
already exist for both candidates: `"bajal": "bajal"` and
`"anti": "Anti"` (both `notes: "VERIFIED/native-speaker"`).

Native correction: **`"anti"` is correct**, and the full sentence should
be `"Ua antichi re·anggen"` — using **`chi` as the locative "to" marker**,
not the `·ko` object marker the engine currently attaches. This is a
construction detail, not just a word swap: it suggests destination/
goal locatives ("go to X") take `chi`, distinct from the `·ko` marker
used for direct objects elsewhere in the same sentence family.

**Engineering-only sub-fix, safe to schedule without further review:**
the `"market": "Bajal / Anti"` malformed dictionary value itself —
resolving it to a single value (per Claude A's guidance) is a data-
integrity fix, same shape as RC-CANDIDATE-012/016/019.
**Needs Claude A:** whether `chi`-for-destination is a general rule
(any "go to [place]" sentence) or specific to `anti`, and how it
interacts with the existing `·ko` locative-object machinery
(RC-CANDIDATE-011/017 territory) before any engine change.

## 2. "we" vs "us" — subject/object case distinction not currently modeled

Engine: `"we are drinking water"` → `"An·ching chi·ko ringenga"`.
Native: `"Chinga chi(ko) ringenga"` — **`Chinga` for subject "we"**,
confirmed as correct ("This is spot on" was for a different sentence,
but the `Chinga` correction stands on its own line). Follow-up
exchange confirmed this is a genuine case distinction, not a synonym
pair:
> "Why not An·ching?" — "It is also we" — "So which is correct" — "Use
> depends on the case .. I think we can use chinga for 'we' and
> an·ching for 'us'."

Current `src/data/pronoun_map.json` has a single `"we": "An·ching"`
entry with no subject/object distinction (`"us": "An·ching·ko"` already
exists as a separate object-form entry, using `An·ching` + `·ko`, not
`Chinga`). If confirmed, this isn't a one-word swap — pronoun_map.js's
current shape (one Garo form per English pronoun) may need a
subject-form/object-form distinction added for "we"/"us" specifically,
the way `"i"` vs some object-form of "me" might already or might not
have. **Needs Claude A** to confirm the rule generally (is this
specific to we/us, or does every pronoun have a subject/object split
that's simply never surfaced because most other pairs happen to
coincide?) before any schema change — this could be narrow (one pronoun)
or systemic (rethink `pronoun_map.json`'s shape entirely).

## 3. Negative-continuous suffix ordering

For `"i am not eating rice"`, engine produces `"Anga mi·ko cha·engja"`
(continuous suffix `·enga` first, then negation `ja` appended after,
via the existing `applyTense` → `applyNegation` pipeline order).
Native correction: `"nga miko cha·jaenga"` — **negation `ja` appears
BEFORE the continuous suffix `enga`**, not after
(`cha·ja·enga`, not `cha·eng·ja`).

This is a morpheme-ordering question, not a word-choice one — if
confirmed, it's a real gap in `applyTense`/`applyNegation`'s composition
order for the continuous+negative combination specifically (unclear
whether this generalizes to other tense+negation combinations, e.g.
past+negative, or is unique to continuous). **Needs Claude A** to
confirm the rule and its scope before any change to
`applyNegation`/`applyTense` composition — this function is shared by
every negated sentence in both `analyzeGrammar` and
`assembleSentenceSOV`, so a wrong generalization here would be a wide
regression, not a narrow one.

## Status
Not implemented. All three are logged as separate findings since they
have independent scope/risk (one dictionary-data bug + one construction
question, one pronoun-case question, one morpheme-ordering question).
Awaiting Claude A review.
