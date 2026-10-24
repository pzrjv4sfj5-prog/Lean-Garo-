# MIGRATION DOCUMENT: Claude A, Lean-Garo, 2026-10-24

Supersedes `CLAUDE_A_SESSION_MIGRATION_20261023.md`. Its Project identity, Provenance rule, Held list, Open issues 4-8 and Standing rules still apply and are carried below in short form. Resumed from that doc at 313157d.

## Project identity
- Lean-Garo: Garo dictionary and English-to-Garo engine. Repo `github.com/pzrjv4sfj5-prog/Lean-Garo-` (public read; clone needs no token). T = Project Owner (PO). Claude A = data, rules, audits. Claude B = engine. Thangseng = native validator via the Tridip relay.

## Current state
- **All pushed.** Full gate green on the last content commit: dictionary test OK, repository-intelligence 0 new violations, resync clean, unit 693/693, sweep 0 errors, conformance 76/110 (14 orphan, 0 mismatch not in baseline), vite build OK.
- Claude B's last commit is 8be7f90 (NV-189), already merged. Sync doc for B: `docs/CLAUDE_A_TO_B_SYNC_20261024.md`.

## Done this session (all pushed; logged in `docs/THANGSENG_NATIVE_VALIDATION.md`)
All entries are PO-provided or -relayed unless marked native; none is a native quote except the re-pasted NV-158 transcript.
- **Audit (no change needed):** `Am` used as "yes" in sentence rows, rules, corrections, phrase_maps: none found.
- **NV-191:** `yes (alt)` = `Am` superseded (retained). `Am(n)` = `carpet` (noun), verified_high per PO (the "(n)" was read as the noun marker). Stale `i love you` in `phrase_maps.js` fixed to `Anga nang·na ka·saa` (Rule 8).
- **NV-192 (conditional directive):** already present: `song·a`, `ka·dingsmita`, `cooking`/`cooked`/`smiled`/`I ate`/`I ate rice` pins. Added: `roa` (`to visit`, `to hang around`, `stay (alt, roa)`), `to be` = `ong·a`, pin `how many years has your stay there been?` = `Na·a uano roa badita bilsi ong·aha?`. Object incorporation: no general engine rule (only `mi` + `cha·` has evidence); handoff `CLAUDE_B_HANDOFF_20261023_object_incorporation.md`.
- **NV-193 (PO rulings):** `stay` splits: `roa` = visit / spend time / vacation / hang around; `donga` = exist / be present / reside. Engine: `translate()` routes `stay` to the visit verb only on an explicit temporary-visit cue, else `donga`. Pin `i will stay here` = `Anga iano donggen.` (engine had a wrong `-ko` on `iano`). `eaten` = `cha·jok` primary (reverses the NV-192 `cha·aha`, now `eaten (alt, formal)`); `ate` = `cha·aha`.
- **NV-194 (PO ruling):** NV-158 (direct native) is final: past wh-questions take bare `-a`. `what did you eat?` = `Na·a maiko cha·a?`, `How much did you eat?` = `Na·a badita cha·a?` (by analogy). NV-121 and NV-182 `-aha` rows kept as `(alt, -aha)`; the `bang·e` variant as `(alt, bang·e)`. Claude B directive "never bare `-a` in did-questions" rescinded. RULE-048 YAML and catalogue examples updated.
- Tests added: `nv192_tense_pins`, `nv193_stay_eaten_rulings`, `nv194_wh_past_bare_a`; NV-181 `how much` case updated.

