# DEPLOYMENT_REVIEW.md
## Lean-Garo — Deployment Readiness Review
**Auditor:** Claude B (Platform Side)
**Date:** 2026-06-03
**Live Site:** https://lean-garo.onrender.com

---

## 1. BUILD STATUS

```
npm run build → ✅ PASSES
Output:
  dist/index.html                   0.63 kB
  dist/assets/index-DIikjCPr.css   27.34 kB (gzip: 5.15 kB)
  dist/assets/index-C9mURXVa.js   340.72 kB (gzip: 91.33 kB)
  ✓ built in 6.31s
```

Build passes cleanly. No errors. One chunk size warning (340 kB > 500 kB threshold — not yet triggered but approaching).

---

## 2. RENDER READINESS

### Static Site Configuration
| Check | Status | Detail |
|---|---|---|
| Build command | ✅ | `npm install && npm run build` |
| Publish directory | ✅ | `dist/` |
| Node version | ✅ | 22 (confirmed working) |
| SPA routing | ❌ | No `public/_redirects` file — `/dictionary` returns 404 on refresh |
| Base path | ❌ | `vite.config.js` has `base: './'` — breaks asset loading on sub-routes |
| Auto-deploy | ✅ | Connected to GitHub main branch |

### Critical Deployment Fixes Needed
```
1. vite.config.js:  base: './'  →  base: '/'
2. Create public/_redirects with:  /* /index.html 200
```
These two fixes are platform-side and can be implemented without Gemini approval.

---

## 3. ENVIRONMENT VARIABLES

### Current `.env.example`
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=production
```

### Status
| Variable | Required | Status |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Optional (AI fallback) | ⚠️ Not set on Render — AI fallback will fail silently |
| `PORT` | Server only | ✅ Render sets this automatically |
| `NODE_ENV` | Build | ✅ Render sets to `production` |

### Gemini API Integration Status
- `src/gemini.js` exists and references `VITE_GEMINI_API_KEY`
- Translator page does NOT currently call Gemini (analyzeGrammar is a stub)
- Integration path is ready but not wired into the translation flow
- **Action required by Gemini:** Set `VITE_GEMINI_API_KEY` in Render environment variables dashboard if AI fallback is needed

---

## 4. SERVER.JS ASSESSMENT

`server.js` is an Express server (port 3001) used for:
- Serving `dist/` in production
- Proxying `/translate` API calls

### Issue
Render is configured as a **Static Site** (builds and serves `dist/` directly). The Express `server.js` is not running on Render. The Vite proxy to `localhost:3001` is dev-only.

This means:
- `server.js` logic (phrase maps, exact conversation maps) is **not active on the live site**
- All translation runs through `src/translationEngine.js` (browser-side Map lookup)

**Recommendation for Gemini:** If `server.js` logic is needed in production, Render service type must change from Static Site to Web Service (`node server.js`). This is an architecture decision.

---

## 5. GITHUB ACTIONS

No `.github/workflows/` directory found in current main branch. Auto-deploy is handled by Render's GitHub integration directly (not GitHub Actions). This is acceptable for current scale.

---

## 6. DEPLOYMENT CHECKLIST

| Item | Status | Owner |
|---|---|---|
| Build passes | ✅ | — |
| `base: '/'` in vite.config | ❌ | Claude B |
| `public/_redirects` created | ❌ | Claude B |
| `VITE_GEMINI_API_KEY` set on Render | ❌ | Gemini/User |
| Dictionary search working | ❌ | Claude B (missing methods) |
| Category data populated | ❌ | Language team |
| SPA 404 on refresh fixed | ❌ | Claude B |

