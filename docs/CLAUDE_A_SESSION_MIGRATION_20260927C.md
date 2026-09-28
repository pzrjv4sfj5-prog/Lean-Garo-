# Claude A Session Migration — 2026-09-27C

## Resume (Rule 10 / §11.1)
Resumed from docs/CLAUDE_A_SESSION_MIGRATION_20260927B.md (pasted pointer, treated as ground truth). Fresh clone: HEAD == origin/main == 9269d4e on arrival, WORKSTATE/SESSION_BOOTSTRAP matched the doc. Two rounds of drift arrived before push (Claude B's 3ea6fcb session close incl. adita-drop fix; later Claude B's 855db97 duplicate supersession) — both rebased clean. Governance (.ai/CLAUDE_A_OPERATING_GOVERNANCE.md) read in full this session.

## Task this turn
Standing open item from 20260927B: the 36 `<pronoun> have <noun>` rows using a malformed `ong·a` construction shadowing the donga-existential composition.

## Classification (§4)
- 36 `ong·a` have/has rows: **class D** (stale/uncited data shadowing verified grammar), resolved via corpus-internal evidence, no relay. Claude B's handoff (docs/CLAUDE_B_HANDOFF_20260927_donga_onga_precedence.md) reached the identical diagnosis independently: donga = existential possession (RULE-G7, Verified/High); ong·a = copula "to be" (RULE-005, NV-017 native gloss).
- adita quantifier-drop regression: **class E**, fixed by Claude B in 3ea6fcb (grammarEngine.js literal match + corrections.json phrase). The 2 `test.todo` from 20260927B now pass.

## Work performed
- master_dictionary.json: 36 rows (6 pronouns × food/water/book/house/car/money) `unverified` → `superseded`, note cites RULE-G7/RULE-005 + corrections.json donga precedents; retained, not deleted.
- Claude B independently pushed the same supersession (855db97, Owner one-time exception while A was out of tokens); merge 2bed05d converged, end state identical (36/36 superseded, verified).
- Live-verified post-merge: "they have a house" → Uamango nok donga; "we have a car" → An·chingo gari donga; "you have a book" → Na·ao ki·tap donga; "i have money" → Ango dang·ga donga (all grammar-assembly, 0.82); "i have several books" → Ango adita ki.taprang donga (correction, 1.0).

## Gate at close (post-merge, fresh rebuild)
8886/8886 dictionary, 9/9 grammatical corrections, 0 new repository-intelligence violations, resync 0 candidates, 476/476 unit tests (0 fail, 0 todo). Rebuild byte-identical to committed artifacts.

## §5 Rule-generalization check
**Drift flag still OPEN.** No new grammar rule since RULE-050 (2026-09-21); this session was data hygiene only. 7+ consecutive vocabulary/data sessions, well past the 3-session threshold. Candidate for a dedicated rule-generalization session: an explicit "ong·a = copula, never possession; possession = donga" scope note in RULE-G7/RULE-005 (evidence already on record) — not written this session (one-task discipline).

## §7 Duplicate representation check
- master_dictionary.json: PASS (36/36 superseded).
- corrections.json / phrase_maps.js: PASS — no `have <noun>` ong·a entries; remaining `ong·a` hits are unrelated copula sentences (`Anga kusi ong·a` etc.).
- garo_dictionary.json: legacy source, **36 rows remain** (no confidence/notes fields; cannot carry SUPERSEDED). Live output verified unaffected (master supersession wins; sentences compose via donga). Not deleted — no Owner instruction; delete only on Owner direction.
- compiled_dict.json: rebuilt, spot-checked live via translate().
- grammar-rule docs: not touched (see §5 above).

## §12 Rework-prevention
Already resolved before? Partially — Claude B did the same fix concurrently (converged, no rework needed). Other representations stale? Only garo_dictionary.json legacy rows (harmless, noted). Runtime vs linguistic? Linguistic data fix, verified live. Over/under-derivation: neither — evidence pre-existing (RULE-G7, RULE-005).

## §8 Runtime Handoff
Runtime Handoff: None. (donga composition needed no engine change; adita fix already shipped by Claude B.) Verified: 6 sentences live above. Not verified: full runtime-error-sweep.mjs this session.

## Open items (unchanged owners)
1. sov-assembly "where is the X?" fails on multi-word nouns (Claude B).
2. §5 drift flag / rule-generalization session — awaiting Project Owner direction.
3. Optional: garo_dictionary.json 36 legacy ong·a rows — delete on Owner instruction.

## PAT note
Session-start PAT was genuinely invalid (401 on GET /user; ls-remote passed only because the repo is public-readable). Owner supplied a working second PAT; used inline for fetch/push only, never persisted to .git/config.

## Repository status at close
See final commit; verified before push: HEAD vs origin/main, `git status` clean, WORKSTATE.yaml + SESSION_BOOTSTRAP.md updated in this close commit, no local unpushed commits, no Thangseng relay items touched (Project Owner/corpus-internal evidence only).
