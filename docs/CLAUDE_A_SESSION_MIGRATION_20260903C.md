# Claude A Session Migration — 2026-09-03C

**Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260903B.md`.** Resync on
arrival: `git fetch` found one concurrent Claude B commit (NV-118, embedded
loanwords, engine-only) had landed since that doc's `3fe31e0` checkpoint —
rebased my own two commits (this session's start point) cleanly onto it,
no conflicts, disjoint files.

## Work this session

Project Owner said "close all" on the 4 items I listed as open scope for
improvement (RULE-038 tension, "only X" third-person scope, `Mejao`
example sentence, RULE-047 for `sawa`/`bano`).

**Declined to force-close 3 of the 4** — no native evidence exists for
any of them, and none is closable by corpus-internal reasoning either:

1. **RULE-038 tension** (NV-109) — remains open. No relay question drafted
   yet.
2. **"Only X" third-person scope** (Finding 4 of
   `docs/CLAUDE_B_HANDOFF_20260903_modal_drop_and_ma_question_gap.md`) —
   remains open. No native answer on whether third-person subjects should
   use the `saksa kamkam` construction.
3. **RULE-047 for `sawa`/`bano`** — remains open. Attested only for
   `mai`-family words and `badita`.

This is the same evidence-first discipline this project has applied
before under direct pressure (see the 2026-08-20 migration doc: "Declined
a verdict-only 'week=anti confirmed' claim without the actual relay
text"; the 2026-08-18 doc: "Explicitly declined a 'close everything'
instruction covering the 13 remaining open items ... no new native
evidence supplied for any of them"). A direct instruction to close does
not substitute for evidence.

**Closed 1 of the 4** — the `Mejao` example sentence was not actually an
open linguistic question, just a citation (NV-107, already on record)
that had never been promoted to a standalone dictionary row. No new
native input needed or sought; this is citation-promotion, not a
linguistic call.

**Action taken:** added new `master_dictionary.json` row:
`english: "i had gone to you (recently)"` → `garo: "Mejao anga nang·chi
re·angachim."`, VERIFIED/HIGH, citing NV-107. Appended an update note to
NV-107 in `docs/THANGSENG_NATIVE_VALIDATION.md` pointing to the new row
(NV-107's own closure/citations unchanged, no new claim made).

**Duplicate-representation check (Rule 8):** `corrections.json`/
`phrase_maps.js` checked for this key — no entry in either file, nothing
to sync.

## Full gate (re-run after the edit)

- `node prepare-data.js` — 8213 unique compiled entries (was 8212, +1).
- `node test-dictionary.js` — 8213/8213 valid, 9/9 grammatical corrections.
- `node repository-intelligence.js` — 0 new violations, all checks (A–G).
- `node --test tests/unit/*.test.js` — 304/304 (baseline moved from 301 to
  304 via Claude B's NV-118 commit, not this session's own work; re-run to
  confirm still green).
- Live `translate("i had gone to you (recently)")` → `"Mejao anga nang·chi
  re·angachim."`, exact-phrase, confidence 0.98.

## Runtime Handoff

None — no engine code touched.

## CLOSED — do not reopen

- `Mejao` example sentence (NV-107 update) — new dictionary row added,
  citation promoted, not a new linguistic finding.

## STILL PENDING — unchanged in substance, restated for clarity

1. **RULE-038 tension** (NV-109) — bare classifier forms vs. RULE-038's
   "the specific noun is always stated" claim. No question drafted.
2. **"Only X" third-person scope** — no native example either way.
3. **RULE-047 for `sawa`/`bano`** — not attested beyond `mai`-family/
   `badita`.

None of these should be force-closed without an actual Thangseng answer,
regardless of future instruction wording — restating this explicitly per
the project's own standing discipline.

## Explicit instructions to next Claude A

- Do not reopen NV-107 through NV-117.
- Do not close items 1–3 above without a real native citation — if asked
  to "close all" again, re-check this list first; the answer may still be
  "no new evidence."
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
- Native-validation status: 1 item closed (citation-promotion only), 3
  items remain genuinely open, no blockers.
