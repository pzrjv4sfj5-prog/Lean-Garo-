# Claude B Engineering Governance Model

Established 2026-08-22, Project Owner directive, following the Claude B
Role Self-Audit (chat, 2026-08-22). The audit's finding: one defect
class — pickPrimary/override precedence ambiguity — has been patched
narrowly at least 6 times since 2026-08-04 (`wait`, `salt`, `smile`,
the 9-key no-verified-candidate defect, `answer`, `king`) without the
class itself ever being closed. This document is the mandatory
operating model that prevents a 7th recurrence from being handled the
same way. It is to `.ai/SESSION_BOOTSTRAP.md` Rule 13 what
`docs/GRAMMAR_RULE_CATALOGUE.md` is to Claude A's linguistic rules —
Rule 13 is the pointer, this file is the protocol.

## 1. Defect class vs. instance

An **instance** is one wrong translation for one key (`king` →
"thin objects"). A **defect class** is the shared mechanism that
allows a whole shape of instance to occur (pickPrimary cannot
distinguish a genuinely-confirmed candidate from one that only looks
tagged the same way). Fixing an instance (`grammarOverrides['king'] =
'Raja'`) does not touch the class — the next miscategorized row
produces the next instance, indefinitely.

Two distinct subclasses are already live under this one root cause:

- **(a) VERIFIED-tie**: 2+ candidates equally tagged VERIFIED/HIGH,
  no signal to prefer one — resolved today by last-write-wins.
  Auto-enumerated on every build: `docs/PICKPRIMARY_VERIFIED_TIES.md`
  (16 keys as of this writing, including `answer` and `king`).
- **(b) No-verified-candidate**: a SUPERSEDED/OCR-flagged/mistagged
  row outranks the actual correct value because nothing structurally
  enforces the tag. Confirmed instances: `work`×2, `boil`, `build`,
  `close`, `empty`, `leg`, `outside`, `strong` (9 keys, `docs/
  CLAUDE_C_AUDIT_20260816.md` §2), plus `king`'s specific mechanism
  (misimported classifier-scope rows). **Gap: subclass (b) has no
  auto-generated enumeration file the way (a) does** — it exists only
  as narrative findings in dated audit docs. Closing this gap
  (a `prepare-data.js`-generated `docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`,
  same pattern as (a)) is the first concrete engineering action under
  this governance model, not yet built as of 2026-08-22.

## 2. Mandatory: architectural investigation before another override

**Rule.** Before adding any entry to `grammarOverrides`,
`corrections.json`, or any equivalent per-key exception mechanism:

1. Check whether the failure's *mechanism* — not just the word —
   matches an existing entry in the table in §4 below.
2. **If it does not match anything open or closed in §4**: this is a
   genuinely new mechanism. Add the override as usual, and add a new
   §4 row (status `OPEN`, one instance) so the next occurrence has
   something to match against.
3. **If it matches an already-`OPEN` §4 row**: adding another override
   is not enough by itself. The override may still ship as an
   immediate stopgap (regressions matter more than process purity),
   but the same commit must also either (a) advance the architectural
   fix, or (b) if not advancing it this session, explicitly say why
   not and update the §4 row's instance count and evidence. A second
   occurrence of the same mechanism with no movement on the class fix
   is the trigger this rule exists to catch — silence is not allowed
   here.
4. **If it matches a §4 row already marked `CLOSED`**: this is a
   regression of a supposedly-fixed class, not a new instance — treat
   it as higher priority than a fresh bug, and reopen the row.

## 3. Closing the A→B→runtime gap

Every Claude B session, for anything touching translation output,
runs this trace — not "tests pass," the actual chain:

1. **Source → compiled**: for any key involved this session, read
   `master_dictionary.json`'s row directly (not its summary in a
   doc) and confirm `compiled_dict.json`'s value for that key matches
   what the row's tag says it should.
2. **Compiled → override**: check both `grammarOverrides` (in
   `prepare-data.js`) and `corrections.json` for the same key. If
   either masks the compiled value, confirm *why* — cite the
   root-cause doc, don't assume a mask is still valid just because it
   exists. A mask with no live citation is itself a finding (stale
   override, §5).
3. **Override → runtime**: call `translate()` directly (not `grep`,
   not a doc claim) for the exact form in question and record the
   actual output, method, and confidence returned.
4. **Report the trace, not just the endpoint**: a migration document
   or audit claiming a key is "fixed" must show what step 1–3 each
   returned, not just step 3's final answer — this is what let
   `answer` look fine at runtime while masking a live unresolved tie
   underneath.

