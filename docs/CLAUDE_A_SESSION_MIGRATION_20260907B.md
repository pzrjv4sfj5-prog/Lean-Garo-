# Claude A Session Migration — 2026-09-07B

## Resumed from
docs/CLAUDE_A_SESSION_MIGRATION_20260907.md, HEAD eaef5f3 at that doc's
close. On resume this session: fast-forwarded through 4 commits already
landed by other roles before any work started — aaa3a2e/672fcf3 (that
migration doc's own commit + WORKSTATE pointer update), 20d53f5/00e6e92
(Claude B: intensifier-verb-election fix + its migration doc). No
conflict, no action needed on any of them.

## Work this session
Two items, Project Owner-directed, both data/citation-layer only — no
engine code touched.

**1. Apostrophe/hyphen -> raka (·) cleanup.** Reviewed all 112 apostrophe
rows + 3 hyphen rows in `master_dictionary.json` against
`docs/GLOBAL_RAKA_CONVERSION_HANDOFF.md` and RULE-042 (a'/an'/am' is a
distinct grammatical prefix, load-bearing, never raka — confirmed
structurally different, not a typo variant). Converted 13 rows, each
confirmed via an existing raka-spelled duplicate/root already live
elsewhere in the corpus (not guessed): "your feet stinks"/"abnormal"
(stale twins of existing raka rows), Butt=Ki'sang->Ki·sang (matches
a'ki·sang), the re'/ra' cluster (let's-go-to-market, go-to-the-market,
4 where-questions, the buy-question) -> re·/ra· (matches dozens of
established re·a/re·ang-/ra·a rows), blink=Mik-chip-a->Mik·chip·a
(byte-matches the SUPERSEDED wink=Mik·chip·a row from the same NV-080
batch, confirming the hyphen was the typo), film-ko->film·ko (matches
the ·ko marker used by 58 other rows + hardcoded in the engine), and
the NV-097 "knowledge (alt)" internal hyphen->raka per that PDF batch's
own stated convention. Synced 2 propagation gaps this surfaced (Rule 8
check): `corrections.json`, plus non-pipeline `garo_dictionary.json`/
`final_entries.json` copies of the same strings. Fixed 1 stale test
assertion (`translationEngine.test.js`) hardcoding the old apostrophe
value.

**Deliberately left 99 apostrophe rows untouched:**
- ~94 are the a'/an'/am'-prefixed land/blood-sense vocabulary (RULE-042)
  — genuinely a distinct grammatical marker, converting would be wrong.
- Angry cluster (`ka'o nangnabe`/`nangengama`/`nangatnabe`, `bika ding'a`)
  — raka placement/count for this exact word family is an existing OPEN
  dispute (`docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md`).
  Converting would silently resolve a flagged linguistic question with
  no new evidence. NOT resolved here — still open, needs Thangseng.
- `adultery`=`Til'eka` — direct bare-form native citation (NV-062), no
  corroborating raka-spelled duplicate anywhere in the corpus.
- `Vagina`=`Si'i` — already tagged variant/AMBIGUOUS/HIGH, no comparanda
  found either direction.
- Flagged, not fixed, unrelated to raka: idx 3130 "Axe" has an English
  parenthetical (`'to pour'`) polluting the garo field itself — a
  separate data-hygiene item; a clean duplicate row (`ru·a`) already
  exists and should be pickPrimary's preferred candidate.

**2. Data anomaly (english="0", garo="don't do").** Investigation found
this is not an isolated typo — it's part of an 8-row cluster (idx
2984-2991) of schema/metadata debris from a mis-imported source
structure: `title`/`version`/`word_order`/`_description`/`structure`/
`breakdown`/`_classifier` plus this numeric `"0"` key, none are real
English-Garo entries. Confirmed all 8 were shipping live in
`compiled_dict.json` under these literal keys. Tagged all 8 SUPERSEDED
(retained, not deleted, per citation discipline) rather than deleted or
guessed at.

## What's NOT done
- Angry-cluster raka placement — still open, unchanged, needs a
  Thangseng question (not corpus-resolvable).
- Axe garo-field pollution (idx 3130) — flagged, not fixed this session
  (out of the requested scope).
- `Til'eka`/`Si'i` apostrophe status — left as transcribed, no evidence
  either way.
- Still carried from the prior migration doc, untouched: gnisan-vs-gni
  (NV-138), the tied "finish the difficult work tomorrow" candidate
  (relay q3, no answer yet), donbo/re·anga formal sign-off (data already
  correct, never formally asked), saksan-vs-loneliness. All still
  restated in `docs/THANGSENG_RELAY_QUESTION_20260906.md`, not yet sent.

## Verification
- `prepare-data.js`: 8249 unique entries (was 8257 before the SUPERSEDED
  tagging; the 8 junk keys are now correctly excluded from compile)
- `test-dictionary.js`: 8249/8249 valid, 9/9 grammatical corrections
- `repository-intelligence.js`: 0 new violations, all 8 checks (Check F's
  2 transient new mismatches from the raka commit were resolved by the
  corrections.json/garo_dictionary.json/final_entries.json sync before
  the second commit)
- `node --test tests/unit/*.test.js`: 350/350 passing
- `scripts/runtime-error-sweep.mjs`: 14755 translate() calls, 0 errors
- `scripts/resync-stale-overrides.mjs`: 0 new candidates
- Every touched raka-cleanup key live-verified via `translate()` post-
  build (your feet stinks, abnormal, let's-go-to-market x2, the 4
  where/buy questions, go-to-the-market, blink, i-saw-the-film, and the
  knowledge-alt variant via compiled_dict_alternates.json) — all resolve
  correctly, zero apostrophes/hyphens remain in any touched output.

## Repository status at close
- HEAD: `25b54ff` — verified via `git rev-parse HEAD`
- origin/main: `25b54ff` — verified via `git fetch` + `git rev-parse
  origin/main` — **matches exactly**
- `git status`: clean, no uncommitted changes
- No local-only commits — both commits this session pushed together,
  gate green before each
- `.ai/WORKSTATE.yaml`: updated in this same commit sequence (see below)
- `docs/SESSION_BOOTSTRAP.md`: not updated this session — no new standing
  rule, only data/citation changes
- Migration doc: this file, complete
- Native-validation status: no new NV entries this session — both items
  were corpus-internal orthography/data-hygiene fixes needing no new
  Thangseng evidence
- Blockers: none

## Runtime Handoff (mandatory)
No engine code touched this session — only `master_dictionary.json`,
`src/data/corrections.json`, `garo_dictionary.json`, `final_entries.json`,
`tests/unit/translationEngine.test.js`, and this documentation. Compiled
artifacts (`compiled_dict.json`, `compiled_dict_alternates.json`,
category index, and the auto-generated `PICKPRIMARY_NO_VERIFIED_
CANDIDATE.md` report) were regenerated via `prepare-data.js` and
confirmed via the full gate above. Claude B/C/D: no known open
engine-side items from this session.

## Next Recommended Tasks
1. Send `docs/THANGSENG_RELAY_QUESTION_20260906.md` (still not sent —
   gnisan-vs-gni, tied finish-sentence, donbo/re·anga sign-off,
   saksan-vs-loneliness)
2. Angry-cluster raka placement (`ka·o·nang·a` vs `ka'o nanga` count/
   position) — needs an explicit Thangseng question, flagged this
   session, not previously queued in the relay doc above
3. Axe garo-field pollution (idx 3130) — quick data-hygiene fix, no
   native input needed, just strip the parenthetical into notes
