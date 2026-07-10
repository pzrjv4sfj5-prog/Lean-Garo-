# Pending Regression Cases
_Started: 2026-07-08 by Claude B, evidence-collection mode (Claude A unavailable)_
_Status: LIVING DOCUMENT — candidates only. None of these are in the
`REGRESSION_CASES` test suite (currently 51/51 passing, unchanged). Do not
add to the suite until Claude A has reviewed and, where needed, Thangseng
has confirmed the expected Garo output._

## Purpose
Every weakness the Native Sentence Validation Audit exposes gets logged
here as a candidate regression case, with the exact input/actual-output
pair already captured, so Claude A can review and approve/reject without
re-deriving the evidence. **No fixes are implemented from this document.**

## Format
Each candidate includes: input, current (actual) output, expected output
(if known/native-confirmed), suspected root cause, severity, and status.

---

## RC-CANDIDATE-001 — Necessity-modal negation (`nangja`) collapses into desire-negation

- **Input:** `"I don't need to watch TV"`
- **Current output:** `Anga sikengja` (confidence 0.82, grammar-assembly)
- **Expected output:** Unknown — needs a native-confirmed isolated
  translation of this exact clause (Case 1 only confirms the compound
  sentence's `nangja` = "need not"; the clause hasn't been independently
  native-translated in isolation)
- **Suspected root cause:** Grammar — `sikenga`/"want" + negation is the
  only desire/necessity-negation path in the engine; no distinct handling
  for necessity-modal (`nangja`) vs. simple desire-negation
- **Repository components:** `src/translationEngine.js` grammar-assembly;
  `docs/GRAMMAR_RULE_CATALOGUE.md` (no existing rule covers this)
- **Severity:** Medium — produces a plausible-sounding but semantically
  imprecise output rather than a crash/garbage output
- **Status:** Needs Claude A Review, then Needs Thangseng Validation (confirm expected isolated-clause output) before this can become a real test

## RC-CANDIDATE-002 — Locative adjunct "in bed" gets object marker instead of locative

- **Input:** `"I can watch status lying in bed"` (full) / `"in bed"` (isolated)
- **Current output:** `Anga palang·ko ni·rik·a` (full, `·ko` object marker) /
  `Palang` (isolated, via `stopword-stripped` method — `·o` not applied at
  all, "in" discarded as a stopword)
- **Expected output:** `palango` pattern per native sentence — i.e.
  `Palang` + `·o` locative, not `·ko` object marker, and not stopword-
  stripped to bare `Palang`
