# NOTE FOR CLAUDE A
_From Claude B — 2026-06-25_
_Repo HEAD: a1e986d | Corrections: 546 | Build: ✅_

---

## WHAT JUST LANDED (you may not have pulled yet)

Several native-verified batches since your last session:

- 67 entries from `garo_useful_words.docx` (household vocab, animals, phrases)
- `when`=Basaku, `why`=Maini, `who`=Sawa + example sentences
- `no`=Ihing, `newspaper`=janera, `neighbour`=noksul
- `curry`=bi·jak, `dance`=Chroka, `he spoke to her`=Bia una aganaha
- `i sing a song`=Anga git ring·a
- `nice to meet you`, `boredom`, `nipple`, `neighbour` + more

Pull before starting work:
```bash
git config --global commit.gpgsign false
git pull origin main
```

---

## GRAMMAR FLAGS — read before touching engine (docs/GRAMMAR_FLAGS_20260625.md)

### FLAG 1 — RESOLVED ✅
`let's` constructions — TWO valid patterns confirmed by native speaker:
- `Hai + verb + ha` → eat, go, sleep, work, drink, sit, play
- `verb + na` → dance (`chrokna`), sing (`ring·na`), swim (`jrona`)

When building the `let's` engine rule, handle both patterns.
Do NOT force all `let's` through `Hai + verb + ha`.

### FLAG 2 — OPEN ⚠️ (needs native speaker)
`Na·ara` vs `Na·a` pronoun distinction:
- `Na·a` = "you" in yes/no questions (`Na·a Cha·aha ma?`)
- `Na·ara` = "you" in wh-questions (`Na·ara sawa?`, `Na·ara maini gimin tol·enga?`)

Hypothesis: `-ra` is an interrogative marker added to pronoun in open questions.
**Do not implement until native speaker confirms this rule.**

### FLAG 3 — OPEN ⚠️ (check before next engine push)
`ring·a` root collision — both `sing` and `drink` (`Ringa`) share near-identical roots.
Check whether `lookupGaro('ring')` causes ambiguity between the two.

---

## YOUR OPEN PRIORITIES (from docs/IMPROVEMENT_BRIEF_CLAUDE_A.md)

1. **Remove question words from STOP_WORDS** (`when`/`why`/`who`/`what`/`where`/`how`)
   — native Garo forms now in corrections.json, engine just needs to stop stripping them

2. **Remove connectives from STOP_WORDS** (`and`/`but`/`or`/`if`/`so`)
   — split input on connective, translate each clause, join with Garo word
   — this is the single biggest remaining gap in everyday translation quality

3. **Location-noun-dropped bug** (docs/BUG_location_noun_dropped.md)
   — "i went to the market to buy rice" drops "market"
   — needs a locative slot in analyzeGrammar

4. **server.js** — still dead code, needs delete or clear comment

---

## WHAT CLAUDE B IS DOING IN PARALLEL

- Continuing to add native vocab as user provides it
- Waiting for Claude C to deliver reverse translation page
  (will wire into App.jsx nav once ready)
- Monitoring for more grammar rule input from user

---

_Ping Claude B (via user relay) when Priority 1+2 are done — will run
calibration sweep immediately to verify._
