# Claude A Session Migration — 2026-09-18

Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260916B.md`.

## Resync (Rule 10)

- `git fetch origin`; HEAD on arrival: `9d4856030e28b9b5dac7688be207cdc52aa6f9ad` == origin/main, clean tree.
- The one commit beyond 20260916B's stated closing HEAD (`8f7a11c`) was that
  doc's own file-addition commit (`9d48560`) — no real drift, already reflected.
- `docs/CLAUDE_B_SESSION_MIGRATION_20260917.md` (Claude B, bol/king/ge/te
  classifier fix) was already merged into `origin/main` ancestry via a Claude B
  merge commit (`10cb2f9`) before this session's first push — absorbed cleanly
  via `git rebase origin/main` mid-session, no conflicts, no manual merge.
- Gate reconfirmed green on arrival before starting: 8552/8552 dictionary,
  9/9 grammatical corrections, 413/413 unit tests (pre-Claude-B's same-day
  test additions), 0 new repository-intelligence violations.

## Task: "let's go to X" as a repeatable composition

The Project Owner asked to generalize the existing single data point
("let's go to the market" = `Hai bajalchi re·na`, NV-060, VERIFIED/HIGH)
into a productive pattern usable for other destinations, rather than treating
each destination as its own relay question.

**Classification: Class B** (mechanically derivable from established rules,
per `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` §3/§6) — not itself separately
native-confirmed. Composed from two independently VERIFIED/HIGH rules:

- **RULE-007** (Hai hortative, `-na` = general-urge form)
- **RULE-044** (`-chi` = movement-to locative, confirmed general across noun
  classes including loanwords — NV-051; precedent: "go to youtube" =
  `iutubchi re·angbo`)

Modeled directly on the existing citation, not invented from scratch.

### Batch 1 — shop, school

- **let's go to the shop** = `Hai do·kanchi re·na` (shop = `Do·kan`,
  VERIFIED/HIGH)
- **let's go to school** = `Hai skulchi re·na` (the locative form
  `skulchi` is itself already VERIFIED/HIGH per NV-051/RULE-044,
  independent of bare "school"'s own unverified tag)

Commit `8807004`.

### Batch 2 — mall, restaurant (new vocabulary + composition)

The Project Owner then asked for mall/restaurant specifically, and stated
directly in chat (2026-09-18) that both are loanwords with no native Garo
word. This is a Project Owner directive, not a Thangseng quote —
provenance-labeled per `.ai/PROJECT_OWNER_AUTHORITY.md`'s separate-provenance
rule, same shape as the existing TV/Phone precedent (NV-049, NV-071).

- **mall** = `Mall` (VERIFIED/HIGH, PO directive)
- **restaurant** = `Restaurant` (VERIFIED/HIGH, PO directive)
- **let's go to the mall** = `Hai mallchi re·na` (Class B, as above)
- **let's go to the restaurant** = `Hai restaurantchi re·na` (Class B, as above)

Commit `8167cb4`.

### Not built: no guessing on genuine vocabulary gaps

Before the Project Owner's loanword confirmation, mall/restaurant had zero
entries anywhere in the repo — this was correctly treated as a vocabulary
gap (Class A, needs native/Owner input), not a grammar gap, and was not
composed from `-chi` alone. Composing a sentence for a noun that doesn't
exist yet would have been a guess, not a derivation.

## Schema gap found and worked around

`.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` §3 introduced a `DERIVED` confidence
tag "going forward" for exactly this class of entry (Class B: mechanically
derivable from established rules, not separately native-confirmed). This
session was the first to actually try using it on all 4 new sentence rows.

`repository-intelligence.js`'s `VALID_CONFIDENCE_VALUES` enum was never
updated to accept `derived` — it only accepts
`verified_high, unverified, ocr_flagged, superseded, open, rejected`. Using
`derived` failed the gate (2 confidence-schema problems).

**Fix applied (data-layer, not engineering):** tagged all 4 new sentence
rows `unverified` instead — the honest fallback, since they are genuinely
not native-confirmed, not `verified_high`. The real DERIVED status and full
rule citation is carried in each row's `notes` field, which is what a human
or a future session should treat as authoritative provenance, not the
`confidence` field alone.

**Flagged for Claude B:** add `derived` to `VALID_CONFIDENCE_VALUES` in
`repository-intelligence.js`'s Check G so this tag can actually be used as
the governance doc intends, without a workaround. Not touched this session
(engineering territory).

## Verification

Full gate re-run after each commit, both green:

| | after Batch 1 | after Batch 2 (final) |
|---|---|---|
| dictionary (`test-dictionary.js`) | 8554/8554 | 8558/8558 |
| grammatical corrections | 9/9 | 9/9 |
| unit tests | 413/413 | 418/418 |
| repository-intelligence violations | 0 new | 0 new |

Every new/changed key live-verified via `translate()` post-build, both
batches:

```
mall -> Mall (exact-phrase, 0.98)
restaurant -> Restaurant (exact-phrase, 0.98)
let's go to the shop -> Hai do·kanchi re·na (exact-phrase, 0.98)
let's go to school -> Hai skulchi re·na (exact-phrase, 0.98)
let's go to the mall -> Hai mallchi re·na (exact-phrase, 0.98)
let's go to the restaurant -> Hai restaurantchi re·na (exact-phrase, 0.98)
```

## Runtime Handoff

**To Claude B:** add `derived` to `repository-intelligence.js`'s
`VALID_CONFIDENCE_VALUES` (Check G), per `.ai/CLAUDE_A_OPERATING_
GOVERNANCE.md` §3's already-stated intent. Until this lands, any future
Class B derived entry will need the same `unverified`-tag-plus-notes
workaround used this session.

No other runtime handoff — everything else this session is confirmed
correct at runtime, not just at the data layer.

## Push history (no collisions)

1. Commit `8807004` (shop/school) — pushed clean onto a concurrent Claude B
   merge (`10cb2f9`) via rebase, no textual conflicts (different files).
2. Commit `8167cb4` (mall/restaurant) — no concurrent commits, pushed
   directly.

## Repository status at close

- HEAD: `8167cb40bd03bfd445c8452462c9305b09329b08`
- `origin/main`: same — verified via `git fetch` + `git rev-parse`
- `git status`: clean, nothing local/uncommitted
- `.ai/WORKSTATE.yaml`: updated (new `claude_a.next_action`, old entry
  preserved as `next_action_prior_20260916B`)
- `.ai/SESSION_BOOTSTRAP.md`: updated (header pointer + summary)
- This migration doc: complete
- No local commits beyond what's pushed
- No open native-validation blocker from this session (mall/restaurant
  vocabulary gap was Owner-directed, not left open)

## Next Claude A

No queued task from this session. Standing open items, unchanged, not
touched this session:

1. `docs/THANGSENG_RELAY_QUESTION_20260916.md` (7-pattern wh-question
   suffix survey) — drafted, sent to Thangseng this conversation (per the
   Project Owner, outside this repo/session), reply not yet received.
2. 44-key interrogative-form family in `docs/SUPERSEDED_ONLY_KEYS.md`
   (Claude D territory).
3. Claude B's §8 note in `docs/CLAUDE_B_SESSION_MIGRATION_20260917.md`:
   remaining classifiers (`bol`/`king`/`ge`/`jol`/`se`/`te`) open, needs
   relay not guessing.
4. New this session: `derived` confidence tag not yet in
   `repository-intelligence.js`'s schema — Claude B territory (see Runtime
   Handoff above).
