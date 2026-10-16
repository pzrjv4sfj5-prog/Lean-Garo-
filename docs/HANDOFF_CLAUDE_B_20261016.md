# Claude A → Claude B Handoff (Phase 3 runtime bugs)
**Date:** 2026-10-16 | **Repo state:** HEAD `852bf73`, WORKSTATE `head` `df513d8`, gate green.
**Source:** `docs/CLAUDE_A_FULL_AUDIT_20260928.md` (R1–R10), repros re-run live 2026-10-16.
**Scope:** engine only. No dictionary-content or linguistic changes. If a fix needs a linguistic fact, stop and send it to Claude A.

## Live repros (current HEAD)
| ID | Input | Current output | Method / conf | Problem |
|---|---|---|---|---|
| R1 | eleven dogs | `achak mang·Chi·sa` | classifier .96 | Capital C mid-word. Audit logged `mangChi·sa`; the dot is now there but the capital remains. |
| R2 | two persons | `mande·gni` | exact-phrase .75 | Drops classifier `sak`. |
| R2 | one person | `mande saksa` | exact-phrase .98 | Inconsistent with the two-persons output and the counting rule. |
| R3 | my name is T | `Angni bimung daka [UNKNOWN]` | morphology .65 | `[UNKNOWN]` leaks to user output for a proper noun. |
| R4 | not | `not [UNKNOWN]` | passthrough 0 | Bare negation missing. |
| R5 | this is my book | `angni ki·tap` | stopword-stripped .75 | Copula/demonstrative dropped. |
| R6 | where is the big house? | `Bano Nok dal·a` | sov-assembly .75 | Questionable assembly. |
| R6 | how many? | `Maidake Bang·a` | sov-assembly .75 | Same (multi-word noun). |
| R7 | (same outputs as R6) | `Bano Nok…`, `Maidake Bang·a` | | Assembled words capitalised mid-sentence; also seen as `Anga Re·anggen`, `Ua Ka·onanga`, `Achak Chon·a`. |
| R8 | he / she | `Ua` / `Ua` (phrase-map .99) | | `is he angry?` → `Bia ka'o nangengama?`. Both Ua and Bia are native-confirmed synonyms (2026-08-09, 2026-09-19), so this is an inconsistency, not an error. Tie report says `he` ships `Bia`: stale. |
| R10 | hundred | `Ritchasa` | phrase-map .75 | Unverified confidence. Needs Claude A. |

R10 `build` is **resolved** (now `Taria`, .99).

## Asks for Claude B (in priority order)
1. **R1:** fix casing in teen composition. Expected shape is lowercase, no mid-word capital.
2. **R2:** make the classifier handling for persons consistent for 1 and 2+. The counting rule is the reference. Check the rule text before choosing the form.
3. **R3/R4:** never emit `[UNKNOWN]` to the user. Decide a graceful fallback (leave the proper noun as-is; for bare "not", either map or return a low-confidence marked passthrough). Claude A supplies the Garo for "not" if absent from the dictionary.
4. **R5:** stop dropping copula/demonstrative in the stopword-stripped path, or lower confidence and flag the loss.
5. **R6/R7:** sov-assembly casing (sentence-initial only), and review the multi-word-noun assembly. Known open item.
6. **R8:** pick one deterministic pronoun behaviour for he/she/is-he and document it. Do not change the dictionary rows.
7. **New scope, general `-rang` plural generation.** The 2026-09-30 relay ruled `-rang` a productive plural (supersedes the 2026-08-25 ruling). Not yet implemented. Check RULE-038 and the relay doc `docs/THANGSENG_RELAY_ANSWERS_20260930.md`.
8. **Check against RULE-052 (ADVERB+VERB):** `I go to the market slowly` → `Anga bajalchi ka·sine·ko re·a` (grammar-assembly .82). Verify the `-ko` on the adverb is licensed by the rule and examples. Flagging for a check, not claiming it is wrong.

## Not for Claude B
- R9 (`why` and `because` both → `Maina`): linguistic question for Project Owner / Thangseng.
- R10 `hundred` confidence: Claude A.
- Raka dot (mang/king dot:true; sak/rong no-dot): settled. mang has flipped four times. Do not touch without a direct citation.
- Spelling variants (nokkimao/kokkimao, Uo/Ua, Bao/Bano, a'bil/Bol, Antichi/Bajalchi, mewa/bite): ignore per Project Owner.

## Rules
Evidence-first, never infer linguistic facts. Fix stale `phrase_maps` values directly, never allowlist. Gate order: `node prepare-data.js`, `node test-dictionary.js`, `node repository-intelligence.js`, `node scripts/resync-stale-overrides.mjs`, `node --test tests/unit/*.test.js`, `node scripts/runtime-error-sweep.mjs`, `node scripts/audit-rule-conformance.mjs` (add `--write-baseline` after rule or example changes), `npx vite build`, then `git checkout dist/index.html`. The rule-conformance gate stays report-only. Update WORKSTATE `next_action`, demote the prior entry, and set `head` to the content commit. Never embed a PAT.
