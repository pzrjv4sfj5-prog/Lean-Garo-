# Claude A Session Migration Document — 2026-08-10 (thread close)

## Project identity

Lean-Garo: Garo language dictionary and English-to-Garo translation
engine. `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Claude A role:
linguistic authority only (grammar, morphology, dictionary quality,
native validation review). Never touches engine code (Claude B) or
OCR ingestion (Claude D).

**Read `.ai/SESSION_BOOTSTRAP.md`'s new "Permanent workstyle" section
first** — this session established it; it changes what a new session
should and shouldn't read on resume.

## Current state

- **HEAD:** `e1cee43`
- **origin/main:** matches exactly, verified via `git fetch` +
  `git rev-parse` immediately before writing this document
- **git status:** clean, nothing uncommitted, nothing local-only
- **Entries:** 9182/9182 in `master_dictionary.json`, 8085 unique
  compiled keys
- **Tests:** 196/196 passing
- **repository-intelligence.js:** PASSED, 0 new violations (A–F)

## What was done this session (checkpoint `1aad3fe` → `e1cee43`, 7 commits)

Superseded by `docs/CLAUDE_A_SESSION_MIGRATION_20260810.md` for commits
1–4 (`cd3e22e` through `5114846` — NV-070 full round, NV-071 10-item
relay, rimila/sendil raka correction, three/four-dogs legacy-bug fix).
This document covers the three commits since:

5. **`92a9170`** — Closed NV-071 open question #1: `Iachi`/`Uachi` vs.
   `Ianona` (here/there) was never a conflict — both pairs are
   locative and translate the same in English; `-chi` adds a
   directional/"towards" nuance the `-na` forms don't carry. Added 4
   new standalone entries, updated 2 sentence entries' notes, added a
   dated RULE-044 native_notes follow-up.
6. **`e1cee43`** — Closed NV-071 open question #2: `ka·atbo` vs
   `ka·bo`, closed by Thangseng at MEDIUM confidence with an explicit
   hedge ("I could be wrong"). Recorded in the two affected entries'
   notes only — not promoted to a standalone rule, insufficient
   evidence. Also established the permanent `SESSION_BOOTSTRAP.md`
   workstyle change (see below).

**Both NV-071 open questions are now closed.** Zero open linguistic
questions from this session remain — see "Held" below for the one
pre-existing, unrelated item still outstanding.

## Held / not resolved (pre-existing, not from this session)

1. **Claude B — smile bug.** Re-diagnosed 2026-08-08 (see
   `docs/CLAUDE_B_HANDOFF_20260809_smile_alias_gap.md`). Root cause:
   `main()`'s bare-infinitive alias gap-fill in `prepare-data.js`
   never overwrites an existing lower-confidence value. Not
   implemented — engine code, Claude B's territory.
2. **RULE-044's pre-existing open item**: whether `banona`'s `-na`
   suffix is the same mechanism as `Ianona`/`Uanona`'s `-na`. This
   session's Iachi/Ianona resolution didn't speak to this — still
   flagged in RULE-044, not claimed.
3. **`five dog(s)`/`fourteen dog`** — same legacy classifier-corruption
   shape as the three/four-dogs bug fixed this session, but not
   confirmed by any relay. Left untouched.

## Permanent workstyle change (Project Owner directive, 2026-08-10)

`.ai/SESSION_BOOTSTRAP.md` had grown to ~1900 lines of narrative
session write-ups, re-read in full by every new session since it's the
mandatory first read — compounding token cost forever. New permanent
section added there: this file is current-rules-only going forward,
not a running log. Concretely:

- No more narrative "session close" write-ups appended to
  `SESSION_BOOTSTRAP.md` — that goes in `.ai/WORKSTATE.yaml`'s
  `latest_N` per-role entries or a dated Migration Document instead.
- New sessions read: `SESSION_BOOTSTRAP.md`'s rule sections only (stop
  at "## Roles" unless a specific downstream section is needed) → the
  most recent Migration Document → your role's most recent 2-3
  `WORKSTATE.yaml` entries. The long historical narrative below
  "## Roles" in that file is now legacy/frozen — consult only via
  targeted `grep`, not a full read.
- `WORKSTATE.yaml` per-role logs should stay to ~5-6 recent entries;
  older ones may be trimmed at that role's own session close (never
  lost — full history stays in `git log`).
- Applies to Claude A, B, and D permanently, not a one-off.

**Not done this session:** did not retroactively archive/trim the
existing ~1900-line historical narrative in `SESSION_BOOTSTRAP.md` or
existing `WORKSTATE.yaml` entries — that content includes Claude
B/D history, out of Claude A's role scope to edit unilaterally. The
new rule governs future growth; a future Claude B/D session (or
explicit Project Owner instruction) should handle trimming their own
existing history if desired.

## Repository status at close

- [x] HEAD `e1cee43`
- [x] origin/main matches exactly (`git fetch` + `git rev-parse`
      confirmed immediately before this document)
- [x] `git status` clean
- [x] `master_dictionary.json` / compiled artifacts up to date with
      HEAD, rebuilt and verified after every edit this session
- [x] `.ai/WORKSTATE.yaml` updated (latest_10 through latest_15)
- [x] `.ai/SESSION_BOOTSTRAP.md` updated (new permanent workstyle
      section, header timestamp)
- [x] This migration document complete
- [x] No local commits ahead of origin
- [x] No uncommitted changes
- [x] Native-validation status: NV-070 and NV-071 both fully closed,
      zero open questions from this session
- [x] Tests: 196/196
- [x] `repository-intelligence.js`: PASSED, 0 new violations (A-F)

## Exact next step

Start a new conversation and paste this document in. On resume: per
the new workstyle rule, read only `SESSION_BOOTSTRAP.md`'s rule
sections + this document + `WORKSTATE.yaml`'s latest entries — do not
re-read the full historical narrative. Re-sync with actual repo state
(`git fetch` + `git status` + `npm test`) before continuing. Next
Claude A task is open (no pending linguistic question); alternatively
coordinate with Claude B on the outstanding smile-bug handoff.
