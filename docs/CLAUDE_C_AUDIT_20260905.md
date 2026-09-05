# Claude C Independent Full-Scale Translation Audit — 2026-09-05

**Read-only. Zero repo modifications.** Fresh clone, independent of Claude B's
`docs/CLAUDE_B_SESSION_MIGRATION_20260905C.md` — findings below are
mechanically reproduced against live `translate()` on this session's own
clone, not taken on B's word.

## 1. Repository state
- HEAD: `b00ffb9` == `origin/main`, working tree clean, no local artifacts left.
- `node prepare-data.js`: 8280 unique entries compiled, 936 alternates, 190 held
  (SUPERSEDED-only), 25 pickPrimary verified-ties, 5723 no-verified-candidate.
- `test-dictionary.js`: 8280/8280 valid, 9/9 grammatical corrections.
- `node --test tests/unit/*.test.js`: 314/314 pass.
- `repository-intelligence.js`: 0 new violations across Checks A–G (1619 known
  self-consistency conflicts, 74 known cascade mismatches — all pre-allowlisted).
- **Gate is green.** All findings below are real despite the green gate —
  confirms WORKSTATE's own "green test / wrong translator" pattern (§17).

## 2. Headline answers to the spec's four required questions

**Q1 — why does the same English word produce different Garo forms by context?**
Two independent, uncoordinated causes found:
(a) three parallel data sources (`master_dictionary.json` word row, phrase-map
hardcode, counting-phrase family) hold different roots for one lexeme with no
schema field marking which is authoritative — `pickPrimary`/cascade resolves
each *context* against whichever source it consults, not against a single
resolved lexical identity; (b) the plural/morphology layer sometimes strips
`-s` and hits an unrelated word's root (see `leaf`/`leaves` below), which isn't
a data conflict at all but a tokenizer collision.

**Q2 — does `happy` stay consistent across the full paradigm?**
**Yes.** Independently re-verified, all 9 forms match Thangseng's reference
exactly: `kusi ong·a` (bare/imperative), `Anga/Na·a/Ua kusi ong·a` (I/you/he),
`ong·aha` (past), `ong·gen` (future, incl. the question form), `ong·jawa`
(neg future). One process note: the question form and the imperative
currently return the same text via two *different* code paths depending on
capitalization (`"Will I be happy?"` → grammar-assembly, .82 vs.
`"will i be happy?"` → sov-assembly, .75) — output is currently correct
either way, but it's a latent fragility (see §6).

**Q3 — does `cat` stay one lexical identity across word→phrase→sentence?**
**No — reproduced independently, confirmed real, not just an artifact of B's report:**

| input | output | path | conf |
|---|---|---|---|
| cat | meng·gong | phrase-map | .99 |
| two cat | **menggo** mang·gni | exact-phrase | .98 |
| two cats | **meng·gong** mang·gni | classifier | .96 |
| three cats | meng·gong mang·gittam | classifier | .96 |
| big cat | gonga mang (generic, not cat-specific) | exact-phrase | .98 |
| the cat is sleeping | meng·gong tusienga | grammar-assembly | .82 |
| the two cats are sleeping | Gni meng·gong tusienga | sov-assembly | .75 |
| the big cat is sleeping | dal·a meng·gong tusienga | sov-assembly | .75 |

`menggo` (no dot) vs `meng·gong` (with dot) are two different citations, both
`verified_high`, both traceable to Thangseng evidence per the row-level notes
(the counting family cites "three cat" = "Menggo mang·gittam" directly).
**This needs a native-sourced adjudication of which root is correct — not
resolving it unilaterally, consistent with the standing rule that this isn't
a call either agent should make alone.** Separately, `"big cat"` collapses to
a generic placeholder shared with several other animals (§4) — that part is
*not* ambiguous, just wrong.

**Q4 — does the same pattern hold across the broader dictionary?**
Partially, and narrower than "every noun" / "every animal" — see §4 and §5 for
the actual measured scope.

