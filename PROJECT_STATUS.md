# PROJECT_STATUS.md — Lean-Garo Operational Dashboard

> Human/AI operational dashboard. NOT architecture (`docs/ARCHITECTURE.md`), NOT
> governance, NOT changelog. Read this before starting work. Update only your
> own section. See `.ai/WORKSTATE.yaml` for machine-readable execution state.

**Repository:** https://github.com/pzrjv4sfj5-prog/Lean-Garo-
**Live:** https://lean-garo.onrender.com
**HEAD (as of last Claude B update):** `6cf63d0` (Claude A's first direct push under the new governance model; this update lands one commit after)
**Bootstrap entry point:** `.ai/SESSION_BOOTSTRAP.md` (read first, new sessions) — see its "Current joint work package" section for the live shared task list. **Governance note:** the Repository Access Model changed 2026-07-09 (Project Owner directive) — full policy lives in `SESSION_BOOTSTRAP.md`, not here, per this file's own scope above.

---

## 1. Executive Summary
*(Project Owner / ChatGPT — placeholder, not yet populated)*

## 2. Version & Current Sprint
**Sprint:** Version 1.0 Launch Sprint
**Focus:** stability, bug fixes, regression testing, deployment readiness, documentation consistency (P0) → incremental engine improvements (P1) → recorded-not-fixed tech debt (P2)

## 3. Launch Progress
*(Project Owner — placeholder)*

## 4. Milestones
*(Project Owner — placeholder)*

## 5. Stakeholder Status

| Stakeholder | Owns | Status |
|---|---|---|
| Project Owner | Priorities, milestones, final approvals, launch decisions | placeholder |
| Thangseng | Native validation, confirmed grammar, outstanding validation items | placeholder |
| Claude A | Grammar spec, morphology, rule catalogue, validation corpus | placeholder |
| Claude B | Engineering, implementation, testing, docs, tech debt, deployment | see §11 |
| ChatGPT | Executive review, launch readiness, cross-team coordination, risks | placeholder |

## 6. Repository Health

| Check | Status |
|---|---|
| Build (`npm run build`) | ✅ passing |
| Unit/regression tests (`npm test`) | ✅ 51/51 passing |
| CI (`.github/workflows/ci.yml`) | ✅ configured, runs build+lint on push/PR to main |
| Dictionary validation (`test-dictionary.js`) | ✅ passing (part of build) |
| Known dead code | ✅ none flagged as of `5d29299` (`PROGRESSIVE_MAP`/`PAST_TO_ROOT` removed) |
| Production verification audit (lexical/grammar/morphology/dictionary integrity) | ✅ passed 2026-07-08, no hidden regressions from `edc94b7`/`1b64b0c` |

## 7. Launch Blockers
*(populate as identified — none formally recorded here yet by Claude B; see §8 for known gaps that are NOT necessarily launch blockers)*

## 8. Technical Debt
*(Claude B — full detail in `docs/ARCHITECTURE.md` §9; summary below)*

| Item | Severity | Recommendation |
|---|---|---|
| No syntax tree — sequential regex/set-membership parsing | Architectural, not urgent | V1.1+, see ARCHITECTURE.md §12 BACKLOG-005 |
| Duplicate typo-tolerance mechanisms (shadow index + normalizeInput) | Low | Consolidate when touching that area next |
| Confidence scores are hand-tuned constants, not derived | Low | Document as known limitation, not a bug |
| `compiled_dict.json` is a generated artifact with no edit guard-rail | Low-medium | Consider a build-time warning if hand-edited |
| Rule 30 (`re·` vs `re·ang` for "go") | Open linguistic question | Needs Thangseng — not an engineering blocker |
| Rule 31 (copula inconsistency: bare-adj / `daka` / `ong·a`) | Open linguistic question | Needs Thangseng — not an engineering blocker |

## 9. Native Validation Status
*(Thangseng — placeholder. Open items pending: Rule 30, Rule 31, Rule 25's -aha/-manaha context preference, "Angade cha·manaha" tentative confirmation, "you drink/go/come/sleep" bare-statement validity — full detail in `docs/THANGSENG_RULES_LOOKUP.md`)*

**New pending item (2026-07-08):** Locative/directional word set (below,
inside, outside, above, behind, beside, up, beneath, over, across) relayed
via chat, not yet reviewed by Claude A or committed. Includes a
sense-disambiguation note for "under"/"beneath" (`kokkimao`/`nokkimao` vs
`mitapo` for sheet/slab sense) that also resolves the earlier spelling flag
from `edc94b7`. See `docs/PENDING_LINGUISTIC_PROPOSAL_20260708_locatives.md`.
Not yet repository state — awaiting Claude A review per standing
integration rule.

**Native Sentence Validation Audit (P0, 2026-07-08):** Case 1 fully
glossed, native-confirmed, and **reviewed by Claude A** (2026-07-08).
Two findings strengthened existing rules directly (RULE-004 pro-drop
scope, Grammar Specification §6 locative `-o` productivity — now 2
confirmed examples). Five findings promoted to canonical open questions
in `docs/THANGSENG_NATIVE_VALIDATION.md` (NV-005 through NV-009):
necessity-modal `nangja`, `·ko`/`·o` case selection, posture verb `tue`
(malformed output — standalone bug for Claude B), ability-modal
`man·ienga`, `TV`/`status` loanwords. None promoted to Rule Catalogue
status yet — single-sentence evidence, same discipline applied to
RULE-034. Full detail: `docs/NATIVE_SENTENCE_VALIDATION_AUDIT.md`.

**Phase 2 — Translation Intelligence & Future Vision (2026-07-08, Claude
B, documentation only):** `docs/PHASE2_TRANSLATION_INTELLIGENCE.md` —
reclassified the 5 pending regression candidates (only 1 of 5 is actually
a vocabulary gap; the rest are Grammar/Parser/Selection Logic/Rendering),
mapped the current 11-strategy `translate()` cascade against the future
8-stage semantic pipeline, reassessed reverse-translation readiness
per-component, and documented `corrections.json`'s exact-match design as
explicit semantic-integrity technical debt. No engine or data changes.

**Evidence Collection Mode (2026-07-08, Claude B, while Claude A was
temporarily out of tokens):** Two additional queue documents created in
parallel — **not yet reviewed by Claude A**, since they postdate the Case 1
review above:
- `docs/PENDING_VOCABULARY.md` — 8 candidate words/morphemes from Case 1
  (`TV`, `status`, `nina`, `nangja`, `palango`/`Palang`, `tue`, `nisona`,
  `man·ienga`), state-tagged per the standard pipeline. Nothing added to
  `corrections.json` or `master_dictionary.json`.
- `docs/PENDING_REGRESSION_CASES.md` — 5 candidate regression cases
  (RC-CANDIDATE-001 through 005) with exact input/output pairs from
  follow-up isolated engine tests, largely overlapping with NV-005..009
  above but engineering-framed (severity, affected components). Nothing
  added to the live 51/51 `REGRESSION_CASES` suite. Claude A should
  cross-check these against NV-005..009 for duplication before treating
  both as independent queues.

## 10. Claude A Status

**Status:** active (2026-07-08)
**Last completed:** Adopted the repository access model change (Claude A never pushes — commits locally, outputs `git format-patch` for Claude B to apply). Completed `docs/VERB_INVENTORY.md` (P0 canonical verb inventory, grounded entirely in existing `THANGSENG_RULES_LOOKUP.md`/`corrections.json` evidence) and `docs/verbs/CHA_EAT.md` (first canonical verb page, template exemplar — `cha·`/"eat," clean 24-entry paradigm, no unresolved conflicts). Reconciled `NV-005` through `NV-009` in place against Claude B's independently-collected `docs/PENDING_VOCABULARY.md`/`docs/PENDING_REGRESSION_CASES.md` (RC-CANDIDATE-001 through 005) — richer isolated-test evidence folded in, no duplication. Added `NV-010` (a genuinely new finding: a raka-inconsistency cluster in `-na` infinitive forms — `ring`/`agan`/`porai` unexpectedly show raka in the "want to X" construction despite being raka-free everywhere else, bundled into the minimal relay set), `NV-011` (`nina` vs. `Nia`/`nika` — same root?), `NV-012` (`nisona` vs. `nina` selection rule).
**Next up:** Per `SESSION_BOOTSTRAP.md`'s joint work package: confirmed the locative proposal is fully closed (no action needed — already resolved via RULE-034/035); `GRAMMAR_SPEC.md`→`GRAMMAR_RULE_CATALOGUE.md` reconciliation (RULE-015/RULE-032 promotion) and stale-doc superseded-notice headers are the remaining pure-documentation items before continuing the Verb Family Project with a second verb.
**Current linguistic priority:** Copula/predication reconciliation (Rule 31) — three unreconciled predicative strategies (bare adjective, `daka`-copula, `ong·a`-copula) coexist in confirmed data with no selection rule. Not a missing feature — an unresolved contradiction inside already-confirmed sentences. Highest-priority open item.
**Outstanding native validation:**
1. Copula/predication selection rule (Rule 31) — P0.
2. Rule 30 (`re·` vs `re·ang` for "go") — flagged by Claude B, open.
3. RULE-034/035 locative/directional set — needs direct confirmation pass, ideally one example sentence per word, before promotion beyond the Rule Catalogue.
4. `-manaha`/`-aha` precise divergence beyond confirmed casual-speech overlap — P1.
5. `-gija` vs `-ja`/`-jaha` full selection rule for arbitrary "not X-ing" inputs beyond the already-implemented "without" pattern — P1.
6. Native Sentence Validation Audit Case 1 findings (necessity-modal `nangja`, `·ko`/`·o` case selection on locative adjuncts, posture verb `tue`, ability-modal `man·ienga`, `TV`/`status` loanword gap) — reviewed, not yet assigned rule IDs; next after Rule 31/30.
**Current blockers:** None launch-blocking. Rule 31 and Rule 30 both remain open, correctly deferred per the Linguistic Review Standard, both need Thangseng directly rather than relay.

## 11. Claude B Status

**Status:** active
**Last completed:** BACKLOG-006 first increment (2026-07-09) — `repository-intelligence.js` built as reusable Repository Intelligence infrastructure (design rationale: `docs/REPOSITORY_INTELLIGENCE.md`), wired into `npm run build` plus a dedicated regression test. Check A (raka locality) is deliberately **report-only** after its first run showed most of 18 hits were the lexical-split false-positive trap, not real violations — routed to Claude A as `RC-CANDIDATE-009` rather than asserted. Check B (cross-table consistency) **does** gate the build and found 11 new findings on its first real run beyond the already-known `search` issue, all properly logged (`RC-CANDIDATE-007`, `008`) before being allowlisted. Before that: BACKLOG-001 (`PURPOSE_MAP`/`PRONOUN_MAP`/`POSSESSIVES` extraction) and BACKLOG-002 (`IRREGULAR_VERBS`).
**Decision framework in active use (Project Owner, 2026-07-08):** for any candidate change — (1) linguistic authority required? stop; (2) preserves behavior while improving architecture? proceed; (3) fully protected by the regression suite? proceed. Applied to the validator's own design too: Check A's report-only framing exists *because* asserting those findings as bugs would itself have required linguistic authority (word-sense disambiguation) Claude B doesn't have.
**Testing:** 56/56 regression tests passing (55 prior + 1 new smoke test for the validator itself), wired into `npm run build`, enforced in CI.
**Documentation:** `docs/ARCHITECTURE.md` (BACKLOG-006 marked done), `docs/REPOSITORY_INTELLIGENCE.md` (new — design rationale), `docs/PENDING_REGRESSION_CASES.md` (RC-CANDIDATE-007/008/009 added) all current as of this session.
**Deployment readiness:** build/tests green; live Render deployment auto-deploys from `main` on push (unverified from this sandbox — no Render API access here).
**Technical debt:** see §8 above; `docs/REPOSITORY_INTELLIGENCE.md` documents its own gaps explicitly (large-dictionary coverage, reverse raka direction) rather than leaving them silent.
**Next action:** `RC-003` and `RC-CANDIDATE-006` through `009` all remain pending Claude A's linguistic classification — none touched. Extending `repository-intelligence.js` to `master_dictionary.json`/`garo_dictionary.json` is a documented future opportunity, not started (needs its own design pass, per the tool's own stated limitations).

## 12. ChatGPT Reviews
*(ChatGPT — placeholder, not yet populated)*

## 13. Risks
*(ChatGPT / Project Owner — placeholder)*

## 14. Next Actions
- Claude B: none blocking; repository is bootstrap-ready. Awaiting Claude A's review of the pending locative proposal and Rules 30/31.
- Claude A (on resume, new chat): read `.ai/SESSION_BOOTSTRAP.md`, then review `docs/PENDING_LINGUISTIC_PROPOSAL_20260708_locatives.md`, assign rule ID(s), commit to `docs/`.
- Thangseng: resolve open validation items (§9), including the "under"/"beneath"/`mitapo` sense-disambiguation question.
- ChatGPT: populate §1, §12, §13 with executive review.

## 15. Parking Lot (Post-Launch)
- V1.1 roadmap items from `docs/ARCHITECTURE.md` §12 (Architectural
  Backlog): BACKLOG-001 through BACKLOG-007, staged migration (Grammar
  Specs → Rule Catalogue → Morphology Data → Lexical Resources →
  Validation Corpus → Engine-as-orchestration-only), reviewed and
  accepted 2026-07-07. First increment: BACKLOG-002 (extract
  `IRREGULAR_VERBS` to JSON), estimated V1.1.
- Reverse translation (Garo→English) — blocked, no reverse dictionary source (`docs/PENDING_reverse_translation.md`).

## 16. Recent Decisions
- 2026-07-08 (Claude B): Established standing integration rule — chat-sourced linguistic proposals are logged under `docs/PENDING_*` and never implemented directly; must be reviewed and committed by Claude A first. First application: locative/directional word set, see §9.
- 2026-07-08 (Claude B): Production verification audit performed on recent lexical fixes (under/down); no regressions found; declared production-ready for V1.0 with no further changes needed in that area.
- 2026-07-06 (Claude B): Removed `PROGRESSIVE_MAP`/`PAST_TO_ROOT` as confirmed-dead code (P2, low-risk per launch-sprint stop conditions).
- 2026-07-05: `-jaha` semantics corrected from "past negation" to "discontinuation" (Rule 17) per direct Thangseng clarification — this was a breaking correction to earlier engine behavior, fully migrated and regression-tested.
- 2026-07-05: Established that Garo has no true simple-past suffix (Rule 27) — `-ja` covers past-referring negation uniformly; engine confirmed already correct by construction.
