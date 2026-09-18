# Claude A Session Migration — 2026-09-18B

Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260918.md`.

## Resync (Rule 10)

- `git fetch origin`; HEAD on arrival: `3772d29c718d332a991ba7d608052ca99562df37`
  == `origin/main`, clean tree.
- 4 commits beyond 20260918's stated close (`8167cb4`), all Claude B
  engineering, no Claude A drift: `2e890d9`/`1a480af` (Bug 3 exact-hundred
  fix, corrected from a dictionary-source citation), `4ded8b4`
  (litre/plate + kg spacing fix), `3772d29` (gong n>=20 + king
  no-longer-raka-carrying, both Owner decisions).
- Gate reconfirmed green on arrival: 431/431 unit tests, 0 new
  repository-intelligence violations, 0 resync candidates.
- `SESSION_BOOTSTRAP.md`/`WORKSTATE.yaml`'s `claude_a.next_action`
  pointer was one session stale (still pointing at 20260918's own
  close) — updated this session, see below.

## Task: 3 WhatsApp relay batches checked against repo

All native evidence in this session was Thangseng, via WhatsApp
transcripts relayed by the Project Owner, dated 2026-09-08.

### Batch 1 — build/cook/shower paradigm

- `I am cooking`=Song·enga, `I will cook`=Song·gen, `I am taking a
  shower`=Auenga, `I will take a shower`=Augen, `I took a
  shower`=Auaha — all already VERIFIED/HIGH (2026-08-09), values
  matched the new transcript exactly. Pure reconfirmation, no change.
- `I build the house`=Anga nokko rika, `I am building the
  house`=Anga nokko rikenga — previously existed only as example
  sentences inside the `I build (general)`/`I am building` entries'
  own notes (same 2026-08-09 citation). New transcript reconfirms the
  identical sentences verbatim; added as standalone VERIFIED/HIGH
  `master_dictionary.json` rows, citing both the original example and
  this new relay. Commit `12e89b8`.

### Batch 2 — sense-tagged component entries (Project Owner instruction, same session)

Per explicit instruction to also break sentence components out
individually. All three re-expose already-VERIFIED/HIGH roots under
new bare-word lookup keys — no new native content:

- `build (verb, general)`=Rik·a — distinct key from the pre-existing
  unconfirmed no-dot `to build`=Rika, so bare `build` doesn't silently
  prefer the unconfirmed spelling.
- `building (verb, continuous)`=Rik·enga — sense-tagged apart from
  the pre-existing, unrelated, still-unverified noun `building`=nok
  (structure/edifice). Same english headword, two different words,
  not merged.
- `shower (verb, continuous)`=Auenga — same treatment, apart from the
  unrelated noun `shower`=gra·gra.

`cooking` already had this treatment from 2026-08-09 (bare
VERIFIED/HIGH key already existed) — no action needed there. Commit
`9b5eb3f`.

### Batch 3 — joljol/srongsrong + come/go-a-little (verify-only, no changes)

- `joljol`="straight away/immediately" (non-delay), example `Joljol
  auebo.` — already VERIFIED/HIGH (2026-08-09, NV-070 follow-up),
  matches exactly including the example sentence. The transcript's
  "direct" framing is already correctly reflected: a prior SUPERSEDED
  row on file already explicitly rejects `joljol`="direct" from the
  same 2026-08-09 session.
- `srongsrong`="straight" (spatial/postural, also non-resistance),
  example `Srongsrong chadengbo.` — already VERIFIED/HIGH, matches
  exactly.
- `come a little here`=Iachi on·tisa re·babo. and `go a little
  there`=Uachi on·tisa re·angbo. — both already VERIFIED/HIGH
  (2026-08-09, NV-071), match exactly (apostrophe/period in the new
  transcript vs. raka dot in the stored form — same typing convention
  difference seen throughout this project's WhatsApp relays, not a
  discrepancy).

100% reconfirmation, zero repository changes this batch. `joljol` and
`srongsrong` are atomic single-morpheme adverbs — no components to
break out, unlike Batch 2.

## Verification

Every commit individually gate-verified before push:

| | after Batch 1 (`12e89b8`) | after Batch 2 (`9b5eb3f`) |
|---|---|---|
| dictionary (`test-dictionary.js`) | 8560/8560 | 8563/8563 |
| grammatical corrections | 9/9 | 9/9 |
| unit tests | 431/431 | 431/431 |
| repository-intelligence violations | 0 new | 0 new |

Every new/changed key live-verified via `translate()` post-build,
both commits — including confirming the two sense-tagged component
entries (`building`, `shower`) don't disturb their pre-existing,
unrelated noun-sense siblings.

## Runtime Handoff (Claude B)

Two live bugs found while live-verifying Batch 1, not fixed (not
Claude A's lane), not yet actioned by Claude B as of this close:

1. **Trailing punctuation breaks lookup entirely.** `translate("i am
   cooking")` → correct exact-phrase hit (0.98). `translate("i am
   cooking.")` (trailing period) → falls through to grammar-assembly
   and ships a degraded value. Same failure on `corrections.json`
   entries (`"i will cook."` → wrong root entirely, `Anga
   Song·timgipgen`, mixing the noun-agent root with the future
   suffix). Looks repo-wide, not specific to any one key.
2. **Symptom of #1, worse:** `"I am taking a shower."`/`"I took a
   shower."` (trailing period) don't just degrade to grammar-assembly
   — they fall to compound-split/morphology and surface literal
   `[UNKNOWN]` tokens in the output.

Action needed: trace where in the lookup cascade
(`translationEngine.js`) trailing punctuation should be stripped
before the exact-phrase/corrections check, and confirm how much real
user input this silently degrades — this project's existing
apostrophe-preserving-lookup lesson (Rule 12) suggests checking
whether the fix for one punctuation class breaks another.

## Push history (no collisions)

1. Commit `12e89b8` (build/cook/shower reconfirmation + house
   sentences) — `git fetch` clean before push, no concurrent commits.
2. Commit `9b5eb3f` (sense-tagged component entries) — same, no
   concurrent commits.

## Repository status at close

- HEAD: `9b5eb3f0236c132d4c85504301f9d126a38664e2`
- `origin/main`: same — verified via `git fetch` + `git rev-parse`
- `git status`: clean, nothing local/uncommitted
- `.ai/WORKSTATE.yaml`: updated (new `claude_a.next_action`, old
  entry preserved as `next_action_prior_20260918`)
- `.ai/SESSION_BOOTSTRAP.md`: updated (header pointer + summary)
- This migration doc: complete
- No local commits beyond what's pushed
- No open native-validation blocker from this session (all 3 relay
  batches fully checked; batches 1 and 3 items are 100%
  reconfirmation, batch 1's 2 house sentences and batch 2's 3
  component entries needed and got new rows)

## Next Claude A

No queued task from this session. Standing open items, unchanged,
not touched this session:

1. `docs/THANGSENG_RELAY_QUESTION_20260916.md` (7-pattern wh-question
   suffix survey) — drafted, sent to Thangseng, reply not yet
   received.
2. 44-key interrogative-form family in `docs/SUPERSEDED_ONLY_KEYS.md`
   (Claude D territory).
3. The punctuation-lookup Runtime Handoff above — Claude B territory,
   new this session.
4. `derived` confidence tag still not in
   `repository-intelligence.js`'s schema (flagged 20260918, still
   open, Claude B territory).
