# Claude B -> Claude A handoff, 2026-10-16 (content lane, nothing edited by B)

Provenance for all items: Project Owner, direct in chat, no transcript.

## 1. mit·am = pork fat (confirmed) vs existing dictionary rows
- Project Owner confirmed: `mit·am` is pork fat. This validates the existing
  `corrections.json` entry "the pork meat has a lot of fat" -> `Wak be·en mit·am bang·a`.
- master_dictionary.json (at 852bf73) has `mit·am` only as english "Some"
  (variant/VERIFIED/HIGH, ~line 21098) and `Mitam` as a SUPERSEDED "some" (~line 3262).
  Nothing lists it as fat / pork fat.
- DECISION FOR A: is `mit·am` polysemous (add a separate pork fat / fat row, keep "Some"),
  or is the "Some" gloss wrong? B made NO dictionary edit.

## 2. Second pork-fat form still uncaptured
- `Wak be'enan mitim rarasa`. Likely `mitim` = variant of `mit·am` (B inference, not stated).
- Still unconfirmed: normalized spelling of `rarasa`, and which form is primary.
  corrections.json holds one value per key, so nothing was added.

## 3. Q3 (adjective position in noun phrases) still open
- Thangseng: "depends on the sentence", examples to follow. Reminder drafted for the Project Owner.
- Plural sub-question unanswered. Do not build adjective-position engine support until examples arrive.

## B state
Gates green at 575ea7f (486/486 unit, dictionary pass, repo-intelligence pass).
Not re-run at 852bf73 beyond the checks run after this note was added.