This trace is mandatory for: every key named in a Claude C handoff,
every key touched by a `grammarOverrides`/`corrections.json` edit, and
a random sample of at least 5 keys from `docs/
PICKPRIMARY_VERIFIED_TIES.md` each session where that file is
non-empty, even if none of those 5 were the session's focus — so
regressions in the tie list itself don't go unnoticed between the
sessions that happen to touch it directly.

## 4. Open architectural investigations

| ID | Mechanism | Subclass | Status | Instances (cumulative) | Proposed fix |
|---|---|---|---|---|---|
| AI-001 | pickPrimary cannot distinguish genuinely-confirmed tag from a same-shaped free-text caveat / mistagged row | (a) tie, (b) no-verified-candidate | **(a) CUTOVER DONE 2026-08-28 — CLOSED as an engineering mechanism** (isVerified/isWeak/isSuperseded read `confidence` directly, zero notes-regex remaining for those three signals; `notesDeclareSuperseded` fallback added 2026-08-30 is a documented, tested exception that reads an already-stated tag, not a new inference — see prepare-data.js). **(b) remains OPEN, but as a content-triage backlog, not a missing engineering mechanism** — subclass (b)'s enumeration (`pickPrimaryNoVerifiedCandidate`) is itself already schema-driven off the same cutover fields; what's open is per-key human review of the 5,745 listed keys (5,742 weak/OCR-flagged), of which the confirmed 2026-08-16 failure shape is down to 1 remaining named instance (`build`) after this cycle's content work resolved the other 7. Investigated 2026-08-30 (Claude B) after Claude C's 20260830B audit flagged the stale status text — see `docs/CLAUDE_B_SESSION_MIGRATION_20260830C.md` for the full investigation and the "genuinely required?" determination. | `confidence`/`confidence_source` schema on `master_dictionary.json` rows (designed 2026-08-04; steps 1-2 done 2026-08-22 per `docs/PROPOSAL_CONFIDENCE_SCHEMA_20260822.md`; step 4 cutover done 2026-08-28 — see above). `confidence_source` (the optional citation-traceability half of the schema) is genuinely unimplemented (0/9,956 rows carry it) but was never load-bearing for pickPrimary's decision logic — the proposal scoped it only as a replacement for `notes`' citation prose, not as an input to subclass (b)'s resolution. It remains a proposed future enhancement (documentation/traceability quality-of-life), not a blocking engineering gap — do not re-derive this from scratch; re-read the 2026-08-30 investigation doc first. |
| AI-002 | `assembleGrammar`'s object-extraction loop (`grammarEngine.js`, object-resolution fallback) resolved a multi-word object phrase by falling back to `lookupGaro(lastWord)` alone when the full-phrase lookup failed — it never checked whether an *earlier* word in that phrase was the one that's actually unresolved. When it was, and the last word happened to resolve on its own (e.g. a trailing time adverb), that unrelated resolved word was silently placed in the object slot with the object marker, and the true unresolved word disappeared with zero trace | silent wrong-substitution (worse than a drop — evaded the existing `result.includes('[UNKNOWN]')` safety check at `sentenceBuilder.js:314` entirely, since no `[UNKNOWN]` string was ever produced) | **FIXED 2026-08-25** — see `docs/CLAUDE_B_SESSION_MIGRATION_20260825.md` for full detail | 1 confirmed live repro (now fixed): `"i bought a gadget yesterday"` → was `"Anga mejal·ko breaha"` (`"mejal"`="yesterday" wrongly took the object slot, `"gadget"` vanished), now correctly falls through to `sov-assembly` instead of shipping a confident wrong answer | **Implemented:** every word in `objectWords` is checked individually via `lookupPhrase`/`lookupGaro`; if any fails to resolve, the object surfaces `[UNKNOWN]` instead of silently using the last word's resolution — but ONLY when a finite verb was found elsewhere in the sentence. When no verb was found (the affirmative-copula/locative-residue construction, e.g. "I am lying in bed" — "lying" never resolves and is expected to be dropped in favor of the following locative noun), the pre-existing last-word-wins behavior is preserved unchanged; forcing `[UNKNOWN]` there was tried first and regressed 2 existing tests (lost the `·o`/`·ko` marker via a weaker fallback stage), so the fix is gated on `!!verb`, not applied unconditionally. `existingFullPhrase` still wins outright ahead of the per-word check, unchanged. 6 new regression tests added to `tests/unit/translationEngine.test.js`. No `master_dictionary.json` changes |

