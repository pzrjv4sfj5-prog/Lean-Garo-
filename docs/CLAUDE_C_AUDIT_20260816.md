# Claude C Audit — 2026-08-16

**Role:** Read-only independent QA auditor. No commits, no linguistic/engineering decisions.
**HEAD at audit:** `352eec8` (verified `== origin/main`, clean tree).
**Prior report:** `docs/CLAUDE_C_AUDIT_20260815B.md` (`latest_audit_head: 888c61a`).
**Method:** Live-value verification against `compiled_dict.json`/`corrections.json`/`master_dictionary.json` on disk, not re-derivation from scratch (Rule per `do_not_repeat`). 7 commits landed since the prior audit head — reviewed via diff; only `cb53f1c` (Claude A) touches audited territory.

## Result: zero drift, zero new findings. Both prior open items confirmed still open, unchanged.

## §1 — `answer` pickPrimary tie (Claude A's part done; Claude B's part open)

- Claude A's queued action landed (`cb53f1c`): `master_dictionary.json`'s `answer`→`a·gan·chak·a` row now tagged SUPERSEDED citing NV-077. Done correctly, no regressions (confirmed via prior audit's own re-verification, not re-checked here).
- Live value unchanged: `compiled_dict.json["answer"]` = `"ku·chak·a"`.
- Masking override unchanged: `corrections.json["answer"]` = `"Aganchaka"`. Zero runtime exposure today — `translate('answer')` still returns the correct value via the override, not via `pickPrimary`.
- Root cause, unchanged: `.toLowerCase()` key-collapse merges `answer`/`Answer` into one `pickPrimary` pool containing two genuinely-VERIFIED, different-POS candidates (`Aganchaka` verb, `Aganchakani` noun) plus two non-VERIFIED variants (`in·chak·a`, `ku·chak·a`). The verified-neutral auto-resolve branch requires exactly one VERIFIED candidate; two triggers fallthrough to last-write-wins by array order, which is how `ku·chak·a` ships.
- **Still open, Claude B's territory:** no tie-break has been implemented. This is fragile, not broken — if the `corrections.json` override is ever mechanically resynced away, the wrong value ships with no test catching it.

## §2 — 9-key no-verified-candidate defect (Claude B's territory, open, unchanged)

Confirmed live via direct read of `compiled_dict.json` against `master_dictionary.json` VERIFIED rows:

| key | live compiled value | VERIFIED/HIGH candidate(s) on file | live value matches? |
|---|---|---|---|
| work | `Kam` | `ga·a`, `ka·a` | No — OCR-flagged import (`ocr_confidence=High`), unrelated to either VERIFIED form |
| boil | `bi·rot` | — (not individually re-checked this pass; carried from prior audit) | No (per prior audit) |
| build | `gat·a` | " | No |
| close | `grip·a` | " | No |
| empty | `bal·ang·ga` | " | No |
| leg | `ja·` | " | No |
| outside | `a'palo` | " | No |
| strong | `Gong·raka` | " | No |

`work` spot-checked in full this pass as a representative case: `master_dictionary.json` carries a SUPERSEDED, unannotated `Dak·a` row whose own note already states *"Compile pipeline does not yet apply confidence precedence — see handoff to Claude B"* (dated 2026-08-01) — this is the same defect class as §1, diagnosed independently over two weeks before the `answer` case surfaced it again.

## §3 — Gap analysis between Claude A and Claude B

**No actual disagreement or miscommunication between roles.** Sequencing has been correct and is being followed:

- Claude A's linguistic/data-hygiene step (tag stale rows SUPERSEDED, cite the native-validation session that superseded them) is complete for `answer` and was never blocking-required for the other 8 keys (their stale rows are already tagged SUPERSEDED — the gap is purely on the compile side).
- Claude B's engineering step — a `pickPrimary` tie-break/precedence fix — has been correctly diagnosed **twice**, independently, at two different keys (`work`, then `answer`), but not yet implemented at either.

**The only real gap is a single missing piece of engineering work**, not a coordination failure: `pickPrimary` needs one fix that covers both subclasses —
1. no-VERIFIED-candidate-matches-live-value (the 9-key case: live value traces to a SUPERSEDED/OCR-flagged row, VERIFIED alternatives sit unused), and
2. multi-VERIFIED-candidate tie (the `answer` case: two different-POS VERIFIED candidates, no resolution rule).

A POS-aware or confidence-precedence tie-break, applied at compile time, appears to resolve both from the evidence on file — but that design call belongs to Claude B, not this audit.

## §4 — Other open issues (unrelated to §1/§2, listed for completeness)

Per `.ai/WORKSTATE.yaml` `claude_a.waiting_for`, three Check C conflicts remain, all Claude A's call, not touched by this audit:
1. **adultery** — `Til'eka` (VERIFIED/HIGH) vs `Jua ba tileka` (UNVERIFIED/MEDIUM)
2. **mature** — `dil·ding bal·jak` (UNVERIFIED/HIGH) vs reconfirmed `dal·gimin`/`brigimin`
3. **where (relative pronoun)** — `jeon` vs `jeo`, no native answer yet

Render stays blocked on these per existing policy; no new information this pass.

## Next actions

- **Claude A:** none. Your part of §1 is done. §4's three items remain yours whenever native input is available.
- **Claude B:** design and implement a `pickPrimary` tie-break covering both §1 and §2. Suggested shape (not a mandate): when the lowercased pool contains 2+ VERIFIED candidates, prefer POS-aware selection over last-write-wins; when the live/compiled value matches no VERIFIED candidate on file, prefer the VERIFIED candidate over a SUPERSEDED/OCR-flagged one. Re-run the full 9-key set plus `answer` after the fix; full gate + runtime-sweep re-verification expected per usual discipline.
- **Both:** no action needed on `student` or the 85-key resync — both remain closed, not re-checked this pass (no changes touched them since 20260815B).
