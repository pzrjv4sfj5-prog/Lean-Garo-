# MIGRATION DOCUMENT: Claude A, Lean-Garo, 2026-10-22

Supersedes `CLAUDE_A_SESSION_MIGRATION_20261021.md`. Its Project identity, Provenance rule, Held list, Open issues 2-11 and Standing rules still apply and are carried below in short form.

## Project identity
- Lean-Garo: Garo dictionary and English-to-Garo engine. Repo `github.com/pzrjv4sfj5-prog/Lean-Garo-` (public read; clone needs no token). T = Project Owner (PO). Claude A = data, rules, audits. Claude B = engine. Thangseng = native validator via the Tridip relay.

## Current state
- **All pushed.** origin/main = `a792232` (PAT supplied by T this session, one-shot header, push verified: origin equals local). The 12 session commits (NV-182..NV-186, this doc, WORKSTATE pointers) sit on `df5db3e`; this doc's status edit lands as one more commit on top. T should rotate the token.
- Full gate green on the last content commit: dictionary 8926/8926, 9/9 corrections; repository-intelligence 0 new violations (cross-table, self-consistency, placeholder, cascade, modifier+noun); resync clean; unit 640/640; sweep 15892 calls 0 errors; conformance 76/110 (14 orphans, 0 unbaselined, report-only); vite build OK.

## Done this session (all pushed)
All entries are Project Owner-provided or -relayed; none is a native quote (raw messages not on file). Logged in `docs/THANGSENG_NATIVE_VALIDATION.md`.
- **NV-182:** `How much did you eat?` = `Na·a badita cha·aha?`, variant `Na·a badita bang·e cha·aha?` (replaces `cha·a` / `cha·gimin`; RULE-048 example updated). `kina·chak·a` = listen / heed advice; `ku·chak·a` = respond / confess; both superseded as `agree` (`agree` now `ku·ra·chak·a`, uncited). B handoff `docs/HANDOFF_CLAUDE_B_20261021_past_interrogative_aha.md`: past "did" questions take `-aha` / `-jok`, never bare `-a`.
- **NV-183:** 9 exact-phrase pins (`seata`, `tuaha`, `badia room o tusia`, `namen seataha`, `man·gengma`, `dongachim`, `sala` x2, `tangkako gama`), test file `tests/unit/nv183_po_pins.test.js`. `pay` = `gama` (superseded uncited `bet·ton`), `drive` / `pull` = `sala` (superseded uncited `sal·a` Pull variant), `well (adverb)` = `namen`. Live effect: `I pay` = `Anga gama`, `pull!` = `salbo`.
- **NV-184:** raka audit. `sea` / `seata` / `seataha` no raka (exam pin = `Bia porikka namen seataha.`). `sala` no raka. `man·a` takes a raka. Old spellings kept as superseded rows so legacy source copies are filtered from alternates.
- **NV-185:** `sala` and `sal·a` are distinct words. "Can you?" = `man·gengma`: pins `can you help me`, `can you write the exam`; 7 master rows; `phrase_maps.js` water. Reverses the NV-103 direct-citation spelling `man·genma` by PO ruling.
- **NV-186:** `sal·a` (noun) = broom; `Broom` row now cited.

## Provenance rule
PO-provided and PO-relayed answers are never native quotes. Label "Project Owner-provided" or "Project Owner-relayed, attributed to Thangseng; raw message not on file". A direct PO statement in chat counts as a citation; when it reverses an earlier one, log the chain with a new NV entry plus a pointer under the old one.

