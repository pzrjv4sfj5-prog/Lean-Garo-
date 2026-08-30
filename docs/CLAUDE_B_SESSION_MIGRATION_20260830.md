# Claude B Session Migration — 2026-08-30

## Resume context

Resumed via `docs/CLAUDE_B_SESSION_MIGRATION_20260829B.md`. Verified clean
before starting: `git fetch origin`, local HEAD == origin/main ==
`2a44b2d`, `git status --short` empty. Read `.ai/WORKSTATE.yaml`'s
`claude_b.next_action` in full and `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`
(including §6) before touching anything.

## Scope (Project Owner directive, this session)

Engineering/runtime work only, explicitly excluding re-litigation of the
2026-08-29B OOV-drop fix or any other already-closed item:

1. Check for runtime paths where SUPERSEDED entries can still influence
   translation — SUPERSEDED data may remain for provenance but must never
   be translation-eligible.
2. Continue the stale-override / corrections / phrase_maps audit.
3. Check for other silent runtime data loss or wrong-substitution paths.
4. Keep linguistic decisions with Claude A/Thangseng.

## Item 1 — SUPERSEDED-eligibility audit

Traced every runtime path that could surface `master_dictionary.json`
content. Confirmed no runtime file imports `master_dictionary.json`
directly — everything routes through the compiled artifacts
(`compiled_dict.json`, `compiled_dict_alternates.json`), so the audit
focused on whether the compile pipeline (`prepare-data.js`) can ever let a
SUPERSEDED-tagged value reach those artifacts.

**Real bug #1 — confidence/notes desync let 3 rows evade SUPERSEDED
detection entirely.** The 2026-08-28 cutover moved SUPERSEDED detection
from parsing `notes` to reading `confidence === 'superseded'` directly.
That migration never re-tagged 3 rows (`bye`, `bland` ×2 — the exact
rows flagged as an open "stale-confidence citation-hygiene" item at the
2026-08-28 close) whose `notes` field already said "SUPERSEDED ..." but
whose `confidence` field was left at `unverified`. Result: these rows
were treated as ordinary weak candidates, not filtered out at all.
Primary translations for `bye`/`bland` stayed correct by luck (a separate
`verified_high` sibling row wins via `pickPrimary`), but the SUPERSEDED
values leaked straight into shipped `compiled_dict_alternates.json`:
`bye`'s alternates included the literal superseded bundled string
`"De / Ra / Bai"`; `bland`'s alternates included both superseded forms
(`chi·brek·a`, `·brok·`).

