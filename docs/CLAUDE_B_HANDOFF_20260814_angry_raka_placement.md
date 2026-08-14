# Claude B Handoff — 2026-08-14 — "angry" raka (glottal-stop) placement

## Symptom
Project Owner flagged directly in-session: `angry = ka.onanga`, "mind the
raka." Current `master_dictionary.json` VERIFIED/HIGH entry (NV-054,
2026-08-03) has **three** raka marks: `ka·o·nang·a`. The Owner's spelling
implies a different — likely single — raka placement, closer to
`ka·onanga` or similar. `corrections.json["angry"]` currently mirrors the
three-raka form and is regression-tested that way
(`translationEngine.test.js:569`).

## Why I'm not editing this myself
This is a linguistic-content question, not an engineering-file bug:
- `master_dictionary.json` is Claude A's file (Claude B's remit is
  Check F engineering-file agreement only — flag, don't edit).
- Raka placement specifically has a documented history of being
  unreliable even under VERIFIED/HIGH tags — see
  `docs/DUPLICATE_AND_RAKA_AUDIT_SUMMARY.md`'s double-raka cluster
  finding (832/833 entries tagged VERIFIED/HIGH turned out to include
  mechanical corruption, not just genuine phonology) and
  `docs/DOUBLE_RAKA_RESOLUTION.md`'s resolution methodology. A tag alone
  isn't sufficient evidence to resolve a raka question either way.
- I have no independent way to confirm correct raka count/placement —
  that needs the same native-validation channel NV-054 came through.

## What I checked
- `master_dictionary.json` "angry" cluster (5 entries total): the
  VERIFIED/HIGH `ka·o·nang·a` (NV-054, "most common") and the separate
  VERIFIED/HIGH `bika ding'a` (NV-054 follow-up, "metaphorical") are the
  two currently-live forms; two UNVERIFIED variants (`bi·ka so·a`,
  `hel·hel`) and one typo-preserved `Ka·a soa` round out the cluster.
  None of the existing entries match the Owner's `ka.onanga` spelling
  exactly on raka count.
- Not touching Check F's "angry" closure (see
  `docs/CHECK_F_GAP_REPORT_20260813.md`) — that closure was about
  `corrections.json` vs `compiled_dict.json` agreement (both pull from
  independently-VERIFIED entries, engineering question, resolved) and
  is a separate question from whether the underlying raka placement in
  `master_dictionary.json` itself is correct. Re-flagging here since the
  Owner's input surfaced after that closure.

## Suggested next step (Claude A judgment call)
Re-confirm raka placement for `ka·o·nang·a` against the original NV-054
source material (Thangseng via Tridip WhatsApp relay, 2026-08-03) or a
fresh native check, and correct `master_dictionary.json` + propagate to
`corrections.json` if the placement is wrong. If corrected, `corrections.json`'s
regression test at `translationEngine.test.js:569` will need its expected
string updated to match.

## Update, same day — same pattern found on "always" and "answer"

Project Owner relayed two more direct native messages in-session:

```
[1:48 am, 14/8/2026] native: always = Pangnan
[1:48 am, 14/8/2026] native: a dog bit me = Angko achak chika. "answer": "Aganchaka"
```

This is more than a raka question — it's a **direct contradiction of the
2026-08-01 corpus-internal SUPERSEDED audit** for two keys, not just one:

- **`always`**: audit tags `master_dictionary.json`'s `Pangnan` entry
  `SUPERSEDED`, citing `jring·jring`/`pang·na` as the VERIFIED/HIGH
  replacements — but those two replacement entries carry only a bare
  `variant/VERIFIED/HIGH` note, no NV-number, no relay citation. Fresh
  native input now says `always = Pangnan` — the value the audit marked
  superseded. Claude B had already fixed `phrase_maps.js["always"]` from
  `Pangnan` → `pang·na` on the strength of the audit tag alone (commit
  `30c667c`); **that fix has been reverted** (commit below) given the
  audit tag is now contradicted by better-sourced evidence and the
  citation asymmetry (thin tag vs. direct dated native quote).
