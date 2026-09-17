# Claude B — Session Migration (2026-09-17)

**Supersedes:** `docs/CLAUDE_B_SESSION_MIGRATION_20260916.md` (that doc's
§7 NEXT TASK is now done — see §3 below; its §8 open items are carried
forward here, updated with this session's progress).

---

## 1. Project identity

Lean-Garo — English→Garo translation engine. Claude B's lane is the
**runtime engine** (`src/`) and its tests. Dictionary/OCR data cleanup is
Claude D's lane; native-evidence curation and contract docs are largely
Claude A's. Claude B does not invent Garo linguistic forms — anything not
mechanically derivable from confirmed evidence goes back to the Project
Owner (who relays to Thangseng, the native speaker). This session leaned
on that line harder than most: repeated direct requests to "apply the
logic" and generalize a classifier's 20-99 form to unconfirmed
classifiers were declined every time, and every fix in §3 came from an
actual literal Thangseng citation, not inference.

---

## 2. Current state

- **HEAD at time of writing:** `05cedc3`, pushed to `origin/main`, clean.
- **Gate:** 413/413 unit tests, `repository-intelligence.js` 0 new
  violations, `resync-stale-overrides.mjs` 0 candidates,
  `runtime-error-sweep.mjs` **0 errors across 15,262 `translate()`
  calls**.

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
| `613fe4c` | **Object-final punctuation fix** — completed §7's NEXT TASK from the prior migration doc. `grammarEngine.js`'s object-extraction loop pushed the raw, unstripped token, so a sentence-final object like `"rice?"` kept its `?` into dictionary lookup, which failed → `[UNKNOWN]` → fallback to the weaker `sov-assembly` path with no question-marking. Fixed by stripping trailing sentence punctuation before the push, keeping `·` intact. `"did you eat rice?"` now correctly uses the `-hama` suffix. |
| `bce1472` | **`vegetable`=`mesu`** (Owner-directed, fills a key-mismatch gap — only plural `vegetables` existed); **`two teachers`** corrected to match the already-verified `two teacher` classifier form (`Skigipa sakgni`) by mechanical parity, not a new linguistic call; **kg-measured rice**=`merong` (uncooked), not the default cooked `mi` — confirmed via Owner citation `"merong kg gni"`, which also confirmed kg's no-raka behavior; **`garo_dictionary.json`'s stale `"eight dogs"` row deleted** — the root-cause cleanup flagged for Claude D in the prior migration doc, done directly this session per Owner authorization to act on data across the usual Claude B/D lane split for this specific batch. |
| `5a900ac` | **Mango spelling conflict resolved** — see §5. **Bug 2 partial fix** — see §6. |
| `05cedc3` | **Bug 2, `gong` (money) confirmed** — see §6. |

---

## 4. Standing rules established or reinforced (do not re-litigate)

1. **Never fabricate a linguistic form by "applying logic" from other
   confirmed forms, even under direct repeated pressure to do so.** This
   session's Bug 2 data is the concrete proof this isn't just caution:
   `sak` and `rong` share one shape (fused, no raka dot) but `mang` and
   `gong` share a *different* shape (fused, WITH a raka dot) — see §6.
   Two out of four confirmed classifiers would have made any
   "generalize from the majority" guess wrong. There is no shortcut here;
   every classifier needs its own citation.

2. **A native citation beats an Owner chat instruction that has no
   citation behind it, when the two conflict — but both sides get
   documented, never silently erased.** See §5. This is not a general
   license to override Owner directives; it applied here specifically
   because an *older, already-archived* native citation (NV-048/
   RULE-038) independently corroborated the newer one, so two
   independent evidence sources agreed against one unsourced
   instruction.

3. **Concurrent-session conflicts on the same data need to be
   surfaced, not silently picked between.** Claude A and this session
   both touched mango's canonical spelling the same day, with different
   Owner instructions. Resolved by evidence quality (citation vs. no
   citation), documented in full in both the commit and in chat with the
   Project Owner, not just quietly overwritten.

4. **`prepare-data.js`'s same-key self-consistency check (CHECK C)
   needs the allowlist updated whenever a key legitimately ends up with
   two differently-confidence-tagged values.** Hit this for `"two
   teachers"` (§3) — added to `src/data/known_dictionary_conflicts.json`
   the same way the pre-existing `"two teacher"` entry already was.

5. Everything in the 2026-09-16 doc's §4 (`mang`/`sak` have no raka dot
   for single digits; never rewrite a `confidence: superseded` row's
   value; explicit numeral allowlist for bulk classifier edits;
   `unverified` rows don't suppress anything; historical dated docs are
   evidence, not state) still holds, unchanged.

