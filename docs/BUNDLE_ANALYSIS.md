# BUNDLE_ANALYSIS.md
## Lean-Garo — Bundle Size Investigation
**Author:** Claude B (Platform Side)
**Date:** 2026-06-03
**Phase:** 7 — Task C

---

## CURRENT BUNDLE MEASUREMENTS

```
dist/assets/index-D1-JixnX.js    342.41 kB  (gzip: 92.00 kB)
dist/assets/index-Cj2g7mBa.css    28.06 kB  (gzip:  5.27 kB)
dist/index.html                     0.62 kB
dist/_redirects                     0.02 kB
Total gzipped transfer:           ~97.27 kB
```

---

## DICTIONARY CONTRIBUTION

| Metric | Value |
|---|---|
| `master_dictionary.json` raw size | 203.1 kB |
| Dictionary entries | 3,186 |
| Average bytes per entry | 65 bytes |
| JS bundle total size | 336.9 kB |
| **Dictionary as % of bundle** | **60.3%** |
| Dictionary gzipped estimate | ~60.9 kB |
| Bundle gzipped actual | 92.0 kB |
| **Dictionary as % of gzipped bundle** | **~67%** |

**Finding:** The dictionary is responsible for approximately 60-67% of the entire bundle. App code (React, router, components) accounts for ~133 kB raw / ~30 kB gzipped.

---

## CAN DICTIONARY LOADING BE DEFERRED?

### Option A — Runtime fetch (recommended for growth)
Instead of bundling `master_dictionary.json` at build time, fetch it at app startup:

```js
// translationEngine.js — deferred loading
let DICT_RAW = [];
let DICTIONARY = new Map();

export async function loadDictionary() {
  const res = await fetch('/master_dictionary.json');
  DICT_RAW = await res.json();
  DICTIONARY = new Map(DICT_RAW.map(e => [e.english.toLowerCase(), e.garo]));
}
```

**Pros:**
- Bundle drops from 342 kB to ~133 kB immediately
- Dictionary can be updated without a rebuild
- Browser caches dictionary separately (long cache TTL possible)

**Cons:**
- App shows loading state on first visit (~200ms extra)
- Requires `master_dictionary.json` in `public/` folder (Render serves it)
- Needs `loadDictionary()` called before first translation

**Implementation effort:** Low — 2 file changes. Requires Chief Architect authorization.

---

### Option B — Code splitting with React.lazy (partial improvement)
Lazy-load pages so unused pages don't block initial render:

```js
const Dictionary = React.lazy(() => import('./pages/Dictionary'));
const Phrases = React.lazy(() => import('./pages/Phrases'));
const VerbsGrammar = React.lazy(() => import('./pages/VerbsGrammar'));
```

**Pros:** Faster initial load for `/` (Translator) route.
**Cons:** Dictionary is still in the shared chunk. Limited improvement (~10-15 kB).
**Effort:** Low. Does not require architecture changes.

---

### Option C — Keep current (acceptable for now)
342 kB gzipped to 92 kB is within acceptable range for a web app.
- Mobile 4G: ~0.5s load
- Desktop broadband: ~0.1s load
- Cached repeat visits: ~0ms

**Recommended threshold:** If dictionary grows past 10,000 entries (~650 kB raw), defer loading becomes necessary.

---

## UNUSED DEPENDENCIES

| Package | Bundle cost | Status |
|---|---|---|
| `fuse.js` | ~24 kB | Installed, not imported anywhere |
| `express` | ~0 kB bundled | Server-only, not in browser bundle |
| `@google/generative-ai` | ~20 kB | Imported in `gemini.js` — verify if tree-shaken |

**Action:** Either wire `fuse.js` into `searchVocabulary()` or remove from `dependencies`. Dead weight either way.

---

## GROWTH PROJECTIONS

| Dictionary size | Raw size | Gzipped bundle |
|---|---|---|
| 3,186 (current) | 203 kB | ~92 kB |
| 6,137 (garo_dictionary) | ~399 kB | ~140 kB |
| 10,000 | ~650 kB | ~210 kB |
| 20,000 | ~1.3 MB | ~400 kB ⚠️ |

**Recommendation to Chief Architect:**
Authorize Option A (runtime fetch) before merging the full 6,137-entry dictionary into master. This keeps the bundle lean as the language corpus grows.

---

## IMMEDIATE QUICK WIN (no authorization needed)

Remove or wire `fuse.js`. If wired into `searchVocabulary()`, it improves search quality with no bundle increase (already included). If unused, remove from `package.json` to reduce install time.

