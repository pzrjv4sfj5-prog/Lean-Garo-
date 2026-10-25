# Claude A session migration, 2026-10-25B (paste into a new conversation)

## Project identity
Lean-Garo: Garo dictionary + English-to-Garo engine. Repo `github.com/pzrjv4sfj5-prog/Lean-Garo-`, branch `main`. Owner: T (Project Owner). Relay: Tridip. Native validator: Thangseng. Claude A = linguistic data + governance; Claude B = engine; Claude D = OCR. Also read `docs/CLAUDE_A_SESSION_MIGRATION_20261025.md` (earlier same-day session; its standing rules still hold) and `docs/VERB_PARADIGM_GAP_REPORT_20261025.md`.

## Current state
- Resumed from CLAUDE_A_SESSION_MIGRATION_20261025.md at origin 72fdec7; rebased over Claude B NV-204/205/206. Head = the commit this file ships in (`git log --oneline -3`). `.ai/WORKSTATE.yaml` `repository.head` = 120f66d (content checkpoint), `claude_a.next_action_claude_a_20261025e` holds the pointer.
- Gate at content head 120f66d: dictionary test pass; repository-intelligence 0 NEW; resync 0; unit 859/859; sweep 0 errors; conformance 76/110 (0 unbaselined); vite build OK (restore `dist/index.html`).
- NV numbers: A used 207, 208 (B used 204-206). Check `ls tests/unit | grep nv2` before numbering.

## Done this session
- NV-207: belly=Ok, stomach ache=Ok saa (no raka), to rumble / to grumble=Ok gam·a, windiness due to gases=Okdita. Promoted verified_high on Owner statement "verified by native dictionary" (labelled Project Owner-confirmed, not a Thangseng quote). Superseded (retained) old unverified belly=bik·ma and stomach ache=ok sa·a; allowlisted both keys in known_dictionary_conflicts.json. Test nv207.
- NV-208: sing=ring·a (raka) vs drink=ringa (no raka), Owner directive + native "Hai ring·na" (2026-07-14). Promoted sing verified_high; fixed stale corrections `singing` bitenga -> ring·enga (rule-derived, not native-attested) and purpose_map `sing` bit·na -> ring·na; added `ring·` to raka_roots.json. Test nv208.
- Audit: `scripts/audit-verb-paradigms.mjs` (report-only) and `docs/VERB_PARADIGM_GAP_REPORT_20261025.md`. No data changes from the audit.

## Runtime Handoff (Claude B)
1. English-side lemma gaps: `taking dancing writing dying making closing swimming` and participles `given taken spoken known sung danced written taught died lived made forgotten fought swum` pass through; `hitting`->sitting and `brought`->drought fuzzy-match wrongly; irregular pasts `took knew sang wrote taught brought broke fought swam` give `[UNKNOWN]ko`.
2. Productive hortative `Hai + -na` (RULE-007 verified/high) only works for pinned verbs; 51/55 give `[UNKNOWN] Chingna X`.
3. `can you X?` drops the modal (ruled `man·genma`); `i cannot X` unimplemented (negative unruled).
4. `repository-intelligence.js` Check A still flags `ring·` forms as raka-on-no-raka-root candidates (report-only noise); its root check should read the new `ring·` entry. Check B allowlist entry for `sing` is now stale.

## Open items (none closable without rulings)
1. Negative ability ("i cannot eat") — Thangseng.
2. One confirmed progressive/past/participle per verb class (vowel-final, raka stems) — Thangseng; derivation test matched 5/7 progressive, 3/4 past, misses were raka placement (work, stand).
3. `mi` vs `miko` in progressive/past (`Anga mi cha·enga` vs `Anga miko Cha·gen`) — Owner.
4. `i know`: `Anga hai·a` vs `Anga uia.` (unverified, stray period) — Owner.
5. Unverified base verbs: die, hit, break, make (daka/dok·a), speak tie.
6. Carried from 20261025.md: 7 `jom·a` illness rows, greedy primary, asongboma/`Shall I sit?`, sani/saniba/whose, `uan`/`uamangko` generation, Thangseng ties 2-5 + bare "not", `Why did they sit there?` pin (uana vs uano).
7. Proposed next step (awaiting Owner go): fill English -ing/past/participle/hortative only for verbs with raka confirmed in raka_roots.json, labelled rule-derived unverified; batch raka questions to Thangseng for the rest.

## Standing rules (unchanged; do not re-litigate)
Anga always; apostrophes in Garo words are raka typos; provenance labels (raw Thangseng = native quote, Owner = "Project Owner directive/-confirmed"); apply only what is ruled; never store a PAT (use a one-shot header; rotate); fetch + compare before push; do not delete the clone until local == origin/main.

## Repository status at close (verified against the repo)
- [x] Content head e05bee9 (migration doc + WORKSTATE + BOOTSTRAP) == origin/main when checked; this checklist is a docs-only follow-up commit
- [x] git status clean; no uncommitted changes; no local commits ahead of origin/main
- [x] WORKSTATE.yaml updated (head 120f66d, next_action_claude_a_20261025e; YAML parses)
- [x] SESSION_BOOTSTRAP.md updated (pointer to this doc)
- [x] Migration doc complete (Runtime Handoff included)
- [x] Gate on content commit 120f66d: unit 859/859, sweep 0 errors, 0 new violations, build OK
- [x] Native-validation status: no new Thangseng evidence this session; open items listed above

## Exact next step
New conversation: paste this file, `git clone` with a fresh PAT, re-sync, run the gate, then take Owner rulings on open items 3-4 and the go/no-go on item 7.
