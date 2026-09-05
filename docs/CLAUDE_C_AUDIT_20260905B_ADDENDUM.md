# Claude C Audit Addendum — 2026-09-05B
Covers the three sections the first report (`CLAUDE_C_AUDIT_20260905.md`)
skipped: full number/classifier sweep, full question-type distinction, and
row-by-row source→master→compiled→runtime propagation. Read-only, same
clone, HEAD still `b00ffb9`, still clean — confirmed again at close.

## A. Full number/classifier sweep — RESULT: PASS, engine is solid
Tested all 10 classifier categories (`mang, sak, king, gong, ge, jol, pang,
dot, te, rong` — every category in `CLASSIFIER_MAP`) × 16 counts each
(1,2,3,4,5,10,11,12,15,19,20,21,25,30,100,101) = 160 checks comparing the
standalone classifier engine (`buildClassifierPhrase`) against full-pipeline
runtime output.

**Zero mismatches.** Every category correctly handles: digits 1-10, teens
(`Chi·`-prefix), tens+units (20-99, `·`-joined per the 2026-06-28 native
rule), and hundreds (`ritcha` + classifier). Raka-carrying categories
(`mang/ge/gong/te`) vs. no-raka (`king/jol/pang/dot/rong/sak`) are applied
correctly and consistently in every case tested. **This is the most
reliable subsystem found in the whole audit — no findings here.**

One unrelated, minor vocabulary gap surfaced as a byproduct: `"pole"` has no
`master_dictionary.json` entry for the noun itself (only the classifier
mapping `'pole':'jol'` exists), so `"1 pole"` → `"pole jolsa"` leaks the
untranslated English word while the classifier suffix composes correctly.
Not a classifier bug — a missing vocabulary row.

## B. Full question-type distinction — RESULT: FAIL, systemic and broader than previously documented
Confirmed and **generalized** the project's own known gap (NV-119/NV-120,
`docs/CLAUDE_B_HANDOFF_20260903_modal_drop_and_ma_question_gap.md`), which
was scoped to "can" and one "have lunch" paraphrase. Independent testing
shows the same failure shape across nearly all question types:

**Polar questions (`-ma`/`-hama`):**
| input | output | verdict |
|---|---|---|
| did **you** eat? | Na·a Cha·**ahama**? | PASS (exact-phrase citation) |
| did **i/he/she/they** eat? | Anga/Ua/Uamang Cha·a (no suffix, no `?`) | **FAIL — question marking silently dropped for every subject except "you"** |
| will **you** eat? | Na·a cha·**genma**? | PASS (citation) |
| will **he** eat? | Ua Cha·gen (declarative, indistinguishable from a statement) | **FAIL, same pattern** |
| will you **not** eat? / did you **not** eat? | declarative negative, no `-ma`, no `?` | **FAIL — negative polar questions lose marking entirely, for every subject including "you"** |
| did **i/he** have lunch? | Anga/Ua mi cha·jokma? | PASS — this one *does* generalize (the narrowly-scoped `polar-question-construction`, .85 conf, documented in NV-119/120) |
| have i eaten lunch? / have you eaten **your** lunch? / did you have **breakfast/dinner**? | word-salad: `"donga cha·jok Nang·ni Mipring Na·a"` — wrong word order, stray "donga" (generic "to have/exist") intruding | **FAIL, high severity — confirmed the exact NV-120 bug generalizes to breakfast/dinner too, not just the one originally-flagged paraphrase** |

So the "have lunch" polar construction is (surprisingly) *more* robust across
subjects than the plain "eat" polar construction — an asymmetry not
previously flagged: the narrowly-scoped fix generalizes better than the
default path it was meant to patch around.

**Interrogative-word questions:**
Mixed — the wh-word itself is usually preserved (who/why/how/which all
correctly appear via `sov-assembly` when off the exact-phrase citations), but
consistency breaks down in two ways:
- **`"when"` is dropped entirely** on non-citation input: `"when will you
  go?"` → `"Na·a Re·anggen"` (no "when," no `?`) even though `"when did you
  eat?"` (a stored citation) correctly keeps `"basako"`. Same drop-on-
  generalization pattern as the polar case.
