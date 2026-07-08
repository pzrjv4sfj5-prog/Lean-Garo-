# Validation Corpus Coverage Audit
_Created 2026-07-08 by Claude A. Measures how many native/corpus examples
support each rule in `GRAMMAR_RULE_CATALOGUE.md`, per the "strengthen
before creating" review cycle. Counts are exact — taken by scanning
`docs/VALIDATION_CORPUS.md`'s table rows programmatically, not estimated._

## Method
Each row in `VALIDATION_CORPUS.md`'s main table cites one or more rule
IDs in its "Grammar Rules" column. This audit counts, per rule ID, how
many distinct table rows cite it. A rule with 1 example is resting
entirely on that single sentence; a rule with 0 examples has no corpus
representation at all, regardless of what its Rule Catalogue "Confidence"
field claims.

## Coverage by rule

| Rule | Corpus examples | Sufficient? | Notes |
|---|---|---|---|
| RULE-001 (Raka Locality) | 5 | Yes | Also independently reinforced by 8+ separate root-consistency audits per catalogue notes — best-supported rule in the repository. |
| RULE-002 (Past/Perfect Unification) | 3 | Yes | Reasonable spread. |
| RULE-003 (SOV Word Order) | 1 explicit | Borderline | Only one row explicitly cites RULE-003, but nearly every other corpus row is *structurally* SOV-conforming without citing it — the rule is implicitly reinforced throughout the corpus even though explicit citation is thin. Recommend adding 1-2 more explicit citations rather than treating this as urgent. |
| RULE-003b (Imperative Subject-Drop) | 1 | Borderline | Same pattern as RULE-003 — likely under-cited rather than under-evidenced, since RULE-029 (imperative/hortative `-bo`) examples are structurally imperative-subject-drop too but don't cross-cite RULE-003b. |
| RULE-004 (Pronoun Paradigm) | 1 explicit corpus row | Borderline for corpus; strong elsewhere | The corpus table only formally cites RULE-004 once, but the pronoun paradigm itself is separately validated by `corrections.json`'s much larger set of pronoun-bearing sentences and by the legacy `docs/GRAMMAR_CONFIDENCE_MATRIX.md` audit (2026-06-30), which confirms most of the paradigm cell-by-cell. Corpus citation is thin; underlying evidence is not. |
| RULE-007 (Hai construction) | 2 | Yes, but undocumented | **Documentation gap, not evidence gap**: RULE-007 is cited twice in the corpus but has no entry at all in `GRAMMAR_RULE_CATALOGUE.md`. Recommend adding a formal catalogue entry — the evidence already exists. |
| RULE-008 (If-Clause `-ode`) | 1 in corpus table | Yes, stronger elsewhere | Corpus table shows 1 row, but the legacy `GRAMMAR_CONFIDENCE_MATRIX.md` records 3 confirmed example sentences for `-ode`. Recommend syncing one more `-ode` example into the formal Validation Corpus table to reflect the fuller evidence base. |
| RULE-013 (Chim) | 3 | Yes | Good spread, covers both the plain-root and continuous-form patterns. |
| RULE-017 (Simple Negation `-ja`) | 3 | Yes | Good spread. |
| RULE-018 (Verbal-Adjective `-gija`) | 2 | Yes for structure; No for selection rule | Structure well-evidenced; the still-open question (when does an arbitrary "not X-ing" input trigger `-gija` vs. `-ja`) has 0 examples testing the boundary — this matches the catalogue's own "Medium confidence, full selection rule" caveat. |
| RULE-025 (Cessative `-jaha`) | 1 | Borderline | Single-sentence reliance despite a "High" confidence tag in the catalogue. The confidence is earned by *specificity* (it directly corrects a documented prior error) more than by *volume* — worth flagging as a candidate for one more confirmed example if a future native session touches aspect. |
| RULE-026 (Completive `-manaha`) | **0** | **No** | Zero rows in the Validation Corpus table despite a "Medium-High" confidence tag. The rule's existence and its overlap with `-aha` are both native-confirmed per the catalogue's notes, but this confirmation was never turned into a corpus row. Recommend adding at least one (`cha·manaha` = "has eaten" is already given as the catalogue's own example — it should also be a corpus row). |
| RULE-029 (Hortative/Imperative `-bo`) | 2 | Yes | Reasonable. |
| RULE-030 (`re·`/`re·ang`, OPEN) | 0 | Expected — open question | No corpus row possible until NV-001 resolves; correctly absent, not a gap. |
| RULE-031 (Copula, OPEN) | 0 | Expected — open question | Same reasoning as RULE-030; correctly absent per NV-002. |
| RULE-033 (Locative "Under") | 3 | Yes | Good — core rule, spelling-variant resolution, and contrast example ("down") each represented. |
| RULE-034 (Locative set, OPEN) | 0 | Expected — open question | Correctly absent pending NV-003. |
| RULE-035 (Under/beneath split, OPEN) | 0 | Expected — open question | Correctly absent pending NV-004. |
| RULE-G2 (Pre-verbal clustering) | 1 | Borderline | Same "thin explicit citation, broad implicit support" pattern as RULE-003. |
| RULE-G7 (Existential possession) | 1 | Borderline | Single example ("she has three children"); no contrast example (e.g. a different possessed-quantity sentence) yet. |
| RULE-G-classifier (Numeral classifiers) | 5 | Yes | Good spread across different classifier classes (`king`, `mang·`, `jol`, `pang`, `ge·`) — one of the better-evidenced areas alongside RULE-001. |

## Summary findings

**Well-evidenced (3+ examples, no action needed):** RULE-001, RULE-002,
RULE-013, RULE-017, RULE-033, RULE-G-classifier.

**Single-sentence or thin-citation reliance (worth strengthening, not
urgent — none of these are wrong, just under-supported in the formal
corpus table):** RULE-003, RULE-003b, RULE-004 (corpus citation only —
paradigm itself is broader), RULE-008 (corpus citation only — 3 exist
elsewhere), RULE-025, RULE-G2, RULE-G7.

**Genuine documentation gap (evidence exists, corpus table doesn't
reflect it):** RULE-026 (0 corpus rows despite confirmed existence),
RULE-007/RULE-G2/RULE-G7/RULE-G-classifier (cited in corpus but missing
formal `GRAMMAR_RULE_CATALOGUE.md` entries — only RULE-007, RULE-G2, and
RULE-G7 lack entries; RULE-G-classifier's underlying pattern is covered
in `GRAMMAR_SPECIFICATION.md` §7 but also lacks a numbered catalogue
entry).

**Correctly zero (open questions, not gaps):** RULE-030, RULE-031,
RULE-034, RULE-035 — these should stay at 0 until NV-001/002/003/004
resolve; adding placeholder examples would misrepresent confidence, per
the project's existing discipline (see `VALIDATION_CORPUS.md`'s "Known
Gaps" section, same principle already applied there).

## Recommended next actions (not performed in this pass — flagging only)
1. Add formal `GRAMMAR_RULE_CATALOGUE.md` entries for RULE-007 (Hai
   construction), RULE-G2 (pre-verbal clustering), and RULE-G7
   (existential possession) — evidence already exists, just not in the
   required schema format yet.
2. Add one Validation Corpus row for RULE-026 (`-manaha`) using the
   catalogue's own existing example (`cha·manaha`).
3. Sync one additional `-ode` (RULE-008) example from
   `GRAMMAR_CONFIDENCE_MATRIX.md` into the formal corpus table.

None of these require new native evidence — they're transcription/
formalization gaps between evidence that already exists in different
documents. Appropriate for a future P1 pass, not blocking current P0
native-validation work.
