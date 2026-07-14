# Garo Grammar Rule Catalogue — v1.0

Structured per Sprint Work Package schema. Rule IDs map to
`THANGSENG_RULES_LOOKUP.md` source rules where applicable (cited).

### RULE-007 — `Hai` Construction (Hortative)
**Description:** `Hai` = "let's," precedes a verb in `-na` (infinitive, standard) or `-bo` (imperative-extended, "not so strict" register) form to form a hortative.
**Examples:** `Hai cha·na`="let's eat" (standard), `Hai cha·bo`="let's eat" (casual register — Thangseng's own words), `Hai re·naha`="let's go".
**Counterexamples:** none recorded.
**Dependencies:** RULE-015 (Stem Formation), RULE-029 (Hortative/Imperative `-bo`, shares the casual-register form).
**Native Notes:** Primary source: July 3-5 chat transcript — Thangseng explicitly: *"'bo' is essentially imperative. But it may also be used in a hortative sense also... 'let us eat' is expressed by saying 'hai cha·na'. But in a not so strict manner it may also be done by saying 'hai cha·bo'."*
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0 — implemented, 2 corpus examples.

---
### RULE-G2 — Pre-verbal Clustering (Locative Phrases)
**Description:** Locative phrases, classifier+number phrases, and other adjunct material cluster before the verb in SOV order, consistent with RULE-003.
**Examples:** `Achak tebil nokkimao ong·a` = "the dog is under the table" (locative phrase `tebil nokkimao` clusters before `ong·a`).
**Counterexamples:** none recorded.
**Dependencies:** RULE-003 (SOV Word Order), RULE-033 (Locative "Under").
**Native Notes:** Same source as RULE-033 — direct Thangseng confirmation, 2026-07-05.
**Validation Status:** Verified (one full-sentence example; general productivity across arbitrary locative+verb combinations not yet stress-tested — see Grammar Specification §2).
**Confidence:** High (this example); Medium (general productivity).
**Launch Priority:** P1.

---
### RULE-G7 — Existential Possession
**Description:** Possession is expressed existentially ("at me, X exists") rather than with a dedicated "have" verb in some constructions; `donga`/`dong·a` (exist/stay/have) does double duty.
**Examples:** `Uo bi·sa sakgittam donga` = "she has three children" (lit. "she child-classifier-three exists").
**Counterexamples:** none recorded — but see `VERB_INVENTORY.md`'s `dong` entry, which separately confirms `donga` also covers plain existential ("there is") and locative-stay senses, not exclusively possession.
**Dependencies:** none.
**Native Notes:** Primary source: July 3 chat transcript, direct Thangseng confirmation, superseding an earlier constructed (non-native) form — see `docs/NEW_SENTENCES_BATCH3_CONVERSATION.md`'s superseded-forms notice.
**Validation Status:** Verified.
**Confidence:** High — single example, but the underlying `donga` polysemy is independently cross-confirmed by multiple unrelated sentences (`VERB_INVENTORY.md`), so this isn't resting alone the way a truly isolated single example would be.
**Launch Priority:** P0 — the corrected form is already live in `corrections.json`.

---
### RULE-G-classifier — Numeral Classifiers
**Description:** Counted nouns take a classifier attaching to the number, not the noun; classifier choice depends on the noun's semantic class (books, animals, long objects, trees, pens/sticks each take a different classifier).
**Examples:** `ki·tap kinggittam`="three books" (`king`, no raka), `achak mang·gni`="two dogs" (`mang·`, raka), `wa·a jolsa`="one stalk of bamboo" (`jol`, no raka), `a'bil panggni`="two trees" (`pang`, no raka), `kolom ge·sa`="a pen" (`ge·`, raka).
**Counterexamples:** none recorded. Note: `translationEngine.js`'s `classifierHints` only implements `mang`/`sak`/`gong`/`king` — `jol` and `ge·` are confirmed but unimplemented (flagged to Claude B, `PROJECT_STATUS.md`).
**Dependencies:** RULE-001 (Raka Locality — classifier raka is lexical per-classifier, same locality principle).
**Native Notes:** THANGSENG classifier confirmation, primary source suffixes.pdf transcript (bamboo/pen examples with explicit raka notes), Rule 21.
**Validation Status:** Verified.
**Confidence:** High — 5 independent examples across distinct classifier classes, the best-evidenced morphological category in the repository alongside RULE-001.
**Launch Priority:** P0 (3 of 5 classifiers implemented); P1 (`jol`/`ge·` implementation gap).

---
### RULE-015 — Stem Formation
**Description:** Stem = root minus trailing letter. If the root carries raka, letters after the raka are stripped but raka is retained; suffixes attach to the stem, not the citation form.
**Examples:** `daka`→`dak`+suffix (`dakgen`, `dakbo`, `daknabe`, `dakjawa`); `cha·a`→`cha·`+suffix (`cha·gen`, `cha·bo`); `ka·a`→`ka·`+suffix. Compound verbs: only the second word changes (`a·jak soka`→`a·jak sok`+suffix).
**Counterexamples:** Adding suffix without stripping (`ka·a`+`jawa`) is confirmed incorrect. Dropping raka (`ka`+`jawa`) is confirmed incorrect — raka must be retained even after stripping.
**Dependencies:** RULE-001 (Raka Locality); underlies every tense/aspect/mood suffix rule in this catalogue.
**Native Notes:** Source Rule 15, `GRAMMAR_SPEC.md`. Primary source: suffixes.pdf transcript, gives the rule explicitly with worked examples for both raka and non-raka roots, plus explicit incorrect forms.
**Validation Status:** Verified.
**Confidence:** High — this is the generative mechanism every other verb/adjective suffix rule in this catalogue depends on.
**Launch Priority:** P0 (implicit throughout `applyTense`'s generic branch, no dedicated catalogue entry until now — documentation gap, not an evidence gap).

---
### RULE-020 — `an·tang` Reflexive/Self
**Description:** `an·tang` = "self"; `an·tangni` = genitive form ("of himself/herself," "his/her" when reflexive).
**Examples:** `Ua an·tangni kamko dakjaha` = "she/he did not do her/his [own] work" (breakdown: `ua`=he/she, `an·tangni`=of himself/herself, `kamko`=work, `dakjaha`=did not do).
**Counterexamples:** none recorded.
**Dependencies:** RULE-004 (Pronoun Paradigm), RULE-018 (Verbal-Adjective `-gija`, co-occurs in the fuller version of the same example: `Ua an·tangni kamko dakgija dongaha` = "she remained without doing her own work").
**Native Notes:** Primary source: notes.pdf transcript, point 3.
**Validation Status:** Verified (one worked sentence, no counterexample).
**Confidence:** Medium — single example, no test of reflexive vs. non-reflexive possessive contrast (e.g. "she did her [someone else's] work" to confirm `an·tangni` is specifically reflexive and not just general 3rd-person genitive).
**Launch Priority:** P1 — not currently wired into `translationEngine.js` at all (`GRAMMAR_SPEC.md`'s own note: "corrections.json only... gap"). Engine implementation is Claude B's call.

---
### RULE-005 — Copula `daka`
**Description:** `daka` functions as a copula in at least two confirmed contexts: (a) bare existential "to be" with no complement (`Anga daka`="I am", strongly attested — all 4 persons independently live in `corrections.json`); (b) predicate nominal ("X is a Y": `Ang·ni pa·a skigipa daka`="my father is a teacher") — **provenance caution added 2026-07-10**: `GARO_GRAMMAR_REFERENCE.md` (superseded doc, but internally dated) lists this exact sentence as "unconfirmed... SOV pattern-logic" as of 2026-06-29, so while it's live in `corrections.json`, its original confirmation source is genuinely uncertain, not necessarily native-direct. Treat (b) as Medium, not High, until re-confirmed. A third possible use — predicate adjective — has one ambiguous data point (`rinok rinok daka`="is gentle," from `love is not angry but gentle`) that could be adjectival or could be a manner/state-noun construction closer to (b); not confidently classified either way.
**Examples:** `Anga daka`/`Na·a daka`/`Ua daka`/`An·ching daka` (bare, all persons, verified live in `corrections.json`); `Ang·ni pa·a skigipa daka` (predicate nominal); `rinok rinok daka` (ambiguous).
**Counterexamples:** `Anga kusi ong·a`="I am happy" and `Nama ong·a`="it is good" — clear predicate-adjective constructions that do **not** use `daka` — confirms `daka` is not simply interchangeable with the `ong·a` strategy, at minimum for these two adjectives.
**Dependencies:** RULE-031 (Copula Inconsistency) — this finding narrows but does not resolve RULE-031: the open question is specifically predicate-adjective selection (`ong·a` vs. bare-adjective), not whether `daka` is a real, broadly-used copula (it clearly is, for at least contexts (a) and (b) above).
**Native Notes:** Source Rule 5, `GRAMMAR_SPEC.md`. `GARO_GRAMMAR_REFERENCE.md` (2026-07-10 review) claims `daka` "works for ALL persons" as a general copula, confirmed correct for contexts (a)/(b) against live `corrections.json` data — but the same document also contains a confirmed error elsewhere (`ring·aha` mislabeled "drank," actually the `ring·`="sing" root — the exact lexical split NV-010 already resolved), so its claims were verified individually here, not trusted wholesale. General lesson: legacy doc trust is per-claim, not per-document.
**Validation Status:** Verified (bare copula, all 4 persons); Needs Additional Evidence (predicate nominal — live but provenance-uncertain); Needs Native Validation (predicate-adjective use — the `rinok rinok daka` ambiguous case).
**Confidence:** High (bare copula); Medium (predicate nominal, per provenance caution above); Low (predicate adjective).
**Launch Priority:** P0 — not wired into `translationEngine.js` grammar-assembly at all (confirmed via full engine read, 2026-07-09) despite being clearly live and correct in `corrections.json`'s exact-match layer. The engine gap is real even though the linguistic rule is now better-evidenced than before.

---
### RULE-006 — Adjective Placement
**Description:** Adjectives follow the noun they modify (confirmed pattern across attested examples), not preceding it as in English.
**Examples:** `Gari sila`="the car is beautiful" (predicative use); attributive use not separately attested with its own example.
**Counterexamples:** none recorded.
**Dependencies:** RULE-031 (shares evidence with the bare-adjective predicative strategy).
**Native Notes:** Source Rule 6, `GRAMMAR_SPEC.md`.
**Validation Status:** Verified (predicative); Needs Native Validation (attributive, noun+adjective within a noun phrase rather than as a predicate — no clean example distinguishing the two uses found yet).
**Confidence:** Medium.
**Launch Priority:** P1 — not modeled in the engine at all (`GRAMMAR_SPEC.md`'s own note).

---
### RULE-009 — Noun Suffix System
**Description:** Umbrella rule for the noun-case suffix set: `-ko` (accusative/object), `-o` (locative), `-chi` (allative/motion-to), `-ni` (genitive), `-na` (dative/infinitive-purposive). Each suffix independently confirmed (see RULE-033/034/035 for `-o` specifically); this entry exists to track the *system* rather than duplicate each suffix's own rule.
**Examples:** see RULE-033 (`-o`), RULE-030 (`-chi`), `Angni ki·tap`="my book" (`-ni`), `Angna ki·tap ra·babo`="bring me a book" (`-na` dative).
**Counterexamples:** none recorded.
**Dependencies:** RULE-033, RULE-034, RULE-035 (`-o`); RULE-030 (`-chi`).
**Native Notes:** Source Rule 9, `GRAMMAR_SPEC.md`; primary source suffixes.pdf for the full system overview.
**Validation Status:** Verified (`-ko`, `-chi`, `-ni`, `-na`); Verified with productivity caveats (`-o`, per RULE-033/G2).
**Confidence:** High (individual suffixes); Medium (system-level generalization across arbitrary nouns).
**Launch Priority:** P0 (`-ko` implemented); P1 (`-o`/`-chi`/`-ni`/`-na` general grammar-assembly routing — `-ko` is the only one currently wired, per `GRAMMAR_SPEC.md`'s own gap note, confirmed by engine read).

---
### RULE-014 — `dongama` Existential "There Is"
**Description:** `dongama` marks existential "there is" constructions, distinct from possessive/locative uses of `dong`/`donga` documented elsewhere (see `VERB_INVENTORY.md`'s `dong` entry).
**Examples:** none with a full worked sentence in this repository yet — flagged as existing but unattested with a concrete example.
**Counterexamples:** none recorded.
**Dependencies:** `VERB_INVENTORY.md`'s `dong` entry (RULE-G7 existential possession is a related but distinct sense — worth checking whether `dongama` and plain `donga` differ systematically or are register/emphasis variants).
**Native Notes:** Source Rule 14, `GRAMMAR_SPEC.md`.
**Validation Status:** Needs Native Validation — no worked example found in any document read so far.
**Confidence:** Low — asserted but unattested.
**Launch Priority:** P2 — not modeled in the engine.

---
### RULE-021 — `song·` vs. `songna` — Raka Distinguishes Meaning
**Description:** `song·` (with raka) and `songna`/`song` (without) are different words — raka distinguishes "cook" from "plant," not a free variant of one root. Same class of lexical split as `ring·`("sing")/`ring`("drink"), NV-010's resolved case.
**Examples:** dictionary entries for "cook" vs. "plant" (see `master_dictionary.json`/`corrections.json`).
**Counterexamples:** treating these as one root with inconsistent raka would be the exact mistake this rule exists to prevent.
**Dependencies:** RULE-001 (Raka Locality — this is the sharpest confirmed example of raka being lexically contrastive, not just phonologically present/absent).
**Native Notes:** Source Rule 21, `GRAMMAR_SPEC.md`.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0 — implemented, dictionary-level distinction already in place.

---
### RULE-023 — `-gen` (Future) Never Carries Raka
**Description:** The future suffix `-gen` never triggers or carries raka, regardless of the root it attaches to — a specific, testable claim distinct from RULE-001's general locality principle.
**Examples:** `bilakgen`="will be strong" (root `bilak`, no raka on the suffix); general pattern across future-tense forms.
**Counterexamples:** none recorded.
**Dependencies:** RULE-001 (Raka Locality), RULE-015 (Stem Formation).
**Native Notes:** Source Rule 23, `GRAMMAR_SPEC.md`.
**Validation Status:** Verified, though `GRAMMAR_MORPHOLOGY_CONFIDENCE_REVIEW.md` already flagged this exact claim as resting on a single example (`bilakgen`) and recommended a raka-bearing-root test case to confirm raka-suppression generally, not just absence-on-an-already-raka-free-root.
**Confidence:** Medium — the claim itself is clean, but the one example available doesn't distinguish "never had raka to begin with" from "raka actively suppressed."
**Launch Priority:** P1.

---
### RULE-024 — `-aha` Full-Root-Append Exception
**Description:** A specific subset of verbs append `-aha` to the full root rather than the stripped stem (RULE-015's normal stem-formation rule), confirmed via internal QA rather than native elicitation.
**Examples:** `he cooked` (per `GRAMMAR_SPEC.md`'s citation — root not independently re-verified against confirmed dictionary data in this pass).
**Counterexamples:** RULE-015's normal pattern, which this rule is an exception to.
**Dependencies:** RULE-015 (Stem Formation), RULE-002 (Past/Perfect Unification).
**Native Notes:** Source Rule 24, `GRAMMAR_SPEC.md` — internal QA discovery (2026-07-04), not a direct Thangseng statement. Flagged here as lower-provenance than most other rules in this catalogue.
**Validation Status:** Needs Native Validation — internal-QA-confirmed only, never independently checked against a native source in any document read so far.
**Confidence:** Low-Medium — real (caught a live bug at the time) but provenance is engineering-internal, not native.
**Launch Priority:** P1.

---
### RULE-027 — No True Simple-Past Suffix; `-ja` Covers Past-Referring Negation
**Description:** Garo has no dedicated simple-past negation suffix distinct from present negation — `-ja` covers both, disambiguated by context, not morphology.
**Examples:** `na·a mijalo anti re·angama?`="did you go to the market yesterday?", native reply confirmed as `re·angja`="did not go" (past-referring, same `-ja` used for present negation).
**Counterexamples:** none — this rule documents an *absence* (no dedicated past-negative morpheme), confirmed by Thangseng directly answering "is there a confirmed suffix for true simple past negation?" with no.
**Dependencies:** RULE-017 (Simple Negation `-ja`) — RULE-027 is the specific "does -ja also cover past?" confirmation for that rule.
**Native Notes:** Primary source, July 5 chat transcript: *"I don't think that we have something that may be called a true simple past suffix. As far as I can tell, 'ja' is also used to talk about past events."* Direct, unambiguous answer to a consolidated native-validation question.
**Validation Status:** Verified.
**Confidence:** High — direct, explicit native answer to a specifically-posed question, not inferred.
**Launch Priority:** P0 — implemented (`applyNegation` is tense-independent per `GRAMMAR_SPEC.md`).

---
### RULE-028 — `-aha`/`-manaha` Overlap in Spoken Garo
**Description:** `-aha` (simple past/perfect, RULE-002) and `-manaha` (completive, RULE-026) overlap in meaning in spoken Garo — not fully distinct categories in practice, though RULE-026 treats them as formally separate.
**Examples:** `cha·aha`="ate" vs. `cha·manaha`="ate/has done eating" — both acceptable, per Thangseng.
**Counterexamples:** none — this rule documents overlap, not a contrast.
**Dependencies:** RULE-002, RULE-026 — this rule is the explicit native confirmation that those two rules' domains overlap rather than being cleanly complementary.
**Native Notes:** Primary source, July 5 transcript, direct answer to "does -manaha ever overlap with or replace -aha?": *"'aha' and 'manaha' do overlap in meaning as far as spoken Garo is concerned. How it is used in literature cannot be verified due to lack of source."*
**Validation Status:** Verified (spoken register); explicitly unconfirmed for written/literary register — Thangseng flagged this distinction himself.
**Confidence:** High.
**Launch Priority:** P0 — by design, no code enforces artificial separation (`GRAMMAR_SPEC.md`'s own note).

---
### RULE-032 — `search` = `Sandia`
**Description:** `Sandia` is the confirmed, correct word for "search," replacing a contaminated `am·e·nik·na` compound that persisted incorrectly in some code paths.
**Examples:** `search`, `search for him`, `he searched`, `he was searching`, `she used to search` — full paradigm confirmed via natural `applyTense` generation from the `Sandia` root.
**Counterexamples:** `am·e·nik·na` — confirmed wrong, retained as documented counterexample. Also see `Am·a` — a second, independently-confirmed word for "search" (primary source, July 3 transcript: *"Sandia = search / Am·a (note the raka) = search"*) — likely a synonym, not a competing "correct" answer; not yet resolved which the translator should prefer by default beyond `Sandia`, already the more repeatedly-attested one.
**Dependencies:** RC-CANDIDATE-006 (`docs/PENDING_REGRESSION_CASES.md`) — the still-live purpose-clause bug where `am·e·nik·na` persists despite this rule.
**Native Notes:** Source Rule 32, `GRAMMAR_SPEC.md`; `Am·a` synonym from July 3 primary-source transcript.
**Validation Status:** Verified (`Sandia`); Verified (`Am·a` exists, unresolved how it relates — synonym, register variant, or narrower sense not yet distinguished).
**Confidence:** High (`Sandia` as the primary form); Medium (relationship between `Sandia` and `Am·a`).
**Launch Priority:** P0 (`Sandia`, implemented in `corrections.json`); P1 (`purpose_map.json`'s stale `am·e·nik·na`, RC-CANDIDATE-006 — already reviewed with `Sandi·na` recommended).

---
### RULE-001 — Raka Locality
**Description:** Raka (·) exists only in verb/noun roots, never introduced by a suffix.
**Examples:** `cha·a→cha·aha` (retained); `dak→dakja` (never introduced).
**Counterexamples:** none confirmed.
**Dependencies:** Stem Formation Rule (RULE-015).
**Native Notes:** Source Rule 1, foundational, re-confirmed via majority-vote audits across 8+ separate root-consistency bugs found and fixed.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-002 — Past/Perfect Unification
**Description:** `-aha` marks both simple past and perfect aspect; Garo does not obligatorily split these.
**Examples:** `cha·aha` = "ate" / "has eaten" (both, context-disambiguated).
**Counterexamples:** none confirmed.
**Dependencies:** RULE-015 (full-root-append exception).
**Native Notes:** Source Rule 2.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-003 — SOV Word Order
**Description:** Base sentence order is Subject-Object-Verb.
**Examples:** `Achak Angko chikaha` (dog me bit).
**Counterexamples:** Imperatives drop subject (RULE-003b).
**Dependencies:** none.
**Native Notes:** Source Rule 3.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-003b — Imperative Subject-Drop
**Description:** Commands have no overt subject.
**Examples:** `Sengbo` (stop!).
**Counterexamples:** none.
**Dependencies:** RULE-003.
**Native Notes:** Source Rule 3.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-004 — Pronoun Paradigm
**Description:** Full subject/object/possessive pronoun table, plus formal/informal register pair (Ua/Bia).
**Examples:** See Grammar Specification §3.
**Counterexamples:** `bio` (informal locative "at him/her") has no attested form in either register — not a counterexample, an unfilled cell.
**Dependencies:** none.
**Native Notes:** Source Rule 4.
**Strengthened by (2026-07-08):** `docs/NATIVE_SENTENCE_VALIDATION_AUDIT.md` Case 1 confirms subject pro-drop occurs outside the imperative context RULE-003b already covers — a full declarative sentence ("(I) don't need to watch TV...") with "I" fully implied, not spoken, native-confirmed by Thangseng. This is existing knowledge getting *stronger* (pro-drop is broader than the imperative-only case previously documented), not a new rule — RULE-003b's scope note should be read as "imperatives always drop the subject" rather than "only imperatives drop the subject." No catalogue change needed beyond this note; flagging so a future implementer doesn't assume subject-drop is imperative-exclusive.
**Validation Status:** Verified (core table); Unknown (informal locative cell).
**Confidence:** High (core); N/A (unfilled cell — do not guess).
**Launch Priority:** P0 (core); deferred (unfilled cell, low practical impact).

---
### RULE-008 — If-Clause Suffix `-ode`
**Description:** Subordinating suffix attached directly to verb stem for conditional clauses.
**Examples:** `cha·ode` = "if eat"; `Na·a cha·ode, bilakgen` = "if you eat, you will be strong."
**Counterexamples:** none confirmed.
**Dependencies:** RULE-015.
**Native Notes:** Source Rule 8.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P1 (subordination is lower-frequency than core tense/negation).

---
### RULE-013 — Chim (Discontinued Past)
**Description:** `chim` is a free-standing post-verbal word (not a fused suffix) marking "used to X" (with plain root) or "was X-ing, no longer" (with continuous form).
**Examples:** `ka·achim` = "used to work"; `poraienga chim` = "was studying" (note: space).
**Counterexamples:** Do not fuse as `poraiengachim` — confirmed wrong; the pastcont+chim construction is always two words.
**Dependencies:** RULE-001, RULE-011 (continuous), RULE-015 exception.
**Native Notes:** Source Rule 13. This was a real, fixed implementation bug (fused form produced incorrect output) — retained here as a explicit counterexample for future implementers.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-017 — Simple Negation (`-ja`)
**Description:** `-ja` marks negation for both present and past reference; there is no separate confirmed simple-past-negative suffix.
**Examples:** `cha·ja` = "does not / did not eat."
**Counterexamples:** `-jaha` does NOT mean past negation (see RULE-025).
**Dependencies:** RULE-015.
**Native Notes:** Source Rule 17, corrected 2026-07-05 from an earlier (wrong) assumption that `-jaha` was past negation.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-018 — Verbal-Adjective `-gija`
**Description:** `-gija` forms a verbal adjective ("without doing X"), always paired with a following main verb; it is not a general negation strategy.
**Examples:** `Ua an·tangni kamko dakgija dongaha` = "she stayed without doing her work."
**Counterexamples:** `-gija` used alone as a sentence's only verb is a misuse (a historical implementation bug, since fixed).
**Dependencies:** RULE-017 (contrast).
**Native Notes:** Source Rule 18, corroborated by independent adjective-placement evidence (namja vs. namgija positional flexibility) in `GARO_GRAMMAR_REFERENCE.md`.
**Validation Status:** Verified (structural distinction); Needs Native Validation (exact English-pattern-to-form selection rule, i.e. when an arbitrary "not X-ing" input should trigger `-gija` vs. `-ja`, beyond the "without" pattern already implemented).
**Confidence:** High (structure); Medium (full selection rule).
**Launch Priority:** P0 (structure, already implemented); P1 (selection-rule refinement).

---
### RULE-025 — Cessative `-jaha`
**Description:** `-jaha` marks cessation ("was doing, has now stopped"), an aspectual category distinct from both negation and simple past.
**Examples:** `cha·jaha` = "has stopped eating" (NOT "did not eat").
**Counterexamples:** The 2026-07-01 assumption that this meant past-negation is a documented, corrected error — retained as counterexample for institutional memory.
**Dependencies:** RULE-017 (contrast).
**Native Notes:** Source `GRAMMAR_NOTES_JAHA_MANAHA_20260703.md`, direct native correction.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-026 — Completive `-manaha`
**Description:** Marks completive aspect ("has finished X"); overlaps with `-aha` in casual spoken usage per direct native confirmation, but is not identical in careful usage.
**Examples:** `cha·manaha` = "has eaten" / "ate" (completive framing).
**Counterexamples:** none confirmed; the aha/manaha overlap itself is confirmed, not a counterexample.
**Dependencies:** RULE-002 (contrast/overlap).
**Native Notes:** Source Rule 28.
**Validation Status:** Verified (existence and overlap); Needs Native Validation (precise contexts where they diverge, if any).
**Confidence:** Medium-High.
**Launch Priority:** P1.

---
### RULE-029 — Hortative/Imperative `-bo`
**Description:** Single suffix form serves both imperative (command) and hortative ("let's") functions.
**Examples:** `Sengbo` = "stop!" (imperative); `Biko sandibo` = "search for him!" (imperative); hortative use disambiguated by subject/context.
**Counterexamples:** none confirmed.
**Dependencies:** RULE-003b.
**Native Notes:** Source Rule 29, corrects an earlier imperative-only assumption.
**Validation Status:** Verified.
**Confidence:** High.
**Launch Priority:** P0.

---
### RULE-030 — `re·` vs. `re·ang` for "Go" [OPEN]
**Description:** Two forms of "go" coexist in confirmed data with no settled selection rule: bare `re·` (used in destinationless contexts) vs. `re·ang` (used in the general dictionary and in destination-bearing contexts).
**Examples:** `Re·jawa` = "I will not go" (bare, no destination); `Hai re·naha` = "let's go" (bare, no destination). Contrast: `Re·anga`=go, `re·angenga`=going, `Dokanchi re·angbo`=go to the shop, `nokchi re·anggen`="will go home now" (`BUG_home_missing_and_go_double_raka.md`), `Antichi re·angbo`="go to the market" (suffixes.pdf, imperative) — **four** independent examples now, all `re·ang` + a `·chi`-marked destination, strengthening (not proving) the destination-conditioned hypothesis. Complication: the same primary source (`BUG_home_missing_and_go_double_raka.md`) also confirms bare `re·` variants (`da·o re·gen`) are accepted even when "home" is semantically present but omitted from the surface sentence — so the split may track surface NP presence rather than pure semantic destination, or there may be genuine free variation in casual speech (see Thangseng's own methodology answers on register variation, `THANGSENG_NATIVE_VALIDATION.md` NV-001 update).
**Counterexamples:** N/A — like RULE-031, this documents an unresolved question, not a settled pattern with exceptions.
**Dependencies:** none identified yet; would inform future Verb Family documentation for "go."
**Native Notes:** Source Rule 30 (`THANGSENG_RULES_LOOKUP.md`), flagged 2026-07-05. Not yet put to Thangseng as a direct paired-contrast question. See `docs/THANGSENG_NATIVE_VALIDATION.md` NV-001 for the full evidence review and proposed minimal test sentences.
**Validation Status:** Needs Native Validation.
**Confidence:** Low (as a unified selection rule); High (each individual confirmed form).
**Launch Priority:** P0 — high-frequency verb, currently only narrowly patched in `corrections.json` (`will not go`/`i will not go` → `re·jawa`) specifically to avoid over-generalizing an unconfirmed pattern.

---
### RULE-031 — Copula Inconsistency [OPEN]
**Description:** Three unreconciled predicative strategies coexist in confirmed data — not four; see the Correction note below, which retracts an earlier session's speculation about a fourth pattern: (a) an `ong·a`-copula strategy, always in bare/uninflected form, attaching after an adjective or stative noun (`Anga kusi ong·a`="I am happy", `Anga duk ong·a`="I am sad"); (b) self-inflecting stative roots that take normal verb morphology directly with no copula element at all (`Anga sakamenga`="I am sick", using `-enga` progressive on the root itself); (c) a zero-copula bare-adjective strategy with no `ong·a` or inflection at all (`Gari sila`="the car is beautiful", `Me·chik sila`/`Me·asa sila`, `Anga am`="I am okay"). `daka`-copula (Rule 5) is confirmed to exist but has no worked predicative-adjective example — its behavior here is unattested, not just unconfirmed, so it isn't counted as a fourth confirmed strategy above.
**Examples:** `ong·a`-copula (bare): `Anga kusi ong·a`, `Anga duk ong·a`, `Achak tebil kokkimao ong·a` (locative/existential use). Self-inflecting: `Anga sakamenga`. Zero-copula bare-adjective: `Gari sila`, `Me·chik sila`, `Me·asa sila`, `Ua me·asa namen changroa`, `Anga am`, `Sepanga`/`Chel·a` (near/far).
**Correction (2026-07-09):** An earlier working note in this session speculated that `Anga duk ong·enga` (sad, with progressive suffix) suggested a *fourth* copula-adjacent pattern (`ong·` as an inflectable verb root, distinct from the three strategies above). That form is **stale** — `docs/GLOBAL_RAKA_CONVERSION_HANDOFF.md` (2026-06-17) shows it was corrected to `Anga duk ong·a` (bare, no progressive) before this session started, confirmed live in `corrections.json`. The speculation was built on a historical batch log (`NEW_SENTENCES_BATCH3_CONVERSATION.md`) without checking whether it had been superseded — retracted here rather than left standing. The corrected data is simpler and cleaner: `duk ong·a` is just another instance of the already-known bare `ong·a` pattern, not a new one.

**Correction (2026-07-10):** Cross-checking `GARO_GRAMMAR_REFERENCE.md` against live `corrections.json` (see RULE-005) confirms `daka` is a real, broadly-used copula for bare existential and predicate-nominal constructions — not merely "unattested" as this rule previously said. This **narrows** the open question rather than resolving it: `daka` is confirmed to *not* compete with `ong·a`/bare-adjective for predicate-adjective sentences specifically (no confirmed case of `daka` following a clear adjective, only one ambiguous case) — so the real unresolved selection is `ong·a` vs. bare-adjective for predicate adjectives, a 2-way question, with `daka`'s role now reasonably well understood as a separate, mostly-settled construction.
**Counterexamples:** N/A — this rule documents an unresolved contradiction, not a settled pattern.
**Dependencies:** affects RULE-004 (predication generally), Grammar Specification §5. Connects to the register-variation pattern noted across several other rules this session (see `THANGSENG_NATIVE_VALIDATION.md`'s discussion of formal/spoken doublets) — worth checking whether any of these three strategies track register rather than a strictly grammatical trigger.
**Native Notes:** Source Rule 31, flagged by repository audit, not yet put to Thangseng.
**Validation Status:** Needs Native Validation.
**Confidence:** Low (as a unified rule); High (each of the three strategies individually attested, now on verified-current data).
**Launch Priority:** P0 — highest-priority open linguistic question for the launch sprint, given predication's frequency.

---
### RULE-033 — Locative "Under," Retiring a Lexical Confusion
**Description:** "Under" = `nokkima`/`kokkima` (confirmed equivalent register/spelling variants, not one correct and one erroneous form — see update below) + locative `-o`. A prior implementation entry (`Ka·ma·o`) incorrectly reused the unrelated word "down" (`Ka·ma`) + `-o`.
**Examples:** `Achak tebil nokkimao ong·a` = "the dog is under the table."
**Counterexamples:** `Ka·ma·o` — confirmed wrong, retained as a documented counterexample.
**Dependencies:** RULE-001 (raka), Grammar Specification §6 (locative suffix), Morphology Specification §5 (lexical-split caution). See also RULE-034 (wider locative/directional set) and RULE-035 (under/beneath sense split).
**Native Notes:** Source Rule 33; root cause traced to a same-suffix confusion between two unrelated roots (`down` vs. `under`), not a random error — instructive for future implementers per Morphology Specification §5.
**Update (2026-07-08):** The `kokkima`/`nokkima` spelling discrepancy flagged in `edc94b7`/`THANGSENG_RULES_LOOKUP.md` is now resolved — both are confirmed legitimate variants, not a typo needing correction. Source: relayed native guidance (Thangseng via Tridip, 2026-07-08), logged in `docs/PENDING_LINGUISTIC_PROPOSAL_20260708_locatives.md`. See RULE-035 for the related but distinct "under" vs. "beneath" (`mitapo`) sense split, which this rule's general "under" mapping does not cover.
**Validation Status:** Verified (core "under the table" sentence, direct Thangseng confirmation, unchanged); Verified at Medium confidence (spelling-variant resolution — relayed, not a direct real-time confirmation session; see RULE-035 note on evidentiary standard).
**Confidence:** High (core rule); Medium (spelling-variant resolution, pending direct confirmation opportunity).
**Launch Priority:** P0 (correction already implemented); P1 (generalizing locative word order beyond this single confirmed sentence — see Grammar Specification §2, RULE-G2 productivity boundary).

---
### RULE-034 — Locative/Directional Word Set (Vocabulary Expansion)
**Description:** Nine additional single-word locative/directional lexical items, proposed for the productive `-o` locative-suffix pattern established by RULE-033: `inside` (`ning'ao` / `nokningo`, lit. "inside the room"), `outside` (`a'palo`), `above` (`kosako`), `behind` (`janggilo` / `janggilchipak`, lit. "on the back"), `beside` (`sambao`), `up` (`kosak`), `over` (`badeao`, lit. "beyond" — flagged uncertain by the source itself), `across` (`nalsao`), `below` (`ka'mao`).
**Examples:** None yet at full-sentence level — these are single-word lexical proposals only, unlike RULE-033's "under the table" which has a complete native-confirmed sentence. No corpus entry added (see Validation Corpus coverage notes).
**Counterexamples:** None — nothing yet contradicts these; equally, nothing yet confirms them beyond the single relayed source.
**Dependencies:** RULE-033 (established locative `-o` pattern this set extends), Grammar Specification §6, §2 RULE-G2 (productivity boundary — this rule does not resolve that boundary, it adds candidate vocabulary within it).
**Native Notes:** Source: raw WhatsApp exchange between Thangseng and Tridip, relayed via Claude B chat session 2026-07-08 (`docs/PENDING_LINGUISTIC_PROPOSAL_20260708_locatives.md`). This is native-sourced but **evidentially weaker** than the project's usual bar for "Verified" (compare RULE-033's `nokkimao`, which came from a direct native-confirmation session with a full example sentence). `over`/`badeao` is explicitly flagged uncertain by the source and should be treated as lower-confidence than the other eight.
**Validation Status:** Needs Native Validation (direct) — eight items at Medium confidence pending a direct Thangseng confirmation pass (ideally with a full example sentence each, matching RULE-033's standard); `over`/`badeao` at Low confidence, explicitly source-flagged as uncertain.
**Confidence:** Medium (8 items); Low (`over`).
**Launch Priority:** P1 — vocabulary expansion, not a correctness bug; does not block V1.0. Recommend direct native confirmation before promotion to `corrections.json` or Validation Corpus status.

---
### RULE-035 — "Under" vs. "Beneath" Sense Split (`mitapo`)
**Description:** English "under" and "beneath" are not a single Garo mapping. `kokkimao`/`nokkimao` (RULE-033) covers general "under." `mitapo` is used specifically for "underneath" in the sense of something under a sheet, slab, or covering — a distinct sense, not a free variant of RULE-033's form.
**Examples:** None yet at full-sentence level for the `mitapo` sense (e.g. no confirmed sentence like "the book is under the blanket"). RULE-033's `nokkimao` example ("dog under the table") is confirmed to be the *general* sense, not the covering sense.
**Counterexamples:** Treating `mitapo` and `kokkimao`/`nokkimao` as interchangeable would be a misuse of this rule — the whole point of RULE-035 is that they are not.
**Dependencies:** RULE-033 (the sense this rule splits off from).
**Native Notes:** Source: same relayed 2026-07-08 exchange as RULE-034. Not yet confirmed with a worked example distinguishing the two senses in context.
**Validation Status:** Needs Native Validation (direct) — the sense distinction itself is plausible and specific enough to record, but has no confirmed example sentence yet, and RULE-033's existing "under the table" example should NOT be reused as evidence for `mitapo`, since it is a general-sense example.
**Confidence:** Medium (distinction exists); Low (no worked example).
**Launch Priority:** P1 — refines an existing P0 rule's scope but does not change RULE-033's already-implemented behavior; not launch-blocking.

---
### RULE-036 — Fixed Discourse Expressions (New Category)
**Description:** A distinct grammatical class from ordinary verbs: words that function as complete, invariant utterances and take no suffix, no tense/aspect marking, no conjugation of any kind — explicitly confirmed as a closed class, not an incompletely-documented verb. First instance: `Da·mo` ("wait!" — said to someone you want to wait for you). Not previously represented anywhere in this catalogue; every other rule assumes some degree of inflectability (even RULE-006's bare-adjective predicates still take number/person agreement via the subject). This category may have other members not yet identified — worth watching for in future native sessions rather than assuming `Da·mo` is unique.
**Examples:** `Da·mo, anga mi cha·kuna` = "Wait, let me eat." `Da·mo` used standalone as "Wait!"
**Counterexamples:** `Anga Damogen` ("I will wait," engine-generated, treating `Da·mo` as if it took the future suffix `-gen`) — explicitly confirmed **wrong** by direct native correction: *"No suffix. It's just an expression... It cannot be changed into any other form."* Retained here as the counterexample precisely because it shows what happens when this category is missed.
**Dependencies:** RULE-001 (Raka Locality — `Da·mo` does carry raka, consistent) but explicitly independent of RULE-015 (Stem Formation) — stem-formation doesn't apply here since there's no stem to form.
**Native Notes:** Primary source, 2026-07-12 chat transcript (Thangseng, direct): *"Da·mo is used when you want someone to wait for you. It cannot be changed into any other form."* Confirmed in response to a direct question about the engine's actual (wrong) output.
**Validation Status:** Verified.
**Confidence:** High for `Da·mo` specifically; Low/Unknown for the category's full membership (only one confirmed member so far — "class exists" is High confidence, "class is fully enumerated" is not).
**Launch Priority:** P0 — directly explains a live, confirmed-wrong translator output (see engineering handoff, `docs/PENDING_REGRESSION_CASES.md`).

---
### RULE-037 — `a'`/`an'`/`am'` Compound Prefix (Distinct from Raka)
**Description:** A productive prefix, orthographically an apostrophe (`'`), distinct from raka (`·`) — confirmed structurally different, not a typo variant of raka. Semantically clustered: `a'`-prefixed forms cluster around land/earth/place senses (`a'gil·sak`="earth", `a'ki·sang`="bottom of a field", `a'mal`="boundary between two fields", `a'ging`="dry land", `a'gi·si`="desert"); `an'`/`am'`-prefixed forms cluster around blood/body senses (`an'chi kam·a`="blood blister", `an'chi ja·dil`="blood vessel", `an'chin·ek`="bodily impurities"). Co-occurs with raka in the same word without conflict (`a'jak sok·gipa`="avenger" — both marks present, understood as distinct by whoever encoded this data).
**Examples:** `a'jak soka`="to take revenge" (independently confirmed this session from a separate primary source, suffixes.pdf's compound-verb section — `a'jak` is a real, previously-documented morpheme, not a claim invented for this rule); `a'jak sok·gipa`="avenger" (same root + agentive `-gipa`, RULE-015 stem formation applies normally).
**Counterexamples:** the isolated `"sad"`/`"bright"` duplicate-entry typos (`RC-CANDIDATE-012`) are explicitly **not** members of this pattern — no semantic clustering, no productive compounding, a duplicate correct-form exists alongside the typo (unlike any of these 91 entries, which have no alternate raka-marked form).
**Dependencies:** RULE-001 (Raka Locality) — this rule exists specifically to keep this prefix from being mistaken for a raka variant, per the exact confusion `RC-CANDIDATE-012`'s investigation raised.
**Native Notes:** 91 `master_dictionary.json` entries found via direct search (2026-07-13, Claude A review of Claude B's flagged boundary question); `a'jak soka` independently corroborated from suffixes.pdf, read earlier this session. No direct Thangseng confirmation of the prefix's grammatical function/exact semantic boundary yet — the land/earth vs. blood/body clustering is my own observation from the data, not a native claim.
**Validation Status:** Verified (the prefix is real and distinct from raka — very high confidence given 91 non-random, semantically-clustered instances plus independent corroboration); Needs Native Validation (the precise grammatical function and exact semantic scope of `a'` vs. `an'`/`am'`).
**Confidence:** High (existence, distinctness from raka); Medium (semantic characterization).
**Launch Priority:** P1 — not launch-blocking (these are mostly low-frequency nature/culture vocabulary), but resolves `RC-CANDIDATE-012`'s scope-boundary question definitively: **leave all 91 entries untouched**, they are not part of that bug.
