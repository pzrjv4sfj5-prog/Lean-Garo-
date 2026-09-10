# Claude A Session Migration — 2026-09-11

## Project identity
Lean-Garo — Garo language dictionary + English-to-Garo translation engine.
Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Claude A = linguistic
authority (grammar, dictionary quality, native validation review).
Never touches engine code (Claude B), audits (Claude C), or OCR
ingestion (Claude D).

## Current commit/state at close
- Branch: `main`
- Resumed clean at `cb93d1b` == `origin/main`.
- This session's commits: master_dictionary.json + pending_lexicon.json
  data fixes, regenerated compiled artifacts, new Claude B handoff doc,
  WORKSTATE.yaml/SESSION_BOOTSTRAP.md update, this migration doc.
- No push collisions this session.

## What's done vs. held, and why

**Done:** a full 12-section linguistic re-audit of current `main`, per
Project Owner directive, covering: HEAD/file inventory; number system
(1-100000); classifier contract; human-40+ counting forms; a
generated/contaminated-data sweep of `master_dictionary.json`;
classification of the 22 `PICKPRIMARY_VERIFIED_TIES.md` keys;
patterns in the 5,616-key no-verified-candidate backlog; orthography;
a linguistic-mismatch review of the runtime (`src/garo_classifier.js`,
`src/number_engine.js`) without modifying it; and a live
unseen-combination generalization test via `translate()`.

**Number/classifier CONTRACT DATA: VERIFIED clean.** No linguistic
defects found in `master_dictionary.json` or either machine-ready
file across the full 1-100000 range. Both machine-ready files'
11-19 rule correctly reads the `Chi·` fused form (not the old
`Chiking SPACE unit`), confirming Claude B's prior fix landed
correctly in the data as well as the runtime. Classifier categories,
exceptions, and the human-40+ surface rule all match Owner-confirmed
policy exactly.

**Major finding, not fixed by Claude A (engine code, Claude B
territory):** live `translate()` calls on unseen combinations
(numbers/nouns not pre-seeded as literal dictionary rows) show the
runtime does **not** generalize past ~20 or past pre-seeded
classifier/noun pairs. Five distinct bugs found and root-caused:
1. `king` classifier missing from `RAKA_CLASSIFIERS`
   (`src/garo_classifier.js:90`) — unseen `king`-classified counts
   ship without the citation-backed raka dot.
2. 20-99 composition blindly does `space→dot` replacement on the
   number-table's capitalized citation form with no lowercasing —
   `"41 students"` → `sakSotbri·sa`, not the Owner-approved
   `saksotbri sa`.
3. Exact-hundred composition (`buildLargeClassifierPhrase`) silently
   substitutes a count of 1 when the remainder is zero —
   `"100 students"` → `"chattro ritcha saksa"` (reads as count=1,
   not 100); `"one hundred dogs"` → `"achak mang·sa"` (hundred
   dropped entirely).
4. `parseCountingPhrase` has no hundred/thousand multiplier-word
   handling at all — `"one hundred dogs"` parses as count=1 before
   it ever reaches bug 3.
5. Nouns without a pre-seeded count row (e.g. "mango") bypass the
   classifier engine entirely, falling to a different code path
   (`sov-assembly`) that ignores the classifier and produces wrong
   word order.

Full writeup, live-verification table, and fix guidance:
`docs/CLAUDE_B_HANDOFF_20260911_number_classifier_runtime.md`.
Everything at/below ~20 for the classifiers the system was originally
built against (mang, sak for 1-19) works correctly — this is purely a
generalization gap.

**Post-rebase update, same session:** a concurrent Claude B session
(`e40f17e`/`9627230`/`e7c54cf`) landed while this was being written
and fixed Bug 2 for the `sak` classifier specifically (41/55/67
students now match the approved surface exactly) plus bare-digit
number parsing (now correctly routes through `number-engine`). Bugs
1, 3, 4, 5 remain live, and Bug 2 remains live for every other
classifier (`bol`/cars confirmed still broken) — re-verified live
post-rebase, handoff doc updated to reflect current state before
push.

