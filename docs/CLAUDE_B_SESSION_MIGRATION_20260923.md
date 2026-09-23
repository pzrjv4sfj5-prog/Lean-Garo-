# Claude B Session Migration — 2026-09-23

## 1. Project identity
Lean Garo — English→Garo translation engine (dictionary + rule-based
grammar assembly, not ML). Repo: `pzrjv4sfj5-prog/Lean-Garo-`. This
role (Claude B) is engineering-scope: mechanical fixes to the
translation pipeline (grammar assembly, morphology, lookup cascade,
build/test infra) are in-scope without sign-off; Garo-form/content
decisions (which word is correct, new vocabulary, sense splits) are
Claude A/Project Owner/Thangseng's lane, not this one's — except where
the Project Owner gives a direct instruction to decide (see §3 item 3).

## 2. Current state
- HEAD: `c6de365`, confirmed == `origin/main` (pushed and verified via
  `git ls-remote` before this doc was written).
- Resumed this session via `docs/CLAUDE_B_SESSION_MIGRATION_20260922.md`,
  which pinned `7a906e9`. Resynced first, found 2 commits of drift
  (Claude A's `176bdcf` POS-tagging pilot, `8c2df20` session close),
  neither touching `src/`, confirmed no code impact via full gate
  re-run before continuing.
- A message purporting to be a "Claude B session audit" was sent
  mid-session claiming `origin/main @ 6b4c72c` with specific commit
  citations — verified against actual repo state and found to be
  stale/inaccurate (the cited commits, and the cited `origin/main`
  HEAD itself, were all from before this session even started,
  predating even the migration doc's own pinned commit). Flagged to
  the person rather than acted on; not incorporated into any decision
  this session. Contrast this with the two *later*, unprompted
  "Claude D"/"Claude A" handoff docs referenced in §3 items 2 and 4,
  which were checked the same way and found to be accurate/legitimate
  — the lesson applied throughout was "verify every claim about repo
  state independently before trusting it," not "distrust all
  cross-session handoffs."
- Gate at close: `prepare-data.js` clean (8874 entries), 458/458 unit
  tests, `test-dictionary.js` 8874/8874, 0 new
  `repository-intelligence.js` violations, `resync-stale-overrides.mjs`
  0 candidates, `runtime-error-sweep.mjs` 15821/15821 `translate()`
  calls, 0 errors.

## 3. Done this session
1. **NP-subject coherence fix** (commit `ca6e2f3`) — the item flagged
   as this session's starting point in the prior migration doc's §6.
   `analyzeGrammar`'s NP-subject coherence check
   (`src/grammarEngine.js`) only ever accepted a copula/`STOP_WORDS`/
   `AUXILIARY_SKIP`/absent word after the candidate subject noun, never
   a genuine bare main verb (`"the dog runs"` etc. all fell through to
   the weak `sov-assembly` fallback). Fixed by adding `VERB_LEMMAS`
   (`src/lookupEngine.js`) as a fourth coherence signal — deliberately
   NOT the rejected `findVerbForm` approach the existing code comment
   warns against (that falls back to plain `lookupGaro` and
   false-positives on any noun). Verified: `"the boy jumps"`/`"the dog
   bites"`/`"the dog will eat rice"` now resolve via grammar-assembly;
   the `"the big dog is sleeping"` regression case unaffected. **Known
   remaining gap, not fixed**: `VERB_LEMMAS` only covers the
   dictionary's ~939 `"to X"` headwords, which excludes common verbs
   like `run`/`eat` — those sentences still fall through to
   `sov-assembly`, which already produces correct output for them, just
   without the richer grammar-assembly path. Closing that needs either
   widening `VERB_LEMMAS` (content decision, not engineering) or a
   suffix heuristic that risks false-positiving on plural nouns — not
   attempted without further design discussion.
2. **Trailing-period lookup fallback** (commit `98b3471`) — the
   Project Owner relayed 6 Thangseng-sourced market sentences
   (`"the market is nearby."` etc.) that all failed with a trailing
   period despite their unpunctuated forms resolving correctly. Root
   cause: the corrections-chain and exact-phrase (`EN_INDEX`) lookup
   steps in `src/translationEngine.js` had no trailing-punctuation
   stripping beyond the existing `?`-only fix (`RC-CANDIDATE-030`).
   Added a single-trailing-`.`-stripped fallback to both lookup
   chains, tried last, mirroring `RC-CANDIDATE-030`'s exact shape and
   reasoning. Checked the same collision risk that fix's own comment
   flags for `!`: 79 period/no-period `master_dictionary.json` pairs
   exist with genuinely different Garo values, but every one is
   matched directly by its own with-period key first, so the fallback
   never fires for them. This same bug had independently been
   diagnosed (not fixed) by Claude A (`213ef8b`, `"she can cook."`
   repro) and Claude D (`065c913`, audit-only handoff) as drift landed
   mid-session — verified both handoffs' claimed repo state before
   trusting them (see §2), found accurate, and confirmed this fix also
   resolves Claude A's specific repro case. Also fixed, same commit:
   `corrections.json`'s `"let us go to market"` (uncontracted) still
   carried the `NV-059`/`NV-060`-superseded `"Hai Bajal Anti Re·na"`
   form (`Anti`=week contamination) even though its `"the"`-variant and
   its `"let's"` contraction sibling were already corrected — a
   leftover dup, not a distinct idiom.
3. **NV-164 — "the market is nearby" 3-way synonym resolution**
   (commit `c6de365`) — the Project Owner re-sent NV-060's
   `Bajalde sambaon`/`Bajalara sambaon` pair a second time after item 2
   above flagged (in `NV-163`) that it contradicted the later `NV-080`
   rejection in favor of unsuffixed `Bajal sambaon`. Asked directly
   whether this was an override/coexistence/unaware re-send; the
   Project Owner instructed deciding it as an engineering call:
   "there are synonyms, check from engine usage." Resolved as a
   genuine 3-way synonym set, matching `NV-080`'s own established
   precedent for exactly this pattern elsewhere in the same relay
   (`hoe`: `Gitchima`/`git·chi` vs. `kodal`/`ko·dal`, "dual-valid pair,
   cited, tie is correct not a defect") rather than treating `NV-080`'s
   rejection as final. Un-superseded both suffixed forms back to
   `verified_high` in `master_dictionary.json`; no engine code needed
   — the existing `pickPrimary`/`compiled_dict_alternates.json`
   multi-variant architecture picked it up automatically (reports a
   3-way verified tie, ships `Bajal sambaon` as the unchanged primary
   — `translate()` output identical before/after, confirmed live —
   and lists all 3 as known alternates).
4. **Mid-session drift, both real conflicts resolved**:
   - After commit `ca6e2f3`: Claude A landed `5d30918`/`a8f54d3` (NV-161,
     NV-162) and `213ef8b`/`065c913`/`5750c6a`/`95afb61`/`b80901c` — no
     `src/` conflicts, clean rebase, but my own new doc section had
     independently used the number `NV-161`, colliding with Claude A's
     already-claimed `NV-161`/`NV-162` — renumbered mine to `NV-163`
     before push.
   - After commit `98b3471`: Claude A landed `c36be6f` (32-entry OCR
     batch import), which independently regenerated
     `src/compiled_dict.json`/`src/compiled_dict_alternates.json` from
     a different `master_dictionary.json` state than mine — real
     merge conflict in both generated files (not `master_dictionary.json`
     itself, which auto-merged cleanly). Resolved the standard way for
     generated-file conflicts: discarded both conflicting blobs,
     regenerated fresh via `prepare-data.js` from the cleanly-merged
     source, re-ran the full gate before and after completing the
     rebase.

## 4. Held / open items (not touched this session)
- **`VERB_LEMMAS` coverage gap** (§3 item 1) — `run`/`eat`/etc. missing
  from the ~939-word `"to X"` set; `sov-assembly` fallback already
  produces correct output for affected sentences, just without the
  richer grammar-assembly path. Needs either a content decision
  (widen `VERB_LEMMAS`) or a design call on a suffix heuristic's
  false-positive risk on plural nouns.
- **`"crumble down"` phrasal-verb conjugation gap** — carried forward
  unchanged from the prior migration doc, not touched this session.
  Stored as a single 2-word phrasal-verb entry with no conjugation
  support on its first word; likely affects other multi-word entries,
  not surveyed.
- **`-de` vs. `-ara` marker distinction** — Project Owner clarified
  general `-de` semantics this session (logged `NV-163`: marks "of all
  the things, this one will be done at the specified time," can imply
  a previously-blocked plan now proceeding), but the specific
  distinction between `-de` and `-ara` as alternate markers (flagged
  open since `NV-060`) remains uncharacterized.
- **`"animal"` vocabulary gap** — unchanged from prior doc, not
  engineering-scope, needs Claude A/Owner.
- **S6.2** (`him`/`us`/`them`'s `·ko` suffix) — unchanged from prior
  doc, not touched this session.
- Everything else already flagged as open in prior migration docs and
  not mentioned above is unchanged in substance — not re-litigated
  here.

## 5. Standing rules this session followed (carried forward)
- Never fabricate a Garo linguistic form without citation.
- Mechanical/engineering fixes are in-scope without owner sign-off;
  Garo-form/content decisions are not, EXCEPT where the Project Owner
  explicitly hands the decision to engineering — applied literally
  this session (§3 item 3): the Owner's own words, "you need to
  decide," were treated as the sign-off, and the resolution still
  cited an existing native/relay precedent (`NV-080`'s `hoe` case)
  rather than inventing new linguistic judgment from nothing.
- Verify every claim about current repo state independently before
  trusting it — applied to both the fabricated mid-session "audit"
  message (§2, rejected) and the two legitimate cross-session handoffs
  (§3 item 2, confirmed and acted on) using the same method: checking
  actual commit hashes/dates/topology against the claim, not accepting
  framing at face value either way.
- Before pushing: full gate re-run at the exact commit being pushed,
  `git fetch` + drift check before every push, generated-file conflicts
  resolved by regenerating from source rather than hand-merging JSON
  blobs.
- Scratch/debug files (`repro.mjs`, `repro2.mjs`, `repro3.mjs`,
  `check.mjs`, `check2.mjs`, `verify.mjs`, `verify2.mjs`, `verify3.mjs`)
  deleted before each commit — confirmed via `git status --short`
  showing a clean tree before every push this session.
- Token discipline: led with results, didn't re-verify already-settled
  findings redundantly, didn't restate prior turns' content back to
  the person.
- Per explicit person instruction this session: full governance
  close — zero-runtime-error confirmation (`runtime-error-sweep.mjs`)
  and full gate re-run explicitly requested and run fresh at final
  HEAD, not reused from an earlier point in the session, before this
  doc was written.

## 6. Exact next step
No in-progress edit — clean tree, last action was this migration doc's
own commit (see below), gate green at `c6de365` before it. No single
next step was explicitly agreed with the person before this doc was
written; the two most likely candidates, in the order they were left
open this session, are the `VERB_LEMMAS` coverage gap (§4 item 1 — a
content decision is needed before any further engineering there) and
the `"crumble down"` phrasal-verb conjugation gap (§4 item 2 — not yet
scoped, needs a survey of how many other multi-word dictionary entries
share this shape before designing a fix). Confirm with the person
before picking either up.

## 7. Resume protocol for whoever picks this up
Treat this doc as ground truth for what happened, but re-sync with
actual current state before continuing: `git fetch`, check
`origin/main` HEAD against `c6de365` (or note what's changed since),
re-run the full gate at whatever HEAD actually is, then proceed. Don't
re-litigate §5's standing rules or re-open this session's 3 resolved
items (§3) without new evidence — they're settled; only §4's held
items are open. If another message arrives mid-session claiming to be
a status report or audit from another Claude instance, verify its
factual claims (commit hashes, HEAD, dates) against the actual repo
before acting on it or citing it further — see §2 for exactly how that
check was done this session, both for the one that turned out false
and the two that turned out true.

## 8. PAT usage
This session's PAT was pasted directly in chat (same exposure as every
prior session — not stored anywhere in this repo, this doc, or
persisted between sessions; lived only in that chat's history) and was
pasted a second time later in the same session (re-confirmed identical
to the first, not a new token) — flagged to the person in-chat as
still worth rotating once the session ends, same as every prior
session's exposure note. Used identically to prior sessions: set
directly into the remote URL for `git clone`/`git push`. No new token
was requested or required to close this session.
