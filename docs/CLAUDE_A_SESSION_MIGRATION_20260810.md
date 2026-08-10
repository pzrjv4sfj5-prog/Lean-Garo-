# Claude A Session Migration Document — 2026-08-10

## Project identity

Lean-Garo: Garo language dictionary and English-to-Garo translation
engine. `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Claude A role:
linguistic authority only (grammar, morphology, dictionary quality,
native validation review). Never touches engine code (Claude B) or
OCR ingestion (Claude D).

## Current state

- **HEAD:** `5114846` (`Claude A: NV-071 follow-up — close rimila/sendil
  raka + dog-counting for good`)
- **origin/main:** matches exactly, verified via `git fetch` +
  `git rev-parse` immediately before writing this document
- **git status:** clean, nothing uncommitted, nothing local-only
- **Entries:** 9178/9178 in `master_dictionary.json`, 8081 unique
  compiled keys in `src/compiled_dict.json`
- **Tests:** 196/196 passing
- **repository-intelligence.js:** PASSED, 0 new violations across all
  checks A–F

## What was done this session (checkpoint `1aad3fe` → `5114846`)

Five commits, chronological:

1. **`cd3e22e`** — NV-070 vocab round (7 items: mouth reconfirmed,
   joking, at, bright, sad, praise the lord all VERIFIED/HIGH;
   direct/straight added AMBIGUOUS pending context split). Also
   re-diagnosed the smile bug (see Held below) and wrote the Claude B
   handoff.
2. **`f5ce978`** — NV-070 follow-up: Thangseng resolved the
   direct/straight ambiguity directly. `joljol`="straight away/
   immediately" (not "direct" as first guessed — that entry was
   SUPERSEDED and corrected). `srongsrong`="straight" promoted to
   VERIFIED/HIGH. `direct` itself left genuinely unresolved. Same
   relay gave a build/cook/shower verb paradigm confirming existing
   RULE-002 (past `-aha`) and RULE-023 (future `-gen`) — no new grammar
   rules needed, just corpus reinforcement + one wrong-root correction
   (`cooking`).
3. **`bf26fb9`** — NV-071: 10-item WhatsApp relay via Tridip (slippery,
   slip, floor, sandal, gender-neutral pronoun finding, TV/on/off
   loanword pattern, start-the-car). Two open questions flagged in
   dictionary notes, not resolved by guessing (see Held below).
4. **`5114846`** — NV-071 follow-up: PO-flagged corrections closed
   permanently. Removed incorrect raka from `rimila`/`sendil`
   (pre-existing corpus error, now confirmed final — fixed every
   occurrence repo-wide). Confirmed `three dogs`/`four dogs`, which
   exposed and fixed a legacy bulk-import corruption affecting 4
   related entries (see below).

## Open items / Held (not resolved this session — genuinely unclear, not guessed)

1. **`Iachi`/`Uachi` vs. `Ianona`** — two directly-attested,
   both-VERIFIED forms for a movement-to-"here"/"there" sense. Possible
   relationship to RULE-044's `-chi`/`-na` suffix system flagged in
   `docs/THANGSENG_NATIVE_VALIDATION.md` (NV-071 section) but not
   resolved. Needs a follow-up native question.
2. **`ka·atbo` vs. `ka·bo`** — same light-verb slot ("turn on TV" vs.
   "start the car"), different suffix shape. Not established whether
   free variation or meaningful (e.g. transitive/causative `-at-`).
3. **`five dog(s)`=`bonga mang·gni` / `fourteen dog`=`chi brang
   mang·gni`** — same legacy classifier-corruption shape as the
   three/four-dogs bug just fixed, but not confirmed by this session's
   relay. Left untouched deliberately.
4. **Claude B — smile bug**, re-diagnosed this session (see
   `docs/CLAUDE_B_HANDOFF_20260809_smile_alias_gap.md`). Root cause is
   `main()`'s bare-infinitive alias gap-fill in `prepare-data.js`
   (`if (bare && !finalized[bare])` never overwrites an existing
   lower-confidence value), NOT `pickPrimary()`'s master-preference
   branch as originally hypothesized in NV-067. Fix not yet
   implemented — engine code, out of Claude A's scope.

## Standing rules established/reinforced this session

- When a corpus fix creates a genuine intentional multi-value key in
  `master_dictionary.json` (old SUPERSEDED value + new VERIFIED value
  both present), `repository-intelligence.js` Check C will flag it as
  a "new self-consistency conflict" — this is expected, not a bug. Fix
  by adding the key(s) to `src/data/known_dictionary_conflicts.json`
  (plain sorted JSON array of English keys) and re-running. Check the
  tool's own FAILED-run instructions; it names the exact file.
  Confirmed working with 4 keys this session.
- New dictionary keys should be checked against
  `src/data/corrections.json` (not just `master_dictionary.json`)
  before choosing a name — a coincidentally-identical English key with
  a full-sentence value there will trigger a Check F cross-table
  mismatch even when the underlying content agrees. (Hit this with an
  "I will cook" key collision earlier in the session, caught before
  commit both times it recurred.)
- Fixing a stale hardcoded test expectation after a genuine data
  correction (not a regression) is in scope and expected — two done
  this session (`RC-CANDIDATE-012` capitalization, `RC-CANDIDATE-037`
  dog classifier value).
- When a WhatsApp relay's native-confirmed value corrects only *some*
  of several near-duplicate legacy entries for the same real-world
  fact (e.g. plural vs. singular-gloss keys, or a value also present
  as a non-master duplicate in `garo_dictionary.json`), check for and
  fix all of them — a partial fix can leave a non-master duplicate
  shipping the old wrong value even after the master row is marked
  SUPERSEDED.

## Repository status at close

- [x] HEAD `5114846`
- [x] origin/main matches exactly (`git fetch` + `git rev-parse`
      confirmed immediately before this document)
- [x] `git status` clean
- [x] `master_dictionary.json` / compiled artifacts up to date with
      HEAD (rebuilt and verified after every edit this session)
- [x] `.ai/WORKSTATE.yaml` updated (latest_10 through latest_13, this
      session's four commits)
- [x] `SESSION_BOOTSTRAP.md` — no new standing rule required beyond
      what's captured in `WORKSTATE.yaml`'s per-commit notes and this
      document's "Standing rules" section above
- [x] This migration document complete
- [x] No local commits ahead of origin
- [x] No uncommitted changes
- [x] Native-validation status: NV-070 and NV-071 both closed (open
      follow-up questions listed above, not blockers)
- [x] Tests: 196/196
- [x] `repository-intelligence.js`: PASSED, 0 new violations (A-F)

## Exact next step

Start a new conversation and paste this document in. On resume: treat
this as ground truth, re-sync with actual repo state (`git fetch` +
`git status` + `npm test`, don't assume nothing changed), then
continue with either (a) a new Claude A task, or (b) coordinate with
Claude B on the outstanding smile-bug handoff.
