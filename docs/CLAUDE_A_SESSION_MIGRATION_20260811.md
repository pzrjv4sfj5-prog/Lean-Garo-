# Claude A Session Migration Document — 2026-08-11 (checkpoint close)

## Project identity
Lean-Garo — Garo language dictionary + English-to-Garo translation engine.
Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Claude A role: linguistic
authority only (grammar/morphology/dictionary quality/native validation
review). Never touches engine code (Claude B) or OCR ingestion (Claude D).

## Current commit/state
- HEAD at close of this session: state immediately before the commit that
  carries this file (per `.ai/WORKSTATE.yaml`'s `head_convention`).
- 203/203 unit tests passing.
- `prepare-data.js` build clean: 8146 unique compiled entries.
- `repository-intelligence.js`: 0 new violations, all six checks (A-F).
- Working tree clean, fully pushed, nothing local-only.

## What's done this session (in order)

1. **Cat counting closed.** Native-confirmed (Thangseng, via Tridip):
   `three cat`=`Menggo mang·gittam`, matching the existing live `two cat`.
   Closed the standing "three cat" open question from
   `docs/CLAUDE_A_COUNTING_SYSTEM_AUDIT_20260810.md`. Mechanically completed
   dog/cat 1-10 counting off the confirmed roots (`achak`/`menggo`) + the
   already-VERIFIED `mang` classifier + suffix formula.

2. **Bird root closed for good.** `bird`=`chicken`=`do·o` — same word, bird
   is the category. Supersedes the 2026-07-24 relay that had split these
   into `Do·`(generic)/`do·o`(chicken). Caught a hidden bug along the way: a
   cited "VERIFIED/HIGH" reference example (`ten birds`) had silently been
   using `do·a` — an unrelated word meaning "climb"/"upward" — this whole
   time, not a bird-root spelling variant. Fixed.

3. **Teen counting (11-19) + twenty implemented for the first time in
   dictionary data.** Formula `CLASSIFIER·Chi·[ones-suffix]` (11=`Chi·sa` …
   19=`Chi·sku`), twenty=`classifier·Kolgrik`. This formula already existed
   in `garo_classifier.js`'s `TEENS` table (confirmed 2026-06-28) but had
   never been applied to the counted-noun dictionary entries — the original
   523-entry fabrication audit left 11-20 as untouched placeholders. Applied
   across dog/cat/bird (mang), book (king), person (sak), rupees (gong).

4. **Book root closed for good, repo-wide.** `kitab` → `ki·tap` in both
   `master_dictionary.json` (68 non-counting phrases: possessives,
   questions, adjectives) and `garo_dictionary.json` (legacy source file
   also read by the compile pipeline, same 68 occurrences). All 20
   fabricated book-counting entries (1-20) rebuilt: `ki·tap king·[suffix]`,
   with the raka dot (confirmed both by native relay and the pre-existing
   live `ki·tap king·gittam`=`three books` reference).
   **Deduplication side effect:** removed 1,437 exact-duplicate rows from
   `garo_dictionary.json` (pre-dating this session, a legacy artifact of
   repeated imports) and 9 from `master_dictionary.json` (see bug note
   below). Net result: exactly one live value per key, everywhere.

5. **Generalized `NOUN+CLASSIFIER+NUMBER-SUFFIX` across every classifier
   category with an established root, 1-20:**
   - person (`mande`+`sak`, raka): filled in 2-10, which had been missing
     the `sak` classifier token entirely (same bug class as book) — plus 20.
   - rupees (`tangka`+`gong`, raka): added 20.
   - tree (`a'bil`+`pang`, **no** raka — confirmed by the pre-existing live
     `a'bil panggni`=`two trees` reference): full 1-20 rebuild, replacing
     the fabricated `rang`-filler-root entries.
   - fruit (`bite`+`rong`, no raka): root closed (`fruit`=`bite`,
     `fruits`=`biterang` as a distinct plain-plural word, not just
     `bite`+suffix), full 1-20 rebuild.
   - pen (`kolom`+`ge`, raka): root closed (`pen`=`kolom`, matching the
     pre-existing live `Anga kolom donga`=`i have a pen`), full 1-20 rebuild,
     plus fixed the embedded English loanword in `can you give me your
     pen?`.
   - `final_entries.json` (an orphaned data file — not currently read by
     any build script, but kept in sync per the precedent Claude B set
     fixing it for bird) had the same `mewa`/`Pen` root errors, plus a
     wrong classifier (`ge` instead of `rong`) on its fruit entry. Fixed
     to match.

## Bug caught and fixed mid-session (self-introduced, contained)
An early script in this session used `notes.includes('SUPERSEDED')` to test
entry status. Several VERIFIED entries' own citation text contains the word
"SUPERSEDED" (e.g. "...retained SUPERSEDED per citation discipline"), so the
substring check false-positived on them as already-superseded, producing 9
harmless-but-messy exact-duplicate live rows for `eleven book` through
`nineteen book`. Caught via a full-corpus duplicate-live-value audit, fixed
by switching every status check to `notes.trim().startsWith('SUPERSEDED')`,
and deduplicating the resulting rows. **Confirmed via full-corpus audit: zero
incorrect SUPERSEDED mis-tagging occurred anywhere else** — the bug's blast
radius was exactly those 9 rows, all now cleaned up.

## Open items — explicitly not touched (root ambiguity, needs native input)
- **Fruit/pen were closed this session** — remove from any prior "open"
  list.
- **Person/student/teacher's wider root conflict** (111 candidates per
  Claude B's `docs/COUNTING_PHRASE_AUDIT_20260810.md`) — `person` itself is
  now fully resolved (`mande`), but the broader student/teacher family still
  has UNVERIFIED/untagged/competing roots. Not touched.
- **Apple** (`rong` classifier): two competing VERIFIED entries (`Apple`
  loanword vs `te·spu` native). Needs a native pick between named
  competitors, not formula application.
- **Coin** (`gong` classifier): root untagged.

None of the above are safe for mechanical regeneration — each needs either a
missing verification tag resolved or a pick between named competing words,
both native-confirmation calls, not formula application (same discipline
established by NV-071 and the reverted 413-fix).

## Standing rules reaffirmed this session
- Evidence-first methodology: never guess a root or classifier assignment;
  flag and leave open when evidence conflicts.
- SUPERSEDED-retention citation discipline: fabricated/wrong values are
  never deleted, only marked SUPERSEDED with a citation explaining why and
  what replaced them.
- Status checks on `notes` must use `.trim().startsWith('SUPERSEDED')`, not
  `.includes('SUPERSEDED')` — the latter false-positives on VERIFIED
  entries whose citation text references the word. **New rule, add to
  `SESSION_BOOTSTRAP.md` if not already reflected there.**
- One task per session / reconcile against actual origin state before
  acting, not just the pasted migration doc — origin had advanced past the
  doc at the start of this session (concurrent Claude A dog/cat/bird/book
  teens work), and this pattern held again mid-session (Claude B's
  concurrent fish-count and bird-propagation fixes, rebased cleanly three
  times).

## Exact next step
No committed next task. Natural continuations, in rough priority order:
1. Native-confirmation round for apple (`Apple` vs `te·spu`) and coin's root
   — both are small, single-question asks suitable for the next Thangseng
   relay batch.
2. Person/student/teacher's 111-candidate root conflict — larger, needs its
   own scoped session per the resume-protocol rule in
   `docs/MIGRATION_2026-08-11.md` (size queued work against context budget
   before starting).
3. General sweep for any other English-loanword placeholders (like the old
   `Pen`/`kitab`) still living in `master_dictionary.json` or
   `garo_dictionary.json` — not systematically searched for this session,
   only found via the two the Project Owner named.
