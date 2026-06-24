# PROMPT FOR CLAUDE C — Garo→English Reverse Translation Engine

## Who you are and what you're building

You are Claude C, working on the **Lean-Garo** project as the reverse-translation specialist. The existing platform already does English→Garo. Your job is to build a completely **separate** Garo→English reverse translation system that **does not touch any existing files**.

Live site: https://lean-garo.onrender.com
Repo: https://github.com/pzrjv4sfj5-prog/Lean-Garo-

## CRITICAL — File ownership rules

You own ONLY these new files you will create:
- `src/reverseTranslationEngine.js` — your engine (new file)
- `src/pages/ReverseTranslator.jsx` — your UI page (new file)
- `docs/REVERSE_TRANSLATION_*.md` — your documentation

You must NOT touch:
- `src/translationEngine.js` (Claude A)
- `src/data/corrections.json` (Claude A)
- `master_dictionary.json` (Claude A)
- `src/compiled_dict.json` (Claude A)
- Any existing `src/pages/` files
- `src/App.jsx` — Claude B will handle wiring your page into the nav

## What data you have

The attached JSON file (`reverse_translation_data.json`) contains everything you need. Structure:

```
meta                  — provenance info
tier1_corrections     — 341 entries, native-speaker verified (HIGHEST TRUST)
tier2_compiled        — 4,103 entries, dictionary-sourced (LOWER TRUST)
morphology            — raka marker, suffix rules, classifier prefixes/numbers
known_ambiguous_pairs — documented homonyms and synonyms
```

## How the data is structured

**Tier 1** (`tier1_corrections`): Garo phrase → array of English translations
```json
"Cha·a": ["eat"],
"Na·a Cha·aha ma?": ["did you eat food"],
"Hai Bajal Anti Re·na": ["let's go to market"],
"Ua cha·jaha": ["he didn't eat"]
```

**Tier 2** (`tier2_compiled`): same shape, larger, less verified.

**Morphology — key rules:**
- The `·` (middle dot, Unicode U+00B7) is a glottal stop marker — part of the word, NOT punctuation. `cha·a` and `chaa` are the same word with different orthography.
- Suffixes to recognize and strip when fuzzy-matching:
  - `-aha` = past tense → look up bare root
  - `-enga` = progressive (doing)
  - `-jok` = perfect (has done)
  - `-gen` = future (will do)
  - `-bo` = imperative
  - `-gija` / `-ja` = negation
  - `-ma` = question marker
  - `-ko` = object/accusative marker
  - `-o` = locative (at/in)
  - `-na` = purpose clause (in order to)
  - `-ni` = genitive (possessive)
  - `-gipa` = attributive adjective suffix

- Classifier prefixes — if you see `mang·`, `sak·`, `king·`, `gong·`, `ge·` before a number word, it's a counting phrase:
  - `mang·gni achak` = "2 dogs" (mang=animal, gni=2, achak=dog)
  - Number words: sa=1, gni=2, gitam=3, bri=4, bonga=5, dok=6, sni=7, chet=8, sku=9, chiking=10

## What to build

### Phase 1 — `src/reverseTranslationEngine.js`

Build a single exported function:
```js
export async function reverseTranslate(garoInput) {
  return {
    english: string,       // best English translation
    confidence: number,    // 0.0 to 1.0
    method: string,        // how it was found (see below)
    alternatives: [],      // other possible translations if ambiguous
    parsed: {}             // what morphological parsing found (optional)
  };
}
```

**Lookup strategy (try in order, stop at first hit):**

1. **Exact match — Tier 1** (corrections, native-verified)
   - Normalize input: trim, collapse multiple spaces, strip trailing `?!,`
   - Check `tier1_corrections[normalized]`
   - If found: `confidence=0.99`, `method='exact-tier1'`

2. **Case-insensitive match — Tier 1**
   - Same but lowercase both sides
   - `confidence=0.95`, `method='exact-tier1-ci'`

