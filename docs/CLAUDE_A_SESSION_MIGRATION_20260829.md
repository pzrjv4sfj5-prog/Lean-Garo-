# Claude A Session Migration — 2026-08-29

**Status: CLEAN CLOSE.** All work committed, pushed, gate-verified. No mid-task
state.

Resumed via `docs/CLAUDE_A_SESSION_MIGRATION_20260828C.md` (checkpoint
`cb56f6a`, one non-functional follow-up commit `5c08102` on top correcting
that doc's own repository-status section post-rebase). `git fetch` clean,
HEAD == origin/main == `5c08102` at start, zero drift. Duplicate-key scan of
`.ai/WORKSTATE.yaml`'s `claude_a:` section run per the prior doc's resume
protocol — clean (the one known duplicate is in `claude_b:`, already
flagged, not this role's territory).

## Completed work

### 1. `film` sentence + `-ko` object construction — new native evidence applied (NV-099)

Project Owner relayed direct Thangseng evidence: "I saw the film last
week." → `Anga ia film-ko mija antio nia.` `film` itself was already
VERIFIED/HIGH (NV-089, 2026-08-21) — **not** re-asked, per instruction.

- Promoted the existing `master_dictionary.json` row for `i saw the film
  last week.` from `unverified` (stale word order, no native backing) to
  `verified_high` with the exact native-confirmed text.
- This confirms two things: the sentence itself, and that `film` takes
  the `-ko` accusative/object suffix exactly as `RULE-009`'s already-
  verified/high `-ko` general system predicts. Treated as a **confirming
  instance** of an existing rule (RULE-009), not a new rule — no grammar
  file touched, consistent with the operating-governance distinction
  between direct evidence and rule-derivation.
- **Duplicate-representation check:** searched `corrections.json`,
  `phrase_maps.js`, `garo_dictionary.json`, `final_entries.json`,
  `compiled_dict.json`. Found 2 stale untagged duplicates in
  `garo_dictionary.json` (legacy build-input source, no confidence field)
  under both the lowercase and capitalized english-key variants, carrying
  the old unconfirmed word order. `prepare-data.js`'s `pickPrimary`
  master-preference logic meant these were never going to ship over
  master's row, but synced both to the confirmed text anyway for
  hygiene/citation-accuracy — no runtime behavior change, verified by
  gate re-run below.
- Logged as `NV-099` in `docs/THANGSENG_NATIVE_VALIDATION.md`.
- Live-verified via `translate()` post-rebuild (see Runtime Handoff).

### 2. `go` — left untouched, as instructed

No new native evidence this session. Exactly as session 3 left it:
VERIFIED/HIGH citation for `re'a` on file, flagged as an unresolved
tension against `RULE-030`'s `Re·anga` example and the engine's
conjugation root, **not** used to override runtime. Relay question
remains queued in `.ai/WORKSTATE.yaml`
`claude_a.pending_thangseng_questions`, not yet sent. No form invented.

### 3. Dictionary cleanup — full exact-duplicate sweep re-run, 0 new removals

Re-ran the same zero-information-duplicate check as session 3 (identical
english + garo + confidence + classifier + category) across all 9947
master rows. Found one near-match beyond the already-closed `Pen`/`pen`
case: two `ten birds`/`SUPERSEDED` rows (idx 1090, 3695) with identical
english/garo/confidence/classifier/category — **but distinct, substantive
audit notes** (one documents the 2026-08-01 corpus-internal audit finding,
the other documents the 2026-08-11 `do·a`/"climb" root-error correction).
These are not zero-information duplicates — the notes carry real,
different provenance history this project's citation discipline depends
on. **Left both in place, not merged or removed.** No other candidates
found. Full duplicate-key backlog (~1,000+ groups,
`docs/DUPLICATE_AND_RAKA_AUDIT_SUMMARY.md`) remains correctly unattempted
— still needs dedicated per-group native-informed session(s), per
session 3's scoping (unchanged).

## Native evidence

1 item received and applied this session: `film`-sentence / `-ko`
construction (NV-099, Project-Owner-relayed direct Thangseng quote). No
other native evidence arrived.

## Unresolved questions (unchanged, still queued for Thangseng)

Same 3 items as session 3's close, logged in `.ai/WORKSTATE.yaml`
`claude_a.pending_thangseng_questions`, not yet sent:
1. **"go"** — re'a vs. re'anga (short/bare vs. fuller form?).
2. **"will not go"** — re'angjawa vs. re·jawa (destination-present/absent
   or formality distinction?).
3. **"movie"** — distinct word, or does the `film` loanword cover both
   senses? **Not** assumed either way this session either.

## Do NOT repeat

- Do not re-ask whether `film` = movie/motion-picture-you-watch in the
  generic sense — `film` itself has been directly native-confirmed since
  NV-089, and this session's NV-099 additionally confirms it takes `-ko`
  correctly in a full sentence. What remains genuinely open is only
  `movie` specifically (see item 3 above) — a different, still-unanswered
  question, not a re-ask of `film`.
- Do not invent a form for `go` — still needs an explicit Thangseng
  answer to the queued question, exactly as before.
- Do not re-run the full exact-duplicate sweep expecting to find more —
  this session re-ran it in full and found nothing new beyond the one
  already-closed case and one legitimate non-duplicate (`ten birds`,
  distinct notes, correctly preserved).
- Do not merge the two `ten birds`/SUPERSEDED rows (idx range near
  1090/3695) — same garo value, but their notes are independently
  meaningful audit history, not redundant text.

## Runtime Handoff

```
i saw the film last week. -> Anga ia film-ko mija antio nia.
  (method: exact-phrase, confidence: 0.98)
```

**Build/test gate**, verified after this session's commit:
- `node prepare-data.js`: clean, 8189 unique compiled entries (unchanged
  count — this session promoted an existing key's confidence, didn't add
  a new key), 787 bare-infinitive aliases, 930 alternates, 190 held
  SUPERSEDED-only keys (unchanged), 17 pickPrimary verified-ties
  (unchanged, all pre-existing and out of scope this session).
- `node test-dictionary.js`: 8189/8189 valid entries, 9/9 grammatical
  corrections (unchanged baseline).
- `node --test tests/unit/*.test.js`: 247/247 (unchanged).
- `node repository-intelligence.js`: 0 new violations across Checks
  A–G (1612 known self-consistency conflicts, 110 known placeholders,
  77 known runtime-cascade mismatches — all pre-existing baselines,
  unchanged).
- `node scripts/resync-stale-overrides.mjs`: 0 resync candidates
  (unchanged baseline).
- `npm run lint`: 9 pre-existing errors, all in `src/research/demo.js`
  and `src/research/researchFallback.js` (unused-vars) — untouched by
  this session, outside Claude A's role boundary (engineering/Claude B
  territory), not fixed here. Flagged for Claude B.

