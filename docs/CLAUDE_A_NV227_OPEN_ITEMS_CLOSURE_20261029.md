# NV-227: open-items closure (Claude A, 2026-10-29)

Project Owner directive in chat: "close all open, you have enough evidence". Each item below is closed from repo evidence; provenance is Project Owner closure plus by-composition where marked. No Thangseng quote is claimed.

| Item | Closure | Evidence |
|---|---|---|
| `poraina` vs `pora·na`, study/read stem | CLOSED earlier today (NV-226): `poraia` = study = read; `poraina` infinitive; `Poraibo` imperative | Owner ruling + native `poraienga` |
| `i stopped going` = `Anga re·angjaha` | Corrections pin REMOVED. `re·angjaha` is native "did not go" (NV-222); the cessative reading was my own 2026-07-26 inference, already withdrawn in RULE-030 claim 2 | NV-222 |
| generalise did-not to `-jaha` | NOT generalised, closed as a ruling: `-jaha` is attested only for `go`; `-ja` stays the default negative (`Anga sikja`, `nang·ja`); Thangseng says contextual past is verb-dependent | NV-222, 2026-10-25 note |
| `to support`: `Chaka` vs `al·du·na` | `Chaka` primary (direct native, NV-063, 2026-08-05); `al·du·na` kept as a labelled variant (uncited doc7 tag) | NV-063 |
| `Shall I sit?` | Added `Anga asongnama?` by composition: `asong` + hortative `-na` + `-ma`; distinct from permission `may i sit` | NV-187/188, RULE-007 |
| `ka·a soa` = irritated; July items 28-30 | Stay unconfirmed ("I think"); nothing stored or shipped as verified | no native evidence |
| `hit`, `break` base verbs | Stay unverified candidates; `make` = `Taria` already verified | no native evidence |
| Matri / Matkalsi / Me·mana·song (Claude D OCR) | Stay `unverified` OCR rows; not promoted | OCR only |
| per-class raka | CLOSED, no outstanding contradiction: sak no dot, pang no dot, mang/king/gong dot (engine and rows aligned 2026-09-29B) | NV-190s, 2026-09-28/29 notes |

## Runtime follow-up (closed, NV-229, 2026-10-30)
- `i stopped going` -> `Anga Re·angjaha` is NOT an engine bug: grammarEngine Rule 17 (`stopped`/`quit`/`no longer` -> `-jaha`, discontinuation) is consistent with the attested `cha·jaha` pin for `i stopped eating`. For `go` only, the discontinuation form and the native `did not go` (NV-222) are homographs; Rule 17 stays, no engine change.
- Subjectless imperative with a noun object (`read the book`, `eat rice`) was emitted verb-first, unmarked, citation form. Fixed in translationEngine.js as method `imperative-object-ko`: `Ki·tapko poraibo`, `Miko cha·bo`, `please` -> `Ka·sapae. ...`. Tests: tests/unit/imperative_object_ko.test.js. Grammar logic, not a native quote.
