# Claude A Session Migration — 2026-09-09C

Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260909B.md` at HEAD `b7d4ec3`.
Resync clean (one intervening docs-only Claude B commit, `0503565`, no
conflict, gate reconfirmed green before starting: 8252/8252, 9/9, 0 new
repository-intelligence violations, 379/379 unit tests).

## Work this session

**1. NV-153 (Thangseng direct relay via Tridip) — PARTIALLY CLOSED.**
Closed relay items 2 (`ska` takes no trailing raka dot: `cha·na ska`,
not `cha·na ska·`) and 4 (common-noun object drops `-ko` before
`ska`/`skenga` — corroborated a second time via `Anga momo cha·na ska`,
not `momo·ko`). Fixed two live bugs with no prior dictionary entry
(`i want to eat momo`, `have you eaten your lunch?`), both now resolve
correctly via exact-phrase match. **Items 1 (`bi·na sikenga` exception)
and 3 (`ska` vs `skenga` aspect distribution) remain OPEN** —
`docs/THANGSENG_RELAY_QUESTION_20260909.md` updated to show only these
two as live; not yet answered as of this close.

**2. Project Owner directives (walk, give; sleep/hope reviewed).**
- SLEEP: confirmed non-issue, no change.
- WALK: promoted `Re·a` to primary at the shipping layer
  (`src/data/phrase_maps.js['walk']`, `re·am·a` → `Re·a`). Left the
  sibling `Walk`→`re·am·a` master row untouched (relationship
  unconfirmed). **Runtime Handoff to Claude B:** `compiled_dict.json`'s
  own pickPrimary tie-break for bare `walk` is unresolved and would
  still pick `re·am·a` if the phrase_maps.js override were ever
  removed — not fixed this session, flagged only.
- GIVE: real conflict, neither `On·a` nor `ron·a` had any citation.
  Promoted `On·a` (superseded→verified_high) citing the Project Owner
  directive by name (not misattributed as native evidence, per
  `.ai/PROJECT_OWNER_AUTHORITY.md`), superseded `ron·a`, fixed the
  shipping layer (`phrase_maps.js['give']`).
- HOPE: audit-only, no directive, no data touched. Cleanup queue noted
  for a future pass: stale pre-POS-split note on the superseded
  `Ka·donga`/hope row, `Ka·mana` possibly misfiled under "to hope",
  `Ka·dongsoa` unresolved spelling variant, 4 uncited
  Hopeful/Hopeless/no-hope adjective rows.

Ran a citation-mismatch audit (uncited shipping value vs. a better-cited
non-superseded sibling under the same key — the root-cause shape behind
both walk and give) across all of `master_dictionary.json`. Two initial
hits, both false positives on inspection (a key-casefold merge of two
legitimately distinct `where`/`Where` entries; a Thangseng-confirmed
word-order variant for "why do you laugh?", not a losing uncited form).
**No further instances of this bug pattern found.**

**3. NV-154 (Thangseng direct quote via Tridip, relayed via Project
Owner, analysis originally drafted by Claude D) — CLOSED.**
- Completed the cook (`song-`) paradigm: added `cook (command)`→
  `Song·bo`, `cook (past interrogative)`→`Song·ahama?`,
  `cook (continuous interrogative)`→`Song·engama?`,
  `cook (simple interrogative)`→`Song·ama?`. Named by grammatical form
  (matching the existing `cook (future)` precedent) to avoid a Check-F
  collision with corrections.json's pre-existing natural-phrasing keys,
  which already independently shipped the same correct values via a
  different pipeline layer — this closed a citation/paradigm-
  completeness gap, not a live runtime bug.
- Fixed a root collision: `set up post`→`song·a` was the cook root, not
  erect. Superseded it, added `set up post`→`Songna` (verified_high).
  Extended the `plant`→`Songna` row's citation to note its second
  "erect" sense. Added `to erect a wooden post`→`Krongna songna`.
- Extended `docs/grammar_rules_structured/RULE-007.yaml` (Hai
  Construction/Hortative, already owned this topic) with the `-na`
  (general urge) vs `-naha` (immediate urge) distinction Thangseng
  volunteered — existing rows already reflected it correctly, this was
  a missing writeup only. Also noted the raka-in-stem-not-suffix
  principle as corroboration for `-bo` (matches RULE-023's `-gen`
  pattern).
- Raka/bullet-character (`•`) check: confirmed no live issue, the
  character never appears in any `garo`/`english` field.

## Gate status

Full gate re-run and green after every edit this session (3 separate
commits: `55d989c` NV-153 partial closure, `f7cfc7e` walk/give
directives, `d2f0b59` NV-154). Final state: 8260/8260 dictionary
entries, 9/9 grammatical corrections, 0 new `repository-intelligence.js`
violations (8 checks — 2 new self-consistency conflicts this session,
`want to eat` and `set up post`, both allowlisted with citation in
`src/data/known_dictionary_conflicts.json`), 379/379 unit tests
(unchanged, no engine code touched). Every touched/new key live-verified
via `translate()` post-build, not just static file inspection.

## Runtime Handoff

**One item, restated from this session (not new): `compiled_dict.json`'s
pickPrimary tie-break for bare `walk` is unresolved** — `re·a` was
promoted at the `phrase_maps.js` shipping layer only, per explicit
non-single-winner caution around the `re·a`/`re·am·a` relationship
(unconfirmed). If `phrase_maps.js`'s override is ever removed or
resynced away, the bare-key compile would fall back to `re·am·a`
(last-write-wins among untagged VERIFIED/HIGH candidates), not `Re·a`.
This is Claude B/engineering territory (a principled tie-break
mechanism), not a linguistic call — no new native evidence would
resolve it, since the underlying re·a/re·am·a relationship question is
separate and still genuinely open.

No other Runtime Handoff items this session. `bi·sa` productive-suffix
gap (flagged 2026-09-09, prior session) is unchanged, still open in
`claude_b.pending_handoff_from_claude_a_20260909`.

## Repository status at close

- HEAD `d2f0b59` == `origin/main` (verified via `git fetch` + direct
  comparison)
- `git status` clean, no local/uncommitted changes
- `WORKSTATE.yaml` updated (this commit)
- `.ai/SESSION_BOOTSTRAP.md` updated (this commit)
- Migration doc complete (this file)
- No local commits ahead of origin
- No native-validation blocker beyond the two still-open NV-153 items
  (1 and 3), awaiting Thangseng

## Resume protocol for next Claude A session

Per Rule 10: `git fetch origin`, verify HEAD == origin/main, read
`WORKSTATE.yaml` + `SESSION_BOOTSTRAP.md` before any work. If Thangseng
has answered NV-153 items 1/3 by then, that is the first task. Otherwise
no queued Claude A task as of this close — check for new Project Owner
directives or native relay first.
