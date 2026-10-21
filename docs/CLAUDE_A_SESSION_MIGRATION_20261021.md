# MIGRATION DOCUMENT: Claude A, Lean-Garo, 2026-10-21

Supersedes the 2026-10-20 migration doc (never committed; its content is carried below).

## Project identity
- Lean-Garo: Garo dictionary and English-to-Garo translation engine. Repo `github.com/pzrjv4sfj5-prog/Lean-Garo-`, publicly readable (clone needs no token).
- Roles: T = Project Owner (PO). Claude A = data, rules, audits. Claude B = engine fixes. Thangseng = native validator via the Tridip relay.

## Current state
- Content head: see `.ai/WORKSTATE.yaml` line 2 `head:` (pointer commit on top). Based on origin/main after Claude B `e992a3d`.
- Full gate green: dictionary 8918/8918, 9/9 corrections; repository-intelligence 0 new violations; resync clean; unit 612/612; sweep 15880 calls 0 errors; conformance 75/110 (15 orphans, 0 unbaselined, report-only); vite build OK.

## Done this session (all pushed)
- **NV-179:** PO: `miko` has no raka.
- **NV-180 (PO-provided rule block, raw not on file; `.` read as `·`):**
  - No artificial raka before `-ko` for every object (`miko`, `appleko`, `achakko`, `do·oko`, `applekode`). Engine object marker and `-ode` junction changed; 10 master rows, 11 pins, tests updated. Superseded rows and inherent-dot words (`Ko·ko·rika`, `pul·ko·pi`) untouched. Locative `-o` is still `·o` (not addressed).
  - No present perfect: `has/have X-ed` = Simple Past; `-jok`, `-aha`, `-manaha` all Simple Past. RULE-026/028 annotated (`po_updates`).
  - Time-word order flexible; engine keeps time-first.
  - Stems keep the raka; `-gen`, `-bo`, `-nabe`, `-jawa` already live.
  - `-chim` (remote past / past continuous, past perfect, contextual plural) recorded on RULE-013, NOT applied.