## 3. Word→phrase→sentence audit (general)
Sampled ~15 lexical classes (nouns, animals, adjectives, verbs, pronouns,
question words, location words, modals). Outside the `cat`-class conflict and
the plural-morphology gaps below, lexical identity holds correctly across
levels for the large majority sampled (dog, elephant, bird, box, student,
king, movie, coin, chair, fruit, mountain, watch, see, want, need, can, wait,
quick, hurry, cooked — all consistent word→phrase→sentence).

## 4. Adjective+noun collision — scope measured, narrower than assumed
`"big cat"` / `"big dog"` / `"big bird"` / `"big fish"` **all** ship the
identical placeholder `"gonga mang"` (exact-phrase, .98) — genuine bug,
traced to `master_dictionary.json` bulk-generated rows, no native-evidence
ambiguity, safe to fix.
Same defect confirmed for `small` (`"small dog"`/`"small cat"` → `chik mang`)
and `good` (`"good dog"`/`"good cat"` → `ramang mang`).
**But this only affects animals that happen to have their own `master_dictionary.json`
"[adj] [animal]" row.** Animals without such a row (cow, goat, tiger, snake,
monkey, pig, rat) correctly fall through to `sov-assembly` and get distinct,
correct roots (e.g. `"big cow"` → `ma·su dal·a`, `"big elephant"` → `Mong dal·a`).
So the defect is **row-level, not systemic to the adjective-composition
engine** — worth confirming exact affected-row count before scoping a fix
(only 8 animals × 3 adjectives were sampled here — not a full sweep). B's
migration doc's "5 nouns" count is for the separate *counting-phrase* family,
not this adjective defect — the two need separate counts.

## 5. Plural/morphology audit — new findings beyond B's report
| input | expected root | actual | path | verdict |
|---|---|---|---|---|
| cats/dogs/elephants/fishes/chairs/mountains | same as singular | same as singular | sov-assembly, .75 | PASS (simple -s strip works) |
| birds/children/fruits/coins | correct plural form | correct | correction/exact-phrase | PASS |
| **babies** | gen·da-based plural | `[UNKNOWN]` | passthrough, 0 | **FAIL** — y→ies not handled at all |
| **cities** | so·hor-based plural | `[UNKNOWN]` | passthrough, 0 | **FAIL** — same y→ies gap |
| **knives** | Kettal | Kettal | **fuzzy(knife,d=2), .55** | PASS by accident — f→ves not recognized as a plural rule, only rescued by fuzzy edit-distance at low confidence |
| **leaves** | bi·jak-based | **Re·ongkata** (unrelated root) | sov-assembly, .75 | **FAIL, high severity** — `leaf`→`leaves` silently resolves to a *different word* (looks like it collides with the verb "leave"), not just a dropped plural |

Root cause: the pluralization layer only strips trailing `-s`/`-es`; it has no
rule for `-y→-ies` or `-f/-fe→-ves`, so irregular plurals either hard-fail
(`babies`, `cities`) or — worse — silently resolve to a wrong, unrelated
lexeme (`leaves`) at a confidence (.75) that gives no signal anything is
wrong. This is more severe than the already-known singular/plural gaps
because it's not just losing the plural marker, it's landing on the wrong
word entirely.

## 6. Location words — standalone vs. sentence
Standalone location words are correct (below/inside/outside/behind/beside/under
all exact-phrase/correction, .98-1.0). `above`/`across`/`over` are already
flagged low-confidence fuzzy matches standalone (`about`/`cross`/`cover`,
d=1-2, .55-.65) — pre-existing, not new.
**New finding:** in full sentences this degrades further and inconsistently.
`"the cat is below/inside/under the chair"` compose correctly (sov-assembly).
But `"the ball is above the table."` returns
`"[UNKNOWN] [UNKNOWN] daka [UNKNOWN] [UNKNOWN] [UNKNOWN]"` (compound-split,
.6) — near-total failure. Isolated the cause: `"ball"` alone isn't in the
dictionary at all but fuzzy-matches to `"tall"` (d=1, .65) when tested solo —
a false-positive fuzzy match dressed up as medium confidence. Inside the full
sentence, the same word instead fails outright to `[UNKNOWN]` via a different
code path (`compound-split`). **This is the same cross-path-inconsistency
pattern as the `cat` conflict**: identical input word, two different
pipelines (standalone lookup vs. sentence compound-split), two different
failure modes, neither of which surfaces "this word isn't in the dictionary"
honestly.

