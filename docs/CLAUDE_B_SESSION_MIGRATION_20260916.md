# Claude B — Session Migration (2026-09-16)

**Supersedes:** `docs/CLAUDE_B_SESSION_MIGRATION_20260912.md`
(that doc's claimed HEAD `3eb7a39` was already stale by several commits
when this session resumed from it — see "Resume protocol" below).

---

## 1. Project identity

Lean-Garo — English→Garo translation engine. Claude B's lane is the
**runtime engine** (`src/`) and its tests. Dictionary/OCR data cleanup is
Claude D's lane; native-evidence curation and contract docs are largely
Claude A's. Claude B does not invent Garo linguistic forms — anything not
mechanically derivable from confirmed evidence goes back to the Project
Owner (who relays to Thangseng, the native speaker).

---

## 2. Current state

- **HEAD at time of writing:** `6359fed`, pushed to `origin/main`, clean.
- **Gate:** 398/398 unit tests, `repository-intelligence.js` 0 new
  violations, `resync-stale-overrides.mjs` 0 candidates,
  `runtime-error-sweep.mjs` **0 errors across 15,255 `translate()` calls**.

**Re-verify before trusting this.** Claude A and Claude D commit
frequently and concurrently; this doc was stale within minutes last time.

```bash
git fetch origin && git log --oneline HEAD..origin/main
node --test tests/unit/*.test.js
node repository-intelligence.js
node scripts/resync-stale-overrides.mjs
node scripts/runtime-error-sweep.mjs
```

---

## 3. Done this session (all pushed, all gate-green)

| Commit | What |
|---|---|
| `9e0d90e` | **Bug 5** — `-es` plurals (mangoes/boxes/potatoes/dishes) singularized via naive `s$` strip to a nonexistent word, silently bypassing classifier composition into the weak sov-assembly fallback. Added `singularize()` handling `-ies/-oes/-[sxz]es/-ches/-shes`; removed a redundant second `s`-strip in `translationEngine.js` that would have double-stripped `bus`→`bu`. |
| `1cee194` | **Bug 4** — `parseCountingPhrase` never consumed `hundred`/`thousand` past the first word despite them being in `NUMBER_WORDS`; `"one hundred dogs"` parsed as count=1 with the multiplier silently dropped. Added explicit thousands/hundreds/tens-block grammar. Preserved RC-CANDIDATE-031 (`"twenty ten"` must not combine). |
| `729564f` | **`chu` spaced** — Owner-confirmed `"beer rong sa"` takes a literal space. `beer`/`alcohol` both resolve to the one noun `chu`, so the exception is per-noun (`SPACED_NOUNS`), not classifier-level. Threaded a `spaced` flag through `classifierTail`/`buildLargeClassifierPhrase`/`buildClassifierPhrase`/`countNoun`. |
| `4499b2c` | **Bug 1 (`sak`)** — resolved with **no code change**. See §5. |
| `bf94f87` | Answered Claude D's Batch 7 suppression question; flagged the `"two teachers"` finding. |
| `c234957` | **`mang` de-dotted (engine)** — removed `mang` from `RAKA_CLASSIFIERS`. |
| `6359fed` | **`eight dogs` regression** — suppressor row restored. See §6. |

---

## 4. Standing rules established (do not re-litigate)

1. **`mang` has NO raka dot.** Owner-confirmed 2026-09-13 from a
   Thangseng citation — `"ango na.tok manggittam donga"` = "I have three
   fish". Asked explicitly whether the missing `·` was real or a
   typing/relay artifact; Owner: *"Real — mang genuinely has no raka dot,
   full stop."* This **reverses** a long-standing project stance and a
   large body of older dotted citations. `RAKA_CLASSIFIERS` is now
   `{ge, gong, te, king}`.

2. **`sak` has NO raka dot.** Confirmed independently twice (see §5).

