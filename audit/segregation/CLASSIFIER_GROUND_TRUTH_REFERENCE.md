# Category + Classifier + Number — Ground Truth Reference

**Purpose:** a single reference to check any future generated-counting cluster against, before deciding whether it's a wrong/placeholder duplicate (like Batch 1/2) or a legitimate counted form. Built by cross-referencing `data/garo_number_classifier_engine_machine_ready.json`'s 47-row classifier table (the documented rule) against every counted-noun record actually in `master_dictionary.json` (as of hash `681d078c...`, 10,166 records, post-Batch-1).

**Method, stated plainly:** for every record shaped like `<number word> <noun>`, I stripped the numeral suffix from the Garo value (matching the base-number/teen/tens word list) and checked what classifier token the remainder ends with, against the engine's 16 known classifiers (`sak, mang, king, ge, se, pang, dot, jol, rong, dam, roa, kg, litre, plate, bol, akka`). Verified this detection against 9 known-good hand-checked examples before trusting it on the full corpus.

---

## Part A — Official classifier table, cross-checked against actual verified_high usage

| Noun | Official classifier | Actually used in `verified_high` records | Actually used in superseded-only records | Verdict |
|---|---|---|---|---|
| person, people | `sak` | `sak` | — | **MATCH** |
| teacher | `sak` | `sak` | — | **MATCH** |
| student | `sak` | `sak` | — | **MATCH** |
| bird (chicken/bird) | `mang` | `mang` | — | **MATCH** |
| fish | `mang` | `mang` | — | **MATCH** |
| book | `king` | `king` | — | **MATCH** |
| banana | `ge` (exception) | `ge` | — | **MATCH** |
| tree | `pang` | `pang` | — | **MATCH** |
| apple (fruit family) | `rong` | `rong` | `se` (wrong, leftover) | **MATCH** (verified_high correct); a stray `se`-classifier superseded row still exists — see Part C |
| mountain | `dot` | `dot` | — | **MATCH** |
| village | `dam` | `dam` | — | **MATCH** |
| car | `bol` | `bol` | — | **MATCH** |

Every noun in the official table that has **any** counted-form data in the corpus matches the rule exactly on its `verified_high` rows — no case of a `verified_high` record disagreeing with the documented classifier. That's a meaningful finding on its own: the parts of the corpus that are trusted are internally consistent with the rule engine.

The remaining ~55 nouns in the official table (man, woman, boy, girl, child, children, tiger, lion, cow, horse, insect, calf, kitten, paper, leaf, household object, sofa, bed, container, thing, tool, plant, log, bamboo, pole, rod, mango, orange, papaya, watermelon, alcohol, beer, drink, egg, water, glass of water, road, length, kg, litre, rice, vegetables, momo, chow, liquid food, bunch of bananas) have **no counted-form records at all** in the current corpus — `NO-DATA`, not mismatch. These are exactly where a *new* generated-counting cluster, if one shows up in a future batch, has nothing existing to cross-check against — worth extra scrutiny rather than assuming it's fine.

## Part B — Nouns the corpus counts that AREN'T in the official table (extensions, not contradictions)

| Noun | Classifier used (all `verified_high`) | Reading |
|---|---|---|
| dog, cat | `mang` | Consistent extension of the Animal/Mammal category (official table only itemizes tiger/lion/cow/horse by name, but the classifier is the same) |
| male student, female student | `sak` | Consistent extension of `student` |
| airplane, motorcycle, train | `bol` | Consistent extension of `car`'s Transport category |
| pen | `ge` | Consistent with General-Object family |
| fruit (generic), grain(s) of rice | `rong` | `fruit` extends the fruit family directly; `grain(s) of rice` counting individual grains with `rong` doesn't contradict the official "rice → kg" rule — that rule is for *bulk* rice by weight, this is a different, more specific concept (discrete grains) |
| plate of rice, plates of rice | `plate` | Matches the official Food/Cooked-food → `plate` rule exactly |
| pill | `rong` | Not in the table at all; extension only by analogy to the fruit/drink family, no documented basis — flagging as **open**, not confirmed |
| thousand | (noise) | Base number-word compounding, not a real noun-classifier situation — a detection artifact from the numeral system itself, not a finding |

None of these contradict the rule engine — they're either clean, documented-pattern extensions or (for `pill`) genuinely undocumented and worth a linguistic confirmation rather than an assumption either way.

## Part C — Known leftover wrong-classifier debris NOT yet covered by Batch 1 or Batch 2

While building this table I found `apple` still has at least one **other** superseded record using classifier `se` (the Tools classifier — wrong for fruit) beyond the single `eight apple` row already deleted in Batch 1. This is a **different wrong-classifier family** than Batch 2's targets (`mang·gni`/`rang·gni`/`chik·gni`/`chak·gni` generic placeholders) — it's a real classifier (`se`) borrowed from the wrong noun category, not a fabricated one. Worth a dedicated look as a possible **Batch 3**, kept separate rather than folded into Batch 2's scope.

## Part D — How to use this for future batches

Before deleting any newly-found generated-counting cluster:
1. Look up the noun in Part A/B. If it's there with a confirmed classifier, any record for that noun using a **different** classifier (and not `verified_high`) is a strong wrong-candidate.
2. If the noun has `NO-DATA` (Part A's second list), there's nothing to cross-check against — don't assume a pattern-match to Batch 1/2 is automatically safe; confirm the specific case before batching it in.
3. `chik` (used in the misc river/student/water placeholder family from Batch 2) and bare `chak`/`rang`/`mang·gni`-style fused strings with no noun stem **do not appear anywhere in the official 16-classifier list** — any Garo counted-form using a classifier token outside `{sak, mang, king, ge, se, pang, dot, jol, rong, dam, roa, kg, litre, plate, bol, akka}` is immediately suspect on that basis alone, independent of confidence tag.

Batch 2 (315 records, confirmed all-`superseded`, cross-noun generic placeholder pattern) is unaffected by this reference — it was already verified against the rule engine's classifier list directly and holds up: `chik` isn't a real classifier at all, and `mang·gni`/`rang·gni`/`chak·gni` as fixed generic tails don't match any noun's actual rule.