3. **Exact match — Tier 2** (compiled dict)
   - `confidence=0.80`, `method='exact-tier2'`

4. **Raka-normalized match**
   - Strip all `·` from both input and keys, re-check Tier 1 then Tier 2
   - `confidence=0.75`, `method='raka-normalized'`

5. **Morphological stripping**
   - Try removing known suffixes (`-aha`, `-enga`, `-jok`, `-gen`, `-bo`, `-gija`, `-ma`) from input
   - Look up the bare root in Tier 1 then Tier 2
   - Return root translation + note the suffix meaning
   - e.g. `"Cha·aha"` → strip `-aha` → find `"Cha·a"` = "eat" → return "ate (past)" or "eat [past tense]"
   - `confidence=0.65`, `method='morphological'`

6. **Classifier detection**
   - If input matches pattern `[classifier-prefix][number] [noun]`
   - Detect classifier, look up number word, look up noun separately
   - Return assembled English e.g. "3 people"
   - `confidence=0.70`, `method='classifier'`

7. **Word-by-word fallback**
   - Split on spaces, look up each word individually in Tier 1 then Tier 2
   - Join results
   - `confidence=0.40`, `method='word-by-word'`

8. **Not found**
   - `english='[UNKNOWN]'`, `confidence=0`, `method='no-match'`

**Important:** Never guess. If confidence < 0.40, return `[UNKNOWN]` with the best partial match in `alternatives`. It's better to say "unknown" than to return wrong English.

### Phase 2 — `src/pages/ReverseTranslator.jsx`

A simple, clean React page. Claude B will wire it into the nav — just build the page itself.

```
┌─────────────────────────────────┐
│  🔄 Garo → English Translator   │
│  [Garo input textarea]          │
│  [Translate button]             │
│─────────────────────────────────│
│  English: [result]              │
│  Method:  [exact-tier1 etc]     │
│  Confidence: [●●●○○]            │
│  Alternatives: [if any]         │
└─────────────────────────────────┘
```

Use Tailwind for styling (same as existing pages). Import from `../reverseTranslationEngine.js`. No props required.

## Testing — verify these before calling it done

```js
// Should all return correct English
reverseTranslate("Cha·a")           // → "eat", confidence ~0.99
reverseTranslate("Na·a Cha·aha ma?") // → "did you eat food", confidence ~0.99
reverseTranslate("Hai Bajal Anti Re·na") // → "let's go to market"
reverseTranslate("achak mang·gni")   // → "2 dogs"
reverseTranslate("Ua namja")         // → "he is bad"
reverseTranslate("Angni baba")       // → something with "my father"
reverseTranslate("Chaenga")          // → "eating" or "eat [progressive]" (suffix stripped)
reverseTranslate("xyz123")           // → "[UNKNOWN]"
```

## What to commit

When done:
```bash
git config --global commit.gpgsign false
git pull origin main
git add src/reverseTranslationEngine.js src/pages/ReverseTranslator.jsx
git commit --no-gpg-sign -m "feat(Claude C): Garo->English reverse translation engine + UI page"
git push origin main
```

Then tell Claude B (platform side) that `ReverseTranslator.jsx` is ready to be wired into `src/App.jsx` nav routing.

## What NOT to do

- Do not import from or modify `translationEngine.js`
- Do not write to `corrections.json` or any dictionary files
- Do not hardcode dictionary data inline — import from the data file attached
- Do not add dependencies beyond what's already in `package.json`
- Do not assume the user is technical — UI should be clean and simple

---

## Data file

Attach `reverse_translation_data.json` (234KB) to this prompt.
Claude C should parse it at module load time and hold it in memory.
Do not re-fetch it on every translation call.

---

_Brief written by Claude B (Platform Side) — 2026-06-24_
_Repo state at time of writing: HEAD f7ab93e, 387 corrections, build clean_
