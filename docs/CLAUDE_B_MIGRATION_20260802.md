# CLAUDE B — MIGRATION DOCUMENT
_Prepared 2026-08-02, repo HEAD `e233663`, verified against `origin/main`
via fresh `git fetch`, zero divergence, working tree clean._

Resumed this session from a prior Claude B migration document
(checkpoint `da3f82c`). That document's own migration-discipline
self-correction (rule 5, ownership scoping) and rule 6 (mandatory
Runtime Handoff section) are both followed below.

---

## RESUME & SHUTDOWN PROTOCOL (MANDATORY)

Unchanged from the prior migration document — see that document or
`.ai/SESSION_BOOTSTRAP.md`'s thread-hygiene section (rules 1-6) for
full text. Rule 5 (ownership scoping) and rule 6 (Runtime Handoff) are
applied throughout this document.

## Who I am
Claude B — Repository Steward and Engineering Architect for
**Lean-Garo** (English→A'chik Garo translation engine). Repo:
`https://github.com/pzrjv4sfj5-prog/Lean-Garo-`.

## Current Repository State (at checkpoint)
- **HEAD:** `e233663`, matches `origin/main` exactly, working tree clean.
- **Tests:** 163/163 pass. **Lint:** 0 errors. **Build:** exits 0.

## Completed work this session (Claude B only)

### 1. Bug report: "where is X going?" regressed to the stationary locative "bano" (commit `03bd2dc`)
Reproduced via `translate()`, traced to two independent stale
artifacts, both fixed:
- `corrections.json`'s `"where are you going"` phrase entry predated
  NV-047's dictionary fix and was never synced with the already-
  VERIFIED `compiled_dict.json`/`master_dictionary.json` value
  (`"Na·a bachi re·angenga?"`). Synced directly — zero new linguistic
  content, pure sync fix.
- `src/data/phrase_maps.js`'s flat single-word `'where':'Bano'` entry
  is consulted by `assembleSentenceSOV`'s per-word fallback — the path
  `"where is he going?"`/`"where are they going?"` take, since neither
  has a `corrections.json` phrase entry. This map had no way to reflect
  RULE-044's bano/bachi distinction (bano = stationary, bachi =
  movement-to). Added a narrowly-scoped override in
  `assembleSentenceSOV`: when the literal word "going" is present
  anywhere in the sentence, the "where" lookup resolves to "Bachi"
  instead of the map's default "Bano". This is not a new WH-word
  disambiguation rule — RULE-044 is pre-existing and VERIFIED; the fix
  only makes the SOV fallback path respect a distinction the
  phrase-level correction already applied for one specific sentence.
  Does not fabricate any verb conjugation; only the WH-word selection
  changes.
- Verified unaffected: sibling stationary "where" questions (`where do
  you live?`, `where is the market?`, `where do you stay?`, `where are
  you?`).
- **Deliberately left out of scope, flagged not fixed:**
  `corrections.json`'s `"where did you go"` entry uses the same stale
  `bano` pattern for the past-tense form of the same movement verb.
  Extending RULE-044 to past tense without Claude A's VERIFIED
  confirmation would be inferring a new linguistic rule — left for
  Claude A.
- 6 new regression tests (3 for the reported sentences, 3 sibling
  non-regression guards).

### 2. WORKSTATE Runtime Handoff resolved: "ripe" gap traced to an unanchored isVerified regex, 78-key corpus-wide fix (commit `ea77de5`)
The prior session's mandatory Runtime Handoff check (rule 6) flagged
one gap: `compiled_dict.json['ripe']` resolved to `nang·chek·chek·a`
instead of the sole VERIFIED/HIGH candidate `min·a` (NV-050), per the
RC-036-follow-up VERIFIED-preference rule's own stated logic.

Root cause: `prepare-data.js`'s `isVerified` check —
```
/verified\/high/i.test(notes) && !/unverified/i.test(notes)
```
— is an unanchored substring match across an entry's **entire** notes
field, not just its tag prefix. Confirmed two distinct failure modes,
both verified corpus-wide via a full `compiled_dict.json` diff before/
after the fix (78 keys total changed, zero unexplained):

- **False negative (22 of 78 keys, "ripe" among them):** a genuinely
  VERIFIED/HIGH entry's own notes describe what it was promoted
  *from* (`"...promoted from prior variant/UNVERIFIED/HIGH"`) — the
  unanchored `!/unverified/i.test(notes)` guard treats that later
  substring as disqualifying, flipping `isVerified` to false for an
  entry correctly tagged VERIFIED/HIGH at the start of its notes.
