# Claude B session migration, 2026-10-25 (paste this to resume)

**Project:** Lean-Garo- (English -> Garo translator). Claude B = engine lane; Claude A = data lane; PO (Tridip) relays Thangseng. Repo `pzrjv4sfj5-prog/Lean-Garo-` (trailing hyphen; public clone needs no token).
**Resumed from:** `docs/CLAUDE_B_SESSION_MIGRATION_20261024.md` (+ addenda 2-4 in that file). Resync clean; only Claude A data commits (NV-195, NV-196, NV-197) landed in between.
**State:** everything pushed. Last code commit before this doc: `89cf0e0` on origin/main.
**Gate at close (governance order, all exit 0):** prepare-data; test-dictionary pass; repository-intelligence PASSED 0 new; resync-stale-overrides 0 new; unit 756/756; runtime sweep 0 errors; conformance 76/110, 14 orphan, 0 unbaselined; vite build ok; WORKSTATE.yaml strict parse (no duplicate keys); all JSON valid. Before/after snapshot (346 probes vs session start 9b06a6e): 30 changed, all intended, 0 errors, 0 new [UNKNOWN].
**PAT:** PO pasted it in chat repeatedly. Used inline for pushes only, output redacted, never stored. PO must rotate it.

## Done this session (all PO-directed, rulings NOT native quotes unless stated)
1. **NV-198** demonstratives (`nv198_demonstratives_close.test.js`): `this NOUN`->`Ia NOUN`; `this/that is a NOUN`->`Ia/Ua NOUN`; `this/that one`->`Ia/Ua`; standalone `that`->`Ua`.
2. **NV-199** Ia/Ua pronoun paradigm (`nv199_ia_ua_paradigm.test.js`): 14 unverified master rows (Ianoni, Iachipak, Iantok, Iaba uaba, Uakai, Uamangko, Uamangchi, Bisong, herewith/hereby=Iachi, Ua int.); engine rule `there is X`/`X is there` -> `X donga`.
3. **NV-200** (`nv200_directional_uchi_iachi.test.js`): rows Uchi, Uchipak, Uako (=Uko), `to them`; go/come + there/here -> `Uchi`/`Iachi` (bare, non-negative only).
4. Reviewed A's NV-195 `iano`+`donga` scoping: accepted (prefix match on `dong`).

## Grammar learned (Ia/Ua system)
- Ia/Ua are pronoun bases; also determiners before a noun. Ua also he/she/it and interjection of surprise.
- Suffixes: -no locative, -noni from, -chi directional, -chipak side, -ntok only/all, -ke excl., -ba and, -kai adverb; Uamang takes -ko/-na/-ni/-chi.
- **Ua elides -a before -chi/-chipak/-ko** (Uchi, Uchipak, Uko; Uako unelided variant). **Ia does not** (Iachi, Iachipak, Iako).
- Existential: `NOUN donga` (rice is there = Mi donga).
- Closed with no change: work stem keeps `kam ka·na` (synonym of dakna); May I keeps explicit `Anga`; donga/roa and -ko on other locatives keep defaults.

## Held / open
- **Not generated (unattested):** Uachi, Uachipak, Uanoni, Uantok, Iakai.
- **PO question:** `I see him/her` pin is `Anga biko nika`; general default is `uko`. Keep biko or switch?
- **Needs evidence:** `Haiwa` triggers (never emitted); `look at that`/object `that`; Uchi/Iachi in negative motion clauses (`I don't go there`); `Uamangchi` also meaning 'to them' (currently Uamangna).
- **Promotion:** NV-199/NV-200 rows are `unverified`; Claude A to promote on Thangseng confirmation.
- Unchanged older holds: wh-question + auxiliary path; `now`=`Dao`; `little` primary `kom`; non-`-a` adjectives; bare plurals.

## Standing rules
Evidence-first, never infer linguistic facts (PO rulings logged as rulings); engine-only unless PO directs; tests first, then implement, then before/after snapshot diff; gate order as above, `git checkout dist/index.html` after build; rebase onto origin immediately before pushing; push with PAT inline, output redacted. Take the next free NV number from origin before naming (A used NV-196/197 while B planned them). Gotchas: print with JSON.stringify (raka/middle dots U+00B7); `translate()` is async, output field `r.garo`; `bash_tool` is sh: wrap loops in `bash -c`.

## Exact next step
1. Clone, `npm ci`, `git log`, read `.ai/WORKSTATE.yaml` `claude_b.next_action`, re-run the gate.
2. Pick up Claude A's/PO's answers on the open items above. No engine work is queued.