## 7. Verb paradigm (`eat`) — PASS, with one flag
Full paradigm consistent: `Cha·a` (bare) → `Anga Cha·a` (present) →
`Anga Cha·aha` (past) → `Anga Cha·gen` (future) → `Anga Cha·jawa` (neg-future)
→ `Anga cha·enga` (continuous). Question form (`"Did I eat?"` → `Anga Cha·a`,
sov-assembly, .75) does **not** actually mark the question morphologically —
identical string to the bare present. Flagging as a finding, not asserting
it's wrong: no Thangseng reference for "did I eat?" was in the supplied
evidence, so I can't confirm what the correct form should be.

## 8. Re-verification of previously-reported bugs (independently checked, not assumed)
- `king` → `Raja` (exact-phrase, .98) — **confirmed fixed**, matches prior sessions.
- `movie` → `film` (exact-phrase, .98) — **confirmed fixed**, no longer fuzzy-matching "move".
- `answer` → `Aganchaka` (correction, 1.0) — appears resolved (no longer a live tie); not independently re-derived against master_dictionary.json rows, so flagging as "appears fixed, not fully re-audited" rather than confirmed closed.
- `wait`/`quick`/`hurry`/`cooked` — all resolve to their previously-documented correct values.

## 9. Test coverage
Zero tests in `tests/unit/` reference `cat` as word/phrase/sentence. Zero
coverage found for irregular plurals (`babies`, `cities`, `leaves`, `knives`)
at any level — these are new gaps, not previously flagged anywhere in
WORKSTATE.yaml or prior audit reports I could find.

## 10. Severity ranking (highest first)
1. **`leaf`→`leaves` resolves to an unrelated word** (silent wrong-answer, no
   error signal, .75 confidence) — highest severity found this session;
   worse than an UNKNOWN because it looks confident and correct.
2. **`cat` three-way root conflict** (menggo/meng·gong) — blocks correctly
   answering "is this word right" until Thangseng adjudicates; already
   escalated by B, independently reconfirmed here.
3. **`"ball"` false-positive fuzzy match** (`tall`, d=1, .65) for a word not in
   the dictionary at all — same class of "confident wrong answer" as #1.
4. **`babies`/`cities` total failure** (no y→ies rule) — safe/honest failure
   (UNKNOWN), lower severity than #1/#3 because it doesn't lie.
5. **adjective+animal placeholder collision** (`big`/`small`/`good` × cat/dog/
   bird/fish) — confirmed real, but scope is narrower than "systemic": only
   animals with their own placeholder row are affected, not the whole class.
6. Sentence-level location-word compound-split fragility (`above the table`)
   — same root-cause family as #3, only manifests on multi-word input.

## 11. Recommended fixes (not implemented — read-only per spec)
- Add `-y→-ies` and `-f/-fe→-ves` pluralization rules before the generic `-s`
  strip, so irregular plurals hit the lemmatizer instead of either the
  passthrough fallback or a homograph.
- Relay `menggo` vs `meng·gong` to Thangseng specifically (exact question: is
  the cat word `menggo` or `meng·gong`?) before touching any `cat` row.
- Audit fuzzy-match thresholds for single-word lookups >0.5 conf — both
  `ball`→`tall` and `leaves`→(leave-root) suggest the edit-distance fallback
  fires on genuinely-unrelated words and dresses the result with enough
  confidence to look legitimate; consider gating fuzzy matches below some
  distance/length ratio to `[UNKNOWN]` instead.
- Enumerate the actual row count for the adjective+animal placeholder defect
  (only 8 animals × 3 adjectives sampled here) before scoping the fix
  Claude B's migration doc already queued.

## 12. What I did not get to
Did not systematically audit: full number/classifier sweep beyond
student+cat, the full question-type distinction (ordinary `-ma`/`-hama` vs.
interrogative-word — sampled but not exhaustive), or a row-by-row
source→master→compiled→runtime propagation trace (relied on live
`translate()` only). Flagging as open rather than claiming coverage I don't
have.
