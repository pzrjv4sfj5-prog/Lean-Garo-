# NV-227 (Claude B, 2026-10-29): mechanical audit and fixes

Tool: `scripts/audit-mechanical.mjs` (report-only, wired into `npm run build`). It probes ~1,330 sentences: paradigm table vs engine,
input-variant invariance, irregular English pasts, output hygiene (`[UNKNOWN]`, `··`, stray punctuation, forbidden `re·ba·`), mid-sentence capitals.

## Fixed
| # | Bug | Cause | Fix |
|---|---|---|---|
| 1 | `I like the house` (no final period) = `ang on·a rang`; same for water/book/car, and for you/we/they/he + want/need/like/have/give/take | 177 legacy master rows `<pronoun> <verb> <noun>` (truncated pronoun `ang`/`na·`, `like` = `on·a` = give) matched before the grammar path | rows set `superseded` with a note (data lane: Claude A to review) |
| 2 | `I knew it.` = `Anga [UNKNOWN]ko` (41/76 irregular pasts) | no lemma for English irregular pasts; verb read as an object noun | `src/data/english_irregular_pasts.json`; fallback retries as `did <lemma>` only when the first pass left `[UNKNOWN]`; result `derived: true`, confidence <= 0.6 |
| 3 | `I feed.` = `kan·aha`, `I exceed.` = `bat·aha` | `/ed$/` past detection | `NON_PAST_ED_WORDS` (feed, need, speed, exceed, ...) |
| 4 | `Drink!` = `Ringa`, `Ask!` = `Sing·a`, `Dance!` = `Chroka` (46 of 258 verbs) | RULE-029 guard used VERB_LEMMAS, which lacks common verbs | guard also accepts verbs with a paradigm row; `na`-final citation forms only when equal to the paradigm command; derived unless paradigm-native/pinned |
| 6 | `Please come.` = `Ka·sapae. re·baa` | phrase-map `please` = `Ka·sapae.` leaked its period; verb stayed present | period removed; final verb takes -bo (attested `ka·sapae maikoba aganbo`); `go` = `re·angbo`; negatives only lose the period |
| 7 | stale `verb_paradigms.json` | generated 2026-10-25 | regenerated (`die` = `sia`, new `accompany`/`follow` rows) |

## Open (needs a ruling or is another lane)
- **Mid-sentence capitals: RESOLVED (NV-228, Project Owner ruling 2026-10-29: neutralise).** `translate()` is now a wrapper (`translateRaw` + `neutraliseMidCapitals`).
  Composed results keep the capital on the first word and after sentence-final punctuation only. Kept as written: names / words passed through from the English input
  (`Tridip`, `Tura·chi`, `Klingonko`), `Garo`/`Achik`, all-caps (`TV`), inner capitals (`Grimchi·Saljapang`). Pinned results (exact-phrase / correction / phrase-map /
  loanword-passthrough) are untouched. Audit: 339 -> 1 mid-sentence capitals. About 90 test expectations updated to the lowercase forms.
- **`re·ang·` (go): RESOLVED** (Thangseng native, relay 2026-08-29, re-confirmed by the Project Owner 2026-10-29): no extra dot. `re·a` = go / walk,
  `re·anga` = went, `re·angenga` = going, `re·anggen` = will go, `re·jawa` = will not go, `re·angjawa` = will not be going. Removed from master (non-superseded rows),
  garo_dictionary.json, corrections.json, conversation_patterns.json, purpose_map.json, Phrases.jsx and one test; `Go!` = `Re·angbo`. Also from the same relay: `kata` = run.
- `bring`: RESOLVED, no extra dot (Project Owner 2026-10-29): `ra·baa` / `ra·baaha` / `ra·bagen` / `ra·baja` / `ra·babo`, `know` negative `uija` vs paradigm `hai·ja`, `help!`/`stop!` exact rows vs derived paradigm.
- Claude A: 30 master rows like `you (singular) run (present)` = `na· runa`, `he/she run` = `u runa` (not Garo forms); lemmas with no Garo at all
  (`draw`, `wake`, `become`, `freeze`) are vocabulary gaps.
- `like!` = `namnikbo` and `walk!` = `Re·mambo` are derived and unconfirmed.
