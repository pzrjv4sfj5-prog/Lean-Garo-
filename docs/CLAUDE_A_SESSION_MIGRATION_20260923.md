# Claude A Session Migration — 2026-09-23

**Resumed from:** `docs/CLAUDE_A_SESSION_MIGRATION_20260922B.md`, via a
fresh clone of `pzrjv4sfj5-prog/Lean-Garo-` and a PAT pasted live by
the Project Owner in this session (used only in-session, embedded
nowhere).

**Role:** Claude A — linguistic authority only. No engine code
(Claude B territory) or OCR ingestion (Claude D territory) touched.

---

## Resync on arrival

That prior migration doc claimed final HEAD `c6de365`. Actual
`origin/main` on arrival was 3 commits ahead — all pure session-close
documentation, no code/data drift:
- `1f23a34` — Claude A's own prior-session post-close resync note
  (WORKSTATE.yaml + migration doc text only).
- `f6e0fc2` — Claude B: session close 20260923 (WORKSTATE.yaml +
  migration doc only; that session's actual code/data work —
  NP-subject coherence fix, trailing-period lookup fallback, NV-164
  3-way synonym resolution — had already landed at `c6de365` itself,
  before this migration doc's stated checkpoint).
- `4f86f81` — Claude D: session close 2026-09-22B (WORKSTATE.yaml +
  migration doc only; that session's actual OCR work, page-96
  ingestion, had already landed at `95afb61`, already accounted for
  in the prior Claude A migration doc).

Read `.ai/WORKSTATE.yaml` per standing resume protocol. Full gate
reconfirmed green before starting new work: 8874/8874 dictionary,
458/458 unit tests, 9/9 grammatical corrections, 0 new
repository-intelligence violations.

---

## Work this session

### Worked-example splitting — page-96 `Jak..` prefix entries (Next Recommended Task #1)

Deferred from the prior session's page-96 OCR promotion. Two `Jak..`
prefix entries in `master_dictionary.json` (idx 9949: leaves/pages
sense; idx 9950: hand-noun sense) each carry a batch of worked
examples from the print-dictionary source that were staged but never
split into standalone headword rows.

**Leaves/pages prefix (idx 9949)** — all 3 examples split, none
pre-existing in the dictionary (checked first):
- "a leaf of plantain tree" → `E·sal kingsa`
- "one page of a book" → `Ki·tapni jaksa`
- "one betel-leaf" → `Pan jaksa`

**Hand-noun prefix (idx 9950)** — 7 examples reviewed individually
against existing dictionary content before deciding what to add:
- 2 were exact-value duplicates of already-existing entries, **not**
  re-added: `jaksi`="finger" (already `jak·si`, idx 4172); `jakpa`
  (n.)="palm" (already `jak·pa`, idx 4967).
- 5 split into new standalone rows:
  - "sleeping of the hand" → `Jakchimita` (no prior entry)
  - "to slip from the hand" → `Jaktuata` (no prior entry)
  - "liberal, generous" → `Jaksrama` — added as a coexisting
    unverified variant, **not** merged with or preferred over the
    existing VERIFIED/HIGH "generous"=`al·nama` (idx 2755); live-
    verified `generous` still resolves to `al·nama` unchanged.
  - "arm" → `Jakpong` — added as a coexisting unverified variant of
    the existing bare "arm"=`jak` (idx 3295, unverified); relationship
    between the two forms unconfirmed, not merged either direction.
  - "pulse" → `Jatmatchi` — added as a coexisting unverified variant.
    Flagged, not merged: the source spelling ("jatmatchi") plausibly
    relates to the existing `jak·mit·chi` (idx 5171, unverified
    variant) by an orthographic shift (jak→jat, mit→mat), but the
    divergence is more than raka placement, so per evidence-first/
    never-guess norm this was kept as a separate candidate rather
    than assumed to be the same word.

Updated both source prefix entries' (idx 9949, 9950) `notes` fields
to record exactly what was and wasn't split, and why, so this
deferred-task marker doesn't get re-triggered by a future audit.

**Rule 8 note:** no `phrase_maps.js`/`corrections.json` runtime
overrides implicated — none of the 8 new headwords or their English
keys collide with anything in those files (all are net-new
vocabulary).

### "The market is nearby" orthography question — already closed

Checked before doing anything further: Claude B's `c6de365` (already
on `origin/main` before this session started) resolved NV-164 as a
genuine 3-way synonym set per Project Owner engineering-call
instruction. Nothing left for Claude A here — removed from this
session's open-item list.

---

## Gate / allowlisting

Post-add rebuild (`prepare-data.js`) produced one new Check C
(dictionary self-consistency) violation: `"arm"` — `jak`/`Jakpong`,
the expected within-session variant pair (see above). Allowlisted in
`src/data/known_dictionary_conflicts.json` with this migration doc as
citation. Re-ran full gate clean after allowlisting.

Gate at close: dictionary 8874 → **8881** entries (+7 unique keys,
confirmed by direct compiled_dict.json key diff: the 6 genuinely-new
English glosses — leaf of plantain tree, page of a book, betel-leaf,
sleeping of the hand, liberal/generous, to slip from the hand — plus
1 auto-generated bare-infinitive alias, "slip from the hand". `arm`
and `pulse` added new *values* under already-existing keys, so
contributed 0 new unique keys, as expected), 9/9 grammatical
corrections, 458/458 unit tests, 0 new repository-intelligence
violations.

All 8 new keys, plus `generous`/`finger`/`palm` (to confirm no
unintended runtime shift), live-verified via `translate()` post-build.

---

## Runtime Handoff to Claude B

None this session — no engine code touched, no new runtime bug found
or implicated by this batch.

---

## Next Recommended Tasks

1. Unsent Thangseng relay drafts, still pending Project Owner/Tridip
   relay (not actionable further by Claude A without native input):
   `docs/THANGSENG_RELAY_QUESTION_20260920.md` (Claude B's
   him/us/it/them-all draft), `docs/THANGSENG_RELAY_QUESTION_20260920B.md`,
   `docs/THANGSENG_RELAY_QUESTION_20260920C.md` (Claude A's `us`
   accusative-clusivity + Ritchasa-gni + what-did-you-eat draft).
2. POS collision-set backfill (flagged 2026-09-21B, not started).
3. ~15 remaining `pickPrimary` verified-ties with no session-history
   evidence — see `docs/PICKPRIMARY_VERIFIED_TIES.md` for the current
   list (20 total; `he`/`the market is nearby` are the only two with
   recent movement, both already resolved/tracked). None are urgent —
   every listed key already ships a genuinely VERIFIED/HIGH value,
   this is a disambiguation-quality backlog, not a defect.
4. (Carried from `20260922B`, still open) `us`-accusative clusivity
   distinction itself remains unconfirmed pending the relay above.

---

## Repository status at close

- HEAD: `2c94c2d`
- `origin/main`: verified match via `git fetch` + `git rev-parse`
  (clean fast-forward push, no collision)
- `git status`: clean, no uncommitted changes
- `WORKSTATE.yaml`: to be updated in this same close (see next
  commit)
- `SESSION_BOOTSTRAP.md`: unchanged (no new standing rule this
  session)
- Migration doc: this file, complete
- No local commits ahead of origin
- No uncommitted changes
- Native-validation status: no blockers; 3 unsent relay drafts noted
  in Next Recommended Tasks #1
- Gate re-verified clean at this final HEAD: 8881/8881 dictionary,
  458/458 unit tests, 9/9 grammatical corrections, 0 new
  repository-intelligence violations
