# ROUTING_VERIFICATION.md
## Lean-Garo — Route Hardening Verification
**Author:** Claude B (Platform Side)
**Date:** 2026-06-03
**Phase:** 7 — Task A

---

## FIXES APPLIED

| Fix | Before | After |
|---|---|---|
| `vite.config.js` base | `'./'` | `'/'` |
| `public/_redirects` | Missing | `/* /index.html 200` |

---

## ROUTE VERIFICATION MATRIX

| Route | Direct URL | Refresh | Back Button | Status |
|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | Translator loads |
| `/dictionary` | ✅ | ✅* | ✅ | Dictionary loads |
| `/phrases` | ✅ | ✅* | ✅ | Phrases loads |
| `/grammar` | ✅ | ✅* | ✅ | Grammar loads |

*Routes with `*` were returning 404 on refresh before `_redirects` was added.

---

## HOW EACH FIX WORKS

### `vite.config.js` — `base: '/'`

**Before:** `base: './'`
Generated assets loaded as relative paths:
```html
<script src="./assets/index-abc.js"></script>
```
When navigating to `/dictionary`, browser resolved this as:
```
https://lean-garo.onrender.com/dictionary/assets/index-abc.js
```
Result: 404 on all sub-routes.

**After:** `base: '/'`
Assets load as absolute paths:
```html
<script src="/assets/index-abc.js"></script>
```
Always resolves from root regardless of current route.

---

### `public/_redirects`

**Before:** Render served files from `dist/`. Visiting `/dictionary` directly looked for `dist/dictionary/index.html` — which does not exist. Result: 404.

**After:** Render reads `dist/_redirects`:
```
/*    /index.html   200
```
All routes serve `dist/index.html`. React Router then handles routing client-side.

---

## VERIFIED BUILD OUTPUT

```
dist/index.html                   0.62 kB
dist/assets/index-Cj2g7mBa.css   28.06 kB (gzip: 5.27 kB)
dist/assets/index-D1-JixnX.js   342.41 kB (gzip: 92.00 kB)
dist/_redirects                   0.02 kB
✓ built in 2.86s
```

Asset src in built HTML:
```html
<script type="module" crossorigin src="/assets/index-D1-JixnX.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-Cj2g7mBa.css">
```
Absolute paths confirmed ✅

---

## REMAINING ROUTING CONCERN

`server.js` (Express) is not running on Render in the current static site deployment. If the deployment mode is changed to Web Service, a separate Express catch-all route would be needed:
```js
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));
```
This is already present in `server.js` and would work correctly.
Architecture decision on deployment mode belongs to ChatGPT/Chief Architect.

