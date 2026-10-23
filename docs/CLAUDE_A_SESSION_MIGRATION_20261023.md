# MIGRATION DOCUMENT: Claude A, Lean-Garo, 2026-10-23

Supersedes `CLAUDE_A_SESSION_MIGRATION_20261022.md`. Its Project identity, Provenance rule, Held list, Open issues 1-2 and 4-8 and Standing rules still apply and are carried below in short form.

## Project identity
- Lean-Garo: Garo dictionary and English-to-Garo engine. Repo `github.com/pzrjv4sfj5-prog/Lean-Garo-` (public read; clone needs no token). T = Project Owner (PO). Claude A = data, rules, audits. Claude B = engine. Thangseng = native validator via the Tridip relay.

## Current state
- **All pushed** (see Repository status). Full gate green on the last content commit: dictionary 8931/8931, repository-intelligence 0 new violations, resync clean, unit 651/651, sweep 0 errors, conformance 76/110 (14 orphan, 0 mismatch not in baseline), vite build OK.

## Done this session (all pushed)
All entries are PO-provided or -relayed; none is a native quote (raw messages not on file). Logged in `docs/THANGSENG_NATIVE_VALIDATION.md`.
- **NV-187:** pins `Can you give me water?` (pronoun dropped primary, explicit variant `Na·a angna chi on·ana man·genma?`) and `May I sit?` / `May I sit down?`; pro-drop in requests as a dated note in RULE-004; B handoff `HANDOFF_CLAUDE_B_20261022_prodrop_may_i.md`. `sit` and `sit down` share the verb `asong`.
- **NV-188:** Thangseng: no distinction between `may i sit` and `may i sit down`. PO directive: drop `asongboma`; only `Anga asongna man·genma?` remains. Row removed.
- **NV-189:** pins `Yes, of course.` = `Oe, man·genba.`; `Can you lift the box?` = `Na·a boxko de·na man·genma?`; `Do you love me?` = `Na·a angna ka·saama?`; `Yes, I love you.` = `Oe, anga nang·na ka·saa.`. Lexicon: `man·genba` = of course, `de·a` = to lift, `namengaba` = `i am fine (affirmative response)`. `that (default)` = `Ua`, `that (far/there, distance emphasised)` = `Haiwa` (data only).
- **NV-190 (PO rulings):** (1) spelling follows the native: `man·genma` / `man·genba`, reversing NV-185 and restoring NV-103; 11 rows respelled, old `man·gengma` rows kept superseded; (2) `Am` = ok / okay, `yes` = `Oe` (NV-095 `Am` row superseded); (3) love = `ka·saa` (`ka·sa·a` row superseded).
- Tests: `tests/unit/nv187_po_pins.test.js`, `nv189_po_pins.test.js`; nv183 updated to the native spelling.

## Provenance rule
PO-provided and PO-relayed answers are never native quotes. Label "Project Owner-provided" or "Project Owner-relayed, attributed to Thangseng; raw message not on file". A direct PO statement in chat counts as a citation; when it reverses an earlier one, log the reversal and keep the old row as superseded.

