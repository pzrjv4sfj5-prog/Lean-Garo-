# Counting System — Compile-Pipeline Audit (2026-08-13, Claude A)

## Scope
Systematic cross-check of every counting entry (1–20) in `src/compiled_dict.json`
(the live/shipped output) against its source record(s) in `master_dictionary.json`,
across all nouns currently in the counting system: dog, fish, person, teacher,
student, house, tree, car, cat, apple, banana, rice, water, food, road, river,
mountain, village, book, fruit, coin, pen (~350 individual number-noun keys checked).

This was prompted by relaying the native-confirmed `two trees = Bol panggni`
value, which is already correct and live — no action needed there. Auditing it
led to checking the rest of the counting system for the same 100%-match
standard, per Project Owner request.

## Method
For each `"<numberword> <noun>"` key: pulled every master-record candidate with
that exact English key, checked which one's `garo` value matches what
`compiled_dict.json` actually ships, and checked that candidate's `notes` field
using the corpus-standard `notes.trim().startsWith('SUPERSEDED')` test (not
substring search — substring search false-positives on VERIFIED entries whose
own notes *mention* the word SUPERSEDED while describing history, e.g. "three
dog").

## Findings

### 1. Confirmed clean (146 keys) — no action needed
`dog`, `fish`, `person`, `cat`, `apple`, `tree`, `book` all ship VERIFIED values
across the full 1–20 range, correctly following
`NOUN+CLASSIFIER+NUMBER-SUFFIX` with the established suffix chain
(sa/gni/gittam/bri/bonga/dok/sni/chet/sku/chiking, Chi·sa…Chi·sku, Kolgrik) and
correct raka-dot placement per classifier family. These match the 2026-08-12
QA's finding that the formula itself is linguistically sound.

### 2. Isolated pickPrimary precedence bug — `one dog`
`compiled_dict.json["one dog"]` = `achak mang·sa`. Two master candidates exist
for this exact key with the *same* Garo string, one tagged VERIFIED/HIGH, one
tagged SUPERSEDED (legacy unannotated import — the SUPERSEDED record's own
notes say "compile pipeline does not yet apply confidence precedence" and
flag a handoff to Claude B). Harmless in this specific case only because both
candidates happen to hold the identical value — but it means the tie-break is
non-deterministic/incorrect, matching the known 2026-08-06 pickPrimary class
of bug. Flagging for Claude B; not a linguistic issue.

### 3. Severe — 12 nouns are shipping fabricated, already-repudiated data (~230 keys)
**`teacher`, `student`, `house`, `car`, `banana`, `rice`, `water`, `food`,
`road`, `river`, `mountain`, `village`** — for nearly every number 1–20,
`compiled_dict.json` is currently serving the exact bulk-fabricated value that
the 2026-08-10 and 2026-08-12 audits already tagged `SUPERSEDED`, and **no
VERIFIED alternative exists anywhere in the corpus for any of them** (`has_alt_verified=False`
on every single one). This is not a live/superseded tie-break failure like
`one dog` — there is nothing else for the pipeline to fall back to. The
SUPERSEDED tag was correctly applied by prior audits, but the compile step
has no "ship nothing if only a SUPERSEDED candidate exists" rule, so it ships
the repudiated value anyway.

Concretely, right now a user asking for "five teacher" gets
`bonga skigipa·gni` — the exact fabricated string already on record as
provably wrong (suffix stuck at the 2's-suffix `·gni` regardless of claimed
count, English number word incorrectly prepended in front of a
noun+classifier+suffix construction that doesn't take one). Same pattern for
all 12 nouns, all non-1 counts.

This confirms and substantially widens the 2026-08-12 handoff note
("confirm the compile pipeline isn't still surfacing the newly-tagged 13
entries anywhere") — it isn't 13, it's ~230, and it isn't new; these were
tagged across three separate audit dates (2026-08-09, -10, -12) and have been
shipping live the whole time.

## What this is and isn't
This is a **compile-pipeline defect** (Claude B's domain), not a linguistic
content gap. The already-completed linguistic work (SUPERSEDED-tagging the
fabrications, confirming the formula) is correct and doesn't need redoing.
What's missing is either (a) a pipeline rule that ships no translation rather
than a SUPERSEDED one when no VERIFIED candidate exists, and/or (b) the
actual VERIFIED replacement values for these 12 nouns — which is exactly the
native-relay work already queued (teacher/student/mountain/village/road/
banana/car, held pending this session) plus house/rice/water/food, not yet
relayed.

## Handoff to Claude B
1. Compile pipeline: when the only candidate(s) for a key are SUPERSEDED,
   ship nothing (or a clearly-marked placeholder) rather than the SUPERSEDED
   value. This affects ~230 live keys right now.
2. Re-check the `one dog`-class tie-break (identical-value duplicates,
   VERIFIED + SUPERSEDED coexisting) — confirm it's cosmetic-only elsewhere
   and not masking a real mismatch on some other key.

## Not done this session
Per one-task-per-session discipline, this audit is the full task. Writing the
actual VERIFIED replacement values (teacher/student/mountain/village/road/
banana/car from the held native relay, plus house/rice/water/food which
still need native input) is queued as the next session(s) — now with the
added context that it isn't just filling a gap, it's replacing what's
currently live and wrong.