- **NV-181 (PO response to the fac54aa live outputs; contextual how/have):**
  - General: `him/her` and `her/him` route to `him` (`Anga biko nika`, `Anga bichiko nia`); `chicken`/`rooster` take `mang` (`do·o mang·gni`); phrase map `how much` = `Badita`.
  - Exact-phrase pins only (PO's own examples, `corrections.json`): `I will do` = `Anga ka·gen`; `has stopped eating` = `cha·jaha`; four `how` sentences; `I have a dog.`; `Do you have my book?`; `I have come to you.`; `Do you have to go to the market?` (uses `antichi`).
  - Resolutions: `maidake` stays the general default for how/method (NV-178 wins); the pinned `How are you going to do it?` with `maikai` is a contextual variant only. `cha·jokma` is the primary for `have you eaten your lunch?`; `cha·ahama` is retained as `variant/VERIFIED/HIGH` (key allowlisted in `known_dictionary_conflicts.json`).
  - New test file `tests/unit/nv181_po_examples.test.js`.

## Provenance rule
PO-provided and PO-relayed answers are never native quotes. Label "Project Owner-provided" or "Project Owner-relayed, attributed to Thangseng; raw message not on file". A direct PO statement in chat counts as a citation; when it reverses an earlier one, log the chain with a new NV entry plus a pointer under the old one.

## Held, with reasons
- Spelling variants (nokkimao/kokkimao, Uo/Ua, Bao/Bano, a'bil/Bol, Antichi/Bajalchi, mewa/bite): PO ruled to ignore until something major.
- Rule-conformance gate stays report-only until Phase 5.
- Raka dot on classifiers: mang and king are dot:true, sak and rong no-dot. mang flipped four times; do not touch without a direct citation.
- `rarasa` withdrawn from runtime by the PO; rows retained as superseded.
- Bare plural rows and numeral + `-rang` untouched.
- `-chim` per NV-180 not applied (see open issues).

## Open issues
1. **Thangseng, outstanding (NV-182):** synonym ties 1-5 (agree: kin·a·chak·a / ku·chak·a / ku·ra·chak·a; brave: pa·a / sang·chak·a; fever: ding·du·a / han·ding·a / jom·a; greedy: mat·u·a / mik·bok·a / mik·ni·a; horn: a·du·ri / sing·ga) and the bare word for "not".
2. **`bon·kamgipa` vs `ja·mangipa`:** NV-178 glosses `bon·kamgipa` "last page or last person"; NV-082 gave "last person" to `ja·mangipa`. Needs a check.
3. **`ha·gat·e`** (outside) not addressed in NV-178.
4. **PO-only:** verified object form of he/she in general (non-pinned) sentences.
5. **`-chim` decisions (PO):** PO wrote it fused (`poraiengachim`) but RULE-013 says free-standing; "no longer" nuance unconfirmed; raka position in `Kataha.chim` unclear; contextual plural must not replace `-rang`; `used to work` uses `ka·a` in the rule but data gives `Dak·a`.
6. **Claude B engine queue:**
   - General `have` roles: possession (`I have to go` still `Anga re·ang·na donga`; `you have` + object outside pins still `-ko`-marked), tense auxiliary, obligation `nangenga`.
   - General `do` as main verb (`I will do` is pinned only); `has stopped` for other subjects (`he has stopped eating` = `Ua donga`).
   - `how` by context: quantity `badita`, method `maidake` (default), condition `mai rokom`; `How much did you eat` is pinned only.
   - sov-assembly puts a bare `-a` adjective before the noun (RULE-006 confirmed violation; Claude B pushed a RULE-006 fix in `e992a3d`, re-check).
   - `phrase_maps.js` still maps old key `let us practice garo together`, stale 2026-10-16 mit·am comment.
   - From temporal handoff: no `-ko` on time words, isolated vs event `today`, parse destinations without `-chi`.
   - Compound imperatives (`Stop eating!`), `a lot of fat`.
   - `very_hot_construction.test.js` guards assert no `·ko`; with no-dot `-ko` they now pass trivially, should check bare `ko`.
   - `-ode`/`-gen`/aspect, `-jaha`/`-manaha` negation, classifier variants, question forms (R-a, R-c, R-f, R-g): see the 2026-10-21 scoping in NV-180/181; read each rule's exact scope first.
7. **Derived, not separately validated:** `let's eat food` = `Hai mi cha·na`, `let us eat` = `Hai cha·na`.
8. **15 orphan rule examples:** see Phase 2 triage doc and conformance report; add rows only where a relay citation exists.
9. **Phase 2 counts, not re-measured:** 596 rows without confidence; 583 verified_high rows without a citation token; 244 shipped primaries resting only on `ocr_flagged` rows; tie keys with more than one verified garo; about 50 exact english+garo duplicate pairs.
10. **Do-o:** rule says `do·a` = bird and `do·o` = chicken; live data uses `do·o` for both; needs native re-validation. PO confirmed `do·o` = chicken and `da·o` = now are distinct words.
11. **Housekeeping:** `npm run lint` 9 unused-variable errors; `npm audit` 5 moderate dev vulnerabilities; rule catalogue dangling dependency IDs and schema gaps; `THANGSENG_NATIVE_VALIDATION.md` has two entries numbered NV-176; `da·o` = now is only `unverified` in master (PO can promote).

## Standing rules
- Evidence-first: never infer linguistic facts. Label provenance. Retain-and-tag superseded or weaker candidates. A policy hold is also tagged superseded, with the reason stated.
- Fix stale `phrase_maps` values directly, never allowlist them. `known_dictionary_conflicts.json` is lowercase english keys for intentional cited divergences (insert, do not re-sort).
- Tag the alternate `variant/VERIFIED/HIGH`; a variant row with the same english key as a verified row trips Check C unless allowlisted. A `corrections.json` pin that differs from the master primary trips Check F.
- A data-only pin leaks into sentence composition. Test sentence output before shipping an isolated-word pin; a new exact-phrase row changes `method` in tests that used the sentence as a sov-assembly guard.
- A rule example's English gloss must match a runtime row, or `--write-baseline` records a mismatch. Fix the example instead.
- A superseded note must start with the literal word "SUPERSEDED".
- Gate order: `npm ci`; `node prepare-data.js`; `node test-dictionary.js`; `node repository-intelligence.js`; `node scripts/resync-stale-overrides.mjs`; `node --test tests/unit/*.test.js`; `node scripts/runtime-error-sweep.mjs`; `node scripts/audit-rule-conformance.mjs --write-baseline` (after rule or example changes); `npx vite build`; `git checkout dist/index.html`. Read real exit codes and counts; a `| tail` hides failures.
- Check actual file text before search-and-replace edits. For master edits, confirm the JSON roundtrips (indent 2) before rewriting. Rule YAML extras go under `po_updates:`.
- WORKSTATE: write `claude_a.next_action`, demote the prior to `next_action_prior_<date>`, then a second commit sets `repository.head` (line 2) to the content commit. Claude B also writes there: fetch and rebase before pushing, then re-run the gate.
- PAT: use only a token T pastes in the current session (Contents read/write on `pzrjv4sfj5-prog`). Push with a one-shot `-c http.extraheader="Authorization: Basic ..."`, never in a file or git config. Keep the clone until the push is verified (`origin` equals local), then delete it and ask T to rotate the token.
- The sandbox filesystem can reset between turns; re-clone if `/home/claude/repo` is missing. `translate()` is async and returns `{ garo, method }`.
- Token discipline: lead with the result, do not restate background, do not re-test unchanged things.

## Exact next step
1. Re-sync: clone, `npm ci`, `node prepare-data.js`, `git log` against origin/main, read `.ai/WORKSTATE.yaml` `claude_a.next_action`, run the gate, confirm nothing changed (Claude B may have pushed).
2. Ask T for a fresh PAT with write access if anything needs pushing.
3. With T's guidance take one: log Thangseng's answers for ties 1-5 and bare "not" as NV-182; resolve `bon·kamgipa` / `ja·mangipa`; get the PO decisions on `-chim`; read Claude B's handoffs for anything pushed since.

## On resume
Treat this document as ground truth. Re-sync against actual repo state before acting. Do not re-open settled decisions: raka dot on classifiers, RULE-007 forms, `stop!`, `rarasa` withdrawn, RULE-029 `-bo` rules, `-rang` closed, `-o` vs `-de`, the `-a`/`-gipa` adjective rule, `mitam` = some / `mitim` = fat, `miko` (no raka before `-ko` on any object), present perfect = Simple Past, `maidake` = how default, `cha·jokma` primary for lunch.
