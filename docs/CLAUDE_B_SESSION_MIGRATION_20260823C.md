# Claude B Session Migration — 2026-08-23C

Resumed via `docs/CLAUDE_B_SESSION_MIGRATION_20260823B.md` (the prior
session's audit-only findings, checkpoint `772a5e9`). This session did
the actual engineering work: closed all 4 items from that doc's backlog
that are genuinely Claude B's (ENGINEERING) territory. The remaining 3
items are DATA/LINGUISTIC/boundary calls — flagged for Claude A below,
not attempted here, per Rule 13 / governance doc §2 (don't guess at
linguistic content) and the standing A/B role split.

## Completed this session (all 4 ENGINEERING items closed)

1. **Stale `corrections.json` overrides** (song/telling/studying) synced
   to master's VERIFIED/HIGH values. Mechanical value sync, no
   linguistic call. Pushed `548cc61`.

2. **`parseCountingPhrase()` adjective-slot gap** — `[NUMBER][ADJ][NOUN]`
   phrases ("three long sticks") now reach classifier composition
   (0.96 confidence) instead of falling to the weaker `sov-assembly`
   (0.75). **Correction:** an earlier turn in this same session reported
   this as already implemented and pushed — it was not; only
   investigation had happened at that point, no code was actually
   changed. Caught and actually implemented at session end (see git log
   for the real commit). `parseCountingPhrase()` (`garo_classifier.js`)
   has no dictionary access, so it can't itself judge whether a
   multi-word remainder is a genuine multi-word noun ("sugar cane") or
   an adjective+noun phrase — it now exposes both the full-phrase
   candidate (tried first, unchanged) and a `nounOnly` candidate (last
   word alone) for the caller to try as a fallback. `translationEngine.js`
   tries the full phrase first (so genuine multi-word nouns are
   unaffected — verified live for "sugar cane"/"custard apple") and only
   falls back to `nounOnly` when that fails and an adjective is actually
   present. No adjective translation, no word-order decision — matches
   the doc's original scope exactly ("still feed the resolved noun into
   countNoun() unchanged").

3. **`sov-assembly` dropped the head noun + stranded adjectives** — two
   independent bugs in `assembleSentenceSOV`, both reproduced via "the
   tall man is carrying four heavy boxes to the river":
   - Sibilant-ending plurals ("boxes") silently vanished from output —
     the noun-resolution fallback only stripped `s$`, not `es$`. Fixed
     with an `es$` fallback strip.
   - Adjectives ending in `·a` were misclassified as verbs via an
     overly-broad `/·a$/` suffix regex and stranded at the sentence
     tail, disjoint from their noun. No POS data exists anywhere in this
     repo (confirmed RC-CANDIDATE-003) to tell adjectives from verbs, so
     rather than guess with a hardcoded exclusion list, the fix uses a
     structural fact instead: when multiple words match the verb-signal
     regex, only the LAST one (the SOV-final verb slot this engine
     already assumes) is elected as the verb; earlier matches fall back
     to `nonVerbs`, preserving their original relative order — which
     keeps an attributive adjective adjacent to the noun it preceded,
     with zero new linguistic claims. Pushed `86b9016`.

4. **Item 5's other symptom** ("did you see the two small dogs" never
   identified "see" as the verb at all, since bare-root Garo verb
   citations like "Nia" carry no suffix the regex could match) — fixed
   by adding `VERB_LEMMAS` (`src/lookupEngine.js`), a set of English verb
   lemmas mechanically derived from the dictionary's own 939 `"to X"`
   headwords (already Claude A/D's established infinitive-marking
   convention, already used by `prepare-data.js`'s bare-infinitive
   aliasing). This is ground truth reused, not invented. The two verb
   signals (lemma-match vs. the old ambiguous suffix regex) aren't
   treated as equally trustworthy — a definitive lemma match anywhere in
   the sentence takes priority over the suffix regex, fixing the case
   where the suffix regex's false-positive on "small" (position-wise
   later than "see") would otherwise have outranked the real,
   lemma-confirmed verb under plain last-wins. Pushed `35be4cb`.

**Gate at every step:** full unit test suite (226/226 by session end, up
from 220 — regression tests added for every fix), `repository-intelligence.js`
PASSED 0 new violations at every commit, `compiled_dict.json` byte-identical
where no data-layer change was made. Two clean merges of concurrent Claude A
pushes mid-session (NV-092/NV-093 batch + session close; then a Rule 8
`gossip` fix + dist rebuild) — no key overlap, no conflicts, gate
re-verified green after each.

## Flagged for Claude A — not attempted this session

5. **No productive plural rule** (item 4 from the prior session's audit).
   "dog"→`Achak` (0.99), "dogs"→`Achak` (0.75, *identical* string, no
   `-rang` or other plural marker). "children"→`Bi·sarang` only works
   because it's a memorized irregular entry, not a rule. Class:
   ENGINEERING/LINGUISTIC boundary — needs a decision on which plural
   marking strategy is linguistically correct (is `-rang` productive for
   all nouns? only animate ones? per the confirmed `Bi·sarang` case)
   before any engineering rule can be written. Not resolved.

6. **`bland`/`tasteless` compiled to `·brok·`** (bare raka marks, not a
   word). Master rows are `UNVERIFIED`, one an apparent OCR-truncated
   variant of `chi·brek·a`. Class: DATA/PROPAGATION — needs Claude A/D
   to supply the correct value; not an engineering fix.

7. **Pronoun-form inconsistency, not confirmed as a bug** — dictionary
   `you`=`Nang`, but every runtime path that ships "you" uses `Na·a`
   instead. Could be a legitimate nominative/oblique case distinction
   (Garo commonly has these). Class: LINGUISTIC — flagging for Claude A
   to confirm or reject, not asserting a defect.

## Standing rules established
None new this session. Followed existing Rule 13 / governance doc
throughout — the item 3/5 fixes in particular were deliberately
structural (reusing existing, already-vetted signals: SOV-final
position, the dictionary's own "to X" convention) specifically to avoid
making a linguistic call about which words are adjectives vs. verbs.

## Exact next step
Recommended for the next Claude A session (or Claude B, if picking up
item 5/6/7's non-linguistic pieces):
1. Item 5 (plural marking) — needs a Project Owner/Claude A ruling on
   scope before any engineering rule is written.
2. Item 6 (`bland`/`tasteless`) — supply a correct VERIFIED value.
3. Item 7 (`you`=`Nang` vs `Na·a`) — confirm whether this is a genuine
   case distinction or a real conflict.

Do not re-run the 51-case audit from the prior session — its findings
plus this document are the current, complete record. Only re-test cases
directly touched by whichever item is picked up next.

---
Start a new conversation, ensure Rule 13 (`.ai/SESSION_BOOTSTRAP.md`) is
read before any work begins, then resume from "Exact next step" above.
