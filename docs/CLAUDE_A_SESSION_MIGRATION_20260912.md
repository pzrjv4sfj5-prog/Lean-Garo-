# Claude A Session Migration — 2026-09-12

Resumed as Claude A from `docs/CLAUDE_A_SESSION_MIGRATION_20260911B.md`.
On this project Claude acts as Claude A — linguistic authority only;
never touches engine code (Claude B) or OCR ingestion (Claude D).

## Repository status at close

- HEAD: `2733e26fc713360fb2109722ca73211fd4a8e94d`
- origin/main: matches exactly (verified via `git fetch` + `git rev-parse`)
- `git status`: clean, no uncommitted changes, no untracked files
- WORKSTATE.yaml: updated this session (see below)
- SESSION_BOOTSTRAP.md: NOT updated this session — no new *standing rule*
  was established (all changes were corrections/fixes to existing rules,
  not new ones); next session should double check this call
- Gate at close: 395/395 unit tests, 0 new repository-intelligence
  violations
- Native-validation status: NV-156 and NV-157 both closed this session;
  11-item Thangseng relay batch sent, unanswered except item 12

## What's done this session (in order)

1. **Resync** — clean, HEAD matched the 20260911B doc's final commit,
   no drift.
2. **Resolved 3 standing "Owner decisions still open" items** from
   20260911B: `ge`/`te` in `RAKA_CLASSIFIERS` confirmed genuine (18-row
   pen paradigm, 10-row house paradigm) — documented in RULE-038.yaml.
   Space-before-number for bol/dot/dam/roa/rong — see item 6 below,
   this was **later found wrong and corrected**. `sak` 40+ generalization
   past 60 — left open pending relay (later confirmed, see NV-157).
3. **NV-156** — Thangseng answered part of a pending relay batch over
   WhatsApp (egg/early/empty/lie). All four were live runtime bugs
   (uncited `variant/VERIFIED/HIGH` imports outranking the correct,
   wrongly-SUPERSEDED native word) — fixed all four in
   `master_dictionary.json`, fixed one stale `phrase_maps.js` value
   (`empty`). Corroborated independently by pre-existing
   `final_entries.json` records. Owner then directed literal deletion
   (not supersede) of 3 specific losing rows
   (`bo·a ra·a`/`Bo·a`/`jak·ra·ra`) — done, plus cleanup of an orphaned
   `pending_lexicon.json` entry and an unneeded
   `known_dictionary_conflicts.json` allowlist entry.
4. **Drafted `docs/THANGSENG_RELAY_QUESTION_20260912.md`** — trimmed the
   4 answered items from the 20260911 batch, added 4 new items found
   via re-checking `PICKPRIMARY_VERIFIED_TIES.md`/`SUPERSEDED_ONLY_KEYS.md`
   against session history (hoe, alone, bake/roast, sak 70+/80+/90+
   generalization). Sent to Owner/Tridip for relay to Thangseng.
5. **NV-157** — Thangseng confirmed item 12 (sak 40+ generalizes past
   60, e.g. 71 = `Chattro saksotsni sa`). Added worked examples to the
   classifier-engine contract, closed the item in the Claude B handoff
   doc and RULE-038.yaml.
6. **Self-caught and corrected a real mistake**: earlier same-day I'd
   told Claude B that bol/dot/dam/roa/rong should use plain-space
   composition, citing the classifier-engine contract's stated policy —
   without checking that policy's examples against actual
   `master_dictionary.json` citations. They contradicted it: mountain/
   village/road/car are all directly Thangseng-cited as **fused, no
   space** (2026-08-13 relay). Corrected the contract file, the Claude B
   handoff doc, and RULE-038.yaml to match the real evidence. Left
   water/beer's `rong` spacing as genuinely unconfirmed.
