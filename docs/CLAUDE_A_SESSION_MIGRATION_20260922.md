# Claude A Session Migration — 2026-09-22

**Resumed from:** `docs/CLAUDE_A_SESSION_MIGRATION_20260921B.md`, via a
fresh clone of `pzrjv4sfj5-prog/Lean-Garo-` and a PAT pasted live by
the Project Owner in this session (used only in-session, embedded
nowhere, rotated at close per standing rule).

**Role:** Claude A — linguistic authority only. No engine code
(Claude B territory) or OCR ingestion (Claude D territory) touched.

---

## Resync on arrival

That prior migration doc stated HEAD `176bdcf`. Actual `origin/main`
on arrival was 1 commit ahead:
- `ca6e2f3` — Claude B: engineering-only (`src/grammarEngine.js`),
  no `master_dictionary.json` overlap.

Read `.ai/WORKSTATE.yaml` and `.ai/SESSION_BOOTSTRAP.md` per standing
resume protocol. Full gate reconfirmed green before starting new
work: 8827/8827 dictionary, 9/9 grammatical corrections, 458/458 unit
tests, 0 new repository-intelligence violations.

---

## Work this session

### 1. NV-161 — leg/foot, outside POS, fortnight (HEAD `5d30918`)

Project Owner direct relay, 3-item batch:
- **leg/foot**: `ja·a(n)` confirmed as a single dual-sense word for
  both. Un-superseded `leg`->`Ja·a` (was wrongly superseded
  2026-08-01 against an untraceable legacy `variant` tag, same
  suspect class as the already-resolved `week`/`sop·ta` case,
  NV-087). Added new `foot`->`Ja·a`. Existing
  `ja·chok`/`ja·git·teng`/`ja·teng` NOT force-superseded — left as
  coexisting `variant/VERIFIED/HIGH` forms per evidence-first
  discipline, same pattern as `outside`'s `A·pal`/`a'palo`
  coexistence (NV-089).
- **outside**: `A·pal (n)` reconfirmed, POS-only tag added, no
  content change — first entry of an ongoing POS-tagging initiative.
- **fortnight**: new entry `Antigini` (n.), VERIFIED/HIGH. Same
  `anti`+`-gni` root as the existing `two weeks`=`Antigni` (NV-087)
  but a distinct spelling — flagged, NOT merged, pending a
  reconciling question.

**Rule 8 applied:** fixed `phrase_maps.js`'s stale `leg`->`ja·teng`
runtime override directly (was shipping the old untraceable-tag value
over the new native-confirmed `Ja·a`) rather than allowlisting the
mismatch. Allowlisted the genuine `foot` Check C conflict
(`ja·` vs `Ja·a`, both distinct unconfirmed/confirmed candidates) in
`known_dictionary_conflicts.json`.

### 2. NV-162 — "she can cook" (HEAD `a8f54d3`)

Thangseng direct WhatsApp confirmation via Tridip: both
`Ua Song·na ama.` / `Ua Song·na man·a.` correct for "She can cook."
Added as 2 tied `variant/VERIFIED/HIGH` rows. Closes the item queued
in the 2026-09-21B migration doc's Next Recommended Tasks #1 — that
session had composed this exact sentence by rule (RULE-009 `-na` +
RULE-050 `ama`/`man·a`) to demonstrate a modal-drop gap but
deliberately did not file it, since an engine-composed candidate
isn't itself native evidence. It now is. Also the first
native-verified bare-verb infinitive citation for the `song-`
("cook") root; does not supersede the existing occupation-noun forms
(`Song·timgipa`/`song·a`), distinct sense.

Re-checked `early`=`Seng·gnang` / `empty`=`Bangbang` / `lie`(`tol·a`),
also sent in the same message — already closed via NV-156
(2026-09-12), live and correct, no action taken.

### 3. Claude B handoff — exact-phrase trailing-period bug (HEAD `213ef8b`)

Root-caused live while verifying NV-162:
`translate("she can cook")` -> correct exact-phrase match, but
`translate("she can cook.")` (trailing period) falls through to
grammar-assembly and mis-picks the noun sense
(`Ua Song·timgipa`) — confirmed at the source:
`lookupGaro("she can cook")` -> `"Ua Song·na man·a."`,
`lookupGaro("she can cook.")` -> `null`, even though the dictionary
key itself has no trailing period.

Traced to `src/translationEngine.js` line 254 (step 2, exact phrase):
none of the three forms tried strip a trailing `.`; `normalizeInput()`
only expands contractions and trims. Mirrors the existing `?`-only
strip in step 1 (corrections, RC-CANDIDATE-030) but explicitly flagged
as NOT simply copy-pasteable — that fix was deliberately scoped to `?`
only because an earlier `.`/`!` draft broke `"eat!"` by shadowing its
own dedicated exclamatory entry. Written up in
`docs/CLAUDE_B_HANDOFF_20260922_exact_phrase_trailing_period.md` with
the exact repro, root cause, and that scoping caveat — not
fixed/scoped further (engine code, Claude B's call). No `src/` files
touched by Claude A.

### 4. Market-sentence batch check + breakdown (HEAD `5750c6a`)

Project Owner pasted a 4-sentence market batch to check against the
repo:
- `i am at the market` / `go to the market` / `tomorrow is market
  day`: already existed, VERIFIED/HIGH (NV-060, 2026-08-05), matched
  exactly. No action.
- `the market is nearby` = `Bajalde sambaon.` / `Bajalara sambaon.`:
  already existed **but these are the two SUPERSEDED forms** — NV-080
  (2026-08-17) contradicted both in favor of the unsuffixed
  `Bajal sambaon`, the current live VERIFIED/HIGH value. Not
  re-added or re-promoted; flagged back rather than silently
  actioned.

**Breakdown/POS pass** (continuing the initiative from item 1):
- `market`->`Bajal`: added `pos: n.` (no content change).
- new: `nearby`(adj.)->`sambaon`, extracted from NV-080's confirmed
  `Bajal sambaon`.
- new: `market day`(n.)->`bajal sal`, extracted from NV-060's
  confirmed `Knalde bajal sal`.

Not touched: `at`=`·o` (NV-070), `go`=`re·a` (NV-100), `tomorrow`=`Knal`
— all pre-existing VERIFIED/HIGH citations for this batch's component
words, no further gaps found.

---

## Push collision (1, clean, zero overlap)

After committing item 4, a concurrent Claude D session-close commit
(`065c913` — `.ai/WORKSTATE.yaml` + 2 new Claude-D-authored docs, no
`master_dictionary.json`/`compiled_dict.json` overlap) had landed.
Rebased clean, rebuilt (`prepare-data.js`), full gate re-verified
green post-rebase (rebuild produced no diff from the pre-rebase
committed state), pushed. HEAD `5750c6a`.

---

## Runtime Handoff to Claude B

1. **(New, this session)** `docs/CLAUDE_B_HANDOFF_20260922_exact_phrase_trailing_period.md`
   — exact-phrase lookup (`translationEngine.js` line 254) doesn't
   strip a trailing `.` the way step 1's corrections lookup strips a
   trailing `?`. Full repro/root-cause/scoping-caveat in the doc
   itself; see item 3 above.
2. **(Restated)** The general `[Verb-na] ama/man·a` ability-modal
   composition still has no engine implementation for unseeded
   verbs — `translate("she can cook")` (no period) now resolves
   correctly via the new NV-162 exact-phrase row, but that's a
   citation, not a fix to the underlying composition gap (RULE-050).
3. **(Restated)** `sentenceBuilder.js` line ~218's `e?.pos ===
   'verb'` string-mismatch bug (data convention is `'v.'`) — flagged
   2026-09-21B, not yet picked up per Claude D's 2026-09-22 handoff
   doc (which raises a related but distinct RULE-042/`VERB_LEMMAS`
   issue — both queued for Claude B, not confirmed as the same root
   cause).

---

## Next Recommended Tasks

1. **Thangseng relay**: the `us` accusative relay drafts
   (`THANGSENG_RELAY_QUESTION_20260920.md`, `...20260920B.md`,
   `...20260920C.md`) are still unsent — good candidates to bundle
   with any new items from the next native session.
2. **POS backfill, collision-set first**: generate the list of
   English keys with multiple senses across different parts of speech
   (the `cook` shape) as the priority queue. Bulk-backfill of the
   remaining ~7620 untagged rows is a larger, lower-urgency pass. This
   session's POS additions (`market`, `outside`, `nearby`, `market
   day`) were incidental to other work, not a systematic pass.
3. **Remaining ~15 of 19 pickPrimary verified-ties** still unresolved
   with no citation in session history: `agree`, `alone`, `big red
   house`, `brave`, `fever`, `greedy`, `he`, `hoe`, `horn`, `how`,
   `last`, `leaf`, `outside`, `where (relative pronoun)` (per current
   `docs/PICKPRIMARY_VERIFIED_TIES.md` — `leg` resolved this session,
   `able`/`i can eat`/`i can go`/`i can work`/`she can cook` are
   known-intentional tagged variants, not open questions). Needs
   Thangseng relay or Owner directive per item.
4. **"The market is nearby"**: Project Owner may want to double-check
   which spelling/orthography they're pulling the `-de`/`-ara` forms
   from (source doc/notes), since NV-080 already settled on the
   unsuffixed form and this is the second time the superseded pair
   has come up unprompted — not urgent, just worth knowing the source
   so it doesn't resurface again.

---

## Repository status at close

- HEAD: `5750c6a`
- `origin/main`: `5750c6a` — verified match via `git fetch` + `git rev-parse`
- `git status`: clean, no uncommitted changes
- `WORKSTATE.yaml`: updated (`repository.head` -> `5750c6a`,
  `claude_a.next_action` updated, prior renamed
  `next_action_prior_20260921B`) — validated as parseable YAML
  post-edit
- `SESSION_BOOTSTRAP.md`: updated (new dated section appended)
- Migration doc: this file, complete
- No local commits ahead of origin
- No uncommitted changes
- Native-validation status: no blockers; unsent relay drafts noted in
  Next Recommended Tasks #1
- Gate at close: 8831/8831 dictionary, 9/9 grammatical corrections,
  458/458 unit tests, 0 new repository-intelligence violations
