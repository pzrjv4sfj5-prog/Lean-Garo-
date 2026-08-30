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

## Full gate

| Check | Before this session | After |
|---|---|---|
| Dictionary entries | 8189/8189 | 8189/8189 (unchanged — no linguistic data touched) |
| Grammatical corrections | 9/9 | 9/9 (unchanged) |
| Unit tests | 254/254 | **264/264** (+10 new, 0 failures) |
| repository-intelligence.js | 0 new violations | 0 new violations |
| `scripts/resync-stale-overrides.mjs` | 0 candidates | 0 candidates (re-run both before and after the item-1 fix) |
| `npx vite build` | — | clean (58 modules, no errors) |

`node_modules` was not present at session start (`npm install` run to
restore it — `node_modules/`/`package-lock.json` remain gitignored, not
committed). `dist/index.html` rebuilt as an expected tracked artifact
(existing repo convention, see prior migration docs).

Propagation verified: all four fixes confirmed live via `translate()`
post-build, not just inspected in source. `compiled_dict.json` entry count
unchanged; only the two targeted alternates keys (`bye`, `bland`) changed
in `compiled_dict_alternates.json`. `docs/SUPERSEDED_ONLY_KEYS.md`,
`docs/PICKPRIMARY_VERIFIED_TIES.md`,
`docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` regenerated identically
(`git status --short` clean on all three after build) — the item-1 fix
did not change which keys are held or tied, only closed the alternates
leak for the two already-decided keys.

## Runtime Handoff

None. All four fixes (SUPERSEDED-notes-fallback, alternates-filter-source,
compound-split silent-drop, gija-construction silent-drop) were
investigated and fixed in this session, each with its own regression
test — nothing deferred silently.

## Remaining items / Next session (unchanged from 20260829B unless noted)

1. **[Linguistic, Claude A/Thangseng]** `master_dictionary.json`'s `"0"`
   → `"don't do"` entry (`confidence: "unverified"`) — still open, still
   flagged, not this session's scope.
2. **[Linguistic, Claude A/Thangseng, pre-existing]** The imperative-vs-
   declarative `wait` sense-collision — unchanged, still open.
3. **[Linguistic, Claude A]** UPDATED this session: the "4 stale-
   confidence citation-hygiene rows (bye, bland ×2, cooked)" item from
   the 2026-08-28 close is now**3 rows resolved from the engineering
   side** (bye, bland ×2 — no longer translation-eligible or
   alternates-leaking, per item 1 above). The remaining linguistic
   half of this item is still open and is now narrower and more
   precise: `master_dictionary.json`'s `confidence` field for exactly
   these 3 rows (`bye`→`"De / Ra / Bai"`, `bland`→`"chi·brek·a"`,
   `bland`→`"·brok·"`) should be corrected from `unverified` to
   `superseded` to match what their own `notes` already say — a pure
   metadata-truth-value correction, not a new judgment (the linguistic
   call was already made, see each row's own note), but per governance
   §6 changing a `confidence` tag's truth value is explicitly Claude
   A's to commit, not Claude B's. The `cooked` row from the same 2026-
   08-28 finding was NOT part of this session's mismatch (its notes do
   not start with "SUPERSEDED" — separate citation-hygiene issue,
   unchanged, still Claude A's).
4. **[Linguistic, Claude A, pre-existing]** The ~300-row no-confidence
   backlog — untouched, still not this session's scope.
5. **[Linguistic, Claude A, pre-existing]** The ~1000-group duplicate-key
   backlog — untouched this session, no data files were modified.

No other engineering-scoped work is outstanding as of this commit.

## Resume protocol for whoever picks this up next

1. `git fetch origin`; confirm local HEAD == origin/main before any work
   (per `repository.head_convention` — compare against live `git log`,
   not just this doc's claimed HEAD).
2. Read `.ai/WORKSTATE.yaml`'s `claude_b.next_action` (top entry) in full
   — supersedes this doc's summary if the two ever disagree post-hoc.
3. Read `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` in full (including §6)
   before making any master-metadata-adjacent edit.
4. If picking up remaining item 3 (the `bye`/`bland` `confidence` field
   correction): this is a 3-row, single-field, already-justified-by-notes
   edit — flag to Claude A/Project Owner as a fast-turnaround item, not a
   full relay-batch question, since the "correct" value is already
   written in each row's own `notes` field.
5. If picking up items 1 or 2: unchanged from prior guidance — needs a
   real Thangseng/native relay question or explicit Project Owner
   decision, not corpus-internal guessing.
