# CLAUDE A ROLE SELF-AUDIT — 2026-08-22

Project Owner-directed audit. Read-only — no repository changes made
during the audit itself. Repository resynced first: `git fetch`, HEAD
verified == `origin/main` == `9b1364e`, clean working tree, before any
investigation.

This document is the evidentiary record behind
`.ai/CLAUDE_A_OPERATING_GOVERNANCE.md`, which converts its findings into
mandatory operating rules. Read that document for the corrected working
model; this document is the diagnosis it responds to.

## 1. Original role

Per `SESSION_BOOTSTRAP.md`'s founding version (2026-07-08, commit
`d30db85`) and the founding linguistic docs (`GRAMMAR_SPECIFICATION.md`,
`MORPHOLOGY_SPECIFICATION.md`, `VALIDATION_CORPUS.md`, committed
2026-07-07 as "Chief Linguistic Scientist deliverables"): Claude A was
created as **linguistic authority** — grammar, morphology, validation
corpus, rule catalogue — explicitly not touching engine code. The founding
docs are unambiguous that the target output is a formal system: root/stem/
suffix rules stated as general operations ("applies to any verb stem via a
general rule, yielding a predictable meaning even for previously-
unattested roots"), with `VALIDATION_CORPUS.md` rows tagged by which
`RULE-XXX` they instantiate — including rows explicitly marked "derived
from confirmed root" rather than natively re-confirmed. Native evidence
was intended for open/contradictory points (e.g. the founding Rule G6
copula question, flagged "Needs Native Validation" with a specific
follow-up question drafted in advance), not as a per-sentence gate on
every output.

## 2. Current role

Since RULE-045 (2026-08-02), zero new entries have been added to
`docs/grammar_rules_structured/` — 40/40 rules, unchanged for roughly
three weeks. In the same window, NV-046 through NV-088 (43 native-
validation entries) were logged, almost all closing individual dictionary
rows rather than generalizing into a rule. Current sessions read
overwhelmingly as: relay batch → per-item native answer → per-item
dictionary write → repeat.

## 3. Role drift

Drift confirmed, with one important sustained exception.

Evidence of drift toward "English phrase → memorized Garo phrase":
- RULE-044 (-chi/-o locative contrast) is the only rule actively
  generalized this period (extended NV-047→NV-051→NV-052→NV-054 across
  market/school/home/river/forest locatives) — the pattern working as
  designed. It is the exception, not the norm.
- The classifier system is the clearest counter-example. The number+
  classifier+noun formula was native-confirmed as productive in NV-048
  (rong-classifier). Claude B's 2026-08-09 audit found 413 "<number>
  <noun>" entries where the mechanically-derivable value was wrong; a
  script that auto-derived correct values from the confirmed formula was
  **reverted**, per Claude A's own standing discipline that "linguistic
  values are never derived/guessed even when the derivation looks
  mechanically obvious from an already-confirmed system, only entered
  once explicitly confirmed word-by-word" (`.ai/WORKSTATE.yaml`,
  2026-08-09 entry). Only 3 of 413 have since been confirmed (the
  specific dog counts); 410 remain, stalled for two weeks, with no
  remaining linguistic uncertainty about the *rule* itself.
- This session's own near-miss (immediately preceding this audit): an
  attempt to resolve the `sikenga`/`ska`/`skenga` "want to X" paradigm by
  pattern-matching two different already-confirmed constructions against
  each other, before recognizing this exact tension was already logged,
  by name, as genuinely open in
  `docs/PENDING_LINGUISTIC_PROPOSAL_20260718_sikenga_ska_sika.md`. Caught
  before shipping (reverted, verified against the pending-proposal doc),
  but the initial instinct to guess-from-pattern is evidence that the
  pressure this audit investigates cuts both directions — under-
  derivation (over-relaying) and over-derivation (guessing without a
  confirmed rule) are both live risks, not just the one this audit was
  prompted to find.

