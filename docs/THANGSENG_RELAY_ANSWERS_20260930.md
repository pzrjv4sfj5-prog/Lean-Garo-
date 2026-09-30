# Thangseng Relay Answers — 2026-09-30 (received via Project Owner, raw)

Raw answers pasted directly into a Claude B session by the Project Owner
(WhatsApp screenshots/text, Thangseng, dated 28-29/9/2026). NOT YET
PROCESSED into master_dictionary.json/docs/grammar_rules_structured — this
is a content-lane task (Claude A), filed here verbatim per standing
practice (cf. docs/THANGSENG_RELAY_QUESTION_*.md /
docs/THANGSENG_NATIVE_VALIDATION.md conventions) rather than acted on by
Claude B directly.

## New vocabulary/sentences, unprompted (same relay)

> [12:10 am, 29/9/2026] Thangseng: crumble down
> be.grua
>
> [12:10 am, 29/9/2026] Thangseng: he lays eggs
> Ua bitchi chia = he lays eggs
> do'o bitchi chi'a = hen lays eggs

## The original 3-question (4-part) relay batch, matched to its answers

This is the exact batch this project sent to Thangseng (machine-rule
format, A/B/C multiple choice) — reproduced here in full so the answers
below are unambiguous, not reconstructed from the terse reply alone.

---

**1. Quantity word order — one exception to check**

We confirmed QUANTITY + NOUN (`adita ki·taprang`, `bang·a chattrorang`).
But two older phrases go NOUN + QUANTITY instead: `Wak be·en mit·am
bang·a` (pork fat), `Man·derang bang·e re·baa` (so many people came).

Is this because those are a different sentence type (description/
exclamation, not possession)?

A. Yes — different sentence type, different order
B. No — those should also be QUANTITY + NOUN
C. Both orders are always valid

> **Answer: A.** "Yes. different sentence type will use different order"

**2. Plural "-rang"**

Can `-rang` be added to any countable plural noun?

A. Yes — general rule
B. No — only certain nouns
C. Depends on context

*If B/C:* one noun that takes it, one that doesn't.

> **Answer: A.** "Yes. -rang can be added to any countable nouns to make
> it plural"

**3. Adjective position — noun phrases, not just predicates**

We know `Gari sila` ("the car is beautiful") — adjective after the noun
as a predicate. Inside a noun phrase (not a full sentence), like "a
beautiful car" or "three big dogs" —

A. Adjective still goes after noun
B. Adjective goes before noun
C. Depends on the sentence

Does this change when the noun is plural?

> **Answer: partial/C-leaning.** "Depends on the sentence. (I'll send the
> examples later. Do remind me)" — no examples supplied yet, plural
> sub-question not addressed. Genuinely still open.

**4. Adverb position**

For something like "eat slowly" —

A. VERB + ADVERB
B. ADVERB + VERB
C. Depends on the adverb

> **Answer: B.** "B. Adverb + Verb. E.g. Eat slowly. = Ka'sine cha'bo."

---

## Notes for whoever processes this (Claude A), not a disposition

- **"crumble down" = "be.grua"**: new vocabulary, no existing dictionary
  row for this exact phrase found (checked). This is also AI-003's own
  cited repro sentence (`docs/CLAUDE_B_SESSION_MIGRATION_20260929.md`
  item 2, `"it crumbled down"` → previously `"Ua ka·ma·ko"`, wrong) — if
  added as `"to crumble down"` (or however the 2-word-lemma convention
  scopes it, see `src/lookupEngine.js` `MULTI_WORD_VERB_LEMMAS`), it
  should compose through the now-fixed multi-word-verb-lemma machinery
  automatically; no engine change anticipated, but worth a live
  `translate()` check after the dictionary row lands.
- **"he lays eggs" / "hen lays eggs"**: confirms the exact repro sentence
  AI-003 also cites as already-correct this session (`"he lays eggs"` →
  `"Ua Bitchi·chi·a"`) — native speaker's own rendering
  (`"Ua bitchi chia"`) matches modulo raka-dot/capitalization convention.
  Also gives a new sentence, `"do'o bitchi chi'a"` = "hen lays eggs" (do'o
  = hen/chicken, already-established root) — new vocabulary/sentence, not
  yet in the dictionary.
- **Q1 (quantity word order exception)**: fully answered, A — different
  sentence type (description/exclamation vs. possession) explains the
  NOUN+QUANTITY order in the two cited phrases. No new example sentences
  supplied beyond the two already on file, so the *general* boundary
  rule (which sentence types take which order, beyond these two
  examples) is still not concretely specified — Claude A's call whether
  this is enough to write up as a rule or still needs more data points.
- **Q2 (-rang plural)**: fully answered, A — general rule, any countable
  noun. This is a firmer, more general answer than the standing ruling
  recorded in `docs/CLAUDE_A_RANG_PLURAL_RULING_20260825.md` (status-quo/
  confirmed-only-3-data-points, explicitly NOT ruled productive) — that
  2026-08-25 ruling was written precisely because the evidence at the
  time didn't support generalizing; this new direct answer appears to
  resolve it. Claude A directed to reconcile the two documents (update
  the ruling doc / supersede it citing this answer) rather than leaving
  both standing.
- **Q3 (adjective position in noun phrases)**: still open. Answer
  acknowledges more nuance ("depends on the sentence") but the promised
  examples haven't arrived — needs a follow-up reminder per Thangseng's
  own request, not a new question.
- **Q4 (adverb position)**: fully answered, B — ADVERB before VERB, with
  a worked example (`"Eat slowly."` = `"Ka'sine cha'bo."`, ka'sine=slowly,
  cha'bo=eat imperative). Reads as a genuinely new, generalizable data
  point — Claude A's call whether it clears the bar for a new grammar
  rule (cf. the comitative -ming precedent, RULE-047, built from a
  similarly-sized evidence base).

No dictionary, grammar-rule, or corrections.json edits made by this
(Claude B) session — content-lane, filed for Claude A per standing
governance (`.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` — content-lane changes
require Claude A, an Owner directive, or an explicit one-time exception).
