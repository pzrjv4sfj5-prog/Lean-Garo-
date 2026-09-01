# Claude A Session Migration — 2026-09-01

**Session type:** Resume of `docs/CLAUDE_A_SESSION_MIGRATION_20260831D.md`.
Project Owner supplied new unprompted Thangseng evidence (7-sentence batch)
plus a direct Thangseng diagnosis of a specific runtime failure, and asked
Claude A to process the evidence, then investigate and document the runtime
bug as a Major Project Finding — explicitly: record evidence, reconcile
with existing data, document the incorrect output precisely, identify the
native sentence's grammar structure, separate dictionary-level from
grammar/composition-level causes, invent no replacement sentence, touch no
engine code, then update WORKSTATE and migrate.

---

## 1. Resume verification (done first, per Rule 10)

- Cloned `github.com/pzrjv4sfj5-prog/Lean-Garo-` fresh via a Project
  Owner-supplied PAT (single-use, not embedded in any file).
- `origin/main` HEAD on arrival: `7507e8a` — the exact commit the
  20260831D migration doc's own close produced. `.ai/WORKSTATE.yaml`
  `repository.head` (`fc32588`) is the checkpoint immediately before that
  close commit, per the file's own `head_convention` — correct, not stale.
  `git log fc32588..HEAD` showed exactly `fc32588`'s close commit plus
  Claude B's two immediately-prior commits (`0a186c8` re·angjawa runtime
  fix, `fc32588` rebuild) — both already reflected in WORKSTATE, nothing
  missing. **Prior session's push was complete.**
- Read `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` in full (current, no changes
  since last read).

## 2. Work done this session

### 2a. NV-103 — new Thangseng evidence batch, applied where clean

Full detail: `docs/THANGSENG_NATIVE_VALIDATION.md`, NV-103.

- 5 new sentence-level VERIFIED/HIGH rows added: "can you talk in garo",
  "i don't know garo", "do you know hindi/english", "can you help me with
  the address", "i cannot help you".
- 4 pre-existing unverified rows promoted (corroborated, not new): the two
  case-variant pairs for "do you know english(?)" / "do you know hindi(?)".
- Read together, the batch is a coherent `man·a` ability-modal paradigm
  (present/future/negative-present/negative-future) — cross-referenced
  into the still-open `ama`-vs-`man·a` relay question in
  `claude_a.pending_thangseng_questions` as supporting evidence, **not**
  treated as an answer to it. `man·jawa` corroborates the existing `-jawa`
  negative-future suffix (NV-100's `re·jawa`); `man·ja` corroborates the
  existing "i don't understand" citation.
- Held open, not applied: "yesterday"=`Mijal` conflicts with the existing
  VERIFIED "Yesterday"=`Mejal`/`me·ja·o` (different vowel, not assumed to
  be the same word without confirmation).
- "the only language i speak is english"=`Angade English ku·sikkosan
  aganaia.` recorded as native evidence, but **no dictionary row was
  added or changed for it** — see Finding below.

### 2b. Major Project Finding — isolating the runtime bug

Reproduced the reported bug live: `translate("the only language i speak
is english")` → `"mangmang ba·sa Anga Call police Agana"` (sov-assembly,
0.75). Traced the `Call police` insertion to a single corrupted
`master_dictionary.json` row: the bare headword `english` had exactly one
candidate, `{"garo": "Call police", "confidence": "unverified"}` — a
data-import corruption unrelated to the word "English", not a linguistic
candidate of any tier. Found a matching sibling defect on `garo`→`"Contact
khagen"`, independently confirmed as the cause of pre-session corruption
in `"can you talk in garo"` / `"i don't know garo"`.

**Fixed (data hygiene, no engine code touched):** both rows tagged
SUPERSEDED with notes documenting the corruption, citing NV-103. No
replacement value invented for either (none is native-confirmed).

**Re-verified live, same input, after the data fix only:**
`translate("the only language i speak is english")` → `"mangmang ba·sa
Anga to be / to exist Agana"` (sov-assembly, 0.75). The `Call police`
contamination is gone — confirms the data diagnosis was correct and
sufficient for that specific symptom. **Everything else is unchanged**:
word order still wrong, no topic suffix, no bound only-suffix compound,
no verb ending. This before/after pair is the direct proof that a second,
independent cause remains.

**Linguistic structure of `Angade English ku·sikkosan aganaia.`** (full
segment-by-segment table in NV-103): `Anga-de` (I-TOPIC) `English` (loan
object) `ku·sik-ko-san` (language-OBJ-only, one bound compound) `agan-aia`
(speak-ENDING). Two pieces are genuinely new to the corpus and unbuilt:
the `-de` topic suffix, and the `-aia` verb ending. One piece resolves an
old open question: `-san` is now evidenced as a real bound "only" suffix,
distinct from the free-standing `mangmang` — the pre-existing SUPERSEDED
`·san` citation was not simply wrong, it may be this same bound form.

**Classification (as required):**
- **NATIVE DATA PROBLEM (fixed this session):** the two corrupted
  bare-word rows. Fully explains the `Call police` symptom.
- **GRAMMAR/COMPOSITION ENGINE PROBLEM (confirmed still open, Claude B's
  territory, untouched):** sov-assembly doesn't attach `-de`, doesn't
  compose the bound object+only unit, gets word order wrong, and doesn't
  attach a verb ending. Matches Thangseng's own diagnosis exactly — the
  words are all retrievable, composition is what fails.

### 2c. Secondary engine anomaly (flagged, not investigated)

While live-verifying this session's new rows, found `"i don't know garo"`
has an exact key match in `src/compiled_dict.json` with the correct value,
but `translate()` returns a different `grammar-assembly` result instead of
it. Every other new row resolved correctly via `exact-phrase`. The one
failure is the one row containing an apostrophe — possibly a new instance
of the apostrophe-lookup defect class (a *different* code path than the
2026-08-16b `PHRASE_MAPS` fix). Not diagnosed further; engine code is
Claude B's lane.

## 3. Duplicate-representation check

Checked `phrase_maps.js` and `src/data/corrections.json` for any of this
session's touched keys (`english`, `garo`, the 5 new sentences, the 4
promoted rows). No entries exist for any of them in either file — nothing
to sync. `compiled_dict.json`/`compiled_dict_alternates.json` rebuilt via
`prepare-data.js`, confirmed reflects all changes. **PASS.**