- **`"what did he eat?"` produces malformed output**: `"Maia? Ua Cha·a"` — a
  stray `"Maia?"` (what?) fragment is spliced in front of an otherwise-plain
  declarative sentence, rather than composing into one coherent question.
  The "you"-subject citation (`"Na·a maiko cha·aha?"`) is well-formed; the
  moment the subject changes, the composition breaks structurally, not just
  cosmetically.
- **`"where is the cat?"` surfaced a new, distinct `cat` bug**: it resolves
  via a `stopword-stripped` path to `"kade mang?"` — **`"mang"` is not a
  translation of "cat" at all, it's the bare animal-classifier morpheme**
  (see `CLASSIFIER_MAP`). This is a fourth distinct root now observed for
  "cat" across sessions (`Menggo`/`meng·gong`/`menggo`/now `mang`), and this
  one isn't even a real word — it's an internal classifier stub leaking into
  output. Root cause not fully isolated (didn't trace the `stopword-stripped`
  code path in this session) but confirmed live and reproducible.

**Net assessment:** question-type marking is essentially only reliable when
input exactly matches a stored citation. The moment a question is
paraphrased along any dimension the citation didn't attest (different
subject, different tense, added negation), the system very often silently
degrades to a plain declarative sentence with no signal that anything was
lost — no error, no lowered confidence in several of these cases (`sov-
assembly` still reports .75, same as it would for a correctly-composed
declarative). This is a broader instance of the same "confident wrong
answer" pattern flagged in the first report for `leaves`/`ball`.

## C. Row-by-row source→master→compiled→runtime propagation trace
Traced `cat, happy, dog, elephant, leaf, king, movie, ball, answer, leave,
tall, eat, big` through `master_dictionary.json` → `compiled_dict.json` →
`corrections.json`/`phrase_maps.js` → live `translate()`.

**`happy`, `leaf`, `king`, `movie`, `eat`, `big`, `tall`: fully consistent**
top-to-bottom, single `verified_high` value survives the whole pipeline with
no divergence. These are the pipeline working as intended.

**`dog`: ships at high runtime confidence (.98-1.0) from an `unverified`
master row.** `Achak` has never actually been through Thangseng
confirmation — the *only* `master_dictionary.json` row for "dog" is tagged
`unverified`, yet `phrase-map`/`correction` methods report .98-1.0
confidence at runtime. This is a confidence-schema gap: runtime confidence
reflects "which cascade layer answered," not "how well-evidenced is this
value" — the two have been silently decoupled for at least this entry, and
I did not check how many others share this gap.

**`elephant`: three genuinely `verified_high` variants, silently
un-reconciled between layers.** `master_dictionary.json` has `Mong`,
`ha·ti`, and `mong·ma` all as `verified_high` (dialectal/register variants,
not a real error). `compiled_dict.json` and `phrase_maps.js` both agree on
`Mong` — but `corrections.json` independently holds `mong·ma`, and per the
project's own stated cascade order (corrections → phrase_maps → compiled),
`corrections.json` wins, so runtime ships `mong·ma` while two of three
source layers say `Mong`. Not linguistically wrong (both are attested), but
it means inspecting `compiled_dict.json` alone to answer "what does the app
actually say for elephant" gives a wrong answer — you have to know
`corrections.json` overrides it. Same shape of problem as the `cat`
conflict, just currently harmless because nobody's picking the wrong side.

**`answer`: NOT actually resolved — my first report's "appears fixed" call
was wrong, corrected here.** `compiled_dict.json` still holds
`"Aganchakani"` — a different POS from the shipped `"Aganchaka"` (master
notes confirm `Aganchakani` is the noun form, `Aganchaka` the verb; this is
the exact `answer`-pickPrimary-tie issue already tracked as an open
engineering item). It only *looks* fixed at runtime because
`corrections.json`'s override (`Aganchaka`) masks the still-broken compiled
value. If that correction were ever removed, the shipped word would revert
to the wrong POS with no other signal that anything changed. **This is a
masked-not-fixed bug, worth re-flagging to Claude B specifically since the
prior audit's re-verification (§8 of the first report) incorrectly took the
runtime output at face value instead of tracing to source.**

