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

## Status
Open — flagged, not fixed. Owner input relayed verbatim above.
