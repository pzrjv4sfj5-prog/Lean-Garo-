# Claude A: `-rang` subject-position and bare-plural ruling (2026-10-18)

Answers Claude B's open item in `docs/CLAUDE_B_RANG_PLURAL_20261017.md` and `docs/CLAUDE_B_SESSION_MIGRATION_20261017.md`.
Authority: Thangseng relay 2026-09-30 Q2 (`docs/THANGSENG_RELAY_ANSWERS_20260930.md`): "-rang can be added to any countable nouns to make it plural." The answer is not restricted to a sentence slot. PO instruction 2026-10-18: rule on it.

## Ruling

1. **Subject-position plurals: authorized, Claude B scope.** The Q2 citation is slot-agnostic, so the object-slot limit was a caution, not a requirement. Extend `-rang` to an English plural subject noun under the same constraints as the object slot: plain concatenation, raka dot kept, skipped when a numeral is present (counted nouns stay on the classifier path), skipped for lexicalized plurals (children = Bi·sarang, friends = cham·e). Tests first. Output is rule-generated, not dictionary-sourced, same as the object slot.
2. **Bare standalone plurals: no change.** `dogs` -> `Achak` is an engine fallback, and `books` -> `Ki·tap` is an unverified legacy row (master, confidence unverified). A bare plural headword is a lookup, not a composed sentence, so it needs its own citation. Do not generate `-rang` for it. Keep the `books` row (retain-and-tag, not delete). Pending a Thangseng answer, below.
3. **Counted nouns stay `-rang`-free.** Q2 answer 2 confirms countable-only. It does not say whether a numeral plus `-rang` is wrong. `two dogs` -> `achak manggni` is cited data, so keep it. Relay question below.

## Not settled by this ruling

- Definiteness (`the dogs came`): no evidence either way. Subject generation applies to bare and definite plurals alike until a native example says otherwise.
- Surface alternation of `-rang` after vowel-final or consonant-final nouns beyond the known forms (Bi·sarang, biterang, tangka bisilrang). Still a prediction.

## Relay questions to add to the Thangseng batch (not yet sent)

- Q-a: Is the bare plural "dogs" (no sentence, no number) `achakrang`? Same for "books" (`ki·taprang`).
- Q-b: With a number, is `-rang` wrong (`achak manggni` vs `achakrang manggni`)?
- Q-c: Does `-rang` change in a subject (`dogs eat rice`, `the dogs came`)?

## Handoff to Claude B

Extend the generation to the subject slot with tests first. Do not touch bare plurals or any dictionary row. If a native example contradicts the rule, stop and flag it.

No `master_dictionary.json`, `corrections.json`, `phrase_maps.js` or engine change in this commit.

## Closed 2026-10-18 (NV-169)
Thangseng gave `Achakrang miko cha.a.` and `Angni lekkarang jria.`; Claude B built subject-slot generation (`a571fcc`). The PO closed the `-rang` topic. Q-a and Q-b are not being asked. Master rows added in NV-169.
