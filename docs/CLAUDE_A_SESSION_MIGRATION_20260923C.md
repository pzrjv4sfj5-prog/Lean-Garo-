# Claude A Session Migration — 2026-09-23C

Continuation of the same 2026-09-23 session. Prior docs:
`docs/CLAUDE_A_SESSION_MIGRATION_20260923.md` (page-96 `Jak..`
worked-example split), `docs/CLAUDE_A_SESSION_MIGRATION_20260923B.md`
(cook engine bug, pages 92/94 vocabulary, colt/Janera typo
corrections). This doc covers the final stretch: the mirror/Janera
bracketed-alternate work, through to this session's actual close.

---

## Resync notes

Two rounds of drift arrived mid-session, both handled cleanly:
- `78aa597`/`e56078b` — Claude B: fixed a `VERB_LEMMAS` "to-X"
  pollution bug dropping the verb in "going to school"/"going home",
  plus an unknown-tolerant grammar-assembly fallback for
  out-of-vocabulary destinations. Engine-layer, Claude B's own
  territory — fast-forward merged cleanly, no conflict, no action
  needed from Claude A.
- `3cb39f1` — Claude B: own session-close docs (WORKSTATE.yaml +
  migration doc). Docs-only, no data/code drift.

---

## "mirror" — Janera as a bracketed alternate to ai·na

**Request (Project Owner, direct chat):** keep `ai·na` as the
primary translation for "mirror", but show `Janera` bracketed
alongside it as an alternate.

**Implementation:** `Janera` (`master_dictionary.json` idx 292) was
sitting at `confidence: superseded`, which structurally excludes a
candidate from `compiled_dict_alternates.json` by design (see the
`prepare-data.js` SUPERSEDED-eligibility audit, 2026-08-30, Claude
B). Flipping the `confidence` field alone to `unverified` wasn't
sufficient — `prepare-data.js` separately treats any note
**beginning with the literal word "superseded"** as an authoritative
signal regardless of the confidence field (a deliberate
anti-metadata-drift guard, `docs/CLAUDE_B_SESSION_MIGRATION_
20260829B.md`), so the stale note text kept silently re-excluding the
candidate on rebuild even after the tag was changed. Fixed by
rewriting the note itself (not just re-tagging it) — full supersede
history preserved, opening reworded so it starts with `PROMOTED`
instead of `SUPERSEDED`.

`ai·na` remains the shipped VERIFIED/HIGH primary — unchanged.
Live-verified: `translate('mirror')` → `ai·na`; `getAlternates
('mirror')` → `{primary: 'ai·na', alternates: ['Janera', 'ai·na']}`.

No engine/runtime code touched — this was entirely a
`master_dictionary.json` confidence/notes edit, compiled through the
existing `prepare-data.js` alternates mechanism as designed.

---

## Gate at close

- Dictionary: 8899/8899 (unchanged this stretch — a confidence/note
  edit on an existing entry, not a new key)
- Grammatical corrections: 9/9
- Unit tests: 458/458
- Repository-intelligence: 0 new violations

---

## Runtime Handoff to Claude B

None. No engine code touched this stretch.

---

## Repository status at close

- HEAD: `7697173`
- `origin/main`: verified match via `git fetch` + `git rev-parse`
  (clean fast-forward at every push, two rounds of Claude B drift
  handled — one fast-forward merge of engine work, no conflicts)
- `git status`: clean, no uncommitted changes
- Native-validation status: no blockers surfaced

## Next Recommended Tasks (carried forward, unchanged)

1. Unsent Thangseng relay drafts, still pending Project Owner/Tridip
   relay: `docs/THANGSENG_RELAY_QUESTION_20260920.md`,
   `docs/THANGSENG_RELAY_QUESTION_20260920B.md`,
   `docs/THANGSENG_RELAY_QUESTION_20260920C.md`.
2. POS collision-set backfill (flagged 2026-09-21B, not started).
3. ~15 remaining `pickPrimary` verified-ties with no session-history
   evidence — see `docs/PICKPRIMARY_VERIFIED_TIES.md`. None urgent.
4. `us`-accusative clusivity distinction remains unconfirmed pending
   the relay drafts above.
5. (New, low priority) `Janera` (idx 292) was promoted to unverified
   purely so it could surface as an alternate for "mirror" — worth
   revisiting whether it's actually the older/traditional Garo term
   for mirror if/when native validation touches this area, per the
   Project Owner's clarification that `ai·na` is a modern loanword.
