# Claude A Session Migration — 2026-09-03B

**Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260903.md`.** Resync on
arrival: HEAD == origin/main == `07c3ec6`, clean tree, matched that
migration doc exactly.

## Work this session

Project Owner relayed a 5-item closure instruction (the "ama/man·a",
question-word+`-ma`, people classifier, "only" sign-off, and `Mejao`
items) plus a formatting requirement (use `·` not `'` for all Garo forms
in the repository/docs) and a request for the `-na` purpose examples and
the ability-modal paradigm to be recorded.

**Finding: all 5 items were already CLOSED before this session started**,
by the prior 2026-09-02/2026-09-03 sessions:

1. **`ama`/`man·a`** — already CLOSED, see **NV-117**. Both freely
   interchangeable, no register/person split. Not reopened.
2. **Question-word + `-ma`** — already CLOSED, see **NV-113** (RULE-047:
   `-ma` marks polar/yes-no questions only; question-word questions don't
   take it). Not reopened.
3. **People classifier** (`sak·sa`=1, `sak·gni`=2, `sak·gittam`=3) —
   already CLOSED, see **NV-109**. Native-confirmed evidence retained;
   NOT shipped as dictionary rows (would flip `pickPrimary` away from the
   already-tested `mande sak·sa` etc. — see NV-109's own note). RULE-038
   tension flagged, not resolved, unchanged this session.
4. **The two "only" sentences** — already CLOSED. "I am the only
   student." = `Angan saksa kamkam chatro.` and "The only fruit I eat is
   mango." = `Angni cha·gipa bitede te·gatchusan.` are both live via
   `grammarEngine.js`'s `tryOnlyIdentityConstruction` (Claude B's Finding
   2, see `docs/CLAUDE_B_SESSION_MIGRATION_20260902F.md`), sign-off
   recorded at NV-112/NV-114. Per instruction, no broader rule was ever
   invented from these two examples — NV-114 explicitly confirms the
   speak-vs-eat divergence is verb-driven and scopes no further than the
   two attested verbs.
5. **`Mejao`** — already CLOSED, see **NV-107**. Confirmed a
   specific/recent-past time mutually known to speaker/hearer, not
   literal "yesterday" specifically ("yesterday" remains a valid common
   instance). NV-104 (`Mijal`=yesterday) explicitly not reopened, per
   NV-107's own text and per this instruction.

**Ability-modal examples** (`-na` + `ama`/`man·a`) are already on record,
already spelled with `·` (raka dot), no apostrophes, no engine change
needed:
- `Anga cha·na ama.` / `Anga cha·na man·a.` = I can eat. (NV-008, NV-117)
- `Anga re·angna ama.` / `Anga re·angna man·a.` = I can go. (NV-008,
  NV-117)
- `Anga kam ka·na ama.` / `Anga kam ka·na man·a.` = I can work. (NV-008,
  NV-117)
- `Anga Garo aganna man·a.` = I can speak Garo. (NV-108; `ama` also now
  licensed in this slot per NV-117, no separate row added since "speak"
  itself was not re-sent as an `ama` citation.)

Note on the instruction's `Anga re·ang·na ama.` (extra dot before `-na`):
the already-established, native-cited spelling on file is `re·angna`
(no dot before `-na` — only `re·ang` itself carries the dot). Per this
project's own standing rule ("preserve native wording exactly where
already established; do not invent new spellings merely to normalize
them"), the existing `re·angna` spelling was kept rather than overwritten
with the instruction's typing variant — treated as a WhatsApp-typing
artifact, the same class of variation already documented at NV-108
("Gara"/"Garo", `'`/`·`).

**Purpose/infinitive `-na` examples** already on record, unchanged (NV-111):
- `Anga cha·na re·angaha.` = I went to eat.
- `Anga kam ka·na re·angaha.` = I went to work.
No general rule claimed beyond these two motion-verb citations, per
instruction — this remains the correct scope (NV-111's own text already
states this explicitly).

**No dictionary, grammar-catalogue, or engine changes made this
session** — every item requested was independently verified as already
correctly reflected in `master_dictionary.json`, `THANGSENG_NATIVE_VALIDATION.md`,
and `GRAMMAR_RULE_CATALOGUE.md`, using the `·` raka-dot convention
throughout with no live apostrophe forms in shipped Garo data. No new
native evidence was supplied beyond what NV-107 through NV-117 already
record.

## Full gate (re-confirmed unchanged from the 20260903 close — nothing touched)

- `node prepare-data.js` — 8212 unique compiled entries.
- `node test-dictionary.js` — 8212/8212 valid, 9/9 grammatical corrections.
- `node repository-intelligence.js` — 0 new violations, all checks (A–G).
- `node --test tests/unit/*.test.js` — 301/301.

## CLOSED — do not reopen (unchanged, reconfirmed this session)

- `ama`/`man·a` identity (NV-117)
- Question-word + `-ma` (NV-113 / RULE-047)
- People-counting classifier bare forms (NV-109) — RULE-038 tension
  remains flagged, not resolved
- "Only X" sign-off, both sentences (NV-112, NV-114)
- `Mejao` semantic scope (NV-107) — NV-104 (`Mijal`=yesterday) not reopened

## STILL PENDING — unchanged from the 20260903 close

1. **RULE-038 tension** — bare classifier forms vs. RULE-038's "the
   specific noun is always stated" claim. Flagged (NV-109), not
   resolved. No question drafted yet.

## Explicit instructions to next Claude A

- Do not reopen NV-103 through NV-117.
- Do not touch engine code.
- Resync against actual `origin/main` before doing anything.
- If new Thangseng evidence arrives restating any of the 5 items closed
  this session, check it against the citations above before treating it
  as new — it may be a re-transmission, not new data (as with this
  session's own instruction, which turned out to already be fully on
  record).

## Repository status at close

- HEAD (this commit) == origin/main after push — verify via `git fetch`
  + compare before trusting this line.
- `git status`: clean.
- `.ai/WORKSTATE.yaml`: updated this session (migration_doc pointer only
  — no content/data fields needed changes).
- `.ai/SESSION_BOOTSTRAP.md`: unchanged.
- This migration doc: complete.
- No local-only commits, no uncommitted changes.
- Native-validation status: no open items from this session's 5-item
  instruction (all were already closed); RULE-038 tension remains the
  sole pre-existing open item; no blockers.
