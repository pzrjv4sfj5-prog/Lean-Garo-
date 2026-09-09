# Claude B Session Migration — 2026-09-09B

## Project identity
Lean-Garo: English<->Garo rule-based translation engine. Data pipeline is
`prepare-data.js` (merges `garo_dictionary.json` / `garo_dictionary (2).json`
[absent in this checkout, handled gracefully] / `master_dictionary.json` ->
`src/compiled_dict.json` + related generated files), consumed at runtime by
`src/translationEngine.js` and friends. Full gate: `npm run build`
(`prepare-data.js` -> `test-dictionary.js` -> `repository-intelligence.js` ->
`scripts/resync-stale-overrides.mjs` -> unit tests -> `vite build`).

## Current state
- **HEAD**: `357fa45` — "Fix demand/hope POS-split..." — pushed to
  `origin/main`. Rebased onto `3320bce` (Claude A session close,
  2026-09-09C) before building, so `compiled_dict.json` reflects both that
  session's `walk=Re·a`/`give=On·a` directives + NV-153/154 cook paradigm
  work AND this session's fix, together, gate-verified.
- Resync before starting next session anyway — a third party (yourself, a
  concurrent session, or the Owner) may have moved `origin/main` again
  since this doc was written. Don't assume this HEAD is still the tip.

## What this session did (full account — this session was entirely
one investigation, not several)

**Started from**: `docs/CLAUDE_B_SESSION_MIGRATION_20260909.md` (Stage 2C
tied-key classification, batches 1-2 of 9: `able`/`agree`/`alone`/`big red
house`/`brave`/`demand` classified). Resynced cleanly (2 bookkeeping-only
commits ahead of that doc's expected HEAD, no drift), confirmed the
24->25 pickPrimary tie-count question already had its answer sitting in
the tie report itself (a genuine new `able` promotion, not a bug).

**`demand` flagged as a real bug** (batch 2): not a routine linguistic tie
— `Dabia`(verb)/`Dabiani`(noun) are different parts of speech, and the
engine shipped the noun for everything, including verb-sense sentences
("I demand it" -> wrongly "Anga Dabiani"). Owner asked to see it live,
then asked for a proper fix, not a patch.

**Root-caused before touching code** (this took several iterations of
"think before you act" — first two automated sweeps for other affected
words were WRONG and had to be corrected in front of the Owner):
- First sweep (case-insensitive infinitive-match false positives) flagged
  `throw`/`cook`/`walk` incorrectly — didn't replicate `isVariant`
  filtering faithfully; corrected by instrumenting the real
  `pickPrimary` code directly rather than reverse-engineering it in a
  side script.
- Second sweep (real ground truth via instrumentation) found the true
  scope: only `demand` (case-sensitivity bug) and `hope` (no `to hope`
  key exists at all, but bare-key rows carry structured `pos: 'v./'n.'`
  tags that `normalizeFile`/`addValue` silently dropped before
  `pickPrimary` ever saw them).
- Checked the established reference case (`answer`,
  `tests/unit/answer_pos_tie.test.js`) live and found it has the exact
  same noun-context gap ("this is an answer" -> wrongly "Aganchaka") —
  the existing test only ever covered the verb form. This reframed the
  fix from "patch two words" to "the project's established convention
  for this bug class was never sense-complete, only citation-form-
  correct" — see Owner's explicit decision below.

**Fix implemented** (see commit `357fa45` for full rationale, this is
the summary):
1. `pickPrimary`'s `to X` infinitive-match tie-break made case-insensitive
   (fixes `demand`'s specific failure).
2. `pos` field threaded through `normalizeFile`/`addValue`/
   `cleanedEntries` into `pickPrimary`; new tie-break: exactly one tied
   candidate tagged `pos: 'v.'` wins (fixes `hope`, which has no
   infinitive-signal at all).
3. **Prototype-tested before wiring into sentence assembly** (Owner
   explicitly asked for this): `lookupGaro(key, expectedPos)` added as an
   optional second parameter to `src/lookupEngine.js`; demoed in
   isolation (`lookupGaro('demand','v.')` -> `Dabia`,
   `lookupGaro('demand','n.')` -> `Dabiani`, non-split keys unaffected)
   BEFORE touching any call site.
4. `compiled_dict.json` ships `{garo, pos, senses}` for `demand`/`hope`
   only (not a flat string) — `lookupEngine.js`'s `normalizeEntry()`
   already accepted this shape generically, predating this change.
   Every other ~8,258 entries are untouched plain strings.
5. Wired `expectedPos` into the 3 call sites whose POS role was
   unambiguous from their own existing purpose: `findVerbForm()` in
   `morphologyEngine.js` (all its `lookupGaro` calls, verb-role
   throughout — this is also what fixes "she hopes" via the silent-e
   fallback path), the `a/an/the SUBJECT is...` predicate-adjective
   subject lookup in `grammarEngine.js` (noun-role), and
   `translationEngine.js`'s stopword-stripped fallback (article-
   adjacency heuristic: original sentence had `a`/`an`/`the` AND exactly
   one content word survives stripping -> noun-role; narrow, doesn't
   fire on multi-word residuals).
6. Along the way found and fixed a break this change caused in
   `test-dictionary.js`'s `validateEntry()` (predated the object shape,
   crashed with `value.trim is not a function` on it) — now validates
   `.garo` for object-shaped entries.

