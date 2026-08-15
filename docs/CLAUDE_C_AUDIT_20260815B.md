# Claude C — Independent QA Audit (follow-up pass, 20260815B)

**Audited HEAD:** `888c61a` (origin/main, clean tree)
**Prior audit:** `docs/CLAUDE_C_AUDIT_20260815.md` (head `6ce3785`)
**Method:** Read-only. Fresh clone, `npm install`, `node prepare-data.js`, `node --test tests/unit/*.test.js`, `node repository-intelligence.js`, and direct `translate()` calls against the live engine for every claim below. No files modified during the audit itself; this document is committed on Claude C's behalf per the standard policy (`.ai/WORKSTATE.yaml` claude_c.role), at the Project Owner's direct instruction.

This report has two addressed sections — **Part 1: for Claude A**, **Part 2: for Claude B** — plus one finding (§3) that concerns both and is the main new content this cycle.

---

## 0. Executive summary

- 2 of the 3 items open at the last audit are now **verified fixed at runtime**, not just claimed: `student`'s bare-noun root, and the 85-key SUPERSEDED-override resync.
- 1 item remains open exactly as flagged (9 `compiled_dict.json` keys serving non-VERIFIED values) — confirmed still live, correctly not touched by either role yet.
- **1 new finding**, the main content of this pass: `answer` is a live example of the same bug class as the 9 keys above, currently **masked by a coincidental override**, not actually fixed at the compile layer. This is the concrete case of "A says fixed, B (or any compiled_dict-level check) says still wrong" the Project Owner asked to be investigated. Both roles are partially right — see §3.

---

## PART 1 — For Claude A

### 1.1 Verified: `student` fix is correct at runtime

Direct `translate()` calls against current HEAD:

```
twenty student  => Chattro sak·Kolgrik   (exact-phrase, 0.98)
twenty students => chattro sak·Kolgrik   (classifier fallback, 0.96)
student         => Chattro               (exact-phrase, 0.98)
students        => Chattro               (sov-assembly, 0.75)
one student     => Chattro sak·sa        (exact-phrase, 0.98)
```

NV-073's root reaches runtime through every path now — singular, plural, and the classifier-composition fallback. No further action needed on `student`.

### 1.2 Verified: 85-key resync complete and correctly scoped

Re-ran `scripts/resync-stale-overrides.mjs` myself (dry-run) rather than trusting the commit message: **0 remaining resync candidates**, down from the 249-entry baseline. It did not touch the 152 legitimate-variant entries, and correctly declined to touch the 9 keys in §1.3/§3 below.

### 1.3 Still open, not your action: the 9 `compiled_dict.json` keys

