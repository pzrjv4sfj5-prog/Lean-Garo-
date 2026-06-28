# RAKA PLACEMENT RULE — Native Speaker Explanation, Analyzed

Source: Thangseng (native speaker), via WhatsApp, 2026-06-26.
Status: **Rule itself CONFIRMED.** Resolves the original handoff's
"PENDING TASK — Garo verb suffix system" blocker on raka placement
specifically. Cross-checking against live `corrections.json` surfaced
one likely existing data error (see "Inconsistency found" below) —
flagged, NOT fixed, pending native speaker confirmation.

## What was said, read carefully

Three messages, in order:

1. Raka placement is inherited from pronunciation, not a writing rule
   invented for the written form. Garo was spoken before it was written,
   so spelling reflects sound. Whether a word has a raka depends on how
   it is said.
2. Worked example: `cha'a` (eat) already has a raka in its bare/root
   form, *before any suffix is added*. The raka belongs to the root.
   Suffixes attach to that root unchanged: `cha'a → cha'aha` (have
   eaten), `cha'a → cha'ja` (not eat), `cha'a → cha'bo` (eat!,
   imperative). By contrast `agan`/`agana` (speak) has no raka in its
   root form, so none of its suffixed forms get one either: `agana →
   aganaha`, `agana → aganja`, `agana → aganbo`.
3. Same principle extends to longer/compound forms: `cha'a → cha'manaha,
   cha'manjok` (raka retained) vs `agana → aganjojoa, aganjoljola` (no
   raka, consistent).
4. Final, most important line: **"If the word in the normal form has a
   raka, the raka follows the word everywhere in all the forms."** This
   is stated as unconditional — not "usually," not "in most suffixes."

## My understanding, stated plainly

The raka is not a grammatical marker with its own meaning (it doesn't
signal tense, mood, or anything else). It is a phonetic feature **fused
into the identity of a specific verb root**. Some roots are pronounced
with a slight glottal-stop break (written `·`) and some aren't — this is
arbitrary from a grammar standpoint, the same way some English verbs are
irregular for no productive reason ("go/went" vs "walk/walked"). Once you
know whether a root has that break, the answer carries through *every*
form of that verb without exception, because the break is still
physically pronounced in every form — the suffix doesn't erase it and an
unraka'd root doesn't spontaneously acquire one.

This means:
- Raka presence/absence is a **lexical fact about each root**, looked up
  or asked once, never derived.
- It is **not positional** — it's wrong to think "raka goes between root
  and suffix"; that framing caused the original confusion. The raka was
  never "between" anything — it's simply part of the root's spelling,
  and inflected forms are built by appending suffixes to that
  already-correctly-spelled root.
- It is **deterministic and total**: there is no such thing as a root
  that takes a raka in some inflections but not others. If even one
  verified form of a root shows a raka, every other form of that same
  root must show it too — and the converse for raka-less roots.

This last point is what makes it useful diagnostically, not just
explanatory: it gives a hard consistency check we can run against
existing and future data.

## Cross-check against live `corrections.json` (this session)

**Consistent (no issue):**
- `cha·a` (eat) family — `Cha·a`, `Cha·bo`, `cha·enga`, `cha·jok`,
  `Cha·na·be`, `Anga cha·aha`, `Anga cha·ja`, `Anga cha·ja·aha` — raka
  present in every form. Matches rule.
- `agana`/`agan` (speak) family — `Agana`, `agana`, `aganeng` — no raka
  in any form. Matches rule.
- `tusi` (sleep) family — `Tusia`, `Tusibo`, `tusina`, `tusienga`,
  `tusieaha`, `Tusijok`, `Hai tusina` — no raka anywhere, all consistent
  with each other.
- `ring`/`Ringa` (drink) family — `Ringa`, `Ringbo`, `ringaha` — no raka
  anywhere, consistent.
- `chika` (bite) — `chikaha`, `chika` — no raka anywhere, consistent
  (single root attested, nothing to contradict).

**Inconsistency found and RESOLVED (native speaker confirmed, 2026-06-26):**
- `run`: live data had `run -> Kat·a` (raka present) alongside
  `running -> katenga` and `i ran -> Anga kataha` (both no raka) — an
  internal contradiction.
- Native speaker confirmed directly: **"No raka in both examples. I run
  = Anga kata."** So the root has no raka at all; `running -> katenga`
  and `i ran -> Anga kataha` were correct all along, and `run -> Kat·a`
  was the actual error.
- **Fix applied:** `run -> Kat·a` corrected to `run -> Kata` in
  `corrections.json` (this session, value-only edit, entry count
  unchanged at 536). This is a textbook confirming case for the rule:
  the contradiction was real, the rule correctly predicted that one of
  the two had to be wrong, and the native speaker's answer told us which
  side — not a guess on my part.

## What this does NOT resolve (still open, still need native speaker)

1. Negative infix `-ja-` positioning relative to other tense suffixes —
   not addressed by this explanation at all.
2. Full morpheme breakdown of compound forms (`a·gan·jo·jo·na`,
   `cha·man·jok`) beyond "whatever raka the root has, carries through."
3. The `run` inconsistency above.

## Practical effect on workflow going forward

No code changes needed — `translationEngine.js` does not algorithmically
generate Garo inflected forms (confirmed by inspection: its only
suffix-stripping operates on English input words for dictionary lookup,
never on Garo output), so there's no derivation logic to patch.

Going forward, when a native speaker gives a new verb root, the question
"does this root have a raka in its plain/bare form?" should be asked
explicitly once, up front — and then every inflected form added for that
root afterward should be checked against that answer before being
accepted into `corrections.json`.