Where established grammar is correctly used:
- Rule 11 (compositional-check-before-relay, "my X" possessives) is
  correct — but Project-Owner-flagged, not self-initiated. Claude A had
  been treating "my house"/"my dog" as needing individual NV closures
  (NV-088, NV-083) before the Project Owner pointed out that
  `POSSESSIVES["my"]` + noun-root already composes them.
- SOV/possessive/tense-suffix composition is used correctly and silently
  in every sentence-level closure (e.g. "he has eaten" = `Ua cha·jok`,
  closed compositionally, no relay).
- Citation discipline (retain-and-tag, never delete) is followed with no
  exceptions found in this review.

## 4. Productive-grammar test (representative sample)

| Item | Classification | Notes |
|---|---|---|
| 410 remaining `<number> <noun>` classifier entries | B (derivable) | Formula (NV-048) already confirmed; currently gated behind per-noun native relay for no principled reason |
| "my house" / "my father" | B → now correctly C | Was treated as A via NV-088/NV-083 before the Project Owner's correction; now folded into Rule 11 |
| `sikenga`/`ska`/`skenga` want-paradigm | A, genuinely | Thangseng's own words: "I suspect... this will require cross-checking" — real unresolved ambiguity, not laziness |
| `-chi`/`-o` locative | C, done correctly | Only fully-realized "rule → productive construction" case this period |
| "king"/Raja collision, "film" loanword gap | D/E, not A's find | Both surfaced by Claude C's independent audit (2026-08-21), not by Claude A's own review, despite sitting in files A owns |
| apostrophe-stripped `PHRASE_MAPS` lookup bug | E | Correctly engineering, correctly routed to Claude B (2026-08-20c) |
| "answer" Aganchaka/Aganchakani tie | D, unresolved 3+ weeks | A tagged the stale row SUPERSEDED but never stated which sense the bare key defaults to — left as an implicit engineering tie-break question that is actually a linguistic one |

Verdict: not wholesale "English phrase → memorized Garo phrase," but a
specific, identifiable stall point — mechanically-derivable classifier
combinations are being treated with the same one-at-a-time native-
confirmation discipline as genuinely novel vocabulary.

## 5. A→B gap (concrete cases)

**Case 1 — apostrophe-lookup bug (13 keys, "i don't know"→"I know").**
Pure engine bug, correctly found and fixed by A only incidentally, while
doing an unrelated relay-batch closure. Shipped silently for an unknown
number of prior sessions because no gate exercised the lookup pipeline
itself against apostrophe-bearing keys. Process gap: no rule required
lookup-pipeline changes to be spot-checked live — closed by
`.ai/SESSION_BOOTSTRAP.md` Rule 12 (added 2026-08-22, same day as this
audit), but sat unwritten for two days after being flagged 2026-08-20c.

**Case 2 — phrase_maps.js staleness (recurring: laugh/smile 2026-08-06,
father/mother/small 2026-08-19 via qa_audit, king 2026-08-21 via Claude
C).** Rule 8 (duplicate-representation check) exists since 2026-08-13 but
is being applied as discipline, not as an executed checklist — the same
failure shape recurred twice after the rule was written, each time found
by an external QA pass rather than by Claude A itself.

**Case 3 — "answer" tie (Aganchaka/Aganchakani), open since NV-077, ~5
sessions.** A should have handed B a definite default sense (or an
explicit "both are co-primary, needs a POS-aware key scheme" statement).
A actually handed B a SUPERSEDED tag removing noise candidates, leaving
the genuine 2-way tie unresolved and implicitly treated as B's tie-break
problem — when the actual blocker was a linguistic decision A hadn't made.

## 6. Governance audit

