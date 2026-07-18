# Pending Regression Cases
_Started: 2026-07-08 by Claude B. Restructured 2026-07-11 into
Implemented/Pending sections (was growing into an append-only historical
log — reorganized to stay usable as an operational backlog per explicit
instruction)._

## Purpose
Every weakness the Native Sentence Validation Audit (or later evidence)
exposes gets logged here with the exact input/output pair, so fixes can
be reviewed and implemented without re-deriving the evidence.

## Format
- **Implemented**: closed. Cites the commit that fixed it. Full forensic
  detail (why the bug existed, root cause analysis) lives in that
  commit's message, not duplicated here — this doc keeps only what's
  needed to know it's done and where to look if you need more.
- **Pending**: still open. Input, current output, expected output (if
  known), suspected cause, severity, and what's blocking it (Claude A
  review vs. Thangseng validation).

---

## Implemented

### RC-CANDIDATE-002 — Locative "in bed" got object marker instead of locative
**Fixed:** `d0e6c06` (2026-07-10). `translationEngine.js`'s SOV
grammar-assembly now marks a stative-locative adjunct (`in`/`on`/`at` +
noun) with `·o` instead of the default `·ko`. `"I am lying in bed"` →
`Anga palang·o` (matches native-confirmed `palango`). New regression
case added same commit.

### RC-CANDIDATE-003 — Posture verb "lying" produced malformed/invalid Garo
**Partially fixed:** `d0e6c06` (2026-07-10). Both confirmed-invalid
outputs (`"down"` wrongly picked as verb via the unrelated
`corrections.json` `down`=`Ka·ma` entry; `"bed"` wrongly picked as verb
then given a past-tense suffix → invalid `Palangha`) now produce
grammatically valid, if semantically incomplete, output instead of
invalid Garo. **Still open:** the full `tue`/posture-verb paradigm needs
native validation (tracked as NV-007 in
`docs/THANGSENG_NATIVE_VALIDATION.md`) before "lying (in bed)" can be
translated correctly, not just gracefully.

### RC-CANDIDATE-006 — Purpose-clause "search" used pre-Rule-32 stale value
**Fixed:** `d0e6c06` (2026-07-10). `src/data/purpose_map.json`'s
`search` corrected from the retired `am·e·nik·na` to `Sandi·na`.

### RC-CANDIDATE-008 (partial) — irregular-verb table conflicts
**Fixed 5 of 9:** `d0e6c06` (2026-07-10) — `coming`, `slept`, `sleeping`,
`laughing` (truncation typos / missing raka marks, confirmed against
`THANGSENG_RULES_LOOKUP.md`'s raka table and internal corpus
consistency). **Not a bug:** `eaten` — `cha·jok` (perfect) and
`cha·manaha` (completive) are both independently confirmed distinct
aspectual forms (RULE-026); no fix needed, permanently allowlisted in
`repository-intelligence.js`. **Reverted:** `bought` was fixed then
retracted (`df71a83`) — see Pending below, genuinely unresolved.
**Still open:** `heard`, `standing`, `sitting` — see Pending below.

### VerbsGrammar.jsx (5 errors) + dead phrase_maps.js hortatives
**Fixed:** `48aee52` (2026-07-11). Not originally RC-numbered (found via
direct Claude A review of the user-facing grammar page, not the Native
Sentence Validation Audit), but same disposition — flagged with zero
ambiguity, checkable against existing confirmed data, implemented
directly. See commit message for the 5 specific corrections (raka on
`agan`/`nika`, hyphen-as-raka typos, a truncation typo, reversed
classifier-number order, a copy-pasted imperative example) and the 5
dead `phrase_maps.js` entries removed (shadowed by `corrections.json`,
verified unreachable before removal).

---

## Pending

### RC-CANDIDATE-001 — Necessity-modal negation (`nangja`) collapses into desire-negation
- **Input:** `"I don't need to watch TV"` → `Anga sikengja` (collapses
  into the `sikenga`/"want" + negation path)
- **Cause:** Grammar — no distinct necessity-modal negation path exists
- **Status:** Needs Claude A Review, then Thangseng Validation of the
  correct isolated-clause form

### RC-CANDIDATE-004 — Ability modal ("can") dropped entirely
- **Input:** `"I can watch"` / `"I can eat"` → identical to the
  non-modal form, no `man·a`/`man·ienga` marking at all
- **Cause:** Selection Logic — `master_dictionary.json` has `"can":
  "man·a"` but nothing wires it into modal-verb constructions
- **Status:** **Blocked — do not implement.** Claude A: the `man·a`
  source entry itself is unverified (NV-008). Wiring an unverified form
  into the engine would be worse than the current gap.

### RC-CANDIDATE-005 — English loanwords (`TV`, `status`) silently dropped
- **Input:** `"I watch TV"` → `Anga ni·rik·a` (TV vanishes, no error
  marker — silent data loss, worse than a visible `[UNKNOWN]`)
- **Cause:** Dictionary + Rendering — no pass-through mechanism for
  unrecognized capitalized tokens
- **Status:** Needs Claude A Review — Claude A has recommended a
  systematic loanword passthrough mechanism over per-word entries (in
  principle); not yet designed or implemented

