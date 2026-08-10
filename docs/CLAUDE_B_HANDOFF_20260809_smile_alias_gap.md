# Claude B Handoff — 2026-08-09 — "smile" bare-alias gap

## Symptom
`compiled_dict.json['smile']` ships `ka·ding·sim·ik·a` (isVariant,
unconfirmed) instead of the native-confirmed `Ka·dingsmita`
(VERIFIED/HIGH, `master_dictionary.json`, english key `"To smile"`).

## Root cause (corrected from prior session's hypothesis)
NOT `pickPrimary`'s master-preference branch — `"Smile"` and
`"To smile"` normalize to two *different* keys (`normalizeFile` never
strips a `"to "` prefix), so they never compete inside `pickPrimary`
at all.

The actual bug is in `main()`'s bare-infinitive alias step
(prepare-data.js, ~L372-385):

```js
if (key.startsWith('to ')) {
  const bare = key.slice(3).trim();
  if (bare && !finalized[bare]) {   // <-- only fills GAPS
    finalized[bare] = finalized[key];
    bareAliasCount++;
  }
}
```

`finalized['smile']` already exists (from the standalone `"Smile"`
entry, isVariant, unconfirmed), so `!finalized[bare]` is false and the
correct `finalized['to smile']` value (`Ka·dingsmita`) never overwrites
it. The alias mechanism is gap-filling by design (documented rationale:
don't clobber an independently-chosen bare-form value like "hang") —
this is a case where the existing bare-form value is not
independently-confirmed-correct, just first-and-only.

## Fix needed (Claude B judgment call, not prescribing implementation)
When `finalized[bare]` exists but came from a lower-confidence source
(isVariant/unconfirmed) than the "to X" alias source (VERIFIED/HIGH),
the alias should win. This needs a confidence signal carried through to
the alias step — currently `finalized` only stores the resolved string,
not its provenance (verifiedKeys set exists in `finalizeDictionary` but
isn't returned to `main()`/passed to the alias step).

## Scope check
Confirmed this is an isolated single-key case via manual trace, not
re-run against the full corpus for other "to X"/bare pairs with the
same shape (bare form exists but is variant/unconfirmed, and "to X"
form is VERIFIED/HIGH) — recommend Claude B do that sweep before/while
fixing, same way RC-CANDIDATE-027's fix was verified against the full
337-key list rather than just the one reported case.

## Status
Not fixed by Claude A (engine code, out of scope). Flagged NV-067,
re-diagnosed this session with corrected root cause.
