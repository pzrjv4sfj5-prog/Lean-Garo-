# Claude D — Full Forensic Analysis of ACTUAL Current Repository

**Role reminder:** Claude D. Deterministic ingestion + forensic segregation/audit only. No adjudication of which Garo form is correct (Claude A). No engineering/runtime fixes (Claude B). Nothing in this report modified, suspended, or deleted anything — `master_dictionary.json` and all rule files were read-only throughout.

---

## 1. ACTUAL REPOSITORY STATE

| Field | Value |
|---|---|
| HEAD commit | `796e427422782b71a6eb00d4972b03d62fd3c93c` |
| Branch | `main` |
| `master_dictionary.json` hash (`git hash-object`) | `12e87c9a2e04f4cfae33d4888b66975232cdda82` |
| Record count | **10,180** |
| Unique English keys (raw, un-normalized) | 8,286 |
| Unique Garo values (raw, un-normalized) | 7,116 |
| Duplicate English keys (raw) | 1,408 keys / 3,302 records involved |
| Duplicate English+Garo pairs (raw) | 9 pairs / 18 records involved |

**Path note:** the directive specifies `data/master_dictionary.json`; the actual file lives at repo root, `master_dictionary.json`. Used the real path.

**`HISTORICAL SNAPSHOT — RE-AUDIT REQUIRED`**
This session's own prior audit (same conversation, ~1 hour earlier) ran against hash `9aff8a3fb1786177ef2902a0a8148c0702029182` at 10,180 records. Current HEAD hash is `12e87c9a2e04f4cfae33d4888b66975232cdda82` — **same record count, different hash**, meaning in-place edits (not additions/deletions) landed between the two runs. Confirmed via `git log`: 7 new commits landed on `origin/main` since the prior shallow clone, most recently `796e427` ("Claude A: update handoff doc to reflect concurrent Claude B fix"). This entire report is a fresh re-audit against the new hash, not a reuse of the prior pass.

---

## 2–12. RE-AUDIT FINDINGS

### A–H category counts (mechanical first pass, `TOTAL_RECORDS = 10,180`)

