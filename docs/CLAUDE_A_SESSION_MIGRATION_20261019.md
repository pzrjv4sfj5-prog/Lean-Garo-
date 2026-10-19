# MIGRATION DOCUMENT: Claude A, Lean-Garo, 2026-10-19

Supersedes `docs/CLAUDE_A_SESSION_MIGRATION_20261017.md`. Paste this into a new conversation.

## Project identity
- Lean-Garo: Garo dictionary and English-to-Garo translation engine. Repo `github.com/pzrjv4sfj5-prog/Lean-Garo-` (publicly readable; cloning needs no token).
- Roles: T = Project Owner (PO). Claude A = data, rules, audits. Claude B = engine fixes. Thangseng = native validator via the Tridip relay.

## Current state (verified 2026-10-19)
- Content head `558cfcf`; the migration-doc commit sits on top of it. Full gate at `558cfcf`, every step exit 0: dictionary 8907/8907, 9/9 corrections; repository-intelligence 0 new violations (1321 allowlisted conflict keys); resync-stale-overrides clean; unit 573/573; runtime sweep 15860 calls, 0 errors; rule conformance 66/103 match, 15 orphans, 0 unbaselined (report-only); vite build OK.
- Master 10029 rows. Local clone deleted, no PAT stored anywhere. Rotate any token pasted in chat.

## Done since the 2026-10-17 migration (all pushed)
- `-rang` plural: ruling (`aaaf0b8`), then NV-169 (`874ed1c`): `Achakrang miko cha.a` (dogs eat rice; stored `mi·ko`), `Angni lekkarang jria` (my books are heavy), `heavy` = `jria`, `book` = `lekka` variant (Ki·tap stays primary), `wait, let me eat` row. PO closed `-rang`.
- NV-170 (`cfbd5d4`): PO confirmed `Biko sandibo` = search/look for him (4 rows).
- NV-171 (`06bca0b`): temporal nouns, RULE-053. `yesterday` = `Mijal` primary (`Mejal`/`me·ja·o` variants). Isolated `today` still ships `Da.alo` (a data pin leaks into sentences).
- NV-172 (`6f9871e`): `-chi` = destination marker (RULE-044); `bajal` market, `bajalchi` to the market; parse both, generate with `-chi`; `-chi` dropping is PO-provided and untested.
- NV-173 (`fc10dc1`): RULE-029 rewritten. `-bo` strictly imperative; Hai + root + `-na` hortative; Hai + `-bo` urging; same `-bo` for one/many (low confidence). Legacy unverified `Hai sakprak Agana skiebo` ("let us practice") flagged.
- NV-174 (`9ac8d69`): `-o` = neutral time stamp, `-de` = contrastive emphasis (matches native RULE-042).
- NV-175 (`558cfcf`): no gendered pronoun; search/look for her = `Biko sandibo` (4 rows).
- Claude B shipped: object-slot and subject `-rang` generation, counted-subject Formula B, noun-subject `-ko`, irregular plurals, counted adjective+noun classifier.

## Provenance rule (new)
Questions Claude A drafted and the PO answered directly (NV-173, NV-174, NV-175) were never sent to Thangseng. Label them "Project Owner-provided", not native quotes, even when they agree with native data.