- **False positive (56 of 78 keys):** a `SUPERSEDED`/"not authoritative
  for compile" legacy entry's notes describe what supersedes it
  (`"...has VERIFIED/HIGH form(s) [...]"`) — the unanchored
  `/verified\/high/i.test(notes)` check matches that embedded mention,
  wrongly marking the SUPERSEDED entry itself as verified and force-
  selecting it over Claude A's explicit non-authoritative annotation.
  Several of the affected entries' notes literally read "see handoff
  to Claude B" — this fix resolves that handoff.

Fixed by anchoring to `/^verified\/high\b/i`, matching the same
anchoring convention `isVariant` already uses two lines below in the
same function. Not a new precedence rule — makes the existing
documented check match what it was always supposed to match.

This is the exact fragility a prior Claude B session (2026-08-01,
post-hoc coverage audit) already flagged as a latent risk without
fixing it, since it had only ever produced coincidental, self-
cancelling ties up to that point. It stopped self-cancelling here and
produced two real defect classes.

2 new regression tests added ("ripe" resolves correctly; a SUPERSEDED
entry, "type", is no longer force-selected).

### 3. Session-close documentation update (commit `e233663`)
Mandatory per `.ai/SESSION_BOOTSTRAP.md`'s "Session close" directive.
Updated `claude_b`'s `current_task`/`progress` in `.ai/WORKSTATE.yaml`
and added a "Current joint work package" entry to
`.ai/SESSION_BOOTSTRAP.md` summarizing both fixes above. Documentation
only, no code changes.

## Explicitly NOT completed / not touched this session
- No dictionary content, `corrections.json` full-content review, or
  grammar rule files edited beyond the single synced phrase-entry
  value above — not this role's authority.
- `corrections.json`'s `"where did you go"` (past-tense bano/bachi
  question) — flagged above, needs Claude A.
- Render deployment — not attempted, outside this session's scope and
  this sandbox's network egress allowlist.

## Genuine remaining discrepancies (engineering scope only)
- None currently known. The `isVerified` regex fragility previously
  flagged as latent is now fixed, not just flagged.

## Items intentionally deferred
- None new this session.

---

## Runtime Handoff (Claude B)

Runtime Handoff: None. No NV items were closed by Claude B this
session (Claude B does not close NV items — see role boundary). Both
fixes shipped this session are themselves engineering corrections to
runtime behavior for **already-existing** VERIFIED closures (NV-047
and NV-050) — their corrected runtime status is confirmed directly
above (bano/bachi verified via live `translate()` calls; "ripe"
verified via direct `compiled_dict.json` inspection and regression
test), not left as an open gap for a future session to check.

---

## Cross-role updates (already merged)

None this session — no Claude A or Claude D commits landed on
`origin/main` during this session's active work window (one Claude A
governance/docs commit, `0ab04bf`, was pulled via rebase before this
session's own commits were pushed; it added the mandatory Runtime
Handoff rule this document follows, and is not restated here — see
Claude A's own migration document or `.ai/SESSION_BOOTSTRAP.md` rule 6
for that).

---

## Repository status at close
- **HEAD:** `e233663`
- **origin/main:** `e233663`
- **git status:** clean
- **WORKSTATE.yaml:** updated this pass (`claude_b.current_task`/`progress`)
- **SESSION_BOOTSTRAP.md:** updated (Current joint work package entry added)
- **Migration document:** complete
- **No local commits** (HEAD matches origin/main exactly)
- **No uncommitted changes**
- **Safe to resume from repository only**

## PAT handling this session
A session-scoped PAT was supplied directly in chat by the Project
Owner. Used only to configure the git remote immediately before each
of two pushes (the two engineering-fix commits, and the session-close
documentation commit), then stripped from `git remote -v` immediately
after each use. Never logged, printed, or persisted.

---

## Trigger
On **"Let's work"** or similar: run the RESUME PROTOCOL above in full
before picking anything up. Don't re-introduce yourself, don't
re-explain this document. Do not write a migration document in another
role's voice or report their work as your own — see the
migration-document scope section (rule 5) and Runtime Handoff section
(rule 6) in `.ai/SESSION_BOOTSTRAP.md`.

---

Paste this as the first message in a new chat.
