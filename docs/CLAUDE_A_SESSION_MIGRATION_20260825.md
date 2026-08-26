# Claude A Session Migration Document — 2026-08-25

## Session summary

Resumed via a user-pasted migration pointer (`docs/CLAUDE_A_SESSION_MIGRATION_20260823E.md`)
naming HEAD `b327476`. Full resync performed before any work: cloned
the repo fresh, `git fetch origin`, confirmed `b327476` is an ancestor
of the actual current HEAD, reviewed `git log b327476..HEAD` (one
commit: `50b06b6`, Claude B's governance-doc-only migration close,
zero linguistic/engineering content) — no drift affecting Claude A's
queue. Read `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` in full before
starting, per standing requirement.

**One task this session, per one-task-per-session discipline:** ruled
on the `-rang` plural-marking scope question handed off in
`docs/CLAUDE_B_RANG_PLURAL_AUDIT_20260824.md` (item 3 of the
2026-08-23E close's deferred queue).

## The `-rang` ruling — CLOSED this session

**Ruling: status quo, formalized. `-rang` is used only where
explicitly native-confirmed. No universal or class-restricted
productivity rule was invented.**

### Evidence (from Claude B's audit, re-verified, not re-derived)

- Exactly 3 native-confirmed `-rang` plural forms exist in
  `master_dictionary.json`, each its own independent native-relay
  entry, not derived from any rule:
  - children → `Bi·sarang` (animate)
  - fruits → `biterang` (inanimate, count noun)
  - coins → `tangka bisilrang` (inanimate, count noun)
- Zero code anywhere generates or strips a `-rang` suffix — confirmed
  by Claude B's grep of all `src/*.js`; the only `-rang` content is
  inert dictionary-string data.
- The 3 confirmed cases span 1 animate + 2 inanimate nouns — this
  rules out a strict animate-only hypothesis, but 3 data points across
  two categories cannot establish universal productivity either.
- Every other checked noun (dog, tree, apple, book, student, person)
  has zero attested plural form of any kind — an absence of data, not
  evidence those nouns take no marker.

### Why this ruling and not a broader one

A "universal" or "class-restricted" ruling would require generating
guessed `-rang` forms for every other noun with no individual native
confirmation, or inventing an unconfirmed noun-class signal (e.g.
reusing `CLASSIFIER_MAP` family as an animacy proxy) to gate them —
both are the engineering-invents-linguistic-content move the
evidence-first methodology and the A/B role split exist to prevent.
Declining to generalize is the correct call under evidence-first
discipline, not an unaddressed gap.

### Disposition / engineering consequence

**Zero engineering change** — per Claude B's own audit §7, this is
the no-new-architecture option. The three existing `-rang` forms keep
shipping via their own dictionary rows, unaffected. Every other bare
plural noun continues to fall through to the unmarked singular at
runtime, unaffected — confirmed already-correct behavior, not a bug.

### Documentation actions taken

- `docs/CLAUDE_A_RANG_PLURAL_RULING_20260825.md` — full ruling
  document (new).
- `.ai/SESSION_BOOTSTRAP.md` — "Current joint work package" entry
  added, and header "Last updated" pointer updated, so a future
  session reads this as deliberate, documented policy rather than
  reopening it as a suspected bug.
- `.ai/WORKSTATE.yaml` — `claude_a.current_task`, `.next_action`, and
  `.migration_doc` updated to reflect this close (see below).
- **Flagged as an open relay question for a future Thangseng batch
  (not yet sent):** does `-rang` generalize to other count nouns
  (e.g. "dogs", "trees", "books")? More data points are needed before
  any productivity ruling could be made, in either direction. This is
  a new open item, not part of the queue below (no session has been
  scheduled to draft/send it yet).

## NEXT SESSION WORK QUEUE (intentionally deferred, not started this session)

1. **138-item Thangseng relay batch** (pre-existing, unrelated to
   this session's work) — 89 Part A single words + ~39 Part B phrases
   + 4 flagged priority (give me water, stand/stand up, take revenge,
   self), per the 2026-08-20c close.
2. **pickPrimary verified-ties backlog** (hope, leg, last, early,
   answer, fever, hoe, empty, where, horn, agree, brave, greedy,
   demand, where (relative)) — unchanged, out of Claude A's scope
   (Claude B territory, AI-001 in `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`).
3. **Repository-wide space-before-`ma` sweep** — the wider
   "verb + space + ma?" corpus outside the 2026-08-21 batch RULE-046
   already closed (are you eating?, is there rice?, have you eaten
   breakfast?, have you eaten rice?, do you love me?, are you scared?,
   do you have children?) — same RULE-046 violation, different/older
   batch, listed in RULE-046's own counterexamples field.

None of these three were touched this session. All three remain
exactly as they were at the 2026-08-23E close, ready for the next
Claude A session to pick one.

## Runtime Handoff

**None.** No dictionary, `corrections.json`, `phrase_maps.js`, or
engine code was touched this session — documentation/governance only.
The three existing `-rang` dictionary rows (children/fruits/coins)
are unchanged and were already shipping correctly before this
session; nothing new to propagate.

## Verification scope

- **What was run:** `npm run build` (full gate: `prepare-data.js` →
  `test-dictionary.js` → `repository-intelligence.js` → unit test
  suite → `vite build`).
- **Result:** 229/229 unit tests passing, 0 lint errors implied by a
  clean build, `repository-intelligence.js` 0 new violations (no
  content changed, so no new violations were possible or expected),
  `vite build` clean.
- **What was NOT independently re-verified this session, and why
  that's fine:** no `compiled_dict.json`/`translate()` spot-checks
  were run, because zero dictionary/engine files were touched —
  nothing exists that could have changed the compiled output. This is
  a scope statement, not an omission: the ruling's entire content is
  a documentation/policy decision, not a data or code change.

## Repository status at close

- HEAD immediately before this migration-doc commit:
  `47437e09b44ef5ef810424820e742ede7dbe82cd` (the `-rang` ruling
  commit itself, pushed and verified earlier in this session).
- This migration-doc commit adds only this file plus the
  `.ai/WORKSTATE.yaml` update below — no linguistic or engineering
  data touched.
- `origin/main` match: verified via `git fetch` immediately before
  this commit and again immediately after push (see final resume-note
  in `.ai/WORKSTATE.yaml`).
- `git status`: clean before and after this commit.
- `.ai/WORKSTATE.yaml`: updated in the same commit as this doc (see
  below), not as a follow-up.
- `.ai/SESSION_BOOTSTRAP.md`: already updated in the `-rang` ruling
  commit (`47437e0`) earlier this session — not re-touched here.
- Migration doc: this file, complete.
- No local commits left unpushed; no uncommitted changes.
- Native-validation/blocker status: no open Claude-A-blocking item
  from this session. The 3-item next-session queue above is
  deferred by design, not blocked.

## Resume protocol for the next Claude A session

1. Read `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` in full before any
   linguistic work — mandatory every session, not just first
   bootstrap.
2. Rule 10's mandatory resume sequence: `git fetch origin`; compare
   local HEAD to `origin/main`; `git log <workstate-head>..HEAD
   --oneline` to review everything since this checkpoint; read the
   diff (not just commit subjects) for anything touching
   `master_dictionary.json`/`corrections.json`/`phrase_maps.js`.
3. Read `.ai/WORKSTATE.yaml`'s `claude_a.next_action` field (points
   here) and this document in full.
4. Pick exactly ONE item from the NEXT SESSION WORK QUEUE above — one
   task per session, per standing discipline. Do not start a second
   item in the same session even if the first closes quickly.
5. If picking up the 138-item relay batch (item 1): this requires an
   actual Thangseng/Tridip relay round, not corpus-internal
   resolution — check whether new relay answers have arrived before
   assuming it's still fully open.
6. If picking up the pickPrimary verified-ties backlog (item 2):
   confirm with Claude B's current queue first — this is nominally
   Claude B's territory (engineering-side tie-break), and Claude A's
   role there is limited to supplying POS/sense defaults per
   `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` §10 when asked, not
   independently resolving it.
7. If picking up the space-before-`ma` sweep (item 3): this is the
   same RULE-046 (see `docs/grammar_rules_structured/RULE-046.yaml`)
   applying to an older, wider corpus — no new grammar rule needed,
   just propagation + duplicate-representation checks per Rule 8,
   same pattern as NV-096's closure.
8. Also worth sending, whenever a relay round is next assembled: the
   `-rang` generalization question flagged above (does `-rang` extend
   to other count nouns) — not urgent, not part of the numbered
   queue, but worth folding into the same batch as item 1 if
   convenient.
