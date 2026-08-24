# Claude B Runtime Handoff — NV-095 (2026-08-23C)

Source: "CLAUDE A — FINAL NATIVE DATA RECONCILIATION" (Thangseng final relay
via Project Owner, 74 word entries + 10 fixed phrases).

## Status
Claude A already performed the full reconciliation, including runtime
propagation (corrections.json, phrase_maps.js, garo_dictionary.json,
irregular_verbs.json, prepare-data.js grammarOverrides) and rebuilt
src/compiled_dict.json via `node prepare-data.js`. 226/226 tests pass.
`node repository-intelligence.js` exits 0 (18 new self-consistency
conflicts allowlisted in known_dictionary_conflicts.json with citations).
Live `translate()` spot-checked for 15 keys — all correct (see migration
doc). **No runtime propagation work remains for Claude B on this batch.**

This handoff is for audit/awareness, not action, unless Claude B's own
review finds something Claude A missed.

## English key / final canonical / old value / where found / superseded?

| English | Final Garo | Old value found | Where | Superseded? |
|---|---|---|---|---|
| no | Ihing | ong·ja (NV-094) | master, garo_dict, corrections, phrase_maps | Yes — explicit reopening, Thangseng's doc instructs against keeping ong·ja |
| yes | Am | Oe (unverified) | master, garo_dict, corrections(already Am), phrase_maps | Yes |
| help | dakchaka | Betoi (uncited); chak·a (unverified) | phrase_maps; master | Yes (chak·a) |
| log | bol·tong | dot (classifier stem, wrong layer) | corrections.json | N/A — was a wrong-sense value, not a dict conflict |
| stop | dontonga | Sengbo (borrowed from "wait") | corrections.json, phrase_maps.js | N/A — wrong-sense value |
| quick | Ta·rakbo! | Tarkbo! (borrowed from "hurry") | phrase_maps.js, grammarOverrides | N/A — wrong-sense value |
| must | nanga | nang·a (raka mismatch only) | corrections.json | N/A — spelling only |
| sit | aonga | a·song·a (NV-080) | master, phrase_maps, garo_dict | Yes — resolves long-open NV-080 question |
| song | git | giit (2026-08-22 direct) | master, corrections | Yes |
| you | Na·a | Nang (flagged, different case-role) | master (new entry) | No — Nang untouched, genuine grammatical distinction |
| teach | Skie on·a | Sikie on·a | master, phrase_maps, garo_dict | Yes |
| wash | Su·sranga | Su·srong·a / su·gala | garo_dict, phrase_maps | Yes (garo_dict rows) |
| dead | sigimin | Manggisi (was wrongly used for bare "dead") | corrections.json | No — Manggisi correctly stays as "dead (body)"'s value |
| cooked | Song·aha | min·a (NV-050, distinct ripe/done sense) | master (new entry) | No — grammarOverride added so Song·aha wins pickPrimary tie |
| goat | Do·bok | (confidence field was untagged) | master | N/A — promoted to verified_high |
| doctor | Sam·on·gipa | "Doctor / Sam·on·gipa" (stray English word artifact) | master | N/A — data hygiene, value unchanged |
| eaten | cha·jok | cha·man·aha / cha·manaha | master, corrections(already right), irregular_verbs.json | Yes |
| happy | kusi ong·a | kusi (NV-085, bare root) | master, corrections | Yes |
| well | chiakol | chi·kol (NV-089) | master (corrections already right) | Yes |
| darkness | Andalani | Andala (NV-094) | master (corrections already right) | Yes |
| walking | re·enga | Re·ang·enga (likely mis-glossed "going") | master | Yes, with note |
| 28 more single-candidate additions | (see master_dictionary.json, notes citing NV-095) | none existed | master | N/A |

Full per-entry detail is in master_dictionary.json's `notes` fields
(all tagged NV-095, 2026-08-23) — this table is a summary, not the
source of truth.

## `wait` — explicitly NOT changed
Thangseng's relay reconfirmed "wait → sengbo", already covered by the
existing verified_high "Damo/Sengbo" master entry (native-confirmed
2026-08-20, NV-085). Left master, corrections.json, and phrase_maps.js
untouched. **Caution for Claude B:** I initially (incorrectly) changed
corrections.json's bare "wait" from "Damo" to "Damo/Sengbo" and it broke
RULE-036 (suffixation, e.g. "Anga Damogen") — reverted. Bare "wait" in
corrections.json must stay a single suffixable form ("Damo"), never the
dual "Damo/Sengbo" display string.

## Runtime propagation remaining
None identified. If Claude B's independent audit finds a fourth layer
Claude A missed, treat NV-095's master_dictionary.json notes as ground
truth for what the correct value should be.