7. **Expanded/corrected the Claude B handoff doc further**: found via
   live testing that the handoff's Bug 1 had also wrongly claimed `sak`
   needs a raka dot — traced to a misread prose-comment ("man·de
   sak·sa" in an NV-072 note, a `grammarEngine.js:643` comment) rather
   than the actual stored (no-dot) values, which match NV-124's
   standing correction. Retracted that claim. Re-verified all 5 bugs
   live: Bug 1 (`king`), Bug 4 (hundred/thousand parsing, fixed by a
   concurrent Claude B commit), and Bug 5 (unseeded nouns) are now
   fully resolved; Bugs 2 (generalize the sak-specific tens-composition
   fix to other classifiers) and 3 (exact-hundred composition) remain
   open.
8. **Found and fixed a live regression**: Claude D's Batch 6 deletion
   (commit `61a4e1a`) had removed `master_dictionary.json` SUPERSEDED
   rows that were suppressing garbled untagged `garo_dictionary.json`
   duplicates. Three keys (`two cars`, `twenty students`, `six dogs`)
   had started shipping the wrong value. Re-added the 3 suppressor rows.
9. **Flagged a broader pattern** in `WORKSTATE.yaml`
   (`claude_d.pending_handoff_from_claude_a_20260912`): 5 more clusters
   with the identical defect shape exist (teacher/person/car/house/
   rice/food/river/water) — not currently broken, but will break the
   same way if a future deletion batch doesn't cross-check
   `garo_dictionary.json` first. No dictionary edit made for these 5;
   informational only.
10. Rebased cleanly through 6 separate push collisions this session
    (Claude D WORKSTATE/doc commits ×3, Claude B `king` classifier fix,
    Claude B test-oracle/YAML session, Claude B `chu`/beer spacing fix).
    No conflicts in any of them; rebuilt and re-verified gate after each.

## Held / not done — and why

- **11 items from `docs/THANGSENG_RELAY_QUESTION_20260912.md` await
  Thangseng**: agree, brave, greedy, horn, last, leg, outside,
  fever/suffer, hoe, alone, bake/roast. Not corpus-resolvable — genuine
  disambiguation/confirmation questions, no shortcut.
- **`rong` for water (`Chi rong sa`)** — Owner said "maybe water" when
  Claude B asked if the chu/beer spacing exception generalizes; not a
  confirmation, left fused/unconfirmed. Flagged in the contract for a
  firmer answer later.
- **The 5 latent clusters** (see item 9 above) — deliberately not
  touched. They aren't broken; editing master_dictionary.json for them
  now would be pre-emptive noise. Leave for whoever next deletes a
  suppressor in that noun family to check first.
- **Bugs 2 and 3** (Claude B handoff doc) — engine code, not my role.
  Handoff doc is current and accurate as of this session's close.

## Standing rules — none newly established this session

All of this session's corrections were fixes to *previously wrong*
statements (my own space-rule and sak-dot mistakes) or application of
*existing* standing rules (NV-124, the retain-superseded-not-delete
norm and its explicit Owner-directive exception, citation discipline).
No new standing rule was created — SESSION_BOOTSTRAP.md intentionally
left unchanged. If a future session judges any of the corrections above
rise to the level of a new standing rule, add it then.

## Runtime Handoff (mandatory section, Rule 6)

- To Claude B: `docs/CLAUDE_B_HANDOFF_20260911_number_classifier_runtime.md`
  is current and accurate as of this session — Bugs 2 and 3 open, 1/4/5
  resolved. No new handoff items beyond what's already in that doc.
- To Claude D: `WORKSTATE.yaml`'s
  `claude_d.pending_handoff_from_claude_a_20260912` entry — informational
  flag about the 5 latent clusters, no action required unless a future
  deletion touches that noun family.
- To Project Owner/Tridip: `docs/THANGSENG_RELAY_QUESTION_20260912.md`
  needs relaying to Thangseng (11 items still unanswered).

## Exact next step

No task is currently in progress. Next session should either:
(a) wait for Thangseng's answers to the 20260912 relay batch and
process them as native validation entries (same pattern as NV-156/157),
or (b) take on a new task as directed by the Project Owner. Resume
sequence: `git fetch` + HEAD-vs-origin/main check, read this doc, check
whether Thangseng has answered anything new before doing anything else.
