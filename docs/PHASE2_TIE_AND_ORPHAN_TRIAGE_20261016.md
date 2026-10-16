# Phase 2 triage: verified ties (D3) and orphan rule examples
**Date:** 2026-10-16 | Claude A | Read-only analysis. No dictionary or rule content changed. Classifications come from each row's own `notes` field; anything beyond that is labelled as a question.

## A. Verified ties (20 keys in `docs/PICKPRIMARY_VERIFIED_TIES.md`)
### A1. Tie is intentional, with a citation on file (12). No action beyond documenting.
| Key | Evidence in notes |
|---|---|
| able | man·a / ama: PO directive 2026-09-08 plus NV-117 |
| alone | ak·sa / saksan: NV-151, synonymous |
| he | Ua / Bia: native-confirmed synonyms (NV-071 2026-08-09; PO relay 2026-09-19). Runtime inconsistency is R8 |
| hoe | git·chi / ko·dal: NV-080, genuine dual-valid pair |
| where (relative pronoun) | jeon / jeo: NV-054, free variants |
| i can eat / i can go / i can work | ama / man·a: NV-117 |
| she can cook | ama / man·a: NV-162 |
| big red house | three renderings: NV-110 |
| the market is nearby | three forms: NV-164 PO ruling, coexisting free variants |
| leaf | bi·jak / bol·bi·jak: NV-145, genuine alternate |

### A2. Tagged `variant/VERIFIED/HIGH` but no citation text in the row (5). Needs a citation backfill, or native re-confirmation.
agree (kin·a·chak·a, ku·chak·a, ku·ra·chak·a), brave (pa·a, sang·chak·a), fever (ding·du·a, han·ding·a, jom·a), greedy (mat·u·a, mik·bok·a, mik·ni·a), horn (a·du·ri, sing·ga).
Question for Thangseng per key: are these free synonyms, or do they differ in sense/register?

### A3. The "tie" may really be separate senses (3). Needs a sense-split decision.
- **last:** bon·kamgipa (final in sequence, e.g. "last page") and ja·mangipa ("last one / last person") are cited in NV-082 as **distinct senses**, so they are not a tie. `bai·a` and `ses` are flagged 2026-09-24 as having unclear provenance.
- **outside:** A·pal is the wider general sense (NV-089, with a caveat: A·pal + re·a idiomatically means something narrower). `a'palo` was confirmed from "the book is outside the house" (2026-07-25). Whether `a'palo` is a locative form of A·pal is **a question, not established**. `bai·re` and `ha·gat·e` have no citation text.
- **how:** `Maikai` (NV-122: "How, in order that, so that"; also purpose sense, not yet sentence-cited) vs `maidake` (NV-095). Appears to be different senses; confirm with native.

## B. The 23 orphan rule examples (in no entry layer)
### B1. False orphans caused by the audit script's extractor (8). No linguistic work needed.
- RULE-050 ×3: slash pairs (`X ama. / X man·a.`) are parsed as one string. Both halves exist as verified rows (NV-117).
- RULE-028 `cha·manaha`: the row exists, verified_high. The leading "vs." breaks the match.
- RULE-027 `, native reply confirmed as re·angja`, RULE-030 `go to the shop, nokchi re·anggen`, RULE-030 `, Antichi re·angbo`, RULE-038 `, chu rong bonga`: sentence fragments captured with surrounding prose.
- Proposed fix (script only): split on ` / `, strip leading `vs.`/commas, and skip prose fragments. Orphan count would then be 15.

### B2. Real orphans (15). Each needs a decision: add an entry (with citation), or accept as rule-only example.
| Rule | Example | Note |
|---|---|---|
| RULE-007 | Hai cha·na = let's eat | Runtime/correction gives `Hai cha·ha`, and the rule form is in the conformance baseline as a mismatch. Needs a ruling on which is right. |
| RULE-027 | na·a mijalo anti re·angama? = did you go to the market yesterday? | |
| RULE-030 | Anga re'angjaenga = I am not going | |
| RULE-030 | Anga antichi re'angjaenga = I am not going to the market | Antichi/Bajalchi variant held |
| RULE-033, RULE-G2 | Achak tebil nokkimao ong·a = the dog is under the table | nokkimao/kokkimao held; same example in two rules |
| RULE-036 | Da·mo, anga mi cha·kuna = Wait, let me eat. | |
| RULE-038 | manderang saksa = one person | Compare R2 runtime `mande saksa` |
| RULE-038 / RULE-G-classifier | chu rong sa / chu rongsa = one alcohol | Same example, two spellings |
| RULE-046 | Na·a Bajal Re·angama? = Did you go to market? | |
| RULE-048 | Na·a badita cha·gimin? = How much did you eat? | |
| RULE-051 | bang·a chattrorang = many students | `-rang` productive plural (2026-09-30) |
| RULE-G-classifier | a'bil panggni = two trees | a'bil/Bol held; notes mention `Bol panggni` |
| RULE-G7 | Uo bi·sa sakgittam donga = she has three children | Uo/Ua held |

Recommendation: the examples are the rules' own evidence, so before adding entries, check whether each carries a relay citation in its rule file. Where it does, add the row with that citation. Where it does not, leave it orphaned and list it for the next Thangseng relay.

## C. Suggested order
1. Fix the extractor (B1), regenerate the report and baseline.
2. Project Owner decisions: RULE-007 `cha·na` vs `cha·ha`; the A3 sense splits.
3. Thangseng relay batch: A2 (5 keys), A3 (3 keys), plus uncited B2 items.
