# Claude B session migration, 2026-10-16 (paste this to resume)

**Project:** Lean-Garo- (English -> Garo translator). Claude B = engine lane. Claude A = content/data lane. Project Owner (PO) relays Thangseng (native speaker).
**State:** repo `pzrjv4sfj5-prog/Lean-Garo-`, branch main. Content head = the commit named `Claude B: Phase 3 remainder ...` rebased on A's `42bffed`; resync with `git log` first, do not trust hashes here. Gate green: dictionary 9/9, repository-intelligence 0 new violations, unit 497/497, runtime sweep 0 errors, conformance report-only 62/102, 16 orphan, 0 new mismatches, vite build ok, `git checkout dist/index.html` after.
**Push status:** PAT in chat returned 401 (revoked). If commits are not on origin, push needs a fresh fine-grained PAT (Contents RW). Never embed a PAT in the remote URL; scrub after each push. Patch backup: claude_b_phase3.patch (chat attachment).

## Done this session (engine only unless noted)
R1 teens lowercase unless standalone/sentence-initial (`achak mang·chi·sa`, bare `Chi·sa`); R2 `N persons` routed as `N people`; R3 unresolved capitalised name left as written; R4 bare passthrough returns input, conf 0, `unresolved`; R5 stripped copula/demonstrative caps conf 0.5 + `droppedWords`; R6/R7 sov-assembly capital on first word only; R8 he/she -> Ua in constructed output (docs/PRONOUN_HE_SHE_POLICY_20261016.md); RULE-052 `slowly` bare before verb, no -ko, objects kept; R-d determiner-led multi-word verb lemmas excluded (fixes `I am not going to the market`); R-b bare `verb!` -> -bo (`cook!` -> `Song·bo`), exact rows untouched.
Data on PO direct statement (chat 2026-10-16): mit·am = fat. 'Some'/mit·am row superseded, `fat`=mit·am verified_high added, phrase_map `some` removed (some is now an honest gap).
Tests: tests/unit/handoff_20261016_runtime_bugs.test.js. Handoffs: docs/CLAUDE_B_HANDOFF_20261016B_phase3_done.md, docs/CLAUDE_B_HANDOFF_20261016_mitam_pork_fat_conflict.md (the latter is partly superseded: PO has now said mit·am = fat).

## Held / open
- PO: `-rang` plural NOT built. Ruling (Thangseng 2026-09-30): any countable noun takes -rang (ki·taprang, chattrorang, man·derang, Bi·sarang). Waiting on 3 answers: countable-only (English plurals only), order after "many" (QUANTITY+NOUN cited), leave counted nouns (`two dogs`) alone.
- Q3 adjective position in noun phrases: Thangseng said "depends on the sentence", examples promised, reminder drafted for PO to send. Plural sub-question unanswered. Do not build.
- Claude A needed: Garo for `some` and bare `not`; R-i cited `Da·mo, anga mi cha·kuna` has no data row; `stop!`=Sengbo, `search for him!`=Biko sandibo; R-a (-jaha/-manaha, `does not`), R-c (-ode, -gen, aspect), R-f classifier variants, R-g question forms; rarasa spelling and primary form of the second pork-fat phrase `Wak be'enan mitim rarasa`.
- Casing in grammar-assembly (`Anga Re·anggen`): lowercasing breaks 37 tests, left to A/PO.
- RULE-029: A flagged that -bo is no longer a hortative; my R-b only uses -bo for bare imperatives (4 verb roots on file). Re-check if A changes RULE-029.
- Not for B: R9 why/because collision, R10 hundred, raka dot (mang/king settled), spelling variants.

## Standing rules
Evidence-first, never infer linguistic facts; engine-only unless PO directs otherwise; fix stale phrase_maps directly, no allowlists; gate order: `node prepare-data.js`, `node test-dictionary.js`, `node repository-intelligence.js`, `node scripts/resync-stale-overrides.mjs`, `node --test tests/unit/*.test.js`, `node scripts/runtime-error-sweep.mjs`, `node scripts/audit-rule-conformance.mjs`, `npx vite build`, then `git checkout dist/index.html`. Scripts run from repo root (test-dictionary.js, repository-intelligence.js, prepare-data.js are in root). Redirect gate output to a file and `iconv -c -t ascii` (some outputs are non-UTF-8). Update WORKSTATE next_action, demote prior, set head to the content commit.

## Exact next step
1. `git clone` (fresh PAT), read this file, `git fetch`; confirm whether the Phase 3 commits are on origin, else push them (rebase on A first; WORKSTATE/RULE_CONFORMANCE_REPORT/src/compiled_dict.json conflicts: take upstream, rerun prepare-data and the audit).
2. Get PO's 3 `-rang` answers, then build it (plain concatenation, dot kept, English plurals only).
3. File Thangseng's Q3 examples verbatim for A when they arrive.
