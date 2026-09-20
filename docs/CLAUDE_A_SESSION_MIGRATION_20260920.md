# Claude A Session Migration — 2026-09-20

## Project identity
Lean Garo: English↔Garo dictionary and translation engine. Multi-Claude
architecture (A=linguistic authority, B=engineering, C=audits, D=OCR
ingestion). Claude A never touches engine code or OCR ingestion.

## Resume verification
Cloned fresh via session-supplied PAT. `git fetch` + `git status`: HEAD
`971452a` == `origin/main`, working tree clean on arrival. This is the
merge of Claude A's NV-158/159 close (`0aa263b`) and Claude B's
double-accusative/marry-her engineering session (`6eea3aa`, doc
`docs/CLAUDE_B_SESSION_MIGRATION_20260920.md`) — both already fully
accounted for, no drift beyond what those two docs describe. Ran the
full gate from scratch before touching anything (not trusted from
memory): 8824/8824 dictionary, 9/9 grammatical corrections, 0 new
repository-intelligence violations, 0 resync candidates, 442/442 unit
tests — matched Claude B's reported baseline exactly.

## Task: content adjudication (Claude B handoff §4.1/§6.1)
Claude B's `docs/CLAUDE_B_SESSION_MIGRATION_20260920.md` flagged a
Claude-A/Owner-only decision: two disagreeing candidate roots for the
general 3rd-person accusative object ("him"/"her"/"it") —
- `Biko` (master_dictionary.json idx 9847, Bi- paradigm, `confidence`
  field absent entirely, notes are just a bare gloss, zero
  corpus/native citation).
- `uko` (ua-root + `-ko`, already shipping in two live
  `corrections.json` sentences: "i saw him"→"Anga uko Nikaha", "i will
  marry her"→"Anga uko kimgen").

**Resolved evidence-first, no new relay needed** — the evidence was
already on file, just not consulted as a set:
- `docs/GARO_GRAMMAR_REFERENCE.md` and `docs/THANGSENG_RULES_LOOKUP.md`
  both state the ua/uko object-case pair explicitly ("ua = subject
  ONLY... object = uko, never Anga Ua Nikaha").
- `docs/GRAMMAR_CONFIDENCE_MATRIX.md` marks "uko = him/her (object)"
  confirmed, citing `Anga uko Nikaha`.
- NV-011 (`docs/THANGSENG_NATIVE_VALIDATION.md`, closed 2026-07-25)
  independently cites `Anga uko nika` = "I see it" — this also answers
  Claude B's "zero candidates for 'it'" note; the citation existed,
  just under a different NV entry than the one being consulted.
- `Biko` has none of this: different root entirely, no confidence tag,
  no example sentence anywhere in the corpus.

Added `"him / her / it (accusative object)"` → `"uko"`, VERIFIED/HIGH,
full citation trail in the entry's own notes (see
`master_dictionary.json`). Annotated (not deleted) the `Biko` row —
`confidence` set to `unverified` (was previously unset/absent, itself
a schema gap), notes appended recording it as considered-and-not-
selected, retained as an unconfirmed alternate per citation discipline.

Live-verified via `translate()`: `"i saw him"` and `"i will marry her"`
unaffected (still `Anga uko Nikaha` / `Anga uko kimgen`, method
`correction`, confidence 1 — this entry doesn't change anything
already shipping). `"i see it"` still drops the object at runtime
(`Anga Nika`, no `uko`) — expected, this dictionary entry doesn't by
itself wire into `grammarEngine.js`'s object-resolution; that reinstate-
the-reverted-fix step is Claude B's, now unblocked by this decision.

## Runtime Handoff to Claude B
The adjudication requested in your §6.1 is done: use `uko` as the
general 3rd-person accusative object form for her/it (him already
resolves correctly via existing paths, unaffected). Reinstate the
`grammarEngine.js` object-loop fix you drafted and reverted this
session, targeting `uko` for "her"/"it" objects — re-check against the
`phrase_maps.js` `'her': 'Uni'` possessive-sense collision you already
found before shipping, same caution as before. §6.2 (`him`/`us`/`them`
`·ko`-suffix question) and §6.3 (pos-as-array bug, 4 sentence-building
gaps) are untouched, still open, not mine to fix.

## Gate status (final, this session)
`node prepare-data.js`: 8825/8825 (was 8824, +1 new entry).
`node test-dictionary.js`: 8825/8825 valid, 9/9 grammatical
corrections. `node repository-intelligence.js`: 0 new violations, all
8 checks (9921 rows checked in Check G, was 9920). `node
scripts/resync-stale-overrides.mjs`: 0 resync candidates (unchanged).
`node --test tests/unit/*.test.js`: 442/442 pass (unchanged, no test
touched — this was a dictionary-only, no-engine-code session).

## Still open, unchanged from Claude B's handoff
- §6.2: whether `him`/`us`/`them`'s unconditional `·ko` suffix in
  `sentenceBuilder.js` is a bug — needs a citation search, not
  addressed this session.
- §6.3: `pos`-as-array pipeline bug, 4 sentence-building gaps
  (estrange+object, skin+"animal", "wall" as subject/object, "crumbled
  down" past-tense-with-adverbial) — pre-existing, not reached.
- `corrections.json`'s `skin`->`bigi` (no native input yet, carried
  from prior sessions).
- The unglossed "Ritchasa gni" counting fragment (carried).
- NV-121 vs NV-158 "what did you eat?" -aha/-a tension (carried, not a
  live bug, just an unbuilt grammar-rule nuance).

## Repository status at close
- HEAD: this doc's own commit (see push below)
- origin/main match: verified after push (see below)
- `git status`: clean before this doc's commit
- WORKSTATE.yaml: updated this session
- SESSION_BOOTSTRAP.md: updated this session
- Migration doc: this file
- No local commits outstanding beyond this session's own
- Native-validation/blocker status: none blocking; one content
  adjudication closed (uko vs Biko); nothing newly opened requiring
  native relay
