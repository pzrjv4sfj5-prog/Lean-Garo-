# Claude A Session Migration — 2026-08-30 (session 5)

**Status: CLEAN CLOSE.** Three threads this session, all closed or
explicitly scoped-and-flagged. Nothing left mid-edit.

## Repository status at close

- HEAD: (see `git log -1` — this commit)
- `origin/main` match: confirmed via `git fetch` + `git rev-parse HEAD
  origin/main` before and after push, values equal
- `git status`: clean, no uncommitted changes, no untracked files
- `.ai/WORKSTATE.yaml`: updated this session
- `.ai/SESSION_BOOTSTRAP.md`: current-rules doc, not touched this
  session (no new standing rule introduced)
- This migration doc: complete
- No local-only commits — every commit this session was fetched/rebased
  against origin before push, then pushed and re-verified
- Native-validation status: NV-100 CLOSED (see below); nothing else
  blocked on native input from this session's work

## Thread 1 — Backlog item 4: duplicate-key census (regenerated)

The 2026-06-20 audit (1,055 groups) was stale — regenerated against
current data. Full detail: `docs/DUPLICATE_AND_RAKA_AUDIT_20260829.md`.

- 1,619 duplicate-key groups now (dictionary grew since June)
- 0 exact zero-info duplicates (sessions 3/4 already cleared this shape)
- 848 legitimate VERIFIED-primary + SUPERSEDED/variant-sibling groups —
  no action, citation discipline working as designed
- 9 groups had 2+ competing VERIFIED primaries: 8 already resolved
  (POS splits, distinct senses, confirmed dual-valid pairs, free
  variants); 1 genuinely new open question ("to support": al·du·na vs.
  Chaka — synonym or distinct sense?) added to the relay queue
- 715 "other" groups (no verified anchor): 602 plain unvalidated pairs
  (genuine backlog, not guessable), 44 stale SUPERSEDED-citation notes
  (flagged, zero runtime impact, not fixed), 29 unclassified

## Thread 2 — SUPERSEDED-row retention-policy classification

Project Owner asked for the 1,016 SUPERSEDED rows inside those 848
groups to be classified into 6 categories before any deletion policy
decision — not deleted, classified only. Full detail in the same
duplicate-key audit doc, "Retention-policy classification" section.

- Cat 1 (genuine obsolete duplicate): ~55
- Cat 2 (rejected candidate, real provenance — NV-080 "not selected"
  pattern): ~277
- Cat 3 (distinct POS/sense, must retain): ~5 confirmed
- Cat 4 (orthography variant only): ~119
- Cat 5 (historical correction, audit trail): ~470
- Cat 6 (incorrectly marked SUPERSEDED): 0 found (inverse pattern
  exists instead — a few rows were incorrectly VERIFIED via misimport,
  correctly demoted later)
- Confirmed none of the 1,016 rows affect runtime either way (every
  group already has one non-variant VERIFIED primary; SUPERSEDED is
  already excluded from compilation)
- No deletion policy applied — still awaiting Owner decision. This
  session did NOT decide "delete categories 1+4"; it only produced the
  classification the Owner can decide from.

## Thread 3 — NV-100: "go"/"went"/"will not go" family — CLOSED

**Full detail:** `docs/THANGSENG_NATIVE_VALIDATION.md` NV-100 (two
entries: initial resolution, same-day follow-up closure) and
`docs/grammar_rules_structured/RULE-030.yaml` corrections (two entries,
same dates).

**Trigger:** 2026-08-28 FLAGGED TENSION — two native-sourced forms per
key ("go"=re·a, "will not go"=re·angjawa), not reconciled.

**Evidence, direct unprompted Thangseng relay via Project Owner/Tridip:**
> "Re.a = to walk; re.anga = went. Re.jawa = will not go. Re.angjawa =
> will not be going." — with explicit recommendation to gloss
> re·angjawa as "will not be going" for clarity.

**Applied to `master_dictionary.json`:**

1. "will not go"=re·angjawa row relabeled to english="will not be
   going" (same garo value, key corrected per direct native guidance)
2. New verified_high rows added: "will not go"=re·jawa (backs the
   pre-existing `corrections.json` orphan value, which had no
   dictionary citation until now), "to walk"=Re·a, "went"=Re·anga
3. "go"=re·a row (2026-08-28): tension marked CLOSED — Thangseng's
   precise gloss for re·a is "to walk", now captured in its own row;
   the "go"=re·a row itself stays VERIFIED/HIGH, uncontradicted (it
   was Thangseng's own direct answer to the literal key "go";
   "go"/"to walk" gloss overlap for a general motion verb is ordinary)
4. "walk"=Re·a (idx 111, SUPERSEDED since a 2026-08-01 corpus-internal
   audit) re-promoted to VERIFIED/HIGH on this direct native evidence
   — tagged as a co-existing **variant** of the already-VERIFIED
   "re·am·a", not the new primary. Deliberate: the evidence confirms
   re·a is a genuine word for "walk" but says nothing about its exact
   relationship to re·am·a (free variants? root vs. durative?) — that
   stays unconfirmed, so runtime output for "walk" is left undisturbed.
   Promoting re·a to primary instead would need an explicit separate
   decision.

