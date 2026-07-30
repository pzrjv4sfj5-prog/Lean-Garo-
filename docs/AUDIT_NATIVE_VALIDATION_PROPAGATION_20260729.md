# Audit — Native Validation Propagation Coverage
_Claude A, 2026-07-29. Requested: full end-to-end audit of whether every
Thangseng native validation has propagated to production, triggered by
the "Will you eat?" → `Na'a cha'gen` (missing `?`/`ma`) production bug._

## Scope note, upfront
A literal per-entry engine trace of all 41 `NV-XXX` records × 8
pipeline stages is not what this document does in full — that is
weeks of work, not one session. What this document does: (1) fully
resolves the specific bug end-to-end with root cause, (2) uses the
project's own status tracking (which has been kept unusually
rigorous — every NV/RC record self-reports status and impacted
components) as the basis for a systematic pass, and (3) reports every
inconsistency actually found while doing that, rather than asserting
coverage the audit didn't do. Section 5's "not independently
re-verified" flag on most rows reflects this honestly.

---

## SPECIAL INVESTIGATION — "Will you eat?"

**1. Was the native validation documented? Where?**
Yes. `docs/PENDING_LINGUISTIC_PROPOSAL_20260717_future_interrogative.md`,
sourced from a 2026-07-15 Tridip↔Thangseng WhatsApp exchange.

**2–4. Grammar rule / implementation / sentence builder?**
No general grammar rule was ever written for interrogative `-ma` — this
was a deliberate, documented decision (`RC-CANDIDATE-020`/`-021`),
correct per the project's evidence-first methodology: one data point
was judged insufficient to generalize a rule into `grammarEngine.js`/
`sentenceBuilder.js`. Instead, the 3 exact confirmed sentences were
hardcoded into `src/data/corrections.json` at confidence 1.0
(2026-07-17, corrected 2026-07-18 for a loanword substitution bug).
This is a real, working fix — for the exact 3 sentences, unpunctuated.

**5. Regression tested?**
No, and not by oversight — `tests/unit/translationEngine.test.js`
lines 688–699 contain an explicit comment declining to test it,
reasoning "no confirmed linguistic guidance exists yet." **That
comment is now stale.** It predates both the 2026-07-17/18
`corrections.json` fix and the second native data point (`NV-031`,
closed 2026-07-25) that confirmed `-ma` is verb-final and productive
beyond future tense with real nuance (past simple vs. perfect, present
continuous). The comment says "revisit once reviewed and committed" —
that happened over two weeks ago and was never revisited.

**6. Implemented but not reaching production — why?**
Because a second, independent data path exists that the fix doesn't
cover. `master_dictionary.json`/`compiled_dict.json` contain some
phrase-level entries with the literal `?` baked into the English key
(e.g. `"did you eat?": "Na·a cha·ama?"`), which is why `translate("did
you eat?")` succeeds via the `exact-phrase` lookup (confidence 0.98).
`corrections.json` entries — including all 3 confirmed "will you eat"
sentences — store keys **without** `?` (`"will you eat"`, not `"will
you eat?"`). `normalizeInput()` never strips `?`. So:
- `translate("will you eat")` → `Na·a cha·genma?` (`method: correction`, confidence 1.0) — correct.
- `translate("will you eat?")` → `Na·a Cha·gen` (`method: sov-assembly`, confidence 0.75) — the reported bug, live-reproduced this session.

Two data files encode the same class of fact (fixed phrase → Garo)
under two different punctuation conventions, with no normalization
step reconciling them. That inconsistency — not a missing fix — is
the actual leak.

**7. Exact point of failure**
`src/translationEngine.js`, corrections lookup (~line 107): tries
`cleaned`, `lowerWithApos`, and apostrophe-stripped `lower`, but none
of those strip a trailing `?`. A phrase whose only stored key omits
`?` cannot match input that includes one. This is upstream of
`RC-CANDIDATE-020`/`-021`'s diagnosis (which is about sentences that
never reach `corrections.json` at all) — this is a narrower,
previously-undiagnosed gap in a fix that already exists.

