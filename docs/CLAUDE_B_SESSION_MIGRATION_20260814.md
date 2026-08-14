# Claude B Session Migration — 2026-08-14

## Project identity
Repo: `pzrjv4sfj5-prog/Lean-Garo-` (English↔Garo dictionary/translation
app). Claude B's remit: **Check F** — runtime-cascade agreement between
`corrections.json`/`phrase_maps.js` (engineering files, Claude B's to
edit) vs `compiled_dict.json` (derived from `master_dictionary.json`,
Claude A's file — linguistic content, flag don't edit). Ledger:
`docs/CHECK_F_GAP_REPORT_20260813.md`. Gap dataset regenerated via
`node scripts/analyze-check-f-gaps.mjs`, cross-checked against the
ledger's resolved-keys list (markdown table isn't cleanly greppable —
build the resolved set manually from ledger content, don't trust a
regex).

## Current state
- **HEAD:** `c82e62a` on `main`, pushed, tree clean.
- **Build gate:** 203/203 tests, 0 lint errors, Check F allowlist at
  **292** known mismatches / 264 unique keys, 0 new violations.
- Full gate command sequence: `npm test`, `npx eslint .`,
  `node repository-intelligence.js` — all three, every engineering-file
  edit, before AND after any rebase.

## What's done vs. held, and why

**Closed this session (4 keys progressed, ledger has full detail on each):**
1. `a dog bit me` — not a bug (Check F/engineering scope). `corrections.json`
   wins at runtime regardless of key length (confirmed in
   `src/lookupEngine.js`); its native-verified value is inert-safe against
   `compiled_dict`'s divergent untagged legacy value. **However:** which
   Garo form is linguistically *correct* is now a live 3-way question — see
   Open Issues below. Check F closure stands; linguistic question doesn't.
2. `always` — **REOPENED, do not re-close mechanically.** Fixed then
   reverted this session — see Open Issues, this is the important one.
3. `angry` — not a bug, two independently-VERIFIED synonyms, both correct,
   `corrections.json` wins and is regression-tested
   (`translationEngine.test.js:569`). Separately, raka-placement question
   flagged (see Open Issues) — doesn't affect this closure.
4. `answer` — **left untouched, do not apply the "always"-style fix.**
   Same SUPERSEDED/VERIFIED tag pattern as `always` was queued to get the
   same treatment; held back once the native contradiction on `always`
   surfaced. See Open Issues.

**Held back / explicitly not done:**
- Did NOT apply a mirror fix to `answer` even though it matches the
  `always` pattern exactly (`corrections.json`+`phrase_maps.js` both have
  `Aganchaka`, tagged SUPERSEDED; `compiled_dict` has `Aganchakani`, tagged
  VERIFIED/HIGH but with a bare "variant/VERIFIED/HIGH" note, no NV-number).
  Native input said `answer = Aganchaka` — the "superseded" value. Don't
  trust the SUPERSEDED/VERIFIED tags on either `always` or `answer` without
  Claude A re-confirming; treat as unreliable pending resolution.
- Did NOT edit `master_dictionary.json` for the `angry` raka question or
  any of the `always`/`answer`/`a dog bit me` conflicts — all linguistic
  content, Claude A's file, flagged not fixed.
- Did NOT attempt a broader sweep of other keys the 2026-08-01
  corpus-internal SUPERSEDED audit touched, even though `always` and
  `answer` both being wrong suggests the audit's methodology may have
  systemic issues. Out of Check F engineering scope; flagged for
  awareness only.

## Open issues (root cause where known)