## 4. Runtime Handoff

- `master_dictionary.json`: 9959 → 9964 rows (+5 new, 6 promoted/patched
  in place). Compiled: 8199 → 8205 unique entries.
- All new/promoted keys live-verified via `translate()` post-rebuild (see
  §2a/§2b above for exact outputs).
- Two rows tagged SUPERSEDED (`english`, `garo` bare-word corruption) —
  removed from compile consideration; their slots now fall through to the
  engine's standard OOV handling instead of shipping garbage.

## 5. Rule-generalization check

No new RULE this session. Two candidate patterns (`-de` topic suffix,
`-aia` verb ending) are single-attestation — below the governance
threshold for generalizing into a rule. Flagged in NV-103 for future
relay/corroboration, not built.

## 6. What belongs to Claude B

- **Unchanged from prior sessions:** `ama` modal engineering
  implementation (Finding B, NV-008 paradigm, still unimplemented).
- **New this session:** the sov-assembly composition gaps documented in
  the Major Finding above (topic suffix, bound-object composition, word
  order, verb-ending attachment) — linguistic shape is now fully
  specified in NV-103; implementation is engine work.
- **New this session:** the apostrophe/exact-phrase-lookup anomaly on
  `"i don't know garo"` (§2c) — needs diagnosis, not just a fix; flagged
  only.

## 7. What requires Thangseng

- **Unchanged, now reinforced with new evidence (not answered):** `ama`
  vs `man·a` — see NV-103's cross-reference. Do not resolve from the new
  batch's person/register pattern without an explicit answer.
- **New, not yet drafted as a formal relay question:** "yesterday" —
  is `Mijal` the same word as the existing VERIFIED `Mejal`/`me·ja·o`, or
  a distinct/incorrect form? Needs a real question, not corpus-internal
  guessing.

## 8. What must NOT be repeated

- Do not invent a "corrected" rendering of "the only language i speak is
  english" — no native evidence supports guessing at `-de`/`-aia`/compound
  behavior beyond this one sentence. Wait for either Claude B's
  implementation attempt or new corroborating relay data.
- Do not re-supersede or restore the `english`/`garo` bare-word rows
  without new native evidence — both are documented corruption, not open
  questions.
- Do not treat this session's `man·a` paradigm evidence as resolving the
  `ama`-vs-`man·a` question — it is supporting evidence only.
- Do not re-run the full grammar/morphology/tense audit — unrelated to
  this session's scope, last done 20260831C, unchanged since.

## 9. Exact next-session priorities (in order)

1. **Resume protocol first** (Rule 10 + governance doc): `git fetch
   origin`, compare HEAD to `.ai/WORKSTATE.yaml`'s `repository.head`
   (`7507e8a` as of this close).
2. Check whether Claude B has picked up either the Finding B `ama` modal
   implementation or the new sov-assembly composition gaps from this
   session's Major Finding. If either landed, live-reverify via
   `translate()` rather than re-auditing from scratch.
3. Check `claude_a.pending_thangseng_questions` for an answer to the
   `ama`/`man·a` question (now carrying the NV-103 addendum).
4. Draft and send the "yesterday" Mijal-vs-Mejal reconciliation question
   if not already resolved by direct Project Owner relay.
5. If Claude B has not yet picked up the apostrophe/exact-phrase anomaly
   from §2c, consider drafting a short, scoped handoff doc for it (same
   shape as the historical `CLAUDE_B_HANDOFF_*` docs), rather than
   re-diagnosing it inline in a future migration doc's body.

## 10. Repository status at close

- HEAD after this session's close commit: verify via `git log -1` ==
  `origin/main` immediately after push (this file's own commit is part of
  that push).
- Working tree: clean after commit + push.
- `.ai/WORKSTATE.yaml`: `repository.head` set to `7507e8a` (state
  immediately before this close commit, per `head_convention`);
  `claude_a.next_action`, `claude_a.migration_doc`, and
  `claude_a.pending_thangseng_questions` all updated in the same close.
- `docs/THANGSENG_NATIVE_VALIDATION.md`: NV-103 added this session.
- `master_dictionary.json` / `src/compiled_dict.json` /
  `src/compiled_dict_alternates.json`: updated and rebuilt this session,
  gate green (8205/8205 entries, 9/9 grammatical corrections, 277/277
  unit tests, 0 new repository-intelligence violations).
- No local-only commits; nothing left uncommitted or unpushed.
