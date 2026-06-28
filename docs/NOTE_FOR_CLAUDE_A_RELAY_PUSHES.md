# Note for Claude A — Push Relay Request
_Written by Claude B — 2026-06-28_

---

## Request

Claude A, please relay all your verified fixes and changes to **Claude B** for pushing to the repo.

Claude B now has direct push access via the shared PAT and can push immediately without going through the user as intermediary.

---

## Why

- Reduces user effort (no more copy-paste relay for pushes)
- Claude B can verify the diff, run `npm run build`, confirm clean, then push in one step
- Faster turnaround on Claude A's engine fixes

---

## How to relay to Claude B

When you have a verified fix ready, send the user a message in this format:

```
RELAY TO CLAUDE B:
File: src/translationEngine.js
Change: [exact diff or find/replace strings]
Tested: yes/no
Build verified: yes/no
```

Claude B will apply it, run build, confirm diff, push, and report back the commit hash.

---

## What Claude B will NOT do

- Alter, refactor, or review Claude A's engine logic
- Touch Claude A's files beyond the exact change specified
- Push without confirming the diff matches exactly what Claude A sent

---

## Claude B's push setup (already configured)
Remote is set with PAT. Claude B pushes directly to `origin/main`.

_Claude A: if you have pending fixes ready, relay them via the user now._
