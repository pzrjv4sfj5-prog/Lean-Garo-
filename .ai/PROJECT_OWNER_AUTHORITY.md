# Project Owner Chat-Directive Authority

Established 2026-09-06, Project Owner directive (delivered in chat to
Claude B). Applies to **all Claude agents working on this repository**
(A, B, C, and any future role) — this is not role-specific the way
`.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` or
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` are.

## The rule

When the Project Owner provides, directly in chat:
- a factual correction;
- a linguistic decision;
- a canonical word/form;
- a repository instruction;
- a validation result;
- a priority;
- an implementation direction;
- or any other project-specific decision,

that directive is authoritative and all Claude agents must follow it.

A Project Owner directive does **not** require a separate file, WhatsApp
transcript, screenshot, migration document, third-party confirmation, a
specific validator, or any other additional proof before an agent acts on
it. This includes information the Owner says was obtained verbally, by
phone, through another person, or from any other source — if the Owner
states it has been validated and directs the repository to use it, that
is sufficient.

This formalizes a practice this project has actually followed all along
(see e.g. `.ai/SESSION_BOOTSTRAP.md`'s 2026-08-28/session-2 and
2026-08-23 NV-092/093 entries — Project Owner chat-relay batches acted on
directly, no transcript attached) but had never stated as an explicit,
unambiguous rule.

## What this changes and what it doesn't

**Thangseng is not, and was never formally declared, the exclusive
source the Project Owner may rely on.** A search of the existing
governance documents (`.ai/CLAUDE_A_OPERATING_GOVERNANCE.md`,
`docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`, `.ai/SESSION_BOOTSTRAP.md`) at
the time this document was written found no statement asserting
Thangseng-exclusivity or asserting that chat-provided Project Owner
information is insufficient without an attached file — this document
does not need to reverse any such statement because none was found. It
exists to make explicit, going forward, what was previously only
implicit in how the project actually operated. If a future session finds
older wording that reads as more restrictive than this rule, treat this
document as controlling for current work; do not edit the historical
session-log entries themselves to match it (see "Historical records," below).

The Project Owner decides which sources to use, when evidence is
sufficient, which validation to accept, and which form becomes canonical.
Claude agents implement and document those decisions; they do not get to
redefine the project's authority structure.

## Role boundaries (unchanged by this document)

Claude A/B/C may, and should, continue to:
- identify a technical consequence of a directive;
- identify a conflict with existing data;
- identify that a change may affect other parts of the repository;
- recommend how to record provenance accurately.

Claude A/B/C may **not**:
- refuse a Project Owner directive because it was given in chat rather
  than in a file;
- demand a transcript or screenshot before acting;
- require Thangseng (or any single source) to be the only acceptable
  validation;
- treat a directive as invalid because it isn't stored in a file;
- override the Owner's decision based on the agent's own preference;
- invent additional approval requirements not stated here.

Flagging a conflict is expected and required where one exists (see
"Provenance," below) — it is not the same as refusing, and does not
block acting on the directive.

## Provenance (mandatory)

The repository already distinguishes evidence quality via the
`confidence` field (`verified_high`, `unverified`, `superseded`, `open`,
`rejected`, `ocr_flagged` — see `repository-intelligence.js` CHECK G).
This document adds a labeling convention for the specific case of a
Project Owner chat directive, layered on top of that field via the
`notes` field (consistent with how every other provenance class in this
project is documented):

1. Direct quoted native evidence (e.g. a Thangseng WhatsApp relay,
   quoted verbatim) — existing convention, unchanged.
2. Reported native evidence (paraphrased/summarized native input) —
   existing convention, unchanged.
3. **Project Owner-provided/confirmed information** — new category this
   document introduces. Use exactly one of:
   - `"Project Owner-confirmed"` — the Owner is relaying/endorsing
     evidence from another source (native speaker, external reference).
   - `"Project Owner directive"` — the decision is the Owner's own call
     (e.g. picking a winner between two verified_high candidates, or
     asserting a canonical form directly), not attributed to a
     third-party source.
4. External documented evidence (dictionaries, published references) —
   existing convention, unchanged.
5. Model inference (Claude-derived, not independently confirmed) —
   existing convention, unchanged.

**A Project Owner chat directive must never be written into
`master_dictionary.json`, `docs/THANGSENG_NATIVE_VALIDATION.md`, or any
NV-numbered entry as if it were a direct native quote.** Category 3 is
not category 1 or 2. Mislabeling a directive as a native citation is a
compliance violation under the labeling discipline already established
in `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` §3 ("never label a derived
construction as if it were direct native confirmation") — this document
extends that same honesty requirement to Project Owner directives
specifically. The directive is still fully authoritative; only the
citation label must be accurate about where the decision actually came
from.

If acting on a directive surfaces a conflict with existing
`verified_high` data, or a technical consequence elsewhere in the
pipeline, record it in the entry's `notes` field and/or the session's
migration document — same as any other flagged conflict in this project
— rather than silently overwriting the prior evidence's own citation.

## Historical records

Do not retroactively edit past migration documents, `WORKSTATE.yaml`
history entries, or `docs/THANGSENG_NATIVE_VALIDATION.md` NV-entries to
match this document's provenance labels. This document governs current
and future work from 2026-09-06 forward.

## Where this is referenced

- `.ai/SESSION_BOOTSTRAP.md` — added to the mandatory-reading list.
- `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` §3 — cross-referenced for the
  provenance-labeling extension.
- `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md` — cross-referenced for the
  "explicit Project Owner decision" role-boundary language it already
  contained before this document existed.
