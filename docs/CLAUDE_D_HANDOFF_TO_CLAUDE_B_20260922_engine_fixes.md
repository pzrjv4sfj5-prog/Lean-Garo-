# Report for Claude B — 2026-09-22

**From:** Claude D (dictionary cleanup, OCR batch audits, git sync)
**Repo state at time of writing:** `origin/main` @ `213ef8b`
**Scope of this session:** audit only. No code or data touched.

---

## 1. Audit results

Full gate re-run against current `origin/main`:

| Check | Result |
|---|---|
| `node prepare-data.js` | Clean. 8,829 unique entries compiled, 1,420 alternates, 52 held (SUPERSEDED-only), 806 bare-infinitive aliases added. |
| `node repository-intelligence.js` | **PASSED** — 0 new violations across all 8 checks (cross-table consistency, dictionary self-consistency, pending-lexicon integrity, placeholders, runtime-cascade agreement, confidence schema, modifier+noun collisions). 9 raka-locality candidates flagged report-only, not asserted bugs. |
| `node --test tests/unit/*.test.js` | **458/458 pass**, 0 failures. |

Your `pos`-array fix (`b158512`) and `findVerbForm` -ed fallback fix (`7a906e9`) are both holding clean — no regressions traced to either.

**New `pickPrimary` verified-tie entries since last audit** (list moves as Claude A closes items — currently 19 total, see `docs/PICKPRIMARY_VERIFIED_TIES.md`): `i can go`, `i can work`, `she can cook` — all `ama` vs `man·a` variants not resolved by RULE-050. This is Claude A disambiguation territory, flagged here only for visibility.

---

## 2. Fix #1 — RULE-042 lookup fails on trailing punctuation and parenthetical glosses

**Symptom:** Exact-match lookup succeeds for `Knalde bajalchi re·anggen` (etc.) but fails for the same input with a trailing period, or with a bracketed gloss annotation like `(I)` embedded in the query string. On failure it falls through to `sov-assembly`, producing wrong output (missing `-de`/`-chi` suffixes, e.g. `Knal Anga Bajal Re·anggen` instead of the correct form).

**Root cause:** The lookup key is built from the raw input string with no normalization pass before the exact-match attempt. `RULE-042.yaml` itself is fine — its English glosses use `(I)` only as documentation notation, never as literal Garo/lookup text — so this is purely an input-handling gap, not a rule error.

**Also affects:** `he`/`we` subjects get no `-de`/`-chi` suffix applied at all (separate but related symptom — worth checking whether it's the same normalization gap or a distinct subject-agnostic bug once you're in that code path). Typo'd inputs (e.g. `matket`) also just return unknown, which is expected/acceptable — not the bug, just for completeness.

**Suggested fix:** Add a shared normalization pass *before* any lookup path (exact-match, `sov-assembly`, everything) — not just before the exact-match attempt, so the paths can't silently diverge again. Strip:
- Trailing sentence punctuation: `.`, `!`, `?`
- Parenthetical asides: `/\s*\([^)]*\)\s*/g` (catches `(I)`, `(he)`, etc.)

Retry the exact-match lookup on the cleaned string before falling back to `sov-assembly`. This should live in `lookupEngine.js`, likely near wherever the lookup key is first constructed / `findExactMatch` (or equivalent) is called.

---

## 3. Fix #2 — `VERB_LEMMAS` / `to` prefix canonicalization

**Status: blocked on Owner ruling (c) — do not implement yet.** Documenting the shape of the fix now so it's ready to go the moment the Owner decides.

**Current state:**
- Master (`master_dictionary.json`) stores verbs canonically as `to X` (606 rows currently start with `to `).
- `lookupEngine.js` line 84: `VERB_LEMMAS` is built by checking `key.startsWith('to ')` — comment at line 72 confirms it's built from 939 `"to X"` headwords.
- `prepare-data.js` already auto-generates 806 bare-infinitive aliases (`"to X"` → `"X"`) wherever the bare form had no existing entry, but this is a compile-time convenience alias, not a canonicalization — `VERB_LEMMAS` was never updated to also accept the bare key.
- Owner's instruction (per Claude D's 2026-09-21 migration doc): strip `to` from **all** verbs, single- or multi-word (`to make room` → `make room`). Exception: pronoun-object forms (`to him`, `to him or her`, `with him or her`) keep their wording since they carry distinct meaning and aren't infinitive markers.

**Two ways to implement, once approved — your call on which:**

1. **Flip canonical form.** In `prepare-data.js`, generate `to X` as the alias *of* `X` rather than the reverse (i.e. bare verb becomes canonical, `to X` becomes the compile-time alias). Then update line 84's `VERB_LEMMAS` check from `key.startsWith('to ')` to match the bare form directly. This changes the compiled data shape, so it touches more surface area — but it's the more honest fix if bare verbs are meant to be canonical going forward, not just an engine-side patch.

2. **Lookup-side normalization only.** Keep `VERB_LEMMAS` internally keyed on `to X` as today, but strip a leading `to ` from the *input* query key before the `VERB_LEMMAS` lookup, so both `X` and `to X` resolve identically at runtime. Less invasive — no change to compiled data or master — but leaves the underlying data inconsistency (master still says `to X`) unresolved, just papered over at the lookup layer.

Given the Owner's instruction is about the *data*, not just the *lookup behavior*, option 1 is probably the more correct long-term fix — but flagging both since option 2 is lower-risk if you want to unblock the engine before the data cleanup lands.

**Do not touch master data for this until the Owner rules on (c).** Standing rule: master-wins, never hard-delete, and no code changes without Owner sign-off.

---

## 4. Open items carried forward (not new, for context)

- **(c) `to` prefix ruling** — pending, blocks Fix #2 above.
- **(b) supersede the 17 coexisting P24/P25 rows** — pending.
- **(d) OCT re-audit review rows** (35 review + 5 function-word + 79 drop) — pending.
- **Thangseng's 30-question verification sheet** — answers not yet received.
- **Page 24 photo transcription** — image didn't carry into this session; needs re-upload if wanted.

---

## 5. Standing rules relevant to this handoff

- Fetch `origin` before any work, rebase (never merge) before pushing.
- Never hard-delete a live dictionary row — flip to `superseded` with a citation note.
- `pos` in handoff/pending files must be a plain string, not an array (your earlier fix addressed the pipeline side of this; keep new data conforming too).
- Do not change code without Owner sign-off; this report documents the *shape* of the fixes, not an authorization to implement Fix #2.
- Full gate (`prepare-data.js`, `repository-intelligence.js`, `node --test tests/unit/*.test.js`) on every close.
