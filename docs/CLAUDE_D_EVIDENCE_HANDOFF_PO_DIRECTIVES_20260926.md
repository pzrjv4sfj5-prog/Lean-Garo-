# Claude D Evidence-Package Handoff — Contested PO-Directive Forms

_Prepared by Claude D per `.ai/CLAUDE_D_HANDOUT.md` ("Owner word-level directives: evidence-package handoff"). This is a forensic evidence package, not a resolution. Claude D has not deleted, merged, or modified any entry. Linguistic disposition is Claude A's; runtime/build verification and rebuild is Claude B's._

Generated against `master_dictionary.json` at repo HEAD `9522be9` (9,983 records).

## Scope

Seven English keys with a Project Owner-directed canonical Garo form and a conflicting/superseded prior form still present somewhere in the repository (`.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json` for the first six; cow's directive is recorded directly on its `master_dictionary.json` row, dated 2026-09-25).

| English | PO-directive canonical | Conflicting/prior form |
|---|---|---|
| three fish | na·tok mang·gittam | na·tok mang·gni |
| orange | Narang | na·rang |
| papaya | Modupol | mo·du |
| watermelon | tor·mus | Te·e raja |
| mango | te·ga·chu | Te·gachu |
| sweet potato | ta·mil·ang | Ta·we |
| cow | Matchu | ma·su |

## Required Claude A action per PO protocol

Per `PROJECT_OWNER_DIRECTIVE_PROTOCOL.json`: implement the canonical form for the affected English key/sense; **do not globally delete the conflicting Garo string** — several of these forms (e.g. `na·tok mang·gni` for "two fish") are correct under a *different* English key and must be preserved there. The cleanup unit is (English key + Garo form), not the Garo string in isolation.

## Required Claude B action

Verify which of `master_dictionary.json` / `garo_dictionary.json` / `src/compiled_dict*.json` / `src/data/phrase_maps.js` is actually runtime-selectable for sentence assembly before removing anything, so the sentence builder cannot land on a now-empty slot. Rebuild compiled output and rerun the full test suite after Claude A's disposition.

## Occurrence detail (master_dictionary.json + garo_dictionary.json)

### three fish
_na·tok mang·gni remains correct for 'two fish' — do not remove globally_

| File | Index/Key | English | Garo | Confidence | Notes (truncated) |
|---|---|---|---|---|---|
| master_dictionary.json | 155 | three | Gittam | verified_high | VERIFIED/HIGH — Project Owner confirmed (2026-09-10), cross-checked against data |
| master_dictionary.json | 498 | fish | Na·tok | superseded | SUPERSEDED — corpus-internal audit 2026-08-01 (Claude A): legacy unannotated imp |
| master_dictionary.json | 668 | i | Anga | unverified |  |
| master_dictionary.json | 1188 | three birds | na·tok manggni | superseded | SUPERSEDED — corpus-internal audit 2026-08-10 (Claude A, per Claude C's engineer |
| master_dictionary.json | 1189 | three fishs | na·tok manggni | superseded | SUPERSEDED — corpus-internal audit 2026-08-10 (Claude A, per Claude C's engineer |
| master_dictionary.json | 1227 | three bird | na·tok manggni | superseded | SUPERSEDED — corpus-internal audit 2026-08-10 (Claude A, per Claude C's engineer |
| master_dictionary.json | 2045 | the three fish | na·tok manggittam | verified_high | VERIFIED/HIGH — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE |
| master_dictionary.json | 2736 | Fish | na·tok | verified_high | variant/VERIFIED/HIGH |
| master_dictionary.json | 8723 | two fish | na·tok manggni | verified_high | VERIFIED/HIGH — mechanically regenerated 2026-08-11 (Claude B): fish=na·tok (con |
| master_dictionary.json | 8724 | two fishs | na·tok manggni | verified_high | VERIFIED/HIGH — mechanically regenerated 2026-08-11 (Claude B): fish=na·tok (con |
| master_dictionary.json | 8725 | three fish | na·tok manggittam | verified_high | VERIFIED/HIGH — mechanically regenerated 2026-08-11 (Claude B): fish=na·tok (con |
| master_dictionary.json | 8726 | three fishs | na·tok manggittam | verified_high | VERIFIED/HIGH — mechanically regenerated 2026-08-11 (Claude B): fish=na·tok (con |
| master_dictionary.json | 9606 | i have three fish | Ango na·tok manggittam donga | verified_high | VERIFIED/HIGH — Project Owner-supplied sentence (2026-09-13), composed entirely  |
| garo_dictionary.json | 2 | three fish | na·tok manggittam | None |  |
| garo_dictionary.json | 157 | Three | Gittam | None |  |
| garo_dictionary.json | 475 | fish | Na·tok | None |  |
| garo_dictionary.json | 644 | i | Anga | None |  |
| garo_dictionary.json | 1587 | Fish | Na·tok | None |  |
| garo_dictionary.json | 1768 | I | Anga | None |  |
| garo_dictionary.json | 2495 | three birds | na·tok manggni | None |  |
| garo_dictionary.json | 2496 | three fishs | na·tok manggni | None |  |
| garo_dictionary.json | 2641 | three bird | na·tok manggni | None |  |
| garo_dictionary.json | 3895 | the three fish | na·tok manggittam | None |  |

### orange
_orthographic equivalence question per PO protocol_

| File | Index/Key | English | Garo | Confidence | Notes (truncated) |
|---|---|---|---|---|---|
| master_dictionary.json | 15 | orange | Narang | verified_high | VERIFIED/HIGH — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE |
| master_dictionary.json | 560 | or | Ba | unverified |  |
| master_dictionary.json | 1076 | ge | Objects, tools, things (general fallback) | unverified |  |
| master_dictionary.json | 2060 | the orange | Narang | verified_high | VERIFIED/HIGH — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE |
| master_dictionary.json | 2902 | Orange | ko·mil·a | verified_high | variant/VERIFIED/HIGH |
| master_dictionary.json | 2903 | Orange | na·rang | verified_high | variant/VERIFIED/HIGH / Cross-ref 2026-09-08: same lexical item as the Owner-dir |
| master_dictionary.json | 6280 | orange | a·mnk | superseded | SUPERSEDED — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE_PR |
| garo_dictionary.json | 16 | orange | Narang | None |  |
| garo_dictionary.json | 536 | or | Ba | None |  |
| garo_dictionary.json | 1052 | ge | Objects, tools, things (general fallback) | None |  |
| garo_dictionary.json | 1165 | Orange | Narang | None |  |
| garo_dictionary.json | 1656 | Or | Ba | None |  |
| garo_dictionary.json | 3910 | the orange | Narang | None |  |

### papaya
_mo·du/pe·pe superseded per PO directive_

| File | Index/Key | English | Garo | Confidence | Notes (truncated) |
|---|---|---|---|---|---|
| master_dictionary.json | 17 | papaya | Modu | superseded | SUPERSEDED (duplicate row) — native relay NV-080 (2026-08-17): same word as the  |
| master_dictionary.json | 1042 | pay | Gama | superseded | SUPERSEDED — corpus-internal audit 2026-08-01 (Claude A): legacy unannotated imp |
| master_dictionary.json | 2062 | the papaya | Modu | superseded | SUPERSEDED — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE_PR |
| master_dictionary.json | 2915 | Papaya | mo·du | superseded | VERIFIED/HIGH — native-confirmed 2026-08-17 (Thangseng relay, pickPrimary consol |
| master_dictionary.json | 2916 | Papaya | pe·pe | superseded | SUPERSEDED — native relay NV-080 (2026-08-17): not selected; native-confirmed fo |
| master_dictionary.json | 2919 | Pay | bet·ton | verified_high | variant/VERIFIED/HIGH |
| master_dictionary.json | 9482 | papaya | Modupol | verified_high | VERIFIED/HIGH — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE |
| master_dictionary.json | 9483 | the papaya | Modupol | verified_high | VERIFIED/HIGH — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE |
| garo_dictionary.json | 18 | papaya | Modu | None |  |
| garo_dictionary.json | 1018 | Pay | Gama | None |  |
| garo_dictionary.json | 1167 | Papaya | Modu | None |  |
| garo_dictionary.json | 3912 | the papaya | Modu | None |  |

### watermelon

| File | Index/Key | English | Garo | Confidence | Notes (truncated) |
|---|---|---|---|---|---|
| master_dictionary.json | 22 | watermelon | Te·e raja | superseded | SUPERSEDED — corpus-internal audit 2026-08-01 (Claude A): legacy unannotated imp |
| master_dictionary.json | 257 | water | Chi | unverified |  |
| master_dictionary.json | 669 | me | Angko | verified_high | VERIFIED/HIGH — promoted by NV-146 (2026-09-06 evening relay): appears as 'angko |
| master_dictionary.json | 744 | on | Kosak·o | unverified |  |
| master_dictionary.json | 2067 | the watermelon | Te·e raja | superseded | SUPERSEDED — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE_PR |
| master_dictionary.json | 2317 | at | ·o | verified_high | VERIFIED/HIGH. Confirmed 2026-08-09 (Project Owner relay, Thangseng direct): "At |
| master_dictionary.json | 2318 | ate | cha·aha | unverified |  |
| master_dictionary.json | 2485 | at | O | superseded | SUPERSEDED — no-raka duplicate of the confirmed "·o" suffix form. See NV-070. |
| master_dictionary.json | 3153 | Watermelon | tor·mus | verified_high | variant/VERIFIED/HIGH |
| master_dictionary.json | 9484 | the watermelon | tor·mus | verified_high | VERIFIED/HIGH — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE |
| garo_dictionary.json | 23 | watermelon | Te·e raja | None |  |
| garo_dictionary.json | 258 | water | Chi | None |  |
| garo_dictionary.json | 645 | me | Angko | None |  |
| garo_dictionary.json | 720 | on | Kosak·o | None |  |
| garo_dictionary.json | 1172 | Watermelon | Te·e raja | None |  |
| garo_dictionary.json | 1368 | Water | Chi | None |  |
| garo_dictionary.json | 1769 | Me | Angko | None |  |
| garo_dictionary.json | 1848 | On | Kosak·o | None |  |
| garo_dictionary.json | 3917 | the watermelon | Te·e raja | None |  |
| garo_dictionary.json | 4169 | at | ·o | None |  |
| garo_dictionary.json | 4170 | ate | cha·aha | None |  |

### mango
_orthography/segmentation care per PO protocol_

| File | Index/Key | English | Garo | Confidence | Notes (truncated) |
|---|---|---|---|---|---|
| master_dictionary.json | 19 | mango | Te·gachu | superseded | SUPERSEDED — 2026-09-16, Claude B: demoted again. Was VERIFIED/HIGH per an Owner |
| master_dictionary.json | 123 | go | Re·anga | superseded | SUPERSEDED — 2026-08-30D audit (Claude A): this unverified 'go'=Re·anga row is n |
| master_dictionary.json | 527 | man | Me·asa | verified_high | VERIFIED/HIGH — direct Thangseng relay via Tridip, WhatsApp 4/9/2026 1:53-1:55pm |
| master_dictionary.json | 1073 | mang | Animals, birds, fish, insects | unverified |  |
| master_dictionary.json | 2064 | the mango | Te·gachu | superseded | SUPERSEDED — 2026-09-16, Claude B: demoted again, same reasoning as the sibling  |
| master_dictionary.json | 2856 | mango | te·gatchu | verified_high | VERIFIED/HIGH — Native (Thangseng)-cited, relayed by Project Owner in chat 2026- |
| master_dictionary.json | 9349 | go | re·a | verified_high | VERIFIED/HIGH — native-confirmed 2026-08-28 (Project Owner direct chat relay, Th |
| master_dictionary.json | 9485 | the mango | te·gatchu | verified_high | VERIFIED/HIGH — Native (Thangseng)-cited, relayed by Project Owner in chat 2026- |
| garo_dictionary.json | 20 | mango | Te·gachu | None |  |
| garo_dictionary.json | 123 | go | Re·anga | None |  |
| garo_dictionary.json | 504 | man | Me·asa | None |  |
| garo_dictionary.json | 1049 | mang | Animals, birds, fish, insects | None |  |
| garo_dictionary.json | 1169 | Mango | Te·gachu | None |  |
| garo_dictionary.json | 1272 | Go | Re·anga | None |  |
| garo_dictionary.json | 1621 | Man | Me·asa | None |  |
| garo_dictionary.json | 3914 | the mango | Te·gachu | None |  |

### sweet potato

| File | Index/Key | English | Garo | Confidence | Notes (truncated) |
|---|---|---|---|---|---|
| master_dictionary.json | 34 | potato | Alu | superseded | SUPERSEDED — corpus-internal audit 2026-08-01 (Claude A): legacy unannotated imp |
| master_dictionary.json | 49 | sweet potato | Ta·we | superseded | SUPERSEDED — corpus-internal audit 2026-08-01 (Claude A): legacy unannotated imp |
| master_dictionary.json | 207 | sweet | Chi·a | superseded | SUPERSEDED — corpus-internal audit 2026-08-01 (Claude A): legacy unannotated imp |
| master_dictionary.json | 288 | pot | Me.dik | superseded | SUPERSEDED — corpus-internal audit 2026-08-01 (Claude A): legacy unannotated imp |
| master_dictionary.json | 742 | to | ·na | unverified |  |
| master_dictionary.json | 2095 | the sweet potato | Ta·we | superseded | SUPERSEDED — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE_PR |
| master_dictionary.json | 2317 | at | ·o | verified_high | VERIFIED/HIGH. Confirmed 2026-08-09 (Project Owner relay, Thangseng direct): "At |
| master_dictionary.json | 2485 | at | O | superseded | SUPERSEDED — no-raka duplicate of the confirmed "·o" suffix form. See NV-070. |
| master_dictionary.json | 2522 | we | Anga·mang | superseded | SUPERSEDED — corpus-internal audit 2026-08-01 (Claude A): legacy unannotated imp |
| master_dictionary.json | 2944 | Pot | Dik·ke | verified_high | VERIFIED/HIGH v:Me.dik / dik-te / gim-bi |
| master_dictionary.json | 2945 | Pot | dik·te | verified_high | variant/VERIFIED/HIGH |
| master_dictionary.json | 2946 | Pot | gim·bi | verified_high | variant/VERIFIED/HIGH |
| master_dictionary.json | 3090 | Sweet | chi·a | verified_high | variant/VERIFIED/HIGH |
| master_dictionary.json | 3091 | Sweet Potato | ta·mil·ang | verified_high | variant/VERIFIED/HIGH — provenance recorded 2026-09-08 as Project Owner directiv |
| master_dictionary.json | 6293 | potato | al·u | verified_high | VERIFIED/HIGH/doc7 |
| master_dictionary.json | 6438 | We | an·ching | verified_high | VERIFIED/HIGH/doc7 |
| master_dictionary.json | 9486 | the sweet potato | ta·mil·ang | verified_high | VERIFIED/HIGH — Project Owner directive (2026-09-08, .ai/PROJECT_OWNER_DIRECTIVE |
| garo_dictionary.json | 35 | potato | Alu | None |  |
| garo_dictionary.json | 50 | sweet potato | Ta·we | None |  |
| garo_dictionary.json | 208 | sweet | Chi·a | None |  |
| garo_dictionary.json | 289 | pot | Me.dik | None |  |
| garo_dictionary.json | 718 | to | ·na | None |  |
| garo_dictionary.json | 1184 | Potato | Alu | None |  |
| garo_dictionary.json | 1199 | Sweet Potato | Ta·we | None |  |
| garo_dictionary.json | 1318 | Sweet | Chi·a | None |  |
| garo_dictionary.json | 1399 | Pot | Dik·ke | None |  |
| garo_dictionary.json | 1600 | Pot | Me.dik | None |  |
| garo_dictionary.json | 1846 | To | ·na | None |  |
| garo_dictionary.json | 2395 | pot | Dik·ke | None |  |
| garo_dictionary.json | 3944 | the sweet potato | Ta·we | None |  |
| garo_dictionary.json | 4169 | at | ·o | None |  |

### cow
_flip-flopped historically; 2026-09-25 PO chat confirmation is latest_

| File | Index/Key | English | Garo | Confidence | Notes (truncated) |
|---|---|---|---|---|---|
| master_dictionary.json | 79 | cow | Matchu | verified_high | VERIFIED/HIGH — 2026-09-25, direct Project Owner chat confirmation: 'Matchu' is  |
| master_dictionary.json | 80 | Cow | ma·su | superseded | SUPERSEDED — 2026-09-25, direct Project Owner chat confirmation (same session as |
| master_dictionary.json | 918 | cow moo | Ma·ma | unverified |  |
| master_dictionary.json | 2126 | the cow | Matchu | unverified |  |
| master_dictionary.json | 3794 | cow dung | Matchu·ke·em·a | unverified | UNVERIFIED/HIGH |
| master_dictionary.json | 3795 | coward | ken·kok | unverified | UNVERIFIED/HIGH |
| master_dictionary.json | 4811 | milk of cow | dut | unverified | UNVERIFIED/HIGH |
| master_dictionary.json | 8325 | a kind of cow disease that attacks hoofs. | Ja·eka | unverified |  |
| garo_dictionary.json | 81 | cow | Matchu | None |  |
| garo_dictionary.json | 893 | cow moo | Ma·ma | None |  |
| garo_dictionary.json | 1230 | Cow | Matchu | None |  |
| garo_dictionary.json | 1994 | Cow moo | Ma·ma | None |  |
| garo_dictionary.json | 3975 | the cow | Matchu | None |  |

## Runtime/compiled-layer hits (src/data/*.json, src/compiled_dict*.json, phrase_maps.js)

### three fish
| File | Location | Detail |
|---|---|---|
| src/data/category_index.json | key: three fish | value: animals |
| src/compiled_dict.json | key: three fish | value: na·tok manggittam |

### orange
| File | Location | Detail |
|---|---|---|
| src/data/category_index.json | key: orange | value: food |
| src/data/corrections.json | key: orange | value: Narang |
| src/compiled_dict.json | key: orange | value: Narang |
| src/compiled_dict_alternates.json | key: orange | value: ['Narang', 'ko·mil·a', 'na·rang'] |

### papaya
| File | Location | Detail |
|---|---|---|
| src/data/category_index.json | key: papaya | value: food |
| src/compiled_dict.json | key: papaya | value: Modupol |

### watermelon
| File | Location | Detail |
|---|---|---|
| src/data/category_index.json | key: watermelon | value: food |
| src/compiled_dict.json | key: watermelon | value: tor·mus |

### mango
| File | Location | Detail |
|---|---|---|
| src/data/category_index.json | key: mango | value: food |
| src/compiled_dict.json | key: mango | value: te·gatchu |

### sweet potato
| File | Location | Detail |
|---|---|---|
| src/data/category_index.json | key: sweet potato | value: food |
| src/compiled_dict.json | key: sweet potato | value: ta·mil·ang |

### cow
| File | Location | Detail |
|---|---|---|
| src/data/category_index.json | key: cow | value: animals |
| src/compiled_dict.json | key: cow | value: Matchu |
| src/data/phrase_maps.js | (raw substring) | conflict: `ma·su` — raw substring match in phrase_maps.js |
| src/data/phrase_maps.js | (raw substring) | canonical: `Matchu` — raw substring match in phrase_maps.js |

## Non-adjudication statement

Claude D has not determined which form is linguistically correct beyond restating the existing PO-directive canonical value. Claude D has not deleted, merged, or rewritten any entry in this repository as part of producing this handoff.