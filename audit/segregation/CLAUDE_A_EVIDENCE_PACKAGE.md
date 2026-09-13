# Claude D → Claude A: Evidence Package (Linguistic Review Backlog)

**From:** Claude D (forensic segregation/audit) · **To:** Claude A (linguistic adjudication)
**Source:** re-audit against `main` HEAD `796e427`, `master_dictionary.json` hash `12e87c9a2e04f4cfae33d4888b66975232cdda82`, 10,180 records.

This is evidence only. **No verdict is offered on any of it** — every cluster below is reported as `MULTIPLE CANDIDATES`, not `INCORRECT CANDIDATE`, per standing methodology. Nothing in the repository was modified to produce this.

---

## What's in this package

Two structurally different populations, both currently classed `LINGUISTIC_REVIEW_REQUIRED`:

| Population | Distinct clusters | Records involved |
|---|---|---|
| **SHARED_GARO** — one Garo form, 2+ distinct English glosses | 1,914 | 5,445 |
| **SAME_ENGLISH_DIFF_GARO** — one English key, 2+ distinct Garo forms | 1,585 | 3,931 |

Full machine-readable listing of all 9,376 rows (every record in both populations, grouped by cluster, sorted largest-first): `CLAUDE_A_EVIDENCE_FULL.csv` — columns `cluster_type, cluster_key, cluster_size, idx, english, garo, confidence, notes`.

Below are the top 20 of each, in-line, since these are the highest-leverage clusters (most competing senses/forms concentrated in one place) and worth a first look before working through the full CSV.

---

## Part 1 — SHARED_GARO: one Garo form, multiple English senses (top 20 by size)

For each, `idx` / English / confidence — reproduced verbatim, no edits.

### `chak·a` — 26 English senses
`4638 endure (unverified)` · `4762 fit (unverified)` · `4973 help (superseded)` · `5720 protect (unverified)` · `5808 refuge (unverified)` · `6218 stand suffering (unverified)` · *(+20 more — see CSV)*
Read as evidence for: a broad-semantic verb root spanning "endure/protect/help/refuge" is a plausible single Garo verb with wide English-gloss coverage — but 26 distinct glosses on one form is also consistent with several unrelated homonyms having been merged under one spelling during ingestion. `MULTIPLE CANDIDATES` — not pre-judged either way.

### `baa` — 17 English senses
`3135 Bear (open)` · `3681 Thin (superseded)` · `3971 birth (unverified)` · `5583 perch (unverified)` · `7318 to blaze (ocr_flagged)` · `7353 To bear (ocr_flagged)` *(+11 more)*
Flag: "Bear" (animal), "Thin", "birth", "perch", "to blaze" look like unrelated senses under one spelling — a strong homonym-collision candidate rather than polysemy, but that determination needs linguistic review, not a mechanical rule.

### `kadonga` — 15 English senses
`65 hope (superseded)` · `2672 the hope (unverified)` · `3359 Hope (verified_high)` · `8295 To hope (ocr_flagged)` · `8297 to have faith (ocr_flagged)` · `8298 to rely on (ocr_flagged)` *(+9 more)*
Reads as coherent polysemy (hope/faith/rely-on cluster around one semantic field) — but includes both `superseded` and `verified_high` tags for essentially the same "hope" sense (idx 65 vs 3359), worth confirming those two are the same fact or genuinely distinct.

### `bama` — 15 English senses
`3158 Bow (verified_high)` · `4077 brood (unverified)` · `5188 lean over (unverified)` · `7246 To yield (unverified)` · `7247 to surrender (unverified)` · `7248 to roost (unverified)` *(+9 more)*

### `kama` — 13 English senses
`363 down (verified_high)` · `3988 blaze (unverified)` · `4105 burn (unverified)` · `8500 To burn (ocr_flagged)` · `8501 to scorch (ocr_flagged)` · `8503 to catch fire (ocr_flagged)` *(+7 more)*
"down" alongside "burn/blaze/scorch" looks like two unrelated homonyms merged — flag for a closer look.

### `aganchaka` — 12 · `donga` — 12 · `guala` — 12 · `sika` — 12 · `gro` — 12

`donga` is worth calling out specifically: 12 senses including `"it exists / it's there"`, `"it is there / it exists"`, `"positive"`, `"belong"`, `"dwell"` — this looks like the existential/copula verb ("to be/exist"), which is expected to carry heavy, legitimate polysemy in most languages. Likely genuine, but flagged per instructions rather than assumed.