| Rule | Status | Evidence |
|---|---|---|
| Resume Policy (Rule 10) | PASS | This session and the prior one both did fetch/HEAD-check/read-WORKSTATE before acting |
| Migration Policy (Rule 9) | PASS | No evidence of reopening work after migration-mode entry in reviewed docs |
| Runtime Handoff (Rule 6) | FAIL | `docs/CLAUDE_A_SESSION_MIGRATION_20260820c.md` has no `## Runtime Handoff` section, despite closing NV-086/087/088 |
| Duplicate-representation check (Rule 8) | PARTIAL | Followed in some closures (e.g. "sit down" fix noted a phrase_maps.js duplicate) but missed repeatedly elsewhere (father/mother/small/king), each caught externally |
| Verification-scope statement (Rule 7) | PARTIAL | Migration docs generally state entry/test counts but rarely name which forms were live-tested vs. assumed from a passing suite |
| One-task-per-session discipline | PASS this session | Reverted an over-scoped guess mid-session rather than shipping it |
| Project Owner authority / provenance separation | PASS | Documented refusal (2026-08-20) to close items on claimed "Project Owner authority" without native evidence; held again this session by reverting the ska/skenga guess |
| Role boundaries (A doesn't touch engine code) | PASS | No engine-code edits found in reviewed A sessions |

## 7. Repeated rework / root causes

- phrase_maps.js desync — recurring 3+ times, root cause: Rule 8 applied
  as discipline, not as an enforced checklist step.
- Classifier-derivation backlog (410 items) — root cause: no explicit
  rule for when a derivation from an already-Verified/High formula is
  safe to auto-apply vs. needing individual confirmation.
- Tie-break items (answer, and 16 more in `docs/PICKPRIMARY_VERIFIED_TIES.md`)
  — root cause: A tags conflicting data SUPERSEDED but doesn't always
  render the actual disambiguation decision, leaving B to build
  engineering machinery for what's often a one-sentence linguistic call.

## 8. What is working

- Evidence-first refusal discipline under pressure is consistently strong
  and consistently exercised, including in this same session.
- RULE-044's locative generalization is a real, sustained example of the
  intended pipeline.
- Rule 11 (compositional possessives) is now correctly formalized.
- Citation discipline (retain-and-tag, never delete) has no exceptions
  found in this review.

## 9. STOP / START / CONTINUE

**STOP**
- Relaying single-word/single-phrase items that are mechanical instances
  of an already-Verified/High productive formula as if each needs its own
  native check.
- Treating "SUPERSEDED in master_dictionary.json" as equivalent to "fixed"
  without checking every other representation every time.
- Closing a tie-break as "B's engineering problem" when the real blocker
  is an undecided linguistic default.

**START**
- Include the mandatory Runtime Handoff section, verbatim format, on
  every migration document close, checked explicitly rather than only
  when reminded.
- Apply a standing rule for classifier/number productivity (see
  `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` §6) rather than a blanket
  one-by-one relay requirement.
- When superseding a row that resolves a naming/sense conflict, state the
  intended default sense in the same commit, not just remove noise.

**CONTINUE**
- Evidence-first refusal under pressure.
- Citing native quotes verbatim, distinguishing confirmed/derived/
  genuinely-open in every closure note.
- One-task-per-session, resume-protocol discipline.

## 10. Recommended operating model for future A sessions

Superseded by, and fully incorporated into,
`.ai/CLAUDE_A_OPERATING_GOVERNANCE.md`, committed the same session as this
audit. That document is the binding operating model; this section is kept
only as the audit's own original recommendation, for historical
comparison against what was actually adopted.

## ROLE HEALTH: NEEDS CORRECTION

The core discipline (evidence-first, citation-honest, role-boundary-
respecting) is intact and not at risk. The drift is narrow but real and
quantifiable: the productive-grammar pipeline was dormant for roughly
three weeks while the memorized-phrase pipeline grew by 43 NV entries, and
the clearest fixable cause — an over-cautious blanket restraint on
applying an already-confirmed classifier formula — has 410 known,
non-hypothetical instances sitting in the backlog.
