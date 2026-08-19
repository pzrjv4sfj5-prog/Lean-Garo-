# Claude B Session Migration — 2026-08-19

## Context
Ran the full A↔B propagation diagnostic requested by the Project Owner (see chat brief,
"CLAUDE B — A↔B MISSING-LINK + ENGINEERING GAP + RUNTIME AUDIT"). Resumed from a prior
session's migration doc, re-fetched, found and merged new commits from Claude A's session
(`853bc6f`) and a QA audit pass (`76156c2`) before starting.

## What I found (report delivered in chat, summarized here)
- Runtime cascade order confirmed by reading `translationEngine.js`: `corrections.json` →
  `phrase_maps.js` → `compiled_dict.json` (exact-phrase) → classifier → single-word.
- `repository-intelligence.js`'s Check F only detects *disagreement* between override layers
  and `compiled_dict.json` — it has no mechanism to detect which side is *correct*. This is
  the systemic root cause behind the father/mother/small bug fixed earlier this session
  (`76156c2`) and behind everything found below.
- A scripted sweep (comparing every `known_cross_source_conflicts.json` entry's override
  value, normalized, against `master_dictionary.json`'s current VERIFIED/HIGH candidate)
  found ~69 additional live-wrong translations beyond father/mother/small — **not yet
  applied**, see `remaining_from_prior_sweep` in WORKSTATE.yaml.

## What I did this session
Found a pre-existing script, `scripts/resync-stale-overrides.mjs`, that does a stricter
version of the same check (requires the override to match an explicitly-SUPERSEDED master
row AND `compiled_dict.json` to already resolve to a VERIFIED row). Dry-run found 35
candidates.

**Caught a false positive before applying anything**: `answer` was in the candidate list.
The Project Owner's brief explicitly named this exact trap ("do NOT repeat the previous
audit error where answer was matched against a SUPERSEDED value belonging to 'To answer'").
Checked `master_dictionary.json` directly: `master_dictionary.json` encodes the noun/verb
distinction via case (`"answer"` lowercase = verb, VERIFIED/HIGH `Aganchaka`; `"Answer"`
capitalized = noun, VERIFIED/HIGH `Aganchakani`, per NV-077). The resync script's key
matching lowercases before comparing, so it merged both senses into one pool and matched
the verb override against an unrelated duplicate-spelling SUPERSEDED row — not a real
supersession of meaning. Applying it as-is would have silently swapped the correct verb
form for the noun form.

Checked whether the other 34 candidates carried the same risk: all 34 do have case-variant
keys in `master_dictionary.json` (e.g. `big`/`Big`), but spot-checking several (`big`,
`climb`, `teacher`) confirmed these are plain import-duplication artifacts — every case
variant converges on a single NV-080 native-confirmed value, unlike `answer`/`Answer`,
which is a genuine POS split.

**Applied the 34 safe fixes, reverted the 1 false positive:**
- Ran `scripts/resync-stale-overrides.mjs --apply` (all 35).
- Manually reverted `corrections.json["answer"]` and `phrase_maps.js['answer']` back to
  `Aganchaka` (the verb form, matching current runtime behavior — not silently changed).
- Re-added `corrections:answer` and `phrase_maps:answer` to
  `known_cross_source_conflicts.json` — this is not resolved, it needs a schema-level
  POS/sense-aware key fix, not a mechanical resync.
- Updated a stale 2026-08-06 comment on the `all` phrase_maps.js entry that described a
  3-way tie later resolved definitively by NV-080 (2026-08-17) — comment was accurate when
  written, just outdated.

## Verification (all re-run directly, not trusted from script output)
- `node prepare-data.js`: 8127 entries compiled successfully.
- `node test-dictionary.js`: 8127/8127 valid, 9/9 grammatical corrections verified.
- `node --test tests/unit/*.test.js`: 218/218 passing.
- `npx eslint . --ext js,jsx --max-warnings 0`: exit 0, no errors.
- `node repository-intelligence.js`: 0 new violations, Check F known-mismatches 220 → 187.
- Live `translate()` spot-check (not just source-reading) for 8 words including `answer`:
  all resolve correctly, `answer` confirmed still returning the verb form.

## Current state
HEAD will be a new commit on top of `76156c2`, pushed, clean tree, verified against origin.

## Standing rules (unchanged, reconfirmed this session)
Never guess a linguistic value without citation/native input; always fetch+rebase before
and after work; full gate re-run required before every commit, not assumed; stale metadata
gets corrected as its own mechanical fix.

## Exact next step
Two independent threads, both documented in WORKSTATE.yaml's new `claude_b_resync_sweep`
block:
1. The ~69 remaining sweep-found mismatches need the same manual case/tie verification
   done for `answer` this session before any bulk apply — do not trust
   `resync-stale-overrides.mjs` or a raw sweep blindly on keys with case-variant or
   tied-candidate master_dictionary.json entries.
2. `answer`'s underlying design gap (case-insensitive lookup colliding with a
   case-encoded POS distinction) needs a real schema fix — a design question for Claude A
   / the Project Owner, not something to keep working around per-key.
