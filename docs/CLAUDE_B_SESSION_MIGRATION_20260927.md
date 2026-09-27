# Claude B Session Migration — 2026-09-27

## Project identity
Lean Garo — English↔Garo translation engine. Repo:
`pzrjv4sfj5-prog/Lean-Garo-`, branch `main`. Claude B's lane is
engineering/runtime. Dictionary/linguistic-content calls are Claude A's
lane — see `.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json` and
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`.

## Resume
Resumed via a pasted pointer to `docs/CLAUDE_B_SESSION_MIGRATION_20260925.md`
plus a fresh PAT-cloned repo. That doc was stale by one day — the actual
ground truth was `docs/CLAUDE_B_SESSION_MIGRATION_20260926.md` (HEAD
`53e193e`), confirmed via `git fetch`/`git log`. Resynced against the
newer doc before starting any work, per Resume Policy (Rule 10).

## What's done this session

**1. Engineering fixes from Project Owner relaying Thangseng (2026-09-27):**
- `grammarEngine.js`: object-phrase quantifier composition reversed from
  Noun+Quantifier to **Quantifier+Noun** — confirmed deliberate
  ("Bang.a chattrorang" correct, not "chattrorang bang.e", which would
  read as "in large numbers"). Conflicts with 2 pre-existing static
  `corrections.json` citations (pork-fat, "so many people came") that
  still use the old order — flagged in code comment, not touched
  (Claude A's lane, static content).
- `sentenceBuilder.js`: fixed naive `"Anga"+"o"` concatenation producing
  `"Angao"` — now `"Ango"` per Thangseng's letter-drop rule. Scoped
  narrowly to the `"Anga"` pronoun only; not generalized to `"Ua"`/`"Ua"`-
  derived forms or `"bi·sa"`, neither of which has the same confirmation.
- Left untouched (flagged, not guessed at): the relayed message is
  internally contradictory on the `"several"` dictionary value (argues
  `bang·a` is wrong for "several", then says "we will use bang.a from
  now on" — reads as a likely typo for `adita`, not resolved here).
  Current shipped value (`bang·e`) unchanged.
- Pushed as `dc28574`, rebased cleanly onto 2 concurrent commits
  (`898f141` Claude D proposal, `a46cfea` Claude A close) — docs-only,
  zero code overlap.

**2. Sentence-builder structural audit (Owner-requested, this session):**
Read both `assembleSentenceSOV` and `assembleGrammar` in full; probed
~35 constructions live across negation/questions/if-clauses/multi-clause/
purpose-clauses/locative-adjuncts/existential-possession/plural
fallback. Reconfirmed AI-003 (multi-word `VERB_LEMMAS` invisible to
matchers, e.g. `"it crumbled down"` → `"Ua ka·ma·ko"`) still open, not
touched — already catalogued in `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`.

**New finding, not previously catalogued:** `translationEngine.js`'s
"stopword-stripped" step (runs before grammar-assembly) does a bare
dictionary lookup after stripping only `a`/`an`. 26 of 32
`master_dictionary.json` entries matching `<pronoun> have/has X` are
`unverified` (or unmarked), using an older `ong·a`-pattern construction
with inconsistent pronoun forms (`bi`, `na·` without raka) that
conflicts with the tested/confirmed `donga`-existential pattern
elsewhere in the codebase. When a sentence exactly matches one of these
26 stale entries, the correct grammar-assembly output never runs —
confirmed live: `"they have a house"` → `"bi ong·a rang"` (confidence
0.75, correctly capped via `UNVERIFIED_WORDS` but still wrong-pattern)
instead of `"Uamango Nok donga"`. This is a precedence bug
(engineering, mine to eventually fix) entangled with a content decision
(which of two competing constructions is correct — Claude A's/Owner's
call). **Not fixed this session** — flagged for the Runtime Handoff
below and for Claude A.

## Runtime Handoff (Claude B)
- `"they have a house"`, `"you have a book"`, and (per the same
  scan) at least 24 other `<pronoun> have/has X` sentences.
  VERIFIED elsewhere in the codebase for the same construction shape:
  `donga`-existential pattern (e.g. `"the boy has a dog"` →
  `"Me·a bi·sao achak donga"`, confirmed live, grammar-assembly).
  Runtime status: these 26 keys currently ship a **different,
  `unverified`-tagged** `ong·a`-pattern value instead, via the
  stopword-stripped step, which runs ahead of grammar-assembly in the
  cascade and short-circuits it.
  Action: Claude A/Owner to adjudicate which construction (`donga` vs
  `ong·a`) is correct for this sentence family. Once decided, either
  (a) supersede the 26 stale entries so grammar-assembly's `donga`
  pattern is reachable, or (b) if `ong·a` is in fact correct for these
  specific pronouns, confirm that and I'll stop treating it as a defect.
  Until resolved, do not treat any `<pronoun> have/has X` sentence as
  fully verified at runtime purely because grammar-assembly can produce
  it — check whether a matching stale full-sentence entry pre-empts it.
- Quantifier-order reversal and the `Anga`→`Ango` fix (this session,
  commit `dc28574`) are both live-verified via `translate()` post-build
  and covered by new/updated unit tests — no open runtime gap for those
  two.

## Governance-model check
Read `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` at session start; no new
engineering-scope precedent needed this session — both fixes applied
(quantifier order, Anga/Ango) are squarely engineering (composing
already-resolved dictionary values into sentence structure), not new
dictionary content, consistent with §4's existing bright line. Also
read Claude D's `docs/PROPOSAL_MIGRATION_GOVERNANCE_ENFORCEMENT_20260926.md`
(Rule 6/6a mechanical-enforcement proposal) before writing this
document — this doc's Runtime Handoff and Governance-model check
sections are written to satisfy that proposal's Target State directly,
not just the pre-existing honor-system wording. Did not implement the
proposal's `scripts/check-migration-doc.js` this session (out of scope
for today's work; flagged as next-session candidate below, pending
Project Owner sign-off on the exact-heading-string wording change
Claude D's proposal correctly notes is a prerequisite, per Rule 9).

## Open issues (carried forward, unchanged in substance unless noted)
- **New this session**: the 26-entry `have/has` stale-entry precedence
  conflict above — top open item.
- AI-003: multi-word `VERB_LEMMAS` matcher gap — reconfirmed still open,
  not attempted.
- `"-rang"` plural suffix question (Thangseng's own example showed it,
  never confirmed general vs. `adita`-specific) — still awaiting
  Thangseng clarification, per 2026-09-26 close.
- The `several` = `bang·e`/`adita`/`bang·a` contradiction in this
  session's relayed message — needs a one-line confirmation from
  Thangseng/Owner on which was actually meant.
- Claude D's migration-governance-enforcement proposal
  (`PROPOSAL_MIGRATION_GOVERNANCE_ENFORCEMENT_20260926.md`): content
  proposed, implementation assigned to Claude B, but blocked on Project
  Owner sign-off for the exact Rule 6/6a heading-string wording change
  before the check script can be written against a fixed target.

## Standing rules established / reused this session
- (Reused) PAT handling: this session used a PAT the Owner explicitly
  directed be reused across sessions ("no more rotation"). Flagged the
  exposure risk each time before complying; used inline in git commands
  only, never persisted to `.git/config` or any tracked file (confirmed
  via grep at push time) — same discipline as every prior session's PAT
  use, independent of the rotation-frequency instruction.
- (Reused) `.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json`: directives
  relayed live in chat are authoritative without a separate proof gate;
  conflicts with existing repo evidence are a documentation obligation,
  not a reason to refuse — applied when scoping the quantifier-order
  and Anga/Ango fixes against pre-existing conflicting citations.
- Full gate before every push (reused, unchanged): `prepare-data.js` →
  `test-dictionary.js` → `repository-intelligence.js` →
  `node --test tests/unit/*.test.js` → `scripts/runtime-error-sweep.mjs`.

## Gate at close
- `node prepare-data.js`: 8922 unique entries, no diff after rebase.
- `node test-dictionary.js`: 8922/8922 valid, 9/9 grammatical
  corrections.
- `node repository-intelligence.js`: PASSED, 0 new violations.
- `node --test tests/unit/*.test.js`: 475/475 passing.
- `node scripts/runtime-error-sweep.mjs`: 15897/15897 calls, 0 errors.
- Working tree clean, `git fetch` immediately before this doc confirmed
  HEAD == `origin/main` == `dc28574`, no drift.

## Exact next step
0. **DIVERGENCE, NOT RESOLVED — first thing the next session must
   handle (Rule 10/Rule 9a):** after this session's close commit
   (`859d871`, based on `f910b73`), `origin/main` advanced one more
   commit: `584cc2d` (Claude A, "fix bare-key 'build' phrase_maps.js
   override to match VERIFIED/HIGH Rik·a citation"), touching
   `src/data/phrase_maps.js`, `.ai/SESSION_BOOTSTRAP.md`,
   `.ai/WORKSTATE.yaml`, and `docs/CLAUDE_A_SESSION_MIGRATION_20260927.md`.
   `git push` was rejected (non-fast-forward). Per Rule 9a, migration
   mode does not resolve real divergence — stopped here rather than
   rebasing, even though the divergence is small, because **`.ai/
   WORKSTATE.yaml` is touched by both sides** (this session's `claude_b:`
   block edit vs. Claude A's edit elsewhere in the same file), so this
   is a genuine merge decision, not a mechanically-safe fast-forward.
   `859d871` is fully committed locally and gate-verified but **NOT
   pushed** — `git fetch` + `git log HEAD..origin/main` will show
   `584cc2d` still ahead; rebase onto it, resolve the `WORKSTATE.yaml`
   overlap (both edits are additive to different keys/sections — should
   be a clean textual merge, not a content conflict, but verify), re-run
   the full gate, then push.
1. Resolve the `have/has` 26-entry precedence conflict (Runtime Handoff
   above) — needs Claude A/Owner adjudication first, then an engineering
   fix (either supersede stale entries or confirm `ong·a` is correct).
2. If the Owner wants Claude D's migration-governance-enforcement
   proposal implemented, get sign-off on the exact Rule 6/6a heading
   strings first (prerequisite the proposal itself names), then build
   `scripts/check-migration-doc.js` per its Migration Strategy.
3. AI-003 (multi-word `VERB_LEMMAS`) and the `-rang`-plural/`several`
   contradiction remain open, unchanged priority from prior sessions.

On resume: treat this doc as ground truth, but note it describes a
**local, unpushed** commit (`859d871`) plus a known one-commit
divergence (item 0 above) — resolve that first, before anything else,
then re-run the full gate fresh before picking up item 1.