## Held, with reasons
- Spelling variants (nokkimao/kokkimao, Uo/Ua, Bao/Bano, a'bil/Bol, Antichi/Bajalchi, mewa/bite): PO ruled to ignore. (`Ua` vs `Haiwa` is a meaning distinction, not a spelling variant.)
- Rule-conformance gate report-only until Phase 5. Raka dot on classifiers: mang dot:true, king dot:true, sak and rong no dot; do not touch without a direct citation.
- `rarasa` withdrawn by PO. `-chim` NOT applied (NV-180 item 5; `dongachim` exact pin only).
- Legacy source files (`garo_dictionary.json`, `final_entries.json`, `sentences200.json`) keep old spellings; the build filters them via superseded master rows. Not edited.

## Open issues
1. **PO decision, NV-158 vs NV-182:** direct NV-158 has verified bare `-a` past wh-questions; NV-182 says bare `-a` is present only. Rows untouched; only the `how much` pin follows NV-182.
2. **PO decision, `kina·chak·a` vs `kin·a·chak·a`:** stored as given, assumed the same word.
3. **Check after NV-190 (new):** `Am` was `yes` since NV-095; sentence rows or rules that used `Am` for yes (not audited) may now disagree with `yes` = `Oe`. `Is that okay?` returns `Am` (pre-existing leak). `i love you` in `phrase_maps.js` still holds stale `Ang·a nangna kasa·a.` (runtime returns `Anga nang·na ka·saa`). RULE-046 historic note shows `kasa·a`. `on·ana` unexplained. NV-189 pins have no raw native quote.
4. **`ku·chak·a`** also = native-confirmed `promise` (NV-080); kept as polysemy.
5. **Thangseng, outstanding:** synonym ties 2-5 (brave, fever, greedy, horn), `ku·ra·chak·a` for agree, bare "not", and when (if ever) `asongna man·genma?` is not the right form for `may i sit`.
6. `bon·kamgipa` vs `ja·mangipa` (NV-178 vs NV-082), `ha·gat·e`, verified he/she object form (PO), `-chim` decisions.
7. **Claude B queue:** pro-drop acceptance and primary output; `May I` / `Can I` + verb = `<verb>na man·genma?` (`Can I sit?` is still wrong at runtime); `Ua` default vs `Haiwa` on distance; `sit` / `sit down` stem; past-interrogative `-aha` (held until item 1 is ruled); general `Can you eat?`; `have` / `do` / `how` by context. See `HANDOFF_CLAUDE_B_20261022_prodrop_may_i.md` (now uses `man·genma`).
8. Derived, not validated: `let's eat food` = `Hai mi cha·na`. 14 orphan rule examples. Housekeeping: lint 9, npm audit 5, duplicate NV-176 entries.

## Standing rules
- Evidence-first: never infer. Label provenance. Retain-and-tag superseded candidates (a superseded note starts with "SUPERSEDED"); a restored row's note starts with "RESTORED".
- Check C counts every distinct garo per english key, superseded included: allowlist the lowercase key in `known_dictionary_conflicts.json` (insert, do not re-sort). Fix stale `phrase_maps` / `corrections.json` values directly, never allowlist. `corrections.json` overrides `phrase_maps.js` and master at runtime: change all three (this session `yes` still returned `Am` until `corrections.json` was fixed).
- Old spellings returning from untagged legacy sources are filtered by a superseded master row with that exact old value.
- A data-only pin leaks into sentence composition; test neighbors before and after.
- A rule example's English gloss must match a runtime row. Rule YAML extras go under `po_updates:`.
- Gate order: `npm ci`; `prepare-data.js`; `test-dictionary.js`; `repository-intelligence.js`; `scripts/resync-stale-overrides.mjs`; `node --test tests/unit/*.test.js`; `scripts/runtime-error-sweep.mjs`; `scripts/audit-rule-conformance.mjs --write-baseline`; `npx vite build`, then `git checkout dist/index.html`.
- For master edits confirm JSON roundtrips (indent 2) before rewriting. Check actual file text before search-and-replace. A blanket respelling must be checked against other lexemes sharing the spelling.
- WORKSTATE: write `claude_a.next_action`, demote the prior to `next_action_prior_<date>`, second commit sets `repository.head` (line 2). Claude B also writes there: fetch and rebase before pushing, then re-run the gate.
- PAT: use only a token T pastes in the current session; one-shot `-c http.extraheader`, never in a file or git config; verify `origin` equals local; delete the clone; ask T to rotate.
- `translate()` is async and returns `{ garo, method }`. Token discipline: lead with the result, do not restate background, do not re-test unchanged things.

## Repository status at close
- HEAD: see `.ai/WORKSTATE.yaml` line 2 `head:` (pointer commit on top).
- origin/main match: verified after push (fetch, then compare); fresh-clone gate re-run after the push.
- git status clean, dist restored, no local-only commits. WORKSTATE `claude_a.next_action` updated. SESSION_BOOTSTRAP.md not updated (no new permanent rule beyond the lines above).
- Token: T pasted a PAT in chat for the whole session; used only as a one-shot header, not in any file or git config. **T should rotate it.**

## Exact next step
1. Start a new conversation and paste this doc. Re-sync: clone, `npm ci`, `node prepare-data.js`, `git log` against origin/main, read WORKSTATE `claude_a.next_action`, run the gate (Claude B may have pushed).
2. Ask T for a fresh PAT only if something needs pushing; fetch and rebase first.
3. With T: audit open item 3 (`Am` as yes in sentences), then rule on open items 1-2; log Thangseng's answers for item 5.

## On resume
Treat this doc as ground truth, re-sync with the actual repo state, do not re-litigate NV-185/NV-190 spelling or the `Am` / `Oe` ruling, and continue from the Exact next step.
