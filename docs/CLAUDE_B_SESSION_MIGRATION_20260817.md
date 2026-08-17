# Claude B Session Migration — 2026-08-17 (resync/audit, no code change)

Resumed from `docs/CLAUDE_B_SESSION_MIGRATION_20260816.md` (checkpoint
`cb1f1f5`, via user-pasted filename + repo URL/PAT). PO asked to "close
all open items" and "always sync with A."

## Why this session made no linguistic fixes

Every open item left by the 2026-08-16 session and by Claude A's own
close-out (`a656c22`, `docs/CLAUDE_A_SESSION_MIGRATION_20260816c.md`) is
a genuine native-validation question (POS splits, sense ambiguity, no
citation on either side) or an architectural limitation, not a bug with
a mechanical fix. Guessing at any of them would violate the project's
own standing rule (task doc: "Do NOT silently change linguistic
meaning" / "Do NOT invent a fix"). Claude A independently reached the
same conclusion this same day, evidence-first, fixing only what had
real citation asymmetry (`angry`, `let's eat`) and explicitly leaving
the rest open with reasons — see their migration doc for the full
account. Not duplicated here.

## What this session did

1. **Fetched twice, rebased fast-forward twice** (`cb1f1f5` ->
   `6ffc5aa`, via `a656c22`/`2f9cb92`/`6ffc5aa`) before touching
   anything — origin advanced mid-session both times with Claude A's
   own work, per "always sync with A."
2. **Re-verified the full gate from scratch**, not trusting the prior
   session's claims: `node prepare-data.js` (8127/190, clean), `node
   --test tests/unit/*.test.js` (218/218), `node test-dictionary.js`
   (8127/8127), `npm run lint` (0 errors), `node
   repository-intelligence.js` (PASSED, 0 new violations).
3. **Live runtime spot-check** (not just unit tests): `translate()` on
   `answer`, `to answer`, `student`, `twenty student`, `twenty
   students`, `work`, `build`, `outside`, `where`, `Where`, `where are
   you`, `Where are you going` — all correct, matches documented
   expectations.
4. **Investigated the one item flagged as my lane in `a656c22`**:
   `where`/`Where` case-collapse (`Bano` vs `Bachi`).
   - Confirmed via live `translate()` calls this is **not a runtime
     bug today** — `phrase_maps.js` overrides `where` -> `Bano`
     unconditionally, and `corrections.json` separately routes `where
     are you going` -> `Na·a bachi re·angenga?`. Both senses already
     ship correctly; the collision is compile-layer-only.
   - Root-caused **why a compile-layer case-handling fix can't
     actually work**: `normalizationEngine.js`'s `normalizeInput()`
     lowercases all user input before any lookup happens, so
     `where`/`Where` are byte-identical by the time
     `compiled_dict.json` is consulted. A case-sensitive key could
     never be selected differently at runtime under the current
     architecture — this is the same underlying shape as the
     `demand`/`answer` POS-split problem (one flat key, two legitimate
     senses), not a quick fix. Documented rather than invented a
     schema migration solo (that decision needs Claude A / Project
     Owner sign-off, same as the standing "confidence_source
     metadata-model schema migration" item already on record).
5. **Found and fixed one stale-metadata issue** (mechanical, not
   linguistic): `.ai/WORKSTATE.yaml`'s `claude_b.next_action` field
   still read as if the Aganchaka/Aganchakani tie-break was
   unimplemented, even though it shipped at `cb1f1f5` and
   `repository.head`/`repository.last_updated` in the same file
   correctly reflected that. The close commit had updated the
   top-level block but left this sub-field stale. Corrected in place,
   old text preserved under `next_action_stale_20260816` for history.

## Duplicate-representation check (Rule 8)

No source/compiled/override files touched this session beyond
`.ai/WORKSTATE.yaml` (metadata only). Confirmed via `git status`/`git
diff --stat` that only that one file changed.

## Verification

- `HEAD == origin/main` confirmed via `git rev-parse` both sides,
  immediately before this commit.
- `git status`: clean before and after the edit (only the intended
  `.ai/WORKSTATE.yaml` change).
- YAML re-parsed successfully after edit (`python3 -c "import
  yaml; yaml.safe_load(...)"`).
- Full gate re-run after the edit: 218/218 tests, 8127/8127
  dictionary, 0 lint errors, `repository-intelligence.js` 0 new
  violations — unchanged from pre-edit, as expected (no source/data
  file touched).

## Genuinely open items (unchanged, not guessed at)

Same set Claude A's `a656c22` close-out left open — not re-litigated
here, see that doc for full reasoning:

1. ~6 hortative -ha/-na pairs (sleep/drink/sit/play/work/hang out) —
   uncited both sides.
2. `where`/`Where` case-collapse — inert at runtime (see above);
   genuine fix needs a sense-aware schema, not a case-handling patch.
3. `demand` (Dabia/Dabiani) and ~136 remaining `PICKPRIMARY_VERIFIED_TIES.md`
   keys — native-validation backlog, nothing currently wrong.
4. `jeon`/`jeo` primacy — corpus's own notes contradict each other,
   needs a direct native question.
5. Standing, untouched by anyone recently: `build`/`outside` (still
   need Claude A's linguistic call per the 20260816 doc), house/rice/
   water/food counting (~76 keys), person/student/teacher 111-candidate
   root conflict — not investigated this session, not assumed clean.

## Exact next step for the next Claude B session

1. Resume per governance: fetch, verify HEAD, rebase if needed, read
   `SESSION_BOOTSTRAP.md` + `WORKSTATE.yaml` + this doc.
2. No queued engineering task. If the Project Owner wants further
   progress on the open items above, the next actionable step for any
   of them is a native-validation relay (Thangseng via Tridip) or a
   Project-Owner-approved schema design discussion for the POS-split
   problem (`demand`/`answer`/`where`) — not more corpus-internal
   investigation, which has been exhausted for these specific keys.
