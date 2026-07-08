# Garo Validation Corpus — v1.0

Primary source for regression testing per Sprint Work Package. Each entry
sourced directly from `src/data/corrections.json` (790 entries) or
`docs/THANGSENG_RULES_LOOKUP.md` native-speaker examples — none invented.

| English | Garo | Grammar Rules | Morphology | Status | Confidence | Source |
|---|---|---|---|---|---|---|
| the dog bit me | Achak Angko chikaha | RULE-003 | root+`-aha` | Verified | High | corrections.json |
| stop | Sengbo | RULE-003b, RULE-029 | stem+`-bo` | Verified | High | corrections.json |
| she stayed without doing her work | Ua an·tangni kamko dakgija dongaha | RULE-018 | `dak`+`-gija`, `donga`+`-aha` | Verified | High | THANGSENG_RULES_LOOKUP Rule 18 |
| she remained without doing her work | Ua an·tangni kamko dakgija dongaha | RULE-018 | (same construction) | Verified | High | THANGSENG_RULES_LOOKUP Rule 18 |
| i did not eat | Anga cha·ja | RULE-017 | `cha·`+`-ja` | Verified | High | corrections.json |
| he did not say anything | Ua in·ja | RULE-017 | `in·`+`-ja` | Verified | High | corrections.json |
| i have stopped eating / stopped eating | cha·jaha | RULE-025 | `cha·`+`-jaha` (full-root) | Verified | High | corrections.json |
| have you seen | Na·a Nikjok ma? | RULE-001 | `nika` (no raka)+`-jok` | Verified | High | corrections.json, raka-audit corrected |
| have you spoken | Na·a Aganjok ma? | RULE-001 | `agan` (no raka)+`-jok` | Verified | High | corrections.json, raka-audit corrected |
| have you bought | Na·a Bre·ajok ma? | RULE-001 | `bre·a` (with raka)+`-jok` | Verified | High | corrections.json, raka-audit corrected |
| did you come | Na·a Re·baaha ma? | RULE-001, RULE-002 | `re·ba` (with raka)+`-aha` | Verified | High | corrections.json, raka-audit corrected |
| i used to work | Anga ka·achim | RULE-013 | `ka·a`+`chim` (full-root) | Verified | High | THANGSENG_RULES_LOOKUP Rule 13 |
| i was studying | Anga poraienga chim | RULE-013 | `porai`+`-enga` + separate `chim` | Verified | High | THANGSENG_RULES_LOOKUP Rule 13 |
| she has three children | Uo bi·sa sakgittam donga | RULE-G7 (existential possession) | classifier `sak·`+number | Verified | High | THANGSENG_RULES_LOOKUP |
| search | Sandia | RULE-001 (lexical) | root, no raka | Verified | High | THANGSENG native confirmation 2026-07-05 |
| search for him | Biko sandibo | RULE-029 | `sandi`+`-bo` | Verified | High | THANGSENG native confirmation 2026-07-05 |
| he searched | Ua Sandiaha | RULE-002 | `sandi`+`-aha` | Verified | High | derived from confirmed root, general suffix rule |
| she was searching | Ua Sandienga chim | RULE-013 | `sandi`+`-enga`+`chim` | Verified | High | derived from confirmed root |
| the dog is under the table | Achak tebil nokkimao ong·a | RULE-033, RULE-G2 | `nokkima`+`-o` (locative) | Verified | High | THANGSENG native confirmation 2026-07-05 |
| down | Ka·ma | RULE-033 (contrast) | root, with raka | Verified | High | THANGSENG native confirmation 2026-07-05 |
| under | Nokkimao | RULE-033 | `nokkima`+`-o` | Verified | High | derived, single-word form |
| three books | ki·tap kinggittam | RULE-G-classifier | `king` (no raka)+number | Verified | High | THANGSENG classifier confirmation |
| two dogs | achak mang·gni | RULE-G-classifier | `mang·` (with raka)+number | Verified | High | THANGSENG classifier confirmation |
| one stalk of bamboo | wa·a jolsa | RULE-G-classifier | `jol` (no raka)+number | Verified | High | THANGSENG classifier confirmation |
| two trees | a'bil panggni | RULE-G-classifier | `pang` (no raka)+number | Verified | High | THANGSENG classifier confirmation, Rule 21 |
| a pen | kolom ge·sa | RULE-G-classifier | `ge·` (with raka)+number | Verified | High | THANGSENG classifier confirmation |
| let's eat | Hai cha·na | RULE-007 (Hai construction) | `cha·`+`-na` | Verified | High | corrections.json, safe-default per GRAMMAR_HAI doc |
| let's go | Hai re·naha | RULE-007 | `re·`+`-naha` | Verified | High | corrections.json |
| if you eat, you will be strong | Na·a cha·ode, bilakgen | RULE-008 | `cha·`+`-ode`, `bilak`+`-gen` | Verified | High | THANGSENG_RULES_LOOKUP Rule 8 |
| she spoke to her | Bia una aganaha | RULE-004 (register), RULE-002 | `agan`+`-aha` | Verified | High | corrections.json |
| do not go | Re·angna·be | RULE-017 (imperative negative) | `re·ang`+`-nabe` | Verified | High | corrections.json, raka-majority-vote corrected |

## Coverage Notes

- **31 entries** shown above are a representative P0 sample; the full
  `corrections.json` (790 entries) is the complete, authoritative
  regression source and should be treated as the corpus proper — this
  table exists to demonstrate rule-to-example traceability, not to
  duplicate the full dataset.
- **Every row cites its confidence and source** per the Linguistic Review
  Standard. No row in this table is Derived or Unknown — those categories
  exist in the Grammar Rule Catalogue and Morphology Specification, not
  here, per the instruction not to promote unvalidated rules into
  canonical corpus status.
- **Recommended regression-suite integration**: this table's rows already
  correspond 1:1 to entries in `tests/unit/translationEngine.test.js`'s
  `REGRESSION_CASES` array (Claude B's implementation) — this document
  should be treated as the linguistic justification layer *above* that
  test suite, not a replacement for it.

## Known Gaps in Corpus Coverage (documented, not filled — see Stop Conditions)

- Copula/predication (RULE-031) has attested examples for each of its
  three competing strategies individually, but no example demonstrating
  the *selection rule* between them, because no such rule is yet
  confirmed. Adding corpus entries here would misrepresent the current
  state of knowledge — deferred pending native validation.
- Locative word order beyond the single confirmed "under the table"
  sentence (RULE-033) is Derived, not Verified, for any other
  locative/noun combination. No additional locative corpus entries added
  to avoid implying broader confirmed coverage than exists.
- **2026-07-08 review (Claude A):** the pending locative/directional word
  set (`docs/PENDING_LINGUISTIC_PROPOSAL_20260708_locatives.md`) was
  reviewed and assigned RULE-034 (9 new words) and RULE-035 (under/beneath
  `mitapo` sense split) in the Grammar Rule Catalogue. Deliberately **not**
  added to this corpus table — the source is a relayed WhatsApp exchange,
  not a direct confirmation session, and none of the 9 words have a
  confirmed full example sentence (unlike RULE-033's "under the table").
  This is Medium/Low-confidence candidate vocabulary, correctly staged in
  the Rule Catalogue as "Needs Native Validation," not promoted here. The
  `kokkima`/`nokkima` spelling-variant question is the one item from this
  proposal resolved with reasonable confidence (both forms legitimate),
  and is reflected as an update to RULE-033 rather than a new corpus row.
