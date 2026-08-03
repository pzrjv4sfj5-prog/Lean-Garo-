# Pending Linguistic Proposal — `sikenga`="want" may be wrong; collides with unrelated verb `sika`
_Logged: 2026-07-18 by Claude A. Escalates a concern first raised
2026-07-13 (`PENDING_LINGUISTIC_PROPOSAL_20260713_modals_possession.md`)
that was resolved too optimistically at the time._

## RESOLUTION, 2026-07-18 (same day)
Thangseng's follow-up moved from suspicion to a declarative answer:
*"Ska is want in terms of desire. Sikenga is not derived from ska. It
is derived from sika meaning to push, to insert. Sikenga is continuous
of sika."* Corrected:
- `corrections.json`: `want`, `wants`, and 8 `"i want to X"` sentences
  (sleep, eat, drink, go, come, work, study, pray) — `sikenga` → `ska`.
- `master_dictionary.json`: the two `"VERIFIED/native-speaker"` `want`/
  `wants` entries — corrected in place with a citation note, not
  silently overwritten.
- `irregular_verbs.json`: `want`/`wants` — corrected for consistency;
  this is what fixed the general case too (`repository-intelligence.js`
  Check B caught the resulting cross-table mismatch immediately, and
  the fix propagates through `grammar-assembly` for *any* "I want to
  X" sentence, not just the ones hand-patched in `corrections.json`).
- Left `"i am pushing a car"`/`"i am sewing a cloth"` as-is — these
  correctly demonstrate `sikenga`'s real sense (continuous of `sika`).

**Still open, not touched:**
- `"need"` — RESOLVED 2026-08-03, corpus-internally (Claude A, no new native
  input needed): the already-VERIFIED NV-005/NV-016 closure (2026-07-25,
  "nanga = need") had never propagated to the `'need'` key itself, which
  was stuck on stale `sikenga`. Fixed: `corrections.json`, `master_dictionary.json`.
  Independently re-confirmed the same day by a direct Thangseng quote via
  Tridip: "Need = nanga. Want = ska." See NV-016/NV-021-followup in
  `THANGSENG_NATIVE_VALIDATION.md`.
- `"i want water"` / `"i want food"` / `"i want to see you"` — RESOLVED
  2026-08-03 (NV-021 follow-up, direct Thangseng answer, 2026-07-19,
  relayed 2026-08-03): wanting water/food is expressed as wanting to
  drink/eat, with the object's `ko` suffix DROPPED — `"(Anga) Chi ringna
  skenga."` = "I want to drink water"; `"apple cha'na skenga"` = "I want
  to eat apple." Root is `skenga` (continuous of `ska`, want), not
  `sikenga` (continuous of `sika`, push/insert) — corrected throughout.
  "I want to see you" already has its own verb (`nina`) so keeps `ko`;
  root corrected to `skenga` only. **New open question surfaced by this
  fix, not resolved:** today's examples use `skenga`, but the 10
  already-implemented "i want to X" sentences (NV-021, 2026-07-18) use
  bare `ska` for the identical verb+na+X frame — left untouched pending
  clarification of whether this is free variation or a real
  register/aspect distinction.
- `Kolomko bag-o sikatbo` ("put the pen inside the bag") — RESOLVED
  2026-08-03 (same relay): the hyphen in `bag-o` is purely orthographic
  (marks the English-loanword/Garo-suffix boundary), not raka. Added to
  `master_dictionary.json`, VERIFIED/HIGH.

Original proposal (pre-resolution) kept below for the record.

---

## What changed
The 2026-07-13 proposal noted `"want to eat" → cha·na ska` differed
from the already-implemented `sikenga`, and concluded — on a single
relayed data point — that `ska` was probably just a casual-register
contraction of `sikenga`/`sikeng`, "does not supersede `sikenga`,"
filed as part of NV-016.

Thangseng's 2026-07-18 answer (Tridip relay) directly contradicts that
resolution:

> The English 'want' is usually communicated by using 'ska'. [...] On
> ska vs sikenga, this will require cross-checking with a dictionary.
> I suspect that sikenga is derived from ska. Therefore the correct
> spelling should be 'skenga'. The differentiation is important
> because there another word called 'sika' in Garo language. Sika
> means to push or to sew/stitch or to insert/put something in.
> Sikenga should be a continuous form of sika.

With worked examples: `Anga gariko sikenga` = "I am pushing a car";
`Anga ba·ra sikenga` = "I am sewing a cloth"; `Kolomko bag-o sikatbo`
= "Put the pen inside the bag."

This is not the register-doublet story from the earlier proposal —
it's a specific, named collision with a completely unrelated verb
(`sika`, push/sew/insert), and Thangseng himself flags it as uncertain
("I suspect," "this will require cross-checking"), not settled.

## Why this is high-priority, not just another open question
`sikenga` is currently used for "want"/"need" in **13 live production
`corrections.json` entries**: the bare `"want"`, `"wants"`, `"need"`,
and ten `"i want to X"` sentences (eat, drink, go, come, work, study,
pray, water, food, see you) — all marked `"VERIFIED/native-speaker"`
in `master_dictionary.json`. If Thangseng's suspicion is right, some
or all of these are producing sentences that actually mean something
in the push/sew/insert family instead of "want" — a silent-wrong-
output risk across a meaningful slice of production translation, not
a single sentence.

## What's been done vs. held
**Fixed, directly confirmed:** `"i want to speak"` had a fresh, clean,
explicit worked example (`Anga aganna ska`) — updated in
`corrections.json`, replacing the old `Anga a·gan·na sikenga` (which
was also wrong on raka placement independently — `aganna` with no raka
is already confirmed elsewhere in `corrections.json`,
`"people say it is good is it good"`). Added `"i want to dance"` =
`Anga chrokna ska` (also freshly confirmed) and the two
`sika`-continuous demonstration sentences (pushing a car / sewing a
cloth) so the *correct* sense of `sikenga` is represented too, not
just flagged as suspect.

**Held, NOT touched:** the other 11 `sikenga`="want"/"need" entries.
Thangseng's own uncertainty is the reason — this needs a definitive
follow-up before a mass correction, not a guess in either direction.

**`Kolomko bag-o sikatbo`** (put the pen inside the bag) — not added
anywhere yet. The hyphen in `bag-o` is ambiguous: every other WhatsApp
relay in this project has used an apostrophe for raka (`na'a`,
`cha'genma`), not a hyphen, so this could be raka rendered differently,
or a plain compound/loanword boundary marker, or something else.
Flagged, not guessed at.

## Recommended follow-up relay question (new NV, see
`THANGSENG_NATIVE_VALIDATION.md`)
A single, precise question that should resolve this cleanly: *"For
'I want to eat/drink/go/study' etc. — should these use `ska`/`skenga`
instead of `sikenga`? Or is `sikenga` genuinely correct for 'want' in
some of these and you were only flagging a spelling/possible-confusion
risk, not an actual error in the existing sentences?"* Also worth
asking directly about the `bag-o` raka question while relaying this.

## Also resolves part of the `ama` modal caution (2026-07-13 proposal)
Separately, Thangseng directly confirmed: *"ama has the same spelling
in both the meanings. No difference"* (address-term "mother" and the
modal), and *"ama is not 'can eat'. It only means can."* This resolves
the `NV-008`-adjacent caution from the 2026-07-13 proposal in `ama`'s
favor — it's confirmed as a real, correctly-spelled word (general
ability modal "can," not "can eat" specifically — the "eat" sense in
the original relay came from the compound phrase `cha·na ama`, not
from the word itself), genuinely homonymous with (not a corruption of)
the address-term "mother." Updated in the 2026-07-13 proposal and
`THANGSENG_NATIVE_VALIDATION.md` NV-018.
