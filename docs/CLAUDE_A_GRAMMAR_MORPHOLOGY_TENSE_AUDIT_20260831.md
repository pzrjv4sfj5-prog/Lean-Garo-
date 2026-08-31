# Claude A — Grammar, Morphology & Tense Audit (2026-08-31)

Scope: linguistic side of the joint Claude A + Claude B grammar/morphology/
tense audit requested by the Project Owner. Method: cross-checked
`docs/GRAMMAR_RULE_CATALOGUE.md` against native evidence
(`docs/THANGSENG_NATIVE_VALIDATION.md`) and against live `translate()`
output at HEAD (post go/re·ang- decoupling, commit series through
2026-08-31B). No new native data invented; nothing reinterpreted.

## 1. Confirmed grammar rules — consistent with native evidence, no discrepancy found

Live-tested against the shared test matrix (simple present/past/future,
continuous, negative, imperative, negative imperative, yes/no question,
`-ko` object, classifier, OOV, multi-word object) and cross-checked
against their catalogue rule:

- **Tense/aspect:** RULE-002 (`-aha` past/perfect unification), RULE-023
  (`-gen` future, no raka), RULE-013 (`chim` discontinued past, two-word
  construction), RULE-025 (`-jaha` cessative, NOT past-negation),
  RULE-026 (`-manaha` completive, confirmed overlap with `-aha` in
  spoken register), RULE-028 (same overlap, second citation) — all
  Verified/High, all reproduce correctly live.
- **Negation:** RULE-017/RULE-027 (`-ja` covers both present and
  past-referring negation; no dedicated past-negative suffix exists —
  this is a confirmed *absence*, not a gap) — Verified/High, reproduces
  correctly (`"i did not eat"` etc.).
- **Imperative/hortative:** RULE-003b (subject-drop), RULE-029 (`-bo`
  single form for both imperative and hortative) — Verified/High.
  Negative imperative (`-nabe`, e.g. `cha·nabe`="don't eat") reproduces
  correctly live via the `forget` paradigm's established shape
  (NV-101) and the shared test matrix.
- **Question formation:** RULE-046 (`-ma` joins directly to the verb,
  no space) — **live-verified correct for all three counterexamples the
  catalogue itself lists as still-open** (see Finding 1 below — this is
  a documentation-staleness finding, not a grammar defect).
