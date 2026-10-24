# Claude B session migration, 2026-10-24 (paste this to resume)

**Project:** Lean-Garo- (English -> Garo translator). Claude B = engine lane; Claude A = data lane; PO (Tridip) relays Thangseng. Repo `pzrjv4sfj5-prog/Lean-Garo-` (trailing hyphen; public clone needs no token).
**State:** everything pushed; see `git log` on origin/main. Resumed from `docs/CLAUDE_B_SESSION_MIGRATION_20261023.md`; resync was clean (only Claude A data commits since).
**Gate at close (governance order, all exit 0):** prepare-data 8930 entries; test-dictionary 8930/8930; repository-intelligence PASSED 0 new; resync-stale-overrides 0 new; unit 668/668; runtime sweep 15897 calls 0 errors; conformance 76/110, 14 orphan, 0 unbaselined; vite build ok.
**PAT:** PO's PAT used inline only for pushes (never stored in a remote URL or file). It has been pasted in chat repeatedly: PO to rotate. Never write it into a file.

## Done this session (engine + tests only)
1. **NV-187 May I / Can I + verb** (`a0fa6ea`): `tryMayICanIRequestConstruction` in `grammarEngine.js`, wired as step 5.85. `May I|Can I eat/go/sit/work` -> `Anga <verb>na man·genma?` (`cha·na`, `re·angna`, `asongna`, `kam ka·na`); `sit down` shares the stem. Intransitive, attested stems only; everything else falls through. Tests: `nv187_may_i_request.test.js`. Snapshot diff 515 probes, 16 changed, all intended.
2. **NV-189 `that NOUN` -> `Ua NOUN`**: `tryThatNounConstruction` (grammarEngine.js), wired at step 3.9 BEFORE stop-word strip (which was silently dropping `that`: `that dog` -> `Achak`). Placement attested by `Ua nok namen dal·a` (NV-177). Adjectives excluded via new `isKnownAdjectiveEnglish` in `garo_adjectives.js`. Tests: `nv189_demonstrative_that.test.js`. Snapshot diff 507 probes, 68 changed, all `that/That + noun`.
3. **`Haiwa` NOT emitted by the engine.** The handoff says no verified trigger list; I did not infer one. `that over there`, `that is far away` are unchanged (still garbled, see held).

## Held / open
- **For Claude A / PO:** `that` isolated returns lowercase `ua` via `corrections.json` (`"that": "ua"`) while phrase_maps/NV-189 row say `Ua`: data fix. `Haiwa` trigger list needed (which phrasings = distance emphasised). Placement evidence for `this` (`Ia`) + noun: `this dog` still drops `this`. `that is a dog`, `that house is big`, `look at that`, `that one` still drop/garble `that` (predicate/demonstrative-pronoun uses need evidence). `work` stem in requests: `kam ka·na` (modal_can_map) vs `dakna` (purpose_map): confirm. First-person requests keep explicit `Anga` (matches PO pins); RULE-004 pro-drop note covers `Na·a` requests only: PO to say if `May I` should drop `Anga`.
- Unchanged holds from the 20261023 doc: wh-question + auxiliary path; did-questions NV-182 vs NV-158 (PO ruling); `now`=`Dao` unverified; `little` primary `kom`; `big red house` pin `Dalgipa gitchak nok`; object `look at it`/nia forms; non-`-a` adjectives; bare plurals; WORKSTATE.yaml duplicated mapping key near line 457.

## Standing rules
Evidence-first, never infer linguistic facts; engine-only unless PO directs; tests first, then implement, then before/after snapshot diff; gate order as above, `git checkout dist/index.html` after build; rebase onto origin immediately before pushing; push with PAT inline, output redacted. Gotchas: print with JSON.stringify (raka/middle dots U+00B7 hidden by ASCII filtering); `translate()` is async, output field `r.garo`.

## Exact next step
1. Clone, `npm ci`, `git log`, read `.ai/WORKSTATE.yaml` `claude_b.next_action`, re-run the gate.
2. Pick up Claude A's answers on the items above; do not touch did-questions or wh+aux without a PO ruling.
