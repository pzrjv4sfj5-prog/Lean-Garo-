# MIGRATION DOCUMENT: Claude A, Lean-Garo, 2026-10-17

**Project identity**
- Lean-Garo is a Garo dictionary and English-to-Garo translation engine. Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`, publicly readable (cloning needs no token).
- Roles: T is the Project Owner (PO). Claude A handles data, rules, audits. Claude B handles engine fixes. Thangseng is the native validator, reached through the Tridip relay.

**Current state (verified at the end of this session)**
- origin/main was `c18eee8` before this document's commit; this document and a WORKSTATE update land on top of it. WORKSTATE `repository.head` names the last content commit (a deliberate pre-commit pointer).
- Full gate at `c18eee8`, every step exit 0: dictionary 8896/8896 entries, 9/9 corrections; repository-intelligence 0 new violations (1321 allowlisted conflict keys); resync-stale-overrides clean; unit tests 497/497; runtime sweep 15843 calls, 0 errors; rule conformance 63/102 match, 16 orphans, 0 unbaselined mismatches (report-only); vite build OK. Master has 10015 rows.
- Both PATs pasted this session are in chat history. They must be rotated.

**Done this session**
- Phase 3 handoff to Claude B (`docs/HANDOFF_CLAUDE_B_20261016.md`) and Phase 2 triage (`docs/PHASE2_TIE_AND_ORPHAN_TRIAGE_20261016.md`). Claude B has since done R1-R8, RULE-052 slowly, R-d, R-b bare imperative (their notes: `docs/CLAUDE_B_SESSION_MIGRATION_20261016.md`).
- Extractor fix in `scripts/audit-rule-conformance.mjs` (PO approved): splits `X / Y` pairs, strips observed English lead-ins. Orphans 23 -> 16 after later fixes.
- RULE-007 closed (NV-165, PO relay of Thangseng's final validation): let's eat = `Hai cha·na`; let's drink = `Hai ringna`; let's play = `Hai kal·na`; let's sit = `Hai asongna` (unchanged). `Hai cha·bo` = "go and eat" (imperative), NOT hortative. `cha·ha` = "I ate", PO confirmed it is shorthand for the verified `Anga cha·aha` (NV-089). Reverses NV-083 and the July 3-5 `-bo`-hortative reading. Old rows retained and tagged superseded. Added row `go and eat` = `Hai cha·bo`. RULE-007 rewritten, RULE-029 flagged.
- NV-166: `stop!` = `Sengbo` or `Damo`. Shipped primary `Sengbo!` (ordering choice, PO listed it first), `Damo!` variant. Reverses NV-089's rejection of Sengbo for the imperative only; `stop` = `dontonga` stays the verb.
- NV-167 / NV-168: `mit·am` = fat (confirmed three times; applied by Claude B in `d2250a7`). `be'enan` = `be·enan` confirmed. `mitim` was a misspelling of `mit·am`. `rarasa` = "a lot", same as `bang·a`. New verified rows for the key `a lot`: `bang·a` (primary). Pork-fat sentence primary stays `Wak be·en mit·am bang·a`.
- **`rarasa` is withdrawn from runtime by PO instruction ("don't use rarasa")**: the two rarasa rows are tagged superseded as a policy hold (not a correction), retained, not compiled; `rarasa` is absent from every compiled file. Re-promote them only if the PO says so.
- Confirmed no duplicates in the keys touched (let's eat/drink/play/sit, stop!, a lot, the pork sentence).

**Held, with reasons**
- Everything below waits on PO or Thangseng input; nothing is blocked by a bug in my lane.
- Spelling variants (nokkimao/kokkimao, Uo/Ua, Bao/Bano, a'bil/Bol, Antichi/Bajalchi, mewa/bite): PO ruled to ignore until something major.
- Rule-conformance gate stays report-only until Phase 5.
- Raka dot: mang and king dot:true, sak and rong no-dot. mang has flipped four times; do not touch without a direct citation.

**Open issues (kept open for next session)**
1. **Questions only the PO can answer:** Garo for "some" (old gloss withdrawn when mit·am became "fat"); Garo for bare "not"; is `search for him!` = `Biko sandibo` correct as cited (add as a row?); should `Da·mo, anga mi cha·kuna` ("Wait, let me eat.", RULE-036 orphan) become a dictionary row?
2. **Claude B's queue for A** (WORKSTATE `claude_a.next_action_unprocessed_20261016` and `...B`, docs `CLAUDE_B_HANDOFF_20261016B_phase3_done.md`): R-a (-jaha/-manaha, `does not`), R-c (-ode, -gen, aspect), R-f classifier variants, R-g question forms need the rules' exact scope read first. Also `-rang` plural general generation (3 PO answers needed per Claude B), and Q3 adjective position (Thangseng said he will send examples, needs a reminder relay; do not build engine support until they arrive).
3. **Not separately validated, derived from the RULE-007 ruling:** `let's eat food` = `Hai mi cha·na` and `let us eat` = `Hai cha·na`.
4. **RULE-029:** its claim that `-bo` serves both imperative and hortative functions has no example left; flagged, needs a native check before the description changes.
5. **Not yet sent to Thangseng (one relay batch):** five uncited ties (agree, brave, fever, greedy, horn), three possible sense splits (last, outside, how), the Q3 reminder, plus the RULE-029 question. Details: Phase 2 triage doc.
6. **16 real orphan rule examples** (listed in the Phase 2 triage doc and the conformance report); add rows only where a relay citation exists.
7. **Phase 2 cleanup counts from the previous migration, not re-measured this session:** 596 rows without confidence, 583 verified_high rows without a citation token, tie keys with more than one verified garo, 244 shipped primaries resting only on `ocr_flagged` rows. About 50 case-insensitive exact english+garo duplicate pairs exist in master (mostly legacy superseded + verified); a broader dedup was not done.
8. **Engine gaps for Claude B:** compound imperatives (`Stop eating!` -> `dontonga cha·enga`), `a lot of fat` -> `[UNKNOWN] [UNKNOWN] [UNKNOWN] mit·am`.
9. **Do-o:** the rule claims `do·a` = bird and `do·o` = chicken, but live verified data uses `do·o` for both; needs native re-validation.
10. **Housekeeping:** `npm run lint` fails with 9 unused-variable errors; `npm audit` shows 5 moderate dev vulnerabilities; rule catalogue has dangling dependency IDs and schema gaps.

**Standing rules**
- Evidence-first: never infer linguistic facts. Label provenance. Keep superseded or weaker candidates rather than deleting them (retain-and-tag). A policy hold is also tagged superseded, with the reason stated.
- A direct PO statement in chat counts as a citation. When it reverses an earlier citation, record the full chain (new NV entry plus a pointer line under the old one).
- Fix stale `phrase_maps` values directly, never allowlist them. `known_dictionary_conflicts.json` (a list of lowercase english keys) is only for intentional, cited divergences, and keys must be lowercase.
- Primary vs variant: tag the alternate `variant/VERIFIED/HIGH`; when the choice is an ordering choice rather than a native ranking, say so in the note.
- Gate order: `node prepare-data.js`, `node test-dictionary.js`, `node repository-intelligence.js`, `node scripts/resync-stale-overrides.mjs`, `node --test tests/unit/*.test.js`, `node scripts/runtime-error-sweep.mjs`, `node scripts/audit-rule-conformance.mjs --write-baseline` (after rule or example changes), then `npx vite build`; run `git checkout dist/index.html` afterwards. Read real exit codes and counts (a `| tail` hides failures). Run `npm ci` first in a fresh clone.
- Before search-and-replace edits, check the actual current file text. Master edits: confirm the JSON roundtrips (indent 2) before rewriting.
- WORKSTATE: write the `claude_a.next_action` entry, demote the prior one to `next_action_prior_<date>`, and set `repository.head` to the content commit. Claude B also files notes there; resync before writing.
- Never embed a PAT in any file or git config. Use only a token T pastes in the current session; it needs Contents read/write on the `pzrjv4sfj5-prog` repo (a `t-barman` token was read-only and got a 403). Delete the local clone afterwards and ask T to rotate the token.
- The sandbox filesystem can reset between turns; re-clone if `/home/claude/repo` is missing.
- Token discipline: lead with the result, do not restate background, do not re-test unchanged things.

**Exact next step**
1. Re-sync: clone, `npm ci`, `git log` against origin/main, read `.ai/WORKSTATE.yaml` `claude_a.next_action`, run the gate, and confirm nothing changed (Claude B may have pushed).
2. Ask T for a fresh PAT with write access.
3. With T's guidance, take one: (a) get T's answers to the four PO questions in open issue 1 and apply them; (b) draft the Thangseng relay batch (open issue 5); (c) read Claude B's handoff docs and scope R-a/R-c/R-f/R-g.

**On resume:** treat this document as ground truth. Re-sync against the actual repo state before acting, and do not re-open settled decisions (raka dot, RULE-007 forms, stop!, mit·am, rarasa withdrawn).
