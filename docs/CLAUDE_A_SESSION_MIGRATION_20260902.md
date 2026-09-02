# Claude A Session Migration — 2026-09-02 (migration-only close)

**This session did no linguistic, data, or repository work.** Its only
task was to resync, record the current state, and prepare this
document plus `WORKSTATE.yaml` for the next Claude A session. No
engine changes, no dictionary changes, no new relay questions
investigated.

**Next Claude A session: resume from the pending native-validation
items; no closed item should be reopened.**

---

## Resync performed this session

Arrived with local HEAD at `5298e68` (this session's own prior work,
already pushed). `git fetch origin` found one new commit,
`a4c91c3` (Claude B, docs-only session-close migration — corrected a
stale instruction about Finding 1's status, no engine/data change).
Fast-forwarded cleanly, no rebase needed, no conflicts. Gate not
re-run by this session (no code/data touched — the fast-forward was
docs-only, and this session made no further code/data changes either).

---

## CLOSED — do not reopen

- **NV-103** — sov-composition engine bug + `garo_dictionary.json`
  `english`-field corruption. Both fixed, verified. Closed.
- **NV-104** — `Mijal` = "yesterday" (native-confirmed, coexists with
  `Mejal`/`me·ja·o`, not merged to one spelling).
- **NV-105** — `Sak` = human/people counting classifier (reconfirms
  already-VERIFIED RULE-038 entry).
- **NV-106** — `ama`'s lexical meaning is the bare modal "can" only;
  the main verb is a separate word, not fused into `ama`. Does not
  change NV-008's three existing sentence rows.
- **NV-107** — `Mejal`/`me·ja·o`/`Mejao` is not limited to literal
  "yesterday" — refers to any specific/recent past time mutually known
  to speaker and hearer (can be a week or two ago). Does **not**
  reopen or affect NV-104 (`Mijal`, a separate spelling, unaffected).
- **NV-108** — "Can" word order: modal placed after the
  infinitive-marked main verb, sentence-final (`Anga Garo aganna
  man·a` = "I can speak Garo").
- **NV-109** — Counting-people bare classifier forms (`sak·sa`/
  `sak·gni`/`sak·gittam`, no head noun) confirmed as native-valid.
  **Not shipped as dictionary rows** — an attempt broke a regression
  test by flipping `pickPrimary` away from the tested `mande sak·sa`;
  reverted. Recorded as citation evidence only in
  `docs/THANGSENG_NATIVE_VALIDATION.md` (NV-109).
- **NV-110** — Multi-adjective order for "big red house": three valid
  natural renderings exist, order is flexible/stress-dependent. Shipped
  as tied VERIFIED dictionary variants, allowlisted in
  `src/data/known_dictionary_conflicts.json`.
- **NV-111** — Purpose/infinitive `-na` confirmed via "I went to eat"/
  "I went to work".
- **`ama` vs `man·a` — CLOSED.** Same function; canonical form is
  `ama`. **This is a Project Owner closure decision relayed directly
  to this session, not a new Thangseng quote/citation** — recorded
  here as instructed. **Known inconsistency to reconcile (first task
  for next session, not new investigation — just aligning stale
  text):** `docs/THANGSENG_NATIVE_VALIDATION.md` still contains three
  passages (in the NV-103 write-up, and in NV-106's and NV-108's "what
  this does not answer" sections) explicitly describing the
  `ama`/`man·a` identity question as "still open"/"remains open." That
  language is now stale per this closure and should be updated to
  reflect it — a documentation-consistency fix, not linguistic
  investigation, since no new evidence needs to be sought. This
  session deliberately did not make that edit itself, per its
  migrate-only scope (limited to this file and `WORKSTATE.yaml`).

For full citations/quotes on all of the above, see
`docs/THANGSENG_NATIVE_VALIDATION.md` (NV-103 through NV-111) and
`docs/GRAMMAR_RULE_CATALOGUE.md` (RULE-038, RULE-042 footnotes). This
list is not a re-derivation — it is transcribed from those existing
records plus the Project Owner's closure instruction for `ama`/`man·a`.

---

## Claude B change that just landed — new baseline

- **Finding 1 (`"did not go"` bug) is now CLOSED — implemented,
  tested, pushed** (commit `20833a7`, prior to this session).
  - Previous (buggy) output: `re·ja`
  - Fixed output: `Re·angja`
  - Root cause and fix are Claude B's engineering work
    (`src/sentenceBuilder.js`) — **do not redo the investigation or
    reimplement it.**
  - **New regression coverage is the new baseline:** 6 new tests
    added, total unit test count is now **290/290** (was 284/284).
    Any future gate run by Claude A should expect 290 as the passing
    total, not 284 — a lower count is not a target, it's stale
    information.
  - Finding 2 (the "only X" construction) is separate and still open
    — see below. Claude B will not touch `tryOnlyIdentityConstruction`
    until native sign-off is in hand.

---

## STILL PENDING — genuinely open, for next Claude A

These are the only linguistic/native-validation items with no closure
yet. Do not invent new questions beyond these; do not attempt to
answer them via pattern-matching or inference.

1. **Relay item — question word + sentence-ending `-ma`:** "When you
   make a question using a question word such as 'who,' 'what,'
   'where,' or 'which,' is a question ending also used? ... Are there
   situations where you would not use a question ending with a
   question word?" No answer received yet. Live text is in
   `docs/THANGSENG_RELAY_QUESTION_20260901B.md`, item 1 of the current
   "SEND THIS SECTION TO THANGSENG" block — ready to send as-is.

2. **Native sign-off — "only X" sentences (blocks Claude B's
   Finding 2):**
   - `"i am the only student"` → currently produces `"Anga
     chattro·ko mangmang"` (method `grammar-assembly`, confidence
     0.82) — not yet native-verified.
   - `"the only fruit i eat is mango"` → currently produces `"Angade
     te·ga·chu Bitekosan Cha·aia"` (method `only-identity-construction`,
     confidence 0.85) — same construction family as the one verified
     "language" case, but not itself individually verified.
   - Relay text (item 2 of the same send block) already includes a
     brief acknowledgment that this question caused confusion in a
     prior round, and offers to rephrase — ready to send as-is, or
     reword further if the next Thangseng response is confused again.

3. **RULE-038 tension — flagged, not resolved, do not force-resolve:**
   Thangseng's bare classifier forms (`sak·sa`/`sak·gni`/`sak·gittam`,
   see NV-109 above) appear to conflict with RULE-038's documented
   claim that "the specific noun is always stated" in Garo counting
   constructions. This is recorded as a footnote in
   `docs/GRAMMAR_RULE_CATALOGUE.md` under RULE-038 and in NV-109. It
   is **not** to be silently resolved either direction (neither
   "the noun is optional" nor "that was elliptical") without an
   explicit Thangseng answer — no question has been drafted for this
   yet; drafting one would be a reasonable next step, not a
   prohibited one, if the next session judges it a priority.

Nothing else is currently flagged as an open native-validation
question in `docs/THANGSENG_NATIVE_VALIDATION.md` or
`.ai/WORKSTATE.yaml`'s `pending_thangseng_questions` field beyond the
three items above.

---

## Explicit instructions to next Claude A

- Do not reopen NV-103, NV-104, NV-105, NV-106, NV-107, NV-108,
  NV-109, NV-110, NV-111, or the `ama`/`man·a` closure.
- Do not redo Claude B's Finding 1 investigation or implementation —
  it is closed, shipped, and tested (290/290).
- Do not touch engine code — that remains Claude B's lane.
- Resync against actual `origin/main` state before doing anything —
  do not assume this document's claims are still current if time has
  passed; another Claude A or Claude B session may have moved things
  further since this was written.
- First reasonable action: reconcile the stale "still open" language
  in `docs/THANGSENG_NATIVE_VALIDATION.md` for the `ama`/`man·a`
  identity question (see CLOSED section above) — a small, safe
  documentation edit, not new investigation.
- After that: proceed with the 3 still-pending items above, in
  whatever order the Project Owner prioritizes, or send the relay
  doc as-is if no other instruction is given.

**Next Claude A session: resume from the pending native-validation
items; no closed item should be reopened.**