- **"Go" paradigm:** RULE-030, fully resolved via NV-100 — `re·a`("to
  walk"/"go"), `re·anga`("went"), `re·jawa`("will not go"),
  `re·angjawa`("will not be going") are four distinct, non-competing
  forms, exactly matching the audit brief's shared-evidence block.
  Live-verified: `go`→`re·a`, `went`→`Re·anga`, `will not go`→`re·jawa`,
  `will not be going`→`re·angjawa`. No English-tense-to-wrong-Garo-form
  mapping found for this verb.
- **want/need/push-insert:** `ska`("want", simple), `skenga`
  (continuous of `ska`), `nanga`("need") are correctly kept distinct
  from `sika`/`sikenga`("push/insert") at both the dictionary and
  runtime level — no collision found live (`"i want water"`→`"Anga chi
  ringna skenga"`, `"she is pushing"`→`"Ua Jit·pak·a"`, unrelated root).
  Matches the audit brief's shared-evidence block exactly.
- **Classifier construction:** noun+classifier+number-suffix confirmed
  live for `mang` (animals, `achak mang·sa`/`achak mang·gni`) and `king`
  (flat objects/books, `ki·tap king·sa`) — matches the standing
  native-confirmed rule.
- **`film-ko` object construction:** RULE-009/`-ko` object-marking
  confirmed live and elsewhere in the corpus; no object-loss found in
  any tested sentence with a resolvable object.
- **OOV handling:** unresolved content words now surface as an explicit
  `[UNKNOWN]` marker rather than being silently dropped (AI-002 fix,
  verified live: `"she is carrying a [OOV widget]"` →
  `"Ua daka gat·a [UNKNOWN] [UNKNOWN]"`, confidence correctly downgraded
  to 0.65). This is an engineering fix (Claude B, 2026-08-29B/30), not
  new linguistic content — confirmed here only because it directly
  bears on point 12 of the audit brief ("did any word get substituted
  or silently dropped").

**No case was found where English tense was mapped to the wrong Garo
form, where a rule was over-generalized from too few examples beyond
what is already flagged in the catalogue's own confidence fields, or
where a native-confirmed form was mis-implemented at runtime**, with
two exceptions below.

## 2. Findings

### Finding 1 — RULE-046 catalogue text is stale (documentation only, not a live defect)

`docs/GRAMMAR_RULE_CATALOGUE.md` RULE-046's Counterexamples field
still lists three sentences as shipping the wrong (space-before-`ma`)
form: `"are you eating?"→Na·a cha·enga ma?`, `"is there rice?"→Mi donga
ma?`, `"have you eaten breakfast?"→na·a nastha cha·aha ma?`.

**Live-verified today, all three are actually correct** (joined, no
space): `Na·a Cha·engama?`, `Mi dongama?`, `Na·a nastha cha·ahama?`.
This matches WORKSTATE.yaml's own record of a 2026-08-28 repo-wide
RULE-046 sweep ("13 master_dictionary.json + 82 corrections.json
violations fixed, P1 backlog CLOSED, zero remaining verified in
compiled_dict.json") — the fix shipped, but the catalogue's
Counterexamples/Launch-Priority text was never updated to reflect it.

**A-owned fix, applied in this session:** RULE-046 rewritten below to
mark the space-before-`ma` P1 backlog CLOSED, with the three example
sentences moved from Counterexamples to Examples (all live-verified
correct today).

### Finding 2 — Ability modal "can" (ama / man·a): native-confirmed paradigm, entirely unimplemented in the engine (open since 2026-07-25, still open today)

**Linguistic status: CLOSED, High confidence.** NV-008
(`docs/THANGSENG_NATIVE_VALIDATION.md`) has a direct, unambiguous,
already-closed native paradigm:
- "I can eat" = `Anga cha'na ama`
- "I can go" = `Anga re'angna ama`
- "I can work" = `Anga kam ka'na ama`
- Homonymy with `ama`="mother" explicitly confirmed and resolved by
  Thangseng (same-spelling, different-pronunciation true homonym pair,
  same pattern as `senga`(wait)/`senga`(smell)).

**Engineering status: still not implemented, confirmed live today.**
Grepped every `src/*.js` file for `ama`/`man·a` — zero hits anywhere in
engine code; the modal exists only as a bare dictionary gloss for the
word "can" itself, never as a grammatical construction. Live
`translate()` today:
- `"i can eat"` → `"Anga Cha·a"` (0.82, grammar-assembly) — `ama`
  silently dropped entirely, output is indistinguishable from plain
  "I eat."
- `"he can go"` → `"Ua re·a"` (0.82) — same silent drop.
- `"i cannot eat"` → `"Anga [UNKNOWN] Cha·a"` (0.65, morphology) —
  worse: "cannot" surfaces as a literal `[UNKNOWN]` token instead of
  either being dropped or (correctly) rendered as `ama` + negation.
- `"can you help me?"` is the **only** modal-"can" sentence that works,
  and only because it has its own literal `corrections.json` override
  — it does not generalize to any other verb.

This is not a `LINGUISTICALLY UNRESOLVED` item — the native data is
complete and has been sitting closed for over a month. It is a pure
**B-owned engineering handoff**: grammarEngine.js's modal-detection
logic needs an "can/cannot + verb" branch that inserts `ama` (or
`man·a` — NV-008's own follow-up notes flag that `master_dictionary.json`
independently carries `"can": "man·a"` as a second citation whose
relationship to `ama` was never disambiguated; not resolved here, both
citations exist, only `ama` has a full worked paradigm) before the verb
stem, with negation composing as `ama` + `-ja` per RULE-017's general
negation mechanism rather than defaulting to a bare `[UNKNOWN]`. Full
detail and worked examples already exist in NV-008 — no new relay
question needed to implement this.

## 3. LINGUISTICALLY UNRESOLVED (insufficient evidence, not attempted)

None found beyond what NV-008's own trailing note already flags: the
relationship between `ama` and the second, less-attested `man·a`
citation for "can" is not disambiguated (single form vs. register
variant vs. distinct sense) — flagged, not guessed at. This does not
block Finding 2's engineering fix, since `ama` alone already has a
complete three-verb paradigm to implement against.

## 4. A-owned fixes applied this session

- `docs/GRAMMAR_RULE_CATALOGUE.md` RULE-046: Counterexamples/Launch
  Priority corrected to reflect the already-shipped 2026-08-28 sweep
  (see Finding 1). No dictionary/runtime data touched — documentation
  only.

## 5. B-owned engineering handoffs

- **Finding 2 (priority):** implement the `ama`("can") modal
  construction in grammarEngine.js per NV-008's closed paradigm. No
  native data missing; this is implementation only.

## 6. Not touched this session (explicitly out of scope for Claude A)

Per the audit brief's role split, no engine code was read line-by-line
or modified (grammarEngine.js/translationEngine.js/sentenceBuilder.js/
prepare-data.js internals are Claude B's half of this same audit
request — not run in this session). This report covers Claude A's
linguistic half only.
