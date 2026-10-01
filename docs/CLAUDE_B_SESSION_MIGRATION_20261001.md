# Claude B Session Migration — 2026-10-01

## Project identity

Lean-Garo-: English↔Garo translation engine + dictionary
(`master_dictionary.json` → compiled `src/compiled_dict*.json`) with a
grammar-rule engine (`src/grammarEngine.js`, `src/sentenceBuilder.js`,
`src/garo_classifier.js`) and a structured rule catalogue
(`docs/grammar_rules_structured/RULE-NNN.yaml`). Two-lane governance:
**Claude A** = content (dictionary, grammar rules, native-speaker relay
processing), **Claude B** = engineering (engine code, tests, gate,
session/repo bookkeeping). Native-speaker ground truth comes from
Thangseng, relayed by the Project Owner (WhatsApp/chat, no direct
access). Gate = `prepare-data.js` → `test-dictionary.js` →
`repository-intelligence.js` → `node --test tests/unit/*.test.js` →
`scripts/runtime-error-sweep.mjs`, all must be green before/after any
change.

## Current state

- HEAD `a277ffd` == `origin/main`. Clean tree, nothing local, nothing
  unpushed.
- Gate re-verified this session at this exact commit: 8888/8888
  dictionary entries, 9/9 grammatical corrections, 0 new
  repository-intelligence violations, **486/486** unit tests, runtime
  sweep 15828/15828 calls, 0 errors.
- Live-verified (not just gate-passed): `translate("it crumbled down")`
  → `"Ua be·gruaha"` (grammar-assembly, 0.82) and
  `translate("hen lays eggs")` → `"do·o Bitchi·chi·a"` (exact-phrase,
  0.98). Both were broken/missing at the top of this session.

## What happened this session

1. Resumed from `docs/CLAUDE_B_SESSION_MIGRATION_20260929.md`, resynced
   (found 2 commits of Claude A drift — content-lane, gate-green, no
   action needed), cloned with a fresh Owner-pasted PAT, scrubbed PAT
   from the remote URL after every push per standing rule.
2. Project Owner relayed new raw Thangseng input (new vocab + answers to
   a standing 4-part relay question batch). Filed verbatim as
   `docs/THANGSENG_RELAY_ANSWERS_20260930.md` — **not processed**,
   correctly left for Claude A (content-lane), per
   `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md`.
3. Corrected that filing once the Project Owner supplied the exact
   original question text, so answers pair with precise questions
   instead of a reconstructed guess.
4. Discussed with the Project Owner how each item could affect the
   engine — grounded in actually reading the relevant engine code, not
   speculation (see "what the discussion found" below).
5. On resync just now: found a **separate, concurrent Claude A session**
   had already processed the whole relay (RULE-051, RULE-052, dictionary
   rows, `-rang` ruling reconciliation) and pushed. Fast-forwarded
   clean, no conflict with Claude B's own two commits. Re-ran the full
   gate against the merged result and live-verified the two new
   translations above.

## What's done vs. held, and why

**Done (this session, Claude B):** filed the raw relay (admin/
bookkeeping, not a content decision); corrected that filing's Q↔A
pairing; resynced and gate-verified twice. No dictionary, grammar-rule,
or engine-code edit made by Claude B this session — correctly, since
everything in scope was either content-lane (Claude A's, and Claude A
did in fact pick it up) or not yet actionable.

**Held, with root cause:**

- **Q3 (adjective position inside a noun phrase)** — genuinely open.
  Thangseng's own words: "I'll send the examples later. Do remind me."
  Root cause: no data yet, not a processing gap. Needs a reminder relay,
  not a new question.
- **General `-rang` plural generation at engine level** — new Claude B
  scope, explicitly unblocked but **not implemented**. Root cause: the
  2026-08-25 ruling correctly refused to generalize from 3 data points;
  Thangseng's 2026-09-30 direct answer ("Yes — any countable noun")
  reversed that, but implementing a `pluralize()` composition step (most
  likely at `assembleSentenceSOV`'s pluralization fallback, per
  `docs/CLAUDE_A_RANG_PLURAL_RULING_20260825.md`'s own note) is new work
  nobody has started. The exact surface form for uncited nouns
  (vowel/consonant-final alternation, if any) is also still unproven —
  only 3 citations exist, all simple `+rang` with no visible alternation.
- **RULE-052 (adverb+verb)** — documented, P2, single data point. Not
  wired into the engine. Root cause: by design — same evidentiary bar as
  RULE-047, the project doesn't generalize a composition rule off one
  example; needs a second independent adverb/verb pair before it's worth
  building engine support for.
- **mang/king raka-dot, dictionary vs. classifier mismatch** — long-
  running, unrelated to this session's relay. `src/garo_classifier.js`
  currently has both `mang` and `king` as `dot:true` (4th and 2nd
  reversal respectively, both direct same-session Project Owner
  citations, `ca8e542`), but 37 `mang` rows and 10 `king` rows in
  `master_dictionary.json` still ship the pre-reversal (dot-free/dotted,
  opposite) literal string, unedited. Root cause: this is a large,
  explicit data-correction pass flagged in the code comments themselves
  as out of scope for a mechanical engine fix — tracked at
  `docs/GRAMMAR_RULE_AUDIT_AND_ROADMAP_20260928.md` Phase 2, not started.

## Standing rules (carried forward, unchanged)

- Content-lane changes (dictionary, grammar rules) require Claude A, an
  Owner directive, or an explicit one-time exception — never assumed by
  Claude B.
- Never infer/generalize from an accumulation of individually-cited
  examples; a rule needs either a direct general answer or enough
  independent data points per the project's own precedent (RULE-047/052
  pattern).
- PAT: always Owner-pasted fresh each session, never reused/persisted,
  scrubbed from the git remote URL immediately after every push.
- Gate (5 steps above) must be green before trusting any state and
  re-verified after any merge/fast-forward, not assumed from a commit
  message.
- Always `git fetch` + compare before push; never force-push; flag,
  don't silently resolve, cross-lane conflicts (e.g. the mang/king
  dictionary-vs-classifier mismatch) without a direct citation.
- Token discipline: no filler, no restating requests, lead with results;
  don't re-verify what's already confirmed unchanged.

## Exact next step

No blocking work. Options, Project Owner's call:
1. Send Q3's reminder to Thangseng (adjective position examples).
2. Start the `-rang` general-plural engine implementation (now
   unblocked, Claude B scope).
3. Continue `docs/GRAMMAR_RULE_AUDIT_AND_ROADMAP_20260928.md` Phase 2
   (mang/king dictionary data-correction pass).