## Held, with reasons
- Spelling variants (nokkimao/kokkimao, Uo/Ua, Bao/Bano, a'bil/Bol, Antichi/Bajalchi, mewa/bite): PO ruled to ignore.
- Rule-conformance gate report-only until Phase 5. Raka dot on classifiers: mang dot:true, king dot:true, sak and rong no dot; do not touch without a direct citation.
- `rarasa` withdrawn by PO. `-chim` NOT applied (NV-180 item 5; the NV-183 letter pin writes it fused, `dongachim`, an exact phrase only).
- Legacy source files (`garo_dictionary.json`, `final_entries.json`, `sentences200.json`) keep old spellings; the build filters them via superseded master rows. Not edited.

## Open issues
1. **PO decision, NV-158 vs NV-182:** NV-158 (direct Thangseng transcript) has verified bare `-a` past wh-questions (`Sawa cha·a?`, `Na·a maiko cha·a?`, `Na·a bano cha·a?`). NV-182 says bare `-a` is present only. Rows untouched; only the `how much` pin follows NV-182. B was told not to regress NV-158.
2. **PO decision, `kina·chak·a` vs `kin·a·chak·a`:** NV-182 stored `kina·chak·a` as given; the old agree row was `kin·a·chak·a`. Assumed the same word.
3. **PO decision, permission rows:** `may i sit`, `may i sit down?`, `permission request` still use `mangengma` (no dot; `may i sit` is native-verified 2026-08-22). `mangenva` (`yes, of course`) untouched.
4. **`ku·chak·a`** also = native-confirmed `promise` (NV-080); kept as polysemy.
5. **Thangseng, outstanding:** synonym ties 2-5 (brave: pa·a / sang·chak·a; fever: ding·du·a / han·ding·a / jom·a; greedy: mat·u·a / mik·bok·a / mik·ni·a; horn: a·du·ri / sing·ga), `ku·ra·chak·a` for agree, and bare "not". Tie 1 partly answered by NV-182.
6. `bon·kamgipa` vs `ja·mangipa` (NV-178 vs NV-082), `ha·gat·e`, verified he/she object form (PO), `-chim` decisions (fused vs free-standing, "no longer", `Kataha.chim` raka, plural vs `-rang`, `Dak·a` vs `ka·a`).
7. **Claude B queue:** everything in the 20261021 doc item 6, plus the past-interrogative `-aha` rule (handoff above, held until item 1 is ruled), general `Can you eat?` (`Na·a cha·a`, engine gap), `have`/`do`/`how` by context.
8. Derived, not validated: `let's eat food` = `Hai mi cha·na`. 15 orphan rule examples (14 after this session). Phase 2 counts not re-measured. `do·o` vs `do·a`. Housekeeping: lint 9, npm audit 5, duplicate NV-176 entries.

## Standing rules
- Evidence-first: never infer. Label provenance. Retain-and-tag superseded candidates (a superseded note must start with "SUPERSEDED"); a policy hold is also tagged superseded.
- Check C counts every distinct garo per english key, superseded included: allowlist the lowercase key in `known_dictionary_conflicts.json` (insert, do not re-sort). Fix stale `phrase_maps` values directly, never allowlist. A pin differing from the master primary trips Check F.
- Old spellings returning from untagged legacy sources are filtered by adding a superseded master row with that exact old value.
- A data-only pin leaks into sentence composition; test neighbors before and after (this session: `pay`, `pull!`).
- A rule example's English gloss must match a runtime row. Rule YAML extras go under `po_updates:`.
- Gate order: `npm ci`; `prepare-data.js`; `test-dictionary.js`; `repository-intelligence.js`; `scripts/resync-stale-overrides.mjs`; `node --test tests/unit/*.test.js`; `scripts/runtime-error-sweep.mjs`; `scripts/audit-rule-conformance.mjs --write-baseline` (after rule or example changes); `npx vite build`; `git checkout dist/index.html`. Read real exit codes and counts. The shell is `sh`: no `PIPESTATUS`.
- For master edits confirm JSON roundtrips (indent 2) before rewriting. Check actual file text before search-and-replace. A blanket "remove every form X" must be checked against other lexemes sharing the spelling (`sal·a` = broom / east / sunrise).
- WORKSTATE: write `claude_a.next_action`, demote the prior to `next_action_prior_<date>`, second commit sets `repository.head` (line 2). Claude B also writes there: fetch and rebase before pushing, then re-run the gate.
- PAT: use only a token T pastes in the current session; push with a one-shot `-c http.extraheader="Authorization: Basic ..."`, never in a file or git config; verify `origin` equals local; delete the clone; ask T to rotate.
- `translate()` is async and returns `{ garo, method }`. Token discipline: lead with the result, do not restate background, do not re-test unchanged things.

## Repository status at close
- HEAD: see `.ai/WORKSTATE.yaml` line 2 `head:` (pointer commit on top).
- origin/main match: **YES**, verified after push (`git fetch` then `git rev-parse`); fresh-clone gate re-run below.
- git status: clean. Dist restored. No local-only commits.
- WORKSTATE.yaml `claude_a.next_action`: updated.
- SESSION_BOOTSTRAP.md: **not updated** (no new permanent rule beyond the standing-rule lines above; add them if T wants them there).
- Native-validation status: NV-182..NV-186 are PO-provided only; open items 1-6 above.
- Runtime handoff: B handoff `HANDOFF_CLAUDE_B_20261021_past_interrogative_aha.md` (hold until open item 1 is ruled). No other engine changes.
- Token: T pasted a PAT in chat; it was used only as a one-shot header and is not in any file or git config. **T should rotate it.**

## Exact next step
1. Start a new conversation and paste this doc. Re-sync: clone, `npm ci`, `node prepare-data.js`, `git log` against origin/main, read WORKSTATE `claude_a.next_action`, run the gate (Claude B may have pushed).
2. Ask T for a fresh PAT only if something needs pushing; fetch and rebase first.
3. With T: rule on open items 1-3; log Thangseng's answers for ties 2-5 and bare "not".

## On resume
Treat this doc as ground truth, re-sync with actual repo state, do not re-open settled decisions (raka classifiers, `-ko` no raka, present perfect = simple past, `miko`, `maidake` default, `cha·jokma` lunch primary, `sala` vs `sal·a` distinct, `sea` no raka, `man·a` raka, `man·gengma` = can you).
