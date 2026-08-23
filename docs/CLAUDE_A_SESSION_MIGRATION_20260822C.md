# Claude A Session Migration — 2026-08-22 (session C, NV-089/089b/090/091)

## Resume checkpoint
- **Final HEAD (this session's last commit, pushed): `13d951c`**
- `HEAD == origin/main`, clean working tree, zero divergence — verified
  immediately before writing this document.
- Resumed this session from `1dae44e` (top-of-file pointer in
  `.ai/SESSION_BOOTSTRAP.md`), which was itself Claude C's self-pushed
  commit adding `docs/THANGSENG_RELAY_TABLE_20260821B.md` and
  `docs/CLAUDE_C_TRANSCRIPT_ANALYSIS_20260821B.md`.
- Mid-session, origin advanced 4 commits (`ba5a426`..`6cf1121`, Claude B:
  AI-001 subclass (b) auto-enumeration, confidence-schema proposal
  draft, session close, PICKPRIMARY_NO_VERIFIED_CANDIDATE.md triage) —
  rebased cleanly, zero conflicts (docs-only work, no overlap).

## What this session did (Claude A's own work only)

Processed `docs/THANGSENG_RELAY_TABLE_20260821B.md` in full, across four
sub-batches as new native data arrived from the Project Owner over the
course of the session — **NV-089, NV-089b, NV-090, NV-091** in
`docs/THANGSENG_NATIVE_VALIDATION.md`. That file is the source of truth
for full per-item disposition; this document summarizes, doesn't
duplicate it.

**NV-089** (initial relay-table pass, CONFLICT rows → tied-candidates →
new vocab, per the bootstrap resume instructions):
- 14 UNVERIFIED/HIGH → VERIFIED/HIGH promotions (exact-match confirmations)
- ~25 new VERIFIED/HIGH entries (new vocab, dead/dried sense-splits, 3
  explicitly-rejected-construction replacements, tense/orthography fixes)
- Tied-candidate judgment calls: elephant (mong·ma designated primary),
  outside (A·pal un-superseded, defecate-collocation caveat added)
- Closed the live `translate("king")` bug (Raja VERIFIED/HIGH, 2 junk
  classifier-metadata rows SUPERSEDED — still needs Claude B's
  structural `pickPrimary` fix for durable closure, not done here)
- film added (new VERIFIED/HIGH, direct loanword)
- Fixed 2 stale `phrase_maps.js` entries (goodbye, i am sad) + 1
  `corrections.json` punctuation mismatch (hurry) per Rule 8

**NV-089b** (direct reconfirmation, same session): `you` = `Na·a`
confirmed directly, resolving that flag from NV-089 — `"you (singular)"`
promoted VERIFIED/HIGH; `"you"="Nang"` NOT superseded, flagged instead
as likely a possessive/oblique case-form. Plus citations added to
several already-correct-but-uncited phrase-book entries (thank you,
please, excuse me, good morning/afternoon/evening/night, see you
again), and a new disambiguated `"sorry (short greeting)"="Kema"` entry
(register variant of the full-word `"sorry"="Kema·bi·a."`).

**NV-090**: thief/very/wait/walking/when/which/why/yes batch. Citations
for exact matches, new coexisting alt-forms for near-matches (not
superseding uncited existing candidates), and `yes(alt)=Am` added —
flagged as directly contradicting master's VERIFIED `yes=Oe`.

**NV-091**: sit-cluster/smelly/song/stand/stay/stop/studying/tasteless/
teach/tell/telling + `Hoe=yes` batch. Citations for exact matches, new
coexisting alt-forms for near-matches. Fixed a genuine runtime bug
(`corrections.json`'s stale `stand="Chakata"` override, shipping the
wrong candidate over the now-VERIFIED `Chadenga` — corrected directly
per Rule 8, not allowlisted).

## Key open finding — surfaced this session, not resolved

**`yes` is now a three-way: `Oe` (master's VERIFIED tag) / `Am`
(pre-existing `corrections.json` override — i.e. what `translate()`
actually ships today, predates this session) / `Hoe` (this session's
NV-091, also used sentence-internally elsewhere in the corpus, e.g.
`"yes, of course."="Hoe mangenva."`).**

This is the single highest-priority item for the next session. It
needs an explicit Thangseng question (register/dialect variants? one
stale? different senses?), not a guess — see the "Runtime Handoff note,
NV-090/091" entry in `docs/THANGSENG_NATIVE_VALIDATION.md` for full
detail on how the three candidates were each discovered.

## Verification performed this session

- **Full `npm run build` gate, run repeatedly (after every sub-batch):**
  final state 8159 entries, 9/9 grammatical corrections, 220/220 unit
  tests, 0 new repository-intelligence violations across all checks
  (A–F). All new Check C self-consistency pairs and Check F
  runtime-cascade agreements from this session's own edits are
  allowlisted in `src/data/known_dictionary_conflicts.json` with
  citation — nothing allowlisted without a reason logged.
- **Full runtime-error sweep** (`node scripts/runtime-error-sweep.mjs`):
  14,566 `translate()` calls (every compiled key, plural forms,
  counted-noun forms, structural edge cases, type-safety null/undefined
  inputs, full exported API surface) — **0 errors**.
- **Duplicate-representation check** (exact `(english, garo)` row
  duplicates in `master_dictionary.json`): 10 found, **all pre-existing,
  none introduced by this session's ~40+ added/edited rows**. Logged in
  NV-091 as a separate future cleanup item (e.g. "one dog", "hope",
  "pen", "tax", "3", "two dogs", "three books", "ten birds", "one plate
  of rice" — legacy import duplicates, several look like mechanically
  re-generated counting-phrase artifacts).
- Direct spot-check via `await mod.translate(word)` for a sample
  spanning the whole batch (stand, sitting, sit down, song, tell,
  telling, studying, you, sorry, yes, king, film, tasteless) — all
  resolve to the expected values with no errors.

## Runtime Handoff

- `"yes"`: see "Key open finding" above. `translate("yes")` currently
  returns `Am` (via `corrections.json`), not master's own VERIFIED
  `Oe`. **Not fixed** — genuinely unresolved pending Thangseng
  reconciliation, not a bug to patch.
- Everything else touched this session: VERIFIED at runtime directly
  via the spot-checks and full sweep above — no other gaps.

## Governance-model check
No `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` §4 intersection this
session — pure dictionary/data work plus two narrowly-scoped stale
runtime-override fixes (`stand`, `hurry`, `goodbye`, `i am sad` in
`corrections.json`/`phrase_maps.js`), each a direct 1:1 data-value
correction citing fresh native evidence, not a new architectural
pattern or override mechanism.

## Rule-generalization check
Vocabulary/sense-closure session — no new `docs/grammar_rules_structured/`
rule added. Two real candidates were flagged instead of built:
- **you = Na·a/Nang case paradigm** — 1 direct confirmation (Na·a =
  subject pronoun), Nang's exact role (possessive/oblique stem?) still
  unconfirmed. Needs one more data point before generalizing.
- **Anga/Ango possessive-existential pattern** — 4+ same-relay data
  points (i don't have, i have a pen, i have two children, i have a
  question all pattern `Ango X donga`) — this one is arguably ready to
  become a real rule now; flagged as the top rule-candidate for the
  next session rather than built here, per the operating governance's
  requirement not to generalize under session-end time pressure without
  re-verifying against the full corpus first.

This is the 2nd consecutive vocabulary-only session (after NV-089's own
predecessor); not yet at the 3-session drift-flag threshold, but noting
it explicitly per §5 self-monitoring — if the next session is also
vocabulary-only, that flag should be raised to the Project Owner.

## Carried-forward open items (priority order for next session)

1. **`yes` three-way (Oe/Am/Hoe)** — see above, top priority.
2. **sit=aonga vs a·song·a (NV-080)** and **stay=donga vs
   dongchak·a/dongdang·a** — both part of the still-open live/stay/sit
   consolidation question (the word `donga` recurs across all three
   English senses in the same relay transcript — needs one consolidated
   judgment call, not three separate fixes).
3. **i understand** (uia vs ma·sia, contradicts NV-087), **let's
   drink/eat** (contradicts NV-083), the **skenga/sikenga** "want to X"
   paradigm, **they are working**, **it is not good** — all flagged
   OPEN in NV-089, untouched since.
4. **answer the question** / **i have a question** — deliberately held
   both sessions; tied to the open `answer` `pickPrimary` tie-break
   (NV-077, Claude B's territory) and the Angna/Ango pattern
   respectively. Explicit Project Owner confirmation this batch that
   these stay separate from the general relay-table work.
5. Grammar-rule candidates (see Rule-generalization check above).
6. **10 pre-existing exact-duplicate rows** found during this session's
   duplicate-representation check — unrelated to Thangseng relay work,
   needs its own dedicated pass (see NV-091 entry for the full list;
   several look like mechanically-generated counting-phrase artifacts,
   possibly Claude B's territory).
7. **king**: citation-level fix is in (Raja VERIFIED/HIGH), but the
   durable engineering fix (excluding classifier-scope rows from
   `pickPrimary` candidacy generally) is still Claude B's open item.

## Repository status at close
- HEAD: `13d951c` (this document's commit will follow as `13d951c`'s
  child, then the final `WORKSTATE.yaml` commit)
- `origin/main` match: yes, verified before each push this session
- `git status`: clean at every checkpoint
- `.ai/WORKSTATE.yaml`: updated in this session (repository.head,
  claude_a.current_task, claude_a.next_action) — see next commit
- `.ai/SESSION_BOOTSTRAP.md`: no new standing rule established this
  session, not touched
- This migration document: complete
- No local commits, no uncommitted changes
- Native-validation/blocker status: `yes` three-way is the sole
  blocking-priority open item; everything else is normal backlog
