# Claude B Session Migration — 2026-09-23B (session close)

## Resume protocol for the next Claude B

1. Read `.ai/SESSION_BOOTSTRAP.md` first, then this doc.
2. `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` (Rule 13) is mandatory
   reading every session, not just on first bootstrap.
3. `git fetch origin`; compare against `repository.head` in
   `.ai/WORKSTATE.yaml` (pinned below); run
   `git log --oneline <head>..origin/main` and review everything since
   that checkpoint before touching anything — do not assume this doc's
   account of the repo is still current the moment a new session opens.
4. Re-run the full gate at whatever HEAD you actually land on before
   doing any new work: `node prepare-data.js && node test-dictionary.js
   && node repository-intelligence.js && node --test tests/unit/*.test.js
   && node scripts/runtime-error-sweep.mjs`.

## Session summary

Resumed this session via `docs/CLAUDE_B_SESSION_MIGRATION_20260923.md`
(pinned HEAD `c6de365`) — resync found 3 commits of drift (Claude D
session-close, Claude A resync note, my own prior session's close doc
commit), all `.ai/WORKSTATE.yaml`/`docs/` only, zero `src/` impact,
confirmed via full gate re-run before continuing.

Two items of work, both reported to and confirmed correct by the
person live in chat:

1. **AI-003 logged (docs-only, commit `7ed8307`)**: investigated the
   long-held "crumble down phrasal-verb conjugation gap" item carried
   forward unchanged across several prior sessions. Root cause: this
   was never really about `"crumble down"` specifically — `VERB_LEMMAS`
   (`lookupEngine.js`) includes every multi-word `"to X"` dictionary
   key with no length cap, but all 3 consumers match against exactly
   one tokenized English word at a time, so **any** multi-word lemma is
   invisible to the matcher entirely (confirmed: 609/955, 64%, of all
   `VERB_LEMMAS` entries are multi-word). Live repro: `"it crumbled
   down"` → `"Ua ka·ma·ko"` (`"crumbled"` matched nothing and was
   silently dropped; `"down"` independently hit `corrections.json`'s
   unrelated `"down"→"Ka·ma"` entry and got confidently shipped in its
   place — no `[UNKNOWN]` anywhere to flag the failure). Also found:
   most of those 609 multi-word lemmas are long OCR-gloss headwords
   (up to 29 words), not genuine 2-word phrasal verbs, so a naive
   fix (n-gram matching across the whole set) would trade this failure
   for a worse one (coincidental word-sequence false positives in
   unrelated sentences). No matcher fix shipped — logged per governance
   §2 as AI-003 (new mechanism, not matching AI-001/AI-002), full
   finding + a scoped recommendation (word-count cutoff decision needed
   before any matcher change, likely needs Claude A/D input on whether
   long-gloss rows should keep feeding `VERB_LEMMAS` at all) in
   `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §4.

2. **`cook` bug fixed (commit `5a072d6`, then reconciled with Claude
   A's concurrent, more complete fix)**: person reported `"cook"`
   translating to `Song·timgipa` instead of `Song·a`. Traced live:
   `corrections.json`'s bare `"cook"` key shipped `Song·timgipa` (the
   `-gipa` agentive noun, "a cook"/chef — same nominalizer pattern as
   `postman`=`Chiti·ra·ba·gipa`) instead of the verb, causing e.g.
   `"I cook rice"` → `"Anga mi·ko Song·timgipa"` (noun used as a finite
   verb). The target row's own citation already said `v:Song·a`; person
   confirmed the verb value directly in chat (sufficient per
   `.ai/PROJECT_OWNER_AUTHORITY.md`, no further proof needed). Fixed
   `corrections.json` and allowlisted the resulting intentional
   corrections-vs-compiled-dict divergence in
   `src/data/known_cross_source_conflicts.json` (`corrections:cook`,
   Check F). **Concurrent with this**, Claude A independently
   diagnosed and fixed the same report at the content layer (commit
   `26b80e9`): split the colliding senses in `master_dictionary.json`
   itself (`"a cook (person who cooks)"`=`Song·timgipa`, merged the
   verb sense into `"to cook"`=`song·a`, promoted it to
   `verified_high`), and independently fixed `corrections.json`/
   `phrase_maps.js` to match. Claude A's merge commit `dc3676c` already
   reconciled both parallel fixes before this session picked the
   thread back up — resync found the merge already done, verified the
   merged state is fully consistent (no leftover case-mismatch, no
   duplicate/contradictory allowlist entries) and re-ran the full gate
   fresh rather than assuming the merge commit's own claims were
   sufient. Live-verified post-merge:

   | input | output | method |
   |---|---|---|
   | `cook` | `Song·a` | correction |
   | `to cook` | `song·a` | exact-phrase |
   | `Cook` | `Song·a` | correction |
   | `a cook (person who cooks)` | `Song·timgipa` | exact-phrase |
   | `I cook rice` | `Anga mi·ko Song·a` | grammar-assembly |
   | `I will cook` | `Anga Song·gen` | correction |

   All 6 correct — noun and verb senses now cleanly separated with no
   remaining collision.

## Gate at close (explicitly re-run fresh at final HEAD per person's
request for full governance + zero-runtime-error confirmation)

- `prepare-data.js`: clean, 8899 entries, 0 errors
- `test-dictionary.js`: 8899/8899 valid entries, 9/9 grammatical
  corrections, JSON compliance ✅
- `repository-intelligence.js`: PASSED — 0 new violations across every
  check (cross-table, self-consistency, pending-lexicon,
  unresolved-placeholder, runtime-cascade/Check F, confidence-schema,
  modifier+noun collision)
- `node --test tests/unit/*.test.js`: **458/458 passing**
- `scripts/runtime-error-sweep.mjs`: **0 errors across 15,862
  translate() calls** (full compiled_dict key sweep, plural/counted-noun
  sample, structural edge cases, type-safety inputs, full API surface)
- `HEAD` verified `== origin/main` after push (see WORKSTATE for the
  exact hash recorded at this close)
- Clean tree — no scratch/debug files shipped

## Held, not reached this session (unchanged in substance from the
prior doc unless noted)

- **AI-003** (this session's own new finding) — investigated and
  scoped, not fixed. See above and
  `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §4.
- **VERB_LEMMAS coverage gap** (run/eat and other common verbs missing
  from the ~939/955-word `"to X"` set) — content decision, not
  engineering, not attempted.
- **-de/-ara marker distinction** — unchanged, linguistic, not Claude
  B's lane.
- **`animal` vocabulary gap** — unchanged, content, not attempted.
- **S6.2** (`him`/`us`/`them`'s `·ko` suffix) — unchanged from prior
  doc, still pending the drafted Thangseng relay reply for `us`.
- **Coverage note from the `cook` fix**: `Song·timgipa` (the noun/chef
  sense) is reachable only via `master_dictionary.json`'s own
  `"a cook (person who cooks)"` key now — no shorter bare-noun
  correction exists for it. Not a defect (the noun sense still
  resolves correctly at that key), just flagged in case Claude A wants
  a shorter alias.

## Security note

The GitHub PAT was pasted directly in chat again this session (a
continuation of the same session that opened with it). Per the
standing note every session leaves: rotate it once this close is
merged in.
