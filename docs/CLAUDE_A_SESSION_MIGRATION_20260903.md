# Claude A Session Migration — 2026-09-03

**Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260902.md`.** Resync on
arrival: HEAD == origin/main == `a9f6f66`, clean tree, matched that
migration doc exactly.

## Work this session

Project Owner relayed new direct Thangseng evidence:

> I can eat. = Anga cha·na ama/man·a.
> I can go. = Anga re·angna ama/man·a.
> I can work. = Anga kam ka·na ama/man·a.

This closes the `ama`/`man·a` identity question with an actual native
citation, not just the 2026-09-02 Project Owner administrative closure that
explicitly wasn't one. Both words are confirmed freely interchangeable
across the eat/go/work paradigm (not a person/register split — the
hypothesis explicitly declined at NV-103).

**Collision found before push, resolved — twice:** while this work was in
progress, a concurrent Claude B session pushed 6 commits closing the
*other two* of the original 3 "still pending" items from the prior
migration doc, independently numbering its own closures NV-112 through
NV-115 (Finding 2 sign-off, relay item 5, only-X divergence, loanwords).
This session's first draft also used NV-112 (same next-free-number logic,
no coordination). Caught before push via the routine pre-push `git fetch`
+ compare; rebased cleanly onto `dbd67a4` (no file conflicts — disjoint
regions) and renumbered the entry to NV-116. **A second `git fetch`
immediately before the retry push found Claude B had pushed yet another
commit in the meantime (`405fb8b`, NV-116 — "roll" loanword)** — same
collision pattern one number later. Rebased cleanly onto `405fb8b` and
renumbered again, to **NV-117**, this time landing clear (verified via a
third pre-push fetch, see close-of-session status below). Neither of
Claude B's two colliding commits touches `THANGSENG_NATIVE_VALIDATION.md`
(both are engine-code + `confirmed_loanwords.json` + tests only), so no
content was lost or overwritten either time — purely a numbering
coincidence from two sessions working the same NV-log concurrently
without a lock. Updated the `master_dictionary.json` notes-field
citations and the `WORKSTATE.yaml`/migration-doc cross-references to
NV-117 throughout. Also updated the file's pre-existing "Still open after
this batch" section (relay items 5/6), stale for the same reason twice
over, to point at NV-112–114's closures instead of asserting open.

**Dictionary changes:** 6 new tied-variant `master_dictionary.json` rows
(VERIFIED/HIGH, no primary chosen — same shipping pattern as NV-110's "big
red house"): `"i can eat"` → `Anga cha·na ama` / `Anga cha·na man·a`;
`"i can go"` → `Anga re·angna ama` / `Anga re·angna man·a`; `"i can work"`
→ `Anga kam ka·na ama` / `Anga kam ka·na man·a`. All 3 keys allowlisted in
`src/data/known_dictionary_conflicts.json`.

**Duplicate-representation check (Rule 8):** `corrections.json`/
`phrase_maps.js` checked for the 3 new keys — no entries in either file.

## CLOSED — do not reopen

- **`ama`/`man·a` identity (NV-117)** — closed on direct native evidence.
  Neither word is more "canonical" per Thangseng's own wording; both are
  tied VERIFIED variants.
- (From the concurrent Claude B session, for completeness, not this
  session's work — do not redo:) **relay item 5** (question-word+`-ma`,
  NV-113) and the **only-X sign-off** (NV-112 [Finding 2] + NV-114).

## Full gate (re-run after every change, against the fully rebased+
renumbered state, final numbers)

- `node prepare-data.js` — 8212 unique compiled entries.
- `node test-dictionary.js` — 8212/8212 valid, 9/9 grammatical corrections.
- `node repository-intelligence.js` — 0 new violations, all checks (A–G).
- `node scripts/resync-stale-overrides.mjs` — 0 RESYNC candidates.
- `node --test tests/unit/*.test.js` — 301/301 (Claude B's two colliding
  sessions raised the baseline via NV-113/114/115/116; no new tests added
  by this session — pure dictionary/docs, re-run to confirm still green
  after each rebase).
- Live `translate()` spot-check: `"i can eat"`/`"i can go"`/`"i can work"`
  all resolve `exact-phrase`, confidence 0.98.

## Runtime Handoff

None — no engine code touched. For Claude B, when the modal-drop fix
(`ama`/`man·a` insertion into sov-assembly) is implemented: either word is
native-confirmed correct in the eat/go/work slot.

## STILL PENDING — narrowed to exactly 1 item

Of the original 3 items in the prior migration doc, 2 are now closed
(by the concurrent Claude B session, NV-112–114) and 1 by this session
(NV-117). Only one remains:

1. **RULE-038 tension** — bare classifier forms (`sak·sa`/`sak·gni`/
   `sak·gittam`) vs. RULE-038's documented "the specific noun is always
   stated" claim. Flagged (NV-109), not resolved. No question drafted yet.

## Explicit instructions to next Claude A

- Do not reopen NV-117, or NV-103 through NV-115 (the last 4 of which are
  Claude B's, not this session's — re-verify against the repo, don't take
  this doc's account of B's work as authoritative for B's own next steps).
- Do not touch engine code.
- Resync against actual `origin/main` before doing anything.
- If picking up RULE-038 tension: it needs a drafted relay question, not a
  guess either direction.

## Repository status at close

- HEAD (this commit) == origin/main after push — verify via `git fetch` +
  compare before trusting this line.
- `git status`: clean.
- `.ai/WORKSTATE.yaml`: updated this session.
- `.ai/SESSION_BOOTSTRAP.md`: unchanged.
- This migration doc: complete, rewritten once after the collision was
  found and resolved (see "Collision found before push" above — the first
  draft, written before rebasing, is superseded and was never pushed).
- No local-only commits, no uncommitted changes.
- Native-validation status: NV-117 closed; RULE-038 tension is the sole
  remaining open item; no blockers.
