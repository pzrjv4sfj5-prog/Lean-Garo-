# Claude B Session Migration — 2026-09-23C (session close)

## Resume protocol for the next Claude B

1. Read `.ai/SESSION_BOOTSTRAP.md` first, then this doc.
2. `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` (Rule 13) is mandatory
   reading every session, not just on first bootstrap.
3. `git fetch origin`; compare against `repository.head` in
   `.ai/WORKSTATE.yaml` (pinned below); run
   `git log --oneline <head>..origin/main` and review everything since
   that checkpoint before touching anything — do not assume this doc's
   account of the repo is still current the moment a new session opens.
4. Re-run the full gate at whatever HEAD you actually land on before
   doing any new work: `node prepare-data.js && node test-dictionary.js
   && node repository-intelligence.js && node --test tests/unit/*.test.js
   && node scripts/runtime-error-sweep.mjs`.

## Session summary

Resumed via `docs/CLAUDE_B_SESSION_MIGRATION_20260923B.md` (pinned HEAD
`3cb39f1`) — resync found only that doc's own close commit ahead on
`origin/main` (zero real drift). Requested by the person: a general
stability audit of the runtime translation engine and sentence builder,
prompted by a live-reported bug ("he is going to school" translating
incompletely). Three engine-only fixes shipped this session, all
confirmed live and covered by the full regression gate at every step;
no dictionary/master data touched.

### Fix 1 — `VERB_LEMMAS` "to X" pollution dropped the verb in "going to school/home" (commit `78aa597`)

**Symptom (person-reported):** "he is going to school" → `"Ua skulchi"`
(no verb at all), while "he is going to the market" correctly produced
`"Ua bajalchi re·angenga"`.

**Root cause:** `lookupEngine.js`'s `VERB_LEMMAS` set is mechanically
derived from every dictionary key starting with `"to "`, on the
assumption that shape always means "infinitive verb headword" (`"to
eat"`, `"to buy"`). Three keys use the identical `"to X"` shape for an
unrelated purpose — destination/object phrases, not verbs: `"to
school"`→`"skulchi"`, `"to home"`→`"nokchi"`, `"to him"`→`"Bichi"`. This
silently added `"school"`/`"home"`/`"him"` to the verb-lemma set, which
made `grammarEngine.js`'s going-to-infinitive guard (`~line 316`) treat
the word right after "going to" as an infinitive-verb signal — true for
"going to eat", false for "going to school" — so "going" (the sentence's
only finite verb) got wrongly classified as a pure auxiliary and
discarded with nothing to replace it. `"to the market"`/`"to the
forest"`/etc. never collided only because those dictionary keys include
"the", so the mechanical `slice(3)` derivation produces `"the market"`,
not `"market"`.

Directly corroborated by Claude D's 2026-09-22 handoff
(`docs/CLAUDE_D_HANDOFF_TO_CLAUDE_B_20260922_engine_fixes.md`, §3),
which documents a Project Owner ruling that pronoun-object forms like
"to him" are NOT infinitive markers and should keep their wording — this
fix is narrower than and consistent with that ruling (which addresses a
larger, still-Owner-blocked canonicalization question); it does not
touch master data or the blocked item.

**Fix:** exact-key exclusion list (`NON_VERB_TO_X_KEYS`) in
`lookupEngine.js`, scoped to the three confirmed-bad entries only — no
new vocabulary or POS heuristic invented, every genuine infinitive
headword untouched. Verified: both "school" and "home" now produce
`...·chi re·angenga` for all three subject persons; "going to eat"/
"going to buy rice" (genuine infinitives) unaffected.

**Also fixed same commit — OOV-destination fallback garbling:** while
sweeping every "going to `<destination>`" case, found that a
destination with no dictionary entry at all (college/gym/airport/
stadium — genuinely absent from the dictionary, not a bug) fell through
grammar-assembly's own `[UNKNOWN]`-bail guard all the way to the
morphology fallback step, which does a blind per-word dictionary join
and — confirmed live — pulled unrelated dictionary senses for function
words never meant to be translated standalone this way (`"is"`→
`"daka"`, `"to"`→`"·na"`), producing `"Ua daka re·angenga ·na
[UNKNOWN]"`. Added an additive `allowUnknown` parameter to
`assembleGrammar` (`sentenceBuilder.js`, default `false`, zero behavior
change for the existing caller) and a new fallback step in
`translationEngine.js`'s cascade, between sov-assembly and morphology,
that reuses the same already-computed grammar structure but keeps a
visible `[UNKNOWN]` instead of bailing. Now produces the much more
legible `"Ua [UNKNOWN]·chi re·angenga"`. Confidence `0.6`, below every
fully-resolved method, still preferred over morphology's word-salad
because it's reached first and is objectively more grammatical when it
fires.