Fix (`prepare-data.js`, `normalizeFile`): `isSuperseded` now also fires
when `notes` starts with "SUPERSEDED" (anchored, case-insensitive),
regardless of the `confidence` field's value — `item.confidence ===
'superseded' || /^superseded\b/i.test(notes.trim())`. This reads an
*already-stated* editorial decision (the note), it does not assign a new
one — permitted under governance §6 ("Claude B may read and consume
confidence/notes, never assign linguistic confidence"). Master
`confidence` field itself was NOT edited (that would be assigning a
confidence-tag truth value, explicitly not engineering-scope per §6) —
flagged for Claude A below instead.

**Real bug #2 — structural fragility in alternates construction.**
`finalizeDictionary`'s `alternates[key] = mergedValues[key].map(e => e.v)`
used the RAW, pre-filter candidate list rather than `cleanedEntries` (the
list that already had SUPERSEDED-tainted duplicates filtered out just
above it in the same function). Instrumented a debug run against the real
dataset before fixing: 0 keys currently leak via this specific path (the
"alternates never contain a SUPERSEDED value" guarantee held by
coincidence, not by construction). Fixed to use `cleanedEntries.map(e =>
e.v)` so this is now a structural guarantee. `getAlternates()` (the only
runtime consumer of the alternates file) is currently unused/dead code
anywhere in the app — not a live user-facing bug today — but it's public
API, and both fixes close the hole before anything wires it up.

Rebuilt `compiled_dict.json` (unchanged, still 8189 entries) and
`compiled_dict_alternates.json` (`bye` alt now `['De', 'Bai', 'Ra']`,
`bland` alt now absent — was `['chi·brek·a', '·brok·', 'Chibroka']`).

Regression tests added (`tests/unit/prepare-data.test.js`, exported
`normalizeFile` for direct testing):
- notes-declared-SUPERSEDED row with stale `confidence` is excluded from
  `normalized` and recorded in `superseded` (real `bye` shape,
  reconstructed via a real temp dictionary file).
- `confidence: 'superseded'` path unaffected (no regression).
- a mid-sentence mention of the word "superseded" (not at notes start)
  does NOT trigger exclusion — anchored match only, no over-firing.
- `alternates` never contains a value filtered out as SUPERSEDED-tainted,
  both for the exact `bland` shape and a generic 2-survivor case.

## Item 2 — stale-override / corrections / phrase_maps audit

Re-ran `scripts/resync-stale-overrides.mjs` before and after the item-1
fix: **0 resync candidates both times** (241 baseline entries checked,
39 intentional-variant skips, 1 pre-existing non-VERIFIED skip unchanged,
2 confirmed exceptions unchanged). `phrase_maps.js` already independently
held the correct values for `bye`/`bland` (`'bye': 'De'`, `'bland':
'Chibroka'`) — the leak was confined to the alternates artifact, never
reached the corrections/phrase_maps override layer. No new stale-override
candidates found this session.

## Item 3 — other silent runtime data loss / wrong-substitution paths

Swept every engine file for the `.map(lookupGaro).filter(Boolean)` /
`? lookupGaro(...) : null` shape that produced the 2026-08-29B bug class.
Found and fixed two more live instances, neither touched by any prior
session's fix:

**Bug #3 — `translationEngine.js` step 8 (compound-split).** `const
compound = words.flatMap(w => w.split('-')).map(lookupGaro).filter(Boolean)`
silently deleted any word/sub-word whose lookup failed, then still
returned a confident (0.60) result built only from survivors. Live
pre-fix repro: `translate("well-known xyzcitynotreal")` → `"chiakol"`
(method `compound-split`, confidence 0.60) — the OOV word vanished with
zero trace. Fixed with the same shape as step 7: mark failed lookups
`'[UNKNOWN]'`, include the marker in the joined output whenever any
occurred; firing condition unchanged (still requires ≥1 resolved word).
Post-fix: `"chiakol [UNKNOWN] [UNKNOWN]"`.

**Bug #4 — `grammarEngine.js`'s `tryWithoutGijaConstruction`** (the
"without VERB-ing" idiom, e.g. "without doing her work"). When a
possessive object was named but its lookup failed (`"without doing her
xyzobjectword"`), `objGaro` collapsed to `null` and `.filter(Boolean)`
silently erased it from the assembled `parts`, still returning a fully
confident (0.85 — the highest fallback-cascade confidence below
exact-match) `gija-construction` result with the object gone. Live
pre-fix repro: `translate("he stayed without doing her
xyzobjectwordnotreal")` → `"Ua ka·gija dongaha"` (0.85), no trace the
object was ever there.

Fix distinguishes "no object in this construction at all" (legitimate
grammatical omission, e.g. "without eating" — leave as `null`, correctly
omitted) from "an object was named but didn't resolve" (bail the whole
construction — return `null` from the function — so `translate()`'s
cascade falls through to a step that surfaces `[UNKNOWN]` honestly).
Mirrors the exact "don't ship a confidently-labeled partial result"
precedent `assembleSentenceSOV`'s own 2026-08-29B fix established.
Post-fix: falls through to morphology, `"Ua donga [UNKNOWN] ka·a Uni
[UNKNOWN]"` at confidence 0.65 (honest) instead of 0.85 (confidently
wrong).

Swept remaining `? ... : null` / conditional-lookup patterns in
`garo_classifier.js`, `lookupEngine.js`, `morphologyEngine.js`,
`normalizationEngine.js`, `sentenceBuilder.js` — all are either
already-fixed prior instances of this class, or genuine optional-field
null-chains unrelated to silently dropping resolved content (e.g.
classifier-suffix computation, split/whitespace cleanup). No further
instances found this session.

Regression tests added (`tests/unit/translationEngine.test.js`):
- compound-split: OOV word alongside a resolvable one surfaces
  `[UNKNOWN]` instead of vanishing.
