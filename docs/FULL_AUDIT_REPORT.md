# LEAN-GARO — COMPLETE PLATFORM AUDIT REPORT
**Auditor:** Claude B (Senior Implementation Engineer — Platform Side)
**Date:** 2026-06-06
**Repo:** https://github.com/pzrjv4sfj5-prog/Lean-Garo-
**Live Site:** https://lean-garo.onrender.com
**Last Commit Audited:** 9de15c1

---

## EXECUTIVE SUMMARY

The platform is structurally sound with a clean build. The core translation engine functions. All 4 pages load without crashing. Routing on Render is fixed. Error boundaries are in place. The primary unresolved issue is a **data gap**: both dictionaries (3,186 master + 6,137 source) have zero category fields, which leaves the Dictionary tab's category browse permanently empty. The server-side engine (`server.js`) has far richer translation capability than the browser engine (`translationEngine.js`) but is not running in the current Render deployment.

---

## 1. BUILD STATUS

| Check | Result |
|---|---|
| `npm run build` | ✅ PASSES |
| Bundle JS | 343 kB (gzip: 92 kB) |
| Bundle CSS | 28 kB (gzip: 5 kB) |
| Build time | ~5s |
| Chunk size warning | ⚠️ None triggered yet (threshold 500 kB) |
| `public/_redirects` in dist | ✅ Confirmed |
| Asset base path | ✅ `/assets/` (absolute) |

---

## 2. ARCHITECTURE

### Two Engines in Conflict

The project has **two separate translation engines** that are not connected:

**Engine A — `src/translationEngine.js` (browser, active on Render)**
- 21-line flat `Map` lookup
- 3,186 entries from `master_dictionary.json`
- Word-by-word substitution only
- No phrase handling, no grammar, no Gemini fallback
- SVO→SOV: word-level only (no structural grammar)

**Engine B — `server.js` (Express, NOT running on Render)**
- Full sentence builder with pronouns, verbs, helper word stripping
- `exactConversationMap`, `phraseMap`, `commonPhraseMap` with 30+ entries
- Gemini AI fallback via `src/gemini.js`
- Loads `garo_dictionary.json` (6,137 entries) at runtime via `ultimateDataCrawler`
- Linguistic direction detection (`isGaroLinguisticMatch`)
- Running only in `npm start` (local dev), not in Render static site deployment

**Impact:** The live site uses the weaker browser engine. All the translation intelligence in `server.js` is unreachable in production.

---

## 3. DICTIONARY STATE

| Dictionary | Entries | Categories | Status |
|---|---|---|---|
| `master_dictionary.json` | 3,186 | 0 (zero) | Active in browser engine |
| `garo_dictionary.json` | 6,137 | 0 (zero) | Used by server.js only |
| `src/compiled_dict.json` | Present | Unknown | Not imported anywhere |
| `src/data/dictionary/conversation_patterns.json` | Present | Unknown | Not imported anywhere |

**Critical finding:** 6,137 source records exist but only 3,186 reach the browser. The 2,951 missing entries are not merged into `master_dictionary.json`. The `garo_dictionary.json` contains no `category` field on any entry — category browsing in Dictionary tab cannot function until this data is populated.

---

## 4. PAGE STATUS

### Translator (`/`)
| Feature | Status | Notes |
|---|---|---|
| Basic word translation | ✅ Works | Flat Map lookup, 3,186 entries |
| Sentence translation | ⚠️ Partial | Word-by-word only, no grammar |
| Grammar analysis | ⚠️ Stub | Returns `{ wordCount, tense: 'unknown' }` only |
| Word breakdown | ✅ Works | Shows per-word lookup |
| Swap languages | ✅ Works | UI only |
| Example phrases | ✅ Works | Static hardcoded |
| Error boundary | ✅ In place | |

### Dictionary (`/dictionary`)
| Feature | Status | Notes |
|---|---|---|
| Search (English) | ✅ Works | Returns up to 50 results |
| Search (Garo) | ✅ Works | Scans garo field |
| Search (All) | ✅ Works | |
| Category dropdown | ❌ Empty | Zero entries have `category` field |
| Category browse | ❌ Empty | No data to browse |
| Sort by English | ✅ Works | |
| Sort by Garo | ✅ Works | |
| Sort by Category | ⚠️ Works | All entries show "uncategorized" |
| Null crash protection | ✅ Fixed | |
| Error boundary | ✅ In place | |

### Phrases (`/phrases`)
| Feature | Status | Notes |
|---|---|---|
| All 9 categories | ✅ Works | Static data |
| English/Garo/Hindi display | ✅ Works | |
| Context breakdown | ✅ Works | |
| Mobile responsive | ✅ Works | |
| Error boundary | ✅ In place | |

### Grammar & Verbs (`/grammar`)
| Feature | Status | Notes |
|---|---|---|
| Verbs tab | ✅ Works | 5 verb roots, 3 tenses each |
| Classifiers tab | ✅ Works | 5 classifier types |
| Counting tab | ✅ Works | Numbers 1-1000 |
| Grammar tab | ✅ Works | 6 grammar points |
| Pronouns tab | ✅ Works | Full pronoun table |
| Error boundary | ✅ In place | |

---

## 5. ROUTING & DEPLOYMENT

| Check | Status | Notes |
|---|---|---|
| `base: '/'` in vite.config | ✅ Fixed | Assets load on all routes |
| `public/_redirects` | ✅ Created | SPA routing on Render |
| `/` loads | ✅ | |
| `/dictionary` direct URL | ✅ Fixed | Was 404 before |
| `/phrases` direct URL | ✅ Fixed | Was 404 before |
| `/grammar` direct URL | ✅ Fixed | Was 404 before |
| Browser back button | ✅ Works | React Router handles |
| Dark mode toggle | ✅ Works | |
| Mobile nav | ✅ Works | |
| Footer URL | ⚠️ Stale | Points to old Vercel URL, not Render |
| 404 route | ❌ Missing | Unknown paths render blank |

