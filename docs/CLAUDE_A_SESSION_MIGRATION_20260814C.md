# Claude A — Session Migration Document — 2026-08-14 (C)

## Resume protocol followed
Resumed via user-pasted pointer to
`docs/CLAUDE_A_SESSION_MIGRATION_20260814B.md` + live PAT + the 4-key
table (always/answer/a dog bit me/are you sleeping). Cloned, `git fetch`
confirmed HEAD == `origin/main` == `80c239a`, clean tree — zero drift
from that doc's own close checklist.

Cross-referenced `.ai/WORKSTATE.yaml`'s `claude_b.current_task` (the
"Claude B flag") and `docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md`:
Claude B had correctly refused to apply these same 4 keys from an
unverified chat message per role-boundary discipline, reverted its
mistaken edit, and left them as an evidence package for Claude A. The
user's pasted table this session is the Project Owner directly
supplying that same input **in this Claude A session** — the
recognized channel (Claude A's own commit / native relay via Claude A)
per `.ai/SESSION_BOOTSTRAP.md` "Roles."

## Task this session
Close the 4-key evidence package as **NV-077** (Project Owner direct
native relay, in-session).

## What was done
- **always** = `Pangnan` — un-superseded, promoted VERIFIED/HIGH.
  Reverses the 2026-08-01 audit's tag (its replacements `jring·jring`/
  `pang·na` had no NV citation); those two marked CONTESTED, not
  deleted.
- **answer** — resolved as a POS split, not a competing-value conflict:
  noun = `Aganchakani` (already VERIFIED/HIGH, notes annotated), verb =
  `Aganchaka` (un-superseded, promoted VERIFIED/HIGH).
- **a dog bit me** = `Angko achak chikaha` — new VERIFIED/HIGH entry,
  supersedes untagged legacy `An·tangko achik chanjok`.
  `corrections.json` synced (word order).
- **are you sleeping** = `Na·a tusiengama?` — corrects dropped-`si` in
  the prior `Na·a tuengama?` entry (now SUPERSEDED). `corrections.json`
  synced (spacing).
- Logged as NV-077 in `docs/THANGSENG_NATIVE_VALIDATION.md`.
- 2 new Check C conflicts (a dog bit me, are you sleeping — expected,
  old-vs-new value pairs) allowlisted in
  `src/data/known_dictionary_conflicts.json` with citation.

Commit: `d28882b` — "NV-077: close always/answer/a dog bit me/are you
sleeping (Project Owner direct relay)".

## Deliberately not touched
The `angry`/`ka·o·nang·a` raka-count question from the same handoff doc
— not part of this session's 4-item table, still open.

## Verification (full chain, re-run after commit)
- `node prepare-data.js` — 8,299 → **8,299** (no new unique keys; all
  4 items were value/annotation edits to existing keys)
- `node test-dictionary.js` — **8,299/8,299** valid, 9/9 corrections
- `node repository-intelligence.js` — **0 new violations** all checks
  (Check C: 2 new conflicts appeared, allowlisted with citation, then
  re-ran clean)
- `node --test tests/unit/*.test.js` — **203/203 pass**
- `npm run build` (prepare-data → test-dictionary →
  repository-intelligence → 203/203 unit → `vite build`) — fully clean
  end-to-end
- Runtime spot-check: `translate('answer')` → `Aganchaka`
  (`method: correction, confidence: 1`) — confirms `corrections.json`
  wins at runtime even though `compiled_dict.json['answer']` still
  shows the untouched UNVERIFIED `a·gan·chak·a` candidate (known
  pickPrimary-precedence class, not a new bug, not fixed here —
  Claude B's territory, not re-flagged since it doesn't affect runtime
  output for this key)
- Incidental `dist/index.html` diff from the local `vite build` run
  reverted via `git checkout -- dist/index.html`, tree confirmed clean

## Open items
**None from this session's task.** Carried forward, not touched:
- `angry`/`ka·o·nang·a` raka-count question (see handoff doc)
- All other long-standing open items unchanged from prior migration
  docs (person/student/teacher root conflict, coin root, etc.)

## Repository status at close
- HEAD: `d28882b0e7360495eb156b12681cf993e2dde60b`
- `origin/main`: matches HEAD exactly (`git fetch` + compared)
- `git status`: clean, no uncommitted changes, no local-only commits
- `WORKSTATE.yaml`: not touched this session (Claude A's own
  `current_task`/`latest_*` fields are historical narrative already
  closed out in prior entries; this doc is the authoritative record —
  update on next session if Project Owner wants a WORKSTATE append)
- `SESSION_BOOTSTRAP.md`: no rule changes this session, not touched
- Migration doc: this document, complete
- Native-validation/blocker status: none from this session's task;
  `angry` raka question remains the one open native-validation item

## PAT handling
Supplied live by Project Owner this session. Used inline in
clone/push URLs only. Never written to git config, commit content, or
any tracked file.