New rows are added here, never silently folded into an existing one
unless the mechanism genuinely matches (§2 step 1). This table is
hand-maintained (unlike §1's auto-generated enumeration files) because
"is this the same mechanism" is an engineering judgment call, not a
mechanical pattern match.

## 5. Claude C: verifying class closure, not instance closure

When AI-001 (or any future row) moves from `OPEN` toward `CLOSED`,
Claude C's audit must do more than re-check the named examples:

1. **Regenerate the auto-enumerated artifacts** (`docs/
   PICKPRIMARY_VERIFIED_TIES.md`, and the subclass-(b) equivalent once
   built per §1) fresh, post-fix.
2. **Count, don't sample.** Report: total instances the pattern
   matched before the fix, how many are now resolved (no longer
   appear in the regenerated file, or appear with a principled
   resolution rather than last-write-wins), how many remain and
   specifically why (e.g. genuinely irreducible, needs Claude A
   input, deliberately deferred).
3. **A single fixed example is not evidence of class closure.** `king`
   translating correctly again is instance-level evidence only. Class
   closure requires the count from step 2, cited by number
   (e.g. "16/16 ties in the pre-fix `PICKPRIMARY_VERIFIED_TIES.md`
   snapshot now resolve to a single principled candidate; 0 remain
   last-write-wins").
4. **Only after that count-based report can the §4 row be marked
   `CLOSED`** in this document — Claude C reports the count, whoever
   has push access that session (A or B) updates the row, same
   division of labor as C's existing closure protocol elsewhere in
   this repo.

## 6. Engineering-scope edits to master_dictionary metadata

Added 2026-08-29 (Claude B), prompted by a recurring ambiguity: is
syncing `corrections.json`/`phrase_maps.js` to an already-VERIFIED
`master_dictionary.json` value a Claude B (engineering) action, or a
Claude A (linguistic) one? This has caused real hesitation in past
sessions (see e.g. the 2026-08-14 role-boundary incident above) and
is worth stating as a bright line rather than re-deriving per session.

**Engineering-scope (Claude B may act alone, no relay/PAT/Claude A
commit needed):**

- Any edit whose entire justification is "field X currently disagrees
  with field Y for the same already-cited fact, and Y is the more
  authoritative/more recent source" — e.g. `corrections.json` shipping
  a truncated or superseded form of a value `master_dictionary.json`
  already carries as `verified_high` with an explicit citation;
  `phrase_maps.js` still holding a value tagged `SUPERSEDED` in
  master. `scripts/resync-stale-overrides.mjs` mechanizes exactly this
  class — its `RESYNC candidates` output is by definition
  engineering-scope, since the tool only ever proposes replacing a
  `SUPERSEDED`-matched override with the value `master_dictionary.json`
  itself already marks `VERIFIED`.
- Stale test/doc assertions that assert a superseded value the source
  data has already moved past (e.g. a hardcoded expected string that
  predates a later NV-relay correction to the same key).
- Adding automated checks/gates (like §1's enumeration files, or
  wiring `check:resync` into the build) that make an existing
  engineering-owned invariant mechanically enforced instead of
  narratively tracked.

**NOT engineering-scope (needs Claude A judgment, relay, or an
explicit Project Owner decision first):**

- Anything where the "correct" value is itself ambiguous — two or
  more `master_dictionary.json` candidates are each independently
  tagged verified/cited (a genuine tie, §1 subclass (a)), or the
  disagreement reflects a real sense split (e.g. imperative vs.
  declarative "wait") rather than one value simply being stale.
  Picking a winner in that situation is a linguistic call even if the
  mechanical shape looks identical to a resync.
- Any edit to `master_dictionary.json` itself that adds new content,
  changes a `garo` value's meaning, or changes a `confidence` tag's
  truth value (as opposed to a schema-formatting-only pass, per the
  existing confidence-schema migration precedent) — Claude B may
  *read and consume* `confidence`/`notes`, never assign linguistic
  confidence.
- Resolving a `resync-stale-overrides.mjs` "Skipped — no VERIFIED
  master candidate matches compiled_dict value" row, or the "Skipped
  — override doesn't match a SUPERSEDED master candidate (likely
  intentional variant)" bucket — both require judging *which* value is
  actually correct, not just detecting disagreement.

**The test:** if the fix can be fully justified by pointing at a
single already-existing `verified_high`/citation in
`master_dictionary.json` and saying "the override doesn't match this
yet," it's engineering-scope. If justifying the fix requires deciding
*which* of two or more candidate values is linguistically correct,
it isn't — hand it to Claude A regardless of how mechanical the change
looks.
