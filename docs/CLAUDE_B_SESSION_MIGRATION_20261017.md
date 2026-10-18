# Claude B session migration, 2026-10-17 (paste this to resume)

**Project:** Lean-Garo- (English -> Garo translator). Claude B = engine lane. Claude A = content/data lane. Project Owner (PO) relays Thangseng (native speaker). Repo `pzrjv4sfj5-prog/Lean-Garo-` (public; cloning needs no token), branch main.
**State:** content head = `48792de` (`Claude B: general -rang plural generation ...`), rebased on Claude A's `d3765f1`. Resync with `git log` first; do not trust hashes here. WORKSTATE `repository.head` = `48792de` by the pre-commit pointer convention.
**Gate at close (governance order, every step exit 0):** prepare-data 8896 entries; test-dictionary 8896/8896, corrections 9/9; repository-intelligence 0 new (1321 allowlisted conflict keys); resync-stale-overrides 0 NEW mismatches (72 allowlisted); unit 502/502; runtime sweep 15843 calls, 0 errors; rule conformance 63/102, 16 orphan, 0 unbaselined (report-only); vite build ok; `git checkout dist/index.html` done, tree clean.
**Push status:** pushed to origin (`d3765f1..48792de`). The PO-supplied PAT was used inline for one push only (never stored in the remote URL, output scrubbed). That PAT, and the earlier one, sit in chat history: **rotate both**.

