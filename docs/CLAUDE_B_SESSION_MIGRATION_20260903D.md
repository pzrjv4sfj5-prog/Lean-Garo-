# Claude B Session Migration — 2026-09-03D (NV-119, NV-120: Claude A handoff findings)

## Trigger
Claude A's handoff (`docs/CLAUDE_B_HANDOFF_20260903_modal_drop_and_ma_
question_gap.md`), Project Owner: "yes fix them".

## Finding 1 (modal "can") — FIXED, NV-119
**Root cause:** `"can"` sits in both `STOP_WORDS` and `AUXILIARY_SKIP`
(`normalizationEngine.js`), so every composition path silently discards
it with no record a modal was ever present. Only the 4 first-person
sentences already in `compiled_dict.json` (exact-phrase) worked; any
other subject/verb combo dropped the modal entirely ("she can eat" →
"Ua Cha·a").

**Fix:** did not touch `STOP_WORDS`/`AUXILIARY_SKIP` or the general
verb-finding loop (too risky — "can" is skipped in many sentence shapes
this repo has no evidence for). Instead, added a narrow, dedicated
construction (`tryModalCanConstruction`, `grammarEngine.js`) tried before
general grammar-assembly, same tier as `tryOnlyIdentityConstruction`.
Fires only for `"SUBJ can VERB [OBJECT]"` with a pronoun subject and a
verb in the new `src/data/modal_can_map.json` — populated *only* from
direct native citations (`docs/THANGSENG_NATIVE_VALIDATION.md` lines
~5757, ~5943-5945): `eat`, `go`, `work` (all intransitive), `speak`
(the only one with object evidence). Output uses `man·a` (not `ama`) as
the primary variant, matching `docs/PICKPRIMARY_VERIFIED_TIES.md`'s
existing tie-break for the 3 first-person citations.

**Deliberately separate from `purpose_map.json`:** that table is for
"want to VERB"/"went to VERB", a different construction. Checked — it
does NOT share the same form for every verb: `work` is `kam ka·na` here
vs `purpose_map.json`'s `dakna`; `go` is `re·angna` here vs
`purpose_map.json`'s `re·ang·na` (orthographic difference). Sharing the
table would have silently shipped the wrong form for "he can work".

**Bug caught while implementing:** the object-noun path for "speak"
would have used `compiled_dict.json`'s `"garo"` → `"Rong"` entry (an
unrelated sense, likely general "language") instead of keeping "Garo"
as itself, which is what the actual citation does. Added a narrow guard
for exactly this one attested word — not a general "never translate the
object of speak" rule, since there's no evidence for other language
names yet.

**Scope limits, on purpose, not fixed this session:**
- `"can't"`/`"cannot"` — regex requires whitespace after "can", which
  neither contracted form has, so these fall through untouched. No
  native evidence yet for the negative modal's shape.
- Verbs outside the 4-entry map (e.g. "she can sing") still silently
  drop the modal — documented limitation, not guessed at.
- An object on an intransitive-in-this-construction verb ("he can eat
  rice") is unattested and does not fire.

## Finding 2 (`-ma` polar question) — PARTIALLY FIXED, NV-120
**Root cause investigation surfaced something Claude A's handoff didn't
know:** there are actually **two existing, structurally different exact-
phrase citations** for what look like paraphrases of the same English
meaning:
- `"did you have lunch"` → `"Na·a mi cha·jokma?"` (subject-first, bare
  object `mi`, verb+`jokma`)
- `"have you eaten lunch"` → `"Mipringde cha·ahama?"` (topic-marked
  object `Mipringde`, verb+`ahama`, subject pronoun dropped entirely)

This is the same "two attested sentences, two different shapes" pattern
already established for the "only" construction (NV-112/NV-114) —
unifying them into one general `-ma` polar-question composer would be
exactly the single-attestation overreach this repo's governance
repeatedly flags.

**Fix, narrowly scoped:** only citation 1 is generalized, and only along
the one dimension it actually attests — subject pronoun (the citation
already varies the subject: `"Na·a"` for "you", so substituting other
pronouns is grounded, not a guess). New
`tryPolarQuestionLunchConstruction` (`grammarEngine.js`), matches
`"did SUBJ have lunch"` (bare object only, no possessive), substitutes
the subject pronoun, ships the rest of citation 1 unchanged.

**What this fixes:** "did she have lunch?" (Claude A's exact
reproduction case) now → `"Ua mi cha·jokma?"` instead of the previous
`donga`-injection word-salad.

**What this deliberately does NOT fix:** "have you eaten your lunch?"
(Claude A's other reproduction case) — this has a possessive ("your")
added to citation 2's shape, which is unattested territory: citation 2's
topic-marked object form on a *possessed* noun has no evidence either
way, and citation 2 drops the subject pronoun entirely with no evidence
for how (or whether) a non-"you" subject would surface. Left as the
pre-existing broken `sov-assembly` output rather than guessed at.
Regression test added specifically confirming this is *intentionally*
still broken, so a future session doesn't mistake the gap for an
oversight.

## Finding 3 (question-word questions on paraphrase) — not a bug
Confirmed correct, per Claude A's own framing (positive control). No
action needed.

## Finding 4 ("only X" scope) — documented, not changed
Confirmed: "he is the only student" does not route through NV-112's
`saksa kamkam` construction (which is deliberately scoped to subject "I"
only, per its own original citation). It correctly falls back to a
different, independently-VERIFIED construction using `mangmang`
("Ua chattro·ko mangmang") — not broken, just a different, equally valid
sentence. No native evidence either way on whether third-person subjects
should use the same `saksa kamkam` shape as "I" — not a call to make
blind. No code change; noting here so the scope boundary is visible.

## Tests
Added 10 new tests: 3 for NV-119's three fixed sentences, 3 regression
guards (existing citations untouched, unmapped verbs still fall through,
`can't`/`cannot` and unattested objects don't fire), 3 for NV-120 (fixed
sentence, both citations untouched and still distinct from each other,
explicit confirmation the possessive variant is intentionally still
broken).

## Gate (independently run this session)
- `node prepare-data.js` — 8212 unique entries (unchanged from pull),
  clean.
- `node test-dictionary.js` — 8212/8212 valid, 9/9 corrections.
- `node repository-intelligence.js` — 0 new violations.
- `node scripts/resync-stale-overrides.mjs` — 0 resync candidates.
- `node --test tests/unit/*.test.js` — **314/314 pass** (was 304; +10 new).

## Diff scope
`src/grammarEngine.js` (two new exported functions), new
`src/data/modal_can_map.json`, `src/translationEngine.js` (two new
cascade steps, 5.8 and 5.9), `tests/unit/translationEngine.test.js`.
Zero changes to `master_dictionary.json`/`compiled_dict.json`/
`corrections.json` — both existing citations that anchor this work are
untouched, confirmed via regression tests.

## Next session resume
Nothing open from Finding 1/2's fixed scope. Remaining, not attempted:
- Modal "can" for verbs beyond eat/go/work/speak — needs native evidence
  per verb before extending `modal_can_map.json`.
- Negative modal ("can't"/"cannot") — needs native evidence for its
  shape.
- "have you eaten your lunch?" (possessive variant) and any other polar
  question beyond the bare "lunch" case — needs its own native citation,
  not a generalization from either existing one.
- Finding 4 (only-X third-person scope) — needs native evidence on
  whether `saksa kamkam` extends past subject "I", or relay a new
  citation for a non-"I" subject.
