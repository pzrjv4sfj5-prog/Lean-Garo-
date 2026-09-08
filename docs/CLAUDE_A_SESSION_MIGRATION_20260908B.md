# Claude A Session Migration — 2026-09-08B

**Resumed from:** `docs/CLAUDE_A_SESSION_MIGRATION_20260908.md`
**Repository status at close:** HEAD `5177462`, `origin/main` `5177462` — match confirmed via `git fetch` immediately before this doc was written. `git status` clean. Pushed via live-pasted PAT (session-scoped; rotate per standing rule).
**Stopping reason:** token-discipline checkpoint per Project Owner instruction ("work in small batches, migrate whenever it's token heavy") — not a blocker, not an error. A large amount of queued work remains (see below); starting it now would blow the batch-size budget.

---

## 1. Work completed and pushed this session

**boy/girl resolved** (commit `5177462`, rebased cleanly onto a concurrent Project Owner push):
- `master_dictionary.json`: `Boy→ko·ka` and `Girl→ko·ki` downgraded `verified_high→superseded`. Zero native citation on either; only shipped as primary via a 2026-09-04D reorder (NV-127), now superseded per the 2026-09-08 Claude C forensic audit / `AGENT_A_B_C_LANGUAGE_ENGINEERING_HANDOFF_20260908.json`.
- Added `little boy→me·a bi·sa`, `little girl→me·chik bi·sa`, VERIFIED/HIGH, citing the existing NV-130 quote already backing bare `boy`/`girl`.
- Rebuilt via `prepare-data.js`: pickPrimary tie eliminated; `compiled_dict.json` now correctly resolves `boy`/`girl`/`little boy`/`little girl`.
- **Left for Claude B, not touched:** `src/data/phrase_maps.js` lines 350–351 still hardcode `'boy':'ko·ka'` / `'girl':'ko·ki'`, so live `translate()` still returns the stale values. This is the sole new `repository-intelligence.js` Check F mismatch and the one new failing unit test (`BACKLOG-006` meta-test) — both are the expected, correct signal of this exact bug. Do not allowlist; fix the hardcode.

**Audited, no change needed (already correct or already-flagged-open, confirmed this session):**
- Adult gender terms (`me·asa`, `me·chik`, `me·chikma`, `me·apa`) — intact.
- `can = ama/man·a` — clean, both verified_high, no distinction invented.
- `sit`/`sitting` (`aonga`/`asongenga`) — clean, no stale resurrection.
- forest, chiko/chibimao, finish/find/get/earn — untouched, confirmed already-resolved.
- **Discovered while auditing `able`:** `man (male) → me·a` already exists at row 5347, VERIFIED/HIGH, correctly annotated as the *bound root* (`"(bound root, as used in me·a bi·sa=boy)"`), citing NV-130 — separate from `man → Me·asa` (row 532) and `male → Me·asa` (row 10026). So the "me·a vs me·asa" distinction the new PO directive pass asks to close (item 2 below) is **already correctly recorded**, just not under the exact English key the directive names.

Gate at close: `prepare-data.js` clean (8251 entries), `test-dictionary.js` 8251/8251 · 9/9, unit tests 363/364 (the 1 expected failure is the boy/girl BACKLOG-006 meta-test above).

---

## 2. Queued work — NOT started, two separate batches

### Batch A — "FINAL OPEN-ITEM CLOSURE PASS" (pasted document, not yet a repo file)

A Project Owner chat document arrived mid-session instructing closure of: `able`, `male/man=me·a`, `female/woman=me·chik`, the `bi·sa` semantic rule, boy/girl (done above), `ska`/`skenga`, the `sikenga`→`skenga` correction in the "want to pray" example, the explicit-object `·ko` retention rule, and the `ska·` trailing-raka-dot form.

