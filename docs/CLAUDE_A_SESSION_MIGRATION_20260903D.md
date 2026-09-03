# Claude A Session Migration — 2026-09-03D

**Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260903C.md`.** Resync on
arrival: `git fetch` found Claude B's `NV-119`/`NV-120` handoff-fix commit
had landed; pulled fast-forward, no conflicts (disjoint files from my own
prior commits).

## Work this session

Two new Thangseng relays processed.

### NV-121 — question-word `-ma` scope closed (sawa/maiko/bachi/badiako)

Project Owner supplied 4 native sentences: "Who came?" (`sawa`), "What
did you eat?" (`maiko`), "Where did you go?" (`bachi`), "Which one did
you take?" (`badiako`) — all confirming **no `-ma`** on question-word
questions, exactly the evidence this session's predecessor (20260903C)
had declined to guess at without.

- Promoted `master_dictionary.json`'s `"who"` → `"Sawa"` from
  `unverified` to `verified_high`.
- Added 4 new `master_dictionary.json` sentence rows, all VERIFIED/HIGH.
- Formalized the scope rule as **RULE-048** (new
  `docs/grammar_rules_structured/RULE-048.yaml` +
  `docs/GRAMMAR_RULE_CATALOGUE.md` entry) — correcting a citation-hygiene
  problem found in the process: NV-113's text had labeled its version of
  this rule "RULE-047 (new)", but RULE-047 was already assigned
  (2026-08-30, comitative `-ming`) and the question-word rule was never
  actually filed under any number. No damage done (nothing was ever
  double-filed), just an unfiled/mislabeled rule sitting in prose. Fixed.
- **Live bug found and fixed (Rule 8):** `repository-intelligence.js`
  Check F flagged a new runtime-cascade mismatch — `corrections.json`'s
  pre-existing `"where did you go"` → `"Na·a bano re·anga?"` (stationary
  `bano`) contradicted both the new `bachi` (movement) citation and
  RULE-044's own directly-cited example (`Na·a bachi re·angenga?` =
  "where are you going?", movement). Verified live
  (`translate("where did you go")` was shipping `bano` before the fix).
  Fixed `corrections.json` directly to `bachi`, per Rule 8 ("fix stale
  values directly, never allowlist"). Not treated as a coin-flip
  ambiguity — RULE-044's own movement/stationary contrast made this a
  clear correction, not a genuine tie.
- Scope explicitly NOT claimed: `bano` (stationary "where") itself
  remains untested for the no-`-ma` pattern — only `bachi` was cited.

### NV-122 — `maikai`/`maidake` ("how") semantic split

Project Owner relayed (gloss-level, no full sentence): `maikai` = "how,
in order that, so that"; `maidake` = "how" (only); `maikai` "a bit more
versatile."

- Promoted `master_dictionary.json`'s `"how"` → `"Maikai"` from
  `unverified` to `verified_high`. Runtime-neutral: `corrections.json`'s
  pre-existing `"how"` → `"maidake"` has precedence and is unaffected —
  same non-conflict shape as NV-114's `mangmang`/`saksa kamkam` finding.
- **Flagged, not closed:** `maikai`'s purpose ("in order that"/"so
  that") sense is relevant to the still-OPEN `-na`/purpose item (NV-111)
  — raises the possibility of an alternate purpose-marking strategy. No
  sentence evidence shows `maikai` actually used this way yet — not
  asserted, left as a candidate next relay question.

## Full gate (re-run after all edits)

- `node prepare-data.js` — 8217 unique compiled entries (was 8213, +4
  from NV-121's sentences).
- `node test-dictionary.js` — 8217/8217 valid, 9/9 grammatical
  corrections.
- `node repository-intelligence.js` — **1 new violation caught and
  fixed** (Check F, `"where did you go"` cascade mismatch — see above),
  0 remaining after fix.
- `node --test tests/unit/*.test.js` — 314/314.
- Live-verified all 4 new NV-121 sentences + the `bachi` fix via
  `translate()` — all correct, `where did you go` now returns `Na·a
  bachi re·anga?` at confidence 1.0 (`correction` method).

## Runtime Handoff

None — no engine code touched. One data fix shipped (`corrections.json`
`"where did you go"`), covered by the full gate above, not an engine
change.

## CLOSED — do not reopen

- Question-word `-ma` scope for `sawa`, `maiko`, `bachi`, `badiako`
  (NV-121, RULE-048).
- `"where did you go"` → `bachi` (not `bano`) — data bug, fixed.
- `maikai`/`maidake` "how" split, `maikai`'s broader gloss (NV-122) — the
  gloss itself is closed; its purpose-clause implication is NOT closed
  (see below).

## STILL PENDING

1. **RULE-038 tension** (NV-109) — unchanged, still open.
2. **"Only X" third-person scope** — unchanged, still open.
3. **`maikai` as a purpose connective** (NV-122's flagged-not-closed
   item) — new this session. Needs a full sentence citation.
4. **`bano`'s own no-`-ma` behavior** — untested; only `bachi` was cited
   for RULE-048. Likely the same, not asserted.

## Explicit instructions to next Claude A

- Do not reopen NV-121, NV-122, or RULE-048.
- Do not assert `maikai` marks purpose clauses without a sentence
  citation — the gloss says it can, no sentence shows it doing so.
- Do not touch engine code.
- Resync against actual `origin/main` before doing anything.

## Repository status at close

- HEAD (this commit) == origin/main after push — verify via `git fetch`
  + compare before trusting this line.
- `git status`: clean.
- `.ai/WORKSTATE.yaml`: updated this session.
- `.ai/SESSION_BOOTSTRAP.md`: unchanged.
- This migration doc: complete.
- No local-only commits, no uncommitted changes.
- Native-validation status: 2 new NVs closed (NV-121, NV-122), 1 live
  bug found and fixed, 4 items remain genuinely open (see above), no
  blockers.