- **`answer`**: identical pattern. Audit tags `Aganchaka` `SUPERSEDED`,
  citing `Aganchakani`/`a·gan·chak·a`/`in·chak·a`/`ku·chak·a` as
  VERIFIED/HIGH (again, bare `variant/VERIFIED/HIGH` tags, no NV-number).
  Fresh native input says `answer = Aganchaka` — the "superseded" value.
  Claude B had NOT yet applied the mirror fix here (this key was queued
  next in the Check F ledger) — left untouched, not closed either way.
- **`a dog bit me`**: now a *three-way* conflict, not two. Fresh native:
  `Angko achak chika`. `corrections.json` (from the documented Batch-2
  native-speaker session, `docs/NEW_SENTENCES_BATCH2_NATIVE.md`):
  `Achak Angko chikaha`. `master_dictionary.json` (untagged legacy
  import): `An·tangko achik chanjok`. Check F's engineering-agreement
  question was already closed for this key (`corrections.json` wins at
  runtime regardless of which is linguistically correct) — that closure
  stands. But which Garo form is actually right is now a live 3-way
  question, not resolved by this handoff.

**Broader concern:** the 2026-08-01 corpus-internal SUPERSEDED audit's
methodology should probably be spot-checked more broadly — if it got
`always` and `answer` backwards, other keys it touched may also be
affected. Not attempting that sweep here (outside Check F engineering
scope) — flagging for Claude A's awareness alongside the specific fixes.

## Update, same day — second relay, revises the "a dog bit me" native form

Project Owner sent a further direct correction in-session:

```
a dog bit me = angko achak chikaha
```

This revises the native form logged above (`Angko achak chika`) — same
word order (`Angko achak`), but the final word now carries the `-ha`
suffix (`chikaha`) rather than `chika`. That `-ha` ending now matches
`corrections.json`'s existing value (`Achak Angko chikaha`) on the verb
form, while still disagreeing with it on word order (`Angko achak`
native vs. `Achak Angko` in `corrections.json`). `master_dictionary.json`'s
untagged legacy form (`An·tangko achik chanjok`) remains the outlier,
matching neither.

So the "a dog bit me" question is still 3-way, but narrower than before:
the dispute now looks like word-order (`Angko achak` vs `Achak Angko`)
rather than a fully divergent verb form, since two of the three sources
now agree on `chikaha`. Not editing `corrections.json` or
`master_dictionary.json` on the strength of this alone — same reasoning
as above (linguistic-content call, needs Claude A / original native
channel to confirm). Check F's engineering closure for this key is
unaffected either way.

## Commits referenced
- `30c667c` — the now-reverted `always` fix (Check F session, based on
  the audit tag before this contradicting evidence arrived).
- Revert commit — see git log same day, message references this doc.

## Status
**Update, same day — Owner closed three of the four items directly.**
Project Owner gave explicit resolving values and an explicit instruction
to close: `always=Pangnan` (confirms current value, audit tag corrected),
`Aganchakani=answer(noun)`/`aganchaka=to answer(verb)` (clarifies these
were never competing forms — different parts of speech, audit's
SUPERSEDED tag was simply wrong), and `a dog bit me=Angko achak chikaha`
(second relay's word order, resolves the 3-way conflict). All three
applied to `master_dictionary.json` (with VERIFIED/Owner-relay citations
replacing the incorrect SUPERSEDED tags) and propagated to
`corrections.json`/`phrase_maps.js` where needed, `compiled_dict.json`
regenerated via `prepare-data.js`. Full build gate green after. See
`docs/CHECK_F_GAP_REPORT_20260813.md` for the closed ledger rows.

Editing `master_dictionary.json` directly here is a deliberate departure
from the session's own "flag, don't edit — that's Claude A's file"
rule: that rule exists to stop Claude B making linguistic calls on its
own judgment, not to block the Project Owner (the actual native-input
source) from resolving something directly and saying so explicitly.

**`angry` raka placement is still open** — no resolving value given yet,
only the original flag (`ka.onanga`, "mind the raka"). Genuinely pending
Claude A or a fresh Owner confirmation.