- **Suspected root cause:** Grammar/Morphology — the engine's preposition
  handling for "in" doesn't consistently route to the `·o` locative
  suffix; behavior differs between isolated ("in bed" → stopword-stripped,
  loses the locative marker entirely) and embedded-in-larger-clause ("...
  in bed" → gets `·ko` object marker instead). Two different wrong paths
  for what should be the same locative construction.
- **Repository components:** `src/translationEngine.js` — stopword list /
  preposition-to-suffix mapping logic in grammar-assembly
- **Severity:** Medium-High — this is a structural/grammatical error, not
  just a missing word; the confirmed correct form (`Palang`+`·o`) already
  exists and works when directly requested via `corrections.json`'s `"in /
  at": "·o"` entry, so this is a routing/selection bug, not a missing
  morpheme
- **Status:** Needs Claude A Review (confirm this is in scope vs. an
  engineering-only fix once diagnosed) — flagging here rather than fixing
  directly per the evidence-first instruction

**Claude A Review (2026-07-10):** In scope, confirmed by evidence, not
just this one sentence. `·o` = general locative ("in"/"on"/"at"/"with"),
`·chi` = motion-to ("to") — two suffixes, already distinct and both
independently confirmed (primary-source suffixes.pdf: `Tableo te·rik
donga`="there is banana on the table", `Anga antio sengenga`="I am
waiting at the market", `Anga = ang + na = angna`="to me" dative;
`Antichi re·angbo`="go to the market"). **Recommended fix:** map English
`in`/`on`/`at` (stative-location sense, not `to`) to `·o` in
grammar-assembly, same tier as the existing `·chi` handling for `to` —
not a one-off "in bed" patch. **Translation impact — this fixes a whole
class, not one sentence:** every English `[verb] [prep] [location]`
adjunct currently either gets silently stopword-stripped or wrongly
`·ko`-marked. Suggested regression additions beyond "in bed": `"the
banana is on the table"`→`Te·rik tableo donga`-shape, `"I am waiting at
the market"`→`Anga antio sengenga` (already native-confirmed, good
regression case), `"I live in Meghalaya"`→`...Meghalaya-o...` (Batch 3,
constructed not native-verified — lower priority regression case).
**Do not** map `in` to `·o` when it's part of a fixed
`corrections.json`/idiom entry that already resolves correctly —
this should only fire in the SOV grammar-assembly fallback path, same
scope as the existing `·chi` logic, not override working exact matches.

## RC-CANDIDATE-003 — Posture verb "lying" produces malformed/invalid output

- **Input:** `"I am lying down"` / `"I am lying in bed"`
- **Current output:** `Anga Ka·ma` (misparsed as directional "down",
  reusing the unrelated `down = Ka·ma` correction) / `Anga Palangha`
  (invalid Garo — `Palang`, a noun, treated as a verb root with a
  past-tense-shaped `-ha` suffix appended)
- **Expected output:** Unknown — `tue` is confirmed as the relevant
  morpheme (Case 1) but its exact isolated-clause conjugation/output has
  not been native-confirmed
- **Suspected root cause:** Dictionary + Morphology — no posture-verb
  concept ("lie down") exists in the engine at all; "lying down" is
  string-matched against the unrelated `down`/`Ka·ma` correction, and "lying
  in bed" falls through to a generic verb-suffix-append routine that
  incorrectly targets the noun `Palang`
- **Repository components:** `src/data/corrections.json` (no posture-verb
  entries); `src/translationEngine.js` (verb-root detection incorrectly
  matches a noun in the fallback path)
- **Severity:** **High** — this is the one candidate that produces
  structurally invalid Garo output rather than an incomplete-but-valid one.
  Recommend flagging to Claude A as priority review even though it is not
  launch-blocking (posture verbs aren't in the current V1.0 scope
  otherwise).
- **Status:** Needs Claude A Review, then Needs Thangseng Validation for the correct target form(s)

**Claude A Review (2026-07-10):** Full paradigm still needs native
validation (tracked NV-007) — do not implement a complete conjugation
guess. But the two malformed outputs are each independently, cheaply
preventable now, without waiting on that: (1) `"lying down"` matching
the unrelated `down`/`Ka·ma` correction is a string-collision, not a
grammar gap — same lexical-split class as `ring`/`ring·` (NV-010) and
exactly what `CLAUDE_A_FINAL_HANDOUT.md` flags as the costliest
recurring bug here; scope the `down`/`Ka·ma` match so it doesn't fire on
"lying down." (2) `"lying in bed"` → `Anga Palangha` is the noun-as-verb-
root fallback firing on `Palang` — guard that fallback so it doesn't
apply to words already present in the dictionary as nouns. **Translation
impact:** doesn't yet produce a *correct* posture-verb sentence, but
converts two confirmed-invalid outputs into a graceful gap
(`[UNKNOWN]`-style) — a real quality improvement even without the full
`tue` paradigm, since invalid Garo is worse than an honest gap.

## RC-CANDIDATE-004 — Ability modal ("can") dropped entirely

- **Input:** `"I can watch"` / `"I can eat"` / `"I can watch status lying in bed"`
- **Current output:** `Anga ni·rik·a` / `Anga Cha·a` / `Anga palang·ko
  ni·rik·a` — in all three, identical to the non-modal form of the same
  sentence (no ability marker present at all)
- **Expected output:** Should include `man·a`/`man·ienga`-family marking
  per Case 1's confirmed `man·ienga` = "can/able" (continuous ability).
  `master_dictionary.json` already has `"can": "man·a"` — exact expected
  output per input still needs native confirmation.
- **Suspected root cause:** Grammar — `man·a` exists in the dictionary
  (confirmed via `master_dictionary.json` lookup) but the grammar-assembly
  path does not appear to invoke it for English "can + verb" constructions
  — looks like a wiring gap (existing lexical resource not connected to the
  relevant grammar rule) rather than a missing word.
- **Repository components:** `src/translationEngine.js` grammar-assembly
  (modal-verb detection/routing); `docs/GRAMMAR_RULE_CATALOGUE.md` (no
  ability-modal rule currently cross-referenced)
- **Severity:** Medium-High — systematic, confirmed across 3 independent
  inputs, not sentence-specific
- **Status:** Needs Claude A Review (confirm whether `man·a` wiring is an
  engineering-only fix or needs a formal rule first), then Needs Thangseng
  Validation for exact expected forms

## RC-CANDIDATE-005 — English loanwords (`TV`, `status`) silently dropped

- **Input:** `"I watch TV"` / `"I am watching TV"` / (status untested in
  isolation yet — only within the Case 1 compound sentence)
- **Current output:** `Anga ni·rik·a` (both TV inputs — word vanishes
  entirely, no error/fallback marker)
- **Expected output:** Should retain `TV` per Case 1's native-confirmed
  loanword usage — likely `Anga TV ni·rik·a` or similar, pending Claude A/
  Thangseng confirmation of exact placement and any required suffixing
- **Suspected root cause:** Dictionary — no pass-through mechanism for
  unrecognized capitalized/loanword tokens; they're silently discarded
  rather than retained or flagged
- **Repository components:** `src/data/corrections.json` /
  `master_dictionary.json` (no entries); `src/translationEngine.js` (no
  loanword pass-through fallback observed — unrecognized tokens are
  dropped, not retained)
- **Severity:** Medium — silent data loss is worse than a visible failure;
  no `[UNKNOWN]` marker appears for `TV` the way one does for full-sentence
  passthrough (Case 1, Step 1), which means this failure mode is currently
  invisible to a user reading the output
- **Status:** Needs Claude A Review (decide on general loanword policy —
  individual entries vs. a systematic pass-through mechanism — since this
  will likely recur for other English loanwords beyond `TV`/`status`)

---

## RC-CANDIDATE-006 — Purpose-clause form of "search" still uses pre-Rule-32 stale value

- **Input:** `"i want to search"` (also `"i want to X"` for any verb going
  through the purpose-clause grammar path)
- **Current output:** `Anga am·e·nik·na sikenga` (grammar-assembly)
- **Expected output:** Unknown exactly, but almost certainly should use
  the `Sandia`/`sandi`-root family that RULE-032 established, not
  `am·e·nik·na` — that value is on record (RULE-033's commit history,
  `docs/VALIDATION_CORPUS.md`) as the specific contamination Rule 32 was
  written to retire.
- **Suspected root cause:** Selection Logic / architectural gap, not a
  new linguistic question. RULE-032 fixed `search`'s standalone
  correction-table entry (`corrections.json`: `search` → `Sandia`,
  confirmed working, `corrections` strategy runs first in the cascade).
  But `translationEngine.js`'s separate `PURPOSE_MAP` (now `src/data/
  purpose_map.json` as of the 2026-07-09 BACKLOG-001 extraction) — used
  only for purpose-clause constructions ("want to X", "go to X") — still
  has `'search': 'am·e·nik·na'`, the old value. The two tables were never
  meant to duplicate each other's fix; Rule 32's fix simply didn't
  propagate to this second table because nothing connects them.
- **Repository components:** `src/data/purpose_map.json` (the value
  itself); more importantly, the underlying pattern — any future fix to
  a `corrections.json` entry should prompt a check of whether the same
  word also appears in `purpose_map.json` (or other extracted tables)
  with a stale value, since there's currently no single source of truth
  connecting them.
- **Severity:** Medium — produces a specific wrong/contaminated word in a
  real, reachable construction (not a rare edge case; any "want to
  search" / "went to search" style sentence hits this).
- **Status:** Needs Claude A Review (confirm the correct purpose-clause
  form — likely `sandi·na` or similar, following the existing `-na`
  purposive pattern used by every other `PURPOSE_MAP` entry, but that's
  a linguistic call, not an engineering guess)
- **Discovered:** 2026-07-09, as a side effect of the BACKLOG-001
  `PURPOSE_MAP` extraction (Claude B verified reachability before
  extracting, per the "preserve exact behavior" requirement — found this
  in the process, did not go looking for it separately)

**Claude A Review (2026-07-10):** Confirmed — `am·e·nik·na` is a retired
contamination, not a valid synonym. `Sandia` (RULE-032) is correct.
Recommended `purpose_map.json` value: `Sandi·na` (regular `-na` infinitive
formation on the confirmed `Sandia` stem, matching RULE-015's stem-
formation pattern used elsewhere in the same table). Note: primary-source
transcripts also confirm `Am·a` as a second valid word for "search" — a
likely synonym, not a competing value for this specific slot, no reason
to prefer it over `Sandi·na` here without further evidence. **Translation
impact:** fixes every "want to search"/"went to search"-style sentence,
a real reachable construction, not an edge case.

## RC-CANDIDATE-007 — `sing`/`dance` purpose-clause forms use unrelated roots

- **Input pattern:** `"i want to sing"` / `"i want to dance"` (purpose-clause construction, same code path as RC-CANDIDATE-006)
- **Current output:** `purpose_map.json`: `sing` → `bit·na`, `dance` → `ruru·na`
- **Compare:** `corrections.json`: `sing` → `ring·a`, `dance` → `Chroka`
- **Update 2026-07-10:** Claude A independently confirmed `ring·a` = "to
  sing" is a correct, distinct root from `ringa` = "to drink" (see
  `RC-CANDIDATE-009`'s update). This means `corrections.json`'s
  `"sing"` → `ring·a` is very likely correct, which sharpens the
  question: it's now `purpose_map.json`'s `"sing"` → `bit·na` that most
  needs Claude A's review — is `bit·na` a genuine synonym/purposive-form
  choice, or a wrong entry? `"dance"` (`Chroka` vs `ruru·na`) remains
  fully open, no new information.
- **Suspected root cause:** Selection Logic / possible genuine synonym pair,
  **not yet distinguishable by Claude B**. Unlike RC-CANDIDATE-006
  (`search`), where `am·e·nik·na` is on record as a specifically-retired
  contamination, there's no equivalent record for `sing`/`dance` — these
  could be (a) the same RC-006 bug class (stale purpose-form left behind
  by an earlier fix), (b) two legitimate synonyms where Garo genuinely
  has separate words for the bare/imperative sense vs. the purposive
  sense, or (c) one of the two is simply wrong and was never caught.
  Surfaced by `repository-intelligence.js` (BACKLOG-006) Check B2 — a
  "root-prefix" heuristic that flags purpose-clause forms sharing zero
  characters with their corrections.json counterpart.
- **Repository components:** `src/data/purpose_map.json`,
  `src/data/corrections.json`
- **Severity:** Medium — same class as RC-006, reachable via ordinary
  "want to X" phrasing
- **Status:** Needs Claude A Review (which of a/b/c above is correct)

**Claude A Review (2026-07-10):** `sing`: no direct "want to sing"
evidence exists, but `ring·na` is the regular `-na` formation on the
confirmed `ring·a` root (RULE-015 stem formation) — same pattern as
`cha·na`, `dakna`. Medium-confidence candidate replacement for `bit·na`,
not a confirmed fix; flag for Thangseng rather than swap silently.
`dance`: still fully open, no new evidence, no recommendation — leave
`Chroka`/`ruru·na` both as-is pending native input.

## RC-CANDIDATE-008 — 9 irregular-verb forms differ between `corrections.json` and `irregular_verbs.json`

Surfaced by `repository-intelligence.js` Check B1 (strict cross-table
comparison). All 9 are genuine value differences (case-only differences
were excluded automatically). Not yet classified — could be typos,
could be legitimate dialectal/register variants (the project has
precedent for both, e.g. Bia/Ua, gnang/donga registers), could be one
right and one wrong per key:

| Key | `corrections.json` | `irregular_verbs.json` |
|---|---|---|
| `eaten` | `cha·jok` | `cha·manaha` |
| `coming` | `rebaenga` | `re·baenga` |
| `slept` | `tusiaha` | `tusaha` |
| `sleeping` | `tusienga` | `tusenga` |
| `laughing` | `ka·dingenga` | `ka·dingeng` |
| `bought` | `breaha` | `brea·aha` |
| `heard` | `rangsan chanchiaha` | `knachik·aha` |
| `standing` | `chadatenga` | `chadenga` |
| `sitting` | `asongenga` | `asong·enga` |

- **Suspected root cause:** Selection Logic / data drift. Several of
  these (`coming`, `bought`, `sitting`) also look raka-adjacent — the
  `irregular_verbs.json` value carries a raka mark the `corrections.json`
  value lacks, which may connect to RULE-001 rather than being unrelated.
  Claude B is not asserting which value (if either) is correct.
- **Repository components:** `src/data/corrections.json`,
  `src/data/irregular_verbs.json`
- **Severity:** Medium — 9 distinct reachable forms, some possibly
  producing wrong output depending which table's strategy wins in a given
  input (`irregular_verbs.json` is checked inside grammar-assembly;
  `corrections.json` is checked first in the overall cascade, so for
  most single-word inputs `corrections.json` wins — but not for every
  code path that reaches `findVerbForm()`)
- **Status:** Needs Claude A Review

## RC-CANDIDATE-009 — 18 raka-adjacency candidates (report-only, likely mostly false positives)

Surfaced by `repository-intelligence.js` Check A, which is deliberately
**report-only** (see the file's header comment) because sense-
disambiguation is required before any of these can be called a bug —
several look like the exact "lexical split" trap
`CLAUDE_A_FINAL_HANDOUT.md` warns about, not RULE-001 violations:

- `ring·` appears 8 times against the confirmed no-raka root `ring`
  ("drink") — **partially resolved 2026-07-10 by Claude A** (see
  `.ai/WORKSTATE.yaml`/`PROJECT_STATUS.md`, primary-source chat
  transcripts): `ring·a` = "to sing" and `ringa` = "to drink" are
  **confirmed two different roots**, not a raka inconsistency on one
  root. This directly validates the concern this entry raised (word-sense
  disambiguation was needed before calling these a RULE-001 violation)
  and confirms this script's decision to keep Check A report-only rather
  than build-gating. The `"sing"`-related hits in this list (`"let's
  sing"`, `"i sing a song"`, `"i am singing a song"`, `"sing"` itself) are
  therefore **not bugs** — they're the confirmed `ring·` (sing) root
  correctly carrying raka. Remaining unresolved from the original 8:
  `"i want to drink"` → `ring·na`, `"i will drink"` → `ring·gen` (these
  ARE the drink-sense root and still need Claude A/Thangseng
  confirmation of whether `-na`/`-gen` genuinely trigger raka on this
  no-raka root — tracked as `NV-010`, not yet resolved), and
  `"elephant"`/`"an elephant"` → `buring·o` (likely an unrelated word
  containing "ring" as a substring only, not the drink or sing root at
  all — lowest-priority of the remaining unresolved items).
- `agan·` appears 3 times (`"did you speak"`, `"have you spoken"`,
  `"are you speaking"`) against confirmed no-raka `agan` ("speak") — these
  look more likely to be genuine RULE-001 candidates than the `ring`
  cases, since there's no obvious alternate-word explanation on record.
- `nam·` appears 2 times (`"loved the picture"` / `"i loved the picture"`,
  both the same underlying entry) — `nam·e` may be an idiom ("try"/
  "smell," per casual knowledge, **unconfirmed**) rather than the no-raka
  verb `nam` ("love"/like sense) at all.
- `tusi·` appears once (`"i will sleep"` → `Anga tusi·gen`) against
  confirmed no-raka `tusi` ("sleep") — plausible genuine RULE-001
  candidate, no obvious alternate-word explanation.
- `wa·` appears 4 times, all in bamboo-related entries (`"bamboo"`,
  `"a/two/three piece(s) of bamboo"`) against confirmed no-raka `wa`
  ("rain" sense per the source table) — likely a **different word
  entirely** (bamboo ≠ rain), i.e. probably not a RULE-001 violation at
  all, just two unrelated words that happen to share the letters "wa."

- **Repository components:** `src/data/corrections.json` (all 18 hits)
- **Severity:** Unknown pending Claude A — ranges from "likely a real
  RULE-001 bug" (`agan·`, `tusi·`) to "likely not a bug at all, just
  string-matching noise" (`wa·`)
- **Status:** Needs Claude A Review. Not converted to individual regression
  cases pending that review, since several of these 18 may not be issues
  once sense is disambiguated — see `repository-intelligence.js` output
  for the exact list.

---

## Summary table

| ID | Weakness | Severity | Status |
|---|---|---|---|
| RC-CANDIDATE-001 | `nangja` necessity-modal collapses into desire-negation | Medium | Needs Claude A Review |
| RC-CANDIDATE-002 | `·ko` vs `·o` selection error on locative "in bed" | Medium-High | Needs Claude A Review |
| RC-CANDIDATE-003 | Posture verb "lying" → malformed/invalid Garo | **High** | Needs Claude A Review |
| RC-CANDIDATE-004 | Ability modal "can" dropped entirely, systematic | Medium-High | Needs Claude A Review |
| RC-CANDIDATE-005 | Loanwords (`TV`) silently dropped, no error marker | Medium | Needs Claude A Review |
| RC-CANDIDATE-006 | Purpose-clause "search" uses pre-Rule-32 stale value (`am·e·nik·na`) | Medium | Needs Claude A Review |
| RC-CANDIDATE-007 | `sing`/`dance` purpose-clause forms use unrelated roots vs. corrections.json | Medium | Needs Claude A Review |
| RC-CANDIDATE-008 | 9 irregular-verb forms differ between corrections.json and irregular_verbs.json | Medium | Needs Claude A Review |
| RC-CANDIDATE-009 | 18 raka-adjacency candidates (report-only, likely mostly false positives) | Unknown | Needs Claude A Review |

## Explicitly out of scope
- No fixes implemented.
- No entries added to the live `REGRESSION_CASES` test suite (still 51/51,
  unchanged).
- Severity/priority labels above are Claude B's engineering assessment
  only — not a substitute for Claude A's linguistic triage or Thangseng's
  validation of expected outputs.
