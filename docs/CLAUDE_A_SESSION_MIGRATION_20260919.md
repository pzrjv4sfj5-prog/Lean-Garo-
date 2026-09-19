# Claude A Session Migration — 2026-09-19

Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260918D.md`.

## Resync at start
HEAD `fed025e` == origin/main, clean tree. This was exactly the prior
doc's claimed `fc32cc0` plus the doc-add commit itself — no real drift.

## Task 1: promote staged OCR batch (PL-0002015..PL-0002206, 192 entries)
Reviewed and promoted all 192 pages-13/20/21/108 entries staged last
session. 172 clean, approved as ordinary unverified vocabulary. 20
entries (10 within-batch-conflict pairs, e.g. "hire"=Bara/Bara ra·a,
"younger brother"=Jong/Jongsipa) approved as coexisting unverified
variants — the source itself gives two forms for one gloss, no
evidence to force a pick. Allowlisted the 10 resulting Check C
conflicts. One real finding: adding a cited "fertile" (soil) entry
surfaced a pre-existing, zero-provenance corrections.json override
(`a'be·en`) already shipping at runtime instead — left both, allowlisted
the Check F mismatch, not resolved either direction. Pushed clean,
HEAD `f9a2b5c`.

## Task 2: Claude D's P24/P25 OCR handoff (84 entries)
Imported `docs/CLAUDE_D_20260918_p24_p25_ready_for_a.json` via
`scripts/import-dictionary.js` (staged PL-0002207..PL-0002290).
Reviewed all 84: 67 clean approved; 11 approved as coexisting
unverified variants; **4 renamed to sense-tagged keys** before
promotion to stop them silently shadowing already-VERIFIED,
native-confirmed entries — `skin (verb)`, `smell (verb, perceive)`,
`flower (verb)`, `cane (verb)` (two of these, skin/smell, were
homograph collisions Claude D's own normalization pass hadn't caught);
**1 rejected**: "place"→"Biap" was a raka-less duplicate of the
already-existing "place"→"bi·ap", not a new word. Promoted 83.
Allowlisted the 10 resulting Check C conflicts. New finding, not
fixed (pre-existing, predates this session): `corrections.json` ships
`skin`→`bigi` and `smell`→`biba`, both look truncated/corrupted,
already shadowing the VERIFIED entries at runtime — flagged for a
future session. Pushed clean, HEAD `28b990e`.

## Task 3: close all 4 P24/P25 held items (Project Owner relay)
Project Owner relayed direct native confirmation closing the 4 items
Claude D held (not staged, handoff-only): "Bia and Ua are synonyms,
confirmed hence no confusion, we can use either" / "bi.a is to pray" /
"Skin → bi·gil, close all these".

- **he**: added `he`→`Bia` as a second VERIFIED/HIGH row alongside the
  existing `he / she`→`Ua`. Kept `Ua` as the shipped primary
  (phrase_maps.js) to avoid a runtime-behavior flip from a same-tier
  synonym addition — allowlisted the resulting Check C tie and Check F
  divergence as intentional.
- **bark**: added `bark`→`bi·gil` as VERIFIED/HIGH, confirming the
  shared "outer covering" root with the already-VERIFIED `Skin`→`bi·gil`
  (NV-080). Note: the handoff's own reason field mislabeled its
  comparison target as `skin`→`bi·kil·ap`; that master row is actually
  keyed `bark`, not `skin`. Coexists with the pre-existing unverified
  `bark`→`bi·kil·ap`, not merged/deleted.
- **to pray**: promoted the pre-existing unverified `to pray`→`Bi·a` to
  VERIFIED/HIGH. Flagged, not resolved: coexists with the separately-
  VERIFIED `pray`→`Bi·bo` (NV-095) as an open register/synonym question.
- **a flower / curry**: resolved as non-issues, no master_dictionary.json
  change needed. Claude D's comparison targets were stale/mismatched —
  `flower`→`Bal` was already REJECTED 2026-08-06 (real value is the
  already-VERIFIED `Bibal`), and `curry`→`bi·jak` is already
  independently VERIFIED/HIGH (NV-089), unrelated to the `leaf`→`bi·jak`
  entry it was compared against. Both new candidates simply reconfirm
  existing VERIFIED values.

Documented resolution for all 4 items directly in the Claude D handoff
JSON (`held[].resolved_status` / `.resolution`) for traceability.

## Push-collision handling
Both Task 2 and Task 3 hit concurrent-commit rebases:
- Task 2 push: no collision (fast-forward).
- Task 3 rebase: landed on top of Claude D's own P24/P25 fix-up plus
  Claude B's `353b0bd` (restored the `to ` prefix on 27 verbs Task 2
  promoted bare — including the 4 Task-2 sense-tagged keys, now
  `to cane (verb)` / `to flower (verb)` / `to skin (verb)` /
  `to smell (verb, perceive)`; VERB_LEMMAS needs the literal `to `
  prefix, invisible to it otherwise). `master_dictionary.json` and
  `pending_lexicon.json` auto-merged cleanly (Claude B's mid-array
  edits, my end-of-array appends). Generated artifacts (compiled_dict,
  compiled_dict_alternates, unverified_words, PICKPRIMARY doc)
  conflicted as always — took upstream, rebuilt fresh, full gate
  re-verified clean post-rebase before pushing. Pushed clean, HEAD
  `1c7504f`.

## Runtime Handoff to Claude B
None this session.

## Gate status (final, post-rebase, before this doc's own commit)
8813/8813 dictionary entries, 9/9 grammatical corrections, 441/441 unit
tests, 0 new repository-intelligence violations (all 8 checks), 0
resync-stale-overrides candidates. Live-verified he/to pray/bark/forbid/
to forbid/skin (verb)/to skin (verb) via translate() post-build.

## Still open, unchanged
- Dedup-deviation flag from the P24/P25 handoff's own dedup step (94
  rows excluded stricter-than-precedent elsewhere in the corpus,
  separate from this session's work) — not started.
- Thangseng relay (`docs/THANGSENG_RELAY_QUESTION_20260916.md`) — no
  reply yet.
- Claude B territory: 44-key interrogative family, trailing-punctuation
  lookup bug.
- Claude B territory (schema): `derived` confidence tag missing.
- New this session, Claude A/B territory, not investigated:
  `corrections.json`'s corrupted `skin`/`smell` overrides (found in
  Task 2, predates this session).

## Repository status at close
- HEAD: `1c7504f` (this doc's commit will follow at session end)
- origin/main match: verified after each push this session
- `git status`: clean (before this doc's own commit)
- WORKSTATE.yaml: updated this session (see below)
- SESSION_BOOTSTRAP.md: no rule changes this session, left as-is
- Migration doc: this file
- No local commits outstanding, no uncommitted changes at each push
- Native-validation/blocker status: none blocking; 4 held items closed,
  1 relay batch still awaiting reply (unchanged from prior session)
