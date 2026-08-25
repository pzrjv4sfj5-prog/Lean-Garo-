# Claude B — Session Migration Document (2026-08-24C)

## Verification performed this close (scope stated explicitly, per Rule 7)

- **Runtime errors:** `npm test` → 229/229 pass, 0 failures. `node
  repository-intelligence.js` → PASSED, 0 new violations of any kind.
  `node src/research/demo.js` (the new prototype's own entry point) →
  ran to completion with no thrown errors, all 3 demo cases produced
  the expected structured output. This confirms the existing regression
  set and the new prototype's own runtime — it does NOT re-verify every
  individual dictionary entry or prior NV item; those are unchanged
  since the last close and covered by the tests above.
- **Nothing local-only:** `git status` → clean working tree, `git log`
  → `up to date with 'origin/main'` after `git fetch`. Verified by
  running `git fetch origin` immediately before this check (not relying
  on a stale local view) — this also caught that Claude A had pushed 2
  new commits (`b1352ad`, `b327476` — NV-096, RULE-046) since my last
  close; pulled via fast-forward before doing anything else this
  session, per the mandatory resync-before-work discipline.
- **Governance-model check (Rule 13):** this session's discovered bug
  (`assembleGrammar`'s object-loop wrong-substitution — see below) is a
  genuine new architectural-defect mechanism, not an instance of
  AI-001. Logged as **AI-002** in
  `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §4 this close, so it's
  tracked for a future session rather than living only inside a dated
  migration doc where it could be missed.

## What this session did

Built the AI/web fallback research prototype requested in the Project
Owner's brief — full report `docs/CLAUDE_B_AI_FALLBACK_DESIGN_20260824.md`,
commit `551b18b`. Engineering-only: audited the existing cascade first,
found two independent silent-loss mechanisms (`assembleSentenceSOV`'s
clean drop, `assembleGrammar`'s wrong-substitution — now tracked as
AI-002), built `src/research/{detectUnresolved,researchFallback,demo}.js`
as a standalone, not-wired-in layer with real evidence gathered via live
web search. No `master_dictionary.json`/`corrections.json`/
`compiled_dict.json` changes; no `translationEngine.js` changes; gate
byte-identical before/after.

## Resume protocol for the next Claude B session

**This document does not replace Rule 13.** Whether you're resuming
this specific work or starting something new, `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`
is mandatory reading before any engineering work this session, every
session, per `.ai/SESSION_BOOTSTRAP.md`'s standing instruction — not
just on first bootstrap. Read it before touching code, not after.

1. **Resync first, before reading anything else in this doc as ground
   truth.** `git fetch origin`, compare against `.ai/WORKSTATE.yaml`'s
   `repository.head` pointer, run `git log --oneline <head>..HEAD` to
   see everything since that checkpoint, `git pull --ff-only`. Claude A
   sessions run independently and may have pushed since this doc was
   written — treat this doc as a snapshot, not as current truth, and
   re-verify rather than assume nothing changed (same discipline this
   session itself applied when it found Claude A's NV-096 push).
2. **Read `.ai/SESSION_BOOTSTRAP.md` in full, then
   `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` in full.** The governance
   doc's §4 table (Open architectural investigations) now has two rows
   — AI-001 (pickPrimary tie/no-candidate ambiguity) and **AI-002 (new
   this session)**. Check whether your task touches either mechanism
   before treating a symptom as a one-off.
3. **If continuing the AI/web fallback work:** it is a Phase 1
   prototype, deliberately not wired into `translationEngine.js`. Next
   steps, in the order the design doc's §3/§4 leave them:
   - Implement a real `provider` (`{search, synthesize}`) — swap in an
     actual web-search API and AI model behind `researchMissingWord()`'s
     existing interface in `src/research/researchFallback.js`. The
     interface and cache are done; only the provider is a stub.
   - Decide (with Project Owner input, since this changes runtime
     behavior) whether/how to wire `detectUnresolvedWords()` into
     `translate()` as an opt-in flag, per design doc §3 — this was
     deliberately left undone this session.
   - Do NOT let a research result of any status reach
     `master_dictionary.json`/`corrections.json`/`compiled_dict.json`
     directly. Per the brief, promotion path is: PROVISIONAL → human/
     native validation → Claude A linguistic approval → only then
     canonical. No code in `src/research/` should ever grow a write
     path to those three files; if a future session is tempted to add
     one "just for convenience," that is the signal to stop and get
     explicit Project Owner sign-off first, not a routine engineering
     call.
   - `STATUS.CONFIRMED` does not exist in `researchFallback.js`, on
     purpose. Do not add it. If a future need for it comes up, that's
     itself the Project-Owner-level decision the AI-fallback brief was
     careful to keep out of this layer's hands.
4. **If not continuing that work:** AI-002 is still worth picking up
   independently — it's a real, already-scoped, engineering-only bug
   (see the fix description in the governance doc's table), unrelated
   to the linguistic queue Claude A owns. Confirm no regression by
   rerunning `npm test` + `repository-intelligence.js` after, same as
   every other engineering fix in this repo's history.
5. **Before closing your own session:** update `.ai/WORKSTATE.yaml`'s
   `claude_b.next_action` (new entry on top, prior moved to a dated
   key, same convention this and every prior close has used) and
   `.ai/SESSION_BOOTSTRAP.md`'s "Current joint work package" section.
   Confirm `git status` is clean and `git log` shows you're not behind
   origin — both checks done fresh, not assumed, exactly as done at
   the top of this document.
