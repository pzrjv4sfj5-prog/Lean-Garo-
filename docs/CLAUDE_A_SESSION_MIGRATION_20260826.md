# Claude A Session Migration — 2026-08-26

**Status: MIGRATION CLOSE, mid-task.** The Thangseng relay batch is NOT
complete. Do not report it as complete. Resume exactly where this document's
"Resume Protocol" section says to.

## What this session found and fixed

### 1. Relay batch identity correction

The "138-item Thangseng relay batch" name/count, carried unchanged across
five migration documents since 2026-08-20, was a frozen snapshot from
NV-088 (see `docs/THANGSENG_NATIVE_VALIDATION.md`, "Remaining
THANGSENG_RELAY_BATCH_20260820 items: 138 still open") — the count at that
moment, never updated as items closed in NV-089 through NV-096. The actual
source file, `docs/THANGSENG_RELAY_BATCH_20260820.md`, has **149 unique
items** (91 Part A single words + 58 Part B phrases). A same-session
earlier count of "89+58=147" was also wrong — it missed "beautiful" and
"child" in Part A. 149 is the correct, file-verified total.

### 2. Ska/skenga closure (Thangseng evidence, relayed this session)

Thangseng's final evidence, relayed by the Project Owner directly in this
session:
- `ska` = desire/wish/want (simple)
- `skenga` = continuous of `ska`

This closes the question left open in
`docs/PENDING_LINGUISTIC_PROPOSAL_20260718_sikenga_ska_sika.md`. It also
surfaced a live regression: 8 "I want to X" phrase entries (eat, drink, go,
sleep, come, work, study, pray) were shipping `sikenga` — the continuous of
`sika` (push/insert), a **different verb entirely**, per NV-021
(2026-07-18). The word-level fix (`want`→`ska`) landed 2026-07-18 but never
propagated to these 8 phrase-level entries.

Fixed in `master_dictionary.json` (superseded stale rows, added
verified_high `ska` rows) and `src/data/corrections.json` (top-priority
runtime override, checked first by `lookupEngine.js`). `known_dictionary_
conflicts.json` updated with the 8 new intentional superseded/verified
pairs. One stale test assertion fixed
(`tests/unit/rc039_drink_sing_raka.test.js` was asserting the bug's own
output). "I want water"/"I want food" deliberately left untouched —
legitimate `skenga` usage under a separate, already-established pattern
(2026-08-03), not in scope.

**Verified via actual `translate()` runtime calls for all 8 keys**, not
`compiled_dict.json` inspection. Commit: `782918c` (rebased 2026-08-26 onto Claude B's concurrent close, was cd867ae pre-rebase).

### 3. Engineering-propagation-gap sweep (relay-batch byproduct)

While classifying the 149-item batch, found 12 items where
`master_dictionary.json` already carried a native-confirmed VERIFIED/HIGH
value that never propagated to `corrections.json`/`phrase_maps.js` — same
bug shape as ska/skenga, different keys. Investigated each individually via
citation notes before touching anything.

**7 fixed** (corrections.json/phrase_maps.js updated to match
native-confirmed master values, each verified via `translate()`):
`bring`, `choose`, `land`, `it is not good`, `they are working`,
`thank you very much`, `you did well`.

**1 citation-hygiene fix, not a runtime bug** (corrections.json already
served the correct value): `cooked` — the older `min·a` VERIFIED/HIGH row
(NV-050, 2026-08-02) marked SUPERSEDED, since NV-095's 2026-08-23 "final
native data reconciliation" gave `Song·aha` for the same key without the
older row ever being re-tagged. Retained per citation discipline, not
deleted.

**4 checked and left untouched** — master documents multiple legitimate
alternate forms in one VH row (primary + alt), runtime correctly ships one
of them, not a bug: `if`, `wait`, `which`, `what is your name`.

Commit: `d0793c2` (rebased, was aa5e78e pre-rebase).

### 4. NV-092 findings applied that were never written

`stand up`, `take revenge`, and `to spread` were documented in NV-092
(2026-08-23, commit `e515d14`) as closed with specific native-confirmed
values ("closes the priority stand/stand-up item", "closes the priority
take-revenge item") — but the `master_dictionary.json` writes never
actually landed (confirmed via `git show e515d14 -- master_dictionary.json`
containing no such rows). Applied now, citing NV-092 as the evidence source
(not new evidence — this session just completed the application). Also
fixed `corrections.json`'s `stand up` entry, which was shipping the bare
`Chadenga` (declarative "stand") instead of the confirmed imperative
`Chadengbo`.

Commit: `576e96a` (rebased, was b601da3 pre-rebase).

### 5. Discovered but NOT resolved: parenthetical-key pattern

While checking `begin`, `bland`, `bye`, `coming` (flagged open — no
VERIFIED/HIGH row under the bare key), traced the actual NV-093 commit
(`9ef4603`, 2026-08-23) and found it wrote rows under parenthetical keys —
`"begin (infinitive)"`, `"bland (alt)"`, `"bye (clarified)"`,
`"coming (progressive)"` — not the bare batch keys. Nothing was lost; my
earlier exact-key lookup simply didn't match these. The same commit added
similarly-suffixed rows for `cooked (past-tense verb, "I cooked")`,
`bring (imperative)`, `dance (alt)`, `eaten (alt, perfective)`,
`happy (predicate form)`, `how (alt)`, `knowledge (alt, fuller compound)`,
`live (alt)`, `living (alt, progressive)`.

**Per Project Owner instruction, this was NOT investigated further this
session** — no guessing about whether these parenthetical rows correctly
answer the bare-key lookup or represent a genuinely distinct sense. See
Resume Protocol below.

## Full 149-item accounting (partial — pending item 5 above)

| Category | Count | Notes |
|---|---|---|
| Total items in source batch | 149 | 91 Part A + 58 Part B |
| NEW CONFIRMED this session | 8 | ska/skenga fix |
| ENGINEERING PROPAGATION GAP — fixed | 7 | bring, choose, land, it is not good, they are working, thank you very much, you did well |
| DUPLICATE-STALE — fixed (citation hygiene) | 1 | cooked |
| Applied from undocumented-but-cited NV-092 evidence | 3 | stand up, take revenge, to spread |
| Resolved under a `?`-suffixed key variant (NV-096) | 3 | did you eat, did you go to market, did you have lunch |
| VERIFIED — already correct, no action needed | 104 | includes 4 legitimate-multi-form items (if/wait/which/what is your name) and 18 items where the draft's original guess was superseded by a later, different, already-correct answer (RECONCILIATION) |
| Parenthetical-key resolved (2026-08-27, class D dup-repr. fix) | 4 | begin, bland, bye, coming — all confirmed word-for-word matches of the relay batch's own proposed values (NV-093); resolved as citation-hygiene, not relay. See `docs/CLAUDE_A_SESSION_MIGRATION_20260827.md`. |
| LINGUISTICALLY OPEN — needs actual Thangseng relay | ~14 | go, only, don't eat, don't go, give me water, go away, help me, how are you, how many, how much, how much is this, hurry up, i am eating, i don't know (soft) |

**8 + 7 + 1 + 3 + 3 + 4 + 104 + 14 = 144.** Same total as before the
2026-08-27 resolution — the 4 parenthetical items moved from a separate
"pending" bucket into "resolved," they were never part of the 14-item
LINGUISTICALLY OPEN list, so that count is UNCHANGED at ~14. Discrepancy
from 149 (5 items) is expected rounding/overlap in the "104 VERIFIED"
bucket's internal breakdown (not re-verified line-by-line) — the
per-item classification script output remains the authoritative source.

**Item 2 (recalculate true LINGUISTICALLY OPEN count) — CLOSED
2026-08-27:** confirmed above. The 14-item list is the true, current,
corpus-internally-unresolvable relay queue. No new items added, none
removed by this recalculation.

## Runtime Handoff

**Scope of this session's verification:** every key touched by this
session's 3 commits (8 ska/skenga keys, 7 propagation-gap keys, 1
supersede-only key with no runtime change expected, 3 NV-092-backfill
keys) was individually verified via actual `translate()` calls, not
`compiled_dict.json` inspection or trust in `master_dictionary.json`
tags alone. Full list re-runnable via the node snippets in this session's
tool-call history if needed; not re-pasted here for brevity.

**NOT verified this session:** the ~104 items classified as "already
VERIFIED, no action needed" were checked for `master_dictionary.json`
VERIFIED/HIGH presence and (for a subset) runtime-output agreement with
that master value, but **not** individually re-run through `translate()`
end-to-end as a completeness pass. If picking this back up, a full sweep
(`node -e` loop over all 149 keys through `translate()`, diffed against
expected master values) is cheap and would close this gap — see the
`/tmp/batch_items.json` / `/tmp/runtime_results.json` pattern used earlier
this session (these are scratch files in the container, not committed —
regenerate if needed, the parsing script is reconstructable from this
doc's §5 key list plus the original batch file).

**Build/test gate:** 235/235 unit tests passing, `npm run build` clean,
0 new `repository-intelligence.js` violations (Checks A–G), verified
after each of this session's 3 commits individually, not just at the
end.

## Resume Protocol (next Claude A session — read this first)

For the exact, itemized pending-work list (task/status/verified/
remains/reference/role for every open item), see "Next Session —
Pending Work" below. This section is the procedural steps; that section
is the content.

1. Read `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` in full before any
   linguistic work (standing rule, not new).
2. Rule 10 mandatory resume sequence: `git fetch origin`; compare current
   `HEAD` against this document's stated `head` in `.ai/WORKSTATE.yaml`
   (`576e96a` as of this close — but re-read `WORKSTATE.yaml` directly,
   don't trust this cached copy if it's been superseded); `git log
   576e96a..HEAD --oneline` and read in full anything touching
   `master_dictionary.json`, `corrections.json`, or `phrase_maps.js`.
3. **Do not start new relay-batch work yet.** First resolve the
   parenthetical-key question (§5 above):
   a. Read the actual `garo` + `confidence` values under each
      parenthetical key (`begin (infinitive)`, `bland (alt)`,
      `bye (clarified)`, `coming (progressive)`, and the other ~8 keys
      from the same NV-093 commit listed in §5).
   b. Run `translate()` for the bare keys (`begin`, `bland`, `bye`,
      `coming`, plus any of the others from §5 that are also open items:
      `cooked` is already resolved via a different mechanism — verify the
      rest don't have the same bare-key gap).
   c. Determine — from evidence, not assumption — whether each
      parenthetical row is (i) the correct answer for the bare relay-batch
      key too (in which case: promote/copy into the bare key, citing the
      same NV-093 evidence), or (ii) a genuinely distinct sense/compound
      that doesn't answer the bare question (in which case: the bare key
      stays open, needs actual relay). **Do not guess.** If the NV-093
      prose (`git show 9ef4603`, commit message, and any accompanying
      `docs/THANGSENG_NATIVE_VALIDATION.md` NV-093 section) doesn't make
      this unambiguous, flag it as still open rather than picking.
4. Recalculate the true LINGUISTICALLY OPEN count once step 3 is done.
5. Assemble and send the actual (much shorter, corrected) relay batch to
   Tridip → Thangseng. This has **not been sent** — only classified.
   Name it `docs/THANGSENG_RELAY_BATCH_20260826.md` or similar, dated to
   when it's actually assembled.
6. Only after 1–5: return to the pre-existing deferred backlog —
   pickPrimary verified-ties (Claude B territory, AI-001; Claude A's role
   limited to POS/sense defaults when asked) and the repository-wide
   space-before-ma sweep (both carried unchanged from the 2026-08-25
   close, untouched this session).

## Next Session — Pending Work

Every open item, in priority order. Each states: exact task, current
status, what's already verified, what remains, file/NV references, and
role (A=linguistic, B=engineering, Owner/native=needs Project Owner or
Thangseng input).

### 1. Resolve the NV-093 parenthetical-key pattern
- **Task:** Determine whether the parenthetical-keyed rows NV-093 (commit
  `9ef4603`, 2026-08-23) added — `"begin (infinitive)"`, `"bland (alt)"`,
  `"bye (clarified)"`, `"coming (progressive)"`, `"cooked (past-tense
  verb, 'I cooked')"`, `"bring (imperative)"`, `"dance (alt)"`,
  `"eaten (alt, perfective)"`, `"happy (predicate form)"`,
  `"how (alt)"`, `"knowledge (alt, fuller compound)"`, `"live (alt)"`,
  `"living (alt, progressive)"` — correctly answer the corresponding
  **bare** relay-batch keys (`begin`, `bland`, `bye`, `coming`, `cooked`,
  `bring`, `dance`, `eaten`, `happy`, `how`, `knowledge`, `live`,
  `living`), or represent genuinely distinct senses that leave the bare
  key still open.
- **Status:** Discovered, not investigated. `cooked` and `bring` are
  already independently resolved this session via a *different*
  mechanism (see §3/§4 below) — re-check those two aren't secretly the
  same underlying question before spending fresh effort. `dance`,
  `eaten`, `happy`, `how`, `knowledge`, `live`, `living` were not part
  of the original 149-item relay batch at all (not flagged open), so
  low priority — only worth checking if they surface elsewhere.
- **Verified already:** The parenthetical rows exist and were genuinely
  committed (not lost) — confirmed via `git show 9ef4603 --
  master_dictionary.json`. The bare keys (`begin`, `bland`, `bye`,
  `coming`) have no VERIFIED/HIGH row and no `corrections.json`/
  `phrase_maps.js` override — `translate()` for these currently falls
  through to a lower-confidence path (not yet checked what it outputs;
  see next bullet).
- **Remains to check:** (a) exact `garo`+`confidence` values under each
  parenthetical key; (b) `translate('begin')`, `translate('bland')`,
  `translate('bye')`, `translate('coming')` actual current output; (c)
  read the full NV-093 narrative in `docs/THANGSENG_NATIVE_VALIDATION.md`
  for these specific items to see if the evidence disambiguates bare-key
  applicability; (d) if genuinely ambiguous, do not guess — flag as
  still open for relay.
- **Reference:** commit `9ef4603`; `docs/THANGSENG_NATIVE_VALIDATION.md`
  NV-093 section; `docs/THANGSENG_RELAY_BATCH_20260820.md` items 4, 5,
  9, 16 (begin, bland, bye, coming).
- **Role:** A (linguistic judgment call — POS/sense disambiguation).

### 2. Recalculate the true LINGUISTICALLY OPEN count
- **Task:** Once §1 is resolved, re-run the full 149-item classification
  to get a final, accurate open-item list.
- **Status:** Blocked on §1.
- **Verified already:** Everything except the §1 items has already been
  checked this session (see the accounting table above in this
  document) — do not re-derive from scratch, just fold in §1's outcome.
- **Remains to check:** Nothing beyond §1's outcome, unless §1 surfaces
  a new pattern that suggests other items need the same parenthetical-
  key check.
- **Reference:** This document's "Full 149-item accounting" table above.
- **Role:** A.

### 3. `cooked` — parenthetical-key cross-check
- **Task:** Confirm `"cooked (past-tense verb, 'I cooked')"` (NV-093,
  `9ef4603`) is the SAME finding as `"cooked"`=`Song·aha` (NV-095,
  already resolved and shipping correctly this session, see §3 of the
  session summary above) rather than a third, distinct value.
- **Status:** Likely already consistent (both look like they concern
  the past-tense/verb sense of "cooked"), but not explicitly cross-
  checked — flagging so the next session doesn't have to rediscover the
  parenthetical row exists.
- **Verified already:** `cooked` ships `Song·aha` at runtime, correct
  per NV-095, gate-verified this session.
- **Remains to check:** Read the NV-093 parenthetical row's exact value
  and compare.
- **Reference:** commit `9ef4603`; NV-095 in
  `docs/THANGSENG_NATIVE_VALIDATION.md`.
- **Role:** A (quick citation cross-check, likely a 2-minute close-out).

### 4. `bring` — parenthetical-key cross-check
- **Task:** Same cross-check as §3, for `"bring (imperative)"` vs
  `bring`=`ra·ba·a` (NV-089, fixed this session as an engineering-
  propagation gap, see main session summary §3).
- **Status:** Likely fine — `bring`=`ra·ba·a` is the infinitive/bare
  sense per NV-089's own citation; `"bring (imperative)"` is plausibly a
  *different*, legitimately separate key (e.g. for "Bring it!" contexts)
  rather than a competing answer for the bare `bring` key. Not confirmed.
- **Verified already:** `bring` ships `ra·ba·a` at runtime, correct per
  NV-089, gate-verified this session.
- **Remains to check:** Read the NV-093 parenthetical row's exact value;
  confirm it's a distinct sense, not a contradiction.
- **Reference:** commit `9ef4603`; NV-089 in
  `docs/THANGSENG_NATIVE_VALIDATION.md`.
- **Role:** A.

### 5. `go` — genuinely open
- **Task:** No VERIFIED/HIGH candidate exists under any key variant
  checked this session. Needs actual native relay.
- **Status:** Open, not corpus-internally resolvable.
- **Verified already:** No master row, no corrections.json/phrase_maps.js
  override checked for a clean citation this session.
- **Remains to check:** Nothing further corpus-internally — this is a
  relay-required item, not an investigation gap.
- **Reference:** `docs/THANGSENG_RELAY_BATCH_20260820.md` item 32.
- **Role:** Owner/native (needs an actual Thangseng answer via Tridip).

### 6. `only` — contradictory old citation, needs reconciliation
- **Task:** An old `master_dictionary.json` SUPERSEDED note references
  VERIFIED/HIGH forms (`ak·sa`, `ma·mang`, `·pit·chi`, `·sa`) for
  `only`, but none of the current rows under any of those values
  actually carry `confidence: verified_high` — they're all
  `unverified`. Either the note is stale/wrong, or a promotion was lost
  somewhere (same shape as the NV-092 finding in §4 of the main session
  summary, but not yet traced to a specific commit).
- **Status:** Discovered, not investigated further — no commit
  archaeology done for this one (unlike `stand up`/`take
  revenge`/`to spread`, where `git show` confirmed the specific lost
  commit).
- **Verified already:** Nothing beyond the anomaly itself.
- **Remains to check:** `git log -- master_dictionary.json` filtered for
  "only" to find when/whether a promotion happened and was reverted or
  never landed; if evidence is found, apply it (same pattern as §4 of
  the main summary); if not, this may be a genuinely open relay item.
- **Reference:** `master_dictionary.json`, search key `"only"`.
- **Role:** A first (archaeology), may resolve to Owner/native if no
  historical evidence turns up.

### 7. `i don't know` — soft, low priority
- **Task:** Ships correctly at runtime (`Anga uija`, phrase-map,
  confidence 0.99) and is referenced as part of the "established
  uia-root family" in the NV-087-era narrative, but has no direct
  `master_dictionary.json` VERIFIED/HIGH row under this exact key.
- **Status:** Very likely already correct — this is a citation-hygiene
  gap, not a suspected wrong value.
- **Verified already:** Runtime output confirmed correct this session.
- **Remains to check:** Read the exact NV-087-era text (around
  `docs/THANGSENG_NATIVE_VALIDATION.md`, the "i understand"/uia-root
  discussion) to see if it's citable as direct evidence for this
  specific key; if so, add a VERIFIED/HIGH row citing it (formalization,
  not new evidence).
- **Reference:** `docs/THANGSENG_NATIVE_VALIDATION.md`, NV-087 area
  (uia-root family discussion).
- **Role:** A (citation formalization, not a relay item).

### 8. Remaining genuinely-open relay items (native input required)
- **Task:** No VERIFIED/HIGH candidate exists, corpus-internally
  unresolvable: `don't eat`, `don't go`, `give me water`, `go away`,
  `help me`, `how are you`, `how many`, `how much`, `how much is this`,
  `hurry up`, `i am eating`.
- **Status:** Open. These ship *something* at runtime (via
  `corrections.json`/`phrase_maps.js`, confidence 0.99–1.0 per the
  engine's own internal confidence metric), but that reflects lookup-
  method reliability, not native-speaker confirmation — these are
  exactly the uncited overrides `CLAUDE_B_HANDOFF_20260819` originally
  flagged.
- **Verified already:** Current shipped values captured in this
  session's `/tmp/runtime_results.json` scratch file (not committed —
  regenerate via the `translate()` loop pattern used this session if
  needed).
- **Remains to check:** Nothing further corpus-internally. Once §1–§7
  are resolved, assemble these (plus whatever §1/§6 leave open) into an
  actual new relay batch document and send it — this has not been sent
  yet, only classified.
- **Reference:** `docs/THANGSENG_RELAY_BATCH_20260820.md`, various item
  numbers (Part B).
- **Role:** Owner/native (send via Tridip, get Thangseng's answer).

### 9. Full 149-item runtime-verification sweep (QA follow-up, not urgent)
- **Task:** The ~104 items classified as "already VERIFIED, no action
  needed" were checked for `master_dictionary.json` VERIFIED/HIGH
  presence, and a subset for runtime-output agreement, but not every
  single one was individually re-run through `translate()` as a
  completeness pass this session.
- **Status:** Low-risk (spot-checks found only the 12 gaps already
  fixed), but not exhaustively closed.
- **Verified already:** All items this session actually touched (21
  keys) are runtime-verified. The gap-detection method itself (compare
  master VH value to `translate()` output) was applied across all 149
  items once, surfacing the 12 gaps already fixed — this is really
  asking for a second confirmatory pass, not first-time coverage.
- **Remains to check:** Optional re-run of the same sweep script to
  confirm 0 new gaps after §1–§8's changes land.
- **Reference:** This document's Runtime Handoff section above.
- **Role:** A (or B, if folded into a general repository-intelligence
  check — not currently automated as one).

### 10. Pre-existing deferred backlog (untouched this session, still open)
- **Task A (engineering, Claude B):** pickPrimary verified-ties backlog
  — `hope`, `leg`, `last`, `early`, `answer`, `fever`, `hoe`, `empty`,
  `where`, `horn`, `agree`, `brave`, `greedy`, `demand`,
  `where (relative)`. Claude A's role limited to supplying POS/sense
  defaults when asked.
- **Task B (engineering, Claude B, may need Claude A for the -ma?
  grammar rule itself):** repository-wide space-before-`ma` sweep — the
  wider "verb + space + `ma`?" corpus outside the 2026-08-21 batch
  RULE-046 already closed (`are you eating?`, `is there rice?`,
  `have you eaten breakfast?`, `have you eaten rice?`, `do you love
  me?`, `are you scared?`, `do you have children?`).
- **Status:** Both carried unchanged from the 2026-08-25 close, not
  started this session (relay batch took priority).
- **Reference:** `docs/CLAUDE_A_SESSION_MIGRATION_20260825.md`;
  `docs/PICKPRIMARY_VERIFIED_TIES.md` (or equivalent, check current
  filename via `npm run build` output).
- **Role:** B primarily, A for sense defaults / grammar-rule input.

## Repository status at close

- HEAD: verify via `git rev-parse HEAD` immediately before this migration
  commit is authored — recorded in `.ai/WORKSTATE.yaml` `repository.head`
  as `576e96a` (the commit immediately prior to this migration commit).
- `origin/main` match: verified via `git fetch` + `git rev-parse
  origin/main` immediately before push (see commit sequence below).
- `git status`: clean immediately before this migration commit.
- `.ai/WORKSTATE.yaml`: updated this commit (see diff).
- `docs/CLAUDE_A_SESSION_MIGRATION_20260826.md`: this file, complete.
- No local-only commits: this migration commit is pushed in the same
  step it's created, per standing discipline.
- No uncommitted changes at close.
- Native-validation/blocker status: relay batch genuinely NOT complete —
  see Resume Protocol. No blocker, just unfinished, deliberately paused
  per Project Owner instruction rather than guessing through the
  parenthetical-key question.