| Category | Count |
|---|---|
| B — Generated/counting instance (naive detector) | 13 |
| B — Generated/counting instance (**refined targeted sweep**, see §3) | **689** |
| C — Phrase/sentence | 2,257 (1,545 phrase + 712 sentence) |
| D — Malformed English key | 29 |
| E — Duplicate/repeated representation | 1 exact (9 pairs found, but only 1 record wasn't already caught by another category) |
| F — Possible superseded/stale | 1,575 |
| H — Requires linguistic review | 5,673 |
| A — Lexical dictionary candidate | 632 |
| UNRESOLVED | 0 (every record fell into one of the above under this pass's rules) |

`OBSERVED IN D AUDIT`. The naive-vs-refined gap in row 2 is itself a finding — see §3.

### 3. GENERATED COUNTING DATA — highest priority

First pass (word-boundary regex on Garo number *words*) caught only 13 hits, because the counting surface fuses the classifier and the number suffix with no space (`sak` + `sa` → `saksa`), which defeats a `\b...\b` match. A second, targeted sweep (substring match for any of the 16 classifier units — `sak, mang, rong, ge, bol, dam, dot, jol, king, kg, litre, pang, plate, roa, se, akka` — co-occurring with any Garo number-suffix substring, gated on an English number word/digit) found:

**689 records** across **30+ distinct noun roots**, almost all in clean 1-to-20 (sometimes 1-to-12) count sequences: `apple`(40), `dog`(39), `bird`(39), `cat`(39), `fish`(38+29 malformed), `fruits`(21), `pill`(20), `person`(20), `book`(20), `tree`(20), `pens`(20), `mountain`(20), `village`(20), `banana`(20), `car`(20), `teacher`(20), `student`(20), `motorcycle`(20), `train`(20), `airplane`(20), `female student`(20), `male student`(20), `grains of rice`(19), `plates of rice`(19), and others.

Confidence breakdown of these 689: `verified_high` 547, `superseded` 126, `unverified` 16.

Cross-checked against `data/garo_number_classifier_engine_machine_ready.json`: its `worked_examples` block contains `1 student → chatro sak sa`, `41 students → Chattro saksotbri sa`, matching the master dictionary's `student`/`Chattro` cluster shape exactly (same classifier `sak`, same numeral-suffix table). Its `classifier_table` explicitly lists `student→chatro`, `teacher→skigipa`, and 8 other Human/People nouns using the identical `noun + sak + number` formula, all of which also appear as 20-row counted clusters in `master_dictionary.json`.

`OBSERVED IN D AUDIT`: the structural match between these 689 records and the classifier engine's own documented formula is exact and repeats across dozens of nouns. This is strong *structural* evidence they are rule outputs, not independently-asserted lexical facts.
`LIKELY GENERATED COUNTING INSTANCE` — not `WRONG Garo`. No Garo form here is asserted incorrect.

### 4. MALFORMED ENGLISH KEYS

**29 records** matched the `<irregular-noun>+"s"` malformed-plural pattern, **100% clustered on `fish`** (`fishs`) — no other irregular noun (`sheep`, `deer`, `people`, `children`, etc.) shows this pattern. All 29 have a populated Garo counterpart (no orphan malformed keys). Two distinct generation batches are visible: one cluster at idx ~1198–1274 (one→ten), another larger cluster at idx ~9299 onward (one→beyond twenty, reusing the root `na·tok`). The clustering and the fact it's confined to one noun strongly suggests a single templated-generation pass that mishandled `fish`'s irregular plural, rather than scattered manual typos.

A related, broader finding from §8: **232** raw English keys form naive singular/plural pairs where *both* the correct and an "-s"-appended form exist as separate keys (e.g. `seven fish` / `seven fishs`, `four dog` / `four dogs`) — the `fishs` cluster is the irregular-noun subset of this larger pattern; the rest (`dogs`, `trees`, `houses` etc.) are *not* malformed, since regular English pluralization is correct there.

### 5. DUPLICATE vs. SHARED-GARO

- **True duplicates** (identical English + identical Garo): 9 pairs, 18 records.
- **Shared Garo** (one Garo form, multiple distinct English glosses): **1,914 Garo forms**, covering 5,323 English-sense records total. Per directive, **not** auto-flagged as error — this is exactly the population that needs a polysemy-vs-conflict linguistic pass (Claude A), not a mechanical one.
- **Same English, multiple distinct Garo forms**: 1,585 English keys.

`OBSERVED IN D AUDIT` only. No claim about which of these are legitimate polysemy/synonymy vs. genuine conflict vs. generated-data contamination — that determination needs linguistic review per §H above.

### 6. CONFIDENCE / STATUS FORENSICS

| Confidence value | Count |
|---|---|
| unverified | 6,163 |
| verified_high | 2,059 |
| superseded | 1,380 |
| missing | 298 |
| ocr_flagged | 267 |
| open | 8 |
| rejected | 5 |

**Methodology caveat (important, and itself a finding):** a naive regex pass for "notes say SUPERSEDED but confidence field isn't `superseded`" returned 313 hits. Manual spot-check of the first several (idx 16 `orange`, idx 108 `drink`, idx 155 `two`, idx 164–172 the teens cluster) showed the *large majority are false positives* — the notes text narrates *resolved* history ("Un-superseded...", "Was wrongly SUPERSEDED...", "confidence promoted from unverified") rather than describing a live contradiction. Excluding the most obvious resolved-history phrasing drops the count to 202, and manual sampling of that reduced set still finds more resolved-history narration than live contradiction. **Claude D cannot produce a reliable true-contradiction count with regex alone here** — this needs either a more careful NLP pass or manual review, and is flagged as a tooling-improvement item rather than asserted as fact.

Separately, and more mechanically reliable: **149 (english,garo) pairs** carry more than one confidence value across their duplicate rows (i.e., the same fact is asserted at two different trust levels somewhere in the file) — this count doesn't depend on parsing narrative text and is comparatively solid.

### 7. PROVENANCE FORENSICS

- **3,086 records (30.3%) have empty/missing `notes`** — no provenance trail at all.
- OCR-provenance mentions: 289. Native-speaker-provenance mentions (Thangseng/native-confirmed): 1,908. Owner-directive mentions: 1,058. Supersession notes: 1,595.
- **94 groups of suspiciously repeated verbatim notes** (identical note text reused across >3 records). The largest, 278 records sharing one exact note string beginning "SUPERSEDED — corpus-internal audit 2026-08-01 (Claude A)...", is consistent with a known bulk-tagging operation from repo history, not obviously anomalous on its own — flagged per instructions, not asserted as an error.
- **New finding, not requested but surfaced during spot-check:** notes cite specific numeric array indices as stable identifiers (e.g. idx 16's note cites "idx 3479" for the sibling `na·rang` record). Checking the *actual current* array: index 3479 now holds an unrelated record (`Outside`/`bai·re`); the real current index of `na·rang` is **3471**. Index-based citations drift as the array is edited and are **not reliable pointers** at the time of a later audit. This affects any tooling (including Claude A's own citation trail) that trusts in-notes index numbers as stable.

### 8. ENGLISH KEY NORMALIZATION AUDIT

| Pattern | Count |
|---|---|
| Case-variant groups (e.g. `orange`/`Orange`) | 463 |
| Punctuation-variant groups | 559 |
| Whitespace-variant groups | 0 |
| Digit-vs-written-number keys (bare `"1"`,`"2"`...`"10"`,`"0"`) | 17 |
| Naive singular/plural key pairs | 232 |

The 17 digit-form keys are a distinct, already-partially-addressed case: idx 3095 (`"1"`) and 3096 (`"2"`) carry `confidence: superseded` with notes explicitly reading "malformed English key (bare digit string...) Duplicates the proper word-form entry... which remains VERIFIED/HIGH." So this specific sub-pattern already has a documented, in-progress resolution track from an earlier Claude A pass — worth confirming all 17 (not just these two) have been through the same treatment.

No normalization was applied anywhere in this audit — these are counts of *where* normalizing could accidentally merge distinct records, not a normalized dataset.

### 9. GARO ORTHOGRAPHY FORENSICS

| Pattern | Count |
|---|---|
| Interpunct (`·`) and period (`.`) both present in one string | 46 |
| Space-variant groups (same string with/without internal space) | 179 |
| Garo case-variant groups | 175 |
| Repeated punctuation (e.g. `...`) | 3 |
| Unicode lookalike dot characters (•, ‧, ˙, ．) | 0 |
| Trailing/leading whitespace | 0 |

The interpunct+period co-occurrence (46 records) is expected in sentence-final punctuation (`Ka·sapae.` — raka mid-word, period at sentence end) rather than necessarily an error; flagged mechanically per instructions, no linguistic judgment made.

### 10. NUMBER/CLASSIFIER CONTAMINATION BY DOMAIN

| Domain | Lexical-likely | Uncertain/generated-shaped |
|---|---|---|
| Human counting (student/teacher/person/etc.) | 340 | 138 |
| Animal | 153 | 275 |
| Vehicle | 168 | 37 |
| Fruit | 79 | 105 |
| Water/liquid | 158 | 10 |
| Geography (village/mountain/road) | 210 | 48 |
| Measurement (kg/litre) | 2 | 0 |

Animal and fruit domains show the highest proportion of generated-shaped content relative to lexical — consistent with §3's finding that `dog`, `bird`, `cat`, `fish`, `apple` are among the heaviest-populated counted-noun clusters.

### 11. COMPARISON AGAINST MACHINE-READY CONTRACTS

- `data/garo_number_system_machine_ready.json`: all **136/136** of its base number-word records (`"one"→"Sa"` etc.) also exist as flat rows in `master_dictionary.json` — expected, since these are genuinely irreducible lexical facts (the numbers themselves), not generated from anything simpler.
- `data/garo_number_classifier_engine_machine_ready.json`: none of its 12 illustrative `worked_examples` surface strings were found verbatim in `master_dictionary.json` (they're demonstration cases, not meant to be a lookup source) — but its underlying **formula and classifier table match the shape of the 689-record cluster found in §3 exactly**.

**Evidence, not conclusion:** the master dictionary appears to contain a large number of records that are reproducible *outputs* of the rule engine already checked into the repo as a separate, independent artifact. Whether the flat rows should be considered redundant with the rule engine, or serve a distinct purpose (regression fixtures, native-speaker spot-checks of rule output, etc.) is a design decision, not something this audit can settle.

### 12. MACHINE-READABLE SUMMARY

```text
TOTAL_RECORDS                 10180
LEXICAL_CANDIDATES            632   (naive first pass; likely undercounts true irreducible lexical roots — see §5/§11)
GENERATED_INSTANCES           689   (refined targeted sweep, §3 — supersedes the 13 from the naive pass)
PHRASES                       1545
SENTENCES                     712
MALFORMED_KEYS                29
DUPLICATES                    18    (9 true-duplicate pairs)
POSSIBLE_STALE                1575
PROVENANCE_ANOMALIES          462   (149 mechanically-solid multi-confidence pairs + up to 313 regex-flagged, but see §6 reliability caveat)
ORTHOGRAPHY_VARIANTS          403   (grouped: space/case/punctuation/interpunct groups)
LINGUISTIC_REVIEW_REQUIRED    5673  (mostly the 1,914 shared-Garo / 1,585 same-English-diff-Garo populations — NOT pre-judged as errors)
UNRESOLVED                    0
```

---

## SUSPENSION CANDIDATE LIST

**No suspension, deletion, or edit performed. This is evidence for Claude A / Project Owner review only.**

| English | Garo | Reason | Evidence Type | Confidence |
|---|---|---|---|---|
| `fish`-cluster: "one fishs".."twenty fishs" (29 records) | various `mang·`-classifier forms | Malformed irregular plural, systematic templated-generation artifact | Structural pattern (§4) | High — pattern is unambiguous and 100% clustered |
| Bare-digit English keys `"1"`–`"10"`,`"0"` not yet confirmed treated like idx 3095/3096 | various | Possible duplicate representation of word-form number entries | Structural (§8) | Medium — 2 of 17 already confirmed resolved; remainder unverified |
| 689-record classifier+numeral cluster (`Chattro`, `Narang` counted forms, `mang·`-animal counts, etc.) | various | Matches rule-engine formula exactly; candidate for rule-vs-instance representation review | Structural cross-reference against `garo_number_classifier_engine_machine_ready.json` (§3, §11) | High structural match; NOT a claim the Garo is wrong |
| 149 (english,garo) pairs with 2+ confidence states on duplicate rows | various | Same asserted fact carries conflicting trust levels depending which duplicate row a downstream process reads | Mechanical dedup + confidence diff (§6) | High — mechanically verified, no narrative-text ambiguity |
| Notes citing stale array indices (e.g. idx 16 citing "idx 3479" for `na·rang`, actually idx 3471) | `Narang` / `na·rang` | Citation pointer drift — index-based cross-references in `notes` are not stable over time | Direct verification (§7) | High — directly reproduced |
| 313 regex-flagged "SUPERSEDED note vs. non-superseded confidence" records | various | Likely mostly false positives (resolved-history narration); needs a non-regex pass to separate true contradictions from historical narration | Weak — explicitly flagged as unreliable (§6) | Low confidence in the count itself; the *methodology gap* is the real finding |

---

## FINAL FORENSIC ASSESSMENT

**These six scores are Claude D's own composite heuristic for this session, built from the counts above — not an official repository rubric, and not a linguistic judgment.**

| Metric | Score |
|---|---|
| DATA INTEGRITY | 72/100 |
| PROVENANCE QUALITY | 63/100 |
| DICTIONARY HYGIENE | 68/100 |
| GENERATED-DATA CONTAMINATION (100 = clean) | 55/100 |
| ORTHOGRAPHIC DATA HYGIENE | 74/100 |
| SEGREGATION READINESS | 60/100 |
| **OVERALL FORENSIC READINESS** | **65/100** |

Rationale in one line each: integrity is solid at the record level (duplicates/malformed keys are small % of corpus) but provenance has a real 30% missing-notes gap; hygiene issues (case/punctuation/orthography variants) are numerous but mostly cosmetic; generated-data contamination is the standout concern — 6-7% of the corpus is structurally indistinguishable from rule-engine output stored as flat facts; segregation readiness is held back mainly by the 5,673-record linguistic-review backlog, not by tooling (the rule contracts already exist and match cleanly).

---

## TOP 15 FORENSIC FINDINGS

| # | Finding | Priority |
|---|---|---|
| 1 | 689 records structurally match the classifier-engine's own documented rule formula exactly, spread across 30+ nouns in clean count sequences — flat storage may be duplicating a rule the repo already has checked in separately | P1 |
| 2 | `master_dictionary.json` hash changed twice within this single working session (2 different hashes, same 10,180 count) — any snapshot-based audit or handoff doc goes stale fast; re-verify before trusting | P1 |
| 3 | 3,086 records (30%) have zero provenance notes | P1 |
| 4 | 149 (english,garo) pairs have conflicting confidence tags on duplicate rows — a downstream compile step reading the "wrong" duplicate could serve a lower-trust form silently | P1 |
| 5 | Notes cite array indices as if stable; verified at least one is already stale (cited idx 3479, actual idx 3471) — citation trail integrity issue | P1 |
| 6 | 29-record `fishs` malformed-plural cluster, 100% concentrated on one irregular noun — clear templated-generation artifact | P2 |
| 7 | 1,914 Garo forms are shared across multiple English glosses (5,323 records) — large population needing a polysemy-vs-conflict linguistic pass | P2 |
| 8 | 1,585 English keys map to multiple distinct Garo forms | P2 |
| 9 | 463 English-key case-variant groups and 175 Garo case-variant groups — risk of accidental silent merges if any future process normalizes case | P2 |
| 10 | 232 singular/plural key pairs coexist (most are legitimate regular plurals, ~29 are the malformed `fishs` subset) | P2 |
| 11 | The naive "SUPERSEDED note vs. non-superseded confidence" regex check has a high false-positive rate (most of 313 hits are resolved-history narration, not live contradictions) — a tooling gap, not a data-quality finding per se | P2 |
| 12 | 17 bare-digit English keys (`"1"`–`"10"`,`"0"`) exist alongside word-form equivalents; only 2 confirmed as already flagged/superseded by a prior Claude A pass | P2 |
| 13 | 94 groups of suspiciously-identical verbatim notes text (largest: 278 records) — consistent with known bulk-tagging, but worth confirming none of the 278 have since individually diverged in a way the shared note no longer reflects | P3 |
| 14 | 559 English punctuation-variant groups (mostly `?`/no-`?` on the same phrase) | P3 |
| 15 | 46 Garo strings mix interpunct and period in the same string — expected for raka-mid-word + sentence-final-period, but worth a quick visual confirmation none are OCR artifacts | P3 |

---

## HANDOFF TO CLAUDE A

- Adjudicate the 1,914 shared-Garo / 5,323-record polysemy-vs-conflict population (§5, finding #7) — Claude D cannot mechanically distinguish legitimate polysemy from data conflict.
- Adjudicate the 1,585 same-English/multiple-Garo population (§5, finding #8).
- Determine whether the 689-record classifier+numeral cluster (finding #1) should remain as individually-asserted lexical facts, be treated as regression fixtures for the rule engine, or be reduced to root+rule — this is a data-modeling call with linguistic implications (is each counted form independently verified, or inherited from the noun+classifier?).
- Confirm citation validity for notes that reference specific array indices, now that at least one (idx 16 → cited "3479", actual "3471") is confirmed stale — any Claude A citation trail built on index numbers should be re-verified against current positions, not assumed stable.

## HANDOFF TO CLAUDE B

- 149 (english,garo) pairs carry conflicting confidence values across duplicate rows (finding #4) — worth checking whether the compile/`pickPrimary` step already handles this deterministically or could silently serve the lower-trust duplicate.
- The 29-record `fishs` malformed-key cluster (finding #6) — if any runtime lookup path keys off raw English strings, confirm it isn't relying on the malformed `"...fishs"` forms as if they were intentional.
- Notes citing array indices as stable identifiers (finding #5) is a data-modeling anti-pattern worth flagging for any future tooling that parses `notes` programmatically — indices are not stable across commits.

## PROJECT OWNER DECISIONS REQUIRED

- Whether the 689-record generated-counting cluster (and its likely-larger true extent — this sweep was pattern-based, not exhaustive) should be re-architected as root+rule rather than flat instances, and if so, what happens to the individual `confidence`/provenance tags currently attached to each of the 689 rows (they'd need to migrate somewhere, not just be discarded).
- Whether Claude D's audit tooling should be upgraded to do a more reliable (non-regex) pass on confidence/notes contradiction detection (§6), given the demonstrated high false-positive rate — this is a methodology investment decision, not a data decision.
- Whether to formally push `audit/segregation/` to `origin/main` this time so the next session doesn't repeat the "prior audit tooling never landed" problem noted in `.ai/CLAUDE_D_HANDOUT.md` and this repo's own status file.

---

*All outputs (`FULL_FORENSIC_ANALYSIS.json`, `build_full_forensic.py`, this report) are local to this session's container only, per no-push-without-explicit-PAT policy already established.*
