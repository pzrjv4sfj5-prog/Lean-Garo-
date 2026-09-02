# Claude A Session Migration — 2026-09-01C (FINAL, this session)

**This is the authoritative migration doc for the next Claude A session.**
Supersedes `docs/CLAUDE_A_SESSION_MIGRATION_20260901B.md` (still valid
history, not deleted — read only if you want the NV-103/NV-104
blow-by-blow; everything you need to resume is summarized here).

**Resumed from:** `docs/CLAUDE_A_SESSION_MIGRATION_20260901.md`, same-day,
three continuation points in one long session (20260901 → 20260901B →
this doc, 20260901C).

## 1. What happened this session, in order

1. Resumed from the 20260901 migration doc. Drafted, then Thangseng
   answered same-session: NV-104 ("yesterday"=Mijal, confirmed as a
   separate valid variant alongside Mejal/me·ja·o, not merged).
2. Push was rejected (non-fast-forward) — Claude B pushed concurrently
   (`015d737`), fixing the NV-103 sov-composition engine bug AND an
   apostrophe exact-phrase lookup bug in the same commit. Rebased
   cleanly, no conflicts.
3. Claude B's fix exposed a follow-on data bug: the object "english"
   resolved to garbage. Root cause: 7 corrupted rows in
   `garo_dictionary.json` (column-misalignment import junk). Fixed:
   deleted the 7 rows, added a correct `english → English` citation-form
   row to `master_dictionary.json` (VERIFIED/HIGH, sourced from the
   loanword already present in NV-103's own confirmed sentence),
   allowlisted the resulting conflict pair. **NV-103 is now fully
   closed** — no open items remain from that finding.
4. All of the above (NV-104 close + NV-103 full close + the
   `garo_dictionary.json`/`master_dictionary.json` fix) was committed
   and **pushed to `origin/main` using the Project Owner's PAT**, per
   explicit instruction — this is what was "missing" that a fresh
   Claude A session couldn't find before this push.
5. Per a second explicit instruction (move beyond isolated sentences,
   test productive composition, build a Complex Sentence Grammar
   Matrix, no engine code, no new rules invented): built
   `docs/COMPLEX_SENTENCE_GRAMMAR_MATRIX_20260901.md` — 14 live
   composition tests across the requested categories (topic/contrast,
   adjective phrases, modifiers, case+verb, negation+tense, question+
   tense, modal+verb, classifier+number, locative+movement, purpose
   clause, coordination, longer SOV, multi-construction, wh-question),
   each checked against `docs/GRAMMAR_RULE_CATALOGUE.md`.

## 2. Current repository state

- HEAD after this session's final commit will be pushed to
  `origin/main` — verify with `git fetch && git log -1 --format='%H'
  origin/main` immediately on resume, per Rule 10.
- Working tree: clean after this session's final commit + push (verify
  with `git status --short`).
- Full gate green as of the NV-103/NV-104 close commit: 8205/8205
  entries, 9/9 grammatical corrections, 284/284 unit tests, 0 new
  repository-intelligence violations. **The grammar matrix work in
  step 5 above touched no dictionary/engine files — only added
  `docs/COMPLEX_SENTENCE_GRAMMAR_MATRIX_20260901.md` and updated
  `.ai/WORKSTATE.yaml`'s text fields — so no gate re-run was needed for
  that part.** Confirm this assumption is still true on resume (i.e.
  `git status --short` should show only doc/WORKSTATE changes for this
  part, nothing in `master_dictionary.json`/`src/`).

## 3. Full gate commands (run these on resume per Rule 10, don't skip)

```
node prepare-data.js
node test-dictionary.js
node repository-intelligence.js
node --test tests/unit/*.test.js
```
Expect: 8205/8205, 9/9, 0 new violations, 284/284 (or higher if Claude B
added more tests since).

## 4. Pending Thangseng questions (queued, not yet sent as of this doc)

Two separate items, both open:

**(A) Original item (2), still open, unrelated to this session:** "can"
— `ama` vs `man·a`. Full precise wording already queued in
`.ai/WORKSTATE.yaml` → `claude_a.pending_thangseng_questions`, tagged
`OPEN 2026-08-31C`.

**(B) NEW this session, from the grammar matrix, 5 items — item (i)
below MERGES WITH (A) above, send as one combined relay batch, don't
send twice:**
1. Modal+verb co-occurrence: where does "can" actually go in a full
   sentence like "I can speak Garo"? (merges with (A))
2. Animate/human classifier for counting people (e.g. "two friends") —
   different from the general noun-counting pattern?
3. Multi-adjective stacking order when 2 adjectives modify one noun
   post-nominally (e.g. "big red house")?
4. Purpose/infinitive `-na` clause — dedicated citation for a proper
   rule number (catalogue not exhaustively re-searched this session,
   may already exist uncited — worth a targeted search before treating
   this as a genuine gap).
5. Does the RULE-046 yes/no question particle `-ma` ever co-occur with
   wh-words (e.g. `Maina`/"why"), or are they mutually exclusive?

**Exact question wording for all 5:** use
`docs/COMPLEX_SENTENCE_GRAMMAR_MATRIX_20260901.md`'s "Unresolved
Linguistic Boundaries" section verbatim — don't paraphrase from this
summary when drafting the actual relay doc. **Not yet drafted as a
`docs/THANGSENG_RELAY_QUESTION_*.md` file or sent — that's a good
next-session task if the Project Owner wants to keep the relay
pipeline moving.**