### Fix 2 — NP-subject + has/have coherence gate (commit `a9adc4b`)

**Symptom (found during the same audit sweep):** "the boy has a dog" →
`"me·a bi·sa donga Achak"` — verb stranded mid-sentence, wrong word
order (not SOV).

**Root cause:** `grammarEngine.js`'s NP-subject (`"the X"`/`"a X"`)
coherence check — the gate that decides whether an article-led phrase
is allowed to be the sentence subject — accepted `is/are/was/were`,
`STOP_WORDS`, `AUXILIARY_SKIP`, and `VERB_LEMMAS`-derived main verbs as
valid evidence that the next token is a genuine predicate, but not
`has`/`have`. So any `"the/a NOUN has ..."` sentence never passed the
gate, `grammar.subject` stayed `null`, `assembleGrammar` bailed
unconditionally (`if (!grammar || !grammar.subject) return null`), and
the whole sentence fell to the much weaker sov-assembly fallback, which
has no SOV reordering at all.

Not a new linguistic claim: pronoun-subject "he has a dog" already
correctly resolved `has`→`"donga"` via the same downstream verb-search
loop, confirmed live before this fix — the gap was purely in the
earlier subject-detection gate, not in verb resolution itself.

**Fix:** added `has`/`have` to the same literal-match check
`is/are/was/were` already uses at that exact line — identical shape,
no new signal invented. Verified: "the boy/a boy/the teacher/the girl
has..." now all reach grammar-assembly and produce correct SOV order
with the object accusative marker (`achak·ko donga`, `ki·tap·ko donga`,
etc.). Full 458/458 suite re-run clean, no pinned test relied on the
old broken word order for this shape.

### Investigated, correctly ruled not-a-bug

`"did she eat rice"` (no `?`) losing question marking was raised as a
candidate bug during the sweep — traced to `grammarEngine.js` lines
81–103's deliberate, well-documented design: the terminal `?` is the
sole disambiguator between declarative `"did you see the two small
dogs"` (a real, pinned regression case) and interrogative `"did he
eat?"` for this class of auxiliary-inversion. Confirmed working as
designed; no change made.

### Found, NOT fixed this session — flagged for next session