## Resume + resync this session
Resumed from `docs/CLAUDE_B_HANDOFF_20261016B_phase3_done.md` and `docs/CLAUDE_B_SESSION_MIGRATION_20261016.md`. The PO named the repo `Lean-Garo`; it is `Lean-Garo-` (trailing hyphen). Re-sync gate at `58c3fb2` matched the handoff (497/497, 0 new). First push was rejected (non-fast-forward): Claude A had pushed 12 commits (NV-166/167/168 data, rarasa withdrawal, A's migration doc), zero overlap with engine files. Rebased clean, re-ran the full gate, pushed.

## Done this session (engine only; no master_dictionary / corrections / phrase_maps edits)
General `-rang` plural generation, object slot, `src/grammarEngine.js` (before the object marker is attached). Authority: Thangseng relay 2026-09-30 Q2 ("-rang can be added to any countable nouns"), filed in `docs/THANGSENG_RELAY_ANSWERS_20260930.md`; PO go-ahead 2026-10-17 on QUANTITY+NOUN-rang order after being shown the cited examples (`adita ki·taprang`, `bang·a chattrorang` confirmed; `Man·derang bang·e re·baa`, `Wak be·en mit·am bang·a` are NOUN+QUANTITY exceptions by sentence type, left as static rows).
Rule: an English plural object noun (singularize() changes the word) whose plural resolves to the same Garo as its singular, or has no plural row, gets plain `-rang` concatenation, dot kept. Skipped: any numeral in the object phrase (counted nouns, classifier path), lexicalized plurals (children=Bi·sarang, friends=cham·e), a multi-word dictionary row, third-person accusative, `[UNKNOWN]`, and Garo already ending in `rang`.
Examples (runtime): `I read books` -> `Anga ki·taprang·ko po·ri·a`; `I have many books` -> `Ango bang·a ki·taprang donga`; `she has several dogs` -> `Uao adita achakrang donga`; `we have many students` -> `An·chingo bang·a chattrorang donga`; `I have two dogs` -> `Ango achak manggni donga` (unchanged).
Tests: `tests/unit/rang_plural_generation.test.js` (+5). Two assertions in `tests/unit/several_many_quantifier_composition.test.js` updated from `adita achak` / `bang·a chattro` to the `-rang` forms (consistent with the cited `Chingo bang·a chattrorang donga`). Handoff for A: `docs/CLAUDE_B_RANG_PLURAL_20261017.md`.

## Governance section 3 trace (source -> compiled -> override -> runtime)
This session edited no dictionary key and no override, so the mandatory trace is the 5-key sample from `docs/PICKPRIMARY_VERIFIED_TIES.md` (20 keys listed; seeded pick, mulberry32 seed 20261017): `big red house`, `hoe`, `able`, `i can work`, `he`.
- `big red house`: 3 verified/high rows; compiled `nok git·chak dal·gipa`; no corrections/grammarOverrides entry; runtime exact-phrase 0.98, same. OK (still an open tie for A).
- `hoe`: rows `git·chi`, `ko·dal`; compiled `ko·dal`; no override; runtime `ko·dal`. OK (open tie).
- `able`: compiled `ama`; no override; runtime `ama` 0.98. OK (my row filter also matched `ham·sok·a`, looser than the report's 2-candidate tie; the report's `man·a`/`ama` pair is the A-owned NV-160/RULE-050 question).
- `i can work`: compiled `Anga kam ka·na man·a`; no override; runtime same. OK (open tie `ama`/`man·a`).
- `he`: rows `Ua` (NV-071, Thangseng direct) and `Bia` (PO relay 2026-09-19: "Bia and Ua are synonyms ... we can use either"); compiled `Bia` (last-write-wins); runtime `Ua` via `phrase_maps.js` `'he'` + `pronoun_map.json`. The mask is live and cited: NV-071 and `docs/PRONOUN_HE_SHE_POLICY_20261016.md` (R8). Not a stale override. Runtime/compiled divergence is intentional; do not "fix" it.
No stale or uncited mask found in the sample.

## Held / open
- `-rang` NOT built for: subject-position plurals (`dogs eat rice`) and bare standalone plurals (`dogs` -> `Achak`; `books` is a data row `Ki·tap`). Need A's ruling on whether bare headwords should carry `-rang`. PO answers 2 and 3 (countable/English-only; counted nouns stay -rang-free) were never stated explicitly; I used the migration-doc defaults and said so. Reconfirm if wrong.
- NOUN+QUANTITY sentence-type boundary (exclamation/description) has only two cited examples; engine does not generate it.
- Q3 adjective position: Thangseng said "depends on the sentence", examples promised, reminder for PO to relay. Do not build until examples arrive. Plural sub-question unanswered.
- Claude A needed (unchanged): Garo for `some` and bare `not`; `Da·mo, anga mi cha·kuna` row; `search for him!`=Biko sandibo; R-a (-jaha/-manaha, `does not`), R-c (-ode, -gen, aspect), R-f classifier variants, R-g question forms; RULE-029 (-bo) re-check.
- Casing in grammar-assembly (`Anga Re·anggen`): lowercasing breaks 37 tests, left to A/PO.
- Not for B: R9 why/because, R10 hundred, raka dot, spelling variants.
- `claude_a.next_action` still lists `-rang` as "3 PO answers needed"; stale after this session. A to update (not edited from B's lane).

## Standing rules
Evidence-first, never infer linguistic facts; engine-only unless PO directs otherwise; Cross-agent protection (GPT/PO directives, e.g. cow = Matchu) untouched; fix stale phrase_maps directly, no allowlists; gate order: `node prepare-data.js`, `node test-dictionary.js`, `node repository-intelligence.js`, `node scripts/resync-stale-overrides.mjs`, `node --test tests/unit/*.test.js`, `node scripts/runtime-error-sweep.mjs`, `node scripts/audit-rule-conformance.mjs`, `npx vite build`, then `git checkout dist/index.html`. Scripts run from repo root. Redirect gate output to a file and `iconv -c -t ascii`. Never embed a PAT in a remote URL; scrub after each push. Update WORKSTATE next_action, demote prior, set head to the content commit.

## Exact next step
1. `git clone https://github.com/pzrjv4sfj5-prog/Lean-Garo-.git` (no token needed to read), `npm ci`, `git log` vs `48792de`, read `.ai/WORKSTATE.yaml` `claude_b.next_action`, re-run the gate, confirm nothing moved.
2. If A rules on bare/subject plurals, extend `-rang` there (tests first). Otherwise hold.
3. File Thangseng's Q3 examples verbatim for A when they arrive; do not build adjective order before then.
4. Pushing needs a fresh fine-grained PAT (Contents RW) from the PO; rotate the two exposed ones.
