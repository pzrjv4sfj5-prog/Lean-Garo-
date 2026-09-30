# Thangseng Relay Answers — 2026-09-30 (received via Project Owner, raw)

Raw answers pasted directly into a Claude B session by the Project Owner
(WhatsApp screenshots/text, Thangseng, dated 28-29/9/2026). NOT YET
PROCESSED into master_dictionary.json/docs/grammar_rules_structured — this
is a content-lane task (Claude A), filed here verbatim per standing
practice (cf. docs/THANGSENG_RELAY_QUESTION_*.md /
docs/THANGSENG_NATIVE_VALIDATION.md conventions) rather than acted on by
Claude B directly.

## Raw text, as received

> [12:10 am, 29/9/2026] Thangseng: crumble down
> be.grua
>
> [12:10 am, 29/9/2026] Thangseng: he lays eggs
> Ua bitchi chia = he lays eggs
> do'o bitchi chi'a = hen lays eggs
>
> [12:33 am, 29/9/2026] Thangseng (answering the 3-question relay batch,
> numbered 1/2/3 in the original ask):
> 1. Yes. different sentence type will use different order
> 2. Yes. -rang can be added to any countable nouns to make it plural
> 3. Depends on the sentence. (I'll send the examples later. Do remind me)
> 4. B. Adverb + Verb. E.g. Eat slowly. = Ka'sine cha'bo.

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
- **Q1 (quantity word order exception)**: answered "A" — different
  sentence type (description/exclamation vs. possession) explains the
  NOUN+QUANTITY order in `Wak be·en mit·am bang·a` / `Man·derang bang·e
  re·baa`. This is a yes/no answer to the exact multiple-choice question
  as posed in the prior migration doc — no new example sentences
  supplied, so the *general* QUANTITY+NOUN vs. NOUN+QUANTITY boundary
  rule (which sentence types take which order) is still not concretely
  specified beyond these two examples.
- **Q2 (-rang plural)**: answered "A" — general rule, any countable noun.
  This is a firmer, more general answer than the standing ruling recorded
  in `docs/CLAUDE_A_RANG_PLURAL_RULING_20260825.md` (status-quo/
  confirmed-only-3-data-points, explicitly NOT ruled productive) — Claude
  A directed to review that ruling doc against this new answer before
  updating either way, not silently overridden here.
- **Q3 (adjective/adverb position)**: only a partial answer ("depends on
  the sentence") — Thangseng explicitly says examples are still to come,
  and asks to be reminded. Still open pending those examples.
- **Item 4 ("B. Adverb + Verb")**: reads as a direct answer to a 4th
  question not explicitly restated in the summary above but implied by
  context (adjective/adverb *position* relative to the verb) — answer is
  ADVERB before VERB, with a worked example: `"Eat slowly."` =
  `"Ka'sine cha'bo."` (ka'sine = slowly, cha'bo = eat, imperative). This
  reads as a genuinely new, generalizable data point (adverb-verb word
  order) distinct from Q3's still-open adjective-position question —
  Claude A's call whether it clears the bar for a new grammar rule.

No dictionary, grammar-rule, or corrections.json edits made by this
(Claude B) session — content-lane, filed for Claude A per standing
governance (`.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` — content-lane changes
require Claude A, an Owner directive, or an explicit one-time exception).
