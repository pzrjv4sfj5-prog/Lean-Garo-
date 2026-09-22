# CLAUDE_D_MIGRATION_20260922.md

**Project:** Lean-Garo, English-to-Garo translation engine, multi-agent dictionary digitization. Repo `github.com/pzrjv4sfj5-prog/Lean-Garo-`, branch `main`. Project Owner: T. Role of this session: Claude D (dictionary cleanup, OCR batch audits, git sync).

**Resumed from:** `docs/CLAUDE_D_MIGRATION_20260921.md`. That doc's pinned state (`584de97`) was confirmed an ancestor of `origin/main` at session start — no rewrite, no lost work.

**Session type: audit-only.** No `master_dictionary.json` or `pending_lexicon.json` edits. No engine code touched. This session tracked upstream churn from Claude A and Claude B, re-ran the full gate twice as new commits landed, and produced one handoff document for Claude B.

---

## Repo state at session close

- `origin/main` HEAD: `213ef8b` (Claude A: "handoff to Claude B — exact-phrase lookup doesn't strip trailing '.'")
- This session's own commit, `.ai/WORKSTATE.yaml` update + this migration doc + the Claude B handoff doc, lands on top of `213ef8b`.
- `master_dictionary.json`: 9,919 rows (unchanged by this session).
- `pending_lexicon.json` (at `src/data/pending_lexicon.json`): 2,290 rows (unchanged).
- Full gate, re-verified clean at `213ef8b` immediately before this commit:
  - `node prepare-data.js` — 8,829 entries compiled, 1,420 alternates, 52 held, 806 bare-infinitive aliases.
  - `node repository-intelligence.js` — **PASSED**, 0 new violations across all 8 checks.
  - `node --test tests/unit/*.test.js` — **458/458 pass**.

## What happened this session, chronologically