### RC-CANDIDATE-007 — `sing`/`dance` purpose-clause forms use unrelated roots
**Resolved 2026-07-14 — native-confirmed, ready for implementation.**
Direct evidence (June 25 chat, relayed today): `"let's sing"`→`"Hai
ring·na"`, `"let's dance"`→`"Hai chrokna"`. Confirms `ring·na`(with
raka, matches the already-established `ring·`="sing" root) and
`chrokna`(regular stem formation on `Chroka`) as the correct forms.
This directly confirms the hortative (`Hai X-na`) construction; the
`sikenga`("want to X") extension is a well-supported inference from
`-na`'s demonstrated regularity, not independently re-confirmed — see
`THANGSENG_NATIVE_VALIDATION.md` NV-013 for full precision notes.
**Recommended `purpose_map.json` values:** `sing`→`ring·na` (replacing
`bit·na`), `dance`→`chrokna` (replacing `ruru·na`). High confidence for
both — this is no longer a medium-confidence candidate.
**Status:** Confirmed, ready for Claude B to implement. No longer
needs Thangseng validation.

### RC-CANDIDATE-008 (remainder) — 4 unresolved irregular-verb/corrections conflicts
| Key | `corrections.json` | `irregular_verbs.json` | Status |
|---|---|---|---|
| `bought` | `breaha` | `brea·aha` | Escalated — `VALIDATION_CORPUS.md` already has `"have you bought"`→`Bre·ajok` (raka, Verified/High from a prior audit pass), directly conflicting with the primary-source no-raka claim. Two credible sources disagree — needs Thangseng, not a repo-evidence call. |
| `heard` | `rangsan chanchiaha` | `knachik·aha` | Escalated — different words entirely, no repo evidence favors either |
| `standing` | `chadatenga` | `chadenga` | Escalated — no primary-source confirmation of either root's raka status; a third form (`Chakata`) also exists elsewhere, may be a 3-way vocabulary question |
| `sitting` | `asongenga` | `asong·enga` | Escalated — same as `standing`, no confirmation found |

All 4 permanently allowlisted in `repository-intelligence.js` pending
Thangseng.

