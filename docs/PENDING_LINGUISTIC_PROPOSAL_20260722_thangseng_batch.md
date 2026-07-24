# PENDING LINGUISTIC PROPOSAL — Thangseng batch (angry/right/quarrel/work/tie-bind/duty/negation-locative/interrogative)
_Logged by Claude B, 2026-07-22. Sourced directly from chat (Project
Owner relayed Thangseng's answers) — NOT implemented. Awaiting Claude A
review per standing integration rule._

## Context
Claude B sent the Project Owner a list of 7 open items surfaced while
testing engine output against recently-imported vocabulary (page
112–115 imports) and one carried-over item from a prior session. The
Project Owner relayed all 7 to Thangseng directly and pasted the answers
back verbatim below each item. Nothing here has touched
`master_dictionary.json`, `corrections.json`, or any grammar rule.

## 1. "angry"
> Yes, ka·o·nang·a is a general purpose word for angry.

Confirms current production value is correct. Thangseng did not
individually confirm or reject `Ka-a chakna amja`, `Ka-a soa`, `bi·ka
so·a`, `hel·hel`, `Ka-chaa` as distinct registers — only confirmed
`ka·o·nang·a` as the general-purpose word. **Open sub-question for
Claude A**: are the other five candidates legitimate distinct-register
synonyms, OCR noise, or duplicates that should be pruned from
`known_dictionary_conflicts.json`? Not resolved by this answer alone.

## 2. "right"
> Jak·ra directional right or right hand. Kra·a means suiting or
> matching. Kakket is truth and right in the sense of being correct.

Three-way sense split confirmed:
- `Jak·ra` = right (direction / right-hand side)
- `kra·a` = suiting/matching (NOT "correct" — a distinct sense from what
  the current `Kakket`-cluster entries assume)
- `Kakket` = truth / correct

This means the current production compiled value for "right" (picked by
`pickPrimary` from three competing entries) and the `Kakket`-cluster
entries reusing the same Garo word for true/genuine/just/actual/rightly
need per-sense splitting into (at minimum) three separate headwords
rather than one collapsed "right" key. Needs Claude A to design the
sense split (e.g. "right (direction)" vs "right (correct)" as distinct
dictionary keys) — not a plumbing fix, real headword restructuring.

## 3. "quarrel"
> Quarrel is jegrika. Bota does not necessarily mean quarrel. It carries
> the meaning of to incite or provoke. I'm coming across the word niria
> for the first time. I don't know about that one.

New primary candidate introduced: **jegrika** (not currently in the
dictionary under any spelling Claude B can find — needs Claude A to
confirm exact raka placement/orthography before entry). `bot·a` is
confirmed **not** a quarrel synonym — it means "to incite/provoke," a
different word that happens to share a cross-reference in the existing
data (`ni·ri·a` cross-referenced as `v:ni-ri-a` on the `bot·a` entry).
`ni·ri·a` is unconfirmed by Thangseng (not recognized). **Action needed
from Claude A**: add "jegrika" as the primary quarrel-verb entry
(pending exact spelling confirmation), and reassess whether `bot·a` and
`ni·ri·a`'s current dictionary entries/cross-references need
correcting — they may currently be mis-tagged as quarrel synonyms.

## 4. "work"
> Daka means 'to do'. Kam can mean work as an activity or it can simply
> mean a job. Daka is a verb. Kam is a noun. Kam ka·a is a verb.

Sense split confirmed:
- `Daka` = "to do" (verb) — general-purpose action verb, not
  work-specific
- `Kam` = "work" as noun (activity or job)
- `Kam ka·a` = "to work" as a verb (compound: Kam + ka·a)
- `ga·a` unconfirmed/not addressed by Thangseng — status unclear

This resolves the "work" 4-way conflict as **not actually a conflict**
— these are different parts of speech for related-but-distinct English
glosses ("work" the noun vs "to work" the verb vs "to do" a different
verb entirely). Needs Claude A to split the compiled "work"/"to work"
keys accordingly rather than treating this as one word to pick a winner
from.

## 5. "tied" / "bound" (participial/stative form)
> To tie is ka·a. There is no raka. The reason some things seem missing
> is probably because it is missing. The Garo grammar simply does not
> have them. Instead Garo grammar takes the help of additional words to
> make sense of it. The dog is tied. = Achakko kae donenga. Or Achak kae
> donako man·enga.

**Important, changes prior assumption**: this is not a missing
dictionary entry — Garo has no single-word stative/passive participle
for "tied" at all. The meaning is built periphrastically:
- `Achakko kae donenga` — literally "dog-OBJ tie-having placed/set,"
  i.e. a converb + auxiliary construction
- `Achak kae donako man·enga` — an alternate periphrastic form

This is a real grammar-assembly gap, not a lexicon gap — the engine
currently has no rule for constructing English passive/stative "is
X-ed" as a Garo converb+auxiliary phrase at all. Needs Claude A to
formalize this as a grammar rule (how "X is tied/bound/hung/etc." maps
to `[object]·ko [verb-converb] don·enga` generally, if this pattern
generalizes beyond "tie") before Claude B can implement anything.
**Do not treat as a one-off dictionary fix.**

## 6. "duty"
> Kajina is tax. Kajana would mean to not tie. Example: Achakko kajana.
> = (Let us) not tie the dog. Ka·jana would mean to not do. Example: kam
> ka·jana. = (Let us) Not work/do.

**Resolves the flagged cross-entry conflict, and reveals it as worse
than a duplicate**: `Kajina` and `Kajana` are NOT variant spellings of
the same word — they are two completely unrelated words that collided
by coincidence:
- `Kajina` = tax
- `Kajana` = negative form of "to tie" (kae + jana)
- `Ka·jana` = negative form of "to do" (separately, homophone-adjacent
  to Kajana without the raka)

The two existing "duty" entries in `master_dictionary.json`
(`"Kajana, Kajina"` and `"Kajina, Kajana"`) are both wrong as currently
written — "duty/tax" should resolve to `Kajina` alone, not a
comma-joined pair that includes an unrelated negated verb. Needs Claude
A to correct both entries (not a hygiene/reordering question — an
actual wrong-word bug Claude B should not touch without Claude A's
review given the negation-verb entanglement). Also directly relevant to
Claude D governance / OCR ingestion: this is exactly the kind of
raka-sensitive homonymy collision the "third OCR schema" note flagged as
a growing risk.

## 7. RC-CANDIDATE-017 (negation + locative predicates) — RESOLVED
> Yes, negation does survive with a locative predicate because the
> locative suffix is used with the noun, whereas the negative is used
> with the verb. Example. The book is not on the table. = Ki·tap
> tableo ong·ja/ dongja. Note the the locative o is with the noun
> table (tableo). The negative ja is with the verb (ong·ja/dongja).

Confirms: locative marker `·o` attaches to the noun, negative marker
`ja` attaches to the verb — they're independent and don't interact or
compete for the same slot. This resolves the previously-open question
(RC-CANDIDATE-017) that negation was suspected to get "lost" with
locative predicates. Needs Claude A to close RC-CANDIDATE-017 formally
and confirm this generalizes to `ong·ja` vs `dongja` as alternates (both
given, unclear if free variation or contextual).

## Bonus — interrogative `-ma`, relevant to open RC-CANDIDATE-020/021
> The interrogative ma is always with the the verb. It is placed at the
> very last. Example: cha·genma? = Will (you) eat?; Cha·jawama? = Will
> (you) not eat?

New data beyond the single prior WhatsApp data point
(`docs/PENDING_LINGUISTIC_PROPOSAL_20260717_future_interrogative.md`):
confirms `-ma` is always verb-final, and gives the first confirmed
**negative**-future-interrogative form (`cha·jawama?`), stacking `jawa`
(negative future) + `ma` (interrogative). Still only future-tense
examples — present/past interrogative and object-present interrogative
forms remain unconfirmed. Feeds directly into RC-CANDIDATE-020/021,
still not implemented.

## Project Owner directive to Claude A (relay, not a linguistic finding)
Verbatim from the Project Owner: **do not overwrite these words, and do
not enter any duplicate words which already exist in the dictionary —
it's filling up the Master dict with new vocab.** Flagging for Claude A
directly since this is a standing-practice directive, not tied to one
specific entry above.

## Status
**REVIEWED by Claude A, 2026-07-22.** Disposition per item, full
determinations in `docs/THANGSENG_NATIVE_VALIDATION.md`
NV-027 through NV-032 and `docs/GRAMMAR_RULE_CATALOGUE.md`
RULE-039/040/041:

| Item | Disposition |
|---|---|
| 1. angry | Confirmed, no change. Register cluster still open — NV-027. |
| 2. right | 3-way split confirmed — RULE-040. **Awaiting Claude B**: split compiled key into 3 headwords. |
| 3. quarrel | `bot·a` corrected (`master_dictionary.json` #5730). `jegrika` NOT added — orthography unconfirmed, NV-028. |
| 4. work | Split confirmed, resolved as not-a-conflict — RULE-041. **Awaiting Claude B**: split compiled key. `ga·a` still unconfirmed. |
| 5. tied/bound | New grammar rule RULE-039, provisional, one-verb only. **Do not implement generally** — NV-029. |
| 6. duty | Wrong-word bug corrected — `master_dictionary.json` #8323/8324/8346 and matching `pending_lexicon.json` provenance records (PL-0001247/1248/1270) both updated to `Kajina`. |
| 7. negation-locative | `RC-CANDIDATE-017` closed (negated-copula form confirmed) — one sub-question (the "under" pseudo-verb) stays open, unrelated to this answer. |
| bonus. `-ma` | Logged as NV-031, still insufficient for implementation. |

`known_dictionary_conflicts.json` unchanged this pass — no entries
resolved cleanly enough to prune yet. `npm test`/`npm run build` clean
after all edits (100/100, 0 fail).

## Item 7 (added 2026-07-24, Claude B) — "chicken" has no standalone dictionary entry; stale "bird":"do·o" entry needs resolving

**Trigger:** Project Owner flagged this as a long-standing gap.

**Already confirmed (NV-025, 2026-07-20):** `do·o` = "chicken" (native,
via Thangseng), superseding the dictionary's current `"bird": "do·o"`
entry. Consistency check: `"chicken coop": "do·ochi·dik"` only parses
as chicken+house if `do·o` = chicken.

**Not yet confirmed / needs your call:**
1. Add `"chicken": "do·o"` as a new standalone entry — this part looks
   like a direct, low-risk application of the existing NV-025 finding.
2. What happens to the existing `"bird": "do·o"` entry — `do·` looks
   like a bird-family root/prefix (crow=Do·ka, hen=Do·bit, duck=Do·gep,
   owl=Do·po) rather than a standalone word for generic "bird." Retire
   the entry, mark it needs-new-word, or something else — your call.

Flagging both together since #1 only makes sense once #2 is decided
(don't want two entries both claiming `do·o` with different glosses
live at the same time).