**1. `always`/`answer` SUPERSEDED-tag reliability — the big one.**
Root cause: the 2026-08-01 corpus-internal audit (Claude A) tagged both
`always`'s and `answer`'s common/lowercase forms `SUPERSEDED` in favor of
capitalized-dup VERIFIED/HIGH variants — but those replacement tags carry
only bare `variant/VERIFIED/HIGH` notes with no NV-number or relay
citation, unlike e.g. `angry`'s well-documented NV-054. Fresh direct
native input (Project Owner relay, timestamped, same format as prior
NV-054 evidence) contradicts the audit on BOTH keys, saying the
"superseded" values are actually correct. Claude B's `always` fix
(`phrase_maps.js` `Pangnan`→`pang·na`, commit `30c667c`) was **reverted**
same session (commit `c82e62a`) once this came in. `answer` was never
touched. Full detail, both native quotes verbatim, in
`docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md` (filename is
now slightly stale — it covers all three keys, not just `angry`; didn't
rename mid-session to avoid a broken-link churn, consider renaming next
session if convenient).
**Next step:** Claude A needs to re-verify `always` and `answer` against
original native sourcing (or get fresh confirmation) and either restore
confidence in the VERIFIED tags or correct `master_dictionary.json`. Once
resolved, Check F's ledger entries for both keys need re-closing (and if
`master_dictionary.json` changes, `corrections.json`'s regression-tested
values may need updating too).

**2. `angry` raka placement.**
Native input: `angry = ka.onanga` — raka count/placement differs from the
current VERIFIED/HIGH `ka·o·nang·a` (3 raka marks). Flagged in the same
handoff doc. Root cause unknown — could be genuine mis-transcription in
the original NV-054 capture, or the Owner's shorthand just dropped raka
marks casually (less certain than the always/answer conflict, which was
a clean full-value contradiction). Lower urgency than issue #1.

**3. `a dog bit me` — 3-way linguistic conflict, narrowed by a second relay.**
First native relay: `Angko achak chika`. Second relay (post-doc,
2026-08-14): `angko achak chikaha` — same word order, revises the ending
to `-ha`. `corrections.json`: `Achak Angko chikaha` (documented Batch-2
native session) — now agrees with the second relay on the verb form
(`chikaha`), still disagrees on word order (`Angko achak` vs
`Achak Angko`). `master_dictionary.json`: `An·tangko achik chanjok`
(untagged legacy, matches neither). Check F engineering closure stands
(corrections wins at runtime either way) but which form is *right*
linguistically is open — now looks like a word-order question rather
than a fully divergent form. Flagged in the same handoff doc.

## Standing rules established this session (in addition to prior ones)
- **Don't trust a SUPERSEDED/VERIFIED tag pair at face value if the
  VERIFIED side has no NV-number/citation** — bare `variant/VERIFIED/HIGH`
  notes are weaker evidence than they look, per this session's
  `always`/`answer` findings. When in doubt, that's a flag-don't-fix
  situation, not a mechanical "compiled_dict/audit note wins" situation.
- **When native input arrives mid-session that contradicts a change
  already made and pushed, revert rather than leave the disputed change
  live** — lower risk than leaving a now-doubted fix in production
  pending Claude A's resolution.
- Resolved-keys tracking in the ledger: build the set manually by reading
  the doc, don't grep-match on backticks (inconsistent formatting made an
  early grep attempt undercount badly — caught before it caused a
  duplicate-work bug, but don't repeat the shortcut).

## Exact next step for the new session
1. Clone repo, `git log --oneline -5` to re-sync (don't assume this doc's
   HEAD is still current — check for new Claude A commits first).
2. Run full build gate to confirm starting state is green.
3. Regenerate the gap dataset fresh (`node scripts/analyze-check-f-gaps.mjs`),
   rebuild the resolved-keys set from the ledger doc (manual read, not
   grep), confirm `always` and `answer` are correctly NOT counted as
   closed.
4. Check whether Claude A has responded to
   `docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md` (look for a
   new commit touching `master_dictionary.json`'s `always`/`answer`/`angry`
   entries, or a reply doc). If resolved, re-close those ledger entries
   accordingly (and update `corrections.json` + rerun the fix pattern if
   Claude A confirms the audit was in fact wrong). If not yet resolved,
   leave them open and move to the next unresolved key.
5. Next unvisited key in alphabetical order (as of this doc): **`are you
   sleeping`** (`answer` and `always` are being held open, not skipped
   permanently — `angry` and `a dog bit me` are closed on the
   engineering side).