3. **NEVER rewrite the value of a `confidence: superseded` row.**
   `prepare-data.js` suppresses untagged `garo_dictionary.json`
   duplicates by **exact value match** against superseded master rows
   (`supersededByKey`, populated only from `confidence === 'superseded'`
   or a `notes` field starting `SUPERSEDED`). Changing a superseded
   row's value breaks the match and lets the garbled duplicate resurface
   in `compiled_dict.json`. **This was hit live this session** — de-dotting
   the `six dogs` superseded row un-suppressed `dokka mang·gni`. Reverted
   from backup and excluded superseded rows. This is the same failure
   mode as the earlier "Batch 6 regression".

4. **When bulk-editing classifier forms, use an explicit numeral
   allowlist.** Words that merely *start* with a classifier string are
   real vocabulary, not classifier+count: `mang·rak·a`, `mang·sok·a`,
   `mang·song·a`, `mang·meng·a`, `mang·meng·dil·a`, `mang·tip`,
   `mang·gu·ak`, `mang·ru·dam`, `mang·wa·a`, `mang·kal·a`. A blind
   `mang·`→`mang` replace corrupts all of them.

5. **`unverified` rows do not suppress anything.** Only `superseded`
   does (rule 3). Verified by reading `prepare-data.js` directly.

6. **Historical dated docs are evidence, not state.** Correct stale
   *in-code comments* and live contract/rule files; leave dated
   transcripts, relay tables, and handoff snapshots untouched so the
   evidence chain stays intact.

---

## 5. Bug 1 (`sak`) — CLOSED, and why it kept reappearing

Attempted to add `sak` back to `RAKA_CLASSIFIERS` per dot-form evidence
cited in the 2026-09-12 migration doc (`mande sak·sa`, `sak·ki`, a
`grammarEngine.js` comment citing `bi·sa sak·gittam`). **Two pre-existing
tests failed**, both citing **NV-124 (closed 2026-09-05)** as having
*deliberately removed* `sak` to match already-corrected dictionary data.

Reverted and escalated rather than picking a side. Owner supplied a fresh
Thangseng citation:

> `"Angan saksa kamkam chatro"` = "I am the only student"
> `Saksa` = one person; `Sakgni` = two persons

**No dot** — matching NV-124 exactly. No code change was needed; the
shipped behavior was already right.

**Why this matters for you:** Claude A's 2026-09-11/12 addendum *and*
Claude D's 2026-09-12 WORKSTATE cross-note both independently flagged
`sak` as "still broken", both citing the same stale dot-form evidence
NV-124 had already superseded. Claude A separately reached the same
conclusion and retracted. **If you see `sak·` cited anywhere as evidence,
it is stale.** Do not re-add `sak` to `RAKA_CLASSIFIERS`.

---

## 6. `eight dogs` — fixed, but the root cause is still live

`eight dogs` was the **one** key from the Batch 1 deletion (`913ffd1`)
with no replacement row. `garo_dictionary.json` independently carries a
garbled value for that exact key: `"chet manggni"` — a bare count suffix
with no noun root, **and the wrong numeral** (`gni`=two, not `chet`=eight).
With the master row deleted, nothing suppressed it, so it shipped live.

Fixed by re-adding an explicit `confidence: superseded` **suppressor**
row (not usable data). The key now falls through to composition and
correctly yields `achak mangchet`.

**The root fix — deleting the stale row from `garo_dictionary.json` —
is Claude D's lane and has NOT been done.** Flagged in the row's own
`notes`.

---

## 7. NEXT TASK — ready to implement, now fully unblocked

**`docs/CLAUDE_B_HANDOFF_20260913_object_question_UNKNOWN.md`** (from
Claude A, diagnosed down to the source line).

**Symptom:** `"did you eat rice?"` → `Na·a Mi Cha·a` (method
`sov-assembly`, 0.75) — question mark and interrogative suffix both
silently dropped. `"did you eat?"` (no object) works fine.

**Root cause:** `src/grammarEngine.js` line ~584:

```js
objectWords.push(words[i]);   // raw, unstripped token
```

Every other extraction point in that file cleans first (see lines 257,
538: `.toLowerCase().replace(/[^a-z]/g,'')`). When the object is the
sentence-final word it still carries the trailing `?`, so
`lookupGaro("rice?")` fails → `object.garo = '[UNKNOWN]'` →
`sentenceBuilder.js` bails (`if (result.includes('[UNKNOWN]')) return null`)
→ falls through to `assembleSentenceSOV`, which has no question-marking,
discarding correctly-detected subject/verb/tense/isQuestion.

