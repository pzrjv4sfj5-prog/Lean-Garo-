# Claude B Session Migration — 2026-09-01

## Resync

Resumed via `docs/CLAUDE_B_SESSION_MIGRATION_20260831C.md`, per instruction
resynced against **actual repo state**, not that doc's own claims. HEAD at
session start was `07e6ac0` — one commit ahead of the migration doc's own
head pointer: Claude A ran a session after 20260831C closed (NV-103 `man·a`
paradigm batch + Major Finding, `docs/CLAUDE_A_SESSION_MIGRATION_20260901.md`)
and handed three items to Claude B. Working tree was clean, `origin/main`
up to date. `claude_b.next_action` in WORKSTATE.yaml was confirmed untouched
since 20260831C (no other session worked this lane in between).

## Priority 1 (DONE) — NV-103 sov-composition gap

**Bug:** `translate("the only language i speak is english")` shipped
`"mangmang ba·sa Anga to be / to exist Agana"` via `sov-assembly` — a
free-standing "only", wrong word order, and a bare unmarked verb, none of
which match the native structure `Angade English ku·sikkosan aganaia.`

**Root cause:** `assembleSentenceSOV` (the sov-assembly fallback) is a flat
bag-of-words composer with zero topic-marking, zero bound-object-compounding,
and zero verb-ending logic — not a bug in existing logic so much as a
genuinely missing capability. `assembleGrammar` (grammar-assembly) also has
no NP-coherence path for this sentence shape, so it falls all the way through.

**Fix:** added a new, general construction handler —
`tryOnlyIdentityConstruction` in `src/grammarEngine.js` — matching the
pattern `"the only X SUBJ VERB is Y"` and composing it as
`[SUBJ+de] [Y] [X+ko+san] [VERB+aia]`, using only the four morphemes NV-103
actually attested (topic suffix `-de`, object marker `-ko` already RULE-009,
bound "only" `-san`, declarative ending `-aia`). Wired into `translate()`
(`src/translationEngine.js`) at step 5.7, same tier as the existing gija
construction, before grammar-assembly.

Three new morphology helpers in `src/morphologyEngine.js`
(`applyTopicSuffix`, `composeBoundOnlyObject`, `applyDeclarativeEndingAia`)
reuse the existing `stripToStem`/concatenative-suffix convention already
used by `applyNegation`/`applyTense` — no new stripping rule invented.

**Not a single-sentence patch.** Per governance (single-attestation is
below the threshold for a new general RULE — see
`docs/CLAUDE_A_SESSION_MIGRATION_20260901.md` §5), this stays a narrowly-
triggered pattern handler rather than being folded into `applyTense`'s
general suffix table. It does generalize across the whole sentence *shape*,
confirmed live:

| Input | Output |
|---|---|
| the only language i speak is english | Angade [english*] ba·sakosan Aganaia |
| the only fruit i eat is mango | Angade te·ga·chu Bitekosan Cha·aia |
| the only book you read is bible | Na·ade Sastro Ki·tapkosan po·ri·aia |
| the only game they play is football | Uamangde Football Kal·anikosan Kal·aia |

`*` — see the new finding below; the object slot for "english" specifically
still resolves wrong, for a reason outside this fix's scope.

Loanword fallback: if the object noun has no dictionary entry, it surfaces
capitalized as-is (matches the native evidence, where "English" itself
stays untranslated in the Garo sentence) rather than bailing the whole
construction. Verified with `translate("the only language i speak is
klingon")` → object surfaces as `Klingon`.

