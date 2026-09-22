# Claude B Session Migration — 2026-09-22

## 1. Project identity
Lean Garo — English→Garo translation engine (dictionary + rule-based
grammar assembly, not ML). Repo: `pzrjv4sfj5-prog/Lean-Garo-`. This
role (Claude B) is engineering-scope: mechanical fixes to the
translation pipeline (grammar assembly, morphology, lookup cascade,
build/test infra) are in-scope without sign-off; Garo-form/content
decisions (which word is correct, new vocabulary, sense splits) are
Claude A/Project Owner/Thangseng's lane, not this one's.

## 2. Current state
- HEAD: `7a906e9`, confirmed == `origin/main` (pushed and verified via
  `git ls-remote` before this doc was written).
- Resumed this session via `docs/CLAUDE_B_SESSION_MIGRATION_20260921.md`,
  which pinned `4836730`. Resynced first, found 1 commit of drift
  (Claude A's `7436049`, `NV-160` — closes `ama`/`man·a` `pickPrimary`
  ties, adds RULE-050; touched `master_dictionary.json`/`docs/`/
  `.ai/WORKSTATE.yaml` only, no `src/` changes) — confirmed no code
  impact via full gate re-run before touching anything.
- Gate at close: 458/458 unit tests, 0 new `repository-intelligence.js`
  violations (checked via `prepare-data.js` + `test-dictionary.js` +
  `repository-intelligence.js`), no regression from this session's fix.

## 3. Done this session
- **Investigated the 4 sentence-building gaps** flagged since
  2026-09-19 (`estrange`+object, `skin`+"animal", `"wall"` as subject/
  object, `"crumbled down"`), previously only reclassified as
  engineering, never actually root-caused. Root-caused all 4 via live
  `analyzeGrammar`/`assembleGrammar`/`findVerbForm` tracing (not
  guessing): they are **three distinct bugs**, not one:
  1. **Silent-e `+d` gap in `findVerbForm`** (src/morphologyEngine.js) —
     verbs whose base ends in silent-e (`estrange`, etc.) strip
     incorrectly under the existing `/ed$/` branch (`estranged` ->
     `estrang`, not `estrange`), so `findVerbForm` returned `null` and
     `analyzeGrammar`'s verb-search loop mis-elected a LATER word as
     the verb instead (`"she estranged her family"` -> `"family"`
     wrongly elected verb, `"estranged"` stranded as an unresolved
     object). A matching silent-e `+s` fallback already existed (found
     2026-07-22) for the `-es`/`-s` case but was never extended to
     `-ed`. **FIXED AND PUSHED** — commit `7a906e9`. Mirrors the
     existing `+s` fallback's exact guard shape (only fires when the
     stripped form didn't resolve one line up, so genuine `-ed` verbs
     like `walked`/`jumped` are unaffected — confirmed via full 458/458
     test re-run, 0 regressions).
  2. **`"animal"` genuinely absent from `master_dictionary.json`** as a
     noun (`wall` and `family`, by contrast, both already exist and
     compile fine — the prior sessions' assumption that both `wall`
     AND `animal` were missing was only half right). This is
     linguistic-data content, out of engineering scope — needs Claude
     A/Project Owner to add it, not touched here.
  3. **`"the wall crumbles down"` / `"it crumbled down yesterday"`** —
     two compounding, NOT-yet-fixed bugs:
     - `analyzeGrammar`'s NP-subject coherence check
       (src/grammarEngine.js ~line 244) only accepts an `a/an/the NOUN`
       sequence as the sentence subject when the word immediately
       following the noun is a copula (`is/are/was/were`), a
       `STOP_WORDS`/`AUXILIARY_SKIP` closed-class word, or nothing at
       all — NEVER a genuine bare main verb. Confirmed this is a
       **general** gap, not specific to wall/crumble:
       `"the dog runs"`, `"the dog eats rice"`, `"a boy runs"` all fail
       the same way (`structure: "unknown"`, `subject: null`). Likely
       affects many sentences beyond the 4 originally flagged.
     - Separately, `"crumble down"` is stored as a single 2-word
       phrasal-verb dictionary entry (`"to crumble down"` ->
       `"Be·rurua"`) with no conjugation support on its first word —
       `crumble` alone is NOT a dictionary entry (confirmed:
       `lookupGaro('crumble','v.')` -> `null`), so `"crumbles down"` /
       `"crumbled down"` never match the phrase key `"crumble down"`
       at all, regardless of the NP-subject bug above. (`"they crumble
       down"` already works today because the bare, unconjugated form
       happens to match the phrase key directly.)
     Root-caused via live tracing (`debug1.mjs`/`debug2.mjs`, deleted
     before commit — see §5), not fixed. Larger, more general change
     than the silent-e fix — flagged to the person before starting,
     not yet given a go-ahead as of this doc.

