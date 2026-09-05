# Claude B Session Migration — 2026-09-05D

## Project identity
Lean-Garo-: Garo-language translation/dictionary engine
(`master_dictionary.json` -> `prepare-data.js` -> `compiled_dict.json`,
consumed by `translationEngine.js`/`grammarEngine.js`/`sentenceBuilder.js`/
`garo_classifier.js`). Native-speaker (Thangseng) evidence relayed via
Project Owner, logged as `NV-###` in `docs/THANGSENG_NATIVE_VALIDATION.md`.
Multiple agents (Claude A, B, C) work concurrently against the same
`origin/main`; standing rule: `git pull` before every push, renumber the
not-yet-pushed side on NV-number collisions, never overwrite what's
already on `origin/main`.

## Current state (verified, not assumed)
- **HEAD at session start:** `b00ffb9`, matched `origin/main` (confirmed
  via fresh `git pull`, `git status --porcelain` clean before any edit).
- Resynced first per the prior session's own migration doc: `npm install`,
  then ran the full baseline gate (`prepare-data.js`, `test-dictionary.js`,
  `repository-intelligence.js`, `resync-stale-overrides.mjs`,
  `runtime-error-sweep.mjs`, `node --test tests/unit/*.test.js`) before
  touching anything — all clean at baseline (8280/8280 dictionary, 9/9
  grammatical corrections, 314/314 unit tests, 0 repo-intelligence
  violations, 0 runtime errors, 0 resync candidates).

## Directive this session
Prior session's exact next step #2: "Start with the safest, unambiguous
fix first: Defect-class-3 (adjective+animal generic-placeholder
collision, finding #3) — no native-evidence ambiguity, root cause already
isolated to specific master_dictionary.json rows." Per this project's own
"one task at a time" discipline, only this item was actioned — defect-
class-2 (coin/chair/fruits/mountain), item #1 (counting-phrase plurals),
item #4 (65-key verified_high conflicts), and item #5 (phrase-table vs
sentence-assembler architecture) are all still open, untouched.

## What's done this session

### 1. Root cause confirmed and generalized beyond the original finding
Live-probed `translate()` before touching data: `"big dog"`/`"big
cat"`/`"big bird"`/`"big fish"` all resolved to the literal `"gonga
mang"` (exact-phrase, 0.98 confidence) while `"a big dog is sleeping"`
correctly composed `"dal·a Achak tusienga"` via the working sov-assembly
path — confirming the phrase-table entry, not the composition engine, was
wrong. Traced to `master_dictionary.json`: the noun half of every
`"[modifier] [noun]"` phrase-table row in a specific bulk-generated batch
was a generic classifier-shaped word (`mang`/`rang`/`chik`/`chak`) instead
of that noun's own root — a template/generation defect, not a translation
defect.

