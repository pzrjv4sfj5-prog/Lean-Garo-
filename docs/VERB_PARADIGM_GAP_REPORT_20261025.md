# Verb paradigm gap report — Claude A, 2026-10-25

Probe: `scripts/audit-verb-paradigms.mjs` (report-only). 56 common verbs x 23 English forms (1,288 live `translate()` calls) at origin `501f812`+. Nothing in this report is a new linguistic claim; it lists what the live engine does and what evidence is missing.

## Reference paradigm (eat) — fully listed, native/Owner-ruled
| Form | Garo | Method |
|---|---|---|
| eat / to eat | Cha·a | correction |
| eating | cha·enga | correction |
| ate | Cha·aha | correction |
| eaten | cha·jok | correction |
| will eat (i will eat rice) | Anga miko Cha·gen | grammar-assembly |
| do not eat | cha·nabe | correction |
| let us eat | Hai cha·na | correction |
| did you eat? / will you eat? | Na·a Cha·ahama? / Na·a cha·genma? | correction |

Eat is complete only because each form is a hand-pinned `corrections` row. Most other verbs are not.

## Coverage by form (of 56 verbs)
Clean (grammar/correction/imperative output with a Garo verb): present, future, negative, negative past, negative future, he-form, polar question, imperative, negative imperative.
Gaps:

| Form | Verbs affected | Symptom |
|---|---|---|
| English `-ing` word alone (`taking`, `dancing`, `writing`, `dying`, `making`, `closing`, `swimming`) | 7 | passthrough, English returned unchanged |
| `hitting` | 1 | fuzzy-matches `sitting` -> `asongenga` (wrong) |
| English past participle alone (`given taken spoken known sung danced written taught died lived made forgotten fought swum`) | 14 | passthrough |
| `brought` | 1 | fuzzy-matches `drought` -> `Ran·kari` (wrong) |
| `i am Xing` / `they are Xing` / `are you Xing?` for the same 7-8 verbs | 8 | `[UNKNOWN]ko` — English lemmatizer cannot map -ing form to the base |
| `i Xed` irregulars (`took knew sang wrote taught brought broke fought swam`) | 10 | `[UNKNOWN]ko` |
| `i have Xed` | 15 | `Ango [UNKNOWN] donga` |
| `let us X` (hortative) | 51 of 55 | `[UNKNOWN] Chingna <verb>`; only the 4 pinned verbs give `Hai X-na` although RULE-007 is verified/high |
| `i cannot X` | 55 of 55 | `[UNKNOWN]ko` — no negative-ability construction |
| `can you X?` | 55 of 55 | modal silently dropped (`Na·a cha·a`); ruled forms are `man·genma` / `Anga asongna man·genma?` |
| `i know` | 1 | `Anga uia.` — stray period, unverified, conflicts with verified `know`=`hai·a` |

## Root causes by owner
Claude B (engine, English side): irregular/-ing/participle lemma table missing the verbs above, consonant-doubling and e-drop patterns (`hitting`, `swimming`, `making`, `dying`), fuzzy match must not override a lemma miss, productive `Hai + -na` hortative (RULE-007, verified/high), modal `can you X?` and `i cannot X` assembly. Handoff-worthy; no linguistic evidence required except the two items below.
Claude A (data): no row can be added for the missing Garo forms without evidence — deriving them from a stem rule would be generalizing (standing rule 4).

## Evidence needed (not closable by Claude A)
1. Negative ability (`i cannot eat`): the ruled affirmative is `man·genma`/`man·genba`; the negative is unruled. Thangseng question.
2. Whether regular -enga/-aha/-jok derivations hold for vowel-final or raka stems (e.g. writing `Sea`, dancing `Chroka`, swimming `Jroa`, dying `si·a`, making `Taria`). Ask Thangseng to confirm one progressive + past + participle per verb class rather than 50 verbs.
3. Present-progressive object marker: `Anga mi cha·enga` (corrections) vs `Anga miko cha·gen` / `Anga miko Cha·a` — `mi` vs `miko` inconsistent across tenses. Owner ruling on whether -ko drops in progressive/past.
4. `know`: `hai·a` (verified) vs `Anga uia` (the "i understand" family). Decide whether `i know` = `Anga hai·a`; then fix the stale unverified `i know` row.
5. Sixteen verbs (`die, hit, sing, break, make...`) still have only unverified base rows, so everything built on them is unverified.

## Open items from the 20261025 migration doc: status
All eight remain open; none has new evidence today. 1 (jom·a rows), 2 (greedy tie), 3 (`Why did they sit there?` pin — needs `uana` vs `uano` ruling), 4 (`Shall I sit?`), 5 (`sani`/`whose` — only unverified OCR rows exist), 6 (`uan` generation, `uamangko` non-persons), 7 (Thangseng batch), 8 (Claude B review). Closing any of them without native evidence would violate the evidence-first rule.
