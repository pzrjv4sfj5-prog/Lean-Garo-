# PROJECT_STATUS.md — Lean-Garo Operational Dashboard

> Human/AI operational dashboard. NOT architecture (`docs/ARCHITECTURE.md`), NOT
> governance, NOT changelog. Read this before starting work. Update only your
> own section. See `.ai/WORKSTATE.yaml` for machine-readable execution state.

**Repository:** https://github.com/pzrjv4sfj5-prog/Lean-Garo-
**Live:** https://lean-garo.onrender.com
**HEAD (as of last Claude B update):** `5d29299`
**Bootstrap entry point:** `.ai/SESSION_BOOTSTRAP.md` (read first, new sessions)

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

**Native Sentence Validation Audit (new P0, 2026-07-08):** Evidence-gathering
exercise measuring engine performance against real conversational Garo
(not synthetic test sentences). Case 1 now fully glossed and native-confirmed
(Thangseng): "(I) don't need to watch TV, (I) can just watch on status
lying in bed" with full morpheme breakdown. Confirmed findings: (a) engine
has no Garo→English capability (architecture-level, known), (b) `TV`/`status`
loanwords entirely absent from dictionaries, (c) necessity-modal negation
(`nangja`) collapses into plain desire-negation, (d) engine selects object
marker `·ko` where native uses locative `·o` for "in bed", (e) posture verb
"lying" (`tue`) produces a malformed output (`Anga Palangha`) rather than a
graceful gap, (f) ability-modal "can" (`man·ienga`) is dropped entirely,
(g) the `Palang`+`·o` locative pattern is structurally correct where it
does fire — a genuine partial success. Full detail:
`docs/NATIVE_SENTENCE_VALIDATION_AUDIT.md`. Ready for Claude A review. No
engine changes made.

## 10. Claude A Status

**Status:** migrating to new chat session (as of 2026-07-08)
**Last completed:** All 4 P0 linguistic specification deliverables for the V1.0 launch sprint — `docs/GRAMMAR_SPECIFICATION.md`, `docs/MORPHOLOGY_SPECIFICATION.md`, `docs/GRAMMAR_RULE_CATALOGUE.md`, `docs/VALIDATION_CORPUS.md`. All content sourced directly from existing verified repository data (`THANGSENG_RULES_LOOKUP.md`'s 33 rules, `corrections.json`'s 790 entries) — no invented or guessed linguistic content, per standing project discipline.
**On resume:** review `docs/PENDING_LINGUISTIC_PROPOSAL_20260708_locatives.md` first (see §9).
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
**Last completed:** Production verification audit (2026-07-08) covering lexical consistency of directional words, grammar-tense interaction, morphology/suffix interaction, dictionary integrity, and expanded runtime spot-checks — no hidden regressions found from the `edc94b7`/`1b64b0c`/`5d29299` fixes. Also fixed `under`/`Ka·ma·o` lexical confusion (`edc94b7`) and confirmed `down`=`Ka·ma` consistency (`1b64b0c`) in the prior session. Created `.ai/SESSION_BOOTSTRAP.md` and logged the pending Thangseng locative proposal for Claude A.
**Testing:** 51/51 regression tests passing, wired into `npm run build`, enforced in CI.
**Documentation:** `docs/ARCHITECTURE.md`, `docs/GRAMMAR_SPEC.md`, `README.md`, `.ai/SESSION_BOOTSTRAP.md` (new) all current as of `5d29299` + this sync commit.
**Deployment readiness:** build/tests green; live Render deployment auto-deploys from `main` on push (unverified from this sandbox — no Render API access here).
**Technical debt:** see §8 above.
**Next action:** none blocking. Standing by for Claude A's next linguistic commit (locative/directional proposal). No engineering changes pending per the chat-proposal integration rule — repository is bootstrap-ready for a fresh session.

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
