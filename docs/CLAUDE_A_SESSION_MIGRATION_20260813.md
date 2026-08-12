# Claude A Session Migration — 2026-08-13

## Project identity
Lean-Garo — English-to-Garo dictionary/translation engine.
Repo: https://github.com/pzrjv4sfj5-prog/Lean-Garo-
Role: Claude A — linguistic authority only (grammar/morphology/dictionary
quality/native validation review). Never touches Claude B's engine-code
domain beyond classifier-map/data-table edits with direct precedent, or
Claude D's OCR ingestion.

## Repository status at close — final confirmation
Verified directly against the live repo immediately before writing this
section (not asserted from memory):
- HEAD: `b5d73ed7d073627f4b840340233ba1953c511263`
- origin/main: `b5d73ed7d073627f4b840340233ba1953c511263` — MATCH (`git fetch` + compare, not assumed)
- `git status`: clean — no local commits ahead of origin, no uncommitted
  changes, nothing untracked left over from this session
- Build: `node prepare-data.js` + `node test-dictionary.js` clean, 8150/8150
  valid entries
- Tests: `node --test tests/unit/*.test.js` — 203/203 pass
- `npx vite build` — clean, no runtime/bundle errors (dependencies were
  not pre-installed in this session's container; `npm install` run once
  to enable the check — that's a sandbox-only step, not a repo change;
  the resulting `dist/` diff was reverted, not committed)
- `.ai/WORKSTATE.yaml`: updated in this commit with a full `claude_a.
  current_task` entry for both fixes below (currency-classifier bug +
  ba/RULE-023) — was NOT updated in either of the prior two commits
  (`d831caa`, `17e249f`) that landed the actual fixes, corrected here
  before migration per the standing "update in same commit" rule (this
  time it landed one commit late rather than not at all — flagging the
  gap honestly rather than silently backfilling it as if it were clean)
- `.ai/SESSION_BOOTSTRAP.md`: intentionally NOT touched — it is
  current-rules-only, not a session log (2026-08-10 Project Owner
  directive, line 29 of that file); nothing in its "Current joint work
  package" section was affected by this session's work
- Every commit this session (`d831caa`, `17e249f`, this doc's commit, and
  the WORKSTATE.yaml correction) is pushed to `origin/main` — confirmed by
  `git fetch` + HEAD/origin comparison above, not just a local `git log`
  read
- Native-validation/blocker status: no open blockers from this session's
  two closed tasks; the unwritten teacher/student/mountain/village/road/
  banana/car relay (see below) is the one carried-forward item

## What's done this session
1. **Currency/large-number classifier bug (root cause + fix, commit
   `d831caa`):** classifier was fusing via raka to the front of the whole
   multi-word hundreds/thousands number (e.g. `10,001` →
   `gong·chiking·hajalsa·sa`) instead of only the final atomic digit.
   Direct Project Owner correction: `10,001` → `hajal chiking gong·sa`.
   Rewrote `garo_classifier.js`'s large-number composition
   (`bareNumberWord`, `composeLargeBareNumber`, `buildLargeClassifierPhrase`)
   so `hajal`(1000)/`ritcha`(100) and their multipliers stay bare, and the
   classifier+raka attaches only to the final 1–99 remainder via the
   existing, unchanged, 2026-06-28-verified tens+units logic. Exact
   multiples of 100/1000 handled by analogy (flagged in-code as not
   independently native-confirmed). Corpus sweep found no stored dictionary
   entries used the old buggy pattern — bug was runtime-only, now closed
   for all classifiers, not just currency.
2. **`ba` (also/too) suffix + RULE-023 confirmation (commit `17e249f`):**
   Project Owner relay `Angaba cha·gen` = "I will also eat" confirmed.
   Promoted `also`=`·ba` to VERIFIED/HIGH; added new sentence entry
   `I will also eat` = `Anga·ba cha·gen`. This also supplied the
   raka-bearing-root test case RULE-023 ("-gen never carries raka") had
   flagged as missing — root `cha·a` carries its own raka, `cha·gen`
   retains the root's raka but the suffix adds none. RULE-023 confidence
   raised medium → high, new example added.
3. Resynced at session start against `docs/CLAUDE_A_SESSION_MIGRATION_20260812B.md`
   — repo matched exactly (only the migration-doc commit itself had landed).

## Held / not done this session (per one-task-per-session discipline)
- Native relay from earlier in this session (teacher=Skigipa,
  student male/female=Chattro/Chattri, mountain=A·bri dotsa, village=Song
  damsa, road=Rama dilsa, banana=Te·rik ge·sa + bunch=Te·rik akkasa,
  car=Gari bolsa) was **analyzed but not yet written to the corpus** —
  session pivoted to the currency bug report before that write happened.
  This is real, unclaimed native data sitting in this conversation's
  history, not yet in any commit. **Next session should either:**
  (a) re-relay this data explicitly, or (b) if resuming with this doc,
  treat the transcript this doc was generated from as the source and
  write it up as its own session (roots + classifiers + count=1 forms +
  mechanical 1-20 buildout for teacher/mountain/village/road/banana/car,
  following the precedent of the person/tree/rupee generalization
  sessions). Do not guess at it from memory — use the literal Garo strings
  as given: `Skigipa` (teacher), `Chattro`/`Chattri` (student m/f),
  `A·bri dotsa`, `Song damsa`, `Rama dilsa`, `Te·rik ge·sa`,
  `Te·rik akkasa`, `Gari bolsa`.
- Person/student/teacher 111-candidate root conflict — still open (though
  the `sak` classifier itself is settled for all three; only root-word
  choice remains, and teacher's root is now resolved as of this doc via
  the item above).
- 10 nouns classifier question — 5 of 10 resolved via the item above
  (mountain/village/road/banana/car); house/river/water/food/rice remain
  open.
- Coin-root VERIFIED-tagging (small task) — still queued, untouched.
- Car classifier `bol` vs. tree root `Bol` — flagged as a possible
  orthographic collision worth a native disambiguation question, not
  resolved either way.

## Open issues with root cause (carried forward)
- Exact-multiple-of-100/1000 classifier attachment (e.g. "exactly 1000
  rupees") is inferred by analogy from the confirmed 10,001 case, not
  independently native-confirmed. Low risk, flagged in code comment.

## Standing rules (unchanged, confirmed still in force)
- `.ai/CLAUDE_D_HANDOUT.md` sole legitimate channel for Claude D.
- PAT reused live-pasted-only, never embedded, rotate after use.
- One task per session; validate + commit before stopping.
- Evidence-first: corpus-internal contradiction, already-Verified rule, or
  direct native confirmation only — never guess.
- Always commit + push before ending; verify `git status` clean and
  `HEAD == origin/main` via fetch.

## Exact next step
Start a new conversation, paste this document. On resume: `git fetch`,
verify `HEAD == origin/main`, confirm clean tree, then either relay the
teacher/student/mountain/village/road/banana/car native data again or
locate it in prior chat history, and write it into the corpus as its own
one-task session (per the precedent write-up above).
