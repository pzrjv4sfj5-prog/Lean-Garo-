# PLATFORM_AUDIT.md
## Lean-Garo — Platform Architecture Audit
**Auditor:** Claude B (Platform Side)
**Date:** 2026-06-03

---

## 1. REACT ARCHITECTURE

### Current Structure
```
src/
  App.jsx              — Router, nav, layout (315 lines combined with nav)
  main.jsx             — React entry point
  index.css            — Global styles
  translationEngine.js — Engine + adapters
  gemini.js            — Gemini AI integration
  garo_classifier.js   — Classifier logic
  number_engine.js     — Number handling
  translator.js        — Legacy translator (may be orphaned)
  pages/
    Translator.jsx     — 315 lines
    Dictionary.jsx     — 147 lines
    Phrases.jsx        — 226 lines
    VerbsGrammar.jsx   — 447 lines
  data/
    classifiers.json
    corrections.json
    grammar.json
    numbers.json
```

### Assessment

| Item | Status | Finding |
|---|---|---|
| Component separation | ✅ Good | Pages are cleanly separated |
| Routing | ✅ Good | React Router v6, correct setup |
| State management | ✅ Adequate | Local useState, no unnecessary complexity |
| Props drilling | ✅ Clean | No deep prop chains observed |
| Side effects | ⚠️ Minor | `useMemo` in Dictionary called without null guard |
| Dead code | ⚠️ Possible | `src/translator.js` — unclear if used |
| VerbsGrammar.jsx | ⚠️ Large | 447 lines — consider splitting into components |

---

## 2. ROUTING

### Current Routes
```
/              → Translator.jsx
/dictionary    → Dictionary.jsx
/phrases       → Phrases.jsx
/grammar       → VerbsGrammar.jsx
```

### Issues
- **No 404 route** — unknown paths render nothing
- **No loading states** — pages render immediately, no suspense
- **Sub-route refresh breaks on Render** — `base: './'` in vite.config.js causes 404 on direct URL access

### Recommended Additions (pending Gemini approval)
```jsx
<Route path="*" element={<NotFound />} />
```

---

## 3. COMPONENT STRUCTURE

### Missing Components (needed for scale)
| Component | Purpose | Priority |
|---|---|---|
| `LoadingSpinner.jsx` | Consistent loading UI | Medium |
| `ErrorBoundary.jsx` | Catch render errors gracefully | High |
| `NotFound.jsx` | 404 page | Medium |
| `WordCard.jsx` | Reusable word display | Low |
| `SearchBar.jsx` | Reusable search input | Low |

### Existing Issues
- `Dictionary.jsx` line 32: `results.sort((a, b) => a.category.localeCompare(b.category))` — will crash if `category` is undefined (which it will be since no entries have categories)
- `Translator.jsx` calls `translationEngine.analyzeGrammar()` which is async but result is used synchronously in some paths
- No `ErrorBoundary` wrapping pages — one crash takes down the whole UI

---

## 4. PERFORMANCE

### Bundle Analysis
```
dist/assets/index-C9mURXVa.js   340.72 kB  (gzip: 91.33 kB)
dist/assets/index-DIikjCPr.css   27.34 kB  (gzip:  5.15 kB)
```

| Item | Finding |
|---|---|
| JS bundle | 340 kB is large. Primary cause: `master_dictionary.json` (3,186 entries) bundled inline |
| `fuse.js` bundled but unused | Dead weight in bundle — ~24 kB |
| No code splitting | All 4 pages loaded upfront. Could use `React.lazy()` |
| No image assets | Not an issue currently |
| Dictionary in bundle | Risk: as dictionary grows past 10k entries, bundle will exceed 500 kB warning threshold |

### Recommendations
1. Lazy-load pages with `React.lazy()` + `Suspense`
2. Either use or remove `fuse.js`
3. Consider fetching `master_dictionary.json` at runtime instead of bundling

---

## 5. IDENTIFIED BUGS (Platform Side)

| Bug | Location | Severity | Description |
|---|---|---|---|
| Missing methods | `translationEngine.js` | Critical | `getAllCategories`, `searchVocabulary`, `getCategoryVocabulary` not exported |
| Null crash | `Dictionary.jsx:32` | High | `a.category.localeCompare` crashes when category is undefined |
| Wrong base path | `vite.config.js` | High | `base: './'` breaks sub-route navigation on Render |
| No SPA redirect | `public/` | High | No `_redirects` file — Render returns 404 on refresh of `/dictionary` etc |
| Dead file | `src/translator.js` | Low | Unclear if this file is imported anywhere |
| No error boundary | `App.jsx` | Medium | No crash protection around pages |

