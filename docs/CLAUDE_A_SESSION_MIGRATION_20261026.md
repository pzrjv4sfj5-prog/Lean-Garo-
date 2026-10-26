# Claude A session migration, 2026-10-26 (paste into a new conversation)

## Project identity
Lean-Garo: Garo dictionary + English-to-Garo engine. Repo `github.com/pzrjv4sfj5-prog/Lean-Garo-`, branch `main`. Owner: T (Project Owner). Relay: Tridip. Native validator: Thangseng. Claude A = linguistic data + governance; Claude B = engine; Claude D = OCR. Also read `docs/CLAUDE_A_SESSION_MIGRATION_20261025B.md` and `docs/CLAUDE_A_NV213_CLOSURE_20261026.md`.

## Current state
- Resumed from CLAUDE_A_SESSION_MIGRATION_20261025B.md; origin was 646765c on arrival. Content head 93b8758 (NV-211 closure); Head = the commit this file ships in (`git log --oneline -3`). WORKSTATE `repository.head` is a content checkpoint, pointer `claude_a.next_action_claude_a_20261026`.
- NV numbers: A used 209 (Re·mola), 210 (-ja / on·a / on·na / on·ana, RULE-054), 211 (ties closure, test file nv211_ties_closure). B also used 209 (iano/uano) and 211/212. Next free: 213. Check `ls tests/unit | grep nv2` first.

## Done this session
- NV-209: go together = Re·mola (Owner directive, raka from period).
- NV-210: Dal·ja = not big; Dal·gipa ong·ja = not the big one; on·a (plain give), on·na (requested/expected), on·ana (causal); 5 exact pins; superseded the on·ana explicit-pronoun request variant (now `Na·a angna chi on·na man·genma?`). RULE-054 new, RULE-017 extended.
- NV-211: Owner rulings man·a = ama synonyms; can eat/work/speak = man·a, can go = ama. 17 verified ties closed (tie report empty). Seven jom·a illness rows respelled joma (NV-196 + Wiktionary); fever = joma. i know = Anga hai·a. there = Uano verified. Negative ability rows (unverified, rule-derived). Bare not not stored under key `not` (broke negation).

## Runtime Handoff (Claude B)
1. `i cannot X` is not generated (rows exist, unverified: Anga cha·na man·ja etc.).
2. Shipped changes from this session: he = Ua (was Bia), last = bon·kamgipa, leaf = bi·jak, i can go = ama, fever = joma, i know = Anga hai·a (phrase_maps pins updated by A).
3. Carried: English-side lemma gaps (-ing/participles/irregular pasts), productive Hai + -na hortative, `uan`/`uamangko` generation, Check A `ring·` noise.

## Open items
sani/saniba (whose/someone's), `Shall I sit?`, per-class raka confirmations for progressive/past, unverified base verbs (die, hit, break, make), Thangseng questions on negative ability. Provenance of the NV-210 give text is unattributed (ask T for the author).

## Standing rules (unchanged; do not re-litigate)
Anga always; apostrophes/periods in Garo words are raka typos; provenance labels (Thangseng quote vs Owner directive vs Owner-delegated logic); apply only what is ruled; never store a PAT (one-shot header; rotate); fetch + compare before push; do not delete the clone until local == origin/main.

## Repository status at close (verified against the repo)
See the final verification in the closing message; checklist items are checked against `git rev-parse HEAD origin/main` and `git status` after the push.

## Exact next step
New conversation: paste this file, clone with a fresh PAT, re-sync, run the gate, take Owner decisions on the open items.
