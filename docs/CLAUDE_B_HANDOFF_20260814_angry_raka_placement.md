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
**Correction, same day, before session end.** An earlier revision of
this doc said "Owner closed three of the four items directly" and
Claude B had applied the values to `master_dictionary.json` (and
propagated to `corrections.json` for `a dog bit me`) on that basis.
That was a role-boundary error: a chat message claiming Project Owner
authority isn't a channel this repo recognizes for committing linguistic
content — per `.ai/SESSION_BOOTSTRAP.md` "Roles," that requires Claude
A's own commit, a format-patch relay, or Claude A pushing with a
temporary Owner-supplied PAT. All edits have been **reverted**;
`master_dictionary.json`/`corrections.json`/`known_cross_source_conflicts.json`
are back to their pre-session values, `compiled_dict.json` regenerated
to match, full gate reconfirmed green.

**This doc now stands purely as an evidence package for Claude A**,
covering four keys, all still open:

- **`always`**: chat-relayed claim `always=Pangnan`, contradicting the
  2026-08-01 audit's SUPERSEDED tag (see body above for the two-relay
  detail already documented).
- **`answer`**: chat-relayed claim `Aganchakani=answer(noun)`,
  `aganchaka=to answer(verb)` — asserts these are distinct parts of
  speech, not competing forms, i.e. the audit's SUPERSEDED tag was wrong
  to begin with.
- **`a dog bit me`**: two chat-relayed native forms, converging on
  `Angko achak chikaha` (see body above for detail on both relays).
- **`are you sleeping`** (new, not previously in this doc): chat-relayed
  claim `Na·a tusiengama?`. Current `master_dictionary.json` value is
  `Na·a tuengama?` (possible dropped-"si" typo, unconfirmed either way);
  `corrections.json` currently holds `Na·a Tusienga ma?`.

None of the four have been applied. Root cause is still whatever it was
before this correction — the 2026-08-01 audit's SUPERSEDED tags lack
NV-numbers/citations on their "winning" side for `always`/`answer`, and
`a dog bit me`/`are you sleeping` were never audited at all (untagged
legacy / no notes). Claude A (or Claude A with a temporary PAT, or the
Project Owner via Claude A directly) needs to independently verify each
claim against original native sourcing before applying — these chat
relays are not, on their own, sufficient provenance for this repo's
citation discipline, the same standard the audit itself is being held to
in this doc.

## Update, 2026-08-14 (Claude B, session C / resumed session) — status for Claude A to sync

**Three of the four evidence items above are now CLOSED.** Claude A's
own commit `d28882b` ("NV-077: close always/answer/a dog bit me/are you
sleeping") applied `always`, `answer`, `a dog bit me`, and `are you
sleeping` through the proper channel, citing this doc directly. Detail
in `docs/CLAUDE_B_SESSION_MIGRATION_20260814_C.md` and now reflected in
`docs/CHECK_F_GAP_REPORT_20260813.md`'s per-key ledger rows (updated
this session, commit `82508cd`). One propagation gap was found and
fixed on the `a dog bit me` sibling keys (`dog bit me`/`the dog bit
me` in `corrections.json`) — pure propagation of the already-committed
value, not a new linguistic call, logged in the same migration doc.

**Still open — the actual subject of this doc's title, NOT addressed by
NV-077:** `angry` raka-count placement. NV-077's own commit message
says so explicitly ("angry raka-count question from the same handoff
doc NOT addressed, still open"). Confirmed still open by direct repo
read this session — `master_dictionary.json`'s `ka·o·nang·a` (three
raka marks, NV-054) is unchanged, `corrections.json["angry"]` still
mirrors it, `translationEngine.test.js:569` still locks in the
three-raka form. The Owner's flagged spelling (`ka.onanga`, "mind the
raka") still doesn't match any live entry on raka count. Everything
in the "Why I'm not editing this myself" / "What I checked" / "Suggested
next step" sections above still stands unchanged — this is a linguistic
call needing the NV-054 native-validation channel, not an engineering
fix, and Claude B has no new information on it since the original
flag. Re-flagging here so it doesn't get lost now that the other three
items in this doc have closed and might make the doc look resolved at
a glance.

## Update, 2026-08-14 (Claude A, later same day) — CLOSED, two passes

`angry` raka-count placement is now resolved. Two corrections were
needed:

1. **Pass 1** (this doc's flag) → Project Owner relayed "Angry = ka'o
   nanga" / "do not be angry = Ka'o nangnabe" (apostrophe = raka mark).
   `master_dictionary.json`'s `angry` entry corrected from three-raka
   `ka·o·nang·a` to one-raka `Ka·o nanga`; `do not be angry` added;
   `corrections.json` and `tests/unit/translationEngine.test.js`
   updated to match.
2. **Pass 2** → Project Owner supplied the exact raka a second time,
   explicitly one word, no space ("Angry = ka.onanga", "I am giving
   with exact raka"). Corrected again to `Ka·onanga` (no space) in the
   same three files.

**Not touched, flagged not guessed:** the pre-existing `anger` noun
entry (`Ka·o nanga`, still has the space) was not re-confirmed to the
no-space form — noun vs. adjective may differ, left as-is.

**New handoff to Claude B:** `src/data/phrase_maps.js` line 38
(`'i am angry': 'Anga ka·o nanga'`) still has the pass-1 spaced form,
now stale against the pass-2 no-space correction. Out of Claude A's
lane (engine file) — needs Claude B to update to `Ka·onanga` or confirm
the sentence-internal form is deliberately different.

This doc's title item is now closed; no items remain open in it.

## Update, 2026-08-14 (Claude B, session E) — phrase_maps.js checked, held not fixed

Checked `src/data/phrase_maps.js` line 38 against source. It matches
`master_dictionary.json`'s own `"i am angry"` sentence entry exactly
(both the pass-1 spaced form, `'Anga ka·o nanga'`) — that sentence
entry is itself untagged/legacy and was not touched by either NV-078
pass. So the phrase-map line hasn't drifted from its own dictionary
source; it's only stale relative to the corrected *adjective root*
(`Ka·onanga`).

Whether `"i am angry"` is built compositionally off that adjective
root, or is its own fixed sentence form — same open question as the
`"anger"` noun entry Claude A deliberately left un-reconfirmed above
("noun vs. adjective may legitimately differ") — is a linguistic call,
not an engineering one. No regression test locks in the current value;
no `corrections.json` entry exists for this key either.

**Not fixed. Held**, same discipline as the rest of this doc: needs
either (a) native confirmation that `"i am angry"` tracks the corrected
adjective root, in which case update both `master_dictionary.json`'s
sentence entry and `phrase_maps.js` together, or (b) confirmation it's
deliberately a distinct form, in which case tag the sentence entry to
close the question explicitly instead of leaving it silently untagged.
Claude A's lane to resolve; Claude B has no independent way to confirm
either way.
