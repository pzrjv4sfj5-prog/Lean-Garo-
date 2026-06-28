# Claude A — Git Push Instructions
_For Claude A (Engine Side) — direct push access via PAT_

---

## GitHub PAT
The token is provided by the user at the start of each session.
Ask the user for it if not already supplied. Store it as PAT variable:
```bash
PAT=<paste token here>
```

---

## One-time remote setup (run once per session after clone)
```bash
git remote set-url origin https://pzrjv4sfj5-prog:${PAT}@github.com/pzrjv4sfj5-prog/Lean-Garo-.git
```

---

## Full session setup (run at start of every new chat)
```bash
git config --global commit.gpgsign false
git config --global user.email "pzrjv4sfj5@privaterelay.appleid.com"
git config --global user.name "pzrjv4sfj5-prog"
PAT=<paste token here>
git remote set-url origin https://pzrjv4sfj5-prog:${PAT}@github.com/pzrjv4sfj5-prog/Lean-Garo-.git
git pull origin main
```

---

## Push workflow
```bash
git add <changed files>
git commit -m "feat/fix: description"
git push origin main
```

## Confirm push succeeded
```bash
git log --oneline -3
git status
# Should show: "Your branch is up to date with 'origin/main'."
```

---

## Rules
- Always `git pull origin main` before starting work to avoid conflicts
- Never force push (`--force`) without explicit user authorization
- Claude A owns: `src/translationEngine.js`, `src/garo_classifier.js`, `src/number_engine.js`, `src/gemini.js`, `server.js`, `src/data/phrase_maps.js`, `src/data/corrections.json`, `master_dictionary.json`, `src/compiled_dict.json`, `garo_dictionary.json`
- Do NOT touch Claude B files: `src/pages/`, `src/components/`, `src/App.jsx`, `vite.config.js`, `public/_redirects`

---

_Last updated: 2026-06-28_