## 5. Claude B handoffs (engineering, from the grammar matrix — Claude A did NOT touch engine code)

Full detail, confidence levels, and reasoning in
`docs/COMPLEX_SENTENCE_GRAMMAR_MATRIX_20260901.md`'s "Precise Handoff to
Claude B" section. Summary:

1. **(Highest confidence) Modal drop:** `translate("i can speak
   garo")` → `Anga rong·ko Agana` — the VERIFIED/HIGH modal `man·a`
   ("can") is completely absent from the output. Sentence is
   indistinguishable from "i speak garo." Do not invent the correct
   modal+verb word order — that's still a linguistic boundary (see §4
   item 1 above) — but the concept dropping entirely is a composition
   bug regardless of which candidate word is eventually confirmed.
2. **(Highest confidence) Question-marking regression against a CLOSED
   rule:** `translate("did you eat rice yesterday?")` → `Na·a Mi Mejal
   Cha·a` — RULE-046 (P0, closed project-wide) has the exact worked
   example `"did you eat?"` → `Na·a Cha·ahama?` on record. This
   structurally-identical sentence (same subject/verb, just with
   object+time added) ships with **neither** the `-aha` past marker
   **nor** the `-ma` question particle — fully bare verb. Hypothesis
   (unconfirmed, Claude A did not read engine source): `sov-assembly`
   and `grammar-assembly` may be two separate code paths, and only one
   currently applies RULE-046's question-marking logic.
3. **(Lower confidence, flagged not confirmed) Possible `-ko`
   object-marking inconsistency:** a 2-argument give-sentence correctly
   marks both objects with `-ko`; a 3+-argument give-sentence (same
   verb family, more modifiers) shows no `-ko` on either object, while
   both are tagged `sov-assembly` (arguing against a simple
   method-routing explanation). Worth Claude B's direct investigation
   before prioritizing.

Recommended regression test cases for once these are fixed: see the
matrix doc's final section — do not hardcode the modal fix's exact
expected string until the Thangseng citation resolves which word
(`man·a`/`ama`) and where it goes.

## 6. What must NOT be repeated / re-litigated

- Do not re-merge Mijal into Mejal/me·ja·o — NV-104 kept them as
  separate confirmed variants, that's the actual answer.
- Do not re-open NV-103 — it is fully closed, both the engine fix
  (Claude B) and the follow-on data fix (Claude A) are done and
  verified live.
- Do not invent modal+verb word order, animate classifiers,
  multi-adjective order, or wh-question+`-ma` co-occurrence rules from
  pattern-matching — all 5 are explicitly left as open Thangseng
  questions in the matrix doc, not resolved by inference.
- Do not attempt the 3 Claude B engineering handoffs from the Claude A
  role — restate/reference them if useful, don't fix engine code.
- Do not re-run the grammar matrix from scratch next session — extend
  it (e.g. the "three books" → novel-number stress test the matrix doc
  flagged as skipped, or wh-question variants) rather than repeating
  the 14 tests already run.

## 7. Recommended next-session priorities (in order)

1. If the Project Owner wants the relay pipeline to keep moving: draft
   `docs/THANGSENG_RELAY_QUESTION_20260901B.md` (or similar) combining
   §4's 6 total questions (A + B's 5) into one batch, using the matrix
   doc's exact wording.
2. Check whether Claude B has picked up either of the two
   highest-confidence handoffs (#1 modal drop, #2 question-marking
   regression) — `git log` since this session's HEAD, look for a
   Claude B commit referencing either.
3. If neither picked up and no new Thangseng answers have arrived,
   extend the grammar matrix with the flagged-but-skipped stress tests
   (novel number+noun for RULE-038, more wh-question variants) rather
   than idling.
4. Standard resume protocol (Rule 10) first, always — don't skip to any
   of the above before verifying `HEAD == origin/main` and running the
   full gate.

## 8. Files touched/created this session (full session, 20260901 → 20260901C)

- `docs/THANGSENG_RELAY_QUESTION_20260901.md` (created, closed same session)
- `docs/THANGSENG_NATIVE_VALIDATION.md` (NV-104 added; NV-103 closure
  note appended)
- `master_dictionary.json` (2 rows promoted for NV-104; 1 new
  `english→English` row added)
- `garo_dictionary.json` (7 corrupted `english` rows deleted)
- `src/data/known_dictionary_conflicts.json` (`english` allowlisted)
- `src/compiled_dict.json`, `src/compiled_dict_alternates.json`,
  `docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` (regenerated by
  `prepare-data.js`, not hand-edited)
- `docs/CLAUDE_A_SESSION_MIGRATION_20260901B.md` (created — mid-session
  close, now superseded by this doc)
- `docs/COMPLEX_SENTENCE_GRAMMAR_MATRIX_20260901.md` (created — the
  14-test composition analysis)
- `docs/CLAUDE_A_SESSION_MIGRATION_20260901C.md` (this file)
- `.ai/WORKSTATE.yaml` (updated throughout — `next_action`,
  `pending_thangseng_questions`, `migration_doc` pointers)

**Nothing remains local as of this doc's commit+push.**