False-positive guard verified: `translate("i am the only student")` does
NOT route through this construction (no `SUBJ VERB is Y` tail after "the
only student").

### NEW FINDING — flagged for Claude A, not fixed here (out of engineering lane)

NV-103's fix superseded the one corrupted `english` row in
`master_dictionary.json` (`"Call police"`), but a fresh `prepare-data.js`
rebuild still resolves `english` → `"to be / to exist"` in
`compiled_dict.json`. Traced to **`garo_dictionary.json`** — a second,
non-master source that `prepare-data.js`'s `finalizeDictionary`/
`mergedValues` pipeline also reads and merges. It independently holds
**seven** rows keyed bare `"english"`, all mapped to unrelated conjugation-
table fragments, confirmed via direct read:

```
{"english": "english", "garo": "to have / to exist (possession)"}
{"english": "english", "garo": "to eat"}
{"english": "english", "garo": "to go"}
{"english": "english", "garo": "to come"}
{"english": "english", "garo": "to do / to work / to make"}
{"english": "english", "garo": "to give / to offer"}
{"english": "english", "garo": "to be / to exist"}
```

`pickPrimary` selects the last of these. This has the exact same shape as
the corruption NV-103 already diagnosed and fixed in
`master_dictionary.json` — a flattened grammar-paradigm-table object whose
column labels (`english`, `garo`, `past`, `continuous`, `command`, ...) got
imported as if each were a real headword row, with `"english"` itself
becoming a bogus headword paired with whatever value happened to land next
to it.

**Not touched this session.** `garo_dictionary.json` content judgment is
Claude A's data-authority lane, and it isn't clear from this session alone
whether the file is even still meant to be a live merge input — several
other places in this repo's history describe it as "since migrated into
master_dictionary.json." Two options for Claude A to choose between:
(a) supersede/clean the seven corrupted rows in `garo_dictionary.json`
directly, matching the NV-103 precedent, or (b) if the file is legacy and
fully superseded by `master_dictionary.json`, stop merging it in
`prepare-data.js` entirely (a bigger, separately-scoped call).

## Priority 2 (DONE) — apostrophe exact-phrase lookup fix

Investigated the anomaly Claude A flagged (NV-103 §5): `compiled_dict.json`
holds an exact key `"i don't know garo"` → `"Angade Garo man·ja."`, but
`translate("i don't know garo")` shipped a different `grammar-assembly`
result instead.

**Root cause, confirmed via live trace:** `translationEngine.js`'s step-2
exact-phrase lookup (`const exactPhrase = lookupGaro(lower)`) only ever
tried `lower`, the apostrophe-**stripped** form. This is the third
recurrence of a bug class already fixed twice earlier in this exact
cascade — `corrections.json` (step 1, RC-CANDIDATE-030) and
`phrase_maps.js` (step 1.5, 2026-08-20) both already try the apostrophe-
preserved form first and only fall back to the stripped form. The
exact-phrase step, sitting between them, never got the same fix. Since
`compiled_dict.json`'s keys preserve apostrophes, the stripped lookup key
`"i dont know garo"` was simply never in the dict.

**Fix:** same three-form try order as the two existing precedents —
`lookupGaro(lowerWithApos) || lookupGaro(cleaned) || lookupGaro(lower)`,
scoped to this one lookup site.

Live-verified: `translate("i don't know garo")` now returns
`{garo: "Angade Garo man·ja.", method: "exact-phrase", confidence: 0.98}`.
Confirmed the two existing apostrophe-preserving paths are unaffected:
`translate("i don't know")` still resolves via `phrase-map`
(`"Anga uija"`), `translate("let's go")` still resolves via `correction`
(`"Hai re·naha"`).

## Priority 3 (HELD, correctly not implemented)

Checked `claude_a.pending_thangseng_questions` before touching NV-008's
`ama` construction, per instruction not to invent or merge forms. The
`ama` vs `man·a` relay question is confirmed **still open/unanswered** —
queued 2026-08-31C, re-referenced as "still-open, still-unanswered" in
Claude A's 2026-09-01 close (this session's own resync point). NV-103
itself explicitly declined to resolve the split ("a person/register split
is a plausible reading but is exactly the kind of pattern-based inference
the project's methodology forbids resolving without an explicit Thangseng
answer").

Implementing the `ama` construction now would require picking between
`ama` (NV-008, first-person declarative — "I can eat" = Anga cha'na ama)
and `man·a` (NV-103, second-person ability-question/negation forms) without
a native ruling on why they differ. That's exactly the unresolved-pattern
inference this project's own methodology forbids. **Left untouched,
holding for Thangseng's answer** — not a missed task, a correctly-blocked
one.

## Priority 4 (deferred)

The broader grammar/morphology/tense engineering audit
(`prepare-data.js`, `garo_classifier.js`, corrections/override layer) was
**not started** this session — explicitly instructed to wait until
priorities 1–3 were addressed, and priority 3 is correctly blocked on an
external answer rather than resolvable this session. Given the token-
budget instruction, starting a new audit theme on top of that wasn't a
good use of what's left. Next session should pick this up fresh.

## Gate

Run at baseline (before any change) and after each of the two fixes:

| Stage | Tests | Dict entries | Grammatical corrections | Repo-intel | Resync |
|---|---|---|---|---|---|
| Baseline | 277/277 | 8205/8205 | 9/9 | 0 new | 0 candidates |
| After fix 1 (NV-103 construction) | 282/282 | 8205/8205 | 9/9 | 0 new | 0 candidates |
| After fix 2 (apostrophe lookup) | 284/284 | 8205/8205 | 9/9 | 0 new | 0 candidates |

`prepare-data.js` output was byte-identical (same 8205 entries, same
held/tie/no-verified-candidate counts) across every rerun this session —
confirms zero dictionary *data* was touched, only engine code and tests,
exactly as scoped. 7 new regression tests added (5 for the NV-103
construction — including cross-pronoun generalization, the loanword
fallback, and a false-positive guard — 2 for the apostrophe fix).

## Files changed

- `src/grammarEngine.js` — new `tryOnlyIdentityConstruction`
- `src/morphologyEngine.js` — new `applyTopicSuffix`,
  `composeBoundOnlyObject`, `applyDeclarativeEndingAia`
- `src/translationEngine.js` — wired the new construction into the
  cascade (step 5.7); apostrophe fix at step 2 (exact-phrase)
- `tests/unit/translationEngine.test.js` — 7 new regression tests
- `.ai/WORKSTATE.yaml` — `claude_b.next_action` updated, prior archived
  as `next_action_prior_20260831C`
- `docs/CLAUDE_B_SESSION_MIGRATION_20260901.md` — this file

No dictionary data files (`master_dictionary.json`, `compiled_dict.json`,
`corrections.json`, `phrase_maps.js`, `garo_dictionary.json`) were
modified — confirmed via clean `prepare-data.js` diff at every stage.

## Cross-role handoffs

**To Claude A (data hygiene, new finding):** the seven corrupted
`"english"`-keyed rows in `garo_dictionary.json` — see "NEW FINDING" above.
Blocking correct output for the NV-103 flagship sentence's object slot,
even though the composition engine itself is now fixed.

**To Claude A (unchanged, still queued):** the `ama` vs `man·a` Thangseng
relay question — still needs an explicit answer before Priority 3 can be
implemented.

## Next-session priorities (exact resume point)

1. **First**, check whether Claude A answered the `ama`/`man·a` relay
   question or cleaned the `garo_dictionary.json` "english" rows — if
   either landed, this session's holds can close.
2. If neither landed: pick up **Priority 4**, the grammar/morphology/tense
   engineering audit (`prepare-data.js`, `garo_classifier.js`,
   corrections/override layer) fresh, per the Project Owner's original
   brief.
3. Do not re-verify Priorities 1–2 (this session's NV-103 construction fix
   and the apostrophe-lookup fix) unless something in the cascade they
   touch (`translationEngine.js` steps 2 or 5.7, `grammarEngine.js`,
   `morphologyEngine.js`) changes — they're confirmed working and pushed,
   gate green.

## Verification

HEAD == origin/main, zero divergence, clean working tree, no untracked
files, no local-only commits — confirmed after push (see commit log).