**Deliberately NOT done, by design, this session:**
- Did **not** extend the `senses` mechanism to `answer` — its rows have
  no structured `pos` field, only free-text notes that say "the verb"/
  "the noun". Considered mining that via regex (same mechanism a broader
  sweep would need) and rejected it as too fragile/scope-creepy for this
  pass — a wrong regex match against ~10,000 rows of free text is a much
  worse failure mode than leaving one known word unfixed. **Follow-up**:
  add a structured `pos: 'v.'`/`pos: 'n.'` tag to `answer`'s two rows in
  `master_dictionary.json` the same way `demand`/`hope` already have —
  once that's there, the existing `pickPrimary`/`senses` machinery picks
  it up with zero further code changes.
- Did **not** thread `expectedPos` through the other ~60 `lookupGaro`
  call sites across the 4 engine files (objects of verbs, locations,
  counted nouns, etc.) — those are almost all self-evidently noun-role
  from their own variable names (`objGaro`/`nounGaro`/`clauseVerbGaro`
  etc.) and mechanical to fix, but out of scope for what's actually
  exercised by the 3 known sense-split words today. Only 3 words are
  affected currently (`answer`/`demand`/`hope`), so blast radius of NOT
  doing this sweep now is small; worth doing as its own batched pass if
  more sense-split words turn up.
- Did **not** run `vite build` successfully — `node_modules` is missing
  in this session's sandbox (`vite`/`@vitejs/plugin-react` unresolved).
  Confirmed this is a pre-existing environment gap (no `npm install` has
  ever been run in this clone), not caused by this session's changes —
  would fail identically on a completely unmodified checkout. Next
  session: run `npm install` before relying on `vite build` as part of
  the gate.

## Open issues (root cause known where stated)
1. **`answer` noun-context gap** — see above. Root cause: no structured
   `pos` field on its rows. Fix: add one (linguistic-adjacent, needs
   Owner/Claude A, not an engineering call).
2. **~60 other `lookupGaro` call sites lack `expectedPos`** — not
   currently exercised (no other sense-split words exist yet), but will
   silently mis-resolve the moment a 4th sense-split word is found unless
   its specific call site happens to be one of the 3 already fixed. Low
   priority until it actually recurs.
3. **`vite build` untested this session** — sandbox gap, see above.
4. **Stage 2C tied-key classification** (from the *previous* migration
   doc, `...20260909.md`) is still only 2 of 9 batches done (6 of 25
   keys: `able`/`agree`/`alone`/`big red house`/`brave`/`demand` — and
   `demand` has since moved from "tied, needs classification" to
   "resolved" by this session's fix, so really 5 keys remain classified
   + 1 resolved). Remaining keys to classify:
   `early, empty, fever, greedy, hoe, horn, how, i can eat, i can go, i
   can work, last, leaf, leg, lie, outside, walk, where, where (relative
   pronoun)` — note `walk` was also independently resolved this session
   by the concurrent Claude A session's Owner directive (`walk=Re·a`),
   so it's likely no longer tied — reconfirm against the current 22-key
   `docs/PICKPRIMARY_VERIFIED_TIES.md` before continuing, don't assume
   the old 25-key list is still accurate.

## Standing rules established/reconfirmed this session
- Owner's `<userPreferences>`: token discipline (no filler/preamble),
  don't re-verify settled things, don't re-explain established context,
  produce a Migration Document at context-limit checkpoints, treat a
  pasted migration doc as ground truth but re-sync with actual current
  state first.
- **Repo writes only with explicit Owner authorization** — this session
  got explicit go-aheads at each stage (classify -> investigate ->
  implement -> scope the runtime fix -> "go by your judgment, demo-test
  first" -> "continue" -> "start migration"). Don't assume a later
  authorization retroactively covers earlier unauthorized work, and
  don't assume today's authorization covers a materially different task
  next session.
- **A PAT was pasted in plaintext in this session's chat** (same one
  referenced in the prior migration doc as already compromised/never
  rotated). Flagged again this session per standing practice. Still not
  rotated as of this writing — keep flagging, don't stop just because
  it's been flagged before.
- **"Think before you act" reconfirmed as load-bearing this session,
  concretely**: two automated audits were wrong before a third,
  instrumentation-based one was right. The lesson isn't abstract —
  reverse-engineering the real build script's logic in a separate script
  is a real, demonstrated failure mode here; when in doubt, instrument
  and run the actual code, don't approximate it.

## Exact next step
1. `git fetch origin` and diff against this doc's stated HEAD (`357fa45`)
   before doing anything else — don't assume no one else has moved main.
2. If resuming Stage 2C classification: re-pull the current
   `docs/PICKPRIMARY_VERIFIED_TIES.md` (22 keys as of this session, not
   the old 25) and continue from there, in the same small-batch (2-3
   keys at a time) style as before.
3. If picking up the `answer` follow-up instead: that's a linguistic
   question for the Owner/Claude A (needs a `pos` tag added to
   `master_dictionary.json`), not something to engineer around — flag it
   for whoever owns linguistic calls, don't attempt a regex-based
   workaround.
