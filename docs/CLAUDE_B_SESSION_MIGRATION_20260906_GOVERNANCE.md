# Claude B Session Migration — 2026-09-06 (Governance-only)

## Project identity
Lean-Garo-: Garo-language translation/dictionary engine. Multiple agents
(Claude A, B, C) work concurrently against the same `origin/main`;
standing rule: `git pull` before every push, renumber the not-yet-pushed
side on NV-number collisions, never overwrite what's already on
`origin/main`.

## Task this session
Project Owner directive, delivered in chat: formalize that Project Owner
directives given directly in chat are authoritative project decisions
that don't require a separate file/transcript/screenshot before an agent
acts on them. Explicitly scoped by the Owner as governance/documentation
only — no dictionary, grammar, engine, or test data touched.

## What's done
1. **Resynced first.** Session started mid-way through the prior fix
   session (`39dd96f`, committed but not yet pushed) with `origin/main`
   having advanced to `e617592` (Claude C's audit-only push) then
   `6cf27f9` (Claude C's addenda + Claude A/B handoff docs) in the
   meantime. Merged cleanly (`git merge origin/main`, auto-merge on
   `.ai/WORKSTATE.yaml` only, no conflicts). Re-ran the full gate against
   the merged state before touching anything for this task:
   `prepare-data.js` (8280 entries), `test-dictionary.js` (8280/8280,
   9/9), `repository-intelligence.js` (0 new violations across all 8
   checks), `resync-stale-overrides.mjs` (0 candidates),
   `runtime-error-sweep.mjs` (0 errors, 14771 calls), unit tests
   (317/317). All clean, tree clean, no drift.
2. **Read `docs/HANDOFF_CLAUDE_B_20260906.md`** (Claude C's engineering
   handoff, landed in the merge) for situational awareness — not
   actioned this session, out of scope for a governance-only task. Item
   7 in that doc independently confirms the prior session's own fix
   approach (delete/replace the animal-placeholder rows, let sov-assembly
   handle it) was the right call.
3. **Created `.ai/PROJECT_OWNER_AUTHORITY.md`** — new, project-wide
   (not role-specific) governance document. Core content:
   - Project Owner directives given directly in chat (corrections,
     linguistic decisions, canonical forms, repository instructions,
     validation results, priorities, implementation direction) are
     authoritative and require no separate file/transcript/screenshot.
   - Thangseng is not, and was never formally declared, the sole
     acceptable validation source — **searched
     `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md`,
     `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`, and
     `.ai/SESSION_BOOTSTRAP.md` for any statement asserting
     Thangseng-exclusivity or requiring a file before chat-provided Owner
     information counts; found none.** This document is a genuinely new
     explicit statement, not a reversal of a documented prior rule — the
     project had already been operating this way informally (e.g. the
     `SESSION_BOOTSTRAP.md` 2026-08-28/session-2 entry: "Project Owner
     relayed new Thangseng answers directly in chat"; the 2026-08-23
     NV-092/093 entry: "Project Owner chat-relay batches processed" —
     neither has an attached transcript file, both were acted on).
   - Role boundaries preserved exactly as the Owner's directive itself
     specified: agents may flag conflicts, technical consequences, and
     recommend provenance; may not refuse, demand proof, or invent
     additional approval requirements.
   - New provenance-labeling convention (category 3, layered onto the
     existing `confidence` field via `notes`, same mechanism every other
     provenance class already uses): `"Project Owner directive"` (the
     Owner's own decision) vs. `"Project Owner-confirmed"` (Owner
     relaying/endorsing a third-party source) — and an explicit rule that
     neither may ever be mislabeled as a direct or reported native quote
     (categories 1/2). This directly extends the honesty requirement
     already in `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` §3 ("never label a
     derived construction as if it were direct native confirmation") to
     this new case — the Owner's own request explicitly asked for honest
     provenance labeling alongside authoritative-directive status, so this
     isn't an addition beyond what was asked, it's the same request.
   - Explicit "Historical records" section: this document does not
     retroactively relabel past migration docs, `WORKSTATE.yaml` entries,
     or NV-numbered citations. It governs current/future work from
     2026-09-06 forward only.
4. **Cross-referenced from existing governance docs** (pointers only, no
   existing rule text removed or reversed):
   - `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` §3 (Native evidence
     principle) — added a lead-in paragraph pointing to the new document
     for the chat-directive rule and its provenance-labeling extension.
   - `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` — the existing
     "NOT engineering-scope ... or an explicit Project Owner decision
     first" line now points to the new document for what counts as a
     valid decision and how to label it. This line already permitted
     Project Owner decisions to resolve ambiguous ties before this
     session — the new document makes explicit what was already implicit
     there (no file/transcript requirement was ever stated, so none is
     being removed).
   - `.ai/SESSION_BOOTSTRAP.md` — added to the mandatory-reading list for
     **all** agents (A/B/C), not just Claude A (the existing mandatory-
     reading paragraph there is Claude-A-specific); updated the file's
     "Last updated" header to log this session per the file's own
     convention, without altering any prior session's log entry text.

## Verification
- Governance/documentation files only:
  `.ai/PROJECT_OWNER_AUTHORITY.md` (new),
  `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` (cross-reference added),
  `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` (cross-reference added),
  `.ai/SESSION_BOOTSTRAP.md` (header + mandatory-reading pointer),
  `.ai/WORKSTATE.yaml` (`claude_b.next_action` + `repository.head`),
  this migration doc.
- No `master_dictionary.json`, `corrections.json`, `phrase_maps.js`,
  `compiled_dict.json`, engine (`.js` outside `.ai`/`docs`), or test file
  touched.
- `.ai/WORKSTATE.yaml` re-validated with `yaml.safe_load` after every
  edit (caught and fixed a self-introduced YAML-breaking error mid-edit
  during the *prior* session — re-checked here defensively, this
  session's own edits parsed clean on the first attempt).
- Did not re-run the dictionary/engine gate for this task specifically
  (nothing that gate covers was touched) — it was already re-verified
  clean immediately after the merge, per step 1 above, and remains the
  last-known state.

## Remaining open items (unchanged by this session, carried forward)
From `docs/CLAUDE_B_SESSION_MIGRATION_20260905D.md`:
- Defect-class-2: `coin`/`chair`/`fruits`/`mountain` counted-phrase-vs-
  standalone root reconciliation — not started.
- Item #1: counting-phrase plural failure ("two cats" vs "two cat") —
  not started.
- Item #4/#5: 65-key `verified_high`-vs-`verified_high` schema gap and
  phrase-table/sentence-assembler duplicate composition architecture —
  flagged for a design pass, not started.
- `cat`: `menggo` vs `meng·gong` — still needs an explicit answer before
  any fix touches cat specifically. **Note for whoever picks this up
  next:** if the Project Owner resolves this directly in chat rather
  than via a new Thangseng relay, that is now explicitly sufficient per
  `.ai/PROJECT_OWNER_AUTHORITY.md` — but it must be recorded as a
  category-3 "Project Owner directive," not written into
  `docs/THANGSENG_NATIVE_VALIDATION.md` as if it were a new native
  citation.

From `docs/HANDOFF_CLAUDE_B_20260906.md` (Claude C, landed this session
via merge, not yet actioned): 9 engineering items, several MEDIUM/HIGH
severity (leaf/leaves collision, question-marking generalization, cat's
`stopword-stripped` "mang" bug, confidence-vs-verification-status
decoupling). Not this session's scope.

## Exact next step
1. `git pull` first regardless; confirm `HEAD == origin/main`, clean
   tree, before any edit.
2. This was a governance-only task; the next *engineering/linguistic*
   task should pick up from `docs/CLAUDE_B_SESSION_MIGRATION_20260905D.md`'s
   own "Exact next step" (Defect-class-2) or triage
   `docs/HANDOFF_CLAUDE_B_20260906.md`'s items by severity — Project
   Owner priority call, not this session's to make.
3. Per this project's "one task at a time" discipline, do not batch
   multiple items from either list into one commit.

---
**Start a new conversation and paste this document in to resume.**