**Governing protocol found this session:** `.ai/PROJECT_OWNER_AUTHORITY.md` (2026-09-06) + the newly-updated `.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json` (pushed by T directly, pulled in via rebase this session, schema `2026-09-08.2`) — a chat-delivered PO directive is authoritative with **no transcript required**, but **must** be provenance-labeled `"Project Owner directive"` / `"Project Owner-confirmed"` in `notes`, never written as if it were a direct or reported native (Thangseng) quote. This resolves the tension I was sitting with before the protocol file appeared — the right move is to implement, correctly labeled, not to refuse for lack of a transcript.

Concrete complications found before stopping, for whoever picks this up:
- **`ska`/`skenga`/`sikenga` is genuinely tangled, not a clean rename.** Two *existing* VERIFIED/HIGH rows (`i want food→Anga mi·ko sikenga`, `i want water→Anga chi·ko sikenga`) use `sikenga` as the correct "want" form. A *separate*, older, dated correction (2026-07-18, `docs/PENDING_LINGUISTIC_PROPOSAL_20260718_sikenga_ska_sika.md`) explicitly rejects `sikenga` as an error for "want," calling it the continuous of the unrelated verb `sika` ("push/insert"). The new PO directive's blanket "`sikenga`→`skenga`, this is a correction not an open question" cannot be applied as a global find/replace without violating `PROJECT_OWNER_DIRECTIVE_PROTOCOL.json`'s own `semantic_cleanup_unit` rule (fix is per English-key/sense, not per Garo string). Needs a full per-row inspection pass, not a quick edit.
- The `·ko` explicit-object-retention rule and the `ska·` trailing-dot disposition both need the same per-occurrence check before writing anything.
- `able→ama/man·a`: no blocking issue, just not yet done — should get a `"Project Owner directive"`-labeled (not NV-numbered) promotion.

### Batch B — fruit/food canonical-form directives (pushed live by T, commit `2446176`, rebased in — not yet acted on)

`.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json`'s `owner_directives_2026_09_08` block gives final canonical forms for: **three fish** (`na·tok mang·gittam`, resolving a `na·tok mang·gni` collision with *two fish* — must not touch the `two fish` rows), **orange** (`Narang`), **papaya** (`Modupol`), **watermelon** (`tor·mus`), **mango** (`te·ga·chu`), **sweet potato** (`ta·mil·ang`). Each has exact `master_dictionary.json`/`garo_dictionary.json` row indices listed in the protocol file — start there. `known_dictionary_conflicts.json` already flags all six as conflicted with no resolution recorded. This entire batch is untouched.

---

## 3. Recommended next-session order

1. Batch B first — six well-scoped, independently-evidenced canonical-form directives with exact row indices already given; low ambiguity, good size for one batch.
2. Batch A's clean items next (`able`, `bi·sa` rule documentation, boy/girl already done).
3. Batch A's `ska`/`skenga`/`sikenga`/`·ko`/`ska·` cluster last, as its own dedicated batch — it's the one genuinely research-heavy item and shouldn't be rushed alongside anything else.

## 4. Runtime Handoff (mandatory section)

- **Claude B, confirmed:** `src/data/phrase_maps.js:350-351` hardcodes `boy`/`girl` to the now-superseded `ko·ka`/`ko·ki`. Remove the hardcode (or update to `me·a bi·sa`/`me·chik bi·sa`) so live `translate()` matches `compiled_dict.json`. This closes the one new failing unit test and the one new Check F mismatch — do not allowlist either.
- No other runtime-affecting linguistic closures this session.

## 5. Repository status at close (verified, not asserted)

- [x] HEAD `5177462`
- [x] `origin/main` `5177462` (git fetch immediately before writing this doc)
- [x] `git status` clean
- [ ] `WORKSTATE.yaml` — **not yet updated this session, next action below**
- [x] This migration doc complete
- [x] No local commits ahead of origin
- [x] No uncommitted changes
- [x] Native-validation/blocker status: no new NV-numbered items opened or closed this session (boy/girl reused existing NV-130); Batches A and B above are the standing blockers for next session