---

## 5. Mango — spelling conflict, resolved

Three spellings were in play by the end of this session:

1. `te·ga·chu` — the long-standing corpus value, actually a typo/drift
   from an older citation (see below).
2. `Te·gachu` — set canonical by **Claude A's same-day commit `4ed4e0c`**,
   sourced from an Owner chat instruction (`"Te·gachu is right word,
   correct it across repo"`) with **no Thangseng reference given**.
3. `te·gatchu` — given to Claude B as **Thangseng's explicit final
   answer**, relayed by the Project Owner in chat, later the same
   session.

The tiebreak: a pre-existing row (`"Mango"`→`"te·ga·chu"`, cross-ref
2026-08-01) carried a note that had *already* identified its intended
value as `"te·gatchu"` from **Thangseng's original rong-classifier
example (NV-048/RULE-038)** — the stored string had simply drifted to
`te·ga·chu` at some point without anyone noticing. That archived citation
independently corroborates the fresh one, so `te·gatchu` had two
agreeing evidence sources against Claude A's single unsourced
instruction.

**Resolution:** `te·gatchu` is canonical for `mango`/`the mango`.
`Te·gachu` and `te·ga·chu` are both `superseded`, with the full
back-and-forth documented in each row's `notes` (nothing silently
erased, per this project's citation-discipline convention).

```
translate('mango')        -> "te·gatchu"
translate('the mango')    -> "te·gatchu"
translate('seven mangoes')-> "te·gatchu rongsni"
```

---

## 6. Bug 2 — 20-99 classifier compounds, partially closed

**Old bug:** the `sak` (person) 20-99 surface form (`"Chattro saksotbri
sa"`) had been mechanically substituted into every other classifier's
name, producing garbled output with a stray mid-word capital letter and
an inconsistent raka dot (`"41 cars"` → `"gari bolSotbri·sa"`).

**What's now confirmed, via direct live Thangseng citations relayed by
the Project Owner in chat — and note these do NOT share one shape:**

| Classifier | Noun | 20-99 form | Shape |
|---|---|---|---|
| `sak` (person) | student | `Chattro saksotbrisa` | fused, **no** dot |
| `mang` (animal) | dog | `Achak mang·sotbrisa` | fused, **with** dot |
| `rong` (fruit) | mango | `te·gatchu rongkolgrikbonga` | fused, **no** dot |
| `gong` (money) | coin | `tangka bisil gong·sotbrisa` | fused, **with** dot |

`mang`'s dot here is a *separate fact* from its own already-confirmed
n<20 no-dot rule — a compound tens+units word is a different
construction from a bare digit, not a contradiction of the earlier
citation. `gong`'s dotted compound form is at least consistent with (if
not derivable from) its own already-confirmed dotted single-digit rule
(`gong·bonga` for 5, `gong·sa` even after a large-number prefix in
`"hajal chikking gong·sa"` for 10,001) — but it was still confirmed
separately for the compound case, per the `mang` precedent that
single-digit and compound behavior aren't guaranteed to match.

