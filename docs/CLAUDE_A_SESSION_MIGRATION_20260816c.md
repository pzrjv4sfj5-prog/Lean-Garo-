# Claude A — Session Migration Document — 2026-08-16c (session close)

Continues docs/CLAUDE_A_SESSION_MIGRATION_20260816.md (sessions a/b of
today). This is the final close for today's work.

## What was asked
PO: "fix all and once done start migration with complete migration
governance, maintain token discipline" — referring to the 3 Next
Recommended Tasks flagged at the end of session b: (1) hortative -ha/-na
conflict, (2) 4 immediate pickPrimary ties, (3) the 141-key
pickPrimary tie backlog.

## What was actually done (not blind "fix all")
Evidence-first methodology forbids guessing linguistic values without
citation or corpus-internal contradiction. Rather than fabricate 140+
resolutions, each item was individually checked for real evidence
first:

**1. Hortative -ha/-na — scope corrected, not a 15-entry fix.**
Re-checked every "let's [verb]" entry's actual citation status
individually. Only 2 of the cluster carry real evidence
(`VERIFIED/HIGH/200sentences`): "Let's go."→"Hai re·naha.",
"Let's eat."→"Hai cha·ha." Everything else in the corpus's own -ha
forms (sleep/drink/sit/play/work/hang out) is just as uncited as
corrections.json's -na versions — the earlier session's "~15-entry
conflict, has a citation" framing was an overclaim, corrected in
docs/PENDING_REGRESSION_CASES.md. One real fix applied:
corrections.json `"let's eat"`/`"let's eat food"` (`Hai cha·na`→
`Hai cha·ha`, `Hai mi cha·na`→`Hai mi cha·ha`) to match the citation;
`"let's go"` already matched, no change needed. Remaining ~6 pairs left
untouched — genuinely open, needs a native check.

**2 & 3. pickPrimary ties (4 flagged + 141-key backlog, same
investigation) — triaged, 1 fixed.** Scanned all 141 keys'
`master_dictionary.json` notes for citation asymmetry or explicit
ranking language:
- **Fixed: `angry`.** `bika ding'a` (idx 9182)'s own citation states
  the native gave `ka'o nanga` "most common" alongside it. Retagged
  `bika ding'a` `variant/VERIFIED/HIGH` so `Ka·onanga` ships as primary
  — resolves the tie on the native's own stated ranking, not a guess.
- **Left untouched, with reasons (not silently skipped):**
  - `demand` (Dabia/Dabiani) — legitimate POS split, both correctly
    VERIFIED per direct Thangseng citation, same shape as `answer`.
    Doesn't need a pick, needs POS-aware pickPrimary (Claude B's lane).
  - `where`/`Where` (Bano/Bachi) — case-insensitive key-collapse
    merging two genuinely different words (stationary vs movement-to
    locative, per RULE-044). Picking either would silently discard a
    real distinction. Compile-layer case-handling question, not a data
    question.
  - `where (relative pronoun)` jeon/jeo — each entry's own note
    contradicts the other on which is "primary" ("jeon: free variant of
    jeo" vs "jeo: short form of jeon") — genuinely ambiguous, no forced
    pick.
  - `the market is nearby` — native gave both forms directly with the
    corpus's own note saying "distinction not yet characterized (open)".
    Forcing a pick would be a guess.
  - `gong` and the remaining ~136 keys — no ranking or citation
    asymmetry found on inspection; correctly left as an open
    native-validation backlog, not bugs.

**4. Found + fixed a documentation defect while working: RC-CANDIDATE
ID collision.** Session b's drink-cluster fix was numbered
"RC-CANDIDATE-012" in docs/PENDING_REGRESSION_CASES.md, colliding with
a pre-existing unrelated entry of the same number ("Raka rendered as
apostrophe"). Renumbered to 039 (next free ID), including the pin test
file (`rc009_drink_sing_raka.test.js` → `rc039_drink_sing_raka.test.js`)
and its internal references.

## Duplicate-representation check (Rule 8)
None of the touched keys (`angry`, `let's eat`/`let's eat food`) have
`phrase_maps.js` or other engine-side overrides — confirmed via
repository-intelligence.js Check F, 0 new mismatches.

## Verification
- `node prepare-data.js`: 8127 compiled entries (unchanged count —
  `angry` tie resolution doesn't add/remove a shipped key, just changes
  which candidate wins). pickPrimary tie backlog: 141→140 keys.
- `node test-dictionary.js`: 8127/8127 valid.
- `npm test`: 218/218 passing.
- `node repository-intelligence.js`: 0 new violations, Check A raka
  candidates unchanged at 11 (report-only, no action needed).
- `node scripts/runtime-error-sweep.mjs`: 14,523 calls, 0 errors.

## Repository status at close
- HEAD: `2f9cb926a9dac4002075bb76d3367fe428684562`
- `origin/main`: confirmed match via `git fetch` + `git rev-parse` both
  sides, post-push
- `git status`: clean, no uncommitted changes, no local-only commits
- `WORKSTATE.yaml`: updated, claude_a.next_action closed for this
  session
- `SESSION_BOOTSTRAP.md`: unchanged this session
- Migration doc: this document, complete
- Native-validation/blocker status: no open native-validation item, no
  queued task. Genuinely open items (not bugs, not guessable):
  1. ~6 hortative -ha/-na pairs (sleep/drink/sit/play/work/hang out) —
     uncited on both sides.
  2. `where`/`Where` case-collapse (Bano/Bachi) — needs Claude B
     compile-layer attention (case-sensitive key handling), not a
     native-validation question.
  3. `demand` (Dabia/Dabiani), and ~136 remaining pickPrimary ties in
     docs/PICKPRIMARY_VERIFIED_TIES.md — legitimate native-validation
     backlog for a future NV batch, not urgent, nothing currently
     wrong.
  4. `jeon`/`jeo` primacy — corpus's own two notes on which is
     "the variant of" the other contradict each other; would need a
     direct native question to resolve, not corpus-resolvable.

## Exact next step for the next Claude A session
1. Resume per Rule 10 (fetch/verify HEAD/pull-if-needed/confirm clean/
   read WORKSTATE + SESSION_BOOTSTRAP + this doc).
2. No queued linguistic task. If continuing this thread, the 4 open
   items above are ready to become an NV batch relay question
   (Thangseng via Tridip) rather than corpus-internal work — that's the
   only way any of them actually close further.