1. Loaded the 2026-09-21 migration doc; confirmed `584de97` was an ancestor of live `origin/main`, which had moved to `6b4c72c` (10 commits: Claude B's `pos`-array fix `b158512`, Claude A's `skin`→`bi·gil` fix `4aee478`, plus relay drafts and session-close docs). Full gate re-run clean at that point.
2. Ran the full gate again on request; found `origin/main` had moved a further 14 commits to `213ef8b` (Claude A and Claude B both closed sessions — `skin`/`Bigil` spelling, `Anti`=week vs `Bajal`=market disambiguation, RULE-046 space bug, RULE-050, `findVerbForm` -ed fallback fix `7a906e9`, NV-160/161/162 closes, and Claude A's new handoff to Claude B on trailing-period lookup failure). Pulled fast-forward, re-ran the full gate clean: 458/458 tests (up from 456), `pickPrimary` tie list shifted (`leg`/`he`/`outside`/`alone`/`agree` resolved by NV-160/161/162; new ties appeared: `i can go`/`i can work`/`she can cook`, all `ama` vs `man·a`, unresolved by RULE-050).
3. Owner asked to see the specifics behind the `to`-prefix and RULE-042 issues. Located and quoted: `docs/grammar_rules_structured/RULE-042.yaml` (confirmed the `(I)` marker is English-gloss notation only, never literal Garo text — the rule itself isn't buggy), and `src/lookupEngine.js` line 84 (`VERB_LEMMAS` gated on `key.startsWith('to ')`, 939 `to X` headwords) plus `prepare-data.js`'s 806 auto-generated bare-infinitive aliases (compile-time convenience, not canonicalization).
4. Owner asked how to fix both. Proposed:
   - **RULE-042 lookup fix:** add a shared normalization pass before *every* lookup path (exact-match and `sov-assembly` alike) that strips trailing sentence punctuation and parenthetical asides (`/\s*\([^)]*\)\s*/g`) before the key is built — not a fix specific to one path, to avoid the paths diverging again.
   - **`to`-prefix fix (two options, blocked on Owner ruling (c)):** (1) flip canonical form in `prepare-data.js` so bare verbs are canonical and `to X` becomes the alias, then update `VERB_LEMMAS`'s check accordingly; or (2) leave master and compiled data as-is, strip a leading `to ` from the *input* query key before the `VERB_LEMMAS` lookup. Flagged (1) as more correct long-term since the Owner's instruction is about the data, not just runtime behavior; (2) as lower-risk/faster if the engine needs unblocking before the data cleanup lands.
5. Owner asked for a full written report for Claude B. Wrote `docs/CLAUDE_D_HANDOFF_TO_CLAUDE_B_20260922_engine_fixes.md` covering: the audit results above, both fixes in full detail (root cause, symptom, suggested implementation, which file/line), the open Owner rulings that block Fix #2, and the standing rules relevant to the handoff. Not yet implemented — explicitly flagged in the doc that Fix #2 is blocked on ruling (c) and neither fix should be actioned without Owner/Claude B sign-off on scope.
6. Owner directed: push using a supplied PAT, and update `WORKSTATE.yaml` so Claude B sees the handoff on session resume. This document and that update are the result.

## Held / not done, and why

- **Owner rulings pending, unchanged from 2026-09-21:** (c) `to`-prefix decision, (b) supersede the 17 coexisting P24/P25 rows, (d) the 35+5+79 OCT re-audit review/drop rows.
- **Thangseng's 30-question verification sheet:** answers not yet received.
- **Page 24 photo transcription:** the image didn't carry into this session; needs re-upload if the Owner wants it done.
- **Fix #1 (RULE-042 normalization) and Fix #2 (`VERB_LEMMAS`/`to`-prefix):** documented and handed off in full to Claude B this session, **not implemented**. Fix #2 additionally blocked on ruling (c). Neither is Claude D's file to edit.

## Open issues, root cause where known (carried + new)

1. **`to`-prefix conflict.** Unchanged from prior migration doc. Full fix options now written up for Claude B in the handoff doc.
2. **Master-wins rule vs Claude A's 17 coexisting P24/P25 variant rows.** Unchanged — awaiting ruling (b).
3. **RULE-042 lookup gaps — now root-caused, not just observed.** The rule itself (`docs/grammar_rules_structured/RULE-042.yaml`) is correctly documented; the bug is that raw input text (trailing `.`, embedded `(I)`) breaks the exact-match key lookup and falls through to weaker `sov-assembly`. Fix proposed in the handoff doc; not yet implemented. `he`/`we` subjects also get no `-de`/`-chi` — flagged as possibly the same normalization gap, possibly a distinct subject-agnostic bug; Claude B to confirm once in that code path.
4. **`croak` spelling (page 24 photo vs master).** Unchanged, still unconfirmed against Thangseng.
5. **Page 24 rows outside the P24/P25 batch** (`Bi·prua`, `Bi·ama`, `Besa`, `Bisong`-as-headword). Unchanged.
6. **94-row OCT dedup deviation.** Unchanged — awaiting ruling (d).
7. **New this session — `pickPrimary` verified ties shifted.** 19 ties remain but the set changed: `leg`/`last`/`leaf`/`he`/`outside`/`fever`/`how`/`horn`/`agree`/`brave`/`greedy`/`able`/`alone` resolved by Claude A's NV-160/161/162 closes; new ties appeared: `i can go`, `i can work`, `she can cook` (all `ama` vs `man·a`, not resolved by RULE-050). Full list in `docs/PICKPRIMARY_VERIFIED_TIES.md`. Claude A territory, flagged for visibility only.
8. **Carried, unchanged:** wh-question suffix relay (sent, no reply); 44-key interrogative-form family (`docs/SUPERSEDED_ONLY_KEYS.md`).

## Standing rules

Unchanged from the 2026-09-21 migration doc — fetch-before-work/rebase-never-merge, never hard-delete (flip to `superseded`), Owner's master-wins rule, never trust a source file's self-audit, `pos` must be a plain string (Claude B's `b158512` fix now closes the pipeline-side gap, but new data must still conform), no code changes without Owner sign-off, full gate on every close, PAT supplied only when asked and used inline in the push command only (never `git remote set-url`), Thangseng needs Word/Excel not PDF, Owner's token-discipline preference (lead with result, no preamble, don't re-verify unchanged things).

**PAT note:** a PAT was supplied in-chat this session for this push. Per standing rule, it is used inline in the push command only and never persisted to the remote URL config. **Recommend the Owner rotate this PAT now that it has been used**, consistent with prior sessions' practice.

## Exact next step

1. Claude B: on resume, read `docs/CLAUDE_D_HANDOFF_TO_CLAUDE_B_20260922_engine_fixes.md` in full before touching `lookupEngine.js` or `prepare-data.js` — it has the exact line numbers, root causes, and two implementation options for the `to`-prefix fix (option 2 is safe to implement without waiting on ruling (c); option 1 is not).
2. Owner: rulings (c), (b), (d) still outstanding, in that priority order per the 2026-09-21 doc.
3. Rotate the PAT used for this session's push.