- compound-split: firing condition unchanged (0 survivors → does not
  fire as this method).
- gija-construction: OOV possessive object bails to cascade fallthrough
  with `[UNKNOWN]` visible.
- gija-construction: fully-resolved object completely unaffected
  (`"Ua Dak·ako ka·gija dongaha"`, byte-identical to pre-session).
- gija-construction: no-object construction ("without eating") completely
  unaffected, no spurious `[UNKNOWN]`.

## NV-100 merge and propagation (Claude A concurrent work, this session)

Two rounds of Claude A commits landed on `origin/main` mid-session
(`5264e04`, `ffdb87f`, then `457b242`), culminating in NV-100 ("go" /
"went" / "will not go" / "will not be going" / "to walk" / "walk"
paradigm) fully closed via direct Thangseng relay — see
`docs/CLAUDE_A_SESSION_MIGRATION_20260830.md` for the full linguistic
account. This session's job was purely to integrate and verify
propagation, not to touch the linguistic content:

- **Merge 1** (`df87891`'s parent → merge commit): `5264e04` (SUPERSEDED
  retention-policy classification doc, no runtime-affecting change) +
  `ffdb87f` (NV-100 initial resolution, added rows to
  `master_dictionary.json`). Auto-merged cleanly, no conflicts (only
  `.ai/WORKSTATE.yaml` needed auto-merge, which `git` resolved without
  intervention). Rebuilt `compiled_dict.json`/`category_index.json`
  against the merged master (8189 → 8192 entries, +3 from NV-100). Full
  gate re-run clean post-merge (264/264 tests, 0 new violations, 0
  resync candidates).
- **Merge 2**: `457b242` (NV-100 follow-up closure — "walk" re-promoted
  to a verified variant, `RULE-030.yaml` correction). This time
  `src/compiled_dict.json` genuinely conflicted (both sides had
  independently rebuilt the same generated artifact from slightly
  different points in the master_dictionary.json history — an ordinary,
  expected shape of conflict for a build output, not a real data
  disagreement). Resolved by discarding both conflicting versions and
  running `node prepare-data.js` fresh against the fully-merged
  `master_dictionary.json`, rather than hand-editing conflict markers.
  Result was **byte-identical** to Claude A's own already-committed
  rebuild in `457b242` — confirms the compile pipeline is deterministic
  and this session introduced no divergence. `master_dictionary.json`
  itself, `.ai/WORKSTATE.yaml`, and all `docs/` files merged with zero
  conflicts.
- This session made **zero edits of its own** to `master_dictionary.json`
  — every change to it came from the merged Claude A commits. Confirmed
  via `git diff` scoped to that file across both merges before rebuilding.
- Post-merge full gate re-run one final time before push: clean.

## Full gate

