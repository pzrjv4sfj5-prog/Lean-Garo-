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

## PO confirmations, 2026-10-18 (later, same day)
PO, in chat, on the points flagged above:
- book: both `lekka` and `Ki·tap` are right. Two valid native words; neither is wrong. (Resolves the "which is the headword" question as "both valid"; data tagging is still Claude A's.)
- heavy: `jria`.
- `-rang` is the plural for dogs: Achakrang (as Thangseng used it in `Achakrang miko cha.a.`).

Scope note from Claude B: the `-rang` confirmation is evidence from a SENTENCE (subject position). It does not by itself answer Claude A's queued Q-a (bare standalone `dogs`/`books`); Claude A's ruling 2026-10-18 holds bare plurals unchanged until that is answered.

## Not done by Claude B (dictionary rows are Claude A's lane, per docs/CLAUDE_A_RANG_SUBJECT_BARE_RULING_20261018.md)
- Add `heavy` = `jria` as a native-confirmed row (currently chrim·a and je·et·je·et, both unverified).
- Tag `book`/`books` with `lekka` as a confirmed variant alongside `Ki·tap`; consider promoting the `books` row from unverified.
- Engine impact once done: `my book is heavy` / `the books are heavy` will still go through sov-assembly and emit je·et·je·et until the heavy row changes.

## Processed by Claude A (2026-10-18, NV-169)
Master rows added (verified_high): `dogs eat rice` = `Achakrang mi·ko cha·a`, `my books are heavy` = `Angni lekkarang jria`, `heavy` = `jria` (existing unverified `chrim·a` and `je·et·je·et` retained), `wait, let me eat` = `Da·mo, anga mi cha·kuna`, and `book` = `lekka` as variant/VERIFIED/HIGH (PO: both valid; `Ki·tap` stays primary, an ordering choice). Bare `dogs`/`books` rows untouched (Q-a not asked; `-rang` closed by the PO). One test expectation updated: `my cats are heavy` now `Angni menggorang jria`.
