# Thangseng relay answers, 2026-10-18 (via Tridip WhatsApp)

Verbatim relay, 1:21-1:22 pm IST.

Tridip: "And how would be say in plural - Dogs eat rice and my books ate heavy"

Thangseng: "Achakrang miko cha.a.
Angni lekkarang jria."

Also confirmed earlier the same day (Thangseng, relayed by PO): "Da·mo, anga mi cha·kuna" = "Wait, let me eat" (RULE-036 orphan example).

## Claude B reading and what was done
- Evidence for -rang on a SUBJECT-position plural noun (Achakrang ... cha.a). Same morpheme as the object-slot rule built 2026-10-17.
- "ate heavy" read as "are heavy" (typo; heavy is adjectival, Garo has no verb in the reply). Not encoded as typed. PO to confirm.
- Thangseng's "cha.a." and "miko" use "." for the middle dot; repo orthography kept: cha·a, mi·ko.
- Added exact-sentence corrections rows only: "dogs eat rice", "my books are heavy". General subject-slot -rang generation not built (noun subjects go through assembleSentenceSOV, which also lacks object -ko; larger change).

## For Claude A (data, not engine)
- heavy: Thangseng gave `jria`. master_dictionary has heavy = chrim·a (unverified) and je·et·je·et (unverified variant); `jria` has no row.
- books: Thangseng used `lekka` (lekkarang). Data has book = Ki·tap (verified_high, reconfirmed 2026-08-08) and lekka appears in NV-054 sentences. Two native-attested words for book; which is the headword/variant is a data call.
- Bare `dogs`/`books` headwords: still no ruling (engine: dogs -> Achak, books -> Ki·tap).