## Held, with reasons
- Spelling variants (nokkimao/kokkimao, Uo/Ua, Bao/Bano, a'bil/Bol, Antichi/Bajalchi, mewa/bite): PO ruled to ignore until something major.
- Rule-conformance gate stays report-only until Phase 5.
- Raka dot: mang and king are dot:true; sak and rong are no-dot. mang has flipped four times; do not touch without a direct citation.
- `rarasa` withdrawn from runtime by PO; the two rows are tagged superseded (policy hold), retained.
- Bare plural rows (`books` = `Ki·tap`, `dogs` = `Achak`) and numeral + `-rang` untouched (not asked).

## Open issues
1. **PO-only:** the Garo for "some"; the Garo for bare "not"; the verified object form of he/she (engine gives `I see him` = `Anga bichi·ko Nika` but `I see her` = `Anga uko Nika`).
2. **Thangseng batch, not yet sent or saved as a doc:** Q3 adjective position reminder (he will send examples; don't build engine support until then); five uncited ties (agree: kin·a·chak·a / ku·chak·a / ku·ra·chak·a; brave: pa·a / sang·chak·a; fever: ding·du·a / han·ding·a / jom·a; greedy: mat·u·a / mik·bok·a / mik·ni·a; horn: a·du·ri / sing·ga); three sense splits (last: bon·kamgipa, ja·mangipa vs bai·a, ses; outside: A·pal, a'palo, bai·re, ha·gat·e; how: Maikai vs maidake); optional `-bo` same-form-for-many claim and the `Hai sakprak Agana skiebo` meaning.
3. Claude B's queue for A: R-a (-jaha/-manaha, does not), R-c (-ode, -gen, aspect), R-f classifier variants, R-g question forms need the rules' exact scope read first.
4. Claude B engine handoff `docs/HANDOFF_CLAUDE_B_20261019_temporal_locative.md`: no `-ko` on time words (`I eat rice today` -> `Anga da.alo·ko Cha·a`), isolated vs event `today`, parse `-chi`-less destinations.
5. Derived, not separately validated: `let's eat food` = `Hai mi cha·na`; `let us eat` = `Hai cha·na`.
6. 15 orphan rule examples (Phase 2 triage doc and conformance report): add rows only where a relay citation exists.
7. Phase 2 counts, not re-measured: 596 rows without confidence, 583 verified_high rows without a citation token, 244 shipped primaries resting only on ocr_flagged rows, tie keys with more than one verified garo, about 50 exact english+garo duplicate pairs.
8. Engine gaps (Claude B): compound imperatives (`Stop eating!`), `a lot of fat`.
9. Do-o: the rule says `do·a` = bird and `do·o` = chicken, but live data uses `do·o` for both. Needs native re-validation.
10. Housekeeping: `npm run lint` has 9 unused-variable errors; `npm audit` shows 5 moderate dev vulnerabilities; the rule catalogue has dangling dependency IDs and schema gaps.

## Standing rules
- Evidence-first: never infer linguistic facts. Label provenance. Retain-and-tag superseded or weaker candidates; a policy hold is also tagged superseded with the reason.
- A direct PO statement in chat counts as a citation. When it reverses an earlier citation, record the chain: new NV entry plus a pointer under the old one.
- Fix stale `phrase_maps` values directly, never allowlist them. `known_dictionary_conflicts.json` is lowercase english keys, only for intentional cited divergences.
- Tag the alternate `variant/VERIFIED/HIGH`; when the primary is an ordering choice, say so.
- A data-only pin in `corrections.json` or `phrase_maps.js` leaks into sentence composition. Test sentence output before shipping an isolated-word pin.
- A rule example's English gloss must match a runtime row, or `--write-baseline` records it as a mismatch.
- Gate order: `npm ci` (fresh clone), then `node prepare-data.js`, `node test-dictionary.js`, `node repository-intelligence.js`, `node scripts/resync-stale-overrides.mjs`, `node --test tests/unit/*.test.js`, `node scripts/runtime-error-sweep.mjs`, `node scripts/audit-rule-conformance.mjs --write-baseline` (after rule or example changes), `npx vite build`, `git checkout dist/index.html`. Read real exit codes and counts; `| tail` hides failures.
- Check current file text before search-and-replace edits; confirm master roundtrips (indent 2) before rewriting.
- WORKSTATE: write the `claude_a.next_action` entry, demote the prior to `next_action_prior_<date>`, then a second commit setting `repository.head` to the content commit. Claude B also writes there: `git fetch` and rebase before pushing, then re-run the gate.
- PAT: only a token T pastes in the current session (Contents read/write on `pzrjv4sfj5-prog`); push with a one-shot `-c http.extraheader="Authorization: Basic ..."`, never in a file or git config. Keep the clone until the push is verified (`origin` equals local), then delete it and ask T to rotate.
- Sandbox filesystem can reset between turns; re-clone if `/home/claude/repo` is missing.
- Token discipline: lead with the result, don't restate background, don't re-test unchanged things.

## Exact next step
1. Re-sync: clone, `npm ci`, `git log` against origin/main, read `.ai/WORKSTATE.yaml` `claude_a.next_action`, run the gate, confirm nothing changed (Claude B may have pushed).
2. Ask T for a fresh PAT with write access if anything needs pushing.
3. With T's guidance take one of: apply T's answers to the PO-only questions (issue 1); save the Thangseng batch as a doc (issue 2); read Claude B's handoffs and scope R-a, R-c, R-f, R-g.

## On resume
Treat this document as ground truth, re-sync against the actual repo state before acting, and don't re-open settled decisions: the raka dot, RULE-007 forms, `stop!`, `mit·am`, `rarasa` withdrawn, RULE-029 `-bo` rules, `-rang` closed, `-o` vs `-de`.
