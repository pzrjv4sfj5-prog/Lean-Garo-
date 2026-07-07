# PROJECT_STATUS.md — Lean-Garo Operational Dashboard

> Human/AI operational dashboard. NOT architecture (`docs/ARCHITECTURE.md`), NOT
> governance, NOT changelog. Read this before starting work. Update only your
> own section. See `.ai/WORKSTATE.yaml` for machine-readable execution state.

**Repository:** https://github.com/pzrjv4sfj5-prog/Lean-Garo-
**Live:** https://lean-garo.onrender.com
**HEAD (as of last Claude B update):** `dcf6293`

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
| Unit/regression tests (`npm test`) | ✅ 49/49 passing |
| CI (`.github/workflows/ci.yml`) | ✅ configured, runs build+lint on push/PR to main |
| Dictionary validation (`test-dictionary.js`) | ✅ passing (part of build) |
| Known dead code | ✅ none flagged as of `dcf6293` (`PROGRESSIVE_MAP`/`PAST_TO_ROOT` removed) |

## 7. Launch Blockers
*(populate as identified — none formally recorded here yet by Claude B; see §8 for known gaps that are NOT necessarily launch blockers)*

## 8. Technical Debt
*(Claude B — full detail in `docs/ARCHITECTURE.md` §9; summary below)*

| Item | Severity | Recommendation |
|---|---|---|
| No syntax tree — sequential regex/set-membership parsing | Architectural, not urgent | V1.1+, see ARCHITECTURE.md §12 roadmap |
| Duplicate typo-tolerance mechanisms (shadow index + normalizeInput) | Low | Consolidate when touching that area next |
| Confidence scores are hand-tuned constants, not derived | Low | Document as known limitation, not a bug |
| `compiled_dict.json` is a generated artifact with no edit guard-rail | Low-medium | Consider a build-time warning if hand-edited |
| Rule 30 (`re·` vs `re·ang` for "go") | Open linguistic question | Needs Thangseng — not an engineering blocker |
| Rule 31 (copula inconsistency: bare-adj / `daka` / `ong·a`) | Open linguistic question | Needs Thangseng — not an engineering blocker |

## 9. Native Validation Status
*(Thangseng — placeholder. Open items pending: Rule 30, Rule 31, Rule 25's -aha/-manaha context preference, "Angade cha·manaha" tentative confirmation, "you drink/go/come/sleep" bare-statement validity — full detail in `docs/THANGSENG_RULES_LOOKUP.md`)*

## 10. Claude A Status

**Status:** active
**Last completed:** All 4 P0 linguistic specification deliverables for the V1.0 launch sprint — `docs/GRAMMAR_SPECIFICATION.md`, `docs/MORPHOLOGY_SPECIFICATION.md`, `docs/GRAMMAR_RULE_CATALOGUE.md`, `docs/VALIDATION_CORPUS.md`. All content sourced directly from existing verified repository data (`THANGSENG_RULES_LOOKUP.md`'s 33 rules, `corrections.json`'s 790 entries) — no invented or guessed linguistic content, per standing project discipline.
**Current linguistic priority:** Copula/predication reconciliation (Rule 31) — three unreconciled predicative strategies (bare adjective, `daka`-copula, `ong·a`-copula) coexist in confirmed data with no selection rule. Not a missing feature — an unresolved contradiction inside already-confirmed sentences. Highest-priority open item.
**Outstanding native validation:**
1. Copula/predication selection rule (Rule 31) — P0.
2. Rule 30 (`re·` vs `re·ang` for "go") — flagged by Claude B, open.
3. `-manaha`/`-aha` precise divergence beyond confirmed casual-speech overlap — P1.
4. Locative word order productivity beyond the single confirmed "under the table" sentence — P1.
5. `-gija` vs `-ja`/`-jaha` full selection rule for arbitrary "not X-ing" inputs beyond the already-implemented "without" pattern — P1.
**Current blockers:** None launch-blocking. All P0 deliverables complete and internally consistent with the existing engine/corpus. Rule 31 flagged, documented, explicitly not promoted to canonical status — correctly deferred per the Linguistic Review Standard.

## 11. Claude B Status

**Status:** active
**Last completed:** V1.0 launch sprint doc/cleanup pass (`dcf6293`) — README consistency fixes (wrong deployment URL, wrong verb-tense table, wrong "lets X" examples, stale Gemini instructions), P2 dead-code removal (`PROGRESSIVE_MAP`/`PAST_TO_ROOT`, 52 lines, zero call sites confirmed).
**Testing:** 49/49 regression tests passing, wired into `npm run build`, enforced in CI.
**Documentation:** `docs/ARCHITECTURE.md` (complete technical reference), `docs/GRAMMAR_SPEC.md` (rule status index), `README.md` (now synchronized with actual behavior) all current as of `dcf6293`.
**Deployment readiness:** build/tests green; live Render deployment auto-deploys from `main` on push (unverified from this sandbox — no Render API access here).
**Technical debt:** see §8 above.
**Next action:** per current task — operational continuity system (`.ai/WORKSTATE.yaml` + this file + README pointer).

## 12. ChatGPT Reviews
*(ChatGPT — placeholder, not yet populated)*

## 13. Risks
*(ChatGPT / Project Owner — placeholder)*

## 14. Next Actions
- Claude B: none blocking; awaiting Claude A/Thangseng input on Rules 30/31 open questions.
- Claude A: populate §10 with current grammar/morphology work status.
- Thangseng: resolve open validation items (§9).
- ChatGPT: populate §1, §12, §13 with executive review.

## 15. Parking Lot (Post-Launch)
- V1.1 roadmap items from `docs/ARCHITECTURE.md` §12: grammar rule database, rule compiler, morphology engine, parser/AST, dictionary optimization, plugin architecture.
- Reverse translation (Garo→English) — blocked, no reverse dictionary source (`docs/PENDING_reverse_translation.md`).

## 16. Recent Decisions
- 2026-07-06 (Claude B): Removed `PROGRESSIVE_MAP`/`PAST_TO_ROOT` as confirmed-dead code (P2, low-risk per launch-sprint stop conditions).
- 2026-07-05: `-jaha` semantics corrected from "past negation" to "discontinuation" (Rule 17) per direct Thangseng clarification — this was a breaking correction to earlier engine behavior, fully migrated and regression-tested.
- 2026-07-05: Established that Garo has no true simple-past suffix (Rule 27) — `-ja` covers past-referring negation uniformly; engine confirmed already correct by construction.
