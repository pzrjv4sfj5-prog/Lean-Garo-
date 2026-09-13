# Claude D — Fresh Forensic Evidence Package (Refresh)

**Freshness confirmation:** none of the previous package's numbers were reused blind. Re-fetched `origin/main`, re-hashed, and independently regenerated both populations from scratch this run. Result: **identical counts to the previous package** (1,914 / 1,585 clusters, 689 generated-counting hits) — because `master_dictionary.json`'s own hash is unchanged since that package was built, even though `origin/main`'s HEAD moved. Stated explicitly per instruction, not assumed.

## Repository State

| Field | Value |
|---|---|
| `origin/main` HEAD | `b5c4c7dba7a6cbecb508feca01aa4f77ca71e8bd` |
| Commit landed since last package | `b5c4c7d` — "Draft Thangseng relay 20260911: 10 verified-ties + fever/suffer, not yet sent" (touches `.ai/WORKSTATE.yaml` and a new `docs/THANGSENG_RELAY_QUESTION_20260911.md` only — **not** `master_dictionary.json`) |
| `master_dictionary.json` hash (`git hash-object`) | `12e87c9a2e04f4cfae33d4888b66975232cdda82` — **same as the immediately-prior evidence package** |
| Record count | 10,180 |
| Audit timestamp | 2026-09-11T15:36:36Z |
| Scripts used | `audit/segregation/build_refresh.py` (this run, fresh) → `CLAUDE_A_EVIDENCE_FULL.csv`, `refresh_stats.json` |

Worth flagging on its own: the new commit is Claude A's own draft relay-question doc listing "10 verified-ties + fever/suffer" — that's a live, in-progress Claude A work product sitting in the same repo this evidence package is being generated from. Not opened or incorporated here (out of scope, would risk duplicating or contradicting in-progress adjudication) — noting its existence only so Claude A doesn't lose track of it if this package is read out of order.

## Population Totals

| | Clusters | Records |
|---|---|---|
| SHARED_GARO | 1,914 | 5,445 |
| SAME_ENGLISH_DIFF_GARO | 1,585 | 3,931 |
| **Total evidence rows (`CLAUDE_A_EVIDENCE_FULL.csv`)** | | **9,376** |

## Generated Counting Findings

689 records match the classifier+numeral fused pattern (English number word + Garo classifier-unit substring + Garo numeral-suffix substring), spanning 30+ noun roots.

Status breakdown:
- `verified/high`: 547
- `explicitly superseded`: 126
- `unverified/OCR`: 16

**563 of the 689 are NOT explicitly superseded** — i.e. currently active/live by confidence tag, not flagged as historical. This is the P2 population below.

## Superseded/Verified Coexistence Findings

**881 clusters** (across both populations) contain at least one `verified_high` record *and* at least one `superseded` record for what the clustering identifies as the same underlying key. Representative:

- `hope` (SAME_ENGLISH_DIFF_GARO): `Ka·donga` appears twice as `superseded` (idx 65, 8547) alongside `a·sa`/`ka·donga`/`mik·sok·a`/`ka·dongani` all `verified_high`.
- `one person` (SAME_ENGLISH_DIFF_GARO): `sa mande·sa` (`superseded`) vs `mande saksa` (`verified_high`) — a generated-counting pair where one candidate has already been downgraded and the other hasn't.
- `papaya`: three `superseded` spellings (`Modu`, `mo·du`, `pe·pe`) alongside one `verified_high` (`Modupol`) — clean example of the superseded population correctly narrowing to one active form, included for contrast (not every coexistence cluster is unresolved-looking).

Separately: **68 English keys carry 2+ `verified_high` candidates simultaneously** (P0 below) — this is the highest-severity coexistence pattern, since neither candidate is downgraded.

## POS / Orthography Findings