**Two data-layer fixes made**, using only already-established
evidence already on record (no new native relay needed):
- 10 malformed bare-digit English keys (e.g. `english="4"`,
  `english="10"`) marked `superseded`, citing this audit — these
  duplicated the real word-form number entries and aren't valid
  English input in the first place; retained per citation discipline,
  not deleted.
- The `where`/`Where` case-collision (`Bano` vs `Bachi`, the pair
  behind the `where` entry in `PICKPRIMARY_VERIFIED_TIES.md`): the
  capitalized `"Where"`/`Bachi` row's own notes already flagged this
  exact collision as a clobber risk against lowercase `"where"`/`Bano`
  back when it was written. Re-keyed to `"where (movement-to)"`,
  matching the established sense-tagged-key pattern (same shape as
  the 2026-08-18 `"where (object placement)"` precedent), citing the
  already-established RULE-044/NV-047 evidence. `where` (bare) stays
  `Bano` — the stationary sense, matching the more common bare-word
  usage (`"where are you?"`).
- `src/data/pending_lexicon.json` PL-0000273 synced to the new key
  (Check D structural-integrity gap caught by the gate, fixed same
  session).

**Held / not started:**
- The runtime bugs above — Claude B's.
- 10 unclassified `PICKPRIMARY_VERIFIED_TIES.md` keys (agree, brave,
  early, empty, greedy, horn, last, leg, lie, outside) — no
  native/Owner evidence found anywhere in session history for any of
  them. Genuinely open, not corpus-resolvable without a real relay
  question. Not force-closed.
- The `fever`/`suffer` possible-homograph Claude B flagged (2026-09-10
  Stage 2C) — reviewed directly: `jom·a`'s appearance as an
  *unverified* `suffer` candidate does not actually conflict with its
  `verified_high` `fever` status (plausible legitimate polysemy,
  ache/suffer → fever). No defect found; left as-is, not force-resolved
  in either direction — this needed native confirmation to actually
  close, which wasn't available this session.
- The `how` (Maikai/maidake) tie — already correctly resolved in
  practice (maidake ships, matches the established narrower "how"
  sense); the tie itself reflects a real semantic-scope difference
  (maikai is broader), not a defect, so left as a documented tie
  rather than merged.

## Open issues (root cause, where known)
See "Major finding" above — full detail in
`docs/CLAUDE_B_HANDOFF_20260911_number_classifier_runtime.md`.

## Standing rules (unchanged, restated for continuity)
- Evidence-first: resolve only on clear evidence; flag and leave open
  otherwise. This session declined to force-close 10 verified-ties and
  the fever/suffer question for exactly this reason, even under a
  "fix all" instruction — no new evidence existed to fix them with.
- Claude A never touches engine code — this session found 5 runtime
  bugs and wrote them up for Claude B rather than patching
  `src/garo_classifier.js` directly.
- Only use a PAT pasted live in the current session; never embed one
  in a file.
- Mandatory resume sequence: `git fetch`, verify HEAD, read
  `WORKSTATE.yaml` and `SESSION_BOOTSTRAP.md` before any work.
- Always commit + push before ending a session; verify `git status`
  clean and HEAD == origin/main.

## Exact next step for the next session
1. Resume as Claude A, paste this migration document.
2. Run the mandatory resume sequence — check whether Claude B has
   picked up `docs/CLAUDE_B_HANDOFF_20260911_number_classifier_runtime.md`.
3. If the Project Owner wants the 10 open verified-ties or the
   `fever`/`suffer` question pursued, they need an actual Thangseng
   relay — none of them are corpus-resolvable as they stand.
4. Otherwise, no open Claude A task remains from this session.

## Repository status at close
- HEAD hash: verify via `git rev-parse HEAD` at resume.
- HEAD == `origin/main`: verify via `git fetch` — session ended with a
  clean push.
- `git status`: expected clean.
- `WORKSTATE.yaml`: updated this session (`claude_a.next_action`,
  `claude_a.next_action_prior_20260910` preserved, `claude_b.
  pending_handoff_from_claude_a_20260911` added).
- `SESSION_BOOTSTRAP.md`: updated this session (session-close entry
  appended).
- Migration doc: this file.
- Native-validation status: no new NV items this session — this was a
  data-hygiene + audit session, not a native-relay session. No native
  evidence was invented for any of the open ties.