### RC-CANDIDATE-009 — 18 raka-adjacency candidates (report-only)
Surfaced by `repository-intelligence.js` Check A (deliberately
report-only — see `docs/REPOSITORY_INTELLIGENCE.md`). **Partially
resolved:** the `ring·`-related hits (8 of 18) are confirmed **not
bugs** — `ring·a`="sing" is a genuinely different root from the
no-raka verb `ringa`="drink" (NV-010, narrowed 2026-07-10). **Still
open:** `agan·` (3 hits, "did/have/are you speak(ing)") and `tusi·` (1
hit, "I will sleep") look like plausible genuine RULE-001 candidates —
no alternate-word explanation found. `nam·` (2 hits, "loved the
picture") may be an idiom, unconfirmed. `wa·` (4 hits, bamboo) is
likely an unrelated word (bamboo ≠ rain), probably not a violation at
all.
- **Status:** Needs Claude A Review for the remaining `agan·`/`tusi·`/
  `nam·`/`wa·` clusters (10 of the original 18 hits).

### [Superseded by RC-CANDIDATE-011] `·o` fix scope question
Originally a separate `RC-CANDIDATE-010` created independently by
Claude B the same day as Claude A's stress-test `RC-CANDIDATE-010`
(naming collision, concurrent sessions). Retired in favor of
`RC-CANDIDATE-011`, which found the same underlying gap via broader
evidence (12 sentences vs. 2).

## Stress Test — 2026-07-12, Claude A
237 generated sentences, live-tested against `translate()`, now the
persistent benchmark: `tests/benchmarks/stress_237.mjs`. Full method
distribution and category breakdown: `docs/BENCHMARK_VALIDATION_REPORT.md`.
Strong-performing baseline (no action needed): pronoun-subject tense/
aspect/negation paradigm, malformed-input robustness, direct-count
classifiers.

### RC-CANDIDATE-010 — NP-subject sentences never reach grammar-assembly
**Conclusion:** `analyzeGrammar` gated on a recognized pronoun subject.
Non-pronoun subjects (`"the book"`, `"the dog"`) never reached it,
regardless of well-formedness — fell to weak `sov-assembly`. Not
locative-specific; affected any sentence with a non-pronoun subject.
**Status:** **Fixed and confirmed**, commit `01b159a` (2026-07-12).
NP-subject detection added, scoped to `[article]+[noun]+[coherent
continuation]` (copula/stopword/end-of-sentence) — a structural
coherence check, not a per-word patch (see `translationEngine.js`'s
"Parser-boundary review" comment). A naive version misfired on
adjective-modified subjects (`"a big dog"` → wrongly picked `"big"`);
narrowed after review to only genuinely verifiable signals.
**Benchmark:** all 6 of the isolated `"the [noun] is on/in/at the
[location]"` sentences confirmed post-fix — `grammar-assembly`, correct
subject + structure, zero exceptions. Negative test cases (231
pronoun-subject sentences, imperatives, inverted questions) verified
unaffected.
**Explicitly out of scope, not silent:** demonstrative-led
(`"this dog"`), quantifier-led (`"two teachers"`), possessive-headed
(`"my dog"` as subject), coordinated, and adjective/multi-word-modified
subjects — these fail the coherence check and safely fall back to
`sov-assembly` rather than risk mislabeling. Real limitation: no POS
data exists anywhere in this repository (`master_dictionary.json`'s
`pos` field is null on every entry, verified directly) to distinguish a
modifier from a head noun. Real NP-boundary detection needs that data
first — not attempted.
**Remaining uncertainty:** none on the confirmed scope.

### RC-CANDIDATE-011 — "In" vs. "at" locative marking
**Conclusion:** Not per-noun as originally hypothesized (retracted by
Claude A pre-fix). `"at"` generalized `·o` correctly across all nouns;
`"in"` didn't. Two independent compounding causes: (a) `NV-007`'s `tue`
gap (verb-slot lost, uniform across all "lying in X" cases) plus a
`"lying"`=untruth homonym trap in `master_dictionary.json` (`Ua
tolenga`, wrong sense), (b) a separate `"in"`-specific locative-marking
gap (noun-slot).
**Status:** (b) **fixed and confirmed** as a side effect of the
RC-010 fix — same commit. Root mechanism, answering Claude A's
evidence-only question: `"at"`/`"in"` were always the same object-loop
code path; the actual differentiator was the verb-search loop's
hardcoded exclusion list (only `"down"`/`"bed"` excluded pre-fix,
`RC-CANDIDATE-003`), which let every *other* location noun get wrongly
consumed as the verb before reaching the object loop. RC-010's general
rule (any word right after `in`/`on`/`at`, even across an intervening
article, is never the verb) fixed all locations uniformly. (a) remains
**open**, unaffected — confirmed post-fix that none of the 6 "lying in
X" outputs contain a verb.
**Benchmark:** all 6 `"lying in the X"` and all 5 remaining `"waiting
at the X"` sentences confirmed producing correct `·o` post-fix.
**Implementation implication:** none needed for (b). (a) needs `NV-007`
resolution before `"lying"` can be wired up correctly (and must target
the reclining sense, not the untruth sense already occupying that
English word in the dictionary).
**Remaining uncertainty:** none on (b), confirmed via direct rerun.

Minor unrelated observation from the rerun: `"market"` resolves to two
dictionary alternates joined by `"/"` (`"bajal / anti·o"`) rather than
one clean value — pre-existing dictionary-data quality issue, not a
grammar bug, not fixed here.

### RC-CANDIDATE-012 — Raka rendered as apostrophe instead of `·`
**Conclusion:** Not a rendering/Unicode/serialization bug (the
originally-suspected cause). Root cause: duplicate `master_dictionary.json`
entries for `"sad"` and `"bright"` — one correct (`"duk ong·a"`,
categorized), one with a literal apostrophe typo (`"Duk ong'a"`,
`category: "uncategorized"`, `pos`/`notes`: null — an import-artifact
signature). `prepare-data.js`'s `pickPrimary()` deliberately takes the
last value seen (a considered policy — see its own comment on a prior
"smart picking" incident that corrupted data worse), which happened to
be the bad duplicate for both words.
**Status:** Fixed, commit pending. Corrected both source entries
directly; did not change `pickPrimary`'s established last-wins
behavior.
**Benchmark:** all 5 non-first-person `"sad"` sentences + `"bright"`
confirmed producing `·` post-fix.
**Critical scope boundary found and respected:** a broader search
turned up 95 `master_dictionary.json` entries using `a'`/`an'`/`am'` as
a *prefix* (earth/land/blood/search-related compound words, e.g.
`"earthquake"`→`"a'a banggri·a"`). This is very likely a genuine
morpheme or orthographic convention, structurally different from the
isolated `sad`/`bright` duplicates (no duplicate correct-form
counterpart exists, and these are semantically clustered, not random
typos). **Explicitly not touched** — would have been an unauthorized
linguistic decision affecting 95 entries. Regression test locks in that
`"earthquake"` stays unchanged.
**Remaining uncertainty:** none on the 2 fixed entries. The 95-entry
`a'`/`an'`/`am'` pattern — **resolved (2026-07-13, Claude A review):**
confirmed a genuine, distinct morphological prefix, not a duplicate-typo
pattern. See `GRAMMAR_RULE_CATALOGUE.md` `RULE-037`. Leave all 91
entries untouched, as Claude B's caution correctly anticipated.

### RC-CANDIDATE-013 — Predicate-adjective copula insertion is inconsistent (RULE-031 in practice)
**Conclusion:** Live, concrete evidence that `RULE-031`/`NV-002` being
unresolved has real output consequences, not just documentation debt.
`"happy"` drops `ong·a` for non-first-person only; `"sad"` keeps it;
`"tired"` self-inflects with no copula; `"beautiful"/"good"/"bad"` take
no suffix at all. Word *selection*, not just copula-presence, also
varies by person for `"sick"`/`"clever"` (evidence outside the fixed
benchmark).
**Status:** Open — correctly not fixable without native validation.
**Benchmark:** the 36-sentence predicate-adjective set (6 persons × 6
adjectives) within `stress_237.mjs`; `sick`/`clever`/`strong`/`tall`
tested ad-hoc, not part of the fixed corpus.
**Implementation implication:** none until `NV-002` resolves. A
provisional bare-adjective default is already recommended (see
`THANGSENG_NATIVE_VALIDATION.md`, "Provisional recommendation" section).
**Remaining uncertainty:** whether "I am happy" vs. "you are happy"
reflects a real grammatical distinction or an engine gap — needs
Thangseng.

### RC-CANDIDATE-014 — Imperatives, negative imperatives, and possession: memorized-only
**Conclusion:** All three constructions have zero general grammar-
assembly rule — only present when a specific string is memorized in
`corrections.json`. `"do not V"` additionally selects the wrong existing
rule (`RULE-017` statement-negation instead of `RULE-029`'s `-nabe`).
`"let us drink"/"speak"` are missing from `corrections.json` entirely —
broader than the `eat`/`work` value-mismatch found in an earlier cycle.
Category classification: imperatives/possession = missing
generalization (rules exist, aren't applied); `"do not V"` = wrong-rule
selection (both rules exist, engine picks the wrong one).
**Status:** Open, unimplemented.
**Benchmark:** ~24 imperative/hortative/possession sentences within
`stress_237.mjs`.
**Implementation implication:** three related but separate
generalization gaps for Claude B — imperative `-bo`, negative-imperative
`-nabe` selection, possession/existential `donga`.
**Remaining uncertainty:** none on diagnosis — this is an engineering
generalization question, not a linguistic one.

**Partial fix, 2026-07-13 (possession sub-piece only — imperatives/
hortatives still fully open):** `"has"` (suppletive inflection of
`"have"`) had no dictionary entry at all, and generic suffix-stripping
turned it into `"ha"`, not `"have"` — so it never resolved, letting the
verb-search loop fall through to wrongly grab a NUMBER WORD as the verb
instead (`"he has two dogs"` → `"two"` picked as verb; same "no POS
data" collision class as `RC-CANDIDATE-010`/`003`, this time with
quantifiers — exactly the failure class the RC-010 parser-boundary
review predicted). Fixed with two small, reusable pieces, not a
per-sentence patch: (1) a `NUMBER_WORDS`-based guard in the verb-search
loop (reused the existing table from `garo_classifier.js`, not a new
heuristic), (2) added `"has"`→`"donga"` to `irregular_verbs.json` (same
confirmed value already used for `"have"`, not a new linguistic claim).
Benchmark-verified: exactly 2 of 237 sentences changed
(`"he has two dogs"`, `"she has three children"`), both now show the
correct verb; zero unintended changes elsewhere.

**New follow-up finding, not fixed this cycle (separate root cause,
"one architectural change per cycle"):** object-phrase construction has
no general number+noun→classified-count routing — it only works when a
literal full pre-stored phrase happens to exist (`"two dogs"` →
`do·o mang·gni`, a lucky pre-existing entry) and silently drops the
number otherwise (`"three children"` → `"Ua bi·sa·ko donga"`, `"three"`
vanishes — no such phrase entry exists for it). The existing
classifier/counting engine (`parseCountingPhrase`/`countNoun`/
`getClassifier` in `garo_classifier.js`) already handles this correctly
for standalone counting phrases; object-phrase construction in
grammar-assembly doesn't route through it. Real fix, not scoped or
attempted this cycle.

**Already tracked elsewhere, reconfirmed live, no new finding:**
`RC-CANDIDATE-004` (ability modal "can," still dropped, blocked on
`NV-008`), `RC-CANDIDATE-005` (loanword "TV," still dropped),
`RC-CANDIDATE-003` (posture-verb fix confirmed working for `"lying
down"` alone — no longer invalid Garo, now valid-but-wrong-meaning,
still resolves to the unrelated "down" root).

### RC-CANDIDATE-015 — `Da·mo`("wait" expression) used for declarative "wait," should be `senga`
**Conclusion:** Native-confirmed (`NV-015`, direct transcript, 2026-07-12).
`"I will wait"` should be `"Anga senggen"` (`senga` root, inflectable).
The engine currently produces `"Anga Damogen"` — `Da·mo` is a fixed
discourse expression, confirmed to take no suffix at all, so this is a
confirmed error, not a vocabulary preference. Cross-checked against
existing repository evidence: `corrections.json` already uses `senga`
correctly for 2 of 7 tested "waiting" sentences (`"i am waiting for
you"`, `"i am waiting at the market"`); the 237-sentence benchmark shows
the other 5 (`"waiting at the [bed/school/house/table/room]"`) all
generating `Damo`-based output via `grammar-assembly`. New root cause,
not a symptom of `RC-010`/`RC-011` — a wrong-lexeme-selection bug, not a
subject-detection or locative-marking one.
**Status:** Open, unimplemented.
**Benchmark:** not yet in `stress_237.mjs` (benchmark not modified per
Validation Mode — add in a future benchmark revision); currently
observable via the 5 affected `"waiting at X"` sentences already in the
corpus, plus `"i will wait"` (not currently in the corpus at all).
**Implementation implication:** route the `grammar-assembly` "waiting"
fallback through `senga`, not `Da·mo`, for declarative input. Reserve
`Da·mo` for genuine imperative "Wait!" — its existing `corrections.json`
entries (`'wait'`, `'you wait'`) are plausibly fine as-is and don't need
changing themselves.
**Remaining uncertainty:** none — this is fully native-confirmed, no
linguistic ambiguity, purely an engineering routing fix.

### RC-CANDIDATE-016 — `master_dictionary.json` case-key duplication (`"book"`/`"Book"`), newly exposed by RC-010's fix
**Conclusion:** `master_dictionary.json` has two entries — `"book"`→
`"Ki·tap"` and `"Book"` (capitalized key)→`"boi"` (`notes:
"variant/VERIFIED/HIGH"`). Pre-existing, not caused by RC-010 — newly
*surfaced* because the new NP-subject detection path queries the
dictionary differently than the classifier-counting path, so they now
visibly disagree (`"the book is on the bed"`→`"boi..."` vs. `"one
book"`→`"Ki·tap"`, both live in the same corpus). `"boi"` may be a
legitimate regional-loanword variant, not necessarily wrong — the real
bug is non-deterministic selection based on incidental key-casing, not
the word choice itself.
**Status:** Open, unimplemented. Found during Priority 2 benchmark
validation of `RC-010`, 2026-07-12.
**Benchmark:** the 6 `"the book is on the [location]"` sentences.
**Implementation implication:** `repository-intelligence.js` doesn't
currently audit `master_dictionary.json`/`garo_dictionary.json` for
case-key duplicates (matches the Codex audit's general finding —
concrete instance materializing here). Either merge the two entries or
make key lookup case-insensitive with an explicit tie-break rule.
**Remaining uncertainty:** whether `"boi"` is a deliberate register/
loanword choice worth preserving under a different key, or simply a
duplicate that should be removed — a data-quality question for whoever
originally added it, not a linguistic ambiguity.

### RC-CANDIDATE-017 — Negation lost entirely with locative predicates
**Conclusion:** `"the book is not on the table"` → `"boi te·bil·o"` —
the negation vanishes, no negation marker anywhere in the output.
Compare working cases: `"the dog is not under the table"` (correct,
`...Kokkimaoja`) and `"the teacher does not eat rice"` (correct,
`...Cha·ja`) — both carry their negation morpheme through fine.
**Status:** Open, unimplemented. Found live-testing 2026-07-13.
**Root cause — confirmed high confidence, 2026-07-16 hygiene audit
(engineering-only, not implemented per Task 5 scope):** `analyzeGrammar`'s
verb-search loop (translationEngine.js ~L313-418) never finds a verb for
copula-only locative-predicate sentences — `"is"` is a stopword, the
locative-adjunct guard consumes `"table"` as an object candidate, and
nothing else in the remainder resolves via `findVerbForm`. `grammar.verb`
stays `null`. `applyNegation()` is only ever invoked inside the
verb-found branch (L411-413) — there is no fallback path in either
`analyzeGrammar` or `assembleGrammar` that attaches negation to a bare
copula or to the object/locative slot when no verb exists. Live-verified:
`analyzeGrammar('the book is not on the table').verb === null`,
`.isNegative === true` — the flag is correctly detected, it simply has
no attachment point downstream. Same root mechanism likely explains any
negated NP-subject sentence with no independent lexical verb (e.g.
predicate adjectives with dropped copula would NOT hit this, since
`applyNegation` there routes through the adjective's own resolution —
this is specific to constructions where the *only* semantic content is
a locative/existential relation with no lexical verb at all).
**Implementation implication (not scoped/attempted):** `assembleGrammar`
needs a negation-attachment fallback for the `grammar.verb === null`
case — likely attaching `ong·ja` (the existing "is not" dictionary
value already used elsewhere) when `isNegative` is true and no verb was
found, rather than silently dropping it. This is a linguistic
decision (which negated existential form is correct) as much as an
engineering one — Claude A should confirm the right target form before
implementation.
**Remaining uncertainty:** the correct negated-copula surface form
itself needs native/Claude A confirmation; the engineering diagnosis
(where the flag gets dropped) has none.

**Claude A review (2026-07-16):** Reopening — the two "compare" cases
aren't structurally parallel, and the "working" one may itself be
wrong. Live re-run:
- `"the dog is not under the table"` → `Achak te·bil·ko Kokkimaoja`
  (table takes accusative `·ko`; negation `-ja` fuses directly onto
  `Kokkimao`, with no separate copula).
- `"the book is not on the table"` → `boi te·bil·o` (table takes
  locative `·o`; no predicate at all, hence nothing to negate).
This means "under" is being treated as if it were a stative verb that
takes negation and an object, while "on" is a bare noun+`-o` adjunct
with no verb slot. But the project's own confirmed grammar
(RULE-G2/RULE-033) documents locative predicates as `X Y-o ong·a`
(separate copula, e.g. `Achak tebil nokkimao ong·a`) — not a fused
`Y-o-ja` pseudo-verb. So the "working" under-case doesn't actually
match the documented rule either; it's a second, undocumented
construction. This is a real (if narrow) linguistic question:
**does Garo have a distinct stative "to-be-under" verb separate from
the general locative-copula pattern, or is `Kokkimaoja` itself a bug
that happens to look plausible?** Recommend a relay question to
Thangseng with both forms (`...kokkimao ong·ja` vs. `...kokkimaoja`)
before Claude B patches the "on" path to mimic "under" — copying the
wrong pattern would just make both cases consistently wrong.

### RC-CANDIDATE-018 — `·gen` (future suffix) renders as a floating orphan token
**Conclusion:** `"the dog will eat rice"` → `"Achak Mi ·gen Cha·a"` —
`·gen` should attach to the verb (`Cha·a`) but instead sits as its own
space-separated token. Sov-assembly rendering path.
**Status:** Open, unimplemented. Found live-testing 2026-07-13.
**Root cause — confirmed high confidence, 2026-07-16 hygiene audit
(engineering-only, not implemented per Task 5 scope):** two compounding
causes, confirmed via direct `analyzeGrammar`/`translate` reruns.
(a) NP-subject detection's coherence check (`/^(is|are|was|were)$/` or
`STOP_WORDS`) does not recognize `"will"` as a coherent continuation —
`"will"` is in neither set — so `"the dog will eat rice"` never reaches
`analyzeGrammar`'s NP-subject branch at all (`subject: null` confirmed
live) and falls straight to the much weaker `assembleSentenceSOV`
fallback, bypassing every fix RC-010/011/014 made to the grammar-assembly
path. (b) `assembleSentenceSOV` (translationEngine.js ~L535-582) is a
flat word-by-word translator with zero tense-suffix-attachment logic —
it classifies each translated word as verb/non-verb by a regex on the
Garo output, translates `"will"` via a standalone `master_dictionary.json`
entry (`"will":"·gen"`) as an ordinary word, and since `·gen` doesn't
match the verb-signal regex (`/enga$|aha$|gen$|bo$|na$|·a$/` — note
`"·gen"` does NOT match `/gen$/` because of the leading `·`, a second,
smaller bug worth flagging separately) it lands in `nonVerbs` and gets
joined in word order rather than suffixed onto the adjacent verb.
**Implementation implication (not scoped/attempted):** two independent
fixes, likely both needed: (a) widen the NP-subject coherence check to
recognize modal/auxiliary continuations like `"will"` (same class as
`AUXILIARY_SKIP` used elsewhere in the verb-search loop — reuse, don't
duplicate) so more future-tense NP-subject sentences reach the stronger
grammar-assembly path; (b) `assembleSentenceSOV` needs real tense-suffix
handling for the sov-assembly fallback specifically, since NP-subject
future sentences that still don't qualify for grammar-assembly (out of
RC-010's documented scope, e.g. adjective-modified subjects) will keep
hitting this fallback regardless of (a).
**Remaining uncertainty:** none — pure engineering/architecture gap, no
linguistic ambiguity in the diagnosis.
**FIXED (2026-07-18, Claude B, Project Owner sprint directive, Claude A
confirmed engineering-only 2026-07-16):** both parts implemented exactly
as diagnosed. (a) `AUXILIARY_SKIP` hoisted to module level, NP-subject
coherence check now accepts it — `"the dog will eat rice"` reaches
grammar-assembly, `Achak mi·ko Cha·gen`. (b) `assembleSentenceSOV` now
excludes `AUXILIARY_SKIP` from lexical translation and applies
`applyTense(verb, 'future'|'negative_future')` to the resolved verb,
guarded against double-inflecting pre-suffixed `IRREGULAR_VERBS` forms —
`"a big dog will eat rice"` (still legitimately sov-assembly per RC-010's
documented scope) now produces `Achak Mi Dal·a Cha·gen`, no floating
token. 7 new regression tests added (`RC-CANDIDATE-018*` in
`tests/unit/translationEngine.test.js`, 70→77). Full 237-sentence stress
benchmark diffed byte-for-byte before/after: zero changes outside the
future-tense/auxiliary cases touched. `npm test`/`npm run build` clean.
Interrogative formation (a separate, related ask) was explicitly NOT
implemented — no confirmed Claude A linguistic guidance exists yet, only
one unconfirmed WhatsApp data point
(`docs/PENDING_LINGUISTIC_PROPOSAL_20260717_future_interrogative.md`).
RC-CANDIDATE-017 (negation-locative) was deliberately left untouched —
Claude A reopened it 2026-07-16 as a genuine unresolved linguistic
question pending a Thangseng relay, not pure plumbing; not in scope of
this fix.

**Claude A review (2026-07-16):** Confirmed engineering-only. Live
re-run: `"the dog will eat rice"` → `Achak Mi ·gen Cha·a` — reproduces
exactly as described, `·gen` floating unattached before the verb
instead of suffixing it. No linguistic ambiguity here; clear to
Claude B as-is.

### RC-CANDIDATE-019 — `"teacher"` dictionary conflict: `Skigipa` vs. `ti·char`
**Conclusion:** `phrase_maps.js` has `'teacher': 'Skigipa'`;
`compiled_dict.json` (generated from `master_dictionary.json`) has
`teacher: ti·char`. Different sentences hit different paths and
surface different words. **Not a clear typo like RC-CANDIDATE-012** —
a real, native-confirmed `corrections.json` sentence (`"my father is a
teacher"`) already uses `skigipa`, so `ti·char` can't be assumed wrong
without review.
**Status:** Open, unimplemented. Found live-testing 2026-07-13.
**Remaining uncertainty:** genuine word-choice question for Claude A —
loanword vs. native term, register, or regional variant. Not an
engineering fix; flagging only.

**Claude A review (2026-07-16) — RESOLVED, not a word-choice question.**
This is `RC-CANDIDATE-016`'s duplicate-key shape, not a genuine
register ambiguity. `master_dictionary.json` already contains four
`teacher` entries: index 377 `english: "teacher"` → `Skigipa` (no
register note — the neutral/default term), and three later entries
(3646–3648, all `notes: "variant/VERIFIED/HIGH"`) → `di·di`, `ma·star`,
`ti·char`. All four are legitimate — a native term plus three
already-verified loanword/honorific register variants — this was never
in dispute. The bug is that the compiler's case-insensitive key
handling does last-write-wins, so `ti·char` (the final entry, index
3648) silently clobbers `Skigipa` and the other two variants for every
plain dictionary-path lookup. Confirmed live: `"the teacher does not
eat rice"` → `ti·char mi·ko Cha·ja` (dictionary path, gets the
clobbered value), while `"my father is a teacher"` → `Ang·ni pa·a
skigipa daka` (hits the `corrections.json` exact-match layer instead,
bypassing the corrupted dictionary entirely — confidence 1.0, method
`correction`). So the two "conflicting" values were never actually
in tension; they're on different lookup paths, and one of those paths
is broken.
**Handoff to Claude B:** engineering fix, same shape as RC-016 — the
compiler needs to preserve register-variant clusters (e.g. keep
`Skigipa` as the default/neutral output for bare `teacher`, and retain
`di·di`/`ma·star`/`ti·char` as documented alternates) instead of
overwriting on case-insensitive key collision. No native confirmation
needed for this fix — the register classification is already verified
in the source data.
**Separately open:** the `daka` vs. `ong·a` copula question raised by
`skigipa`'s corrections.json sentence is unrelated to this dictionary
bug — tracked in `docs/PENDING_LINGUISTIC_PROPOSAL_20260716_family_terms.md`.

---
- Nothing in the Pending section above has been fixed — only logged.
- Severity/priority labels are Claude B's engineering assessment only —
  not a substitute for Claude A's linguistic triage or Thangseng's
  validation of expected outputs.

### RC-CANDIDATE-020 — Root cause of RC-018 confirmed: spurious `"will": "·gen"` dictionary entry bypasses `applyTense`

**Status:** Root cause found and confirmed live, 2026-07-17, Claude A.
Directly resolves the open question in RC-018 and the earlier
`PENDING_LINGUISTIC_PROPOSAL_20260717_future_interrogative.md`.

**Diagnosis:** `master_dictionary.json` (index 6727) and
`src/compiled_dict.json` both contain a standalone entry `"will": "·gen"`.
`applyTense()` already correctly suffixes `·gen` onto a verb root when
it runs (confirmed by reading the function — raka-aware, handles
irregulars, no bug there). The problem is upstream: for sentences like
`"will you eat"`/`"will you eat a banana"`, `analyzeGrammar`'s
structured path fails to parse (likely the `will`-initial word order,
not subject-first), so the sentence falls through to the dumber
`sov-assembly` fallback. That fallback does per-word dictionary lookup
with no tense-merging logic at all — it finds `"will"` as its own
dictionary word (`·gen`), finds `"eat"` separately as `Cha·a` (already
in its default present-tense form), and reorders both into SOV word
order as independent tokens. Live-confirmed before the corrections.json
fix went in:
- `"will you eat"` → `·gen Na·a Cha·a` (`·gen` floating at the front,
  `Cha·a` untouched)
- `"will you eat a banana"` → `te·rik ·gen Na·a Cha·a` (object also
  misplaced, sentence-initial instead of mid-sentence)

**What's already fixed:** the three sentences Thangseng directly
confirmed now hit the `corrections.json` exact-match layer instead
(confidence 1.0): `"will you eat"` → `Na·a cha·genma?`, `"will you eat
a banana"` → `Na·a te·rik cha·genma?`, `"will you eat an apple"` →
`Na·a apple cha·genma?` (corrected 2026-07-18 — originally committed
as `apal`, the dictionary's Garo-ified form, instead of matching the
bare English loanword Thangseng actually used; see
`PENDING_LINGUISTIC_PROPOSAL_20260717_future_interrogative.md` for why
that distinction matters here specifically). This is a narrow, safe patch — it does not fix
the general case (any other future-tense question still hits the same
broken fallback path).

**Linguistic determination (Claude A, resolves the two open questions
from `PENDING_LINGUISTIC_PROPOSAL_20260717_future_interrogative.md`):**
1. **Raka-locality:** the WhatsApp apostrophes in `na'a`/`cha'genma`/
   `te'rik` are casual typing for raka (·), not a distinct orthographic
   choice — cross-checked against already-established canonical
   spellings elsewhere in the repo (`pronoun_map.json`: `"you": "Na·a"`;
   `corrections.json`: `"banana": "te·rik"`). Canonical: `Na·a`,
   `cha·genma`, `te·rik`.
2. **Object-insertion position:** Thangseng's own gloss ("you can add
   the food item in the middle") confirms the food item sits between
   subject and the fused verb-complex — `Na·a [object] cha·genma?` —
   not sentence-initial, which is what the broken `sov-assembly`
   fallback currently produces.
3. **Morpheme structure:** `cha` (root) + `·gen` (future) + `ma`
   (interrogative) fuse into one verb-final word, `cha·genma` — this is
   the first confirmed data point for a general interrogative suffix
   `ma` in this codebase (previously entirely unmodeled; searched
   `GRAMMAR_RULE_CATALOGUE.md`, nothing exists yet).

**Handoff to Claude B — general engineering fix, not yet done:**
1. Remove or heavily guard the standalone `"will": "·gen"` dictionary
   entry — it should never be looked up as an independent word; `will`
   is a tense marker, not vocabulary.
2. Route `will`-initial (and other non-subject-first) future-tense
   sentences through the same tense-merging path `analyzeGrammar`
   already uses for subject-first sentences, instead of falling back to
   token-reordering `sov-assembly`.
3. Add general interrogative-suffix (`ma`) support — currently zero
   question-formation logic exists anywhere in the engine. Only one
   confirmed data point so far (future + `ma`); do not generalize to
   other tenses without further native confirmation.
4. Object-insertion position (subject, object, verb-complex) should
   generalize to the existing SOV assembler once `will`-initial parsing
   is fixed — same word order the declarative engine already uses
   elsewhere, just currently short-circuited by the fallback path.

No native relay needed for items 1–2 (pure engineering/data-cleanup,
already fully diagnosed). Items 3–4 should be spot-checked against a
second native example before generalizing broadly, since this is only
one data point.

**Verification of Claude B's fix (`ad9bd71`, 2026-07-18) — partial,
items 3–4 correctly left undone, but the remaining gap is now more
dangerous than before.** Item 1 (the literal floating-`·gen` symptom)
is fixed — confirmed live: `"the dog will eat rice"` now gives
`Achak mi·ko Cha·gen` (suffix attached, no orphan token). But
`will`-initial sentences that aren't NP-subject still fall through to
`sov-assembly`, and that path has two uncorrected problems:
- **Word order:** `"will you eat rice"` → `Mi Na·a Cha·gen`
  (object-subject-verb) — wrong; should be subject-object-verb per the
  engine's own SOV design (`Na·a Mi Cha·gen`).
- **No interrogative marking at all:** none of `"will you eat rice"`,
  `"will you eat mango"`, `"will she eat"` produce a question mark or
  the `ma` suffix — they come out as bare declaratives despite being
  clearly questions in the English input. Per item 3, this was always
  going to need a second native data point before generalizing, so
  leaving it undone is correct — flagging only because **the output no
  longer looks broken**. The old floating-token symptom
  (`·gen Na·a Cha·a`) was obviously wrong to anyone reading it; the new
  symptom (`Mi Na·a Cha·gen`, no `?`) reads as a fluent, confident,
  plausible-looking Garo sentence that happens to be an unmarked
  declarative instead of the question that was asked — exactly the
  silent-wrong-output failure mode this project treats as
  highest-risk. Recommend: don't let this quietly ship as "RC-018
  fixed, closed" — the fix is real and worth keeping, but the
  interrogative gap needs its own tracked item (not reopening this one,
  since the diagnosis is unchanged from above) so it doesn't get lost
  now that the more visible symptom is gone.

### RC-CANDIDATE-021 — No interrogative-marking support anywhere in the engine (silent-declarative regression risk)

**Status:** Open, newly tracked 2026-07-18 (Claude A), split out from
RC-CANDIDATE-020 so it doesn't get lost now that RC-018's more visible
symptom (floating `·gen`) is fixed.

**Problem:** the engine has zero question-formation logic. Any English
question that isn't an exact `corrections.json` match comes out as a
grammatically-plausible declarative with no `?` and no interrogative
marker — e.g. `"will you eat rice"` → `Mi Na·a Cha·gen` (also wrong
word order, object-subject-verb instead of subject-object-verb).

**Why this is higher-risk now than before RC-018's fix:** the old
floating-token output was obviously broken to any reader. The new
output is fluent-looking and confident — a native speaker skimming it
might not immediately notice it's answering a different sentence
(a statement) than the one asked (a question).

**What's known so far (one data point only, from the Thangseng relay,
2026-07-15):** `cha` (root) + `·gen` (future) + `ma` (interrogative)
fuse into one verb-final word — `cha·genma`. Subject-object-verb order
holds for questions too (`Na·a [object] cha·genma?`). This is not
enough to generalize a `ma`-suffix rule to all tenses/persons — needs
a second native confirmation before any broad implementation.

**Recommended scope for a first fix:** rather than attempting general
question-formation now, (1) fix the word-order bug in `sov-assembly`
for future-tense objects (subject-object-verb, matching the rest of
the engine's SOV design) since that's independently wrong regardless
of the interrogative question, and (2) consider having the engine
flag/lower confidence on any output where the English input ends in
`?` but no `corrections.json` match and no interrogative marker was
applied — surfacing the gap to the user rather than silently answering
the wrong sentence type. Full general `ma`-suffix support should wait
for a second native data point per RC-CANDIDATE-020's original
handoff.
