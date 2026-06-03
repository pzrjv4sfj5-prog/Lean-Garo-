# SEARCH_AUDIT.md
## Lean-Garo — Search System Audit
**Auditor:** Claude B (Platform Side)
**Date:** 2026-06-03
**Repo:** https://github.com/pzrjv4sfj5-prog/Lean-Garo-

---

## 1. CURRENT STATE

### Engine (`src/translationEngine.js`)
The current engine exports:
- `translate(text)` — works, flat Map lookup
- `translateSentence(text, inputLang, outputLang)` — works, wrapper
- `analyzeGrammar(text, language)` — works, stub
- `getDictionarySize()` — works, returns 3186

**Missing exports (confirmed by runtime test):**
- `getAllCategories` — `undefined`
- `searchVocabulary` — `undefined`
- `getCategoryVocabulary` — `undefined`

### Dictionary (`master_dictionary.json`)
- Total entries: **3,186**
- Entries with `category` field: **0 (zero)**
- All entries have structure: `{ english, garo }` only
- No `part_of_speech`, no `category`, no `notes`

---

## 2. WHY SEARCH IS INCOMPLETE

### Root Cause 1 — Missing Methods
`Dictionary.jsx` calls three methods that do not exist on the engine:
```js
translationEngine.getAllCategories()     // → undefined → crash
translationEngine.searchVocabulary()    // → undefined → crash
translationEngine.getCategoryVocabulary() // → undefined → crash
```
When Dictionary.jsx loads, `useMemo(() => translationEngine.getAllCategories(), [])` throws a TypeError. The category dropdown is empty. Search returns nothing.

### Root Cause 2 — No Category Data
Even if the methods were implemented, `master_dictionary.json` has zero `category` fields. Category browsing cannot work until entries are tagged. This is a data layer problem, not a platform problem.

### Root Cause 3 — `vite.config.js` base path
`base: './'` causes asset loading failures on sub-routes (`/dictionary`, `/grammar`) in production on Render. Assets load as `./assets/file.js` which breaks when navigating away from root. Should be `base: '/'`.

### Root Cause 4 — No Garo-side search
`Dictionary.jsx` has a "Garo Only" search option. The engine's `Map` is keyed on English. Garo-side search requires a reverse map or a scan loop over `DICT_RAW`. Neither exists.

---

## 3. MISSING LOGIC

| Method | Status | What's needed |
|---|---|---|
| `getAllCategories()` | Missing | Scan DICT_RAW, collect unique `category` values |
| `searchVocabulary(q, lang)` | Missing | Filter DICT_RAW by query, support `english`/`garo`/`all` lang param |
| `getCategoryVocabulary(cat)` | Missing | Filter DICT_RAW where `entry.category === cat` |
| Garo reverse search | Missing | Second Map keyed on garo.toLowerCase() |
| Category data | Missing | All 3,186 entries need `category` field populated |

---

## 4. PERFORMANCE CONCERNS

| Concern | Severity | Detail |
|---|---|---|
| Linear scan on search | Medium | `searchVocabulary` will iterate all 3,186 entries per keystroke. Acceptable now, risk at 10k+ entries. `fuse.js` is already installed — should be used. |
| Bundle size | Medium | Current JS bundle: **340.72 kB** (gzip: 91.33 kB). `master_dictionary.json` is bundled at build time. As dictionary grows this will grow. |
| `fuse.js` installed but unused | Low | `fuse.js ^7.3.0` is in `dependencies` but not imported anywhere in the codebase. Fuzzy search capability is wasted. |
| No pagination | Low | No limit on search results. 3,186 entries all returned at once possible. |
| No debounce on search input | Low | `Dictionary.jsx` fires `useMemo` on every keystroke with no debounce. |

---

## 5. RECOMMENDED FIXES (Platform Side Only)

These are implementation tasks, not architecture changes:

1. **Add 3 missing methods to `translationEngine.js`** — adapter pattern, no core changes
2. **Fix `vite.config.js` base path** — `'./'` → `'/'`
3. **Add `public/_redirects`** — SPA routing fix for Render
4. **Wire `fuse.js`** into `searchVocabulary()` for fuzzy matching
5. **Add debounce** to search input in `Dictionary.jsx`
6. **Add result limit** (default 50) to prevent UI overload

**Not Claude B's responsibility:**
- Populating `category` fields in `master_dictionary.json` (language/dictionary content)
- Deciding which categories to use (architecture/language decision)

---

## 6. IMPACT SUMMARY

| Feature | Status |
|---|---|
| Translate tab — basic translation | ✅ Working |
| Translate tab — grammar analysis | ⚠️ Stub only (returns hardcoded notes) |
| Dictionary tab — search | ❌ Broken (missing methods) |
| Dictionary tab — category browse | ❌ Broken (missing methods + no category data) |
| Phrases tab | ✅ Working (static data) |
| Grammar tab | ✅ Working (static data) |
| Sub-route navigation on Render | ❌ Broken (base path `'./'` issue) |
