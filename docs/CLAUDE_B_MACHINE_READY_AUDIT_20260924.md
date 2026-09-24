---
report_id: CLAUDE-B-AUDIT-20260924
agent: Claude B
role: engineering-runtime
date: 2026-09-24
status: ACTIVE
source_of_truth: live-main
repository: pzrjv4sfj5-prog/Lean-Garo-
audit_head_at_creation: 46aa62f7d5a046c0632a9d39e59c0dc9b7108d8
machine_reading: true
---
# Claude B — Machine-Ready Engineering / Runtime Audit
This file is an operational handoff. Read it as task input, not as a historical narrative.
## 1. Mission
Fix engineering/runtime defects through general mechanisms. Do not make linguistic decisions. Follow .ai/PROJECT_OWNER_AUTHORITY.md and docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md.
## 2. Current Gate Baseline
| Gate | Latest documented result |
|---|---|
| prepare-data.js | 8,902 entries |
| test-dictionary.js | 8,902 / 8,902 valid; 9 / 9 grammatical corrections |
| repository-intelligence.js | 0 new violations |
| Unit tests | 458 / 458 passing |
| Runtime sweep | 15,862 translate() calls; 0 runtime errors |
| Open PRs | 0 |
| P1 issue | #6 remains open |
Important: runtime sweep is an exception/crash detector. It does not establish semantic translation correctness.
## 3. P1 — Issue #6: Punctuation / Routing Divergence
Symptom: the same multi-clause sentence can route differently when only a terminal period is added.
I am going to the market tomorrow because I need vegetables. -> Anga Bajal Knal Anga nanga sam·bi·jak Maingen
I am going to the market tomorrow because I need vegetables -> Anga bajalchi sam·bi·jak·ko re·angenga
Current partial mitigation: translationEngine.js has a lowerNoPeriod lookup fallback. This is not sufficient to declare Issue #6 closed because divergence can occur in clause detection, grammar assembly, SOV fallback, or morphology.
Required investigation: trace normalization, tokenization, correction/exact phrase lookup, multi-clause detection, subject/verb/object extraction, grammar assembly, SOV fallback, morphology. Identify the first divergent branch.
Required fix: implement a general punctuation normalization contract at the appropriate parser boundary. Preserve meaningful question/exclamation semantics. Do not add a sentence-specific correction.
Acceptance tests: exact P1 sentence with and without terminal period; trailing ., .., ...; punctuation after exact phrase keys; punctuation on multi-clause sentences; ? and ! semantics; mixed punctuation/whitespace.
## 4. AI-003 — Multi-word VERB_LEMMAS
Evidence: VERB_LEMMAS has 955 entries; 609 (64%) are multi-word; current consumers compare a single token against the set; documented failure: it crumbled down -> Ua ka·ma·ko.
Required design decision: define a structural cutoff before coding. Do not n-gram all 609 entries because the set contains long OCR-definition-style keys.
Known counts: 165 two-word entries; 129 three-word entries; remaining entries include long multi-word strings.
Recommended sequence: document cutoff; separate genuine short phrasal verbs from long OCR-definition keys; implement bounded sliding n-gram matching; update all current consumers consistently; add crumble down regressions; run complete gate and runtime sweep.
Do not silently change dictionary POS classification. Do not solve with sentence-specific corrections. Do not infer every to X key is a verb. Do not use engine behavior to resolve linguistic ambiguity.
## 5. Leading Time-Word Subject Detection
tomorrow he will go to the market currently fails subject/verb/location detection and falls to weaker SOV assembly.
Dependency: BLOCKED on Claude A/D linguistic resolution because dictionary today -> Da.alo conflicts with RULE-042 root Da·al.
Safe preparation: isolate parser branch and add characterization tests. Do not enable generalized temporal -de composition until the canonical today root is resolved.
## 6. Existing Fixes — Do Not Reimplement
- to school / to home / to him non-verb exclusion handling;
- OOV destination grammar fallback using visible [UNKNOWN];
- NP-subject has/have coherence fix;
- cook noun/verb separation;
- mirror alternate handling;
- animal -> Jontu.
## 7. Engineering Governance
For every runtime-output defect: trace source -> compiled -> override -> runtime; identify mechanism; log mechanism before a new fix; prefer general engine fixes; preserve provenance; never delete rows merely to hide conflict; fetch/rebase before push; run full gate at actual HEAD before close.
## 8. Definition of Done
Issue #6: first divergent branch identified; parser-level fix; punctuation regressions; no sentence-specific workaround; full gate passes.
AI-003: cutoff documented; approved multi-word matcher; long OCR-definition keys excluded; crumble down regression passes; full gate passes.
Leading time word: either A/D resolves dependency and B implements, or dependency remains explicitly blocked with characterization tests.
Final gate: node prepare-data.js && node test-dictionary.js && node repository-intelligence.js && node --test tests/unit/*.test.js && node scripts/runtime-error-sweep.mjs
## 9. Machine-Readable Handoff From Claude A
Expected shape: decision_id, topic, status, canonical, alternates, rule, evidence, engineering_instruction, confidence. Do not implement blocked or needs-relay decisions.