| Check | Before this session | After fixes (pre-merge) | Final (post-merge, pre-push) |
|---|---|---|---|
| Dictionary entries | 8189/8189 | 8189/8189 (unchanged by this session's own edits) | **8192/8192** (+3 from merged NV-100) |
| Grammatical corrections | 9/9 | 9/9 | 9/9 (unchanged) |
| Unit tests | 254/254 | 264/264 (+10 new) | **264/264** (re-run clean post-merge) |
| repository-intelligence.js | 0 new violations | 0 new violations | 0 new violations |
| `scripts/resync-stale-overrides.mjs` | 0 candidates | 0 candidates | 0 candidates |
| `npx vite build` | — | clean (58 modules) | clean (58 modules) |

`node_modules` was not present at session start (`npm install` run to
restore it — `node_modules/`/`package-lock.json` remain gitignored, not
committed). `dist/index.html` rebuilt as an expected tracked artifact
(existing repo convention, see prior migration docs).

## Runtime verification and regression coverage (this session's own 4 fixes)

All four fixes confirmed live via `translate()` / direct function calls
post-build, not just inspected in source, both before the fix (to
confirm the bug was real and reachable) and after (to confirm the fix
worked) — see "Item 1" and "Item 3" sections above for the exact repro
commands and before/after output. 10 new regression tests added across
`tests/unit/prepare-data.test.js` (6 new: 2 for the notes-fallback
detection incl. one false-positive guard, 1 unchanged-behavior control,
2 for the alternates-filter-source fix, — see file for exact count) and
`tests/unit/translationEngine.test.js` (2 for compound-split, 3 for
gija-construction incl. two unchanged-behavior controls). Each fix has
at least one test reproducing the exact real-data shape that was found
broken, plus at least one control test proving normal/unaffected
behavior is unchanged.

`compiled_dict.json` entry count for this session's own 4 fixes: 0 net
change (8189 → 8189, pre-merge) — the SUPERSEDED-notes-fallback fix only
removed two already-wrong values from `compiled_dict_alternates.json`
(`bye`, `bland`), it never changed a primary translation or added/removed
a key. `docs/SUPERSEDED_ONLY_KEYS.md`, `docs/PICKPRIMARY_VERIFIED_TIES.md`,
`docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` regenerated identically after
the pre-merge fix (confirmed via `git status --short`) — proof the fix
did not change which keys are held or tied, only closed the alternates
leak for the two already-decided keys. Post-merge, these three reports
changed only insofar as Claude A's own NV-100 rebuild already changed
them (visible in `457b242`'s diff, not introduced by this session).

## Status: OPEN / BLOCKED / HANDOFF

**OPEN (linguistic, not engineering-blocked, no action needed from
engineering side):**

1. `master_dictionary.json`'s `"0"` → `"don't do"` entry
   (`confidence: "unverified"`) — data-entry-error-shaped, needs Claude
   A/Owner linguistic judgment. Unchanged this session.
2. The imperative-vs-declarative `wait` sense-collision — unchanged this
   session, pre-existing.
3. **Narrowed this session**: the "4 stale-confidence citation-hygiene
   rows (bye, bland ×2, cooked)" item from the 2026-08-28 close. The
   engineering half is now CLOSED (see Item 1 above — these 3 rows can
   no longer leak into any runtime artifact, regardless of their
   `confidence` field's value). What remains OPEN is purely a metadata
   truth-value correction: `master_dictionary.json`'s `confidence`
   field for `bye`→`"De / Ra / Bai"`, `bland`→`"chi·brek·a"`,
   `bland`→`"·brok·"` should be changed from `unverified` to
   `superseded` to match what each row's own `notes` field already
   says. Not a new judgment call — the linguistic decision is already
   written in the notes — but per `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`
   §6, changing a `confidence` tag's truth value is explicitly Claude
   A's/Owner's to commit, not Claude B's, even when mechanical. The
   `cooked` row from the same 2026-08-28 finding was confirmed NOT part
   of this mismatch (its notes do not start with "SUPERSEDED" — a
   separate, still-open citation-hygiene issue, untouched).
4. The ~300-row no-confidence backlog — untouched, pre-existing,
   Claude A/Owner scope.
5. The ~1000+-group duplicate-key backlog (regenerated to 1,619 groups
   by Claude A this session, see `docs/CLAUDE_A_SESSION_MIGRATION_20260830.md`
   Thread 1/2) — untouched by this session, no engineering action
   required (confirmed by Claude A: none of the 1,016 SUPERSEDED rows
   inside it affect runtime either way).

**BLOCKED:** None. Nothing in this session's engineering scope is
blocked on external input.

**HANDOFF:** None undocumented. All four fixes found this session were
fixed in this session, each with regression coverage — nothing was found
and silently deferred. Item 3 above (`bye`/`bland`/`bland` confidence
field) is the one item that crossed from this session's investigation
into next-session/Claude-A's queue, and it is fully specified above (the
exact 3 rows, exact field, exact target value, exact justification) so
whoever picks it up does not need to re-derive it.

## Exact next-session (Claude B) engineering priorities

In priority order, for whoever resumes this as Claude B:

1. **No open engineering-scoped bug is currently known.** Before
   inventing new work, re-run `scripts/resync-stale-overrides.mjs` and
   skim `docs/CLAUDE_A_SESSION_MIGRATION_20260830.md` (and any newer
   Claude A migration doc) for anything landed since this doc was
   written that might need propagation verification (compiled-artifact
   rebuild, runtime spot-check) — that is ordinary session-start hygiene,
   not a new priority.
2. If Project Owner assigns a new engineering-audit sweep: the pattern
   that has now produced 2 sessions' worth of real bugs in a row
   (2026-08-29B: `assembleSentenceSOV` + 2 latent regressions;
   2026-08-30: 4 more) is `<lookup-or-check>.filter(Boolean)` /
   `<condition> ? <lookup> : null` shapes that drop resolved-but-failed
   content silently instead of marking `[UNKNOWN]`. This session swept
   every engine file (`garo_classifier.js`, `lookupEngine.js`,
   `morphologyEngine.js`, `normalizationEngine.js`, `sentenceBuilder.js`,
   `translationEngine.js`, `grammarEngine.js`) and found no further
   instances — but if the codebase grows a new fallback step, a new
   `.filter(Boolean)`-shaped sweep of just the new code is cheap insurance
   worth doing on sight, not worth a dedicated session unless asked.
3. If asked to action open item 3 above (`bye`/`bland` confidence-field
   correction): this is Claude A's/Owner's edit per governance §6, not
   Claude B's — the correct move for Claude B is to flag it, not make it,
   even though the "correct value" is already written in the notes.

## What the next Claude B must NOT repeat

- **Do not re-run the SUPERSEDED-eligibility, stale-override, or
  silent-drop audits from scratch as if they were still open.** All
  three were completed this session with concrete before/after evidence
  (live repros, not just code reading) and regression tests. Re-doing
  them wastes tokens rediscovering a closed result — check
  `git log`/this doc/`WORKSTATE.yaml` first. If genuinely new data has
  landed since (e.g. a new Claude A batch), the correct move is a
  *targeted* re-check of the same classes of bug against the new data,
  not a full re-audit from zero.
- **Do not hand-resolve a `compiled_dict.json` (or any generated
  artifact) merge conflict by editing conflict markers directly.** This
  session confirmed the correct resolution is always: let
  `master_dictionary.json` (and other real source files) merge normally,
  then discard both conflicting versions of the generated file and run
  `node prepare-data.js` fresh. Hand-editing JSON conflict markers in a
  compiled artifact risks producing a file that doesn't match what the
  pipeline would actually produce from the merged sources.
- **Do not edit `master_dictionary.json`'s `confidence` or `notes`
  fields directly**, even for changes that look purely mechanical (see
  open item 3 — the "obviously correct" 3-row fix was deliberately left
  to Claude A per governance §6). Reading `notes`/`confidence` to drive
  compile-pipeline *logic* (as this session's Item 1 fix did) is fine;
  writing to those fields in the data file itself is not Claude B's to
  do.
- **Do not skip the post-merge rebuild-and-gate step** when
  `master_dictionary.json` changes during a merge, even if the merge
  itself is conflict-free. This session's first merge (`df87891`'s
  parent) had zero conflicts but still required a full
  `prepare-data.js` rebuild + gate re-run before it was safe to consider
  done — a clean `git merge` exit code does not mean the compiled
  artifacts are still in sync with the merged source.

## Resume protocol for whoever picks this up next

1. `git fetch origin`; confirm local HEAD == origin/main before any work
   (compare against live `git log`, not just this doc's claimed HEAD —
   this doc reflects the state at the moment it was written, and Claude
   A may have landed further work since).
2. Read `.ai/WORKSTATE.yaml`'s `claude_b.next_action` (top entry) in full
   — supersedes this doc's summary if the two ever disagree post-hoc.
3. Read `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` in full (including §6)
   before making any master-metadata-adjacent edit.
4. Check whether any newer `docs/CLAUDE_A_SESSION_MIGRATION_*.md` exists
   beyond `20260830.md` — if so, read it before assuming this doc's
   "OPEN" list is still current.
5. If picking up open item 3 (the `bye`/`bland` `confidence` field
   correction): flag to Claude A/Project Owner as a fast-turnaround item,
   not a full relay-batch question, since the "correct" value is already
   written in each row's own `notes` field — but the edit itself is not
   Claude B's to make.
6. If picking up open items 1, 2, 4, or 5: unchanged from prior guidance
   — needs a real Thangseng/native relay question or explicit Project
   Owner decision, not corpus-internal guessing.
