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
| Unit/regression tests (`npm test`) | ✅ 56/56 passing |
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

**Codex Repository Audit (2026-07-11) — classification and disposition.**
An external audit (Codex) produced a 22-section report with 25 ranked
"highest value improvements." Every high-priority engineering claim was
independently verified against the actual repository before any action,
per explicit instruction not to assume the audit was correct.

*VERIFIED and fixed this session:*
- `src/pages/VerbsGrammar.jsx` taught 5 confirmed-wrong grammar forms — fixed (`48aee52`)
- Dead `phrase_maps.js` hortative entries shadowed by `corrections.json` — removed (`48aee52`)
- RC-CANDIDATE-002/003/006 and 5/9 of RC-CANDIDATE-008 (translation-engine heuristic gaps already documented via RC candidates) — implemented (`d0e6c06`, see `docs/PENDING_REGRESSION_CASES.md`)
- Duplicate `GARO_GRAMMAR_REFERENCE.md`/`GARO_GRAMMAR_VALIDATED.md` — resolved by Claude A (`b869a48`)
- `GRAMMAR_SPEC.md`→`GRAMMAR_RULE_CATALOGUE.md` promotion gaps (RULE-015/032 class) — closed by Claude A (`b97e082`)

*VERIFIED, not yet fixed (real, still open):*
- `dist/` is git-tracked (only `dist/index.html`, not the JS/CSS bundle — smaller issue than the audit implied, but still shouldn't be committed given it's also gitignored)
- CI lint (`.github/workflows/`) runs with `continue-on-error: true` — informational only, doesn't gate merges
- Root `ARCHITECTURE.md` (16KB) duplicates `docs/ARCHITECTURE.md` (46KB, canonical) — not yet reconciled
- `master_dictionary.json`/`garo_dictionary.json` not covered by `repository-intelligence.js` — documented gap, needs its own design (see `docs/REPOSITORY_INTELLIGENCE.md`)
- classifierHints (`translationEngine.js` line ~235: `mang`/`sak`/`gong`/`king` only) — **verified accurate**, `jol`/`ge` exist in `garo_classifier.js`'s separate `CLASSIFIER_MAP` but not in this specific inline hints array; not yet reconciled

*REJECTED (audit was inaccurate) — recorded so the same conclusion isn't reached again:*
- *"PROJECT_STATUS.md still reports 51/51 in one health table."* No such table entry found — the only "51/51" string in the file is inside historical prose accurately describing a past session's state, not a stale current-count claim. The actual health table (§6) has been kept current throughout this session.
- *"README claims English⇄Garo⇄Hindi as a real capability."* Partially fair as a UI-copy concern, but the audit's framing implies this is undocumented/hidden — `docs/PENDING_reverse_translation.md` and `docs/PHASE2_TRANSLATION_INTELLIGENCE.md` already document the English-only engine and blocked reverse-translation status extensively; this is known, tracked debt, not an undiscovered gap.
- *Several root-level "probably obsolete" files listed* (`CLAUDE_CONTRIBUTIONS.md`, `GEMINI_CONTRIBUTIONS.md`, `ARCHITECTURE_REVIEW.md`, `DICTIONARY_AUDIT.md`, `REPOSITORY_AUDIT.md`, `PROJECT_STATUS_REPORT.md`) **do not exist in the repository** — checked directly. Only `IMPLEMENTATION_SUMMARY.md` and `FIXES_APPLIED.md` from that list are real.
- *"Decide whether server.js is active product code or legacy."* Verified in one line: `package.json`'s `start` script is `node server.js` — it's the active production entry point, not legacy. No decision needed.