**Implementation:** `src/garo_classifier.js`'s `classifierTail()` has a
`CONFIRMED_COMPOUND_CLASSIFIERS` map (`{sak, mang, rong, gong}`, each
with a `dot: boolean`). Any other classifier at n>19 returns `null`,
which lets `translate()` fall through to the engine's existing
morphology fallback (`'[UNKNOWN] <word>'`) instead of shipping a
fabricated/garbled compound. This is an intentional behavior change:
before, unconfirmed classifiers at 20-99 shipped confidently-wrong
output; now they honestly surface as unresolved.

**Still fully unconfirmed, no evidence, do not guess:**

- `bol` (car/vehicle) — the classifier from the *original* bug report
  (`"41 cars"`), still not answered despite being asked for directly.
- `king` (book/flat object)
- `ge` (general/pen fallback)
- `jol` (pole/rod)
- `se` (tool)
- `te` (house)

If asked to "apply the logic" to any of these: don't. See §4.1 for why
that specific move has already produced a wrong prediction once this
session (mang breaking the sak/rong pattern).

---

## 7. Still open — need Project Owner / Thangseng input

- **Bug 2, remaining six classifiers** (§6) — a relay question covering
  `bol`/`king`/`gong`(now closed)/`ge`/`te` was drafted this session (in
  chat, not committed to a file) and partially answered (`gong` only, via
  a separate follow-up). `bol`, `king`, `ge`, `jol`, `se`, `te` remain
  fully open.
- **Bug 3 — exact-hundred collision.** `buildLargeClassifierPhrase`
  renders `n=100` and `n=101` to the **identical string** for a given
  classifier. Confirmed a real code-level collision. No confirmed
  example anywhere in the repo for classifier + exact hundred. **Do not
  guess.** Unchanged from the 2026-09-16 doc.
- **`tool`/`tools` dictionary gap.** Worse than previously documented:
  currently shipping *wrong* fuzzy matches (`"tool"`→"fool", d=1;
  `"tools"`→"books", d=2), not just a missing entry.
- **`litre`/`plate` raka.** Still unverified, still defaulted to
  no-raka as a majority-pattern guess. `kg`'s raka behavior (no dot) WAS
  confirmed this session via the `"merong kg gni"` citation (§3) — update
  from the 2026-09-16 doc, which had all three unit words as unverified.
- **The deliberately-unfixed possessive variant** (`"have you eaten your
  lunch?"`, NV-120 regression guard) remains untouched by design —
  unattested territory, not an oversight.

---

## 8. Flagged for Claude D (not Claude B's lane)

- **`"two teachers"` root-cause data fix** — done this session directly
  (§3), per explicit Owner authorization to close out this batch of open
  items across the usual lane split. Not a standing change to who owns
  what; treat the lane split as normal again unless told otherwise.
- No new Claude-D-lane items surfaced this session beyond what's already
  in Claude D's own most recent migration doc.

---

## 9. Resume protocol

1. `git fetch origin` **first**. Re-run the full gate before trusting any
   claim in this document — Claude A and D move fast and this doc *will*
   go stale.
2. Inspect any concurrent commits for overlap with `src/` before
   rebasing. Data/doc-only commits from A/D are usually safe to
   fast-forward past.
3. Rebase, **re-run the full gate against the merged state**, then push.
   Never push on a gate that was only green pre-rebase.
4. Don't re-litigate §4.
5. **If a chat message asks you to derive/generalize/"apply logic" for a
   Garo form instead of citing one:** decline, the same way this session
   did repeatedly for Bug 2 (§4.1, §6). This is not a stalling tactic —
   the actual data collected this session shows the guess would have
   been wrong 50% of the time even from four data points.

### Operational note from this session

A PAT was shared directly in chat (twice, reused across the session at
the person's explicit instruction — "we have validity for usage"). It
was used only for `git push`, immediately stripped back out of the local
remote URL after each push, and never echoed in full in any command
output or committed to any file. Standard practice going forward: don't
persist a chat-shared credential beyond the push it's needed for, same
as prior sessions' PAT handling.
