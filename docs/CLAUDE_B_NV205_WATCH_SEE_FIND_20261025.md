# NV-205 / NV-204: watch (Nia), see/find (Nika) paradigms, 2026-10-25 (Claude B)

**Source:** Thangseng native data (relayed 2026-07-26) + PO message 2026-10-25. WATCH and SEE are two different words.
**Attested sentences:** `I see it` = Anga uko nika. `I want to watch it` = Anga uko nina ska. `I am watching` = Anga nienga. `nisona` (wait / look with expectation) is not interchangeable with `nina`.

## Forms now emitted
- **Nia (watch):** Nia, Nienga (watching), Nibo (!), Ninabe (don't), Niaha (past), Nigen (future), Nijawa (will not); infinitive `nina`.
- **Nika (see, find; multi-sense, no re-clarification):** Nika, Nikbo (!), Niknabe (don't), Nikaha (saw/found), Nikgen, Nikjawa; infinitive of find `nikna`.
- **Nisona:** `to wait/look with expectation`.
- **NV-204 (grammar logic, not native):** `VERB it!` / `do not VERB it` -> `Uko <bare command>` (e.g. `Uko nibo`, `Uko cha·nabe`).

## Data touched
corrections.json (28 rows), irregular_verbs.json (found/watched/watching), purpose_map.json (watch: nina; find: nikna replaces garbage `mia·na`), known_cross_source_conflicts.json (`corrections:watch`, intentional: master candidates ni·rik·a / go·ri / ni·chak·a stay unverified).
Tests: `nv205_watch_see_find.test.js`; superseded the ni·rik·a assertion and two count assertions in translationEngine.test.js.

## Open (needs PO / Claude A / Thangseng)
1. Spelling: `nia` unmarked (as transcribed) vs dictionary candidate `ni·a`; raka check.
2. `see` infinitive is still `nina` (PURPOSE_MAP + attested `I want to see you` / `went to see my grandmother`); `nikna` for see is unattested.
3. Nik- continuous (`nikenga`) is from the old irregular entry, not Thangseng.
4. Retire / annotate `ni·rik·a`, `go·ri`, `ni·chak·a` as `watch` candidates in master_dictionary.
5. Earlier held items: Uchi/Iachi in negatives, `look at that` / object `that`, `Uamangchi`, NV-199/200 verification.
