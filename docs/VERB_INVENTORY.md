# Canonical Verb Inventory
_Created 2026-07-08 by Claude A. Pure inventory exercise — every entry
below is transcribed from existing repository evidence
(`docs/THANGSENG_RULES_LOOKUP.md`'s raka audit, `src/data/corrections.json`,
`docs/VALIDATION_CORPUS.md`, `docs/NATIVE_SENTENCE_VALIDATION_AUDIT.md`).
No new linguistic knowledge is asserted here. Where evidence conflicts,
the conflict is documented, not resolved._

## How this was built
Root list taken directly from `THANGSENG_RULES_LOOKUP.md`'s "Confirmed
root raka table" (the one native-audited source in the repository that
already organizes verbs by root), cross-referenced against every matching
entry in `corrections.json` via direct search, plus any appearances in
`VALIDATION_CORPUS.md` and `NATIVE_SENTENCE_VALIDATION_AUDIT.md`.

---

## Part 1 — Verbs with Confirmed Raka Status (from THANGSENG_RULES_LOOKUP.md)

| Root | Meaning | Raka | Attested Forms | Repository Locations | Confidence |
|---|---|---|---|---|---|
| `cha·` | eat | ✅ Yes | cha·a, cha·aha, cha·enga, cha·jok, cha·bo, cha·ja, cha·gen, cha·ode, cha·china, cha·na (infinitive), cha·manaha (completive) | THANGSENG_RULES_LOOKUP.md L31; corrections.json (12+ entries); VALIDATION_CORPUS.md; GRAMMAR_RULE_CATALOGUE.md RULE-026 | **High** — most exhaustively attested verb in the repository |
| `re·` | go | ✅ Yes | re·anga, re·baa (come), re·babo, re·angbo, re·enga, re·jawa, re·angja | THANGSENG_RULES_LOOKUP.md L32; corrections.json | **Medium** — forms well-attested individually, but bare-`re·` vs. `re·ang` selection rule is OPEN (RULE-030, NV-001) |
| `on·` | give (also idiomatic "explain": `talate on·a` lit. "in-speech give") | ✅ Yes | on·a, on·aha | THANGSENG_RULES_LOOKUP.md L33; corrections.json (`explain`, `explained`, `who gave you this`, `prescription`) | **Medium** — forms confirmed; whether "give" and "explain" are one root or the "explain" sense is idiomatic/compositional is unconfirmed |
| `ra·` | bring | ✅ Yes | ra·a, ra·baa (to bring), ra·babo (bring, imperative) | THANGSENG_RULES_LOOKUP.md L34, L291 | **Medium** — few forms attested, no negative/continuous form seen yet |
| `ka·` (love) | love | ✅ Yes | ka·saa, ka·saaha, ka·saenga, ka·saagen | THANGSENG_RULES_LOOKUP.md L35 | **Medium** — note the root is glossed `ka·` but all attested forms actually show `ka·sa-`; unclear whether `sa` is a fixed part of the root or a separable element. Not resolved here — flagged for native validation. |
| `dak` | do / work (also possibly the copula "is" — see conflict note below) | ❌ No | daka, dakaha, dakenga, dakna (infinitive), dakenga ("working"), daka ("is" — see conflict) | THANGSENG_RULES_LOOKUP.md L38; corrections.json (`they are working`, `is`→`daka`) | **Medium** — **evidence conflict**: `daka` appears both as "do/work" (`Uamang dakenga`="they are working") and separately as the copula "is" (`'is' -> 'daka'`, matching RULE-005's `daka` copula). These may be the same root with a work-verb and copula sense, or two homophonous items. Not resolved — this is directly relevant to RULE-031/NV-002 (copula selection) and should be raised alongside that question. |
| `kat` | run | ❌ No | kata, kataha, katenga, katbo, katgen (NEVER `kat·`anything, explicitly confirmed) | THANGSENG_RULES_LOOKUP.md L39; corrections.json (`i ran`, `he is running`, `running`) | **High** — clean, consistent, no conflicts found |
| `ring` | drink | ❌ No | Ringa, ring·aha (noun "ring/bell" possessive, unrelated word) | THANGSENG_RULES_LOOKUP.md L40; corrections.json (`i drank`, `i drank water`) | **High** — **resolved 2026-07-10**: `ring·na`/`ring·a`(sing) is a *different root* (`ring·` = "to sing," confirmed via primary-source chat transcripts), not the same raka-free "drink" root with inconsistent raka. Formerly flagged as a conflict; now understood as a lexical split, matching the exact trap `CLAUDE_A_FINAL_HANDOUT.md` names as this project's costliest recurring mistake. See NV-010. |
| `tusi` | sleep | ❌ No | Tusia, tusienga, tus·aha (note: `tus·aha` shows raka in this one form despite root being raka-free — same category of conflict as `ring`), tusibo | THANGSENG_RULES_LOOKUP.md L41; corrections.json (`i slept`, `i am sleeping`) | **Medium** — same raka-inconsistency pattern as `ring`; `tus·aha` vs. `tusiaha` (corrections.json uses the raka-free form) is an internal conflict already visible within the raka table's own notes, not something I'm introducing. |
| `agan` | speak / tell | ❌ No (per raka table and corrections.json's `agana`/`aganaha`) — **but see conflict note** | Agana, aganaha, aganenga, aganbo, agana ("tell"), Bia una aganaha ("he spoke to her") | THANGSENG_RULES_LOOKUP.md L42; corrections.json (7+ entries) | **Medium** — **evidence conflict**: `corrections.json`'s "i want to speak" gives `Anga a·gan·na sikenga`, with **raka in two places** in a root the raka table and every other corrections.json entry treats as raka-free. This is the clearest internal contradiction found in this inventory pass. |
| `nam` | good (stative/adjective, not a typical action verb — included because it inflects like one) | ❌ No | Nama, namja, namgija (NEVER `nam·a`, explicitly confirmed) | THANGSENG_RULES_LOOKUP.md L43; corrections.json (8+ entries, `this is good`, `he is bad`, `not good`) | **High** — clean, consistent, well-attested, no conflicts found. Directly relevant to RULE-031/NV-002 (copula) since `nama` is a zero-copula bare-predicate example. |
| `dong` | exist / stay / have | ❌ No | donga, dongja, donggen, dongenga, dongachim (past) | THANGSENG_RULES_LOOKUP.md L44; corrections.json (`i do not have`, `do you have children`, `stay`, `there is current`) | **High** — well-attested across existential ("there is"), possessive ("I have"), and plain-verb ("stay") senses; the multi-sense range is itself confirmed by multiple independent examples, not inferred from one. |
| `wa` (rain) | rain (weather verb) | ❌ No | waode ("if it rains") | THANGSENG_RULES_LOOKUP.md L45; corrections.json | **Low** — only one form attested, in an if-clause; no plain present/past form seen. |
| `bilak` | (be) strong | ❌ No | bilakgen ("will be strong") | THANGSENG_RULES_LOOKUP.md L46; corrections.json (`if you eat you will be strong`) | **Low** — only one form attested. |

## Part 2 — Verbs Confirmed Elsewhere in the Repository (not in the raka table, but independently attested)

| Root | Meaning | Raka | Attested Forms | Repository Locations | Confidence |
|---|---|---|---|---|---|
| `senga`/`seng` | wait (also: foul smell — confirmed polysemous, native-explicit) | ❌ No (no raka in any attested form) | `senggen`("will wait," future), `sengenga`("waiting," progressive, e.g. "i am waiting for you"→`Anga nangko sengenga`, "i am waiting at the market"→`Anga antio sengenga`), `senga`(citation/adjectival "smelly" sense, e.g. `Pakol senga`="armpit smelling") | THANGSENG_NATIVE_VALIDATION.md NV-015 (this entry); corrections.json (7+ entries across both senses) | **High** — native-explicit polysemy confirmation (2026-07-12): *"Senga can mean to wait and it can also mean foul smell, depending on context."* Both senses independently attested with multiple examples; not two separate roots, one root with two senses disambiguated by context. Possibly related to `seng`("stop," `Sengbo`) — same root extended, or a separate near-homophone; not yet checked, low priority. |
| `Da·mo` | "wait" (imperative/discourse only — see RULE-036) | ✅ Yes | `Da·mo` (only attested form — explicitly, no other form exists) | THANGSENG_NATIVE_VALIDATION.md NV-015 | **High** — native-explicit: *"It does not take any suffix... It's just an expression... It cannot be changed into any other form."* Not a verb in the inflectable sense at all; see RULE-036 (new grammatical category: fixed discourse expressions). |

| Root | Meaning | Raka | Attested Forms | Repository Locations | Confidence |
|---|---|---|---|---|---|
| `nika`/`ni` | see / watch | ❌ No (explicitly confirmed "raka-free" per THANGSENG_RULES_LOOKUP.md line 405) | nikaha (seen/saw), nina (infinitive, "to see"), `ninan` (appears in the Native Sentence Validation Audit's "watch on status" sentence — segmentation not fully confirmed) | THANGSENG_RULES_LOOKUP.md L405; corrections.json (`i loved the picture`→uses `nikaha`, `i only saw one person`, `i want to see you`); NATIVE_SENTENCE_VALIDATION_AUDIT.md | **Medium** — core forms solid; the audit's `ninan` form isn't yet morphologically broken down (see NV-006, related to the `·ko`/`·o` selection question in the same sentence). |
| `porai`/`pora` | study | Inconsistent — see conflict note | poraienga (studying), poraienga chim (was studying), pora·na (want to study — **with raka**) | THANGSENG_RULES_LOOKUP.md L209, L219, L480; corrections.json | **Medium** — **evidence conflict**: same raka-inconsistency pattern as `ring`/`agan` above — `poraienga`/`poraienga chim` are raka-free but `pora·na` (in the `sikenga` construction) has raka. Also a spelling variance between `porai` and `pora` across different forms, unresolved. |
| `sikeng` | want / need | ❌ No | sikenga (want/wants/need — used as a general modal-like construction: `[verb infinitive]-na sikenga`) | corrections.json (13+ entries — one of the most productively-attested patterns in the whole dictionary) | **High** for the `sikenga` construction itself; but see conflict notes above — `a·gan·na`/`pora·na` show raka inconsistently relative to those same roots' plain forms elsewhere (`ring·na` resolved 2026-07-10 — sing root, not an inconsistency). |
| `man·` | get / obtain / know / able / smell (wide semantic range — genuinely polysemous or under-differentiated, not resolved here) | ✅ Yes (consistently, across all forms found) | man·a (get/know/smell — 3 different glosses attested), man·gen (will get/can — flagged PENDING in THANGSENG_RULES_LOOKUP.md L194 as unconfirmed generality), man·de (in `man·de seng·a`="clever") | THANGSENG_RULES_LOOKUP.md L194; corrections.json (`how did i get it`, `you know this language`, `i smell something`, `he is clever`, `i work so i can eat`) | **Low** — raka is consistent, but the semantic range (get/know/smell/ability/clever) is wide enough that this may be several related-but-distinct senses rather than one verb behaving idiomatically. Directly relevant to NV-008 (ability modal `man·ienga`, itself unattested in any current example — the audit's ability-modal gap is really a gap in this root's paradigm, not a wholly separate item). |
| `bi·a·` | pray | ✅ Yes (both syllables) | bi·a·na (want to pray — infinitive only attested form) | corrections.json (`i want to pray`) | **Low** — only one form attested, embedded in the `sikenga` construction. No plain present/past form seen independently. |
| `a·gan·` | See `agan` above — same root, this is the raka-conflicted infinitive form specifically | — | — | — | Merged into `agan` entry above |

---

## Part 1+2 Summary: Raka-Inconsistency Cluster (narrowed 2026-07-10)

`ring` is resolved — a lexical split (`ring·`="sing" vs. `ring`="drink"),
not a raka inconsistency; see the updated `ring` row above. Two roots
remain genuinely unresolved: `agan`/`a·gan·` and `porai`/`pora·` show raka
appearing in their `-na` infinitive form when the same root is
consistently raka-free in every other attested context. No alternate-word
explanation (the kind that resolved `ring`) has been found for either —
worth checking for one specifically before assuming a phonological rule,
question rather than four. **Candidate hypothesis (not confirmed):** the
`-na` infinitive suffix itself might genuinely trigger raka insertion on
certain root shapes as a productive phonological rule, which would mean
these aren't errors at all but a real, previously-undocumented morphology
pattern (a raka-insertion rule conditioned by the infinitive suffix,
rather than RULE-001's "raka lives in the root only" being violated).
**Alternative hypothesis:** `corrections.json`'s `sikenga`-construction
entries were entered from a different, less rigorously-audited pass than
the main raka table and simply contain transcription errors. This
question is added to the native validation queue below.

---

## Part 3 — Verb Family Maturity Roadmap (P2, per Project Owner request)

**Mature (clean single-sense evidence, no unresolved conflicts, ready for
a canonical verb page as-is):** `cha·` (eat), `kat` (run), `nam` (good/
bad — stative), `dong` (exist/stay/have).

**Reasonably mature but with one open linguistic question attached
(ready for a canonical page that explicitly flags the open question):**
`re·`/`re·ang` (go — NV-001), `dak` (do/work vs. copula — connects to
NV-002), `nika`/`ni` (see/watch — connects to NV-006).

**Needs the raka-inconsistency question resolved before a canonical page
would be trustworthy:** `ring` (drink), `agan` (speak), `porai`/`pora`
(study), and the `sikenga` (want) construction generally, since it's the
context where the conflict surfaces.

**Too thin to document as a canonical page yet (1 form each, would
require inventing to fill out a template):** `on·` (give/explain), `ra·`
(bring), `ka·`(love) (note the `sa`-element question), `wa` (rain),
`bilak` (strong), `bi·a·` (pray), `man·` (get/know/smell/able — also
blocked on the semantic-range question).

---

## New Native Validation Question (added to `docs/THANGSENG_NATIVE_VALIDATION.md`)
See NV-010 below for the raka-inconsistency cluster — the single most
valuable finding from this inventory pass, since it's a genuine,
previously-undetected pattern rather than a restatement of known gaps.

## Cultural Vocabulary Note (P4, added 2026-07-14)
`Chroka` = "dance" (general). `Grika` — **not** a general synonym,
despite an academic dictionary source glossing it simply as "to
dance." Native-confirmed: names a specific ceremonial dance performed
by the male lead dancer during Wangala (the Garo harvest festival),
danced with sword and shield. Preserved here as cultural/ceremonial
vocabulary (P4 — language preservation, per the standing priority
framework) rather than folded into general "dance" coverage, since
collapsing it would lose real cultural specificity the native speaker
took care to distinguish. Source: direct Thangseng confirmation,
2026-07-14, with a supporting video reference provided in the same
exchange (not independently reviewed here — video content not
verifiable by this process, cited as supplied).