**`cat`: root cause of the three-way conflict fully located.** Two
independent chains, neither aware of the other:
- *Bare-word chain* (`cat` key itself): `master_dictionary.json` has
  `Menggo` (superseded) and `meng·gong` (verified_high) → compiled → phrase-
  map. **Fully consistent within itself** — `meng·gong` all the way down.
- *Counting-phrase-citation chain* (`"one cat"`, `"three cat"` as literal
  keys): root `menggo` (no dot), independently verified_high, cites
  Thangseng directly and separately from the bare-word citation.
  **Also internally consistent** — but disagrees with the bare-word chain on
  the raka mark.
- *Live classifier-composition path* (`"two cats"`, `"three cats"` —
  plural forms): **has zero master_dictionary.json rows of its own** — it's
  generated at runtime by combining the bare-word lookup (`meng·gong`) with
  `buildClassifierPhrase`. This is why the plural forms get the bare-word
  root while the singular "N cat" forms get the citation root — they were
  never the same code path to begin with.
- Bonus finding: `"two cat"`'s own master row is tagged **`unverified`**
  (not `verified_high` like `"one cat"`/`"three cat"`), yet ships at .98
  confidence via `exact-phrase` — same confidence-schema gap as `dog`.

**`leave`/`leaves`: root cause fully traced, confirms and explains the first
report's highest-severity finding.** `master_dictionary.json` has no entry
for bare `"leave"` at all — only `"to leave"` → `Re·ongkata`
(**unverified**). `prepare-data.js`'s bare-infinitive alias generator (which
auto-creates `"X"` from `"to X"` when `"X"` has no entry — 787 such aliases
this build) created `compiled_dict["leave"] = "Re·ongkata"` as a byproduct.
The plural-stripping layer then strips `-s` from `"leaves"` → `"leave"`,
which now collides with that auto-generated verb alias instead of the noun
`"leaf"`. **This is an emergent interaction between two individually-
reasonable features (bare-infinitive aliasing + naive -s stripping) that
neither was designed with the other in mind** — not a single bad row, a
structural collision risk. Any other noun whose singular, when you strip a
final -s, happens to match a bare-infinitive-aliased verb is at the same
risk; I did not sweep for other instances of this pattern this session.

## Updated severity ranking (supersedes §10 of the first report where it conflicts)
1. **`answer` compiled-level tie is still open, not fixed** — corrects the
   first report's re-verification, which trusted runtime output without
   tracing to source. Re-open with Claude B.
2. **`leave`/`leaves` collision** — root cause now fully known (bare-
   infinitive-alias vs. plural-strip interaction), same severity as before,
   now actionable.
3. **Question-type marking silently drops on any paraphrase off the exact
   citation** (both polar and wh-word) — broader and more systemic than the
   previously-documented NV-119/120 scope; affects most subjects/tenses,
   not just "can" and one "have lunch" variant.
4. **`cat`'s fourth root (`"mang"`, a classifier stub) via `where is the
   cat?`** — new, not yet root-caused to a specific code line.
5. Confidence-schema gaps (`dog`, `"two cat"` shipping high confidence from
   `unverified` source rows) — not wrong today, but the confidence score
   can't be trusted to reflect evidentiary strength.
6. `elephant` cross-layer variant divergence — currently harmless (all
   variants attested) but the same "which layer do you trust" fragility as
   `cat`, latent until someone edits one layer without knowing the others.

## What's still not done (full coverage was not achieved even in this pass)
Did not sweep beyond the 13 words traced in §C — a full propagation audit
would need this treatment for every entry with 2+ master rows (1619 flagged
by `repository-intelligence.js` Check C already, per the build output).
Did not root-cause the `stopword-stripped` path that produced the `"mang"`
cat bug. Did not check whether the bare-infinitive-alias/plural-strip
collision (finding C, `leave`) recurs elsewhere — that would need a
scripted sweep of all ~787 bare-infinitive aliases against all pluralizable
nouns, not sampled here.