### `chikgni` — 12, `ranggni` — 11 *(see Part 3 — these are the generated-counting placeholder pattern, not ordinary polysemy)*

### `rima` — 11 · `chana` — 11 · `gongraka` — 11 · `chakchika` — 11 · `kam` — 10 · `chama` — 10 · `kachipa` — 10 · `nia` — 9

Full detail for all of the above, and the remaining ~1,894 smaller shared-Garo clusters, is in the CSV.

---

## Part 2 — SAME_ENGLISH_DIFF_GARO: one English key, multiple Garo forms (top 20 by size)

### `only` — 8 Garo candidates
`751 ·mangmang / ·san (superseded)` · `5509 ak·sa (unverified)` · `5510 ·pit·chi (unverified)` · `5511 ·sa (unverified)` · `5512 ma·mang (unverified)` · `8533 Kam·kam (superseded)` *(+2 more)*

### `half` — 7 · `very` — 7
`half`: `188 Jatchi (superseded)` · `3340 a·dra (superseded)` · `3341 bon·jang·chi·a (superseded)` · `3342 pak·sa (superseded)` · `7561 Adha (unverified)` · `7562 Brongrik (unverified)` *(+1 more)*

### `hope` — 6, `monkey` — 6, `push` — 6, `strong` — 6, `wait` — 6, `angry` — 6

`hope`: `65 Ka·donga (superseded)` · `3358 a·sa (verified_high)` · `3359 ka·donga (verified_high)` · `3360 mik·sok·a (verified_high)` · `8547 Ka·donga (superseded)` · `9757 ka·dongani (verified_high)` — note idx 65 and 8547 both read `Ka·donga` but carry `superseded`, while idx 3359 carries `verified_high` for the same normalized form — worth confirming whether these are meant to be the same fact at different trust levels (in which case the superseded copies are redundant) or genuinely tracked separately.

### `bear` — 5, `leg` — 5, `last` — 5, `no` — 5, `close` — 5, `throw` — 5, `clean` — 5, `tree` — 5, `small` — 5, `fast` — 5, `answer` — 5

`throw`: `245 Goata / Gal·a (superseded)` · `3686 Gal·a / Goata (verified_high)` · `3687 Goata (verified_high)` · `3688 Gal·a (verified_high)` · `3689 go·a (verified_high)` — four `verified_high` rows for what may be 2-3 actual forms written in different orders/spellings (`Goata / Gal·a` vs `Gal·a / Goata` vs each split into its own row) — flagged as a possible case where one Owner-confirmed "both forms are valid, in either order" note got split into duplicate single-form rows.

Full detail for all of the above, and the remaining ~1,565 smaller same-English clusters, is in the CSV.

---

## Part 3 — A distinct pattern worth separating from ordinary polysemy: `ranggni` / `chikgni`

Unlike the semantic-root clusters above, `rang·gni` (raw string, unmodified) appears **verbatim identical** across completely unrelated nouns: `two books`, `two houses`, `two trees`, `two cars`, `three houses`, `three trees` (idx 1180, 1200, 1201, 1202, 1209, 1210) — all tagged `superseded`. This isn't polysemy (one real word, several senses); it's the same placeholder-looking string (`rang` = a generic classifier + `gni` = "two") attached to nouns that should each have their own noun-specific classifier per `garo_number_classifier_engine_machine_ready.json` (e.g. `mang` for animals, `sak` for people). Read as evidence of early bulk/generated placeholder data that a prior pass already caught and marked `superseded` — flagging for confirmation that all members of this specific cluster are in fact superseded (not just the 6 sampled here), since if any sibling of this cluster is still `verified_high` it would be actively wrong to serve a generic placeholder as a specific noun's counted form.

---

## Cross-reference note

Where a cluster contains both `superseded` and `verified_high` (or other non-superseded) rows for what looks like the same underlying fact (see `hope`, `throw` above), Claude D is not asserting the superseded rows are wrong or redundant — only that the coexistence is visible in the evidence and may be worth a quick confirmation pass alongside the primary polysemy/homonym adjudication.

---

## Files in this package

- `CLAUDE_A_EVIDENCE_FULL.csv` — all 9,376 rows, both populations, full cluster grouping.
- This document — narrative walkthrough of the top 20 clusters in each population, plus the `ranggni` placeholder-pattern flag.

No suspension, deletion, or edit was made anywhere in producing this package.
