---
report_id: CLAUDE-A-AUDIT-20260924
agent: Claude A
role: linguistic-content-authority
date: 2026-09-24
status: ACTIVE
source_of_truth: live-main
repository: pzrjv4sfj5-prog/Lean-Garo-
audit_head_at_creation: 46aa62f7d5a046c0632a9d39e59c0dc9b7108d8
machine_reading: true
---
# Claude A — Machine-Ready Linguistic / Content Audit
This file is an operational handoff. Read it as task input, not as a historical narrative.
## 1. Mission
Review and resolve linguistic/content questions only. Do not choose values merely to make engineering deterministic. Native evidence, Project Owner directives, and existing provenance rules remain authoritative.
## 2. Current State
| Item | State |
|---|---|
| Dictionary validation | 8,902 / 8,902 valid in latest documented close |
| animal | RESOLVED: Jontu added as verified-high |
| today | OPEN CONFLICT: dictionary Da.alo vs RULE-042 root Da·al |
| us accusative/clusivity | OPEN — native relay required |
| -de/-ara distinction | OPEN — linguistic decision required |
| POS collision-set backfill | OPEN |
| pickPrimary verified ties | ~20 listed; ~15 remain without session-history evidence |
| Ritchasa-gni | OPEN — relay draft exists |
| what did you eat? | OPEN — relay draft exists |
## 3. Priority A Decisions
### A1 — Resolve today
Evidence currently in repo: bare dictionary entry today -> Da.alo; RULE-042 uses verified root Da·al; RULE-042 composition expects Da·al + de -> Da·alde; engineering must not select between these forms.
Required output: (1) determine whether Da.alo is distinct, a spelling/transcription issue, or an already-suffixed form; (2) state canonical lexical root; (3) state whether row is corrected, retained as alternate, or split; (4) record native/source provenance; (5) tell Claude B exactly what form is safe for temporal composition.
### A2 — us accusative / clusivity
Use the existing Thangseng relay drafts: docs/THANGSENG_RELAY_QUESTION_20260920.md, ...20260920B.md, ...20260920C.md. Do not infer the answer from English or current engine behavior.
### A3 — -de / -ara
Determine the semantic/grammatical distinction and provide a source-backed rule suitable for engineering consumption.
### A4 — POS collision set
Review documented noun/verb collisions. For every item classify: genuine homonym/polysemy; distinct POS forms; synonym/variant; or unresolved. Do not alter runtime behavior solely to suppress a collision report.
### A5 — Verified ties
Review docs/PICKPRIMARY_VERIFIED_TIES.md. For each remaining key confirm legitimate synonymy, identify supersession, or mark insufficient evidence. Do not change primary merely because the compiler needs deterministic output.
## 4. Explicitly Closed / Do Not Reopen
- animal -> Jontu is now added.
- Recent cook noun/verb separation is already implemented.
- Page-96 worked-example promotion is already integrated.
- NV-164 “the market is nearby” was resolved as a 3-way synonym set.
- Historical OCR batches already promoted must not be re-imported.
## 5. Handoff Contract to Claude B
Return compact decisions in this shape:
decision_id: A-YYYYMMDD-NNN | topic: <topic> | status: resolved|blocked|needs-relay | canonical: {english: <key>, garo: <value>} | alternates: [] | rule: <short operational rule> | evidence: [] | engineering_instruction: <what B may implement> | confidence: verified_high|verified|unverified|superseded
For unresolved items do not invent canonical values; use blocked or needs-relay.
## 6. Completion Criteria
- Every open priority has a documented status.
- Native/Owner evidence is explicitly identified.
- Engineering dependencies are stated without linguistic guesswork.
- No already-closed OCR/data work is reopened.