---

## Systematic pass — NV-XXX self-reported status

Cross-checked each `NV-XXX` record's own header/Status/"Repository
components impacted" fields (not independently re-verified against
the engine unless flagged). Two structural issues found doing this,
reported before the table because they affect how much the table
itself can be trusted:

- **Header/body status mismatch.** Several NV headers say "CLOSED
  2026-07-25" while the body's own `Status:` line says `OPEN`.
  Directly confirmed for **NV-031** (interrogative `-ma`, itself the
  root of the bug under investigation — see above) and **NV-038**
  (`na·sta`/breakfast, explicitly "Investigation only — dictionary
  entry NOT touched"). Convention appears to be: header "CLOSED" =
  the investigation/relay cycle is closed, not that linguistic
  content was confirmed or propagated. That's a reasonable convention
  but it isn't stated anywhere, and it invites exactly this bug's
  failure mode — someone (human or Claude) skimming headers and
  assuming CLOSED = shipped.
- Most other entries where header says CLOSED and an early `Status:`
  line says OPEN are **not** genuine contradictions — they're older
  in-progress notes later superseded by a closing update further down
  the same record (confirmed by full reads on a sample, e.g. NV-003,
  NV-022, NV-025). A naive single-line grep for `Status:` produces
  false positives here; full-record reads are required to tell the
  difference, which is why this table doesn't attempt to classify all
  41 by grep alone.

### Classification (per project's own records)
- **COMPLETE, verified this session:** NV-041 (watch/see/call), NV-025
  (do·o/chicken), NV-027 (angry cluster, partial by design).
- **DOCUMENTED, engine change deliberately deferred pending more data
  (correct per evidence-first policy, not a failure):** NV-001,
  NV-002, NV-006, NV-013, NV-014, NV-016, NV-029 (RULE-039 marked
  provisional), NV-030, **NV-031 (this bug's root)**.
- **DOCUMENTED, dictionary/rule change applied, not independently
  re-verified in the engine this session:** NV-003 through NV-012,
  NV-015, NV-022 through NV-026, NV-028, NV-032 through NV-040.
- **REGRESSION MISSING, confirmed this session:** the interrogative
  `-ma` cases specifically (see stale test comment above) — the one
  concrete case checked in depth. Whether other CLOSED-and-impacted
  NV items have equivalent test gaps was not checked for all 41; flagged
  as a followup, not asserted either way.
- **PROPAGATION FAILURE, found this session:** the `corrections.json`
  vs. dictionary punctuation-key inconsistency above. Root cause is
  general (any corrections.json entry lacking a `?`-inclusive key is
  exposed the same way) — not confirmed how many of the ~810
  corrections.json entries are affected; not enumerated this session.

## Recommendations
1. Add `?` (and likely other trailing punctuation) stripping to the
   corrections-lookup normalization path, or standardize on always
   including `?` in stored keys for question-form corrections. Either
   works; leaving two conventions live does not. **Engineering, not
   linguistic — Claude B, no relay needed.**
2. Revisit/remove the stale no-test comment in
   `tests/unit/translationEngine.test.js:688-699` now that both the
   corrections fix and NV-031's second data point exist; at minimum
   add regression coverage for the 3 already-confirmed sentences
   including the punctuated form, so this exact bug can't silently
   recur.
3. State the header-vs-body "CLOSED" convention explicitly at the top
   of `THANGSENG_NATIVE_VALIDATION.md` (investigation-closed ≠
   propagated-to-production), or stop using "CLOSED" in headers for
   records whose body Status is OPEN — pick one, document it.
4. This audit did not exhaustively verify test coverage for the other
   ~30 CLOSED-with-impact NV items. If propagation-failure risk is a
   standing concern (not just this one bug), that's a distinct,
   larger follow-up task — not scoped or started here per one-task
   discipline.
