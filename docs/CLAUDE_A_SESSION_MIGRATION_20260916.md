# Claude A Session Migration — 2026-09-16

Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260913.md`.

## Resync on arrival

Cloned fresh, `git fetch` + HEAD verification: origin/main was at
`6359fed`, three commits ahead of the 20260913 close (`86d83ad`) —
Claude A's own migration-doc commit, a page-0095 review manifest, and
Claude B's `RAKA_CLASSIFIERS` `mang` fix (this session's handoff #1,
closed). Spot-checked `master_dictionary.json` directly (not just the
commit message) — item #3 from the 2026-09-13 close (mang· de-dotting)
was intact, no drift. Handoff #2 (object-final `?` bug,
`grammarEngine.js:584`) was confirmed still open, live-reproduced on
`did you eat rice?`/`curry?`/`water?` before starting new work.

## Work this session

1. **Three new interrogative sentences**, all VERIFIED/HIGH:
   - `did you drink medicine?` / `did you take medicine?` →
     `Na·a sam ringahama?` (both English phrasings map to the same
     Garo sentence — Garo has no separate "take medicine" verb,
     medicine is always drunk)
   - `which medicine did you take?` → `Badia samko ringa na·ara?`
   - All composed from already-verified components; added as
     `corrections.json` short-circuits since they're object-final
     interrogatives that would otherwise hit the then-still-open
     handoff #2 bug.

2. **"who called?" two-sense split**, Thangseng direct citation:
   - `who called? (phone call)` → `Sawa ka·ata?`
   - `who called? (summoned to a place)` → `Sawa okamata?`
   - Different verb stems (`ka·a`/`ka·at-` vs `okam-`), disambiguated
     by English key per the project's existing convention for
     polysemous words.

3. **Handoff #2 confirmed fixed** — Claude B landed
   `grammarEngine.js:584`'s trailing-punctuation strip mid-session
   (commit `40a2266`). Live-reverified `did you eat rice?` →
   `Na·a mi·ko Cha·aha ma?`, confirms `-hama` is the Owner-cited
   correct suffix, not `-gama` — this closed the open item from the
   2026-09-13 doc without needing a Thangseng question.

4. **Wh-question suffix survey.** Prompted by item 2's `-ata` forms:
   pulled all 184 question-mark sentences in `master_dictionary.json`
   and grouped by verb-ending. Found **7 distinct patterns** at
   verified_high with no evidence yet on what governs the choice
   (bare `-a`, `-aha`, fused `-ata`, a separate trailing word
   `na·ara`, `-enga`, `-inga`, `-achim`/`-ama`). Caught and corrected
   my own error mid-session: I'd initially written up `-ata` and
   `na·ara` as "the same suffix" — they're not (one fuses onto the
   verb, one is a separate word). Drafted, **not yet sent**:
   `docs/THANGSENG_RELAY_QUESTION_20260916.md` — same-verb minimal
   pairs across all 6 wh-words, plus the `-ata`/`na·ara` question
   directly. A planned third part (`-hama` vs `-gama`) was dropped
   before sending once item 3 above resolved it independently.

5. **"only" / "go" / tang-dong family — git archaeology, no data
   change needed.** Owner gave direct citations for all three,
   framed as open items. Checked first rather than writing blind:
   all three were already fully resolved in the repo since
   2026-08-28/30, matching the Owner's citations exactly
   (`only`=`mangmang`; `donga`/`dongenga`=locative "living at a
   place", `tanga`/`tangenggipa`=vital "being alive"; `go` paradigm
   `re·a`/`re·angenga`/`re·anggen`/`re·jawa`). Reported this back
   instead of re-adding duplicate data. One real mismatch surfaced:
   Owner's `will not go`=`re·angjawa` conflicted with the existing
   citation pairing (`will not go`=`re·jawa`, `will not be
   going`=`re·angjawa`, distinguished by a 2026-08-30 Thangseng
   citation) — flagged, and Owner confirmed the existing pairing was
   already correct. No data change; closed.

   Also fixed a genuine citation-hygiene defect found via archaeology
   (not just staleness): the `Kam·kam`="only" superseded row's note
   claimed four other forms were VERIFIED/HIGH precedent for
   superseding it — those four have never been verified_high in any
   commit that touched them, the note's premise was wrong from the
   start. Corrected the note text only; Kam·kam stays superseded
   (mangmang is independently verified, no evidence ever offered for
   Kam·kam specifically).

6. **Mango canonical-spelling reversal**, Project Owner directive:
   `Te·gachu` is right, not `te·ga·chu`. This **reverses** a
   2026-09-08 `PROJECT_OWNER_DIRECTIVE_PROTOCOL.json` decision that
   had made `te·ga·chu` canonical — per that same protocol's own
   rule, a current PO directive is not vetoed by older verified_high
   evidence but must be documented, not silently erased. Both
   directives are kept on file in the notes of all 4 affected
   `master_dictionary.json` rows (2 promoted superseded→verified_high,
   2 demoted verified_high→superseded). Also fixed a corrupted
   `te˙·ga·chu` variant in `final_entries.json` (archival only, not
   read by `prepare-data.js`).

   **Live bug found and fixed along the way:** promoting a row by
   setting `confidence: verified_high` alone wasn't enough — its
   `notes` field's first word was still literally "SUPERSEDED", and
   `prepare-data.js`'s `notesDeclareSuperseded` regex
   (`/^superseded\b/i`, a deliberate 2026-08-30 metadata-sync-gap
   fix) reads that independently of the `confidence` field by design.
   This silently dropped `mango` out of `pickPrimary`'s candidate
   pool entirely — `translate('mango')` fell through to a fuzzy match
   against the unrelated `mang` classifier morpheme, `translate('the
   mango')` returned `[UNKNOWN]`. Fixed by rewriting both promoted
   rows' notes to start with "VERIFIED/HIGH" per convention, moving
   the supersession history into the note body. Updated the one
   resulting stale unit test
   (`bug5_counting_phrase_es_plurals.test.js` hardcoded the old
   spelling in `seven mangoes` → `te·ga·chu rongsni`).

## Runtime Handoff (Rule 6 — mandatory every migration doc)

None new. Handoff #2 (object-final punctuation) was fixed by Claude B
mid-session, see item 3 above — not this session's fix, but confirmed
live and built on top of.

## Repository status at close

- HEAD: `4ed4e0c`, verified `== origin/main`
- `git status`: clean, no uncommitted changes
- Two push-collision rebases this session, both clean (no textual
  conflicts in `master_dictionary.json`; `src/compiled_dict.json`
  conflicts both times, resolved by regenerating post-merge and
  re-running the full gate before pushing)
- `WORKSTATE.yaml`: updated (this session's entry appended)
- `SESSION_BOOTSTRAP.md`: updated (this session's entry prepended,
  per the file's most-recent-at-top convention)
- Migration doc: this file, complete
- No local commits ahead of origin, no uncommitted changes
- Native-validation/blocker status: 1 relay batch drafted, not sent
  (`docs/THANGSENG_RELAY_QUESTION_20260916.md`, wh-question suffix
  survey); no other blockers

**Final gate:** 8552/8552 dictionary entries, 9/9 grammatical
corrections, 0 new repository-intelligence violations, 407/407 unit
tests, `runtime-error-sweep.mjs` 0 errors across 15,262 `translate()`
calls.

## Exact next actions

1. Send `docs/THANGSENG_RELAY_QUESTION_20260916.md` (Project
   Owner/Tridip) — wh-question suffix survey, 2 parts.
2. Once that reply comes back: reconcile the 7-pattern wh-question
   survey against it, per whatever it actually resolves — do not
   generalize beyond what's explicitly answered.
3. Still open from prior sessions, untouched this session: the
   two-teacher-parity / vegetable / kg-rice items another session
   closed concurrently (see `bce1472`, not this session's work,
   no conflict); Claude D's 44-key unexamined interrogative-form
   family in `SUPERSEDED_ONLY_KEYS.md` (flagged by Claude D
   2026-09-16, not investigated by this session either).
