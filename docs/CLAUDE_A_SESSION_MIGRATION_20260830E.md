# Claude A Session Migration — 2026-08-30E

## Task
Project Owner-issued joint A+B full independent repository audit (chat-pasted
spec, not a repo file). This document covers Claude A's linguistic/data scope
only.

## Resume verification
- `git fetch` clean; HEAD == origin/main == `9113a63c1b65cf4e465016293b5ab1983e356c0f`
  at session start.
- No orphaned/undocumented commits: the 4 commits since the last recorded
  WORKSTATE head (`d57aaf3`) all trace to documented sessions — Claude A
  NV-102, Rule 14 (governance), Claude B's AI-001 confidence_source
  investigation, and the resulting merge commit.
- Full gate re-run at session start (before any edits): `prepare-data.js`
  (8199/8199), `test-dictionary.js` (9/9), `repository-intelligence.js`
  (0 new violations), `resync-stale-overrides.mjs` (0 candidates, 3
  pre-existing confirmed exceptions), unit tests (264/264). Every figure
  matched the 20260830D migration doc's claims exactly — **CLOSED, verified
  accurate**, nothing re-litigated.

## Findings

### Verified correct / stale-memory corrections (no repo action needed)
- NV-100, NV-101, NV-102 all spot-checked live against `master_dictionary.json`
  and `translate()` — accurate.
- "yes" Oe/Am/Hoe three-way: already resolved by NV-095 (2026-08-23, Am
  confirmed, Oe superseded). This was carried as "top open item" in Claude's
  own cross-session memory notes — that was stale, not a repo defect.
- AI-001 `confidence_source` / the "336-row manual triage queued for Claude A"
  item: obviated by Claude B's 2026-08-30 investigation (commit `c2b0a51`) —
  `confidence_source` was never load-bearing. CLOSED, no A action needed.

### Fixed this session (within A's scope, native-evidence-backed)
1. **`master_dictionary.json`**: the unverified `"go"="Re·anga"` row (row 126,
   no notes) was a stale duplicate contradicted by NV-100 (Re·anga = "went",
   a distinct VERIFIED/HIGH sense; "go" = re·a, VERIFIED/HIGH). Marked
   `superseded` with a citation note. Zero runtime effect on its own — this
   row was never pickPrimary-eligible against the existing VERIFIED "go"=re·a
   row.
2. **`.ai/WORKSTATE.yaml` `claude_a.pending_thangseng_questions`**: stale —
   items (1) "go" and (2) "will not go" were fully answered by NV-100 three
   sessions ago and never removed from the send queue. Trimmed to the one
   genuinely-open item, "movie".

### OPEN — CLAUDE B (engineering bug, discovered via the fix above, NOT applied)
Attempting to also apply the mechanical `resync-stale-overrides.mjs --apply`
fix for `phrase_maps.js["go"]` (Re·anga → re·a, to match the now-correct
master data) broke 4 unit tests: `"he did not go"`, `"i did not go"`,
`"go"` (bare-word regression tests), and the RC-CANDIDATE-018(a) future-tense
regression guard. Root cause: **the grammar engine's negative-past and
future-tense construction for "go" derives its conjugation stem (re·ang-)
from the same single dictionary lookup used for the bare/imperative form
(re·a)**, rather than from a dedicated conjugation-root reference. The stale
`phrase_maps.js` override happened to agree with the stem the grammar engine
needed, which is the only reason this was never caught before.

**Current shipped state**: reverted to the pre-session state —
`translate("go")` still literally returns "Re·anga", which is linguistically
wrong for simple "go" (it's the confirmed past-tense form) but is what the
negative-past/future grammar assembly currently requires to produce correct
output. I did not ship the fix, to avoid trading one bug for four regressions.

**What B needs to do**: give the grammar engine's negative-past/future "go"
construction its own conjugation-root reference (re·ang-) independent of the
"go" dictionary entry's primary translated value, so the two can be corrected
independently. Once that's in place, the `phrase_maps.js["go"]` override can
safely be resynced to `re·a` via the existing mechanical script — no new
tooling needed, just don't apply it until the stem-decoupling lands.

- File/path: `src/data/phrase_maps.js` (`"go"` key), grammar assembly logic
  (untraced further — B's domain, not inspected past the symptom).
- Evidence: `node --test tests/unit/translationEngine.test.js` — see failing
  tests named `regression: "he did not go"`, `regression: "i did not go"`,
  `regression: "go"`, `RC-CANDIDATE-018(a) regression guard: pronoun-subject
  future unaffected by the coherence-check widening`.
- Owner: Claude B.
- Classification: **ENGINEERING BUG**.

## What A did NOT touch
- No engine code shipped (the phrase_maps.js change was tried, verified to
  regress tests, and reverted).
- Did not attempt the dictionary duplicate backlog bulk-processing (no new
  evidence since last characterization; out of scope for a single session).
- Did not resolve the open "movie" Thangseng question or the -ming
  generalization-to-other-pronouns question (both correctly left open,
  awaiting relay).

## Final gate state (post-revert, before commit)
- `prepare-data.js`: 8199/8199 entries.
- `test-dictionary.js`: 9/9.
- `repository-intelligence.js`: 0 new violations.
- `resync-stale-overrides.mjs`: 0 candidates, 3 pre-existing confirmed
  exceptions (unchanged from session start).
- `node --test tests/unit/*.test.js`: 264/264.

## Repository status at close
- [ ] HEAD == origin/main — to verify after push below.
- [ ] `git status` clean — to verify after commit below.
- [x] WORKSTATE.yaml updated (this session's `claude_a.next_action` + pending
      Thangseng questions fix).
- [ ] SESSION_BOOTSTRAP.md — no rule changes this session, not touched.
- [x] Migration doc complete (this file).
- [ ] No local-only commits — to verify after push.
- Native-validation/blocker status: 1 item open ("movie"), unchanged from
  before this session; new Claude B handoff item added (go/re·ang- stem
  decoupling).
