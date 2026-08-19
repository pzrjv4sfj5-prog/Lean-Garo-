# Claude B → Claude A Handoff — 2026-08-19

## Context
Continuation of the A↔B propagation audit (see
`docs/CLAUDE_B_SESSION_MIGRATION_20260819.md`). After applying the 34 safe
mechanical resyncs (commit `1da3bb4`), I re-ran the remaining 187
`known_cross_source_conflicts.json` entries through a stricter check: an
override is only auto-resynced if (a) it matches a documented SUPERSEDED
master_dictionary.json row for the exact same key, AND (b) no case-variant
of that key has an unresolved/OPEN sense that the override might actually
belong to.

**Result: zero further entries qualify for mechanical resync.** Everything
below needs your (or native/Thangseng) input. Full machine-readable data in
`docs/CLAUDE_B_RESYNC_SWEEP_20260819_data.json`.

## 1. Case/sense risk (1 item) — needs disambiguation, do not auto-resync

**`bear`** — `phrase_maps.js`/`corrections.json` currently hold `nang·a`.
`master_dictionary.json` has `bear` (animal) confirmed VERIFIED/HIGH =
`Matmak` per NV-080. But `Bear` (capitalized) has three rows explicitly
marked `OPEN` for the separate carry/endure verb sense, including `nang·a`
itself — NV-080 did not confirm or reject any of them.

Question for you: is `nang·a` in phrase_maps/corrections currently serving
the verb sense (carry/endure), or is it just a stale animal-sense override
that happens to coincide with an open verb candidate? If it's the verb
sense and intentional, this should be documented/tagged so it stops
surfacing in future sweeps. If it's meant to be the animal sense, it needs
resolving to `Matmak` — but only after confirming the verb sense isn't
lost.

## 2. Tied VERIFIED/HIGH candidates (2 items) — needs a primary pick

- **`elephant`** (`corrections.json` = `buring·o`): master_dictionary.json
  has three untied VERIFIED/HIGH candidates for `Elephant` — `mong`,
  `hati`, `mongma`. None match the current override.
- **`outside`** (`phrase_maps.js` = `A·pal`): two VERIFIED/HIGH candidates
  for `Outside` — `baire`, `hagate`. Neither matches the current override.

Same shape as the existing `pickPrimary` verified-tie backlog
(`docs/PICKPRIMARY_VERIFIED_TIES.md`) — recommend folding these two in
rather than treating separately.

## 3. Override doesn't match any documented SUPERSEDED row (20 items)

These overrides disagree with master_dictionary.json's current
VERIFIED/HIGH value, but — unlike father/mother/small and the 34 already
fixed — the override value doesn't correspond to anything explicitly
tagged SUPERSEDED. That means I can't mechanically prove the override is
stale rather than an intentional variant, so I did **not** touch them.

| key | source | current override | master VERIFIED/HIGH target |
|---|---|---|---|
| clever | corrections | seng·a | hai·man·a ku·man·a |
| come here | corrections | Ianona re·babo | Ianona re·babo! |
| current | corrections | karen | Dongenggipa |
| forest | corrections | mongma | bring |
| i am fine | corrections | Anga namenga | Ang·a namengava. |
| i am sick | corrections | Anga sakamenga | Anga kene dongka |
| it is raining | corrections | Mikka waenga | Mikka wabenga |
| let's go to the market | corrections | Hai bajalchi re·na | Hai bajalchi re'na |
| mountain | corrections | A'bri | ha·bri |
| see | corrections | Nika | nia |
| skin | corrections | bigi | bi·gil |
| smell | corrections | biba | Gingsika |
| smile | corrections | ka·dingsmita | ka·ding·sim·ik·a |
| strong | corrections | bilak | Bilaka |
| to pluck | corrections | aka | ak·na |
| to see | corrections | nika | nia |
| enough | phrase_maps | Chu·onga! | chu·ong·a |
| i am hungry | phrase_maps | Anga okkria | Anga okkrienga |
| i am sick | phrase_maps | Anga sakama | Anga kene dongka |
| i don't understand | phrase_maps | Anga ma·sija | Anga man·ja |

Some of these (e.g. `see`/`to see`, `strong`, `skin`) look like plausible
case/spelling variants of the same word and may turn out safe once you
confirm the override isn't serving some other intentional purpose (e.g.
`enough`'s override carries an exclamation mark the target doesn't — worth
checking whether that's meaningful, same class of issue as `come here`
where the punctuation *is* part of the confirmed form). Others (`clever`,
`current`, `forest`, `i am fine`, `i am sick`, `i am hungry`, `mountain`)
are different enough that I'd rather you make the call than have me guess.

## 4. No VERIFIED/HIGH candidate exists at all (160 items)

Full list in the JSON data file. These are keys where
`known_cross_source_conflicts.json` flags a phrase_maps/corrections vs.
compiled_dict disagreement, but master_dictionary.json has no
VERIFIED/HIGH row for that exact key to check against — genuinely open,
same bucket as the existing native-validation backlog. Recommend folding
these into the next Thangseng relay batch rather than treating as urgent.

## What I did NOT do
No linguistic judgment calls, no guessing, no data file edits from this
sweep — this handoff is audit output only. All numbers above are
independently reproducible from `docs/CLAUDE_B_RESYNC_SWEEP_20260819_data.json`
against the current `master_dictionary.json` and `known_cross_source_conflicts.json`.