## 4. Held / open items (not touched this session)
- **NP-subject coherence gap** (§3 item 3, first bullet) — general,
  not yet fixed. Person has verbally said "yes" to taking this on next
  session, pending a fresh PAT.
- **`"crumble down"` phrasal-verb conjugation gap** (§3 item 3, second
  bullet) — not yet fixed, not yet scoped in detail (needs a design
  call on how phrase-key lookup should handle conjugation of the first
  word of a multi-word entry — likely affects other 2-word phrasal
  verbs in the dictionary too, not surveyed this session).
- **`"animal"` vocabulary gap** — flagged, not engineering-scope, needs
  Claude A/Owner.
- **S6.2** (`him`/`us`/`them`'s `·ko` suffix) — unchanged from prior
  doc, not touched this session.
- Both drafted Thangseng relay batches — unchanged, still not sent
  (Project Owner/Tridip action, outside this role).
- Everything else already flagged as open in prior migration docs and
  not mentioned above is unchanged in substance — not re-litigated
  here.

## 5. Standing rules this session followed (carried forward)
- Never fabricate a Garo linguistic form without citation.
- Mechanical/engineering fixes are in-scope without owner sign-off;
  Garo-form/content decisions are not — applied explicitly to the
  `"animal"` gap (flagged, not touched) vs. the silent-e `findVerbForm`
  fix (pure English-orthography engineering, fixed directly).
- Before pushing: full gate re-run at the exact commit being pushed,
  `git fetch` + `git log HEAD..origin/main` checked for drift (none
  found this time) before push.
- Scratch/debug files created during live tracing (`debug1.mjs`
  through `debug5.mjs`, `check_lemmas.mjs`, `repro.mjs`) were
  `git rm --cached` and deleted before the final commit — confirmed via
  `git status --short` showing a clean tree, not left in the repo or
  shipped in the diff (the first commit attempt accidentally included
  them; caught and amended before push).
- Token discipline: matched the person's stated priorities — led with
  results, didn't re-verify the 458/458 test baseline redundantly
  beyond what the code change actually touched, didn't restate prior
  turns' content back to the person.
- Per explicit person instruction this session: writing this migration
  doc now, before continuing further work, specifically so the next
  session can start with a freshly-rotated PAT rather than reusing
  this session's (which was pasted in plaintext in chat, same
  exposure note as every prior session's §8/§9).

## 6. Exact next step
No in-progress edit — clean tree, last action was this migration doc's
own commit (see below), gate green at `7a906e9` before it. Next
session should pick up the **NP-subject coherence gap** (§3 item 3,
first bullet / §4 first item) — person has already said yes to this,
just needs a fresh PAT to start. Suggested approach (not yet
implemented, open to reconsideration): the coherence check's job is to
avoid misreading a pre-noun modifier (`"the BIG dog"`) as the head
noun — reusing `findVerbForm`/`VERB_LEMMAS` (already imported into
this file) to recognize a genuine main verb immediately following the
candidate noun, the same lemma-based signal `sentenceBuilder.js`
already uses for its own verb-search loop, would likely close most of
the gap without inventing new heuristics — but verify against the
existing "reject `'the big dog'`" regression case before landing
anything, since that's exactly the case this coherence check exists to
protect. The `"crumble down"` phrasal-verb conjugation gap (§3 item 3,
second bullet) is a separate, not-yet-scoped follow-on — no
recommendation yet, needs its own investigation into how many other
multi-word dictionary entries share this shape before designing a fix.

## 7. Resume protocol for whoever picks this up
Treat this doc as ground truth for what happened, but re-sync with
actual current state before continuing: `git fetch`, check
`origin/main` HEAD against `7a906e9` (or note what's changed since),
re-run the full gate at whatever HEAD actually is, then proceed. Don't
re-litigate §5's standing rules or re-open the 3 root-caused-this-
session bugs' diagnoses without new evidence — they're settled; only
the 2 remaining fixes themselves are open.

## 8. PAT usage
This session's PAT was pasted directly in chat (same exposure as every
prior session — not stored anywhere in this repo, this doc, or
persisted between sessions; lived only in that chat's history). Used
identically to prior sessions: set directly into the remote URL for
`git clone`/`git push`, stripped immediately after each push (not
committed to `.git/config` history). Per explicit person instruction,
this doc is being written and pushed now specifically so the next
session starts with a **freshly-rotated token**, not a reused one —
the next Claude B session will need a new PAT pasted in chat; there is
no way to resume git access from this doc alone.
