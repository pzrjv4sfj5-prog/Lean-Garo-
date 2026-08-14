# Claude A Session Migration — 2026-08-14

## Repository status at close
- HEAD: `029d8e2`
- `origin/main`: matches exactly
- `git status`: clean, nothing local-only
- `.ai/WORKSTATE.yaml`: updated (this session, claude_a block)
- `.ai/SESSION_BOOTSTRAP.md`: not modified this session (no rule changes)
- This migration document: complete
- Native-validation status: NV-072 through NV-075 closed this session;
  `bol` vehicle-classifier scope still open, not yet re-queried
- Blockers: none technical; `bol` scope awaiting native relay

## Resumed from
`docs/CLAUDE_A_SESSION_MIGRATION_20260813B.md`. Re-synced first: HEAD
matched that doc's checkpoint (`c5b1971`) exactly except one concurrent
Claude B commit (`f336744`, "Check F: fix 12 stale corrections/
phrase_maps entries") which touched unrelated keys (apple, eat, wait,
dance, no, punctuation batch, i-want-to-X, orange, monkey, chameleon,
cooked, where) — no overlap with this session's work, confirmed via
Rule 8 sweep before proceeding.

## Completed work (Claude A, linguistic authority)

1. **Rule 8 sweep** on the prior session's 6-noun fix (teacher/
   mountain/village/road/banana/car): checked `corrections.json` and
   `phrase_maps.js` for independent stale copies — none found. All 120
   entries confirmed live and correct in `compiled_dict.json`. Fix
   fully resolved, not provisional.

2. **NV-072 CLOSED** — "one person" = `mande sak·sa` reconfirmed
   directly by Thangseng (already the compiled VERIFIED value; notes-
   only citation added, no data change).

3. **NV-073 CLOSED** — four items:
   - Student's root: `Chattro sak·N` generated 1–20. **Closes the
     person/student/teacher root conflict entirely.**
   - Person: reconfirmed (no change, see NV-072).
   - Coin: root was incomplete (`tangka` alone) — corrected to
     compound `tangka bisil`; old entries marked SUPERSEDED,
     `tangka bisil gong·N` generated 1–20.
   - House/rice: new classifier `te` added to
     `src/garo_classifier.js` (CLASSIFIER_MAP + RAKA_CLASSIFIERS,
     raka-carrying) — `nok te·N` generated 1–20, replacing fabricated
     `rang`-root entries. Rice (uncooked/grain): `merong rong·N`
     generated 1–20, reusing the already-VERIFIED `rong` classifier.
   - Water and cooked rice/food: recorded as single count=1 citations
     only (`chi glass sa`, `mi plate sa`) pending generalization
     confirmation — see NV-074.
   - Repository hygiene: 32 new dictionary self-consistency conflicts
     (new VERIFIED entries vs. their own pre-existing SUPERSEDED
     counterparts) allowlisted in
     `src/data/known_dictionary_conflicts.json` with citation.

4. **NV-074 CLOSED** — container-word mass-noun pattern (water/food)
   confirmed to generalize across counts ("two glasses of water" =
   `chi glass gni`, "two plates of rice" = `mi plate gni`). `chi
   glass N` / `mi plate N` generated 1–20, no raka. Old count=1-only
   citations superseded by the full series. **Closes the water/food
   portion of the original "10 nouns" mass-noun question.**

5. **NV-075 CLOSED** — two clarifications, notes-only (no data
   changed): (a) no raka dot ever occurs between a container word and
   the number suffix, confirming container words pattern with the
   no-raka classifiers; (b) no native Garo word exists for "glass" or
   "plate" as containers — historically Garo used banana leaves and
   bamboo-stem cups, so the English loanwords are the only available
   terms, not a relay gap. Addendum added to all 40 `chi glass N`/
   `mi plate N` entries.

6. **`bol` clarification logged, not newly resolved**: Project Owner
   restated the already-recorded 2026-08-13 finding (`bol` = tree root,
   also reused as vehicle classifier, not a coincidence). No new
   corpus write — this was already captured verbatim. Scope (does it
   extend to motorcycle/train/airplane) remains open, not re-queried
   this session.

**Verification scope (Rule 7):** every write this session was followed
by `node prepare-data.js` (full compiled-dict regeneration),
`node --test tests/unit/*.test.js` (203/203 throughout, no regressions
at any step), and `node repository-intelligence.js` (0 new violations
at every check, after the one necessary allowlist addition in step 3).
Compiled output spot-checked directly (not just build-success) for
every new key family: student (1, 20), coin (1), house (1), rice-grain
(1), glass/water (1, 2, 20), plate/rice (1, 2, 20), person (1).

**Rule 8 (duplicate-representation) applied to this session's own
work:** not separately re-swept against `corrections.json`/
`phrase_maps.js` for the new NV-073/074/075 entries — flagged as next
session's first check, same discipline as the prior session's own gap.

## Status of the original "10 nouns" question — now fully resolved
house (classifier `te`) · rice-uncooked/grain (classifier `rong`) ·
water (container `glass`) · rice-cooked/food (container `plate`) ·
teacher/mountain/village/road/banana/car (prior session, classifier/
`bol`) — all ten closed. Person/student/teacher root conflict fully
closed.

## Native-validation questions queued (not yet relayed)
1. `bol` vehicle-classifier exact scope — does it extend to
   motorcycle, train, airplane, or stop at car/bike/cycle/ship as
   already stated (2026-08-13)?

## Runtime Handoff (Claude B)
- All NV-072–075 writes confirmed live in `compiled_dict.json`
  (8239 entries, up from 8151 at prior session's close).
- Known gap, not introduced this session: plural-keyed queries
  ("twenty students") for both student and teacher resolve to stale
  SUPERSEDED values under `pickPrimary()`, because VERIFIED fixes were
  only written under the singular key ("twenty student"). Same
  pre-existing pattern flagged for teacher last session. Candidate,
  alongside the Check F "beautiful"/`Sila` case-duplicate gap Claude B
  surfaced in commit `d0a28b5`, for a future singular/plural key-
  normalization pass.
- Rule 8 sweep for this session's own new entries (student/coin/house/
  rice/water/food vs. `corrections.json`/`phrase_maps.js`) not yet
  run — recommended first task next session.

## Next Recommended Tasks
1. Rule 8 sweep on this session's own writes (see above).
2. Relay the `bol` scope question to Thangseng.
3. Consider the plural-key normalization pass (student/teacher/
   `Sila`) as a standalone Claude B task.
