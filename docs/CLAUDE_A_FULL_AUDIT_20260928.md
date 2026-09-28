# Claude A Full Audit — 2026-09-28
Resumed from CLAUDE_A_SESSION_MIGRATION_20260927C.md. Arrival: HEAD == origin/main == 51ca8d6 (Claude B AI-003, after A's cda9c17 close). Audit-only; no data/engine edits. WORKSTATE/SESSION_BOOTSTRAP not updated (see F1).

## Gate (fresh clone, npm ci)
prepare-data OK (8886 compiled) · test-dictionary 8886/8886, 9/9 · repository-intelligence PASSED (0 new) · resync 0 candidates · unit 480/480 · runtime-error-sweep 15825 calls, 0 errors · tree clean after rebuild (artifacts reproducible).

## Findings
### Process / hygiene
- F1 `.ai/WORKSTATE.yaml` `repository.head: d0d251c` and SESSION_BOOTSTRAP pointers are stale (real HEAD 51ca8d6); latest entry there is 20260926, 20260927B/C entries not reflected at top.
- F2 `npm run lint` fails (9 errors, no-unused-vars in src/research/demo.js, researchFallback.js). Not in the build chain, so ungated.
- F3 `npm audit`: 5 moderate (react-router/@remix-run/router, qs) — dev-time, unpatched.
- F4 Committed docs contain a truncated PAT prefix (docs/CLAUDE_A_SESSION_MIGRATION_20260927B.md line 93, plus 5 CLAUDE_B docs mention token patterns). No full token found; recommend scrubbing prefixes anyway.

### Dictionary data (master_dictionary.json, 9988 rows)
- D1 596 rows have no `confidence` (shipping-path unknown treatment); 52 exact english+garo duplicate pairs, 43 of them with differing confidence across copies.
- D2 583/2104 verified_high rows have notes with no NV/Thangseng/Project Owner/rule citation token (provenance gap, e.g. Ant, Agree, drink).
- D3 61 english keys carry >1 distinct verified_high garo (ties): e.g. leg, tree, outside, clean, fast, fever, bridge, orange. 20 are auto-tracked in PICKPRIMARY_VERIFIED_TIES; ~41 are not tracked as ties (mostly capitalization-variant keys / alias groups) — need triage.
- D4 244 compiled primaries are backed only by `ocr_flagged` rows (e.g. hatred, trust, faith, office, burning, clear); 1 (`cook`→song·a) by a superseded row only (note that phrase/correction layer is the real source).
- D5 2 rows (`my house`, `my dog`, "angni Nok/Achak") carry a SUPERSEDED note but confidence `unverified` (note/confidence mismatch; prepare-data treats note-prefix as authoritative).
- D6 Orthography: 3 verified_high use ASCII dot as raka (Be=Ong.bo, Today=Da.alo, mother=a.ai); 48 rows mix "." and "·" (mostly sentence-final period, benign); `ka'o` vs `ka·o` outlier (known). english keys with stray glyphs: "ability / permission ✓", "den· (to carry)"-style keys, "a a·king-land."; garo field has 4 ⚠, 4 Devanagari 'ा', 17 '+', 2 ':' , 2 '"'.
- D7 english==garo untranslated placeholders: cup, nurse, pen, pencil, map, plastic, glass, apple, room, phone, TV, film, mall, restaurant, english (loanwords likely intentional, undocumented; `apple` also has te·spu, `cup` has kap/Piala).
- D8 1 `classifier: akka` (bunch of bananas) is outside the documented 12-classifier set; open/rejected rows (8/5) are unresolved ("Bear" x4, "gong" x2, sexual-intercourse x2).
- D9 Legacy layers: garo_dictionary.json (4342) has 1114 pairs absent from master (incl. malformed keys "fishs", "chi na·tok skigipa·gni", "chip·"); final_entries.json (4695) has 909 absent, with `˙` (U+02D9) raka-variant glyphs (gan˙·sang, ku˙·rang). Known-orphaned; still shipped in repo and 36 legacy ong·a rows remain.
- D10 Counting-rule drift in stored data vs memory: verified counts show mang/sak/pang without raka, king/gong with (61/60/20 vs 19/10). Consistent with PO 2026-09-13 directive (mang no raka) — but the standing "raka for mang/sak/gong/king" wording in older docs/notes is stale; sak status not directive-confirmed in what I read.

### Runtime (translate() battery, 65 inputs)
- R1 "eleven dogs" → `achak mangChi·sa` (glued, capital C mid-word; teens formatting bug).
- R2 "two persons" → `mande·gni` (drops classifier `sak`); "one person" → `mande saksa`. Inconsistent, wrong vs counting rule.
- R3 "my name is T" → `Angni bimung daka [UNKNOWN]` — [UNKNOWN] token leaks into user-facing output for proper nouns.
- R4 "not" → `not [UNKNOWN]`, conf 0 (bare negation missing).
- R5 "this is my book" → `angni ki·tap` (copula/demonstrative dropped, stopword-stripped, 0.75) — meaning loss.
- R6 sov-assembly (0.75) outputs questionable: "where is the big house?" → `Bano Nok dal·a`; "how many?" → `Maidake Bang·a` (known open item; multi-word noun).
- R7 Mid-sentence capitalization of assembled verbs/adjs (`Anga Re·anggen`, `Ua Ka·onanga`, `Achak Chon·a`) vs lowercase elsewhere — inconsistent casing.
- R8 he/she both → Ua at runtime, but tie report says `he` ships `Bia`; `is he angry?` uses `Bia` — pronoun inconsistency + stale report.
- R9 "why" and "because" both → Maina (collision; linguistic question, not resolved).
- R10 "hundred" → Ritchasa at 0.75 (phrase-map, unverified confidence); "build" → Rik·a while resync notes compiled_dict=gat·a unverified (only skipped resync item).

## Not audited
Frontend (src/*.jsx UI, server.js), a11y/perf, bundle (docs/BUNDLE_ANALYSIS.md exists), OCR pipeline correctness, grammar YAML rule-by-rule (RULE-001..050), corrections.json/phrase_maps.js per-entry.

## Next Recommended Tasks
1. Claude B: R1–R7 engine handoff. 2. Claude A: D3 tie triage + D2 citation backfill + D1/D5 confidence cleanup. 3. PO: raka ASCII-dot (D6) and because/why (R9) decisions. 4. Fix F1–F2; scrub F4.

## Repository status at close
Audit doc only; WORKSTATE.yaml/SESSION_BOOTSTRAP.md NOT updated; verify HEAD vs origin/main after push.
