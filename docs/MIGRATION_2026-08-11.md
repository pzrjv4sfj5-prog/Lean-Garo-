**MIGRATION DOCUMENT — Claude B — 2026-08-11 (checkpoint 4)**

**Project:** Lean-Garo (`pzrjv4sfj5-prog/Lean-Garo-`) — English↔Garo translator, evidence-first/native-validated linguistics.

**State:** `HEAD == origin/main == e847620`, clean tree, pushed and verified this session. Nothing uncommitted, nothing local-only.

**NEW STANDING RULE — resume protocol (add to all future migration docs):**
On resume, before starting work: analyze the size of the queued work against
available context. If it looks too large to finish in one sitting, break it
into smaller self-contained batches up front rather than starting broad and
running out mid-edit. When context usage reaches roughly 90%, stop at the
next clean point (not mid-edit/mid-commit) and produce a migration doc
immediately, even if the current batch isn't fully done — partial-but-clean
beats a lost incomplete edit. This supersedes waiting for a fully "natural"
stopping point when the two conflict.

**Done this session (2026-08-11):**
1. Fixed bird-propagation gap (`c4ba231`) — `corrections.json` and
   `final_entries.json` still had stale/malformed pre-`do·o` bird values
   after Claude A's `3ec06ee` root-closure. Rebuilt, 203/203 tests clean.
2. Added `docs/MILESTONE_2026-08-11.md` (`77d63fe`).
3. Reconciled my own `docs/COUNTING_PHRASE_AUDIT_20260810.md` against
   current state and **closed the fish gap** (`e847620`): `mang` classifier,
   1–20, singular+plural english keys, 40 new VERIFIED/HIGH entries,
   allowlisted 40 keys in `known_dictionary_conflicts.json`, fixed a stale
   `rc037` test assertion. Root `na·tok` was cleanly confirmed and the
   `mang·<suffix>` formula was already native-confirmed via A's dog fix, so
   this was mechanical regeneration — same category as A's work, not a new
   guess.
4. **Scoped (not fixed) the rest of my audit's 253 candidates** — see gap
   table below. None of the remaining categories are mechanically safe the
   way fish was; each is blocked on a root-word issue that needs native
   input, not formula application.

**Gap map — remaining candidates from `docs/COUNTING_PHRASE_AUDIT_20260810.md`, by blocker type:**

| Category | Candidates | Blocker |
|---|---|---|
| person (`sak`) | 111 | root `man·de` tagged UNVERIFIED/HIGH |
| student (`sak`, within the 111) | — | root `Porai·gipa` has no verification tag |
| teacher (`sak`, within the 111) | — | 3 competing VERIFIED/HIGH variants (`di·di`, `ma·star`, `ti·char`), no signal which takes the classifier |
| book (`king`) | 26 | root confirmed; A only fixed teens, 1–10 non-teen forms unchecked |
| tree (`pang`) | 22 | 2 competing entries, not variants of one word — `Bol` (superseded) vs `a'bil` (VERIFIED/HIGH) |
| apple (`rong`) | 15 | 2 competing VERIFIED/HIGH entries — `Apple` (loanword) vs `te·spu` (native) |
| coin (`gong`) | 2 | root `Tangka·bisil` has no verification tag |

None of these are "guess and fix" candidates — each needs either a missing
verification tag resolved or a pick between named competing words, both of
which are native-confirmation calls (the exact category NV-071 and the
reverted 413-entry auto-fix already burned this project on). Fish was the
only clean one because it had a single confirmed root and a
already-native-confirmed formula to apply.

**Held, not done — unchanged from checkpoint 3:**
- Reverse translation — still on hold per user instruction.
- `.ai/WORKSTATE.yaml` trim (2,569 lines) — still needs explicit go-ahead
  before any agent touches it. Not started.
- `docs/BUG_*.md`/`FIX_*.md` triage — still needs human/per-doc review.
- Phase 1 (`confidence`/`confidence_source` schema) — not started; arguably
  the actual fix for *why* person/teacher/tree/apple keep surfacing
  competing-value ambiguity instead of a single resolvable root.

**Standing rules (carried forward, unchanged):**
- Native-confirmation-only discipline for classifier/counting-phrase fixes.
  Mechanical regeneration is allowed ONLY when both the root and the formula
  are independently already-confirmed (fish qualified; person/student/
  teacher/tree/apple/coin do not).
- Any new override mechanism must be checked against the existing precedence
  cascade with an automated gate, not manual review.
- Migration-doc-and-resume protocol is the standard way this project
  survives context limits — see new rule above.
- PATs supplied live, used inline in push URL only, never persisted —
  verify clean after every push.
- Don't touch large shared coordination files (WORKSTATE.yaml-scale)
  without explicit go-ahead.
- Per user instruction 2026-08-11: don't audit Claude C's or D's work areas;
  stay in the translator/dictionary-data lane.

**Exact next step (pick one):**
1. Get native input (Thangseng relay) on the person/student/teacher root
   questions — this unblocks 111 candidates, by far the largest remaining
   chunk.
2. Get a decision (native or Project Owner) on `Bol` vs `a'bil` (tree) and
   `Apple` vs `te·spu` (apple) — two clean yes/no picks that unblock 37
   candidates with no further research needed once answered.
3. Book 1–10 non-teen forms (`king` classifier) — root is already
   confirmed, may be closer to mechanically-safe than it looks; worth a
   closer check before assuming it needs native input too.
4. Start Phase 1 schema — doesn't unblock these specific candidates but
   addresses the structural reason this keeps happening.

Start a new conversation and paste this in when ready.
