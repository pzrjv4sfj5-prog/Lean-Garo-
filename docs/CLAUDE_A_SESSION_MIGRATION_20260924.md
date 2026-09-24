# Claude A Session Migration — 2026-09-24

**Resumed from:** Project Owner named `docs/CLAUDE_A_SESSION_MIGRATION_20260923.md`
(an early-day doc in the 2026-09-23 chain, via a fresh clone of
`pzrjv4sfj5-prog/Lean-Garo-` and a PAT pasted live by the Project
Owner in this session — used only in-session, embedded nowhere,
rotated at close per standing rule).

**Role:** Claude A — linguistic authority only. No engine code
(Claude B territory) or OCR ingestion (Claude D territory) touched.

---

## Resync on arrival

The named doc claimed close HEAD `2c94c2d`, but that doc was
superseded same-day by two more sessions (`20260923B`, `20260923C`,
already reflected in memory/WORKSTATE) ending at `be4f196`. On top of
that, one more downstream commit had landed:

- `a9adc4b` — Claude B: fix NP-subject + has/have coherence gate
  ("the boy has a dog" wrong word order), `grammarEngine.js` only

No overlap with the linguistic layer. Read `.ai/WORKSTATE.yaml` and
`.ai/SESSION_BOOTSTRAP.md` per standing resume protocol. Full gate
reconfirmed green before starting new work: 8899/8899 dictionary,
9/9 grammatical corrections, 458/458 unit tests, 0 new
repository-intelligence violations.

---

## Work this session

### 1. POS collision-set priority queue (Next Recommended Task #2)

Per `docs/CLAUDE_A_SESSION_MIGRATION_20260923C.md`'s Next Recommended
Task #2: generated the list of English keys with multiple senses
across different parts of speech (the "cook shape"). Grouped
`master_dictionary.json` by lowercased English key; found 4 genuine
noun/verb sense collisions with distinct Garo forms — `demand`
(dabia/dabiani), `hire` (bara ra·a/bara), `hope`
(ka·donga/ka·dongani), `to blaze` (ba·a/baka) — plus 2 lower-priority
adj/adv register pairs, and a longer tail of label-only POS
inconsistency (same Garo value, inconsistent abbreviation) excluded
as noise, not real collisions.

Live-checked all 4 priority keys via `translate()`: all currently
resolve the bare key to the verb sense correctly (demand/hope at
0.98 exact-phrase confidence, hire/blaze at 0.75 — worth a second
look). None currently mis-resolve the way "cook" did. Written up as
`docs/POS_COLLISION_SET_20260924.md` — report only, no dictionary
edit; a priority list for if/when `sentenceBuilder.js`'s dead POS
check (flagged 2026-09-21B, still open, Claude B territory) is
fixed and needs real data to route against.

### 2. pickPrimary verified-ties quick pass — "last" sense split

Reviewed all 20 keys in `docs/PICKPRIMARY_VERIFIED_TIES.md`. 19 are
confirmed genuine tied-variant pairs per the doc's own header ("not a
defect list") — checked notes for each, all either explicitly tagged
`variant/VERIFIED/HIGH` with citation, or (for `hoe`, `he`, `leaf`,
`she can cook`) directly native/Project-Owner-confirmed as genuine
dual-valid pairs. No action on these 19.

`last` was the one real gap. NV-082 (Thangseng relay via Tridip,
2026-08-19) already distinguishes two senses in its own citation
text — `bon·kamgipa` (ordinal/final-in-sequence, e.g. "last page")
vs. `ja·mangipa` (the specific last one/person) — but both were only
ever filed under the single ambiguous headword "last", so
`pickPrimary` correctly reported them as tied. This is a filing gap,
not new linguistic uncertainty, so per evidence-first discipline
(already-VERIFIED rule, no new native input needed) it was closable
this session: added `last (ordinal, e.g. last page)`->`bon·kamgipa`
and `last (the specific one/person)`->`ja·mangipa` as their own
sense-labeled headwords, citing NV-082 in both notes. Bare "last" was
left completely unchanged and still reports as a tie (now against
2 additional uncited candidates, see below) — this was a filing
addition, not a resolution of the bare-key ambiguity itself.

Live-verified: `translate('last (ordinal, e.g. last page)')` ->
`bon·kamgipa`; `translate('last (the specific one/person)')` ->
`ja·mangipa`; `translate('last')` -> `ja·mangipa` (unchanged from
before this session).

