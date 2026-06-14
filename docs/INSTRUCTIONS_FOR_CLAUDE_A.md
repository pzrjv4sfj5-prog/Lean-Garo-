# Instructions for Claude A
_Written by Claude B — 2026-06-14_
_Based on: docs/GARO_GRAMMAR_VALIDATED.md + docs/GARO_GRAMMAR_REFERENCE.md_

---

## CONTEXT

Claude B has completed a cross-source grammar research session covering 13 sources
(Burling 2003 Vol.I+II, Phillips 1904, Sangma 1991, SIL/Webonary, Wiktionary, Wikipedia,
languagesgulper.com, native speaker input). Two validated reference docs are now in
`docs/` for your use. All pending corrections from earlier sessions have been resolved.

---

## CURRENT ENGINE STATE (as of e1d39de)

All previously flagged issues are now fixed:
- ✅ `3 people` → `sak-gitam mande`
- ✅ `5 birds` → `mang-bonga do·o`
- ✅ `dog bit me` → `Achak anga·ko chikaha`
- ✅ `the dog bit me` → `Achak anga·ko chikaha`
- ✅ `lets go to market` → `Hai Bajal Anti Re·na`
- ✅ `lets go to the market` → `Hai Bajal Anti Re·na`
- ✅ `this is not good` → `Ia nama-gija`
- ✅ `i do not understand` → `Anga uija`
- ✅ `go to sleep` → `Tusibo`
- ✅ corrections.json has 84 entries

---

## PRIORITY TASKS FOR CLAUDE A

### PRIORITY 1 — Past Tense Algorithmic Detection
**Problem:** Past tense only works via corrections/IRREGULAR_VERBS.
Engine fails on any verb not explicitly listed.

**Solution (academically validated — Burling S1 GOLD):**
Past tense suffix = `-aha` appended to verb root.

**Implementation in `src/translationEngine.js`:**
```js
// Add to IRREGULAR_VERBS (past tense roots already in dict):
'ate': 'cha·aha',      // eat → past
'went': 're·anga',     // go → past (already in corrections)
'ran': 'kataha',       // run → past
'came': 'rebaaha',     // come → past
'saw': 'nikaha',       // see → past
'said': 'aganaha',     // say → past
'gave': 'ron·aha',     // give → past

// OR: detect past tense in assembleSentenceSOV:
// If English word ends in -ed, or is in irregular past list,
// look up root in dict, then append 'aha'
```

**Academic source:** Burling (2003) Vol.I p.92 — confirmed by native speaker (`chikaha` = bit)

---