---

## 6. ERROR HANDLING

| Component | Status |
|---|---|
| `ErrorBoundary` component | ✅ Created |
| Translator wrapped | ✅ |
| Dictionary wrapped | ✅ |
| Phrases wrapped | ✅ |
| Grammar wrapped | ✅ |
| Retry button | ✅ |
| Reload page button | ✅ |
| Error logging hook | ✅ (console, ready for Sentry) |
| Dev-only error details | ✅ |
| No global `window.onerror` | ⚠️ Not set |

---

## 7. BUNDLE & PERFORMANCE

| Metric | Value |
|---|---|
| JS bundle (raw) | 343 kB |
| JS bundle (gzip) | 92 kB |
| CSS bundle (gzip) | 5 kB |
| Dictionary share of bundle | ~60% |
| `fuse.js` installed | ✅ But unused — dead weight |
| `@google/generative-ai` | Installed, not used in browser engine |
| Code splitting | ❌ None — all pages load upfront |
| Dictionary loading strategy | Bundled at build time |
| Projected bundle at 6,137 entries | ~560 kB (gzip ~150 kB) ⚠️ |

---

## 8. GITHUB ACTIONS / CI

| Check | Status |
|---|---|
| `.github/workflows/vercel-deploy.yml` | ❌ Failing — Vercel secrets not configured |
| Render deployment | ✅ Via GitHub integration directly |
| No test script in `package.json` | ⚠️ `npm test` fails with "missing script" |
| `tests/unit/translationEngine.test.js` | Exists but not wired to any runner |

---

## 9. DEAD / ORPHANED FILES

| File | Issue |
|---|---|
| `src/translator.js` | Not imported anywhere — likely orphaned |
| `src/compiled_dict.json` | Not imported anywhere |
| `src/data/dictionary/conversation_patterns.json` | Not imported anywhere |
| `expand_dictionary.py` | Script, not wired to build |
| `extract_diff.py` | Script, not wired to build |
| `final_expand.py` | Script, not wired to build |
| `split_and_extract.py` | Script, not wired to build |
| `merge_dictionaries.py` | Script, not wired to build |
| `e_map changes` | Filename with space — unclear purpose |
| `garo_dictionary (2).json` | Duplicate with space in name |
| `compile-dict.js` | Not in build pipeline |
| `test-dictionary.js` | Called in build script but unclear what it validates |

---

## 10. PRIORITY ACTION LIST FOR CHIEF ARCHITECT

### 🔴 Critical (blocks user value)
1. **6,137 → 3,186 dictionary gap** — 2,951 entries unreachable in browser. Merge `garo_dictionary.json` into `master_dictionary.json`.
2. **Category data missing** — All 9,323 combined entries have zero `category` fields. Dictionary browse is empty for all users.
3. **Server engine not running** — `server.js` has Gemini fallback, phrase maps, grammar builder. Not active on Render. Architecture decision needed: static site vs web service.

### 🟡 High (degrades experience)
4. **Grammar analysis is a stub** — Returns only `{ wordCount, tense: 'unknown' }`. Users see no useful grammar output.
5. **No 404 route** — Unknown URLs render blank page.
6. **Footer URL stale** — Points to `lean-garo-translator.vercel.app` instead of `lean-garo.onrender.com`.
7. **`fuse.js` unused** — 24 kB in bundle, zero benefit. Wire it or remove it.
8. **Vercel workflow failing** — CI broken, no automated test gate.

### 🟢 Platform (Claude B authorized to fix without approval)
9. Add `<Route path="*" element={<NotFound />} />` — 30 min.
10. Fix footer URL — 2 min.
11. Remove or wire `fuse.js`.
12. Wire test runner (`node:test`) to `npm test` script.

---

## 11. DOCS ON REPO

| Document | Location | Contents |
|---|---|---|
| `SEARCH_AUDIT.md` | root | Search system diagnosis |
| `LEARNING_ENGINE_PLAN.md` | root | Flashcard/quiz design |
| `PLATFORM_AUDIT.md` | root | React architecture audit |
| `DEPLOYMENT_REVIEW.md` | root | Render readiness |
| `USER_JOURNEY_REPORT.md` | root | 5 user type journeys |
| `docs/SEARCH_FIX_PLAN.md` | docs/ | Exact fix plan for search |
| `docs/ROUTING_VERIFICATION.md` | docs/ | Routing fix verification |
| `docs/BUNDLE_ANALYSIS.md` | docs/ | Bundle size breakdown |
| `ARCHITECTURE.md` | root | Gemini's architecture notes |
| `FIXES_APPLIED.md` | root | Historical fixes log |
| `RENDER_DEPLOY.md` | root | Deployment guide |

---

## 12. RECENT COMMIT HISTORY

| Commit | Author | Description |
|---|---|---|
| `9de15c1` | Claude B | Phase 7 — error handling, routing, bundle analysis |
| `107e11c` | Claude B | Render routing fix — base path + _redirects |
| `5cf1599` | Claude B | Merge Phase 6 PR |
| `d7b3205` | Claude B | Phase 6 — search methods, ErrorBoundary, null safety |
| `4138149` | Claude B | 5-phase audit docs |
| `a06e717` | ChatGPT/Gemini | Update translationEngine.js |
| `f8c61a5` | ChatGPT/Gemini | Consolidate dictionary, optimize engine |

---

*Audit complete. No dictionary content, grammar data, or translation logic was modified in the production of this report.*

**Claude B — Platform Side**
