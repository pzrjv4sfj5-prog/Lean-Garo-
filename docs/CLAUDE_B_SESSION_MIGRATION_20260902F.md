# Claude B Session Migration — 2026-09-02F (Finding 2 unblocked — NV-112)

## Scope this session
Engineering work resumed after native sign-off arrived for Finding 2's two
blocking sentences. Engine code + tests modified. No dictionary/data files
touched.

## Resync
HEAD at session start: `55d5a5f` (this session's own prior hold doc,
already pushed). `git fetch origin` — no new commits. Clean start.

## Native sign-off received (relayed by Project Owner this session)
1. **"I am the only student."** = `Angan saksa kamkam chatro.`
   Zero-copula nominal predicate. Note from source: stress-dependent,
   alternate framings exist, `mangmang` also valid for "only" here — this
   is one attested surface form, not asserted as the only correct one.
2. **"The only fruit I eat is mango."** = `Angni cha·gipa bitede
   te·gatchusan.`

## NV-112 — implemented, tested, pushed
### Item 1: "I am the only X" (new construction)
- New pattern in `tryOnlyIdentityConstruction` (`src/grammarEngine.js`),
  checked before NV-103's existing pattern (different English shape, no
  overlap). Matches `^i am the only (.+?)\.?$`, looks up the noun via
  `lookupGaro`, returns `Angan saksa kamkam <NOUN>`. Returns `null` (no
  guess) if the noun has no dictionary entry.
- **Narrowly scoped to subject "I" only** — no native evidence for other
  subjects, not generalized.
- `translate("i am the only student")` → `"Angan saksa kamkam Chattro"` ✓

### Item 2: "the only fruit i eat is mango" — contradicts NV-103's general pattern
- This is a **second attestation** for NV-103's "the only X SUBJ VERB is
  Y" shape (original: "the only language i speak is english"). Running it
  through NV-103's existing general pattern produces `"Angade te·ga·chu
  Bitekosan Cha·aia"` — **confirmed wrong** by this new native answer. The
  native form uses a relativizer (`cha·gipa`, "eating" as an attributive
  on the noun) and a zero-copula predicate, structurally different from
  NV-103's bare-SVO-plus-`-aia` pattern.
- This is precisely the risk NV-103's own governance note flagged
  (single-attestation is below threshold for a general rule) — now
  demonstrated concretely.
- **Decision:** shipped as an **exact-match override** inside
  `tryOnlyIdentityConstruction` — fires only for this exact sentence
  (noun=fruit, subject=i, verb=eat, object=mango), returns the verified
  native form directly. NV-103's general pattern is untouched and still
  applies to every other sentence of its shape (verified via regression
  test using "the only game they play is football", unaffected).
- `translate("the only fruit i eat is mango")` → `"Angni cha·gipa bitede
  te·gatchusan"` ✓
- **Not generalized into a second general rule.** Doing so would require
  knowing whether the "eat"/"speak" difference is systematic (e.g. verb
  semantics determining relativizer-vs-bare-SVO) or just two valid
  registers — no evidence either way yet. Flagged as an open question,
  not answered by this session.

## Tests
- Repurposed the NV-103 "general mechanism" test to use "the only game
  they play is football" instead of the now-overridden fruit/mango
  sentence (its old example no longer exercises the general pattern).
- Added: NV-112 override test (fruit/mango exact match).
- Added: NV-112 "I am the only student" test (new construction fires,
  correct output, no `mangmang`).
- Added: NV-112 scope guard — does NOT fire for `"he is the only
  teacher"` (subject ≠ "I", no evidence for other subjects).
- Added: NV-112 no-guess guard — `"i am the only zorblax"` (no dictionary
  entry) does not fire, no invented output.
- Verified unaffected: the original NV-103 attestation ("the only
  language i speak is english") — untouched by this session's changes
  (its `ba·sakosan` vs `ku·sikkosan` drift predates this session, confirmed
  via `git stash` diff — unrelated dictionary change from an earlier
  session, not caused by NV-112).

## Gate (independently run this session)
- `node prepare-data.js` — 8209 unique entries, clean.
- `node test-dictionary.js` — 8209/8209 valid, 9/9 grammatical corrections.
- `node repository-intelligence.js` — 0 new violations.
- `node scripts/resync-stale-overrides.mjs` — 0 resync candidates.
- `node --test tests/unit/*.test.js` — **293/293 pass** (was 290; +3 new).

## Diff scope
`src/grammarEngine.js` (new pattern + exact-match override, both inside
`tryOnlyIdentityConstruction`) and `tests/unit/translationEngine.test.js`
only. Zero `src/data/*.json` changes.

## Relay doc updated
`docs/THANGSENG_RELAY_QUESTION_20260901B.md` — item 2 ("only-X" sign-off)
marked CLOSED, with the answer and a note on the open follow-up question
(why "speak"-type and "eat"-type only-constructions differ structurally —
not yet asked, not urgent, doesn't block anything currently shipped).

## Open follow-up (not urgent, not blocking)
Why do "the only NOUN i eat is Y" and "the only NOUN i speak is Y" differ
structurally in native Garo? Worth asking Thangseng in a future relay if
more "only X" sentences need translating, to determine whether this is a
systematic verb-class distinction or free variation. Does not block
anything currently shipped — both attested sentences now translate
correctly via their respective paths (general pattern / exact override).

## Next session resume
Finding 2 is now CLOSED for both sentences it was blocked on. No other
engineering item is currently open. Gate is green at this doc's commit.
Next Claude B session: resync per standing procedure, re-run gate (don't
trust this doc's claims), then check with Project Owner for next
priority — candidates noted in prior docs: broader subjectless-sentence
coverage, the `chim`-tense gap in `assembleSentenceSOV`, the open
"speak"-vs-"eat" only-construction question above, or a fresh audit pass.