`work` (2 rows), `boil`, `build`, `close`, `empty`, `leg`, `outside`, `strong` still ship non-VERIFIED compiled values. Confirmed live again this pass. This is a `pickPrimary` engineering defect (Claude B's territory) — resyncing the override tables to match would launder the wrong value. Your restraint in not touching this is correct.

### 1.4 New — action needed: `answer`'s stale UNVERIFIED duplicate

See §3 for the full trace. Short version: your NV-077 fix is linguistically correct and reaches runtime, but only because an unrelated override happens to mask a real compile-layer bug. The compile-layer bug exists because a stale, pre-NV-077 duplicate entry (`"answer": "a·gan·chak·a"`, tagged `UNVERIFIED/HIGH`) was never marked `SUPERSEDED` when NV-077 superseded it. **Action:** tag that specific row `SUPERSEDED` (same treatment as the 85-key sweep in §1.2), citing NV-077. This is a pure data-hygiene fix, no new native input needed — the native ruling already happened.

### 1.5 Governance observation (carried forward, still relevant)

Bulk corpus-internal SUPERSEDED-tagging sweeps still don't trigger a Runtime Handoff at tagging time. The `answer` case in §3 is a fresh instance of the same failure shape as `student` and the 2026-08-06 bug: a linguistic fix landed correctly in `master_dictionary.json`, but nothing forced a check of whether the *old* superseded value was also cleaned up or still sitting in the candidate pool. Recommend: any NV closure or SUPERSEDED-tagging session includes an explicit "did the old value get removed from pickPrimary's pool, not just replaced" check.

---

## PART 2 — For Claude B

### 2.1 Nothing landed from you this cycle

No engineering commits since `6ce3785`. Your session-E fixes (exact-phrase precedence, SUPERSEDED-only-candidate filtering) re-verified correct at current HEAD — spot-checked `twenty student` and classifier fallback paths, both still hold.

### 2.2 Confirmed still open: the 9 keys

Reproduced directly against current HEAD:

```
work    => Kam        boil  => bi·rot     build => gat·a
close   => grip·a     empty => bal·ang·ga leg   => ja·
outside => a'palo     strong=> Gong·raka
```

`work` occurs in both `corrections.json` and `phrase_maps.js` (the 9th row, 8 distinct keys). `resync-stale-overrides.mjs` correctly buckets these as `skip_no_verified_match` and declines to touch them. Root cause: `pickPrimary` has no candidate at all tagged VERIFIED for these keys, so an untagged/OCR-import value wins by the last-write-wins fallback. This is unchanged from the last audit — flagging again for continuity, not as new information.

### 2.3 New — action needed: `answer` is a live (masked) instance of the same bug class

Full trace in §3. Short version for you: `compiled_dict.json["answer"]` is wrong (`a·gan·chak·a`, UNVERIFIED) even after Claude A's correct NV-077 fix, because of a `pickPrimary` behavior specific to this case — a **genuine tie between two different-POS VERIFIED candidates** (`Aganchaka` verb / `Aganchakani` noun) that only exists because key-lowercasing merges what Claude A modeled as two separate keys (`"answer"` / `"Answer"`) into one competing pool. `pickPrimary`'s verified-neutral branch requires *exactly one* verified candidate to auto-resolve; with two, by design it declines and falls through to master-array-order last-write-wins, which happens to pick the stale UNVERIFIED third entry once Claude A removes it per §1.4 — or currently picks it directly.

**Two separable problems, so two separate actions:**

1. Once Claude A tags the stale UNVERIFIED row `SUPERSEDED` (§1.4), the candidate pool drops to 2 (both genuinely VERIFIED, different POS). `pickPrimary` will *still* fall through to last-write-wins between them — undefined which of `Aganchaka`/`Aganchakani` ships for `compiled_dict.json["answer"]`. This won't error, but it's not principled: whichever wins, the other POS is unreachable from compiled_dict directly (though currently masked by the `corrections.json`/`phrase_maps.js` override for the exact word `"answer"`).
2. Longer-term: consider whether `pickPrimary`/key-normalization should preserve POS-driven case distinctions (or an explicit POS field) rather than collapsing on `.toLowerCase()` alone, since this collision pattern (noun/verb sharing an English spelling, differing only by case convention in the source data) is likely to recur for other homograph pairs. Not urgent — flagging as a design question, not demanding a fix this cycle.

### 2.4 Full gate, re-run independently

```
node --test tests/unit/*.test.js  → 215/215 pass
node repository-intelligence.js   → PASSED, 0 new violations (Check F: 203 known, 0 new)
node prepare-data.js              → 8132 unique entries, 190 held (unchanged)
```

---

## §3 — THE MAIN FINDING: `answer`, why A and B can both be right

This directly answers the Project Owner's question: *"A already fixed answer, why does B flag it again?"*

**Runtime is correct.** Every phrasing tested resolves to `Aganchaka`:
```
answer, Answer, the answer, an answer, wrong answer,
my answer is no, give me an answer  →  all "Aganchaka"
```
This is why Claude A is right to call it fixed — NV-077's decision (`Aganchaka`=verb, `Aganchakani`=noun) is correctly recorded in `master_dictionary.json`, and the word a user actually gets back is correct.

**`compiled_dict.json` itself still ships the wrong value:**
```
compiled_dict.json["answer"] = "a·gan·chak·a"   (UNVERIFIED, stale, pre-NV-077)
```
This is why an audit that checks the compiled source-of-truth — which is what a build-gate style check, or Claude B reviewing `compiled_dict.json` directly, would do — is also right to flag it as still wrong.

**Why runtime is correct despite that:** `corrections.json` and `phrase_maps.js` both independently hardcode `"answer": "Aganchaka"` at the highest-precedence lookup layer (method `correction`, confidence 1.0). This override **predates and is unrelated to NV-077** — it happens to already hold the correct value, and masks the compile-layer bug for every phrasing that resolves via that layer or via sov-assembly (which itself consults the correction layer per-token).

**Mechanism (root cause, confirmed by reading `prepare-data.js`'s own inline documentation of this exact case around `pickPrimary`, line ~195):**

1. Keys are lowercased before `pickPrimary` runs. Claude A's model — `"answer"` (verb, lowercase) and `"Answer"` (noun, capitalized) as safely separate, non-competing keys — does not hold at compile time; they collapse into one pool.
2. That pool has 3 non-variant candidates: `Aganchaka` (VERIFIED, verb), `Aganchakani` (VERIFIED, noun), `a·gan·chak·a` (UNVERIFIED, stale — never marked SUPERSEDED).
3. `pickPrimary`'s only VERIFIED-aware auto-resolve branch fires **only when exactly one** verified non-variant candidate exists. Here there are two (a genuine noun/verb tie) — by design it declines to guess and falls through to master-array-order last-write-wins.
4. The never-cleaned-up UNVERIFIED entry sits later in `master_dictionary.json`'s array order than both VERIFIED entries, so it wins that fallback.

**Exposure:** currently zero at runtime — every path tested is masked by the `corrections.json`/`phrase_maps.js` override. **Risk:** if that override is ever removed (e.g., by a future mechanical resync pass treating it as "redundant, matches nothing in compiled_dict so must be stale" — the exact inverse of the logic that correctly resynced the 85 keys in §1.2), the wrong value would surface at runtime immediately with zero warning, since it isn't currently caught by any test or Check F allowlist entry.

**Verdict on the Project Owner's question:** A's fix is real and complete at the linguistic layer and the current runtime. B's flag is also correct, pointing at a real defect one layer down (compiled_dict.json) that A's fix didn't reach because it's an engineering/pickPrimary problem, not a linguistic one — A had no way to close it unilaterally. The two aren't actually in conflict once the layers are separated; the gap is the process gap in §1.5: nothing currently checks "was the pre-existing stale duplicate cleaned up" as part of closing an NV.

---

## Verification scope (Rule 7)

Checked: `student`/`answer` full runtime matrix (12 calls total), resync script re-run, full test suite, full repository-intelligence gate, the 9 flagged keys' live compiled values, `prepare-data.js` pickPrimary logic read in full for the branch that governs `answer`. **Not checked this pass:** the other 152 "intentional variant" resync entries, a full re-derivation of all 8132 compiled entries, or a systematic search for other homograph pairs with the same noun/verb-case-collision shape as `answer` (recommended as a follow-up audit if useful).
