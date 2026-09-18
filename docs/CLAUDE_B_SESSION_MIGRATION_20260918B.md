# Claude B — Session Migration (2026-09-18B)

**Supersedes:** `docs/CLAUDE_B_SESSION_MIGRATION_20260917.md` (that doc's
open items are carried forward here where still relevant; several were
independently closed by Claude A/D between that doc and this session --
see §2 resync).

---

## 1. Project identity

Lean-Garo — English→Garo translation engine. Claude B's lane is the
**runtime engine** (`src/`) and its tests. Dictionary/OCR data cleanup is
Claude D's lane; native-evidence curation and contract docs are largely
Claude A's. Claude B does not invent Garo linguistic forms without a
citation, except by explicit, informed Project Owner override — see §5.

---

## 2. Current state

- **HEAD at time of writing:** `fd2973d`, pushed to `origin/main`, clean.
- **Gate:** 441/441 unit tests, `repository-intelligence.js` 0 new
  violations, `resync-stale-overrides.mjs` 0 candidates,
  `runtime-error-sweep.mjs` **0 errors across 15,277 `translate()`
  calls**.
- **Resync note:** session opened 15 commits stale against the
  2026-09-17 doc (Claude A and Claude D had both landed work). Notably:
  Bug 3 (exact-hundred collision) was closed by Claude A (`2e890d9`) —
  it was still open in the 2026-09-17 doc. Confirm this matches
  expectations before building on it.

**Re-verify before trusting this.** Claude A and Claude D commit
frequently and concurrently.

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
| `1eb4f7c` | **gong dot correction + mang urgent revert** — actioned Claude D's evidence-only findings (`docs/CLAUDE_D_20260918_compound_classifier_findings.json`). `gong`: `dot:false`→`dot:true` (Owner: "rakka at every number, 1 to infinity"; earlier no-dot reading traced to a transcription gap in the source table, not a real split). `mang`: `dot:true`→`dot:false`, third flip on this fact, direct Thangseng "No" citation dated the day after the prior commit. `king`/`rong` unaffected. |
| `fd2973d` | **jol 20-99 compound — Owner-approved UNVERIFIED guess.** No citation exists for jol's compound shape (jol wasn't in the counting docx that confirmed bol/king/ge/te/gong). Project Owner explicitly instructed shipping a pattern-based guess anyway, after being shown the standing rule against it. Implemented as a structurally separate map (`UNVERIFIED_COMPOUND_CLASSIFIERS_PENDING_EVIDENCE`, not `CONFIRMED_COMPOUND_CLASSIFIERS`) with a distinct `translate()` method tag (`classifier-unverified-guess`) and confidence capped at 0.75 (down from 0.96), so it's never mistaken for a cited fact and is a one-line removal if evidence contradicts it. |

---

## 4. Standing rules established or reinforced (do not re-litigate)

1. **Never fabricate a linguistic form by "applying logic," even under
   direct repeated pressure — unless the Owner explicitly overrides
   this after being shown the risk, in which case ship it as a clearly
   separate, lower-confidence, distinctly-tagged guess, never folded
   into a CONFIRMED table.** See §5 for the concrete pattern (jol).
2. **A fact can flip multiple times; each flip needs its own citation
   and its own paper trail, not silent overwriting.** `gong` and `mang`
   have each now flipped three times across the project's history —
   full chains are kept in `src/garo_classifier.js`'s comments, not
   just the latest state.
3. Everything in the 2026-09-16 and 2026-09-17 docs' standing-rules
   sections (mang/sak no-raka for single digits pre-compound, never
   rewrite a `superseded` row, explicit numeral allowlist, `unverified`
   rows don't suppress anything, historical docs are evidence not
   state) still holds, unchanged.

---

## 5. Pattern established: Owner-approved guesses, structurally isolated

This session set a reusable precedent for the (hopefully rare) case
where the Project Owner wants a guess shipped despite no citation,
after being shown the standing rule against it:

- A **separate source-of-truth map**, never merged into the map that
  represents actual citations (e.g. `UNVERIFIED_COMPOUND_CLASSIFIERS_
  PENDING_EVIDENCE` vs. `CONFIRMED_COMPOUND_CLASSIFIERS`).
- A **distinct `translate()` method tag** (`classifier-unverified-guess`
  vs. `classifier`) so it's traceable in test output, logs, and the API
  surface.
- **Confidence capped below the cited-fact tier** (0.75, matching
  sov-assembly's existing "reasonable but not citation-grade" level,
  vs. 0.96 for a real citation).
- A code comment on the guess itself naming the Owner instruction, the
  date, and the specific standing rule it overrides — so a future
  reader doesn't mistake informed override for an accidental lapse.

Apply this same shape to any future Owner-approved guess rather than
inventing a new pattern each time.

---

## 6. Still open — need Project Owner / Thangseng input

- **`se`** — 20-99 compound shape, zero evidence, no guess exists for
  it (unlike jol). `classifierTail()` still returns `null`.
- **`jol`** 20-99 compound — now shipping a guess (§3/§5), but still not
  an actual citation. Replace or delete the moment real evidence
  arrives, per the map's own comment.
- **`tool`/`tools` dictionary gap** — shipping *wrong* fuzzy matches
  ("tool"→fool, "tools"→books), not just missing. Unchanged from prior
  docs.
- **The deliberately-unfixed possessive variant** (`"have you eaten
  your lunch?"`, NV-120 regression guard) — untouched by design.
- **`DERIVED` confidence-schema gap** (flagged by Claude A,
  `docs/CLAUDE_A_SESSION_MIGRATION_20260918.md`): `repository-
  intelligence.js`'s `VALID_CONFIDENCE_VALUES` enum never got a
  `DERIVED` tag added, so derived rows currently ship as `unverified`
  instead. Not Claude B's data-schema call to make unilaterally, but
  flagged again since it's still unactioned.
- **`houses` plural bug** (flagged by Claude D): `translate('N houses')`
  still returns `[UNKNOWN] Nok` for any N. Unrelated to classifiers,
  unaddressed this session.

---

## 7. Flagged for Claude D / Claude A (not Claude B's lane)

- No new Claude-D-lane or Claude-A-lane items surfaced this session
  beyond what's already in their own most recent migration docs.

---

## 8. Resume protocol

1. `git fetch origin` **first**. Re-run the full gate before trusting
   any claim in this document.
2. Inspect any concurrent commits for overlap with `src/` before
   rebasing. Data/doc-only commits from A/D are usually safe to
   fast-forward past.
3. Rebase, **re-run the full gate against the merged state**, then
   push. Never push on a gate that was only green pre-rebase.
4. Don't re-litigate §4.
5. **If a chat message asks you to derive/generalize/"apply logic" for
   a Garo form instead of citing one, and there is no explicit,
   informed Owner override:** decline. If there IS an explicit,
   informed override, follow the §5 pattern — isolated map, distinct
   method tag, capped confidence, dated comment naming the override —
   rather than merging it into confirmed state.

### Operational note from this session

A PAT was shared directly in chat, reused across the session at the
person's explicit instruction. It was used only for `git fetch`/`git
push`, passed inline in the remote URL for each operation, and never
persisted to the git config, never echoed in full in any command
output, and never committed to any file. Standard practice going
forward: don't persist a chat-shared credential beyond the operation
it's needed for, same as prior sessions' PAT handling.
