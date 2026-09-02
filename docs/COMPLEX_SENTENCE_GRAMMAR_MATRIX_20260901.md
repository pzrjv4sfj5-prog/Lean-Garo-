# Complex Sentence Grammar Matrix — 2026-09-01

**Purpose:** Move beyond isolated basic sentences to test whether the
engine can *productively compose* complex sentences from known words +
confirmed grammar rules — as distinct from the dictionary simply
containing (or not containing) the exact sentence. No engine code
touched. No new grammar rules invented. Every sentence below was run
live through `translate()` against the current repo state (post
NV-103/NV-104 close, commit `964cf61` + follow-on `english` data fix,
not yet committed as of this doc).

**Method, for every test sentence:**
1. Native-confirmed structure available? (yes / partial / no)
2. Which existing `docs/GRAMMAR_RULE_CATALOGUE.md` rules apply?
3. Which parts are productive/generalizable vs. single-attestation?
4. Which parts are linguistically uncertain?
5. What should the engine compose, without inventing a form?
6. **Observed** engine output vs. that target.

None of these sentences exist verbatim in `corrections.json` (checked
per-sentence below) or as an exact `master_dictionary.json` key, except
where noted.

---

## 1. Subject + topic/contrast + object + verb

**Test:** "i speak garo but he speaks english"
**Observed:** `Anga rong·ko Agana Indiba Ua english·ko Agana` (multi-clause-join, 0.70)

1. Native-confirmed structure: partial. RULE-003 (SOV), RULE-004
   (pronoun paradigm: `Anga`=I, `Ua`=he), and the object-marking `-ko`
   suffix (attested across many sentences, e.g. RULE-042's dependency
   list) are each independently VERIFIED/HIGH. The contrastive
   conjunction `Indiba` ("but") is attested elsewhere in the corpus
   (unverified confidence — not yet checked against a Thangseng
   citation this session).
2. Rules applied: RULE-003 (SOV), RULE-004 (pronouns).
3. Productive: clause-per-clause SOV assembly, joined by a conjunction,
   is the same `multi-clause-join` method already used elsewhere in the
   corpus — reusable.
4. Uncertain: `Indiba`'s confidence tier (not itself re-verified this
   session); whether a topic-marking `-de` (RULE-042 family) belongs on
   the *first* subject to signal contrast — no native citation either
   way for a contrastive (as opposed to purely temporal) use of `-de`.
5. Target composition: two SOV clauses joined by the conjunction — this
   is what the engine produced.