While in these rows, also found two more verified_high candidates
under bare "last" — `bai·a` and `ses` — tagged only
`variant/VERIFIED/HIGH` with no citation text at all, unlike the
cited NV-082 pair. Left untouched (no citation to act on, per
evidence-first — do not guess), but flagged in both rows' notes for
a future citation lookup, so the next session doesn't have to
rediscover the anomaly from scratch.

### 3. `animal` -> `Jontu` (Project Owner relay from Thangseng)

Project Owner stated directly in chat: "Animal = Jontu, new word
from Thangseng." No transcript/screenshot provided. Per standing
rule (`.ai/PROJECT_OWNER_AUTHORITY.md`), a Project Owner directive
given directly in chat is authoritative without one, but must be
provenance-labeled as a Project Owner relay, not mislabeled as a
literal Thangseng quote — done so in the note.

Checked first: bare "animal" had no existing entry at all; plural
"animals" had two, both `unverified` (`do·omat`, `mang·`) — so this
is a genuine gap-fill, not a conflict with existing evidence. Added
as a new `verified_high` row. Live-verified:
`translate('animal')` -> `Jontu`.

---

## Push collisions (1, clean, zero overlap)

After committing the "last" split + POS collision-set report, `git
fetch` found Claude B's own docs-only session-close commit
(`15551f3` — `.ai/WORKSTATE.yaml` + `docs/CLAUDE_B_SESSION_MIGRATION_20260923C.md`)
had landed. Rebased clean — no overlap with anything Claude A
touched. Rebuilt, full gate re-verified green post-rebase, pushed.
The `animal`->`Jontu` commit that followed had no further collision.

---

## Runtime Handoff to Claude B

No new items this session. Restated, still open from prior sessions
(not touched here — Claude A does not touch engine code):

1. `sentenceBuilder.js` line ~218: `e?.pos === 'verb'` never matches
   real data (`'v.'`) — flagged 2026-09-21B, still open. The 4-key
   POS collision-set from this session (`docs/POS_COLLISION_SET_20260924.md`)
   is a ready-made regression-check set for whenever this is fixed.
2. The general `[Verb-na] ama/man·a` ability-modal composition still
   has no engine implementation (RULE-050 formalizes the pattern) —
   long-standing gap, restated since 2026-08-31C.

---

## Next Recommended Tasks

1. Unsent Thangseng relay drafts, still pending Project
   Owner/Tridip relay: `docs/THANGSENG_RELAY_QUESTION_20260920.md`,
   `...20260920B.md`, `...20260920C.md`.
2. The `bai·a`/`ses` citation gap under bare "last" — found this
   session, not resolved. Needs a citation lookup (session-history
   grep or Thangseng relay) before any further action on the "last"
   tie.
3. ~14 remaining `pickPrimary` verified-ties (now 19 confirmed
   non-defects after this session's pass, minus "last" now
   partially split) — none urgent, no action needed unless the
   Project Owner or a relay surfaces new evidence.
4. `us`-accusative clusivity distinction remains unconfirmed pending
   the relay drafts above.
5. (Low priority, unchanged) `Janera`/mirror traditional-term
   question, per the Project Owner's `ai·na`-is-a-loanword
   clarification.
6. (New, low priority) The 4-key POS collision-set
   (`docs/POS_COLLISION_SET_20260924.md`) is ready as a regression
   set once Claude B fixes the `sentenceBuilder.js` POS-check bug
   (Runtime Handoff item 1 above) — worth a live re-check at that
   point, not before.

---

## Repository status at close

- HEAD: `46aa62f` (last content commit; WORKSTATE.yaml/this doc
  being committed next will move HEAD one commit past this)
- `origin/main`: matched `46aa62f` via `git fetch` + `git log -1`
  immediately before this close-out commit
- `git status`: clean prior to this close-out commit, no
  uncommitted changes outside the WORKSTATE.yaml/SESSION_BOOTSTRAP.md/
  this-doc edit
- `WORKSTATE.yaml`: updated (`repository.head` -> `46aa62f`,
  `claude_a.next_action` updated, prior renamed
  `next_action_prior_20260923C`) — validated as parseable YAML
  post-edit
- `SESSION_BOOTSTRAP.md`: updated (new dated section appended)
- Migration doc: this file, complete
- No local commits ahead of origin at the time of this writing
  (verify again after the close-out commit + push)
- No uncommitted changes outside this close-out commit
- Native-validation status: no new relay-candidate items queued
  this session; the `bai·a`/`ses` citation gap (Next Recommended
  Task #2 above) is the only new open thread; no blockers
- Gate at close: 8902/8902 dictionary, 9/9 grammatical corrections,
  458/458 unit tests, 0 new repository-intelligence violations,
  zero-runtime-error sweep clean (15866/15866 `translate()` calls)
