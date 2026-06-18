# Deep Research Brief — Garo Language Grammar
_Prepared for Perplexity (or similar deep-research tool) by the Lean-Garo project team_
_Purpose: resolve open grammar questions in an English↔Garo machine translation engine_

---

## CONTEXT

We are building a rule-based English-to-Garo translation engine (Garo is a
Tibeto-Burman language spoken primarily in Meghalaya, India, and parts of
Bangladesh, also known as A'chik). We have compiled grammar rules from
academic sources (Robbins Burling's grammars, SIL/Webonary, Wiktionary) and
~300 native-speaker-verified sentence pairs, but several grammar questions
remain unresolved or only partially confirmed. We need deep, sourced research
to fill these gaps with citations to academic linguistics literature,
missionary-era grammars, and any available native-speaker corpora.

**What "good" looks like:** specific grammatical rules with example sentences,
citations to named sources (book/paper/author/year), and clear notes on
dialect variation (A'we vs A'beng vs A'chik) where it affects the answer.
Avoid generic Wikipedia-level summaries — we already have those. We need
the next level of depth: how do native speakers actually use these
constructions in practice?

---

## VERIFIED EXAMPLES WE ALREADY HAVE (use these as ground truth/anchors)

These are confirmed correct by a native speaker or strong academic source.
Use them to calibrate — if your research contradicts these, flag the
contradiction explicitly rather than silently preferring one source.

| English | Garo | Notes |
|---|---|---|
| Dog bit me (past) | Achak Angko chikaha | `-aha` = past tense suffix |
| Dog bites me (present/habitual) | Angko a·chak chika | No suffix = present/habitual; note reversed word order vs past form |
| Did you eat food? | Na·a Mi Cha·aha ma? | Subject + Object + Verb-past + question particle `ma` |
| Have you eaten food? | Na·a Mi Cha·jok ma? | `-jok` = perfect aspect ("change of state, result persists") |
| This is my father | Ia ang·ni baba | `ang·ni` = 1st person genitive ("my") |
| I have two children | Ang·o Bi'sa sak gini dong·a | Children counted with `sak` classifier + number |
| I am sad | Anga duk ong·a | No progressive suffix needed for this stative expression |
| Turn left | Pila chepbo | `-bo` = imperative suffix |
| What do you want? | Na·a maiko nanga? | `mai` = "what", `-ko` = accusative-like marker on "what" |
| 2 dogs | mang·gni achak | `mang` = animal classifier prefix on the number, not the noun |

---

## OPEN QUESTIONS — PRIORITY RESEARCH WORKLIST

### 1. Negation: `-ja-` vs `-gija` — which is standard, which is dialectal?
Academic sources (Burling) consistently describe `-ja-` as the negative
infix inserted between verb root and tense suffix. Our native speaker
informant's corrections use `-gija` (e.g. "this is not good" = "Ia
nama-gija" → "Ia nama·gija" after our raka-orthography fix).
**Research needed:** Is `-gija` a contracted/colloquial form of `-ja` + something
else? Is it dialect-specific (A'chik vs A'we vs A'beng)? Are both understood
by all speakers, or does one sound archaic/formal vs the other colloquial?
Cite specific grammars or dialect studies if available.

### 2. Word order flexibility — is Garo strict SOV or does OSV/other orders occur naturally?
We have confirmed Burling's claim that Garo allows flexible word order
because case markers (not position) indicate grammatical role. But we found
a real example where "dog bit me" and "dog bites me" have OPPOSITE word
order (Achak-first vs Angko-first) — and our informant said this is purely
a TENSE distinction, not a word-order license.
**Research needed:** Under what conditions does Garo word order vary in
natural speech? Is there a pragmatic/discourse reason for fronting the
object vs subject (e.g. topic/focus marking)? Are there documented examples
of natural OSV vs SOV alternation tied to tense or aspect specifically (as
opposed to topicalization)?

### 3. The raka (·) — is it truly hyphen-equivalent in all positions, or does it have phonological rules?
We've been treating the raka (interpunct, representing a glottal stop) as
simply replacing hyphens throughout our data, per native-speaker instruction.
**Research needed:** What are the actual phonological/orthographic rules
governing the glottal stop in Garo? Does it always correspond to a real
glottal stop sound, or is it sometimes a written convention without a
phonetic counterpart (e.g. marking a morpheme boundary)? Are there positions
where it CANNOT occur (e.g. word-initial, after certain consonants)? Cite
phonology sections of Burling or other grammars specifically.

### 4. Question formation — is `ma` always sentence-final, or are there other question markers?
Our data: `Na·a Mi Cha·aha ma?` (did you eat food). We've also seen mentions
of `-mo` and `-ni` as alternative question markers in some sources.
**Research needed:** What's the difference between `ma`, `mo`, and `ni` as
question markers? Are they interchangeable, dialect-specific, or used for
different question types (yes/no vs rhetorical vs tag questions)?

### 5. Verb tense/aspect system — full paradigm with native usage notes
We have: `-a` (present), `-aha` (past), `-jok` (perfect), `-gen`/`-noa`
(future), `-ing-`/`-eng-` (progressive infix), `-jok-ming` (past perfect),
`-chim` (conditional/irrealis).
**Research needed:** Build out the FULL aspect/tense paradigm with example
sentences for each combination (e.g. future progressive, future perfect,
past progressive) if these exist in Garo at all — some Tibeto-Burman
languages don't grammaticalize all the tense/aspect combinations English
does. Flag clearly if a particular combination (e.g. "future perfect
progressive") simply doesn't exist as a grammatical category in Garo.

### 6. Possessive/genitive markers beyond `-ni` — compound and special cases
We have `ang·ni` (my), `nang·ni` (your), `ua·ni` (his/her), `an·chingni` (our).
**Research needed:** Are there alternate possessive constructions (e.g. for
inalienable possession like body parts/kinship vs alienable possession like
objects)? Many Tibeto-Burman languages distinguish these grammatically —
does Garo?

### 7. Classifier system — full inventory and rules for choosing classifiers
We have: `mang` (animals), `sak` (people), `king` (flat/thin objects), `gong`
(money), `do` (birds, also a noun prefix), `bi` (plants).
**Research needed:** Is there a more complete inventory of Garo numeral
classifiers? What's the rule when a noun could fit multiple categories
(e.g. is a snake "mang" like other animals, or does it have its own
classifier)? Are classifiers ever optional or is their use always
obligatory when counting?

### 8. Kinship terms — dialect variation
We were corrected: father = "baba" (not "apa"), mother = "aai" (not "ama"),
wife = "jikgipa" (not "jik"), husband = "sejipa" (not "ang-se").
**Research needed:** Are "apa"/"ama"/"jik"/"ang-se" valid in OTHER Garo
dialects (A'we, A'beng) even if not the form our informant uses? We want to
understand if these are dialect variants worth preserving as alternates,
or simply incorrect/outdated terms that should be fully replaced.

### 9. Gender-neutral relationship terms
Our informant told us "mikchagipa" is used for both "boyfriend" and
"girlfriend" without distinguishing gender.
**Research needed:** Is this a documented feature of Garo (i.e., the
language doesn't grammatically distinguish romantic-partner gender), or is
"mikchagipa" specifically gender-neutral while other gender-specific terms
also exist? Are there other domains where Garo doesn't mark gender that
English speakers might expect it to (e.g. professions, titles)?

### 10. Verb roots: confirm/correct our list and gather natural example sentences
We have algorithmically constructed sentences for verbs like drink, sleep,
go, come, eat, work, study, pray, run, give, see, speak, write, read, buy,
sell, play, cook, wash, help, call, understand, love, laugh, cry — built
from dictionary roots + tense suffix rules, but NOT individually native-
verified for naturalness.
**Research needed:** For each of these verb roots, find (if possible) a
natural example sentence from any available Garo text corpus, Bible
translation (Garo has Bible translations, often a rich source for
naturalistic example sentences), or other published material — even a
single confirmed sentence per verb would help us validate our
constructions.

---

## SUGGESTED RESEARCH SOURCES TO PRIORITIZE

1. Robbins Burling, *The Language of the Modhupur Mandi (Garo)*, Vol. I
   (Grammar) and Vol. II (Lexicon), 2003/2004 — University of Michigan,
   available online.
2. Robbins Burling, *A Garo Grammar*, Deccan College Monograph Series, 1961.
3. E.G. Phillips, *Outline Grammar of the Garo Language*, 1904 (public domain).
4. Samson K. Sangma, *Achik Grammar*, 1991 — UNT Digital Library.
5. SIL International / Webonary Garo Dictionary.
6. Garo Bible translations (often used by linguists as accessible parallel
   text corpora for under-documented languages) — if accessible, look for
   specific verses containing our target verbs in varied tenses.
7. Any peer-reviewed papers in journals covering Tibeto-Burman or
   Bodo-Garo languages (e.g. Linguistics of the Tibeto-Burman Area).
8. Academic theses/dissertations on Garo phonology or syntax, which often
   go into more depth than general grammars on specific subsystems (like
   the glottal stop question above).

---

## OUTPUT FORMAT REQUESTED

For each numbered question above, please provide:
- A direct answer where the research supports one
- Citations (author, year, page/section if possible)
- Example sentences in Garo with English glosses, sourced wherever possible
- Explicit notes on dialect variation if relevant
- Honest flagging of "no clear answer found" rather than speculation, if
  the research genuinely doesn't resolve a question

This will be used to improve a rule-based translation engine, so precision
and sourcing matter more than breadth — we'd rather have 5 well-sourced
answers than 10 vague ones.
