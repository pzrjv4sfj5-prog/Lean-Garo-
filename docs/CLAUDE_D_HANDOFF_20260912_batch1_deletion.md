# Claude D → Claude A & Claude B: Batch 1 deletion notice (2026-09-12)

**Action taken:** deleted 12 records from `master_dictionary.json` per Project Owner direct instruction, in-chat, this session. Commit `913ffd1`.

## What was deleted (exact match, verified before write)

| idx (pre-deletion) | English | Garo | Confidence |
|---|---|---|---|
| 1252 | eight dogs | chet mang·gni | superseded |
| 1253 | eight birds | chet mang·gni | superseded |
| 1254 | eight fishs | chet mang·gni | superseded |
| 1456 | eight dog | chet mang·gni | superseded |
| 1457 | eight cat | chet mang·gni | superseded |
| 1458 | eight bird | chet mang·gni | superseded |
| 1459 | eight fish | chet mang·gni | superseded |
| 1523 | eleven dog | chi sa mang·gni | superseded |
| 1524 | eleven cat | chi sa mang·gni | superseded |
| 1525 | eleven bird | chi sa mang·gni | superseded |
| 1526 | eleven fish | chi sa mang·gni | superseded |
| 1466 | eight apple | chet se·gni | superseded |

10,178 → 10,166 records.

## Why (evidence, not adjudication)

All 12 shared one of three identical Garo strings — a generic classifier+numeral placeholder with no noun-specific root — reused byte-for-byte across unrelated nouns. Each already has a noun-specific `verified_high` counterpart elsewhere in the file (e.g. `achak mang·chet` for "eight dog", `na·tok mang·Chi·sa` for "eleven fish", `Apple rongchet` for "eight apple"). All 12 deleted rows were `superseded`, none `verified_high` — the Project Owner confirmed these as wrong/safe-to-remove in chat before this action.

Originally surfaced in Claude D's forensic evidence packages (`CLAUDE_A_EVIDENCE_PACKAGE.md`, `CLAUDE_A_EVIDENCE_PACKAGE_REFRESH.md`) as part of the 689-record generated-counting population.

## For Claude A

No action requested. If you later revise any of the noun-specific `verified_high` replacements these duplicated, there's no longer a superseded fallback row for these 12 (english, count) pairs — noted for completeness, not expected to matter.

## For Claude B

No action requested. Array indices in `master_dictionary.json` shifted for every record after idx 1252 as of this commit — relevant only if any runtime/compiled artifact references raw index positions rather than content. No compiled/runtime file was touched or rebuilt by this change.

## Process note

This is Batch 1 of an ongoing Owner-directed cleanup of the same generated-counting placeholder pattern. Further batches, if any, will each be scoped to an explicit Owner confirmation in-chat before any write — same verify-then-write discipline as this one (every target row's (idx, english, garo, confidence) was asserted to match exactly before the file was touched; the script would have aborted on any mismatch).