### PRIORITY 2 — Progressive Tense
**Problem:** "I am eating" → engine gives wrong/incomplete output.
**Solution:** Detect `-ing` forms → look up root → append `-eng-a` (A'chik) or `-ing-a` (Mandi).

```js
// In IRREGULAR_VERBS add progressive forms:
'eating': 'cha·enga',
'going': 're·angenga',
'running': 'katenga',
'sleeping': 'tusienga',
'coming': 'rebaenga',

// OR detect gerund: strip -ing → lookup root → root + 'enga'
```

**Real examples (Wikipedia S9 — MEDIUM trust, verify):**
- `Anga mi cha enga` = I am eating food
- `Anga antichi re.angenga` = I am going to market

**Academic source:** Burling (2003) — `-ing-`/`-eng-` is inflectional affix confirmed

---

### PRIORITY 3 — Negation Algorithmic (not just corrections)
**Problem:** Negation only works for phrases in corrections.json.
Any new negated sentence falls through to sov-assembly with wrong output.

**Solution:** Detect "not/don't/doesn't/didn't/never/no" in input →
insert `-ja-` between verb root and tense suffix.

**Rule (Burling S1 GOLD):**
```
Positive:  verb-root + tense     e.g. cha·a = eats
Negative:  verb-root + -ja + tense  e.g. cha·ja = does not eat
                                         (NOT cha·ja-a — drop double -a)
Past neg:  verb-root + -ja + aha  e.g. cha·ja-aha = did not eat
Prog neg:  verb-root + -ja + ing-a  e.g. cha·ja-ing-a = is not eating
```

**Conflict note:** Our corrections use `-gija` (e.g. `nama-gija`).
Academic standard is `-ja-`. BOTH are valid — `-gija` is native-confirmed speech form.
Recommendation: Keep `-gija` corrections as-is. Add `-ja-` for algorithmic new sentences.
**Do NOT remove `-gija` entries from corrections.json.**

---

### PRIORITY 4 — Genitive / Possessive Case `-ni`
**Problem:** "my dog", "his house", "her name" not handled.
**Solution:** Detect possessive pronouns → apply `-ni` to Garo pronoun.

**Validated (Burling S1 GOLD):**
```
my → ang-ni          your → nang-ni
his/her → ua-ni      our → nija-ni / nia-ni
```

**Examples:**
- `my dog` → `ang-ni achak`
- `your hand` → `nang-ni jak`
- `her name` → `ua-ni ming`

---

### PRIORITY 5 — Locative Case `-o`
**Problem:** "at home", "in the market", "in Meghalaya" not handled.
**Solution:** Detect location prepositions (at/in/on) → apply `-o` to place noun.

**Validated (Burling S1 GOLD):**
```
at home → nok-o
in the market → bajal-o / anti-o
in Meghalaya → Meghalaya-o  (from Wikipedia: "Ua Meghalayao songdonga")
```

---

### PRIORITY 6 — Apostrophe Normalization (INPUT LEVEL)
**Problem:** `lets` vs `let's` still requires duplicate correction entries.
**Solution:** Normalize input BEFORE any lookup:

```js
// Add to translate() at the top, before corrections lookup:
function normalizeInput(text) {
  return text
    .toLowerCase()
    .replace(/\blets\b/g, "let's")
    .replace(/\bdont\b/g, "don't")
    .replace(/\bdoesnt\b/g, "doesn't")
    .replace(/\bdidnt\b/g, "didn't")
    .replace(/\bcant\b/g, "can't")
    .replace(/\bwont\b/g, "won't")
    .replace(/\bim\b/g, "i'm")
    .trim();
}
```

This eliminates the need for duplicate correction entries for every apostrophe variant.

---

### PRIORITY 7 — Plural Marker `-rang`
**Problem:** Plural nouns not recognized — "dogs" treated same as "dog".
**Solution:** Strip common English plural `-s`/`-es` → lookup root → append `-rang`.

**Validated (Burling S1 GOLD):**
```
dogs → achak-rang
people → mande-rang
books → ki·tap-rang
birds → do·o-rang
```

**Note:** Plural is NOT obligatory in Garo — only add `-rang` when English input
is clearly plural AND the context benefits from marking it.

---

### PRIORITY 8 — Sleep Fix (carried from previous session)
**File:** `src/data/corrections.json`
**Add:**
```json
"i want to sleep": "Anga tusina sikenga",
"sleep": "tusina",
"to sleep": "tusina"
```
**And in IRREGULAR_VERBS:**
```js
'sleep': 'tusina',    // (check current value — was 'tusia-na' if present)
```

---

## GRAMMAR DATA AVAILABLE TO YOU

Two reference docs are now in `docs/`:

1. **`docs/GARO_GRAMMAR_REFERENCE.md`** — Full grammar: all tenses, cases, pronouns,
   classifiers, adverbials, moods, 60+ example sentences. 456 lines.

2. **`docs/GARO_GRAMMAR_VALIDATED.md`** — Cross-source comparison of 13 sources.
   Each grammar rule tagged with trust level (GOLD/HIGH/MEDIUM/LOW).
   Conflicts identified. Tells you exactly what is safe to implement vs needs
   native speaker verification. 298 lines.

**Key trust levels:**
- ✅ GOLD = Burling (2003) Vol.I or II — implement with confidence
- ✅ HIGH = Multi-source confirmed or native speaker verified
- ⚠️ MEDIUM = Wikipedia / secondary sources — use with care
- ❌ LOW = Community blogs — native speaker check before adding

---

## DO NOT TOUCH (Claude B files)
```
src/pages/
src/components/
src/App.jsx
vite.config.js
public/_redirects
docs/  ← Claude B writes here, but you can READ and ADD
```

---

## QUICK TEST AFTER ANY CHANGE
```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = [
  '2 dogs', '3 people', '5 birds',
  "let's go to market", 'lets go to the market',
  'dog bit me', 'this is not good',
  'i do not understand', 'go to sleep',
  'i am eating', 'i ate rice',        // new — test progressive + past
  'my dog', 'at home',                // new — test genitive + locative
];
for (const t of tests) {
  const r = await translate(t);
  console.log(`"${t}" -> "${r.garo}" [${r.method}]`);
}
EOF
npm run build 2>&1 | tail -3
```

---

_Claude B — Platform Side_
_Reference: docs/GARO_GRAMMAR_VALIDATED.md | docs/GARO_GRAMMAR_REFERENCE.md_