**Fix:** strip trailing punctuation before that push (or on `lastWord`/
`objEng` before the lookups at ~635 and ~712). **Keep `·` in the allowed
character set** — it's a real character in Garo dictionary keys.

**Suffix question — RESOLVED 2026-09-16, no longer blocking.** The
Project Owner confirmed that `"did you eat food"` → `Na·a Mi Cha·ahama?`
**came from Thangseng** — it is a native citation, not an inference. So:

- **Use `-hama`** for `eat`. It is natively attested both with an object
  (`Na·a Mi Cha·ahama?`) and without (`"did you eat"`).
- **Do NOT use `-gama`** for `eat`. It was an Owner-side proposal with no
  citation behind it; `-gama` is attested only for present-continuous
  questions (`"are you eating"` → `...engama?`) and a couple of specific
  past-tense verbs (`"did you go"` → `Re·angama?`).

**Scope:** reproduces for any question with a sentence-final object not
already hardcoded in `corrections.json`. `"did you eat water?"`
reproduces it live. `"did you drink water?"` does *not*, only because a
`corrections.json` override short-circuits before grammar-assembly.

---

## 8. Still open — need Project Owner / Thangseng input

- **Bug 2 — `sak` 20-99 doesn't generalize.** The fused tens surface form
  works for `sak` (`"Chattro saksotbri sa"`, Owner-confirmed) but not for
  other classifiers: `"41 cars"` → `gari bolSotbri·sa`. Needs a decision
  on whether the `sak` pattern is meant to generalize.
- **Bug 3 — exact-hundred collision.** `buildLargeClassifierPhrase`
  renders `n=100` and `n=101` to the **identical string**. Confirmed a
  real code-level collision (not word-vs-digit input). But fixing it
  requires knowing the correct Garo surface form for classifier + exact
  hundred, and **there is no confirmed example anywhere in the repo** —
  every `confirmed_examples` entry in
  `data/garo_number_classifier_engine_machine_ready.json` is a
  single-digit count. Same evidentiary gap as Bug 8. **Do not guess.**
- **Water/`chi` spacing.** Owner said *"maybe water"* when asked whether
  `chu`'s space generalizes. That's not a confirmation — `chi` is
  deliberately left fused. Marked unconfirmed in the contract's Water row.
- Vegetables dictionary-key mismatch; `tool`/`tools` gap; `kg`/`litre`/
  `plate`/`se` raka unverified.

---

## 9. Flagged for Claude D (not Claude B's lane)

- **`"two teachers"`** (plural key) ships the missing-classifier defect
  **live right now**: `skigipa·gni` instead of the correct `sak`-classifier
  form. Different key from the singular `"two teacher"` that was audited;
  `confidence: unverified`, never audited by anyone.
- **`garo_dictionary.json`'s stale `"eight dogs"` row** — see §6.

---

## 10. Resume protocol

1. `git fetch origin` **first**. Re-run the full gate before trusting any
   claim in this document — Claude A and D move fast and this doc *will*
   go stale.
2. Inspect any concurrent commits for overlap with `src/` before
   rebasing. Data/doc-only commits from A/D are usually safe to
   fast-forward past.
3. Rebase, **re-run the full gate against the merged state**, then push.
   Never push on a gate that was only green pre-rebase.
4. Don't re-litigate §4 or §5.

### Operational warning from this session

I ran `git reset --hard origin/main` while my own engine fix was
committed but **unpushed**, and destroyed it. Recovered via
`git reflog` + `git cherry-pick`. If you find yourself reaching for
`reset --hard` to resolve a messy rebase, check `git log @{u}..HEAD`
for unpushed work first.

Claude A did the `mang` data de-dotting in parallel with me
(`22b3e6d`, `5628bd2`), covering `garo_dictionary.json` and
`corrections.json` too. Their pass de-dotted *both* sides consistently, so
suppression stayed matched — their approach was sound and I deferred to
it, keeping only my unique `eight dogs` fix. **Expect this kind of
overlap; check for it before starting any bulk data edit.**