- **117 shared-Garo clusters** show a crude part-of-speech signature conflict (an infinitive-style gloss, `"to ___"`, alongside a bare single-word gloss sharing the same Garo form) — e.g. Garo `kadonga` (15 total senses, mixing `hope`-type nouns with verb-style glosses elsewhere in the same cluster), `nia`, `kala`, `chadenga`, `grapa`, `brea`, `pala`. This is a crude heuristic (string-prefix match on `"to "`), not a grammatical parse — flagged as a signal, not a finding of fact.
- **179 Garo space-variant groups** (same string with/without internal spacing), **175 Garo case-variant groups**, **46 strings mixing interpunct (`·`) and period (`.`)** in one value. None normalized.

---

## CLAUDE A HANDOFF

Priority order as specified — evidence only, no verdicts, `MULTIPLE CANDIDATES` not `INCORRECT CANDIDATE` throughout.

### P0 — Multiple VERIFIED/HIGH candidates, same English key (68 clusters)
Highest severity: two-or-more fully-trusted candidates compete with nothing downgraded to break the tie. Examples: `orange` (4 verified_high: `Narang`, `ko·mil·a`, `na·rang`, `a·mnk`), `hope` (4), `monkey` (4), `walk` (2: `Re·a`/`re·am·a`), `listen` (4), `son` (3), `grandfather` (3), `friend` (4, one entry `Ripsak / Ripeng` itself contains two forms in one field). Full list: `CLAUDE_A_EVIDENCE_FULL.csv`, filter `cluster_type=SAME_ENGLISH_DIFF_GARO` and cross-reference confidence column for `verified_high` count ≥2 per `cluster_key`.

### P1 — Same-English/diff-Garo clusters with verified_high conflicting against other confidence levels (783 clusters)
One trusted candidate, one-or-more less-trusted alternatives still present. Examples: `one book` (`ki·tap king·sa` verified_high vs `sa kitab·sa` superseded), `one coin`, `watermelon`, `sugar cane`. Lower severity than P0 since one candidate already outranks the others by trust tag — but the untrusted alternatives are still live records, not removed.

### P2 — Generated-counting records that are active, not superseded (563 records)
The bulk of the 689-record generated-counting population minus the 126 already marked superseded. These are structurally identical to the documented output of `garo_number_classifier_engine_machine_ready.json`'s formula (noun + classifier + numeral suffix) but currently carry `verified_high` (547 of them) or `unverified`/`ocr_flagged` (16) status — i.e., treated as independently-asserted facts rather than rule output. See prior evidence package (`CLAUDE_A_EVIDENCE_PACKAGE.md`) for the `ranggni`/`chikgni` placeholder-pattern subset already identified within this group.

### P3 — Superseded + verified/high coexistence (881 clusters)
See Superseded/Verified Findings above. Distinguish from P0/P1: here at least one candidate in the cluster IS already downgraded, so the open question is usually narrower (confirm the downgrade is complete/correct) rather than a live tie.

### P4 — POS conflicts (117 clusters, heuristic-flagged)
See POS/Orthography Findings above. Weakest-confidence category in this package — flagged by a crude string heuristic (`"to "` prefix), needs linguistic eyes to confirm any of these are real grammatical-function conflicts rather than heuristic noise.

### P5 — Orthographic/runtime-sensitive variants
179 spacing groups, 175 case groups, 46 interpunct/period-mixed strings. Not itemized in full here (all in the CSV's raw `garo` column, cross-referenceable) — lower priority per the directive's own ordering, included for completeness.

### P6 — Large unverified/OCR-only backlog (statistics only, not itemized)
| Confidence | Count |
|---|---|
| unverified | 6,163 |
| verified_high | 2,059 |
| superseded | 1,380 |
| missing | 298 |
| ocr_flagged | 267 |
| open | 8 |
| rejected | 5 |

Per instruction, this backlog is reported as statistics only — Claude A is not expected to process the 6,163-record unverified pool record-by-record from this package; it's context for scale, not a work list.

---

## Files in this refresh

- `CLAUDE_A_EVIDENCE_FULL.csv` — regenerated, 9,376 rows, same schema as before (`cluster_type, cluster_key, cluster_size, idx, english, garo, confidence, notes`).
- `refresh_stats.json` — machine-readable version of every count in this report, plus sampled examples for P0–P4.
- This document.

No repository file was modified, suspended, or deleted in producing this refresh.