While fixing the animal case, discovered the **same defect shape recurs
on non-animal nouns under the identical 15-modifier batch** — this
generalizes finding #3 well beyond "adjective+animal":
- `dog`/`cat`/`bird`/`fish` -> `mang` (60 rows — the audit's original finding)
- `house`/`tree` -> `rang` (30 rows)
- `water`/`student`/`river` -> `chik` (65 rows; `river` only exists under
  the 5 possessive modifiers, not all 15)
- `food`/`rice` -> `chak` (25 rows; `food` also possessive-only)

### 2. Fixed 131 rows
For every noun above **except `cat`**, replaced the noun half of the
phrase-table value with that noun's own canonical/compiled root (source
of truth: `src/compiled_dict.json`, already what the working sov-assembly
path produces — no new linguistic data invented, just consistency):
`dog`->`Achak`, `bird`->`do·o`, `fish`->`na·tok`, `house`->`Nok`,
`tree`->`Bol`, `water`->`Chi`, `student`->`Chattro`,
`river`->`chi·bi·ma`, `food`->`al·a`, `rice`->`mi`. Modifier root
(`gonga`, `angni`, etc.) left untouched in every row — re-litigating
whether those adjective roots are themselves correct is the separately-
flagged architecture item (#5), not this fix.

**`cat` rows deliberately NOT touched** (all 15: my/your/his-her/our/
their/big/small/good/bad/hot/cold/new/old/beautiful/ugly + cat): cat's
own canonical root is a genuine unresolved conflict between two
`verified_high` sources (`menggo` vs `meng·gong`) per the prior session's
audit (`docs/CLAUDE_B_SESSION_MIGRATION_20260905C.md`) — flagged there for
Claude A/Thangseng adjudication. Fixing the noun for every OTHER animal
without guessing a cat answer is exactly the boundary of this fix, per
this project's "do not make independent linguistic decisions where Claude
A owns the canonical data" rule.

### 3. Added general validation (repository-intelligence.js CHECK H)
`checkModifierNounPlaceholderCollision()`: detects the defect **shape**
(2+ different nouns sharing byte-identical Garo output under the same
modifier), not any hardcoded noun name. A first draft ran over ALL
two-word English phrases and was too noisy to use: numeral-classifier
phrases (`"one X"`.."twenty X"") legitimately reuse one classifier suffix
across dozens of unrelated nouns (real Garo grammar, tracked separately as
the counting-phrase issue — not this defect), and `"to X"` infinitive
entries legitimately collapse genuine English synonyms onto one Garo word
(`"to bloom"`/`"to blossom"`). Scoped the check to the confirmed
15-modifier batch (possessive pronouns + the specific adjective set this
generator actually used) to keep the signal clean. Baseline file
`src/data/known_modifier_noun_collisions.json` is currently empty — once
dog/bird/fish/house/tree/water/student/river/food/rice were fixed, the
remaining `cat` rows are singletons per modifier (no other noun shares
their value anymore), so there's nothing left to allowlist; if cat's root
is ever fixed and happens to collide with something else, this check will
catch it fresh.

### 4. Regression coverage
`tests/unit/adjective_animal_mang_placeholder.test.js`, 2 tests:
- Asserts dog/bird/fish (all 15 modifiers) and house/tree/water/student/
  river/food/rice (modifier-appropriate subset) each end with their own
  canonical root and are pairwise distinct from their former collision
  partners.
- A deliberate **"cat rows must still be the SAME known placeholder"**
  guard — not a correctness assertion, a tripwire so nobody's future edit
  silently picks a cat root here without also updating the audit/
  migration trail.

## Gate results (after this session's fix, before commit)
- `prepare-data.js`: 8280 unique entries compiled, clean.
- `test-dictionary.js`: 8280/8280 valid, 9/9 grammatical corrections.
- `repository-intelligence.js`: 0 NEW violations across all 8 checks
  (A–H), including the new CHECK H (0 known, 0 new).
- `scripts/resync-stale-overrides.mjs`: 0 candidates.
- `scripts/runtime-error-sweep.mjs`: 0 errors across 14,771 `translate()`
  calls (full compiled_dict key sweep + plural/counted-noun sample +
  structural/type-safety edge cases + full API surface).
- `node --test tests/unit/*.test.js`: **317/317** (was 314, +3: 2 new test
  cases in the new file, one of which iterates a matrix — counted as 2
  named tests + subtests in `node --test` output).
- `npm run build` (full pipeline incl. `vite build`): clean.

## Cat word/phrase/sentence results (unchanged this session, for the record)
- `translate("cat")` -> `meng·gong` (phrase-map, 0.99)
- `translate("big cat")` -> `gonga mang` (exact-phrase, 0.98) — still the
  known placeholder, unfixed, by design
- `translate("a big cat is sleeping")` -> `dal·a meng·gong tusienga`
  (sov-assembly, 0.75)
Still diverges from `big cat`'s own phrase-table entry, same as every
other animal did before this session's fix — but fixing it requires
picking `menggo` or `meng·gong` first, which is not this session's call.

## Plural/counting results
Not this session's scope (defect-class-1, "two cats" vs "two cat" plural
resolution) — untouched, still open, see prior migration doc.

## Adjective+noun results
See "What's done" above — 131 rows fixed across 10 nouns, all now
matching their sov-assembly composition path's root.

## Remaining A-owned linguistic dependencies
- `cat`: `menggo` vs `meng·gong` — needs an explicit Thangseng-sourced
  answer before any fix touches cat specifically (both the standalone
  word AND the 15 `[modifier] cat` phrase rows this session left alone).
- Everything else flagged in the prior audit doc
  (`docs/CLAUDE_B_SESSION_MIGRATION_20260905C.md`) not yet actioned:
  `coin`/`chair`/`fruits`/`mountain` counted-phrase-vs-standalone root
  reconciliation (defect-class-2); the 65-key `verified_high`-vs-
  `verified_high` schema gap (finding #5 in that doc, now item #4 in the
  Project Owner's remediation spec).

## Remaining engineering issues
- Item #1 (counting-phrase plural failure, "two cats" -> wrong output) —
  not started this session.
- Item #5 in the Project Owner's remediation spec (phrase-table vs
  sentence-assembler duplicate adjective+noun composition mechanisms) —
  the root-level noun mismatch is now fixed for these 10 nouns, but the
  underlying architecture (two independently-maintained composition
  paths for the same content) is unchanged. Still flagged for a design
  pass, not a quick patch, per the prior session's own precedent for
  architecture-scale findings.
- Test coverage (item #8 in the spec) is now non-zero for cat (partial —
  covers the "still broken, known" state, not full word/phrase/sentence
  matrix) and fully covers the 10 newly-fixed nouns for the phrase shape
  specifically; the broader word→phrase→sentence generalization matrix
  (item #9) across dog/cat/elephant/bird is still not built.

## Exact next step
1. `git pull` (or fresh clone) first regardless; confirm HEAD ==
   `origin/main` before any edit.
2. Next unambiguous item per the Project Owner's remediation spec and the
   prior session's own ordering: **Defect-class-2** — reconcile
   `coin`/`chair`/`fruits`/`mountain`'s counted-phrase-family root against
   their own standalone compiled entry (NOT `cat` — still blocked on
   Thangseng).
3. Relay the `cat`-specific `menggo` vs `meng·gong` question to Thangseng
   whenever there's a channel to do so; hold that node open until an
   explicit answer comes back. Do not fix any `cat` row (standalone or
   phrase-table) before that answer arrives.
4. After each fix: re-run `runtime-error-sweep.mjs` + full unit suite +
   `repository-intelligence.js` before moving to the next item — zero
   run-time tolerance, per the Project Owner's own directive.
5. Do NOT batch defect-class-2, item #1, item #4, or item #5 into one
   commit — one task at a time, per this project's standing discipline.

---
**Start a new conversation and paste this document in to resume.**