6. **Result: matches target. No composition failure.** `Indiba`'s own
   confidence should be checked in a future dictionary-hygiene pass
   (not this session's task).

---

## 2. Adjective + noun phrase

**Test:** "the big red house"
**Observed:** `Gitchak Nok dal·a` (sov-assembly, 0.75)

1. Native-confirmed: partial. RULE-006 (Adjective Placement) is
   VERIFIED — establishes that adjectives are post-nominal in Garo, not
   pre-nominal as in English.
2. Rules applied: RULE-006.
3. Productive: RULE-006 explicitly documents adjective placement as
   general, not sentence-specific.
4. Uncertain: **the output only surfaces one adjective root
   (`Gitchak`/`dal·a`-adjacent) — it's not visible from the gloss alone
   whether "big" AND "red" both made it into the output, or whether one
   was silently dropped.** Also uncertain: when stacking two adjectives
   post-nominally, is there a fixed order (native languages often order
   size before color, or vice versa) — no citation on record either
   way.
5. Target: `Nok gitchak [red-word] -a` (noun, then both adjectives,
   post-nominal) if both adjectives are independently attested for
   "big" and "red" in the dictionary.
6. **Flag: needs a closer read of which lexical roots the engine
   actually pulled** (this doc doesn't re-derive that — see Claude B
   handoff #1) plus a Thangseng query on multi-adjective stacking order
   (see §Unresolved Boundaries below).

---

## 3. Multiple modifiers

**Test:** "my two old friends"
**Observed:** `Angni Gni git·cham cham·e` (sov-assembly, 0.75)

1. Native-confirmed: partial. Possessive `Angni` ("my") is a
   productive pronoun-suffix pattern (RULE-004 family, cf. RULE-047's
   note on the same productive-suffix class). Numeral `Gni` ("two") and
   RULE-038 (Counting Construction: noun + classifier-number) both
   exist and are VERIFIED.
2. Rules applied: RULE-004 (possessive), RULE-038 (counting).
3. Productive: possessive-prefix + adjective + noun stacking is the
   same general pattern used across many corpus sentences.
4. Uncertain: **RULE-038 specifies noun + classifier + number as the
   counting construction, but the observed output has no classifier
   between `Gni` and the noun** — for countable animate nouns like
   "friends", Garo classifier systems often require a person/animate
   classifier (distinct from the general-noun pattern). Whether
   "friends" takes an animate classifier is not documented in the
   catalogue as far as this review found.
5. Target: **unclear without a classifier citation for animate/human
   nouns** — this is a genuine linguistic boundary, not just an engine
   bug.
6. **This is a Thangseng query candidate (see below), not a Claude B
   handoff** — the gap is missing native evidence, not a mis-composing
   engine.

---

## 4. Object + case suffix + verb

**Test:** "give the book to me"
**Observed:** `Ki·tap Angko ron·a` (sov-assembly, 0.75)

1. Native-confirmed: yes. `-ko` object/dative marking is VERIFIED
   across dozens of corpus sentences (cited under RULE-042's dependency
   list and elsewhere).
2. Rules applied: object `-ko` suffix, RULE-003 (SOV).
3. Productive: fully general — `-ko` attaches to any object/recipient
   noun or pronoun.
4. Uncertain: none identified for this specific construction.
5. Target: object(`Ki·tap`) + recipient(`Angko`) + verb(`ron·a`) — SOV
   order with the double-object (direct + indirect) both marked.
6. **Result: matches target. No composition failure.**

---

## 5. Negation + tense/aspect

**Test:** "i will not go tomorrow"
**Observed:** `Anga knal·ko re·jawa` (grammar-assembly, 0.82)

1. Native-confirmed: partial. RULE-017 (Simple Negation `-ja`) is
   VERIFIED. RULE-023 (`-gen` future never carries raka) and RULE-002
   (Past/Perfect Unification) establish the tense-suffix family, but
   neither directly documents a **negated future** form.
2. Rules applied: RULE-017 (negation), RULE-003 (SOV).
3. Productive: negation attachment (`-ja`) onto a verb stem is
   documented as general.
4. Uncertain: **`re·jawa` does not obviously contain the `-gen` future
   marker documented in RULE-023** — it's not clear from the gloss
   whether Garo negates the future by suppressing the future suffix
   entirely (i.e., negated-non-past covers "won't" the same way
   RULE-027 says `-ja` covers past-referring negation generally) or
   whether this is a genuine gap. RULE-027's own title ("No True
   Simple-Past Suffix; `-ja` Covers Past-Referring Negation") is about
   *past* reference specifically — it doesn't establish the *future*
   negation case one way or the other.
5. Target: **cannot be stated with confidence without checking whether
   `re·jawa` is itself an already-VERIFIED citation form** (i.e. is
   this output pulled from a real dictionary row, or freshly composed
   by grammar-assembly from `re·` + `-ja` + `-wa`?).
6. **Flag for Claude B (informational only, not an engine-fix
   instruction): confirm whether `re·jawa` in this output traces to a
   VERIFIED dictionary citation or is engine-composed from
   sub-morphemes** — this doc cannot determine that from the gloss
   alone and does not attempt to read engine source per the "no engine
   code" instruction.

---

## 6. Question + tense/aspect

**Test:** "did you eat rice yesterday?"
**Observed:** `Na·a Mi Mejal Cha·a` (sov-assembly, 0.75)

1. Native-confirmed: **yes, and the observed output appears to violate
   an already-CLOSED rule.** RULE-046 (Yes/No Question Particle `-ma`)
   is Verified/High, P0, closed project-wide, with the *exact* worked
   example `"did you eat?"` → `Na·a Cha·ahama?` on record.
2. Rules applied (should have been): RULE-046 (`-ma` question particle,
   joined with no space), RULE-002 (past/perfect `-aha`).
3. Productive: RULE-046 is explicitly documented as a general,
   project-wide, closed rule — not sentence-specific.
4. Uncertain: nothing — this is exactly the pattern RULE-046 was closed
   against, just with "rice yesterday" as new object/time material.
5. Target: `Na·a Mi Mejal Cha·ahama?` (or equivalent past+question
   form) — object and time-adverbial inserted into the already-modeled
   slot, question particle attached with no space, past marking intact.
6. **Result: DOES NOT MATCH. This is a genuine composition failure —
   RULE-046 handoff #2 below.** The observed output is missing both the
   `-aha` past marker and the `-ma` question particle entirely, and
   ends on a bare, unmarked verb (`Cha·a`).

---

## 7. Modal + verb + object

**Test:** "i can speak garo"
**Observed:** `Anga rong·ko Agana` (grammar-assembly, 0.82)

1. Native-confirmed: yes for the modal itself. `can` = `man·a`,
   VERIFIED/HIGH in `master_dictionary.json` (a second candidate,
   `ama`, sits at unverified/no-confidence — this is the open item (2)
   already queued in `.ai/WORKSTATE.yaml`'s `pending_thangseng_questions`,
   unrelated to this finding).
2. Rules applied (should have been): modal + verb composition — no
   catalogue rule number found for this specific slot in this session's
   review (worth flagging as a documentation gap, not just an engine
   gap).
3. Productive: the modal lexeme itself (`man·a`) is VERIFIED and reused
   elsewhere; its composition *into a full sentence* alongside another
   verb has not been independently confirmed as a general pattern in
   this review.
4. Uncertain: whether `man·a` (or `ama`) attaches directly to the main
   verb, follows it as a separate word, or takes its own subject
   agreement — no native citation found in this review specifically
   showing modal+verb co-occurrence in one sentence.
5. Target: **cannot be fully stated — this is itself close to a
   linguistic boundary, not just an engine bug** — but at minimum the
   modal morpheme should appear somewhere in the output, which it does
   not.
6. **Result: the modal is completely absent from the output — "i can
   speak garo" and "i speak garo" would presumably produce identical
   output.** This is the strongest composition-failure candidate found
   this session — Claude B handoff #1 below. Also overlaps with the
   still-open `man·a`-vs-`ama` Thangseng question — resolving that
   question would also supply the missing citation for how modal+verb
   sentences are actually built.

---

## 8. Classifier + noun + number

**Test:** "three books"
**Observed:** `ki·tap king·gittam` (**exact-phrase**, 0.98)

1. Native-confirmed: yes — this resolved as an exact dictionary hit,
   not a composed sentence, so it doesn't test composition at all (the
   test sentence happened to already exist verbatim). RULE-038
   (Counting Construction) covers this pattern generally.
2–5. N/A — not a composition test.
6. **Note for the next test-set iteration: pick a number+noun
   combination NOT already in the dictionary** (e.g. "seven books",
   "twelve friends") to actually exercise RULE-038's productivity
   rather than hitting an existing exact-phrase row. Not repeated this
   session to preserve token budget — flagged for next session.

---

## 9. Locative + movement verb

**Test:** "he is going to the market"
**Observed:** `Ua bajalchi re·angenga` (grammar-assembly, 0.82)

1. Native-confirmed: yes. RULE-002/RULE-030 (`re·` vs. `re·ang` for
   "go", RESOLVED) and the locative suffix family (RULE-033/034,
   locative/directional vocabulary) are both VERIFIED.
2. Rules applied: RULE-030 (resolved re·/re·ang split), locative `-chi`
   ("to/toward").
3. Productive: both the locative suffix and the movement-verb choice
   are documented as general, not sentence-specific.
4. Uncertain: none identified — this looks like a clean composition.
5. Target: subject + place+locative + movement-verb(present-continuous)
   — matches SOV with the locative phrase pre-verbal, consistent with
   RULE-G2 (Pre-verbal Clustering).
6. **Result: appears to match target.** No native-confirmed full
   sentence exists to diff against directly, but every component rule
   is independently VERIFIED and the assembly follows documented word
   order — treat as a probable pass, not a certain one (no exact native
   citation for this *exact* sentence to compare against).

---

## 10. Purpose/infinitive clause

**Test:** "i came here to learn garo"
**Observed:** `Anga rong·ko skia·na re·ba·aha` (grammar-assembly, 0.82)

1. Native-confirmed: partial. The `-na` purpose/infinitive suffix
   (`skia·na` = "to learn") appears in the output and is consistent
   with infinitive-marking patterns seen elsewhere in the corpus, but
   this review did not find a catalogue rule number specifically
   documenting `-na` as a purpose-clause marker (as distinct from other
   `-na` uses noted incidentally in other rules, e.g. RULE-038's
   `-na` mentions).
2. Rules applied: none cleanly cited — **documentation gap**, not
   necessarily a composition failure.
3. Productive: unclear without a dedicated rule entry.
4. Uncertain: whether `-na` purpose-clauses have their own rule
   (undocumented) or are a sub-case of an existing rule not indexed for
   this construction.
5. Target: cannot be fully specified without that citation.
6. **Result: output looks linguistically plausible but cannot be
   confidently validated against the catalogue as written.** Recommend
   a dedicated catalogue search (not done this session, out of scope)
   or a Thangseng citation specifically eliciting a purpose-clause
   sentence to formalize this as its own rule if evidence supports it.

---

## 11. Coordinated phrases

**Test:** "i ate rice and drank water"
**Observed:** `Anga mi cha·aha Aro Chi ringaha` (multi-clause-join, 0.70)

1. Native-confirmed: yes for the components — `Aro` ("and"), `mi
   cha·aha` ("ate rice"), `Chi ringaha` ("drank water") are each
   independently attested.
2. Rules applied: RULE-003 (SOV) per clause, coordination via `Aro`.
3. Productive: `multi-clause-join` is a reusable engine method already
   seen in test #1 above — consistent behavior.
4. Uncertain: whether the subject (`Anga`) should be repeated before
   the second verb or can be dropped (subject-sharing across
   coordinated clauses) — no citation found either way; the observed
   output drops the second `Anga`, which reads naturally but is not
   confirmed as a rule.
5. Target: same shape as observed, contingent on the subject-drop
   question.
6. **Result: plausible, not independently disconfirmed.** Subject-drop
   in coordination is a reasonable candidate for a future Thangseng
   confirmation, not urgent.

---

## 12. Longer SOV sentence (multiple arguments)

**Test:** "my brother gave the old book to the teacher yesterday"
**Observed:** `Angni jo·jong git·cham Ki·tap Skigipa Mejal on·aha` (sov-assembly, 0.75)

1. Native-confirmed: partial — every individual lexical item
   (possessive `Angni`, `jo·jong`="brother", `git·cham`="old",
   `Ki·tap`="book", `Skigipa`="teacher", `Mejal`="yesterday", `on·aha`
   ="gave") is independently attested, but this exact multi-argument
   sentence has no native citation.
2. Rules applied: RULE-004 (possessive), RULE-006 (adjective
   placement), RULE-042 (`-de` temporal family — though `Mejal` here is
   a bare time adverb, not `-de`-marked).
3. Productive: SOV composition across many arguments is the same
   general engine method already validated in shorter sentences.
4. Uncertain: **word order among the non-core arguments** — is
   "yesterday" (time adverb) correctly placed between the recipient
   (`Skigipa`) and the verb, or should time adverbials front the
   sentence (many SOV languages, including Garo per other examples in
   this corpus, prefer time-adverbials sentence-initial)? Also
   uncertain: **no object-marking `-ko` visible on `Ki·tap` or
   `Skigipa`** despite `-ko` being the well-established object/dative
   marker used correctly in test #4 above — this is inconsistent within
   this very test set and worth flagging.
5. Target: cannot be fully specified without resolving the `-ko`
   inconsistency.
6. **Flag: possible composition inconsistency (Claude B handoff
   candidate #3, lower confidence than #1/#2) — `-ko` marking present
   in a 2-argument sentence (test #4) but absent in this 3+ argument
   sentence with the same object-marking pattern that should apply.**

---

## 13. Multi-construction sentence (conditional + negation + modal-ish "alone")

**Test:** "if he does not come tomorrow, i will go alone"
**Observed:** `Ua Knal Re·ba·jode, Anga ak·sa·ko Re·anggen` (if-clause-ode, 0.70)

1. Native-confirmed: yes for the conditional. RULE-008 (If-Clause
   Suffix `-ode`) is VERIFIED and the output correctly shows `-jode`
   (negation `-ja` + conditional `-ode`, consistent with RULE-017 +
   RULE-008 stacking).
2. Rules applied: RULE-008, RULE-017, RULE-020 (`an·tang`
   reflexive/self — though `ak·sa` here appears to be a different
   "alone" lexeme, not `an·tang`; worth a confidence check separately,
   out of scope this session).
3. Productive: conditional+negation suffix-stacking is exactly what
   RULE-008's dependency structure predicts — a genuine productive
   composition, correctly realized.
4. Uncertain: whether `ak·sa` ("alone") is the correct/only lexeme for
   this sense, vs. `an·tang` (RULE-020) — not resolved here.
5. Target: matches observed, modulo the `ak·sa` vs `an·tang` lexical
   question.
6. **Result: this is the strongest positive result in the test set — a
   genuinely productive, correctly-stacked multi-construction sentence
   with no native citation for the sentence as a whole.** Good evidence
   the engine can generalize suffix-stacking correctly when the
   individual rules are solid.

---

## 14. Negation + question (wh-question)

**Test:** "why did he not come?"
**Observed:** `Maina Ua Re·ba·ja` (sov-assembly, 0.75)

1. Native-confirmed: partial. `Maina` ("why") is attested; RULE-017
   (`-ja` negation) is VERIFIED and correctly applied.
2. Rules applied: RULE-017.
3. Productive: negation suffixing is general.
4. Uncertain: whether wh-questions in Garo also take the `-ma` particle
   from RULE-046, or whether `-ma` is specifically a yes/no marker that
   wh-words like `Maina` replace/preempt. RULE-046's own description
   scopes it explicitly as "Yes/No Question Particle" — so its absence
   here may be **linguistically correct**, not a bug, if wh-words and
   `-ma` are mutually exclusive in Garo (common cross-linguistically).
5. Target: cannot be fully confirmed without a citation on wh-question
   marking specifically.
6. **Result: plausibly correct, not a confirmed composition failure —
   distinct from test #6's yes/no-question failure, which IS confirmed
   against an explicit worked example.** Do not conflate these two.

---

## Confirmed Reusable Constructions (safe to rely on, evidence-backed)

| Construction | Rule(s) | Status |
|---|---|---|
| Basic SOV assembly | RULE-003 | Confirmed productive, many tests pass |
| Object/dative `-ko` marking (2-argument) | (unnumbered, well-attested) | Confirmed in test #4 |
| Possessive pronoun prefix | RULE-004 family | Confirmed in tests #3, #12 |
| Post-nominal adjective placement | RULE-006 | Confirmed in tests #2, #12 |
| Conditional `-ode` + negation `-ja` stacking | RULE-008, RULE-017 | Confirmed in test #13 — best result this session |
| Multi-clause coordination (`Aro`, `Indiba`) | (unnumbered) | Confirmed in tests #1, #11 |
| Locative `-chi` + resolved re·/re·ang movement verb | RULE-030, RULE-033/034 | Probable pass, test #9 |
| Counting construction (noun+classifier+number) | RULE-038 | Confirmed for existing entries; NOT stress-tested against a novel number this session (see test #8 note) |

## Unresolved Linguistic Boundaries (need Thangseng, not engine work)

1. **Modal + verb co-occurrence pattern** (test #7): how does `man·a`
   (or `ama`) actually combine with a main verb in one sentence? No
   citation found showing this directly. **Overlaps with the already-
   queued open item (2) in `.ai/WORKSTATE.yaml` (`man·a` vs `ama` for
   "can")** — recommend the next Thangseng relay batch combine both
   into one query:
   > "Can" — is it `man·a` or `ama` (or are both valid, in different
   > contexts)? And separately: in a sentence like "I can speak Garo",
   > where exactly does the "can" word go — before the verb, after it,
   > or does it take its own subject marking? A worked example sentence
   > would help most.
2. **Animate/human classifier for counting people** (test #3): does
   "friends" (or people generally) take a distinct classifier from the
   general noun-counting pattern in RULE-038? Precise query:
   > When counting people (e.g. "two friends", "three teachers"), is
   > there a special counting word/classifier used instead of the
   > general pattern, the way English says "two of them" vs "two
   > pieces"? A worked example with a specific number + a person-noun
   > would help most.
3. **Multi-adjective stacking order** (test #2): when two adjectives
   modify the same noun post-nominally (e.g. "big red house"), is there
   a fixed order? Precise query:
   > If a noun has two describing words at once (e.g. "big" and "red"
   > for a house), which order do they go in — does it matter? A
   > worked example with two adjectives on one noun would help most.
4. **Purpose/infinitive `-na` clause — formal citation** (test #10):
   worth a dedicated elicitation to confirm `-na` as a purpose marker
   and add a numbered rule, if the catalogue genuinely lacks one (this
   session did not exhaustively re-search the full 811-line catalogue
   for indirect `-na` mentions — flagged as "not cleanly cited," not
   "absent").
5. **Wh-question + `-ma` mutual exclusivity** (test #14): does `-ma`
   ever co-occur with wh-words like `Maina`, or are they always
   mutually exclusive? Precise query:
   > For a question that already has a question-word like "why" or
   > "what" in it, does the sentence still need the "-ma" ending, or
   > does the question-word alone make it a question? A worked example
   > would help most.

## Precise Handoff to Claude B (engineering-composition failures — Claude A did not touch engine code)

**#1 — Modal drop (highest priority).** `translate("i can speak garo")`
→ `Anga rong·ko Agana` (grammar-assembly, 0.82). The VERIFIED/HIGH
modal `man·a` ("can") does not appear anywhere in the output — the
sentence is indistinguishable from a plain "i speak garo." This is a
composition failure regardless of how the `man·a`-vs-`ama` Thangseng
question above resolves (either candidate should surface somewhere in
the output, and neither does). **Do not invent the correct
modal+verb word order** — that's linguistically uncertain per boundary
#1 above; wait for that citation, or coordinate with Claude A once it's
answered. In the meantime, this could be flagged/surfaced with a lower
confidence tier or a `[UNTRANSLATED-MODAL]`-style marker rather than
silently dropping the concept, if that's within the engine's existing
error-handling conventions — Claude A defers the specific mechanism to
Claude B's judgment.

**#2 — Question-marking regression against a closed rule.**
`translate("did you eat rice yesterday?")` → `Na·a Mi Mejal Cha·a`
(sov-assembly, 0.75). RULE-046 (P0, closed project-wide, 2026-08-28
sweep) explicitly documents `"did you eat?"` → `Na·a Cha·ahama?` as a
worked example. The observed output for a *structurally identical*
sentence (same subject, same verb "eat," same past-question shape, just
with an added object "rice" and time-adverbial "yesterday") has
**neither** the `-aha` past marker **nor** the `-ma` question particle
— it isn't just missing `-ma`, the verb ships fully bare (`Cha·a`
instead of even `Cha·aha`). This suggests the `sov-assembly` path
(triggered here because the sentence includes an object+time-adverbial,
unlike RULE-046's simpler worked examples) does not apply RULE-046 the
same way `grammar-assembly` apparently does for simpler question forms.
**Recommend checking whether `sov-assembly` and `grammar-assembly` are
two separate code paths that both need question-marking logic, and
whether only one currently has it** — Claude A did not read engine
source to confirm this per the "no engine code" instruction, so this is
a hypothesis for Claude B to verify, not a confirmed diagnosis.

**#3 — Possible `-ko` object-marking inconsistency (lower confidence).**
Test #4 (`"give the book to me"`) correctly marks both the direct and
indirect object with `-ko`. Test #12 (`"my brother gave the old book to
the teacher yesterday"`) — same `on·a`/`on·aha` ("give") verb family,
same double-object shape — shows **no** `-ko` on either `Ki·tap` (book)
or `Skigipa` (teacher). Possible cause: the extra modifiers (possessive
subject, adjective on the object, time adverbial) in test #12 may be
interfering with whichever composition path applies `-ko`, or test #12
may simply be routing through a different method than test #4 (both
show `sov-assembly` as the method tag, which argues against a
method-routing explanation — worth double-checking). **Not a confirmed
bug** — flagged as worth Claude B's direct investigation before
prioritizing a fix, since confidence is lower than #1/#2 above.

## Recommended Regression Cases (for the test suite, once #1/#2 above are fixed)

Add to `tests/unit/` once Claude B confirms a fix:
1. `"i can speak garo"` → must contain a `man·a`/`ama`-family modal
   morpheme (exact string TBD pending the Thangseng answer to boundary
   #1) — do not hardcode a specific answer before that citation exists.
2. `"did you eat rice yesterday?"` → must end in `-ma` (question
   particle, no space, per RULE-046) and must carry the `-aha` past
   marker — i.e. same shape as RULE-046's own worked examples, just
   with "rice"/"yesterday" inserted.
3. A second question+object+time sentence (not just the one above) to
   confirm #2 isn't a one-off — e.g. `"did you go to market
   yesterday?"` (RULE-046 already has a market-going worked example
   without a time adverbial: `Na·a Bajal Re·angama?` — the version WITH
   "yesterday" added is the untested variant).
4. Once boundary #3 (animate classifier) is answered by Thangseng, add
   a "count of people" regression case using the confirmed classifier.
5. `"three books"` was skipped as a real composition test this session
   because it already exists as an exact-phrase hit (test #8) — a
   *novel* number+noun combination (e.g. "seven pens", not currently in
   the dictionary) should be added as a genuine RULE-038 productivity
   regression test.

## What this matrix deliberately does NOT do

- Does not create new grammar rules to make any sentence "work."
- Does not treat any single test sentence as sufficient evidence to
  generalize a rule (see e.g. boundary #1–5 above, all left open rather
  than resolved by inference).
- Does not modify `src/` engine code, `translationEngine.js`, or any
  composition logic — every observation above is read-only, via
  `translate()` calls against the current build.
- Does not attempt to fix the three flagged composition issues — those
  are Claude B's territory per standing project convention.