## Rule-generalization check
This session closed 5 vocabulary / pin items and produced no new rule YAML. Rule changes: RULE-048 examples updated (NV-194). Engine rule (B's area, A specified): `stay` sense routing by cue (NV-193, documented in NV-193 and the B sync doc, not yet a RULE-xxx YAML). **Flag to PO:** two sessions in a row now are mostly pins; the `stay` routing and the object-incorporation rule (scoped to `mi` + `cha·`) both deserve a RULE entry once more native examples exist. Not yet at the three-session threshold.

## Duplicate representation check: PASS
Checked `master_dictionary.json`, `src/data/corrections.json`, `src/data/phrase_maps.js`, `src/data/irregular_verbs.json`, `src/compiled_dict.json`, `src/compiled_dict_alternates.json`, `src/data/category_index.json`. Old values that remain, by design: `Na·a maiko cha·aha?` and `Na·a badita cha·aha?` only under the alt keys `what did you eat? (alt, -aha)` / `how much did you eat? (alt, -aha)` in `compiled_dict.json`; `yes (alt)` only as a superseded row (and in `category_index.json` by key). `irregular_verbs.json` `eaten` = `cha·jok` agrees with the primary. No stale `ianoko donggen`, `kasa·a` or `eaten` = `cha·aha` in any runtime file.

## Runtime Handoff
- "stay" (bare key)
  Linguistic decision: two senses. Sense A: `donga` (exist / be present / reside) default. Sense B: `roa` (visit / spend time / vacation / hang around). **Default for bare key: A (`donga`), explicitly.** Reasoning: PO ruling NV-193 gives no default for a context-free `stay`; existing engine tests and NV-089-era rows use `donga`.
  Evidence: Project-Owner-directed (NV-193, not a native quote).
  Expected Garo output: `stay` = `donga`; `I stayed on vacation` -> `... roaha`; `I will stay for the holiday` -> `... rogen`; `I will stay here` = `Anga iano donggen.`
  Duplicate representations checked: files in the check above.
  Runtime locations to verify: `translationEngine.js` router (top of `translate()`), master pin row, `compiled_dict.json`.
  What A has verified: live `translate()` on the five cases above and engine tests 693/693.
  What A has NOT verified: the cue list beyond vacation / holiday; other `stay` phrasings ("stay with my uncle", "stay a week"); `-ko` on `ianoko` / `antiko` with `donga` in other sentences (one native example only).
- "eaten", "ate": `eaten` = `cha·jok` (primary, NV-193 / NV-180), `ate` = `cha·aha`. Verified live; B must not apply the NV-192 `cha·aha` strict-map.
- Past wh-questions (NV-194): bare `-a` primary; verified live for the 6 NV-158 forms + `how much`. Not verified: other verbs (`Where did you go?` gives `re·anga`, consistent, not tested against a native source).
- Object incorporation: not implemented; see the B handoff.

## Rework-prevention checklist
- Already resolved before? `-aha` vs `-a` was an open NV-158 / NV-182 conflict; now closed by NV-194. `Am` / `Oe` closed by NV-190.
- Another representation holds the old value? No (check above).
- Runtime problem rather than linguistic? The `ianoko` `-ko` on locatives is ENGINEERING / CROSS-LAYER, reported to B, only one example pinned.
- Should generalize? See Rule-generalization check.
- Asking native for something grammar already establishes? No relay sent this session.
- Over-derivation? `how much did you eat?` = `cha·a` is derived by analogy, labelled as PO-ruled, not native.
- Enough for B to reproduce? Yes: `CLAUDE_A_TO_B_SYNC_20261024.md` + the Runtime Handoff above.

## Provenance rule
PO-provided and PO-relayed answers are never native quotes. Label "Project Owner-provided" or "Project Owner-relayed, attributed to Thangseng; raw message not on file". A direct PO statement in chat counts as a citation; when it reverses an earlier one, log the reversal and keep the old row as superseded or as an `(alt)` variant.

## Held, with reasons
- Spelling variants (nokkimao/kokkimao, Uo/Ua, Bao/Bano, a'bil/Bol, Antichi/Bajalchi, mewa/bite): PO ruled to ignore. `Ua` vs `Haiwa` is a meaning distinction.
- Rule-conformance gate report-only until Phase 5. Raka dot on classifiers unchanged. `rarasa` withdrawn by PO. `-chim` NOT applied.
- Legacy source files keep old spellings; the build filters them via superseded master rows.
- `carpet` and `okay` both output `Am` by design (homograph).

## Open issues
1. **PO decision, `kina·chak·a` vs `kin·a·chak·a`:** stored as given (listen / heed advice vs old `agree`), assumed the same word.
2. **`-ko` on locatives with `donga`** (`we stay here` -> `ianoko donga`, `Do you stay here?` -> `ianoko dongama?`): native example is bare `iano`; not generalized. PO or Thangseng ruling needed; then B implements.
3. **`donga` vs `roa`** outside the cue list: cue router is narrow; more native / PO examples needed.
4. **`eaten` irregular table** `cha·jok` now agrees with the primary; `eaten (alt, formal)` = `cha·aha` retained.
5. **Thangseng, outstanding:** synonym ties 2-5 (brave, fever, greedy, horn), `ku·ra·chak·a` for agree, bare "not", `ku·chak·a` polysemy (promise / respond / confess), `on·ana` unexplained.
6. `bon·kamgipa` vs `ja·mangipa` (NV-178 vs NV-082), `ha·gat·e`, verified he/she object form, `-chim`.
7. **Claude B queue:** see `CLAUDE_B_SESSION_MIGRATION_20261024.md` and the A->B sync doc: pro-drop, `May I` / `Can I` + verb, `Is that okay?` returns bare `Am`, general `Can you eat?`, object incorporation (scoped), past-interrogative `-aha` no longer applies to wh-questions.
8. Derived, not validated: `let's eat food` = `Hai mi cha·na`. 14 orphan rule examples. Housekeeping: lint 9, npm audit 5, duplicate NV-176 entries.

## Standing rules
- Evidence-first: never infer. Label provenance. Retain-and-tag superseded candidates; give variants an `(alt, ...)` key to avoid pickPrimary ties.
- Check C counts every distinct garo per english key: allowlist the lowercase key in `known_dictionary_conflicts.json`. Fix stale `phrase_maps` / `corrections.json` values directly. `corrections.json` overrides `phrase_maps.js` and master at runtime: change all three.
- A data-only pin leaks into sentence composition; test neighbours before and after (the plain `to stay` key broke engine test 605 this session).
- Rule example glosses live in `docs/grammar_rules_structured/RULE-xxx.yaml`; the conformance audit reads those, not the catalogue.
- Gate order: `npm ci`; `prepare-data.js`; `test-dictionary.js`; `repository-intelligence.js`; `scripts/resync-stale-overrides.mjs`; `node --test tests/unit/*.test.js`; `scripts/runtime-error-sweep.mjs`; `scripts/audit-rule-conformance.mjs`; `npx vite build`, then `git checkout dist/index.html`.
- WORKSTATE: Claude B also writes there. Fetch and rebase before pushing, drop the stale pointer commit, re-run the gate, then set `repository.head` (line 2) in a second commit.
- Git in the sandbox needs a repo-local identity (`Claude A <claude-a@users.noreply.github.com>`).
- PAT: use only a token T pastes in the current session; one-shot `-c http.extraheader`, never in a file or git config; verify `origin` equals local; delete the clone; ask T to rotate.
- `translate()` is async and returns `{ garo, method }`. Token discipline: lead with the result, do not restate background, do not re-test unchanged things.

## Repository status at close
- HEAD: see `.ai/WORKSTATE.yaml` line 2 `head:` (pointer commit on top).
- origin/main match: verified after push (fetch, then compare); fresh-clone gate re-run after the push.
- Clean tree, dist restored, no local-only commits. WORKSTATE `claude_a.next_action_claude_a_20261024` added. SESSION_BOOTSTRAP.md not updated (no new permanent rule).
- Token: T pasted a PAT in chat several times; used only as a one-shot header, not in any file or git config. **T should rotate it.**

## Exact next step
1. Start a new conversation and paste this doc. Re-sync: clone, `npm ci`, `node prepare-data.js`, `git log` against origin/main, read WORKSTATE, run the gate (Claude B may have pushed).
2. Ask T for a fresh PAT only if something needs pushing; fetch and rebase first.
3. With T: rule on open items 1-3; log Thangseng's answers for item 5; consider a RULE entry for `stay` routing and object incorporation.

## On resume
Treat this doc as ground truth, re-sync with the actual repo state, do not re-litigate NV-190 (`Am` / `Oe`), NV-193 (`stay`, `eaten`) or NV-194 (NV-158 final), and continue from the Exact next step.