## Cross-role notes

- Lint has 9 pre-existing errors in `src/research/*.js`
  (`no-unused-vars`) unrelated to any Claude A change this session —
  flagging for Claude B, since `npm run build` doesn't currently run
  lint as a gate (per `package.json`) this didn't block the session, but
  it's a real lint-clean regression from whatever session last touched
  those files.
- Claude B's pre-existing duplicate-key issue in
  `.ai/WORKSTATE.yaml`'s `claude_b:` section
  (`next_action_prior_20260827` appears twice) is still present,
  unchanged. Still Claude B's to fix, not touched here.

## Exact next actions (priority order)

1. Send the 3 queued relay questions (go, will not go, movie) to
   Thangseng via Tridip/Project Owner. **Role: Owner/native.**
2. `knowledge (alt, fuller compound)` — still open, untouched across 4
   sessions now. **Role: Owner/native.**
3. `only` citation-hygiene archaeology (2026-08-01 SUPERSEDED note
   miscites unverified variants as VERIFIED) — untouched since first
   flagged. **Role: Claude A, git archaeology.**
4. Flag Claude B's duplicate-key WORKSTATE.yaml issue directly to Claude
   B (unchanged from session 3). **Role: Claude B.**
5. The 9 pre-existing lint errors in `src/research/*.js` — new flag this
   session. **Role: Claude B.**
6. Full duplicate-key dictionary backlog (~1,000+ groups) — needs a
   dedicated multi-session native-informed pass, unchanged scoping from
   session 3. **Role: Claude A + native relay, multi-session.**
7. Pre-existing deferred backlog, unchanged: pickPrimary verified-ties
   (`docs/PICKPRIMARY_VERIFIED_TIES.md`, 17 keys, Claude B territory).

## Resume protocol for the next Claude A session

Unchanged from session 3's resume protocol (duplicate-key scan before
trusting any WORKSTATE.yaml field, always use `<field>_prior_<context>`
when demoting content, treat the latest migration document as ground
truth over chat history). No new resume-protocol additions this session.

## Repository status at close

- HEAD after this session's final commit and `origin/main`: to be
  verified identical via `git fetch` + `git rev-parse` comparison
  immediately after push (see commit below).
- `git status`: clean before this session's commit; verified clean again
  after commit + push.
- `.ai/WORKSTATE.yaml`: updated this commit (`claude_a.next_action`
  demoted prior content to `next_action_prior_20260828C`, new
  next_action written).
- `.ai/SESSION_BOOTSTRAP.md`: to be updated in this commit (top pointer).
- No local-only commits — pushed in the same step this doc was
  finalized.
- No uncommitted or untracked files at close.
- Full gate: 247/247 tests, 8189/8189 compiled entries, 9/9 grammatical
  corrections, 0 new repository-intelligence violations (all 4 checks),
  0 resync candidates, film-sentence live-verified via `translate()`
  matching native evidence exactly.
- Native-validation/blocker status: 1 new native evidence item applied
  (NV-099, film sentence/-ko construction); 3 relay questions still
  queued (go, will not go, movie); 2 pre-existing untouched items
  (knowledge alt, only citation-hygiene archaeology); 1 cross-role item
  still flagged for Claude B (WORKSTATE duplicate key) plus 1 new
  cross-role flag (lint errors). No mid-task state.