**`RULE-030.yaml`:** two corrections entries added (2026-08-30,
2026-08-30b) documenting the full paradigm and both rounds of closure.

**Runtime verification — master → compiled → runtime, all confirmed
this session:**

- Ran `node prepare-data.js` (full rebuild). Compiled 8192 unique
  entries. The 17 pre-existing pickPrimary verified-ties reported by
  the build (hope, leg, last, early, outside, answer, fever, hoe, lie,
  empty, where, horn, agree, brave, greedy, demand, where (relative
  pronoun)) are unchanged from before this session's work and do not
  include any NV-100 key — confirms the "walk" variant-tagging choice
  worked as intended (no new tie introduced).
- Confirmed in `src/compiled_dict.json`: `"will not go"→"re·jawa"`,
  `"will not be going"→"re·angjawa"`, `"to walk"→"Re·a"`,
  `"went"→"Re·anga"`, `"go"→"re·a"`, `"walk"→"re·am·a"` (unchanged, as
  designed).
- Ran `node test-dictionary.js`: 8192/8192 valid entries, 9/9
  grammatical corrections verified, JSON compliance OK.
- Ran `node repository-intelligence.js`: 0 new violations across all
  checks (cross-table, dictionary self-consistency, pending-lexicon
  integrity, placeholder values, runtime-cascade agreement,
  confidence-schema validity).
- Ran `node --test tests/unit/*.test.js`: 254/254 passing.
- Live `translate()` spot-check via
  `node -e "import('./src/translationEngine.js')..."` for all 6 keys —
  every value matches the compiled dictionary exactly:
  - "will not go" → re·jawa (method: correction)
  - "will not be going" → re·angjawa (method: exact-phrase)
  - "to walk" → Re·a (method: exact-phrase)
  - "went" → Re·anga (method: exact-phrase)
  - "walk" → re·am·a (method: phrase-map, unchanged as designed)
  - "go" → Re·anga (method: phrase-map — pre-existing engine root,
    untouched by this relay, as established 2026-08-28)

**NV-100 is fully CLOSED.** No sub-questions from this relay remain
open.

## Genuinely remaining open questions (not from NV-100 — do not
re-litigate; these are separate, pre-existing, or newly surfaced this
session and correctly left unresolved)

1. **"to support"** (al·du·na vs. Chaka — synonym or distinct sense?)
   — new this session, queued for the next Thangseng relay
   (`claude_a.pending_thangseng_questions_20260829_addendum` in
   WORKSTATE.yaml)
2. **44 stale SUPERSEDED-citation notes** — low-priority hygiene, zero
   runtime impact, not fixed this session
3. **715-group "other" duplicate-key bucket** — mostly genuine
   unvalidated-vocabulary backlog, multi-session native-relay project,
   not attempted
4. **SUPERSEDED retention-policy decision** (delete categories 1+4 or
   not) — classification delivered, decision still pending from the
   Owner
5. **"walk" primary question** — should re·a ever be promoted to
   primary over re·am·a? Left as an explicit future decision, not
   guessed at this session
6. Pre-existing, unrelated to this session: 3 relay questions queued
   2026-08-28 (go, will-not-go, movie — **note:** the "go"/"will not
   go" tension those questions were about is now resolved by NV-100;
   re-check whether those specific queued questions are still needed
   before sending, since the evidence that would have answered them
   already arrived unprompted)

## Resume protocol for next Claude A session

1. **Mandatory resume sequence (Rule 10):** `git fetch origin`, verify
   `HEAD == origin/main`, `git status` clean, read
   `.ai/WORKSTATE.yaml` and `.ai/SESSION_BOOTSTRAP.md` before any work.
2. Check `claude_a.pending_thangseng_questions` AND
   `claude_a.pending_thangseng_questions_20260829_addendum` in
   WORKSTATE.yaml together — the addendum has a 4th question ("to
   support") additive to the original three, and the original three's
   "go"/"will not go" motivation is now stale per NV-100 (item 6
   above) — reconcile before sending anything to Thangseng.
3. If picking up the SUPERSEDED-retention-policy thread: the
   classification is done
   (`docs/DUPLICATE_AND_RAKA_AUDIT_20260829.md`); what's needed next is
   an explicit Owner decision, not more analysis.
4. If picking up the 715-group "other" duplicate-key backlog: this is
   a genuine multi-session project. Start with the 602 plain-unverified
   pairs — no shortcuts, each needs either corpus-internal resolution
   evidence or a native relay answer.
5. No open runtime/engine work handed to Claude B this session — the
   one item flagged last session (`compiled_dict.json` staleness) is
   now resolved (rebuilt and verified in this session).
