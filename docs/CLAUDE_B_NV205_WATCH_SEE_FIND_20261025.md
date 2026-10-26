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
- NV-206 (Thangseng): `I am watching TV.` = `Anga TV nienga`; TV is written TV and unmarked with watch (no -ko); `watch TV!` -> `TV nibo`.

## NV-207: verb paradigms for all verbs
`scripts/generate-verb-paradigms.mjs` -> `src/data/verb_paradigms.json`, `docs/VERB_PARADIGMS.md`, helper `src/verbParadigm.js` (`getVerbParadigm`). 255 verbs with 9 forms each (present, continuous, past, future, negative, negative future, command, negative command, infinitive). Status per form: native (watch / see / find), pinned (already a row in corrections / irregular_verbs), engine (live `I am V-ing`), derived (suffix rules, NOT native-verified). 5 verbs disagree with the live engine (listed under Review) and 59 have irregular or unclean roots (Manual); neither group is guessed. Re-run the script after any verb data change.

## NV-207b (corrected 2026-10-25): go = Re·a, `re·ang-` stem
Thangseng (NV-100): `Re·a` = to walk; go. `Re·anga` = went, **derived from re·a** (NOT a separate "go away" verb; my earlier NV-207b entry and the four "go away" rows were wrong and are removed). `Re·jawa` = will not go. `Re·angjawa` = will not be going.
Native-verified go paradigm (master_dictionary verified_high): re·a, past re·anga, continuous re·angenga, future re·anggen (\`nokchi re·anggen\`), negative re·angja, will not go re·jawa, will not be going re·angjawa, command re·angbo, don't go re·angnabe, want to go \`re·ang·na ska\`, let's go re·naha, question re·angama.
Pattern seen: stem **re·ang-** carries past / continuous / future / command / negatives; **bare re·** appears with -jawa (will not go), -naha (let's go), -baa (come). Whether -ang- is a general continuity marker for other verbs is NOT established; do not generalize it. The engine already matched all of these, so no runtime change was needed.

## NV-207c: Re·ata = to cause to go; to make someone go; to spend time, money (PO/Thangseng 2026-10-25)
One verb, three senses, so `to spend`, `cause to go` and `make someone go` all give `re·ata`. `spend money` = `dang·ga re·ata`, `spend time` = `Somoi re·ata`. Past `re·ataha`, continuous `re·atenga`, future `re·atgen`, infinitive `re·atna`, command `re·atbo` are rule-derived (unverified). Open: causative sentences (`I make him go` still gives `Anga re·ako Taria`, wrong) need a native pattern.

## Re·mola (v) = to go together (2026-10-25)
Own verb (not go + dam·san, not re·ata). Added to verb_paradigms.json: only `re·mola` is native; re·molenga / re·molaha / re·molgen / re·molja / re·moljawa / re·molbo / re·molnabe / re·molna are suffix-rule derived and unverified. The engine still builds `we went together` = `An·ching dam·sanko re·anga`, `we will go together` = `An·ching Re·anggen` (together dropped), `go together!` = `dam·san re·ang` (no -bo); unchanged pending rulings.

## come = re·ba (2026-10-25)
Thangseng: "Re·ba verb is an imperative mood meaning come." Recorded; the `come` paradigm is now in verb_paradigms.json (stem re·ba; native: re·baa, re·baenga, re·baaha, re·babo, re·bana; derived: re·bagen, re·baja, re·bajawa, re·banabe). No engine output changed. **Clarification needed:** does this mean bare `Re·ba!` is itself a valid imperative (without -bo), or only that `re·ba-` + `-bo` forms the imperative? Unverified engine rows to settle after the answer: `come!` = `Re·ba·bo!` (stray raka vs verified `re·babo`), `do not come` = `Re·ba·ja` (don't come is `re·banabe`).
