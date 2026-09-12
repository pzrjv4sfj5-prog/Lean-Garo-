# Claude D → Claude A & Claude B: Batch 2 (Family 1+2) deletion notice (2026-09-12)

**Action taken:** deleted 200 records from `master_dictionary.json` per Project Owner direct instruction, in-chat, this session. Commit `bec4fae`. Follows Batch 1 (commit `913ffd1`, 12 rows).

## Repository state at time of this action

- Rebased onto Claude A's concurrent commit `5930c24` ("delete jak·ra·ra/bo·a ra·a/Bo·a rows") before this batch — that deletion (3 unrelated rows) had already landed on `origin/main` when I started this batch; no overlap, no conflict, both changes independent.
- Pre-deletion: 10,164 records, hash `fd8b8bda75d47c6724d871318eb3bb1f074e5b17`.
- Post-deletion: 9,964 records, hash `b8d02ad6db56c3ce1f06b391a640b371924c44cc`.

## What was deleted (200 rows, two families)

**Family 1 — animal (bird/cat/dog/fish), 80 rows.** Garo values `brang mang·gni`, `bonga mang·gni`, `dokka mang·gni`, `sni mang·gni`, `sku mang·gni` (7 each) plus teens-prefixed variants (`chi <n> mang·gni`, 4-6 each) plus `sa mang·sa` (3) — all byte-identical across bird/cat/dog/fish, no noun stem present, all `confidence=superseded`.

**Family 2 — misc (river/student/water), 120 rows.** Garo values `chik·gni` and its teens-prefixed/numeral-prefixed variants (`chi <n> chik·gni`, `<n> chik·gni`, `sa chik·sa`) — all byte-identical across river/student/water, all `confidence=superseded`.

## Why (evidence, cross-checked against the rule engine, not adjudicated)

Built a ground-truth reference (`audit/segregation/CLASSIFIER_GROUND_TRUTH_REFERENCE.md`) cross-checking `data/garo_number_classifier_engine_machine_ready.json`'s 16-classifier table against every counted-noun record in the corpus. Result: every noun with `verified_high` counted-form data matches the documented rule exactly (`sak` for student/teacher/person, `mang` for bird/fish/dog/cat, etc.) — zero contradictions on the trusted side. `chik` (Family 2's classifier token) **does not exist anywhere in that 16-entry table** — it isn't a real classifier at all. Family 1's `mang·gni`/`mang·sa` tails are real classifier+number fragments, but fixed regardless of the actual count, with the noun itself dropped — every affected noun already has its correct form elsewhere (`achak mang·bri`, `do·o mang·Chi·chet`, `Chattro sakChi·sa`, etc.).

All 200 targeted rows were re-verified by exact (idx, english, garo, confidence) match immediately before the write; the script asserted every match and the post-count before saving anything.

## For Claude A

No action requested. `apple` still carries one other superseded row using classifier `se` (Tools — wrong category for fruit), separate from anything touched in Batch 1 or 2. Flagged as a possible Batch 3 in the reference doc, not acted on here — your call whether it's worth a dedicated look.

## For Claude B

No action requested. Array indices shifted twice today — once from your unrelated concurrent commit (`5930c24`, -3 rows) and once from this batch (-200 rows). If any compiled/runtime artifact caches raw index positions, both shifts apply cumulatively; content-based lookups are unaffected.

## Batches remaining (not touched)

Family 3 (object: book/car/house/tree, ~75 rows) and Family 4 (food/rice, ~40 rows) from the same original 315-record candidate set are still pending Owner confirmation.

---

## My role, restated plainly (since it's come up)

I'm Claude D — forensic segregation and audit. My default mandate is strictly observe/classify/flag: I never adjudicate which Garo form is correct, never touch `master_dictionary.json`, never delete or suspend anything, on my own initiative. Everything I found (the 689-record generated-counting population, the classifier cross-reference, these 315 placeholder candidates) was surfaced as evidence for Claude A, exactly as that mandate says.

The two deletions executed in this session (Batch 1: 12 rows, Batch 2: 200 rows) are the one explicit exception carved out by this project's own governance: a live, in-chat instruction from the Project Owner overrides my standing "never delete" default for that session, provided the target is confirmed and exact-matched before any write — which is what happened both times (you asked, I showed you the full candidate list first, you confirmed, then I deleted exactly what was shown, nothing more). That's not me quietly becoming Claude A; it's this repo's documented "live chat instruction from the Owner is authoritative for the current session" rule, applied narrowly, with a paper trail (this doc + the commit message) so nobody downstream mistakes it for Claude A's own linguistic adjudication.
