# Claude A tie-break pass, 2026-10-27 (audit only, no data changed)

Scope: the 65 English keys with more than one live VERIFIED/HIGH Garo value in master_dictionary.json.

## Result
- 60 of 65: exactly one row without a `variant/` prefix, and compiled_dict.json ships that row. Each is a documented native-valid synonym set (NV-097, NV-117, NV-161, NV-164, NV-171, NV-181, PO directive 2026-09-08). Nothing to fix; do not merge or delete these rows.
- 3 of 65 are noun/verb splits, not ties: `answer` (NV-077), `hope` (NV-082), `demand` (Thangseng 2026-07-23). Verb form ships for the bare key. Pending: POS-aware lookup (Claude B), see docs/POS_COLLISION_SET_20260924.md.
- 1 of 65, `to support`: `Chaka` (NV-063, native) vs `al·du·na` (doc7 import, no native citation). Compiled ships Chaka. Left as is; not demoted without a ruling.
- 1 of 65, `to walk`: declared primary is `Re·mama`; compiled_dict.json ships `Re·rama` (a `variant/` row added by NV-219). Runtime is correct only because of the `phrase_maps.js` pin (`'to walk': 'Re·mama'`). Bare `walk` compiles correctly.

## Root cause for Claude B (prepare-data.js, pickPrimary)
The single-neutral-row rule is gated on `isRealCaseCollision`, which needs the variant rows' raw key casing to differ from the neutral row's. All four `to walk` rows have the same casing, so selection falls through to last-write-wins by array order, and the newest variant row lands last. Any new same-case variant row can flip a compiled primary this way. Fix belongs in the engine/compile layer; Claude A did not touch it.

## Not resolved here (need a Project Owner ruling)
`can` family: `i can go` declares `ama` as primary, while `able`, `i can eat`, `i can work` and `she can cook` declare `man·a`. NV-117 says they are the same word, and RULE-050 examples use `ama` while runtime ships `man·a`. Also open: `how are you`, `I am sick`, `I am hungry`.