*FUTURE (valid, not V1.0/consolidation scope):* splitting
`translationEngine.js` into modules, a semantic intermediate
representation, a UI test layer, morphology-data externalization for
reverse translation — all correctly identified as Phase 2+ by the audit
itself; no action taken, consistent with "this is not a new architecture
sprint."

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
**Last completed:** Corrected `RULE-031` (copula) using verified current `corrections.json` data — retracted an earlier stale speculation in this session (built on `docs/NEW_SENTENCES_BATCH3_CONVERSATION.md`, a pre-correction batch log, without checking whether `docs/GLOBAL_RAKA_CONVERSION_HANDOFF.md`'s fixes had already superseded it) and replaced it with a cleaner, verified 3-strategy picture. Added superseded-forms notices to both docs so a future read doesn't repeat the mistake. Updated `RULE-030` with 2 more native-sourced `re·ang`+`·chi`-destination examples from primary-source chat transcripts. Corrected an earlier claim that "downstairs" was a missing `RULE-034` item — it collapses into "below" (`ka·mao`), same word. Revised `NV-010`'s likely explanation from a phonological rule to a specific lexical-split confusion (`ring·a`="to sing" vs. `ringa`="to drink" — two different roots, not a `-na`-suffix effect). Noted `RC-CANDIDATE-006` (search/purpose-clause bug, logged by Claude B) connects to a related primary-source finding: Thangseng also gave `Am·a` as a valid word for "search," distinct from both `Sandia` and the stale `am·e·nik·na` — worth resolving together rather than separately.
**Next up:** Consolidate remaining primary-source findings from this session (register-variation pattern as a named linguistic model — `gnang`/`donga`, `hai cha·na`/`hai cha·bo`, `An·ching`/`chinga` all fit the same formal/casual doublet shape; `an·tang` reflexive documentation; `jol`/`ge·` classifier gaps flagged to Claude B; RULE-015 stem-formation promotion from `GRAMMAR_SPEC.md` using the suffixes.pdf transcript as primary citation).
**Flagged to Claude B — `classifierHints` gap (2026-07-09, still open):** `translationEngine.js` only covers `mang`/`sak`/`gong`/`king` — native-confirmed `jol` (long objects, e.g. bamboo) and `ge·` (pens/sticks, raka is part of stem) are missing. Source: notes.pdf transcript.

**Flagged to Claude B — `src/pages/VerbsGrammar.jsx` teaches wrong grammar (user-facing, 2026-07-10):**
1. `agan·a`("speak") shown with raka throughout — contradicts confirmed raka-free `agan` (`THANGSENG_RULES_LOOKUP.md` L42, `corrections.json`'s `agana`/`aganaha`).
2. `nik·a`("see") shown with raka — contradicts confirmed raka-free `nika` (L405, explicit: "no raka, nika root confirmed raka-free").
3. `brea-na`/`brea-enga`/`brea-aha`/`brea-gen` — uses hyphens, not raka, predating `GLOBAL_RAKA_CONVERSION_HANDOFF.md`'s explicit native instruction ("change ALL hyphens everywhere to raka, no exceptions"). `tusieaha` also looks like a typo for `tusiaha`.
4. Classifier "Ge" block uses **number-before-classifier** order (`sa·ge`, `gni·ge`) — reversed from all 4 other classifier examples on the same page (`mang-sa`, `sak-sa`, `gong-sa`, `king-sa`, all classifier-first) and from the established CLASSIFIER-NUMBER convention. Raka on `ge·` is otherwise correctly confirmed (notes.pdf) — only the word order is wrong.
5. The `re·anga`("go") entry's imperative example is `'Tusibo: Go to sleep!'` — that's the *sleep* verb's imperative, not go's. Copy-paste error.
None of these need native validation — all checkable against existing confirmed data. Linguistic disposition only; JSX edit is Claude B's.

**Flagged to Claude B — stale phrase_maps.js hortatives (dead code, not urgent):** `"let's eat"`, `"let's drink"`, `"let's sit"`, `"let's work"` all have older/unconfirmed forms in `src/data/phrase_maps.js` (e.g. `Hai cha·ha`, a third variant never confirmed) that are currently unreachable — `corrections.json` (checked first in the cascade) already has the correct native-confirmed forms (`Hai cha·na`, etc.) for the same keys. Not a live bug; worth cleaning up so it can't silently reactivate if cascade order or `corrections.json` ever changes.

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
**Last completed (2026-07-17/18):** Pending Lexicon infrastructure —
full `Published Dictionary → Import → Pending Lexicon → Claude A Review
→ Promotion → master_dictionary.json` pipeline built and tested
end-to-end. `scripts/import-dictionary.js` (rewritten — no longer
auto-applies anything, everything stages to
`src/data/pending_lexicon.json` as `unreviewed`), `scripts/promote-lexicon.js`
(new — only promotes `review_status: "approved"` entries, preserves
pending records/provenance permanently), `repository-intelligence.js`
Check D (pending-lexicon structural integrity, fails only on structural
problems, never on unresolved linguistic content) and Check C
(dictionary internal self-consistency, 1053-key baseline in
`src/data/known_dictionary_conflicts.json`). Full lifecycle documented
in `docs/PENDING_LEXICON_WORKFLOW.md`. Zero linguistic decisions made by
any of this tooling — see that doc's "Role boundaries" section.
**Testing:** 70/70 regression tests passing, build green, all 4
repository-intelligence checks (A/B/C/D) passing.
**Next action:** repository is ready to absorb a real published
dictionary batch whenever one is provided; RC-CANDIDATE-017/018 remain
on Project Owner hold (root cause traced, not implemented); RC-019
(teacher) and the new future-interrogative evidence
(`docs/PENDING_LINGUISTIC_PROPOSAL_20260717_future_interrogative.md`)
await Claude A.

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
- 2026-07-17/18 (Claude B): Built Pending Lexicon infrastructure per
  Project Owner sprint directive — full import→pending→review→promotion
  pipeline (`scripts/import-dictionary.js`, `scripts/promote-lexicon.js`,
  Check C/D in `repository-intelligence.js`, `docs/PENDING_LEXICON_WORKFLOW.md`).
  Supersedes the 2026-07-17 version of the import tool, which auto-applied
  clean entries directly to `master_dictionary.json` — corrected per
  explicit directive that no imported entry is ever promoted
  automatically. 70/70 tests, all 4 checks passing, no translation
  behavior touched.
- 2026-07-08 (Claude B): Established standing integration rule — chat-sourced linguistic proposals are logged under `docs/PENDING_*` and never implemented directly; must be reviewed and committed by Claude A first. First application: locative/directional word set, see §9.
- 2026-07-08 (Claude B): Production verification audit performed on recent lexical fixes (under/down); no regressions found; declared production-ready for V1.0 with no further changes needed in that area.
- 2026-07-06 (Claude B): Removed `PROGRESSIVE_MAP`/`PAST_TO_ROOT` as confirmed-dead code (P2, low-risk per launch-sprint stop conditions).
- 2026-07-05: `-jaha` semantics corrected from "past negation" to "discontinuation" (Rule 17) per direct Thangseng clarification — this was a breaking correction to earlier engine behavior, fully migrated and regression-tested.
- 2026-07-05: Established that Garo has no true simple-past suffix (Rule 27) — `-ja` covers past-referring negation uniformly; engine confirmed already correct by construction.