**Leading time-word breaks subject detection entirely.** `"tomorrow he
will go to the market"` → `analyzeGrammar` returns `subject: null,
verb: null, location: null` (only pronoun-initial or `a/an/the`-initial
sentences are recognized as subject-starting), so it falls to sov-
assembly and loses both the `-de` temporal suffix (RULE-042, already
verified/high-confidence, `docs/grammar_rules_structured/RULE-042.yaml`,
explicitly flagged `launch_priority: P1` — "worth wiring into the
engine ... not just documented") and the `-chi` locative marker
entirely. The three RULE-042 example sentences work today ONLY as
hardcoded 1st-person `corrections.json` literals (`"tomorrow i will go
to the market"` etc.) — the construction is not generalized to other
subjects or verbs.

This is the same architectural class of bug as Fix 2 above (subject-
detection gate too narrow), but riskier to fix blindly: while checking
what Garo value to reuse for a general fix, found the dictionary's bare
`"today"` entry is `"Da.alo"` (plain period, with an `-o` suffix
already attached) — this does NOT match RULE-042's own verified root
`"Da·al"` (raka dot, no suffix) that the rule's `-de` composition
depends on (`Da·al` + `de` = `Da·alde`, native-confirmed). Whether
`"Da.alo"` is a typo, a distinct word, or an already-suffixed variant is
a dictionary-content question, not an engineering one — do not
generalize the `-de` construction until Claude A/D resolves that
divergence; picking one dictionary value over the other from the engine
side would be an unlicensed linguistic call. `"tomorrow"`→`"Knal"` and
`"yesterday"`→`"Mejal"`/`"Mijal"` (RULE-042 acknowledges both spellings)
have no equivalent flagged conflict, only `"today"` does.

**Recommended shape of the eventual fix**, once the today/Da·al
divergence is resolved: recognize a small closed set of leading time
words (reusing RULE-042's already-verified roots, not inventing new
ones), strip before subject detection the same way `pendingLocative`-
style flags already work elsewhere in this file, then prepend the
Garo time-word + `-de` to the assembled output. Scope narrowly to the
already-verified three words; do not attempt a general "any adverb
before the subject" fix — no POS data exists in this dictionary to
support that safely (same documented boundary as the `a/an/the`
NP-subject coherence check itself).

## Gate at close

Re-run fresh at final merged HEAD, after both fixes and after merging
two rounds of concurrent Claude A pushes (both data/docs-only, zero
`src/` overlap, confirmed via diff before merging each time — see PAT/
push-mechanics note below):

- `node prepare-data.js` — clean, 8899 entries compiled.
- `node test-dictionary.js` — 8899/8899 valid, 9/9 grammatical
  corrections.
- `node repository-intelligence.js` — **PASSED**, 0 new violations
  across all checks (9 raka-locality candidates remain report-only,
  unchanged, not asserted bugs).
- `node --test tests/unit/*.test.js` — **458/458 pass**, 0 failures.
- `node scripts/runtime-error-sweep.mjs` — **0 errors** across 15,862
  `translate()` calls (full compiled_dict key sweep, plural/counted-noun
  sample, structural edge cases, type-safety inputs, full API surface).

## Push mechanics this session

Two rounds of non-fast-forward pushes, both from concurrent Claude A
session-close commits landing mid-session (`f4423a0`, then separately
`be4f196`/`7697173`). Both times: `git fetch origin`, diffed
`HEAD..origin/main` file-by-file before merging (not just trusted the
stat summary) — confirmed both were `.ai/WORKSTATE.yaml`/
`docs/CLAUDE_A_SESSION_MIGRATION_*`/`master_dictionary.json`/
`src/compiled_dict_alternates.json` only, with the `src/*.js` engine
files in the diff stat showing purely "origin lacks my not-yet-pushed
fix" (expected divergence from branching off an earlier commit), not a
real competing edit at the same lines — verified this explicitly by
reading the actual diff content, not assumed from the stat line alone.
Both merges were clean (`git merge`, no conflicts), full gate re-run
fresh after each merge before pushing, `HEAD == origin/main` confirmed
after each push via the push command's own returned ref update.

PAT was provided fresh by the person this session (confirmed usable
"for a while," not single-session), set into the remote URL for
clone/push, never written to any tracked file or `git config` value
(gate/verification did not include a literal grep for the token string
in this session — flag this as a small process gap for the next
session's own close checklist, though no evidence surfaced of it
landing anywhere it shouldn't).

## Open items carried forward (not new, for context)

- **Leading-time-word subject-detection gap** — this session's own
  finding, detailed above, not fixed.
- **`today`/`Da.alo` vs RULE-042's `Da·al` root divergence** — blocks
  the above; needs Claude A/D, not an engineering call.
- **AI-003** (multi-word `VERB_LEMMAS` entries invisible to the
  single-token matcher, 609/955 = 64% of the set) — investigated and
  logged in a prior session (`docs/CLAUDE_B_SESSION_MIGRATION_20260923.md`),
  still not fixed; needs a word-count-cutoff design decision.
- **Claude D's Fix #2** (`VERB_LEMMAS`/`to`-prefix canonicalization,
  broader than this session's narrow exclusion-list fix) — still
  explicitly blocked on Owner ruling (c), not touched.
- **VERB_LEMMAS coverage gap** (common verbs like run/eat not covered,
  so "the dog runs"-shaped sentences still fall to sov-assembly) —
  content decision, unchanged from prior sessions.
- S6.2 pronoun ·ko adjudication, -de/-ara marker distinction, 'animal'
  vocabulary gap — all unchanged from prior sessions, not touched this
  session.

Full commit list this session: `78aa597` (Fix 1), `e56078b` (merge),
`a9adc4b` (Fix 2), `b4a0d81` (merge). Final HEAD `b4a0d81`, verified
`== origin/main` after push.
