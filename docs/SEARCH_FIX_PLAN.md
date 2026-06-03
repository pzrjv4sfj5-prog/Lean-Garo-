# SEARCH_FIX_PLAN.md
## Lean-Garo — Search Infrastructure Fix Plan
**Author:** Claude B (Platform Side)
**Date:** 2026-06-03
**Status:** PLAN ONLY — not implemented

---

## 1. DIAGNOSTIC ANSWER

**Question:** Do the functions exist but are not exported, OR did they never exist?

**Answer: B — They never existed.**

Full codebase grep confirms:
```
grep -rn "getAllCategories|searchVocabulary|getCategoryVocabulary" src/
```

Results — only found in:
```
src/pages/Dictionary.jsx:10  → translationEngine.getAllCategories()   [CALL SITE]
src/pages/Dictionary.jsx:20  → translationEngine.searchVocabulary()  [CALL SITE]
src/pages/Dictionary.jsx:22  → translationEngine.getCategoryVocabulary() [CALL SITE]
```

They are called but **never defined anywhere** in the codebase.
`src/translationEngine.js` exports only:
- `translate`
- `translateSentence`
- `analyzeGrammar`
- `getDictionarySize`

---

## 2. CURRENT FAILURE MODE

When `Dictionary.jsx` mounts:
```js
const categories = useMemo(() => translationEngine.getAllCategories(), [])
```
`translationEngine.getAllCategories` is `undefined`.
Calling `undefined()` throws `TypeError: translationEngine.getAllCategories is not a function`.

Without an `ErrorBoundary`, this crash propagates and the Dictionary page renders blank.

---

## 3. WHAT EACH FUNCTION NEEDS TO DO

### `getAllCategories()`
- **Purpose:** Return sorted array of unique category strings for the dropdown
- **Input:** None
- **Output:** `string[]` e.g. `['animals', 'family', 'food', 'nature', ...]`
- **Data source:** `DICT_RAW` (master_dictionary.json — 3,186 entries)
- **Constraint:** Zero entries in `master_dictionary.json` have a `category` field currently
- **Implication:** Will return `[]` until Gemini/Claude A populates category data
- **Platform fix:** Implement the function correctly so it works as data arrives

```js
function getAllCategories() {
  const cats = new Set();
  for (const entry of DICT_RAW) {
    if (entry.category) cats.add(entry.category);
  }
  return Array.from(cats).sort();
}
```

---

### `searchVocabulary(query, lang, limit)`
- **Purpose:** Return matching entries for a search query
- **Input:** `query: string`, `lang: 'english'|'garo'|'all'`, `limit: number = 50`
- **Output:** `Array<{ english: string, garo: string, category: string }>`
- **Data source:** `DICT_RAW`
- **Search modes:**
  - `lang = 'english'` → match `entry.english`
  - `lang = 'garo'` → match `entry.garo`
  - `lang = 'all'` → match either
- **fuse.js available** — installed in dependencies, not yet used. Should be wired here for fuzzy matching
- **Null safety:** entries without `category` must default to `'uncategorized'`

```js
function searchVocabulary(query, lang = 'all', limit = 50) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results = [];
  for (const entry of DICT_RAW) {
    const matchEn = entry.english.toLowerCase().includes(q);
    const matchGa = entry.garo.toLowerCase().includes(q);
    const match = lang === 'english' ? matchEn
                : lang === 'garo'    ? matchGa
                : matchEn || matchGa;
    if (match) {
      results.push({
        english:  entry.english,
        garo:     entry.garo,
        category: entry.category || 'uncategorized',
      });
      if (results.length >= limit) break;
    }
  }
  return results;
}
```

---

### `getCategoryVocabulary(category)`
- **Purpose:** Return all entries for a specific category
- **Input:** `category: string`
- **Output:** `Array<{ english: string, garo: string, category: string }>`
- **Data source:** `DICT_RAW`
- **Null safety:** entries without category field must default to `'uncategorized'`

```js
function getCategoryVocabulary(category) {
  return DICT_RAW
    .filter(e => (e.category || 'uncategorized') === category)
    .map(e => ({
      english:  e.english,
      garo:     e.garo,
      category: e.category || 'uncategorized',
    }));
}
```

---

## 4. NULL CRASH POINTS IN Dictionary.jsx

Two crash points identified beyond the missing methods:

### Crash Point A — Line 30
```js
results.sort((a, b) => a.category.localeCompare(b.category))
```
If any result has `category: undefined`, `.localeCompare()` throws.
**Fix:** `(a.category || '').localeCompare(b.category || '')`

### Crash Point B — Line 122
```js
{item.category.replace(/[_.]/g, ' ')}
```
If `item.category` is `undefined`, `.replace()` throws.
**Fix:** `{(item.category || 'uncategorized').replace(/[_.]/g, ' ')}`

---

## 5. ADDITIONAL PLATFORM ISSUES TO FIX IN SAME PR

These were identified in my Phase 1-5 audits and are in scope for platform hardening:

| Fix | File | Risk |
|---|---|---|
| Add `ErrorBoundary` | `src/App.jsx` + new component | Zero — additive only |
| Fix `vite.config.js` base path | `vite.config.js` | Low — `'./'` → `'/'` |
| Add `public/_redirects` | `public/_redirects` | Zero — new file |
| Add debounce to search input | `src/pages/Dictionary.jsx` | Low |
| Add result limit display | `src/pages/Dictionary.jsx` | Zero |
| Wire `fuse.js` into searchVocabulary | `src/translationEngine.js` | Low |

---

## 6. IMPLEMENTATION ORDER (when authorized)

1. Create `src/components/ErrorBoundary.jsx`
2. Wrap pages in `ErrorBoundary` in `App.jsx`
3. Add 3 missing functions to `translationEngine.js`
4. Add exports for 3 functions to default export object
5. Fix 2 null crash points in `Dictionary.jsx`
6. Fix `vite.config.js` base path
7. Create `public/_redirects`
8. Test build, verify no regressions
9. Push to `feat/phase6-platform-hardening` branch
10. Open PR for Gemini review

---

## 7. WHAT THIS DOES NOT TOUCH

- `master_dictionary.json` — no changes
- `garo_dictionary.json` — no changes
- Core `translate()` function logic — no changes
- Grammar data — no changes
- Language content of any kind — no changes

